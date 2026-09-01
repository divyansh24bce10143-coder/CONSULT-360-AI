/* ==========================================================================
   CONSULT 360 AI — CLINICAL WORKFLOW APPLICATION LOGIC
   Professional decision-support and care journey continuum engine.
   All AI synthesis routes through /api/* (Gemini 3.6 Flash Multimodal Engine).
   ========================================================================== */

// ── Application State ───────────────────────────────────────────────────────
const state = {
  serverOnline: false,
  currentPatientId: null,
  currentResult: null,
  currentView: 'dashboard',      // 'dashboard' | 'patient'
  sidebarFilter: 'all',          // 'all' | 'critical' | 'attention'
  dashboardFilter: 'all',        // 'all' | 'critical' | 'overdue' | 'pending-tests'
  searchQuery: '',
  selectedFiles: []              // Array of File objects staged for upload
};

// ── PDF.js Worker Configuration ────────────────────────────────────────────
if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// ── Initialization ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderSidebarQueue();
  renderDashboardWorklist();
  checkServerHealth();
  setupUploadArea();
});

// ── Server Health Check ───────────────────────────────────────────────────
async function checkServerHealth() {
  const dot = document.getElementById('status-dot');
  const txt = document.getElementById('status-text');
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    state.serverOnline = true;

    if (data.gemini === 'connected') {
      dot.className = 'status-dot connected';
      txt.textContent = 'Clinical AI Engine Active (Gemini 3.6 Flash)';
    } else {
      dot.className = 'status-dot disconnected';
      txt.textContent = 'Engine Connected — Key Missing';
      showToast('⚠️ GEMINI_API_KEY missing in server/.env', 'error');
    }
  } catch (e) {
    state.serverOnline = false;
    dot.className = 'status-dot disconnected';
    txt.textContent = 'Server Offline (Local Dev)';
  }
}

