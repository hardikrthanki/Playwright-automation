const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { loadAirConfig, readJsonIfExists } = require('./config/config-loader');
const { loadPlaywrightResults } = require('./parser/playwright-parser');
const { formatDuration } = require('./services/duration');
const { calculateQualityScore } = require('./services/quality-score');
const { buildReleaseDecision } = require('./services/release-decision');
const { buildModules } = require('./services/module-health');
const { buildBusinessJourneys, calculateBusinessHealth } = require('./services/journey-health');
const { mapEvidence } = require('./services/evidence-mapper');
const { buildSearchIndex } = require('./services/search-index');
const { schemaVersion, createFutureValidation } = require('./model/air-results.schema');

function readGitValue(projectRoot, command, fallback) {
  try {
    return execSync(command, {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || fallback;
  } catch {
    return fallback;
  }
}

function buildRecommendations(releaseDecision, modules) {
  const recommendations = [];

  if (releaseDecision.status === 'GO') {
    recommendations.push({
      priority: 'P1',
      title: 'Continue release monitoring',
      description: 'No blocker failures were detected. Keep monitoring the release after deployment.',
    });
  }

  for (const module of modules) {
    if (module.failed > 0) {
      recommendations.push({
        priority: module.critical ? 'P1' : 'P2',
        title: `Review ${module.name} failures`,
        description: `${module.failed} failure(s) require evidence review before approval.`,
      });
    }
  }

  recommendations.push(
    {
      priority: 'P2',
      title: 'Expand API validation',
      description: 'API validation is marked as roadmap data and should be added as an AIR input source.',
    },
    {
      priority: 'P3',
      title: 'Expand database validation',
      description: 'Database checks are planned and should be mapped to modules when available.',
    }
  );

  return recommendations;
}

function buildAirResults(projectRoot = path.resolve(__dirname, '..', '..')) {
  const config = loadAirConfig(projectRoot);
  const loaded = loadPlaywrightResults(projectRoot);
  const tests = loaded.tests;

  const modules = buildModules(tests, config);
  const businessJourneys = buildBusinessJourneys(tests, config);

  const total = tests.length;
  const passed = tests.filter(test => test.status === 'passed').length;
  const failed = tests.filter(test => test.status === 'failed').length;
  const skipped = tests.filter(test => test.status === 'skipped').length;
  const interrupted = tests.filter(test => test.status === 'interrupted').length;
  const durationMs = tests.reduce((sum, test) => sum + test.durationMs, 0);
  const passRate = total === 0 ? 0 : Math.round((passed / total) * 100);
  const businessHealth = calculateBusinessHealth(businessJourneys, passRate, failed);
  const summary = {
    total,
    passed,
    failed,
    skipped,
    interrupted,
    durationMs,
    duration: formatDuration(durationMs),
    passRate,
    businessHealth,
  };

  summary.qualityScore = calculateQualityScore(summary, config);

  const releaseDecision = buildReleaseDecision(summary, modules, businessJourneys, config);
  const generatedAt = new Date();
  const evidence = mapEvidence(tests, projectRoot, fs, path);
  const failures = tests
    .filter(test => test.status === 'failed')
    .map(test => ({
      testId: test.id,
      title: test.title,
      module: test.module,
      file: test.file,
      error: test.error,
      evidence: evidence.attachments?.filter(item => item.testId === test.id) ?? [],
    }));
  const recommendations = buildRecommendations(releaseDecision, modules);

  const airResults = {
    schemaVersion,
    reportInfo: {
      reportName: 'AIR Execution Report',
      productName: config.productName ?? 'AIR',
      productFullName: config.productFullName ?? 'Automation Intelligence Reporting',
      generatedAt: generatedAt.toISOString(),
      generatedAtDisplay: generatedAt.toLocaleString(),
      generatedBy: config.preparedBy ?? 'AIR Platform',
      engine: 'Playwright',
      mode: 'execution',
    },
    generatedAt: generatedAt.toISOString(),
    generatedAtDisplay: generatedAt.toLocaleString(),
    project: {
      name: config.projectName ?? 'Project',
      environment: config.environment ?? 'Environment',
      buildVersion: config.buildVersion ?? 'Unknown',
      branch: process.env.GITHUB_REF_NAME ?? process.env.BRANCH_NAME ?? readGitValue(projectRoot, 'git branch --show-current', 'Local'),
      commit: process.env.GITHUB_SHA?.slice(0, 8) ?? readGitValue(projectRoot, 'git rev-parse --short HEAD', 'Local'),
      trigger: process.env.CI ? 'CI Pipeline' : 'Local Execution',
    },
    environment: {
      name: config.environment ?? 'Environment',
      os: process.platform,
      runtime: 'Node.js',
    },
    execution: {
      id: `air-${generatedAt.getTime()}`,
      startedAt: '',
      endedAt: generatedAt.toISOString(),
      durationMs,
      duration: formatDuration(durationMs),
      trigger: process.env.CI ? 'CI Pipeline' : 'Local Execution',
      source: loaded.source,
    },
    source: {
      type: loaded.source,
      hasResults: loaded.hasResults,
      framework: 'Playwright',
    },
    summary: {
      ...summary,
      releaseDecision: releaseDecision.status,
      estimatedReleaseRisk: releaseDecision.riskLevel,
    },
    releaseDecision,
    businessJourneys,
    businessJourney: businessJourneys.map(journey => journey.name),
    modules,
    tests,
    failures,
    evidence,
    recommendations,
    searchIndex: [],
    history: [],
    futureValidation: createFutureValidation(),
    navigation: config.navigation,
  };

  airResults.searchIndex = buildSearchIndex(airResults);

  return airResults;
}

function snapshotAirResults(airResults) {
  return {
    generatedAt: airResults.generatedAt,
    generatedAtDisplay: airResults.generatedAtDisplay,
    project: airResults.project,
    source: airResults.source,
    summary: airResults.summary,
    releaseDecision: airResults.releaseDecision,
    modules: airResults.modules.map(module => ({
      name: module.name,
      critical: module.critical,
      total: module.total,
      passed: module.passed,
      failed: module.failed,
      skipped: module.skipped,
      score: module.score,
      risk: module.risk,
      status: module.status,
    })),
  };
}

function restoreFromBestHistory(projectRoot, outputPath, historyPath, existingHistory) {
  const config = loadAirConfig(projectRoot);
  const latestValidSnapshot = [...existingHistory]
    .filter(item => item?.summary?.total > 0)
    .sort((left, right) => {
      const totalDifference = (right.summary.total ?? 0) - (left.summary.total ?? 0);

      if (totalDifference !== 0) {
        return totalDifference;
      }

      return new Date(right.generatedAt ?? 0).getTime() - new Date(left.generatedAt ?? 0).getTime();
    })[0];

  if (!latestValidSnapshot) {
    return undefined;
  }

  const restoredAirResults = {
    schemaVersion,
    reportInfo: {
      reportName: 'AIR Execution Report',
      productName: config.productName ?? 'AIR',
      productFullName: config.productFullName ?? 'Automation Intelligence Reporting',
      generatedAt: new Date().toISOString(),
      generatedAtDisplay: new Date().toLocaleString(),
      generatedBy: config.preparedBy ?? 'AIR Platform',
      engine: 'Playwright',
      mode: 'execution',
    },
    generatedAt: new Date().toISOString(),
    generatedAtDisplay: new Date().toLocaleString(),
    project: latestValidSnapshot.project,
    environment: {
      name: latestValidSnapshot.project?.environment ?? config.environment ?? 'Environment',
      os: process.platform,
      runtime: 'Node.js',
    },
    execution: {
      id: `air-history-${Date.now()}`,
      startedAt: '',
      endedAt: new Date().toISOString(),
      durationMs: latestValidSnapshot.summary.durationMs ?? 0,
      duration: latestValidSnapshot.summary.duration ?? '0s',
      trigger: latestValidSnapshot.project?.trigger ?? 'Local Execution',
      source: 'air-history',
    },
    source: {
      type: 'air-history',
      hasResults: true,
      framework: 'Playwright',
      note: 'AIR reused the strongest valid execution snapshot because the available Playwright output was missing or older than history.',
    },
    summary: latestValidSnapshot.summary,
    releaseDecision: latestValidSnapshot.releaseDecision ?? {
      status: latestValidSnapshot.summary.releaseDecision,
      confidence: latestValidSnapshot.summary.qualityScore,
      riskLevel: latestValidSnapshot.summary.estimatedReleaseRisk,
      reasons: ['Restored from AIR history'],
      recommendedAction: 'Use latest full test run when available.',
    },
    businessJourneys: config.businessJourneys.map(journey => ({
      name: journey.name,
      critical: Boolean(journey.critical),
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      score: 0,
      status: 'No Data Available',
    })),
    businessJourney: config.businessJourneys.map(journey => journey.name),
    modules: (latestValidSnapshot.modules ?? []).map(module => ({
      ...module,
      coverage: module.score ?? 0,
      durationMs: 0,
      duration: '0s',
      tests: [],
    })),
    tests: [],
    failures: [],
    evidence: {
      playwrightReport: '',
      screenshots: [],
      videos: [],
      traces: [],
      logs: [],
      attachments: [],
    },
    recommendations: [
      {
        priority: 'P2',
        title: 'Run latest full execution',
        description: 'AIR is using history because raw Playwright output is missing or stale.',
      },
    ],
    searchIndex: [],
    history: existingHistory,
    futureValidation: createFutureValidation(),
    navigation: config.navigation,
  };

  restoredAirResults.searchIndex = buildSearchIndex(restoredAirResults);
  fs.writeFileSync(outputPath, `${JSON.stringify(restoredAirResults, null, 2)}\n`);
  fs.writeFileSync(historyPath, `${JSON.stringify(existingHistory, null, 2)}\n`);

  return restoredAirResults;
}

function writeAirResults(projectRoot = path.resolve(__dirname, '..', '..')) {
  const outputDir = path.join(projectRoot, 'execution-report');
  const outputPath = path.join(outputDir, 'air-results.json');
  const historyDir = path.join(outputDir, 'history');
  const historyPath = path.join(historyDir, 'air-history.json');
  const airResults = buildAirResults(projectRoot);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(historyDir, { recursive: true });

  const existingHistory = readJsonIfExists(historyPath, []);
  const bestHistoryTotal = Math.max(0, ...existingHistory.map(item => item?.summary?.total ?? 0));

  if (
    existingHistory.length > 0 &&
    (
      !airResults.source.hasResults ||
      (
        process.env.AIR_ALLOW_STALE_REPORT !== 'true' &&
        bestHistoryTotal > airResults.summary.total
      )
    )
  ) {
    const restoredAirResults = restoreFromBestHistory(projectRoot, outputPath, historyPath, existingHistory);

    if (restoredAirResults) {
      return {
        outputPath,
        airResults: restoredAirResults,
      };
    }
  }

  const history = [
    ...existingHistory,
    snapshotAirResults(airResults),
  ].slice(-30);

  airResults.history = history;
  fs.writeFileSync(outputPath, `${JSON.stringify(airResults, null, 2)}\n`);
  fs.writeFileSync(historyPath, `${JSON.stringify(history, null, 2)}\n`);

  return {
    outputPath,
    airResults,
  };
}

module.exports = {
  buildAirResults,
  writeAirResults,
  formatDuration,
};
