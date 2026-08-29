/* =============================================
   CONSULT360 AI — GEMINI VISION OCR SERVICE
   Reads medical images using Gemini Vision:
   - ECG / EKG strips
   - Echo / Echocardiogram reports
   - X-Ray images
   - Handwritten prescriptions & notes
   - Lab report photos
   - Any medical document image
   ============================================= */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// ── Detect type of medical image from filename ────────────────────────────
function detectImageType(filename) {
  const name = filename.toLowerCase();
  if (/ecg|ekg|electrocardiogram|cardiac.strip/.test(name))      return 'ecg';
  if (/echo|echocardiogram|2d.echo|doppler/.test(name))          return 'echo';
  if (/xray|x-ray|x_ray|chest|radiograph|cxr/.test(name))       return 'xray';
  if (/rx|prescription|precription|medic|drug/.test(name))       return 'prescription';
  if (/mri|ct.scan|ct-scan|scan/.test(name))                     return 'scan';
  if (/lab|report|result|blood|urine|pathol/.test(name))         return 'lab';
  if (/handwrit|note|opd|ipd|history|clinical/.test(name))       return 'handwritten';
  return 'general';
}

// ── Build specialised prompt per image type ───────────────────────────────
function buildVisionPrompt(imageType) {
  switch (imageType) {

    case 'ecg':
      return `This is an ECG/EKG strip. You are a cardiologist. Carefully analyze and extract:
- Heart Rate (bpm)
- Rhythm: (Sinus Rhythm / Atrial Fibrillation / SVT / VT / Brady / other)
- PR Interval (ms) — normal 120-200ms
- QRS Duration (ms) — normal <120ms
- QT / QTc Interval (ms)
- ST Segment: Normal / Elevated (specify leads) / Depressed (specify leads)
- T-Wave: Normal / Inverted (specify leads) / Peaked
- P-Wave: Present / Absent / Abnormal
- Axis: Normal / Left axis deviation / Right axis deviation
- Any bundle branch block (LBBB/RBBB)
- Any significant abnormalities or clinical findings
Format as clear structured medical text. State "Not clearly visible" for anything unclear.`;

    case 'echo':
      return `This is an echocardiogram report or image. Extract all findings including:
- Ejection Fraction (EF%) and classification (Normal ≥55% / Mildly reduced 45-54% / Moderately reduced 30-44% / Severely reduced <30%)
- Left Ventricular (LV): size, wall thickness, function, diastolic function grade
- Right Ventricular (RV): size and function
- Atria: Left atrium size, Right atrium
- Mitral Valve: normal / stenosis / regurgitation (mild/moderate/severe)
- Aortic Valve: normal / stenosis / regurgitation
- Tricuspid Valve: findings
- Pericardium: any effusion (trace/small/moderate/large)
- Wall Motion: any hypokinesia / akinesia / dyskinesia (specify segments)
- LVOT / RVOT findings
- Impression / Conclusion if mentioned
Format as structured medical text.`;

    case 'xray':
      return `This is a medical X-ray or radiology image/report. Extract:
- Type of X-ray (Chest PA/AP, Abdomen, etc.)
- Lung fields: any consolidation, effusion, pneumothorax, cardiomegaly
- Heart size and borders
- Mediastinum
- Bones: any fractures, lesions
- Any other findings
- Impression / Radiologist conclusion
Transcribe any printed text visible. Format as structured medical text.`;

    case 'prescription':
      return `This is a medical prescription. Extract ALL medications listed:
For each medication provide:
- Drug name (generic name and brand name if visible)
- Dose (e.g. 500mg, 40mg)
- Route (oral / IV / topical etc.)
- Frequency (OD=once daily / BD=twice / TDS=thrice / QID=four times / SOS=as needed)
- Duration (e.g. 5 days, 1 month, continue)
- Any special instructions (with food, empty stomach, at bedtime)
Also extract: doctor name, date, patient name if visible.
Format as structured medical text.`;

    case 'scan':
      return `This is a medical scan report (MRI/CT). Extract all findings, measurements, and the radiologist's impression. Transcribe all visible text accurately. Format as structured medical text.`;

    case 'lab':
      return `This is a laboratory report or blood/urine test result. Extract:
- Test name
- Patient result value
- Unit (mg/dL, g/dL, %, etc.)
- Reference range (normal range)
- Flag (High H / Low L / Critical C) if marked
- Date of test
For each test result found. Also note the lab name and date. Format as structured medical text.`;

    case 'handwritten':
      return `This is a handwritten medical document (clinical notes, OPD notes, IPD sheet, or doctor's notes). 
Carefully transcribe ALL handwritten text including:
- Patient complaints / symptoms
- Clinical examination findings  
- Diagnosis / impression
- Treatment plan
- Medications prescribed
- Follow-up instructions
- Any vitals or measurements noted
Read carefully — medical handwriting may use abbreviations like:
SOB=Shortness of breath, c/o=complains of, h/o=history of, k/c/o=known case of,
BP=blood pressure, P=pulse, T=temperature, RR=respiratory rate.
Expand abbreviations where possible. Format as structured medical text.`;

    default:
      return `This is a medical document, report, or image. Extract ALL medical information visible including:
- Patient information (name, age, gender if visible)
- Diagnoses, conditions, clinical findings
- Medications, doses, frequency
- Test results, values, reference ranges
- Vital signs
- Doctor's notes, observations, instructions
- Dates of visit / examination
Transcribe ALL handwritten and printed text accurately.
Format as clear structured medical text.`;
  }
}

// ── Main: extract medical info from image using Gemini Vision ─────────────
async function extractTextFromImage(buffer, filename, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY not set in server/.env');
  }

  const genAI  = new GoogleGenerativeAI(apiKey);
  const model  = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
  const imageType = detectImageType(filename);
  const prompt    = buildVisionPrompt(imageType);

  console.log(`[Vision] Processing "${filename}" as type: ${imageType.toUpperCase()} | MIME: ${mimeType}`);

  const base64Image = buffer.toString('base64');

  // ── Correct format for Gemini multimodal (vision) API ────────────────────
  const result = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType   // e.g. "image/jpeg", "image/png"
          }
        },
        { text: prompt }
      ]
    }]
  });

  const text = result.response.text().trim();
  console.log(`[Vision] "${filename}" → extracted ${text.length} chars`);

  if (!text) {
    throw new Error(`Gemini Vision returned empty response for ${filename}`);
  }

  return { text, imageType };
}


// ── Get display label for image type ─────────────────────────────────────
function getImageTypeLabel(imageType) {
  const labels = {
    ecg:          '🫀 ECG Report',
    echo:         '🫀 Echo Report',
    xray:         '🫁 X-Ray',
    prescription: '💊 Prescription',
    scan:         '🧠 MRI/CT Scan',
    lab:          '🧪 Lab Report',
    handwritten:  '📝 Clinical Notes',
    general:      '📋 Medical Document'
  };
  return labels[imageType] || '📋 Medical Document';
}

module.exports = { extractTextFromImage, detectImageType, getImageTypeLabel };
