import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import RecordTable from './RecordTable.jsx';
import { sectionColumns } from '../config/sections.js';

const emptyFormState = (fields) =>
  fields.reduce((acc, field) => {
    if (field.type === 'checkbox') {
      acc[field.name] = false;
    } else {
      acc[field.name] = '';
    }
    return acc;
  }, {});

const SectionPanel = ({
  definition,
  records = [],
  locked,
  onSubmit,
  onDelete,
  hourFilter,
  titleBadge
}) => {
  const [isOpen, setIsOpen] = useState(Boolean(definition.alwaysOpen));
  const [formData, setFormData] = useState(() => emptyFormState(definition.fields));
  const [editingId, setEditingId] = useState(null);

  const filteredRecords = useMemo(() => {
    if (hourFilter === null || hourFilter === undefined) return records;
    return records.filter((record) => dayjs(record.timestamp).hour() === Number(hourFilter));
  }, [hourFilter, records]);

  const toggle = () => {
    if (definition.alwaysOpen) return;
    setIsOpen((prev) => !prev);
  };

  const resetForm = () => {
    setFormData(emptyFormState(definition.fields));
    setEditingId(null);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setFormData((prev) => {
      const filled = { ...prev };
      Object.entries(record.data || {}).forEach(([key, value]) => {
        const field = definition.fields.find(f => f.name === key);
        if (field?.type === 'checkbox') {
          filled[key] = Boolean(value);
        } else {
          filled[key] = value ?? '';
        }
      });
      return filled;
    });
    if (!isOpen) setIsOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      sectionId: definition.id,
      recordId: editingId,
      data: formData,
      timestamp: formData.date && formData.time ? `${formData.date}T${formData.time}` : undefined,
      onSuccess: resetForm
    });
  };

  const handleDelete = (record) => {
    if (window.confirm('Remove this entry?')) {
      onDelete({ sectionId: definition.id, recordId: record.id });
      if (editingId === record.id) {
        resetForm();
      }
    }
  };

  return (
    <div className="section-panel">
      <button className="section-panel__header" onClick={toggle}>
        <div>
          <p className="section-title">
            {definition.title}
            {titleBadge && <span className="badge">{titleBadge}</span>}
          </p>
          {definition.description && <p className="section-description">{definition.description}</p>}
        </div>
        <div className="section-meta">
          <span>{records.length} entries</span>
          {!definition.alwaysOpen && <span className="chevron">{isOpen ? '▴' : '▾'}</span>}
        </div>
      </button>
      {isOpen && (
        <div className="section-panel__content">
          {locked ? (
            <div className="locked-state">
              <p>This section is locked. Authenticate with the patient code to add entries.</p>
            </div>
          ) : (
            <form className="section-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                {definition.fields.map((field) => (
                  <label key={field.name} className="form-field">
                    <span>
                      {field.label}
                      {field.required && <span className="required">*</span>}
                    </span>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="input textarea"
                        rows={field.rows || 3}
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                        required={field.required}
                        placeholder={field.placeholder}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        className="input"
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                        required={field.required}
                      >
                        <option value="">Select</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'checkbox' ? (
                      <input
                        className="input"
                        type="checkbox"
                        checked={formData[field.name] || false}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.checked }))}
                      />
                    ) : (
                      <input
                        className="input"
                        type={field.type}
                        step={field.step}
                        min={field.min}
                        max={field.max}
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                        required={field.required}
                        readOnly={field.readonly}
                        placeholder={field.placeholder}
                      />
                    )}
                    {field.description && <span className="field-description">{field.description}</span>}
                  </label>
                ))}
              </div>
              <div className="form-actions">
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      resetForm();
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
                <button className="btn btn-primary" type="submit">
                  {editingId ? 'Update Entry' : 'Save Entry'}
                </button>
              </div>
            </form>
          )}
          <RecordTable
            columns={sectionColumns[definition.id]}
            records={filteredRecords}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
};

export default SectionPanel;

