const fs = require('fs');
const path = require('path');
const { execFileSync, execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const packagePath = path.join(projectRoot, 'package.json');
const modulesPath = path.join(projectRoot, 'config', 'air.modules.json');
const journeysPath = path.join(projectRoot, 'config', 'air.journeys.json');
const outputDir = path.join(projectRoot, 'inventory-report');
const outputPath = path.join(outputDir, 'index.html');
const playwrightBin = path.join(
  projectRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'playwright.cmd' : 'playwright'
);

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  return JSON.parse(
    fs.readFileSync(filePath, 'utf8')
  );
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function toTitle(value) {
  return String(value ?? '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalize(value) {
  return String(value ?? '')
    .toLowerCase();
}

function extractScriptFiles(script) {
  return [
    ...String(script ?? '')
      .matchAll(/tests[\\/][^\s]+?\.spec\.ts/g)
  ].map(match =>
    match[0].replaceAll('\\', '/')
  );
}

function collectSuiteMembership(packageJson) {
  const scripts = packageJson.scripts ?? {};
  const memberships = new Map();

  for (const [scriptName, command] of Object.entries(scripts)) {
    if (!scriptName.startsWith('test:')) {
      continue;
    }

    for (const file of extractScriptFiles(command)) {
      if (!memberships.has(file)) {
        memberships.set(file, new Set());
      }

      memberships.get(file).add(
        scriptName.replace(/^test:/, '')
      );
    }
  }

  return memberships;
}

function getFirstMatch(name, definitions, fallback) {
  const text =
    normalize(name);

  for (const definition of definitions) {
    const patterns =
      definition.patterns ?? [];

    if (
      patterns.some(pattern =>
        text.includes(
          normalize(pattern)
        )
      )
    ) {
      return definition.name;
    }
  }

  return fallback;
}

function getCoverageType(testTitle) {
  const title =
    normalize(testTitle);

  if (
    /sql|xss|injection|protected|permission|lockout|rate limit|security|session|mfa|otp/.test(title)
  ) {
    return 'Security';
  }

  if (
    /invalid|empty|required|blocks|rejects|wrong|mismatch|missing|expired|reuse|too many|negative|disabled|guarded|without/.test(title)
  ) {
    return 'Negative';
  }

  if (
    /max|minimum|short|long|length|boundary|limit|trims|spaces|format|visibility|refresh|back|tab|enter/.test(title)
  ) {
    return 'Boundary';
  }

  return 'Positive';
}

function parsePlaywrightList(output) {
  return output
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line =>
      /^\[[^\]]+\]\s+/.test(line)
    )
    .map(line => {
      const projectMatch =
        line.match(/^\[([^\]]+)\]\s+(.+)$/);
      const project =
        projectMatch?.[1] ?? '';
      const remainder =
        projectMatch?.[2] ?? line;
      const parts =
        remainder
          .split('›')
          .map(part => part.trim())
          .filter(Boolean);
      const location =
        parts.shift() ?? '';
      const locationMatch =
        location.match(/^(.+?\.spec\.ts):(\d+):(\d+)$/);
      const file =
        (locationMatch?.[1] ?? location).replaceAll('\\', '/');
      const lineNumber =
        Number(locationMatch?.[2] ?? 0);
      const suite =
        parts.slice(0, -1).join(' > ');
      const title =
        parts.at(-1) ?? '';

      return {
        project,
        file,
        line: lineNumber,
        suite,
        title,
        fullTitle: [...parts].join(' > ')
      };
    });
}

function groupCount(items, key) {
  return items.reduce((map, item) => {
    const value =
      item[key] ?? 'Unmapped';

    map.set(
      value,
      (map.get(value) ?? 0) + 1
    );

    return map;
  }, new Map());
}

function renderCountRows(map) {
  return [...map.entries()]
    .sort((a, b) =>
      b[1] - a[1] ||
      a[0].localeCompare(b[0])
    )
    .map(([name, count]) => `
      <tr>
        <td>${escapeHtml(name)}</td>
        <td>${count}</td>
      </tr>`)
    .join('');
}

function renderSuitePills(suites) {
  if (!suites.length) {
    return '<span class="pill muted">standalone</span>';
  }

  return suites
    .map(suite => `<span class="pill">${escapeHtml(suite)}</span>`)
    .join('');
}

