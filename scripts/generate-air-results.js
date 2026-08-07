const path = require('path');
const { writeAirResults } = require('./air-model');

const projectRoot = path.resolve(__dirname, '..');
const { outputPath, airResults } = writeAirResults(projectRoot);
const validationSummaryPath = path.join(
  path.dirname(outputPath),
  'validation-summary.md'
);

console.log(`AIR results created: ${outputPath}`);
console.log(`AIR validation summary created: ${validationSummaryPath}`);
console.log(
  `AIR summary: ${airResults.summary.total} tests, ${airResults.summary.passed} passed, ${airResults.summary.failed} failed, release ${airResults.summary.releaseDecision}`
);
