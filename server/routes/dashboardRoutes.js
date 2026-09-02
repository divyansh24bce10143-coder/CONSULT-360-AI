/* ==========================================================================
   CONSULT 360 AI — DASHBOARD ROUTES
   ========================================================================== */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard', (req, res) => dashboardController.getDashboard(req, res));

module.exports = router;
