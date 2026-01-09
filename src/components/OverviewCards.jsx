const OverviewCards = ({ overview }) => {
  if (!overview) return null;
  const statusMap = overview.statusBreakdown?.reduce((acc, cur) => {
    acc[cur.status] = cur.total;
    return acc;
  }, {}) || {};

  return (
    <div className="overview-grid">
      <div className="card overview-card highlighted">
        <p className="label">Beds Occupied</p>
        <p className="metric">{overview.occupied}</p>
        <p className="subtext">
          of {overview.totalBeds} ({overview.available} available)
        </p>
      </div>
      {['Stable', 'Warning', 'Critical'].map((status) => (
        <div className="card overview-card" key={status}>
          <p className="label">{status} Patients</p>
          <p className="metric">{statusMap[status] || 0}</p>
          <p className="subtext">Current status mix</p>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;

