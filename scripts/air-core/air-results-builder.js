const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { loadAirConfig, readJsonIfExists } = require('./config/config-loader');
const { loadAutomationResults } = require('./services/parser-service');
const { formatDuration } = require('./services/duration');
const { runEnginePipeline } = require('./engine/engine-orchestrator');
const { schemaVersion, createFutureValidation } = require('./model/air-results.schema');
const { validateAirResults } = require('./model/air-results-validator');

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

function getStoredExecutions(history) {
  if (Array.isArray(history)) {
    return history;
  }

  return Array.isArray(history?.executions) ? history.executions : [];
}

function buildAirResults(projectRoot = path.resolve(__dirname, '..', '..'), options = {}) {
  const config = loadAirConfig(projectRoot);
  const loaded = loadAutomationResults(projectRoot, config);
  const tests = loaded.tests;
  const generatedAt = new Date();
  const initialAirResults = {
    schemaVersion,
    reportInfo: {
      reportName: 'AIR Execution Report',
      productName: config.productName ?? 'AIR',
      productFullName: config.productFullName ?? 'Automation Intelligence Reporting',
      generatedAt: generatedAt.toISOString(),
      generatedAtDisplay: generatedAt.toLocaleString(),
      generatedBy: config.preparedBy ?? 'AIR Platform',
      engine: loaded.framework,
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
      durationMs: 0,
      duration: '0s',
      trigger: process.env.CI ? 'CI Pipeline' : 'Local Execution',
      source: loaded.source,
    },
    source: {
      type: loaded.source,
      hasResults: loaded.hasResults,
      framework: loaded.framework,
      adapterWarning: loaded.adapterWarning,
    },
    executionContext: {},
    summary: {},
    discovery: {
      summary: {},
      newTests: [],
      mappedTests: [],
      unmappedTests: [],
      suggestions: [],
      configurationIssues: [],
    },
    release: {},
    releaseDecision: {},
    quality: {},
    businessJourneys: [],
    businessJourney: [],
    modules: [],
    tests,
    failedTests: [],
    failures: [],
    evidence: {},
    recommendations: [],
    searchIndex: [],
    history: {
      executions: [],
      trends: {},
      comparison: {},
      regressions: [],
      improvements: [],
      summary: {},
    },
    futureValidation: createFutureValidation(),
    navigation: config.navigation,
    engineLog: [
      {
        engine: 'History Restore',
        status: 'passed',
        reason: 'AIR restored the strongest valid historical execution snapshot.',
      },
    ],
  };

  const airResults = runEnginePipeline(initialAirResults, {
    projectRoot,
    config,
    loaded,
    existingHistory: options.existingHistory ?? [],
    fs,
    path,
  });

  airResults.validation = validateAirResults(airResults);

  return airResults;
}

function normalizeSavedRelease(snapshot = {}) {
  const status = snapshot.release?.status ?? snapshot.releaseDecision?.status ?? snapshot.summary?.releaseDecision ?? 'NO GO';
  const riskLevel = snapshot.release?.riskLevel ?? snapshot.release?.risk ?? snapshot.releaseDecision?.riskLevel ?? snapshot.summary?.estimatedReleaseRisk ?? 'HIGH';

  return {
    decision: status === 'CONDITIONAL GO' ? 'CONDITIONAL_GO' : status === 'GO' ? 'GO' : 'NO_GO',
    status,
    confidence: snapshot.release?.confidence ?? snapshot.releaseDecision?.confidence ?? snapshot.summary?.qualityScore ?? 0,
    risk: riskLevel,
    riskLevel,
    reasons: snapshot.release?.reasons ?? snapshot.releaseDecision?.reasons ?? ['AIR restored release data from history.'],
    warnings: snapshot.release?.warnings ?? [],
    blockers: snapshot.release?.blockers ?? [],
    requiredActions: snapshot.release?.requiredActions ?? [],
    recommendedAction: snapshot.release?.recommendedAction ?? snapshot.releaseDecision?.recommendedAction ?? 'Run the latest full execution before final approval.',
    explanation: snapshot.release?.explanation ?? 'AIR restored release decision from history.',
  };
}

function restoreFromBestHistory(projectRoot, outputPath, historyPath, existingHistory) {
  const config = loadAirConfig(projectRoot);
  const existingExecutions = getStoredExecutions(existingHistory);
  const latestValidSnapshot = [...existingExecutions]
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
      engine: 'AIR History',
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
      framework: latestValidSnapshot.source?.framework ?? 'AIR History',
      note: 'AIR reused the strongest valid execution snapshot because the available Playwright output was missing or older than history.',
    },
    summary: latestValidSnapshot.summary,
    executionContext: latestValidSnapshot.executionContext ?? {
      type: 'Historical Snapshot',
      scope: 'Saved execution history',
      executedModules: (latestValidSnapshot.modules ?? []).map(module => module.name).filter(Boolean),
      coverage: 0,
      confidence: latestValidSnapshot.summary?.qualityScore ?? 0,
      validationLevel: 'Historical Snapshot',
    },
    releaseDecision: normalizeSavedRelease(latestValidSnapshot),
    release: normalizeSavedRelease(latestValidSnapshot),
    quality: {
      score: latestValidSnapshot.summary?.qualityScore ?? 0,
      confidence: latestValidSnapshot.summary?.qualityScore ?? 0,
      grade: 'Historical Snapshot',
      factors: {},
      weights: {},
      explanation: ['AIR restored quality data from history. Run the latest execution for full factor details.'],
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
    failedTests: [],
    failures: [],
    evidence: {
      playwrightReport: '',
      rawReports: [],
      screenshots: [],
      videos: [],
      traces: [],
      logs: [],
      attachments: [],
      byTest: {},
      byModule: {},
      summary: {},
    },
    recommendations: [
      {
        priority: 'P2',
        title: 'Run latest full execution',
        description: 'AIR is using history because raw Playwright output is missing or stale.',
      },
    ],
    searchIndex: [],
    history: Array.isArray(existingHistory)
      ? {
          executions: existingHistory,
          trends: {},
          comparison: { status: 'Historical Restore' },
          regressions: [],
          improvements: [],
          summary: {
            status: 'Historical Restore',
            totalExecutions: existingHistory.length,
          },
        }
      : existingHistory,
    futureValidation: createFutureValidation(),
    navigation: config.navigation,
  };

  restoredAirResults.validation = validateAirResults(restoredAirResults);
  fs.writeFileSync(outputPath, `${JSON.stringify(restoredAirResults, null, 2)}\n`);
  fs.writeFileSync(historyPath, `${JSON.stringify(existingHistory, null, 2)}\n`);

  return restoredAirResults;
}

function writeAirResults(projectRoot = path.resolve(__dirname, '..', '..')) {
  const outputDir = path.join(projectRoot, 'execution-report');
  const outputPath = path.join(outputDir, 'air-results.json');
  const historyDir = path.join(outputDir, 'history');
  const historyPath = path.join(historyDir, 'air-history.json');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(historyDir, { recursive: true });

  const existingHistory = readJsonIfExists(historyPath, []);
  const existingExecutions = getStoredExecutions(existingHistory);
  const airResults = buildAirResults(projectRoot, {
    existingHistory,
  });
  const bestHistoryTotal = Math.max(0, ...existingExecutions.map(item => item?.summary?.total ?? 0));

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

  fs.writeFileSync(outputPath, `${JSON.stringify(airResults, null, 2)}\n`);
  fs.writeFileSync(historyPath, `${JSON.stringify(airResults.history, null, 2)}\n`);

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
