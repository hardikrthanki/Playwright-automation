const fs = require('fs');

const report = JSON.parse(fs.readFileSync('test-results/results.json', 'utf8'));
const failed = [];

function walk(suite, titles = []) {
  const next = suite.title ? [...titles, suite.title] : titles;
  for (const child of suite.suites || []) walk(child, next);
  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      const result = (test.results || []).find((item) => item.status === 'failed' || item.status === 'timedOut')
        || (test.results || [])[test.results.length - 1];
      if (!result || (test.status !== 'unexpected' && result.status !== 'failed' && result.status !== 'timedOut')) {
        continue;
      }
      const error = (result.errors || [])[0]?.message || result.error?.message || '';
      const clean = error.replace(/\u001b\[[0-9;]*m/g, ' ').replace(/\s+/g, ' ').trim();
      failed.push({
        title: [...next, spec.title].filter(Boolean).join(' > '),
        status: test.status || result.status,
        error: clean.slice(0, 500),
      });
    }
  }
}

for (const suite of report.suites || []) walk(suite);
console.log(`failed ${failed.length}`);
for (const item of failed) {
  console.log('\n---');
  console.log(item.title);
  console.log(item.error);
}