function renderReport(tests) {
  const now =
    new Date();
  const modules =
    groupCount(tests, 'module');
  const journeys =
    groupCount(tests, 'journey');
  const coverageTypes =
    groupCount(tests, 'coverageType');
  const files =
    groupCount(tests, 'file');
  const controlledCount =
    tests.filter(test =>
      test.suites.some(suite =>
        suite.startsWith('controlled') ||
        suite.includes('controlled')
      )
    ).length;
  const stableCount =
    tests.filter(test =>
      test.suites.includes('stable')
    ).length;
  const regressionCount =
    tests.filter(test =>
      test.suites.includes('regression')
    ).length;
  const rows =
    tests
      .map((test, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>
            <strong>${escapeHtml(test.title)}</strong>
            <span>${escapeHtml(test.suite)}</span>
          </td>
          <td>${escapeHtml(test.module)}</td>
          <td>${escapeHtml(test.journey)}</td>
          <td><span class="type">${escapeHtml(test.coverageType)}</span></td>
          <td>${renderSuitePills(test.suites)}</td>
          <td>
            <code>${escapeHtml(test.file)}:${test.line}</code>
          </td>
        </tr>`)
      .join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AIR Test Inventory Report</title>
<style>
:root{
  --bg:#07101f;
  --panel:#0b1728;
  --panel2:#0f1d32;
  --line:rgba(116,139,171,.24);
  --green:#39e75f;
  --text:#eef6ff;
  --muted:#9fb0c6;
  --blue:#55a7ff;
}
*{box-sizing:border-box}
body{margin:0;background:radial-gradient(circle at top left,rgba(57,231,95,.12),transparent 32%),var(--bg);color:var(--text);font-family:Inter,Segoe UI,Arial,sans-serif}
main{max-width:1480px;margin:0 auto;padding:34px}
.hero{display:grid;grid-template-columns:1.2fr .8fr;gap:24px;align-items:stretch;margin-bottom:24px}
.hero-card,.panel{border:1px solid var(--line);border-radius:20px;background:linear-gradient(145deg,rgba(15,29,50,.94),rgba(7,16,31,.96));box-shadow:0 24px 60px rgba(0,0,0,.22)}
.hero-card{padding:34px}
.brand{color:var(--green);font-weight:900;letter-spacing:.08em;font-size:13px;text-transform:uppercase}
h1{font-size:42px;letter-spacing:-.04em;line-height:1.05;margin:12px 0}
p{color:var(--muted);font-size:16px;line-height:1.55;margin:0}
.hero-side{padding:24px;display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.metric{border:1px solid rgba(57,231,95,.18);border-radius:16px;background:rgba(7,16,31,.72);padding:18px}
.metric span{display:block;color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.1em}
.metric strong{display:block;margin-top:8px;font-size:30px;color:var(--green)}
.grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px;margin-bottom:24px}
.panel{padding:22px}
h2{font-size:20px;margin:0 0 14px;letter-spacing:-.02em}
table{width:100%;border-collapse:collapse}
th{text-align:left;color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid var(--line);padding:10px}
td{border-bottom:1px solid rgba(116,139,171,.12);padding:11px 10px;vertical-align:top}
td strong{display:block}
td span{display:block;color:var(--muted);font-size:12px;margin-top:4px}
.pill,.type{display:inline-block;margin:2px 4px 2px 0;padding:4px 8px;border-radius:999px;background:rgba(57,231,95,.12);border:1px solid rgba(57,231,95,.28);color:#bfffd0;font-size:11px;font-weight:800}
.pill.muted{background:rgba(159,176,198,.10);border-color:rgba(159,176,198,.22);color:var(--muted)}
.type{background:rgba(85,167,255,.12);border-color:rgba(85,167,255,.25);color:#b8ddff}
code{color:#cfe0f5;font-size:12px}
.toolbar{display:flex;gap:12px;align-items:center;justify-content:space-between;margin:0 0 14px}
input{width:min(460px,100%);border:1px solid var(--line);border-radius:12px;background:#07101f;color:var(--text);padding:12px 14px;font:inherit}
.full{margin-top:24px}
.note{margin-top:12px;color:var(--muted);font-size:13px}
@media(max-width:1000px){main{padding:18px}.hero,.grid{grid-template-columns:1fr}.hero-side{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.hero-side{grid-template-columns:1fr}h1{font-size:32px}table{font-size:13px}}
</style>
</head>
<body>
<main>
  <section class="hero">
    <div class="hero-card">
      <div class="brand">AIR • Automation Intelligence Report</div>
      <h1>Test Inventory Report</h1>
      <p>This report lists every Playwright test discovered in the automation project without executing the suite. Use it for QA coverage review, planning, and client-facing test inventory discussions.</p>
      <p class="note">Generated ${escapeHtml(now.toLocaleString())}. This is an inventory report, not an execution result report.</p>
    </div>
    <div class="hero-side hero-card">
      <div class="metric"><span>Total Tests</span><strong>${tests.length}</strong></div>
      <div class="metric"><span>Spec Files</span><strong>${files.size}</strong></div>
      <div class="metric"><span>Regression Mapped</span><strong>${regressionCount}</strong></div>
      <div class="metric"><span>Controlled Mapped</span><strong>${controlledCount}</strong></div>
      <div class="metric"><span>Stable Mapped</span><strong>${stableCount}</strong></div>
      <div class="metric"><span>Modules</span><strong>${modules.size}</strong></div>
    </div>
  </section>

  <section class="grid">
    <div class="panel"><h2>Tests By Module</h2><table><tbody>${renderCountRows(modules)}</tbody></table></div>
    <div class="panel"><h2>Tests By Journey</h2><table><tbody>${renderCountRows(journeys)}</tbody></table></div>
    <div class="panel"><h2>Coverage Type</h2><table><tbody>${renderCountRows(coverageTypes)}</tbody></table></div>
  </section>

  <section class="panel full">
    <div class="toolbar">
      <h2>Complete Test Inventory</h2>
      <input id="search" type="search" placeholder="Search tests, modules, journeys, files...">
    </div>
    <table id="inventory">
      <thead>
        <tr>
          <th>#</th>
          <th>Test</th>
          <th>Module</th>
          <th>Journey</th>
          <th>Type</th>
          <th>Suites</th>
          <th>File</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </section>
</main>
<script>
const search = document.getElementById('search');
const rows = [...document.querySelectorAll('#inventory tbody tr')];
search.addEventListener('input', () => {
  const value = search.value.trim().toLowerCase();
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(value) ? '' : 'none';
  });
});
</script>
</body>
</html>`;
}

function main() {
  const packageJson =
    readJson(packagePath, {});
  const moduleConfig =
    readJson(modulesPath, { modules: [] });
  const journeyConfig =
    readJson(journeysPath, { businessJourneys: [] });
  const suiteMembership =
    collectSuiteMembership(packageJson);
  const output =
    process.platform === 'win32'
      ? execSync(
        `"${playwrightBin}" test --list`,
        {
          cwd: projectRoot,
          encoding: 'utf8'
        }
      )
      : execFileSync(
        playwrightBin,
        ['test', '--list'],
        {
          cwd: projectRoot,
          encoding: 'utf8'
        }
      );
  const tests =
    parsePlaywrightList(output)
      .map(test => {
        const searchableText =
          `${test.file} ${test.suite} ${test.title}`;

        return {
          ...test,
          module:
            getFirstMatch(
              searchableText,
              moduleConfig.modules ?? [],
              'Unmapped'
            ),
          journey:
            getFirstMatch(
              searchableText,
              journeyConfig.businessJourneys ?? [],
              'Unmapped'
            ),
          coverageType:
            getCoverageType(
              searchableText
            ),
          suites:
            [
              ...(suiteMembership.get(test.file) ?? [])
            ].sort()
        };
      });

  fs.mkdirSync(
    outputDir,
    {
      recursive: true
    }
  );

  fs.writeFileSync(
    outputPath,
    renderReport(tests),
    'utf8'
  );

  console.log(
    `Inventory report created: ${outputPath}`
  );

  console.log(
    `Inventory summary: ${tests.length} tests in ${new Set(tests.map(test => test.file)).size} files`
  );
}

main();
