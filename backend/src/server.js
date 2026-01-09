import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import db, { initDb } from './db.js';

dotenv.config();
initDb();

const TOTAL_BEDS = 84;
const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const generateToken = user =>
  jwt.sign({ id: user.id, role: user.role, fullName: user.fullName }, process.env.JWT_SECRET, {
    expiresIn: '12h'
  });

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Missing authorization header' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Insufficient privileges' });
  }
  next();
};

const fetchPatient = (id) => {
  return db
    .prepare(
      `SELECT p.*, n.fullName AS nurseName, d.fullName AS doctorName
       FROM patients p
       LEFT JOIN users n ON p.assignedNurseId = n.id
       LEFT JOIN users d ON p.assignedDoctorId = d.id
       WHERE p.id = ?`
    )
    .get(id);
};

const formatPatient = (patient) => {
  if (!patient) return null;
  return {
    id: patient.id,
    hospitalId: patient.hospitalId,
    name: patient.name,
    bedNumber: patient.bedNumber,
    status: patient.status,
    age: patient.age,
    sex: patient.sex,
    weight: patient.weight,
    height: patient.height,
    admissionDate: patient.admissionDate,
    condition: patient.condition,
    assignedNurseId: patient.assignedNurseId,
    assignedDoctorId: patient.assignedDoctorId,
    nurseName: patient.nurseName,
    doctorName: patient.doctorName,
    hi271Data: patient.hi271Data ? JSON.parse(patient.hi271Data) : null,
    createdAt: patient.createdAt,
    updatedAt: patient.updatedAt
  };
};

const verifyPatientCode = (patient, code) => {
  if (!code) return false;
  return bcrypt.compareSync(code, patient.authCode);
};

app.get('/', (_, res) => {
  res.json({ status: 'MICU API ready' });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = generateToken(user);
  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role, fullName: user.fullName }
  });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const user = db.prepare('SELECT id, username, role, fullName FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

app.get('/api/overview', authenticate, (req, res) => {
  const counts = db
    .prepare(
      `SELECT status, COUNT(*) as total
       FROM patients
       GROUP BY status`
    )
    .all();
  const occupied = db.prepare('SELECT COUNT(*) as total FROM patients').get().total;
  res.json({
    totalBeds: TOTAL_BEDS,
    occupied,
    available: TOTAL_BEDS - occupied,
    statusBreakdown: counts
  });
});

app.get('/api/users', authenticate, authorize('admin'), (req, res) => {
  const { role } = req.query;
  const users = db
    .prepare('SELECT id, fullName, role FROM users WHERE (@role IS NULL OR role = @role)')
    .all({ role: role || null });
  res.json(users);
});

app.get('/api/patients', authenticate, (req, res) => {
  const { search = '', status, assignedOnly } = req.query;
  let whereClause = 'WHERE 1=1';
  const params = { search: `%${search}%` };
  const restrictToAssignment = assignedOnly === 'true';

  if (status) {
    whereClause += ' AND p.status = @status';
    params.status = status;
  }

  if (restrictToAssignment) {
    if (req.user.role === 'nurse') {
      whereClause += ' AND p.assignedNurseId = @userId';
      params.userId = req.user.id;
    } else if (req.user.role === 'doctor') {
      whereClause += ' AND p.assignedDoctorId = @userId';
      params.userId = req.user.id;
    }
  }

  const rows = db
    .prepare(
      `SELECT p.*, n.fullName AS nurseName, d.fullName AS doctorName
       FROM patients p
       LEFT JOIN users n ON p.assignedNurseId = n.id
       LEFT JOIN users d ON p.assignedDoctorId = d.id
       ${whereClause}
       AND (p.name LIKE @search OR p.bedNumber LIKE @search OR p.condition LIKE @search OR p.hospitalId LIKE @search)
       ORDER BY p.createdAt DESC`
    )
    .all(params);

  res.json(rows.map(formatPatient));
});

app.get('/api/patients/:id', authenticate, (req, res) => {
  const patient = fetchPatient(req.params.id);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });

  if (req.user.role === 'nurse' && patient.assignedNurseId !== req.user.id) {
    return res.status(403).json({ message: 'Not assigned to this patient' });
  }

  if (req.user.role === 'doctor' && patient.assignedDoctorId !== req.user.id) {
    return res.status(403).json({ message: 'Not assigned to this patient' });
  }

  res.json(formatPatient(patient));
});

