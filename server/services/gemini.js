/* ==========================================================================
   CONSULT 360 AI — GEMINI DECISION-SUPPORT SYNTHESIS SERVICE
   Structured clinical pre-consultation intelligence synthesis.
   ========================================================================== */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// ── Build structured clinical extraction & decision prompt ────────────────
function buildPrompt(reportText) {
  return `You are an expert clinical AI decision-support assistant for physicians and hospital departments.
Analyze the multi-source patient record below and return ONLY a valid JSON object — no markdown fences, no explanatory prefix.

Required JSON Structure:
{
  "patient": {
    "name": "string",
    "age": 0,
    "gender": "string",
    "bloodGroup": "string",
    "allergies": ["string"]
  },
  "entities": {
    "diagnoses": [
      { "name": "string", "date": "string", "status": "active|historical|suspected", "icd": "string" }
    ],
    "medications": [
      { "name": "string", "dose": "string", "frequency": "string", "date": "string", "change": "new|continued|dose-changed|discontinued", "class": "string" }
    ],
    "vitals": [
      { "type": "string", "value": "string", "unit": "string", "reference": "string", "date": "string", "status": "normal|borderline|abnormal|critical" }
    ],
    "labResults": [
      { "test": "string", "value": "string", "unit": "string", "reference": "string", "status": "normal|borderline|abnormal|critical", "date": "string" }
    ],
    "symptoms": [
      { "description": "string", "date": "string", "severity": "mild|moderate|severe" }
    ]
  },
  "timeline": [
    { "date": "string", "event": "string", "type": "visit|lab|medication|symptom|procedure", "detail": "string", "significance": "normal|important|critical" }
  ],
  "clinicalChanges": [
    { "parameter": "string", "previous": { "value": "string", "date": "string" }, "mid": { "value": "string", "date": "string" }, "current": { "value": "string", "date": "string" }, "changeType": "increased|decreased|stable|new", "magnitude": "string", "direction": "worsening|improving|stable", "clinicalSignificance": "string" }
  ],
  "missingInvestigations": [
    { "test": "string", "reason": "string", "urgency": "critical|high|medium|low", "basedOnCondition": "string", "lastDone": null, "guidelineRef": "string" }
  ],
  "riskFlags": [
    { "risk": "string", "severity": "critical|high|medium|low", "confidence": "string", "reason": "string", "evidence": "string", "sourceDocument": "string", "date": "string", "recommendation": "string" }
  ],
  "summary": {
    "oneLiner": "string",
    "chiefComplaint": "string",
    "clinicalSummary": "string",
    "keyFindings": ["string"],
    "actionItems": ["string"]
  }
}

CLINICAL RULES:
1. Ground all extractions explicitly on provided record text.
2. Flag out-of-range lab biometrics and vital signs with appropriate severity.
3. Compute longitudinal trend delta only when multi-date encounters are present.
4. Detect care gaps and missing investigations according to ADA, KDIGO, and ACC/AHA guidelines.

PATIENT RECORD:
${reportText.slice(0, 16000)}`;
}

// ── Resilient execution with retry for transient network drops ─────────────
async function generateSynthesisWithRetry(model, prompt, retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini Synthesis] Attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt < retries) {
        const delay = attempt * 1200;
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

// ── Main Analysis Function ────────────────────────────────────────────────
async function analyzeReport(reportText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not set in server/.env');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.6-flash',
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json'
    }
  });

  const result = await generateSynthesisWithRetry(model, buildPrompt(reportText));
  let raw = result.response.text();

  // Strip markdown code fences if added
  raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();

  // Extract outermost JSON object
  const start = raw.indexOf('{');
  const end   = raw.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    raw = raw.slice(start, end + 1);
  }

  return JSON.parse(raw);
}

module.exports = { analyzeReport, buildPrompt };
