const schemaVersion = '1.0';

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
  createFutureValidation,
};
