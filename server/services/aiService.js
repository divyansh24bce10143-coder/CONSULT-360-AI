/* ==========================================================================
   CONSULT 360 AI — DEDICATED AI DECISION-SUPPORT SERVICE
   Interfaces with Google Gemini 3.6 Flash for clinical structured synthesis.
   Does not get called directly from routes; routes call controllers which invoke this service.
   ========================================================================== */

const { GoogleGenerativeAI } = require('@google/generative-ai');

function buildStructuredPrompt(reportText) {
  return `You are an expert hospital clinical AI decision-support copilot for physicians and hospital departments.
Analyze the multi-source patient record below and return ONLY a valid JSON object — no markdown fences, no explanatory prefix.

Required JSON Structure:
{
  "summary": {
    "oneLiner": "string",
    "chiefComplaint": "string",
    "clinicalSummary": "string",
    "keyFindings": ["string"],
    "actionItems": ["string"]
  },
  "risk": "High|Medium|Low",
  "confidence": 0.94,
  "reasons": [
    "string"
  ],
  "recommendations": [
    "string"
  ],
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
  ]
}

CLINICAL AUDIT RULES:
1. Ground every extracted parameter on provided medical text.
2. Flag out-of-range lab biometrics and vital signs with appropriate severity.
3. Compute longitudinal trend delta only when multi-date encounters are present.
4. Detect care gaps and missing investigations according to ADA, KDIGO, and ACC/AHA guidelines.

PATIENT RECORD:
${reportText.slice(0, 16000)}`;
}

async function executeWithRetry(model, prompt, retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (err) {
      lastError = err;
      console.warn(`[AI Service] Attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt < retries) {
        const delay = attempt * 1200;
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

class AIService {
  async generateClinicalSummary(reportText) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY is not configured in server/.env');
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

    const result = await executeWithRetry(model, buildStructuredPrompt(reportText));
    let raw = result.response.text();

    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
    const start = raw.indexOf('{');
    const end   = raw.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      raw = raw.slice(start, end + 1);
    }

    const parsed = JSON.parse(raw);

    // Standardize top-level risk & recommendations if inside summary
    if (!parsed.risk && parsed.riskFlags?.length > 0) {
      parsed.risk = parsed.riskFlags.some(r => r.severity === 'critical') ? 'High' : 'Medium';
    }
    if (!parsed.confidence) {
      parsed.confidence = 0.94;
    }
    if (!parsed.reasons && parsed.riskFlags?.length > 0) {
      parsed.reasons = parsed.riskFlags.map(r => r.reason);
    }
    if (!parsed.recommendations && parsed.summary?.actionItems) {
      parsed.recommendations = parsed.summary.actionItems;
    }

    return parsed;
  }
}

module.exports = new AIService();
