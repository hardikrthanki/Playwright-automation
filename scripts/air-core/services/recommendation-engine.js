function buildRecommendations(releaseDecision, modules = [], futureValidation = {}) {
  const recommendations = [];

  if (releaseDecision.status === 'GO') {
    recommendations.push({
      priority: 'P1',
      title: 'Continue release monitoring',
      description: 'No blocker failures were detected. Keep monitoring the release after deployment.',
      source: 'releaseDecision',
    });
  }

  if (releaseDecision.status === 'CONDITIONAL GO') {
    recommendations.push({
      priority: 'P1',
      title: 'Review release warnings',
      description: 'Release can proceed only after warning evidence is reviewed and accepted.',
      source: 'releaseDecision',
    });
  }

  if (releaseDecision.status === 'NO GO') {
    recommendations.push({
      priority: 'P1',
      title: 'Resolve release blockers',
      description: 'Do not approve release until blocker or critical failures are resolved.',
      source: 'releaseDecision',
    });
  }

  for (const module of modules) {
    if (module.failed > 0) {
      recommendations.push({
        priority: module.critical ? 'P1' : 'P2',
        title: `Review ${module.name} failures`,
        description: `${module.failed} failure(s) require evidence review before approval.`,
        module: module.name,
        source: 'moduleHealth',
      });
    }
  }

  if (futureValidation.api?.status === 'Roadmap') {
    recommendations.push({
      priority: 'P2',
      title: 'Expand API validation',
      description: 'API validation is marked as roadmap data and should be added as an AIR input source.',
      source: 'futureValidation',
    });
  }

  if (futureValidation.database?.status === 'Roadmap') {
    recommendations.push({
      priority: 'P3',
      title: 'Expand database validation',
      description: 'Database checks are planned and should be mapped to modules when available.',
      source: 'futureValidation',
    });
  }

  return recommendations;
}

module.exports = {
  buildRecommendations,
};
