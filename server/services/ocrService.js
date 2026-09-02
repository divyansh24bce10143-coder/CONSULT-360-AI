/* ==========================================================================
   CONSULT 360 AI — MULTIMODAL MEDICAL OCR & VISION SERVICE
   Transcribes ECG waveforms, 2D Echoes, Chest Radiographs, and Doctor Prescriptions.
   ========================================================================== */

const { GoogleGenerativeAI } = require('@google/generative-ai');

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

function buildVisionPrompt(imageType) {
  switch (imageType) {
    case 'ecg':
      return `You are a clinical cardiologist analyzing this ECG/EKG tracing. Extract and transcribe all diagnostic metrics:
- Heart Rate (bpm)
- Cardiac Rhythm (Normal Sinus / Atrial Fibrillation / SVT / VT / Junctional / Bradycardia)
- PR Interval (ms), QRS Duration (ms), QT / QTc Interval (ms)
- ST Segment deviations & T-Wave morphology
- Cardiac Axis & Conduction Blocks (LBBB / RBBB)
- Diagnostic Clinical Summary / Interpretation`;

    case 'echo':
      return `You are a cardiologist analyzing this Echocardiogram report/image. Extract and transcribe:
- Left Ventricular Ejection Fraction (LVEF %)
- Regional Wall Motion Abnormalities (RWMA)
- Valvular Assessment (Mitral, Aortic, Tricuspid)
- Diastolic Function Grade & Pericardial Effusion
- Final Clinical Impression`;

    case 'xray':
      return `You are a radiologist analyzing this chest radiograph / X-Ray image. Extract:
- Cardiac Silhouette & Mediastinum (Cardiothoracic ratio)
- Lung Fields & Parenchyma (Consolidations, infiltrates, nodules)
- Pleural Spaces & Diaphragm
- Final Impression / Radiological Diagnosis`;

    case 'prescription':
      return `You are an expert clinical pharmacist and physician transcribing this medical prescription / handwritten doctor note:
- Date of Prescription, Prescribing Doctor
- Patient Identifiers (Name, Age, Gender)
- Prescribed Medications (Drug Name, Strength, Dose, Route, Frequency, Duration)
- Special Physician Instructions / Precautions`;

    case 'lab':
      return `You are a laboratory pathologist extracting quantitative results from this lab report:
- Patient Name, Age, MRN, Sample Date
- Test Names, Extracted Numerical Values & Units
- Reference Normal Ranges & Abnormal Flags`;

    default:
      return `You are a clinical physician transcribing this patient medical document. Extract:
- Document Type & Date
- Chief Complaints, Vitals, Diagnoses, Medications, Lab Findings, and Follow-up Plan`;
  }
}

async function executeVisionWithRetry(model, payload, retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await model.generateContent(payload);
    } catch (err) {
      lastError = err;
      console.warn(`[OCR Service] Attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt < retries) {
        const delay = attempt * 1200;
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

class OCRService {
  async extractTextFromImage(buffer, filename, mimeType) {
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
    const base64Data = buffer.toString('base64');

    const result = await executeVisionWithRetry(model, {
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
    if (!text) {
      throw new Error(`Gemini Multimodal returned empty output for "${filename}".`);
    }

    return { text, imageType };
  }

  detectImageType(filename) {
    return detectImageType(filename);
  }
}

module.exports = new OCRService();
