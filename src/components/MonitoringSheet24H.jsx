import { useMemo } from 'react';
import dayjs from 'dayjs';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Helper function to safely convert to number
const toNumber = (val) => {
  if (val === null || val === undefined || val === '') return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
};

const MonitoringSheet24H = ({ records, patient }) => {
  // Group records by section
  const groupedRecords = useMemo(() => {
    const groups = {};
    (records || []).forEach((record) => {
      if (!groups[record.section]) {
        groups[record.section] = [];
      }
      groups[record.section].push(record);
    });
    return groups;
  }, [records]);

  // Get the date from records or use today
  const recordDate = useMemo(() => {
    if (records && records.length > 0) {
      return dayjs(records[0].timestamp).startOf('day');
    }
    return dayjs().startOf('day');
  }, [records]);

  // Process vital signs data for charting - show all entries
  const vitalsData = useMemo(() => {
    const vitals = groupedRecords.vitals || [];
    const neurological = groupedRecords.neurological || [];
    
    // Get all records and group by hour, but show all entries
    const allRecords = [];
    
    // Process vitals records
    vitals.forEach((record) => {
      const recordTime = dayjs(record.timestamp);
      const hour = recordTime.hour();
      const minute = recordTime.minute();
      
      allRecords.push({
        hour: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
        hourNum: hour,
        recordTime: recordTime,
        source: 'vitals',
        data: record.data || {}
      });
    });
    
    // Process neurological records
    neurological.forEach((record) => {
      const recordTime = dayjs(record.timestamp);
      const hour = recordTime.hour();
      const minute = recordTime.minute();
      
      // Check if there's already a vitals record at this time, merge if so
      const existingIndex = allRecords.findIndex(r => 
        r.recordTime.isSame(recordTime, 'minute')
      );
      
      if (existingIndex >= 0) {
        // Merge neurological data with existing record
        allRecords[existingIndex].neuroData = record.data || {};
      } else {
        allRecords.push({
          hour: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
          hourNum: hour,
          recordTime: recordTime,
          source: 'neurological',
          data: {},
          neuroData: record.data || {}
        });
      }
    });
    
    // Sort by time
    allRecords.sort((a, b) => a.recordTime.valueOf() - b.recordTime.valueOf());
    
    // Convert to display format
    return allRecords.map((record) => {
      const vitalsData = record.data || {};
      const neuroData = record.neuroData || record.data || {};

      // Calculate GCS Total if individual components are present
      let gcsTotal = null;
      const eye = toNumber(neuroData.gcsEye || vitalsData.gcsEye);
      const verbal = toNumber(neuroData.gcsVerbal || vitalsData.gcsVerbal);
      const motor = toNumber(neuroData.gcsMotor || vitalsData.gcsMotor);
      
      if (eye !== null || verbal !== null || motor !== null) {
        const eyeVal = eye || 0;
        const verbalVal = verbal || 0;
        const motorVal = motor || 0;
        if (eyeVal > 0 || verbalVal > 0 || motorVal > 0) {
          gcsTotal = eyeVal + verbalVal + motorVal;
        }
      } else if (vitalsData.gcsTotal) {
        gcsTotal = toNumber(vitalsData.gcsTotal);
      }

      return {
        hour: record.hour,
        hourNum: record.hourNum,
        bpSystolic: toNumber(vitalsData.bpSystolic),
        bpDiastolic: toNumber(vitalsData.bpDiastolic),
        pulseRate: toNumber(vitalsData.pulseRate || vitalsData.heartRate),
        respRate: toNumber(vitalsData.respRate),
        temperature: toNumber(vitalsData.temperature),
        spo2: toNumber(vitalsData.spo2),
        map: toNumber(vitalsData.map),
        // Neurological data - prefer neurological section, fallback to vitals
        gcsEye: toNumber(neuroData.gcsEye || vitalsData.gcsEye),
        gcsVerbal: toNumber(neuroData.gcsVerbal || vitalsData.gcsVerbal),
        gcsMotor: toNumber(neuroData.gcsMotor || vitalsData.gcsMotor),
        gcsTotal: gcsTotal,
        sedationScore: neuroData.sedationScore || vitalsData.sedationScore || null,
        analgesiaScore: toNumber(neuroData.analgesiaScore || vitalsData.analgesiaScore),
        pupilSizeRight: toNumber(neuroData.pupilSizeRight || vitalsData.pupilSizeRight),
        pupilSizeLeft: toNumber(neuroData.pupilSizeLeft || vitalsData.pupilSizeLeft),
        pupilReactionRight: neuroData.pupilReactionRight || vitalsData.pupilReactionRight || null,
        pupilReactionLeft: neuroData.pupilReactionLeft || vitalsData.pupilReactionLeft || null,
        motorUpperRight: toNumber(neuroData.motorUpperRight || vitalsData.motorUpperRight),
        motorUpperLeft: toNumber(neuroData.motorUpperLeft || vitalsData.motorUpperLeft),
        motorLowerRight: toNumber(neuroData.motorLowerRight || vitalsData.motorLowerRight),
        motorLowerLeft: toNumber(neuroData.motorLowerLeft || vitalsData.motorLowerLeft),
        sensoryUpperRight: neuroData.sensoryUpperRight || vitalsData.sensoryUpperRight || null,
        sensoryUpperLeft: neuroData.sensoryUpperLeft || vitalsData.sensoryUpperLeft || null,
        sensoryLowerRight: neuroData.sensoryLowerRight || vitalsData.sensoryLowerRight || null,
        sensoryLowerLeft: neuroData.sensoryLowerLeft || vitalsData.sensoryLowerLeft || null
      };
    });
  }, [groupedRecords.vitals, groupedRecords.neurological, recordDate]);

  // Process intake/output data - show all entries
  const intakeOutputData = useMemo(() => {
    const ioRecords = groupedRecords.intake_output || [];
    
    // Process all records and show each one
    const allRecords = ioRecords.map((record) => {
      const recordTime = dayjs(record.timestamp);
      const hour = recordTime.hour();
      const minute = recordTime.minute();
      const data = record.data || {};
      
      const enteralFeeding = toNumber(data.enteralFeeding);
      const waterFlushing = toNumber(data.waterFlushing);
      const oralMeds = toNumber(data.oralMedications);
      const ivMeds = toNumber(data.ivMedications);
      const ivFluids = toNumber(data.ivFluidsVolume);
      const intakeOthers = toNumber(data.intakeOthersVolume);
      
      const ngtResiduals = toNumber(data.ngtResiduals);
      const vomitus = toNumber(data.vomitus);
      const stool = toNumber(data.stoolVolume);
      const urine = toNumber(data.urine);
      const outputOthers = toNumber(data.outputOthersVolume);
      
      const totalIntake = (enteralFeeding || 0) + (waterFlushing || 0) + (oralMeds || 0) + 
                         (ivMeds || 0) + (ivFluids || 0) + (intakeOthers || 0);
      const totalOutput = (ngtResiduals || 0) + (vomitus || 0) + (stool || 0) + 
                         (urine || 0) + (outputOthers || 0);
      
      return {
        hour: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
        hourNum: hour,
        enteralFeeding,
        waterFlushing,
        oralMeds,
        ivMeds,
        ivFluids,
        intakeOthers,
        totalIntake,
        ngtResiduals,
        vomitus,
        stool,
        urine,
        outputOthers,
        totalOutput
      };
    });
    
    // Sort by time
    allRecords.sort((a, b) => {
      if (a.hourNum !== b.hourNum) return a.hourNum - b.hourNum;
      return a.hour.localeCompare(b.hour);
    });
    
    const dayTotalIntake = allRecords.reduce((sum, r) => sum + (r.totalIntake || 0), 0);
    const dayTotalOutput = allRecords.reduce((sum, r) => sum + (r.totalOutput || 0), 0);

    return { hourlyData: allRecords, dayTotalIntake, dayTotalOutput };
  }, [groupedRecords.intake_output, recordDate]);

  // Process ventilator/hemodynamic data - show all entries
  const ventHemData = useMemo(() => {
    const ventRecords = groupedRecords.ventilator || [];
    
    return ventRecords.map((record) => {
      const recordTime = dayjs(record.timestamp);
      const hour = recordTime.hour();
      const minute = recordTime.minute();
      const data = record.data || {};
      
      return {
        hour: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
        hourNum: hour,
        spo2: toNumber(data.spo2),
        mvMode: data.mvMode || null,
        fio2: toNumber(data.fio2),
        backupRate: toNumber(data.backupRate),
        tidalVolume: toNumber(data.tidalVolume),
        peep: toNumber(data.peep),
        pressureSupport: toNumber(data.pressureSupport),
        cvp: toNumber(data.cvp),
        co: toNumber(data.co),
        ci: toNumber(data.ci),
        svo2: toNumber(data.svo2),
        ecg: data.ecg || null
      };
    }).sort((a, b) => {
      if (a.hourNum !== b.hourNum) return a.hourNum - b.hourNum;
      return a.hour.localeCompare(b.hour);
    });
  }, [groupedRecords.ventilator, recordDate]);

  // Process blood glucose data - show all entries
  const glucoseData = useMemo(() => {
    const glucoseRecords = groupedRecords.blood_glucose || [];
    
    return glucoseRecords.map((record) => {
      const recordTime = dayjs(record.timestamp);
      const hour = recordTime.hour();
      const minute = recordTime.minute();
      const data = record.data || {};
      
      return {
        hour: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
        hourNum: hour,
        cbg: toNumber(data.cbg),
        insulinType: data.insulinHumanR ? 'Human R' :
                    data.insulinNPH ? 'NPH' :
                    data.insulin7030 ? '70/30' :
                    data.insulinGlargine ? 'Glargine' : null,
        insulinDose: toNumber(data.insulinDose)
      };
    }).sort((a, b) => {
      if (a.hourNum !== b.hourNum) return a.hourNum - b.hourNum;
      return a.hour.localeCompare(b.hour);
    });
  }, [groupedRecords.blood_glucose, recordDate]);

  return (
    <div className="monitoring-sheet-24h">
      <div className="card">
        <div className="monitoring-sheet-header">
          <div>
            <h2>24-Hour Monitoring Sheet</h2>
            <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Comprehensive view of all patient entries with timestamps. All records are displayed, not just one per hour.
            </p>
          </div>
          {patient && (
            <div className="patient-info-header">
              <div>
                <span className="label">Name:</span> {patient.name}
              </div>
              <div>
                <span className="label">Case Number:</span> {patient.hospitalId || '—'}
              </div>
              <div>
                <span className="label">Bed No:</span> {patient.bedNumber}
              </div>
              <div>
                <span className="label">Age/Sex:</span> {patient.age || '—'} / {patient.sex || '—'}
              </div>
              <div>
                <span className="label">Date:</span> {recordDate.format('MMM DD, YYYY')}
              </div>
            </div>
          )}
        </div>

        {/* Vital Signs Chart */}
        <div className="monitoring-section">
          <h3>Vital Signs</h3>
          <div className="vitals-grid-chart">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={vitalsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis yAxisId="left" domain={[0, 200]} label={{ value: 'BP/Pulse/RR', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" domain={[35, 42]} label={{ value: 'Temp (°C)', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="bpSystolic" stroke="#b32234" strokeWidth={2} dot={false} name="BP Systolic" />
                <Line yAxisId="left" type="monotone" dataKey="bpDiastolic" stroke="#f2a33c" strokeWidth={2} dot={false} name="BP Diastolic" />
                <Line yAxisId="left" type="monotone" dataKey="pulseRate" stroke="#c23730" strokeWidth={2} dot={false} name="Pulse" />
                <Line yAxisId="left" type="monotone" dataKey="respRate" stroke="#f2a33c" strokeWidth={2} dot={false} name="RR" />
                <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#e85c4a" strokeWidth={2} dot={false} name="Temp" />
                <Line yAxisId="left" type="monotone" dataKey="spo2" stroke="#4a90e2" strokeWidth={2} dot={false} name="SpO2" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Neurological Parameters Table */}
          <div className="neurological-grid">
            <h4>Neurological Assessment</h4>
            <div className="table-responsive">
              <table className="monitoring-table">
                <thead>
                  <tr>
                    <th>Hour</th>
                    <th>GCS E</th>
                    <th>GCS V</th>
                    <th>GCS M</th>
                    <th>GCS Total</th>
                    <th>Pupil R (mm)</th>
                    <th>Pupil L (mm)</th>
                    <th>Pupil React R</th>
                    <th>Pupil React L</th>
                    <th>Motor Upper R</th>
                    <th>Motor Upper L</th>
                    <th>Motor Lower R</th>
                    <th>Motor Lower L</th>
                    <th>Sedation</th>
                    <th>Pain</th>
                  </tr>
                </thead>
                <tbody>
                  {vitalsData.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.hour}</td>
                      <td>{row.gcsEye || '—'}</td>
                      <td>{row.gcsVerbal || '—'}</td>
                      <td>{row.gcsMotor || '—'}</td>
                      <td>{row.gcsTotal || '—'}</td>
                      <td>{row.pupilSizeRight || '—'}</td>
                      <td>{row.pupilSizeLeft || '—'}</td>
                      <td>{row.pupilReactionRight || '—'}</td>
                      <td>{row.pupilReactionLeft || '—'}</td>
                      <td>{row.motorUpperRight || '—'}</td>
                      <td>{row.motorUpperLeft || '—'}</td>
                      <td>{row.motorLowerRight || '—'}</td>
                      <td>{row.motorLowerLeft || '—'}</td>
                      <td>{row.sedationScore || '—'}</td>
                      <td>{row.analgesiaScore || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Intake/Output Grid */}
        <div className="monitoring-section">
          <h3>Intake & Output</h3>
          <div className="table-responsive">
            <table className="monitoring-table">
              <thead>
                <tr>
                  <th>Hour</th>
                  <th>Enteral Feeding</th>
                  <th>H2O Flushing</th>
                  <th>Oral Meds</th>
                  <th>IV Meds</th>
                  <th>IV Fluids</th>
                  <th>Others</th>
                  <th>Total Intake/hr</th>
                  <th>NGT Residuals</th>
                  <th>Vomitus</th>
                  <th>Stool</th>
                  <th>Urine</th>
                  <th>Others</th>
                  <th>Total Output/hr</th>
                </tr>
              </thead>
              <tbody>
                {intakeOutputData.hourlyData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.hour}</td>
                    <td>{row.enteralFeeding || '—'}</td>
                    <td>{row.waterFlushing || '—'}</td>
                    <td>{row.oralMeds || '—'}</td>
                    <td>{row.ivMeds || '—'}</td>
                    <td>{row.ivFluids || '—'}</td>
                    <td>{row.intakeOthers || '—'}</td>
                    <td className="total-cell">{row.totalIntake || '—'}</td>
                    <td>{row.ngtResiduals || '—'}</td>
                    <td>{row.vomitus || '—'}</td>
                    <td>{row.stool || '—'}</td>
                    <td>{row.urine || '—'}</td>
                    <td>{row.outputOthers || '—'}</td>
                    <td className="total-cell output-cell">{row.totalOutput || '—'}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan="7"><strong>24-Hour Total Intake</strong></td>
                  <td className="total-cell"><strong>{intakeOutputData.dayTotalIntake}</strong></td>
                  <td colSpan="5"></td>
                  <td className="total-cell output-cell"><strong>{intakeOutputData.dayTotalOutput}</strong></td>
                </tr>
                <tr className="balance-row">
                  <td colSpan="13"><strong>Fluid Balance</strong></td>
                  <td className="balance-cell">
                    <strong>{intakeOutputData.dayTotalIntake - intakeOutputData.dayTotalOutput}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mechanical Ventilation / Hemodynamic Monitoring */}
        <div className="monitoring-section">
          <h3>Mechanical Ventilation / Hemodynamic Monitoring</h3>
          <div className="table-responsive">
            <table className="monitoring-table">
              <thead>
                <tr>
                  <th>Hour</th>
                  <th>SpO2</th>
                  <th>MV Mode</th>
                  <th>FiO2</th>
                  <th>RR</th>
                  <th>TV</th>
                  <th>PEEP</th>
                  <th>PS</th>
                  <th>CVP</th>
                  <th>CO/CI</th>
                  <th>SvO2/PA</th>
                  <th>ECG</th>
                </tr>
              </thead>
              <tbody>
                {ventHemData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.hour}</td>
                    <td>{row.spo2 || '—'}</td>
                    <td>{row.mvMode || '—'}</td>
                    <td>{row.fio2 || '—'}</td>
                    <td>{row.backupRate || '—'}</td>
                    <td>{row.tidalVolume || '—'}</td>
                    <td>{row.peep || '—'}</td>
                    <td>{row.pressureSupport || '—'}</td>
                    <td>{row.cvp || '—'}</td>
                    <td>{row.co ? `${row.co}/${row.ci || '—'}` : '—'}</td>
                    <td>{row.svo2 || '—'}</td>
                    <td>{row.ecg || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Blood Glucose Monitoring */}
        <div className="monitoring-section">
          <h3>Blood Glucose Monitoring</h3>
          <div className="table-responsive">
            <table className="monitoring-table">
              <thead>
                <tr>
                  <th>Hour</th>
                  <th>CBG (mg/dL)</th>
                  <th>Insulin Type</th>
                  <th>Insulin Dose (Units)</th>
                </tr>
              </thead>
              <tbody>
                {glucoseData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.hour}</td>
                    <td>{row.cbg || '—'}</td>
                    <td>{row.insulinType || '—'}</td>
                    <td>{row.insulinDose || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringSheet24H;

