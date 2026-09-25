(() => {
  const demo = window.PIOS_DEMO;
  const FINDINGS = (demo?.findings || []).map((item) => ({ ...item }));
  const GAPS = (demo?.questions || []).map((q) => ({
    id: q.id,
    q: q.text,
    meta: `${q.priority} · ${q.id} · ${q.riskId || q.requirementId}`,
  }));
  const DEPS = demo?.dependencies || [];

  const PIPELINE = [
    "Reading document",
    "Extracting requirements",
    "Understanding business rules",
    "Discovering dependencies",
    "Identifying risks",
    "Generating clarification questions",
    "Preparing validation readiness signal",
    "Linking evidence placeholders",
    "Opening human review",
  ];

  const state = {
    files: [],
    mode: "upload",
    analyzing: false,
    screen: "input",
    currentFinding: 0,
    findings: FINDINGS.map((item) => ({
      ...item,
      status: "pending",
      originalText: item.text,
      commentNotes: [],
    })),
    filter: "all",
    panelMode: "view",
    depView: "graph",
    depFilter: "All",
    traceFlow: "forward",
    ackEvidence: false,
    ackTrace: false,
    lastEstimates: null,
  };

  const els = {
    screenInput: document.getElementById("screenInput"),
    screenAnalyze: document.getElementById("screenAnalyze"),
    screenReview: document.getElementById("screenReview"),
    projectName: document.getElementById("projectName"),
    railProjectName: document.getElementById("railProjectName"),
    railLive: document.getElementById("railLive"),
    railStatus: document.getElementById("railStatus"),
    statusLine: document.getElementById("statusLine"),
    dropzone: document.getElementById("dropzone"),
    fileInput: document.getElementById("fileInput"),
    browseBtn: document.getElementById("browseBtn"),
    fileList: document.getElementById("fileList"),
    uploadPanel: document.getElementById("uploadPanel"),
    pastePanel: document.getElementById("pastePanel"),
    requirementText: document.getElementById("requirementText"),
    analyzeBtn: document.getElementById("analyzeBtn"),
    lifecycleHint: document.getElementById("lifecycleHint"),
    lifeLinks: [...document.querySelectorAll(".life-link")],
    tabs: [...document.querySelectorAll(".tab")],
    analyzeStageLabel: document.getElementById("analyzeStageLabel"),
    analyzePercent: document.getElementById("analyzePercent"),
    analyzeEta: document.getElementById("analyzeEta"),
    sourceBar: document.getElementById("sourceBar"),
    radarStatus: document.getElementById("radarStatus"),
    pipelineList: document.getElementById("pipelineList"),
    reviewKpis: document.getElementById("reviewKpis"),
    reviewMeta: document.getElementById("reviewMeta"),
    queueSummary: document.getElementById("queueSummary"),
    findingsAccordion: document.getElementById("findingsAccordion"),
    findingFilters: document.getElementById("findingFilters"),
    gapList: document.getElementById("gapList"),
    depPath: document.getElementById("depPath"),
    depNote: document.getElementById("depNote"),
    focusReviewBtn: document.getElementById("focusReviewBtn"),
    analyzeAnotherBtn: document.getElementById("analyzeAnotherBtn"),
    progHuman: document.getElementById("progHuman"),
    progHumanBar: document.getElementById("progHumanBar"),
    progHumanDetail: document.getElementById("progHumanDetail"),
    progRepo: document.getElementById("progRepo"),
    progRepoBar: document.getElementById("progRepoBar"),
    progRepoDetail: document.getElementById("progRepoDetail"),
    milestoneTrack: document.getElementById("milestoneTrack"),
    statusBoard: document.getElementById("statusBoard"),
    ackStack: document.getElementById("ackStack"),
    gatesPanel: document.getElementById("gatesPanel"),
    pillarPanel: document.getElementById("pillarPanel"),
    repoFooter: document.getElementById("repoFooter"),
    repoSummary: document.getElementById("repoSummary"),
    repoLockBtn: document.getElementById("repoLockBtn"),
    reviewCompleteBtn: document.getElementById("reviewCompleteBtn"),
    evidenceBody: document.getElementById("evidenceBody"),
    depsBody: document.getElementById("depsBody"),
    traceBody: document.getElementById("traceBody"),
    statusModalBody: document.getElementById("statusModalBody"),
    counts: {
      files: document.getElementById("countFiles"),
      pages: document.getElementById("countPages"),
      requirements: document.getElementById("countRequirements"),
      rules: document.getElementById("countRules"),
      dependencies: document.getElementById("countDependencies"),
      risks: document.getElementById("countRisks"),
      questions: document.getElementById("countQuestions"),
      readiness: document.getElementById("countReadiness"),
      release: document.getElementById("countRelease"),
    },
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function hasInput() {
    if (state.mode === "upload") return state.files.length > 0;
    return els.requirementText.value.trim().length > 20;
  }

  function showScreen(name) {
    state.screen = name;
    els.screenInput.hidden = name !== "input";
    els.screenAnalyze.hidden = name !== "analyze";
    els.screenReview.hidden = name !== "review";
  }

  function setStatus(text, live = "Waiting") {
    els.statusLine.textContent = text;
    els.railStatus.textContent = text;
    els.railLive.textContent = live;
  }

  function pulse(el) {
    const card = el.closest(".kpi");
    if (!card) return;
    card.classList.remove("pulse");
    void card.offsetWidth;
    card.classList.add("pulse");
  }

  function setCount(key, value) {
    const el = els.counts[key];
    if (!el) return;
    el.textContent = value;
    pulse(el);
  }

  function updateAnalyzeEnabled() {
    els.analyzeBtn.disabled = state.analyzing || !hasInput();
    if (!hasInput()) {
      setStatus("Waiting for requirement", "Waiting");
      return;
    }
    setStatus(
      state.mode === "upload"
        ? `${state.files.length} file(s) ready · Analyze to unlock intelligence`
        : "Requirement ready · Analyze to unlock intelligence",
      "Ready"
    );
  }

  function resetDerivedCounts() {
    ["pages", "requirements", "rules", "dependencies", "risks", "questions", "readiness", "release"].forEach(
      (key) => setCount(key, "—")
    );
    els.lifeLinks.forEach((link, index) => {
      link.classList.toggle("active", index === 0);
      link.classList.remove("done");
      link.disabled = index !== 0;
      link.querySelector(".life-mark").textContent = String(index + 1).padStart(2, "0");
    });
  }

  function unlockStage(index) {
    els.lifeLinks.forEach((link, i) => {
      const mark = link.querySelector(".life-mark");
      if (i < index) {
        link.classList.add("done");
        link.classList.remove("active");
        link.disabled = false;
        mark.textContent = "✓";
      } else if (i === index) {
        link.classList.add("active");
        link.classList.remove("done");
        link.disabled = false;
        mark.textContent = String(i + 1).padStart(2, "0");
      } else {
        link.classList.remove("active", "done");
        link.disabled = true;
        mark.textContent = String(i + 1).padStart(2, "0");
      }
    });
  }

  function renderFiles() {
    setCount("files", String(state.files.length));
    if (!state.files.length) {
      els.fileList.hidden = true;
      els.fileList.innerHTML = "";
      els.dropzone.classList.remove("has-files");
      updateAnalyzeEnabled();
      return;
    }
    els.dropzone.classList.add("has-files");
    els.fileList.hidden = false;
    els.fileList.innerHTML = state.files
      .map(
        (file, index) => `
        <div class="file-chip">
          <strong title="${file.name}">${file.name}</strong>
          <span>${formatBytes(file.size)}</span>
          <button type="button" data-remove="${index}" aria-label="Remove">×</button>
        </div>`
      )
      .join("");
    updateAnalyzeEnabled();
  }

  function addFiles(fileList) {
    for (const file of [...fileList]) {
      const exists = state.files.some((f) => f.name === file.name && f.size === file.size);
      if (!exists) state.files.push(file);
    }
    resetDerivedCounts();
    renderFiles();
  }

  function estimates() {
    const s = demo?.summary || {};
    if (state.mode === "upload") {
      const bytes = state.files.reduce((sum, file) => sum + file.size, 0);
      const pages = Math.max(8, Math.min(48, Math.round(bytes / 45000) || state.files.length * 12));
      return {
        pages,
        requirements: s.requirements || Math.max(12, Math.round(pages * 1.2)),
        rules: s.businessRules || Math.max(6, Math.round(pages * 0.35)),
        dependencies: s.dependencies || Math.max(10, Math.round(pages * 0.7)),
        risks: s.risks || Math.max(3, Math.round(pages * 0.2)),
        questions: s.questions || Math.max(4, Math.round(pages * 0.35)),
        validationAreas: s.validationAreas || 6,
        sourceLabel: `${state.files.length} file(s) validated`,
      };
    }
    return {
      pages: s.pages || 1,
      requirements: s.requirements || 24,
      rules: s.businessRules || 7,
      dependencies: s.dependencies || 19,
      risks: s.risks || 5,
      questions: s.questions || 11,
      validationAreas: s.validationAreas || 6,
      sourceLabel: "Pasted requirement · 1 source block validated",
    };
  }

  function renderPipeline(activeIndex) {
    els.pipelineList.innerHTML = PIPELINE.map((step, index) => {
      const cls = index < activeIndex ? "done" : index === activeIndex ? "active" : "";
      return `<li class="${cls}">${index < activeIndex ? "✓ " : index === activeIndex ? "› " : "· "}${step}</li>`;
    }).join("");
  }

  async function runAnalyze() {
    if (!hasInput() || state.analyzing) return;
    state.analyzing = true;
    els.analyzeBtn.disabled = true;
    showScreen("analyze");
    const data = estimates();
    state.lastEstimates = data;
    els.sourceBar.textContent = `Source validated · ${data.sourceLabel}`;
    els.lifecycleHint.textContent = "AI is structuring intelligence. Counters unlock as each stage completes.";

    const steps = [
      {
        label: "Reading document…",
        stage: 0,
        pipeline: 0,
        percent: 10,
        eta: 18,
        apply: () => {
          setCount("files", state.mode === "upload" ? String(state.files.length) : "0");
          setCount("pages", String(data.pages));
        },
      },
      { label: "Extracting requirements…", stage: 1, pipeline: 1, percent: 22, eta: 16, apply: () => setCount("requirements", String(data.requirements)) },
      { label: "Understanding business rules…", stage: 1, pipeline: 2, percent: 34, eta: 14, apply: () => setCount("rules", String(data.rules)) },
      { label: "Discovering dependencies…", stage: 2, pipeline: 3, percent: 48, eta: 11, apply: () => setCount("dependencies", String(data.dependencies)) },
      { label: "Identifying risks…", stage: 3, pipeline: 4, percent: 60, eta: 9, apply: () => setCount("risks", String(data.risks)) },
      { label: "Generating clarification questions…", stage: 3, pipeline: 5, percent: 70, eta: 7, apply: () => setCount("questions", String(data.questions)) },
      { label: "Preparing validation readiness…", stage: 4, pipeline: 6, percent: 80, eta: 5, apply: () => setCount("readiness", demo?.project?.validationReadiness || "CONDITIONAL") },
      { label: "Linking evidence placeholders…", stage: 5, pipeline: 7, percent: 88, eta: 3, apply: () => {} },
      { label: "Release decision remains with RI…", stage: 6, pipeline: 8, percent: 94, eta: 2, apply: () => setCount("release", demo?.project?.releaseDecision || "PENDING") },
      {
        label: "Opening human review…",
        stage: 8,
        pipeline: 8,
        percent: 100,
        eta: 0,
        apply: () => {
          els.lifeLinks.forEach((link) => {
            link.disabled = false;
            link.classList.add("done");
            link.classList.remove("active");
            link.querySelector(".life-mark").textContent = "✓";
          });
        },
      },
    ];

    for (const step of steps) {
      const stageLabel = els.lifeLinks[step.stage].textContent.replace(/^\d+\s*/, "").replace(/^✓\s*/, "");
      els.analyzeStageLabel.textContent = `Stage ${String(step.stage + 1).padStart(2, "0")} of 09 · ${stageLabel}`;
      els.analyzePercent.textContent = `${step.percent}%`;
      els.analyzeEta.textContent = step.eta > 0 ? `+ ${step.eta} seconds remaining` : "Finalizing";
      els.radarStatus.textContent = step.label;
      setStatus(step.label, "Analyzing");
      unlockStage(step.stage);
      renderPipeline(step.pipeline);
      step.apply();
      await sleep(550);
    }

    state.analyzing = false;
    state.findings = FINDINGS.map((item) => ({
      ...item,
      status: "pending",
      originalText: item.text,
      commentNotes: [],
    }));
    state.currentFinding = 0;
    state.panelMode = "view";
    state.ackEvidence = false;
    state.ackTrace = false;
    window.PIOSApp?.saveState({
      analyzed: true,
      projectName: els.projectName.value.trim() || demo?.project?.name,
      summary: data,
      project: demo?.project,
    });
    renderReview(data);
    showScreen("review");
    setStatus("Intelligence ready · Human review open", "Live");
    els.lifecycleHint.textContent = "Human review is open. Expand findings, open transparency layers, accept or reject.";
  }

  function reviewStats() {
    const accepted = state.findings.filter((f) => f.status === "accepted").length;
    const rejected = state.findings.filter((f) => f.status === "rejected").length;
    const edited = state.findings.filter((f) => f.status === "edited").length;
    const pending = state.findings.filter((f) => f.status === "pending").length;
    const criticalPending = state.findings.filter((f) => f.status === "pending" && f.impact === "Critical").length;
    const comments = state.findings.reduce((sum, f) => sum + (f.commentNotes || []).filter((c) => !c.resolved).length, 0);
    const criticalQuestions = (demo?.questions || []).filter((q) => q.priority === "Critical").length;
    const missingEvidence = (demo?.evidence || []).filter((e) => e.status === "Gap").length;
    const missingLinks = (demo?.traceRows || []).filter((r) => r.missing).length;
    return { accepted, rejected, edited, pending, criticalPending, comments, criticalQuestions, missingEvidence, missingLinks };
  }

  function statusLabel(status) {
    return (
      {
        pending: "Pending",
        accepted: "Accepted",
        rejected: "Rejected",
        edited: "Edited",
      }[status] || status
    );
  }

  function statusMark(status) {
    return (
      {
        pending: "○",
        accepted: "✓",
        rejected: "×",
        edited: "✎",
      }[status] || "○"
    );
  }

  function persistReview() {
    window.PIOSApp?.saveState({
      findings: state.findings.map((f) => ({
        id: f.id,
        status: f.status,
        text: f.text,
        commentNotes: f.commentNotes,
      })),
      ackEvidence: state.ackEvidence,
      ackTrace: state.ackTrace,
      currentFinding: state.currentFinding,
    });
  }

  function refreshReviewUI() {
    renderFilters();
    renderAccordion();
    renderStatusMetrics(els.statusBoard);
    renderAckStack();
    updateHumanProgress();
    persistReview();
  }

  function statusTone(value) {
    return Number(value) === 0 ? "good" : "alert";
  }

  function renderStatusMetrics(target) {
    const s = reviewStats();
    const cards = [
      ["Accepted Findings", s.accepted, "f1"],
      ["Edited Findings", s.edited, "f2"],
      ["Rejected Findings", s.rejected, "f4"],
      ["Pending Findings", s.pending, "f3"],
      ["Questions Remaining", GAPS.length, "questions"],
      ["Critical Findings Remaining", s.criticalPending, "RISK-05"],
      ["Unresolved Comments", s.comments, "f3"],
      ["Critical Questions", s.criticalQuestions, "GAP-03"],
      ["Missing Evidence", s.missingEvidence, "EVD-003"],
      ["Missing Links", s.missingLinks, "GAP-03"],
    ];
    target.innerHTML = `
      <div class="kicker">Review status board · click any metric</div>
      <div class="status-metric-grid">
        ${cards
          .map(
            ([label, value, openId]) => `
          <button type="button" class="status-metric ${statusTone(value)}" data-status-filter="${label}" data-open-related="${openId}">
            <span>${label}</span>
            <strong>${value}</strong>
          </button>`
          )
          .join("")}
      </div>`;
  }

  function renderAckStack() {
    const s = reviewStats();
    els.ackStack.innerHTML = `
      ${
        !state.ackEvidence && s.missingEvidence
          ? `<div class="ack-banner ack-red">
              <div><strong>Evidence gap requires acknowledgement</strong><span>One representative traceability row does not yet contain approved evidence.</span></div>
              <button type="button" class="btn btn-sm ack-btn-red" data-ack="evidence">Acknowledge gap</button>
            </div>`
          : ""
      }
      ${
        !state.ackTrace && s.missingLinks
          ? `<div class="ack-banner ack-blue">
              <div><strong>Traceability links require acknowledgement</strong><span>GAP-03 is missing an approved business rule and confirmed recovery outcome.</span></div>
              <button type="button" class="btn btn-sm ack-btn-blue" data-ack="trace">Accept for follow-up</button>
            </div>`
          : ""
      }
      ${
        state.ackEvidence && state.ackTrace
          ? `<div class="ack-banner ack-green"><div><strong>Acknowledgements recorded</strong><span>Gaps remain visible for RI. Repository still locked until findings are reviewed.</span></div></div>`
          : ""
      }
    `;
  }

  function renderMilestones() {
    const steps = ["Upload", "AI Analysis", "Categorization", "Risk", "Owner Review", "Readiness"];
    const done = [true, true, true, true, false, false];
    els.milestoneTrack.innerHTML = steps
      .map(
        (label, i) => `
      <div class="mile ${done[i] ? "done" : ""}">
        <span class="mile-dot">${done[i] ? "✓" : String(i + 1).padStart(2, "0")}</span>
        <strong>${label}</strong>
      </div>`
      )
      .join('<span class="mile-line"></span>');
  }

  function renderFilters() {
    const filters = [
      ["all", "All findings"],
      ["pending", "Pending"],
      ["accepted", "Accepted"],
      ["edited", "Edited"],
      ["rejected", "Rejected"],
      ["Critical", "Critical"],
    ];
    els.findingFilters.innerHTML = filters
      .map(
        ([id, label]) =>
          `<button type="button" class="filter-chip ${state.filter === id ? "active" : ""}" data-filter="${id}">${label}</button>`
      )
      .join("");
  }

  function filteredFindings() {
    return state.findings
      .map((f, index) => ({ f, index }))
      .filter(({ f }) => {
        if (state.filter === "all") return true;
        if (state.filter === "Critical") return f.impact === "Critical";
        return f.status === state.filter;
      });
  }

  function renderAccordion() {
    const list = filteredFindings();
    if (!list.length) {
      els.findingsAccordion.innerHTML = `<div class="empty-findings">No findings in this filter. <button type="button" class="chip-btn" data-filter="all">Show all</button></div>`;
      return;
    }
    els.findingsAccordion.innerHTML = list
      .map(({ f, index }) => {
        const open = index === state.currentFinding;
        const num = String(index + 1).padStart(2, "0");
        const notes = f.commentNotes || [];
        const editing = open && state.panelMode === "edit";
        const commenting = open && state.panelMode === "comment";
        return `
        <article class="find-card ${open ? "open" : ""} status-${f.status}" data-index="${index}">
          <button type="button" class="find-summary" data-toggle-finding="${index}">
            <span class="find-num">${statusMark(f.status)}</span>
            <span class="find-main">
              <strong>${num}. ${f.title}</strong>
              <small>${f.source} · ${notes.length} comment${notes.length === 1 ? "" : "s"}</small>
            </span>
            <span class="find-meta">
              <span class="status-pill status-${f.status}">${statusLabel(f.status)}</span>
              <em>${f.confidence}%</em>
              <span class="chip ${f.impact === "Critical" ? "warn" : "good"}">${f.impact}</span>
              <span class="chip">${f.evidence}</span>
            </span>
          </button>
          ${
            open
              ? `<div class="find-detail">
            <div class="find-tabs">
              <button type="button" class="${state.panelMode === "view" ? "active" : ""}" data-panel-mode="view">Overview</button>
              <button type="button" data-open-id="${f.source}">Requirements</button>
              <button type="button" data-open-modal="deps">Risks / Deps</button>
              <button type="button" data-open-modal="evidence">Evidence</button>
            </div>
            <div class="finding-body">
              <div class="kicker">AI finding · ${statusLabel(f.status)}</div>
              ${
                editing
                  ? `<textarea class="edit-area" id="editFindingText" rows="4">${f.text}</textarea>
                     <div class="action-row" style="margin-top:10px">
                       <button class="btn btn-primary" type="button" data-save-edit="${index}">Save edit</button>
                       <button class="btn btn-ghost" type="button" data-cancel-panel>Cancel</button>
                     </div>`
                  : `<p>${f.text}</p>${
                      f.text !== f.originalText
                        ? `<p class="edit-note">Edited from original AI text</p>`
                        : ""
                    }`
              }
            </div>
            ${
              commenting
                ? `<div class="comment-box">
                    <div class="kicker">Add comment</div>
                    <textarea id="commentFindingText" rows="3" placeholder="Add a review comment…"></textarea>
                    <div class="action-row" style="margin-top:10px">
                      <button class="btn btn-primary" type="button" data-save-comment="${index}">Save comment</button>
                      <button class="btn btn-ghost" type="button" data-cancel-panel>Cancel</button>
                    </div>
                  </div>`
                : ""
            }
            ${
              notes.length
                ? `<div class="comment-list">
                    <div class="kicker">Comments (${notes.length})</div>
                    ${notes
                      .map(
                        (c, ci) => `
                      <div class="comment-item ${c.resolved ? "resolved" : ""}">
                        <p>${c.text}</p>
                        <div class="comment-meta">
                          <span>${c.at}</span>
                          ${
                            c.resolved
                              ? `<em>Resolved</em>`
                              : `<button type="button" class="chip-btn" data-resolve-comment="${index}" data-comment-i="${ci}">Resolve</button>`
                          }
                        </div>
                      </div>`
                      )
                      .join("")}
                  </div>`
                : ""
            }
            <div class="source-box">
              <div class="kicker">Source evidence</div>
              “${f.quote}”
              <button type="button" class="btn btn-ghost btn-sm" data-open-modal="evidence" style="margin-top:10px">Open document context →</button>
            </div>
            <div class="connected">
              ${(f.links || []).map((link) => `<button type="button" class="chip-btn" data-open-id="${link}">${link}</button>`).join("")}
              <button type="button" class="chip-btn" data-open-modal="trace">Traceability</button>
            </div>
            <div class="action-row review-actions">
              <button class="btn ${f.status === "accepted" ? "btn-primary" : "btn-ghost"}" type="button" data-action="accepted" data-index="${index}">✓ Accept</button>
              <button class="btn ${f.status === "edited" || editing ? "btn-primary" : "btn-ghost"}" type="button" data-action="edit" data-index="${index}">✎ Edit</button>
              <button class="btn ${commenting ? "btn-primary" : "btn-ghost"}" type="button" data-action="comment" data-index="${index}">Comment${notes.length ? ` (${notes.length})` : ""}</button>
              <button class="btn ${f.status === "rejected" ? "btn-danger" : "btn-ghost"}" type="button" data-action="rejected" data-index="${index}">× Reject</button>
              <button class="btn btn-ghost" type="button" data-action="explain" data-index="${index}">✦ Explain</button>
              ${f.status !== "pending" ? `<button class="btn btn-ghost" type="button" data-action="pending" data-index="${index}">Reset to pending</button>` : ""}
            </div>
            <div class="decision-note">Current decision: <strong class="status-${f.status}">${statusLabel(f.status)}</strong></div>
          </div>`
              : ""
          }
        </article>`;
      })
      .join("");
  }

  function renderGates() {
    const gates = demo?.reviewGates || [];
    els.gatesPanel.innerHTML = `
      <div class="kicker">Review gates · click for related data</div>
      <div class="gate-list">
        ${gates
          .map(
            (g) => `
          <button type="button" class="gate-row" data-open-id="${(g.related && g.related[0]) || "REQ-1.2"}" data-gate-related='${JSON.stringify(g.related || [])}'>
            <span>${g.q}</span>
            <strong class="${g.answer === "YES" ? "good" : g.answer === "NO" ? "bad" : "mid"}">${g.answer} · ${g.score}%</strong>
          </button>`
          )
          .join("")}
      </div>`;
  }

  function renderPillars() {
    const pillars = [
      ["RIE", "requirements", "Requirements structured"],
      ["AIR", "readiness", "Readiness CONDITIONAL"],
      ["Evidence", "evidence", "Source linked"],
      ["RI", "release", "Decision PENDING"],
      ["OI", "knowledge", "Future observe"],
      ["Knowledge", "knowledge", "Patterns captured"],
    ];
    els.pillarPanel.innerHTML = `
      <div class="kicker">Intelligence pillars · click for data</div>
      <div class="pillar-grid">
        ${pillars
          .map(
            ([name, topic, detail], i) => `
          <button type="button" class="pillar ${i < 4 ? "on" : ""}" data-topic="${topic}">
            <strong>${name}</strong>
            <span>${detail}</span>
          </button>`
          )
          .join("")}
      </div>`;
  }

  function updateHumanProgress(stats = reviewStats()) {
    const done = stats.accepted + stats.rejected + stats.edited;
    const pct = Math.round((done / state.findings.length) * 100) || 0;
    const unlocked = done === state.findings.length && state.ackEvidence && state.ackTrace;
    els.progHuman.textContent = `${done} of ${state.findings.length}`;
    els.progHumanBar.style.width = `${pct}%`;
    els.progHumanDetail.textContent = `${stats.accepted} accepted · ${stats.edited} edited · ${stats.rejected} rejected · ${stats.pending} pending`;
    els.queueSummary.textContent = `${state.findings.length} Findings · ${stats.accepted} Accepted · ${stats.edited} Edited · ${stats.rejected} Rejected · ${stats.pending} Pending`;
    els.progRepo.textContent = unlocked ? "100%" : "0%";
    if (els.progRepoBar) els.progRepoBar.style.width = unlocked ? "100%" : "0%";
    if (els.progRepoDetail) els.progRepoDetail.textContent = unlocked ? "Ready for RI handoff" : "Locked until review gates pass";
    els.repoSummary.textContent = `${stats.pending} pending findings · ${stats.criticalQuestions} critical questions · ${stats.comments} unresolved comments · ${stats.missingEvidence + stats.missingLinks} traceability gaps.`;
    els.repoLockBtn.textContent = unlocked ? "Repository Unlocked" : "Repository Locked";
    els.repoLockBtn.classList.toggle("unlocked", unlocked);
    els.reviewCompleteBtn.disabled = !unlocked;
  }

  function renderReview(data) {
    const project = demo?.project || {};
    els.reviewKpis.innerHTML = `
      <button type="button" class="kpi click-card" data-topic="requirements"><span>Requirements</span><strong>${data.requirements}</strong><em>Structured and reviewable</em></button>
      <button type="button" class="kpi click-card" data-topic="rules"><span>Business Rules</span><strong>${data.rules}</strong><em>Logic and constraints</em></button>
      <button type="button" class="kpi click-card" data-topic="dependencies"><span>Dependencies</span><strong>${data.dependencies}</strong><em>Systems, data, and roles</em></button>
      <button type="button" class="kpi click-card" data-topic="questions"><span>Open Questions</span><strong>${data.questions}</strong><em>Decisions still required</em></button>
      <button type="button" class="kpi click-card" data-topic="risks"><span>Risks</span><strong>${data.risks}</strong><em>Prioritized by impact</em></button>
      <button type="button" class="kpi click-card" data-topic="readiness"><span>Validation Areas</span><strong>${data.validationAreas}</strong><em>Evidence-aware coverage</em></button>
    `;

    els.reviewMeta.innerHTML = `
      <button type="button" class="meta-item click-row" data-topic="project"><span>Version</span><strong>${project.version || "1.0"}</strong></button>
      <button type="button" class="meta-item click-row" data-topic="files"><span>Source</span><strong>${state.mode === "upload" ? "Uploaded files" : "Pasted input"}</strong></button>
      <button type="button" class="meta-item click-row" data-topic="project"><span>Approval</span><strong>Review Required</strong></button>
      <button type="button" class="meta-item click-row" data-topic="release"><span>Repository</span><strong>Not Approved</strong></button>
      <button type="button" class="meta-item click-row" data-topic="readiness"><span>Validation readiness</span><strong>${project.validationReadiness || "CONDITIONAL"} · AIR</strong></button>
      <button type="button" class="meta-item click-row" data-topic="release"><span>Release decision</span><strong>${project.releaseDecision || "PENDING"} · RI</strong></button>
      <button type="button" class="meta-item click-row" data-topic="project"><span>Access model</span><strong>Owner · Contributor · Viewer</strong></button>
      <button type="button" class="meta-item click-row" data-topic="project"><span>Created</span><strong>Today</strong></button>
    `;

    els.gapList.innerHTML = GAPS.map(
      (gap) => `<button type="button" class="gap-item click-row" data-open-id="${gap.id}"><strong>? ${gap.q}</strong><span>${gap.meta}</span></button>`
    ).join("");

    const pathNodes = ["Payment", "Subscription", "Entitlement", "Active Sessions", "Notification"];
    els.depPath.innerHTML = pathNodes
      .map((node, index) => {
        const dep = DEPS[Math.min(index, Math.max(DEPS.length - 1, 0))];
        return `${index ? '<span class="dep-arrow">→</span>' : ""}<button type="button" class="dep-node chip-btn" data-open-id="${dep?.id || "DEP-01"}">${node}</button>`;
      })
      .join("");
    els.depNote.textContent =
      "The upgrade succeeds only when payment, subscription, entitlement, and active-session state remain synchronized. Click any node or open the full graph.";

    renderMilestones();
    renderFilters();
    renderAccordion();
    renderStatusMetrics(els.statusBoard);
    renderAckStack();
    renderGates();
    renderPillars();
    updateHumanProgress();
  }

  function setFindingStatus(index, status, { advance = true } = {}) {
    const finding = state.findings[index];
    if (!finding) return;
    finding.status = status;
    finding.decidedAt = new Date().toLocaleTimeString();
    state.panelMode = "view";
    if (advance) {
      const next = state.findings.findIndex((item, i) => i > index && item.status === "pending");
      if (next >= 0) state.currentFinding = next;
      else state.currentFinding = index;
    } else {
      state.currentFinding = index;
    }
    const messages = {
      accepted: "Finding accepted",
      rejected: "Finding rejected",
      edited: "Finding edited",
      pending: "Finding reset to pending",
    };
    window.PIOSApp?.toast(messages[status] || "Status updated");
    refreshReviewUI();
  }

  function openModal(name) {
    ["evidence", "deps", "trace", "status"].forEach((key) => {
      const el = document.getElementById(`modal${key[0].toUpperCase()}${key.slice(1)}`);
      if (el) el.hidden = key !== name;
    });
    if (name === "evidence") renderEvidenceModal();
    if (name === "deps") renderDepsModal();
    if (name === "trace") renderTraceModal();
    if (name === "status") {
      renderStatusMetrics(els.statusModalBody);
      els.statusModalBody.insertAdjacentHTML(
        "beforeend",
        `<div class="ack-stack" style="margin-top:16px">${els.ackStack.innerHTML}</div>
         <div class="repo-footer" style="margin-top:14px"><p>${els.repoSummary.textContent}</p><button class="btn btn-primary" type="button" id="repoLockBtnModal">${els.repoLockBtn.textContent}</button></div>`
      );
    }
    document.body.classList.add("modal-open");
  }

  function closeModals() {
    ["modalEvidence", "modalDeps", "modalTrace", "modalStatus"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    });
    document.body.classList.remove("modal-open");
  }

  function renderEvidenceModal() {
    const finding = state.findings[state.currentFinding] || state.findings[0];
    const src = demo?.sourceEvidence || {};
    els.evidenceBody.innerHTML = `
      <div class="ev-finding">
        <div class="kicker">Finding under review</div>
        <h3>${finding?.title || "Finding"}</h3>
        <p>${finding?.text || ""}</p>
        <button type="button" class="btn btn-ghost btn-sm" data-close-modal>Back to review card ←</button>
      </div>
      <div class="ev-tags">
        <button type="button" class="chip-btn" data-open-id="DOC-SAMPLE">${src.document || "sample11.pdf"}</button>
        <button type="button" class="chip-btn" data-open-id="DOC-SAMPLE">${src.page || "Page 2"}</button>
        <button type="button" class="chip-btn" data-open-id="${src.requirementId || finding?.source}">${src.paragraph || "Paragraph 4"}</button>
        <button type="button" class="chip-btn" data-open-id="${src.requirementId || finding?.source}">${src.requirementId || finding?.source}</button>
      </div>
      <div class="ev-source">
        <div class="ev-source-head"><strong>Requirement source</strong><span>Surrounding document context</span></div>
        <p>${src.before || ""}</p>
        <p class="ev-highlight">${src.highlight || finding?.quote || ""}</p>
        <p>${src.after || ""}</p>
      </div>
      <div class="ev-line">
        <div class="kicker">Evidence line</div>
        <h3>This finding is grounded in ${src.requirementId || finding?.source || "REQ-1.2"}.</h3>
        <p>Source highlighting lets a reviewer verify the AI interpretation without searching the original document manually.</p>
        <div class="chip-row" style="margin-top:10px">
          <button type="button" class="chip-btn" data-open-id="${src.requirementId || "REQ-1.2"}">${src.requirementId || "REQ-1.2"}</button>
          <button type="button" class="chip-btn" data-open-id="EVD-001">EVD-001</button>
          <button type="button" class="chip-btn" data-open-id="${finding?.id || "f1"}">${finding?.id || "f1"}</button>
        </div>
      </div>`;
  }

  function renderDepsModal() {
    const nodes = demo?.depGraph || [];
    const root = nodes.find((n) => n.root);
    const children = nodes.filter((n) => !n.root && (state.depFilter === "All" || n.type === state.depFilter));
    const types = ["All", "System", "Data", "API", "Business"];
    els.depsBody.innerHTML = `
      <div class="kicker">Relationship types</div>
      <div class="filter-row">
        ${types
          .map(
            (t) =>
              `<button type="button" class="filter-chip ${state.depFilter === t ? "active" : ""}" data-dep-filter="${t}">${t}</button>`
          )
          .join("")}
      </div>
      ${
        state.depView === "graph"
          ? `<div class="dep-graph">
              <button type="button" class="dep-root">${root?.name || "Subscription Upgrade"}</button>
              <div class="dep-children">
                ${children
                  .map(
                    (n) => `
                  <button type="button" class="dep-card" data-open-id="${n.openId || n.id}">
                    <strong>${n.name}</strong>
                    <span>${n.type} · ${n.criticality} · ${n.role}</span>
                  </button>`
                  )
                  .join("")}
              </div>
            </div>`
          : `<table class="data-table"><thead><tr><th>Service</th><th>Type</th><th>Criticality</th><th>Role</th></tr></thead>
              <tbody>${children
                .map(
                  (n) =>
                    `<tr class="click-row" data-open-id="${n.openId || n.id}"><td><strong>${n.name}</strong></td><td>${n.type}</td><td>${n.criticality}</td><td>${n.role}</td></tr>`
                )
                .join("")}</tbody></table>`
      }
      <div class="risk-path">
        <div class="kicker">Highest-risk path</div>
        <strong>Payment → Subscription → Entitlement → Active Sessions</strong>
        <p>A failure anywhere in this path can create a paid customer without the access they purchased.</p>
      </div>
      <button type="button" class="btn btn-ghost btn-sm" id="addDepBtn">+ Add missing dependency</button>`;
  }

  function renderTraceModal() {
    const rows = demo?.traceRows || [];
    const pills = [
      ["req-evd", "Requirement to evidence"],
      ["evd-req", "Failed evidence to requirement"],
      ["risk-tc", "Risk to test cases"],
      ["rule-dep", "Rule to dependencies"],
    ];
    const ordered = state.traceFlow === "reverse" ? [...rows].reverse() : rows;
    els.traceBody.innerHTML = `
      <div class="filter-row">
        ${pills.map(([id, label], i) => `<button type="button" class="filter-chip ${i === 0 ? "active" : ""}" data-trace-pill="${id}">${label}</button>`).join("")}
      </div>
      <table class="data-table trace-table">
        <thead>
          <tr>
            <th>Source document</th>
            <th>Requirement</th>
            <th>Business rule</th>
            <th>Dependency</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          ${ordered
            .map(
              (r) => `
            <tr class="${r.missing ? "missing-row" : ""}">
              <td><button type="button" class="chip-btn" data-open-modal="evidence">${r.source}</button></td>
              <td><button type="button" class="chip-btn" data-open-id="${r.requirement}">${r.requirement}</button></td>
              <td>${
                r.rule
                  ? `<button type="button" class="chip-btn" data-open-id="${r.rule}">${r.rule}</button>`
                  : `<span class="missing">Missing</span>`
              }</td>
              <td>${r.dependency}</td>
              <td><button type="button" class="chip-btn" data-open-id="${r.risk}">${r.risk}</button></td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <div class="risk-path">
        <div class="kicker">Missing links are highlighted</div>
        <p>GAP-03 requires a business rule, approved evidence, and confirmed recovery outcome.</p>
      </div>`;
  }

  // Prefill
  if (els.requirementText && demo?.requirementText) {
    els.requirementText.placeholder = demo.requirementText;
  }
  if (els.projectName && demo?.project?.name) {
    els.projectName.value = demo.project.name;
    els.railProjectName.textContent = demo.project.name;
  }

  // Events
  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      els.tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      state.mode = tab.dataset.tab;
      els.uploadPanel.hidden = state.mode !== "upload";
      els.pastePanel.hidden = state.mode !== "paste";
      updateAnalyzeEnabled();
    });
  });

  els.browseBtn.addEventListener("click", () => els.fileInput.click());
  els.dropzone.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    els.fileInput.click();
  });
  els.fileInput.addEventListener("change", () => {
    if (els.fileInput.files?.length) addFiles(els.fileInput.files);
    els.fileInput.value = "";
  });
  ["dragenter", "dragover"].forEach((name) => {
    els.dropzone.addEventListener(name, (event) => {
      event.preventDefault();
      els.dropzone.classList.add("dragover");
    });
  });
  ["dragleave", "drop"].forEach((name) => {
    els.dropzone.addEventListener(name, (event) => {
      event.preventDefault();
      els.dropzone.classList.remove("dragover");
    });
  });
  els.dropzone.addEventListener("drop", (event) => {
    if (event.dataTransfer?.files?.length) addFiles(event.dataTransfer.files);
  });
  els.fileList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    state.files.splice(Number(button.dataset.remove), 1);
    resetDerivedCounts();
    renderFiles();
  });
  els.requirementText.addEventListener("input", updateAnalyzeEnabled);
  els.projectName.addEventListener("input", () => {
    els.railProjectName.textContent = els.projectName.value.trim() || "Untitled project";
  });
  els.analyzeBtn.addEventListener("click", runAnalyze);
  els.analyzeAnotherBtn.addEventListener("click", () => {
    showScreen("input");
    state.findings = FINDINGS.map((item) => ({
      ...item,
      status: "pending",
      originalText: item.text,
      commentNotes: [],
    }));
    state.panelMode = "view";
    state.currentFinding = 0;
    resetDerivedCounts();
    setCount("files", state.mode === "upload" ? String(state.files.length) : "0");
    updateAnalyzeEnabled();
    els.analyzeBtn.disabled = !hasInput();
    els.analyzeBtn.textContent = "Analyze Project →";
  });
  els.focusReviewBtn.addEventListener("click", () => {
    document.getElementById("reviewPanel").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.addEventListener("click", (event) => {
    const openModalBtn = event.target.closest("[data-open-modal]");
    if (openModalBtn) {
      event.preventDefault();
      openModal(openModalBtn.dataset.openModal);
      return;
    }
    if (event.target.closest("[data-close-modal]")) {
      closeModals();
      return;
    }
    const hrefBtn = event.target.closest("[data-href]");
    if (hrefBtn) {
      location.href = hrefBtn.dataset.href;
      return;
    }
    const filterBtn = event.target.closest("[data-filter]");
    if (filterBtn) {
      state.filter = filterBtn.dataset.filter;
      renderFilters();
      renderAccordion();
      return;
    }
    const toggle = event.target.closest("[data-toggle-finding]");
    if (toggle) {
      const idx = Number(toggle.dataset.toggleFinding);
      if (state.currentFinding === idx) {
        // keep open; just ensure view mode when re-clicked while open
        state.panelMode = "view";
      } else {
        state.currentFinding = idx;
        state.panelMode = "view";
      }
      renderAccordion();
      return;
    }
    const panelModeBtn = event.target.closest("[data-panel-mode]");
    if (panelModeBtn) {
      state.panelMode = panelModeBtn.dataset.panelMode;
      renderAccordion();
      return;
    }
    if (event.target.closest("[data-cancel-panel]")) {
      state.panelMode = "view";
      renderAccordion();
      return;
    }
    const saveEdit = event.target.closest("[data-save-edit]");
    if (saveEdit) {
      const index = Number(saveEdit.dataset.saveEdit);
      const area = document.getElementById("editFindingText");
      const nextText = (area?.value || "").trim();
      if (nextText.length < 8) {
        window.PIOSApp?.toast("Edited finding text is too short");
        return;
      }
      state.findings[index].text = nextText;
      state.findings[index].status = "edited";
      state.findings[index].decidedAt = new Date().toLocaleTimeString();
      state.panelMode = "view";
      state.currentFinding = index;
      window.PIOSApp?.toast("Finding edited and marked Edited");
      refreshReviewUI();
      return;
    }
    const saveComment = event.target.closest("[data-save-comment]");
    if (saveComment) {
      const index = Number(saveComment.dataset.saveComment);
      const area = document.getElementById("commentFindingText");
      const text = (area?.value || "").trim();
      if (!text) {
        window.PIOSApp?.toast("Enter a comment first");
        return;
      }
      if (!state.findings[index].commentNotes) state.findings[index].commentNotes = [];
      state.findings[index].commentNotes.push({
        text,
        at: new Date().toLocaleString(),
        resolved: false,
      });
      state.panelMode = "view";
      state.currentFinding = index;
      window.PIOSApp?.toast("Comment saved");
      refreshReviewUI();
      return;
    }
    const resolveComment = event.target.closest("[data-resolve-comment]");
    if (resolveComment) {
      const index = Number(resolveComment.dataset.resolveComment);
      const ci = Number(resolveComment.dataset.commentI);
      const note = state.findings[index]?.commentNotes?.[ci];
      if (note) note.resolved = true;
      window.PIOSApp?.toast("Comment resolved");
      refreshReviewUI();
      return;
    }
    const actionBtn = event.target.closest("[data-action]");
    if (actionBtn && actionBtn.closest("#findingsAccordion")) {
      event.preventDefault();
      event.stopPropagation();
      const index = Number(actionBtn.dataset.index);
      const action = actionBtn.dataset.action;
      state.currentFinding = index;

      if (action === "edit") {
        state.panelMode = "edit";
        renderAccordion();
        document.getElementById("editFindingText")?.focus();
        return;
      }
      if (action === "comment") {
        state.panelMode = "comment";
        renderAccordion();
        document.getElementById("commentFindingText")?.focus();
        return;
      }
      if (action === "explain") {
        window.PIOSApp?.openEntity(state.findings[index].id);
        return;
      }
      if (action === "accepted" || action === "rejected" || action === "pending") {
        setFindingStatus(index, action, { advance: action !== "pending" });
        return;
      }
      return;
    }
    const ack = event.target.closest("[data-ack]");
    if (ack) {
      if (ack.dataset.ack === "evidence") state.ackEvidence = true;
      if (ack.dataset.ack === "trace") state.ackTrace = true;
      window.PIOSApp?.toast("Acknowledgement recorded");
      renderAckStack();
      updateHumanProgress();
      return;
    }
    const depFilter = event.target.closest("[data-dep-filter]");
    if (depFilter) {
      state.depFilter = depFilter.dataset.depFilter;
      renderDepsModal();
      return;
    }
    const depView = event.target.closest("[data-dep-view]");
    if (depView) {
      state.depView = depView.dataset.depView;
      document.querySelectorAll("#depViewSeg button").forEach((b) => b.classList.toggle("active", b === depView));
      renderDepsModal();
      return;
    }
    const traceFlow = event.target.closest("[data-trace-flow]");
    if (traceFlow) {
      state.traceFlow = traceFlow.dataset.traceFlow === "reverse" ? "reverse" : "forward";
      document.querySelectorAll("#traceFlowSeg button").forEach((b) => b.classList.toggle("active", b === traceFlow));
      renderTraceModal();
      return;
    }
    if (event.target.closest("#addDepBtn")) {
      window.PIOSApp?.toast("Demo: dependency suggestion captured for product review");
      return;
    }
    if (event.target.closest("#repoLockBtn, #repoLockBtnModal, #reviewCompleteBtn")) {
      const unlocked = !els.reviewCompleteBtn.disabled;
      if (!unlocked) {
        window.PIOSApp?.openDrawer({
          kicker: "Repository",
          title: "Still locked",
          body: `<p>Accept or reject all findings and acknowledge evidence / traceability gaps to unlock repository handoff to RI.</p>`,
        });
      } else {
        window.PIOSApp?.toast("Review complete · ready for AIR / RI workspace");
        window.PIOSApp?.saveState({ reviewComplete: true });
      }
      return;
    }
    const statusFilter = event.target.closest("[data-status-filter]");
    if (statusFilter) {
      const label = statusFilter.dataset.statusFilter;
      const related = statusFilter.dataset.openRelated;
      if (label.includes("Pending")) state.filter = "pending";
      else if (label.includes("Accepted")) state.filter = "accepted";
      else if (label.includes("Edited")) state.filter = "edited";
      else if (label.includes("Rejected")) state.filter = "rejected";
      else if (label.includes("Critical Findings")) state.filter = "Critical";
      else if (label.includes("Unresolved Comments")) {
        state.filter = "all";
        const withComments = state.findings.findIndex((f) => (f.commentNotes || []).some((c) => !c.resolved));
        if (withComments >= 0) state.currentFinding = withComments;
      } else if (label.includes("Questions")) {
        state.filter = "all";
        if (related) window.PIOSApp?.openEntity(related);
      } else state.filter = "all";
      closeModals();
      renderFilters();
      renderAccordion();
      if (related && !label.includes("Questions")) window.PIOSApp?.openEntity(related);
      document.getElementById("reviewPanel")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const pillar = event.target.closest("[data-pillar]");
    if (pillar) {
      // legacy; topics preferred
      const map = { RIE: "requirements", AIR: "readiness", Evidence: "evidence", RI: "release", OI: "knowledge", Knowledge: "knowledge" };
      window.PIOSApp?.openEntity(map[pillar.dataset.pillar] || "project");
      return;
    }
  });

  els.lifeLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (link.disabled) return;
      const stage = Number(link.dataset.stage);
      const maps = {
        1: "REQ-1.2",
        2: "DEP-01",
        3: "RISK-05",
        4: "JRN-UPGRADE-001",
        5: "EVD-001",
        7: "K-01",
        8: "K-03",
      };
      if (stage === 6) {
        location.href = "workspace.html#ri";
        return;
      }
      if (maps[stage]) window.PIOSApp?.openEntity(maps[stage]);
      else if (stage === 0) showScreen("input");
    });
  });

  renderPipeline(-1);
  updateAnalyzeEnabled();
})();
