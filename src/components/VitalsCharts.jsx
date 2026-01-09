import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

const formatData = (records) =>
  records
    .map((record) => ({
      time: new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: Number(record.data.temperature) || null,
      heartRate: Number(record.data.heartRate || record.data.pulseRate) || null,
      respRate: Number(record.data.respRate) || null,
      systolic: Number(record.data.bpSystolic) || null,
      diastolic: Number(record.data.bpDiastolic) || null,
      map: Number(record.data.map) || null,
      spo2: Number(record.data.spo2) || null,
      gcsTotal: Number(record.data.gcsTotal) || null,
      gcsEye: Number(record.data.gcsEye) || null,
      gcsVerbal: Number(record.data.gcsVerbal) || null,
      gcsMotor: Number(record.data.gcsMotor) || null,
      sedationScore: record.data.sedationScore || null,
      analgesiaScore: Number(record.data.analgesiaScore) || null
    }))
    .reverse();

const chartConfigs = [
  {
    key: 'temperature',
    label: 'Temperature (°C)',
    color: '#e85c4a'
  },
  {
    key: 'heartRate',
    label: 'Heart Rate (bpm)',
    color: '#c23730'
  },
  {
    key: 'respRate',
    label: 'Respiratory Rate (breaths/min)',
    color: '#f2a33c'
  }
];

const VitalsCharts = ({ records }) => {
  const data = formatData(records);

  if (!records.length) return null;

  return (
    <div className="card vitals-chart-card">
      <h3>Vital Trends</h3>
      <div className="vitals-charts-grid">
        {chartConfigs.map((cfg) => (
          <div key={cfg.key} className="chart-wrapper">
            <p className="chart-label">{cfg.label}</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey={cfg.key} stroke={cfg.color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
        <div className="chart-wrapper full-width">
          <p className="chart-label">Blood Pressure (mmHg)</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="systolic" name="Systolic" stroke="#b32234" strokeWidth={2} />
              <Line type="monotone" dataKey="diastolic" name="Diastolic" stroke="#f2a33c" strokeWidth={2} />
              <Line type="monotone" dataKey="map" name="MAP" stroke="#8b4513" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-wrapper">
          <p className="chart-label">SpO₂ (%)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[85, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="spo2" stroke="#4a90e2" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-wrapper full-width">
          <p className="chart-label">Glasgow Coma Scale</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 15]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="gcsTotal" name="GCS Total" stroke="#9b59b6" strokeWidth={2} />
              <Line type="monotone" dataKey="gcsEye" name="Eye" stroke="#3498db" strokeWidth={2} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="gcsVerbal" name="Verbal" stroke="#e74c3c" strokeWidth={2} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="gcsMotor" name="Motor" stroke="#2ecc71" strokeWidth={2} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default VitalsCharts;

