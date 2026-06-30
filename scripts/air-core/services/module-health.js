const { formatDuration } = require('./duration');

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
        skipped: 0,
        interrupted: 0,
        durationMs: 0,
        tests: [],
      });
    }

    const module = map.get(moduleName);
    module.total += 1;
    module.durationMs += test.durationMs;
    module.tests.push(test.id);

    if (test.status === 'passed') module.passed += 1;
    else if (test.status === 'skipped') module.skipped += 1;
    else if (test.status === 'interrupted') module.interrupted += 1;
    else module.failed += 1;

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

      return {
        ...module,
        score,
        coverage: score,
        duration: formatDuration(module.durationMs),
        status: score >= 90 && module.failed === 0
          ? 'Healthy'
          : score >= 75
            ? 'Partial'
            : 'At Risk',
        risk: module.failed > 0
          ? 'High'
          : module.skipped > 0 || module.interrupted > 0
            ? 'Medium'
            : 'Low',
      };
    });
}

module.exports = {
  buildModules,
  getModuleForTest,
  matchByPatterns,
};
