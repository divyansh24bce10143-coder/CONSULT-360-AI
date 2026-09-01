/* ==========================================================================
   CONSULT 360 AI — GEMINI VISION OCR & MULTIMODAL INGESTION SERVICE
   Reads medical images and visual PDFs using Gemini Vision:
   - ECG / EKG waveforms and lead intervals
   - 2D Echocardiograms (EF%, chamber dimensions, valves)
   - Chest Radiographs / X-Rays
   - Handwritten clinical prescriptions & OPD notes
   - Laboratory report photos
   - Scanned medical PDFs
   ========================================================================== */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// ── Detect type of medical document from filename ─────────────────────────
function detectImageType(filename) {
  const name = (filename || '').toLowerCase();
  if (/ecg|ekg|electrocardiogram|cardiac.strip|rhythm/.test(name)) return 'ecg';
  if (/echo|echocardiogram|2d.echo|doppler|lvef/.test(name))      return 'echo';
  if (/xray|x-ray|x_ray|chest|radiograph|cxr/.test(name))        return 'xray';
  if (/rx|prescription|precription|medic|drug|dose/.test(name))   return 'prescription';
  if (/mri|ct.scan|ct-scan|scan|brain|head/.test(name))          return 'scan';
  if (/lab|report|result|blood|urine|pathol|cbc|lipid/.test(name)) return 'lab';
  if (/handwrit|note|opd|ipd|history|clinical|chart/.test(name)) return 'handwritten';
  return 'general';
}

// ── Specialised clinical extraction prompt per modality ───────────────────
function buildVisionPrompt(imageType) {
  switch (imageType) {
    case 'ecg':
      return `You are a clinical cardiologist analyzing this ECG/EKG tracing. Extract and transcribe all diagnostic metrics:
- Heart Rate (bpm)
- Cardiac Rhythm (Normal Sinus / Atrial Fibrillation / SVT / VT / Junctional / Bradycardia)
- PR Interval (ms) [Normal: 120–200ms]
- QRS Duration (ms) [Normal: <120ms]
- QT / QTc Interval (ms)
- ST Segment: (Isoelectric / ST Elevation [specify leads] / ST Depression [specify leads])
- T-Wave Morphology: (Normal / Inverted / Peaked / Biphasic)
- P-Wave Morphology & PR segment
- Cardiac Axis (Normal / Left Axis Deviation / Right Axis Deviation)
- Conduction Blocks (LBBB / RBBB / Fascicular block / AV block)
- Diagnostic Clinical Summary / Interpretation
Format as structured clinical text. If any metric is obscured, note "Not clearly visualized".`;

    case 'echo':
      return `You are a cardiologist analyzing this Echocardiogram report/image. Extract and transcribe all findings:
- Left Ventricular Ejection Fraction (LVEF %) and classification
- LV Dimensions & Wall Thickness (LVIDd, LVIDs, IVSd, LVPWd)
- Regional Wall Motion Abnormalities (RWMA): specify segments (hypokinesia, akinesia, dyskinesia)
- Valvular Assessment:
  * Mitral Valve (stenosis/regurgitation grade)
  * Aortic Valve (stenosis/regurgitation grade, peak gradient)
  * Tricuspid & Pulmonary Valves
- Diastolic Function Grade (E/A ratio, E/e')
- Atrial & Right Ventricular Dimensions (LA size, RV systolic function)
- Pericardial Effusion (None / Trace / Small / Moderate / Large)
- Final Clinical Conclusion / Impression
Format as structured clinical medical text.`;

    case 'xray':
      return `You are a radiologist analyzing this chest radiograph / X-Ray image. Extract all findings:
- Examination View: (PA / AP / Lateral)
- Bony Thorax & Soft Tissues
- Cardiac Silhouette & Mediastinum (Cardiothoracic ratio, cardiomegaly presence)
- Lung Fields & Parenchyma (Consolidations, infiltrates, nodules, reticular opacities)
- Pleural Spaces (Effusion, blunting of costophrenic angles, pneumothorax)
- Diaphragm & Subdiaphragmatic space
- Lines, Tubes, or Devices (if present)
- Impression / Radiological Diagnosis
Format as structured clinical medical text.`;

    case 'prescription':
      return `You are an expert clinical pharmacist and physician transcribing this medical prescription / handwritten doctor note:
- Date of Prescription
- Prescribing Doctor / Department
- Patient Identifiers (Name, Age, Gender, MRN if visible)
- Each Prescribed Medication:
  * Drug Name (Generic / Brand)
  * Strength / Dose (e.g. 500mg, 5mg)
  * Route of Administration (Oral, IV, Inhalation)
  * Frequency & Timing (e.g. OD, BD, TDS, PRN, before/after food)
  * Duration of therapy
- Diagnostic Notes / Clinical Impression mentioned
- Special Physician Instructions / Dietary or lifestyle precautions
Transcribe every item meticulously. Highlight any illegible handwriting as [Unclear: best guess].`;

    case 'lab':
      return `You are a laboratory pathologist extracting quantitative results from this lab report:
- Patient Name, Age, MRN, Sample Date
- Test Names & Categories (Biochemistry, Hematology, Urinalysis, Immunology)
- Extracted Numerical Values & Units (e.g. 145 mg/dL, 9.3 %)
- Reference Normal Ranges provided
- Flag any abnormal / critical values clearly with [ABNORMAL] or [CRITICAL]
Format as structured clinical tabular text.`;

    default:
      return `You are a clinical physician transcribing this patient medical document:
- Document Type & Encounter Date
- Chief Complaints & History of Present Illness
- Vital Signs (BP, HR, RR, Temp, SpO2, Weight)
- Diagnoses / Assessment
- Medication Regimen & Dosages
- Laboratory / Diagnostic Findings
- Clinical Plan & Follow-up Directives
Format as clean structured clinical text.`;
  }
}

