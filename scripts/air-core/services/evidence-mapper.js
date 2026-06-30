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

function mapEvidence(tests, projectRoot, fs, path) {
  const evidence = {
    screenshots: [],
    videos: [],
    traces: [],
    logs: [],
    attachments: [],
    playwrightReport: fs.existsSync(path.join(projectRoot, 'playwright-report', 'index.html'))
      ? 'playwright-report/index.html'
      : '',
  };

  for (const test of tests) {
    for (const attachment of test.attachments ?? []) {
      const mapped = {
        ...attachment,
        testId: test.id,
        testTitle: test.title,
        module: test.module,
        type: classifyEvidence(attachment),
      };

      if (mapped.type === 'screenshot') evidence.screenshots.push(mapped);
      else if (mapped.type === 'video') evidence.videos.push(mapped);
      else if (mapped.type === 'trace') evidence.traces.push(mapped);
      else if (mapped.type === 'log') evidence.logs.push(mapped);
      else evidence.attachments.push(mapped);
    }
  }

  return evidence;
}

module.exports = {
  normalizeAttachments,
  classifyEvidence,
  mapEvidence,
};
