const fs = require('fs');
const path = require('path');
const air = JSON.parse(fs.readFileSync('execution-report/air-results.json', 'utf8'));

const tests = air.tests || air.results || air.executedTests || [];
console.log('top keys', Object.keys(air).slice(0, 40).join(', '));
console.log('summary', JSON.stringify(air.summary || air.executionSummary || {}, null, 2).slice(0, 800));

function walk(node, acc = []) {
  if (!node || typeof node !== 'object') return acc;
  if (Array.isArray(node)) {
    node.forEach((item) => walk(item, acc));
    return acc;
  }
  const status = String(node.status || node.outcome || '').toLowerCase();
  const title = node.title || node.name || node.testTitle;
  if (title && (status === 'failed' || status === 'unexpected' || node.ok === false)) {
    acc.push(node);
  }
  return acc;
}

const failed = [];
const candidates = ['tests', 'failedTests', 'results', 'testResults', 'executions'];
for (const key of candidates) {
  if (air[key]) {
    console.log('array', key, Array.isArray(air[key]) ? air[key].length : typeof air[key]);
  }
}

const all = Array.isArray(air.tests) ? air.tests : [];
const fails = all.filter((t) => String(t.status || '').toLowerCase() === 'failed' || t.failed === true || (t.outcome === 'failed'));
console.log('tests length', all.length, 'fails', fails.length);
if (fails[0]) console.log('fail keys', Object.keys(fails[0]).join(', '));

const titles = new Map();
for (const t of all) {
  const title = t.title || t.name || '';
  if (!title) continue;
  if (!titles.has(title)) titles.set(title, []);
  titles.get(title).push({ status: t.status, file: t.file || t.spec || t.location, id: t.id || t.testId });
}
const dups = [...titles.entries()].filter(([, v]) => v.length > 1);
console.log('duplicate titles', dups.length);

const out = {
  failCount: fails.length,
  fails: fails.map((t) => ({
    title: t.title || t.name,
    module: t.module || t.area,
    file: t.file || t.specFile || t.location,
    error: String(t.error || t.message || t.errorMessage || t.failure || '').slice(0, 400),
    screenshot: t.screenshot || t.screenshots || t.attachments,
    status: t.status,
  })),
  duplicateTitles: dups.slice(0, 40).map(([title, items]) => ({
    title,
    count: items.length,
    items: items.slice(0, 6),
  })),
};
fs.writeFileSync('tmp/failure-extract.json', JSON.stringify(out, null, 2));
console.log('wrote tmp/failure-extract.json', fails.length, 'fails', dups.length, 'dups');
