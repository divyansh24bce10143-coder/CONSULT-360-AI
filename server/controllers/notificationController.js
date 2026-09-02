/* ==========================================================================
   CONSULT 360 AI — NOTIFICATION CONTROLLER
   Delivers doctor alert feeds and manages read state.
   ========================================================================== */

const notificationService = require('../services/notificationService');

class NotificationController {
  async getNotifications(req, res) {
    try {
      const doctorId = req.doctor ? req.doctor.doctorId : req.query.doctorId || 'DOC1001';
      const notifications = notificationService.getDoctorNotifications(doctorId);
      const unreadCount = notifications.filter(n => !n.isRead).length;

      return res.json({
        total: notifications.length,
        unreadCount,
        notifications
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve notifications.' });
    }
  }

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const updated = notificationService.markAsRead(id);
      if (!updated) return res.status(404).json({ error: 'Notification not found.' });
      return res.json({ status: 'success', notification: updated });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update notification state.' });
    }
  }
}

module.exports = new NotificationController();
