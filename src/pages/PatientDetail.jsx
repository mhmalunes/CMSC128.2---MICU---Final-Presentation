import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { apiRequest } from '../api/client.js';
import { hourOptions, sectionDefinitions } from '../config/sections.js';
import SectionPanel from '../components/SectionPanel.jsx';
import AccessCodeModal from '../components/AccessCodeModal.jsx';
import VitalsCharts from '../components/VitalsCharts.jsx';
import MonitoringSheet24H from '../components/MonitoringSheet24H.jsx';
import NursingActivitiesShiftView from '../components/NursingActivitiesShiftView.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [hourFilter, setHourFilter] = useState('');
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [codeState, setCodeState] = useState({ verified: false, code: '' });
  const [codeError, setCodeError] = useState('');
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'monitoring' or 'activities'

  const isNurse = user?.role === 'nurse';
  const isDoctor = user?.role === 'doctor';

  useEffect(() => {
    setHourFilter('');
    setCodeState({ verified: false, code: '' });
    setCodeError('');
  }, [patientId]);

  const patientQuery = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => apiRequest(`/api/patients/${patientId}`)
  });

  const recordsQuery = useQuery({
    queryKey: ['patient-records', patientId],
    queryFn: () => apiRequest(`/api/patients/${patientId}/records`)
  });

  const groupedRecords = useMemo(() => {
    const groups = {};
    (recordsQuery.data || []).forEach((record) => {
      if (!groups[record.section]) {
        groups[record.section] = [];
      }
      groups[record.section].push(record);
    });
    return groups;
  }, [recordsQuery.data]);

  const activeSections = useMemo(() => {
    if (isDoctor) return sectionDefinitions.filter((section) => section.id === 'doctor_notes');
    if (isNurse) return sectionDefinitions.filter((section) => section.id !== 'doctor_notes');
    return sectionDefinitions;
  }, [isDoctor, isNurse]);

  const recordMutation = useMutation({
    mutationFn: async ({ sectionId, recordId, data, timestamp }) => {
      const needsCode = isNurse && sectionId !== 'doctor_notes';
      if (needsCode && !codeState.verified) {
        throw new Error('Authenticate with the patient access code first.');
      }
      const payload = recordId
        ? {
            data,
            ...(timestamp ? { timestamp } : {})
          }
        : {
            section: sectionId,
            data,
            status: 'submitted',
            ...(timestamp ? { timestamp } : {})
          };
      if (needsCode) {
        payload.code = codeState.code;
      }
      if (recordId) {
        return apiRequest(`/api/patients/${patientId}/records/${recordId}`, {
          method: 'PUT',
          data: payload
        });
      }
      return apiRequest(`/api/patients/${patientId}/records`, {
        method: 'POST',
        data: payload
      });
    },
    onSuccess: (_, variables) => {
      recordsQuery.refetch();
      variables.onSuccess?.();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ sectionId, recordId }) => {
      const needsCode = isNurse && sectionId !== 'doctor_notes';
      const payload = needsCode ? { code: codeState.code } : undefined;
      return apiRequest(`/api/patients/${patientId}/records/${recordId}`, {
        method: 'DELETE',
        data: payload
      });
    },
    onSuccess: () => {
      recordsQuery.refetch();
    }
  });

  const handleSectionSubmit = ({ sectionId, recordId, data, timestamp, onSuccess }) => {
    recordMutation.mutate({ sectionId, recordId, data, timestamp, onSuccess });
  };

  const handleSectionDelete = ({ sectionId, recordId }) => {
    if (isNurse && sectionId !== 'doctor_notes' && !codeState.verified) {
      setCodeModalOpen(true);
      return;
    }
    deleteMutation.mutate({ sectionId, recordId });
  };

  const handleCodeSubmit = async (code) => {
    setVerifyingCode(true);
    setCodeError('');
    try {
      const result = await apiRequest(`/api/patients/${patientId}/verify-code`, {
        method: 'POST',
        data: { code }
      });
      if (!result.valid) {
        setCodeError('Invalid access code. Please try again.');
        return;
      }
      setCodeState({ verified: true, code });
      setCodeModalOpen(false);
    } catch (err) {
      setCodeError(err.message);
    } finally {
      setVerifyingCode(false);
    }
  };

  const patient = patientQuery.data;

  const backLink = isDoctor ? '/doctor' : '/nurse';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page patient-detail">
      <header className="dashboard-header">
        <div>
          <Link to={backLink} className="link">
            ← Back to Dashboard
          </Link>
          <p className="label">Medical Intensive Care Unit</p>
          <h1>{patient ? patient.name : 'Loading patient...'}</h1>
          {patient && (
            <p className="muted">
              Bed {patient.bedNumber} • {patient.condition || 'No primary condition'} • Assigned Doctor:{' '}
              {patient.doctorName || 'TBD'}
            </p>
          )}
        </div>
        <div className="header-actions">
          <span>{user?.fullName}</span>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {patient && (
        <section className="patient-info-grid">
          <div className="card patient-info-card">
            <div className="info-row">
              <div>
                <p className="label">MRN</p>
                <p>{patient.hospitalId || '—'}</p>
              </div>
              <div>
                <p className="label">Age / Sex</p>
                <p>
                  {patient.age || '—'} / {patient.sex || '—'}
                </p>
              </div>
              <div>
                <p className="label">Weight</p>
                <p>{patient.weight ? `${patient.weight} kg` : '—'}</p>
              </div>
              <div>
                <p className="label">Height</p>
                <p>{patient.height ? `${patient.height} cm` : '—'}</p>
              </div>
            </div>
            <div className="info-row">
              <div>
                <p className="label">Admission Date</p>
                <p>{patient.admissionDate ? dayjs(patient.admissionDate).format('MMM DD, YYYY') : '—'}</p>
              </div>
              <div>
                <p className="label">Status</p>
                <span className={`status-pill status-${patient.status?.toLowerCase()}`}>{patient.status}</span>
              </div>
              <div>
                <p className="label">Assigned Nurse</p>
                <p>{patient.nurseName || '—'}</p>
              </div>
              <div className="patient-actions">
                {isNurse && (
                  <button className="btn btn-secondary" onClick={() => setCodeModalOpen(true)}>
                    {codeState.verified ? 'Re-authenticate' : 'Enter Access Code'}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="card view-toggle-card highlighted">
            <p className="label">View Mode</p>
            <div className="view-toggle-buttons">
              <button
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setViewMode('list')}
              >
                List View
              </button>
              <button
                className={`btn ${viewMode === 'monitoring' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setViewMode('monitoring')}
              >
                24-Hour Monitoring
              </button>
              <button
                className={`btn ${viewMode === 'activities' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setViewMode('activities')}
              >
                Activities (Shift View)
              </button>
            </div>
            <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              {viewMode === 'monitoring' && 'View all patient data in a 24-hour monitoring sheet format'}
              {viewMode === 'activities' && (
                <>
                  View nursing activities organized by shift (Morning, Afternoon, Night).
                  <br />
                  <strong>To add activities:</strong> Switch to "List View" → Find "Nursing Activities Checklist" section → Fill form → Save
                </>
              )}
              {viewMode === 'list' && 'View and edit patient records by section. Use this view to add new entries.'}
            </p>
          </div>
          {viewMode === 'list' && (
            <div className="card filter-card">
              <p className="label">Hour View</p>
              <select className="input" value={hourFilter} onChange={(e) => setHourFilter(e.target.value)}>
                <option value="">All hours</option>
                {hourOptions.map((hour) => (
                  <option key={hour.value} value={hour.value}>
                    {hour.label}
                  </option>
                ))}
              </select>
              {hourFilter !== '' && (
                <p className="muted">Showing entries logged at {hourOptions[Number(hourFilter)].label}</p>
              )}
            </div>
          )}
        </section>
      )}

      {viewMode === 'monitoring' ? (
        <MonitoringSheet24H records={recordsQuery.data || []} patient={patientQuery.data} />
      ) : viewMode === 'activities' ? (
        <NursingActivitiesShiftView records={groupedRecords.nursing_activities || []} />
      ) : (
        <>
          <VitalsCharts records={groupedRecords.vitals || []} />

          <div className="sections-stack">
            {activeSections.map((section) => (
              <SectionPanel
                key={section.id}
                definition={section}
                records={groupedRecords[section.id] || []}
                locked={isNurse && section.id !== 'doctor_notes' && !codeState.verified}
                hourFilter={hourFilter === '' ? null : Number(hourFilter)}
                onSubmit={handleSectionSubmit}
                onDelete={handleSectionDelete}
                titleBadge={
                  section.id === 'vitals'
                    ? `${(groupedRecords[section.id] || []).length} entries today`
                    : undefined
                }
              />
            ))}
          </div>
        </>
      )}

      <AccessCodeModal
        open={codeModalOpen}
        onClose={() => {
          setCodeModalOpen(false);
          setCodeError('');
        }}
        onSubmit={handleCodeSubmit}
        loading={verifyingCode}
        error={codeError}
      />
    </div>
  );
};

export default PatientDetail;


