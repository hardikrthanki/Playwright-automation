const DECISION_DISPLAY = {
  GO: 'GO',
  CONDITIONAL_GO: 'CONDITIONAL GO',
  NO_GO: 'NO GO',
};

const RISK_BY_DECISION = {
  GO: 'LOW',
  CONDITIONAL_GO: 'MEDIUM',
  NO_GO: 'HIGH',
};

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeDecision(value, fallback = 'NO_GO') {
  const normalized = String(value ?? fallback)
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_');

  return Object.prototype.hasOwnProperty.call(DECISION_DISPLAY, normalized)
    ? normalized
    : fallback;
}

function includesConfiguredValue(configuredValues = [], value) {
  const normalizedValue = String(value ?? '').trim().toLowerCase();

  return asArray(configuredValues)
    .map(item => String(item).trim().toLowerCase())
    .includes(normalizedValue);
}

function getReleaseRules(config = {}) {
  return config.releaseRules ?? {};
}

function getSeverityGroups(rules = {}) {
  return rules.failureSeverity ?? {};
}

function getJourneyStatusGroups(rules = {}) {
  return rules.journeyStatus ?? {};
}

function getModuleRiskGroups(rules = {}) {
  return rules.moduleRisk ?? {};
}

function getCriticalFailures(failedTests = [], rules = {}) {
  const severities = getSeverityGroups(rules);
  const criticalSeverities = [
    ...asArray(severities.blocker),
    ...asArray(severities.critical),
  ];

  return asArray(failedTests).filter(failure =>
    includesConfiguredValue(criticalSeverities, failure.severity)
  );
}

function getBlockerFailures(failedTests = [], rules = {}) {
  const blockerSeverities = getSeverityGroups(rules).blocker ?? [];

  return asArray(failedTests).filter(failure =>
    includesConfiguredValue(blockerSeverities, failure.severity)
  );
}

function getWarningFailures(failedTests = [], rules = {}) {
  const warningSeverities = getSeverityGroups(rules).warning ?? [];

  return asArray(failedTests).filter(failure =>
    includesConfiguredValue(warningSeverities, failure.severity)
  );
}

function getCriticalJourneys(businessJourneys = [], rules = {}) {
  const criticalStatuses = getJourneyStatusGroups(rules).critical ?? [];

  return asArray(businessJourneys).filter(journey =>
    journey.critical && includesConfiguredValue(criticalStatuses, journey.status)
  );
}

function getWarningJourneys(businessJourneys = [], rules = {}) {
  const warningStatuses = getJourneyStatusGroups(rules).warning ?? [];

  return asArray(businessJourneys).filter(journey =>
    journey.critical && includesConfiguredValue(warningStatuses, journey.status)
  );
}

function getRiskyModules(modules = [], rules = {}) {
  const criticalRisks = getModuleRiskGroups(rules).critical ?? [];

  return asArray(modules).filter(module =>
    module.critical && includesConfiguredValue(criticalRisks, module.risk)
  );
}

function getWarningModules(modules = [], rules = {}) {
  const warningRisks = getModuleRiskGroups(rules).warning ?? [];

  return asArray(modules).filter(module =>
    includesConfiguredValue(warningRisks, module.risk)
  );
}

function hasPartialExecution(summary = {}, businessJourneys = [], rules = {}) {
  if (summary.total === 0 || summary.executionStatus === 'No Data Available') {
    return true;
  }

  if (summary.skipped > 0 || summary.interrupted > 0) {
    return true;
  }

  return getWarningJourneys(businessJourneys, rules).some(journey =>
    includesConfiguredValue(['Partial', 'Not Executed', 'No Data Available'], journey.status)
  );
}

function meetsRuleSet({ summary = {}, quality = {}, failedTests = [], businessHealth = 0 }, ruleSet = {}, rules = {}) {
  const criticalFailures = getCriticalFailures(failedTests, rules);
  const blockerFailures = getBlockerFailures(failedTests, rules);

  return (
    (summary.passRate ?? 0) >= (ruleSet.minimumPassRate ?? 0) &&
    businessHealth >= (ruleSet.minimumBusinessHealth ?? 0) &&
    (quality.score ?? 0) >= (ruleSet.minimumQualityScore ?? 0) &&
    (quality.confidence ?? 0) >= (ruleSet.minimumConfidence ?? 0) &&
    (summary.failed ?? 0) <= (ruleSet.maximumFailedTests ?? Number.POSITIVE_INFINITY) &&
    blockerFailures.length <= (ruleSet.maximumBlockerFailures ?? Number.POSITIVE_INFINITY) &&
    criticalFailures.length <= (ruleSet.maximumCriticalFailures ?? Number.POSITIVE_INFINITY)
  );
}

