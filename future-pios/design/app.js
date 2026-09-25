/* Shared interactive helpers for isolated PIOS design prototype */
(function () {
  const ALIASES = {
    Payment: "DEP-01",
    Subscription: "DEP-01",
    Entitlement: "DEP-02",
    "Active Sessions": "DEP-03",
    Notification: "DEP-05",
    Audit: "DEP-04",
    Billing: "DEP-02",
    "Identity Service": "DEP-04",
    "NFR-2.3": "EVD-002",
    "sample11.pdf": "DOC-SAMPLE",
    "Subscription_FRD.pdf": "DOC-FRD",
    "NFR_Pack.pdf": "DOC-NFR",
    "Page 2": "DOC-SAMPLE",
    "Paragraph 4": "DOC-SAMPLE",
    CONDITIONAL: "TOPIC-READINESS",
    PENDING: "TOPIC-RELEASE",
    READINESS: "TOPIC-READINESS",
    DECISION: "TOPIC-RELEASE",
  };

  function ensureShell() {
    if (document.getElementById("pios-drawer")) return;
    const drawer = document.createElement("div");
    drawer.id = "pios-drawer";
    drawer.className = "pios-drawer";
    drawer.hidden = true;
    drawer.innerHTML = `
      <div class="pios-drawer-backdrop" data-close></div>
      <aside class="pios-drawer-panel" role="dialog" aria-modal="true">
        <header class="pios-drawer-head">
          <div>
            <div class="kicker" id="pios-drawer-kicker">Detail</div>
            <h3 id="pios-drawer-title">Detail</h3>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-close>Close</button>
        </header>
        <div class="pios-drawer-body" id="pios-drawer-body"></div>
      </aside>
    `;
    document.body.appendChild(drawer);
    drawer.addEventListener("click", (event) => {
      if (event.target.matches("[data-close], .pios-drawer-backdrop")) closeDrawer();
    });
  }

  function openDrawer({ kicker = "Detail", title = "", body = "" } = {}) {
    ensureShell();
    document.getElementById("pios-drawer-kicker").textContent = kicker;
    document.getElementById("pios-drawer-title").textContent = title;
    document.getElementById("pios-drawer-body").innerHTML = body;
    document.getElementById("pios-drawer").hidden = false;
    document.body.classList.add("drawer-open");
  }

  function closeDrawer() {
    const drawer = document.getElementById("pios-drawer");
    if (!drawer) return;
    drawer.hidden = true;
    document.body.classList.remove("drawer-open");
  }

  function toast(message) {
    ensureShell();
    let el = document.getElementById("pios-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "pios-toast";
      el.className = "pios-toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function saveState(partial) {
    const current = loadState();
    localStorage.setItem(window.PIOS_STATE_KEY, JSON.stringify({ ...current, ...partial, updatedAt: Date.now() }));
  }

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(window.PIOS_STATE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function baseHref(path) {
    const nested = /\/(products|platform)\//.test(location.pathname);
    return `${nested ? "../" : ""}${path}`;
  }

  function chip(id) {
    return `<button type="button" class="chip-btn" data-open-id="${id}">${id}</button>`;
  }

  function chipRow(ids) {
    return `<div class="chip-row">${(ids || []).filter(Boolean).map(chip).join("")}</div>`;
  }

  function findEntity(rawId) {
    const d = window.PIOS_DEMO;
    if (!d || !rawId) return null;
    let id = String(rawId).trim();

    // Strip labels like "Subscription_FRD.pdf · p2"
    if (id.includes("·")) id = id.split("·")[0].trim();
    if (ALIASES[id]) id = ALIASES[id];

    // Topic shortcuts after alias
    const topicKey = String(id).startsWith("TOPIC-")
      ? String(id).replace(/^TOPIC-/, "").toLowerCase()
      : null;
    if (topicKey && d.topics?.[topicKey]) {
      return { type: "Topic", item: { ...d.topics[topicKey], id: topicKey } };
    }
    if (d.topics?.[id]) {
      return { type: "Topic", item: { ...d.topics[id], id } };
    }

    const pools = [
      ["Requirement", d.requirements],
      ["Business Rule", d.rules],
      ["Dependency", d.dependencies],
      ["Risk", d.risks],
      ["Question", d.questions],
      ["Evidence", d.evidence],
      ["Journey", d.journeys],
      ["Knowledge", d.knowledge],
      ["Finding", d.findings],
      ["Document", d.documents],
      ["Topic", d.topicsList],
    ];

    for (const [type, list] of pools) {
      const hit = (list || []).find((item) => item.id === id || item.name === rawId || item.title === rawId);
      if (hit) return { type, item: hit };
    }

    // depGraph by name / id
    const node = (d.depGraph || []).find((n) => n.id === id || n.name === rawId || n.name === id);
    if (node) {
      if (node.openId) return findEntity(node.openId);
      return {
        type: "Dependency Node",
        item: { id: node.id, title: node.name, ...node },
      };
    }

    // Fuzzy: match requirement/rule ids inside string
    const idMatch = String(rawId).match(/\b(REQ-[\d.]+|BR-\d+|DEP-\d+|RISK-\d+|GAP-\d+|EVD-\d+|JRN-[\w-]+|K-\d+|f\d+)\b/i);
    if (idMatch) return findEntity(idMatch[1]);

    return null;
  }

  function relatedFor(type, item) {
    const d = window.PIOS_DEMO;
    const ids = new Set();
    if (item.requirementId) ids.add(item.requirementId);
    if (item.riskId) ids.add(item.riskId);
    if (item.source) ids.add(item.source);
    if (item.openId) ids.add(item.openId);
    if (item.links) {
      Object.values(item.links).flat().forEach((x) => ids.add(x));
      if (Array.isArray(item.links)) item.links.forEach((x) => ids.add(x));
    }
    if (type === "Requirement") {
      (d.rules || []).filter((r) => r.requirementId === item.id).forEach((r) => ids.add(r.id));
      (d.risks || []).filter((r) => r.requirementId === item.id).forEach((r) => ids.add(r.id));
      (d.questions || []).filter((q) => q.requirementId === item.id).forEach((q) => ids.add(q.id));
      (d.evidence || []).filter((e) => e.requirementId === item.id).forEach((e) => ids.add(e.id));
      (d.dependencies || []).filter((dep) => dep.requirementId === item.id).forEach((dep) => ids.add(dep.id));
    }
    return [...ids].filter((x) => x && x !== item.id);
  }

  function renderEntityBody(type, item) {
    const related = relatedFor(type, item);
    const relatedBlock = related.length
      ? `<div class="detail-block"><div class="kicker">Related intelligence</div>${chipRow(related)}</div>`
      : "";

    if (type === "Requirement") {
      return `
        <div class="detail-block"><div class="kicker">Status</div><p>${item.status} · ${item.priority}</p></div>
        <div class="detail-block"><div class="kicker">Business objective</div><p>${item.objective}</p></div>
        <div class="detail-block"><div class="kicker">Actors</div><p>${item.actors.join(" · ")}</p></div>
        <div class="detail-block"><div class="kicker">Acceptance criteria</div><ul>${item.ac.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        ${relatedBlock}
        <div class="cta-row"><a class="btn btn-primary btn-sm" href="${baseHref("workspace.html#requirements")}">Open in Workspace</a></div>
      `;
    }
    if (type === "Dependency" || type === "Dependency Node") {
      return `<div class="detail-block"><p><strong>${item.from || item.name || item.title}</strong>${item.to ? ` → <strong>${item.to}</strong>` : ""}</p>
        <p>Type: ${item.type || "—"}</p>
        ${item.criticality ? `<p>Criticality: ${item.criticality}</p>` : ""}
        ${item.role ? `<p>${item.role}</p>` : ""}
        ${item.requirementId ? `<p>Requirement: ${chip(item.requirementId)}</p>` : ""}</div>${relatedBlock}`;
    }
    if (type === "Risk") {
      return `<div class="detail-block"><p>Level: ${item.level}</p><p>Owner: ${item.owner}</p><p>${item.why}</p>
        <p>Requirement: ${chip(item.requirementId)}</p></div>${relatedBlock}`;
    }
    if (type === "Question") {
      return `<div class="detail-block"><p>${item.text}</p><p>Priority: ${item.priority}</p>
        <p>Requirement: ${chip(item.requirementId)}</p>
        <p>Risk: ${chip(item.riskId)}</p></div>${relatedBlock}`;
    }
    if (type === "Evidence") {
      return `<div class="detail-block"><p>Type: ${item.type}</p><p>Status: ${item.status}</p>
        <p>Requirement: ${chip(item.requirementId)}</p></div>${relatedBlock}
        <div class="cta-row"><a class="btn btn-ghost btn-sm" href="${baseHref("workspace.html#evidence")}">View Evidence</a></div>`;
    }
    if (type === "Business Rule") {
      return `<div class="detail-block"><p>${item.title}</p><p>Severity: ${item.severity}</p>
        <p>Requirement: ${chip(item.requirementId)}</p></div>${relatedBlock}`;
    }
    if (type === "Journey") {
      return `<div class="detail-block"><p>${item.name}</p><p>Status: ${item.status}</p><p>Coverage: ${item.coverage}%</p></div>
        ${relatedBlock}
        <div class="cta-row"><a class="btn btn-ghost btn-sm" href="${baseHref("workspace.html#air")}">Open AIR</a></div>`;
    }
    if (type === "Knowledge") {
      return `<div class="detail-block"><p>Type: ${item.type}</p><p>Status: ${item.status}</p><p>${item.title}</p></div>
        ${relatedBlock}
        <div class="cta-row"><a class="btn btn-ghost btn-sm" href="${baseHref("platform/knowledge.html")}">Knowledge platform</a></div>`;
    }
    if (type === "Finding") {
      return `<div class="detail-block"><p>${item.text}</p>
        <p>Source: ${chip(item.source)}</p>
        <p>Confidence ${item.confidence}% · Impact ${item.impact} · Evidence ${item.evidence}</p>
        <blockquote>“${item.quote}”</blockquote></div>${relatedBlock}`;
    }
    if (type === "Document") {
      const src = window.PIOS_DEMO?.sourceEvidence || {};
      return `<div class="detail-block"><p>${item.title || item.id}</p><p>${item.detail || ""}</p>
        ${item.requirementId ? `<p>Linked requirement: ${chip(item.requirementId)}</p>` : ""}
        ${src.highlight ? `<div class="ev-source" style="margin-top:12px"><p class="ev-highlight">${src.highlight}</p></div>` : ""}
        </div>${relatedBlock}`;
    }
    if (type === "Topic") {
      return `<div class="detail-block"><p>${item.summary || item.detail || ""}</p>
        ${item.stats ? `<p>${item.stats}</p>` : ""}
        ${item.related ? chipRow(item.related) : ""}
        </div>
        ${item.href ? `<div class="cta-row"><a class="btn btn-primary btn-sm" href="${baseHref(item.href)}">${item.cta || "Open"}</a></div>` : ""}`;
    }
    return `<div class="detail-block"><pre>${JSON.stringify(item, null, 2)}</pre></div>${relatedBlock}`;
  }

  function openTopic(key) {
    const d = window.PIOS_DEMO;
    const topic = d?.topics?.[key] || d?.topics?.[key?.toLowerCase?.()];
    if (!topic) {
      openDrawer({
        kicker: "Topic",
        title: key,
        body: `<div class="detail-block"><p>No detailed topic data for “${key}”.</p>${listAllQuickLinks()}</div>`,
      });
      return;
    }
    openDrawer({
      kicker: topic.kicker || "Topic",
      title: topic.title || key,
      body: renderEntityBody("Topic", { ...topic, id: key }),
    });
  }

  function listAllQuickLinks() {
    const d = window.PIOS_DEMO;
    if (!d) return "";
    const ids = [
      ...(d.requirements || []).map((x) => x.id),
      ...(d.risks || []).map((x) => x.id),
      ...(d.questions || []).map((x) => x.id),
      ...(d.evidence || []).map((x) => x.id),
    ].slice(0, 12);
    return `<div class="kicker">Browse related</div>${chipRow(ids)}`;
  }

  function openEntity(id) {
    if (!id) return;
    const key = String(id).trim();
    const topics = window.PIOS_DEMO?.topics || {};

    // Direct topic keys: "requirements", "TOPIC-READINESS", etc.
    const topicKey = key.startsWith("TOPIC-")
      ? key.replace(/^TOPIC-/, "").toLowerCase() === "readiness"
        ? "readiness"
        : key.replace(/^TOPIC-/, "").toLowerCase() === "release"
          ? "release"
          : key.replace(/^TOPIC-/, "").toLowerCase()
      : key;
    if (topics[topicKey]) {
      const topic = topics[topicKey];
      openDrawer({
        kicker: topic.kicker || "Overview",
        title: topic.title || topicKey,
        body: renderEntityBody("Topic", { ...topic, id: topicKey }),
      });
      return;
    }
    if (topics[key]) {
      const topic = topics[key];
      openDrawer({
        kicker: topic.kicker || "Overview",
        title: topic.title || key,
        body: renderEntityBody("Topic", { ...topic, id: key }),
      });
      return;
    }

    const found = findEntity(key);
    if (!found) {
      const d = window.PIOS_DEMO;
      openDrawer({
        kicker: "Linked data",
        title: key,
        body: `<div class="detail-block"><p>Related project intelligence for <strong>${key}</strong>.</p>
          <p>Project: ${d?.project?.name || "—"} · Validation: ${d?.project?.validationReadiness || "—"} · Release: ${d?.project?.releaseDecision || "—"}</p>
          ${listAllQuickLinks()}</div>`,
      });
      return;
    }
    openDrawer({
      kicker: found.type,
      title: found.item.title || found.item.name || found.item.text || found.item.id || key,
      body: renderEntityBody(found.type, found.item),
    });
  }

  function openTopicKey(key) {
    openEntity(key);
  }

  document.addEventListener("click", (event) => {
    const openBtn = event.target.closest("[data-open-id]");
    if (openBtn) {
      event.preventDefault();
      event.stopPropagation();
      openEntity(openBtn.dataset.openId);
      return;
    }

    const topicBtn = event.target.closest("[data-topic]");
    if (topicBtn) {
      event.preventDefault();
      event.stopPropagation();
      openTopicKey(topicBtn.dataset.topic);
      return;
    }

    const promptBtn = event.target.closest("[data-ai-prompt]");
    if (promptBtn && window.PIOS_DEMO) {
      event.preventDefault();
      const prompt = window.PIOS_DEMO.aiPrompts.find((p) => p.id === promptBtn.dataset.aiPrompt);
      if (!prompt) return;
      openDrawer({
        kicker: "AI Assistant",
        title: prompt.label,
        body: `<div class="detail-block"><p>${prompt.answer}</p>
          <p class="subcopy">Answer grounded in representative project knowledge. AI assists. Humans govern.</p>
          ${chipRow(["REQ-1.2", "DEP-01", "RISK-05", "EVD-001"])}</div>`,
      });
    }
  });

  window.PIOSApp = {
    openDrawer,
    closeDrawer,
    toast,
    saveState,
    loadState,
    openEntity,
    openTopic: openTopicKey,
    findEntity,
  };
})();
