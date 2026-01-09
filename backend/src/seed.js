import bcrypt from 'bcryptjs';
import db, { initDb } from './db.js';

const seed = async () => {
  initDb();

  db.prepare('DELETE FROM patient_records').run();
  db.prepare('DELETE FROM doctor_notes').run();
  db.prepare('DELETE FROM patients').run();
  db.prepare('DELETE FROM users').run();

  const insertUser = db.prepare(`
    INSERT INTO users (username, password, role, fullName)
    VALUES (@username, @password, @role, @fullName)
  `);

  const adminId = insertUser.run({
    username: 'admin',
    password: bcrypt.hashSync('Admin123!', 10),
    role: 'admin',
    fullName: 'System Admin'
  }).lastInsertRowid;

  const nurseId = insertUser.run({
    username: 'nurse',
    password: bcrypt.hashSync('Nurse123!', 10),
    role: 'nurse',
    fullName: 'Nurse Dela Cruz'
  }).lastInsertRowid;

  const doctorId = insertUser.run({
    username: 'doctor',
    password: bcrypt.hashSync('Doctor123!', 10),
    role: 'doctor',
    fullName: 'Dr. Smith'
  }).lastInsertRowid;

  const insertPatient = db.prepare(`
    INSERT INTO patients (
      hospitalId, name, bedNumber, status, age, sex, weight, height,
      admissionDate, condition, assignedNurseId, assignedDoctorId, authCode
    ) VALUES (@hospitalId, @name, @bedNumber, @status, @age, @sex, @weight, @height,
      @admissionDate, @condition, @assignedNurseId, @assignedDoctorId, @authCode)
  `);

  const samplePatients = [
    {
      hospitalId: '54382341',
      name: 'Juan Dela Cruz',
      bedNumber: 'Bed A-12',
      status: 'Stable',
      age: 34,
      sex: 'Female',
      weight: 68,
      height: 165,
      admissionDate: '2025-05-28',
      condition: 'Pneumonia',
      assignedNurseId: nurseId,
      assignedDoctorId: doctorId,
      authCode: bcrypt.hashSync('1234', 10)
    },
    {
      hospitalId: '54381210',
      name: 'Maria Santos',
      bedNumber: 'Bed B-08',
      status: 'Critical',
      age: 45,
      sex: 'Female',
      weight: 72,
      height: 160,
      admissionDate: '2025-05-22',
      condition: 'Sepsis',
      assignedNurseId: nurseId,
      assignedDoctorId: doctorId,
      authCode: bcrypt.hashSync('5678', 10)
    }
  ];

  samplePatients.forEach(patient => insertPatient.run(patient));

  console.log('Database seeded with demo users and patients.');
};

seed().catch(err => {
  console.error('Failed to seed database', err);
  process.exit(1);
}).finally(() => {
  db.close();
});

