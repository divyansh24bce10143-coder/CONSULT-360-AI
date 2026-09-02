/* ==========================================================================
   CONSULT 360 AI — MULTI-MODAL UPLOAD MIDDLEWARE
   Streams multi-format medical reports (PDF, ECG, Echo, X-ray, Rx) in RAM buffer.
   Zero permanent disk retention for HIPAA compliance.
   ========================================================================== */

const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB per file
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'text/plain',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];
    if (allowed.includes(file.mimetype) || /\.(pdf|txt|jpg|jpeg|png|webp)$/i.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported medical file format: "${file.originalname}". Allowed: PDF, JPG, PNG, WEBP, TXT.`));
    }
  }
});

module.exports = upload;
