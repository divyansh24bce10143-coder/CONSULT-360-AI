/* ============================
   CONSULT360 AI — APPLICATION
   (Node.js Backend Version)
   All AI calls go through /api/* — API key is secure on the server.
   ============================ */

// ── State ──────────────────────────────────────────────────────────────────
const state = {
  serverUrl: '',          // auto-detected: same origin (e.g. http://localhost:3000)
  serverOnline: false,    // set after health check
  currentPatientId: null,
  currentResult: null,
  pipelineInterval: null
};

// ── PDF.js Worker (still used client-side as quick preview check) ───────────
if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderPatientList();
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
      txt.textContent = 'Server + Gemini ✓';
    } else {
      dot.className = 'status-dot disconnected';
      txt.textContent = 'Server OK — Key Missing';
      showToast('⚠️ Add GEMINI_API_KEY to server/.env', 'error');
    }
  } catch (e) {
    state.serverOnline = false;
    dot.className = 'status-dot disconnected';
    txt.textContent = 'Server Offline';
  }
}

// Keep legacy stubs so index.html onclick="" attributes don't break
function showApiModal() {}
function closeApiModal() {}
function saveApiKey() {}



// ── Patient List ───────────────────────────────────────────────────────────
function renderPatientList() {
  const list = document.getElementById('patient-list');
  list.innerHTML = DEMO_PATIENTS.map(p => `
    <div class="patient-item" id="pi-${p.id}" onclick="selectPatient('${p.id}')">
      <div class="patient-item-row1">
        <div class="patient-item-avatar">${p.avatar}</div>
        <div class="patient-item-info">
          <div class="patient-item-name">${p.name}</div>
          <div class="patient-item-time">⏰ ${p.appointmentTime}</div>
        </div>
        <button class="patient-delete-btn" onclick="deletePatient(event, '${p.id}')" title="Delete patient record">✕</button>
      </div>
      <div class="patient-item-row2">
        <div class="patient-item-cond">${p.condition}</div>
        <span class="risk-badge risk-${p.riskLevel}">${p.riskLevel}</span>
      </div>
    </div>
  `).join('');
}

// ── Delete Patient ──────────────────────────────────────────────────────────
function deletePatient(event, id) {
  event.stopPropagation(); // don't trigger selectPatient

  const patient = DEMO_PATIENTS.find(p => p.id === id);
  if (!patient) return;

  // Confirmation
  const confirmed = confirm(`Delete "${patient.name}" from the queue?\n\nThis will remove their record and AI brief.`);
  if (!confirmed) return;

  // Animate the card sliding out first
  const cardEl = document.getElementById(`pi-${id}`);
  if (cardEl) {
    cardEl.classList.add('deleting');
    setTimeout(() => finishDelete(id, patient.name), 280);
  } else {
    finishDelete(id, patient.name);
  }
}

function finishDelete(id, name) {
  // Remove from patients list
  const index = DEMO_PATIENTS.findIndex(p => p.id === id);
  if (index !== -1) DEMO_PATIENTS.splice(index, 1);

  // Remove cached AI result
  if (DEMO_RESULTS && DEMO_RESULTS[id]) delete DEMO_RESULTS[id];

  // If deleted patient was currently being viewed → go back to welcome screen
  if (state.currentPatientId === id) {
    state.currentPatientId = null;
    state.currentResult = null;
    document.getElementById('patient-view').classList.add('hidden');
    document.getElementById('welcome-screen').classList.remove('hidden');
  }

  renderPatientList();
  showToast(`🗑 "${name}" removed from queue`);
}



