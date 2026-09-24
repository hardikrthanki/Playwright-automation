function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function buildRecommendations(releaseDecision, modules = [], futureValidation = {}, coverageGaps = {}) {
  const recommendations = [];
  const gapSummary = coverageGaps.summary ?? {};
  const gapItems = asArray(coverageGaps.items);
  const blockedItems = gapItems.filter(item => item.category === 'Blocked');
  const unexpectedItems = gapItems.filter(item => item.category === 'Skipped');
  const blockedByModule = blockedItems.reduce((counts, item) => {
    const moduleName = item.module || 'General';
    counts[moduleName] = (counts[moduleName] ?? 0) + 1;
    return counts;
  }, {});
  const topBlockedModule = Object.entries(blockedByModule)
    .sort((left, right) => right[1] - left[1])[0];

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
      description: unexpectedItems.length > 0
        ? `Release can proceed only after ${unexpectedItems.length} unexpected skip(s) and remaining coverage warnings are reviewed.`
        : 'Executed tests passed. Review blocked and not-executed coverage before treating this as a full GO.',
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

  if (unexpectedItems.length > 0) {
    recommendations.push({
      priority: 'P1',
      title: 'Triage unexpected skips',
      description: `${unexpectedItems.length} skipped check(s) are not classified as blocked, controlled, future, or traceability. Annotate or execute them so AIR can score coverage accurately.`,
      source: 'coverageGaps',
    });
  }

  if (blockedItems.length > 0) {
    recommendations.push({
      priority: 'P1',
      title: topBlockedModule
        ? `Unblock ${topBlockedModule[1]} ${topBlockedModule[0]} scenario(s)`
        : 'Unblock remaining scenarios',
      description: `${blockedItems.length} blocked scenario(s) still need fixtures, admin, API, scheduler, or third-party hooks before AIR can recommend GO.`,
      module: topBlockedModule?.[0],
      source: 'coverageGaps',
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

  if ((gapSummary.controlled ?? 0) > 0) {
    recommendations.push({
      priority: 'P2',
      title: 'Run remaining controlled Stripe or env-gated flows',
      description: `${gapSummary.controlled} controlled scenario(s) are waiting on flags, fixtures, or sandbox state. Enable them when the next execution is meant to expand billing coverage.`,
      source: 'coverageGaps',
    });
  }

  if (futureValidation.api?.status === 'Roadmap') {
    recommendations.push({
      priority: 'P3',
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
