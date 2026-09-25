const fs = require('fs');

const airPath = 'execution-report/air-results.json';
const air = JSON.parse(fs.readFileSync(airPath, 'utf8'));
const html = fs.readFileSync('execution-report/index.html', 'utf8');

const s = air.summary;
console.log('SUMMARY', {
  total: s.total,
  executed: s.executed,
  passed: s.passed,
  failed: s.failed,
  quality: s.qualityScore,
  decision: s.releaseDecision,
});

// Split module cards without catastrophic regex
const cardChunks = html.split('class="module-health-card').slice(1);
const cards = cardChunks.map((chunk) => {
  const name = (chunk.match(/data-module="([^"]+)"/) || [])[1];
  const status = (chunk.match(/class="badge[^"]*"[^>]*>([^<]+)</) || [])[1];
  const health = Number((chunk.match(/module-health-score">\s*<strong>(\d+)%/) || [])[1]);
  const stats = [...chunk.matchAll(/<b>(\d+%?)<\/b><small>(Passed|Ran|Planned)<\/small>/g)];
  const map = Object.fromEntries(stats.map((x) => [x[2], x[1]]));
  return {
    name,
    status,
    health,
    passed: Number(map.Passed),
    ran: Number(map.Ran),
    planned: Number(String(map.Planned || '').replace('%', '')),
  };
}).filter((c) => c.name);

console.log('\nMODULE CARDS FROM HTML:', cards.length);
for (const c of cards) {
  console.log([c.name, c.status, c.health + '%', `${c.passed}/${c.ran}`, `planned=${c.planned}%`].join(' | '));
}

console.log('\nMODULE MATCH:');
let moduleMismatches = 0;
for (const m of air.modules || []) {
  const c = cards.find((x) => x.name === m.name);
  const planned = m.total ? Math.round((m.executed / m.total) * 100) : 0;
  if (!c) {
    console.log('MISSING', m.name);
    moduleMismatches++;
    continue;
  }
  const ok =
    c.health === m.score &&
    c.passed === m.passed &&
    c.ran === m.executed &&
    c.planned === planned &&
    c.status === m.status;
  if (!ok) {
    moduleMismatches++;
    console.log('MISMATCH', m.name, { air: { score: m.score, passed: m.passed, executed: m.executed, planned, status: m.status }, html: c });
  } else {
    console.log('OK', m.name);
  }
}

// Journey nodes
const journeyChunks = html.split('class="journey-node').slice(1);
const jhtml = journeyChunks.map((chunk) => {
  const name = (chunk.match(/data-journey="([^"]+)"/) || [])[1];
  const pct = Number((chunk.match(/<span>(\d+)%<\/span>/) || [])[1]);
  const status = (chunk.match(/<small>([^<]+)<\/small>/) || [])[1];
  return { name, pct, status };
}).filter((j) => j.name);

console.log('\nJOURNEY NODES FROM HTML:', jhtml.length);
for (const j of jhtml) console.log([j.name, j.pct + '%', j.status].join(' | '));

console.log('\nJOURNEY MATCH:');
let journeyMismatches = 0;
const journeys = air.businessJourneys || [];
for (const j of journeys) {
  const h = jhtml.find((x) => x.name === j.name);
  const expectedPct = j.score ?? j.health ?? 0;
  if (!h) {
    console.log('MISSING', j.name);
    journeyMismatches++;
    continue;
  }
  const ok = h.pct === expectedPct && h.status === j.status;
  if (!ok) {
    journeyMismatches++;
    console.log('MISMATCH', j.name, { html: h, air: { score: j.score, health: j.health, coverage: j.coverage, status: j.status, p: j.passed, e: j.executed, t: j.total } });
  } else {
    console.log('OK', j.name, `(${j.passed}/${j.executed}/${j.total}, coverage=${j.coverage})`);
  }
}

// KPIs
const ranKpi = html.match(/executive-kpi mark-good"><span>Ran<\/span><strong>(\d+)<\/strong><small>(\d+)% of plan<\/small>/);
const areasKpi = html.match(/Areas<\/span><strong>(\d+)<\/strong><small>(\d+) healthy of (\d+)/);
const pathsKpi = html.match(/Paths<\/span><strong>(\d+)<\/strong><small>(\d+) healthy of (\d+)/);
console.log('\nKPI HTML:', { ran: ranKpi && ranKpi.slice(1), areas: areasKpi && areasKpi.slice(1), paths: pathsKpi && pathsKpi.slice(1) });

const healthyMods = (air.modules || []).filter((x) => x.status === 'Healthy').length;
const healthyJ = journeys.filter((x) => x.status === 'Healthy').length;
console.log('DERIVED', {
  healthyMods,
  totalMods: (air.modules || []).length,
  healthyJ,
  totalJ: journeys.length,
  plannedPct: Math.round((s.executed / s.total) * 100),
});

console.log('\nVERDICT', {
  moduleMismatches,
  journeyMismatches,
  sumExecOk: (air.modules || []).reduce((a, m) => a + (m.executed || 0), 0) === s.executed,
});
