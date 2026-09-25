(() => {
  const d = window.PIOS_DEMO;
  if (!d) return;

  const heroMetrics = document.getElementById("homeHeroMetrics");
  if (heroMetrics) {
    heroMetrics.innerHTML = `
      <button type="button" class="metric click-row" data-open-id="REQ-1.2" style="width:100%;text-align:left;background:transparent;border:0;padding:0;cursor:pointer"><span>Requirement understood</span><strong>Complete</strong></button>
      <button type="button" class="metric click-row" data-topic="dependencies" style="width:100%;text-align:left;background:transparent;border:0;padding:0;cursor:pointer"><span>Dependencies found</span><strong>${d.summary.dependencies}</strong></button>
      <button type="button" class="metric click-row" data-topic="risks" style="width:100%;text-align:left;background:transparent;border:0;padding:0;cursor:pointer"><span>Risks identified</span><strong>${d.summary.risks}</strong></button>
      <button type="button" class="metric click-row" data-open-id="JRN-UPGRADE-001" style="width:100%;text-align:left;background:transparent;border:0;padding:0;cursor:pointer"><span>Test scenarios</span><strong>${d.summary.scenarios}</strong></button>
      <button type="button" class="metric click-row" data-topic="readiness" style="width:100%;text-align:left;background:transparent;border:0;padding:0;cursor:pointer"><span>Validation readiness</span><strong>${d.project.validationReadiness}</strong></button>
      <button type="button" class="metric click-row" data-topic="release" style="width:100%;text-align:left;background:transparent;border:0;padding:0;cursor:pointer"><span>Release decision</span><strong>Owned by RI</strong></button>
    `;
  }

  const quote = document.getElementById("homeQuote");
  if (quote) quote.textContent = `“${d.requirementText}”`;

  const attention = document.getElementById("homeAttention");
  if (attention) {
    attention.innerHTML = d.attention
      .map(
        (item) => `
      <a class="attention-item" href="${item.href}">
        <span class="dot ${item.tone === "red" ? "red" : item.tone === "green" ? "green" : ""}"></span>
        <div><strong>${item.title}</strong><span>${item.detail}</span></div>
        <em>${item.owner}</em>
      </a>`
      )
      .join("");
  }

  const chain = document.getElementById("homeChain");
  if (chain) {
    chain.innerHTML = `
      <button type="button" class="chain-step click-row" data-open-id="REQ-1.2" style="width:100%;text-align:left"><code>REQ-1.2</code><span>Session continuity on upgrade</span><strong>RIE</strong></button>
      <button type="button" class="chain-step click-row" data-open-id="JRN-UPGRADE-001" style="width:100%;text-align:left"><code>JRN-UPGRADE-001</code><span>Subscription Upgrade</span><strong>Shared</strong></button>
      <button type="button" class="chain-step click-row" data-open-id="EVD-001" style="width:100%;text-align:left"><code>EVD-001</code><span>Session remains after upgrade</span><strong>AIR</strong></button>
      <a class="chain-step" href="workspace.html#ri"><code>DEC-PENDING</code><span>Governed release decision</span><strong>RI</strong></a>
    `;
  }

  const prompts = document.getElementById("homePrompts");
  if (prompts) {
    prompts.innerHTML = d.aiPrompts
      .map(
        (p, i) => `
      <button type="button" class="prompt-btn" data-ai-prompt="${p.id}">
        <small>0${i + 1}</small>
        ${p.label}
      </button>`
      )
      .join("");
  }

  const knowledge = document.getElementById("homeKnowledge");
  if (knowledge) {
    knowledge.innerHTML = d.knowledge
      .map(
        (k) => `
      <button type="button" class="platform-item click-card" data-open-id="${k.id}" style="text-align:left">
        <strong>${k.type}</strong>
        <span>${k.title}</span>
        <em style="display:block;margin-top:8px;color:var(--lime);font-size:11px">${k.status}</em>
      </button>`
      )
      .join("");
  }

  const lifeSteps = document.querySelectorAll(".life-step");
  lifeSteps.forEach((step, index) => {
    step.style.cursor = "pointer";
    step.addEventListener("click", () => {
      const targets = [
        "start.html",
        "products/air.html",
        "platform/evidence.html",
        "products/ri.html",
        "products/oi.html",
        "platform/knowledge.html",
        "workspace.html",
      ];
      location.href = targets[index] || "workspace.html";
    });
  });
})();
