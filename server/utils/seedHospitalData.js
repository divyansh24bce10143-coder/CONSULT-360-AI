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

  const cities = ['New Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

  const allergiesPool = [
    ['Penicillin (Severe cutaneous reaction / rash)'],
    ['Sulfa Drugs (Stevens-Johnson syndrome risk)'],
    ['Aspirin / NSAIDs (Severe gastritis / ulceration)'],
    ['Iodinated Radiocontrast Media (Urticaria)'],
    ['ACE Inhibitors (Severe dry cough & angioedema)'],
    ['Codeine / Opioids (Severe nausea & dizziness)'],
    ['Cephalosporins (Urticarial eruptions)'],
    [],
    [],
    []
  ];

  // ── 3. Doctor-Specific Clinical Cohort Definitions (10 Patients per Doctor) ─
  const doctorCohorts = {

    'DOC1001': { // Dr. Amit Sharma — General Medicine
      dept: 'General Medicine',
      patients: [
        { name: 'Rajesh Kumar', age: 58, gender: 'Male', blood: 'B+', risk: 'critical', score: 88, cond: 'Type 2 Diabetes + Severe Hypertension + Proteinuria', overdue: 'eGFR & Urine ACR overdue by 168 days' },
        { name: 'Ramesh Gupta', age: 52, gender: 'Male', blood: 'O+', risk: 'critical', score: 82, cond: 'Severe Metabolic Syndrome & Chronic Fatigue', overdue: 'Comprehensive Lipid & Fasting Insulin due' },
        { name: 'Pooja Joshi', age: 39, gender: 'Female', blood: 'A+', risk: 'medium', score: 64, cond: 'Refractory Iron Deficiency Anemia & Hypovitaminosis D', overdue: 'Serum Ferritin & Iron Studies overdue by 45 days' },
        { name: 'Dinesh Deshmukh', age: 46, gender: 'Male', blood: 'AB+', risk: 'critical', score: 85, cond: 'Pyrexia of Unknown Origin (PUO) & Infective Mononucleosis', overdue: 'Autoimmune & Infectious Serology panel pending' },
        { name: 'Seema Saxena', age: 41, gender: 'Female', blood: 'B-', risk: 'low', score: 35, cond: 'Generalized Anxiety with Somatoform Palpitations', overdue: 'Holter Monitoring completed; routine review' },
        { name: 'James Wilson', age: 64, gender: 'Male', blood: 'O-', risk: 'critical', score: 89, cond: 'Multi-morbidity: T2DM + Dyslipidemia + Gouty Arthritis', overdue: 'Serum Uric Acid & HbA1c panel overdue by 90 days' },
        { name: 'Barbara Taylor', age: 67, gender: 'Female', blood: 'A-', risk: 'medium', score: 68, cond: 'Polymyalgia Rheumatica & Temporal Arteritis Evaluation', overdue: 'ESR & CRP inflammatory markers due today' },
        { name: 'Matthew Thomas', age: 55, gender: 'Male', blood: 'B+', risk: 'medium', score: 60, cond: 'Resistant Hypertension under Triple Drug Regimen', overdue: '24-hour Ambulatory Blood Pressure Monitoring due' },
        { name: 'Amanda Martin', age: 33, gender: 'Female', blood: 'O+', risk: 'low', score: 28, cond: 'Chronic Sinusitis & Bronchial Hyperreactivity', overdue: 'Allergy profile complete; follow-up scheduled' },
        { name: 'Harold Finch', age: 74, gender: 'Male', blood: 'AB-', risk: 'critical', score: 91, cond: 'Geriatric Polypharmacy & Orthostatic Hypotension', overdue: 'Medication Reconciliation & Fall Risk Audit overdue' }
      ]
    },
    'DOC1002': { // Dr. Sarah Chen — Cardiology
      dept: 'Cardiology',
      patients: [
        { name: 'Priya Sharma', age: 44, gender: 'Female', blood: 'O+', risk: 'medium', score: 62, cond: 'Hypothyroidism + Refractory Fatigue & Post-Viral Fatigue', overdue: 'Repeat Free T3/T4 & Ferritin panel due' },
        { name: 'Arjun Mehta', age: 62, gender: 'Male', blood: 'A+', risk: 'critical', score: 92, cond: 'CAD + Post-CABG + Exertional Angina & Dyspnea', overdue: '2D Echocardiogram (LVEF) overdue by 120 days' },
        { name: 'Vikram Reddy', age: 59, gender: 'Male', blood: 'B+', risk: 'critical', score: 94, cond: 'Heart Failure with Reduced Ejection Fraction (HFrEF 35%)', overdue: 'NT-proBNP & Potassium monitoring overdue by 30 days' },
        { name: 'Sneha Chopra', age: 66, gender: 'Female', blood: 'AB+', risk: 'critical', score: 87, cond: 'Persistent Atrial Fibrillation with Rapid Ventricular Rate', overdue: 'INR / DOAC compliance check & Holter overdue' },
        { name: 'Ajay Mishra', age: 53, gender: 'Male', blood: 'O+', risk: 'medium', score: 65, cond: 'Post-PCI Drug-Eluting Stent (LAD) & Dyslipidemia', overdue: 'Stress Myocardial Perfusion scan scheduled' },
        { name: 'Kishore Bhat', age: 61, gender: 'Male', blood: 'A-', risk: 'critical', score: 86, cond: 'Severe Refractory Stage 2 Hypertension with LVH', overdue: 'Renal Artery Doppler ultrasound overdue' },
        { name: 'Robert Martinez', age: 71, gender: 'Male', blood: 'B-', risk: 'critical', score: 90, cond: 'Severe Calcific Aortic Valve Stenosis with Syncope', overdue: 'Transesophageal Echo (TEE) awaiting schedule' },
        { name: 'Nancy Davis', age: 48, gender: 'Female', blood: 'O-', risk: 'medium', score: 58, cond: 'Non-obstructive Hypertrophic Cardiomyopathy (HCM)', overdue: 'Genetic cardiac panel & annual Holter due' },
        { name: 'Christopher Gonzalez', age: 56, gender: 'Male', blood: 'AB-', risk: 'medium', score: 63, cond: 'Frequent Premature Ventricular Contractions & Non-sustained VT', overdue: 'Electrophysiology (EP) consult pending' },
        { name: 'Steven Anderson', age: 60, gender: 'Male', blood: 'A+', risk: 'critical', score: 88, cond: 'Severe Hypercholesterolemia (LDL 195) & CAC Score 480', overdue: 'Coronary CT Angiography overdue by 60 days' }
      ]
    },
    'DOC1003': { // Dr. Rajesh Verma — Endocrinology
      dept: 'Endocrinology & Diabetology',
      patients: [
        { name: 'Meera Iyer', age: 28, gender: 'Female', blood: 'A+', risk: 'critical', score: 84, cond: 'Type 1 Diabetes on Continuous Glucose Monitor & Basal-Bolus', overdue: 'CGM Time-in-Range audit & Microalbumin due' },
        { name: 'Manoj Pillai', age: 63, gender: 'Male', blood: 'B+', risk: 'critical', score: 95, cond: 'Diabetic Foot Ulcer (Wagner Grade 2) with Neuropathy', overdue: 'Vascular Doppler & Wound Culture overdue by 14 days' },
        { name: 'Alok Bose', age: 51, gender: 'Male', blood: 'O+', risk: 'critical', score: 90, cond: 'Uncontrolled Type 2 Diabetes (HbA1c 10.4%) on Dual Oral Failure', overdue: 'Basal Insulin titration & Retinal screen overdue' },
        { name: 'Jyoti Menon', age: 42, gender: 'Female', blood: 'AB+', risk: 'medium', score: 55, cond: 'Hashimoto Autoimmune Thyroiditis with Elevated Anti-TPO', overdue: 'Thyroid Ultrasound & Free T4 monitoring due' },
        { name: 'David Johnson', age: 49, gender: 'Male', blood: 'B-', risk: 'critical', score: 86, cond: 'Pituitary Cushing Disease with Secondary Hypertension', overdue: '24-hour Urinary Free Cortisol & ACTH panel overdue' },
        { name: 'Patricia Rodriguez', age: 36, gender: 'Female', blood: 'A-', risk: 'medium', score: 65, cond: 'Graves Disease Hyperthyroidism with Mild Orbitopathy', overdue: 'TRAb antibody titer & Liver Function Test due' },
        { name: 'Daniel Hernandez', age: 57, gender: 'Male', blood: 'O-', risk: 'critical', score: 83, cond: 'Diabetic Gastroparesis & Autonomic Neuropathy', overdue: 'Gastric Emptying Scintigraphy overdue by 45 days' },
        { name: 'Kimberly Lopez', age: 65, gender: 'Female', blood: 'AB-', risk: 'low', score: 40, cond: 'Secondary Hyperparathyroidism with Osteopenia', overdue: 'DEXA Bone Density Scan scheduled' },
        { name: 'Anthony Clark', age: 45, gender: 'Male', blood: 'A+', risk: 'medium', score: 59, cond: 'MASH (Metabolic Dysfunction Steatohepatitis) & Pre-diabetes', overdue: 'FibroScan transient elastography pending' },
        { name: 'George Hall', age: 54, gender: 'Male', blood: 'O+', risk: 'medium', score: 62, cond: 'Primary Adrenal Insufficiency (Addison) on Hydrocortisone', overdue: 'Electrolytes & Renin profile due' }
      ]
    },
    'DOC1004': { // Dr. Ananya Iyer — Neurology
      dept: 'Neurology & Stroke Center',
      patients: [
        { name: 'Suresh Rao', age: 63, gender: 'Male', blood: 'B+', risk: 'critical', score: 92, cond: 'Acute Ischemic Stroke (MCA Territory) Post-Thrombolysis', overdue: 'Repeat Brain MRI / MRA overdue by 30 days' },
        { name: 'Kavita Nair', age: 34, gender: 'Female', blood: 'O+', risk: 'medium', score: 52, cond: 'Intractable Chronic Migraine with Visual Aura', overdue: 'CGRP Antagonist therapeutic evaluation due' },
        { name: 'Harish Joshi', age: 68, gender: 'Male', blood: 'A+', risk: 'critical', score: 85, cond: 'Parkinson Disease (Hoehn & Yahr Stage 2) with Tremor', overdue: 'Levodopa titration & UPDRS Motor Assessment due' },
        { name: 'Swati Chopra', age: 29, gender: 'Female', blood: 'AB+', risk: 'critical', score: 80, cond: 'Focal Epilepsy with Impaired Awareness on Dual AEDs', overdue: 'Video-EEG Monitoring overdue by 60 days' },
        { name: 'Gaurav Bhat', age: 38, gender: 'Male', blood: 'B-', risk: 'critical', score: 88, cond: 'Relapsing-Remitting Multiple Sclerosis (RRMS) on DMT', overdue: 'Cervical Spine MRI with Gadolinium overdue' },
        { name: 'Shilpa Menon', age: 58, gender: 'Female', blood: 'A-', risk: 'critical', score: 93, cond: 'Amyotrophic Lateral Sclerosis (Early Bulbar Presentation)', overdue: 'Pulmonary Function / FVC testing overdue' },
        { name: 'Rahul Deshmukh', age: 47, gender: 'Male', blood: 'O-', risk: 'medium', score: 66, cond: 'Trigeminal Neuralgia (V2/V3) Refractory to Medications', overdue: 'Microvascular Decompression surgical consult pending' },
        { name: 'Aarti Saxena', age: 50, gender: 'Female', blood: 'AB-', risk: 'low', score: 32, cond: 'Benign Paroxysmal Positional Vertigo (BPPV)', overdue: 'Dix-Hallpike verification & Epley maneuver complete' },
        { name: 'Kiran Pillai', age: 62, gender: 'Male', blood: 'A+', risk: 'medium', score: 68, cond: 'Cervical Spondylotic Myelopathy with Paraesthesias', overdue: 'C-spine MRI & Neurosurgical evaluation scheduled' },
        { name: 'Pallavi Bose', age: 43, gender: 'Female', blood: 'O+', risk: 'critical', score: 87, cond: 'Myasthenia Gravis (AChR Antibody Positive) with Ptosis', overdue: 'Single Fiber EMG & Pyridostigmine review due' }
      ]
    },
    'DOC1005': { // Dr. Michael Scott — Medical Oncology
      dept: 'Medical Oncology',
      patients: [
        { name: 'Vikas Kumar', age: 54, gender: 'Male', blood: 'B+', risk: 'critical', score: 94, cond: 'Colorectal Adenocarcinoma (Stage IIIb) Post-FOLFOX Cycle 4', overdue: 'CEA Tumor Marker & CT Abdomen/Pelvis overdue' },
        { name: 'Rashmi Sharma', age: 49, gender: 'Female', blood: 'O+', risk: 'critical', score: 91, cond: 'Invasive Ductal Breast Carcinoma (ER/PR+, HER2-)', overdue: 'Post-chemotherapy Echocardiogram (LVEF) due' },
        { name: 'Pradeep Mehta', age: 67, gender: 'Male', blood: 'A+', risk: 'critical', score: 96, cond: 'Non-Small Cell Lung Cancer (EGFR Exon 19) on Osimertinib', overdue: 'Chest CT & ctDNA Liquid Biopsy overdue by 45 days' },
        { name: 'Renu Patel', age: 56, gender: 'Female', blood: 'AB+', risk: 'critical', score: 89, cond: 'Diffuse Large B-Cell Lymphoma (DLBCL) on R-CHOP Protocol', overdue: 'Interim PET-CT scan overdue by 14 days' },
        { name: 'Ashok Singh', age: 72, gender: 'Male', blood: 'B-', risk: 'critical', score: 86, cond: 'Castration-Resistant Metastatic Prostate Ca on Enzalutamide', overdue: 'PSA Kinetics & Whole Body Bone Scan due' },
        { name: 'Manju Iyer', age: 61, gender: 'Female', blood: 'A-', risk: 'critical', score: 88, cond: 'Epithelial Ovarian Carcinoma on Maintenance PARP Inhibitor', overdue: 'CA-125 level & Complete Blood Count due today' },
        { name: 'Anita Reddy', age: 65, gender: 'Female', blood: 'O-', risk: 'critical', score: 85, cond: 'Advanced Renal Cell Carcinoma on Dual Immunotherapy', overdue: 'Thyroid & Adrenal Function screen overdue' },
        { name: 'Usha Gupta', age: 59, gender: 'Female', blood: 'AB-', risk: 'critical', score: 90, cond: 'Gastric Adenocarcinoma with Peritoneal Washings Positive', overdue: 'Diagnostic Laparoscopy follow-up pending' },
        { name: 'Mukesh Verma', age: 50, gender: 'Male', blood: 'A+', risk: 'critical', score: 95, cond: 'Glioblastoma Multiforme Post-Resection on Temozolomide', overdue: 'Brain MRI Perfusion protocol overdue by 21 days' },
        { name: 'Radha Nair', age: 69, gender: 'Female', blood: 'O+', risk: 'critical', score: 87, cond: 'Multiple Myeloma (IgG Kappa) on VRd Induction Protocol', overdue: 'Serum Free Light Chains & Bone Marrow review due' }
      ]
    },
    'DOC1006': { // Dr. Priya Nair — Nephrology
      dept: 'Nephrology & Renal Care',
      patients: [
        { name: 'Sunita Singh', age: 50, gender: 'Female', blood: 'AB+', risk: 'critical', score: 79, cond: 'Chronic Kidney Disease Stage 3b with Hypertension', overdue: 'Spot Urine ACR & eGFR calculation overdue' },
        { name: 'Vikram Iyer', age: 57, gender: 'Male', blood: 'AB-', risk: 'critical', score: 80, cond: 'End-Stage Renal Disease (ESRD) on Maintenance Hemodialysis', overdue: 'AV Fistula Doppler & Kt/V Dialysis Adequacy due' },
        { name: 'Deepa Reddy', age: 45, gender: 'Female', blood: 'A+', risk: 'critical', score: 83, cond: 'Idiopathic Membranous Nephropathy with Nephrotic Range Proteinuria', overdue: 'Anti-PLA2R antibody titer & Serum Albumin due' },
        { name: 'Amit Gupta', age: 53, gender: 'Male', blood: 'B+', risk: 'medium', score: 70, cond: 'Autosomal Dominant Polycystic Kidney Disease (ADPKD)', overdue: 'Total Kidney Volume (TKV) MRI scan scheduled' },
        { name: 'Kavita Verma', age: 62, gender: 'Female', blood: 'O+', risk: 'critical', score: 92, cond: 'Diabetic Glomerulosclerosis with Rapid eGFR Decline', overdue: 'Nephrology multidisciplinary review overdue' },
        { name: 'Ramesh Nair', age: 48, gender: 'Male', blood: 'A-', risk: 'medium', score: 58, cond: 'Recurrent Calcium Oxalate Nephrolithiasis with Obstruction', overdue: '24-hour Urine Metabolic Stone Profile due' },
        { name: 'Pooja Joshi', age: 31, gender: 'Female', blood: 'B-', risk: 'critical', score: 89, cond: 'Lupus Nephritis (ISN/RPS Class IV) on MMF Therapy', overdue: 'Anti-dsDNA, C3/C4 Complement levels due today' },
        { name: 'Manoj Chopra', age: 55, gender: 'Male', blood: 'O-', risk: 'critical', score: 86, cond: 'Post-Renal Transplant (Year 2) on Tacrolimus Regimen', overdue: 'Tacrolimus Trough Level (C0) overdue by 7 days' },
        { name: 'Sneha Rao', age: 37, gender: 'Female', blood: 'AB-', risk: 'medium', score: 62, cond: 'IgA Nephropathy with Episodic Macroscopic Hematuria', overdue: 'Spot Protein-Creatinine Ratio & Serum Creatinine due' },
        { name: 'Naveen Bose', age: 44, gender: 'Male', blood: 'A+', risk: 'low', score: 45, cond: 'Distal Renal Tubular Acidosis (Type 1) with Hypokalemia', overdue: 'Venous Blood Gas & Serum Potassium review scheduled' }
      ]
    },
    'DOC1007': { // Dr. Vikram Seth — Pulmonology
      dept: 'Pulmonology & Respiratory',
      patients: [
        { name: 'Divya Mishra', age: 61, gender: 'Female', blood: 'O+', risk: 'critical', score: 88, cond: 'COPD Gold Group D with Acute Exacerbation History', overdue: 'Spirometry with Pre/Post Bronchodilator overdue' },
        { name: 'Sanjay Deshmukh', age: 42, gender: 'Male', blood: 'B+', risk: 'critical', score: 82, cond: 'Severe Eosinophilic Asthma on Biologic (Mepolizumab)', overdue: 'Absolute Eosinophil Count & FeNO testing due' },
        { name: 'Geeta Saxena', age: 69, gender: 'Female', blood: 'A+', risk: 'critical', score: 93, cond: 'Idiopathic Pulmonary Fibrosis (IPF) on Nintedanib', overdue: 'High-Resolution CT (HRCT) Chest overdue by 60 days' },
        { name: 'Alok Pillai', age: 56, gender: 'Male', blood: 'AB+', risk: 'medium', score: 64, cond: 'Severe Obstructive Sleep Apnea (AHI 42) on Auto-CPAP', overdue: 'CPAP Compliance & Epworth Sleepiness review due' },
        { name: 'Swati Menon', age: 38, gender: 'Female', blood: 'B-', risk: 'medium', score: 60, cond: 'Pulmonary Sarcoidosis (Stage II) with Bilateral Hilar Adenopathy', overdue: 'Serum ACE Level & Eye Screening due' },
        { name: 'Harish Bhat', age: 52, gender: 'Male', blood: 'A-', risk: 'medium', score: 67, cond: 'Post-COVID Fibrotic Lung Sequelae with Exertional Hypoxemia', overdue: '6-Minute Walk Test & DLCO scheduled' },
        { name: 'Neha Kumar', age: 46, gender: 'Female', blood: 'O-', risk: 'critical', score: 84, cond: 'Bronchiectasis with Pseudomonas Aeruginosa Colonization', overdue: 'Sputum Microbiology & Chest Physiotherapy audit overdue' },
        { name: 'Gaurav Sharma', age: 26, gender: 'Male', blood: 'AB-', risk: 'low', score: 30, cond: 'Primary Spontaneous Pneumothorax Post-Chest Tube', overdue: 'Pleural ultrasound complete; routine follow-up' },
        { name: 'Shilpa Mehta', age: 49, gender: 'Female', blood: 'A+', risk: 'critical', score: 89, cond: 'Pulmonary Arterial Hypertension (WHO Group 1)', overdue: 'Echocardiogram RVSP & BNP monitoring overdue' },
        { name: 'Rahul Patel', age: 60, gender: 'Male', blood: 'O+', risk: 'critical', score: 85, cond: 'Occupational Silicosis with Progressive Massive Fibrosis', overdue: 'Chest Radiograph (ILO Classification) due' }
      ]
    },
    'DOC1008': { // Dr. Emily Watson — Gastroenterology
      dept: 'Gastroenterology & Hepatology',
      patients: [
        { name: 'Aarti Singh', age: 48, gender: 'Female', blood: 'B+', risk: 'medium', score: 68, cond: 'NASH with F3 Bridging Fibrosis on Liver Biopsy', overdue: 'FibroScan & Liver Function Panel due' },
        { name: 'Kiran Iyer', age: 58, gender: 'Male', blood: 'O+', risk: 'critical', score: 94, cond: 'Decompensated Liver Cirrhosis with Ascites & Portal HTN', overdue: 'Screening Upper GI Endoscopy for Varices overdue' },
        { name: 'Pallavi Reddy', age: 32, gender: 'Female', blood: 'A+', risk: 'critical', score: 86, cond: 'Crohn Disease (Ileocolonic) on Infliximab Maintenance', overdue: 'Fecal Calprotectin & Infliximab Trough Level due' },
        { name: 'Vikas Gupta', age: 40, gender: 'Male', blood: 'AB+', risk: 'critical', score: 83, cond: 'Ulcerative Colitis (Pancolitis) in Clinical Flare', overdue: 'Flexible Sigmoidoscopy & Stool pathogen screen overdue' },
        { name: 'Rashmi Verma', age: 55, gender: 'Female', blood: 'B-', risk: 'medium', score: 65, cond: 'Chronic Calcific Pancreatitis with Exocrine Insufficiency', overdue: 'Fecal Elastase-1 & Fat-Soluble Vitamins due' },
        { name: 'Pradeep Nair', age: 51, gender: 'Male', blood: 'A-', risk: 'low', score: 38, cond: 'Refractory GERD with Short-Segment Barrett Esophagus', overdue: 'Surveillance Esophagogastroduodenoscopy scheduled' },
        { name: 'Jyoti Joshi', age: 44, gender: 'Female', blood: 'O-', risk: 'medium', score: 62, cond: 'Helicobacter Pylori Bleeding Duodenal Ulcer (Post-Healed)', overdue: 'Urea Breath Test for H. Pylori Eradication due' },
        { name: 'Ajay Chopra', age: 29, gender: 'Male', blood: 'AB-', risk: 'medium', score: 54, cond: 'Celiac Disease with Severe Malabsorption (Marsh IIIb)', overdue: 'Tissue Transglutaminase (tTG-IgA) recheck due' },
        { name: 'Renu Rao', age: 36, gender: 'Female', blood: 'A+', risk: 'low', score: 26, cond: 'Irritable Bowel Syndrome (IBS-Diarrhea Predominant)', overdue: 'Low FODMAP dietary adherence follow-up' },
        { name: 'Ashok Bose', age: 52, gender: 'Male', blood: 'O+', risk: 'critical', score: 87, cond: 'Autoimmune Hepatitis (Type 1) on Azathioprine & Steroids', overdue: 'Total IgG & ALT/AST trend monitoring overdue' }
      ]
    },
    'DOC1009': { // Dr. David Miller — Orthopedics
      dept: 'Orthopedics & Joint Care',
      patients: [
        { name: 'Seema Mishra', age: 66, gender: 'Female', blood: 'B+', risk: 'medium', score: 69, cond: 'Bilateral Knee Osteoarthritis (KL Grade 4) Awaiting TKR', overdue: 'Pre-operative Cardiac & Anesthetic clearance due' },
        { name: 'Santosh Deshmukh', age: 53, gender: 'Male', blood: 'O+', risk: 'critical', score: 81, cond: 'Lumbar Spondylolisthesis (L4-L5) with Radicular Sciatica', overdue: 'Lumbar Spine Dynamic MRI overdue by 30 days' },
        { name: 'Manju Saxena', age: 27, gender: 'Female', blood: 'A+', risk: 'medium', score: 58, cond: 'Complete ACL Rupture with Medial Meniscal Tear', overdue: 'Post-arthroscopic Rehabilitation audit scheduled' },
        { name: 'Kishore Pillai', age: 60, gender: 'Male', blood: 'AB+', risk: 'medium', score: 63, cond: 'Full-Thickness Rotator Cuff Tear (Supraspinatus Tendon)', overdue: 'Shoulder MRI Arthrogram & Orthopedic review due' },
        { name: 'Anita Menon', age: 70, gender: 'Female', blood: 'B-', risk: 'critical', score: 88, cond: 'Severe Osteoporosis (T-score -3.4) with L2 Compression Fracture', overdue: 'DEXA Scan & Teriparatide injection initiation due' },
        { name: 'Dinesh Bhat', age: 48, gender: 'Male', blood: 'A-', risk: 'medium', score: 60, cond: 'Cervical Disc Herniation (C5-C6) with Brachialgia', overdue: 'C-spine MRI & Electromyography (EMG) due' },
        { name: 'Usha Kumar', age: 54, gender: 'Female', blood: 'O-', risk: 'low', score: 35, cond: 'Adhesive Capsulitis (Frozen Shoulder) in Thawing Phase', overdue: 'Physical therapy range of motion progression review' },
        { name: 'Mukesh Sharma', age: 43, gender: 'Male', blood: 'AB-', risk: 'low', score: 29, cond: 'Chronic Plantar Fasciitis with Calcaneal Spur', overdue: 'Custom orthotic footbed fitting review' },
        { name: 'Radha Mehta', age: 51, gender: 'Female', blood: 'A+', risk: 'medium', score: 56, cond: 'Carpal Tunnel Syndrome with Thenar Muscle Weakness', overdue: 'Nerve Conduction Velocity (NCV) study scheduled' },
        { name: 'Vijay Patel', age: 68, gender: 'Male', blood: 'O+', risk: 'critical', score: 84, cond: 'Severe Hip Osteoarthritis with Joint Space Collapse', overdue: 'Pelvic Radiograph & Pre-op Total Hip evaluation due' }
      ]
    },
    'DOC1010': { // Dr. Sunita Rao — Pediatrics
      dept: 'Pediatrics & Adolescent Care',
      patients: [
        { name: 'Shashi Singh', age: 9, gender: 'Male', blood: 'B+', risk: 'critical', score: 85, cond: 'Pediatric Type 1 Diabetes on Multiple Daily Insulin Injections', overdue: 'Pediatric HbA1c & CGM sensor upload overdue' },
        { name: 'Gopal Iyer', age: 6, gender: 'Male', blood: 'O+', risk: 'critical', score: 80, cond: 'Pediatric Brittle Asthma with Frequent Viral Wheezing', overdue: 'Inhaler Technique & Pediatric Pulmonology review due' },
        { name: 'Lata Reddy', age: 2, gender: 'Female', blood: 'A+', risk: 'medium', score: 62, cond: 'Failure to Thrive & Gastroesophageal Reflux in Infancy', overdue: 'Growth Velocity Charting & Stool Elastase due' },
        { name: 'John Gupta', age: 11, gender: 'Male', blood: 'AB+', risk: 'critical', score: 88, cond: 'Acute Rheumatic Fever with Mild Carditis & Chorea', overdue: 'Echocardiogram & ASO Titer follow-up due' },
        { name: 'Mary Verma', age: 5, gender: 'Female', blood: 'B-', risk: 'critical', score: 89, cond: 'Nephrotic Syndrome (Minimal Change Disease) in Relapse', overdue: 'Urinary Protein-Creatinine Ratio & Serum Albumin due' },
        { name: 'David Nair', age: 4, gender: 'Male', blood: 'A-', risk: 'medium', score: 64, cond: 'Kawasaki Disease (Convalescent) on Low-Dose Aspirin', overdue: 'Coronary Artery Echocardiogram screening due' },
        { name: 'Sarah Joshi', age: 3, gender: 'Female', blood: 'O-', risk: 'low', score: 40, cond: 'Congenital Hypothyroidism on Weight-Adjusted Levothyroxine', overdue: 'Serum TSH & Free T4 dose-titration due' },
        { name: 'James Chopra', age: 13, gender: 'Male', blood: 'AB-', risk: 'medium', score: 58, cond: 'Celiac Disease in Adolescence with Growth Deceleration', overdue: 'Anti-tTG IgA & Pediatric Dietitian consultation due' },
        { name: 'Patricia Rao', age: 4, gender: 'Female', blood: 'A+', risk: 'low', score: 32, cond: 'Recurrent Complex Febrile Seizures with Normal Interictal EEG', overdue: 'Pediatric Neurology follow-up complete' },
        { name: 'Robert Bose', age: 10, gender: 'Male', blood: 'O+', risk: 'low', score: 28, cond: 'ADHD with Growth & Blood Pressure Surveillance', overdue: 'Height/Weight percentile & Medication review scheduled' }
      ]
    }
  };

  // ── 4. Generate 100 Patients & Associated Records ────────────────────────
  const patients = [];
  const appointments = [];
  const medicalReports = [];
  const investigations = [];
  const followUps = [];
  const aiSummaries = {};
  const notifications = [];
  const auditLogs = [];

  let patientIndex = 1;
  let reportCounter = 1001;
  let apptCounter = 1001;
  let notifCounter = 1001;
  let auditCounter = 1001;

  // Build each doctor's dedicated cohort
  doctors.forEach((doc, docIdx) => {
    const cohort = doctorCohorts[doc.doctorId];
    if (!cohort) return;

    cohort.patients.forEach((cp, pIdx) => {
      const patientId = `PAT${1000 + patientIndex}`;
      const mrn = `MRN-2024-${String(1000 + patientIndex).padStart(4, '0')}`;
      patientIndex++;

      const avatar = cp.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const city = cities[(patientIndex * 3) % cities.length];
      const allergies = allergiesPool[(patientIndex * 2) % allergiesPool.length];

      const careJourney = [
        { id: 'step-1', name: 'Consultation', status: 'completed', date: '2024-03-15', note: `Encounter logged by ${doc.name}.` },
        { id: 'step-2', name: 'Diagnosis', status: 'completed', date: '2024-03-15', note: `${cp.cond}.` },
        { id: 'step-3', name: 'Treatment', status: 'completed', date: '2024-03-15', note: 'Medication regimen initiated according to clinical protocol.' },
        { id: 'step-4', name: 'Investigation', status: cp.risk === 'critical' ? 'attention' : (pIdx % 3 === 0 ? 'pending' : 'completed'), date: cp.risk === 'critical' ? 'Overdue' : 'Scheduled', note: cp.overdue },
        { id: 'step-5', name: 'Follow-up', status: cp.risk === 'critical' ? (pIdx % 2 === 0 ? 'missed' : 'attention') : 'pending', date: '2026-09-10', note: `Scheduled follow-up with ${doc.name}.` },
        { id: 'step-6', name: 'Review', status: 'pending', date: 'Today', note: 'Attending specialist review.' }
      ];

      const patientRecord = {
        id: patientId,
        mrn,
        name: cp.name,
        age: cp.age,
        gender: cp.gender,
        bloodGroup: cp.blood,
        phone: `+91 ${98000 + patientIndex} ${10000 + patientIndex * 13}`,
        emergencyContact: `Emergency: +91 ${98000 + patientIndex} ${50000 + patientIndex * 17}`,
        address: `Apt ${101 + patientIndex}, Sector ${1 + (patientIndex % 20)}, ${city}`,
        chronicConditions: [cp.cond],
        allergies,
        riskLevel: cp.risk,
        riskScore: cp.score,
        condition: cp.cond,
        appointmentTime: `${8 + (pIdx % 6)}:${(pIdx % 4) * 15 === 0 ? '00' : (pIdx % 4) * 15} ${pIdx >= 4 ? 'PM' : 'AM'} (Slot ${pIdx + 1})`,
        appointmentDate: '2026-09-02',
        room: doc.room,
        attendingDoctor: `${doc.name} (${doc.department})`,
        assignedDoctorId: doc.doctorId,
        avatar,
        lastVisit: `2024-0${1 + (pIdx % 4)}-${10 + (pIdx % 15)}`,
        overdueGap: cp.overdue,
        careJourney
      };

      patients.push(patientRecord);

      // Add Appointment for this patient
      appointments.push({
        appointmentId: `APT${apptCounter++}`,
        patientId: patientRecord.id,
        patientName: patientRecord.name,
        mrn: patientRecord.mrn,
        doctorId: doc.doctorId,
        doctorName: doc.name,
        department: doc.department,
        appointmentDate: '2026-09-02',
        appointmentTime: patientRecord.appointmentTime,
        status: pIdx < 3 ? 'in-progress' : pIdx < 7 ? 'scheduled' : 'completed',
        reason: patientRecord.condition,
        room: doc.room
      });

      // Add Medical Report
      medicalReports.push({
        reportId: `REP${reportCounter++}`,
        patientId: patientRecord.id,
        patientName: patientRecord.name,
        mrn: patientRecord.mrn,
        reportType: doc.doctorId === 'DOC1002' ? '12-Lead ECG & 2D Echo' : doc.doctorId === 'DOC1003' ? 'Continuous Glucose & HbA1c Panel' : doc.doctorId === 'DOC1007' ? 'Chest Radiograph & Spirometry' : 'Comprehensive Clinical Lab Panel',
        uploadedFile: `${patientRecord.name.replace(/\s+/g, '_')}_Clinical_Extract_2024.pdf`,
        OCRText: `Extracted diagnostic findings for ${patientRecord.name} (${patientRecord.mrn}). Condition: ${patientRecord.condition}. Evaluated under ${doc.department} clinical practice standards.`,
        uploadedDate: '2024-03-15',
        verifiedBy: doc.name
      });

      // Add Pending Investigation if applicable
      if (cp.risk === 'critical' || pIdx % 2 === 0) {
        investigations.push({
          investigationId: `INV${1000 + investigations.length + 1}`,
          patientId: patientRecord.id,
          patientName: patientRecord.name,
          mrn: patientRecord.mrn,
          investigationName: cp.overdue.replace(/overdue|due|by|\d+ days|scheduled/gi, '').trim() || `${doc.department} Diagnostic Panel`,
          status: cp.risk === 'critical' ? 'attention' : 'pending',
          urgency: cp.risk === 'critical' ? 'critical' : 'medium',
          dueDate: cp.risk === 'critical' ? 'Overdue (Audit Required)' : 'Due in 7 Days',
          reason: `Evaluate disease progression for ${cp.cond}`,
          guidelineRef: `${doc.department} Practice Guidelines 2024`,
          basedOnCondition: cp.cond,
          orderedBy: doc.name
        });
      }

      // Add Follow-up
      if (cp.risk === 'critical' || pIdx % 2 === 1) {
        followUps.push({
          followUpId: `FOL${1000 + followUps.length + 1}`,
          patientId: patientRecord.id,
          patientName: patientRecord.name,
          mrn: patientRecord.mrn,
          followUpDate: cp.risk === 'critical' ? '2024-06-15 (Overdue)' : '2026-09-15',
          status: cp.risk === 'critical' ? 'overdue' : 'scheduled',
          assignedDoctor: doc.name,
          assignedDoctorId: doc.doctorId,
          reason: `Outpatient specialty follow-up for ${cp.cond}`,
          contactStatus: cp.risk === 'critical' ? 'Pending Tele-Recall' : 'Confirmed'
        });
      }
    });
  });

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
