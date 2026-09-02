/* ==========================================================================
   CONSULT 360 AI — FOLLOW-UP ROUTES
   ========================================================================== */

const express = require('express');
const router = express.Router();
const followupController = require('../controllers/followupController');

router.get('/followups', (req, res) => followupController.getFollowUps(req, res));

module.exports = router;
