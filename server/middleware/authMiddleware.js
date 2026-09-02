/* ==========================================================================
   CONSULT 360 AI — DOCTOR AUTHENTICATION MIDDLEWARE
   Validates session tokens or allows demo mode fallback.
   ========================================================================== */

const { verifySessionToken } = require('../utils/crypto');
const db = require('../db/memoryDb');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // For demo/hackathon convenience, attach default Dr. Amit Sharma if no header is supplied
    req.doctor = db.findDoctorById('DOC1001') || {
      doctorId: 'DOC1001',
      name: 'Dr. Amit Sharma',
      department: 'General Medicine'
    };
    return next();
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');
  const decoded = verifySessionToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized — Invalid or expired medical staff session token.' });
  }

  const doctor = db.findDoctorById(decoded.doctorId);
  if (!doctor) {
    return res.status(401).json({ error: 'Unauthorized — Doctor account not found in hospital directory.' });
  }

  const { password, ...safeDoctor } = doctor;
  req.doctor = safeDoctor;
  next();
}

module.exports = authMiddleware;
