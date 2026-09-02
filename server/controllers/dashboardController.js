/* ==========================================================================
   CONSULT 360 AI — DASHBOARD CONTROLLER
   Computes live, real-time hospital statistics directly from the database.
   ========================================================================== */

const db = require('../db/memoryDb');

class DashboardController {
  async getDashboard(req, res) {
    try {
      const stats = db.getDashboardStats();
      return res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        ...stats
      });
    } catch (err) {
      console.error('[Dashboard Controller Error]', err);
      return res.status(500).json({ error: 'Failed to aggregate hospital dashboard metrics.' });
    }
  }
}

module.exports = new DashboardController();
