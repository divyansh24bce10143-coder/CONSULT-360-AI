/* ==========================================================================
   CONSULT 360 AI — NOTIFICATION ROUTES
   ========================================================================== */

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/notifications', authMiddleware, (req, res) => notificationController.getNotifications(req, res));
router.post('/notifications/:id/read', (req, res) => notificationController.markAsRead(req, res));

module.exports = router;
