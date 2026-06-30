const { loadPlaywrightResults } = require('../parser/playwright-parser');

const parserAdapters = {
  playwright: {
    framework: 'Playwright',
    load: loadPlaywrightResults,
  },
};

function normalizeFrameworkName(value) {
  return String(value ?? 'playwright').trim().toLowerCase();
}

function getParserAdapter(config = {}) {
  const requestedFramework = normalizeFrameworkName(
    process.env.AIR_FRAMEWORK ?? config.framework ?? config.engine ?? 'playwright'
  );
  const adapter = parserAdapters[requestedFramework];

  if (adapter) {
    return adapter;
  }

  return {
    ...parserAdapters.playwright,
    warning: `Parser adapter "${requestedFramework}" is not available. AIR used the Playwright adapter.`,
  };
}

function loadAutomationResults(projectRoot, config = {}) {
  const adapter = getParserAdapter(config);
  const loaded = adapter.load(projectRoot, config);

  return {
    ...loaded,
    framework: adapter.framework,
    adapterWarning: adapter.warning ?? '',
  };
}

module.exports = {
  loadAutomationResults,
  getParserAdapter,
  normalizeFrameworkName,
};
