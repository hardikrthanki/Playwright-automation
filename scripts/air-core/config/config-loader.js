const fs = require('fs');
const path = require('path');

function readJsonIfExists(filePath, fallback = undefined) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadAirConfig(projectRoot) {
  const configDir = path.join(projectRoot, 'config');
  const baseConfig = readJsonIfExists(path.join(configDir, 'air.config.json'), {});
  const modulesConfig = readJsonIfExists(path.join(configDir, 'air.modules.json'), {});
  const journeysConfig = readJsonIfExists(path.join(configDir, 'air.journeys.json'), {});
  const thresholdsConfig = readJsonIfExists(path.join(configDir, 'air.thresholds.json'), {});
  const evidenceConfig = readJsonIfExists(path.join(configDir, 'air.evidence.json'), {});
  const navigationConfig = readJsonIfExists(path.join(configDir, 'air.navigation.json'), {});

  const legacyModuleMappings = Object.entries(baseConfig.moduleMappings ?? {}).map(([name, patterns]) => ({
    name,
    patterns,
    critical: false,
  }));

  const configuredModules = modulesConfig.modules?.length
    ? modulesConfig.modules
    : legacyModuleMappings;

  return {
    ...baseConfig,
    modules: configuredModules,
    businessJourneys: journeysConfig.businessJourneys ?? (baseConfig.businessJourney ?? []).map(name => ({
      name,
      patterns: [name],
      critical: false,
    })),
    releaseThresholds: {
      ...(baseConfig.releaseThresholds ?? {}),
      ...(thresholdsConfig.releaseThresholds ?? {}),
    },
    qualityScoreWeights: thresholdsConfig.qualityScoreWeights ?? {
      passRate: 0.65,
      businessHealth: 0.35,
    },
    evidence: evidenceConfig,
    navigation: navigationConfig.sections ?? [],
  };
}

module.exports = {
  loadAirConfig,
  readJsonIfExists,
};
