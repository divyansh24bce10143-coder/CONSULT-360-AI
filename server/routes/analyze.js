/* =============================================
   CONSULT360 AI — API ROUTES (v2)
   Supports multiple files: PDFs + medical images
   POST /api/upload-and-analyze → SSE stream
   POST /api/analyze            → JSON (compat)
   GET  /api/health             → status
   ============================================= */

const express  = require('express');
const multer   = require('multer');
const { analyzeReport }                                              = require('../services/gemini');
const { extractTextFromPdf, extractSmartText,
        renderScannedPdfToImages, isScannedPdf }                     = require('../services/pdfParser');
const { extractTextFromImage, getImageTypeLabel }                    = require('../services/visionOcr');


const router = express.Router();

// ── Multer: accept multiple files (PDF + images) ───────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB per file
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'text/plain',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not supported: ${file.mimetype}. Use PDF, JPG, PNG, or WebP.`));
    }
  }
});

// Helper: send SSE event
function sendEvent(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

// Helper: check if file is an image
function isImage(mimetype) {
  return mimetype.startsWith('image/');
}

// ── POST /api/upload-and-analyze (SSE streaming) ───────────────────────────
// Accepts up to 10 files, processes each, combines, sends to Gemini
router.post('/upload-and-analyze', upload.array('reports', 10), async (req, res) => {

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  try {
    const files = req.files;
    if (!files || files.length === 0) {
      sendEvent(res, 'error', { message: 'No files received.' });
      return res.end();
    }

    const fileCount = files.length;
    sendEvent(res, 'progress', {
      step: 'pdf',
      label: `📎 ${fileCount} file${fileCount > 1 ? 's' : ''} received`,
      percent: 10,
      done: true
    });

    // ── Process each file ──────────────────────────────────────────────────
    const extractedParts = [];
    let pdfCount   = 0;
    let imageCount = 0;

    const extractionErrors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileLabel = `${file.originalname} (${i + 1}/${fileCount})`;

      try {
        if (file.mimetype === 'application/pdf') {
          // ── PDF: try text extraction first ─────────────────────────────
          sendEvent(res, 'progress', {
            step: 'ocr',
            label: `📄 Reading PDF: ${fileLabel}`,
            percent: 15 + Math.round((i / fileCount) * 25)
          });

          let text = await extractTextFromPdf(file.buffer);

          if (isScannedPdf(text)) {
            // ── Scanned / Visual PDF: Use Gemini Multimodal PDF engine directly ──
            sendEvent(res, 'progress', {
              step: 'ocr',
              label: `🔍 Scanned / Visual PDF detected — processing with Gemini Vision AI...`,
              percent: 20 + Math.round((i / fileCount) * 25)
            });

            const visionRes = await extractTextFromImage(
              file.buffer,
              file.originalname,
              'application/pdf'
            );
            text = visionRes.text;
          }

          if (text && text.trim()) {
            extractedParts.push(`\n\n=== PDF REPORT: ${file.originalname} ===\n${text}`);
            pdfCount++;
            sendEvent(res, 'progress', {
              step: 'ocr',
              label: `✅ PDF extracted: ${file.originalname}`,
              percent: 25 + Math.round(((i + 1) / fileCount) * 20),
              done: false
            });
          } else {
            throw new Error(`PDF contains no extractable text or images.`);
          }

        } else if (file.mimetype === 'text/plain') {
          // ── Plain text ───────────────────────────────────────────────────
          const text = file.buffer.toString('utf-8');
          if (text.trim()) {
            extractedParts.push(`\n\n=== TEXT FILE: ${file.originalname} ===\n${text}`);
            pdfCount++;
          }

        } else if (isImage(file.mimetype)) {
          // ── Image: Gemini Vision OCR ─────────────────────────────────────
          sendEvent(res, 'progress', {
            step: 'ocr',
            label: `🔍 Reading image: ${fileLabel}`,
            percent: 15 + Math.round((i / fileCount) * 25)
          });

          const { text, imageType } = await extractTextFromImage(
            file.buffer,
            file.originalname,
            file.mimetype
          );

          const typeLabel = getImageTypeLabel(imageType);

          if (text.trim()) {
            extractedParts.push(
              `\n\n=== IMAGE (${typeLabel}): ${file.originalname} ===\n${text}`
            );
            imageCount++;

            sendEvent(res, 'progress', {
              step: 'ocr',
              label: `✅ ${typeLabel} extracted: ${file.originalname}`,
              percent: 20 + Math.round(((i + 1) / fileCount) * 25),
              done: false
            });
          }
        }

      } catch (fileErr) {
        console.error(`[Route] Error on ${file.originalname}:`, fileErr.message);
        extractionErrors.push(`${file.originalname}: ${fileErr.message}`);
        sendEvent(res, 'progress', {
          step: 'ocr',
          label: `⚠️ ${file.originalname}: ${fileErr.message}`,
          percent: 20
        });
      }
    }

    if (extractedParts.length === 0) {
      sendEvent(res, 'error', {
        message: extractionErrors.length > 0
          ? extractionErrors.join(' • ')
          : 'Could not extract text from any uploaded file. Please ensure the file is not corrupted.'
      });
      return res.end();
    }


    // ── Combine all extracted content ──────────────────────────────────────
    const rawCombined = extractedParts.join('');
    sendEvent(res, 'progress', {
      step: 'ocr',
      label: `✅ ${pdfCount} PDF${pdfCount !== 1 ? 's' : ''} + ${imageCount} image${imageCount !== 1 ? 's' : ''} extracted`,
      percent: 42,
      done: true
    });

    // ── Smart text trimming ────────────────────────────────────────────────
    sendEvent(res, 'progress', { step: 'entities', label: '🧬 Processing medical entities...', percent: 50 });
    const smartText = extractSmartText(rawCombined);
    sendEvent(res, 'progress', {
      step: 'entities',
      label: `🧬 ${smartText.length.toLocaleString()} chars of medical content ready`,
      percent: 58,
      done: true
    });

    // ── Timeline + Changes ────────────────────────────────────────────────
    sendEvent(res, 'progress', { step: 'timeline', label: '📅 Building patient timeline...', percent: 62 });
    sendEvent(res, 'progress', { step: 'changes',  label: '📊 Detecting clinical changes...', percent: 67 });

    // ── Gemini AI Analysis ────────────────────────────────────────────────
    sendEvent(res, 'progress', { step: 'risk',   label: '🚨 Analysing risk flags...', percent: 72 });
    sendEvent(res, 'progress', { step: 'gemini', label: '✨ Gemini AI generating brief...', percent: 77 });

    console.log(`[Stream] Analyzing ${extractedParts.length} sources, ${smartText.length} chars...`);
    const t0 = Date.now();

    const result = await analyzeReport(smartText);

    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`[Stream] Done in ${elapsed}s`);

    // ── Send result ───────────────────────────────────────────────────────
    sendEvent(res, 'progress', {
      step: 'gemini',
      label: `✅ Complete in ${elapsed}s — ${fileCount} file${fileCount > 1 ? 's' : ''} analyzed`,
      percent: 100,
      done: true
    });
    sendEvent(res, 'result', {
      result,
      fileCount,
      pdfCount,
      imageCount,
      filenames: files.map(f => f.originalname)
    });
    sendEvent(res, 'done', { elapsed });

  } catch (err) {
    console.error('[Stream] Fatal error:', err.message);
    sendEvent(res, 'error', { message: err.message });
  }

  res.end();
});

// ── POST /api/analyze (JSON — kept for compatibility) ─────────────────────
router.post('/analyze', express.json({ limit: '2mb' }), async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided.' });
    const smartText = extractSmartText(text);
    const result = await analyzeReport(smartText);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/health ────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  const hasKey = !!(process.env.GEMINI_API_KEY &&
                    process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
  res.json({
    status: 'ok',
    gemini: hasKey ? 'connected' : 'key_missing',
    model: 'gemini-3.6-flash',
    features: ['pdf', 'ecg', 'echo', 'xray', 'handwritten', 'multi-file'],
    timestamp: new Date().toISOString()
  });
});

// ── Multer error handler ───────────────────────────────────────────────────
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum 20MB per file.' });
  }
  res.status(400).json({ error: err.message });
});

module.exports = router;
