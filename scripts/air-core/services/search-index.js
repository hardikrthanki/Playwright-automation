function buildSearchIndex(airResults) {
  const entries = [];

  for (const module of airResults.modules ?? []) {
    entries.push({
      type: 'module',
      title: module.name,
      target: `#module-dashboard-${String(module.name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      text: [module.name, module.status, module.risk].join(' '),
    });
  }

  for (const test of airResults.tests ?? []) {
    entries.push({
      type: test.status === 'failed' ? 'failure' : 'test',
      title: test.title,
      target: '#failures',
      text: [test.title, test.file, test.module, test.status, test.error].join(' '),
    });
  }

  for (const recommendation of airResults.recommendations ?? []) {
    entries.push({
      type: 'recommendation',
      title: recommendation.title,
      target: '#insight',
      text: [recommendation.title, recommendation.description, recommendation.priority].join(' '),
    });
  }

  return entries;
}

module.exports = {
  buildSearchIndex,
};
