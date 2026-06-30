const schemaVersion = '1.0';

const requiredTopLevelSections = [
  'schemaVersion',
  'reportInfo',
  'project',
  'environment',
  'execution',
  'executionContext',
  'source',
  'summary',
  'discovery',
  'quality',
  'release',
  'releaseDecision',
  'businessJourneys',
  'modules',
  'tests',
  'failedTests',
  'evidence',
  'recommendations',
  'searchIndex',
  'history',
  'futureValidation',
  'navigation',
  'engineLog',
];

function createFutureValidation() {
  return {
    api: { status: 'Roadmap', summary: 'API validation is planned for a future AIR data source.' },
    database: { status: 'Roadmap', summary: 'Database validation is planned for a future AIR data source.' },
    security: { status: 'Roadmap', summary: 'Security scan ingestion is planned for a future AIR data source.' },
    performance: { status: 'Roadmap', summary: 'Performance metrics ingestion is planned for a future AIR data source.' },
  };
}

module.exports = {
  schemaVersion,
  requiredTopLevelSections,
  createFutureValidation,
};