function buildBlockers({ criticalFailures, blockerFailures, failedCriticalJourneys, riskyModules }) {
  return [
    ...blockerFailures.map(failure => ({
      type: 'Failure',
      name: failure.testName,
      reason: 'Blocker failure severity matched release rules.',
    })),
    ...criticalFailures.map(failure => ({
      type: 'Failure',
      name: failure.testName,
      reason: 'Critical failure severity matched release rules.',
    })),
    ...failedCriticalJourneys.map(journey => ({
      type: 'Business Journey',
      name: journey.name,
      reason: `Critical journey status is ${journey.status}.`,
    })),
    ...riskyModules.map(module => ({
      type: 'Module',
      name: module.name,
      reason: `Critical module risk is ${module.risk}.`,
    })),
  ];
}

function buildWarnings({ warningFailures, warningJourneys, warningModules, partialExecution }) {
  const warnings = [
    ...warningFailures.map(failure => ({
      type: 'Failure',
      name: failure.testName,
      reason: `Warning severity is ${failure.severity}.`,
    })),
    ...warningJourneys.map(journey => ({
      type: 'Business Journey',
      name: journey.name,
      reason: `Journey status is ${journey.status}.`,
    })),
    ...warningModules.map(module => ({
      type: 'Module',
      name: module.name,
      reason: `Module risk is ${module.risk}.`,
    })),
  ];

  if (partialExecution) {
    warnings.push({
      type: 'Execution',
      name: 'Partial execution',
      reason: 'Execution contains skipped, interrupted, not-executed, or no-data release areas.',
    });
  }

  return warnings;
}

function getConfiguredReasons(decision, rules = {}, generatedReasons = []) {
  const messages = rules.messages ?? {};

  if (decision === 'GO') {
    return messages.goReasons ?? generatedReasons;
  }

  if (decision === 'CONDITIONAL_GO') {
    return messages.conditionalReasons ?? generatedReasons;
  }

  return messages.noGoReasons ?? generatedReasons;
}

function getConfiguredAction(decision, rules = {}) {
  const messages = rules.messages ?? {};

  if (decision === 'GO') {
    return messages.goAction ?? 'Proceed with release monitoring.';
  }

  if (decision === 'CONDITIONAL_GO') {
    return messages.conditionalAction ?? 'Review warnings and evidence before approval.';
  }

  return messages.noGoAction ?? 'Do not release until blockers are resolved.';
}

function buildExplanation(decision, { summary = {}, quality = {}, businessHealth = 0, blockers = [], warnings = [] }) {
  if (decision === 'GO') {
    return `AIR recommends GO because pass rate is ${summary.passRate ?? 0}%, business health is ${businessHealth}%, quality score is ${quality.score ?? 0}, and no configured release blockers were detected.`;
  }

  if (decision === 'CONDITIONAL_GO') {
    return `AIR recommends CONDITIONAL GO because release blockers were not detected, but ${warnings.length} warning signal(s) or partial execution areas require review before approval.`;
  }

  return `AIR recommends NO GO because ${blockers.length} blocker signal(s) or configured release threshold gaps require resolution before approval.`;
}

function calculateReleaseConfidence(decision, quality = {}, summary = {}) {
  if (typeof quality.confidence === 'number') {
    return quality.confidence;
  }

  if (typeof quality.score === 'number') {
    return quality.score;
  }

  return summary.passRate ?? 0;
}

