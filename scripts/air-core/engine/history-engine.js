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

function getTestKey(test = {}) {
  return test.id ?? `${test.file ?? 'unknown'}::${test.title ?? test.testName ?? 'unknown'}`;
}

function getFailureKey(failure = {}) {
  return failure.testId ?? failure.id ?? failure.testName ?? failure.title ?? 'unknown failure';
}

function normalizeScore(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function normalizeStatus(value, fallback = 'No Data Available') {
  return value ?? fallback;
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
  const testComparison = compareTests(current.tests, previous.tests);
  const moduleComparison = compareNamedHealthCollections(current.modules, previous.modules);
  const journeyComparison = compareNamedHealthCollections(current.businessJourneys, previous.businessJourneys);
  const failureComparison = compareFailures(current.failedTests, previous.failedTests);
  const releaseComparison = compareRelease(current, previous);

  return {
    status: 'Compared',
    current,
    previous,
    metrics,
    tests: testComparison,
    modules: moduleComparison,
    businessJourneys: journeyComparison,
    failures: failureComparison,
    release: releaseComparison,
    summary: `Current build compared with previous build: quality ${metrics.quality.direction.toLowerCase()}, failures ${metrics.failures.direction.toLowerCase()}, duration ${metrics.durationMs.direction.toLowerCase()}.`,
  };
}

function compareTests(currentTests = [], previousTests = []) {
  const currentMap = new Map(asArray(currentTests).map(test => [getTestKey(test), test]));
  const previousMap = new Map(asArray(previousTests).map(test => [getTestKey(test), test]));
  const added = [];
  const removed = [];
  const modified = [];
  const unchanged = [];

  for (const [key, test] of currentMap) {
    const previous = previousMap.get(key);

    if (!previous) {
      added.push(test);
      continue;
    }

    const changes = [];

    for (const field of ['title', 'file', 'module', 'status']) {
      if ((test[field] ?? '') !== (previous[field] ?? '')) {
        changes.push({
          field,
          previous: previous[field],
          current: test[field],
        });
      }
    }

    if (changes.length > 0) {
      modified.push({
        key,
        test,
        previous,
        changes,
      });
    } else {
      unchanged.push(test);
    }
  }

  for (const [key, test] of previousMap) {
    if (!currentMap.has(key)) {
      removed.push(test);
    }
  }

  return {
    added,
    removed,
    modified,
    unchangedCount: unchanged.length,
    summary: {
      added: added.length,
      removed: removed.length,
      modified: modified.length,
      unchanged: unchanged.length,
    },
  };
}

function compareNamedHealthCollections(currentItems = [], previousItems = []) {
  const currentMap = new Map(asArray(currentItems).map(item => [item.name, item]));
  const previousMap = new Map(asArray(previousItems).map(item => [item.name, item]));
  const added = [];
  const removed = [];
  const improved = [];
  const regressed = [];
  const modified = [];
  const stable = [];
  const notExecuted = [];

  for (const [name, current] of currentMap) {
    const previous = previousMap.get(name);
    const currentScore = normalizeScore(current.score ?? current.coverage);
    const previousScore = normalizeScore(previous?.score ?? previous?.coverage);
    const currentStatus = normalizeStatus(current.status ?? current.risk);
    const previousStatus = normalizeStatus(previous?.status ?? previous?.risk);
    const item = {
      name,
      current,
      previous,
      currentScore,
      previousScore,
      currentStatus,
      previousStatus,
      delta: Math.round((currentScore - previousScore) * 100) / 100,
    };

    if (!previous) {
      added.push(item);
    } else if ((current.total ?? 0) === 0 || currentStatus === 'Not Executed') {
      notExecuted.push(item);
    } else if (currentScore > previousScore) {
      improved.push(item);
    } else if (currentScore < previousScore || currentStatus !== previousStatus) {
      regressed.push(item);
    } else {
      stable.push(item);
    }

    if (previous && (
      currentScore !== previousScore ||
      currentStatus !== previousStatus ||
      (current.total ?? 0) !== (previous.total ?? 0) ||
      (current.failed ?? 0) !== (previous.failed ?? 0)
    )) {
      modified.push(item);
    }
  }

  for (const [name, previous] of previousMap) {
    if (!currentMap.has(name)) {
      removed.push({
        name,
        current: undefined,
        previous,
        currentScore: 0,
        previousScore: normalizeScore(previous.score ?? previous.coverage),
        currentStatus: 'Removed',
        previousStatus: normalizeStatus(previous.status ?? previous.risk),
      });
    }
  }

  return {
    added,
    removed,
    improved,
    regressed,
    modified,
    stable,
    notExecuted,
    summary: {
      added: added.length,
      removed: removed.length,
      improved: improved.length,
      regressed: regressed.length,
      modified: modified.length,
      stable: stable.length,
      notExecuted: notExecuted.length,
    },
  };
}

function compareFailures(currentFailures = [], previousFailures = []) {
  const currentMap = new Map(asArray(currentFailures).map(failure => [getFailureKey(failure), failure]));
  const previousMap = new Map(asArray(previousFailures).map(failure => [getFailureKey(failure), failure]));
  const added = [];
  const resolved = [];
  const recurring = [];
  const severityChanges = [];

  for (const [key, failure] of currentMap) {
    const previous = previousMap.get(key);

    if (!previous) {
      added.push(failure);
      continue;
    }

    recurring.push(failure);

    if ((failure.severity ?? failure.priority) !== (previous.severity ?? previous.priority)) {
      severityChanges.push({
        key,
        testName: failure.testName ?? failure.title,
        previous: previous.severity ?? previous.priority,
        current: failure.severity ?? failure.priority,
      });
    }
  }

  for (const [key, failure] of previousMap) {
    if (!currentMap.has(key)) {
      resolved.push(failure);
    }
  }

  return {
    added,
    resolved,
    recurring,
    severityChanges,
    summary: {
      added: added.length,
      resolved: resolved.length,
      recurring: recurring.length,
      severityChanges: severityChanges.length,
    },
  };
}

function compareRelease(current = {}, previous = {}) {
  const currentStatus = getReleaseStatus(current);
  const previousStatus = getReleaseStatus(previous);
  const currentReasons = asArray(current.release?.reasons ?? current.releaseDecision?.reasons);
  const previousReasons = asArray(previous.release?.reasons ?? previous.releaseDecision?.reasons);

  return {
    current: currentStatus,
    previous: previousStatus,
    changed: currentStatus !== previousStatus,
    reasonChanges: {
      added: currentReasons.filter(reason => !previousReasons.includes(reason)),
      removed: previousReasons.filter(reason => !currentReasons.includes(reason)),
    },
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
    testCount: buildTrend(executions, 'Test Count Trend', execution => execution.summary?.total ?? 0),
    passRate: buildTrend(executions, 'Pass Rate Trend', execution => execution.summary?.passRate ?? 0),
    businessHealth: buildTrend(executions, 'Business Health Trend', execution => execution.summary?.businessHealth ?? 0),
    failures: buildTrend(executions, 'Failure Trend', execution => execution.summary?.failed ?? 0),
    failureRate: buildTrend(executions, 'Failure Rate Trend', getFailureRate),
    duration: buildTrend(executions, 'Execution Duration Trend', execution => execution.summary?.durationMs ?? 0),
    moduleCoverage: buildTrend(executions, 'Module Coverage Trend', getAverageModuleCoverage),
    journeyCoverage: buildTrend(executions, 'Journey Coverage Trend', getAverageJourneyCoverage),
    evidence: buildTrend(executions, 'Evidence Trend', getEvidenceTotal),
    modules: buildNamedHealthTrends(executions, 'modules'),
    businessJourneys: buildNamedHealthTrends(executions, 'businessJourneys'),
  };
}

function buildNamedHealthTrends(executions = [], collectionName) {
  const sortedExecutions = sortExecutions(executions);
  const names = new Set();

  for (const execution of sortedExecutions) {
    for (const item of asArray(execution[collectionName])) {
      if (item.name) {
        names.add(item.name);
      }
    }
  }

  return [...names].map(name => ({
    name,
    points: sortedExecutions.map((execution, index) => {
      const item = asArray(execution[collectionName]).find(candidate => candidate.name === name);

      return {
        index: index + 1,
        generatedAt: execution.generatedAt,
        label: execution.generatedAtDisplay ?? execution.generatedAt ?? `Execution ${index + 1}`,
        score: item?.score ?? item?.coverage ?? 0,
        status: item?.status ?? 'Not Executed',
        total: item?.total ?? 0,
        failed: item?.failed ?? 0,
      };
    }),
  }));
}

function buildReleaseTimeline(executions = []) {
  return sortExecutions(executions).map((execution, index) => ({
    index: index + 1,
    build: execution.project?.build ?? execution.execution?.build ?? `Build ${index + 1}`,
    generatedAt: execution.generatedAt,
    generatedAtDisplay: execution.generatedAtDisplay,
    decision: getReleaseStatus(execution),
    qualityScore: getQualityScore(execution),
    passRate: execution.summary?.passRate ?? 0,
    failed: execution.summary?.failed ?? 0,
    durationMs: execution.summary?.durationMs ?? 0,
  }));
}

function buildExecutiveWhatChanged(comparison = {}) {
  if (comparison.status !== 'Compared') {
    return {
      status: 'First Execution',
      summary: 'This is the first recorded AIR execution. Build comparison will appear after the next execution.',
      items: [],
    };
  }

  const releaseItem = comparison.release.changed
    ? `Release changed from ${comparison.release.previous} to ${comparison.release.current}.`
    : `Release remained ${comparison.release.current}.`;
  const items = [
    releaseItem,
    `Quality ${comparison.metrics.quality.direction.toLowerCase()} by ${Math.abs(comparison.metrics.quality.delta)} point(s).`,
    `Pass rate ${comparison.metrics.passRate.direction.toLowerCase()} by ${Math.abs(comparison.metrics.passRate.delta)} point(s).`,
    `Failures ${comparison.metrics.failures.direction.toLowerCase()} by ${Math.abs(comparison.metrics.failures.delta)}.`,
    `${comparison.tests.summary.added} test(s) added, ${comparison.tests.summary.removed} removed, ${comparison.tests.summary.modified} modified.`,
    `${comparison.modules.summary.regressed} module regression(s), ${comparison.businessJourneys.summary.regressed} journey regression(s).`,
  ];

  return {
    status: 'Compared',
    summary: `AIR compared this execution with the previous stored build. Release is ${comparison.release.current}, quality is ${comparison.metrics.quality.direction.toLowerCase()}, failures are ${comparison.metrics.failures.direction.toLowerCase()}, and execution duration is ${comparison.metrics.durationMs.direction.toLowerCase()}.`,
    items,
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
    releaseTimeline: buildReleaseTimeline(executions),
    whatChanged: buildExecutiveWhatChanged(comparison),
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
  buildNamedHealthTrends,
  buildReleaseTimeline,
  buildTrend,
  compareBuilds,
  compareFailures,
  compareNamedHealthCollections,
  compareRelease,
  compareTests,
  createExecutionSnapshot,
  buildExecutiveWhatChanged,
  detectImprovements,
  detectRegressions,
  execute,
  getHistoryExecutions,
};
