/* ==========================================================================
   CONSULT 360 AI — DATABASE CONFIGURATION
   ========================================================================== */

const db = require('../db/memoryDb');

module.exports = {
  db,
  isReady: () => !!db.data
};