// ── View Navigation (Dashboard Worklist vs Patient Detail) ──────────────────
function showDashboardView() {
  state.currentView = 'dashboard';
  state.currentPatientId = null;

  document.getElementById('dashboard-view').classList.remove('hidden');
  document.getElementById('patient-view').classList.add('hidden');

  // Clear sidebar active highlights
  document.querySelectorAll('.patient-item-card').forEach(el => el.classList.remove('active'));

  renderDashboardWorklist();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPatientView() {
  state.currentView = 'patient';
  document.getElementById('dashboard-view').classList.add('hidden');
  document.getElementById('patient-view').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Dashboard / Worklist Rendering ─────────────────────────────────────────
function renderDashboardWorklist() {
  const tbody = document.getElementById('worklist-tbody');
  if (!tbody) return;

  // Calculate KPI Counts
  let criticalCount = 0;
  let overdueCount = 0;
  let pendingCount = 0;

  DEMO_PATIENTS.forEach(p => {
    if (p.riskLevel === 'critical') criticalCount++;
    if (p.careJourney?.some(j => j.status === 'missed' || j.status === 'attention')) overdueCount++;
    const res = DEMO_RESULTS[p.id];
    if (res?.missingInvestigations) pendingCount += res.missingInvestigations.length;
  });

  const kpiCritEl = document.getElementById('kpi-critical-count');
  const kpiOverEl = document.getElementById('kpi-overdue-count');
  const kpiPendEl = document.getElementById('kpi-pending-count');
  const kpiTotEl  = document.getElementById('kpi-total-count');

  if (kpiCritEl) kpiCritEl.textContent = criticalCount;
  if (kpiOverEl) kpiOverEl.textContent = overdueCount;
  if (kpiPendEl) kpiPendEl.textContent = pendingCount;
  if (kpiTotEl)  kpiTotEl.textContent  = DEMO_PATIENTS.length;

  const quickStats = document.getElementById('triage-quick-stats');
  if (quickStats) {
    quickStats.innerHTML = `<strong>${DEMO_PATIENTS.length} Outpatients</strong> in Queue · <strong>${criticalCount} Critical</strong> · <strong>${pendingCount} Pending Labs</strong>`;
  }

  // Filter patients for the dashboard table
  const filtered = DEMO_PATIENTS.filter(p => {
    if (state.dashboardFilter === 'critical') return p.riskLevel === 'critical';
    if (state.dashboardFilter === 'overdue') return p.careJourney?.some(j => j.status === 'missed' || j.status === 'attention');
    if (state.dashboardFilter === 'pending-tests') {
      const res = DEMO_RESULTS[p.id];
      return res?.missingInvestigations && res.missingInvestigations.length > 0;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:32px;color:var(--text-muted)">
          No patients match the selected filter criteria.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const currentStage = p.careJourney ? p.careJourney.find(s => s.status === 'attention' || s.status === 'missed' || s.status === 'pending') || p.careJourney[p.careJourney.length - 1] : { name: 'Consultation', status: 'completed' };
    
    return `
      <tr>
        <td>
          <div class="table-patient-cell">
            <div class="table-avatar-badge">${p.avatar}</div>
            <div>
              <div class="table-patient-name">${p.name}</div>
              <div class="table-patient-sub">${p.mrn} · ${p.age}y/${p.gender[0]} · ${p.bloodGroup}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="triage-badge risk-${p.riskLevel}">
            ${p.riskLevel === 'critical' ? '🔴 Critical' : p.riskLevel === 'medium' ? '🟠 High Attention' : '🟢 Routine'}
          </span>
        </td>
        <td>
          <div class="table-condition-text">${p.condition}</div>
        </td>
        <td>
          <span class="triage-badge stage-${currentStage.status}">
            ${currentStage.name} (${currentStage.status})
          </span>
        </td>
        <td>
          <div class="table-gap-alert">
            <span>⚠️</span> ${p.overdueGap || 'Routine Follow-up'}
          </div>
        </td>
        <td>
          <div style="font-family:var(--font-mono);font-size:11.5px;color:var(--text-secondary)">${p.lastVisit || 'Today'}</div>
          <div style="font-size:10.5px;color:var(--text-muted)">${p.attendingDoctor ? p.attendingDoctor.split(',')[0] : 'Dr. Sarah Chen'}</div>
        </td>
        <td style="text-align:right">
          <button class="table-action-btn" onclick="selectPatient('${p.id}')">
            Open Clinical Brief →
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function filterDashboardTable(filterType) {
  state.dashboardFilter = filterType;
  document.querySelectorAll('.pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(`'${filterType}'`));
  });
  const labelEl = document.getElementById('table-filter-label');
  if (labelEl) {
    const labels = {
      'all': 'All Active Records',
      'critical': 'Filtered: Critical Attention',
      'overdue': 'Filtered: Overdue Follow-ups',
      'pending-tests': 'Filtered: Pending Investigations'
    };
    labelEl.textContent = labels[filterType] || 'All Records';
  }
  renderDashboardWorklist();
}

function setTableFilter(filterType, btn) {
  document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  filterDashboardTable(filterType);
}

// ── Sidebar Outpatient Queue Rendering ─────────────────────────────────────
function renderSidebarQueue() {
  const list = document.getElementById('patient-list');
  const countBadge = document.getElementById('sidebar-patient-count');
  if (!list) return;

  if (countBadge) countBadge.textContent = DEMO_PATIENTS.length;

  let filtered = DEMO_PATIENTS;

  // Search filter
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.mrn && p.mrn.toLowerCase().includes(q)) ||
      p.condition.toLowerCase().includes(q)
    );
  }

  // Triage Tab filter
  if (state.sidebarFilter === 'critical') {
    filtered = filtered.filter(p => p.riskLevel === 'critical');
  } else if (state.sidebarFilter === 'attention') {
    filtered = filtered.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'medium');
  }

  if (filtered.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:12px">No patients found.</div>`;
    return;
  }

  list.innerHTML = filtered.map(p => `
    <div class="patient-item-card ${state.currentPatientId === p.id ? 'active' : ''}"
         id="pi-${p.id}" onclick="selectPatient('${p.id}')">
      <div class="patient-item-row-top">
        <span class="patient-item-name">${p.name}</span>
        <span class="patient-item-time">⏰ ${p.appointmentTime.split(' ')[0]}</span>
      </div>
      <div class="patient-item-row-mid">${p.condition}</div>
      <div class="patient-item-row-bot">
        <span class="patient-mrn-label">${p.mrn || p.id} · ${p.age}y</span>
        <div style="display:flex;align-items:center;gap:6px">
          <span class="triage-badge risk-${p.riskLevel}">
            ${p.riskLevel === 'critical' ? 'Critical' : p.riskLevel === 'medium' ? 'Attention' : 'Routine'}
          </span>
          <button class="patient-delete-btn" onclick="deletePatient(event, '${p.id}')" title="Discharge patient">✕</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterPatients(query) {
  state.searchQuery = query.trim();
  renderSidebarQueue();
}

function setSidebarFilter(filter, btn) {
  state.sidebarFilter = filter;
  document.querySelectorAll('.triage-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderSidebarQueue();
}

// ── Select Patient & Open Detail Screen ────────────────────────────────────
async function selectPatient(id) {
  state.currentPatientId = id;

  const patient = DEMO_PATIENTS.find(p => p.id === id);
  if (!patient) return;

  // Highlight in sidebar queue
  document.querySelectorAll('.patient-item-card').forEach(el => el.classList.remove('active'));
  document.getElementById(`pi-${id}`)?.classList.add('active');

  // Switch View to Patient Detail
  showPatientView();

  // Render Master Header & Allergy Banner
  renderPatientHeader(patient);

  // Render Care Journey Continuum Stepper
  renderCareJourneyStepper(patient);

  // Reset tab to Overview
  switchTab('overview', document.querySelector('.clinical-tab-btn[data-tab="overview"]'));

  // Render AI Pre-computed results
  const result = DEMO_RESULTS[id];
  if (result) {
    state.currentResult = result;
    renderAllTabs(result);
  }

  // Update chart counter badge
  updateChartCounterBadge();

  // Update queue position indicator
  updateQueueNavIndicator();
}

function renderPatientHeader(patient) {
  const avatarEl = document.getElementById('hdr-avatar');
  const nameEl   = document.getElementById('hdr-name');
  const mrnEl    = document.getElementById('hdr-mrn');
  const riskEl   = document.getElementById('hdr-risk');
  const metaEl   = document.getElementById('hdr-meta');
  const allergyEl= document.getElementById('hdr-allergy-text');

  if (avatarEl) avatarEl.textContent = patient.avatar || patient.name.substring(0, 2).toUpperCase();
  if (nameEl)   nameEl.textContent   = patient.name;
  if (mrnEl)    mrnEl.textContent    = patient.mrn || `MRN-${patient.id}`;
  
  if (riskEl) {
    riskEl.className = `triage-status-tag risk-${patient.riskLevel}`;
    riskEl.textContent = patient.riskLevel === 'critical' ? '🔴 Critical Attention Required' : patient.riskLevel === 'medium' ? '🟠 High Priority Review' : '🟢 Routine Care';
  }

  if (metaEl) {
    metaEl.textContent = `${patient.age}y · ${patient.gender} · Blood Group ${patient.bloodGroup} · 🕐 ${patient.appointmentTime} · ${patient.room || 'Clinic Area'} · Attending: ${patient.attendingDoctor || 'Dr. Sarah Chen, MD'}`;
  }

  if (allergyEl) {
    const allergies = patient.allergies || [];
    allergyEl.textContent = allergies.length > 0 ? allergies.join(' · ') : 'None documented in current EHR record';
  }
}

// ── Care Journey Stepper Component ─────────────────────────────────────────
function renderCareJourneyStepper(patient) {
  const stepper = document.getElementById('care-journey-stepper');
  const summaryEl = document.getElementById('journey-stage-summary');
  if (!stepper) return;

  const defaultJourney = [
    { id: 'step-1', name: 'Consultation', status: 'completed', date: 'Encounter Logged', note: 'Physician consultation recorded.' },
    { id: 'step-2', name: 'Diagnosis', status: 'completed', date: 'Confirmed', note: patient.condition || 'Active clinical diagnosis.' },
    { id: 'step-3', name: 'Treatment', status: 'completed', date: 'In Progress', note: 'Prescription regimen active.' },
    { id: 'step-4', name: 'Investigation', status: patient.riskLevel === 'critical' ? 'attention' : 'pending', date: 'Pending Audit', note: 'Diagnostic tests required.' },
    { id: 'step-5', name: 'Follow-up', status: 'pending', date: 'Scheduled', note: 'Next visit scheduled.' },
    { id: 'step-6', name: 'Review', status: 'pending', date: 'Pending', note: 'Multi-specialist chart review.' }
  ];

  const journey = patient.careJourney || defaultJourney;

  const statusIcons = {
    completed: '✓',
    attention: '⚠️',
    missed: '✕',
    pending: '⏱'
  };

  const statusLabels = {
    completed: 'Completed',
    attention: 'Attention',
    missed: 'Overdue',
    pending: 'Pending'
  };

  stepper.innerHTML = journey.map((step, idx) => `
    <div class="journey-step-box step-${step.status}" onclick="jumpToJourneyStage('${step.name}')" title="Click to inspect ${step.name} stage">
      <div class="step-num-status">
        <span class="step-name-text">${idx + 1}. ${step.name}</span>
        <span class="step-icon-indicator" title="${statusLabels[step.status]}">${statusIcons[step.status]}</span>
      </div>
      <div class="step-date-text">${step.date}</div>
      <div class="step-note-snippet" title="${step.note}">${step.note}</div>
    </div>
  `).join('');

  if (summaryEl) {
    const activeStep = journey.find(s => s.status === 'attention' || s.status === 'missed') || journey.find(s => s.status === 'pending') || journey[journey.length - 1];
    summaryEl.textContent = `Current Active Stage: ${activeStep.name} (${statusLabels[activeStep.status]}) · Click any step to jump to details`;
  }
}

function jumpToJourneyStage(stageName) {
  const name = (stageName || '').toLowerCase();
  if (name.includes('consult') || name.includes('overview')) {
    switchTab('overview', document.querySelector('.clinical-tab-btn[data-tab="overview"]'));
  } else if (name.includes('diagnos')) {
    switchTab('overview', document.querySelector('.clinical-tab-btn[data-tab="overview"]'));
    showToast('Navigated to Active Diagnoses');
  } else if (name.includes('treat')) {
    switchTab('overview', document.querySelector('.clinical-tab-btn[data-tab="overview"]'));
    showToast('Navigated to Reconciled Medications');
  } else if (name.includes('investig')) {
    switchTab('missing', document.querySelector('.clinical-tab-btn[data-tab="missing"]'));
  } else if (name.includes('follow')) {
    switchTab('timeline', document.querySelector('.clinical-tab-btn[data-tab="timeline"]'));
  } else if (name.includes('review')) {
    switchTab('risk', document.querySelector('.clinical-tab-btn[data-tab="risk"]'));
  }
}

// ── Tab Switching ──────────────────────────────────────────────────────────
function switchTab(name, btn) {
  document.querySelectorAll('.clinical-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.clinical-tab-panel').forEach(p => p.classList.add('hidden'));
  if (btn) btn.classList.add('active');
  const panel = document.getElementById(`tab-${name}`);
  if (panel) panel.classList.remove('hidden');
}

// ── Render All Tabs ────────────────────────────────────────────────────────
function renderAllTabs(result) {
  renderOverview(result);
  renderTimeline(result.timeline || []);
  renderChanges(result.clinicalChanges || []);
  renderRisk(result.riskFlags || []);
  renderMissing(result.missingInvestigations || []);

  // Update tab counter badges
  const riskCount = (result.riskFlags || []).length;
  const badgeRisk = document.getElementById('tab-badge-risk');
  if (badgeRisk) badgeRisk.textContent = riskCount;

  const missingCount = (result.missingInvestigations || []).length;
  const badgeMissing = document.getElementById('tab-badge-missing');
  if (badgeMissing) badgeMissing.textContent = missingCount;
}

// ── Tab 1: Clinical Overview ───────────────────────────────────────────────
function renderOverview(r) {
  const s = r.summary || {};
  const e = r.entities || {};
  const ai = r.aiMeta || {};

  // Vitals Grid
  const vitalsHtml = (e.vitals || []).map(v => `
    <div class="vital-tile ${v.status}">
      <span class="vital-type-label">${v.type}</span>
      <span class="vital-measurement">${v.value} <span style="font-size:12px;font-weight:600">${v.unit}</span></span>
      <span class="vital-ref-text">Ref: ${v.reference || 'Normal range'}</span>
    </div>
  `).join('');

  // Diagnoses Tags
  const diagHtml = (e.diagnoses || []).map(d => `
    <span class="clinical-tag ${d.status === 'active' ? 'tag-danger' : d.status === 'suspected' ? 'tag-warning' : ''}">
      ${d.name} ${d.icd ? `[${d.icd}]` : ''} · <em>${d.status.toUpperCase()}</em>
    </span>
  `).join('');

  // Medications
  const medsHtml = (e.medications || []).map(m => `
    <span class="clinical-tag ${m.change === 'new' ? 'tag-new' : m.change === 'dose-changed' ? 'tag-warning' : ''}">
      💊 <strong>${m.name} ${m.dose}</strong> (${m.frequency}) ${m.change === 'new' ? '· 🆕 NEW' : m.change === 'dose-changed' ? '· ↑ TITRATED' : ''}
    </span>
  `).join('');

  // Lab Results Table Rows
  const labsHtml = (e.labResults || []).map(l => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-light)">
      <div>
        <div style="font-weight:700;font-size:12.5px;color:var(--navy-900)">${l.test}</div>
        <div style="font-size:11px;color:var(--text-muted)">Reference Range: ${l.reference} · Reported: ${l.date}</div>
      </div>
      <div style="text-align:right">
        <div style="font-family:var(--font-mono);font-size:14px;font-weight:800;color:${l.status === 'critical' ? 'var(--status-critical)' : l.status === 'abnormal' ? 'var(--status-warning)' : 'var(--navy-900)'}">
          ${l.value} ${l.unit}
        </div>
        <span class="triage-badge ${l.status === 'critical' ? 'risk-critical' : l.status === 'abnormal' ? 'risk-medium' : 'risk-low'}">
          ${l.status.toUpperCase()}
        </span>
      </div>
    </div>
  `).join('');

  // Action Directives Checklist
  const actionsHtml = (s.actionItems || []).map((a, i) => `
    <div class="physician-directive-item">
      <input type="checkbox" id="dir-${i}" class="directive-checkbox" onchange="toggleDirective(${i})">
      <label for="dir-${i}" class="directive-text">${a}</label>
    </div>
  `).join('');

  document.getElementById('tab-overview').innerHTML = `
    <div class="overview-layout-grid">
      
      <!-- AI Care Brief Card -->
      <div class="ai-care-summary-box">
        <div class="ai-summary-header-row">
          <div style="display:flex;align-items:center;gap:8px">
            <span class="ai-summary-tag">
              <span>✨</span> PRE-CONSULTATION CLINICAL AI SYNTHESIS
            </span>
            <button class="btn-copy-brief" onclick="copyAiBriefText()" title="Copy pre-consultation summary to clipboard">
              <span>📋</span> Copy Brief
            </button>
          </div>
          <span class="ai-confidence-pill">
            Grounded Confidence: ${ai.confidenceScore || 94}% · ${ai.modelUsed || 'Gemini 3.6 Flash'}
          </span>
        </div>
        <div class="ai-summary-headline">${s.oneLiner || 'Clinical summary synthesized from multi-source EHR records.'}</div>
        <div class="ai-summary-narrative">${s.clinicalSummary || s.chiefComplaint || 'No clinical narrative available.'}</div>
      </div>

      <!-- Vitals & Chief Complaints Grid -->
      <div class="clinical-two-col-grid">
        <div class="clinical-card" style="padding:16px">
          <h3 class="card-heading" style="margin-bottom:12px">📊 Encounter Vital Signs Matrix</h3>
          <div class="vitals-matrix-grid">
            ${vitalsHtml || '<p style="color:var(--text-muted)">No vitals extracted.</p>'}
          </div>
        </div>

        <div class="clinical-card" style="padding:16px">
          <h3 class="card-heading" style="margin-bottom:8px">🩺 Chief Complaints &amp; Active Symptoms</h3>
          <p style="font-size:12.5px;color:var(--text-secondary);line-height:1.5;margin-bottom:12px">${s.chiefComplaint || 'Patient presents for scheduled evaluation.'}</p>
          <div class="clinical-tags-container">
            ${(e.symptoms || []).map(sym => `<span class="clinical-tag">🚩 ${sym.description}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Problem List & Active Medications -->
      <div class="clinical-two-col-grid">
        <div class="clinical-card" style="padding:16px">
          <h3 class="card-heading" style="margin-bottom:12px">🔬 Active Problem List &amp; Diagnoses</h3>
          <div class="clinical-tags-container">
            ${diagHtml || '<span class="clinical-tag">None documented</span>'}
          </div>
        </div>

        <div class="clinical-card" style="padding:16px">
          <h3 class="card-heading" style="margin-bottom:12px">💊 Reconciled Active Medications</h3>
          <div class="clinical-tags-container">
            ${medsHtml || '<span class="clinical-tag">None documented</span>'}
          </div>
        </div>
      </div>

      <!-- Labs Matrix & Physician Action Directives -->
      <div class="clinical-two-col-grid">
        <div class="clinical-card" style="padding:16px">
          <h3 class="card-heading" style="margin-bottom:12px">🧪 Laboratory Biomarker Extract</h3>
          <div>${labsHtml || '<p style="color:var(--text-muted)">No lab results available.</p>'}</div>
        </div>

        <div class="clinical-card" style="padding:16px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <h3 class="card-heading" style="margin-bottom:0">✅ Physician Next-Action Directives</h3>
            <button class="btn-approve-all" onclick="approveAllDirectives()" title="Approve all recommended actions into chart orders">
              ✓ Approve All
            </button>
          </div>
          <div>${actionsHtml || '<p style="color:var(--text-muted)">No action directives generated.</p>'}</div>
        </div>
      </div>


      <!-- Live Active Encounter Chart Records & Order Sheet -->
      <div class="clinical-card" style="padding:18px;border-left:4px solid var(--clinical-blue)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border-light)">
          <div style="display:flex;align-items:center;gap:10px">
            <h3 class="card-heading">📋 Active Encounter Chart Records &amp; Orders Log</h3>
            <span class="table-badge" id="inline-chart-count">0 items recorded</span>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn-clinical-outline" onclick="copyChartRecordText()">
              <span>📋</span> Copy to Clipboard (EHR)
            </button>
            <button class="btn-clinical-primary" onclick="openChartRecordsModal()">
              <span>🔍</span> Open Full Chart View
            </button>
          </div>
        </div>
        <div id="inline-chart-record-container">
          <p style="font-size:12.5px;color:var(--text-muted);font-style:italic">
            Check off any Physician Directive above or click "[✓ Accept &amp; Order]" on risk signals to log orders and actions into this patient's chart record.
          </p>
        </div>
      </div>

    </div>
  `;

  // Render the initial inline chart log
  renderInlineChartLog();
}


// ── Patient Chart Records & Orders Management ──────────────────────────────
const patientChartRecords = {};

function getPatientChart(patientId) {
  if (!patientChartRecords[patientId]) {
    patientChartRecords[patientId] = {
      orders: [],
      directives: [],
      referrals: [],
      signedBy: 'Dr. Sarah Chen, MD (Cardiology / Internal Medicine)',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
  return patientChartRecords[patientId];
}

function updateChartCounterBadge() {
  const patientId = state.currentPatientId;
  const badge = document.getElementById('chart-records-counter');
  if (!badge) return;

  if (!patientId) {
    badge.textContent = '0';
    return;
  }

  const chart = getPatientChart(patientId);
  const totalItems = chart.orders.length + chart.directives.length + chart.referrals.length;
  badge.textContent = totalItems;

  renderInlineChartLog();
}

function renderInlineChartLog() {
  const patientId = state.currentPatientId;
  const container = document.getElementById('inline-chart-record-container');
  const countEl = document.getElementById('inline-chart-count');
  if (!container) return;

  const chart = getPatientChart(patientId || 'P001');
  const totalItems = chart.orders.length + chart.directives.length + chart.referrals.length;

  if (countEl) countEl.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''} recorded`;

  if (totalItems === 0) {
    container.innerHTML = `
      <p style="font-size:12.5px;color:var(--text-muted);font-style:italic">
        Check off any Physician Directive above or click "[✓ Accept &amp; Order]" on risk signals to log orders and actions into this patient's chart record.
      </p>
    `;
    return;
  }

  const itemsHtml = [];

  chart.orders.forEach(o => {
    itemsHtml.push(`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg-subtle);border:1px solid var(--border-light);border-radius:var(--radius-md);margin-bottom:6px">
        <span style="font-weight:600;font-size:12.5px;color:var(--navy-900)">🔬 ${o.title}</span>
        <span style="font-size:11px;font-family:var(--font-mono);color:var(--text-muted)">${o.time} · Order Placed</span>
      </div>
    `);
  });

  chart.directives.forEach(d => {
    itemsHtml.push(`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:var(--radius-md);margin-bottom:6px">
        <span style="font-size:12.5px;color:#065f46;font-weight:600">✓ ${d.text}</span>
        <span style="font-size:11px;font-family:var(--font-mono);color:#047857">${d.time} · Logged</span>
      </div>
    `);
  });

  chart.referrals.forEach(r => {
    itemsHtml.push(`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:var(--radius-md);margin-bottom:6px">
        <span style="font-weight:600;font-size:12.5px;color:#1e40af">⚑ ${r.title}</span>
        <span style="font-size:11px;font-family:var(--font-mono);color:#2563eb">${r.time} · Dispatched</span>
      </div>
    `);
  });

  container.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:8px">
      ${itemsHtml.join('')}
    </div>
    <div style="font-size:11px;color:var(--text-muted);display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border-light);padding-top:6px">
      <span>Authenticated by <strong>Dr. Sarah Chen, MD</strong></span>
      <span style="color:var(--status-success);font-weight:600">✓ Chart Synchronized</span>
    </div>
  `;
}


function toggleDirective(idx) {
  const chk = document.getElementById(`dir-${idx}`);
  const patientId = state.currentPatientId;
  if (!chk || !patientId) return;

  const result = state.currentResult || DEMO_RESULTS[patientId];
  const directiveText = result?.summary?.actionItems?.[idx] || `Directive #${idx + 1}`;
  const chart = getPatientChart(patientId);

  if (chk.checked) {
    if (!chart.directives.some(d => d.text === directiveText)) {
      chart.directives.push({
        text: directiveText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clinician: 'Dr. Sarah Chen, MD'
      });
    }
    showToast('✓ Clinical action checked and logged into chart record');
  } else {
    chart.directives = chart.directives.filter(d => d.text !== directiveText);
    showToast('Directive removed from chart record');
  }

  updateChartCounterBadge();
}

// ── Open / Close Chart Records Modal ───────────────────────────────────────
function openChartRecordsModal() {
  const patientId = state.currentPatientId;
  const patient = DEMO_PATIENTS.find(p => p.id === patientId);
  const chart = getPatientChart(patientId || 'P001');

  const modal = document.getElementById('chart-records-modal');
  const bodyEl = document.getElementById('chart-records-body');
  const subtitleEl = document.getElementById('chart-modal-patient-subtitle');

  if (subtitleEl && patient) {
    subtitleEl.textContent = `Patient: ${patient.name} (${patient.mrn}) · Encounter: Today · Attending: ${patient.attendingDoctor || 'Dr. Sarah Chen, MD'}`;
  }

  const ordersListHtml = chart.orders.length > 0 ? chart.orders.map(o => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg-subtle);border:1px solid var(--border-light);border-radius:var(--radius-md);margin-bottom:6px">
      <div style="font-weight:600;font-size:12.5px;color:var(--navy-900)">🔬 ${o.title}</div>
      <div style="font-size:11px;font-family:var(--font-mono);color:var(--text-muted)">${o.time} · Ordered</div>
    </div>
  `).join('') : '<p style="font-size:12px;color:var(--text-muted);font-style:italic">No active diagnostic orders placed this encounter.</p>';

  const directivesListHtml = chart.directives.length > 0 ? chart.directives.map(d => `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;padding:8px 12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:var(--radius-md);margin-bottom:6px">
      <div style="font-size:12px;color:#065f46;line-height:1.4">✓ <strong>${d.text}</strong></div>
      <div style="font-size:11px;font-family:var(--font-mono);color:#047857;white-space:nowrap;margin-left:12px">${d.time}</div>
    </div>
  `).join('') : '<p style="font-size:12px;color:var(--text-muted);font-style:italic">No checklist directives signed off yet.</p>';

  const referralsListHtml = chart.referrals.length > 0 ? chart.referrals.map(r => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:var(--radius-md);margin-bottom:6px">
      <div style="font-weight:600;font-size:12.5px;color:#1e40af">⚑ ${r.title}</div>
      <div style="font-size:11px;font-family:var(--font-mono);color:#2563eb">${r.time} · Dispatched</div>
    </div>
  `).join('') : '<p style="font-size:12px;color:var(--text-muted);font-style:italic">No specialty referrals dispatched.</p>';

  if (bodyEl) {
    bodyEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:14px;max-height:420px;overflow-y:auto;padding-right:4px">
        
        <div>
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-bottom:6px">
            1. Diagnostic &amp; Lab Orders Placed This Encounter
          </div>
          ${ordersListHtml}
        </div>

        <div>
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-bottom:6px">
            2. Verified Physician Directives &amp; Interventions
          </div>
          ${directivesListHtml}
        </div>

        <div>
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-bottom:6px">
            3. Specialist Consultations &amp; Referrals
          </div>
          ${referralsListHtml}
        </div>

        <!-- Electronic Signature Block -->
        <div style="background:#f8fafc;border:1px solid var(--border-medium);border-radius:var(--radius-md);padding:10px 14px;display:flex;align-items:center;justify-content:space-between;margin-top:6px">
          <div>
            <div style="font-weight:700;font-size:12px;color:var(--navy-900)">Attending Clinician Electronic Sign-off</div>
            <div style="font-size:11px;color:var(--text-secondary)">Dr. Sarah Chen, MD (Lic #MD-883492 · Internal Med / Cardio)</div>
          </div>
          <div style="font-size:11px;font-family:var(--font-mono);color:var(--status-success);font-weight:700">
            ✓ CHART AUTHENTICATED
          </div>
        </div>

      </div>
    `;
  }

  if (modal) modal.classList.remove('hidden');
}

function closeChartRecordsModal() {
  document.getElementById('chart-records-modal')?.classList.add('hidden');
}

function copyChartRecordText() {
  const patientId = state.currentPatientId;
  const patient = DEMO_PATIENTS.find(p => p.id === patientId);
  const chart = getPatientChart(patientId || 'P001');

  let text = `=================================================\n`;
  text += `CONSULT 360 AI — PATIENT ENCOUNTER ORDERS & DIRECTIVES\n`;
  text += `Patient: ${patient ? patient.name : 'Unknown'} | MRN: ${patient ? patient.mrn : 'N/A'}\n`;
  text += `Attending: ${patient ? patient.attendingDoctor : 'Dr. Sarah Chen, MD'}\n`;
  text += `Date: ${new Date().toLocaleDateString()}\n`;
  text += `=================================================\n\n`;

  text += `DIAGNOSTIC & LAB ORDERS:\n`;
  if (chart.orders.length > 0) {
    chart.orders.forEach(o => { text += `• ${o.title} (Ordered at ${o.time})\n`; });
  } else {
    text += `(No diagnostic orders)\n`;
  }

  text += `\nCOMPLETED PHYSICIAN DIRECTIVES:\n`;
  if (chart.directives.length > 0) {
    chart.directives.forEach(d => { text += `[✓] ${d.text} (${d.time})\n`; });
  } else {
    text += `(No directives signed off)\n`;
  }

  text += `\nSPECIALTY REFERRALS:\n`;
  if (chart.referrals.length > 0) {
    chart.referrals.forEach(r => { text += `• ${r.title} (${r.time})\n`; });
  } else {
    text += `(No referrals)\n`;
  }

  text += `\nAUTHENTICATION:\nElectronically Signed: Dr. Sarah Chen, MD\n`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Chart record copied to clipboard (EHR format)');
  });
}

function renderTimeline(events, filter = 'all') {
  const filtered = filter === 'all' ? events : events.filter(e => e.type === filter);

  const filterBtns = ['all', 'visit', 'lab', 'medication', 'procedure'].map(f => `
    <button class="pill-btn ${filter === f ? 'active' : ''}" onclick="renderTimeline(state.currentResult.timeline, '${f}')">
      ${{all:'All Events', visit:'🏥 Visits', lab:'🧪 Labs', medication:'💊 Meds', procedure:'🔧 Procedures'}[f]}
    </button>
  `).join('');

  const entriesHtml = filtered.map(ev => `
    <div class="clinical-timeline-entry ${ev.significance === 'critical' ? 'critical' : ''}">
      <div class="timeline-entry-node"></div>
      <div class="timeline-entry-card">
        <div class="timeline-entry-top">
          <span class="timeline-entry-title">${ev.event}</span>
          <span class="timeline-entry-date">${ev.date}</span>
        </div>
        <div class="timeline-entry-desc">${ev.detail}</div>
      </div>
    </div>
  `).join('');

  document.getElementById('tab-timeline').innerHTML = `
    <div class="timeline-filter-toolbar">${filterBtns}</div>
    <div class="clinical-timeline-track">
      ${entriesHtml || '<p style="color:var(--text-muted);padding:20px">No timeline events match filter.</p>'}
    </div>
  `;
}

// ── Tab 3: Metric Trends & Delta (Δ) ─────────────────────────────────────────
function renderChanges(changes) {
  const cardsHtml = changes.map(c => {
    const isWorse = c.direction === 'worsening';
    const isImp   = c.direction === 'improving';
    const cardClass = isWorse ? 'worsening' : isImp ? 'improving' : 'stable';
    const dirClass  = isWorse ? 'dir-worsening' : isImp ? 'dir-improving' : 'dir-stable';

    return `
      <div class="delta-metric-card ${cardClass}">
        <div>
          <div class="delta-card-header">
            <span class="delta-param-title">${c.parameter}</span>
            <span class="delta-direction-badge ${dirClass}">${c.direction}</span>
          </div>

          <div class="delta-flow-visual">
            <div class="delta-value-box">
              <div class="delta-val-num">${c.previous.value}</div>
              <div class="delta-val-date">${c.previous.date}</div>
            </div>

            ${c.mid ? `
              <span class="delta-arrow-sep">→</span>
              <div class="delta-value-box" style="opacity:0.8">
                <div class="delta-val-num">${c.mid.value}</div>
                <div class="delta-val-date">${c.mid.date}</div>
              </div>
            ` : ''}

            <span class="delta-arrow-sep">→</span>

            <div class="delta-value-box" style="border-color:${isWorse ? 'var(--status-critical)' : isImp ? 'var(--status-success)' : 'var(--border-medium)'}">
              <div class="delta-val-num" style="color:${isWorse ? 'var(--status-critical)' : isImp ? 'var(--status-success)' : 'var(--navy-900)'}">${c.current.value}</div>
              <div class="delta-val-date">${c.current.date}</div>
            </div>
          </div>
        </div>

        <div class="delta-card-footer">
          <span><strong>Δ Shift:</strong> ${c.magnitude}</span>
          <span><strong>Assessment:</strong> ${c.clinicalSignificance}</span>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('tab-changes').innerHTML = `
    <div style="margin-bottom:16px">
      <h2 class="card-heading">Longitudinal Clinical Delta (Δ) Analysis</h2>
      <p style="font-size:12.5px;color:var(--text-secondary)">Multi-encounter biometric shifts and trend trajectories.</p>
    </div>
    <div class="delta-grid-container">${cardsHtml || '<p style="color:var(--text-muted)">No biomarker shifts detected.</p>'}</div>
  `;
}

// ── Tab 4: Explainable AI (XAI) Risk Assessment ────────────────────────────
function renderRisk(flags) {
  const cardsHtml = flags.map((f, idx) => `
    <div class="xai-risk-card ${f.severity}">
      <div class="xai-risk-header">
        <div class="xai-title-row">
          <span class="triage-badge risk-${f.severity}">${f.severity.toUpperCase()}</span>
          <span class="xai-risk-title">${f.risk}</span>
        </div>
        <span class="xai-confidence-indicator">Confidence: ${f.confidence || '94%'}</span>
      </div>

      <div class="xai-risk-body">
        <div class="xai-audit-field">
          <span class="xai-field-label">Clinical Reasoning:</span>
          <span class="xai-field-value">${f.reason}</span>
        </div>

        <div class="xai-audit-field">
          <span class="xai-field-label">Evidence Cited:</span>
          <span class="xai-field-value"><code class="xai-evidence-code">${f.evidence}</code></span>
        </div>

        <div class="xai-audit-field">
          <span class="xai-field-label">Source Document:</span>
          <span class="xai-field-value" style="color:var(--text-muted);font-size:12px">📄 ${f.sourceDocument} (${f.date})</span>
        </div>

        <div class="xai-audit-field">
          <span class="xai-field-label">Recommended Action:</span>
          <span class="xai-field-value xai-action-recommendation">${f.recommendation}</span>
        </div>
      </div>

      <!-- Human Override & Decision Actions -->
      <div class="xai-override-bar" id="override-bar-${f.id || idx}">
        <span class="override-label-text">Clinician Override / Order Decision:</span>
        <div class="override-button-group">
          <button class="btn-override-accept" onclick="handleRiskOverride('${f.id || idx}', 'accept', '${f.risk}')">
            ✓ Accept &amp; Order
          </button>
          <button class="btn-override-refer" onclick="handleRiskOverride('${f.id || idx}', 'refer', '${f.risk}')">
            ⚑ Specialist Referral
          </button>
          <button class="btn-override-dismiss" onclick="handleRiskOverride('${f.id || idx}', 'dismiss', '${f.risk}')">
            ✕ Dismiss Flag
          </button>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('tab-risk').innerHTML = `
    <div style="margin-bottom:16px">
      <h2 class="card-heading">Explainable AI (XAI) Risk Signals &amp; Decision Support</h2>
      <p style="font-size:12.5px;color:var(--text-secondary)">Every risk flag is grounded with cited EHR evidence, clinical reasoning, and physician override controls.</p>
    </div>
    <div class="xai-risk-cards-stream">${cardsHtml || '<p style="color:var(--text-muted)">No acute risk flags detected.</p>'}</div>
  `;
}

function handleRiskOverride(id, action, title) {
  const bar = document.getElementById(`override-bar-${id}`);
  const patientId = state.currentPatientId;
  if (!bar || !patientId) return;

  const chart = getPatientChart(patientId);
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (action === 'accept') {
    chart.orders.push({ title, time: timeStr });
    bar.innerHTML = `<span style="font-size:12px;color:var(--status-success);font-weight:700">✓ Recommendation Accepted &amp; Added to Patient Care Plan Orders</span>`;
    showToast(`✓ "${title}" accepted into care plan orders`);
  } else if (action === 'refer') {
    chart.referrals.push({ title: `Specialty Consult: ${title}`, time: timeStr });
    bar.innerHTML = `<span style="font-size:12px;color:var(--status-info);font-weight:700">⚑ Specialty Consultation Referral Dispatched</span>`;
    showToast(`⚑ Referral consultation scheduled for "${title}"`);
  } else if (action === 'dismiss') {
    bar.innerHTML = `<span style="font-size:12px;color:var(--text-muted);font-style:italic">✕ Flag dismissed by attending clinician (reason documented)</span>`;
    showToast(`Flag dismissed for "${title}"`);
  }

  updateChartCounterBadge();
}

// ── Tab 5: Missing Investigations Radar ────────────────────────────────────
function renderMissing(missing) {
  const cardsHtml = missing.map(m => `
    <div class="missing-gap-card ${m.urgency}">
      <div class="gap-info-left">
        <div class="gap-test-title">🔬 ${m.test}</div>
        <div class="gap-clinical-rationale">${m.reason}</div>
        <div class="gap-metadata-row">
          <span>Indication: <strong>${m.basedOnCondition}</strong></span>
          ${m.guidelineRef ? `<span class="gap-guideline-ref">Guideline: ${m.guidelineRef}</span>` : ''}
          <span>Last Recorded: <em>${m.lastDone || 'Never in EHR'}</em></span>
        </div>
      </div>
      <div class="gap-actions-right">
        <span class="triage-badge risk-${m.urgency === 'critical' ? 'critical' : 'medium'}">${m.urgency.toUpperCase()} URGENCY</span>
        <button class="btn-order-investigation" onclick="handleOrderInvestigation('${m.test}')">
          Order Test Now
        </button>
      </div>
    </div>
  `).join('');

  document.getElementById('tab-missing').innerHTML = `
    <div style="margin-bottom:16px">
      <h2 class="card-heading">Proactive Missing &amp; Overdue Investigations Radar</h2>
      <p style="font-size:12.5px;color:var(--text-secondary)">Automated care-gap detection according to clinical guidelines (ADA, KDIGO, AHA/ACC).</p>
    </div>
    <div class="missing-radar-stream">${cardsHtml || '<p style="color:var(--text-muted)">All recommended investigations are up to date.</p>'}</div>
  `;
}

function handleOrderInvestigation(testName) {
  const patientId = state.currentPatientId;
  if (patientId) {
    const chart = getPatientChart(patientId);
    chart.orders.push({
      title: `Lab Order: ${testName}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    updateChartCounterBadge();
  }
  showToast(`📋 Lab order created & saved to chart: ${testName}`);
}


// ── Upload & Multi-Report Modal Management ─────────────────────────────────
function showUploadModal() {
  document.getElementById('upload-modal').classList.remove('hidden');
  clearAllFiles();
}

function closeUploadModal() {
  document.getElementById('upload-modal').classList.add('hidden');
  document.getElementById('upload-status').classList.add('hidden');
  document.getElementById('upload-area').classList.remove('hidden');
  document.getElementById('file-list-container')?.classList.add('hidden');
}

document.getElementById('upload-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeUploadModal();
});

function setupUploadArea() {
  const area  = document.getElementById('upload-area');
  const input = document.getElementById('file-input');
  if (!area || !input) return;

  area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('drag-over'); });
  area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
  area.addEventListener('drop', (e) => {
    e.preventDefault();
    area.classList.remove('drag-over');
    addFiles([...e.dataTransfer.files]);
  });

  input.addEventListener('change', (e) => {
    addFiles([...e.target.files]);
    input.value = '';
  });
}

function getFileIcon(file) {
  if (file.type === 'application/pdf') return '📄';
  if (file.type === 'text/plain')      return '📝';
  const name = file.name.toLowerCase();
  if (/ecg|ekg/.test(name))           return '🫀';
  if (/echo/.test(name))              return '🫀';
  if (/xray|x-ray|chest/.test(name)) return '🫁';
  if (/rx|prescription/.test(name))  return '💊';
  if (/lab|blood|report/.test(name)) return '🧪';
  if (file.type.startsWith('image/')) return '🖼️';
  return '📎';
}

function getFileTypeBadge(file) {
  if (file.type === 'application/pdf') return 'PDF';
  if (file.type === 'text/plain')      return 'TXT';
  const name = file.name.toLowerCase();
  if (/ecg|ekg/.test(name))            return 'ECG';
  if (/echo/.test(name))               return 'ECHO';
  if (/xray|x-ray/.test(name))         return 'X-RAY';
  if (/rx|prescription/.test(name))    return 'RX';
  if (/lab|blood/.test(name))          return 'LAB';
  if (file.type.startsWith('image/'))  return 'IMG';
  return 'MEDIA';
}

function addFiles(newFiles) {
  const allowed = ['application/pdf', 'text/plain', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  newFiles.forEach(f => {
    if (!allowed.includes(f.type)) {
      showToast(`⚠️ ${f.name} — format not supported`, 'error');
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      showToast(`⚠️ ${f.name} exceeds 20MB limit`, 'error');
      return;
    }
    if (state.selectedFiles.length >= 10) {
      showToast('⚠️ Maximum 10 files per patient', 'error');
      return;
    }
    state.selectedFiles.push(f);
  });
  renderFileList();
}

function removeFile(index) {
  state.selectedFiles.splice(index, 1);
  renderFileList();
}

function clearAllFiles() {
  state.selectedFiles = [];
  renderFileList();
}

function renderFileList() {
  const container = document.getElementById('file-list-container');
  const listEl    = document.getElementById('file-list');
  const countEl   = document.getElementById('file-list-count');
  const uploadArea= document.getElementById('upload-area');

  if (state.selectedFiles.length === 0) {
    container?.classList.add('hidden');
    uploadArea?.classList.remove('hidden');
    return;
  }

  uploadArea?.classList.add('hidden');
  container?.classList.remove('hidden');
  if (countEl) countEl.textContent = `${state.selectedFiles.length} file${state.selectedFiles.length > 1 ? 's' : ''} staged for ingestion`;

  if (listEl) {
    listEl.innerHTML = state.selectedFiles.map((f, i) => `
      <div class="staged-file-row">
        <div class="staged-file-left">
          <span>${getFileIcon(f)}</span>
          <span class="staged-file-name">${f.name}</span>
          <span class="staged-file-badge">${getFileTypeBadge(f)}</span>
          <span style="font-size:11px;color:var(--text-muted);font-family:var(--font-mono)">${(f.size/1024).toFixed(0)}KB</span>
        </div>
        <button class="btn-file-remove" onclick="removeFile(${i})" title="Remove file">✕</button>
      </div>
    `).join('');
  }

  const btn = document.getElementById('btn-analyze');
  if (btn) btn.textContent = `🚀 Ingest & Synthesize ${state.selectedFiles.length} Report${state.selectedFiles.length > 1 ? 's' : ''}`;
}

async function startAnalysis() {
  if (state.selectedFiles.length === 0) return;
  await processFiles(state.selectedFiles);
}

// ── Multi-File SSE Streaming Ingestion Pipeline ────────────────────────────
async function processFiles(files) {
  if (!state.serverOnline) {
    closeUploadModal();
    showToast('❌ Backend server offline. Start server with: cd server && npm start', 'error');
    return;
  }

  const firstName = files[0].name.replace(/\.(pdf|txt|jpg|jpeg|png|webp)$/i, '');
  const label = files.length > 1 ? `${firstName} (+${files.length - 1} records)` : firstName;
  const tempId = 'NEW_' + Date.now();
  const tempMrn = 'MRN-' + Math.floor(1000 + Math.random() * 9000);

  const tempPatient = {
    id: tempId,
    mrn: tempMrn,
    name: label,
    age: '—',
    gender: '—',
    bloodGroup: '—',
    appointmentTime: 'Just Now',
    condition: `${files.length} Document${files.length > 1 ? 's' : ''} Ingested`,
    riskLevel: 'medium',
    triageCategory: 'Review Required',
    lastVisit: 'Today',
    attendingDoctor: 'Dr. Sarah Chen, MD',
    avatar: 'NR',
    overdueGap: 'Analysis in Progress',
    allergies: [],
    careJourney: [
      { id: 'step-1', name: 'Consultation', status: 'completed', date: 'Today', note: 'Document batch uploaded.' },
      { id: 'step-2', name: 'Diagnosis', status: 'pending', date: 'Pending', note: 'Extracting entities.' },
      { id: 'step-3', name: 'Treatment', status: 'pending', date: 'Pending', note: 'Reconciling regimen.' },
      { id: 'step-4', name: 'Investigation', status: 'attention', date: 'Auditing', note: 'Evaluating guidelines.' },
      { id: 'step-5', name: 'Follow-up', status: 'pending', date: 'TBD', note: 'Awaiting doctor assessment.' },
      { id: 'step-6', name: 'Review', status: 'pending', date: 'TBD', note: 'Final sign-off.' }
    ]
  };

  closeUploadModal();
  DEMO_PATIENTS.unshift(tempPatient);
  renderSidebarQueue();
  renderDashboardWorklist();

  // Switch to Patient View & show Pipeline
  showPatientView();
  renderPatientHeader(tempPatient);
  renderCareJourneyStepper(tempPatient);
  switchTab('overview', document.querySelector('.clinical-tab-btn[data-tab="overview"]'));

  // Show Real-time Pipeline Bar
  const pipeContainer = document.getElementById('pipeline-container');
  if (pipeContainer) pipeContainer.classList.remove('hidden');

  document.getElementById('tab-overview').innerHTML = `
    <div style="text-align:center;padding:48px 20px">
      <div style="font-size:24px;margin-bottom:12px">⏳</div>
      <h3 style="font-size:15px;font-weight:700;color:var(--navy-900);margin-bottom:6px">Synthesizing Clinical Intelligence Brief</h3>
      <p style="font-size:12.5px;color:var(--text-secondary)" id="stream-status-overview">Reading and extracting medical tokens from ${files.length} document(s)...</p>
    </div>
  `;

  try {
    const formData = new FormData();
    files.forEach(f => formData.append('reports', f));

    const response = await fetch('/api/upload-and-analyze', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Upload failed');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const PIPE_MAP = {
      'pdf':      'pipe-pdf',
      'ocr':      'pipe-ocr',
      'entities': 'pipe-entities',
      'timeline': 'pipe-timeline',
      'changes':  'pipe-changes',
      'risk':     'pipe-risk',
      'gemini':   'pipe-gemini'
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data:')) continue;

        try {
          const payload = JSON.parse(line.slice(5).trim());

          // Progress Event
          if (line.includes('"step"')) {
            const { step, label: stepLabel, percent, done: stepDone } = payload;
            const pipeId = PIPE_MAP[step];
            if (pipeId) {
              const el = document.getElementById(pipeId);
              if (el) el.className = stepDone ? 'pipe-node done' : 'pipe-node active';
            }
            const statusEl = document.getElementById('stream-status');
            const barEl    = document.getElementById('stream-bar');
            const overviewStatus = document.getElementById('stream-status-overview');
            if (statusEl) statusEl.textContent = stepLabel;
            if (overviewStatus) overviewStatus.textContent = stepLabel;
            if (barEl && percent) barEl.style.width = percent + '%';
          }

          // Result Event
          if (payload.result) {
            const result = payload.result;

            // Mark all nodes complete
            Object.values(PIPE_MAP).forEach(pid => {
              const el = document.getElementById(pid);
              if (el) el.className = 'pipe-node done';
            });

            state.currentPatientId = tempId;
            state.currentResult = result;
            DEMO_RESULTS[tempId] = result;

            if (result.patient) {
              const p = result.patient;
              tempPatient.name       = p.name       || tempPatient.name;
              tempPatient.age        = p.age        || '—';
              tempPatient.gender     = p.gender     || '—';
              tempPatient.bloodGroup = p.bloodGroup || '—';
              tempPatient.avatar     = tempPatient.name.substring(0, 2).toUpperCase();
              tempPatient.allergies  = p.allergies  || [];
              renderPatientHeader(tempPatient);
              renderSidebarQueue();
              renderDashboardWorklist();
            }

            renderAllTabs(result);
            showToast('✅ Pre-consultation brief synthesized successfully');
            setTimeout(() => {
              if (pipeContainer) pipeContainer.classList.add('hidden');
            }, 2500);
          }

          if (payload.message && !payload.result && !payload.step) {
            throw new Error(payload.message);
          }

        } catch (parseErr) {
          if (parseErr.message && !parseErr.message.includes('JSON')) {
            throw parseErr;
          }
        }
      }
    }

  } catch (err) {
    console.error('[processFiles SSE Error]', err);
    document.getElementById('tab-overview').innerHTML = `
      <div style="background:var(--status-critical-bg);border:1px solid var(--status-critical-border);border-radius:var(--radius-lg);padding:24px;text-align:center">
        <h3 style="color:var(--status-critical);font-size:15px;margin-bottom:8px">Ingestion / Extraction Error</h3>
        <p style="font-size:13px;color:var(--text-primary);margin-bottom:12px">${err.message}</p>
        <button class="btn-clinical-secondary" onclick="showDashboardView()">Return to Worklist</button>
      </div>`;
    showToast('❌ ' + err.message, 'error');
  }
}

// ── Patient Record Discharge / Delete ──────────────────────────────────────
function deletePatient(event, id) {
  event.stopPropagation();
  const patient = DEMO_PATIENTS.find(p => p.id === id);
  if (!patient) return;

  const confirmed = confirm(`Discharge patient "${patient.name}" (${patient.mrn || id}) from today's active worklist queue?`);
  if (!confirmed) return;

  executePatientRemoval(id, patient.name);
}

function handlePatientDeleteFromDetail() {
  if (!state.currentPatientId) return;
  const patient = DEMO_PATIENTS.find(p => p.id === state.currentPatientId);
  if (!patient) return;

  const confirmed = confirm(`Discharge patient "${patient.name}" (${patient.mrn || state.currentPatientId}) from active queue?`);
  if (!confirmed) return;

  executePatientRemoval(state.currentPatientId, patient.name);
}

function executePatientRemoval(id, name) {
  const index = DEMO_PATIENTS.findIndex(p => p.id === id);
  if (index !== -1) DEMO_PATIENTS.splice(index, 1);
  if (DEMO_RESULTS[id]) delete DEMO_RESULTS[id];

  if (state.currentPatientId === id) {
    showDashboardView();
  }

  renderSidebarQueue();
  renderDashboardWorklist();
  showToast(`Patient "${name}" discharged from worklist`);
}

// ── Print & Export Utilities ───────────────────────────────────────────────
function printPatientBrief() {
  window.print();
}

function exportWorklistReport() {
  showToast('📄 Clinical worklist triage report exported');
  window.print();
}

// ── Queue Navigation Controls ──────────────────────────────────────────────
function navigatePatientQueue(delta) {
  if (DEMO_PATIENTS.length === 0) return;
  let currIdx = DEMO_PATIENTS.findIndex(p => p.id === state.currentPatientId);
  if (currIdx === -1) currIdx = 0;

  let nextIdx = currIdx + delta;
  if (nextIdx < 0) nextIdx = DEMO_PATIENTS.length - 1;
  if (nextIdx >= DEMO_PATIENTS.length) nextIdx = 0;

  selectPatient(DEMO_PATIENTS[nextIdx].id);
}

function updateQueueNavIndicator() {
  const el = document.getElementById('queue-position-indicator');
  if (!el) return;
  let currIdx = DEMO_PATIENTS.findIndex(p => p.id === state.currentPatientId);
  if (currIdx === -1) currIdx = 0;
  el.textContent = `${currIdx + 1} of ${DEMO_PATIENTS.length}`;
}

// ── Fast Clinical Action Helpers ───────────────────────────────────────────
function copyAiBriefText() {
  const patientId = state.currentPatientId;
  const result = state.currentResult || DEMO_RESULTS[patientId];
  if (!result) return;
  const s = result.summary || {};
  const txt = `CONSULT 360 AI CLINICAL BRIEF\n${s.oneLiner || ''}\n\nClinical Summary:\n${s.clinicalSummary || s.chiefComplaint || ''}`;
  navigator.clipboard.writeText(txt).then(() => {
    showToast('📋 Clinical AI Brief copied to clipboard');
  });
}

function approveAllDirectives() {
  const patientId = state.currentPatientId;
  const result = state.currentResult || DEMO_RESULTS[patientId];
  if (!result?.summary?.actionItems || !patientId) return;

  const chart = getPatientChart(patientId);
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  result.summary.actionItems.forEach((action, idx) => {
    const chk = document.getElementById(`dir-${idx}`);
    if (chk) chk.checked = true;
    if (!chart.directives.some(d => d.text === action)) {
      chart.directives.push({
        text: action,
        time: timeStr,
        clinician: 'Dr. Sarah Chen, MD'
      });
    }
  });

  updateChartCounterBadge();
  showToast('✓ All physician directives approved and logged into chart record');
}

// ── Keyboard Shortcuts Modal Controls ──────────────────────────────────────
function openHotkeysModal() {
  document.getElementById('hotkeys-modal')?.classList.remove('hidden');
}

function closeHotkeysModal() {
  document.getElementById('hotkeys-modal')?.classList.add('hidden');
}

// ── Global Keyboard Shortcuts Listener ─────────────────────────────────────
window.addEventListener('keydown', (e) => {
  // Do not intercept if user is typing inside text inputs
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
    if (e.key === 'Escape') document.activeElement.blur();
    return;
  }

  if (e.key === '1') {
    switchTab('overview', document.querySelector('.clinical-tab-btn[data-tab="overview"]'));
  } else if (e.key === '2') {
    switchTab('timeline', document.querySelector('.clinical-tab-btn[data-tab="timeline"]'));
  } else if (e.key === '3') {
    switchTab('changes', document.querySelector('.clinical-tab-btn[data-tab="changes"]'));
  } else if (e.key === '4') {
    switchTab('risk', document.querySelector('.clinical-tab-btn[data-tab="risk"]'));
  } else if (e.key === '5') {
    switchTab('missing', document.querySelector('.clinical-tab-btn[data-tab="missing"]'));
  } else if (e.key === '[') {
    navigatePatientQueue(-1);
  } else if (e.key === ']') {
    navigatePatientQueue(1);
  } else if (e.key === 'c' || e.key === 'C') {
    openChartRecordsModal();
  } else if (e.key === 'Escape') {
    const modals = document.querySelectorAll('.modal-overlay:not(.hidden)');
    if (modals.length > 0) {
      modals.forEach(m => m.classList.add('hidden'));
    } else {
      showDashboardView();
    }
  } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
    openHotkeysModal();
  } else if (e.key === '/') {
    e.preventDefault();
    document.getElementById('sidebar-search-input')?.focus();
  }
});

function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  const isErr = type === 'error';
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background-color: ${isErr ? 'var(--status-critical-bg)' : 'var(--navy-900)'};
    border: 1px solid ${isErr ? 'var(--status-critical-border)' : 'var(--navy-700)'};
    color: ${isErr ? 'var(--status-critical)' : '#ffffff'};
    padding: 10px 18px; border-radius: var(--radius-md); font-size: 12.5px; font-weight: 600;
    box-shadow: var(--shadow-lg); animation: slideUp 0.2s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}


