/* ==========================================================================
   CONSULT 360 AI — AUTHENTICATION ROUTES
   ========================================================================== */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', (req, res) => authController.login(req, res));
router.get('/me', authMiddleware, (req, res) => authController.me(req, res));
router.post('/logout', authMiddleware, (req, res) => authController.logout(req, res));
router.get('/doctors', (req, res) => authController.getDoctorsList(req, res));

module.exports = router;
