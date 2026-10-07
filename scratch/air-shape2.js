const fs = require('fs');
const r = JSON.parse(fs.readFileSync('execution-report/air-results.json', 'utf8'));
const h = JSON.parse(fs.readFileSync('execution-report/history/air-history.json', 'utf8'));
const out = [];
out.push('trends keys: ' + Object.keys(h.trends).join(','));
out.push('exec[0] keys: ' + Object.keys(h.executions[0]).join(','));
out.push('exec[last] keys: ' + Object.keys(h.executions[h.executions.length - 1]).join(','));
const last = h.executions[h.executions.length - 1];
for (const k of Object.keys(last)) {
  const v = last[k];
  if (Array.isArray(v)) out.push('  ' + k + ' array[' + v.length + '] ' + JSON.stringify(v[0]).slice(0, 250));
}
const eit = h.executionIntelligence;
out.push('execIntel keys: ' + Object.keys(eit).join(','));
out.push('failureTimelines n=' + eit.failureTimelines.length + ' names: ' + eit.failureTimelines.map((f) => f.name).slice(0, 12).join(' || '));
const ftl = eit.failureTimelines[0];
out.push('ftl[0] keys: ' + Object.keys(ftl).join(',') + ' :: ' + JSON.stringify(ftl).slice(0, 500));
const t0 = r.tests[0];
out.push('test keys: ' + Object.keys(t0).join(','));
const matrix = r.tests.filter((t) => /SubscriptionCancellationMatrix/.test(t.file));
out.push('cancel matrix tests: ' + matrix.length + ' statuses: ' + JSON.stringify(matrix.reduce((a, t) => { a[t.status] = (a[t.status] || 0) + 1; return a; }, {})));
const pn = r.tests.filter((t) => /PaymentNegative|FailedPaymentDunning/.test(t.file));
out.push('payment tests: ' + pn.length + ' statuses: ' + JSON.stringify(pn.reduce((a, t) => { a[t.status] = (a[t.status] || 0) + 1; return a; }, {})));
const si = r.searchIndex.filter((s) => /cancel/i.test(s.title)).slice(0, 3).map((s) => s.type + ':' + s.title);
out.push('searchIndex cancel samples: ' + JSON.stringify(si) + ' types: ' + JSON.stringify([...new Set(r.searchIndex.map((s) => s.type))]));
out.push('SC-164 sample title in tests: ' + (r.tests.find((t) => /SC-16[0-4]/.test(t.title)) || {}).title);
fs.writeFileSync('scratch/air-shape2.txt', out.join('\n'));
