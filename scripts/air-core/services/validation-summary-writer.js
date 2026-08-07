function sanitizeMarkdown(value) {
  return String(value ?? '')
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '\\|')
    .replace(/\s+/g, ' ')
    .trim();
}

function statusIcon(status) {
  const normalizedStatus = String(status ?? '').toLowerCase();

  if (normalizedStatus === 'passed') return 'PASS';
  if (normalizedStatus === 'failed') return 'FAIL';
  if (normalizedStatus === 'flaky') return 'FLAKY';
  if (normalizedStatus === 'skipped') return 'SKIPPED';
  if (normalizedStatus === 'interrupted') return 'INTERRUPTED';

  return 'REVIEW';
}

function formatCountMap(counts = {}) {
  return Object.entries(counts)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, count]) => `| ${sanitizeMarkdown(name)} | ${count} |`)
    .join('\n');
}

function getValidation(test = {}) {
  return test.validation ?? {
    area: test.module ?? 'General',
    summary: test.title ?? 'Validation',
    businessPurpose: 'Validation metadata was not available for this test.',
    expectedOutcome: 'Review the test title and attached evidence.',
    outcome: statusIcon(test.status),
    evidenceExpectation: '',
  };
}

function buildValidationRows(tests = []) {
  return tests
    .map(test => {
      const validation = getValidation(test);

      return [
        statusIcon(test.status),
        sanitizeMarkdown(validation.area ?? test.module ?? 'General'),
        sanitizeMarkdown(validation.scenario ?? test.title),
        sanitizeMarkdown(validation.businessPurpose),
        sanitizeMarkdown(validation.expectedOutcome),
      ];
    })
    .map(columns => `| ${columns.join(' | ')} |`)
    .join('\n');
}

function buildCoverageGapRows(items = []) {
  if (items.length === 0) {
    return '| None | No skipped, blocked, controlled, or future coverage gaps were reported. | Continue monitoring. |';
  }

  return items
    .map(item => [
      sanitizeMarkdown(item.category ?? item.status ?? 'Review'),
      sanitizeMarkdown(item.title ?? item.fullTitle ?? 'Coverage item'),
      sanitizeMarkdown(item.reason ?? item.dependency ?? item.nextAction ?? 'Review required.'),
    ])
    .map(columns => `| ${columns.join(' | ')} |`)
    .join('\n');
}

function buildValidationSummaryMarkdown(airResults = {}) {
  const tests = Array.isArray(airResults.tests) ? airResults.tests : [];
  const validationSummary = airResults.validationIntelligence?.summary ?? {};
  const byStatus = validationSummary.byStatus ?? {};
  const byArea = validationSummary.byArea ?? {};
  const coverageGaps = airResults.coverageGaps?.items ?? [];

  return `# AIR Automation Validation Summary

Generated: ${sanitizeMarkdown(airResults.reportInfo?.generatedAtDisplay ?? airResults.generatedAtDisplay)}

Project: ${sanitizeMarkdown(airResults.project?.name)}

Environment: ${sanitizeMarkdown(airResults.project?.environment ?? airResults.environment?.name)}

Release Decision: ${sanitizeMarkdown(airResults.release?.status ?? airResults.summary?.releaseDecision)}

## Purpose

This document explains what the latest automation execution validated in plain business language. It is generated from AIR using test titles, module mapping, execution status, and evidence metadata.

## Execution Summary

| Metric | Count |
| --- | ---: |
| Unique Tests | ${airResults.summary?.total ?? tests.length} |
| Passed | ${airResults.summary?.passed ?? 0} |
| Failed | ${airResults.summary?.failed ?? 0} |
| Skipped / Not Executed | ${airResults.summary?.skipped ?? 0} |
| Flaky | ${airResults.summary?.flaky ?? 0} |
| Attempts | ${airResults.summary?.attemptCount ?? tests.length} |

## Status Breakdown

| Status | Count |
| --- | ---: |
${formatCountMap(byStatus) || '| No Data | 0 |'}

## Area Breakdown

| Area | Validations |
| --- | ---: |
${formatCountMap(byArea) || '| No Data | 0 |'}

## What Was Validated

| Result | Area | Scenario | Why It Matters | Expected Outcome |
| --- | --- | --- | --- | --- |
${buildValidationRows(tests) || '| No Data | No validations found | No validation metadata available | Generate AIR after running tests. |'}

## Skipped / Blocked / Controlled Coverage

| Category | Scenario | Reason / Next Action |
| --- | --- | --- |
${buildCoverageGapRows(coverageGaps)}

## Notes

- This summary does not replace Playwright evidence, traces, videos, or screenshots.
- Failed scenarios should still be reviewed in AIR Failure Intelligence.
- Controlled and blocked scenarios are listed so stakeholders understand what was not executed and why.
`;
}

module.exports = {
  buildValidationSummaryMarkdown,
};
