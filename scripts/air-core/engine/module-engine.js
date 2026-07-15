const { formatDuration } = require('../services/duration');
const { getFailureType } = require('./failure-engine');

function matchByPatterns(title, items, fallback) {
  const normalizedTitle = String(title ?? '').toLowerCase();

  for (const item of items ?? []) {
    if ((item.patterns ?? []).some(pattern => normalizedTitle.includes(String(pattern).toLowerCase()))) {
      return item;
    }
  }

  return fallback;
}

function getModuleForTest(test, config) {
  const fallback = {
    name: 'General',
    patterns: [],
    critical: false,
  };

  return matchByPatterns(test.title, config.modules, fallback);
}

function getModuleStatus(module) {
  if (module.total === 0) {
    return 'Not Executed';
  }

  if (module.productFailed > 0 && module.critical) {
    return 'Critical';
  }

  if (module.failed > 0 || module.skipped > 0 || module.interrupted > 0) {
    return 'Warning';
  }

  if (module.score >= 90) {
    return 'Healthy';
  }

  return 'Warning';
}

function getModuleRisk(module) {
  if (module.productFailed > 0 && module.critical) {
    return 'High';
  }

  if (module.failed > 0 || module.skipped > 0 || module.interrupted > 0) {
    return 'Medium';
  }

  return 'Low';
}

function getModuleRecommendation(module) {
  if (module.productFailed > 0) {
    return `Review ${module.name} failures and attached evidence.`;
  }

  if (module.reviewFailed > 0) {
    return `Review ${module.name} automation or environment evidence before marking as product risk.`;
  }

  if (module.skipped > 0 || module.interrupted > 0) {
    return `Review skipped or interrupted ${module.name} coverage.`;
  }

  if (module.name === 'Billing') {
    return 'Add API validation next.';
  }

  if (module.name === 'Password') {
    return 'Add reset-password expiry checks.';
  }

  if (module.name === 'Session Security') {
    return 'Add JWT/session API validation.';
  }

  return 'Continue monitoring.';
}

function buildModules(tests, config) {
  const moduleMap = tests.reduce((map, test) => {
    const moduleConfig = getModuleForTest(test, config);
    const moduleName = moduleConfig.name;

    if (!map.has(moduleName)) {
      map.set(moduleName, {
        name: moduleName,
        critical: Boolean(moduleConfig.critical),
        total: 0,
        passed: 0,
        failed: 0,
        productFailed: 0,
        reviewFailed: 0,
        skipped: 0,
        interrupted: 0,
        durationMs: 0,
        tests: [],
      });
    }

    const module = map.get(moduleName);
    module.total += 1;
    module.durationMs += test.durationMs ?? 0;
    module.tests.push(test.id);

    if (test.status === 'passed') module.passed += 1;
    else if (test.status === 'skipped') module.skipped += 1;
    else if (test.status === 'interrupted') module.interrupted += 1;
    else {
      module.failed += 1;

      if (getFailureType(test) === 'Product') {
        module.productFailed += 1;
      } else {
        module.reviewFailed += 1;
      }
    }

    test.module = moduleName;
    test.critical = Boolean(moduleConfig.critical);

    return map;
  }, new Map());

  return [...moduleMap.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(module => {
      const score = module.total === 0
        ? 0
        : Math.round((module.passed / module.total) * 100);
      const enrichedModule = {
        ...module,
        score,
        coverage: score,
        testCount: module.total,
        failedCount: module.failed,
        productFailedCount: module.productFailed,
        reviewFailedCount: module.reviewFailed,
        duration: formatDuration(module.durationMs),
      };

      return {
        ...enrichedModule,
        status: getModuleStatus(enrichedModule),
        risk: getModuleRisk(enrichedModule),
        recommendation: getModuleRecommendation(enrichedModule),
      };
    });
}

module.exports = {
  buildModules,
  getModuleForTest,
  getModuleRecommendation,
  getModuleRisk,
  getModuleStatus,
  matchByPatterns,
};
