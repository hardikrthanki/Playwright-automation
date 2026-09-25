(() => {
  const d = window.PIOS_DEMO;
  if (!d) return;

  const mount = document.getElementById("productLive");
  if (!mount) return;

  const page = mount.dataset.product;

  if (page === "rie") {
    mount.innerHTML = `
      <div class="split-2">
        <div>
          <div class="kicker">${d.project.name}</div>
          <div class="kpi-grid" style="grid-template-columns:1fr 1fr">
            <button type="button" class="kpi click-card" data-open-id="REQ-1.2"><span>Requirements</span><strong>${d.summary.requirements}</strong></button>
            <button type="button" class="kpi click-card" data-open-id="DEP-01"><span>Dependencies</span><strong>${d.summary.dependencies}</strong></button>
            <button type="button" class="kpi click-card" data-open-id="RISK-05"><span>Risks</span><strong>${d.summary.risks}</strong></button>
            <button type="button" class="kpi click-card" data-open-id="GAP-03"><span>Questions</span><strong>${d.summary.questions}</strong></button>
          </div>
          <p class="subcopy">Click any metric or row. Representative project intelligence — reviewable by the team.</p>
          <table class="data-table" style="margin-top:12px">
            <thead><tr><th>ID</th><th>Title</th><th>Status</th></tr></thead>
            <tbody>
              ${d.requirements
                .map(
                  (r) => `<tr class="click-row" data-open-id="${r.id}"><td><strong>${r.id}</strong></td><td>${r.title}</td><td>${r.status}</td></tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
        <div>
          <div class="kicker">Clarification queue</div>
          <div class="attention-list" style="margin-top:12px">
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
          </div>
          <div class="cta-row" style="margin-top:14px">
            <a class="btn btn-primary btn-sm" href="../start.html">Run analyze flow →</a>
            <a class="btn btn-ghost btn-sm" href="../workspace.html#requirements">Workspace</a>
          </div>
        </div>
      </div>`;
  }

  if (page === "air") {
    mount.innerHTML = `
      <div class="kicker">Validation readiness preview</div>
      <h2 style="margin:8px 0;color:var(--amber)">${d.project.validationReadiness}</h2>
      <p class="subcopy">Confidence 82% · 0 blockers · 3 warnings · Evidence linked · Not a release decision</p>
      <div class="kpi-grid">
        <button type="button" class="kpi click-card" data-open-id="JRN-UPGRADE-001"><span>Scenarios</span><strong>${d.summary.scenarios}</strong></button>
        <button type="button" class="kpi click-card" data-open-id="EVD-001"><span>Evidence items</span><strong>${d.summary.evidenceItems}</strong></button>
        <button type="button" class="kpi click-card" data-open-id="RISK-05"><span>Open risks</span><strong>${d.summary.risks}</strong></button>
      </div>
      <table class="data-table" style="margin-top:14px">
        <thead><tr><th>Journey</th><th>Status</th><th>Coverage</th></tr></thead>
        <tbody>
          ${d.journeys
            .map(
              (j) => `<tr class="click-row" data-open-id="${j.id}"><td><strong>${j.name}</strong><div style="color:var(--dim);font-size:11px">${j.id}</div></td><td>${j.status}</td><td>${j.coverage}%</td></tr>`
            )
            .join("")}
        </tbody>
      </table>
      <div class="cta-row" style="margin-top:14px">
        <a class="btn btn-ghost" href="../workspace.html#evidence">View Evidence</a>
        <a class="btn btn-primary" href="ri.html">Hand off to RI →</a>
      </div>`;
  }

  if (page === "ri") {
    mount.innerHTML = `
      <div class="kicker">Release decision center</div>
      <h2 style="margin:8px 0">${d.project.releaseDecision} DECISION</h2>
      <p class="subcopy">Waiting for human governance. AIR reports validation readiness as <strong>${d.project.validationReadiness}</strong>.</p>
      <div class="kpi-grid">
        <button type="button" class="kpi click-card" data-open-id="REQ-1.2"><span>Requirement readiness</span><strong style="font-size:16px">Review</strong><em>From RIE</em></button>
        <a class="kpi click-card" href="../workspace.html#air"><span>Validation readiness</span><strong style="font-size:16px;color:var(--amber)">${d.project.validationReadiness}</strong><em>From AIR</em></a>
        <button type="button" class="kpi click-card" id="riSimulate"><span>Possible decisions</span><strong style="font-size:14px">GO · CONDITIONAL · NO-GO</strong><em>Humans only</em></button>
      </div>
      <div class="attention-list" style="margin-top:14px">
        ${d.attention
          .filter((a) => a.owner === "RI" || a.owner === "AIR")
          .map(
            (item) => `
          <a class="attention-item" href="../${item.href}">
            <span class="dot ${item.tone === "red" ? "red" : ""}"></span>
            <div><strong>${item.title}</strong><span>${item.detail}</span></div>
            <em>${item.owner}</em>
          </a>`
          )
          .join("")}
      </div>
      <div class="cta-row" style="margin-top:14px">
        <a class="btn btn-ghost" href="../workspace.html#evidence">View Evidence</a>
        <a class="btn btn-ghost" href="../workspace.html#risks">View Risks</a>
        <button class="btn btn-primary" type="button" id="riSimulate2">Simulate approval (demo)</button>
      </div>`;
  }

  if (page === "oi") {
    mount.innerHTML = `
      <div class="kicker">Observe · future product</div>
      <p class="subcopy">Production outcomes feed knowledge. Click lessons already captured from this demo project.</p>
      <div class="platform-grid">
        ${d.knowledge
          .slice(0, 4)
          .map(
            (k) => `
          <button type="button" class="platform-item click-card" data-open-id="${k.id}" style="text-align:left">
            <strong>${k.type}</strong>
            <span>${k.title}</span>
            <em style="display:block;margin-top:8px;color:var(--lime);font-size:11px">${k.status}</em>
          </button>`
          )
          .join("")}
      </div>
      <div class="cta-row" style="margin-top:14px">
        <a class="btn btn-ghost" href="../platform/knowledge.html">Knowledge platform</a>
        <a class="btn btn-primary" href="../workspace.html#knowledge">Workspace knowledge</a>
      </div>`;
  }

  if (page === "evidence") {
    mount.innerHTML = `
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
      </table>
      <div class="cta-row" style="margin-top:14px">
        <a class="btn btn-primary btn-sm" href="../workspace.html#evidence">Open in Workspace</a>
      </div>`;
  }

  if (page === "knowledge") {
    mount.innerHTML = `
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
      </div>
      <div class="prompt-grid" style="margin-top:18px">
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
      </div>`;
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("#riSimulate, #riSimulate2")) {
      window.PIOSApp?.toast("Demo only — RI approval requires human governance");
      window.PIOSApp?.openDrawer({
        kicker: "RI · Demo",
        title: "Approval not auto-granted",
        body: `<p>AIR may recommend. AI may explain. Only authorized stakeholders through RI can issue GO / CONDITIONAL GO / NO-GO with evidence, blockers, and history.</p>
          <div class="chip-row" style="margin-top:12px">
            <button class="chip-btn" data-open-id="EVD-001">EVD-001</button>
            <button class="chip-btn" data-open-id="RISK-05">RISK-05</button>
            <button class="chip-btn" data-open-id="GAP-03">GAP-03</button>
          </div>`,
      });
    }
  });
})();
