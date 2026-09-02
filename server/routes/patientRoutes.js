/* ==========================================================================
   CONSULT 360 AI — PATIENT ROUTES
   ========================================================================== */

const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/patients', (req, res) => patientController.getPatients(req, res));
router.get('/patient/:id', authMiddleware, (req, res) => patientController.getPatientById(req, res));
router.post('/patient', authMiddleware, (req, res) => patientController.createPatient(req, res));

module.exports = router;
