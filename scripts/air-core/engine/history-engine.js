function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function getHistoryExecutions(history) {
  if (Array.isArray(history)) {
    return history;
  }

  return asArray(history?.executions);
}

function toTimestamp(value) {
  const time = new Date(value ?? 0).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function getReleaseStatus(item = {}) {
  return item.release?.status ?? item.releaseDecision?.status ?? item.summary?.releaseDecision ?? 'No Data Available';
}

function getQualityScore(item = {}) {
  return item.quality?.score ?? item.summary?.qualityScore ?? 0;
}

function getEvidenceTotal(item = {}) {
  return item.evidence?.summary?.total ?? item.evidence?.total ?? 0;
}

function getFailureRate(item = {}) {
  const total = item.summary?.total ?? 0;

  if (total === 0) {
    return 0;
  }

  return Math.round(((item.summary?.failed ?? 0) / total) * 10000) / 100;
}

function createExecutionSnapshot(airResults = {}) {
  return {
    generatedAt: airResults.generatedAt,
    generatedAtDisplay: airResults.generatedAtDisplay,
    project: airResults.project,
    execution: airResults.execution,
    executionContext: airResults.executionContext,
    source: airResults.source,
    summary: airResults.summary,
    quality: {
      score: airResults.quality?.score ?? airResults.summary?.qualityScore ?? 0,
      confidence: airResults.quality?.confidence ?? 0,
      grade: airResults.quality?.grade ?? 'No Data Available',
    },
    release: airResults.release,
    releaseDecision: airResults.releaseDecision,
    evidence: {
      summary: airResults.evidence?.summary ?? {},
    },
    modules: asArray(airResults.modules).map(module => ({
      name: module.name,
      critical: module.critical,
      total: module.total,
      passed: module.passed,
      failed: module.failed,
      skipped: module.skipped,
      score: module.score,
      coverage: module.coverage,
      risk: module.risk,
      status: module.status,
      recommendation: module.recommendation,
      durationMs: module.durationMs,
    })),
    tests: asArray(airResults.tests).map(test => ({
      id: test.id,
      title: test.title,
      file: test.file,
      module: test.module,
      status: test.status,
    })),
    failedTests: asArray(airResults.failedTests).map(failure => ({
      testId: failure.testId,
      testName: failure.testName,
      title: failure.title,
      module: failure.module,
      severity: failure.severity,
      category: failure.category,
      status: failure.status,
    })),
    businessJourneys: asArray(airResults.businessJourneys).map(journey => ({
      name: journey.name,
      critical: journey.critical,
      total: journey.total,
      passed: journey.passed,
      failed: journey.failed,
      score: journey.score,
      coverage: journey.coverage,
      status: journey.status,
      risk: journey.risk,
      recommendation: journey.recommendation,
    })),
  };
}

function sortExecutions(executions = []) {
  return [...executions].sort((left, right) => toTimestamp(left.generatedAt) - toTimestamp(right.generatedAt));
}

function buildTrend(executions = [], name, reader) {
  return {
    name,
    points: sortExecutions(executions).map((execution, index) => ({
      index: index + 1,
      generatedAt: execution.generatedAt,
      label: execution.generatedAtDisplay ?? execution.generatedAt ?? `Execution ${index + 1}`,
      value: reader(execution),
    })),
  };
}

function compareNumber(currentValue = 0, previousValue = 0, direction = 'higher-is-better') {
  const delta = Math.round((currentValue - previousValue) * 100) / 100;
  const improved = direction === 'higher-is-better' ? delta > 0 : delta < 0;
  const regressed = direction === 'higher-is-better' ? delta < 0 : delta > 0;

  return {
    current: currentValue,
    previous: previousValue,
    delta,
    direction: delta === 0 ? 'Stable' : improved ? 'Improved' : regressed ? 'Regressed' : 'Changed',
  };
}

function getAverageModuleCoverage(execution = {}) {
  const modules = asArray(execution.modules);

  if (modules.length === 0) {
    return 0;
  }

  return Math.round(
    modules.reduce((sum, module) => sum + (module.coverage ?? module.score ?? 0), 0) / modules.length
  );
}

function getAverageJourneyCoverage(execution = {}) {
  const journeys = asArray(execution.businessJourneys);

  if (journeys.length === 0) {
    return 0;
  }

  return Math.round(
    journeys.reduce((sum, journey) => sum + (journey.coverage ?? journey.score ?? 0), 0) / journeys.length
  );
}

function compareBuilds(executions = []) {
  const sortedExecutions = sortExecutions(executions);
  const current = sortedExecutions.at(-1);
  const previous = sortedExecutions.at(-2);

  if (!current || !previous) {
    return {
      status: 'First Execution',
      current,
      previous: undefined,
      metrics: {},
      summary: 'First Execution',
    };
  }

  const metrics = {
    quality: compareNumber(getQualityScore(current), getQualityScore(previous)),
    confidence: compareNumber(current.quality?.confidence ?? 0, previous.quality?.confidence ?? 0),
    businessHealth: compareNumber(current.summary?.businessHealth ?? 0, previous.summary?.businessHealth ?? 0),
    passRate: compareNumber(current.summary?.passRate ?? 0, previous.summary?.passRate ?? 0),
    failureRate: compareNumber(getFailureRate(current), getFailureRate(previous), 'lower-is-better'),
    failures: compareNumber(current.summary?.failed ?? 0, previous.summary?.failed ?? 0, 'lower-is-better'),
    durationMs: compareNumber(current.summary?.durationMs ?? 0, previous.summary?.durationMs ?? 0, 'lower-is-better'),
    moduleCoverage: compareNumber(getAverageModuleCoverage(current), getAverageModuleCoverage(previous)),
    journeyCoverage: compareNumber(getAverageJourneyCoverage(current), getAverageJourneyCoverage(previous)),
    evidence: compareNumber(getEvidenceTotal(current), getEvidenceTotal(previous)),
    modulesExecuted: compareNumber(asArray(current.modules).filter(module => (module.total ?? 0) > 0).length, asArray(previous.modules).filter(module => (module.total ?? 0) > 0).length),
    journeysExecuted: compareNumber(asArray(current.businessJourneys).filter(journey => (journey.total ?? 0) > 0).length, asArray(previous.businessJourneys).filter(journey => (journey.total ?? 0) > 0).length),
  };

  return {
    status: 'Compared',
    current,
    previous,
    metrics,
    summary: `Current build compared with previous build: quality ${metrics.quality.direction.toLowerCase()}, failures ${metrics.failures.direction.toLowerCase()}, duration ${metrics.durationMs.direction.toLowerCase()}.`,
  };
}

function detectRegressions(comparison = {}) {
  return Object.entries(comparison.metrics ?? {})
    .filter(([, metric]) => metric.direction === 'Regressed')
    .map(([name, metric]) => ({
      metric: name,
      previous: metric.previous,
      current: metric.current,
      delta: metric.delta,
    }));
}

function detectImprovements(comparison = {}) {
  return Object.entries(comparison.metrics ?? {})
    .filter(([, metric]) => metric.direction === 'Improved')
    .map(([name, metric]) => ({
      metric: name,
      previous: metric.previous,
      current: metric.current,
      delta: metric.delta,
    }));
}

function buildTrends(executions = []) {
  return {
    quality: buildTrend(executions, 'Quality Trend', getQualityScore),
    release: buildTrend(executions, 'Release Trend', getReleaseStatus),
    passRate: buildTrend(executions, 'Pass Rate Trend', execution => execution.summary?.passRate ?? 0),
    businessHealth: buildTrend(executions, 'Business Health Trend', execution => execution.summary?.businessHealth ?? 0),
    failures: buildTrend(executions, 'Failure Trend', execution => execution.summary?.failed ?? 0),
    failureRate: buildTrend(executions, 'Failure Rate Trend', getFailureRate),
    duration: buildTrend(executions, 'Execution Duration Trend', execution => execution.summary?.durationMs ?? 0),
    moduleCoverage: buildTrend(executions, 'Module Coverage Trend', getAverageModuleCoverage),
    journeyCoverage: buildTrend(executions, 'Journey Coverage Trend', getAverageJourneyCoverage),
    evidence: buildTrend(executions, 'Evidence Trend', getEvidenceTotal),
  };
}

function buildHistory(airResults = {}, existingHistory = [], config = {}) {
  const maxExecutions = config.historyLimit ?? config.history?.maxExecutions ?? 30;
  const previousExecutions = getHistoryExecutions(existingHistory);
  const snapshot = createExecutionSnapshot(airResults);
  const executions = [
    ...previousExecutions,
    snapshot,
  ].slice(-maxExecutions);
  const comparison = compareBuilds(executions);

  return {
    executions,
    trends: buildTrends(executions),
    comparison,
    regressions: detectRegressions(comparison),
    improvements: detectImprovements(comparison),
    summary: {
      status: comparison.status,
      totalExecutions: executions.length,
      firstExecution: executions.length <= 1,
      latestExecution: snapshot.generatedAt,
      qualityChanged: comparison.metrics?.quality?.direction ?? 'First Execution',
      releaseChanged: comparison.previous
        ? `${getReleaseStatus(comparison.previous)} -> ${getReleaseStatus(comparison.current)}`
        : 'First Execution',
    },
  };
}

function execute(model, context = {}) {
  return {
    ...model,
    history: buildHistory(model, context.existingHistory, context.config),
  };
}

module.exports = {
  buildHistory,
  buildTrend,
  compareBuilds,
  createExecutionSnapshot,
  detectImprovements,
  detectRegressions,
  execute,
  getHistoryExecutions,
};