// ── Select Patient ─────────────────────────────────────────────────────────
async function selectPatient(id) {
  // Highlight in sidebar
  document.querySelectorAll('.patient-item').forEach(el => el.classList.remove('active'));
  document.getElementById(`pi-${id}`)?.classList.add('active');

  state.currentPatientId = id;
  const patient = DEMO_PATIENTS.find(p => p.id === id);
  if (!patient) return;

  // Show patient view
  document.getElementById('welcome-screen').classList.add('hidden');
  document.getElementById('patient-view').classList.remove('hidden');

  // Render header
  renderPatientHeader(patient);

  // Reset tabs
  switchTab('overview', document.querySelector('.tab-btn[data-tab="overview"]'));

  // Animate pipeline then render pre-loaded results
  resetPipeline();
  const result = DEMO_RESULTS[id];
  if (result) {
    state.currentResult = result;
    await animatePipelineDemo();
    renderAllTabs(result);
  }
}

function renderPatientHeader(patient) {
  document.getElementById('hdr-avatar').textContent = patient.avatar;
  document.getElementById('hdr-name').textContent = patient.name;
  document.getElementById('hdr-risk').className = `risk-badge risk-${patient.riskLevel}`;
  document.getElementById('hdr-risk').textContent = patient.riskLevel;
  document.getElementById('hdr-meta').textContent =
    `${patient.age}y · ${patient.gender} · ${patient.bloodGroup} · 🕐 ${patient.appointmentTime} · ${patient.condition}`;
}

// ── Pipeline Animation ─────────────────────────────────────────────────────
const PIPE_STEPS = ['pipe-pdf','pipe-ocr','pipe-entities','pipe-timeline','pipe-changes','pipe-risk','pipe-gemini'];
const PIPE_DELAYS = [400, 600, 700, 700, 700, 700, 900];

function resetPipeline() {
  clearInterval(state.pipelineInterval);
  PIPE_STEPS.forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.className = 'pipe-step'; }
  });
}

async function animatePipelineDemo() {
  return new Promise(resolve => {
    let i = 0;
    function nextStep() {
      if (i > 0) {
        document.getElementById(PIPE_STEPS[i-1])?.classList.replace('active', 'done');
      }
      if (i < PIPE_STEPS.length) {
        document.getElementById(PIPE_STEPS[i])?.classList.add('active');
        i++;
        setTimeout(nextStep, PIPE_DELAYS[i-1] || 500);
      } else {
        document.getElementById(PIPE_STEPS[PIPE_STEPS.length-1])?.classList.replace('active', 'done');
        resolve();
      }
    }
    nextStep();
  });
}

async function animatePipelineLive(onStep) {
  return new Promise(async resolve => {
    for (let i = 0; i < PIPE_STEPS.length; i++) {
      if (i > 0) document.getElementById(PIPE_STEPS[i-1])?.classList.replace('active', 'done');
      document.getElementById(PIPE_STEPS[i])?.classList.add('active');
      await onStep(i);
      await sleep(300);
    }
    document.getElementById(PIPE_STEPS[PIPE_STEPS.length-1])?.classList.replace('active', 'done');
    resolve();
  });
}

// ── Tab Switching ──────────────────────────────────────────────────────────
function switchTab(name, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
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

  // Update risk tab count badge
  const riskCount = (result.riskFlags || []).length;
  const riskTab = document.querySelector('.tab-btn[data-tab="risk"]');
  if (riskTab && riskCount) {
    riskTab.innerHTML = `<span>🚨</span> Risk & AI Explain <span class="tab-count">${riskCount}</span>`;
  }
  const missingCount = (result.missingInvestigations || []).length;
  const missingTab = document.querySelector('.tab-btn[data-tab="missing"]');
  if (missingTab && missingCount) {
    missingTab.innerHTML = `<span>🔬</span> Missing Tests <span class="tab-count">${missingCount}</span>`;
  }
}