app.post('/api/patients', authenticate, authorize('admin'), (req, res) => {
  const {
    hospitalId,
    name,
    bedNumber,
    status = 'Stable',
    age,
    sex,
    weight,
    height,
    admissionDate,
    condition,
    assignedNurseId,
    assignedDoctorId,
    code,
    hi271Data
  } = req.body;

  if (!name || !bedNumber || !code) {
    return res.status(400).json({ message: 'Name, bed number and code are required' });
  }

  const stmt = db.prepare(`
    INSERT INTO patients (
      hospitalId, name, bedNumber, status, age, sex, weight, height, admissionDate,
      condition, assignedNurseId, assignedDoctorId, authCode, hi271Data
    ) VALUES (
      @hospitalId, @name, @bedNumber, @status, @age, @sex, @weight, @height, @admissionDate,
      @condition, @assignedNurseId, @assignedDoctorId, @authCode, @hi271Data
    )
  `);

  const result = stmt.run({
    hospitalId,
    name,
    bedNumber,
    status,
    age,
    sex,
    weight,
    height,
    admissionDate,
    condition,
    assignedNurseId,
    assignedDoctorId,
    authCode: bcrypt.hashSync(code, 10),
    hi271Data: hi271Data ? JSON.stringify(hi271Data) : null
  });

  const patient = fetchPatient(result.lastInsertRowid);
  res.status(201).json(formatPatient(patient));
});

