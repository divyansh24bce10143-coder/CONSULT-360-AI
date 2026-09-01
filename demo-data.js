/* ==========================================================================
   CONSULT 360 AI — CLINICAL DATASETS (DEMO BENCHMARKS)
   Production-grade medical records with Care Journey state, longitudinal biometrics,
   explainable AI risk signals, and clinical gap audits.
   ========================================================================== */

const DEMO_PATIENTS = [
  {
    id: 'P001',
    mrn: 'MRN-2024-0891',
    name: 'Rajesh Kumar',
    age: 58,
    gender: 'Male',
    bloodGroup: 'B+',
    appointmentTime: '10:30 AM (Today)',
    condition: 'Type 2 Diabetes Mellitus · Stage 2 Hypertension',
    riskLevel: 'critical',
    triageCategory: 'Critical Attention',
    lastVisit: 'Aug 15, 2026',
    attendingDoctor: 'Dr. Sarah Chen, MD (Endocrinology / Internal Med)',
    room: 'Exam Room 4B',
    avatar: 'RK',
    overdueGap: 'Urgent eGFR & Urine ACR (14 days overdue)',
    allergies: ['Penicillin (Documented anaphylactoid skin reaction)'],
    careJourney: [
      { id: 'step-1', name: 'Consultation', status: 'completed', date: 'Aug 15, 2026', note: 'Encounter completed with Dr. Chen. Escalated therapy.' },
      { id: 'step-2', name: 'Diagnosis', status: 'completed', date: 'Aug 15, 2026', note: 'Confirmed T2DM poorly controlled + Suspected Diabetic Nephropathy.' },
      { id: 'step-3', name: 'Treatment', status: 'completed', date: 'Aug 15, 2026', note: 'Telmisartan 40mg added; Glimepiride escalated to 2mg.' },
      { id: 'step-4', name: 'Investigation', status: 'attention', date: 'Overdue (14 days)', note: 'Critical: eGFR, Urine Microalbumin ACR, Fundus Exam pending.' },
      { id: 'step-5', name: 'Follow-up', status: 'pending', date: 'Sep 15, 2026 (Scheduled)', note: '30-day glycemic re-assessment and nephrology triage.' },
      { id: 'step-6', name: 'Review', status: 'pending', date: 'Oct 01, 2026', note: 'Multi-disciplinary endocrine & renal panel review.' }
    ],
    reportText: `PATIENT: Rajesh Kumar, 58M | MRD: MH-2024-0891

VISIT 1 — March 15, 2026
Chief Complaint: Routine diabetes follow-up
Vitals: BP 150/95 mmHg, HR 78 bpm, Weight 84 kg
HbA1c: 7.2% (Ref <7.0%) | FBS: 145 mg/dL | Creatinine: 0.9 mg/dL
Medications: Metformin 500mg BD, Amlodipine 5mg OD

VISIT 2 — June 10, 2026
Chief Complaint: Increased thirst, blurry vision
Vitals: BP 158/98 mmHg, HR 82 bpm, Weight 86 kg
HbA1c: 8.1% ABNORMAL | FBS: 189 mg/dL ABNORMAL | Cholesterol: 210 mg/dL | LDL: 145 mg/dL
Medications: Added Glimepiride 1mg OD

VISIT 3 (Current) — August 15, 2026
Chief Complaint: Persistent fatigue, bilateral ankle swelling
Vitals: BP 168/102 mmHg CRITICAL, HR 88 bpm, Weight 88 kg, SpO2 97%
HbA1c: 9.3% CRITICAL | FBS: 224 mg/dL CRITICAL | Creatinine: 1.1 mg/dL
Urine: Trace protein detected | Bilateral ankle edema
Missing: eGFR, Urine Microalbumin, Fundus Examination
Added: Telmisartan 40mg OD, Glimepiride increased to 2mg
Allergies: Penicillin (rash) | History: Appendectomy 2018`
  },
  {
    id: 'P002',
    mrn: 'MRN-2024-1247',
    name: 'Priya Sharma',
    age: 42,
    gender: 'Female',
    bloodGroup: 'O+',
    appointmentTime: '11:15 AM (Today)',
    condition: 'Post-NSTEMI Status Post-PCI · NYHA Class II',
    riskLevel: 'medium',
    triageCategory: 'Pending Investigation',
    lastVisit: 'Aug 28, 2026',
    attendingDoctor: 'Dr. Marcus Vance, MD (Interventional Cardiology)',
    room: 'Exam Room 2A',
    avatar: 'PS',
    overdueGap: 'Repeat 2D-Echocardiogram (6-month post-PCI)',
    allergies: ['NSAIDs (Severe gastritis / GI intolerance)', 'Sulfa drugs (Pruritus)'],
    careJourney: [
      { id: 'step-1', name: 'Consultation', status: 'completed', date: 'Aug 28, 2026', note: 'Post-PCI follow-up encounter completed.' },
      { id: 'step-2', name: 'Diagnosis', status: 'completed', date: 'Feb 12, 2026', note: 'NSTEMI s/p PCI to LAD, mild LV systolic dysfunction.' },
      { id: 'step-3', name: 'Treatment', status: 'completed', date: 'Aug 28, 2026', note: 'Atorvastatin titrated to 80mg; Bisoprolol to 5mg.' },
      { id: 'step-4', name: 'Investigation', status: 'missed', date: 'Due Aug 2026 (Missed)', note: 'Repeat 2D Echo + EF assessment not performed.' },
      { id: 'step-5', name: 'Follow-up', status: 'pending', date: 'Oct 10, 2026', note: 'Cardiology outpatient review.' },
      { id: 'step-6', name: 'Review', status: 'pending', date: 'Dec 01, 2026', note: 'Annual dual-antiplatelet therapy (DAPT) cessation review.' }
    ],
    reportText: `PATIENT: Priya Sharma, 42F | MRD: MH-2024-1247

VISIT 1 — April 5, 2026 (Post-discharge Day 30)
History: NSTEMI Feb 2026, PCI to LAD performed
Vitals: BP 126/82 mmHg, HR 72 bpm, Weight 68 kg
EF: 45% (mildly reduced) | LDL: 180 mg/dL ABNORMAL | Troponin I: 0.02 ng/mL
Medications: Aspirin 75mg, Clopidogrel 75mg, Atorvastatin 40mg, Bisoprolol 2.5mg, Ramipril 5mg

VISIT 2 (Current) — August 28, 2026
Vitals: BP 122/78 mmHg, HR 68 bpm, Weight 67 kg
LDL: 95 mg/dL (improved, target <70) | HbA1c: 5.8% (pre-diabetic)
Exertional dyspnea (NYHA Class II)
Missing: Repeat Echocardiogram (due Aug 2026), Stress Test
Atorvastatin increased to 80mg, Bisoprolol increased to 5mg
Allergies: NSAIDs (gastric irritation), Sulfa drugs`
  },
  {
    id: 'P003',
    mrn: 'MRN-2025-0334',
    name: 'Arjun Mehta',
    age: 28,
    gender: 'Male',
    bloodGroup: 'A+',
    appointmentTime: '12:00 PM (Today)',
    condition: 'Moderate Persistent Asthma · Allergic Rhinitis',
    riskLevel: 'low',
    triageCategory: 'Overdue Follow-up',
    lastVisit: 'Aug 28, 2026',
    attendingDoctor: 'Dr. Elena Rostova, MD (Pulmonology)',
    room: 'Exam Room 1C',
    avatar: 'AM',
    overdueGap: 'Repeat Spirometry & Inhaler Technique Audit',
    allergies: ['House Dust Mites (Skin prick test positive)', 'Tree Pollen (Suspected)'],
    careJourney: [
      { id: 'step-1', name: 'Consultation', status: 'completed', date: 'Aug 28, 2026', note: 'Patient presented with increased nocturnal cough.' },
      { id: 'step-2', name: 'Diagnosis', status: 'completed', date: 'Jan 20, 2026', note: 'Uncontrolled Moderate Persistent Asthma (GINA Step 3).' },
      { id: 'step-3', name: 'Treatment', status: 'completed', date: 'Aug 28, 2026', note: 'ICS/LABA maintained, rescue SABA overuse noted.' },
      { id: 'step-4', name: 'Investigation', status: 'attention', date: 'Pending', note: 'Repeat Spirometry & Fractional Exhaled Nitric Oxide (FeNO) required.' },
      { id: 'step-5', name: 'Follow-up', status: 'pending', date: 'Sep 28, 2026', note: '4-week asthma control test (ACT) reassessment.' },
      { id: 'step-6', name: 'Review', status: 'pending', date: 'Nov 15, 2026', note: 'Allergen immunotherapy suitability evaluation.' }
    ],
    reportText: `PATIENT: Arjun Mehta, 28M | MRD: MH-2025-0334

VISIT 1 — January 20, 2026
Diagnosis: Moderate Persistent Asthma, Allergic Rhinitis
Vitals: BP 118/76, HR 88, SpO2 94%, Peak Flow 320 L/min (55% predicted)
IgE: 450 IU/mL (HIGH) | Eosinophils: 8% (elevated) | FEV1/FVC: 0.68
Medications: Budesonide/Formoterol 160/4.5mcg BD, Salbutamol PRN, Montelukast 10mg, Cetirizine 10mg

VISIT 2 (Current) — August 28, 2026
Night cough worsening, 3 rescue inhaler uses/week
Vitals: BP 116/74, HR 92, SpO2 93%, Peak Flow 290 L/min (50% predicted — WORSENING)
Missing: Repeat spirometry, chest X-ray, allergen panel (specific IgE)
Overusing SABA (3x/week = uncontrolled marker)
Allergies: Dust mites (confirmed), Pollen (suspected)`
  }
];

