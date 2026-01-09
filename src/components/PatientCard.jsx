import clsx from 'clsx';
import { Link } from 'react-router-dom';

const statusColor = {
  Stable: 'status-stable',
  Warning: 'status-warning',
  Critical: 'status-critical'
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
};

const PatientCard = ({ patient, actionLabel = 'View', to, onAction }) => {
  const detailItems = [
    { label: 'Age', value: patient.age ? `${patient.age} years` : '—' },
    { label: 'Sex', value: patient.sex || '—' },
    { label: 'Weight', value: patient.weight ? `${patient.weight} kg` : '—' },
    { label: 'Admitted', value: formatDate(patient.admissionDate) },
    { label: 'Doctor', value: patient.doctorName || 'Dr. —' },
    { label: 'Condition', value: patient.condition || '—' }
  ];

  return (
    <div className="patient-card">
      <div className="patient-card__header">
        <div>
          <p className="patient-card__name">{patient.name}</p>
          <p className="patient-card__bed">{patient.bedNumber || '—'}</p>
        </div>
        <div className="patient-card__status">
          <p className="patient-card__mrn">{patient.hospitalId || '—'}</p>
          <span className={clsx('status-pill', statusColor[patient.status] || 'status-stable')}>
            {patient.status}
          </span>
        </div>
      </div>
      <div className="patient-card__body">
        {detailItems.map((item) => (
          <div key={item.label} className="patient-detail">
            <span className="detail-label">{item.label}:</span>
            <span className="detail-value">{item.value}</span>
          </div>
        ))}
      </div>
      <div className="patient-card__footer">
        {to ? (
          <Link to={to} className="btn btn-add">
            {actionLabel || 'ADD'}
          </Link>
        ) : (
          <button className="btn btn-add" onClick={() => onAction?.(patient)}>
            {actionLabel || 'ADD'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientCard;

