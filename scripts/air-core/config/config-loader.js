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
  const releaseConfig = readJsonIfExists(path.join(configDir, 'air.release.json'), {});
  const evidenceConfig = readJsonIfExists(path.join(configDir, 'air.evidence.json'), {});
  const navigationConfig = readJsonIfExists(path.join(configDir, 'air.navigation.json'), {});
  const manualDefectsConfig = readJsonIfExists(path.join(configDir, 'air.manual-defects.json'), {});

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
    releaseRules: releaseConfig.releaseRules ?? thresholdsConfig.releaseRules ?? {},
    qualityScoreWeights: thresholdsConfig.qualityScoreWeights ?? {
      passRate: 0.65,
      businessHealth: 0.35,
    },
    qualityGradeBoundaries: thresholdsConfig.qualityGradeBoundaries ?? [],
    qualityThresholds: thresholdsConfig.qualityThresholds ?? {},
    evidence: evidenceConfig,
    navigation: navigationConfig.sections ?? [],
    manualDefects: manualDefectsConfig.defects ?? [],
  };
}

module.exports = {
  loadAirConfig,
  readJsonIfExists,
};
