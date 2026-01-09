const RecordTable = ({ columns = [], records = [], onEdit, onDelete }) => {
  if (!records.length) {
    return <p className="muted">No entries for this timeframe yet.</p>;
  }

  const renderCell = (record, column) => {
    if (column.formatter) return column.formatter({ ...record.data, timestamp: record.timestamp });
    if (column.key === 'timestamp') return new Date(record.timestamp).toLocaleString();
    return record.data?.[column.key] ?? '—';
  };

  return (
    <div className="record-table-wrapper">
      <table className="record-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              {columns.map((column) => (
                <td key={`${record.id}-${column.key}`}>{renderCell(record, column)}</td>
              ))}
              <td className="table-actions">
                {onEdit && (
                  <button className="table-btn" onClick={() => onEdit(record)}>
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button className="table-btn danger" onClick={() => onDelete(record)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordTable;

