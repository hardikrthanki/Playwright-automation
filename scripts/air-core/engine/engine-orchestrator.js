const { buildExecutionSummary } = require('./execution-summary-engine');
const { buildModules } = require('./module-engine');
const { mapEvidence } = require('./evidence-engine');
const { buildFailedTests } = require('./failure-engine');
const { buildExecutionContext } = require('./execution-context-engine');
const { buildDiscovery } = require('./discovery-engine');
const { buildBusinessJourneys, calculateBusinessHealth } = require('./journey-engine');
const { calculateQuality } = require('./quality-engine');
const { buildReleaseDecision } = require('./release-engine');
const { buildRecommendations } = require('../services/recommendation-engine');
const { buildHistory } = require('./history-engine');
const { buildSearchIndex } = require('./search-engine');
const { buildCoverageGaps } = require('./coverage-gap-engine');
const { buildValidationIntelligence } = require('./validation-intelligence-engine');

function createEngine(name, execute, options = {}) {
  return {
    name,
    continueOnError: options.continueOnError ?? false,
    execute,
  };
}

function buildManualDefectTests(manualDefects = []) {
  return manualDefects
    .filter(defect => defect.enabled !== false)
    .map((defect, index) => ({
      id: defect.id ?? `manual-defect-${index + 1}`,
      title: defect.title ?? defect.testName ?? `Manual defect ${index + 1}`,
      file: defect.source ?? 'manual-defect',
      status: 'failed',
      durationMs: 0,
      error: defect.errorMessage ?? defect.description ?? 'Manual product defect recorded in AIR.',
      module: defect.module,
      critical: defect.severity === 'Critical' || defect.critical === true,
      category: defect.category,
      businessImpact: defect.businessImpact,
      recommendedInvestigationAction: defect.recommendedInvestigationAction,
      manualDefect: true,
    }));
}

function averagePercent(values = []) {
  const numericValues = values.filter(value => typeof value === 'number');

  if (numericValues.length === 0) {
    return 0;
  }

  return Math.round(numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length);
}

function getDedupeStatusPriority(status) {
  const priorities = {
    failed: 5,
    interrupted: 4,
    flaky: 3,
    passed: 2,
    skipped: 1,
    unknown: 0,
  };

  return priorities[status] ?? priorities.unknown;
}

function dedupeAirTests(tests = []) {
  const groups = tests.reduce((map, test) => {
    const id = test.canonicalId ?? test.id;

    if (!map.has(id)) {
      map.set(id, []);
    }

    map.get(id).push(test);

    return map;
  }, new Map());
  const duplicateCanonicalTestIds = [];
  const dedupedTests = [];

  for (const [id, records] of groups.entries()) {
    const preferred = [...records].sort((left, right) =>
      getDedupeStatusPriority(right.status) - getDedupeStatusPriority(left.status)
    )[0];

    if (records.length > 1) {
      duplicateCanonicalTestIds.push({
        id,
        count: records.length,
      });
    }

    dedupedTests.push({
      ...preferred,
      attempts: records.flatMap(record => record.attempts ?? []),
      attemptCount: records.reduce((sum, record) => sum + Math.max(1, record.attemptCount ?? record.attempts?.length ?? 1), 0),
      durationMs: records.reduce((sum, record) => sum + (record.durationMs ?? 0), 0),
      attachments: records.flatMap(record => record.attachments ?? []),
      duplicateSourceRecords: records.length,
      deduplicated: records.length > 1,
    });
  }

  return {
    tests: dedupedTests,
    duplicateCanonicalTestIds,
    duplicateCount: duplicateCanonicalTestIds.reduce((sum, duplicate) => sum + duplicate.count - 1, 0),
  };
}

