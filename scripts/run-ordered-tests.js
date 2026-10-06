const { spawnSync } = require('child_process');
const path = require('path');

const {
  assertAllSpecsAreListed,
  printOrder,
  printSchedule,
  scheduleGroups,
  suites,
  testPaths
} = require('./execution-order');

assertAllSpecsAreListed();

const suiteName = process.argv[2];
const extra = process.argv.slice(3);

if (suiteName === 'schedule') {
  printSchedule();
  process.exit(0);
}

if (!suiteName || !suites[suiteName]) {
  console.error(
    'Usage: node scripts/run-ordered-tests.js <suite> [-- playwright args]'
  );
  console.error(`Suites: ${Object.keys(suites).sort().join(', ')}`);
  process.exit(1);
}

const files = testPaths(suites[suiteName]);
const playwright = path.join(
  __dirname,
  '..',
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'playwright.cmd' : 'playwright'
);

const scheduleBand = scheduleGroups.find((band) => band.id === suiteName);

if (scheduleBand) {
  const included = scheduleGroups.filter(
    (band) => band.priority <= scheduleBand.priority
  );

  console.log(
    `Priority ${scheduleBand.priority} (${scheduleBand.cadence}): ${files.length} spec file(s)`
  );

  for (const band of included) {
    console.log(`Priority ${band.priority} — ${band.cadence}`);

    for (const group of band.groups) {
      console.log(`  ${group.name}: ${group.files.length} specs`);
    }
  }
} else {
  console.log(`Journey-ordered suite "${suiteName}": ${files.length} spec file(s)`);
  printOrder(suites[suiteName]);
}

const result = spawnSync(
  playwright,
  ['test', ...files, ...extra],
  {
    cwd: path.join(__dirname, '..'),
    env: process.env,
    shell: true,
    stdio: 'inherit'
  }
);

process.exit(result.status ?? 1);
