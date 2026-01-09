import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../micu.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export const initDb = () => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin','nurse','doctor')),
      fullName TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hospitalId TEXT,
      name TEXT NOT NULL,
      bedNumber TEXT NOT NULL,
      status TEXT DEFAULT 'Stable',
      age INTEGER,
      sex TEXT,
      weight REAL,
      height REAL,
      admissionDate TEXT,
      condition TEXT,
      assignedNurseId INTEGER,
      assignedDoctorId INTEGER,
      authCode TEXT NOT NULL,
      -- Additional HI271 patient-level fields stored as JSON for flexibility
      hi271Data TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assignedNurseId) REFERENCES users(id),
      FOREIGN KEY (assignedDoctorId) REFERENCES users(id)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS patient_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId INTEGER NOT NULL,
      section TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      data TEXT NOT NULL,
      status TEXT DEFAULT 'submitted',
      recordedBy INTEGER NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patientId) REFERENCES patients(id),
      FOREIGN KEY (recordedBy) REFERENCES users(id)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS doctor_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId INTEGER NOT NULL,
      doctorId INTEGER NOT NULL,
      note TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patientId) REFERENCES patients(id),
      FOREIGN KEY (doctorId) REFERENCES users(id)
    )
  `).run();

  db.prepare(`
    CREATE TRIGGER IF NOT EXISTS patients_updated_at
    AFTER UPDATE ON patients
    FOR EACH ROW
    BEGIN
      UPDATE patients SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
  `).run();

  db.prepare(`
    CREATE TRIGGER IF NOT EXISTS patient_records_updated_at
    AFTER UPDATE ON patient_records
    FOR EACH ROW
    BEGIN
      UPDATE patient_records SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
  `).run();

  db.prepare(`
    CREATE TRIGGER IF NOT EXISTS doctor_notes_updated_at
    AFTER UPDATE ON doctor_notes
    FOR EACH ROW
    BEGIN
      UPDATE doctor_notes SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
  `).run();
};

export default db;

