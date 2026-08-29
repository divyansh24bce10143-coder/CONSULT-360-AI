/* =============================================
   CONSULT360 AI — GEMINI SERVICE
   Calls Google Gemini API securely server-side.
   API key never reaches the browser.
   ============================================= */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Build the structured medical prompt
function buildPrompt(reportText) {
  return `You are an expert medical AI assistant. A doctor needs a pre-consultation brief for their next patient.

Analyze the patient report below and return ONLY a valid JSON object — no markdown, no code blocks, no extra text.

Return this exact JSON structure:
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
      { "name": "string", "date": "string", "status": "active|historical|suspected" }
    ],
    "medications": [
      { "name": "string", "dose": "string", "frequency": "string", "date": "string", "change": "new|continued|dose-changed|discontinued" }
    ],
    "vitals": [
      { "type": "string", "value": "string", "unit": "string", "date": "string", "status": "normal|borderline|abnormal|critical" }
    ],
    "labResults": [
      { "test": "string", "value": "string", "unit": "string", "reference": "string", "status": "normal|borderline|abnormal|critical", "date": "string" }
    ],
    "symptoms": [
      { "description": "string", "date": "string" }
    ]
  },
  "timeline": [
    { "date": "string", "event": "string", "type": "visit|lab|medication|symptom|procedure", "detail": "string", "significance": "normal|important|critical" }
  ],
  "clinicalChanges": [
    { "parameter": "string", "previous": { "value": "string", "date": "string" }, "current": { "value": "string", "date": "string" }, "changeType": "increased|decreased|stable|new", "magnitude": "string", "direction": "worsening|improving|stable", "clinicalSignificance": "significant|moderate|mild" }
  ],
  "missingInvestigations": [
    { "test": "string", "reason": "string", "urgency": "critical|high|medium|low", "basedOnCondition": "string", "lastDone": null }
  ],
  "riskFlags": [
    { "risk": "string", "severity": "critical|high|medium|low", "reason": "string", "evidence": "string", "sourceDocument": "string", "date": "string", "recommendation": "string" }
  ],
  "summary": {
    "oneLiner": "string",
    "chiefComplaint": "string",
    "clinicalSummary": "string",
    "keyFindings": ["string"],
    "actionItems": ["string"]
  }
}

RULES:
- Only extract information EXPLICITLY stated in the report. Do NOT infer or assume.
- Flag abnormal lab values based on provided reference ranges.
- Detect clinical changes only if multiple visit dates are present.
- Flag missing investigations based on active diagnoses and standard clinical guidelines.

PATIENT REPORT:
${reportText.slice(0, 15000)}`;
}

// Main analysis function
async function analyzeReport(reportText) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY not set in server/.env file. Please add your key.');
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

  const result = await model.generateContent(buildPrompt(reportText));
  let raw = result.response.text();

  // Strip markdown fences if Gemini adds them
  raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();

  // Find outermost JSON object (guards against trailing commentary)
  const start = raw.indexOf('{');
  const end   = raw.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    raw = raw.slice(start, end + 1);
  }

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('[Gemini] JSON parse failed. First 500 chars:', raw.slice(0, 500));
    throw new Error('Gemini returned malformed JSON. Please try again.');
  }
}

module.exports = { analyzeReport };
