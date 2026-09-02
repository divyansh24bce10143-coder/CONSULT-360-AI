/* ==========================================================================
   CONSULT 360 AI — AUTHENTICATION CONTROLLER
   Doctor login, session retrieval, and profile authentication.
   ========================================================================== */

const db = require('../db/memoryDb');
const { verifyPassword, generateSessionToken } = require('../utils/crypto');
const auditService = require('../services/auditService');

class AuthController {
  async login(req, res) {
    try {
      const { doctorId, password } = req.body;

      if (!doctorId || !password) {
        return res.status(400).json({
          error: 'Please enter Doctor ID and Password.',
          field: !doctorId ? 'doctorId' : 'password'
        });
      }

      const doctor = db.findDoctorById(doctorId);
      if (!doctor) {
        return res.status(401).json({
          error: `Doctor ID "${doctorId}" not found in hospital directory. Use demo credentials: DOC1001, DOC1002, or DOC1003 with password "consult360".`
        });
      }

      const isMatch = verifyPassword(password, doctor.password) || password === 'consult360';
      if (!isMatch) {
        return res.status(401).json({
          error: 'Invalid password for this medical account. Demo password is "consult360".'
        });
      }

      const token = generateSessionToken(doctor.doctorId);
      const { password: _, ...doctorProfile } = doctor;

      auditService.logAction({
        doctorId: doctor.doctorId,
        doctorName: doctor.name,
        action: 'DOCTOR_LOGIN',
        details: `Successful login to ${doctor.department} clinical workstation.`
      });

      return res.json({
        status: 'success',
        message: `Welcome, ${doctor.name}`,
        token,
        doctor: doctorProfile
      });

    } catch (err) {
      console.error('[Auth Controller Error]', err);
      return res.status(500).json({ error: 'Authentication service encountered an error.' });
    }
  }

  async me(req, res) {
    if (!req.doctor) {
      return res.status(401).json({ error: 'No active clinical session.' });
    }
    return res.json({ doctor: req.doctor });
  }

  async logout(req, res) {
    if (req.doctor) {
      auditService.logAction({
        doctorId: req.doctor.doctorId,
        doctorName: req.doctor.name,
        action: 'DOCTOR_LOGOUT',
        details: 'Clinician terminated workstation session.'
      });
    }
    return res.json({ status: 'success', message: 'Signed out successfully.' });
  }

  async getDoctorsList(req, res) {
    const doctors = db.getDoctors();
    return res.json({ total: doctors.length, doctors });
  }
}

module.exports = new AuthController();
