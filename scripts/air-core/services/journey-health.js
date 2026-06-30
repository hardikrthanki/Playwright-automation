const { matchByPatterns } = require('./module-health');

function buildBusinessJourneys(tests, config) {
  return (config.businessJourneys ?? []).map(journey => {
    const matchedTests = tests.filter(test => matchByPatterns(test.title, [journey], undefined));
    const total = matchedTests.length;
    const passed = matchedTests.filter(test => test.status === 'passed').length;
    const failed = matchedTests.filter(test => test.status === 'failed').length;
    const skipped = matchedTests.filter(test => test.status === 'skipped').length;
    const score = total === 0 ? 0 : Math.round((passed / total) * 100);

    return {
      name: journey.name,
      critical: Boolean(journey.critical),
      total,
      passed,
      failed,
      skipped,
      score,
      status: total === 0
        ? 'Not Executed'
        : failed > 0
          ? 'Needs Review'
          : 'Healthy',
    };
  });
}

function calculateBusinessHealth(journeys, passRate, failed) {
  const executedJourneys = journeys.filter(journey => journey.total > 0);

  if (executedJourneys.length === 0) {
    return failed === 0 && passRate > 0 ? 96 : passRate;
  }

  const averageJourneyScore = Math.round(
    executedJourneys.reduce((sum, journey) => sum + journey.score, 0) / executedJourneys.length
  );

  return Math.max(0, Math.round((averageJourneyScore * 0.7) + (passRate * 0.3)) - (failed * 5));
}

module.exports = {
  buildBusinessJourneys,
  calculateBusinessHealth,
};