// ── Overview Tab ───────────────────────────────────────────────────────────
function renderOverview(r) {
  const s = r.summary || {};
  const e = r.entities || {};

  const labsHtml = (e.labResults || []).map(l => `
    <div class="lab-row">
      <div>
        <div class="lab-name">${l.test}</div>
        <div class="lab-ref">Ref: ${l.reference} · ${l.date}</div>
      </div>
      <div style="text-align:right">
        <div class="lab-value" style="color:${labColor(l.status)}">${l.value} ${l.unit}</div>
        <span class="lab-status" style="background:${labBg(l.status)};color:${labColor(l.status)}">${l.status.toUpperCase()}</span>
      </div>
    </div>
  `).join('');

  const vitalsHtml = (e.vitals || []).map(v => `
    <div class="vital-card" style="border-color:${labColor(v.status)}33">
      <div class="vital-value" style="color:${labColor(v.status)}">${v.value}</div>
      <div class="vital-unit">${v.unit}</div>
      <div class="vital-label">${v.type}</div>
      <div class="vital-date">${v.date}</div>
    </div>
  `).join('');

  const diagHtml = (e.diagnoses || []).map(d => `
    <span class="tag ${d.status === 'active' ? 'danger' : d.status === 'suspected' ? 'warning' : ''}">${d.name}${d.status === 'historical' ? ' (Hx)' : d.status === 'suspected' ? ' (?)' : ''}</span>
  `).join('');

  const medsHtml = (e.medications || []).map(m => `
    <span class="tag ${m.change === 'new' ? 'med-new' : m.change === 'dose-changed' ? 'warning' : ''}">${m.name} ${m.dose}${m.change === 'new' ? ' 🆕' : m.change === 'dose-changed' ? ' ↑' : ''}</span>
  `).join('');

  const allergyHtml = (r.patient?.allergies || []).map(a =>
    `<span class="tag danger">⚠ ${a}</span>`
  ).join('');

  const actionsHtml = (s.actionItems || []).map((a, i) => `
    <div class="action-item">
      <div class="action-num">${i+1}</div>
      <div class="action-text">${a}</div>
    </div>
  `).join('');

  const symptomsHtml = (e.symptoms || []).map(sym => `
    <span class="tag">${sym.description}</span>
  `).join('');

  document.getElementById('tab-overview').innerHTML = `
    <div class="overview-grid">
      <div class="tldr-banner">
        <div class="tldr-icon">✨</div>
        <div>
          <div class="tldr-label">AI TL;DR — Pre-Consultation Brief</div>
          <div class="tldr-text">${s.oneLiner || '—'}</div>
        </div>
      </div>

      <div class="two-col">
        <div class="card">
          <div class="card-title">🩺 Chief Complaint</div>
          <p style="font-size:13px;line-height:1.6;color:var(--text-2)">${s.chiefComplaint || '—'}</p>
        </div>
        <div class="card">
          <div class="card-title">⚠ Allergies</div>
          <div class="tag-list">${allergyHtml || '<span class="tag">None documented</span>'}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">🔬 Diagnoses</div>
        <div class="tag-list">${diagHtml || '<span class="tag">None extracted</span>'}</div>
      </div>

      <div class="card">
        <div class="card-title">💊 Current Medications</div>
        <div class="tag-list">${medsHtml || '<span class="tag">None documented</span>'}</div>
        <p style="font-size:11px;color:var(--text-3);margin-top:10px">🆕 = New this visit &nbsp;·&nbsp; ↑ = Dose changed</p>
      </div>

      <div class="two-col">
        <div class="card">
          <div class="card-title">📊 Vitals</div>
          <div class="vital-grid">${vitalsHtml || '<p style="color:var(--text-3)">No vitals recorded</p>'}</div>
        </div>
        <div class="card">
          <div class="card-title">😷 Symptoms</div>
          <div class="tag-list">${symptomsHtml || '<span class="tag">None reported</span>'}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">🧪 Lab Results</div>
        ${labsHtml || '<p style="color:var(--text-3)">No lab results extracted</p>'}
      </div>

      <div class="card">
        <div class="card-title">✅ Doctor Action Items</div>
        ${actionsHtml || '<p style="color:var(--text-3)">No action items generated</p>'}
      </div>

      <div class="card" style="background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.05));border-color:rgba(99,102,241,0.2)">
        <div class="card-title">🤖 Clinical Summary</div>
        <p style="font-size:13px;line-height:1.8;color:var(--text-2)">${s.clinicalSummary || '—'}</p>
      </div>
    </div>
  `;
}

