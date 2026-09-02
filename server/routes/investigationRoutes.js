/* ==========================================================================
   CONSULT 360 AI — INVESTIGATION ROUTES
   ========================================================================== */

const express = require('express');
const router = express.Router();
const investigationController = require('../controllers/investigationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/investigations', (req, res) => investigationController.getInvestigations(req, res));
router.post('/investigations/order', authMiddleware, (req, res) => investigationController.orderInvestigation(req, res));

module.exports = router;
