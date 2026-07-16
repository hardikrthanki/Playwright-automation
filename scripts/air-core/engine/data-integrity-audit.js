function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function countByStatus(tests = []) {
  return asArray(tests).reduce((counts, test) => {
    const status = test.status ?? 'unknown';
    counts[status] = (counts[status] ?? 0) + 1;
    return counts;
  }, {});
}

function countSourceTests(raw = {}) {
  let total = 0;
  let attempts = 0;
  const statuses = {};

  function walk(suites = []) {
    for (const suite of suites) {
      for (const spec of suite.specs ?? []) {
        for (const test of spec.tests ?? []) {
          total += 1;
          attempts += Math.max(1, (test.results ?? []).length);
          const status = test.status ?? test.outcome ?? 'unknown';
          statuses[status] = (statuses[status] ?? 0) + 1;
        }
      }

      walk(suite.suites ?? []);
    }
  }

  if (Array.isArray(raw.suites)) {
    walk(raw.suites ?? []);
  } else if (Array.isArray(raw.files)) {
    for (const file of raw.files) {
      for (const test of file.tests ?? []) {
        total += 1;
        attempts += Math.max(1, (test.results ?? []).length);
        const status = test.status ?? test.outcome ?? 'unknown';
        statuses[status] = (statuses[status] ?? 0) + 1;
      }
    }
  }

  return {
    total,
    attempts,
    statuses,
  };
}

function findDuplicateIds(tests = []) {
  const counts = new Map();

  for (const test of asArray(tests)) {
    const id = test.canonicalId ?? test.id;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([id, count]) => ({
      id,
      count,
    }));
}

function getAllEvidenceItems(evidence = {}) {
  return [
    ...asArray(evidence.screenshots),
    ...asArray(evidence.videos),
    ...asArray(evidence.traces),
    ...asArray(evidence.logs),
    ...asArray(evidence.attachments),
  ];
}

function findOrphanEvidence(evidence = {}, tests = []) {
  const testIds = new Set(asArray(tests).map(test => test.id));

  return getAllEvidenceItems(evidence)
    .filter(item => item.testId && !testIds.has(item.testId))
    .map(item => ({
      type: item.type,
      testId: item.testId,
      path: item.path,
    }));
}

function findInvalidModuleReferences(modules = [], tests = []) {
  const testIds = new Set(asArray(tests).map(test => test.id));
  const invalid = [];

  for (const module of asArray(modules)) {
    for (const testId of asArray(module.tests)) {
      if (!testIds.has(testId)) {
        invalid.push({
          module: module.name,
          testId,
        });
      }
    }
  }

  return invalid;
}

function findInvalidJourneyReferences(businessJourneys = [], modules = [], config = {}) {
  const moduleNames = new Set([
    ...asArray(modules).map(module => module.name),
    ...asArray(config.modules).map(module => module.name ?? module),
  ].filter(Boolean));
  const invalid = [];

  for (const journey of asArray(businessJourneys)) {
    for (const moduleName of asArray(journey.modules)) {
      if (!moduleNames.has(moduleName)) {
        invalid.push({
          journey: journey.name,
          module: moduleName,
        });
      }
    }
  }

  return invalid;
}

function getFailedEvidenceStatus(failedTests = []) {
  return asArray(failedTests).map(failure => ({
    testId: failure.testId,
    testName: failure.testName,
    evidenceCount: asArray(failure.evidence).length,
    status: asArray(failure.evidence).length > 0 ? 'Evidence Available' : 'Evidence Missing',
  }));
}

function getEvidenceClassification(evidence = {}) {
  const summary = evidence.summary ?? {};

  return {
    perTestEvidence: summary.perTestEvidence ?? summary.total ?? 0,
    executionArtifacts: summary.executionArtifacts ?? summary.rawReports ?? 0,
    rawReports: summary.rawReports ?? 0,
    totalWithRawReports: summary.totalWithRawReports ?? ((summary.total ?? 0) + (summary.rawReports ?? 0)),
    rawReportsCountAsFailureEvidence: false,
  };
}

