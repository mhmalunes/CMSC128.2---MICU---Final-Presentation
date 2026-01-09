export const hourOptions = Array.from({ length: 24 }, (_, i) => ({
  label: `${String(i).padStart(2, '0')}:00`,
  value: i
}));

export const sectionDefinitions = [
  {
    id: 'vitals',
    title: '1. Vital Signs and Hemodynamic Monitoring',
    description: 'Capture hourly vital signs, hemodynamic parameters, and neurological checks.',
    alwaysOpen: true,
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      // Blood Pressure
      { name: 'bpSystolic', label: 'BP Systolic (mmHg)', type: 'number', required: true },
      { name: 'bpDiastolic', label: 'BP Diastolic (mmHg)', type: 'number', required: true },
      { name: 'map', label: 'MAP (mmHg)', type: 'number', description: 'Auto-calculated: [SBP + 2(DBP)] ÷ 3' },
      // Pulse and Respiratory
      { name: 'pulseRate', label: 'Pulse Rate (bpm)', type: 'number', required: true },
      { name: 'respRate', label: 'Respiratory Rate (breaths/min)', type: 'number', required: true },
      // Temperature and Oxygen
      { name: 'temperature', label: 'Temperature (°C)', type: 'number', step: '0.1' },
      { name: 'spo2', label: 'SpO₂ (%)', type: 'number' },
      // Hemodynamic Monitoring
      { name: 'pap', label: 'PAP - Pulmonary Artery Pressure (mmHg)', type: 'number' },
      { name: 'cvp', label: 'CVP - Central Venous Pressure (mmHg)', type: 'number' },
      { name: 'co', label: 'CO - Cardiac Output (L/min)', type: 'number' },
      { name: 'ci', label: 'CI - Cardiac Index', type: 'number' },
      { name: 'svo2', label: 'SvO₂/PA - Mixed Venous Oxygen Saturation (%)', type: 'number' },
      // ECG
      {
        name: 'ecg',
        label: 'ECG Rhythm',
        type: 'select',
        options: [
          'Normal Sinus Rhythm (NSR)',
          'Sinus Tachycardia',
          'Sinus Bradycardia',
          'Atrial Fibrillation',
          'Atrial Flutter',
          'Supraventricular Tachycardia (SVT)',
          'Premature Ventricular Contractions (PVCs)',
          'Ventricular Tachycardia (VT)',
          'Ventricular Fibrillation (VF)',
          'Asystole',
          'Heart Block – First Degree',
          'Heart Block – Second Degree (Mobitz I)',
          'Heart Block – Second Degree (Mobitz II)',
          'Heart Block – Third Degree',
          'Paced Rhythm',
          'Other'
        ]
      },
      { name: 'ecgOther', label: 'ECG Other (Specify)', type: 'text' },
      { name: 'ecgNotes', label: 'ECG Notes', type: 'textarea' },
      { name: 'vitalsNotes', label: 'Vital Signs Notes', type: 'textarea' }
    ]
  },
  {
    id: 'blood_glucose',
    title: '2. Blood Glucose Monitoring',
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      { name: 'cbg', label: 'CBG - Capillary Blood Glucose (mg/dL)', type: 'number' },
      {
        name: 'cbgTiming',
        label: 'CBG Timing',
        type: 'select',
        options: ['Fasting', 'Random', 'Pre-feed', 'Post-feed']
      },
      // Insulin Types
      { name: 'insulinHumanR', label: 'Insulin Human (R)', type: 'checkbox' },
      { name: 'insulinNPH', label: 'Insulin Isophane (NPH)', type: 'checkbox' },
      { name: 'insulin7030', label: 'Insulin 70/30 mix', type: 'checkbox' },
      { name: 'insulinGlargine', label: 'Insulin Glargine', type: 'checkbox' },
      { name: 'insulinOther', label: 'Insulin Other', type: 'text' },
      { name: 'insulinDose', label: 'Insulin Dose (Units)', type: 'number' },
      {
        name: 'insulinRoute',
        label: 'Insulin Route',
        type: 'select',
        options: ['SC', 'IV', 'Other']
      },
      { name: 'insulinTimeGiven', label: 'Insulin Time Given', type: 'time' },
      { name: 'glucoseNotes', label: 'Glucose Monitoring Notes', type: 'textarea' }
    ]
  },
  {
    id: 'neurological',
    title: '3. Neurological Assessment',
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      // Glasgow Coma Scale
      {
        name: 'gcsEye',
        label: 'GCS Eye Opening',
        type: 'select',
        options: ['1', '2', '3', '4']
      },
      {
        name: 'gcsVerbal',
        label: 'GCS Verbal',
        type: 'select',
        options: ['1', '2', '3', '4', '5']
      },
      {
        name: 'gcsMotor',
        label: 'GCS Motor',
        type: 'select',
        options: ['1', '2', '3', '4', '5', '6']
      },
      { name: 'gcsTotal', label: 'GCS Total (Auto-calculated)', type: 'number', readonly: true },
      { name: 'gcsIntubated', label: 'Intubated (V modifier)', type: 'checkbox' },
      // Pupils
      {
        name: 'pupilSizeRight',
        label: 'Pupil Size Right (mm)',
        type: 'select',
        options: ['2', '3', '4', '5', '6']
      },
      {
        name: 'pupilSizeLeft',
        label: 'Pupil Size Left (mm)',
        type: 'select',
        options: ['2', '3', '4', '5', '6']
      },
      {
        name: 'pupilReactionRight',
        label: 'Pupil Reaction Right',
        type: 'select',
        options: ['Brisk', 'Sluggish', 'Non-reactive']
      },
      {
        name: 'pupilReactionLeft',
        label: 'Pupil Reaction Left',
        type: 'select',
        options: ['Brisk', 'Sluggish', 'Non-reactive']
      },
      // Motor and Sensory
      {
        name: 'motorUpperRight',
        label: 'Motor Upper Right (MRC 0-5)',
        type: 'select',
        options: ['0', '1', '2', '3', '4', '5']
      },
      {
        name: 'motorUpperLeft',
        label: 'Motor Upper Left (MRC 0-5)',
        type: 'select',
        options: ['0', '1', '2', '3', '4', '5']
      },
      {
        name: 'motorLowerRight',
        label: 'Motor Lower Right (MRC 0-5)',
        type: 'select',
        options: ['0', '1', '2', '3', '4', '5']
      },
      {
        name: 'motorLowerLeft',
        label: 'Motor Lower Left (MRC 0-5)',
        type: 'select',
        options: ['0', '1', '2', '3', '4', '5']
      },
      {
        name: 'sensoryUpperRight',
        label: 'Sensory Upper Right (0-2)',
        type: 'select',
        options: ['0 - Absent', '1 - Impaired', '2 - Intact']
      },
      {
        name: 'sensoryUpperLeft',
        label: 'Sensory Upper Left (0-2)',
        type: 'select',
        options: ['0 - Absent', '1 - Impaired', '2 - Intact']
      },
      {
        name: 'sensoryLowerRight',
        label: 'Sensory Lower Right (0-2)',
        type: 'select',
        options: ['0 - Absent', '1 - Impaired', '2 - Intact']
      },
      {
        name: 'sensoryLowerLeft',
        label: 'Sensory Lower Left (0-2)',
        type: 'select',
        options: ['0 - Absent', '1 - Impaired', '2 - Intact']
      },
      // Sedation and Analgesia
      {
        name: 'sedationScore',
        label: 'Sedation Score (RASS)',
        type: 'select',
        options: ['+4', '+3', '+2', '+1', '0', '-1', '-2', '-3', '-4']
      },
      {
        name: 'analgesiaScale',
        label: 'Analgesia/Pain Scale Type',
        type: 'select',
        options: ['NRS', 'CPOT', 'BPS', 'FACES']
      },
      { name: 'analgesiaScore', label: 'Analgesia/Pain Score', type: 'number' },
      { name: 'neurologicalNotes', label: 'Neurological Notes', type: 'textarea' }
    ]
  },
  {
    id: 'intake_output',
    title: '4. Intake & Output',
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      // Intake
      { name: 'enteralFeeding', label: 'Enteral Feeding (mL)', type: 'number' },
      { name: 'enteralFeedingType', label: 'Enteral Feeding Type/Formula', type: 'text' },
      { name: 'waterFlushing', label: 'Water for Flushing (mL)', type: 'number' },
      { name: 'oralMedications', label: 'Oral Medications (mL)', type: 'number' },
      { name: 'oralMedicationsName', label: 'Oral Medications Name', type: 'text' },
      { name: 'ivMedications', label: 'IV Medications (mL)', type: 'number' },
      { name: 'ivMedicationsName', label: 'IV Medications Name', type: 'text' },
      {
        name: 'ivFluids',
        label: 'IV Fluids Type',
        type: 'select',
        options: ['NS', 'D5LR', 'D5W', 'LR', 'Plasma', 'Blood Products', 'Other']
      },
      { name: 'ivFluidsVolume', label: 'IV Fluids Volume (mL)', type: 'number' },
      { name: 'intakeOthers', label: 'Other Intake Description', type: 'text' },
      { name: 'intakeOthersVolume', label: 'Other Intake Volume (mL)', type: 'number' },
      { name: 'totalIntake', label: 'Total Intake (mL) - Auto-calculated', type: 'number', readonly: true },
      // Output
      { name: 'urine', label: 'Urine Output (mL)', type: 'number' },
      { name: 'ngtResiduals', label: 'NGT Residuals (mL)', type: 'number' },
      { name: 'ngtResidualsDisposition', label: 'NGT Residuals Disposition', type: 'select', options: ['Discarded', 'Re-fed'] },
      { name: 'vomitus', label: 'Vomitus (mL)', type: 'number' },
      { name: 'vomitusColor', label: 'Vomitus Color/Character', type: 'text' },
      { name: 'stoolFormed', label: 'Stool - Formed', type: 'checkbox' },
      { name: 'stoolLoose', label: 'Stool - Loose', type: 'checkbox' },
      { name: 'stoolVolume', label: 'Stool Volume (mL)', type: 'number' },
      { name: 'outputOthers', label: 'Other Output Description', type: 'text' },
      { name: 'outputOthersVolume', label: 'Other Output Volume (mL)', type: 'number' },
      { name: 'totalOutput', label: 'Total Output (mL) - Auto-calculated', type: 'number', readonly: true },
      { name: 'ioNotes', label: 'Intake/Output Notes', type: 'textarea' }
    ]
  },
  {
    id: 'ventilator',
    title: '5. Mechanical Ventilation',
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      { name: 'intubated', label: 'Intubated', type: 'checkbox' },
      {
        name: 'mvMode',
        label: 'MV Mode',
        type: 'select',
        options: [
          'AC/VC (Assist Control – Volume Control)',
          'AC/PC (Assist Control – Pressure Control)',
          'SIMV/VC (Synchronized Intermittent Mandatory Ventilation – Volume Control)',
          'SIMV/PC (Synchronized Intermittent Mandatory Ventilation – Pressure Control)',
          'PSV (Pressure Support Ventilation)',
          'CPAP (Continuous Positive Airway Pressure)',
          'BiPAP (Bilevel Positive Airway Pressure)',
          'Spontaneous',
          'Other'
        ]
      },
      { name: 'mvModeOther', label: 'MV Mode Other (Specify)', type: 'text' },
      { name: 'fio2', label: 'FiO₂ (%)', type: 'number', min: 21, max: 100 },
      { name: 'tidalVolume', label: 'TV - Tidal Volume (mL)', type: 'number' },
      { name: 'backupRate', label: 'BUR - Back Up Rate (breaths/min)', type: 'number' },
      { name: 'pressureSupport', label: 'PS - Pressure Support (cmH₂O)', type: 'number' },
      { name: 'inspiratoryPressure', label: 'P1 - Inspiratory Pressure (cmH₂O)', type: 'number' },
      { name: 'inspiratoryTime', label: 'T1 - Inspiratory Time (seconds)', type: 'number' },
      { name: 'inspiratoryFlowRate', label: 'IFR - Inspiratory Flow Rate', type: 'text', placeholder: 'e.g., 1:2, 1:1.5' },
      { name: 'ieRatio', label: 'I:E - Inspiratory-to-Expiratory Ratio', type: 'text', placeholder: 'e.g., 1:2, 1:1.5' },
      { name: 'peep', label: 'PEEP - Positive End-Expiratory Pressure (cmH₂O)', type: 'number' },
      { name: 'trigger', label: 'Trigger Sensitivity (cmH₂O)', type: 'number' },
      { name: 'ventilatorNotes', label: 'Ventilator Notes', type: 'textarea' }
    ]
  },
  {
    id: 'nursing_assessment',
    title: '6. Nursing Assessment',
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      // Respiratory Assessment
      { name: 'respiratoryAssessment', label: 'Respiratory Assessment', type: 'textarea' },
      {
        name: 'respiratoryPattern',
        label: 'Respiratory Pattern',
        type: 'select',
        options: ['Tachypnea', 'Bradypnea', 'Dyspnea', 'Other']
      },
      { name: 'respiratoryPatternOther', label: 'Respiratory Pattern Other', type: 'text' },
      {
        name: 'breathSounds',
        label: 'Breath Sounds',
        type: 'select',
        options: ['Clear', 'Wheezes', 'Rhonchi', 'Rales', 'Stridor', 'Decreased Breath Sounds', 'Other']
      },
      { name: 'breathSoundsOther', label: 'Breath Sounds Other', type: 'text' },
      {
        name: 'chestExpansion',
        label: 'Chest Expansion',
        type: 'select',
        options: ['Symmetrical', 'Asymmetrical']
      },
      {
        name: 'oxygenSupport',
        label: 'Oxygen Support',
        type: 'select',
        options: ['Room Air', 'Nasal Cannula', 'Facemask', 'Trache Mask', 'High Flow Nasal Cannula', 'Other']
      },
      { name: 'oxygenSupportSettings', label: 'Oxygen Support Settings', type: 'text' },
      {
        name: 'intubatedType',
        label: 'Intubated Type',
        type: 'select',
        options: ['No', 'Tracheostomy', 'Endotracheal']
      },
      { name: 'intubatedSize', label: 'ET/Trach Size', type: 'text' },
      { name: 'intubatedLevel', label: 'ET Level', type: 'text' },
      {
        name: 'tracheobronchialSecretions',
        label: 'Tracheobronchial Secretions Amount',
        type: 'select',
        options: ['None', 'Scanty', 'Moderate', 'Copious']
      },
      {
        name: 'secretionsColor',
        label: 'Secretions Color',
        type: 'select',
        options: ['Clear', 'White', 'Yellow', 'Green', 'Brown', 'Bloody/Hemorrhagic', 'Pink-tinged/Frothy', 'Rust-colored', 'Other']
      },
      { name: 'secretionsColorOther', label: 'Secretions Color Other', type: 'text' },
      {
        name: 'secretionsConsistency',
        label: 'Secretions Consistency',
        type: 'select',
        options: ['Thin', 'Thick', 'Tenacious', 'Frothy', 'Mucoid', 'Purulent', 'Other']
      },
      { name: 'secretionsConsistencyOther', label: 'Secretions Consistency Other', type: 'text' },
      { name: 'secretionsAmount', label: 'Secretions Amount (mL)', type: 'number' },
      { name: 'respiratoryNotes', label: 'Respiratory Notes', type: 'textarea' },
      // Cardiovascular Assessment
      {
        name: 'heartSounds',
        label: 'Heart Sounds',
        type: 'select',
        options: ['Distinct', 'Faint', 'Regular', 'Irregular', 'Other']
      },
      { name: 'heartSoundsOther', label: 'Heart Sounds Other', type: 'text' },
      {
        name: 'chestTubes',
        label: 'Chest Tubes',
        type: 'select',
        options: ['Present', 'Not Present']
      },
      {
        name: 'chestTubeDrainage',
        label: 'Chest Tube Drainage Type',
        type: 'select',
        options: ['Serous', 'Sanguineous', 'Serosanguineous', 'Purulent', 'Air Leak', 'Other']
      },
      { name: 'chestTubeDrainageOther', label: 'Chest Tube Drainage Other', type: 'text' },
      { name: 'chestTubeDrainageAmount', label: 'Chest Tube Drainage Amount (mL)', type: 'number' },
      {
        name: 'pacemaker',
        label: 'Pacemaker',
        type: 'select',
        options: ['Present', 'Not Present', 'Other']
      },
      { name: 'pacemakerOther', label: 'Pacemaker Other', type: 'text' },
      { name: 'pacemakerMode', label: 'Pacemaker Mode', type: 'text' },
      { name: 'pacemakerRate', label: 'Pacemaker Rate', type: 'number' },
      { name: 'pacemakerOutput', label: 'Pacemaker Output', type: 'number' },
      { name: 'pacemakerSensitivity', label: 'Pacemaker Sensitivity', type: 'number' },
      { name: 'pacemakerRemarks', label: 'Pacemaker Remarks', type: 'textarea' },
      {
        name: 'pulses',
        label: 'Pulses',
        type: 'select',
        options: ['Strong', 'Weak', 'Thready', 'Bounding', 'Absent', 'Irregular', 'Other']
      },
      { name: 'pulsesOther', label: 'Pulses Other', type: 'text' },
      {
        name: 'pulseSite',
        label: 'Pulse Site',
        type: 'select',
        options: ['Radial', 'Femoral', 'Dorsalis Pedis', 'Carotid', 'Apical']
      },
      {
        name: 'jugularVein',
        label: 'Jugular Vein',
        type: 'select',
        options: ['Flat', 'Distended', 'Other']
      },
      { name: 'jugularVeinOther', label: 'Jugular Vein Other', type: 'text' },
      { name: 'jugularVeinAngle', label: 'Jugular Vein Angle', type: 'number' },
      {
        name: 'edema',
        label: 'Edema',
        type: 'select',
        options: ['None', 'Peripheral', 'Anasarca', 'Pitting Grade 1+', 'Pitting Grade 2+', 'Pitting Grade 3+', 'Pitting Grade 4+', 'Non-Pitting', 'Other']
      },
      { name: 'edemaOther', label: 'Edema Other', type: 'text' },
      { name: 'edemaLocation', label: 'Edema Location', type: 'text' },
      {
        name: 'capillaryRefill',
        label: 'Capillary Refill',
        type: 'select',
        options: ['<2 seconds (Normal)', '>2 seconds (Delayed)', 'Other']
      },
      { name: 'capillaryRefillOther', label: 'Capillary Refill Other', type: 'text' },
      { name: 'capillaryRefillSite', label: 'Capillary Refill Site', type: 'text' },
      { name: 'cardiovascularNotes', label: 'Cardiovascular Notes', type: 'textarea' },
      // Gastro-Urinary Assessment
      {
        name: 'abdomen',
        label: 'Abdomen',
        type: 'select',
        options: ['Soft', 'Hard', 'Distended', 'Globular', 'Tender', 'Non-Tender', 'Other']
      },
      { name: 'abdomenOther', label: 'Abdomen Other', type: 'text' },
      {
        name: 'bowelSounds',
        label: 'Bowel Sounds',
        type: 'select',
        options: ['Present', 'Absent', 'Hypoactive', 'Hyperactive', 'Other']
      },
      { name: 'bowelSoundsOther', label: 'Bowel Sounds Other', type: 'text' },
      {
        name: 'stomaLocation',
        label: 'Stoma Location',
        type: 'select',
        options: ['Ileostomy', 'Colostomy', 'Urostomy', 'Other']
      },
      { name: 'stomaLocationOther', label: 'Stoma Location Other', type: 'text' },
      {
        name: 'stomaColor',
        label: 'Stoma Color',
        type: 'select',
        options: ['Pink', 'Red', 'Pale', 'Dusky', 'Black', 'Other']
      },
      { name: 'stomaColorOther', label: 'Stoma Color Other', type: 'text' },
      {
        name: 'stomaDrainage',
        label: 'Stoma Drainage Characteristics',
        type: 'select',
        options: ['None', 'Serous', 'Mucoid', 'Bloody', 'Purulent', 'Fecal', 'Other']
      },
      { name: 'stomaDrainageOther', label: 'Stoma Drainage Other', type: 'text' },
      {
        name: 'feedingTubeType',
        label: 'Feeding Tube Type',
        type: 'select',
        options: ['NGT', 'OGT', 'PEG', 'Jejunostomy', 'Other']
      },
      { name: 'feedingTubeTypeOther', label: 'Feeding Tube Type Other', type: 'text' },
      { name: 'feedingTubeSize', label: 'Feeding Tube Size (Fr)', type: 'number' },
      {
        name: 'feedingTubeLocation',
        label: 'Feeding Tube Location',
        type: 'select',
        options: ['Right Nare', 'Left Nare', 'Oral', 'Abdominal', 'Other']
      },
      { name: 'feedingTubeLocationOther', label: 'Feeding Tube Location Other', type: 'text' },
      {
        name: 'feedingTubeStatus',
        label: 'Feeding Tube Status',
        type: 'select',
        options: ['In Place', 'Dislodged', 'Removed']
      },
      {
        name: 'feedingMethod',
        label: 'Feeding Method',
        type: 'select',
        options: ['Gravity Feeding', 'Bottle Feeding', 'Drip Feeding', 'Pump Feeding', 'Other']
      },
      { name: 'feedingMethodOther', label: 'Feeding Method Other', type: 'text' },
      {
        name: 'urineColor',
        label: 'Urine Color',
        type: 'select',
        options: ['Clear', 'Yellow', 'Amber', 'Reddish', 'Bloody', 'Other']
      },
      { name: 'urineColorOther', label: 'Urine Color Other', type: 'text' },
      {
        name: 'urineAppearance',
        label: 'Urine Appearance',
        type: 'select',
        options: ['Clear', 'Cloudy', 'Turbid', 'Other']
      },
      { name: 'urineAppearanceOther', label: 'Urine Appearance Other', type: 'text' },
      {
        name: 'urineMode',
        label: 'Urine Mode',
        type: 'select',
        options: ['Free Voiding', 'With Catheter']
      },
      {
        name: 'catheterType',
        label: 'Catheter Type',
        type: 'select',
        options: ['Foley', 'Condom', 'Suprapubic', 'Other']
      },
      { name: 'catheterTypeOther', label: 'Catheter Type Other', type: 'text' },
      { name: 'catheterSize', label: 'Catheter Size (Fr)', type: 'number' },
      {
        name: 'drainType',
        label: 'Drain Type',
        type: 'select',
        options: [
          'Jackson-Pratt (JP)',
          'Hemovac',
          'Penrose',
          'Chest Tube',
          'Pigtail Catheter',
          'Wound VAC (NPWT)',
          'T-tube (Biliary)',
          'Nephrostomy Tube',
          'Pleural Drain',
          'Peritoneal Drain',
          'Surgical Drain',
          'Other'
        ]
      },
      { name: 'drainTypeOther', label: 'Drain Type Other', type: 'text' },
      {
        name: 'drainLocation',
        label: 'Drain Location',
        type: 'select',
        options: [
          'Chest – Right',
          'Chest – Left',
          'Mediastinal',
          'Abdomen – RUQ',
          'Abdomen – LUQ',
          'Abdomen – RLQ',
          'Abdomen – LLQ',
          'Pelvis',
          'Back',
          'Neck',
          'Biliary',
          'Nephrostomy – Right',
          'Nephrostomy – Left',
          'Wound site',
          'Other'
        ]
      },
      { name: 'drainLocationOther', label: 'Drain Location Other', type: 'text' },
      {
        name: 'drainColor',
        label: 'Drain Color',
        type: 'select',
        options: ['Serous', 'Sanguineous', 'Serosanguineous', 'Purulent', 'Bile', 'Chylous (Milky)', 'Feculent', 'Other']
      },
      { name: 'drainColorOther', label: 'Drain Color Other', type: 'text' },
      { name: 'drainAmount', label: 'Drain Amount (mL)', type: 'number' },
      { name: 'drainRemarks', label: 'Drain Remarks', type: 'textarea' },
      { name: 'surgicalSites', label: 'Surgical Sites (Description)', type: 'textarea' },
      { name: 'otherContraptions', label: 'Other Contraptions (Description)', type: 'textarea' },
      { name: 'gastroUrinaryNotes', label: 'Gastro-Urinary Notes', type: 'textarea' },
      // Integumentary Assessment
      {
        name: 'skinColor',
        label: 'Skin Color',
        type: 'select',
        options: ['Normal (Pink)', 'Pale', 'Cyanotic', 'Jaundiced', 'Flushed', 'Mottled', 'Dusky', 'Other']
      },
      { name: 'skinColorOther', label: 'Skin Color Other', type: 'text' },
      {
        name: 'skinTurgor',
        label: 'Skin Turgor',
        type: 'select',
        options: ['Normal (Elastic)', 'Decreased (Tenting/Poor)', 'Increased (Tight/Edematous)', 'Not Assessed']
      },
      {
        name: 'pressureUlcerLocation',
        label: 'Pressure Ulcer Location',
        type: 'select',
        options: [
          'Sacral',
          'Coccyx',
          'Heel – Right',
          'Heel – Left',
          'Hip – Right',
          'Hip – Left',
          'Elbow',
          'Occiput',
          'Other'
        ]
      },
      { name: 'pressureUlcerLocationOther', label: 'Pressure Ulcer Location Other', type: 'text' },
      {
        name: 'pressureUlcerGrade',
        label: 'Pressure Ulcer Grade',
        type: 'select',
        options: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Unstageable', 'Deep Tissue Injury']
      },
      { name: 'pressureUlcerSize', label: 'Pressure Ulcer Size (Length × Width × Depth cm)', type: 'text', placeholder: 'e.g., 5×3×2' },
      { name: 'pressureUlcerRemarks', label: 'Pressure Ulcer Remarks', type: 'textarea' },
      {
        name: 'skinOther',
        label: 'Skin Other (Hematoma/Rash/Lesion)',
        type: 'select',
        options: ['Hematoma', 'Rash', 'Lesion', 'Other']
      },
      { name: 'skinOtherOther', label: 'Skin Other Specify', type: 'text' },
      { name: 'skinOtherRemarks', label: 'Skin Other Remarks', type: 'textarea' },
      { name: 'integumentaryNotes', label: 'Integumentary Notes', type: 'textarea' }
    ]
  },
  {
    id: 'braden_scale',
    title: '7. Skin Risk Assessment - Braden Scale',
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      {
        name: 'sensoryPerception',
        label: 'Sensory Perception',
        type: 'select',
        options: [
          '1 - Completely limited',
          '2 - Very limited',
          '3 - Slightly limited',
          '4 - No impairment'
        ]
      },
      {
        name: 'moisture',
        label: 'Moisture',
        type: 'select',
        options: [
          '1 - Constantly moist',
          '2 - Moist',
          '3 - Occasionally moist',
          '4 - Rarely moist'
        ]
      },
      {
        name: 'activity',
        label: 'Activity',
        type: 'select',
        options: [
          '1 - Bedfast',
          '2 - Chairfast',
          '3 - Walks occasionally',
          '4 - Walks frequently'
        ]
      },
      {
        name: 'mobility',
        label: 'Mobility',
        type: 'select',
        options: [
          '1 - Completely immobile',
          '2 - Very limited',
          '3 - Slightly limited',
          '4 - No limitations'
        ]
      },
      {
        name: 'nutrition',
        label: 'Nutrition',
        type: 'select',
        options: [
          '1 - Very poor',
          '2 - Probably inadequate',
          '3 - Adequate',
          '4 - Excellent'
        ]
      },
      {
        name: 'frictionShear',
        label: 'Friction and Shear',
        type: 'select',
        options: [
          '1 - Problem',
          '2 - Potential problem',
          '3 - No apparent problem'
        ]
      },
      { name: 'bradenTotal', label: 'Braden Total Score (Auto-calculated)', type: 'number', readonly: true },
      { name: 'bradenRiskLevel', label: 'Risk Level (Auto-calculated)', type: 'text', readonly: true }
    ]
  },
  {
    id: 'nursing_activities',
    title: '8. Nursing Activities Checklist',
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      // Part I - Comfort, Safety and Privacy
      { name: 'comfortSafetyPrivacy', label: 'Comfort, Safety and Privacy Interventions', type: 'checkbox' },
      { name: 'moderateHighBackRest', label: 'Placed on Moderate/High Back Rest', type: 'checkbox' },
      { name: 'checkedNGTPlacement', label: 'Checked NGT Placement', type: 'checkbox' },
      { name: 'maintainedSpecialMattress', label: 'Maintained Special Mattress', type: 'checkbox' },
      { name: 'maintainedRestraints', label: 'Maintained Restraints', type: 'checkbox' },
      { name: 'providedPrivacy', label: 'Provided Privacy', type: 'checkbox' },
      // Part I - Psychosocial/Spiritual
      { name: 'renderedSpiritualSupport', label: 'Rendered Spiritual Support', type: 'checkbox' },
      { name: 'explainedProcedure', label: 'Explained Procedure/Intervention', type: 'checkbox' },
      { name: 'allowedCommunication', label: 'Allowed to Communicate Feelings', type: 'checkbox' },
      { name: 'providedEmotionalSupport', label: 'Provided Emotional Support', type: 'checkbox' },
      { name: 'orientedPersonPlaceTime', label: 'Oriented to Person, Place and Time', type: 'checkbox' },
      // Part II
      { name: 'suctioning', label: 'Suctioning', type: 'checkbox' },
      { name: 'tracheostomyCare', label: 'Tracheostomy Care', type: 'checkbox' },
      { name: 'drainedMVTubes', label: 'Drained Mechanical Ventilator Tubes', type: 'checkbox' },
      { name: 'oralCare', label: 'Oral Care', type: 'checkbox' },
      { name: 'feedingTubes', label: 'Feeding Tubes', type: 'checkbox' },
      { name: 'chestPulmophysiotherapy', label: 'Chest Pulmophysiotherapy', type: 'checkbox' },
      { name: 'romExercises', label: 'ROM Exercises (Range of Motion)', type: 'checkbox' },
      { name: 'turning', label: 'Turning', type: 'checkbox' },
      { name: 'woundCare', label: 'Wound Care', type: 'checkbox' },
      { name: 'perineumCare', label: 'Perineum Care', type: 'checkbox' },
      { name: 'spongeBath', label: 'Sponge Bath', type: 'checkbox' },
      { name: 'bloodExtraction', label: 'Blood Extraction', type: 'checkbox' },
      { name: 'specimenCollection', label: 'Specimen Collection', type: 'checkbox' },
      { name: 'prescriptionProvision', label: 'Prescription Provision', type: 'checkbox' },
      { name: 'procedurePreparation', label: 'Procedure Preparation', type: 'checkbox' },
      { name: 'procedurePreparationSpecify', label: 'Procedure Preparation (Specify)', type: 'text' },
      { name: 'referralFacilitation', label: 'Referral Facilitation', type: 'checkbox' },
      { name: 'referralFacilitationSpecify', label: 'Referral Facilitation (Specify Dr.\'s Name)', type: 'text' },
      { name: 'dvtProphylaxis', label: 'DVT Prophylaxis', type: 'checkbox' },
      { name: 'dvtProphylaxisSpecify', label: 'DVT Prophylaxis (Specify)', type: 'text' },
      { name: 'pudProphylaxis', label: 'PUD Prophylaxis', type: 'checkbox' },
      { name: 'pudProphylaxisSpecify', label: 'PUD Prophylaxis (Specify)', type: 'text' },
      { name: 'vapBundles', label: 'VAP Bundles of Care', type: 'checkbox' },
      { name: 'vapBundlesSpecify', label: 'VAP Bundles Details', type: 'textarea' },
      { name: 'nursingActivitiesRemarks', label: 'Nursing Activities Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'medications',
    title: '9. Medications',
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      { name: 'drug', label: 'Medication / Drip', type: 'text', required: true },
      { name: 'dose', label: 'Dose', type: 'text', required: true },
      { name: 'route', label: 'Route', type: 'select', options: ['IV', 'IM', 'PO', 'SubQ', 'Nebulization', 'SC', 'Other'] },
      { name: 'routeOther', label: 'Route Other', type: 'text' },
      { name: 'frequency', label: 'Frequency', type: 'text' },
      { name: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'procedures_lines',
    title: '10. Procedures & Lines',
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      {
        name: 'procedure',
        label: 'Procedure / Line',
        type: 'select',
        options: [
          'Central Line',
          'Peripheral Line',
          'Arterial Line',
          'Hemodialysis',
          'Bronchoscopy',
          'Other'
        ]
      },
      { name: 'procedureOther', label: 'Procedure Other', type: 'text' },
      { name: 'site', label: 'Site', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: ['Inserted', 'Ongoing', 'Removed'] },
      { name: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'labs_imaging',
    title: '11. Labs & Imaging',
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      { name: 'testName', label: 'Test / Imaging', type: 'text', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Sent', 'Pending', 'Resulted'] },
      { name: 'result', label: 'Result / Summary', type: 'textarea' }
    ]
  },
  {
    id: 'clinical_notes',
    title: '12. Clinical Notes',
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      {
        name: 'noteType',
        label: 'Note Type',
        type: 'select',
        options: ['Assessment', 'Intervention', 'Evaluation', 'Physician Order', 'Shift Handover']
      },
      { name: 'note', label: 'Narrative Note', type: 'textarea', required: true }
    ]
  },
  {
    id: 'nursing_notes',
    title: '13. Nursing Notes',
    description: 'Free narrative text field for comprehensive nursing documentation.',
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      { name: 'note', label: 'Nursing Note', type: 'textarea', required: true, rows: 10 }
    ]
  },
  {
    id: 'doctor_notes',
    title: '14. Doctor Progress Notes',
    description: 'Official physician entries regarding assessment, plan, or new orders.',
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      { name: 'note', label: 'Physician Note', type: 'textarea', required: true },
      { name: 'plan', label: 'Plan / Orders', type: 'textarea' }
    ]
  }
];

