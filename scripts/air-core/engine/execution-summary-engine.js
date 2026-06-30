const { formatDuration } = require('../services/duration');

function countByStatus(tests, status) {
  return tests.filter(test => test.status === status).length;
}

function calculateRate(part, total) {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

function hasFlakySignal(test) {
  if (typeof test.flaky === 'boolean') {
    return test.flaky;
  }

  if (typeof test.retry === 'number') {
    return test.retry > 0 && test.status === 'passed';
  }

  return false;
}

function getExecutionStatus({ total, failed, interrupted }) {
  if (total === 0) {
    return 'No Data Available';
  }

  if (interrupted > 0) {
    return 'Interrupted';
  }

  if (failed > 0) {
    return 'Failed';
  }

  return 'Passed';
}

function buildExecutionSummary(tests = []) {
  const total = tests.length;
  const passed = countByStatus(tests, 'passed');
  const failed = countByStatus(tests, 'failed');
  const skipped = countByStatus(tests, 'skipped');
  const interrupted = countByStatus(tests, 'interrupted');
  const flaky = tests.filter(hasFlakySignal).length;
  const durationMs = tests.reduce((sum, test) => sum + (test.durationMs ?? 0), 0);
  const passRate = calculateRate(passed, total);
  const failureRate = calculateRate(failed, total);

  return {
    total,
    passed,
    failed,
    skipped,
    flaky,
    interrupted,
    durationMs,
    duration: formatDuration(durationMs),
    passRate,
    failureRate,
    executionStatus: getExecutionStatus({ total, failed, interrupted }),
  };
}

module.exports = {
  buildExecutionSummary,
  calculateRate,
  countByStatus,
  getExecutionStatus,
  hasFlakySignal,
};
