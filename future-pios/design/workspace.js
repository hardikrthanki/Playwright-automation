(() => {
  const d = window.PIOS_DEMO;
  const tabs = [
    ["overview", "Overview"],
    ["attention", "Attention"],
    ["requirements", "Requirements"],
    ["dependencies", "Dependencies"],
    ["risks", "Risks"],
    ["questions", "Questions"],
    ["air", "AIR"],
    ["evidence", "Evidence"],
    ["ri", "RI"],
    ["trace", "Traceability"],
    ["knowledge", "Knowledge"],
  ];

  function setTab(name) {
    tabs.forEach(([id]) => {
      const panel = document.getElementById(`panel-${id}`);
      if (panel) panel.hidden = id !== name;
    });
    document.querySelectorAll("#wsTabs .ws-tab, #wsSideNav a").forEach((el) => {
      el.classList.toggle("active", el.dataset.tab === name);
    });
    history.replaceState(null, "", `#${name}`);
  }

  function renderKpis() {
    const s = d.summary;
    document.getElementById("wsKpis").innerHTML = `
      <button class="kpi click-card" type="button" data-topic="requirements"><span>Requirements</span><strong>${s.requirements}</strong><em>8 need clarification</em></button>
      <button class="kpi click-card" type="button" data-topic="readiness"><span>Validation readiness</span><strong style="font-size:18px">${d.project.validationReadiness}</strong><em>AIR signal</em></button>
      <button class="kpi click-card" type="button" data-topic="release"><span>Release decision</span><strong style="font-size:18px">${d.project.releaseDecision}</strong><em>Owned by RI</em></button>
      <button class="kpi click-card" type="button" data-topic="dependencies"><span>Dependencies</span><strong>${s.dependencies}</strong><em>Click to inspect</em></button>
      <button class="kpi click-card" type="button" data-topic="risks"><span>Risks</span><strong>${s.risks}</strong><em>Critical highlighted</em></button>
      <button class="kpi click-card" type="button" data-topic="evidence"><span>Evidence</span><strong>${s.evidenceItems}</strong><em>View Evidence</em></button>
    `;
  }

  function renderTabs() {
    document.getElementById("wsTabs").innerHTML = tabs
      .map(([id, label]) => `<button type="button" class="ws-tab" data-tab="${id}">${label}</button>`)
      .join("");
  }

  function renderOverview() {
    document.getElementById("panel-overview").innerHTML = `
      <div class="split-2">
        <div class="panel" style="padding:16px">
          <div class="kicker">Organization workspace</div>
          <div class="attention-list" style="margin-top:12px">
            ${d.attention
              .map(
                (item) => `
              <button type="button" class="attention-item click-row" data-tab-jump="${item.href.split("#")[1] || "attention"}" style="width:100%;text-align:left;background:var(--bg-card);border:1px solid var(--line);border-radius:14px">
                <span class="dot ${item.tone === "red" ? "red" : item.tone === "green" ? "green" : ""}"></span>
                <div><strong>${item.title}</strong><span>${item.detail}</span></div>
                <em>${item.owner}</em>
              </button>`
              )
              .join("")}
          </div>
        </div>
        <div class="panel" style="padding:16px">
          <div class="kicker">Ask the project</div>
          <div class="prompt-grid" style="margin-top:12px">
            ${d.aiPrompts
              .slice(0, 4)
              .map(
                (p, i) => `
              <button type="button" class="prompt-btn" data-ai-prompt="${p.id}">
                <small>0${i + 1}</small>
                ${p.label}
              </button>`
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderAttention() {
    document.getElementById("panel-attention").innerHTML = `
      <div class="attention-list">
        ${d.attention
          .map(
            (item) => `
          <button type="button" class="attention-item click-row" data-tab-jump="${item.href.split("#")[1]}" style="width:100%;text-align:left;background:var(--bg-card);border:1px solid var(--line);border-radius:14px">
            <span class="dot ${item.tone === "red" ? "red" : item.tone === "green" ? "green" : ""}"></span>
            <div><strong>${item.title}</strong><span>${item.detail}</span></div>
            <em>${item.owner}</em>
          </button>`
          )
          .join("")}
      </div>`;
  }

  function renderRequirements() {
    document.getElementById("panel-requirements").innerHTML = `
      <table class="data-table">
        <thead><tr><th>ID</th><th>Title</th><th>Priority</th><th>Status</th></tr></thead>
        <tbody>
          ${d.requirements
            .map(
              (r) => `
            <tr class="click-row" data-open-id="${r.id}">
              <td><strong>${r.id}</strong></td>
              <td>${r.title}</td>
              <td>${r.priority}</td>
              <td>${r.status}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <div class="kicker" style="margin-top:18px">Business rules</div>
      <div class="chip-row">
        ${d.rules.map((r) => `<button type="button" class="chip-btn" data-open-id="${r.id}">${r.id} · ${r.title}</button>`).join("")}
      </div>`;
  }

  function renderDependencies() {
    document.getElementById("panel-dependencies").innerHTML = `
      <div class="dep-path" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:16px">
        ${["Payment", "Subscription", "Entitlement", "Active Sessions", "Notification"]
          .map((n, i) => `${i ? '<span style="color:var(--lime)">→</span>' : ""}<button class="chip-btn" data-open-id="${d.dependencies[i]?.id || "DEP-01"}">${n}</button>`)
          .join("")}
      </div>
      <table class="data-table">
        <thead><tr><th>ID</th><th>From</th><th>To</th><th>Type</th><th>Requirement</th></tr></thead>
        <tbody>
          ${d.dependencies
            .map(
              (dep) => `
            <tr class="click-row" data-open-id="${dep.id}">
              <td><strong>${dep.id}</strong></td>
              <td>${dep.from}</td>
              <td>${dep.to}</td>
              <td>${dep.type}</td>
              <td><button class="chip-btn" data-open-id="${dep.requirementId}">${dep.requirementId}</button></td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>`;
  }

  function renderRisks() {
    document.getElementById("panel-risks").innerHTML = `
      <table class="data-table">
        <thead><tr><th>ID</th><th>Risk</th><th>Level</th><th>Owner</th></tr></thead>
        <tbody>
          ${d.risks
            .map(
              (r) => `
            <tr class="click-row" data-open-id="${r.id}">
              <td><strong>${r.id}</strong></td>
              <td>${r.title}</td>
              <td>${r.level}</td>
              <td>${r.owner}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>`;
  }

  function renderQuestions() {
    document.getElementById("panel-questions").innerHTML = `
      <div class="attention-list">
        ${d.questions
          .map(
            (q) => `
          <button type="button" class="attention-item click-row" data-open-id="${q.id}" style="width:100%;text-align:left;background:var(--bg-card);border:1px solid var(--line);border-radius:14px">
            <span class="dot ${q.priority === "Critical" ? "red" : ""}"></span>
            <div><strong>${q.text}</strong><span>${q.id} · ${q.priority}</span></div>
            <em>Open</em>
          </button>`
          )
          .join("")}
      </div>`;
  }

  function renderAir() {
    document.getElementById("panel-air").innerHTML = `
      <div class="panel" style="padding:18px;margin-bottom:14px">
        <div class="kicker">Validation readiness</div>
        <h2 style="color:var(--amber);margin:8px 0">${d.project.validationReadiness}</h2>
        <p class="subcopy">AIR signal for RI. Not a governed release decision.</p>
        <div class="kpi-grid">
          <button class="kpi click-card" data-tab-jump="evidence"><span>Evidence</span><strong>${d.summary.evidenceItems}</strong></button>
          <button class="kpi click-card" data-open-id="JRN-UPGRADE-001"><span>Scenarios</span><strong>${d.summary.scenarios}</strong></button>
          <button class="kpi click-card" data-tab-jump="ri"><span>Hand off</span><strong style="font-size:16px">RI</strong></button>
        </div>
      </div>
      <table class="data-table">
        <thead><tr><th>Journey</th><th>Status</th><th>Coverage</th></tr></thead>
        <tbody>
          ${d.journeys
            .map(
              (j) => `
            <tr class="click-row" data-open-id="${j.id}">
              <td><strong>${j.name}</strong><div style="color:var(--dim);font-size:11px">${j.id}</div></td>
              <td>${j.status}</td>
              <td>${j.coverage}%</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>`;
  }

  function renderEvidence() {
    document.getElementById("panel-evidence").innerHTML = `
      <table class="data-table">
        <thead><tr><th>ID</th><th>Title</th><th>Type</th><th>Status</th><th>Requirement</th></tr></thead>
        <tbody>
          ${d.evidence
            .map(
              (e) => `
            <tr class="click-row" data-open-id="${e.id}">
              <td><strong>${e.id}</strong></td>
              <td>${e.title}</td>
              <td>${e.type}</td>
              <td>${e.status}</td>
              <td><button class="chip-btn" data-open-id="${e.requirementId}">${e.requirementId}</button></td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>`;
  }

  function renderRi() {
    document.getElementById("panel-ri").innerHTML = `
      <div class="panel" style="padding:18px">
        <div class="kicker">Release decision center</div>
        <h2 style="margin:8px 0">${d.project.releaseDecision} DECISION</h2>
        <p class="subcopy">Waiting for human governance. AIR reports validation readiness as ${d.project.validationReadiness}.</p>
        <div class="kpi-grid">
          <div class="kpi"><span>Requirement readiness</span><strong style="font-size:16px">Review</strong><em>From RIE</em></div>
          <div class="kpi"><span>Validation readiness</span><strong style="font-size:16px;color:var(--amber)">${d.project.validationReadiness}</strong><em>From AIR</em></div>
          <div class="kpi"><span>Possible decisions</span><strong style="font-size:14px">GO · CONDITIONAL GO · NO-GO</strong><em>RI + approvers</em></div>
        </div>
        <div class="cta-row">
          <button class="btn btn-ghost" type="button" data-tab-jump="evidence">View Evidence</button>
          <button class="btn btn-ghost" type="button" data-tab-jump="risks">View Risks</button>
          <button class="btn btn-primary" type="button" id="fakeApprove">Simulate approval (demo)</button>
        </div>
      </div>`;
  }

  function renderTrace() {
    document.getElementById("panel-trace").innerHTML = `
      <div class="chain">
        <button class="chain-step click-row" data-open-id="REQ-1.2" style="width:100%;text-align:left"><code>REQ-1.2</code><span>Session continuity on upgrade</span><strong>RIE</strong></button>
        <button class="chain-step click-row" data-open-id="JRN-UPGRADE-001" style="width:100%;text-align:left"><code>JRN-UPGRADE-001</code><span>Subscription Upgrade</span><strong>Journey</strong></button>
        <button class="chain-step click-row" data-open-id="EVD-001" style="width:100%;text-align:left"><code>EVD-001</code><span>Session remains after upgrade</span><strong>Evidence</strong></button>
        <button class="chain-step click-row" data-tab-jump="air" style="width:100%;text-align:left"><code>READINESS</code><span>${d.project.validationReadiness}</span><strong>AIR</strong></button>
        <button class="chain-step click-row" data-tab-jump="ri" style="width:100%;text-align:left"><code>DECISION</code><span>${d.project.releaseDecision}</span><strong>RI</strong></button>
      </div>`;
  }

  function renderKnowledge() {
    document.getElementById("panel-knowledge").innerHTML = `
      <div class="platform-grid">
        ${d.knowledge
          .map(
            (k) => `
          <button type="button" class="platform-item click-card" data-open-id="${k.id}" style="text-align:left">
            <strong>${k.type}</strong>
            <span>${k.title}</span>
            <em style="display:block;margin-top:8px;color:var(--lime);font-size:11px">${k.status}</em>
          </button>`
          )
          .join("")}
      </div>`;
  }

  function renderAll() {
    document.getElementById("wsProjectId").textContent = d.project.id;
    document.getElementById("wsProjectName").textContent = d.project.name;
    document.getElementById("railReadiness").textContent = d.project.validationReadiness;
    document.getElementById("railRelease").textContent = `${d.project.releaseDecision} · RI`;
    renderKpis();
    renderTabs();
    renderOverview();
    renderAttention();
    renderRequirements();
    renderDependencies();
    renderRisks();
    renderQuestions();
    renderAir();
    renderEvidence();
    renderRi();
    renderTrace();
    renderKnowledge();
  }

  document.addEventListener("click", (event) => {
    const jump = event.target.closest("[data-tab-jump], [data-tab]");
    if (jump && (jump.dataset.tabJump || jump.dataset.tab)) {
      const tab = jump.dataset.tabJump || jump.dataset.tab;
      if (document.getElementById(`panel-${tab}`)) {
        event.preventDefault();
        setTab(tab);
      }
    }
    if (event.target.id === "fakeApprove" || event.target.closest("#fakeApprove")) {
      window.PIOSApp.toast("Demo only — RI approval requires human governance in real product");
      window.PIOSApp.openDrawer({
        kicker: "RI · Demo",
        title: "Approval not auto-granted",
        body: `<p>AIR may recommend. AI may explain. Only authorized stakeholders through RI can issue GO / CONDITIONAL GO / NO-GO with evidence, blockers, and history.</p>`,
      });
    }
  });

  document.getElementById("seedDemoBtn")?.addEventListener("click", () => {
    window.PIOSApp.saveState({ analyzed: true, project: d.project, summary: d.summary });
    window.PIOSApp.toast("Demo data loaded into local workspace state");
  });

  renderAll();
  const initial = (location.hash || "#overview").replace("#", "");
  setTab(document.getElementById(`panel-${initial}`) ? initial : "overview");
})();
