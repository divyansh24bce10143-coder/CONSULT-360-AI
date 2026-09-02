/* ==========================================================================
   CONSULT 360 AI — CLINICAL NOTIFICATION SERVICE
   Auto-generates hospital alerts for high-risk patients, overdue investigations,
   and missed follow-up appointments.
   ========================================================================== */

const db = require('../db/memoryDb');

class NotificationService {
  getDoctorNotifications(doctorId) {
    return db.getNotifications(doctorId);
  }

  markAsRead(notificationId) {
    return db.markNotificationRead(notificationId);
  }

  notifyHighRiskPatient(patient, riskDetails) {
    return db.addNotification({
      doctorId: patient.assignedDoctorId || 'DOC1001',
      title: `🚨 High Risk Alert: ${patient.name} (${patient.mrn})`,
      message: `Patient flagged with critical risk score (${patient.riskScore}/100). ${riskDetails || 'Immediate review required.'}`,
      priority: 'high',
      type: 'critical_patient'
    });
  }

  notifyOverdueInvestigation(patient, investigationName) {
    return db.addNotification({
      doctorId: patient.assignedDoctorId || 'DOC1001',
      title: `🔬 Overdue Investigation: ${investigationName}`,
      message: `${investigationName} for ${patient.name} (${patient.mrn}) is overdue according to clinical guidelines.`,
      priority: 'medium',
      type: 'investigation_pending'
    });
  }

  notifyMissedFollowup(patient, followUpDate) {
    return db.addNotification({
      doctorId: patient.assignedDoctorId || 'DOC1001',
      title: `⏰ Missed Follow-up: ${patient.name}`,
      message: `Patient missed scheduled appointment on ${followUpDate}. Tele-recall outreach recommended.`,
      priority: 'medium',
      type: 'followup_overdue'
    });
  }
}

module.exports = new NotificationService();
