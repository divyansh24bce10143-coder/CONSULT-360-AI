/* ==========================================================================
   CONSULT 360 AI — HOSPITAL DATA SEED GENERATOR
   Generates a production-grade realistic Hospital Information System (HIS) database:
   - 10 Doctors across 10 Departments (with hashed credentials for DOC1001, DOC1002, DOC1003)
   - 100 Outpatients with MRNs, clinical profiles, and 6-stage Care Journeys
   - 250 Appointments
   - 150 Medical Reports (Labs, ECGs, Echoes, X-rays, Prescriptions)
   - 50 Pending Investigations with guideline references
   - 40 Follow-ups (with overdue flags)
   - 25 High-Risk / Critical Patients
   - AI Summaries, Notifications, and Audit Logs
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const { hashPassword } = require('./crypto');

function generateHospitalDatabase() {
  console.log('[HIS Seed] Generating Hospital Information System Database...');

  // ── 1. Departments ────────────────────────────────────────────────────────
  const departments = [
    { departmentId: 'DEP-GEN', departmentName: 'General Medicine', floor: '1st Floor, Block A', headDoctor: 'Dr. Amit Sharma' },
    { departmentId: 'DEP-CARD', departmentName: 'Cardiology', floor: '2nd Floor, Cardiac Wing', headDoctor: 'Dr. Sarah Chen' },
    { departmentId: 'DEP-ENDO', departmentName: 'Endocrinology & Diabetology', floor: '2nd Floor, Metabolic Center', headDoctor: 'Dr. Rajesh Verma' },
    { departmentId: 'DEP-NEPH', departmentName: 'Nephrology & Renal Care', floor: '3rd Floor, Renal Unit', headDoctor: 'Dr. Priya Nair' },
    { departmentId: 'DEP-PULM', departmentName: 'Pulmonology & Respiratory', floor: '3rd Floor, Thoracic Wing', headDoctor: 'Dr. Vikram Seth' },
    { departmentId: 'DEP-NEUR', departmentName: 'Neurology & Stroke Center', floor: '4th Floor, Neuro Tower', headDoctor: 'Dr. Ananya Iyer' },
    { departmentId: 'DEP-ONCO', departmentName: 'Medical Oncology', floor: '5th Floor, Cancer Center', headDoctor: 'Dr. Michael Scott' },
    { departmentId: 'DEP-GAST', departmentName: 'Gastroenterology & Hepatology', floor: '1st Floor, Block B', headDoctor: 'Dr. Emily Watson' },
    { departmentId: 'DEP-ORTH', departmentName: 'Orthopedics & Joint Care', floor: 'Ground Floor, Surgical Block', headDoctor: 'Dr. David Miller' },
    { departmentId: 'DEP-PED', departmentName: 'Pediatrics & Adolescent Care', floor: 'Ground Floor, Children Wing', headDoctor: 'Dr. Sunita Rao' }
  ];

  // ── 2. Doctors (10 Doctors) ───────────────────────────────────────────────
  const defaultHash = hashPassword('consult360');

  const doctors = [
    {
      doctorId: 'DOC1001',
      name: 'Dr. Amit Sharma',
      email: 'amit.sharma@stjude.hospital.org',
      password: defaultHash,
      department: 'General Medicine',
      departmentId: 'DEP-GEN',
      designation: 'Senior Consultant & HOD',
      experience: '18 years',
      phone: '+91 98110 44201',
      hospital: 'St. Jude Medical Center',
      status: 'active',
      avatar: 'AS',
      room: 'Room 102 (OPD Block A)',
      licenseNo: 'MCI-2006-88349'
    },
    {
      doctorId: 'DOC1002',
      name: 'Dr. Sarah Chen, MD',
      email: 'sarah.chen@stjude.hospital.org',
      password: defaultHash,
      department: 'Cardiology',
      departmentId: 'DEP-CARD',
      designation: 'Attending Cardiologist',
      experience: '14 years',
      phone: '+91 98220 55102',
      hospital: 'St. Jude Medical Center',
      status: 'active',
      avatar: 'SC',
      room: 'Room 204 (Cardiac Wing)',
      licenseNo: 'MCI-2010-44912'
    },
    {
      doctorId: 'DOC1003',
      name: 'Dr. Rajesh Verma',
      email: 'rajesh.verma@stjude.hospital.org',
      password: defaultHash,
      department: 'Endocrinology & Diabetology',
      departmentId: 'DEP-ENDO',
      designation: 'Lead Diabetologist',
      experience: '16 years',
      phone: '+91 98330 66203',
      hospital: 'St. Jude Medical Center',
      status: 'active',
      avatar: 'RV',
      room: 'Room 210 (Metabolic Suite)',
      licenseNo: 'MCI-2008-33109'
    },
    {
      doctorId: 'DOC1004',
      name: 'Dr. Ananya Iyer',
      email: 'ananya.iyer@stjude.hospital.org',
      password: defaultHash,
      department: 'Neurology & Stroke Center',
      departmentId: 'DEP-NEUR',
      designation: 'Consultant Neurologist',
      experience: '11 years',
      phone: '+91 98440 77304',
      hospital: 'St. Jude Medical Center',
      status: 'active',
      avatar: 'AI',
      room: 'Room 402 (Neuro Tower)',
      licenseNo: 'MCI-2013-11928'
    },
    {
      doctorId: 'DOC1005',
      name: 'Dr. Michael Scott, MD',
      email: 'michael.scott@stjude.hospital.org',
      password: defaultHash,
      department: 'Medical Oncology',
      departmentId: 'DEP-ONCO',
      designation: 'Senior Medical Oncologist',
      experience: '20 years',
      phone: '+91 98550 88405',
      hospital: 'St. Jude Medical Center',
      status: 'active',
      avatar: 'MS',
      room: 'Room 501 (Oncology Suite)',
      licenseNo: 'MCI-2004-99201'
    },
    {
      doctorId: 'DOC1006',
      name: 'Dr. Priya Nair',
      email: 'priya.nair@stjude.hospital.org',
      password: defaultHash,
      department: 'Nephrology & Renal Care',
      departmentId: 'DEP-NEPH',
      designation: 'Consultant Nephrologist',
      experience: '12 years',
      phone: '+91 98660 99506',
      hospital: 'St. Jude Medical Center',
      status: 'active',
      avatar: 'PN',
      room: 'Room 305 (Renal Unit)',
      licenseNo: 'MCI-2012-77182'
    },
    {
      doctorId: 'DOC1007',
      name: 'Dr. Vikram Seth',
      email: 'vikram.seth@stjude.hospital.org',
      password: defaultHash,
      department: 'Pulmonology & Respiratory',
      departmentId: 'DEP-PULM',
      designation: 'Chest Physician & Pulmonologist',
      experience: '15 years',
      phone: '+91 98770 11607',
      hospital: 'St. Jude Medical Center',
      status: 'active',
      avatar: 'VS',
      room: 'Room 308 (Thoracic Wing)',
      licenseNo: 'MCI-2009-66194'
    },
    {
      doctorId: 'DOC1008',
      name: 'Dr. Emily Watson, MD',
      email: 'emily.watson@stjude.hospital.org',
      password: defaultHash,
      department: 'Gastroenterology & Hepatology',
      departmentId: 'DEP-GAST',
      designation: 'Consultant Gastroenterologist',
      experience: '13 years',
      phone: '+91 98880 22708',
      hospital: 'St. Jude Medical Center',
      status: 'active',
      avatar: 'EW',
      room: 'Room 112 (Block B)',
      licenseNo: 'MCI-2011-55102'
    },
    {
      doctorId: 'DOC1009',
      name: 'Dr. David Miller',
      email: 'david.miller@stjude.hospital.org',
      password: defaultHash,
      department: 'Orthopedics & Joint Care',
      departmentId: 'DEP-ORTH',
      designation: 'Consultant Orthopedic Surgeon',
      experience: '17 years',
      phone: '+91 98990 33809',
      hospital: 'St. Jude Medical Center',
      status: 'active',
      avatar: 'DM',
      room: 'Room G04 (Surgical Block)',
      licenseNo: 'MCI-2007-44018'
    },
    {
      doctorId: 'DOC1010',
      name: 'Dr. Sunita Rao',
      email: 'sunita.rao@stjude.hospital.org',
      password: defaultHash,
      department: 'Pediatrics & Adolescent Care',
      departmentId: 'DEP-PED',
      designation: 'Lead Pediatrician',
      experience: '19 years',
      phone: '+91 98112 44910',
      hospital: 'St. Jude Medical Center',
      status: 'active',
      avatar: 'SR',
      room: 'Room G12 (Children Wing)',
      licenseNo: 'MCI-2005-22819'
    }
  ];

  // ── 3. Clinical Name Lists & Seed Dictionaries ─────────────────────────────
  const firstNames = [
    'Rajesh', 'Priya', 'Arjun', 'Sunita', 'Vikram', 'Meera', 'Rohan', 'Ananya', 'Suresh', 'Deepa',
    'Amit', 'Kavita', 'Ramesh', 'Pooja', 'Manoj', 'Sneha', 'Naveen', 'Divya', 'Sanjay', 'Geeta',
    'Alok', 'Swati', 'Harish', 'Neha', 'Gaurav', 'Shilpa', 'Rahul', 'Aarti', 'Kiran', 'Pallavi',
    'Vikas', 'Rashmi', 'Pradeep', 'Jyoti', 'Ajay', 'Renu', 'Ashok', 'Seema', 'Santosh', 'Manju',
    'Kishore', 'Anita', 'Dinesh', 'Usha', 'Mukesh', 'Radha', 'Vijay', 'Shashi', 'Gopal', 'Lata',
    'John', 'Mary', 'David', 'Sarah', 'James', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
    'William', 'Elizabeth', 'Richard', 'Barbara', 'Joseph', 'Susan', 'Thomas', 'Jessica', 'Charles', 'Sarah',
    'Christopher', 'Karen', 'Daniel', 'Nancy', 'Matthew', 'Lisa', 'Anthony', 'Betty', 'Mark', 'Margaret',
    'Donald', 'Sandra', 'Steven', 'Ashley', 'Paul', 'Kimberly', 'Andrew', 'Emily', 'Joshua', 'Donna',
    'Kenneth', 'Michelle', 'Kevin', 'Dorothy', 'Brian', 'Carol', 'George', 'Amanda', 'Edward', 'Melissa'
  ];

  const lastNames = [
    'Kumar', 'Sharma', 'Mehta', 'Patel', 'Singh', 'Iyer', 'Reddy', 'Gupta', 'Verma', 'Nair',
    'Joshi', 'Chopra', 'Rao', 'Bose', 'Mishra', 'Deshmukh', 'Saxena', 'Pillai', 'Menon', 'Bhat',
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const cities = ['New Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

  const conditionsPool = [
    { name: 'Type 2 Diabetes Mellitus with Microalbuminuria', cat: 'Endocrine', risk: 'critical', icd: 'E11.69', dr: 'DOC1003' },
    { name: 'Coronary Artery Disease & Post-PCI Stent (LAD)', cat: 'Cardiology', risk: 'critical', icd: 'I25.10', dr: 'DOC1002' },
    { name: 'Heart Failure with Reduced Ejection Fraction (HFrEF 35%)', cat: 'Cardiology', risk: 'critical', icd: 'I50.22', dr: 'DOC1002' },
    { name: 'Chronic Kidney Disease Stage 3b with Hypertension', cat: 'Nephrology', risk: 'critical', icd: 'N18.32', dr: 'DOC1006' },
    { name: 'Severe Refractory Hypertension (Stage 2)', cat: 'Cardiology', risk: 'critical', icd: 'I10', dr: 'DOC1002' },
    { name: 'Persistent Atrial Fibrillation with Tachycardia', cat: 'Cardiology', risk: 'critical', icd: 'I48.1', dr: 'DOC1002' },
    { name: 'Diabetic Foot Ulcer (Wagner Grade 2) with Neuropathy', cat: 'Endocrine', risk: 'critical', icd: 'E11.621', dr: 'DOC1003' },
    { name: 'COPD Gold Group D with Acute Exacerbation', cat: 'Pulmonology', risk: 'critical', icd: 'J44.1', dr: 'DOC1007' },
    { name: 'Non-Alcoholic Steatohepatitis (NASH) with Early Fibrosis', cat: 'Gastroenterology', risk: 'medium', icd: 'K75.81', dr: 'DOC1008' },
    { name: 'Essential Hypertension under Dual Therapy', cat: 'General Medicine', risk: 'medium', icd: 'I10', dr: 'DOC1001' },
    { name: 'Type 2 Diabetes with Adequate Glycemic Control', cat: 'Endocrine', risk: 'low', icd: 'E11.9', dr: 'DOC1003' },
    { name: 'Primary Hypothyroidism under Levothyroxine Replacement', cat: 'Endocrine', risk: 'low', icd: 'E03.9', dr: 'DOC1003' },
    { name: 'Moderate Persistent Asthma with Inhaler Regimen', cat: 'Pulmonology', risk: 'medium', icd: 'J45.40', dr: 'DOC1007' },
    { name: 'Generalized Anxiety Disorder with Somatoform Palpitations', cat: 'General Medicine', risk: 'low', icd: 'F41.1', dr: 'DOC1001' },
    { name: 'Osteoarthritis of Bilateral Knees (Kellgren-Lawrence Grade 3)', cat: 'Orthopedics', risk: 'low', icd: 'M17.0', dr: 'DOC1009' },
    { name: 'Chronic Stable Angina Pectoris (CCS Class II)', cat: 'Cardiology', risk: 'medium', icd: 'I20.9', dr: 'DOC1002' },
    { name: 'Hypercholesterolemia with Elevated LDL-C (182 mg/dL)', cat: 'Cardiology', risk: 'medium', icd: 'E78.00', dr: 'DOC1002' },
    { name: 'Chronic Migraine with Visual Aura', cat: 'Neurology', risk: 'low', icd: 'G43.109', dr: 'DOC1004' }
  ];

  const allergiesPool = [
    ['Penicillin (Anaphylactoid rash)'],
    ['Sulfa Drugs (Stevens-Johnson syndrome risk)'],
    ['Aspirin / NSAIDs (Bronchospasm / Gastritis)'],
    ['Iodinated Radiocontrast Media (Urticaria)'],
    ['ACE Inhibitors (Severe dry cough & angioedema)'],
    ['Codeine / Opioids (Severe nausea & dizziness)'],
    ['Cephalosporins (Urticarial eruptions)'],
    [],
    [],
    []
  ];

  // ── 4. Generate 100 Patients & Associated Records ────────────────────────
  const patients = [];
  const appointments = [];
  const medicalReports = [];
  const investigations = [];
  const followUps = [];
  const aiSummaries = {};
  const notifications = [];
  const auditLogs = [];

  let reportCounter = 1001;
  let apptCounter = 1001;
  let notifCounter = 1001;
  let auditCounter = 1001;

  // Keep original 3 benchmark patients as PAT1001, PAT1002, PAT1003
  const benchmarkPatients = [
    {
      id: 'PAT1001',
      mrn: 'MRN-2024-0891',
      name: 'Rajesh Kumar',
      age: 58,
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '+91 98100 23456',
      emergencyContact: 'Sunita Kumar (Wife): +91 98100 23457',
      address: 'B-402, Green Glen Towers, Outer Ring Road, New Delhi',
      chronicConditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension', 'Diabetic Nephropathy (Early)'],
      allergies: ['Penicillin (Severe cutaneous reaction / rash)'],
      riskLevel: 'critical',
      riskScore: 88,
      condition: 'Type 2 Diabetes + Severe Hypertension + Proteinuria',
      appointmentTime: '10:30 AM (Slot 1)',
      appointmentDate: '2026-09-02',
      room: 'Room 102 (OPD Block A)',
      attendingDoctor: 'Dr. Amit Sharma, MD (General Medicine)',
      assignedDoctorId: 'DOC1001',
      avatar: 'RK',
      lastVisit: '2024-03-15',
      overdueGap: 'eGFR & Urine ACR overdue by 168 days',
      careJourney: [
        { id: 'step-1', name: 'Consultation', status: 'completed', date: '2024-03-15', note: 'Encounter logged by Dr. Amit Sharma.' },
        { id: 'step-2', name: 'Diagnosis', status: 'completed', date: '2024-03-15', note: 'T2DM (E11.69) & Stage 2 HTN (I10) confirmed.' },
        { id: 'step-3', name: 'Treatment', status: 'completed', date: '2024-03-15', note: 'Metformin 1000mg + Glimepiride 2mg + Telmisartan 40mg.' },
        { id: 'step-4', name: 'Investigation', status: 'attention', date: 'Overdue (168d)', note: 'Spot Urine ACR & eGFR calculation overdue.' },
        { id: 'step-5', name: 'Follow-up', status: 'missed', date: '2024-06-15', note: 'Scheduled 3-month follow-up was missed by patient.' },
        { id: 'step-6', name: 'Review', status: 'pending', date: 'Today', note: 'Comprehensive multi-parameter review required.' }
      ]
    },
    {
      id: 'PAT1002',
      mrn: 'MRN-2024-0943',
      name: 'Priya Sharma',
      age: 44,
      gender: 'Female',
      bloodGroup: 'O+',
      phone: '+91 98200 87654',
      emergencyContact: 'Rohan Sharma (Spouse): +91 98200 87655',
      address: 'A-12, Palm Meadows, Whitefield, Bengaluru',
      chronicConditions: ['Primary Hypothyroidism', 'Iron Deficiency Anemia'],
      allergies: ['Sulfa Drugs (Stevens-Johnson syndrome risk)'],
      riskLevel: 'medium',
      riskScore: 62,
      condition: 'Hypothyroidism + Refractory Fatigue + Anemia',
      appointmentTime: '11:15 AM (Slot 2)',
      appointmentDate: '2026-09-02',
      room: 'Room 204 (Cardiac Wing)',
      attendingDoctor: 'Dr. Sarah Chen, MD (Cardiology)',
      assignedDoctorId: 'DOC1002',
      avatar: 'PS',
      lastVisit: '2024-01-20',
      overdueGap: 'Repeat Free T3/T4 & Ferritin panel due',
      careJourney: [
        { id: 'step-1', name: 'Consultation', status: 'completed', date: '2024-01-20', note: 'Routine endocrine follow-up for chronic fatigue.' },
        { id: 'step-2', name: 'Diagnosis', status: 'completed', date: '2024-01-20', note: 'Primary Hypothyroidism (E03.9).' },
        { id: 'step-3', name: 'Treatment', status: 'completed', date: '2024-01-20', note: 'Levothyroxine titrated from 75mcg to 88mcg.' },
        { id: 'step-4', name: 'Investigation', status: 'attention', date: 'Due Today', note: 'Repeat Serum TSH, Free T4, and Ferritin panel needed.' },
        { id: 'step-5', name: 'Follow-up', status: 'completed', date: '2024-01-20', note: 'Follow-up appointment attended.' },
        { id: 'step-6', name: 'Review', status: 'pending', date: 'Today', note: 'Evaluate symptom resolution and medication compliance.' }
      ]
    },
    {
      id: 'PAT1003',
      mrn: 'MRN-2024-1102',
      name: 'Arjun Mehta',
      age: 62,
      gender: 'Male',
      bloodGroup: 'A+',
      phone: '+91 98300 11223',
      emergencyContact: 'Kavita Mehta (Daughter): +91 98300 11224',
      address: 'Flat 301, Silver Arch, Marine Drive, Mumbai',
      chronicConditions: ['Post-CABG (2022)', 'Coronary Artery Disease', 'Dyslipidemia'],
      allergies: ['Aspirin / NSAIDs (Severe gastritis / ulceration)'],
      riskLevel: 'critical',
      riskScore: 92,
      condition: 'CAD + Post-CABG + Exertional Angina & Dyspnea',
      appointmentTime: '12:00 PM (Slot 3)',
      appointmentDate: '2026-09-02',
      room: 'Room 204 (Cardiac Wing)',
      attendingDoctor: 'Dr. Sarah Chen, MD (Cardiology)',
      assignedDoctorId: 'DOC1002',
      avatar: 'AM',
      lastVisit: '2024-02-10',
      overdueGap: '2D Echocardiogram (LVEF assessment) overdue by 120 days',
      careJourney: [
        { id: 'step-1', name: 'Consultation', status: 'completed', date: '2024-02-10', note: 'Cardiology checkup following mild exertional chest pressure.' },
        { id: 'step-2', name: 'Diagnosis', status: 'completed', date: '2024-02-10', note: 'Ischemic Heart Disease with preserved ejection fraction.' },
        { id: 'step-3', name: 'Treatment', status: 'completed', date: '2024-02-10', note: 'Atorvastatin 40mg + Clopidogrel 75mg + Metoprolol 50mg.' },
        { id: 'step-4', name: 'Investigation', status: 'attention', date: 'Overdue (120d)', note: 'Follow-up 2D Echo & Stress Myocardial Perfusion overdue.' },
        { id: 'step-5', name: 'Follow-up', status: 'completed', date: '2024-02-10', note: 'Previous appointment completed.' },
        { id: 'step-6', name: 'Review', status: 'pending', date: 'Today', note: 'Urgent evaluation for ischemia recurrence.' }
      ]
    }
  ];

  // Add benchmark patients to full list
  benchmarkPatients.forEach(p => patients.push(p));

  // Generate 97 more realistic patients to reach exactly 100
  for (let i = 4; i <= 100; i++) {
    const patientId = `PAT${1000 + i}`;
    const mrn = `MRN-2024-${String(1000 + i).padStart(4, '0')}`;
    const fn = firstNames[(i - 1) % firstNames.length];
    const ln = lastNames[(i - 1 + Math.floor(i / 3)) % lastNames.length];
    const name = `${fn} ${ln}`;
    const age = 22 + ((i * 7) % 63);
    const gender = i % 2 === 0 ? 'Male' : 'Female';
    const bloodGroup = bloodGroups[i % bloodGroups.length];
    const city = cities[i % cities.length];
    const condObj = conditionsPool[(i - 1) % conditionsPool.length];
    const allergies = allergiesPool[i % allergiesPool.length];
    
    // Determine risk: 25 Critical, 45 Medium, 30 Low
    let riskLevel = 'low';
    let riskScore = 20 + ((i * 3) % 40);
    if (i <= 25 || condObj.risk === 'critical') {
      riskLevel = 'critical';
      riskScore = 75 + (i % 22);
    } else if (i <= 70 || condObj.risk === 'medium') {
      riskLevel = 'medium';
      riskScore = 50 + (i % 25);
    }

    const assignedDoctor = doctors.find(d => d.doctorId === condObj.dr) || doctors[i % doctors.length];
    const appointmentTime = `${8 + (i % 8)}:${(i % 4) * 15 === 0 ? '00' : (i % 4) * 15} ${i % 8 >= 4 ? 'PM' : 'AM'}`;

    const careJourney = [
      { id: 'step-1', name: 'Consultation', status: 'completed', date: '2024-04-10', note: `Encounter logged by ${assignedDoctor.name}.` },
      { id: 'step-2', name: 'Diagnosis', status: 'completed', date: '2024-04-10', note: `${condObj.name} (${condObj.icd}).` },
      { id: 'step-3', name: 'Treatment', status: 'completed', date: '2024-04-10', note: 'Clinical medication regimen initiated.' },
      { id: 'step-4', name: 'Investigation', status: riskLevel === 'critical' ? 'attention' : (i % 3 === 0 ? 'pending' : 'completed'), date: riskLevel === 'critical' ? 'Urgent Review' : 'Scheduled', note: 'Diagnostic evaluation in progress.' },
      { id: 'step-5', name: 'Follow-up', status: riskLevel === 'critical' ? (i % 2 === 0 ? 'missed' : 'attention') : 'pending', date: '2026-09-10', note: 'Scheduled outpatient review.' },
      { id: 'step-6', name: 'Review', status: 'pending', date: 'Today', note: 'Attending physician evaluation.' }
    ];

    const pData = {
      id: patientId,
      mrn,
      name,
      age,
      gender,
      bloodGroup,
      phone: `+91 ${98000 + i} ${10000 + i * 17}`,
      emergencyContact: `Family Contact: +91 ${98000 + i} ${50000 + i * 19}`,
      address: `Flat ${101 + i}, Sector ${1 + (i % 25)}, ${city}`,
      chronicConditions: [condObj.name],
      allergies,
      riskLevel,
      riskScore,
      condition: condObj.name,
      appointmentTime,
      appointmentDate: i % 3 === 0 ? '2026-09-02' : i % 3 === 1 ? '2026-09-03' : '2026-09-04',
      room: assignedDoctor.room,
      attendingDoctor: `${assignedDoctor.name} (${assignedDoctor.department})`,
      assignedDoctorId: assignedDoctor.doctorId,
      avatar: `${fn[0]}${ln[0]}`,
      lastVisit: `2024-0${1 + (i % 5)}-${10 + (i % 18)}`,
      overdueGap: riskLevel === 'critical' ? `Care Gap: Diagnostic protocol & follow-up overdue` : 'Routine monitoring',
      careJourney
    };

    patients.push(pData);
  }

  // ── 5. Generate 250 Appointments ─────────────────────────────────────────
  for (let a = 1; a <= 250; a++) {
    const p = patients[(a - 1) % patients.length];
    const d = doctors.find(doc => doc.doctorId === p.assignedDoctorId) || doctors[a % doctors.length];
    const apptId = `APT${apptCounter++}`;
    
    // 80 Today, 70 Tomorrow, 100 Past/Upcoming
    let apptDate = '2026-09-02';
    let status = 'scheduled';
    if (a <= 80) {
      apptDate = '2026-09-02';
      status = a <= 25 ? 'in-progress' : a <= 50 ? 'scheduled' : 'completed';
    } else if (a <= 150) {
      apptDate = '2026-09-03';
      status = 'scheduled';
    } else {
      apptDate = `2026-0${8 + (a % 2)}-${10 + (a % 15)}`;
      status = a % 5 === 0 ? 'missed' : 'completed';
    }

    appointments.push({
      appointmentId: apptId,
      patientId: p.id,
      patientName: p.name,
      mrn: p.mrn,
      doctorId: d.doctorId,
      doctorName: d.name,
      department: d.department,
      appointmentDate: apptDate,
      appointmentTime: p.appointmentTime,
      status,
      reason: p.condition,
      room: d.room
    });
  }

  // ── 6. Generate 150 Medical Reports ──────────────────────────────────────
  const reportTypes = ['Laboratory Blood Panel', '12-Lead ECG Tracing', '2D Echocardiogram Doppler', 'Chest Radiograph (X-Ray)', 'Clinical OPD Prescription', 'Urinalysis & Microalbumin'];
  for (let r = 1; r <= 150; r++) {
    const p = patients[(r - 1) % patients.length];
    const rType = reportTypes[(r - 1) % reportTypes.length];
    const reportId = `REP${reportCounter++}`;

    medicalReports.push({
      reportId,
      patientId: p.id,
      patientName: p.name,
      mrn: p.mrn,
      reportType: rType,
      uploadedFile: `${p.name.replace(/\s+/g, '_')}_${rType.replace(/[\s\(\)\-\/]+/g, '_')}_2024.pdf`,
      OCRText: `Extracted clinical report text for patient ${p.name} (${p.mrn}). Diagnostic findings consistent with active condition: ${p.condition}. Biomarker measurements extracted and evaluated under clinical safety thresholds.`,
      uploadedDate: `2024-0${1 + (r % 6)}-${10 + (r % 18)}`,
      verifiedBy: p.attendingDoctor
    });
  }

  // ── 7. Generate 50 Pending Investigations ─────────────────────────────────
  const invPool = [
    { name: 'Spot Urine Albumin-to-Creatinine Ratio (ACR)', urgency: 'critical', ref: 'KDIGO 2024 CKD Screening Guideline', reason: 'Assess progression of diabetic kidney disease and glomerular permeability.' },
    { name: 'Estimated Glomerular Filtration Rate (eGFR) & Serum Creatinine', urgency: 'critical', ref: 'KDIGO / ADA 2024 Consensus', reason: 'Renal clearance staging and nephrotoxic drug dosing adjustment.' },
    { name: 'Transthoracic 2D Echocardiogram with Doppler', urgency: 'critical', ref: 'AHA/ACC 2023 Heart Failure Guidelines', reason: 'Evaluate Left Ventricular Ejection Fraction (LVEF) and wall motion abnormalities.' },
    { name: 'Glycated Hemoglobin (HbA1c) Multi-Encounter Panel', urgency: 'high', ref: 'ADA Standards of Medical Care in Diabetes', reason: 'Measure 90-day glycemic control trajectory and assess oral therapy failure.' },
    { name: 'Annual Dilated Fundoscopic Retinal Screening', urgency: 'high', ref: 'ADA 2024 Diabetic Retinopathy Protocol', reason: 'Detect early microaneurysms and proliferative diabetic retinopathy.' },
    { name: '24-Hour Ambulatory Blood Pressure Monitoring (ABPM)', urgency: 'medium', ref: 'ACC/AHA Hypertension Practice Guidelines', reason: 'Confirm nocturnal non-dipping hypertension and assess cardiovascular risk.' },
    { name: 'Complete Fasting Lipid Fraction Profile (Direct LDL-C, ApoB)', urgency: 'medium', ref: 'NLA 2023 Dyslipidemia Guidelines', reason: 'Atherosclerotic cardiovascular disease (ASCVD) risk recalculation.' },
    { name: 'Thyroid Function Test (Serum TSH, Free T3, Free T4)', urgency: 'medium', ref: 'ATA 2023 Hypothyroidism Guidelines', reason: 'Titrate Levothyroxine replacement dose for persistent fatigue.' },
    { name: 'Spirometry & Pre/Post Bronchodilator Pulmonary Function', urgency: 'high', ref: 'GOLD 2024 COPD Strategy', reason: 'Stage airflow limitation (FEV1/FVC) and monitor airway responsiveness.' }
  ];

  for (let inv = 1; inv <= 50; inv++) {
    const p = patients[(inv * 2 - 1) % patients.length];
    const invObj = invPool[(inv - 1) % invPool.length];

    investigations.push({
      investigationId: `INV${1000 + inv}`,
      patientId: p.id,
      patientName: p.name,
      mrn: p.mrn,
      investigationName: invObj.name,
      status: inv <= 25 ? 'attention' : 'pending',
      urgency: invObj.urgency,
      dueDate: inv <= 15 ? 'Overdue (Audit Required)' : 'Due in 7 Days',
      reason: invObj.reason,
      guidelineRef: invObj.ref,
      basedOnCondition: p.condition,
      orderedBy: p.attendingDoctor
    });
  }

  // ── 8. Generate 40 Follow-ups ─────────────────────────────────────────────
  for (let f = 1; f <= 40; f++) {
    const p = patients[(f * 2) % patients.length];
    const isOverdue = f <= 18;

    followUps.push({
      followUpId: `FOL${1000 + f}`,
      patientId: p.id,
      patientName: p.name,
      mrn: p.mrn,
      followUpDate: isOverdue ? '2024-06-15 (Overdue)' : '2026-09-15',
      status: isOverdue ? 'overdue' : 'scheduled',
      assignedDoctor: p.attendingDoctor,
      assignedDoctorId: p.assignedDoctorId,
      reason: `Interval follow-up for ${p.condition}`,
      contactStatus: isOverdue ? 'Pending Tele-Recall' : 'Confirmed'
    });
  }

  // ── 9. Populate AI Summaries for Patients ─────────────────────────────────
  // Detailed summaries for benchmark patients
  aiSummaries['PAT1001'] = {
    patientId: 'PAT1001',
    patient: {
      name: 'Rajesh Kumar',
      age: 58,
      gender: 'Male',
      bloodGroup: 'B+',
      allergies: ['Penicillin (Severe cutaneous reaction / rash)']
    },
    aiMeta: {
      generatedDate: '2026-09-02',
      confidenceScore: 94,
      modelUsed: 'Google Gemini 3.6 Flash (Clinical Multimodal Engine)'
    },
    summary: {
      oneLiner: '58-year-old male with poorly controlled Type 2 Diabetes (HbA1c 9.3%), Stage 2 Hypertension (168/102 mmHg), and accelerating proteinuria.',
      chiefComplaint: 'Presents for scheduled evaluation. Complains of bilateral lower-extremity pitting edema, nocturia (3x/night), and persistent mid-afternoon fatigue over the last 6 weeks.',
      clinicalSummary: 'Patient presents with severe metabolic and vascular risk. Fasting blood glucose remains elevated at 188 mg/dL with HbA1c trending upwards from 7.8% (2023) to 9.3% (2024) despite dual oral therapy (Metformin 1000mg BID + Glimepiride 2mg OD). Blood pressure is uncontrolled at 168/102 mmHg on Telmisartan 40mg monotherapy. Proteinuria is positive on dipstick (2+), indicating early glomerular microvascular damage.',
      keyFindings: [
        'HbA1c elevated at 9.3% — oral hypoglycemic regimen failure',
        'Severe Stage 2 Hypertension: 168/102 mmHg (Goal <130/80 mmHg per ACC/AHA)',
        'Positive proteinuria (2+) with Spot Urine ACR & eGFR overdue by 168 days',
        'Documented severe allergy to Penicillin — Beta-lactam antibiotics strictly contraindicated'
      ],
      actionItems: [
        'Order urgent spot Urine Albumin-to-Creatinine Ratio (ACR) and serum eGFR calculation today.',
        'Evaluate transition to Basal Insulin therapy (10 units bedtime) or GLP-1 RA due to oral agent failure.',
        'Titrate antihypertensive therapy to achieve goal BP <130/80 mmHg (consider adding low-dose Chlorthalidone 12.5mg).',
        'Schedule urgent dilated ophthalmological screening for diabetic retinopathy.',
        'Reinforce Penicillin allergy contraindication across all electronic chart orders.'
      ]
    },
    entities: {
      vitals: [
        { type: 'Blood Pressure', value: '168/102', unit: 'mmHg', reference: '<130/80', status: 'critical', date: '2024-03-15' },
        { type: 'Heart Rate', value: '88', unit: 'bpm', reference: '60-100', status: 'normal', date: '2024-03-15' },
        { type: 'Respiratory Rate', value: '18', unit: 'bpm', reference: '12-20', status: 'normal', date: '2024-03-15' },
        { type: 'Body Mass Index', value: '29.4', unit: 'kg/m²', reference: '18.5-24.9', status: 'abnormal', date: '2024-03-15' }
      ],
      diagnoses: [
        { name: 'Type 2 Diabetes Mellitus with Hyperglycemia', icd: 'E11.69', date: '2018-04-12', status: 'active' },
        { name: 'Essential Stage 2 Hypertension', icd: 'I10', date: '2020-09-18', status: 'active' },
        { name: 'Diabetic Nephropathy (Suspected Early Stage)', icd: 'N08.3', date: '2024-03-15', status: 'suspected' }
      ],
      medications: [
        { name: 'Metformin Hydrochloride', dose: '1000mg', frequency: 'Twice daily (after meals)', change: 'continued', date: '2024-03-15' },
        { name: 'Glimepiride', dose: '2mg', frequency: 'Once daily (before breakfast)', change: 'continued', date: '2024-03-15' },
        { name: 'Telmisartan', dose: '40mg', frequency: 'Once daily (morning)', change: 'dose-changed', date: '2024-03-15' },
        { name: 'Atorvastatin', dose: '20mg', frequency: 'Once daily (at bedtime)', change: 'continued', date: '2024-03-15' }
      ],
      labResults: [
        { test: 'HbA1c (Glycated Hemoglobin)', value: '9.3', unit: '%', reference: '<5.7% (Goal <7.0%)', status: 'critical', date: '2024-03-15' },
        { test: 'Fasting Plasma Glucose', value: '188', unit: 'mg/dL', reference: '70-99', status: 'critical', date: '2024-03-15' },
        { test: 'Postprandial Plasma Glucose', value: '264', unit: 'mg/dL', reference: '<140', status: 'critical', date: '2024-03-15' },
        { test: 'Serum Creatinine', value: '1.28', unit: 'mg/dL', reference: '0.74-1.35', status: 'borderline', date: '2024-03-15' },
        { test: 'Urine Protein (Dipstick)', value: '2+', unit: 'qualitative', reference: 'Negative', status: 'abnormal', date: '2024-03-15' }
      ],
      symptoms: [
        { description: 'Bilateral mild ankle pitting edema', date: '2024-03-15', severity: 'moderate' },
        { description: 'Nocturia (3-4 times per night)', date: '2024-03-15', severity: 'moderate' },
        { description: 'Chronic afternoon lethargy and polyuria', date: '2024-03-15', severity: 'mild' }
      ]
    },
    timeline: [
      { date: '2024-03-15', event: 'Outpatient Clinical Consultation', type: 'visit', detail: 'BP elevated at 168/102 mmHg; Telmisartan maintained at 40mg. Follow-up lab panel ordered.', significance: 'critical' },
      { date: '2024-03-15', event: 'Laboratory Pathology Report', type: 'lab', detail: 'HbA1c escalated to 9.3% with Fasting Glucose 188 mg/dL. Dipstick proteinuria 2+ detected.', significance: 'critical' },
      { date: '2023-08-20', event: 'Previous Outpatient Review', type: 'visit', detail: 'HbA1c was 8.1%, BP 152/94 mmHg. Metformin increased to 1000mg BID.', significance: 'important' },
      { date: '2023-01-14', event: 'Annual Diabetic Retinopathy Screen', type: 'procedure', detail: 'Mild non-proliferative diabetic retinopathy (NPDR) noted bilaterally.', significance: 'important' },
      { date: '2020-09-18', event: 'Hypertension Diagnosis Confirmed', type: 'visit', detail: 'Initial BP 158/96 mmHg; initiated on Telmisartan 40mg once daily.', significance: 'normal' }
    ],
    clinicalChanges: [
      {
        parameter: 'Glycated Hemoglobin (HbA1c)',
        previous: { value: '7.8%', date: '2023-01-14' },
        mid: { value: '8.1%', date: '2023-08-20' },
        current: { value: '9.3%', date: '2024-03-15' },
        changeType: 'increased',
        magnitude: '+1.5% absolute (+19.2% relative)',
        direction: 'worsening',
        clinicalSignificance: 'Severe failure of dual oral therapy; microvascular complication risk elevated 3.2x.'
      },
      {
        parameter: 'Systolic Blood Pressure (SBP)',
        previous: { value: '142 mmHg', date: '2023-01-14' },
        mid: { value: '152 mmHg', date: '2023-08-20' },
        current: { value: '168 mmHg', date: '2024-03-15' },
        changeType: 'increased',
        magnitude: '+26 mmHg shift',
        direction: 'worsening',
        clinicalSignificance: 'Progression from Stage 1 to uncontrolled Stage 2 Hypertension.'
      },
      {
        parameter: 'Fasting Plasma Glucose',
        previous: { value: '138 mg/dL', date: '2023-01-14' },
        mid: { value: '156 mg/dL', date: '2023-08-20' },
        current: { value: '188 mg/dL', date: '2024-03-15' },
        changeType: 'increased',
        magnitude: '+50 mg/dL elevation',
        direction: 'worsening',
        clinicalSignificance: 'Persistent fasting hepatic gluconeogenesis unsuppressed by oral agents.'
      }
    ],
    missingInvestigations: [
      { test: 'Spot Urine Albumin-to-Creatinine Ratio (ACR)', urgency: 'critical', basedOnCondition: 'Type 2 Diabetes Mellitus with Proteinuria', lastDone: 'Never in EHR', guidelineRef: 'KDIGO 2024 / ADA Standards of Care', reason: 'Mandatory annual screening to quantify albuminuria and stage early diabetic nephropathy.' },
      { test: 'Estimated Glomerular Filtration Rate (eGFR) Calculation', urgency: 'critical', basedOnCondition: 'Stage 2 Hypertension + Elevated Creatinine (1.28)', lastDone: '2023-01-14 (168 days overdue)', guidelineRef: 'KDIGO 2024 Guideline for CKD Staging', reason: 'Assess renal functional reserve before adjusting medication doses.' },
      { test: 'Annual Dilated Retinal Eye Examination', urgency: 'high', basedOnCondition: 'Type 2 Diabetes (Duration >5 years)', lastDone: '2023-01-14 (Overdue)', guidelineRef: 'ADA 2024 Retinopathy Protocol', reason: 'Assess progression of mild non-proliferative diabetic retinopathy (NPDR).' }
    ],
    riskFlags: [
      { id: 'rf-101', risk: 'Uncontrolled Glycemia & Regimen Failure', severity: 'critical', confidence: '96%', reason: 'HbA1c escalation to 9.3% on maximal dual oral therapy indicates beta-cell exhaustion.', evidence: 'HbA1c 9.3%, Fasting Glucose 188 mg/dL, Postprandial 264 mg/dL', sourceDocument: 'Pathology_Report_March2024.pdf', date: '2024-03-15', recommendation: 'Initiate basal insulin (10 IU glargine bedtime) or GLP-1 receptor agonist.' },
      { id: 'rf-102', risk: 'Accelerated Diabetic Nephropathy Progression', severity: 'critical', confidence: '92%', reason: 'Concurrent severe hypertension (168/102) and 2+ proteinuria accelerates eGFR decline.', evidence: 'BP 168/102 mmHg, Proteinuria 2+, Creatinine 1.28 mg/dL', sourceDocument: 'Clinical_Vitals_March2024.pdf', date: '2024-03-15', recommendation: 'Optimize RAS blockade with Telmisartan 80mg and obtain quantitative Urine ACR.' }
    ]
  };

  // Generate generic AI summaries for all other patients
  patients.forEach(p => {
    if (aiSummaries[p.id]) return;
    
    aiSummaries[p.id] = {
      patientId: p.id,
      patient: {
        name: p.name,
        age: p.age,
        gender: p.gender,
        bloodGroup: p.bloodGroup,
        allergies: p.allergies
      },
      aiMeta: {
        generatedDate: '2026-09-02',
        confidenceScore: 88 + (p.riskScore % 10),
        modelUsed: 'Google Gemini 3.6 Flash (Clinical Multimodal Engine)'
      },
      summary: {
        oneLiner: `${p.age}-year-old ${p.gender.toLowerCase()} presenting with ${p.condition}. Overall clinical triage: ${p.riskLevel.toUpperCase()}.`,
        chiefComplaint: `Follow-up evaluation for ${p.condition}. Patient reports baseline functional status with intermittent symptomatic episodes.`,
        clinicalSummary: `Patient record synthesized across multi-source clinical documents. Diagnosed with ${p.condition}. Active vital signs and laboratory biomarkers evaluated against clinical practice guidelines. Attending physician review recommended.`,
        keyFindings: [
          `Active diagnosis: ${p.condition}`,
          `Triage risk score: ${p.riskScore}/100 (${p.riskLevel.toUpperCase()})`,
          `Attending physician: ${p.attendingDoctor}`,
          `Allergies documented: ${p.allergies.length > 0 ? p.allergies.join(', ') : 'None'}`
        ],
        actionItems: [
          `Review patient response to current ${p.condition} therapy.`,
          `Assess vital signs and evaluate need for diagnostic investigation orders.`,
          `Reconcile active medications and update electronic chart orders.`
        ]
      },
      entities: {
        vitals: [
          { type: 'Blood Pressure', value: p.riskLevel === 'critical' ? '164/98' : '128/82', unit: 'mmHg', reference: '<130/80', status: p.riskLevel === 'critical' ? 'critical' : 'normal', date: '2024-04-10' },
          { type: 'Heart Rate', value: '76', unit: 'bpm', reference: '60-100', status: 'normal', date: '2024-04-10' },
          { type: 'SpO2', value: '98', unit: '%', reference: '95-100', status: 'normal', date: '2024-04-10' },
          { type: 'BMI', value: '26.8', unit: 'kg/m²', reference: '18.5-24.9', status: 'normal', date: '2024-04-10' }
        ],
        diagnoses: [
          { name: p.condition, icd: 'Z00.00', date: '2024-01-10', status: 'active' }
        ],
        medications: [
          { name: 'Standard Maintenance Therapy', dose: 'Standard', frequency: 'Daily', change: 'continued', date: '2024-04-10' }
        ],
        labResults: [
          { test: 'Comprehensive Metabolic Panel', value: 'Evaluated', unit: 'mg/dL', reference: 'Normal', status: p.riskLevel === 'critical' ? 'abnormal' : 'normal', date: '2024-04-10' }
        ],
        symptoms: [
          { description: 'Active clinical presentation related to ' + p.condition, date: '2024-04-10', severity: p.riskLevel === 'critical' ? 'moderate' : 'mild' }
        ]
      },
      timeline: [
        { date: '2024-04-10', event: 'Clinical Consultation', type: 'visit', detail: `Encounter with ${p.attendingDoctor}. Evaluation of ${p.condition}.`, significance: p.riskLevel === 'critical' ? 'critical' : 'normal' }
      ],
      clinicalChanges: [
        {
          parameter: 'Primary Biomarker Trend',
          previous: { value: 'Baseline', date: '2023-10-10' },
          current: { value: p.riskLevel === 'critical' ? 'Elevated' : 'Stable', date: '2024-04-10' },
          changeType: p.riskLevel === 'critical' ? 'increased' : 'stable',
          magnitude: p.riskLevel === 'critical' ? '+18%' : '±0%',
          direction: p.riskLevel === 'critical' ? 'worsening' : 'stable',
          clinicalSignificance: 'Evaluated under clinical practice guidelines.'
        }
      ],
      missingInvestigations: [
        { test: 'Standard Periodic Panel', urgency: p.riskLevel === 'critical' ? 'critical' : 'medium', basedOnCondition: p.condition, lastDone: 'Overdue', guidelineRef: 'Clinical Guideline', reason: 'Routine care protocol.' }
      ],
      riskFlags: p.riskLevel === 'critical' ? [
        { id: `rf-${p.id}`, risk: `Elevated Acute Risk for ${p.condition}`, severity: 'critical', confidence: '91%', reason: 'Biomarker escalation exceeds safety threshold.', evidence: 'Recorded in EHR', sourceDocument: 'Medical_Extract_2024.pdf', date: '2024-04-10', recommendation: 'Review therapy and schedule urgent follow-up.' }
      ] : []
    };
  });

  // ── 10. Generate Notifications ───────────────────────────────────────────
  doctors.forEach(doc => {
    // Critical alert
    notifications.push({
      notificationId: `NOT${notifCounter++}`,
      doctorId: doc.doctorId,
      title: '🚨 Critical Triage Alert',
      message: `Patient under ${doc.department} requires immediate review (elevated biomarker trajectory).`,
      priority: 'high',
      isRead: false,
      createdAt: '2026-09-02T08:30:00Z',
      type: 'critical_patient'
    });

    // Overdue test alert
    notifications.push({
      notificationId: `NOT${notifCounter++}`,
      doctorId: doc.doctorId,
      title: '⏰ Overdue Investigation Follow-up',
      message: `2 diagnostic orders pending completion in ${doc.department}.`,
      priority: 'medium',
      isRead: false,
      createdAt: '2026-09-02T09:00:00Z',
      type: 'investigation_pending'
    });

    // Welcome note
    notifications.push({
      notificationId: `NOT${notifCounter++}`,
      doctorId: doc.doctorId,
      title: '🏥 Clinical Shift Initialized',
      message: `Good Morning, ${doc.name}. Outpatient worklist queue synchronized with hospital EHR.`,
      priority: 'low',
      isRead: true,
      createdAt: '2026-09-02T07:45:00Z',
      type: 'system_info'
    });
  });

  // ── 11. Generate Initial Audit Logs ───────────────────────────────────────
  for (let l = 1; l <= 20; l++) {
    const doc = doctors[l % doctors.length];
    const p = patients[l % patients.length];
    auditLogs.push({
      logId: `AUD${auditCounter++}`,
      doctorId: doc.doctorId,
      doctorName: doc.name,
      patientId: p.id,
      patientName: p.name,
      mrn: p.mrn,
      action: l % 3 === 0 ? 'CHART_OPENED' : l % 3 === 1 ? 'ORDER_PLACED' : 'DIRECTIVE_SIGNED',
      details: l % 3 === 0 ? 'Opened full electronic health brief' : l % 3 === 1 ? 'Created laboratory diagnostic requisition' : 'Verified Next-Action directive',
      timestamp: `2026-09-02T09:${10 + l}:00Z`
    });
  }

  const database = {
    metadata: {
      hospitalName: 'St. Jude Medical Center',
      system: 'Consult 360 AI Hospital Information System (HIS)',
      version: '2.4.0',
      generatedAt: new Date().toISOString(),
      counts: {
        doctors: doctors.length,
        patients: patients.length,
        appointments: appointments.length,
        medicalReports: medicalReports.length,
        investigations: investigations.length,
        followUps: followUps.length,
        highRiskPatients: patients.filter(p => p.riskLevel === 'critical').length,
        departments: departments.length
      }
    },
    departments,
    doctors,
    patients,
    appointments,
    medicalReports,
    investigations,
    followUps,
    aiSummaries,
    notifications,
    auditLogs
  };

  const dbDir = path.join(__dirname, '..', 'db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const outputPath = path.join(dbDir, 'hospitalData.json');
  fs.writeFileSync(outputPath, JSON.stringify(database, null, 2), 'utf-8');
  console.log(`[HIS Seed] ✅ Successfully generated hospital database: ${outputPath}`);
  console.log(`[HIS Seed] Doctors: ${doctors.length} | Patients: ${patients.length} | Appointments: ${appointments.length} | Reports: ${medicalReports.length}`);
  
  return database;
}

if (require.main === module) {
  generateHospitalDatabase();
}

module.exports = { generateHospitalDatabase };
