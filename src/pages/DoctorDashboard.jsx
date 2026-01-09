import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../api/client.js';
import PatientCard from '../components/PatientCard.jsx';
import OverviewCards from '../components/OverviewCards.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';

const DoctorDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const overviewQuery = useQuery({
    queryKey: ['overview'],
    queryFn: () => apiRequest('/api/overview')
  });

  const patientsQuery = useQuery({
    queryKey: ['doctor-patients', { search, status }],
    queryFn: () =>
      apiRequest('/api/patients', {
        params: { search: search || undefined, status: status || undefined }
      })
  });

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
  };

  return (
    <div className="page dashboard">
      <header className="dashboard-header">
        <div>
          <p className="label">Overview</p>
          <h1 className="dashboard-title">OVERVIEW</h1>
        </div>
        <div className="header-actions">
          <span>{user?.fullName}</span>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <OverviewCards overview={overviewQuery.data} />

      <section className="patient-list-section">
        <div className="card patient-list-panel">
          <div className="patient-list-heading">
            <h2 className="section-heading-caps">PATIENT LIST</h2>
          </div>
          <div className="patient-list-controls">
            <div className="search-wrapper">
              <input
                className="input search-input"
                placeholder="Search patients by name, bed, condition, or doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="status-filter">
              <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="Stable">Stable</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
              </select>
              <button className="btn btn-clear" onClick={clearFilters}>
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="patient-list">
        {patientsQuery.data?.length ? (
          patientsQuery.data.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              actionLabel="ADD"
              to={`/doctor/patients/${patient.id}`}
            />
          ))
        ) : (
          <p className="muted">No patients assigned yet.</p>
        )}
        </div>
      </section>
    </div>
  );
};

export default DoctorDashboard;