// ── Resilient execution with retry for transient network drops ─────────────
async function generateContentWithRetry(model, payload, retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await model.generateContent(payload);
    } catch (err) {
      lastError = err;
      console.warn(`[Vision OCR] Attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt < retries) {
        const delay = attempt * 1200; // Exponential backoff: 1.2s, 2.4s
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

// ── Main: Extract clinical text from image / visual PDF buffer ─────────────
async function extractTextFromImage(buffer, filename, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY not configured in server/.env');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.6-flash',
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 8192
    }
  });

  const imageType = detectImageType(filename);
  const prompt = buildVisionPrompt(imageType);

  console.log(`[Vision OCR] Ingesting "${filename}" as ${imageType.toUpperCase()} | MIME: ${mimeType}`);

  const base64Data = buffer.toString('base64');

  const result = await generateContentWithRetry(model, {
    contents: [{
      role: 'user',
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType || 'application/pdf'
          }
        },
        { text: prompt }
      ]
    }]
  });

  const text = result.response.text().trim();
  console.log(`[Vision OCR] "${filename}" → extracted ${text.length} characters`);

  if (!text) {
    throw new Error(`Gemini Multimodal returned empty output for "${filename}".`);
  }

  return { text, imageType };
}

// ── Display Label Helper ───────────────────────────────────────────────────
function getImageTypeLabel(imageType) {
  const labels = {
    ecg:          '🫀 ECG Waveform Analysis',
    echo:         '🫀 2D Echocardiogram Report',
    xray:         '🫁 Chest Radiograph / X-Ray',
    prescription: '💊 Clinical Prescription & Notes',
    scan:         '🧠 MRI / CT Imaging',
    lab:          '🧪 Laboratory Pathology Extract',
    handwritten:  '📝 Handwritten Doctor Notes',
    general:      '📋 Medical Document'
  };
  return labels[imageType] || '📋 Medical Document';
}

module.exports = { extractTextFromImage, detectImageType, getImageTypeLabel };
