const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { readJsonIfExists } = require('../config/config-loader');
const { normalizeAttachments } = require('../services/evidence-mapper');

function normalizeStatus(status) {
  if (status === 'timedOut' || status === 'unexpected') {
    return 'failed';
  }

  return status ?? 'unknown';
}

function resolvePlaywrightStatus(test, result) {
  const overallStatus = test?.status ?? test?.outcome;

  if (overallStatus === 'expected') {
    return 'passed';
  }

  if (overallStatus === 'unexpected') {
    return 'failed';
  }

  if (overallStatus === 'skipped') {
    return 'skipped';
  }

  if (overallStatus === 'flaky') {
    return 'flaky';
  }

  return result?.status ?? overallStatus;
}

function normalizeTitleParts(parts = []) {
  return parts
    .map(part => String(part ?? '').trim())
    .filter(Boolean);
}

function createCanonicalTestId({
  project = '',
  file = '',
  suiteTitle = [],
  title = '',
  testId = '',
}) {
  return normalizeTitleParts([
    project,
    file,
    ...suiteTitle,
    title,
    testId,
  ]).join(' > ');
}

function normalizeSuiteTitleForFile(suiteTitle = [], file = '') {
  const normalizedFile = String(file ?? '').replace(/\\/g, '/').split('/').at(-1);
  const [first, ...rest] = suiteTitle;

  if (first === file || first === normalizedFile) {
    return rest;
  }

  return suiteTitle;
}

function normalizeAttempt(result = {}, test = {}) {
  const retry = result.retry ?? 0;

  return {
    id: `${test.id ?? ''}#attempt-${retry + 1}`,
    attempt: retry + 1,
    retry,
    status: normalizeStatus(result.status ?? test.status ?? test.outcome),
    durationMs: result.duration ?? 0,
    error: result.error?.message ?? '',
    annotations: [
      ...(test.annotations ?? []),
      ...(result.annotations ?? []),
    ],
    attachments: normalizeAttachments(result.attachments),
  };
}

function getFinalAttempt(test = {}) {
  const results = test.results ?? [];

  if (results.length === 0) {
    return undefined;
  }

  return [...results].sort((left, right) => (left.retry ?? 0) - (right.retry ?? 0)).at(-1);
}

function buildCanonicalTestRecord({
  suiteTitle = [],
  spec = {},
  test = {},
  file = '',
  titlePrefix = [],
}) {
  const finalAttempt = getFinalAttempt(test);
  const attempts = (test.results ?? []).map(result => normalizeAttempt(result, test));
  const attemptAttachments = attempts.flatMap(attempt =>
    (attempt.attachments ?? []).map(attachment => ({
      ...attachment,
      attempt: attempt.attempt,
      retry: attempt.retry,
      attemptId: attempt.id,
      attemptStatus: attempt.status,
    }))
  );
  const project = test.projectName ?? '';
  const normalizedSuiteTitle = normalizeSuiteTitleForFile(suiteTitle, file);
  const titleParts = normalizeTitleParts([
    ...titlePrefix,
    ...normalizedSuiteTitle,
    spec.title,
  ]);
  const id = createCanonicalTestId({
    project,
    file,
    suiteTitle: normalizedSuiteTitle,
    title: spec.title,
    testId: test.testId ?? test.id ?? '',
  });
  const finalStatus = normalizeStatus(resolvePlaywrightStatus(test, finalAttempt));

  return {
    id,
    canonicalId: id,
    testId: test.testId ?? test.id ?? '',
    title: titleParts.join(' > '),
    file,
    project,
    status: finalStatus,
    durationMs: attempts.reduce((sum, attempt) => sum + (attempt.durationMs ?? 0), 0),
    error: finalAttempt?.error?.message ?? attempts.find(attempt => attempt.error)?.error ?? '',
    retry: finalAttempt?.retry ?? 0,
    attempts,
    attemptCount: attempts.length,
    flaky: (test.status ?? test.outcome) === 'flaky',
    annotations: [
      ...(test.annotations ?? []),
      ...(finalAttempt?.annotations ?? []),
    ],
    attachments: attemptAttachments,
  };
}

function getStatusPriority(status) {
  const priorities = {
    failed: 5,
    interrupted: 4,
    flaky: 3,
    passed: 2,
    skipped: 1,
    unknown: 0,
  };

  return priorities[status] ?? priorities.unknown;
}

function getPreferredTestRecord(records = []) {
  return [...records].sort((left, right) => {
    const statusDifference = getStatusPriority(right.status) - getStatusPriority(left.status);

    if (statusDifference !== 0) {
      return statusDifference;
    }

    return (right.retry ?? 0) - (left.retry ?? 0);
  })[0];
}

function dedupeCanonicalTests(tests = []) {
  const groups = tests.reduce((map, test) => {
    const id = test.canonicalId ?? test.id;

    if (!map.has(id)) {
      map.set(id, []);
    }

    map.get(id).push(test);

    return map;
  }, new Map());
  const duplicateCanonicalTestIds = [];
  const dedupedTests = [];

  for (const [id, records] of groups.entries()) {
    if (records.length > 1) {
      duplicateCanonicalTestIds.push({
        id,
        count: records.length,
      });
    }

    const preferred = getPreferredTestRecord(records);
    const attempts = records.flatMap(record => record.attempts ?? []);
    const attachments = records.flatMap(record => record.attachments ?? []);

    dedupedTests.push({
      ...preferred,
      attempts,
      attachments,
      durationMs: records.reduce((sum, record) => sum + (record.durationMs ?? 0), 0),
      attemptCount: attempts.length || records.reduce((sum, record) => sum + Math.max(1, record.attemptCount ?? 1), 0),
      duplicateSourceRecords: records.length,
      deduplicated: records.length > 1,
    });
  }

  return {
    tests: dedupedTests,
    rawTestCount: tests.length,
    duplicateCanonicalTestIds,
    duplicateCount: duplicateCanonicalTestIds.reduce((sum, duplicate) => sum + duplicate.count - 1, 0),
  };
}

