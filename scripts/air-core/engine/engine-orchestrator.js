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

function createEngine(name, execute, options = {}) {
  return {
    name,
    continueOnError: options.continueOnError ?? false,
    execute,
  };
}

function getDefaultEnginePipeline() {
  return [
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
        model.summary.failed
      );

      return {
        ...model,
        businessJourneys,
        businessJourney: businessJourneys.map(journey => journey.name),
        summary: {
          ...model.summary,
          businessHealth,
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
  createEngine,
  getDefaultEnginePipeline,
  runEnginePipeline,
};