function labColor(status) {
  return { critical:'#f87171', abnormal:'#ef4444', borderline:'#f59e0b', normal:'#10b981' }[status] || 'var(--text-2)';
}
function labBg(status) {
  return { critical:'rgba(220,38,38,0.12)', abnormal:'rgba(239,68,68,0.1)', borderline:'rgba(245,158,11,0.1)', normal:'rgba(16,185,129,0.1)' }[status] || 'transparent';
}

// ── Timeline Tab ───────────────────────────────────────────────────────────
function renderTimeline(events, filter = 'all') {
  const filtered = filter === 'all' ? events : events.filter(e => e.type === filter);

  const filterBtns = ['all','visit','lab','medication','symptom','procedure'].map(f =>
    `<button class="filter-btn ${filter === f ? 'active' : ''}" onclick="renderTimeline(state.currentResult.timeline,'${f}')">${
      {all:'All Events',visit:'🏥 Visits',lab:'🧪 Labs',medication:'💊 Meds',symptom:'😷 Symptoms',procedure:'🔧 Procedures'}[f]
    }</button>`
  ).join('');

  const items = filtered.map((ev, i) => `
    <div class="timeline-item" style="animation-delay:${i * 0.05}s">
      <div class="timeline-dot ${ev.type} ${ev.significance === 'critical' ? 'critical-dot' : ''}">●</div>
      <div class="timeline-date">${ev.date}</div>
      <div class="timeline-event">
        ${ev.event}
        ${ev.significance !== 'normal' ? `<span class="timeline-sig-badge sig-${ev.significance}">${ev.significance}</span>` : ''}
      </div>
      <div class="timeline-detail">${ev.detail}</div>
    </div>
  `).join('');

  document.getElementById('tab-timeline').innerHTML = `
    <div class="timeline-filters">${filterBtns}</div>
    <div class="timeline">
      ${items || '<p style="color:var(--text-3)">No events to display.</p>'}
    </div>
  `;
}

// ── Clinical Changes Tab ────────────────────────────────────────────────────
function renderChanges(changes) {
  const html = changes.map(c => {
    const arrow = c.direction === 'worsening' ? '↑' : c.direction === 'improving' ? '↓' : '→';
    const arrowClass = c.direction === 'worsening' ? 'up' : c.direction === 'improving' ? 'down' : '';
    const dirClass = c.direction === 'worsening' ? 'dir-worsening' : c.direction === 'improving' ? 'dir-improving' : 'dir-stable';
    const cardClass = c.direction === 'worsening' ? 'worsening' : c.direction === 'improving' ? 'improving' : 'stable';

    // Build flow: previous → mid (optional) → current
    let flow = `
      <div class="change-val">
        <div class="val">${c.previous.value}</div>
        <div class="vdate">${c.previous.date}</div>
      </div>`;
    if (c.mid) {
      flow += `
      <div class="change-arrow">→</div>
      <div class="change-val" style="opacity:0.7">
        <div class="val" style="font-size:14px">${c.mid.value}</div>
        <div class="vdate">${c.mid.date}</div>
      </div>`;
    }
    flow += `
      <div class="change-arrow ${arrowClass}">${arrow}</div>
      <div class="change-val" style="border-color:${c.direction === 'worsening' ? 'var(--danger-border)' : c.direction === 'improving' ? 'var(--success-border)' : 'var(--border)'}">
        <div class="val" style="color:${c.direction === 'worsening' ? 'var(--danger)' : c.direction === 'improving' ? 'var(--success)' : 'var(--text-2)'}">${c.current.value}</div>
        <div class="vdate">${c.current.date}</div>
      </div>`;

    return `
    <div class="change-card ${cardClass}">
      <div class="change-left">
        <div class="change-param">${c.parameter}</div>
        <div class="change-flow">${flow}</div>
      </div>
      <div class="change-right">
        <div class="change-dir ${dirClass}">${c.direction.toUpperCase()}</div>
        <div class="change-magnitude">${c.magnitude}</div>
        <div class="change-sig">Significance: ${c.clinicalSignificance}</div>
      </div>
    </div>`;
  }).join('');

  document.getElementById('tab-changes').innerHTML = `
    <div style="margin-bottom:20px">
      <h3 style="font-size:16px;font-weight:700;margin-bottom:4px">Clinical Change Detection</h3>
      <p style="font-size:13px;color:var(--text-2)">AI-detected changes across all recorded visits</p>
    </div>
    <div class="changes-grid">${html || '<p style="color:var(--text-3)">No clinical changes detected.</p>'}</div>
  `;
}

