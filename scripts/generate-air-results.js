const path = require('path');
const { writeAirResults } = require('./air-model');

const projectRoot = path.resolve(__dirname, '..');
const { outputPath, airResults } = writeAirResults(projectRoot);

console.log(`AIR results created: ${outputPath}`);
console.log(
  `AIR summary: ${airResults.summary.total} tests, ${airResults.summary.passed} passed, ${airResults.summary.failed} failed, release ${airResults.summary.releaseDecision}`
);