function buildDataIntegrityAudit(airResults = {}, context = {}) {
  const sourceExecution = countSourceTests(context.loaded?.raw ?? {});
  const airTests = asArray(airResults.tests);
  const airStatuses = countByStatus(airTests);
  const duplicateIds = findDuplicateIds(airTests);
  const modelDeduplicatedIds = asArray(airResults.deduplication?.canonicalTestIds);
  const orphanEvidence = findOrphanEvidence(airResults.evidence, airTests);
  const invalidModuleReferences = findInvalidModuleReferences(airResults.modules, airTests);
  const invalidJourneyReferences = findInvalidJourneyReferences(
    airResults.businessJourneys,
    airResults.modules,
    context.config
  );
  const sourceDuplicateExtraCount =
    context.loaded?.duplicateCount ??
    asArray(context.loaded?.duplicateCanonicalTestIds).reduce((sum, duplicate) => sum + (duplicate.count ?? 1) - 1, 0);
  const sourceTotal = context.loaded?.hasResults ? sourceExecution.total : airResults.summary?.total ?? 0;
  const expectedAirTotal = Math.max(0, sourceTotal - sourceDuplicateExtraCount);
  const airTotal = airResults.summary?.total ?? airTests.length;
  const difference = airTotal - expectedAirTotal;
  const historicalContaminationDetected =
    airResults.provenance?.mode === 'RESTORED_HISTORY' ||
    airResults.source?.type === 'air-history' ||
    airResults.source?.type === 'history';
  const status =
    difference === 0 &&
    duplicateIds.length === 0 &&
    orphanEvidence.length === 0 &&
    invalidModuleReferences.length === 0 &&
    invalidJourneyReferences.length === 0
      ? 'PASS'
      : 'WARN';

  return {
    generatedAt: new Date().toISOString(),
    provenance: airResults.provenance ?? {
      mode: historicalContaminationDetected ? 'RESTORED_HISTORY' : 'CURRENT_EXECUTION',
      sourceArtifact: airResults.source?.type ?? 'unknown',
      restoredFromHistory: historicalContaminationDetected,
    },
    sourceExecution: {
      source: context.loaded?.source ?? airResults.source?.type ?? 'unknown',
      total: sourceTotal,
      rawTestCount: context.loaded?.rawTestCount ?? sourceExecution.total,
      attempts: sourceExecution.attempts,
      passed: sourceExecution.statuses.expected ?? sourceExecution.statuses.passed ?? 0,
      failed: sourceExecution.statuses.unexpected ?? sourceExecution.statuses.failed ?? 0,
      skipped: sourceExecution.statuses.skipped ?? 0,
      flaky: sourceExecution.statuses.flaky ?? 0,
      interrupted: sourceExecution.statuses.interrupted ?? 0,
      statuses: sourceExecution.statuses,
    },
    airExecution: {
      total: airTotal,
      attempts: airResults.summary?.attemptCount ?? airTests.reduce((sum, test) => sum + Math.max(1, test.attemptCount ?? 1), 0),
      passed: airResults.summary?.passed ?? airStatuses.passed ?? 0,
      failed: airResults.summary?.failed ?? airStatuses.failed ?? 0,
      skipped: airResults.summary?.skipped ?? airStatuses.skipped ?? 0,
      flaky: airResults.summary?.flaky ?? airStatuses.flaky ?? 0,
      interrupted: airResults.summary?.interrupted ?? airStatuses.interrupted ?? 0,
      retryCount: airResults.summary?.retryCount ?? 0,
    },
    reconciliation: {
      status,
      sourceTotal,
      expectedAirTotal,
      airTotal,
      difference,
    },
    duplicates: {
      canonicalTestIds: [
        ...asArray(context.loaded?.duplicateCanonicalTestIds),
        ...modelDeduplicatedIds,
        ...duplicateIds,
      ],
      count: duplicateIds.length + asArray(context.loaded?.duplicateCanonicalTestIds).length + modelDeduplicatedIds.length,
      sourceDuplicateExtraCount,
      pipelineDuplicateExtraCount: airResults.deduplication?.duplicateCount ?? 0,
    },
    orphanEvidence,
    evidenceClassification: getEvidenceClassification(airResults.evidence),
    invalidModuleReferences,
    invalidJourneyReferences,
    historicalContaminationDetected,
    evidenceTraceability: {
      failedTests: getFailedEvidenceStatus(airResults.failedTests),
    },
    releaseTraceability: {
      status: asArray(airResults.release?.reasons).length > 0 &&
        asArray(airResults.release?.reasonTraceability).length > 0 ? 'PASS' : 'WARN',
      reasons: asArray(airResults.release?.reasons),
      reasonTraceability: asArray(airResults.release?.reasonTraceability),
      warnings: asArray(airResults.release?.warnings).length,
      blockers: asArray(airResults.release?.blockers).length,
    },
  };
}

module.exports = {
  buildDataIntegrityAudit,
};
