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
        for (const result of test.results ?? []) {
          tests.push({
            id: `${suiteTitle.join(' > ')} > ${spec.title}`.replace(/^ > /, ''),
            title: [...suiteTitle, spec.title].filter(Boolean).join(' > '),
            file: suite.file ?? '',
            project: test.projectName ?? '',
            status: normalizeStatus(result.status),
            durationMs: result.duration ?? 0,
            error: result.error?.message ?? '',
            retry: result.retry ?? 0,
            attachments: normalizeAttachments(result.attachments),
          });
        }
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
      for (const result of test.results ?? []) {
        const status = result.status ??
          (
            test.outcome === 'expected'
              ? 'passed'
              : test.outcome === 'skipped'
                ? 'skipped'
                : test.outcome === 'unexpected'
                  ? 'failed'
                  : test.outcome
          );

        tests.push({
          id: `${file.fileName} > ${(test.path ?? []).join(' > ')} > ${test.title}`,
          title: [file.fileName, ...(test.path ?? []), test.title].filter(Boolean).join(' > '),
          file: file.fileName ?? '',
          project: test.projectName ?? '',
          status: normalizeStatus(status),
          durationMs: result.duration ?? test.duration ?? 0,
          error: result.error?.message ?? '',
          retry: result.retry ?? 0,
          attachments: normalizeAttachments(result.attachments),
        });
      }
    }
  }

  return tests;
}

function loadPlaywrightResults(projectRoot) {
  const resultsPath = path.join(projectRoot, 'test-results', 'results.json');
  const playwrightReportPath = path.join(projectRoot, 'playwright-report', 'index.html');

  if (fs.existsSync(resultsPath)) {
    const raw = readJsonIfExists(resultsPath, { suites: [] });

    return {
      hasResults: true,
      source: 'json-reporter',
      raw,
      tests: collectJsonReporterTests(raw.suites),
    };
  }

  const htmlReport = readPlaywrightHtmlReport(playwrightReportPath);

  if (htmlReport) {
    return {
      hasResults: true,
      source: 'html-report',
      raw: htmlReport,
      tests: collectHtmlReportTests(htmlReport.files),
    };
  }

  return {
    hasResults: false,
    source: 'missing',
    raw: { suites: [] },
    tests: [],
  };
}

module.exports = {
  loadPlaywrightResults,
  normalizeStatus,
};