/* Pre-computed Clinical AI Intelligence Briefs */
const DEMO_RESULTS = {
  'P001': {
    patient: {
      name: 'Rajesh Kumar',
      mrn: 'MRN-2024-0891',
      age: 58,
      gender: 'Male',
      bloodGroup: 'B+',
      allergies: ['Penicillin (Severe cutaneous reaction / rash)']
    },
    aiMeta: {
      confidenceScore: 94,
      groundedEvidenceCount: 8,
      modelUsed: 'Gemini 3.6 Flash (Clinical Decision Support)',
      auditTimestamp: '2026-08-31T14:30:00Z',
      disclaimer: 'AI Clinical Decision Support brief for healthcare professionals. Not a standalone diagnosis.'
    },
    entities: {
      diagnoses: [
        { name: 'Type 2 Diabetes Mellitus (Uncontrolled)', date: 'Mar 2026', status: 'active', icd: 'E11.65' },
        { name: 'Stage 2 Essential Hypertension', date: 'Mar 2026', status: 'active', icd: 'I10' },
        { name: 'Bilateral Lower Extremity Edema', date: 'Aug 2026', status: 'active', icd: 'R60.0' },
        { name: 'Suspected Diabetic Nephropathy (Early Stage)', date: 'Aug 2026', status: 'suspected', icd: 'N08.3' },
        { name: 'Appendectomy (Surgical Hx)', date: '2018', status: 'historical', icd: 'Z98.890' }
      ],
      medications: [
        { name: 'Metformin HCl', dose: '500mg', frequency: 'Oral · Twice daily (with meals)', date: 'Mar 2026', change: 'continued', class: 'Biguanide' },
        { name: 'Amlodipine Besylate', dose: '5mg', frequency: 'Oral · Once daily', date: 'Mar 2026', change: 'continued', class: 'CCB' },
        { name: 'Glimepiride', dose: '2mg', frequency: 'Oral · Once daily (morning)', date: 'Aug 2026', change: 'dose-changed', class: 'Sulfonylurea' },
        { name: 'Telmisartan', dose: '40mg', frequency: 'Oral · Once daily', date: 'Aug 2026', change: 'new', class: 'ARB' }
      ],
      vitals: [
        { type: 'Blood Pressure', value: '168/102', unit: 'mmHg', reference: '<130/80', date: 'Aug 15, 2026', status: 'critical' },
        { type: 'Heart Rate', value: '88', unit: 'bpm', reference: '60–100', date: 'Aug 15, 2026', status: 'normal' },
        { type: 'Body Weight', value: '88.0', unit: 'kg', reference: 'BMI 28.7', date: 'Aug 15, 2026', status: 'borderline' },
        { type: 'Oxygen Saturation (SpO₂)', value: '97', unit: '%', reference: '≥95%', date: 'Aug 15, 2026', status: 'normal' }
      ],
      labResults: [
        { test: 'Hemoglobin A1c (HbA1c)', value: '9.3', unit: '%', reference: '<7.0%', status: 'critical', date: 'Aug 15, 2026' },
        { test: 'Fasting Blood Glucose', value: '224', unit: 'mg/dL', reference: '70–100', status: 'critical', date: 'Aug 15, 2026' },
        { test: 'Serum Creatinine', value: '1.1', unit: 'mg/dL', reference: '0.7–1.2', status: 'borderline', date: 'Aug 15, 2026' },
        { test: 'Urinalysis Protein', value: 'Trace Positive', unit: '', reference: 'Negative', status: 'abnormal', date: 'Aug 15, 2026' },
        { test: 'LDL-Cholesterol', value: '145', unit: 'mg/dL', reference: '<100 (Target <70)', status: 'abnormal', date: 'Jun 2026' }
      ],
      symptoms: [
        { description: 'Persistent generalized fatigue & malaise', date: 'Aug 15, 2026', severity: 'moderate' },
        { description: 'Bilateral pitting ankle edema (+1)', date: 'Aug 15, 2026', severity: 'moderate' },
        { description: 'Nocturia (3–4 episodes per night)', date: 'Aug 15, 2026', severity: 'moderate' },
        { description: 'Polydipsia and intermittent visual blurring', date: 'Jun 10, 2026', severity: 'mild' }
      ]
    },
    timeline: [
      { date: 'Mar 15, 2026', event: 'Routine Diabetes & HTN Encounter', type: 'visit', detail: 'BP 150/95 mmHg · HbA1c 7.2% · FBS 145 mg/dL. Initiated Metformin 500mg BD + Amlodipine 5mg OD.', significance: 'important' },
      { date: 'Mar 15, 2026', event: 'Baseline Diagnostic Panel', type: 'lab', detail: 'HbA1c 7.2% (elevated) · Creatinine 0.9 mg/dL (normal) · Urinalysis negative.', significance: 'important' },
      { date: 'Jun 10, 2026', event: 'Glycemic Deterioration Encounter', type: 'visit', detail: 'Reported polydipsia & blurry vision. Weight +2.0 kg. Escalated to dual OHA therapy (Glimepiride 1mg added).', significance: 'critical' },
      { date: 'Jun 10, 2026', event: 'HbA1c Lab Progression — 8.1%', type: 'lab', detail: 'Significant upward trajectory (+0.9% in 12 weeks) · Fasting glucose 189 mg/dL · LDL 145 mg/dL.', significance: 'critical' },
      { date: 'Aug 15, 2026', event: 'Current Comprehensive Workup', type: 'visit', detail: 'Presents with bilateral edema & severe fatigue. BP 168/102 mmHg. Trace proteinuria detected.', significance: 'critical' },
      { date: 'Aug 15, 2026', event: 'HbA1c Peak — 9.3% (Critical)', type: 'lab', detail: 'Third consecutive worsening reading demonstrating oral agent therapy failure.', significance: 'critical' },
      { date: 'Aug 15, 2026', event: 'Cardio-Renal Medication Titration', type: 'medication', detail: 'Added Telmisartan 40mg OD for renoprotection & BP control. Doubled Glimepiride to 2mg OD.', significance: 'important' }
    ],
    clinicalChanges: [
      { parameter: 'Hemoglobin A1c', previous: { value: '7.2%', date: 'Mar 15, 2026' }, mid: { value: '8.1%', date: 'Jun 10, 2026' }, current: { value: '9.3%', date: 'Aug 15, 2026' }, changeType: 'increased', magnitude: '+29.2% (5-month delta)', direction: 'worsening', clinicalSignificance: 'Critical Glycemic Failure' },
      { parameter: 'Blood Pressure (Systolic)', previous: { value: '150 mmHg', date: 'Mar 15, 2026' }, mid: { value: '158 mmHg', date: 'Jun 10, 2026' }, current: { value: '168 mmHg', date: 'Aug 15, 2026' }, changeType: 'increased', magnitude: '+18 mmHg (+12.0%)', direction: 'worsening', clinicalSignificance: 'Stage 2 Hypertensive Range' },
      { parameter: 'Fasting Blood Sugar', previous: { value: '145 mg/dL', date: 'Mar 15, 2026' }, current: { value: '224 mg/dL', date: 'Aug 15, 2026' }, changeType: 'increased', magnitude: '+79 mg/dL (+54.5%)', direction: 'worsening', clinicalSignificance: 'Severe Fasting Hyperglycemia' },
      { parameter: 'Serum Creatinine', previous: { value: '0.9 mg/dL', date: 'Mar 15, 2026' }, current: { value: '1.1 mg/dL', date: 'Aug 15, 2026' }, changeType: 'increased', magnitude: '+0.2 mg/dL (+22.2%)', direction: 'worsening', clinicalSignificance: 'Early Renal Filtration Decline' },
      { parameter: 'Body Weight', previous: { value: '84.0 kg', date: 'Mar 15, 2026' }, current: { value: '88.0 kg', date: 'Aug 15, 2026' }, changeType: 'increased', magnitude: '+4.0 kg (+4.8%)', direction: 'worsening', clinicalSignificance: 'Possible Fluid Retention / Overweight' }
    ],
    missingInvestigations: [
      { id: 'test-1', test: 'eGFR (Estimated Glomerular Filtration Rate)', reason: 'Rising creatinine (0.9 → 1.1 mg/dL) combined with trace proteinuria and ankle edema requires urgent CKD staging per KDIGO guidelines.', urgency: 'critical', basedOnCondition: 'T2DM + Rising Creatinine + Proteinuria', lastDone: null, guidelineRef: 'KDIGO 2024 CKD in Diabetes' },
      { id: 'test-2', test: 'Spot Urine Albumin-to-Creatinine Ratio (ACR)', reason: 'Trace urine protein requires quantitative microalbuminuria confirmation to guide SGLT2i renoprotective therapy.', urgency: 'critical', basedOnCondition: 'T2DM + Trace Proteinuria', lastDone: null, guidelineRef: 'ADA Standards of Care 2026' },
      { id: 'test-3', test: 'Comprehensive Dilated Retinal Exam (Fundus)', reason: 'Poorly controlled T2DM (HbA1c 9.3%) with visual blurring warrants urgent screening for diabetic retinopathy.', urgency: 'high', basedOnCondition: 'T2DM with visual symptoms', lastDone: null, guidelineRef: 'AAO Diabetic Retinopathy' },
      { id: 'test-4', test: 'Fasting Lipid Profile Recheck (LDL, HDL, TG)', reason: 'Previous LDL 145 mg/dL is above high-risk diabetic target of <70 mg/dL. Statin initiation or titration audit needed.', urgency: 'high', basedOnCondition: 'T2DM + Hypertension + Dyslipidemia', lastDone: 'Jun 10, 2026', guidelineRef: 'ACC/AHA Cholesterol Guidelines' },
      { id: 'test-5', test: 'Serum Electrolytes (Na⁺, K⁺, HCO₃⁻)', reason: 'Patient actively initiated on Telmisartan (ARB) alongside rising creatinine. Potassium monitoring is mandatory.', urgency: 'medium', basedOnCondition: 'ARB Initiation + Impaired Renal Markers', lastDone: null, guidelineRef: 'AHA Hypertension Guidelines' }
    ],
    riskFlags: [
      {
        id: 'risk-1',
        risk: 'Dual Oral Agent Glycemic Failure (HbA1c 9.3%)',
        severity: 'critical',
        confidence: '96% (High Clinical Certainty)',
        reason: 'HbA1c has progressively worsened (7.2% → 8.1% → 9.3%) over 5 months despite dual OHA escalation (Metformin 1000mg/day + Glimepiride 2mg/day). Indicates inadequate beta-cell reserve and urgent need for injectable therapy (Basal Insulin or GLP-1 RA).',
        evidence: 'HbA1c: 7.2% (Mar) → 8.1% (Jun) → 9.3% (Aug) · FBS 224 mg/dL',
        sourceDocument: 'Lab Pathology Report #LAB-8812',
        date: 'Aug 15, 2026',
        recommendation: 'Evaluate for Basal Insulin initiation (10 IU glargine/degludec) or GLP-1 RA. Refer for Endocrinology consult and medical nutrition therapy (MNT).',
        overrideStatus: 'pending'
      },
      {
        id: 'risk-2',
        risk: 'Emerging Diabetic Nephropathy / Cardio-Renal Risk',
        severity: 'critical',
        confidence: '92% (High Correlation)',
        reason: 'Triad of trace proteinuria, 22.2% elevation in serum creatinine (0.9 to 1.1 mg/dL), and new-onset bilateral ankle edema strongly indicates early diabetic microvascular renal injury and volume retention.',
        evidence: 'Urinalysis Protein: Trace Positive | Creatinine: 1.1 mg/dL (+22%) | Bilateral Ankle Edema (+1)',
        sourceDocument: 'Physical Exam & Urinalysis Report',
        date: 'Aug 15, 2026',
        recommendation: 'Order urgent eGFR and Urine ACR. Consider SGLT2 inhibitor addition (Empagliflozin/Dapagliflozin) for cardiorenal protection once eGFR is confirmed ≥20.',
        overrideStatus: 'pending'
      },
      {
        id: 'risk-3',
        risk: 'Uncontrolled Stage 2 Hypertension (BP 168/102 mmHg)',
        severity: 'high',
        confidence: '95% (Direct Objective Measurement)',
        reason: 'Progressive systolic and diastolic elevation over 3 consecutive clinical visits. Significantly accelerates risk of major adverse cardiovascular events (MACE) and glomerulosclerosis in diabetic population.',
        evidence: 'BP: 150/95 (Mar) → 158/98 (Jun) → 168/102 (Aug) · Target: <130/80 mmHg',
        sourceDocument: 'Encounter Vitals Record',
        date: 'Aug 15, 2026',
        recommendation: 'Assess adherence to Amlodipine + Telmisartan. Consider adding low-dose thiazide-like diuretic (Chlorthalidone 12.5mg OD). Home BP monitoring log.',
        overrideStatus: 'pending'
      },
      {
        id: 'risk-4',
        risk: 'Severe Penicillin Allergy — Active Prescribing Conflict',
        severity: 'medium',
        confidence: '99% (Explicit Medical History)',
        reason: 'Documented cutaneous hypersensitivity to Penicillin. All beta-lactam antibiotics (amoxicillin, augmentin, piperacillin-tazobactam) must be strictly avoided; caution with 1st-gen cephalosporins.',
        evidence: 'Allergy Record: Penicillin → Anaphylactoid skin rash',
        sourceDocument: 'EMR Allergy Registry',
        date: 'Verified on Chart',
        recommendation: 'Highlight allergy in e-prescribing system. Alternative choices for bacterial infections: Macrolides (Azithromycin) or Fluoroquinolones.',
        overrideStatus: 'accepted'
      }
    ],
    summary: {
      oneLiner: '58-year-old male presenting with acute glycemic failure (HbA1c 9.3%), uncontrolled Stage 2 Hypertension (BP 168/102), and early clinical markers of diabetic nephropathy requiring urgent therapy escalation.',
      chiefComplaint: 'Bilateral lower extremity swelling and persistent fatigue over the past 3 weeks; worsening polyuria and nocturia despite dual oral antidiabetic therapy.',
      clinicalSummary: 'Patient has demonstrated progressive loss of glycemic control over a 5-month observation window (HbA1c 7.2% to 9.3%). Despite escalating OHA therapy, fasting glucose remains critically elevated at 224 mg/dL. Concomitant development of trace proteinuria, rising serum creatinine, and bilateral ankle edema warrants urgent renal staging (eGFR/ACR) and consideration of SGLT2i / GLP-1 RA or Basal Insulin initiation. Blood pressure remains uncontrolled at 168/102 mmHg.',
      actionItems: [
        'Order urgent spot Urine ACR (Albumin-to-Creatinine Ratio) and serum eGFR calculation today.',
        'Evaluate transition to Basal Insulin therapy (e.g. Insulin Degludec/Glargine 10 units at bedtime) or GLP-1 RA.',
        'Titrate antihypertensive regimen to achieve goal BP <130/80 mmHg; evaluate Chlorthalidone addition.',
        'Schedule urgent dilated ophthalmological screening for diabetic retinopathy.',
        'Reinforce Penicillin allergy contraindication across all active medication orders.'
      ]
    }
  },

  'P002': {
    patient: {
      name: 'Priya Sharma',
      mrn: 'MRN-2024-1247',
      age: 42,
      gender: 'Female',
      bloodGroup: 'O+',
      allergies: ['NSAIDs (Severe gastric intolerance)', 'Sulfa drugs (Pruritus)']
    },
    aiMeta: {
      confidenceScore: 91,
      groundedEvidenceCount: 6,
      modelUsed: 'Gemini 3.6 Flash (Clinical Decision Support)',
      auditTimestamp: '2026-08-31T14:30:00Z',
      disclaimer: 'AI Clinical Decision Support brief for healthcare professionals. Not a standalone diagnosis.'
    },
    entities: {
      diagnoses: [
        { name: 'Recent NSTEMI Status Post-PCI to LAD', date: 'Feb 2026', status: 'active', icd: 'I21.4' },
        { name: 'Ischemic Cardiomyopathy (Mild LV Dysfunction, EF 45%)', date: 'Apr 2026', status: 'active', icd: 'I25.5' },
        { name: 'NYHA Class II Exertional Dyspnea', date: 'Aug 2026', status: 'active', icd: 'I50.9' },
        { name: 'Pre-Diabetes (HbA1c 5.8%)', date: 'Aug 2026', status: 'active', icd: 'R73.03' }
      ],
      medications: [
        { name: 'Aspirin', dose: '75mg', frequency: 'Oral · Once daily', date: 'Feb 2026', change: 'continued', class: 'Antiplatelet' },
        { name: 'Clopidogrel', dose: '75mg', frequency: 'Oral · Once daily', date: 'Feb 2026', change: 'continued', class: 'P2Y12 Inhibitor' },
        { name: 'Atorvastatin', dose: '80mg', frequency: 'Oral · Once daily (bedtime)', date: 'Aug 2026', change: 'dose-changed', class: 'High-intensity Statin' },
        { name: 'Bisoprolol Fumarate', dose: '5mg', frequency: 'Oral · Once daily', date: 'Aug 2026', change: 'dose-changed', class: 'Beta-blocker' },
        { name: 'Ramipril', dose: '5mg', frequency: 'Oral · Once daily', date: 'Feb 2026', change: 'continued', class: 'ACE Inhibitor' }
      ],
      vitals: [
        { type: 'Blood Pressure', value: '122/78', unit: 'mmHg', reference: '<130/80', date: 'Aug 28, 2026', status: 'normal' },
        { type: 'Heart Rate', value: '68', unit: 'bpm', reference: '60–100', date: 'Aug 28, 2026', status: 'normal' },
        { type: 'Body Weight', value: '67.0', unit: 'kg', reference: 'BMI 24.1', date: 'Aug 28, 2026', status: 'normal' },
        { type: 'Oxygen Saturation (SpO₂)', value: '98', unit: '%', reference: '≥95%', date: 'Aug 28, 2026', status: 'normal' }
      ],
      labResults: [
        { test: 'LDL-Cholesterol', value: '95', unit: 'mg/dL', reference: '<70 (Post-ACS Target <55)', status: 'borderline', date: 'Aug 28, 2026' },
        { test: 'Hemoglobin A1c', value: '5.8', unit: '%', reference: '<5.7%', status: 'borderline', date: 'Aug 28, 2026' },
        { test: 'Cardiac Troponin I', value: '0.02', unit: 'ng/mL', reference: '<0.04', status: 'normal', date: 'Apr 05, 2026' },
        { test: 'Left Ventricular Ejection Fraction (LVEF)', value: '45', unit: '%', reference: '≥55%', status: 'abnormal', date: 'Apr 05, 2026' }
      ],
      symptoms: [
        { description: 'Mild exertional dyspnea when climbing >2 flights of stairs', date: 'Aug 28, 2026', severity: 'mild' },
        { description: 'No acute chest pain, orthopnea, or PND reported', date: 'Aug 28, 2026', severity: 'resolved' }
      ]
    },
    timeline: [
      { date: 'Feb 12, 2026', event: 'Acute NSTEMI & Emergent PCI', type: 'procedure', detail: 'Drug-eluting stent (DES) placed in proximal LAD. Discharged on guideline-directed DAPT + Statin + ACEi + Beta-blocker.', significance: 'critical' },
      { date: 'Apr 05, 2026', event: 'Post-Discharge 30-Day Evaluation', type: 'visit', detail: '2D Echo demonstrated EF 45% with anterior wall hypokinesia. LDL 180 mg/dL on Atorvastatin 40mg.', significance: 'important' },
      { date: 'Aug 28, 2026', event: '6-Month Comprehensive Post-PCI Visit', type: 'visit', detail: 'Hemodynamically stable (BP 122/78). LDL reduced to 95 mg/dL. Titrated Atorvastatin to 80mg and Bisoprolol to 5mg.', significance: 'important' }
    ],
    clinicalChanges: [
      { parameter: 'LDL-Cholesterol', previous: { value: '180 mg/dL', date: 'Apr 05, 2026' }, current: { value: '95 mg/dL', date: 'Aug 28, 2026' }, changeType: 'decreased', magnitude: '-85 mg/dL (-47.2%)', direction: 'improving', clinicalSignificance: 'Substantial Statin Response' },
      { parameter: 'Blood Pressure', previous: { value: '126/82 mmHg', date: 'Apr 05, 2026' }, current: { value: '122/78 mmHg', date: 'Aug 28, 2026' }, changeType: 'decreased', magnitude: '-4/-4 mmHg', direction: 'improving', clinicalSignificance: 'Well-Controlled Target BP' },
      { parameter: 'Heart Rate', previous: { value: '72 bpm', date: 'Apr 05, 2026' }, current: { value: '68 bpm', date: 'Aug 28, 2026' }, changeType: 'decreased', magnitude: '-4 bpm', direction: 'improving', clinicalSignificance: 'Optimal Beta-Blockade Target' }
    ],
    missingInvestigations: [
      { id: 'test-1', test: 'Repeat 2D-Echocardiogram (6-Month Post-PCI)', reason: 'Mandatory follow-up echo overdue to assess LVEF recovery and evaluate eligibility for SGLT2i/ARNI heart failure therapy if EF remains ≤40-45%.', urgency: 'critical', basedOnCondition: 'Post-MI with LVEF 45% (Apr 2026)', lastDone: 'Apr 05, 2026', guidelineRef: 'ESC/AHA Heart Failure Guidelines' },
      { id: 'test-2', test: 'Lipid Panel Re-audit (Target LDL <55 mg/dL)', reason: 'Very high-risk secondary prevention guideline target is LDL <55 mg/dL. Re-check in 8-12 weeks following 80mg titration.', urgency: 'medium', basedOnCondition: 'Post-NSTEMI Secondary Prevention', lastDone: 'Aug 28, 2026', guidelineRef: 'AHA/ACC Secondary Prevention' }
    ],
    riskFlags: [
      {
        id: 'risk-1',
        risk: 'Sub-Target LDL-C for Post-ACS Secondary Prevention (95 mg/dL)',
        severity: 'high',
        confidence: '94%',
        reason: 'Current guidelines (ESC/AHA) recommend LDL-C <55 mg/dL for post-MI patients. Atorvastatin was increased to 80mg; if target is not met, Ezetimibe 10mg should be added.',
        evidence: 'LDL: 95 mg/dL (Goal <55 mg/dL for post-PCI cohort)',
        sourceDocument: 'Biochemistry Panel #LIP-4402',
        date: 'Aug 28, 2026',
        recommendation: 'Recheck lipids in 8 weeks on Atorvastatin 80mg. If LDL remains >55 mg/dL, initiate Ezetimibe 10mg OD.',
        overrideStatus: 'pending'
      },
      {
        id: 'risk-2',
        risk: 'NSAID Contraindication in Post-MI / Cardiac Cohort',
        severity: 'medium',
        confidence: '98%',
        reason: 'Patient has documented severe NSAID allergy and NSAIDs are strictly contraindicated post-MI due to increased risk of stent thrombosis and heart failure exacerbation.',
        evidence: 'Allergy Registry: NSAIDs → Acute gastric distress / intolerance',
        sourceDocument: 'Allergy Registry',
        date: 'Verified',
        recommendation: 'Avoid all systemic NSAIDs and COX-2 inhibitors. For analgesia, use Paracetamol (Acetaminophen) as first line.',
        overrideStatus: 'accepted'
      }
    ],
    summary: {
      oneLiner: '42-year-old female, 6 months post-NSTEMI PCI to LAD with improving lipid parameters (LDL 95) on titrated high-intensity statin therapy; overdue for repeat 2D echocardiogram.',
      chiefComplaint: 'Routine 6-month post-PCI cardiac checkup; reports mild exertional shortness of breath when climbing multiple flights of stairs.',
      clinicalSummary: 'Patient is clinically stable post-LAD PCI with optimal blood pressure (122/78) and resting heart rate (68 bpm). Lipid response has been positive with LDL falling from 180 to 95 mg/dL, prompting titration to Atorvastatin 80mg. Crucially, a repeat 6-month 2D-echocardiogram is overdue to reassess left ventricular ejection fraction recovery.',
      actionItems: [
        'Schedule repeat 2D Transthoracic Echocardiogram to assess LVEF and regional wall motion.',
        'Maintain Dual Antiplatelet Therapy (Aspirin 75mg + Clopidogrel 75mg) through 12-month mark (Feb 2027).',
        'Re-evaluate lipid panel in 8-12 weeks; add Ezetimibe 10mg if LDL remains >55 mg/dL.',
        'Reinforce cardiac rehabilitation exercise guidelines.'
      ]
    }
  },

  'P003': {
    patient: {
      name: 'Arjun Mehta',
      mrn: 'MRN-2025-0334',
      age: 28,
      gender: 'Male',
      bloodGroup: 'A+',
      allergies: ['House Dust Mites (Confirmed skin test)', 'Tree Pollen (Suspected)']
    },
    aiMeta: {
      confidenceScore: 89,
      groundedEvidenceCount: 5,
      modelUsed: 'Gemini 3.6 Flash (Clinical Decision Support)',
      auditTimestamp: '2026-08-31T14:30:00Z',
      disclaimer: 'AI Clinical Decision Support brief for healthcare professionals. Not a standalone diagnosis.'
    },
    entities: {
      diagnoses: [
        { name: 'Moderate Persistent Asthma (Uncontrolled)', date: 'Jan 2026', status: 'active', icd: 'J45.40' },
        { name: 'Allergic Rhinitis (Perennial)', date: 'Jan 2026', status: 'active', icd: 'J30.1' }
      ],
      medications: [
        { name: 'Budesonide / Formoterol', dose: '160/4.5 mcg', frequency: 'Inhalation · 2 puffs BD', date: 'Jan 2026', change: 'continued', class: 'ICS / LABA' },
        { name: 'Salbutamol (Albuterol)', dose: '100 mcg', frequency: 'Inhalation · 2 puffs PRN (Overusing 3x/week)', date: 'Jan 2026', change: 'continued', class: 'SABA' },
        { name: 'Montelukast', dose: '10mg', frequency: 'Oral · Once daily (evening)', date: 'Jan 2026', change: 'continued', class: 'LTRA' },
        { name: 'Cetirizine', dose: '10mg', frequency: 'Oral · Once daily PRN', date: 'Jan 2026', change: 'continued', class: 'Antihistamine' }
      ],
      vitals: [
        { type: 'Blood Pressure', value: '116/74', unit: 'mmHg', reference: '<120/80', date: 'Aug 28, 2026', status: 'normal' },
        { type: 'Heart Rate', value: '92', unit: 'bpm', reference: '60–100', date: 'Aug 28, 2026', status: 'normal' },
        { type: 'Peak Expiratory Flow (PEF)', value: '290', unit: 'L/min', reference: '580 (50% Predicted)', date: 'Aug 28, 2026', status: 'critical' },
        { type: 'Oxygen Saturation (SpO₂)', value: '93', unit: '%', reference: '≥95%', date: 'Aug 28, 2026', status: 'borderline' }
      ],
      labResults: [
        { test: 'Total Serum IgE', value: '450', unit: 'IU/mL', reference: '<100', status: 'abnormal', date: 'Jan 20, 2026' },
        { test: 'Absolute Eosinophil Count', value: '8.0', unit: '%', reference: '1.0–4.0%', status: 'abnormal', date: 'Jan 20, 2026' }
      ],
      symptoms: [
        { description: 'Nocturnal cough awakening patient 2 nights per week', date: 'Aug 28, 2026', severity: 'moderate' },
        { description: 'Short-acting rescue inhaler (Salbutamol) used 3-4 times per week', date: 'Aug 28, 2026', severity: 'moderate' }
      ]
    },
    timeline: [
      { date: 'Jan 20, 2026', event: 'Initial Pulmonology Assessment', type: 'visit', detail: 'Diagnosed with Moderate Persistent Asthma. Baseline PEF 320 L/min (55%). Prescribed Budesonide/Formoterol 160/4.5mcg BD.', significance: 'important' },
      { date: 'Aug 28, 2026', event: 'Current Asthma Flare Encounter', type: 'visit', detail: 'Declining lung function: PEF 290 L/min (50%). SpO2 93%. Frequent rescue SABA reliance signals GINA Step 4 escalation requirement.', significance: 'critical' }
    ],
    clinicalChanges: [
      { parameter: 'Peak Expiratory Flow (PEF)', previous: { value: '320 L/min', date: 'Jan 20, 2026' }, current: { value: '290 L/min', date: 'Aug 28, 2026' }, changeType: 'decreased', magnitude: '-30 L/min (-9.4%)', direction: 'worsening', clinicalSignificance: 'Airway Obstruction Deterioration' },
      { parameter: 'Resting SpO₂', previous: { value: '94%', date: 'Jan 20, 2026' }, current: { value: '93%', date: 'Aug 28, 2026' }, changeType: 'decreased', magnitude: '-1% (borderline hypoxemia)', direction: 'worsening', clinicalSignificance: 'Mild Desaturation' }
    ],
    missingInvestigations: [
      { id: 'test-1', test: 'Formal Pre- & Post-Bronchodilator Spirometry (FEV1/FVC)', reason: 'Objective reversibility testing and flow-volume loop required to assess airway remodeling and step-up ICS/LABA dosing.', urgency: 'critical', basedOnCondition: 'Uncontrolled Asthma + PEF Decline', lastDone: 'Jan 20, 2026', guidelineRef: 'GINA Guidelines 2026' },
      { id: 'test-2', test: 'Fractional Exhaled Nitric Oxide (FeNO)', reason: 'To evaluate ongoing eosinophilic airway inflammation and determine adherence to inhaled corticosteroid therapy.', urgency: 'high', basedOnCondition: 'Frequent SABA reliance', lastDone: null, guidelineRef: 'ATS FeNO Clinical Practice Guidelines' }
    ],
    riskFlags: [
      {
        id: 'risk-1',
        risk: 'Frequent SABA Reliance / Asthma Exacerbation Risk',
        severity: 'critical',
        confidence: '95%',
        reason: 'Patient reports using Salbutamol rescue inhaler 3-4 times per week with nocturnal awakenings. According to GINA criteria, >2 SABA uses/week indicates poor asthma control and substantially increases risk of severe exacerbations requiring hospitalization.',
        evidence: 'SABA use: 3-4x/week | Peak Flow: 290 L/min (50% of personal best) | SpO2: 93%',
        sourceDocument: 'Clinical Consultation Notes',
        date: 'Aug 28, 2026',
        recommendation: 'Step up to GINA Step 4: Increase Budesonide/Formoterol to 320/9 mcg BD or switch to SMART regimen (single maintenance and reliever therapy). Audit inhaler technique.',
        overrideStatus: 'pending'
      }
    ],
    summary: {
      oneLiner: '28-year-old male with uncontrolled Moderate Persistent Asthma (PEF 290 L/min, 50% predicted) demonstrating frequent rescue SABA overuse and nocturnal symptoms; requires GINA Step 4 therapy escalation.',
      chiefComplaint: 'Worsening nocturnal cough and chest tightness awakening patient twice weekly; increased reliance on blue reliever inhaler.',
      clinicalSummary: 'Patient presents with clear features of uncontrolled asthma characterized by dropping peak flow rates (290 L/min), nocturnal symptoms, and excessive SABA usage (3-4x/week). Formal spirometry and FeNO testing are urgently needed. Clinically recommended to escalate to SMART strategy or Step 4 ICS/LABA dosing and review inhaler compliance.',
      actionItems: [
        'Perform formal pre- and post-bronchodilator spirometry with FEV1 response audit.',
        'Escalate maintenance controller therapy to Budesonide/Formoterol 320/9 mcg BD or adopt SMART regimen.',
        'Provide written Asthma Action Plan (green/yellow/red zones).',
        'Review MDI inhaler technique with spacer chamber.'
      ]
    }
  }
};
