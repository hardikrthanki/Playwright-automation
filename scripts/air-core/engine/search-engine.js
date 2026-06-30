function slug(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeText(parts = []) {
  return parts
    .flatMap(part => Array.isArray(part) ? part : [part])
    .filter(part => part !== undefined && part !== null && part !== '')
    .map(part => typeof part === 'object' ? JSON.stringify(part) : String(part))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function createSearchEntry(entry) {
  const title = entry.title ?? 'AIR result';
  const type = entry.type ?? 'item';
  const text = normalizeText([
    type,
    title,
    entry.status,
    entry.module,
    entry.priority,
    entry.category,
    entry.keywords,
    entry.text,
  ]);

  return {
    id: entry.id ?? slug(`${type}-${title}-${entry.target ?? ''}`),
    type,
    title,
    target: entry.target ?? '#executive',
    status: entry.status ?? '',
    module: entry.module ?? '',
    priority: entry.priority ?? '',
    category: entry.category ?? '',
    keywords: entry.keywords ?? [],
    text,
  };
}

function addEntry(entries, seen, entry) {
  const searchEntry = createSearchEntry(entry);
  const key = searchEntry.id;

  if (seen.has(key)) {
    return;
  }

  seen.add(key);
  entries.push(searchEntry);
}

function buildReleaseEntries(airResults = {}, entries, seen) {
  const release = airResults.release ?? airResults.releaseDecision ?? {};

  addEntry(entries, seen, {
    id: 'release-decision',
    type: 'release',
    title: `Release Decision: ${release.status ?? airResults.summary?.releaseDecision ?? 'No Data'}`,
    target: '#executive',
    status: release.status ?? airResults.summary?.releaseDecision,
    priority: release.riskLevel ?? release.risk ?? airResults.summary?.estimatedReleaseRisk,
    keywords: ['release', 'decision', 'go', 'risk', 'confidence'],
    text: [
      release.explanation,
      release.recommendedAction,
      release.requiredActions,
      release.reasons,
      release.warnings?.map(warning => warning.reason),
      release.blockers?.map(blocker => blocker.reason),
    ],
  });
}

function buildModuleEntries(airResults = {}, entries, seen) {
  for (const module of airResults.modules ?? []) {
    addEntry(entries, seen, {
      id: `module-${slug(module.name)}`,
      type: 'module',
      title: module.name,
      target: `#module-dashboard-${slug(module.name)}`,
      status: module.status,
      module: module.name,
      priority: module.risk,
      keywords: ['module', 'health', 'coverage', module.name],
      text: [
        `${module.total ?? 0} tests`,
        `${module.passed ?? 0} passed`,
        `${module.failed ?? 0} failed`,
        `${module.score ?? module.coverage ?? 0}% health`,
        module.recommendation,
      ],
    });
  }
}

function buildQualityEntries(airResults = {}, entries, seen) {
  const quality = airResults.quality ?? {};

  if (!quality || Object.keys(quality).length === 0) {
    return;
  }

  addEntry(entries, seen, {
    id: 'quality-explanation',
    type: 'quality',
    title: `Quality Score: ${quality.score ?? 'No Data'}`,
    target: '#executive',
    status: quality.grade ?? '',
    priority: quality.confidence !== undefined ? `${quality.confidence}% confidence` : '',
    keywords: ['quality', 'score', 'confidence', 'grade', 'explanation'],
    text: [
      quality.explanation,
      quality.factors,
      quality.weights,
    ],
  });
}

function buildJourneyEntries(airResults = {}, entries, seen) {
  for (const journey of airResults.businessJourneys ?? []) {
    addEntry(entries, seen, {
      id: `journey-${slug(journey.name)}`,
      type: 'journey',
      title: journey.name,
      target: '#journey',
      status: journey.status,
      priority: journey.critical ? 'critical' : 'standard',
      keywords: ['business journey', 'flow', journey.name],
      text: [
        `${journey.total ?? journey.testCount ?? 0} tests`,
        `${journey.passed ?? 0} passed`,
        `${journey.failed ?? journey.failedCount ?? 0} failed`,
        `${journey.score ?? journey.healthPercentage ?? 0}% health`,
        journey.risk,
        journey.recommendation,
        journey.modules,
        journey.affectedModules,
      ],
    });
  }
}

function buildTestEntries(airResults = {}, entries, seen) {
  for (const test of airResults.tests ?? []) {
    if (test.status === 'failed') {
      continue;
    }

    addEntry(entries, seen, {
      id: `test-${slug(test.id ?? test.title)}`,
      type: 'test',
      title: test.title,
      target: `#module-dashboard-${slug(test.module ?? 'general')}`,
      status: test.status,
      module: test.module,
      keywords: ['test', test.status, test.module],
      text: [test.file, test.project, test.error, test.duration],
    });
  }
}

function buildFailureEntries(airResults = {}, entries, seen) {
  for (const failure of airResults.failedTests ?? airResults.failures ?? []) {
    addEntry(entries, seen, {
      id: `failure-${slug(failure.testId ?? failure.testName ?? failure.title)}`,
      type: 'failure',
      title: failure.testName ?? failure.title,
      target: '#failures',
      status: failure.status ?? 'failed',
      module: failure.module,
      priority: failure.severity ?? failure.priority ?? 'failure',
      category: failure.category,
      keywords: ['failure', 'failed test', failure.category, failure.severity],
      text: [
        failure.file,
        failure.errorMessage ?? failure.error,
        failure.businessImpact,
        failure.recommendedInvestigationAction,
        failure.evidence?.map(item => item.name || item.path),
      ],
    });
  }
}

function isSearchableEvidenceCollection(type, items) {
  return Array.isArray(items) && !['byTest', 'byModule'].includes(type);
}

function buildEvidenceEntries(airResults = {}, entries, seen) {
  const evidenceGroups = airResults.evidence ?? {};

  for (const [type, items] of Object.entries(evidenceGroups)) {
    if (!isSearchableEvidenceCollection(type, items)) {
      continue;
    }

    for (const item of items) {
      addEntry(entries, seen, {
        id: `evidence-${type}-${slug(item.id ?? item.path ?? item.name ?? item.testId)}`,
        type: 'evidence',
        title: item.testTitle || item.name || `${type} evidence`,
        target: '#evidence',
        status: item.type ?? type,
        module: item.module,
        keywords: ['evidence', type, item.type, item.module],
        text: [item.path, item.contentType, item.name, item.testId, item.testTitle],
      });
    }
  }
}

function buildRecommendationEntries(airResults = {}, entries, seen) {
  for (const recommendation of airResults.recommendations ?? []) {
    addEntry(entries, seen, {
      id: `recommendation-${slug(recommendation.priority ?? '')}-${slug(recommendation.title)}`,
      type: 'recommendation',
      title: recommendation.title,
      target: '#insight',
      priority: recommendation.priority,
      keywords: ['recommendation', 'ai insight', 'next action'],
      text: recommendation.description,
    });
  }
}

function buildDiscoveryEntries(airResults = {}, entries, seen) {
  for (const item of airResults.discovery?.unmappedTests ?? []) {
    addEntry(entries, seen, {
      id: `discovery-unmapped-${slug(item.testId ?? item.title)}`,
      type: 'discovery',
      title: `Unmapped test: ${item.title}`,
      target: '#roadmap',
      status: item.status,
      module: item.suggestedModule?.name,
      priority: item.criticality?.value,
      keywords: ['discovery', 'unmapped', 'new test', 'mapping suggestion'],
      text: [
        item.file,
        item.suggestedModule?.name,
        item.suggestedJourney?.name,
        item.criticality?.value,
      ],
    });
  }

  for (const issue of airResults.discovery?.configurationIssues ?? []) {
    addEntry(entries, seen, {
      id: `discovery-issue-${slug(issue.type)}-${slug(issue.testId ?? issue.module ?? issue.title)}`,
      type: 'discovery',
      title: issue.type,
      target: '#roadmap',
      status: 'Configuration Issue',
      module: issue.module,
      priority: 'Review',
      keywords: ['discovery', 'configuration', 'mapping'],
      text: [issue.title, issue.message, issue.modules],
    });
  }
}

function buildRoadmapEntries(airResults = {}, entries, seen) {
  for (const [area, validation] of Object.entries(airResults.futureValidation ?? {})) {
    addEntry(entries, seen, {
      id: `roadmap-${slug(area)}`,
      type: 'roadmap',
      title: `${area} validation`,
      target: '#roadmap',
      status: validation.status,
      keywords: ['roadmap', 'future validation', area],
      text: validation.summary,
    });
  }
}

function buildHistoryEntries(airResults = {}, entries, seen) {
  const historyExecutions = Array.isArray(airResults.history)
    ? airResults.history
    : airResults.history?.executions ?? [];

  for (const item of historyExecutions) {
    addEntry(entries, seen, {
      id: `history-${slug(item.generatedAt)}`,
      type: 'history',
      title: item.generatedAtDisplay ?? item.generatedAt ?? 'AIR history',
      target: '#roadmap',
      status: item.summary?.executionStatus,
      priority: item.releaseDecision?.riskLevel ?? item.summary?.estimatedReleaseRisk,
      keywords: ['history', 'trend', 'previous execution'],
      text: [
        item.project?.name,
        item.project?.environment,
        item.summary?.total,
        item.summary?.passRate,
        item.releaseDecision?.status ?? item.summary?.releaseDecision,
      ],
    });
  }
}

function buildSearchIndex(airResults = {}) {
  const entries = [];
  const seen = new Set();

  buildReleaseEntries(airResults, entries, seen);
  buildQualityEntries(airResults, entries, seen);
  buildModuleEntries(airResults, entries, seen);
  buildJourneyEntries(airResults, entries, seen);
  buildTestEntries(airResults, entries, seen);
  buildFailureEntries(airResults, entries, seen);
  buildEvidenceEntries(airResults, entries, seen);
  buildRecommendationEntries(airResults, entries, seen);
  buildDiscoveryEntries(airResults, entries, seen);
  buildRoadmapEntries(airResults, entries, seen);
  buildHistoryEntries(airResults, entries, seen);

  return entries;
}

module.exports = {
  buildSearchIndex,
  createSearchEntry,
  buildQualityEntries,
  normalizeText,
  slug,
};
