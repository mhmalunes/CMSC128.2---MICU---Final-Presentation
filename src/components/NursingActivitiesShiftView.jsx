import { useMemo } from 'react';
import dayjs from 'dayjs';

const NursingActivitiesShiftView = ({ records }) => {
  // Group activities by shift
  const shiftData = useMemo(() => {
    const activities = records || [];
    
    // Define shift times
    const morningShift = { start: 7, end: 15 }; // 7 AM to 3 PM
    const afternoonShift = { start: 15, end: 23 }; // 3 PM to 11 PM
    const nightShift = { start: 23, end: 7 }; // 11 PM to 7 AM (next day)

    const getShift = (timestamp) => {
      const hour = dayjs(timestamp).hour();
      if (hour >= morningShift.start && hour < morningShift.end) return 'morning';
      if (hour >= afternoonShift.start && hour < afternoonShift.end) return 'afternoon';
      return 'night';
    };

    const grouped = {
      morning: [],
      afternoon: [],
      night: []
    };

    activities.forEach((record) => {
      const shift = getShift(record.timestamp);
      if (record.data) {
        grouped[shift].push(record);
      }
    });

    return grouped;
  }, [records]);

  const activityFields = [
    // Part I - Comfort, Safety and Privacy
    { key: 'comfortSafetyPrivacy', label: 'Comfort, Safety and Privacy Interventions' },
    { key: 'moderateHighBackRest', label: 'Placed on Moderate/High Back Rest' },
    { key: 'checkedNGTPlacement', label: 'Checked NGT Placement' },
    { key: 'maintainedSpecialMattress', label: 'Maintained Special Mattress' },
    { key: 'maintainedRestraints', label: 'Maintained Restraints' },
    { key: 'providedPrivacy', label: 'Provided Privacy' },
    // Part I - Psychosocial/Spiritual
    { key: 'renderedSpiritualSupport', label: 'Rendered Spiritual Support' },
    { key: 'explainedProcedure', label: 'Explained Procedure/Intervention' },
    { key: 'allowedCommunication', label: 'Allowed to Communicate Feelings' },
    { key: 'providedEmotionalSupport', label: 'Provided Emotional Support' },
    { key: 'orientedPersonPlaceTime', label: 'Oriented to Person, Place and Time' },
    // Part II
    { key: 'suctioning', label: 'Suctioning' },
    { key: 'tracheostomyCare', label: 'Tracheostomy Care' },
    { key: 'drainedMVTubes', label: 'Drained Mechanical Ventilator Tubes' },
    { key: 'oralCare', label: 'Oral Care' },
    { key: 'feedingTubes', label: 'Feeding Tubes' },
    { key: 'chestPulmophysiotherapy', label: 'Chest Pulmophysiotherapy' },
    { key: 'romExercises', label: 'ROM Exercises' },
    { key: 'turning', label: 'Turning' },
    { key: 'woundCare', label: 'Wound Care' },
    { key: 'perineumCare', label: 'Perineum Care' },
    { key: 'spongeBath', label: 'Sponge Bath' },
    { key: 'bloodExtraction', label: 'Blood Extraction' },
    { key: 'specimenCollection', label: 'Specimen Collection' },
    { key: 'prescriptionProvision', label: 'Prescription Provision' },
    { key: 'procedurePreparation', label: 'Procedure Preparation' },
    { key: 'referralFacilitation', label: 'Referral Facilitation' },
    { key: 'dvtProphylaxis', label: 'DVT Prophylaxis' },
    { key: 'pudProphylaxis', label: 'PUD Prophylaxis' },
    { key: 'vapBundles', label: 'VAP Bundles of Care' }
  ];

  const checkActivity = (shift, activityKey) => {
    return shiftData[shift].some((record) => {
      const value = record.data?.[activityKey];
      return value === true || value === 'true' || value === 1 || value === '1' || value === 'on';
    });
  };

  const getActivityDetails = (shift, activityKey) => {
    // Get all records with this activity, not just the first one
    const records = shiftData[shift].filter((r) => {
      const value = r.data?.[activityKey];
      return value === true || value === 'true' || value === 1 || value === '1' || value === 'on';
    });
    
    if (records.length === 0) return null;
    
    // Build details string with timestamps and recorded by info
    const details = records.map((record) => {
      const time = dayjs(record.timestamp).format('HH:mm');
      const recordedBy = record.recordedBy?.name || 'Unknown';
      let detail = `${time} (${recordedBy})`;
      
      // Get additional details for specific activities
      if (activityKey === 'procedurePreparation' && record.data?.procedurePreparationSpecify) {
        detail += ` - ${record.data.procedurePreparationSpecify}`;
      }
      if (activityKey === 'referralFacilitation' && record.data?.referralFacilitationSpecify) {
        detail += ` - ${record.data.referralFacilitationSpecify}`;
      }
      if (activityKey === 'dvtProphylaxis' && record.data?.dvtProphylaxisSpecify) {
        detail += ` - ${record.data.dvtProphylaxisSpecify}`;
      }
      if (activityKey === 'pudProphylaxis' && record.data?.pudProphylaxisSpecify) {
        detail += ` - ${record.data.pudProphylaxisSpecify}`;
      }
      if (activityKey === 'vapBundles' && record.data?.vapBundlesSpecify) {
        detail += ` - ${record.data.vapBundlesSpecify}`;
      }
      if (record.data?.nursingActivitiesRemarks) {
        detail += ` - Note: ${record.data.nursingActivitiesRemarks}`;
      }
      
      return detail;
    });
    
    return details.join(' | ');
  };
  
  const getActivityCount = (shift, activityKey) => {
    return shiftData[shift].filter((r) => {
      const value = r.data?.[activityKey];
      return value === true || value === 'true' || value === 1 || value === '1' || value === 'on';
    }).length;
  };

  // Debug: Check if we have any records
  const totalRecords = (records || []).length;
  const hasRecords = totalRecords > 0;

  return (
    <div className="nursing-activities-shift-view">
      <div className="card">
        <h2>Nursing Activities Checklist - Shift View</h2>
        <p className="muted">
          Check (✓) indicates the intervention was done. M = Morning (7AM-3PM), A = Afternoon (3PM-11PM), N = Night (11PM-7AM)
        </p>
        {!hasRecords && (
          <div style={{ 
            padding: '1.5rem', 
            background: '#fff8f4', 
            borderRadius: '8px', 
            margin: '1rem 0',
            border: '2px solid #f5b11c'
          }}>
            <p style={{ margin: '0 0 1rem 0', color: '#70300f', fontWeight: 600, fontSize: '1rem' }}>
              No nursing activities records found.
            </p>
            <div style={{ 
              background: '#fff', 
              padding: '1rem', 
              borderRadius: '6px',
              border: '1px solid #e0e0e0'
            }}>
              <p style={{ margin: '0 0 0.75rem 0', color: '#333', fontWeight: 600 }}>
                How to Add Nursing Activities:
              </p>
              <ol style={{ 
                margin: '0', 
                paddingLeft: '1.5rem', 
                color: '#555',
                lineHeight: '1.8'
              }}>
                <li>Switch to <strong>"List View"</strong> using the View Mode buttons above</li>
                <li>Scroll down to find the <strong>"8. Nursing Activities Checklist"</strong> section</li>
                <li>Click on the section to expand it (if it's collapsed)</li>
                <li>Fill out the form:
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                    <li>Enter the <strong>Date</strong> and <strong>Time</strong> when the activities were performed</li>
                    <li>Check the boxes (✓) for all activities that were completed</li>
                    <li>Fill in any additional details (e.g., procedure names, doctor names) if applicable</li>
                    <li>Add any remarks in the "Nursing Activities Remarks" field</li>
                  </ul>
                </li>
                <li>Click <strong>"Save Entry"</strong> to save the record</li>
                <li>Switch back to <strong>"Activities (Shift View)"</strong> to see your entries organized by shift</li>
              </ol>
              <p style={{ 
                margin: '1rem 0 0 0', 
                padding: '0.75rem', 
                background: '#e8f4f8', 
                borderRadius: '4px',
                color: '#2c5f7d',
                fontSize: '0.9rem'
              }}>
                <strong>Note:</strong> Activities are automatically grouped by shift based on the time entered:
                <br />• <strong>Morning (M):</strong> 7:00 AM - 2:59 PM
                <br />• <strong>Afternoon (A):</strong> 3:00 PM - 10:59 PM  
                <br />• <strong>Night (N):</strong> 11:00 PM - 6:59 AM
              </p>
            </div>
          </div>
        )}
        {hasRecords && (
          <>
            <p className="muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Showing {totalRecords} total activity record(s). Timestamps and recorded by information are displayed in the Remarks column.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginTop: '0.5rem',
              padding: '0.75rem',
              background: '#f8f8f8',
              borderRadius: '8px',
              fontSize: '0.85rem'
            }}>
              <span><strong>Morning:</strong> {shiftData.morning.length} record(s)</span>
              <span><strong>Afternoon:</strong> {shiftData.afternoon.length} record(s)</span>
              <span><strong>Night:</strong> {shiftData.night.length} record(s)</span>
            </div>
          </>
        )}

        {/* Part I - Comfort, Safety and Privacy */}
        <div className="activities-section">
          <h3>Part I - Comfort, Safety and Privacy Interventions</h3>
          <div className="table-responsive">
            <table className="activities-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th className="shift-col">M</th>
                  <th className="shift-col">A</th>
                  <th className="shift-col">N</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {activityFields.slice(0, 6).map((activity) => {
                  const morningCount = getActivityCount('morning', activity.key);
                  const afternoonCount = getActivityCount('afternoon', activity.key);
                  const nightCount = getActivityCount('night', activity.key);
                  const allDetails = [
                    getActivityDetails('morning', activity.key),
                    getActivityDetails('afternoon', activity.key),
                    getActivityDetails('night', activity.key)
                  ].filter(Boolean).join(' | ');
                  
                  return (
                    <tr key={activity.key}>
                      <td>{activity.label}</td>
                      <td className="shift-col">
                        {checkActivity('morning', activity.key) ? (
                          <span title={getActivityDetails('morning', activity.key) || ''}>
                            ✓ {morningCount > 1 ? `(${morningCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="shift-col">
                        {checkActivity('afternoon', activity.key) ? (
                          <span title={getActivityDetails('afternoon', activity.key) || ''}>
                            ✓ {afternoonCount > 1 ? `(${afternoonCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="shift-col">
                        {checkActivity('night', activity.key) ? (
                          <span title={getActivityDetails('night', activity.key) || ''}>
                            ✓ {nightCount > 1 ? `(${nightCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="remarks-col" title={allDetails || ''}>
                        <div style={{ 
                          whiteSpace: 'pre-wrap', 
                          wordBreak: 'break-word',
                          maxWidth: '400px',
                          fontSize: '0.85rem',
                          lineHeight: '1.4'
                        }}>
                          {allDetails || '—'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Part I - Psychosocial/Spiritual */}
        <div className="activities-section">
          <h3>Part I - Psychosocial/Spiritual Nursing Interventions</h3>
          <div className="table-responsive">
            <table className="activities-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th className="shift-col">M</th>
                  <th className="shift-col">A</th>
                  <th className="shift-col">N</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {activityFields.slice(6, 11).map((activity) => {
                  const morningCount = getActivityCount('morning', activity.key);
                  const afternoonCount = getActivityCount('afternoon', activity.key);
                  const nightCount = getActivityCount('night', activity.key);
                  const allDetails = [
                    getActivityDetails('morning', activity.key),
                    getActivityDetails('afternoon', activity.key),
                    getActivityDetails('night', activity.key)
                  ].filter(Boolean).join(' | ');
                  
                  return (
                    <tr key={activity.key}>
                      <td>{activity.label}</td>
                      <td className="shift-col">
                        {checkActivity('morning', activity.key) ? (
                          <span title={getActivityDetails('morning', activity.key) || ''}>
                            ✓ {morningCount > 1 ? `(${morningCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="shift-col">
                        {checkActivity('afternoon', activity.key) ? (
                          <span title={getActivityDetails('afternoon', activity.key) || ''}>
                            ✓ {afternoonCount > 1 ? `(${afternoonCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="shift-col">
                        {checkActivity('night', activity.key) ? (
                          <span title={getActivityDetails('night', activity.key) || ''}>
                            ✓ {nightCount > 1 ? `(${nightCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="remarks-col" title={allDetails || ''}>
                        <div style={{ 
                          whiteSpace: 'pre-wrap', 
                          wordBreak: 'break-word',
                          maxWidth: '400px',
                          fontSize: '0.85rem',
                          lineHeight: '1.4'
                        }}>
                          {allDetails || '—'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Part II */}
        <div className="activities-section">
          <h3>Part II - Nursing Activities</h3>
          <div className="table-responsive">
            <table className="activities-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th className="shift-col">M</th>
                  <th className="shift-col">A</th>
                  <th className="shift-col">N</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {activityFields.slice(11).map((activity) => {
                  const morningCount = getActivityCount('morning', activity.key);
                  const afternoonCount = getActivityCount('afternoon', activity.key);
                  const nightCount = getActivityCount('night', activity.key);
                  const allDetails = [
                    getActivityDetails('morning', activity.key),
                    getActivityDetails('afternoon', activity.key),
                    getActivityDetails('night', activity.key)
                  ].filter(Boolean).join(' | ');
                  
                  return (
                    <tr key={activity.key}>
                      <td>{activity.label}</td>
                      <td className="shift-col">
                        {checkActivity('morning', activity.key) ? (
                          <span title={getActivityDetails('morning', activity.key) || ''}>
                            ✓ {morningCount > 1 ? `(${morningCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="shift-col">
                        {checkActivity('afternoon', activity.key) ? (
                          <span title={getActivityDetails('afternoon', activity.key) || ''}>
                            ✓ {afternoonCount > 1 ? `(${afternoonCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="shift-col">
                        {checkActivity('night', activity.key) ? (
                          <span title={getActivityDetails('night', activity.key) || ''}>
                            ✓ {nightCount > 1 ? `(${nightCount})` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="remarks-col" title={allDetails || ''}>
                        <div style={{ 
                          whiteSpace: 'pre-wrap', 
                          wordBreak: 'break-word',
                          maxWidth: '400px',
                          fontSize: '0.85rem',
                          lineHeight: '1.4'
                        }}>
                          {allDetails || '—'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default NursingActivitiesShiftView;