function getDefaultEnginePipeline() {
  return [
    createEngine('Manual Defect Engine', (model, context) => {
      const includeManualDefects =
        process.env.AIR_INCLUDE_MANUAL_DEFECTS === 'true' ||
        context.config.includeManualDefects === true;

      if (!includeManualDefects) {
        return {
          ...model,
          manualDefectsIncluded: false,
        };
      }

      const manualDefectTests = buildManualDefectTests(context.config.manualDefects);

      return {
        ...model,
        manualDefectsIncluded: manualDefectTests.length > 0,
        tests: [
          ...model.tests,
          ...manualDefectTests,
        ],
      };
    }),
    createEngine('Canonical Test Dedupe Engine', model => {
      const deduped = dedupeAirTests(model.tests);

      return {
        ...model,
        tests: deduped.tests,
        deduplication: {
          canonicalTestIds: deduped.duplicateCanonicalTestIds,
          duplicateCount: deduped.duplicateCount,
        },
      };
    }),
    createEngine('Execution Summary Engine', model => {
      const summary = buildExecutionSummary(model.tests);

      return {
        ...model,
        summary,
        execution: {
          ...model.execution,
          durationMs: summary.durationMs,
          duration: summary.duration,
        },
      };
    }),
    createEngine('Module Engine', (model, context) => ({
      ...model,
      modules: buildModules(model.tests, context.config),
    })),
    createEngine('Discovery Engine', (model, context) => ({
      ...model,
      discovery: buildDiscovery({
        tests: model.tests,
        config: context.config,
        existingHistory: context.existingHistory,
      }),
    })),
    createEngine('Evidence Engine', (model, context) => ({
      ...model,
      evidence: mapEvidence(model.tests, context.projectRoot, context.fs, context.path, context.config.evidence),
    })),
    createEngine('Failure Engine', model => {
      const failedTests = buildFailedTests(model.tests, model.evidence);

      return {
        ...model,
        failedTests,
        failures: failedTests,
      };
    }),
    createEngine('Coverage Gap Engine', (model, context) => ({
      ...model,
      coverageGaps: buildCoverageGaps(model.tests, {
        fs: context.fs,
        path: context.path,
        projectRoot: context.projectRoot,
      }),
    })),
    createEngine('Execution Context Engine', (model, context) => ({
      ...model,
      executionContext: buildExecutionContext({
        tests: model.tests,
        modules: model.modules,
        summary: model.summary,
        config: context.config,
      }),
    })),
    createEngine('Journey Engine', (model, context) => {
      const businessJourneys = buildBusinessJourneys({
        modules: model.modules,
        failedTests: model.failedTests,
        executionSummary: model.summary,
        executionScope: model.executionContext?.type,
        config: context.config,
        thresholds: context.config.releaseThresholds,
      });
      const businessHealth = calculateBusinessHealth(
        businessJourneys,
        model.summary.passRate,
        model.failedTests.filter(failure => (failure.failureType ?? 'Product') === 'Product').length
      );

      return {
        ...model,
        businessJourneys,
        businessJourney: businessJourneys.map(journey => journey.name),
        summary: {
          ...model.summary,
          businessHealth,
          journeyCoverage: averagePercent(businessJourneys.map(journey => journey.coverage)),
          criticalJourneyCoverage: averagePercent(
            businessJourneys
              .filter(journey => journey.critical)
              .map(journey => journey.coverage)
          ),
        },
      };
    }),
    createEngine('Quality Engine', (model, context) => {
      const quality = calculateQuality({
        summary: model.summary,
        modules: model.modules,
        businessJourneys: model.businessJourneys,
        evidence: model.evidence,
        failedTests: model.failedTests,
      }, context.config);

      return {
        ...model,
        quality,
        summary: {
          ...model.summary,
          qualityScore: quality.score,
        },
      };
    }),
    createEngine('Release Engine', (model, context) => {
      const release = buildReleaseDecision({
        summary: model.summary,
        failedTests: model.failedTests,
        modules: model.modules,
        businessJourneys: model.businessJourneys,
        evidence: model.evidence,
        quality: model.quality,
        config: context.config,
      });

      return {
        ...model,
        release,
        releaseDecision: release,
        summary: {
          ...model.summary,
          releaseDecision: release.status,
          estimatedReleaseRisk: release.riskLevel,
        },
      };
    }),
    createEngine('Recommendation Engine', model => ({
      ...model,
      recommendations: buildRecommendations(model.release, model.modules, model.futureValidation),
    })),
    createEngine('History Engine', (model, context) => ({
      ...model,
      history: buildHistory(model, context.existingHistory, context.config),
    })),
    createEngine('Validation Intelligence Engine', model => buildValidationIntelligence(model)),
    createEngine('Search Engine', model => ({
      ...model,
      searchIndex: buildSearchIndex(model),
    })),
  ];
}

function shouldContinueOnError(engine, context = {}) {
  const engineConfig = context.config?.engineOrchestrator ?? {};

  if (engineConfig.continueOnError === true) {
    return true;
  }

  if (Array.isArray(engineConfig.continueOnErrorEngines)) {
    return engineConfig.continueOnErrorEngines.includes(engine.name);
  }

  return engine.continueOnError === true;
}

function runEnginePipeline(initialModel, context = {}, engines = getDefaultEnginePipeline()) {
  const engineLog = [];
  let model = initialModel;

  for (const engine of engines) {
    const startedAt = new Date().toISOString();

    try {
      model = engine.execute(model, context);
      engineLog.push({
        engine: engine.name,
        status: 'passed',
        startedAt,
        endedAt: new Date().toISOString(),
      });
    } catch (error) {
      const continueOnError = shouldContinueOnError(engine, context);
      engineLog.push({
        engine: engine.name,
        status: 'failed',
        startedAt,
        endedAt: new Date().toISOString(),
        reason: error?.message ?? String(error),
        continueOnError,
      });

      if (!continueOnError) {
        model.engineLog = engineLog;
        throw error;
      }
    }
  }

  return {
    ...model,
    engineLog,
  };
}

module.exports = {
  buildManualDefectTests,
  createEngine,
  dedupeAirTests,
  getDefaultEnginePipeline,
  runEnginePipeline,
};
