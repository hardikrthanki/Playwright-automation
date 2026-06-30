function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values) {
  const numericValues = values.filter(value => typeof value === 'number');

  if (numericValues.length === 0) {
    return 0;
  }

  return Math.round(numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length);
}

function getConfiguredWeights(config = {}) {
  return config.qualityScoreWeights ?? {};
}

function getGrade(score, config = {}) {
  const gradeBoundaries = [...(config.qualityGradeBoundaries ?? [])]
    .sort((left, right) => right.minimumScore - left.minimumScore);

  for (const boundary of gradeBoundaries) {
    if (score >= boundary.minimumScore) {
      return boundary.grade;
    }
  }

  return 'Ungraded';
}

function getModuleHealthScore(modules = []) {
  return average(modules.map(module => module.coverage ?? module.score));
}

function getJourneyCoverageScore(businessJourneys = []) {
  return average(businessJourneys.map(journey => journey.coverage ?? journey.healthPercentage ?? journey.score));
}

function getEvidenceReadinessScore(evidence = {}) {
  const summary = evidence.summary ?? {};
  const rawReports = summary.rawReports ?? 0;
  const total = summary.total ?? 0;

  if (total === 0) {
    return 0;
  }

  return rawReports > 0 ? 100 : 0;
}

function getFailureSeverityScore(failedTests = [], config = {}) {
  if (failedTests.length === 0) {
    return 100;
  }

  const thresholds = config.qualityThresholds ?? {};
  const penalty = failedTests.reduce((sum, failure) => {
    if (failure.severity === 'Critical') return sum + (thresholds.criticalFailurePenalty ?? 15);
    if (failure.severity === 'High') return sum + (thresholds.highFailurePenalty ?? 10);
    return sum + (thresholds.mediumFailurePenalty ?? 5);
  }, 0);

  return clampScore(100 - penalty);
}

function buildQualityFactors({ summary = {}, modules = [], businessJourneys = [], evidence = {}, failedTests = [] }, config = {}) {
  return {
    passRate: summary.passRate ?? 0,
    businessHealth: summary.businessHealth ?? 0,
    moduleHealth: getModuleHealthScore(modules),
    journeyCoverage: getJourneyCoverageScore(businessJourneys),
    evidenceReadiness: getEvidenceReadinessScore(evidence),
    failureSeverity: getFailureSeverityScore(failedTests, config),
  };
}

function calculateWeightedScore(factors, weights) {
  const activeWeights = Object.entries(weights)
    .filter(([, weight]) => typeof weight === 'number' && weight > 0);
  const totalWeight = activeWeights.reduce((sum, [, weight]) => sum + weight, 0);

  if (totalWeight === 0) {
    return 0;
  }

  return clampScore(
    activeWeights.reduce((sum, [factor, weight]) => sum + ((factors[factor] ?? 0) * weight), 0) / totalWeight
  );
}

function buildQualityExplanation(score, grade, factors) {
  return [
    `Quality score is ${score} (${grade}).`,
    `Pass rate is ${factors.passRate}%.`,
    `Business health is ${factors.businessHealth}%.`,
    `Module health is ${factors.moduleHealth}%.`,
    `Journey coverage is ${factors.journeyCoverage}%.`,
    `Evidence readiness is ${factors.evidenceReadiness}%.`,
  ];
}

function calculateQuality({ summary = {}, modules = [], businessJourneys = [], evidence = {}, failedTests = [] }, config = {}) {
  const weights = getConfiguredWeights(config);
  const factors = buildQualityFactors({ summary, modules, businessJourneys, evidence, failedTests }, config);
  const score = calculateWeightedScore(factors, weights);
  const grade = getGrade(score, config);

  return {
    score,
    confidence: Math.max(config.qualityThresholds?.minimumConfidence ?? 50, score),
    grade,
    factors,
    weights,
    explanation: buildQualityExplanation(score, grade, factors),
  };
}

function calculateQualityScore(summary, config = {}) {
  return calculateQuality({ summary }, config).score;
}

module.exports = {
  buildQualityFactors,
  calculateQuality,
  calculateQualityScore,
  calculateWeightedScore,
  getEvidenceReadinessScore,
  getFailureSeverityScore,
  getGrade,
  getJourneyCoverageScore,
  getModuleHealthScore,
};
