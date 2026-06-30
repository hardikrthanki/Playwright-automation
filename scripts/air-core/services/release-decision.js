function buildReleaseDecision(summary, modules = [], businessJourneys = [], config = {}) {
  const thresholds = config.releaseThresholds ?? {};
  const failedCriticalModules = modules.filter(module => module.critical && module.failed > 0);
  const failedCriticalJourneys = businessJourneys.filter(journey => journey.critical && journey.failed > 0);
  const hasBlockerFailure = failedCriticalModules.length > (thresholds.blockerFailureLimitForGo ?? 0);
  const hasCriticalJourneyFailure = failedCriticalJourneys.length > 0;
  const passRate = summary.passRate ?? 0;
  const businessHealth = summary.businessHealth ?? 0;

  let status = 'NO GO';
  let riskLevel = 'HIGH';

  if (
    !hasBlockerFailure &&
    !hasCriticalJourneyFailure &&
    summary.failed <= (thresholds.criticalFailureLimitForGo ?? 0) &&
    passRate >= (thresholds.goPassRate ?? 95) &&
    businessHealth >= (thresholds.goBusinessHealth ?? 90)
  ) {
    status = 'GO';
    riskLevel = 'LOW';
  } else if (
    !hasCriticalJourneyFailure &&
    passRate >= (thresholds.conditionalGoPassRate ?? 90) &&
    businessHealth >= (thresholds.conditionalGoBusinessHealth ?? 80)
  ) {
    status = 'CONDITIONAL GO';
    riskLevel = 'MEDIUM';
  }

  const reasons =
    status === 'GO'
      ? [
          'Critical journeys passed',
          'No blocker failures detected',
          'Pass rate is above release threshold',
          'Business risk is low',
        ]
      : status === 'CONDITIONAL GO'
        ? [
            'Critical journeys are not blocked',
            'Warnings require review',
            'Release can proceed after evidence review',
          ]
        : [
            hasCriticalJourneyFailure ? 'One or more critical journeys failed' : 'Release thresholds were not met',
            hasBlockerFailure ? 'Blocker module failures detected' : 'Quality signals need review',
            'Resolve failures before release approval',
          ];

  const confidence =
    status === 'GO'
      ? Math.min(99, Math.round((passRate + businessHealth) / 2))
      : status === 'CONDITIONAL GO'
        ? Math.max(70, Math.round((passRate + businessHealth) / 2) - 8)
        : Math.max(0, Math.round((passRate + businessHealth) / 2) - 25);

  return {
    status,
    confidence,
    riskLevel,
    reasons,
    recommendedAction:
      status === 'GO'
        ? 'Proceed with release monitoring.'
        : status === 'CONDITIONAL GO'
          ? 'Review warnings and attached evidence before approval.'
          : 'Do not release until blocker and critical failures are resolved.',
  };
}

module.exports = {
  buildReleaseDecision,
};
