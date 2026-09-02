/* ==========================================================================
   CONSULT 360 AI — APPOINTMENT ROUTES
   ========================================================================== */

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/appointments', (req, res) => appointmentController.getAppointments(req, res));
router.post('/appointments', authMiddleware, (req, res) => appointmentController.createAppointment(req, res));

module.exports = router;
