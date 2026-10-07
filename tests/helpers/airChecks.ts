import { expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/* =============================================================================
HELPER: AIR intelligence checks

PURPOSE
-------
Matrix rows that ask "can this be reported in AIR evidence / history /
search" are answered by reading the AIR data files the last `air:parse` wrote.
Nothing here opens a browser, changes data, or rewrites the report.

A row opts in with   automation: 'air:<check-name>'

AIR files read (never written):
- execution-report/air-results.json            latest parsed execution
- execution-report/history/air-history.json    stored earlier executions
============================================================================= */

type AirTest = {
  title?: string;
  file?: string;
  status?: string;
  error?: string;
  attempts?: unknown[];
  attachments?: unknown[];
};

type AirExecution = {
  tests?: AirTest[];
};

const REPORT_DIR = path.join(
  process.cwd(),
  'execution-report'
);

function readJson<T>(
  relativePath: string
): T {
  const file = path.join(
    REPORT_DIR,
    relativePath
  );

  expect(
    fs.existsSync(file),
    `AIR data file is missing: ${path.relative(process.cwd(), file)}. Run the suite and npm run air:parse first.`
  ).toBeTruthy();

  return JSON.parse(
    fs.readFileSync(file, 'utf8')
  ) as T;
}

const EXECUTED = new Set([
  'passed',
  'failed',
  'timedOut',
  'interrupted'
]);

function executedRows(
  tests: AirTest[] | undefined,
  filePattern: RegExp,
  titlePattern?: RegExp
) {
  return (tests ?? []).filter(
    (row) =>
      filePattern.test(row.file ?? '') &&
      (!titlePattern ||
        titlePattern.test(row.title ?? '')) &&
      EXECUTED.has(row.status ?? '')
  );
}

function loadAir() {
  const latest = readJson<{
    tests?: AirTest[];
    searchIndex?: Array<{
      type?: string;
      title?: string;
      text?: string;
    }>;
  }>('air-results.json');

  const history = readJson<{
    executions?: AirExecution[];
  }>('history/air-history.json');

  return {
    latest,
    executions: history.executions ?? []
  };
}

// Matrix rows for one area are present in the latest AIR run, were really
// executed, and AIR keeps earlier runs so the area can be compared over time.
function expectAreaInAirHistory(
  area: string,
  filePattern: RegExp
) {
  const { latest, executions } =
    loadAir();

  const latestExecuted =
    executedRows(
      latest.tests,
      filePattern
    );

  expect(
    latestExecuted.length,
    `AIR's latest execution has no executed ${area} rows (rows that only skip leave nothing to report). Run the ${area} rows and air:parse again.`
  ).toBeGreaterThan(0);

  expect(
    executions.length,
    `AIR history should keep at least two executions to compare ${area}; it has ${executions.length}.`
  ).toBeGreaterThanOrEqual(2);

  const runsWithRows =
    executions.filter(
      (execution) =>
        executedRows(
          execution.tests,
          filePattern
        ).length > 0
    ).length;

  expect(
    runsWithRows,
    `${area} should appear as executed in at least two stored AIR executions to show history; found ${runsWithRows}.`
  ).toBeGreaterThanOrEqual(2);
}

function expectSearchable(
  pattern: RegExp,
  what: string
) {
  const { latest } = loadAir();

  const hits =
    (latest.searchIndex ?? []).filter(
      (entry) =>
        entry.type === 'test' &&
        pattern.test(
          `${entry.title ?? ''} ${entry.text ?? ''}`
        )
    );

  expect(
    hits.length,
    `AIR search index should contain ${what}.`
  ).toBeGreaterThan(0);
}

export function runAirCheck(
  check: string
) {
  switch (check) {
    case 'downgrade-history':
      expectAreaInAirHistory(
        'downgrade',
        /DowngradeSubscriptionMatrix/
      );
      return;

    case 'monthly-to-annual-history':
      expectAreaInAirHistory(
        'monthly-to-annual',
        /MonthlyAnnualBillingChangeMatrix/
      );
      return;

    case 'annual-to-monthly-history':
      expectAreaInAirHistory(
        'annual-to-monthly',
        /AnnualMonthlyBillingChangeMatrix/
      );
      return;

    case 'cancellation-history':
      expectAreaInAirHistory(
        'cancellation',
        /SubscriptionCancellationMatrix/
      );
      return;

    case 'cancellation-searchable':
      expectSearchable(
        /cancel/i,
        'cancellation test rows'
      );
      return;

    case 'failed-payment-evidence': {
      const { latest } = loadAir();

      const rows =
        executedRows(
          latest.tests,
          /PaymentNegative|FailedPaymentDunning|OverlayStrategistsTrial/,
          /declin|fail|incomplete|invalid|negative/i
        );

      expect(
        rows.length,
        'AIR should hold executed failed-payment rows (declined or invalid card).'
      ).toBeGreaterThan(0);

      for (const row of rows) {
        expect(
          (row.attempts?.length ?? 0) +
            (row.attachments?.length ?? 0),
          `AIR row "${row.title}" has no attempt or attachment evidence.`
        ).toBeGreaterThan(0);
      }

      return;
    }

    case 'failed-payment-trend':
      expectAreaInAirHistory(
        'failed-payment',
        /PaymentNegative|FailedPaymentDunning/
      );
      return;

    default:
      throw new Error(
        `Unknown AIR check "${check}".`
      );
  }
}
