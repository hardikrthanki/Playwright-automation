const { buildReleaseDecision: buildReleaseDecisionFromEngine } = require('../engine/release-engine');

function buildReleaseDecision(summary = {}, modules = [], businessJourneys = [], config = {}) {
  return buildReleaseDecisionFromEngine({
    summary,
    modules,
    businessJourneys,
    config,
  });
}

module.exports = {
  buildReleaseDecision,
};
