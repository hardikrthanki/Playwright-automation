const fs = require('fs');
const f = process.argv[2];
const t = fs.readFileSync(f, 'utf8').replace(/\x1b\[[0-9;]*m/g, '');
const out = [];
for (const line of t.split(/\r?\n/)) {
  if (/^\s+(ok|x|-)\s+\d+ /.test(line)) out.push(line.replace(/\[j\d+\] › tests\\\w+\.spec\.ts:\d+:\d+ › /, '').trim().slice(0, 200));
  else if (/\[scenario\].*(FAILED)/.test(line)) out.push('   ' + line.slice(0, 420));
  else if (/^\s+\d+ (passed|failed|skipped)|passed \(|failed$/.test(line)) out.push(line.trim());
}
fs.writeFileSync(f + '.sum.txt', out.join('\n'));
