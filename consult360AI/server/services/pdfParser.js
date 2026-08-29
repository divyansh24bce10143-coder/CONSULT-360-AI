/* =============================================
   CONSULT360 AI — PDF PARSER SERVICE
   Two strategies:
   1. Text-based PDF  → pdf-parse (fast)
   2. Scanned PDF     → pdfjs-dist + canvas → PNG → Gemini Vision
   ============================================= */

const pdfParse = require('pdf-parse');

// ── Strategy 1: Extract text from text-based PDF ──────────────────────────
async function extractTextFromPdf(buffer) {
  try {
    const data = await pdfParse(buffer, { max: 15 });
    const text = data.text || '';
    console.log(`[PDF] Extracted ${text.length} chars from ${data.numpages} pages`);
    return text;
  } catch (err) {
    console.error('[PDF] Parse error:', err.message);
    return '';
  }
}

// ── Strategy 2: Render scanned PDF pages to PNG buffers ───────────────────
// Used when pdf-parse returns < 100 chars (scanned/image-based PDF)
async function renderScannedPdfToImages(buffer) {
  try {
    const { createCanvas } = require('canvas');
    // pdfjs-dist v3 has proper CommonJS legacy build
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

    // Disable worker for Node.js environment
    pdfjsLib.GlobalWorkerOptions.workerSrc = false;

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    });

    const pdf = await loadingTask.promise;
    const maxPages = Math.min(pdf.numPages, 8);
    const images = [];

    console.log(`[PDF-Render] Rendering ${maxPages} of ${pdf.numPages} pages to images...`);

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });

      const canvas = createCanvas(viewport.width, viewport.height);
      const ctx = canvas.getContext('2d');

      await page.render({ canvasContext: ctx, viewport }).promise;

      const pngBuffer = canvas.toBuffer('image/png');
      images.push({ buffer: pngBuffer, pageNum });
      console.log(`[PDF-Render] Page ${pageNum}/${maxPages} → ${Math.round(pngBuffer.length/1024)}KB`);
    }

    return images;

  } catch (err) {
    console.error('[PDF-Render] Error:', err.message);
    throw new Error(
      'Scanned PDF rendering failed: ' + err.message +
      '. Try uploading a photo (JPG/PNG) of the report instead.'
    );
  }
}


// ── Check if PDF is scanned (low text content) ────────────────────────────
function isScannedPdf(text) {
  return text.trim().length < 100;
}


// ── Smart text extractor — faster Gemini responses ────────────────────────
// Instead of dumping all 15,000 chars into Gemini, we:
// 1. Find medically relevant sections first
// 2. Prioritise: diagnoses, labs, medications, vitals, history
// 3. Cap at 8,000 chars (sweet spot: fast + accurate)
function extractSmartText(rawText) {
  const MAX_CHARS = 8000;

  // If already short enough, return as-is
  if (rawText.length <= MAX_CHARS) return rawText;

  // Medical section keywords to prioritise (in order of importance)
  const MEDICAL_KEYWORDS = [
    // Diagnoses & history
    'diagnosis', 'diagnosed', 'impression', 'assessment', 'condition',
    'history', 'complaint', 'presenting',
    // Labs & investigations
    'hba1c', 'blood', 'urine', 'creatinine', 'cholesterol', 'glucose',
    'hemoglobin', 'platelets', 'result', 'report', 'test', 'lab',
    'ecg', 'echo', 'x-ray', 'mri', 'ct scan', 'ultrasound',
    // Medications
    'medication', 'medicine', 'tablet', 'capsule', 'injection', 'dose',
    'mg', 'prescribed', 'drug', 'treatment',
    // Vitals
    'blood pressure', 'bp', 'pulse', 'heart rate', 'temperature',
    'spo2', 'oxygen', 'weight', 'bmi', 'height',
    // Symptoms
    'symptom', 'pain', 'swelling', 'fever', 'cough', 'breathing',
    'fatigue', 'nausea', 'vomiting', 'edema',
    // Time references (important for timeline)
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
    '2023', '2024', '2025', '2026', 'visit', 'follow'
  ];

  // Split into lines and score each line by medical relevance
  const lines = rawText.split('\n').map(line => line.trim()).filter(l => l.length > 2);

  const scoredLines = lines.map(line => {
    const lower = line.toLowerCase();
    let score = 0;
    MEDICAL_KEYWORDS.forEach(kw => {
      if (lower.includes(kw)) score += 1;
    });
    // Bonus for lines with numbers (likely lab values, vitals)
    if (/\d/.test(line)) score += 0.5;
    // Bonus for lines with units
    if (/mg|ml|mmhg|%|kg|bpm|°c/i.test(line)) score += 1;
    return { line, score };
  });

  // Sort by score descending, take top lines up to MAX_CHARS
  const sorted = scoredLines.sort((a, b) => b.score - a.score);

  // Always include the first 30 lines (patient header info)
  const headerLines = lines.slice(0, 30);
  const headerText = headerLines.join('\n');

  // Fill remaining budget with highest-scored medical lines
  const remaining = MAX_CHARS - headerText.length;
  let medicalText = '';
  for (const { line } of sorted) {
    if (!headerLines.includes(line)) {
      if (medicalText.length + line.length + 1 < remaining) {
        medicalText += line + '\n';
      } else break;
    }
  }

  const result = (headerText + '\n\n' + medicalText).slice(0, MAX_CHARS);
  console.log(`[SmartText] Reduced ${rawText.length} → ${result.length} chars`);
  return result;
}

module.exports = { extractTextFromPdf, extractSmartText, renderScannedPdfToImages, isScannedPdf };