function readZipEntry(zipBuffer, targetName) {
  const eocdSignature = 0x06054b50;
  let eocdOffset = -1;

  for (let index = zipBuffer.length - 22; index >= 0; index--) {
    if (zipBuffer.readUInt32LE(index) === eocdSignature) {
      eocdOffset = index;
      break;
    }
  }

  if (eocdOffset === -1) {
    throw new Error('Unable to locate Playwright report zip directory.');
  }

  const entryCount = zipBuffer.readUInt16LE(eocdOffset + 10);
  let centralDirectoryOffset = zipBuffer.readUInt32LE(eocdOffset + 16);

  for (let entryIndex = 0; entryIndex < entryCount; entryIndex++) {
    const signature = zipBuffer.readUInt32LE(centralDirectoryOffset);

    if (signature !== 0x02014b50) {
      throw new Error('Invalid Playwright report zip directory.');
    }

    const compressionMethod = zipBuffer.readUInt16LE(centralDirectoryOffset + 10);
    const compressedSize = zipBuffer.readUInt32LE(centralDirectoryOffset + 20);
    const fileNameLength = zipBuffer.readUInt16LE(centralDirectoryOffset + 28);
    const extraLength = zipBuffer.readUInt16LE(centralDirectoryOffset + 30);
    const commentLength = zipBuffer.readUInt16LE(centralDirectoryOffset + 32);
    const localHeaderOffset = zipBuffer.readUInt32LE(centralDirectoryOffset + 42);
    const fileName = zipBuffer
      .subarray(centralDirectoryOffset + 46, centralDirectoryOffset + 46 + fileNameLength)
      .toString('utf8');

    if (fileName === targetName) {
      const localFileNameLength = zipBuffer.readUInt16LE(localHeaderOffset + 26);
      const localExtraLength = zipBuffer.readUInt16LE(localHeaderOffset + 28);
      const dataStart = localHeaderOffset + 30 + localFileNameLength + localExtraLength;
      const compressedData = zipBuffer.subarray(dataStart, dataStart + compressedSize);

      if (compressionMethod === 0) {
        return compressedData.toString('utf8');
      }

      if (compressionMethod === 8) {
        return zlib.inflateRawSync(compressedData).toString('utf8');
      }

      throw new Error(`Unsupported zip compression method: ${compressionMethod}`);
    }

    centralDirectoryOffset += 46 + fileNameLength + extraLength + commentLength;
  }

  throw new Error(`Unable to find ${targetName} in Playwright report.`);
}

function readPlaywrightHtmlReport(playwrightReportPath) {
  if (!fs.existsSync(playwrightReportPath)) {
    return undefined;
  }

  const html = fs.readFileSync(playwrightReportPath, 'utf8');
  const match = html.match(
    /<template[^>]*id=["']playwrightReportBase64["'][^>]*>([\s\S]*?)<\/template>/
  );

  if (!match) {
    return undefined;
  }

  const encodedReport = match[1]
    .trim()
    .replace(/^data:application\/zip;base64,/, '');
  const zipBuffer = Buffer.from(encodedReport, 'base64');
  const reportJson = readZipEntry(zipBuffer, 'report.json');

  return JSON.parse(reportJson);
}

function collectJsonReporterTests(suites, parentTitle = []) {
  const tests = [];

  for (const suite of suites ?? []) {
    const suiteTitle = suite.title ? [...parentTitle, suite.title] : parentTitle;

    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        tests.push(buildCanonicalTestRecord({
          suiteTitle,
          spec,
          test,
          file: suite.file ?? '',
        }));
      }
    }

    tests.push(...collectJsonReporterTests(suite.suites, suiteTitle));
  }

  return tests;
}

function collectHtmlReportTests(files) {
  const tests = [];

  for (const file of files ?? []) {
    for (const test of file.tests ?? []) {
      tests.push(buildCanonicalTestRecord({
        suiteTitle: test.path ?? [],
        spec: {
          title: test.title,
        },
        test,
        file: file.fileName ?? '',
        titlePrefix: [file.fileName],
      }));
    }
  }

  return tests;
}

function loadPlaywrightResults(projectRoot) {
  const resultsPath = path.join(projectRoot, 'test-results', 'results.json');
  const playwrightReportPath = path.join(projectRoot, 'playwright-report', 'index.html');

  if (fs.existsSync(resultsPath)) {
    const raw = readJsonIfExists(resultsPath, { suites: [] });
    const collectedTests = collectJsonReporterTests(raw.suites);
    const deduped = dedupeCanonicalTests(collectedTests);

    return {
      hasResults: true,
      source: 'json-reporter',
      raw,
      ...deduped,
    };
  }

  const htmlReport = readPlaywrightHtmlReport(playwrightReportPath);

  if (htmlReport) {
    const collectedTests = collectHtmlReportTests(htmlReport.files);
    const deduped = dedupeCanonicalTests(collectedTests);

    return {
      hasResults: true,
      source: 'html-report',
      raw: htmlReport,
      ...deduped,
    };
  }

  return {
    hasResults: false,
    source: 'missing',
    raw: { suites: [] },
    tests: [],
    rawTestCount: 0,
    duplicateCanonicalTestIds: [],
    duplicateCount: 0,
  };
}

module.exports = {
  createCanonicalTestId,
  dedupeCanonicalTests,
  loadPlaywrightResults,
  normalizeStatus,
};