// ── Risk / Explainable AI Tab ──────────────────────────────────────────────
function renderRisk(flags) {
  const sevIcon = { critical:'🔴', high:'🟠', medium:'🟡', low:'🟢' };

  const cards = flags.map(f => `
    <div class="risk-card ${f.severity}">
      <div class="risk-card-header">
        <span class="risk-sev-badge">${f.severity}</span>
        <span style="font-size:18px">${sevIcon[f.severity] || '⚠'}</span>
        <div class="risk-title">${f.risk}</div>
      </div>
      <div class="risk-card-body">
        <div class="risk-explain-row">
          <div class="risk-explain-label">Reason</div>
          <div class="risk-explain-val">${f.reason}</div>
        </div>
        <div class="risk-explain-row">
          <div class="risk-explain-label">Evidence</div>
          <div class="risk-explain-val" style="font-family:monospace;font-size:12px;color:var(--text-2)">${f.evidence}</div>
        </div>
        <div class="risk-explain-row">
          <div class="risk-explain-label">Source</div>
          <div class="risk-explain-val">
            <span class="risk-source-pill">📄 ${f.sourceDocument}</span>
            &nbsp;<span style="color:var(--text-3);font-size:12px">· ${f.date}</span>
          </div>
        </div>
        <div class="risk-explain-row">
          <div class="risk-explain-label">Action</div>
          <div class="risk-explain-val risk-action">${f.recommendation}</div>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('tab-risk').innerHTML = `
    <div class="risk-section-header">
      <h3>Explainable AI — Risk Intelligence</h3>
      <p>Each risk flag includes AI reasoning, evidence trail, source document, and recommended action.</p>
    </div>
    <div class="risk-cards">${cards || '<p style="color:var(--text-3)">No risk flags detected.</p>'}</div>
  `;
}

// ── Missing Investigations Tab ─────────────────────────────────────────────
function renderMissing(missing) {
  const icons = { critical:'🚨', high:'⚠️', medium:'🔔', low:'ℹ️' };

  const cards = missing.map(m => `
    <div class="missing-card ${m.urgency}">
      <div class="missing-icon">${icons[m.urgency] || '🔬'}</div>
      <div>
        <div class="missing-test">${m.test}</div>
        <div class="missing-reason">${m.reason}</div>
        <div class="missing-based">Based on: <strong>${m.basedOnCondition}</strong></div>
      </div>
      <div class="missing-right">
        <span class="urgency-badge urg-${m.urgency}">${m.urgency} priority</span>
        <div class="last-done">${m.lastDone ? `Last done: ${m.lastDone}` : 'Never recorded'}</div>
      </div>
    </div>
  `).join('');

  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  missing.forEach(m => counts[m.urgency] = (counts[m.urgency] || 0) + 1);

  document.getElementById('tab-missing').innerHTML = `
    <div class="missing-header-bar">
      <div>
        <h3>Missing Investigation Detection</h3>
        <div class="missing-summary" style="margin-top:4px">
          ${counts.critical ? `<span style="color:#f87171">${counts.critical} Critical</span> · ` : ''}
          ${counts.high ? `<span style="color:var(--danger)">${counts.high} High</span> · ` : ''}
          ${counts.medium ? `<span style="color:var(--warning)">${counts.medium} Medium</span>` : ''}
        </div>
      </div>
    </div>
    <div class="missing-cards">${cards || '<p style="color:var(--text-3)">No missing investigations detected.</p>'}</div>
  `;
}

// ── Upload Modal ───────────────────────────────────────────────────────────
function showUploadModal() {
  document.getElementById('upload-modal').classList.remove('hidden');
  clearAllFiles(); // reset state each time modal opens
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

// ── Multi-file state ────────────────────────────────────────────────────────
let selectedFiles = []; // array of File objects

function setupUploadArea() {
  const area  = document.getElementById('upload-area');
  const input = document.getElementById('file-input');

  // Drag & drop
  area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('drag-over'); });
  area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
  area.addEventListener('drop', (e) => {
    e.preventDefault();
    area.classList.remove('drag-over');
    addFiles([...e.dataTransfer.files]);
  });

  // File input (multiple)
  input.addEventListener('change', (e) => {
    addFiles([...e.target.files]);
    input.value = ''; // reset so same file can be re-added
  });
}

// ── File type icon helper ────────────────────────────────────────────────────
function getFileIcon(file) {
  if (file.type === 'application/pdf') return '📄';
  if (file.type === 'text/plain')      return '📝';
  const name = file.name.toLowerCase();
  if (/ecg|ekg/.test(name))           return '🫀';
  if (/echo/.test(name))              return '🫀';
  if (/xray|x-ray|chest/.test(name)) return '🫁';
  if (/rx|prescription/.test(name))  return '💊';
  if (/lab|blood|report/.test(name)) return '🧪';
  if (file.type.startsWith('image/')) return '🖼';
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
  return 'FILE';
}

// ── Add files to list ────────────────────────────────────────────────────────
function addFiles(newFiles) {
  const allowed = ['application/pdf','text/plain','image/jpeg','image/jpg','image/png','image/webp'];
  newFiles.forEach(f => {
    if (!allowed.includes(f.type)) {
      showToast(`⚠️ ${f.name} — type not supported`, 'error'); return;
    }
    if (f.size > 20 * 1024 * 1024) {
      showToast(`⚠️ ${f.name} — exceeds 20MB`, 'error'); return;
    }
    if (selectedFiles.length >= 10) {
      showToast('⚠️ Max 10 files per analysis', 'error'); return;
    }
    selectedFiles.push(f);
  });
  renderFileList();
}

function removeFile(index) {
  selectedFiles.splice(index, 1);
  renderFileList();
}

function clearAllFiles() {
  selectedFiles = [];
  renderFileList();
}

function renderFileList() {
  const container = document.getElementById('file-list-container');
  const listEl    = document.getElementById('file-list');
  const countEl   = document.getElementById('file-list-count');

  if (selectedFiles.length === 0) {
    container?.classList.add('hidden');
    document.getElementById('upload-area')?.classList.remove('hidden');
    return;
  }

  document.getElementById('upload-area').classList.add('hidden');
  container.classList.remove('hidden');
  countEl.textContent = `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`;

  listEl.innerHTML = selectedFiles.map((f, i) => `
    <div class="file-list-item">
      <span class="file-list-icon">${getFileIcon(f)}</span>
      <span class="file-list-name">${f.name}</span>
      <span class="file-type-badge">${getFileTypeBadge(f)}</span>
      <span class="file-list-size">${(f.size/1024).toFixed(0)}KB</span>
      <button class="file-remove-btn" onclick="removeFile(${i})">✕</button>
    </div>
  `).join('');

  // Update analyze button text
  const btn = document.getElementById('btn-analyze');
  if (btn) btn.textContent = `🚀  Analyze ${selectedFiles.length} Report${selectedFiles.length > 1 ? 's' : ''}`;
}

// ── Start analysis with all selected files ───────────────────────────────────
async function startAnalysis() {
  if (selectedFiles.length === 0) return;
  await processFiles(selectedFiles);
}



// ── Process multiple files via SSE ─────────────────────────────────────────
async function processFiles(files) {
  if (!state.serverOnline) {
    closeUploadModal();
    showToast('❌ Server is offline. Run: cd server && npm start', 'error');
    return;
  }

  const firstName = files[0].name.replace(/\.(pdf|txt|jpg|jpeg|png|webp)$/i, '');
  const label = files.length > 1 ? `${firstName} + ${files.length - 1} more` : firstName;

  // ── Create temp patient immediately so UI shows up ──────────────────────
  const tempId = 'UPLOAD_' + Date.now();
  const tempPatient = {
    id: tempId,
    name: label,
    age: '—', gender: '—', bloodGroup: '—',
    appointmentTime: 'Just now',
    condition: `${files.length} report${files.length > 1 ? 's' : ''} uploaded`,
    riskLevel: 'medium', avatar: files.length > 1 ? '📎' : '📄', reportText: ''
  };

  closeUploadModal();
  DEMO_PATIENTS.unshift(tempPatient);
  renderPatientList();

  // Show patient view with pipeline immediately
  document.getElementById('welcome-screen').classList.add('hidden');
  document.getElementById('patient-view').classList.remove('hidden');
  renderPatientHeader(tempPatient);
  switchTab('overview', document.querySelector('.tab-btn[data-tab="overview"]'));
  resetPipeline();

  document.getElementById('tab-overview').innerHTML = `
    <div class="loading-box">
      <div class="spinner"></div>
      <p id="stream-status">📎 Uploading ${files.length} file${files.length > 1 ? 's' : ''} to server...</p>
      <div id="stream-progress" style="margin-top:12px;height:4px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden">
        <div id="stream-bar" style="height:100%;width:0%;background:linear-gradient(90deg,var(--accent),var(--purple));transition:width 0.4s ease;border-radius:4px"></div>
      </div>
    </div>`;

  try {
    // ── Build FormData with ALL files ───────────────────────────────────────
    const formData = new FormData();
    files.forEach(f => formData.append('reports', f)); // 'reports' matches multer array field

    const response = await fetch('/api/upload-and-analyze', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Upload failed');
    }


    // ── Read the SSE stream ─────────────────────────────────────────────────
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
      buffer = lines.pop(); // keep incomplete line

      for (const line of lines) {
        if (line.startsWith('event:')) continue;
        if (!line.startsWith('data:')) continue;

        try {
          const payload = JSON.parse(line.slice(5).trim());

          // ── Progress event: update pipeline step + status text ───────────
          if (line.includes('"step"')) {
            const { step, label, percent, done: stepDone } = payload;
            const pipeId = PIPE_MAP[step];
            if (pipeId) {
              const el = document.getElementById(pipeId);
              if (el) el.className = stepDone ? 'pipe-step done' : 'pipe-step active';
            }
            const statusEl = document.getElementById('stream-status');
            const barEl    = document.getElementById('stream-bar');
            if (statusEl) statusEl.textContent = label;
            if (barEl && percent) barEl.style.width = percent + '%';
          }

          // ── Result event: render everything ─────────────────────────────
          if (payload.result) {
            const result = payload.result;

            // Mark all pipeline steps done
            PIPE_STEPS.forEach(sid => {
              const el = document.getElementById(sid);
              if (el) el.className = 'pipe-step done';
            });

            state.currentPatientId = tempId;
            state.currentResult = result;
            DEMO_RESULTS[tempId] = result;

            // Update patient header with extracted info
            if (result.patient) {
              const p = result.patient;
              tempPatient.name       = p.name       || tempPatient.name;
              tempPatient.age        = p.age        || '—';
              tempPatient.gender     = p.gender     || '—';
              tempPatient.bloodGroup = p.bloodGroup || '—';
              renderPatientHeader(tempPatient);
              renderPatientList();
            }

            renderAllTabs(result);
            showToast('✅ AI Analysis complete!');
          }

          // ── Error event ──────────────────────────────────────────────────
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
    console.error('[processFile SSE]', err);
    document.getElementById('tab-overview').innerHTML = `
      <div class="loading-box">
        <p style="color:var(--danger)">❌ ${err.message}</p>
        <p style="color:var(--text-3);margin-top:8px">
          Make sure the server is running: <code style="background:rgba(255,255,255,0.06);padding:2px 8px;border-radius:4px">cd server &amp;&amp; npm start</code>
        </p>
      </div>`;
    showToast('❌ ' + err.message, 'error');
  }
}


// ── PDF Text Extraction ────────────────────────────────────────────────────
async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map(item => item.str).join(' ') + '\n';
  }
  return fullText;
}

// ── Tesseract OCR Fallback (for scanned/image PDFs) ───────────────────────
async function runTesseractOCR(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let allText = '';

  // Process up to first 3 pages (speed vs coverage tradeoff for hackathon)
  const pagesToProcess = Math.min(pdf.numPages, 3);

  for (let i = 1; i <= pagesToProcess; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // 2x scale = better OCR accuracy
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;

    // Run Tesseract on this page image
    const { data: { text } } = await Tesseract.recognize(canvas, 'eng', {
      logger: m => console.log(`OCR Page ${i}:`, m.status, Math.round((m.progress || 0) * 100) + '%')
    });
    allText += text + '\n';
  }

  return allText;
}

// ── Server-side AI Analysis ────────────────────────────────────────────────
// Replaces the old direct Gemini call. API key stays on the server.
async function analyzeWithServer(id, patient, reportText) {
  // Show patient view
  document.getElementById('welcome-screen').classList.add('hidden');
  document.getElementById('patient-view').classList.remove('hidden');
  renderPatientHeader(patient);
  switchTab('overview', document.querySelector('.tab-btn[data-tab="overview"]'));

  // Loading state
  document.getElementById('tab-overview').innerHTML = `
    <div class="loading-box">
      <div class="spinner"></div>
      <p>Running AI Pipeline — Extracting entities, building timeline, detecting risks...</p>
      <p style="font-size:12px;color:var(--text-3);margin-top:8px">Powered by Gemini 2.0 Flash on the Node.js server</p>
    </div>`;

  resetPipeline();

  try {
    // Start pipeline animation concurrently with the server call
    animatePipelineLive(async () => {});
    await sleep(800);

    // ── Call /api/analyze on the Node.js server ────────────────────────────
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: reportText })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Server error ${res.status}`);
    }

    const result = data.result;

    // Finish pipeline
    PIPE_STEPS.forEach(sid => {
      const el = document.getElementById(sid);
      if (el) el.className = 'pipe-step done';
    });

    state.currentPatientId = id;
    state.currentResult = result;
    DEMO_RESULTS[id] = result;

    // Update patient header with AI-extracted patient info
    if (result.patient) {
      const p = result.patient;
      patient.name      = p.name      || patient.name;
      patient.age       = p.age       || '—';
      patient.gender    = p.gender    || '—';
      patient.bloodGroup = p.bloodGroup || '—';
      renderPatientHeader(patient);
    }

    renderAllTabs(result);
    showToast('✅ AI Analysis complete!');

  } catch (err) {
    console.error('[analyzeWithServer]', err);
    document.getElementById('tab-overview').innerHTML = `
      <div class="loading-box">
        <p style="color:var(--danger)">❌ ${err.message}</p>
        <p style="color:var(--text-3);margin-top:8px">
          Make sure the server is running: <code style="background:rgba(255,255,255,0.06);padding:2px 8px;border-radius:4px">cd server &amp;&amp; npm start</code>
        </p>
      </div>`;
    showToast('❌ Analysis failed', 'error');
  }
}


// ── Utilities ──────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    background:${type === 'error' ? 'var(--danger-bg)' : 'rgba(16,185,129,0.15)'};
    border:1px solid ${type === 'error' ? 'var(--danger-border)' : 'var(--success-border)'};
    color:${type === 'error' ? 'var(--danger)' : 'var(--success)'};
    padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;
    backdrop-filter:blur(8px);animation:slideUp 0.3s ease;
    box-shadow:0 4px 20px rgba(0,0,0,0.4);
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}
