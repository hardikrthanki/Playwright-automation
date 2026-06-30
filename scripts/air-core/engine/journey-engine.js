function normalizeJourneyInput(input, config) {
  if (Array.isArray(input)) {
    return {
      modules: input,
      failedTests: [],
      config,
      thresholds: config?.releaseThresholds ?? {},
      executionSummary: undefined,
      executionScope: undefined,
    };
  }

  return {
    modules: input?.modules ?? [],
    failedTests: input?.failedTests ?? [],
    config: input?.config ?? config ?? {},
    thresholds: input?.thresholds ?? input?.config?.releaseThresholds ?? config?.releaseThresholds ?? {},
    executionSummary: input?.executionSummary,
    executionScope: input?.executionScope,
  };
}

function matchesPattern(value, patterns = []) {
  const normalizedValue = String(value ?? '').toLowerCase();

  return patterns.some(pattern => normalizedValue.includes(String(pattern).toLowerCase()));
}

function getJourneyModules(journeyConfig, modules) {
  if (Array.isArray(journeyConfig.modules) && journeyConfig.modules.length > 0) {
    return journeyConfig.modules;
  }

  return modules
    .filter(module => matchesPattern(module.name, journeyConfig.patterns ?? []))
    .map(module => module.name);
}

function getJourneyModuleRecords(journeyModules, modules) {
  return journeyModules
    .map(moduleName => modules.find(module => module.name === moduleName))
    .filter(Boolean);
}

function getNotExecutedModules(journeyModules, modules) {
  return journeyModules.filter(moduleName => {
    const module = modules.find(item => item.name === moduleName);

    return !module || module.total === 0;
  });
}

function getFailedDependencies(journeyModules, failedTests) {
  return failedTests.filter(failure => journeyModules.includes(failure.module));
}

function calculateCoverage(journeyModules, notExecutedSteps) {
  if (journeyModules.length === 0) {
    return 0;
  }

  return Math.round(((journeyModules.length - notExecutedSteps.length) / journeyModules.length) * 100);
}

function getJourneyStatus(journey, thresholds = {}) {
  if (journey.testCount === 0) {
    return 'Not Executed';
  }

  if (journey.failedDependencies.length > 0 && journey.critical) {
    return 'Critical';
  }

  if (journey.failedCount > 0 && journey.critical) {
    return 'Critical';
  }

  if (journey.notExecutedSteps.length > 0) {
    return 'Partial';
  }

  if (journey.failedCount > 0 || journey.skipped > 0 || journey.interrupted > 0) {
    return 'Warning';
  }

  if (journey.health < (thresholds.journeyHealthyScore ?? 90)) {
    return 'Warning';
  }

  return 'Healthy';
}

function getAffectedModules(journeyModuleRecords, failedDependencies) {
  return [...new Set(
    [
      ...journeyModuleRecords
        .filter(module => module.failed > 0 || module.skipped > 0 || module.interrupted > 0)
        .map(module => module.name),
      ...failedDependencies.map(failure => failure.module),
    ]
      .filter(Boolean)
)].sort((left, right) => left.localeCompare(right));
}

function getJourneyRecommendation(journey) {
  if (journey.status === 'Not Executed') {
    return 'Add or run coverage for this business journey before using it for release confidence.';
  }

  if (journey.status === 'Critical') {
    return 'Investigate failed critical journey evidence before release approval.';
  }

  if (journey.status === 'Warning') {
    return 'Review journey warnings, failed checks, or skipped coverage.';
  }

  if (journey.status === 'Partial') {
    return 'Complete missing module coverage for this journey.';
  }

  return 'Continue monitoring this journey.';
}

function buildBusinessJourneys(input, legacyConfig) {
  const { modules, failedTests, config, thresholds, executionScope } = normalizeJourneyInput(input, legacyConfig);

  return (config.businessJourneys ?? []).map(journey => {
    const journeyModules = getJourneyModules(journey, modules);
    const journeyModuleRecords = getJourneyModuleRecords(journeyModules, modules);
    const failedDependencies = getFailedDependencies(journeyModules, failedTests);
    const notExecutedSteps = getNotExecutedModules(journeyModules, modules);
    const total = journeyModuleRecords.reduce((sum, module) => sum + (module.total ?? 0), 0);
    const passed = journeyModuleRecords.reduce((sum, module) => sum + (module.passed ?? 0), 0);
    const failed = journeyModuleRecords.reduce((sum, module) => sum + (module.failed ?? 0), 0);
    const skipped = journeyModuleRecords.reduce((sum, module) => sum + (module.skipped ?? 0), 0);
    const interrupted = journeyModuleRecords.reduce((sum, module) => sum + (module.interrupted ?? 0), 0);
    const health = total === 0 ? 0 : Math.round((passed / total) * 100);
    const coverage = calculateCoverage(journeyModules, notExecutedSteps);
    const enrichedJourney = {
      id: String(journey.name ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name: journey.name,
      critical: Boolean(journey.critical),
      executionScope: executionScope ?? 'Regression',
      total,
      passed,
      failed,
      skipped,
      interrupted,
      score: health,
      health,
      healthPercentage: health,
      coverage,
      testCount: total,
      failedCount: failed,
      modules: journeyModules,
      affectedModules: getAffectedModules(journeyModuleRecords, failedDependencies),
      failedDependencies: failedDependencies.map(failure => ({
        testId: failure.testId,
        testName: failure.testName,
        module: failure.module,
        severity: failure.severity,
        category: failure.category,
      })),
      notExecutedSteps,
      criticalSteps: journeyModuleRecords
        .filter(module => module.critical)
        .map(module => module.name),
    };
    const status = getJourneyStatus(enrichedJourney, thresholds);

    return {
      ...enrichedJourney,
      status,
      risk: status === 'Critical'
        ? 'High'
        : ['Warning', 'Partial'].includes(status)
          ? 'Medium'
          : status === 'Not Executed'
            ? 'No Data'
            : 'Low',
      executionState: status === 'Not Executed'
        ? 'Not Executed'
        : status === 'Partial'
          ? 'Partial'
          : 'Executed',
      recommendation: getJourneyRecommendation({
        ...enrichedJourney,
        status,
      }),
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
  calculateCoverage,
  calculateBusinessHealth,
  getAffectedModules,
  getFailedDependencies,
  getJourneyStatus,
  getJourneyModuleRecords,
  getNotExecutedModules,
};
