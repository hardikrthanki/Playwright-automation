function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function getConfiguredModules(config = {}) {
  return (config.modules ?? []).map(module => module.name ?? module).filter(Boolean);
}

function getExecutedModules(modules = []) {
  return modules
    .filter(module => (module.total ?? 0) > 0)
    .map(module => module.name)
    .filter(Boolean);
}

function getCoverage(executedModules = [], configuredModules = []) {
  if (configuredModules.length === 0) {
    return executedModules.length > 0 ? 100 : 0;
  }

  return Math.round((executedModules.length / configuredModules.length) * 100);
}

function hasTitleSignal(tests = [], patterns = []) {
  return tests.some(test => {
    const title = String(test.title ?? '').toLowerCase();

    return patterns.some(pattern => title.includes(String(pattern).toLowerCase()));
  });
}

function detectExecutionType({ tests = [], modules = [], config = {} }) {
  const configuredType = process.env.AIR_EXECUTION_TYPE ?? config.executionContext?.type;

  if (configuredType) {
    return configuredType;
  }

  const executedModules = getExecutedModules(modules);
  const configuredModules = getConfiguredModules(config);
  const coverage = getCoverage(executedModules, configuredModules);

  if (executedModules.length === 1) return 'Module';
  if (executedModules.includes('Accessibility') && executedModules.length <= 2) return 'Accessibility';
  if (coverage >= (config.executionContext?.regressionCoverageThreshold ?? 70)) return 'Regression';
  if (hasTitleSignal(tests, ['smoke', 'critical flow'])) return 'Smoke';
  if (hasTitleSignal(tests, ['api '])) return 'API';
  if (hasTitleSignal(tests, ['database', 'db '])) return 'Database';
  if (hasTitleSignal(tests, ['performance', 'load', 'duration'])) return 'Performance';
  if (hasTitleSignal(tests, ['security', 'xss', 'sql injection'])) return 'Security';

  return executedModules.length > 0 ? 'Feature' : 'No Data Available';
}

function getScope(type, executedModules = [], configuredModules = []) {
  if (type === 'Regression') return 'Whole Product';
  if (type === 'Smoke') return 'Critical Flows';
  if (type === 'Module') return `${executedModules[0] ?? 'Module'} Only`;
  if (['API', 'Database', 'Performance', 'Security', 'Accessibility'].includes(type)) return `${type} Validation`;
  if (type === 'No Data Available') return 'No execution data available';

  return executedModules.length > 0
    ? `${executedModules.length} of ${configuredModules.length || executedModules.length} modules`
    : 'Custom Execution';
}

function getValidationLevel(type, coverage) {
  if (type === 'Regression') {
    return coverage >= 100 ? 'Full Product Validation' : 'Partial Product Regression';
  }

  if (type === 'No Data Available') {
    return 'No Data Available';
  }

  if (coverage < 100) {
    return 'Partial Validation';
  }

  return `${type} Validation`;
}

function calculateConfidence(summary = {}, coverage = 0, type = '') {
  if (type === 'No Data Available') {
    return 0;
  }

  const passRate = summary.passRate ?? 0;

  return Math.round((passRate * 0.7) + (coverage * 0.3));
}

function buildExecutionContext({ tests = [], modules = [], summary = {}, config = {} }) {
  const configuredModules = getConfiguredModules(config);
  const executedModules = unique(getExecutedModules(modules));
  const coverage = getCoverage(executedModules, configuredModules);
  const type = detectExecutionType({ tests, modules, config });

  return {
    type,
    scope: getScope(type, executedModules, configuredModules),
    executedModules,
    configuredModules,
    coverage,
    confidence: calculateConfidence(summary, coverage, type),
    validationLevel: getValidationLevel(type, coverage),
  };
}

function execute(model, context = {}) {
  return {
    ...model,
    executionContext: buildExecutionContext({
      tests: model.tests,
      modules: model.modules,
      summary: model.summary,
      config: context.config,
    }),
  };
}

module.exports = {
  buildExecutionContext,
  calculateConfidence,
  detectExecutionType,
  execute,
  getCoverage,
  getExecutedModules,
  getValidationLevel,
};
