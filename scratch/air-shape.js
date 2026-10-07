const fs = require('fs');
const r = JSON.parse(fs.readFileSync('execution-report/air-results.json', 'utf8'));
const h = JSON.parse(fs.readFileSync('execution-report/history/air-history.json', 'utf8'));
const out = [];
out.push('RESULTS top keys: ' + Object.keys(r).join(', '));
for (const k of Object.keys(r)) {
  const v = r[k];
  out.push(k + ': ' + (Array.isArray(v) ? 'array[' + v.length + '] first=' + JSON.stringify(v[0]).slice(0, 700) : typeof v === 'object' && v ? 'obj keys=' + Object.keys(v).slice(0, 25).join(',') : String(v).slice(0, 100)));
}
out.push('HISTORY top: ' + (Array.isArray(h) ? 'array[' + h.length + '] first=' + JSON.stringify(h[0]).slice(0, 900) : Object.keys(h).join(', ')));
if (!Array.isArray(h)) {
  for (const k of Object.keys(h)) {
    const v = h[k];
    out.push('H.' + k + ': ' + (Array.isArray(v) ? 'array[' + v.length + '] first=' + JSON.stringify(v[0]).slice(0, 900) : JSON.stringify(v).slice(0, 300)));
  }
}
fs.writeFileSync('scratch/air-shape.txt', out.join('\n'));