function buildReleaseDecision({
  summary = {},
  failedTests = [],
  modules = [],
  businessJourneys = [],
  evidence = {},
  quality = {},
  config = {},
  releaseRules,
  thresholds,
} = {}) {
  const mergedConfig = {
    ...config,
    releaseRules: releaseRules ?? config.releaseRules,
    releaseThresholds: thresholds ?? config.releaseThresholds,
  };
  const rules = getReleaseRules(mergedConfig);
  const legacyThresholds = mergedConfig.releaseThresholds ?? {};
  const goRules = {
    minimumPassRate: legacyThresholds.goPassRate,
    minimumBusinessHealth: legacyThresholds.goBusinessHealth,
    maximumFailedTests: legacyThresholds.criticalFailureLimitForGo,
    maximumBlockerFailures: legacyThresholds.blockerFailureLimitForGo,
    ...(rules.go ?? {}),
  };
  const conditionalRules = {
    minimumPassRate: legacyThresholds.conditionalGoPassRate,
    minimumBusinessHealth: legacyThresholds.conditionalGoBusinessHealth,
    ...(rules.conditionalGo ?? {}),
  };
  const businessHealth = summary.businessHealth ?? 0;
  const failedCriticalJourneys = getCriticalJourneys(businessJourneys, rules);
  const warningJourneys = getWarningJourneys(businessJourneys, rules);
  const criticalFailures = getCriticalFailures(failedTests, rules);
  const blockerFailures = getBlockerFailures(failedTests, rules);
  const warningFailures = getWarningFailures(failedTests, rules);
  const riskyModules = getRiskyModules(modules, rules);
  const warningModules = getWarningModules(modules, rules);
  const partialExecution = hasPartialExecution(summary, businessJourneys, rules);
  const blockers = buildBlockers({
    criticalFailures,
    blockerFailures,
    failedCriticalJourneys,
    riskyModules,
  });
  const warnings = buildWarnings({
    warningFailures,
    warningJourneys,
    warningModules,
    partialExecution,
  });
  const goPassed = meetsRuleSet({ summary, quality, failedTests, businessHealth }, goRules, rules);
  const conditionalPassed = meetsRuleSet({ summary, quality, failedTests, businessHealth }, conditionalRules, rules);
  const decisions = rules.decisions ?? {};

  let decision = normalizeDecision(decisions.allRulesPassed, 'GO');

  if (failedCriticalJourneys.length > 0) {
    decision = normalizeDecision(decisions.criticalJourneyFailed, 'NO_GO');
  } else if (criticalFailures.length > 0 || blockerFailures.length > 0 || riskyModules.length > 0) {
    decision = normalizeDecision(decisions.criticalFailureFound, 'NO_GO');
  } else if (partialExecution && rules.allowPartialRelease !== true) {
    decision = normalizeDecision(decisions.partialExecution, 'CONDITIONAL_GO');
  } else if (!goPassed && conditionalPassed) {
    decision = normalizeDecision(decisions.warningsOnly, 'CONDITIONAL_GO');
  } else if (!goPassed) {
    decision = 'NO_GO';
  } else if (warnings.length > 0) {
    decision = normalizeDecision(decisions.warningsOnly, 'CONDITIONAL_GO');
  }

  const generatedReasons = [
    `Pass rate: ${summary.passRate ?? 0}%`,
    `Business health: ${businessHealth}%`,
    `Quality score: ${quality.score ?? 0}`,
    `Evidence items: ${evidence.summary?.total ?? 0}`,
  ];
  const reasons = getConfiguredReasons(decision, rules, generatedReasons);
  const requiredAction = getConfiguredAction(decision, rules);
  const confidence = calculateReleaseConfidence(decision, quality, summary);
  const risk = RISK_BY_DECISION[decision] ?? 'HIGH';

  return {
    decision,
    status: DECISION_DISPLAY[decision] ?? 'NO GO',
    confidence,
    risk,
    riskLevel: risk,
    reasons,
    warnings,
    blockers,
    requiredActions: decision === 'GO' ? [] : [requiredAction],
    recommendedAction: requiredAction,
    explanation: buildExplanation(decision, {
      summary,
      quality,
      businessHealth,
      blockers,
      warnings,
    }),
  };
}

module.exports = {
  buildReleaseDecision,
  calculateReleaseConfidence,
  getBlockerFailures,
  getCriticalFailures,
  getCriticalJourneys,
  getReleaseRules,
  hasPartialExecution,
  normalizeDecision,
};
