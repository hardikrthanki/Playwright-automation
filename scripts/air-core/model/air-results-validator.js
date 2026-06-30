const { requiredTopLevelSections, schemaVersion } = require('./air-results.schema');

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function addWarning(warnings, section, message) {
  warnings.push({
    section,
    message,
  });
}

function validateAirResults(airResults) {
  const warnings = [];

  if (!isPlainObject(airResults)) {
    return {
      valid: false,
      warnings: [
        {
          section: 'root',
          message: 'AIR results must be an object.',
        },
      ],
    };
  }

  for (const section of requiredTopLevelSections) {
    if (!(section in airResults)) {
      addWarning(warnings, section, `Missing required top-level section: ${section}.`);
    }
  }

  if (airResults.schemaVersion !== schemaVersion) {
    addWarning(
      warnings,
      'schemaVersion',
      `Expected schema version ${schemaVersion}, received ${airResults.schemaVersion ?? 'none'}.`
    );
  }

  if (!Array.isArray(airResults.modules)) {
    addWarning(warnings, 'modules', 'Modules must be an array.');
  }

  if (!Array.isArray(airResults.tests)) {
    addWarning(warnings, 'tests', 'Tests must be an array.');
  }

  if (!Array.isArray(airResults.failedTests)) {
    addWarning(warnings, 'failedTests', 'Failed tests must be an array.');
  }

  if (!Array.isArray(airResults.businessJourneys)) {
    addWarning(warnings, 'businessJourneys', 'Business journeys must be an array.');
  }

  if (!Array.isArray(airResults.recommendations)) {
    addWarning(warnings, 'recommendations', 'Recommendations must be an array.');
  }

  if (!Array.isArray(airResults.searchIndex)) {
    addWarning(warnings, 'searchIndex', 'Search index must be an array.');
  }

  if (!isPlainObject(airResults.executionContext)) {
    addWarning(warnings, 'executionContext', 'Execution context must be an object.');
  }

  if (!airResults.executionContext?.type) {
    addWarning(warnings, 'executionContext', 'Execution context type is required.');
  }

  if (!isPlainObject(airResults.history)) {
    addWarning(warnings, 'history', 'History must be an object.');
  }

  if (!Array.isArray(airResults.history?.executions)) {
    addWarning(warnings, 'history', 'History executions must be an array.');
  }

  if (!Array.isArray(airResults.engineLog)) {
    addWarning(warnings, 'engineLog', 'Engine log must be an array.');
  }

  if (!isPlainObject(airResults.discovery)) {
    addWarning(warnings, 'discovery', 'Discovery must be an object.');
  }

  for (const field of ['newTests', 'mappedTests', 'unmappedTests', 'suggestions', 'configurationIssues']) {
    if (!Array.isArray(airResults.discovery?.[field])) {
      addWarning(warnings, 'discovery', `Discovery field "${field}" must be an array.`);
    }
  }

  const summary = airResults.summary ?? {};
  for (const numericField of ['total', 'passed', 'failed', 'skipped', 'passRate', 'qualityScore']) {
    if (typeof summary[numericField] !== 'number') {
      addWarning(warnings, 'summary', `Summary field "${numericField}" should be numeric.`);
    }
  }

  if (typeof airResults.quality?.score !== 'number') {
    addWarning(warnings, 'quality', 'Quality score must be numeric.');
  }

  if (!airResults.quality?.grade) {
    addWarning(warnings, 'quality', 'Quality grade is required.');
  }

  const release = airResults.release ?? airResults.releaseDecision;
  const releaseStatus = release?.status;
  const releaseDecision = release?.decision;
  if (!['GO', 'CONDITIONAL GO', 'NO GO'].includes(releaseStatus)) {
    addWarning(warnings, 'releaseDecision', 'Release decision must be GO, CONDITIONAL GO, or NO GO.');
  }

  if (releaseDecision && !['GO', 'CONDITIONAL_GO', 'NO_GO'].includes(releaseDecision)) {
    addWarning(warnings, 'release', 'Release decision code must be GO, CONDITIONAL_GO, or NO_GO.');
  }

  if (!Array.isArray(release?.reasons)) {
    addWarning(warnings, 'release', 'Release reasons must be an array.');
  }

  if (!Array.isArray(release?.warnings)) {
    addWarning(warnings, 'release', 'Release warnings must be an array.');
  }

  if (!Array.isArray(release?.blockers)) {
    addWarning(warnings, 'release', 'Release blockers must be an array.');
  }

  for (const [index, module] of (airResults.modules ?? []).entries()) {
    if (!module.name) {
      addWarning(warnings, 'modules', `Module at index ${index} is missing a name.`);
    }

    if (typeof module.total !== 'number') {
      addWarning(warnings, 'modules', `Module "${module.name ?? index}" is missing numeric total.`);
    }
  }

  for (const [index, test] of (airResults.tests ?? []).entries()) {
    if (!test.id) {
      addWarning(warnings, 'tests', `Test at index ${index} is missing an id.`);
    }

    if (!test.title) {
      addWarning(warnings, 'tests', `Test at index ${index} is missing a title.`);
    }

    if (!test.status) {
      addWarning(warnings, 'tests', `Test "${test.id ?? index}" is missing a status.`);
    }
  }

  for (const [index, failure] of (airResults.failedTests ?? []).entries()) {
    if (!failure.testName) {
      addWarning(warnings, 'failedTests', `Failed test at index ${index} is missing testName.`);
    }

    if (!failure.severity) {
      addWarning(warnings, 'failedTests', `Failed test "${failure.testName ?? index}" is missing severity.`);
    }

    if (!failure.category) {
      addWarning(warnings, 'failedTests', `Failed test "${failure.testName ?? index}" is missing category.`);
    }

    if (!Array.isArray(failure.evidence)) {
      addWarning(warnings, 'failedTests', `Failed test "${failure.testName ?? index}" must include evidence array.`);
    }
  }

  for (const [index, item] of (airResults.searchIndex ?? []).entries()) {
    if (!item.type) {
      addWarning(warnings, 'searchIndex', `Search item at index ${index} is missing type.`);
    }

    if (!item.title) {
      addWarning(warnings, 'searchIndex', `Search item at index ${index} is missing title.`);
    }

    if (!item.target) {
      addWarning(warnings, 'searchIndex', `Search item "${item.title ?? index}" is missing target.`);
    }

    if (typeof item.text !== 'string') {
      addWarning(warnings, 'searchIndex', `Search item "${item.title ?? index}" must include searchable text.`);
    }
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

module.exports = {
  validateAirResults,
};
