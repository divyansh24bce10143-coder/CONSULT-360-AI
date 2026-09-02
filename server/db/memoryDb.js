/* ==========================================================================
   CONSULT 360 AI — IN-MEMORY HOSPITAL DATABASE ENGINE
   Provides high-performance CRUD, search, triage aggregation, and audit trails.
   Loads from hospitalData.json with automatic fallback initialization for serverless.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const { generateHospitalDatabase } = require('../utils/seedHospitalData');

class HospitalDatabase {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      const dataPath = path.join(__dirname, 'hospitalData.json');
      if (fs.existsSync(dataPath)) {
        const raw = fs.readFileSync(dataPath, 'utf-8');
        this.data = JSON.parse(raw);
        console.log(`[MemoryDB] Loaded hospital database with ${this.data.patients.length} patients and ${this.data.doctors.length} doctors.`);
      } else {
        console.log('[MemoryDB] hospitalData.json not found on disk, running seeder...');
        this.data = generateHospitalDatabase();
      }
    } catch (err) {
      console.warn('[MemoryDB] Error reading hospitalData.json, generating in-memory seed:', err.message);
      this.data = generateHospitalDatabase();
    }
  }

  // ── DOCTOR OPERATIONS ───────────────────────────────────────────────────
  getDoctors() {
    return this.data.doctors.map(d => {
      const { password, ...safeDoc } = d;
      return safeDoc;
    });
  }

  findDoctorById(doctorId) {
    return this.data.doctors.find(d => d.doctorId.toUpperCase() === (doctorId || '').toUpperCase());
  }

  // ── PATIENT OPERATIONS ──────────────────────────────────────────────────
  getPatients({ search = '', filter = 'all', department = '', doctorId = '', limit = 100, page = 1 } = {}) {
    let result = [...this.data.patients];

    // Search query
    if (search) {
      const q = search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.mrn && p.mrn.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q)) ||
        (p.condition && p.condition.toLowerCase().includes(q)) ||
        (p.phone && p.phone.includes(q))
      );
    }

    // Triage risk filter
    if (filter === 'critical') {
      result = result.filter(p => p.riskLevel === 'critical');
    } else if (filter === 'attention') {
      result = result.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'medium');
    } else if (filter === 'overdue') {
      result = result.filter(p => p.careJourney?.some(s => s.status === 'missed' || s.status === 'attention'));
    } else if (filter === 'pending-tests') {
      result = result.filter(p => {
        const summary = this.data.aiSummaries[p.id];
        return summary?.missingInvestigations && summary.missingInvestigations.length > 0;
      });
    }

    // Doctor filter
    if (doctorId) {
      result = result.filter(p => p.assignedDoctorId === doctorId);
    }

    // Department filter
    if (department) {
      result = result.filter(p => p.condition.toLowerCase().includes(department.toLowerCase()));
    }

    const total = result.length;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      patients: paginated
    };
  }

  getPatientById(patientId) {
    const patient = this.data.patients.find(p => p.id === patientId || p.mrn === patientId);
    if (!patient) return null;

    const summary = this.data.aiSummaries[patient.id] || null;
    const patientAppointments = this.data.appointments.filter(a => a.patientId === patient.id);
    const patientReports = this.data.medicalReports.filter(r => r.patientId === patient.id);
    const patientInvestigations = this.data.investigations.filter(i => i.patientId === patient.id);
    const patientFollowUps = this.data.followUps.filter(f => f.patientId === patient.id);

    return {
      ...patient,
      summary,
      appointments: patientAppointments,
      medicalReports: patientReports,
      investigations: patientInvestigations,
      followUps: patientFollowUps
    };
  }

  createPatient(patientData) {
    const id = patientData.id || `PAT${Date.now()}`;
    const mrn = patientData.mrn || `MRN-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient = {
      id,
      mrn,
      name: patientData.name || 'Anonymous Patient',
      age: patientData.age || '—',
      gender: patientData.gender || '—',
      bloodGroup: patientData.bloodGroup || '—',
      phone: patientData.phone || '+91 98000 00000',
      emergencyContact: patientData.emergencyContact || 'Not documented',
      address: patientData.address || 'Hospital Inpatient',
      chronicConditions: patientData.chronicConditions || [patientData.condition || 'General Evaluation'],
      allergies: patientData.allergies || [],
      riskLevel: patientData.riskLevel || 'medium',
      riskScore: patientData.riskScore || 50,
      condition: patientData.condition || 'General Medical Evaluation',
      appointmentTime: 'Just Now',
      appointmentDate: new Date().toISOString().split('T')[0],
      room: patientData.room || 'Room 102 (OPD Block A)',
      attendingDoctor: patientData.attendingDoctor || 'Dr. Amit Sharma, MD',
      assignedDoctorId: patientData.assignedDoctorId || 'DOC1001',
      avatar: (patientData.name || 'PT').substring(0, 2).toUpperCase(),
      lastVisit: 'Today',
      overdueGap: 'Analysis Complete',
      careJourney: patientData.careJourney || [
        { id: 'step-1', name: 'Consultation', status: 'completed', date: 'Today', note: 'Document batch uploaded.' },
        { id: 'step-2', name: 'Diagnosis', status: 'completed', date: 'Today', note: patientData.condition || 'Diagnosis established.' },
        { id: 'step-3', name: 'Treatment', status: 'completed', date: 'Today', note: 'Medications reconciled.' },
        { id: 'step-4', name: 'Investigation', status: 'attention', date: 'Review', note: 'Diagnostic evaluation pending.' },
        { id: 'step-5', name: 'Follow-up', status: 'pending', date: 'Scheduled', note: 'Next visit scheduled.' },
        { id: 'step-6', name: 'Review', status: 'pending', date: 'Today', note: 'Attending physician evaluation.' }
      ]
    };

    this.data.patients.unshift(newPatient);
    return newPatient;
  }

  // ── AI SUMMARY STORAGE ──────────────────────────────────────────────────
  saveAISummary(patientId, summaryData) {
    this.data.aiSummaries[patientId] = summaryData;
    return summaryData;
  }

  getAISummary(patientId) {
    return this.data.aiSummaries[patientId] || null;
  }

  // ── DASHBOARD AGGREGATION ───────────────────────────────────────────────
  getDashboardStats() {
    const totalPatients = this.data.patients.length;
    const criticalPatients = this.data.patients.filter(p => p.riskLevel === 'critical').length;
    const overdueFollowUps = this.data.followUps.filter(f => f.status === 'overdue').length;
    const pendingInvestigations = this.data.investigations.filter(i => i.status === 'attention' || i.status === 'pending').length;
    
    // Today's appointments
    const todayAppointments = this.data.appointments.filter(a => a.appointmentDate === '2026-09-02');
    
    // Recent audit activity
    const recentActivity = this.data.auditLogs.slice(0, 10);

    // High risk patient list
    const highRiskList = this.data.patients.filter(p => p.riskLevel === 'critical').slice(0, 8);

    return {
      kpi: {
        totalPatients,
        criticalAttentionRequired: criticalPatients,
        overdueFollowUps,
        pendingInvestigations,
        todayAppointmentsCount: todayAppointments.length
      },
      todayAppointments: todayAppointments.slice(0, 10),
      highRiskPatients: highRiskList,
      recentActivity,
      hospitalName: this.data.metadata.hospitalName,
      systemVersion: this.data.metadata.version
    };
  }

  // ── INVESTIGATIONS ──────────────────────────────────────────────────────
  getInvestigations({ status = '', patientId = '' } = {}) {
    let list = [...this.data.investigations];
    if (status) list = list.filter(i => i.status === status);
    if (patientId) list = list.filter(i => i.patientId === patientId);
    return list;
  }

  orderInvestigation(orderData) {
    const invId = `INV${Date.now()}`;
    const newInv = {
      investigationId: invId,
      patientId: orderData.patientId,
      patientName: orderData.patientName,
      mrn: orderData.mrn,
      investigationName: orderData.investigationName,
      status: 'pending',
      urgency: orderData.urgency || 'medium',
      dueDate: 'Scheduled Today',
      reason: orderData.reason || 'Clinical diagnostic requisition',
      guidelineRef: orderData.guidelineRef || 'Hospital Standard Practice',
      orderedBy: orderData.orderedBy || 'Dr. Amit Sharma, MD'
    };
    this.data.investigations.unshift(newInv);
    return newInv;
  }

  // ── FOLLOW-UPS ──────────────────────────────────────────────────────────
  getFollowUps({ status = '', doctorId = '' } = {}) {
    let list = [...this.data.followUps];
    if (status) list = list.filter(f => f.status === status);
    if (doctorId) list = list.filter(f => f.assignedDoctorId === doctorId);
    return list;
  }

  // ── NOTIFICATIONS ───────────────────────────────────────────────────────
  getNotifications(doctorId) {
    if (!doctorId) return this.data.notifications.slice(0, 15);
    return this.data.notifications.filter(n => n.doctorId === doctorId || n.doctorId === 'ALL');
  }

  markNotificationRead(notificationId) {
    const notif = this.data.notifications.find(n => n.notificationId === notificationId);
    if (notif) notif.isRead = true;
    return notif;
  }

  addNotification(notificationData) {
    const notif = {
      notificationId: `NOT${Date.now()}`,
      doctorId: notificationData.doctorId || 'DOC1001',
      title: notificationData.title,
      message: notificationData.message,
      priority: notificationData.priority || 'medium',
      isRead: false,
      createdAt: new Date().toISOString(),
      type: notificationData.type || 'alert'
    };
    this.data.notifications.unshift(notif);
    return notif;
  }

  // ── AUDIT LOGS ──────────────────────────────────────────────────────────
  addAuditLog({ doctorId, doctorName, patientId, patientName, mrn, action, details }) {
    const log = {
      logId: `AUD${Date.now()}`,
      doctorId: doctorId || 'DOC1001',
      doctorName: doctorName || 'Dr. Amit Sharma',
      patientId: patientId || 'PAT1001',
      patientName: patientName || 'Rajesh Kumar',
      mrn: mrn || 'MRN-2024-0891',
      action: action || 'CHART_ACCESSED',
      details: details || 'Clinician viewed patient chart',
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.unshift(log);
    return log;
  }
}

// Singleton export
const db = new HospitalDatabase();
module.exports = db;
