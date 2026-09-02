/* ==========================================================================
   CONSULT 360 AI — SECURITY & CRYPTO UTILITIES
   Hospital Information System (HIS) password hashing & token validation.
   Zero external C++ dependencies for 100% serverless portability.
   ========================================================================== */

const crypto = require('crypto');

const SECRET_SALT = process.env.AUTH_SECRET || 'consult360_hospital_salt_2026';

function hashPassword(password) {
  return crypto.pbkdf2Sync(password, SECRET_SALT, 1000, 32, 'sha256').toString('hex');
}

function verifyPassword(password, hashedPassword) {
  const hash = hashPassword(password);
  return hash === hashedPassword;
}

function generateSessionToken(doctorId) {
  const payload = `${doctorId}:${Date.now()}:${crypto.randomBytes(8).toString('hex')}`;
  const signature = crypto.createHmac('sha256', SECRET_SALT).update(payload).digest('hex');
  return Buffer.from(`${payload}.${signature}`).toString('base64');
}

function verifySessionToken(token) {
  if (!token) return null;
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const [payload, signature] = raw.split('.');
    if (!payload || !signature) return null;

    const expectedSignature = crypto.createHmac('sha256', SECRET_SALT).update(payload).digest('hex');
    if (signature !== expectedSignature) return null;

    const [doctorId, timestamp] = payload.split(':');
    return { doctorId, timestamp: parseInt(timestamp, 10) };
  } catch (err) {
    return null;
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  verifySessionToken
};
