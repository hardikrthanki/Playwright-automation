const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const batchesDir = path.join(projectRoot, 'execution-report', 'playwright-batches');
const outputPath = path.join(projectRoot, 'test-results', 'results.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function mergeStats(target, source) {
  const stats = source.stats ?? {};
  target.expected += stats.expected ?? 0;
  target.skipped += stats.skipped ?? 0;
  target.unexpected += stats.unexpected ?? 0;
  target.flaky += stats.flaky ?? 0;
  target.duration += stats.duration ?? 0;
}

function mergeResults() {
  if (!fs.existsSync(batchesDir)) {
    throw new Error(`No batch results directory found: ${batchesDir}`);
  }

  const files = fs
    .readdirSync(batchesDir)
    .filter(file => file.endsWith('.json'))
    .sort();

  if (files.length === 0) {
    throw new Error(`No batch JSON files found in ${batchesDir}`);
  }

  const merged = {
    config: null,
    suites: [],
    errors: [],
    stats: {
      startTime: new Date().toISOString(),
      duration: 0,
      expected: 0,
      skipped: 0,
      unexpected: 0,
      flaky: 0,
    },
  };

  for (const file of files) {
    const batch = readJson(path.join(batchesDir, file));

    if (!merged.config && batch.config) {
      merged.config = batch.config;
    }

    merged.suites.push(...(batch.suites ?? []));
    merged.errors.push(...(batch.errors ?? []));
    mergeStats(merged.stats, batch);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(merged, null, 2)}\n`);

  console.log(`Merged ${files.length} Playwright batch result file(s).`);
  console.log(`Output: ${outputPath}`);
  console.log(
    `Summary: ${merged.stats.expected} passed/expected, ${merged.stats.unexpected} failed, ${merged.stats.skipped} skipped, ${merged.stats.flaky} flaky`
  );
}

mergeResults();
