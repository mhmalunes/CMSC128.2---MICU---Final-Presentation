import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../api/client.js';
import OverviewCards from '../components/OverviewCards.jsx';
import PatientCard from '../components/PatientCard.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';
import AssignNurseModal from '../components/AssignNurseModal.jsx';

const initialPatient = {
  hospitalId: '',
  name: '',
  bedNumber: '',
  status: 'Stable',
  age: '',
  sex: 'Male',
  weight: '',
  height: '',
  admissionDate: '',
  condition: '',
  assignedNurseId: '',
  assignedDoctorId: '',
  code: ''
};

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [patientForm, setPatientForm] = useState(initialPatient);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [assignState, setAssignState] = useState({ open: false, patient: null, submitting: false });

  const overviewQuery = useQuery({
    queryKey: ['overview'],
    queryFn: () => apiRequest('/api/overview')
  });

  const patientsQuery = useQuery({
    queryKey: ['patients'],
    queryFn: () => apiRequest('/api/patients')
  });

  const nursesQuery = useQuery({
    queryKey: ['nurses'],
    queryFn: () => apiRequest('/api/users', { params: { role: 'nurse' } })
  });

  const doctorsQuery = useQuery({
    queryKey: ['doctors'],
    queryFn: () => apiRequest('/api/users', { params: { role: 'doctor' } })
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...patientForm,
        assignedNurseId: patientForm.assignedNurseId ? Number(patientForm.assignedNurseId) : null,
        assignedDoctorId: patientForm.assignedDoctorId ? Number(patientForm.assignedDoctorId) : null
      };
      await apiRequest('/api/patients', { method: 'POST', data: payload });
      setPatientForm(initialPatient);
      patientsQuery.refetch();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAssignClick = (patient) => {
    setAssignState({ open: true, patient, submitting: false });
  };

  const closeAssignModal = () => setAssignState({ open: false, patient: null, submitting: false });

  const handleAssignSubmit = async (nurseId) => {
    if (!assignState.patient) return;
    setAssignState((prev) => ({ ...prev, submitting: true }));
    try {
      await apiRequest(`/api/patients/${assignState.patient.id}`, {
        method: 'PUT',
        data: { assignedNurseId: nurseId ? Number(nurseId) : null }
      });
      patientsQuery.refetch();
      closeAssignModal();
    } catch (err) {
      alert(err.message);
      setAssignState((prev) => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="page dashboard">
      <header className="dashboard-header">
        <div>
          <p className="label">Medical Intensive Care Unit</p>
          <h1>Admin Control Center</h1>
        </div>
        <div className="header-actions">
          <span>{user?.fullName}</span>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <OverviewCards overview={overviewQuery.data} />

      <section className="admin-grid">
        <div className="card">
          <h2>Add Patient</h2>
          <p className="muted">
            Admins can onboard new patients, assign beds, nurses, doctors, and provide an access code that grants nurses
            permission to file the MICU record.
          </p>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Full Name*
                <input
                  className="input"
                  value={patientForm.name}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </label>
              <label>
                MRN
                <input
                  className="input"
                  value={patientForm.hospitalId}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, hospitalId: e.target.value }))}
                />
              </label>
              <label>
                Bed Number*
                <input
                  className="input"
                  value={patientForm.bedNumber}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, bedNumber: e.target.value }))}
                  required
                />
              </label>
              <label>
                Condition
                <input
                  className="input"
                  value={patientForm.condition}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, condition: e.target.value }))}
                />
              </label>
              <label>
                Age
                <input
                  className="input"
                  type="number"
                  value={patientForm.age}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, age: e.target.value }))}
                />
              </label>
              <label>
                Sex
                <select
                  className="input"
                  value={patientForm.sex}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, sex: e.target.value }))}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>
              <label>
                Weight (kg)
                <input
                  className="input"
                  type="number"
                  value={patientForm.weight}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, weight: e.target.value }))}
                />
              </label>
              <label>
                Height (cm)
                <input
                  className="input"
                  type="number"
                  value={patientForm.height}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, height: e.target.value }))}
                />
              </label>
              <label>
                Admission Date
                <input
                  className="input"
                  type="date"
                  value={patientForm.admissionDate}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, admissionDate: e.target.value }))}
                />
              </label>
              <label>
                Status
                <select
                  className="input"
                  value={patientForm.status}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Stable">Stable</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                </select>
              </label>
              <label>
                Assign Nurse
                <select
                  className="input"
                  value={patientForm.assignedNurseId}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, assignedNurseId: e.target.value }))}
                >
                  <option value="">--</option>
                  {nursesQuery.data?.map((nurse) => (
                    <option key={nurse.id} value={nurse.id}>
                      {nurse.fullName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Assign Doctor
                <select
                  className="input"
                  value={patientForm.assignedDoctorId}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, assignedDoctorId: e.target.value }))}
                >
                  <option value="">--</option>
                  {doctorsQuery.data?.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.fullName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Nurse Access Code*
                <input
                  className="input"
                  value={patientForm.code}
                  onChange={(e) => setPatientForm((prev) => ({ ...prev, code: e.target.value }))}
                  required
                  maxLength={6}
                  placeholder="e.g. 1234"
                />
              </label>
            </div>
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Create Patient'}
            </button>
          </form>
        </div>
        <div>
          <h2>Active Patients</h2>
          <div className="patient-list">
            {patientsQuery.data?.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                actionLabel={patient.assignedNurseId ? 'Reassign Nurse' : 'Assign Nurse'}
                onAction={handleAssignClick}
              />
            ))}
          </div>
        </div>
      </section>
      <AssignNurseModal
        open={assignState.open}
        patient={assignState.patient}
        nurses={nursesQuery.data || []}
        loading={assignState.submitting}
        onClose={closeAssignModal}
        onSubmit={handleAssignSubmit}
      />
    </div>
  );
};

export default AdminDashboard;

