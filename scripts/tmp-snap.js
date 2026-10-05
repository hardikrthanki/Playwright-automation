const fs = require('fs');
const path = require('path');

const roots = process.argv.slice(2);
for (const root of roots) {
  const file = path.join('test-results', root, 'error-context.md');
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\n/).filter((line) =>
    /button |link |menuitem |heading |tab /i.test(line) &&
    !/ref=e\d+\]:$/.test(line.trim())
  );
  console.log('\n==== ' + root);
  console.log(lines.slice(0, 80).join('\n'));
}
