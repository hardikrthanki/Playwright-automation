const fs = require('fs');
const titles = fs.readFileSync('scratch/titles.txt', 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
const files = fs.readdirSync('tests').filter(f => f.endsWith('.spec.ts'));
const out = [];
for (const t of titles) {
  for (const f of files) {
    const lines = fs.readFileSync('tests/' + f, 'utf8').split('\n');
    lines.forEach((l, i) => {
      if (!l.includes(t) || !/title:/.test(l)) return;
      // walk back to opening brace, forward to closing
      let s = i; while (s > 0 && !/^\s*\{\s*$/.test(lines[s])) s--;
      let e = i; while (e < lines.length - 1 && !/^\s*\},?\s*$/.test(lines[e])) e++;
      const block = lines.slice(s, e + 1).join(' ').replace(/\s+/g, ' ');
      out.push(f + ':' + (i + 1) + ' ' + block);
    });
  }
}
fs.writeFileSync('scratch/rows2.txt', out.join('\n'));
