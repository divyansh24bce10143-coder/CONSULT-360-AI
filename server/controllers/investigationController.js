/* ==========================================================================
   CONSULT 360 AI — INVESTIGATION CONTROLLER
   Tracks pending diagnostic investigations and handles electronic lab orders.
   ========================================================================== */

const db = require('../db/memoryDb');
const auditService = require('../services/auditService');

class InvestigationController {
  async getInvestigations(req, res) {
    try {
      const { status, patientId } = req.query;
      const list = db.getInvestigations({ status, patientId });
      return res.json({ total: list.length, investigations: list });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve investigations.' });
    }
  }

  async orderInvestigation(req, res) {
    try {
      const { patientId, investigationName, urgency, reason, guidelineRef } = req.body;
      const patient = db.getPatientById(patientId);

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found.' });
      }

      const ordered = db.orderInvestigation({
        patientId,
        patientName: patient.name,
        mrn: patient.mrn,
        investigationName,
        urgency,
        reason,
        guidelineRef,
        orderedBy: req.doctor ? req.doctor.name : 'Dr. Amit Sharma, MD'
      });

      if (req.doctor) {
        auditService.logAction({
          doctorId: req.doctor.doctorId,
          doctorName: req.doctor.name,
          patientId: patient.id,
          patientName: patient.name,
          mrn: patient.mrn,
          action: 'INVESTIGATION_ORDERED',
          details: `Requisition created for ${investigationName} (${urgency || 'routine'}).`
        });
      }

      return res.status(201).json({ status: 'success', investigation: ordered });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to place investigation order.' });
    }
  }
}

module.exports = new InvestigationController();
