import { useEffect, useState } from 'react';

const AccessCodeModal = ({ open, onClose, onSubmit, loading, error }) => {
  const [code, setCode] = useState('');

  useEffect(() => {
    if (!open) {
      setCode('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(code);
  };

  return (
    <div className="modal-backdrop">
      <div className="card modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h3>Authentication Required</h3>
        <p>Enter the 4-digit access code provided by the administrator.</p>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Enter access code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
          />
          {error && <p className="error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Checking...' : 'Authenticate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccessCodeModal;

