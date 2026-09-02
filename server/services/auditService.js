/* ==========================================================================
   CONSULT 360 AI — HOSPITAL AUDIT LOG SERVICE
   Maintains HIPAA-compliant clinical audit trails of chart access, orders,
   prescriptions, and AI override decisions.
   ========================================================================== */

const db = require('../db/memoryDb');

class AuditService {
  logAction({ doctorId, doctorName, patientId, patientName, mrn, action, details }) {
    return db.addAuditLog({
      doctorId,
      doctorName,
      patientId,
      patientName,
      mrn,
      action,
      details
    });
  }

  getRecentLogs(limit = 20) {
    return db.data.auditLogs.slice(0, limit);
  }
}

module.exports = new AuditService();
