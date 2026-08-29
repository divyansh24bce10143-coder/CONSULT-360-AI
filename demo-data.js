/* =======================
   CONSULT360 AI — DEMO DATA
   Pre-computed AI results for 3 demo patients.
   No API key needed for these.
   ======================= */

const DEMO_PATIENTS = [
  {
    id: 'P001', name: 'Rajesh Kumar', age: 58, gender: 'Male',
    bloodGroup: 'B+', appointmentTime: '10:30 AM',
    condition: 'T2DM + Hypertension', riskLevel: 'critical', avatar: 'RK',
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
Chief Complaint: Persistent fatigue, ankle swelling
Vitals: BP 168/102 mmHg CRITICAL, HR 88 bpm, Weight 88 kg, SpO2 97%
HbA1c: 9.3% CRITICAL | FBS: 224 mg/dL CRITICAL | Creatinine: 1.1 mg/dL
Urine: Trace protein detected | Bilateral ankle edema
Missing: eGFR, Urine Microalbumin, Fundus Examination
Added: Telmisartan 40mg OD, Glimepiride increased to 2mg
Allergies: Penicillin (rash) | History: Appendectomy 2018`
  },
  {
    id: 'P002', name: 'Priya Sharma', age: 42, gender: 'Female',
    bloodGroup: 'O+', appointmentTime: '11:15 AM',
    condition: 'Post-MI Cardiac Care', riskLevel: 'medium', avatar: 'PS',
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
    id: 'P003', name: 'Arjun Mehta', age: 28, gender: 'Male',
    bloodGroup: 'A+', appointmentTime: '12:00 PM',
    condition: 'Asthma + Allergic Rhinitis', riskLevel: 'low', avatar: 'AM',
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

/* Pre-computed AI Results — shown instantly for demo patients */
const DEMO_RESULTS = {
  'P001': {
    patient: { name: 'Rajesh Kumar', age: 58, gender: 'Male', bloodGroup: 'B+', allergies: ['Penicillin (causes rash)'] },
    entities: {
      diagnoses: [
        { name: 'Type 2 Diabetes Mellitus', date: 'Mar 2026', status: 'active' },
        { name: 'Hypertension — Stage 2', date: 'Mar 2026', status: 'active' },
        { name: 'Bilateral Ankle Edema', date: 'Aug 2026', status: 'active' },
        { name: 'Suspected Diabetic Nephropathy', date: 'Aug 2026', status: 'suspected' },
        { name: 'Appendectomy', date: '2018', status: 'historical' }
      ],
      medications: [
        { name: 'Metformin', dose: '500mg', frequency: 'Twice daily', date: 'Mar 2026', change: 'continued' },
        { name: 'Amlodipine', dose: '5mg', frequency: 'Once daily', date: 'Mar 2026', change: 'continued' },
        { name: 'Glimepiride', dose: '2mg', frequency: 'Once daily', date: 'Aug 2026', change: 'dose-changed' },
        { name: 'Telmisartan', dose: '40mg', frequency: 'Once daily', date: 'Aug 2026', change: 'new' }
      ],
      vitals: [
        { type: 'Blood Pressure', value: '168/102', unit: 'mmHg', date: 'Aug 15, 2026', status: 'critical' },
        { type: 'Heart Rate', value: '88', unit: 'bpm', date: 'Aug 15, 2026', status: 'normal' },
        { type: 'Body Weight', value: '88', unit: 'kg', date: 'Aug 15, 2026', status: 'borderline' },
        { type: 'SpO₂', value: '97', unit: '%', date: 'Aug 15, 2026', status: 'normal' }
      ],
      labResults: [
        { test: 'HbA1c', value: '9.3', unit: '%', reference: '<7.0%', status: 'critical', date: 'Aug 15, 2026' },
        { test: 'Fasting Blood Sugar', value: '224', unit: 'mg/dL', reference: '70–100', status: 'critical', date: 'Aug 15, 2026' },
        { test: 'Creatinine', value: '1.1', unit: 'mg/dL', reference: '0.7–1.2', status: 'borderline', date: 'Aug 15, 2026' },
        { test: 'Urine Protein', value: 'Trace', unit: '', reference: 'Negative', status: 'abnormal', date: 'Aug 15, 2026' },
        { test: 'LDL Cholesterol', value: '145', unit: 'mg/dL', reference: '<100', status: 'abnormal', date: 'Jun 2026' }
      ],
      symptoms: [
        { description: 'Persistent fatigue', date: 'Aug 15, 2026' },
        { description: 'Bilateral ankle edema', date: 'Aug 15, 2026' },
        { description: 'Nocturia — 3–4 times/night', date: 'Aug 15, 2026' },
        { description: 'Increased thirst, blurry vision', date: 'Jun 10, 2026' }
      ]
    },
    timeline: [
      { date: 'Mar 15, 2026', event: 'Routine Diabetes Follow-up', type: 'visit', detail: 'BP 150/95 mmHg · HbA1c 7.2% · FBS 145 mg/dL · Started Metformin + Amlodipine', significance: 'important' },
      { date: 'Mar 15, 2026', event: 'HbA1c — 7.2%', type: 'lab', detail: 'Mildly elevated (Ref <7.0%) — Begin monitoring closely', significance: 'important' },
      { date: 'Mar 15, 2026', event: 'Metformin + Amlodipine Started', type: 'medication', detail: 'Metformin 500mg BD for T2DM · Amlodipine 5mg OD for hypertension', significance: 'normal' },
      { date: 'Jun 10, 2026', event: 'Follow-up — Worsening Symptoms', type: 'visit', detail: 'Increased thirst + blurry vision · Weight increased +2kg · BP rising', significance: 'critical' },
      { date: 'Jun 10, 2026', event: 'HbA1c — 8.1% ↑', type: 'lab', detail: 'Significantly elevated — Upward trend identified · FBS 189 mg/dL', significance: 'critical' },
      { date: 'Jun 10, 2026', event: 'Glimepiride 1mg Added', type: 'medication', detail: 'Escalated to dual OHA therapy due to uncontrolled HbA1c', significance: 'important' },
      { date: 'Aug 15, 2026', event: 'Current Visit — Urgent Concern', type: 'visit', detail: 'Ankle edema + fatigue + proteinuria detected · BP 168/102 — CRITICAL', significance: 'critical' },
      { date: 'Aug 15, 2026', event: 'HbA1c — 9.3% ↑↑ CRITICAL', type: 'lab', detail: 'Poorly controlled diabetes — 3rd consecutive worsening reading', significance: 'critical' },
      { date: 'Aug 15, 2026', event: 'Urine Protein Detected (Trace)', type: 'lab', detail: 'Trace proteinuria — Early diabetic nephropathy pattern · eGFR not done', significance: 'critical' },
      { date: 'Aug 15, 2026', event: 'Telmisartan 40mg Added · Glimepiride Dose ↑2mg', type: 'medication', detail: 'Telmisartan for BP + renal protection · Glimepiride dose doubled', significance: 'important' }
    ],
    clinicalChanges: [
      { parameter: 'HbA1c', previous: { value: '7.2%', date: 'Mar 2026' }, mid: { value: '8.1%', date: 'Jun 2026' }, current: { value: '9.3%', date: 'Aug 2026' }, changeType: 'increased', magnitude: '+29.2% over 5 months', direction: 'worsening', clinicalSignificance: 'significant' },
      { parameter: 'Blood Pressure', previous: { value: '150/95', date: 'Mar 2026' }, mid: { value: '158/98', date: 'Jun 2026' }, current: { value: '168/102', date: 'Aug 2026' }, changeType: 'increased', magnitude: '+12% systolic', direction: 'worsening', clinicalSignificance: 'significant' },
      { parameter: 'Fasting Blood Sugar', previous: { value: '145', date: 'Mar 2026' }, current: { value: '224', date: 'Aug 2026' }, changeType: 'increased', magnitude: '+54.5%', direction: 'worsening', clinicalSignificance: 'significant' },
      { parameter: 'Body Weight', previous: { value: '84 kg', date: 'Mar 2026' }, current: { value: '88 kg', date: 'Aug 2026' }, changeType: 'increased', magnitude: '+4 kg (+4.8%)', direction: 'worsening', clinicalSignificance: 'moderate' },
      { parameter: 'Creatinine', previous: { value: '0.9 mg/dL', date: 'Mar 2026' }, current: { value: '1.1 mg/dL', date: 'Aug 2026' }, changeType: 'increased', magnitude: '+22.2%', direction: 'worsening', clinicalSignificance: 'moderate' },
      { parameter: 'Glimepiride Dose', previous: { value: '1mg OD', date: 'Jun 2026' }, current: { value: '2mg OD', date: 'Aug 2026' }, changeType: 'increased', magnitude: '2× dose escalation', direction: 'stable', clinicalSignificance: 'moderate' }
    ],
    missingInvestigations: [
      { test: 'eGFR — Estimated Glomerular Filtration Rate', reason: 'Rising creatinine (0.9→1.1) combined with trace proteinuria and ankle edema in a T2DM patient is a classic CKD red flag. eGFR needed urgently to stage kidney disease.', urgency: 'critical', basedOnCondition: 'T2DM + Rising Creatinine + Proteinuria', lastDone: null },
      { test: 'Urine Microalbumin / ACR (Albumin:Creatinine Ratio)', reason: 'Trace urine protein detected. Microalbumin is the gold-standard early marker for diabetic nephropathy — should have been done at every visit.', urgency: 'critical', basedOnCondition: 'T2DM + Urine Protein Trace', lastDone: null },
      { test: 'Fundus Examination (Retinal Screening)', reason: 'T2DM patient with HbA1c 9.3%. Annual retinal screening is mandatory to detect diabetic retinopathy. Never recorded in any visit.', urgency: 'high', basedOnCondition: 'T2DM >2 years with poor glycemic control', lastDone: null },
      { test: 'Lipid Profile (LDL, HDL, Triglycerides)', reason: 'Last cholesterol recorded in June 2026. LDL was 145 mg/dL — well above target of <100 for high-CV-risk diabetic patients. Needs recheck.', urgency: 'high', basedOnCondition: 'T2DM + Hypertension (High Cardiovascular Risk)', lastDone: 'Jun 2026' },
      { test: 'Serum Electrolytes (Na⁺, K⁺)', reason: 'Patient on Telmisartan (ARB) — risk of hyperkalemia. Ankle edema may also indicate electrolyte disturbance or fluid retention.', urgency: 'medium', basedOnCondition: 'Telmisartan use + Bilateral Ankle Edema', lastDone: null },
      { test: 'ECG — Electrocardiogram', reason: 'Stage 2 hypertension over 5+ months. Annual ECG recommended to rule out left ventricular hypertrophy (LVH).', urgency: 'medium', basedOnCondition: 'Stage 2 Hypertension — Ongoing', lastDone: null }
    ],
    riskFlags: [
      { risk: 'Critical Glycemic Failure — HbA1c 9.3%', severity: 'critical', reason: 'HbA1c has progressively risen from 7.2% → 8.1% → 9.3% over 5 months despite dual OHA therapy (Metformin + Glimepiride). This indicates pharmacological failure and imminent need for insulin.', evidence: 'HbA1c: 7.2% (Mar) → 8.1% (Jun) → 9.3% (Aug) · 3 consecutive worsening readings', sourceDocument: 'Lab Report — Current Visit', date: 'Aug 15, 2026', recommendation: 'Consider insulin initiation (basal insulin as first step). Urgent Endocrinology referral. Structured diabetes education. Dietary assessment.' },
      { risk: 'Early Diabetic Nephropathy — High Suspicion', severity: 'critical', reason: 'Triad of trace proteinuria + rising creatinine (0.9→1.1 mg/dL) + bilateral ankle edema in an uncontrolled T2DM patient strongly suggests early diabetic kidney disease. eGFR and urine ACR are critically overdue.', evidence: 'Urine Protein: Trace | Creatinine: 1.1 mg/dL (↑22%) | Ankle edema (new symptom)', sourceDocument: 'Urine Report + Clinical Exam', date: 'Aug 15, 2026', recommendation: 'URGENT: Order eGFR + urine microalbumin ACR today. Continue Telmisartan (proven renoprotection). Nephrology referral if eGFR <60.' },
      { risk: 'Hypertensive Crisis Risk — BP 168/102 mmHg', severity: 'high', reason: 'Blood pressure has progressively worsened over 5 months despite Amlodipine + Telmisartan. Stage 2 hypertension in a diabetic patient doubles the risk of CVD events and accelerates kidney damage.', evidence: 'BP: 150/95 (Mar) → 158/98 (Jun) → 168/102 (Aug) · Target for T2DM: <130/80', sourceDocument: 'Vitals — All 3 Visits', date: 'Aug 15, 2026', recommendation: 'Target BP <130/80 mmHg. Check medication compliance. Consider adding thiazide diuretic (e.g., chlorthalidone). Cardiology review.' },
      { risk: 'Penicillin Allergy — Active Prescribing Alert', severity: 'medium', reason: 'Documented Penicillin allergy causing rash. Any beta-lactam antibiotics (amoxicillin, ampicillin, co-amoxiclav) must be avoided. Cross-reactivity with cephalosporins should also be considered.', evidence: 'Allergy History: Penicillin → Skin rash (documented)', sourceDocument: 'Patient Medical History', date: 'Existing (on record)', recommendation: 'Flag prominently in EMR. If antibiotic required: use macrolides (azithromycin) or quinolones (levofloxacin). Avoid all beta-lactams.' }
    ],
    summary: {
      oneLiner: '58-year-old male with rapidly worsening T2DM (HbA1c 9.3%), hypertensive crisis risk (BP 168/102), and early diabetic nephropathy signs — urgent multi-specialist intervention required.',
      chiefComplaint: 'Persistent fatigue and bilateral ankle edema; worsening diabetes and blood pressure despite medication escalation',
      clinicalSummary: 'Rajesh Kumar is a 58-year-old male with Type 2 Diabetes and Stage 2 Hypertension showing a dangerous 5-month downward trajectory. HbA1c has escalated from 7.2% to 9.3% despite dual OHA therapy, strongly suggesting pharmacological failure and insulin need. BP has worsened to 168/102 mmHg on two agents. Most critically, new trace proteinuria with rising creatinine and bilateral ankle edema form a classic early diabetic nephropathy triad. Three urgently needed investigations (eGFR, ACR, fundus exam) have never been performed. Telmisartan added appropriately for renoprotection.',
      keyFindings: [
        'HbA1c 9.3% — 3rd consecutive worsening reading, dual OHA failure likely',
        'BP 168/102 mmHg — Stage 2, progressive despite 2 antihypertensives',
        'Trace proteinuria + creatinine ↑22% — early nephropathy pattern',
        'Bilateral ankle edema — new finding, likely multifactorial',
        'Critical investigations NEVER done: eGFR, Urine ACR, Fundus Exam'
      ],
      actionItems: [
        '🚨 URGENT: Order eGFR + Urine Microalbumin/ACR TODAY',
        '💉 Discuss insulin initiation — HbA1c 9.3% on dual OHA',
        '🏥 Refer to Endocrinology (glycemia) + Nephrology if eGFR <60',
        '💊 Optimize BP target <130/80 mmHg — consider adding thiazide',
        '👁 Schedule Fundus Examination (Retinal Screening)',
        '🧪 Repeat Lipid Profile (LDL was 145 in Jun, target <100)',
        '⚗️ Check Serum Electrolytes (K⁺ — Telmisartan risk)'
      ]
    }
  },

  'P002': {
    patient: { name: 'Priya Sharma', age: 42, gender: 'Female', bloodGroup: 'O+', allergies: ['NSAIDs (gastric irritation)', 'Sulfa drugs'] },
    entities: {
      diagnoses: [
        { name: 'NSTEMI — Non-ST Elevation MI', date: 'Feb 2026', status: 'historical' },
        { name: 'Post-PCI (LAD Stent)', date: 'Feb 2026', status: 'active' },
        { name: 'Reduced Ejection Fraction (EF 45%)', date: 'Apr 2026', status: 'active' },
        { name: 'Dyslipidemia', date: 'Apr 2026', status: 'active' },
        { name: 'Pre-Diabetes (HbA1c 5.8%)', date: 'Aug 2026', status: 'active' }
      ],
      medications: [
        { name: 'Aspirin', dose: '75mg', frequency: 'Once daily', date: 'Feb 2026', change: 'continued' },
        { name: 'Clopidogrel', dose: '75mg', frequency: 'Once daily', date: 'Feb 2026', change: 'continued' },
        { name: 'Atorvastatin', dose: '80mg', frequency: 'Once daily', date: 'Aug 2026', change: 'dose-changed' },
        { name: 'Bisoprolol', dose: '5mg', frequency: 'Once daily', date: 'Aug 2026', change: 'dose-changed' },
        { name: 'Ramipril', dose: '5mg', frequency: 'Once daily', date: 'Feb 2026', change: 'continued' }
      ],
      vitals: [
        { type: 'Blood Pressure', value: '122/78', unit: 'mmHg', date: 'Aug 28, 2026', status: 'normal' },
        { type: 'Heart Rate', value: '68', unit: 'bpm', date: 'Aug 28, 2026', status: 'normal' },
        { type: 'Body Weight', value: '67', unit: 'kg', date: 'Aug 28, 2026', status: 'normal' }
      ],
      labResults: [
        { test: 'LDL Cholesterol', value: '95', unit: 'mg/dL', reference: '<70 mg/dL (post-MI target)', status: 'abnormal', date: 'Aug 28, 2026' },
        { test: 'HbA1c', value: '5.8', unit: '%', reference: '<5.7% (normal)', status: 'borderline', date: 'Aug 28, 2026' },
        { test: 'Creatinine', value: '0.8', unit: 'mg/dL', reference: '0.5–1.1', status: 'normal', date: 'Aug 28, 2026' },
        { test: 'Ejection Fraction', value: '45', unit: '%', reference: '>55% (normal)', status: 'abnormal', date: 'Apr 2026' }
      ],
      symptoms: [
        { description: 'Exertional dyspnea — NYHA Class II', date: 'Aug 28, 2026' }
      ]
    },
    timeline: [
      { date: 'Feb 2026', event: 'NSTEMI — PCI (LAD Stent)', type: 'procedure', detail: 'Non-ST elevation MI. Percutaneous coronary intervention performed on LAD. Started DAPT + statin + BB + ACEi.', significance: 'critical' },
      { date: 'Apr 5, 2026', event: '30-Day Post-Discharge Review', type: 'visit', detail: 'EF 45% (mildly reduced) · LDL 180 mg/dL — above target · Hemodynamically stable · Troponin normal', significance: 'important' },
      { date: 'Apr 5, 2026', event: 'LDL — 180 mg/dL (Above Target)', type: 'lab', detail: 'Post-MI target is LDL <70 mg/dL. Currently 180 — 157% above target. Statin dose suboptimal.', significance: 'critical' },
      { date: 'Aug 28, 2026', event: 'Current Visit — 6-Month Follow-up', type: 'visit', detail: 'Exertional dyspnea NYHA II · No chest pain · No recurrent MI symptoms · BP well controlled', significance: 'important' },
      { date: 'Aug 28, 2026', event: 'LDL — 95 mg/dL (Improved, Not at Target)', type: 'lab', detail: 'Improved from 180 → 95 mg/dL. Target is <70. Atorvastatin dose increased to 80mg.', significance: 'important' },
      { date: 'Aug 28, 2026', event: 'Pre-Diabetes Detected — HbA1c 5.8%', type: 'lab', detail: 'New finding: HbA1c 5.8% = pre-diabetic range. High-risk given cardiac history. Lifestyle intervention needed.', significance: 'critical' },
      { date: 'Aug 28, 2026', event: 'Atorvastatin ↑80mg · Bisoprolol ↑5mg', type: 'medication', detail: 'Therapy intensification. LDL still above target. LVEF borderline requires HR optimization.', significance: 'important' }
    ],
    clinicalChanges: [
      { parameter: 'LDL Cholesterol', previous: { value: '180 mg/dL', date: 'Apr 2026' }, current: { value: '95 mg/dL', date: 'Aug 2026' }, changeType: 'decreased', magnitude: '−47.2% reduction', direction: 'improving', clinicalSignificance: 'significant' },
      { parameter: 'Blood Pressure', previous: { value: '126/82', date: 'Apr 2026' }, current: { value: '122/78', date: 'Aug 2026' }, changeType: 'decreased', magnitude: '−3% improvement', direction: 'improving', clinicalSignificance: 'mild' },
      { parameter: 'Heart Rate', previous: { value: '72 bpm', date: 'Apr 2026' }, current: { value: '68 bpm', date: 'Aug 2026' }, changeType: 'decreased', magnitude: '−5.6% (target <70 bpm)', direction: 'improving', clinicalSignificance: 'mild' },
      { parameter: 'Atorvastatin Dose', previous: { value: '40mg OD', date: 'Apr 2026' }, current: { value: '80mg OD', date: 'Aug 2026' }, changeType: 'increased', magnitude: '2× dose escalation', direction: 'stable', clinicalSignificance: 'moderate' }
    ],
    missingInvestigations: [
      { test: 'Repeat Echocardiogram', reason: 'EF was 45% post-MI in April. 6-month echo is standard of care to assess cardiac recovery. Overdue as of Aug 2026.', urgency: 'critical', basedOnCondition: 'Post-MI Reduced EF — 6-Month Review', lastDone: 'Apr 2026 (EF 45%)' },
      { test: 'Exercise Stress Test (Treadmill Test)', reason: 'Exertional dyspnea (NYHA II) needs functional capacity assessment. Also screens for residual ischemia in post-PCI patient.', urgency: 'high', basedOnCondition: 'Exertional Dyspnea + Post-PCI', lastDone: null },
      { test: 'NT-proBNP or BNP (Heart Failure Marker)', reason: 'Dyspnea on exertion with EF 45% — BNP helps differentiate cardiac vs other causes of breathlessness.', urgency: 'high', basedOnCondition: 'Reduced EF + NYHA Class II Symptoms', lastDone: null },
      { test: 'Fasting Glucose / OGTT', reason: 'HbA1c 5.8% (pre-diabetic). Fasting glucose and OGTT needed for full pre-diabetes assessment in high-risk cardiac patient.', urgency: 'medium', basedOnCondition: 'HbA1c 5.8% (Pre-Diabetes Range)', lastDone: null }
    ],
    riskFlags: [
      { risk: 'LDL 95 mg/dL — Not at Post-MI Target', severity: 'high', reason: 'Post-MI/PCI patients require LDL <70 mg/dL (ACC/AHA guidelines). Current LDL of 95 mg/dL is 35% above target despite Atorvastatin 80mg. Residual risk for recurrent MI remains elevated.', evidence: 'LDL: 180 mg/dL (Apr) → 95 mg/dL (Aug). Target: <70 mg/dL. Gap: +25 mg/dL', sourceDocument: 'Lipid Profile — Aug 28, 2026', date: 'Aug 28, 2026', recommendation: 'Consider adding Ezetimibe 10mg (additive LDL reduction). If target not reached, discuss PCSK9 inhibitor (evolocumab/alirocumab). Dietary counseling.' },
      { risk: 'Pre-Diabetes Detected — HbA1c 5.8%', severity: 'medium', reason: 'Newly identified HbA1c 5.8% (pre-diabetic range: 5.7–6.4%). Post-MI patients who develop T2DM have 3× higher mortality risk. Requires immediate lifestyle intervention.', evidence: 'HbA1c 5.8% — First documented at this visit', sourceDocument: 'Lab Report — Aug 28, 2026', date: 'Aug 28, 2026', recommendation: 'Structured lifestyle modification (diet + 150 min/week aerobic exercise). Repeat HbA1c in 3 months. Consider Metformin if lifestyle insufficient.' },
      { risk: 'Echocardiogram Overdue — EF Monitoring Gap', severity: 'medium', reason: 'Last EF was 45% (borderline reduced) in April 2026. 6-month echo is the standard of care for monitoring post-MI LV function recovery. Currently 4 months overdue.', evidence: 'EF 45% (Apr 2026) · No repeat echo documented', sourceDocument: 'Echocardiogram — Apr 2026', date: 'Aug 28, 2026', recommendation: 'Schedule repeat echocardiogram urgently. If EF improved to >50%, may reconsider LVEF-targeted therapy intensity.' }
    ],
    summary: {
      oneLiner: '42-year-old post-MI female showing good BP/HR control but LDL above target (95 vs <70), new pre-diabetes, and overdue echocardiogram requiring therapy intensification.',
      chiefComplaint: 'Exertional dyspnea (NYHA Class II) at 6-month post-MI cardiac follow-up',
      clinicalSummary: 'Priya Sharma is a 42-year-old female, 6 months post-NSTEMI and LAD PCI, on dual antiplatelet therapy. LDL has improved from 180 to 95 mg/dL with statin therapy but remains above the post-MI target of <70 mg/dL. A new finding of pre-diabetes (HbA1c 5.8%) requires urgent lifestyle intervention. Exertional dyspnea NYHA Class II with a previously reduced EF (45%) warrants an urgent repeat echocardiogram and BNP measurement. Overall trajectory is positive but residual cardiovascular risk remains significant.',
      keyFindings: [
        'LDL improved 47% (180→95) but still above post-MI target of <70 mg/dL',
        'New pre-diabetes found: HbA1c 5.8% — never previously documented',
        'Repeat echocardiogram overdue (EF was 45% in April 2026)',
        'Exertional dyspnea NYHA Class II — needs functional assessment',
        'BP and HR well controlled on current regimen'
      ],
      actionItems: [
        '🫀 URGENT: Repeat Echocardiogram (EF was 45% — 4 months overdue)',
        '💊 Add Ezetimibe 10mg to reach LDL target <70 mg/dL',
        '🩺 Order BNP/NT-proBNP for dyspnea workup',
        '🏃 Lifestyle counseling for pre-diabetes (HbA1c 5.8%)',
        '🧪 Schedule Exercise Stress Test',
        '📋 Review DAPT duration — 6 months post-PCI decision point'
      ]
    }
  },

  'P003': {
    patient: { name: 'Arjun Mehta', age: 28, gender: 'Male', bloodGroup: 'A+', allergies: ['Dust mites (confirmed)', 'Pollen (suspected)'] },
    entities: {
      diagnoses: [
        { name: 'Moderate Persistent Asthma', date: 'Jan 2026', status: 'active' },
        { name: 'Allergic Rhinitis', date: 'Jan 2026', status: 'active' }
      ],
      medications: [
        { name: 'Budesonide/Formoterol', dose: '160/4.5mcg', frequency: 'Twice daily (inhaler)', date: 'Jan 2026', change: 'continued' },
        { name: 'Salbutamol', dose: '100mcg', frequency: 'As needed (SABA)', date: 'Aug 2026', change: 'overused' },
        { name: 'Montelukast', dose: '10mg', frequency: 'Once daily', date: 'Jan 2026', change: 'continued' },
        { name: 'Cetirizine', dose: '10mg', frequency: 'Once daily', date: 'Jan 2026', change: 'continued' }
      ],
      vitals: [
        { type: 'SpO₂', value: '93', unit: '%', date: 'Aug 28, 2026', status: 'borderline' },
        { type: 'Heart Rate', value: '92', unit: 'bpm', date: 'Aug 28, 2026', status: 'normal' },
        { type: 'Peak Flow', value: '290', unit: 'L/min (50% predicted)', date: 'Aug 28, 2026', status: 'abnormal' }
      ],
      labResults: [
        { test: 'Peak Flow Rate', value: '290', unit: 'L/min', reference: '>580 L/min (predicted)', status: 'critical', date: 'Aug 28, 2026' },
        { test: 'IgE (Total)', value: '450', unit: 'IU/mL', reference: '<100 IU/mL', status: 'abnormal', date: 'Jan 2026' },
        { test: 'Eosinophils', value: '8', unit: '%', reference: '<5%', status: 'abnormal', date: 'Jan 2026' },
        { test: 'FEV1/FVC', value: '0.68', unit: '', reference: '>0.75', status: 'abnormal', date: 'Jan 2026' }
      ],
      symptoms: [
        { description: 'Worsening night-time cough', date: 'Aug 28, 2026' },
        { description: 'Rescue inhaler use 3×/week (uncontrolled marker)', date: 'Aug 28, 2026' }
      ]
    },
    timeline: [
      { date: 'Jan 20, 2026', event: 'New Diagnosis — Asthma + Allergic Rhinitis', type: 'visit', detail: 'Moderate persistent asthma confirmed by spirometry (FEV1/FVC 0.68). IgE 450 IU/mL. Step 3 therapy initiated.', significance: 'critical' },
      { date: 'Jan 20, 2026', event: 'Spirometry — FEV1/FVC 0.68', type: 'lab', detail: 'Obstructive pattern confirmed. Peak flow 320 L/min = 55% predicted (Yellow Zone).', significance: 'important' },
      { date: 'Jan 20, 2026', event: 'IgE 450 IU/mL — Highly Elevated', type: 'lab', detail: '450 IU/mL vs normal <100. Suggestive of significant atopic burden. Allergen panel not done.', significance: 'important' },
      { date: 'Aug 28, 2026', event: 'Current Visit — Uncontrolled Asthma', type: 'visit', detail: 'Night cough worsening. SABA overuse 3×/week. SpO₂ 93%. Peak flow dropping to 290 L/min.', significance: 'critical' },
      { date: 'Aug 28, 2026', event: 'Peak Flow — 290 L/min ↓ (50% predicted)', type: 'lab', detail: 'Worsened from 320 to 290 L/min. Yellow/Orange zone. Indicates deteriorating asthma control.', significance: 'critical' },
      { date: 'Aug 28, 2026', event: 'SABA Overuse Detected', type: 'symptom', detail: '3 rescue inhaler uses in past week = GINA marker of uncontrolled asthma. Step-up therapy indicated.', significance: 'critical' }
    ],
    clinicalChanges: [
      { parameter: 'Peak Flow Rate', previous: { value: '320 L/min (55%)', date: 'Jan 2026' }, current: { value: '290 L/min (50%)', date: 'Aug 2026' }, changeType: 'decreased', magnitude: '−9.4% decline', direction: 'worsening', clinicalSignificance: 'significant' },
      { parameter: 'SpO₂', previous: { value: '94%', date: 'Jan 2026' }, current: { value: '93%', date: 'Aug 2026' }, changeType: 'decreased', magnitude: '−1% point', direction: 'worsening', clinicalSignificance: 'moderate' },
      { parameter: 'SABA (Rescue Inhaler) Use', previous: { value: 'PRN (occasional)', date: 'Jan 2026' }, current: { value: '3×/week (overuse)', date: 'Aug 2026' }, changeType: 'increased', magnitude: 'Chronic overuse', direction: 'worsening', clinicalSignificance: 'significant' }
    ],
    missingInvestigations: [
      { test: 'Allergen-Specific IgE Panel (RAST test)', reason: 'Total IgE is 450 IU/mL but specific allergens beyond dust mites not identified. Specific IgE panel guides allergen avoidance and immunotherapy eligibility.', urgency: 'high', basedOnCondition: 'Allergic Asthma + Rhinitis — Elevated IgE', lastDone: null },
      { test: 'Repeat Spirometry (FEV1/FVC)', reason: 'Last spirometry was January 2026. Worsening symptoms + peak flow drop warrant reassessment. Key for step-up therapy decision.', urgency: 'high', basedOnCondition: 'Uncontrolled Asthma — Step-Up Decision', lastDone: 'Jan 2026 (FEV1/FVC 0.68)' },
      { test: 'Chest X-Ray', reason: 'Worsening respiratory symptoms with SpO₂ 93%. Chest X-ray needed to rule out infection, pneumothorax, or hyperinflation.', urgency: 'medium', basedOnCondition: 'Worsening Asthma + SpO₂ 93%', lastDone: null },
      { test: 'Fractional Exhaled Nitric Oxide (FeNO)', reason: 'Measures airway eosinophilic inflammation. Helps assess ICS adequacy and predict steroid response. Important for step-up decision in eosinophilic asthma.', urgency: 'medium', basedOnCondition: 'Eosinophilia 8% + Uncontrolled Asthma', lastDone: null }
    ],
    riskFlags: [
      { risk: 'Uncontrolled Asthma — GINA Step-Up Indicated', severity: 'high', reason: 'SABA use ≥3×/week is a GINA-defined marker of uncontrolled asthma. Peak flow has dropped from 320 to 290 L/min (50% predicted — Yellow/Orange zone). Current Step 3 therapy is insufficient.', evidence: 'SABA 3×/week · Peak flow 50% predicted · Night cough worsening', sourceDocument: 'Clinical Assessment — Aug 28, 2026', date: 'Aug 28, 2026', recommendation: 'Step up to GINA Step 4: Increase ICS dose or add LAMA (tiotropium). Consider allergen immunotherapy referral. Asthma action plan review.' },
      { risk: 'Low SpO₂ (93%) — Monitor for Acute Exacerbation', severity: 'medium', reason: 'SpO₂ of 93% is at the lower normal limit. Combined with worsening peak flow and SABA overuse, this may indicate a developing acute exacerbation.', evidence: 'SpO₂: 94% (Jan) → 93% (Aug) · Worsening peak flow', sourceDocument: 'Vitals — Current Visit', date: 'Aug 28, 2026', recommendation: 'Monitor SpO₂ closely. If SpO₂ <92% or peak flow <50%: administer rescue bronchodilator and consider oral prednisolone. Asthma attack plan to patient.' }
    ],
    summary: {
      oneLiner: '28-year-old male with worsening uncontrolled asthma (SABA overuse, peak flow 50% predicted, SpO₂ 93%) requiring step-up therapy and allergen workup.',
      chiefComplaint: 'Worsening night-time cough and frequent rescue inhaler use over the past month',
      clinicalSummary: 'Arjun Mehta is a 28-year-old male with Moderate Persistent Asthma and Allergic Rhinitis, diagnosed in January 2026. Despite Step 3 therapy (Budesonide/Formoterol + Montelukast + antihistamine), asthma control has deteriorated. SABA use of 3×/week is a GINA marker of uncontrolled disease. Peak flow has dropped from 320 to 290 L/min (50% predicted). SpO₂ is 93%, borderline. Allergen-specific IgE panel and repeat spirometry are critically overdue for therapy escalation decisions. Patient is a candidate for allergen immunotherapy and GINA Step 4 escalation.',
      keyFindings: [
        'SABA (rescue inhaler) 3×/week = GINA uncontrolled asthma marker',
        'Peak flow dropped: 320 → 290 L/min (55% → 50% predicted)',
        'SpO₂ 93% — borderline, risk of acute exacerbation',
        'Total IgE 450 IU/mL — allergen panel never done',
        'Repeat spirometry overdue since Jan 2026'
      ],
      actionItems: [
        '📈 Step up to GINA Step 4 therapy (increase ICS dose or add LAMA)',
        '🧪 Order Allergen-Specific IgE Panel (RAST)',
        '💨 Repeat Spirometry (FEV1/FVC)',
        '📷 Chest X-Ray to rule out infection/hyperinflation',
        '🌬 Order FeNO (eosinophilic inflammation marker)',
        '📋 Review and update written Asthma Action Plan with patient',
        '🏥 Refer to Allergy/Immunology for immunotherapy consideration'
      ]
    }
  }
};