export const sectionColumns = {
  vitals: [
    { key: 'timestamp', label: 'Time Stamp', formatter: (row) => row.timestamp },
    { key: 'temperature', label: 'Temp (°C)' },
    {
      key: 'bloodPressure',
      label: 'BP (mmHg)',
      formatter: (row) => `${row.bpSystolic || '-'} / ${row.bpDiastolic || '-'}`
    },
    { key: 'pulseRate', label: 'HR' },
    { key: 'respRate', label: 'RR' },
    { key: 'spo2', label: 'SpO₂' },
    { key: 'map', label: 'MAP' }
  ],
  blood_glucose: [
    { key: 'timestamp', label: 'Time Stamp' },
    { key: 'cbg', label: 'CBG (mg/dL)' },
    { key: 'cbgTiming', label: 'Timing' },
    { key: 'insulinDose', label: 'Insulin Dose' }
  ],
  neurological: [
    { key: 'timestamp', label: 'Time Stamp' },
    { key: 'gcsTotal', label: 'GCS Total' },
    { key: 'gcsEye', label: 'GCS Eye' },
    { key: 'gcsVerbal', label: 'GCS Verbal' },
    { key: 'gcsMotor', label: 'GCS Motor' },
    { key: 'sedationScore', label: 'Sedation' },
    { key: 'analgesiaScore', label: 'Pain Score' }
  ],
  intake_output: [
    { key: 'timestamp', label: 'Time Stamp' },
    { key: 'totalIntake', label: 'Total Intake (mL)' },
    { key: 'totalOutput', label: 'Total Output (mL)' },
    { key: 'urine', label: 'Urine (mL)' }
  ],
  ventilator: [
    { key: 'timestamp', label: 'Time Stamp' },
    { key: 'mvMode', label: 'Mode' },
    { key: 'fio2', label: 'FiO₂' },
    { key: 'peep', label: 'PEEP' },
    { key: 'backupRate', label: 'Rate' },
    { key: 'tidalVolume', label: 'TV' }
  ],
  nursing_assessment: [
    { key: 'timestamp', label: 'Time Stamp' },
    { key: 'respiratoryPattern', label: 'Resp Pattern' },
    { key: 'breathSounds', label: 'Breath Sounds' },
    { key: 'heartSounds', label: 'Heart Sounds' }
  ],
  braden_scale: [
    { key: 'timestamp', label: 'Time Stamp' },
    { key: 'bradenTotal', label: 'Total Score' },
    { key: 'bradenRiskLevel', label: 'Risk Level' }
  ],
  nursing_activities: [
    { key: 'timestamp', label: 'Time Stamp' },
    { key: 'oralCare', label: 'Oral Care' },
    { key: 'turning', label: 'Turning' },
    { key: 'woundCare', label: 'Wound Care' }
  ],
  medications: [
    { key: 'timestamp', label: 'Time Stamp' },
    { key: 'drug', label: 'Medication' },
    { key: 'dose', label: 'Dose' },
    { key: 'route', label: 'Route' },
    { key: 'frequency', label: 'Frequency' }
  ],
  procedures_lines: [
    { key: 'timestamp', label: 'Time Stamp' },
    { key: 'procedure', label: 'Procedure / Line' },
    { key: 'site', label: 'Site' },
    { key: 'status', label: 'Status' }
  ],
  labs_imaging: [
    { key: 'timestamp', label: 'Time Stamp' },
    { key: 'testName', label: 'Test' },
    { key: 'status', label: 'Status' },
    { key: 'result', label: 'Result' }
  ],
  clinical_notes: [
    { key: 'timestamp', label: 'Time Stamp' },
    { key: 'noteType', label: 'Type' },
    { key: 'note', label: 'Narrative' }
  ],
  nursing_notes: [
    { key: 'timestamp', label: 'Time Stamp' },
    { key: 'note', label: 'Nursing Note' }
  ],
  doctor_notes: [
    { key: 'timestamp', label: 'Time Stamp' },
    { key: 'note', label: 'Doctor Note' },
    { key: 'plan', label: 'Plan / Orders' }
  ]
};
