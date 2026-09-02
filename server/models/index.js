/* ==========================================================================
   CONSULT 360 AI — HOSPITAL DATA MODEL SCHEMAS
   Standard object schemas for the Hospital Information System (HIS).
   ========================================================================== */

class Doctor {
  constructor({ doctorId, name, email, password, department, designation, experience, phone, hospital, status }) {
    this.doctorId = doctorId;
    this.name = name;
    this.email = email;
    this.password = password;
    this.department = department;
    this.designation = designation;
    this.experience = experience;
    this.phone = phone;
    this.hospital = hospital || 'St. Jude Medical Center';
    this.status = status || 'active';
  }
}

class Patient {
  constructor({ patientId, name, age, gender, bloodGroup, address, phone, emergencyContact, chronicConditions, allergies, riskScore, riskLevel, mrn }) {
    this.patientId = patientId;
    this.mrn = mrn;
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.bloodGroup = bloodGroup;
    this.address = address;
    this.phone = phone;
    this.emergencyContact = emergencyContact;
    this.chronicConditions = chronicConditions || [];
    this.allergies = allergies || [];
    this.riskScore = riskScore || 50;
    this.riskLevel = riskLevel || 'medium';
  }
}

class Appointment {
  constructor({ appointmentId, patientId, doctorId, appointmentDate, appointmentTime, status, reason }) {
    this.appointmentId = appointmentId;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.appointmentDate = appointmentDate;
    this.appointmentTime = appointmentTime;
    this.status = status || 'scheduled';
    this.reason = reason;
  }
}

class MedicalReport {
  constructor({ reportId, patientId, reportType, uploadedFile, OCRText, uploadedDate }) {
    this.reportId = reportId;
    this.patientId = patientId;
    this.reportType = reportType;
    this.uploadedFile = uploadedFile;
    this.OCRText = OCRText;
    this.uploadedDate = uploadedDate || new Date().toISOString();
  }
}

class Investigation {
  constructor({ patientId, investigationName, status, dueDate, urgency, reason, guidelineRef }) {
    this.patientId = patientId;
    this.investigationName = investigationName;
    this.status = status || 'pending';
    this.dueDate = dueDate;
    this.urgency = urgency || 'medium';
    this.reason = reason;
    this.guidelineRef = guidelineRef;
  }
}

class FollowUp {
  constructor({ patientId, followUpDate, status, assignedDoctor, reason }) {
    this.patientId = patientId;
    this.followUpDate = followUpDate;
    this.status = status || 'scheduled';
    this.assignedDoctor = assignedDoctor;
    this.reason = reason;
  }
}

class AISummary {
  constructor({ patientId, summary, risk, confidence, reasons, recommendations, generatedDate }) {
    this.patientId = patientId;
    this.summary = summary;
    this.risk = risk;
    this.confidence = confidence;
    this.reasons = reasons || [];
    this.recommendations = recommendations || [];
    this.generatedDate = generatedDate || new Date().toISOString();
  }
}

class Notification {
  constructor({ doctorId, title, message, priority, isRead }) {
    this.doctorId = doctorId;
    this.title = title;
    this.message = message;
    this.priority = priority || 'medium';
    this.isRead = isRead || false;
  }
}

class Department {
  constructor({ departmentName, floor, headDoctor }) {
    this.departmentName = departmentName;
    this.floor = floor;
    this.headDoctor = headDoctor;
  }
}

class AuditLog {
  constructor({ doctorId, patientId, action, timestamp }) {
    this.doctorId = doctorId;
    this.patientId = patientId;
    this.action = action;
    this.timestamp = timestamp || new Date().toISOString();
  }
}

module.exports = {
  Doctor,
  Patient,
  Appointment,
  MedicalReport,
  Investigation,
  FollowUp,
  AISummary,
  Notification,
  Department,
  AuditLog
};
