/* ==========================================================================
   CONSULT 360 AI — APPOINTMENT CONTROLLER
   Manages outpatient appointment slots, status tracking, and queue scheduling.
   ========================================================================== */

const db = require('../db/memoryDb');

class AppointmentController {
  async getAppointments(req, res) {
    try {
      const { doctorId, date, status } = req.query;
      let appts = [...db.data.appointments];

      if (doctorId) appts = appts.filter(a => a.doctorId === doctorId);
      if (date) appts = appts.filter(a => a.appointmentDate === date);
      if (status) appts = appts.filter(a => a.status === status);

      return res.json({ total: appts.length, appointments: appts });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve appointments.' });
    }
  }

  async createAppointment(req, res) {
    try {
      const { patientId, doctorId, appointmentDate, appointmentTime, reason } = req.body;
      const patient = db.getPatientById(patientId);
      const doctor = db.findDoctorById(doctorId);

      if (!patient) return res.status(404).json({ error: 'Patient not found.' });

      const newAppt = {
        appointmentId: `APT${Date.now()}`,
        patientId,
        patientName: patient.name,
        mrn: patient.mrn,
        doctorId: doctor ? doctor.doctorId : 'DOC1001',
        doctorName: doctor ? doctor.name : 'Dr. Amit Sharma',
        department: doctor ? doctor.department : 'General Medicine',
        appointmentDate: appointmentDate || new Date().toISOString().split('T')[0],
        appointmentTime: appointmentTime || '10:00 AM',
        status: 'scheduled',
        reason: reason || patient.condition,
        room: doctor ? doctor.room : 'Room 102'
      };

      db.data.appointments.unshift(newAppt);
      return res.status(201).json({ status: 'success', appointment: newAppt });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to schedule appointment.' });
    }
  }
}

module.exports = new AppointmentController();
