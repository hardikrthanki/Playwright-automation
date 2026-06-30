function normalizeAttachments(attachments = []) {
  return attachments.map(attachment => ({
    name: attachment.name ?? '',
    contentType: attachment.contentType ?? '',
    path: attachment.path ?? '',
  }));
}

function classifyEvidence(attachment) {
  const name = String(attachment.name ?? '').toLowerCase();
  const path = String(attachment.path ?? '').toLowerCase();
  const contentType = String(attachment.contentType ?? '').toLowerCase();

  if (contentType.includes('image')) return 'screenshot';
  if (contentType.includes('video')) return 'video';
  if (name.includes('trace') || path.endsWith('.zip')) return 'trace';
  if (name.includes('log') || contentType.includes('text')) return 'log';

  return 'attachment';
}

function buildEvidenceItem(attachment, test) {
  return {
    ...attachment,
    testId: test.id,
    testTitle: test.title,
    module: test.module ?? 'General',
    type: classifyEvidence(attachment),
    previewable: isPreviewableEvidence(attachment),
  };
}

function isPreviewableEvidence(attachment) {
  const type = classifyEvidence(attachment);
  const path = String(attachment.path ?? '').toLowerCase();

  return ['screenshot', 'video'].includes(type) ||
    path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.jpeg') ||
    path.endsWith('.webp') ||
    path.endsWith('.webm') ||
    path.endsWith('.mp4');
}

function pushEvidence(evidence, item) {
  if (item.type === 'screenshot') evidence.screenshots.push(item);
  else if (item.type === 'video') evidence.videos.push(item);
  else if (item.type === 'trace') evidence.traces.push(item);
  else if (item.type === 'log') evidence.logs.push(item);
  else evidence.attachments.push(item);
}

function groupEvidenceBy(items, field) {
  return items.reduce((map, item) => {
    const key = item[field] || 'Unknown';

    if (!map[key]) {
      map[key] = [];
    }

    map[key].push(item);

    return map;
  }, {});
}

function createRawReports(projectRoot, fs, path, evidenceConfig = {}) {
  const reports = [];
  const configuredReportPath = evidenceConfig.playwrightReportPath ?? 'playwright-report/index.html';
  const rawResultsPath = evidenceConfig.rawResultsPath ?? 'test-results/results.json';

  if (fs.existsSync(path.join(projectRoot, configuredReportPath))) {
    reports.push({
      type: 'html-report',
      name: 'Automation HTML report',
      path: configuredReportPath,
      available: true,
    });
  }

  if (fs.existsSync(path.join(projectRoot, rawResultsPath))) {
    reports.push({
      type: 'raw-results',
      name: 'Raw automation results',
      path: rawResultsPath,
      available: true,
    });
  }

  return reports;
}

function buildEvidenceSummary(evidence) {
  return {
    screenshots: evidence.screenshots.length,
    videos: evidence.videos.length,
    traces: evidence.traces.length,
    logs: evidence.logs.length,
    attachments: evidence.attachments.length,
    rawReports: evidence.rawReports.length,
    total:
      evidence.screenshots.length +
      evidence.videos.length +
      evidence.traces.length +
      evidence.logs.length +
      evidence.attachments.length +
      evidence.rawReports.length,
  };
}

function mapEvidence(tests, projectRoot, fs, path, evidenceConfig = {}) {
  const evidence = {
    screenshots: [],
    videos: [],
    traces: [],
    logs: [],
    attachments: [],
    rawReports: createRawReports(projectRoot, fs, path, evidenceConfig),
    playwrightReport: '',
    byTest: {},
    byModule: {},
    summary: {},
  };

  evidence.playwrightReport = evidence.rawReports.find(report => report.type === 'html-report')?.path ?? '';

  for (const test of tests) {
    for (const attachment of test.attachments ?? []) {
      pushEvidence(evidence, buildEvidenceItem(attachment, test));
    }
  }

  const allEvidenceItems = [
    ...evidence.screenshots,
    ...evidence.videos,
    ...evidence.traces,
    ...evidence.logs,
    ...evidence.attachments,
  ];

  evidence.byTest = groupEvidenceBy(allEvidenceItems, 'testId');
  evidence.byModule = groupEvidenceBy(allEvidenceItems, 'module');
  evidence.summary = buildEvidenceSummary(evidence);

  return evidence;
}

module.exports = {
  buildEvidenceItem,
  buildEvidenceSummary,
  classifyEvidence,
  groupEvidenceBy,
  isPreviewableEvidence,
  mapEvidence,
  normalizeAttachments,
};
