const { formatDuration } = require('./duration');
const { calculateBusinessHealth } = require('./journey-health');
const { calculateQualityScore } = require('./quality-score');

function countByStatus(tests, status) {
  return tests.filter(test => test.status === status).length;
}

function buildExecutionSummary(tests = [], businessJourneys = [], config = {}) {
  const total = tests.length;
  const passed = countByStatus(tests, 'passed');
  const failed = countByStatus(tests, 'failed');
  const skipped = countByStatus(tests, 'skipped');
  const interrupted = countByStatus(tests, 'interrupted');
  const durationMs = tests.reduce((sum, test) => sum + (test.durationMs ?? 0), 0);
  const passRate = total === 0 ? 0 : Math.round((passed / total) * 100);
  const businessHealth = calculateBusinessHealth(businessJourneys, passRate, failed);
  const summary = {
    total,
    passed,
    failed,
    skipped,
    interrupted,
    durationMs,
    duration: formatDuration(durationMs),
    passRate,
    businessHealth,
  };

  return {
    ...summary,
    qualityScore: calculateQualityScore(summary, config),
  };
}

module.exports = {
  buildExecutionSummary,
  countByStatus,
};
