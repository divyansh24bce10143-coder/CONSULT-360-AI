/* ==========================================================================
   CONSULT 360 AI — CENTRALIZED HOSPITAL ERROR HANDLER
   Catches and formats API errors with meaningful clinical messages.
   ========================================================================== */

function errorHandler(err, req, res, next) {
  console.error('[Hospital API Error]', {
    path: req.path,
    method: req.method,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Handle Multer upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File upload exceeds hospital safety limit (Max 25MB per document).'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Unexpected file field. Ensure multi-report payload uses field "reports".'
    });
  }

  // Handle JSON parse or generic errors
  const status = err.status || 500;
  const message = err.message || 'Internal hospital clinical server error.';

  res.status(status).json({
    error: message,
    status: 'error',
    timestamp: new Date().toISOString()
  });
}

module.exports = errorHandler;
