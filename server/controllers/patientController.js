/* ==========================================================================
   CONSULT 360 AI — PATIENT CONTROLLER
   Search, triage filtering, and complete clinical chart retrieval.
   ========================================================================== */

const db = require('../db/memoryDb');
const auditService = require('../services/auditService');

class PatientController {
  async getPatients(req, res) {
    try {
      const { search, filter, department, doctorId, limit = 100, page = 1 } = req.query;

      const result = db.getPatients({
        search,
        filter,
        department,
        doctorId,
        limit: parseInt(limit, 10),
        page: parseInt(page, 10)
      });

      return res.json(result);
    } catch (err) {
      console.error('[Patient Controller Error]', err);
      return res.status(500).json({ error: 'Failed to retrieve patient records.' });
    }
  }

  async getPatientById(req, res) {
    try {
      const { id } = req.params;
      const patient = db.getPatientById(id);

      if (!patient) {
        return res.status(404).json({ error: `Patient record "${id}" not found in hospital database.` });
      }

      // Log chart view audit
      if (req.doctor) {
        auditService.logAction({
          doctorId: req.doctor.doctorId,
          doctorName: req.doctor.name,
          patientId: patient.id,
          patientName: patient.name,
          mrn: patient.mrn,
          action: 'CHART_ACCESSED',
          details: 'Physician opened full clinical intelligence brief and care journey.'
        });
      }

      return res.json({ status: 'success', patient });
    } catch (err) {
      console.error('[Patient Detail Error]', err);
      return res.status(500).json({ error: 'Failed to retrieve patient chart details.' });
    }
  }

  async createPatient(req, res) {
    try {
      const patientData = req.body;
      if (!patientData.name) {
        return res.status(400).json({ error: 'Patient name is required.' });
      }

      const created = db.createPatient(patientData);

      if (req.doctor) {
        auditService.logAction({
          doctorId: req.doctor.doctorId,
          doctorName: req.doctor.name,
          patientId: created.id,
          patientName: created.name,
          mrn: created.mrn,
          action: 'PATIENT_REGISTERED',
          details: `Registered new patient under ${created.condition}.`
        });
      }

      return res.status(201).json({ status: 'success', patient: created });
    } catch (err) {
      console.error('[Create Patient Error]', err);
      return res.status(500).json({ error: 'Failed to create patient record.' });
    }
  }
}

module.exports = new PatientController();
