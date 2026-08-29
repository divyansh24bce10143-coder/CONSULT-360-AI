/* =============================================
   CONSULT360 AI — EXPRESS SERVER
   Entry point for the Node.js backend.
   Serves the frontend + exposes /api/* routes.
   ============================================= */

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const analyzeRouter = require('./routes/analyze');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve the frontend static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// ── API Routes ─────────────────────────────────────────────────────────────
app.use('/api', analyzeRouter);

// ── Catch-all: serve index.html for any non-API route ────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ── Global Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Start (local dev only — Vercel uses module.exports below) ─────────────
if (process.env.NODE_ENV !== 'production' || process.env.LOCAL_DEV) {
  app.listen(PORT, () => {
    const apiKey = process.env.GEMINI_API_KEY;
    const keyStatus = apiKey && apiKey !== 'your_gemini_api_key_here'
      ? '✅ Connected'
      : '❌ Missing — add GEMINI_API_KEY to server/.env';

    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║     🏥  Consult360 AI — Server Ready     ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log(`  🌐 App URL  : http://localhost:${PORT}`);
    console.log(`  📡 API Base : http://localhost:${PORT}/api`);
    console.log(`  🔑 Gemini   : ${keyStatus}`);
    console.log(`  📂 Serving  : ${path.join(__dirname, '..')}`);
    console.log('');
    console.log('  Routes:');
    console.log('  GET  /api/health   → server status');
    console.log('  POST /api/upload   → PDF → text extraction');
    console.log('  POST /api/analyze  → text → AI brief (Gemini)');
    console.log('');
  });
} else {
  // Production: start listening on PORT (Railway, Render etc.)
  app.listen(PORT, () => {
    console.log(`🏥 Consult360 AI running on port ${PORT}`);
  });
}

// ── Export for Vercel ──────────────────────────────────────────────────────
module.exports = app;

