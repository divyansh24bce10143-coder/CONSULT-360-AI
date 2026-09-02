/* ==========================================================================
   CONSULT 360 AI — FOLLOW-UP CONTROLLER
   Tracks overdue and scheduled outpatient follow-ups.
   ========================================================================== */

const db = require('../db/memoryDb');

class FollowUpController {
  async getFollowUps(req, res) {
    try {
      const { status, doctorId } = req.query;
      const list = db.getFollowUps({ status, doctorId });
      return res.json({ total: list.length, followUps: list });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve follow-up records.' });
    }
  }
}

module.exports = new FollowUpController();
