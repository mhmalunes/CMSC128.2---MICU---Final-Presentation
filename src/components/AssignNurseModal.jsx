import { useEffect, useState } from 'react';

const AssignNurseModal = ({ open, onClose, nurses = [], patient, onSubmit, loading }) => {
  const [selected, setSelected] = useState('');

  useEffect(() => {
    setSelected(patient?.assignedNurseId || '');
  }, [patient]);

  if (!open || !patient) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(selected);
  };

  return (
    <div className="modal-backdrop">
      <div className="card modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h3>Assign Nurse</h3>
        <p>Select the nurse who will handle {patient.name}.</p>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Nurse
            <select className="input" value={selected} onChange={(e) => setSelected(e.target.value)} required>
              <option value="">-- Select a nurse --</option>
              {nurses.map((nurse) => (
                <option key={nurse.id} value={nurse.id}>
                  {nurse.fullName}
                </option>
              ))}
            </select>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Assigning...' : 'Assign Nurse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignNurseModal;


