/* ==========================================================================
   CONSULT 360 AI — HOSPITAL INFORMATION SYSTEM (HIS) SERVER
   Full REST architecture with Doctors, Patients, Appointments, Investigations,
   Follow-ups, Notifications, Dashboard Metrics, and Multimodal AI decision support.
   ========================================================================== */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const investigationRoutes = require('./routes/investigationRoutes');
const followupRoutes = require('./routes/followupRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const legacyAnalyzeRoutes = require('./routes/analyze');
const errorHandler = require('./middleware/errorHandler');
const db = require('./db/memoryDb');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Global Middleware ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// ── Static Frontend Assets ─────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '..')));

// ── Health Check Endpoint ──────────────────────────────────────────────────
function handleHealth(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConnected = apiKey && apiKey !== 'your_gemini_api_key_here';
  res.json({
    status: 'ok',
    system: 'Consult 360 AI Hospital Information System (HIS)',
    version: '2.4.0',
    gemini: isConnected ? 'connected' : 'missing_key',
    model: 'gemini-3.6-flash',
    features: ['pdf', 'ecg', 'echo', 'xray', 'handwritten', 'multi-file', 'care-journey', 'xai-overrides'],
    stats: {
      doctors: db.data.doctors.length,
      patients: db.data.patients.length,
      appointments: db.data.appointments.length,
      reports: db.data.medicalReports.length
    },
    timestamp: new Date().toISOString()
  });
}

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

// ── Mount HIS Modular Routes ───────────────────────────────────────────────
const routes = [
  authRoutes,
  patientRoutes,
  appointmentRoutes,
  investigationRoutes,
  followupRoutes,
  dashboardRoutes,
  notificationRoutes,
  aiRoutes,
  legacyAnalyzeRoutes
];

routes.forEach(router => {
  app.use('/api', router);
  app.use('/', router); // Dual mount for Vercel serverless flexibility
});

// ── Fallback Route (Single Page Application index) ─────────────────────────
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ── Centralized Error Handler ──────────────────────────────────────────────
app.use(errorHandler);

// ── Server Bootstrap (Local Dev / Docker) ──────────────────────────────────
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    const apiKey = process.env.GEMINI_API_KEY;
    const keyStatus = apiKey && apiKey !== 'your_gemini_api_key_here'
      ? '✅ Connected'
      : '❌ Missing — add GEMINI_API_KEY to server/.env';

    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║     🏥  Consult 360 AI — Hospital Information System      ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log(`  🌐 App Gateway   : http://localhost:${PORT}`);
    console.log(`  📡 REST API Base : http://localhost:${PORT}/api`);
    console.log(`  🔑 Gemini Model  : gemini-3.6-flash (${keyStatus})`);
    console.log(`  👥 Active Staff  : ${db.data.doctors.length} Doctors`);
    console.log(`  📋 Patients DB   : ${db.data.patients.length} Outpatients`);
    console.log(`  📅 Appointments  : ${db.data.appointments.length} Records`);
    console.log(`  🔬 Investigations: ${db.data.investigations.length} Diagnostic Orders`);
    console.log('');
  });
}

module.exports = app;
