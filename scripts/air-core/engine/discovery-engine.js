function slug(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function humanize(value) {
  const base = String(value ?? '')
    .replace(/\.[^.]+$/, '')
    .replace(/[-_.\\/]+/g, ' ')
    .replace(/\b(spec|test|tests)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!base) {
    return 'No suggestion';
  }

  return base
    .split(' ')
    .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');
}

function getConfiguredModules(config = {}) {
  return (config.modules ?? []).map(module => ({
    name: module.name ?? module,
    patterns: module.patterns ?? [],
    critical: Boolean(module.critical),
  }));
}

function getConfiguredJourneys(config = {}) {
  return config.businessJourneys ?? [];
}

function matchesPattern(value, patterns = []) {
  const normalizedValue = String(value ?? '').toLowerCase();

  return patterns.some(pattern => normalizedValue.includes(String(pattern).toLowerCase()));
}

function getTestSearchText(test = {}) {
  return [
    test.id,
    test.title,
    test.file,
    test.module,
  ].filter(Boolean).join(' ');
}

function getMatchingModules(test = {}, config = {}) {
  const text = getTestSearchText(test);

  return getConfiguredModules(config).filter(module => matchesPattern(text, module.patterns));
}

function getPreviousTestIds(existingHistory = {}) {
  const executions = Array.isArray(existingHistory)
    ? existingHistory
    : existingHistory.executions ?? [];
  const previousExecution = executions.at(-1);

  return new Set((previousExecution?.tests ?? []).map(test => test.id ?? test.title).filter(Boolean));
}

function suggestModule(test = {}, matchingModules = []) {
  if (matchingModules.length > 0) {
    return {
      name: matchingModules[0].name,
      confidence: 95,
      source: 'configured-pattern',
    };
  }

  const fileSuggestion = humanize(test.file);
  const titleSuggestion = humanize(String(test.title ?? '').split('>').at(-1));
  const suggestion = fileSuggestion !== 'No suggestion' ? fileSuggestion : titleSuggestion;

  return {
    name: suggestion,
    confidence: suggestion === 'No suggestion' ? 0 : 60,
    source: 'filename-title-heuristic',
  };
}

function suggestJourney(test = {}, suggestedModule = {}, config = {}) {
  const text = getTestSearchText(test);
  const journeys = getConfiguredJourneys(config);
  const matchingJourney = journeys.find(journey =>
    matchesPattern(text, journey.patterns ?? []) ||
    (journey.modules ?? []).includes(suggestedModule.name)
  );

  if (!matchingJourney) {
    return {
      name: 'No suggestion',
      confidence: 0,
      source: 'none',
    };
  }

  return {
    name: matchingJourney.name,
    confidence: (matchingJourney.modules ?? []).includes(suggestedModule.name) ? 90 : 82,
    source: 'configured-journey-pattern',
  };
}

function suggestCriticality(test = {}, suggestedModule = {}, config = {}) {
  const configuredModule = getConfiguredModules(config).find(module => module.name === suggestedModule.name);

  if (configuredModule) {
    return {
      value: configuredModule.critical ? 'High' : 'Standard',
      confidence: 92,
      source: 'module-config',
    };
  }

  const text = getTestSearchText(test).toLowerCase();
  const highSignals = ['payment', 'billing', 'login', 'auth', 'password', 'session', 'signup', 'onboarding', 'security'];

  if (highSignals.some(signal => text.includes(signal))) {
    return {
      value: 'High',
      confidence: 70,
      source: 'title-signal',
    };
  }

  return {
    value: 'Medium',
    confidence: 55,
    source: 'default-suggestion',
  };
}

function buildDiscoveryEntry(test = {}, config = {}, previousTestIds = new Set()) {
  const matchingModules = getMatchingModules(test, config);
  const mapped = Boolean(test.module && test.module !== 'General' && matchingModules.some(module => module.name === test.module));
  const suggestedModule = suggestModule(test, matchingModules);
  const suggestedJourney = suggestJourney(test, suggestedModule, config);
  const criticality = suggestCriticality(test, suggestedModule, config);

  return {
    testId: test.id,
    title: test.title,
    file: test.file,
    status: mapped ? 'Mapped' : 'Unmapped',
    currentModule: mapped ? test.module : '',
    isNew: previousTestIds.size > 0 ? !previousTestIds.has(test.id ?? test.title) : false,
    suggestedModule,
    suggestedJourney,
    criticality,
    matchingModules: matchingModules.map(module => module.name),
  };
}

function findDuplicateMappings(tests = [], config = {}) {
  return tests
    .map(test => ({
      testId: test.id,
      title: test.title,
      matchingModules: getMatchingModules(test, config).map(module => module.name),
    }))
    .filter(item => item.matchingModules.length > 1);
}

function findOrphanedMappings(discoveryEntries = [], config = {}) {
  const mappedModules = new Set(discoveryEntries.map(entry => entry.currentModule).filter(Boolean));

  return getConfiguredModules(config)
    .filter(module => !mappedModules.has(module.name))
    .map(module => ({
      type: 'Orphaned module mapping',
      module: module.name,
      message: 'Configured module did not map to any executed test in this run.',
    }));
}

function findMissingJourneyConfiguration(config = {}) {
  const journeyModules = new Set(
    getConfiguredJourneys(config).flatMap(journey => journey.modules ?? [])
  );

  return getConfiguredModules(config)
    .filter(module => !journeyModules.has(module.name))
    .map(module => ({
      type: 'Missing journey configuration',
      module: module.name,
      message: 'Configured module is not referenced by any business journey.',
    }));
}

function findConfigurationIssues(discoveryEntries = [], tests = [], config = {}) {
  const unmappedTests = discoveryEntries.filter(entry => entry.status === 'Unmapped');
  const duplicateMappings = findDuplicateMappings(tests, config);

  return [
    ...unmappedTests.map(entry => ({
      type: 'Missing module configuration',
      testId: entry.testId,
      title: entry.title,
      message: 'Executed test did not match a configured AIR module.',
    })),
    ...duplicateMappings.map(entry => ({
      type: 'Duplicate mapping',
      testId: entry.testId,
      title: entry.title,
      modules: entry.matchingModules,
      message: 'Executed test matches more than one configured module.',
    })),
    ...findOrphanedMappings(discoveryEntries, config),
    ...findMissingJourneyConfiguration(config),
  ];
}

function buildDiscovery({ tests = [], config = {}, existingHistory = {} } = {}) {
  const previousTestIds = getPreviousTestIds(existingHistory);
  const entries = tests.map(test => buildDiscoveryEntry(test, config, previousTestIds));
  const mappedTests = entries.filter(entry => entry.status === 'Mapped');
  const unmappedTests = entries.filter(entry => entry.status === 'Unmapped');
  const newTests = entries.filter(entry => entry.isNew);
  const suggestions = unmappedTests.map(entry => ({
    testId: entry.testId,
    title: entry.title,
    file: entry.file,
    suggestedModule: entry.suggestedModule,
    suggestedJourney: entry.suggestedJourney,
    criticality: entry.criticality,
    status: 'Suggestion Only',
  }));

  return {
    summary: {
      discovered: entries.length,
      mapped: mappedTests.length,
      unmapped: unmappedTests.length,
      newTests: newTests.length,
      suggestions: suggestions.length,
      configurationIssues: 0,
    },
    newTests,
    mappedTests,
    unmappedTests,
    suggestions,
    configurationIssues: findConfigurationIssues(entries, tests, config),
    configSync: {
      status: 'Prepared',
      autoUpdateEnabled: false,
      message: 'Discovery suggestions are report-only. AIR does not modify configuration automatically.',
    },
  };
}

function execute(model, context = {}) {
  const discovery = buildDiscovery({
    tests: model.tests,
    config: context.config,
    existingHistory: context.existingHistory,
  });

  return {
    ...model,
    discovery: {
      ...discovery,
      summary: {
        ...discovery.summary,
        configurationIssues: discovery.configurationIssues.length,
      },
    },
  };
}

module.exports = {
  buildDiscovery,
  buildDiscoveryEntry,
  execute,
  findConfigurationIssues,
  getMatchingModules,
  suggestCriticality,
  suggestJourney,
  suggestModule,
};