app.put('/api/patients/:id', authenticate, authorize('admin'), (req, res) => {
  const existing = fetchPatient(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Patient not found' });

  const updates = {
    hospitalId: req.body.hospitalId ?? existing.hospitalId,
    name: req.body.name ?? existing.name,
    bedNumber: req.body.bedNumber ?? existing.bedNumber,
    status: req.body.status ?? existing.status,
    age: req.body.age ?? existing.age,
    sex: req.body.sex ?? existing.sex,
    weight: req.body.weight ?? existing.weight,
    height: req.body.height ?? existing.height,
    admissionDate: req.body.admissionDate ?? existing.admissionDate,
    condition: req.body.condition ?? existing.condition,
    assignedNurseId: req.body.assignedNurseId ?? existing.assignedNurseId,
    assignedDoctorId: req.body.assignedDoctorId ?? existing.assignedDoctorId,
    hi271Data: req.body.hi271Data !== undefined 
      ? (req.body.hi271Data ? JSON.stringify(req.body.hi271Data) : null)
      : existing.hi271Data
  };

  db.prepare(
    `UPDATE patients
     SET hospitalId=@hospitalId, name=@name, bedNumber=@bedNumber, status=@status,
         age=@age, sex=@sex, weight=@weight, height=@height, admissionDate=@admissionDate,
         condition=@condition, assignedNurseId=@assignedNurseId, assignedDoctorId=@assignedDoctorId,
         hi271Data=@hi271Data
     WHERE id=@id`
  ).run({ ...updates, id: req.params.id });

  if (req.body.code) {
    db.prepare(`UPDATE patients SET authCode=@authCode WHERE id=@id`).run({
      authCode: bcrypt.hashSync(req.body.code, 10),
      id: req.params.id
    });
  }

  res.json(formatPatient(fetchPatient(req.params.id)));
});

app.post('/api/patients/:id/verify-code', authenticate, (req, res) => {
  const patient = fetchPatient(req.params.id);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  const { code } = req.body;
  if (!code) return res.status(400).json({ message: 'Code is required' });
  const valid = verifyPatientCode(patient, code);
  res.json({ valid });
});

const recordsSelect = `
  SELECT pr.*, u.fullName AS recordedByName
  FROM patient_records pr
  LEFT JOIN users u ON pr.recordedBy = u.id
  WHERE pr.patientId = @patientId
`;

app.get('/api/patients/:id/records', authenticate, (req, res) => {
  const patient = fetchPatient(req.params.id);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  if (req.user.role === 'nurse' && patient.assignedNurseId !== req.user.id) {
    return res.status(403).json({ message: 'Not assigned to this patient' });
  }
  if (req.user.role === 'doctor' && patient.assignedDoctorId !== req.user.id) {
    return res.status(403).json({ message: 'Not assigned to this patient' });
  }

  const { section, hour } = req.query;
  let query = recordsSelect + ' AND 1=1';
  const params = { patientId: patient.id };

  if (section) {
    query += ' AND pr.section = @section';
    params.section = section;
  }
  if (hour) {
    query += ' AND CAST(strftime(\'%H\', pr.timestamp) AS INTEGER) = @hour';
    params.hour = Number(hour);
  }

  query += ' ORDER BY pr.timestamp DESC';
  const rows = db.prepare(query).all(params);
  res.json(
    rows.map((row) => ({
      id: row.id,
      section: row.section,
      timestamp: row.timestamp,
      status: row.status,
      data: JSON.parse(row.data),
      recordedBy: {
        id: row.recordedBy,
        name: row.recordedByName
      }
    }))
  );
});

const requireAssignment = (patient, user) => {
  if (user.role === 'nurse' && patient.assignedNurseId !== user.id) {
    return false;
  }
  if (user.role === 'doctor' && patient.assignedDoctorId !== user.id) {
    return false;
  }
  return true;
};

app.post('/api/patients/:id/records', authenticate, (req, res) => {
  const patient = fetchPatient(req.params.id);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  if (!requireAssignment(patient, req.user) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not assigned to this patient' });
  }

  const { section, data, timestamp, status = 'submitted', code } = req.body;
  if (!section || !data) {
    return res.status(400).json({ message: 'Section and data are required' });
  }

  const nurseSections = [
    'vitals',
    'medications',
    'intake_output',
    'ventilator',
    'procedures_lines',
    'labs_imaging',
    'clinical_notes'
  ];

  if (nurseSections.includes(section)) {
    if (!verifyPatientCode(patient, code || '')) {
      return res.status(401).json({ message: 'Invalid patient access code' });
    }
  }

  if (section === 'doctor_notes' && req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Only doctors can add doctor notes' });
  }

  const stmt = db.prepare(`
    INSERT INTO patient_records (patientId, section, timestamp, data, status, recordedBy)
    VALUES (@patientId, @section, @timestamp, @data, @status, @recordedBy)
  `);

  const result = stmt.run({
    patientId: patient.id,
    section,
    timestamp: timestamp || dayjs().toISOString(),
    data: JSON.stringify(data),
    status,
    recordedBy: req.user.id
  });

  const inserted = db
    .prepare(`${recordsSelect} AND pr.id = @id`)
    .get({ patientId: patient.id, id: result.lastInsertRowid });

  res.status(201).json({
    id: inserted.id,
    section: inserted.section,
    timestamp: inserted.timestamp,
    status: inserted.status,
    data: JSON.parse(inserted.data),
    recordedBy: { id: inserted.recordedBy, name: inserted.recordedByName }
  });
});

app.put('/api/patients/:patientId/records/:recordId', authenticate, (req, res) => {
  const patient = fetchPatient(req.params.patientId);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  if (!requireAssignment(patient, req.user) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not assigned to this patient' });
  }

  const record = db
    .prepare('SELECT * FROM patient_records WHERE id = ? AND patientId = ?')
    .get(req.params.recordId, patient.id);
  if (!record) return res.status(404).json({ message: 'Record not found' });

  const nurseSections = [
    'vitals',
    'medications',
    'intake_output',
    'ventilator',
    'procedures_lines',
    'labs_imaging',
    'clinical_notes'
  ];

  if (nurseSections.includes(record.section)) {
    if (!verifyPatientCode(patient, req.body.code || '')) {
      return res.status(401).json({ message: 'Invalid patient access code' });
    }
  }

  if (record.section === 'doctor_notes' && req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Only doctors can modify their notes' });
  }

  db.prepare(
    `UPDATE patient_records
     SET data = @data, status = @status, timestamp = @timestamp
     WHERE id = @id`
  ).run({
    id: record.id,
    data: JSON.stringify(req.body.data ?? JSON.parse(record.data)),
    status: req.body.status ?? record.status,
    timestamp: req.body.timestamp ?? record.timestamp
  });

  const updated = db
    .prepare(`${recordsSelect} AND pr.id = @id`)
    .get({ patientId: patient.id, id: record.id });

  res.json({
    id: updated.id,
    section: updated.section,
    timestamp: updated.timestamp,
    status: updated.status,
    data: JSON.parse(updated.data),
    recordedBy: { id: updated.recordedBy, name: updated.recordedByName }
  });
});

app.delete('/api/patients/:patientId/records/:recordId', authenticate, (req, res) => {
  const patient = fetchPatient(req.params.patientId);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  if (!requireAssignment(patient, req.user) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not assigned to this patient' });
  }

  const record = db
    .prepare('SELECT * FROM patient_records WHERE id = ? AND patientId = ?')
    .get(req.params.recordId, patient.id);
  if (!record) return res.status(404).json({ message: 'Record not found' });

  const nurseSections = [
    'vitals',
    'medications',
    'intake_output',
    'ventilator',
    'procedures_lines',
    'labs_imaging',
    'clinical_notes'
  ];
  if (nurseSections.includes(record.section)) {
    if (!verifyPatientCode(patient, req.body?.code || '')) {
      return res.status(401).json({ message: 'Invalid patient access code' });
    }
  }
  if (record.section === 'doctor_notes' && req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Only doctors can delete their notes' });
  }

  db.prepare('DELETE FROM patient_records WHERE id = ?').run(record.id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`MICU API listening on http://localhost:${PORT}`);
});

