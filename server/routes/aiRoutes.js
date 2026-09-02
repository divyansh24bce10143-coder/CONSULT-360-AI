/* ==========================================================================
   CONSULT 360 AI — AI PIPELINE ROUTES
   ========================================================================== */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/upload-and-analyze', authMiddleware, upload.array('reports', 10), (req, res) => aiController.uploadAndAnalyze(req, res));
router.post('/summary', authMiddleware, (req, res) => aiController.generateSummary(req, res));

module.exports = router;
