function calculateQualityScore(summary, config = {}) {
  const weights = config.qualityScoreWeights ?? {
    passRate: 0.65,
    businessHealth: 0.35,
  };

  return Math.round(
    ((summary.passRate ?? 0) * weights.passRate) +
    ((summary.businessHealth ?? 0) * weights.businessHealth)
  );
}

module.exports = {
  calculateQualityScore,
};
