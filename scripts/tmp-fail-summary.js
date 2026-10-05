const data = require('../execution-report/air-results.json');
const failed = (data.tests || []).filter((t) => t.status === 'failed');
console.log('failed count', failed.length);
for (const t of failed) {
  const err = String(t.error || '').replace(/\u001b\[[0-9;]*m/g, '').replace(/\s+/g, ' ').slice(0, 500);
  console.log('---');
  console.log(t.title);
  console.log(t.file);
  console.log(err);
}
