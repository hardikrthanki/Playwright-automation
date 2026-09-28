const fs = require('fs');
const html = fs.readFileSync('execution-report/index.html', 'utf8');
const start = html.indexOf('class="failure-evidence-board"');
const end = html.indexOf('Open the full list');
const chunk = html.slice(start, end);
const titles = [...chunk.matchAll(/<strong>([^<]+)<\/strong>/g)].map(match => match[1]);
console.log(titles.join('\n'));
