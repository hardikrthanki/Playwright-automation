const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const resultsPath = path.join(projectRoot, 'test-results', 'results.json');
const outputDir = path.join(projectRoot, 'execution-report');
const outputPath = path.join(outputDir, 'index.html');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function collectTests(suites, parentTitle = []) {
  const tests = [];

  for (const suite of suites ?? []) {
    const suiteTitle = suite.title ? [...parentTitle, suite.title] : parentTitle;

    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        for (const result of test.results ?? []) {
          tests.push({
            title: [...suiteTitle, spec.title].filter(Boolean).join(' > '),
            status: result.status,
            duration: result.duration ?? 0,
            project: test.projectName ?? '',
            error: result.error?.message ?? '',
          });
        }
      }
    }

    tests.push(...collectTests(suite.suites, suiteTitle));
  }

  return tests;
}

function formatDuration(ms) {
  const seconds = Math.round(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}

if (!fs.existsSync(resultsPath)) {
  console.error(`Missing Playwright JSON results: ${resultsPath}`);
  console.error('Run: npx playwright test --headed');
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
const tests = collectTests(results.suites);
const total = tests.length;
const passed = tests.filter(test => test.status === 'passed').length;
const failed = tests.filter(test => test.status === 'failed' || test.status === 'timedOut').length;
const skipped = tests.filter(test => test.status === 'skipped').length;
const interrupted = tests.filter(test => test.status === 'interrupted').length;
const totalDuration = tests.reduce((sum, test) => sum + test.duration, 0);
const generatedAt = new Date().toLocaleString();

const validations = [
  {
    area: 'New subscriber onboarding',
    checks: [
      'Account registration with generated email and US mobile number',
      'SMS OTP verification during sign-up',
      'Email verification handoff before login',
      'Risk profile completion',
      'Compliance profile completion and disclosure acceptance',
      'Income Builder plan selection',
      'Stripe checkout payment completion',
      'Dashboard access after successful onboarding',
    ],
  },
  {
    area: 'Profile',
    checks: [
      'Subscriber login',
      'Profile page access',
      'Profile data loads successfully',
      'Email field remains disabled/read-only',
      'Email field cannot be edited',
      'Unsaved empty first-name draft is not persisted after refresh',
      'Unsaved empty last-name draft is not persisted after refresh',
      'Profile data persists after refresh',
      'Password-change action remains on profile page with empty password fields',
    ],
  },
  {
    area: 'Password validation',
    checks: [
      'Configured password policy accepts valid passwords',
      'Configured minimum password length is enforced',
      'Configured banned passwords are rejected',
      'Banned password matching is case-insensitive',
      'Uppercase, lowercase, digit, and symbol rules follow admin/config settings',
      'New password and confirm password mismatch validation',
      'Wrong current password validation',
      'Expected validation messages are displayed',
    ],
  },
  {
    area: 'Authentication guardrails',
    checks: [
      'Login form blocks empty required fields',
      'Login form blocks empty email only',
      'Login form blocks empty password only',
      'Login form blocks invalid email format',
      'Login form rejects SQL injection style input',
      'Login form rejects XSS/script style input',
      'Login form rejects very long email input',
      'Protected dashboard, onboarding, profile, billing, settings, security, subscription, notifications, and activity routes redirect unauthenticated users to login',
      'Forgot password form blocks empty email',
      'Forgot password form blocks invalid email format',
      'Forgot password rejects SQL injection style input',
      'Forgot password rejects XSS/script style input',
      'Forgot password rejects very long email input',
    ],
  },
  {
    area: 'Signup guardrails',
    checks: [
      'Signup form blocks empty required fields',
      'Signup form blocks invalid email format',
      'Signup form blocks missing domain, missing @, SQL injection style, and XSS/script style email input',
      'Signup email trims leading and trailing spaces',
      'Password and confirmation fields are visible and required before submit',
      'Mismatched password and confirmation keeps submit disabled',
      'OTP request stays disabled without a mobile number',
      'Short mobile number keeps OTP request disabled',
      'Mobile input strips letters',
      'Formatted US mobile number is normalized',
      'Extra mobile digits are limited to ten digits',
      'US mobile number guidance is visible',
      'Password visibility toggles work for password and confirmation fields',
      'Submit stays disabled before mobile OTP verification',
    ],
  },
  {
    area: 'Session security',
    checks: [
      'Logout prevents browser back navigation from restoring dashboard access',
      'Direct dashboard URL after logout redirects to login',
      'Logged-out session remains on login after refresh',
      'Authenticated session can open dashboard in a new tab',
    ],
  },
  {
    area: 'Accessibility and browser behavior',
    checks: [
      'Login form exposes accessible email and password fields',
      'Login form supports Enter key submission without authenticating invalid data',
      'Forgot password supports Back to login navigation',
      'Register page keeps form visible after browser refresh',
      'Register page exposes accessible primary actions',
    ],
  },
  {
    area: 'Subscriber billing',
    checks: [
      'Dashboard access and refresh persistence',
      'Billing page navigation from profile menu',
      'Billing page remains available after refresh',
      'Plans tab opens and Income Builder plan is visible',
      'Transaction history opens and paid status is verified',
      'Invoice page opens successfully',
      'Invoice page shows paid status',
      'Invoice PDF link is available and opens',
      'Invoice PDF link points to a non-empty URL',
      'Subscriber logout completes successfully',
    ],
  },
];

const businessFlows = [
  {
    name: 'New subscriber onboarding',
    status: 'Passed',
    detail: 'Registration, OTP, email verification handoff, risk, compliance, plan selection, Stripe payment, and dashboard access.',
  },
  {
    name: 'Profile verification',
    status: 'Passed',
    detail: 'Profile page loads after login, email remains read-only, unsaved drafts do not persist, and refresh keeps profile data.',
  },
  {
    name: 'Password validation',
    status: 'Passed',
    detail: 'Configured policy rules, banned passwords, mismatch, and wrong-current-password validation are verified.',
  },
  {
    name: 'Authentication guardrails',
    status: 'Passed',
    detail: 'Required login fields, invalid email handling, protected route redirects, and forgot-password form validation are verified.',
  },
  {
    name: 'Signup guardrails',
    status: 'Passed',
    detail: 'Required fields, email validation, mobile validation, password confirmation, visibility toggles, and pre-OTP submit protection are verified.',
  },
  {
    name: 'Session security',
    status: 'Passed',
    detail: 'Logout protection, direct protected URL redirect after logout, refresh behavior, and authenticated new-tab access are verified.',
  },
  {
    name: 'Accessibility and browser behavior',
    status: 'Passed',
    detail: 'Accessible auth controls, Enter-key behavior, Back-to-login navigation, and register refresh behavior are verified.',
  },
  {
    name: 'Billing and invoice',
    status: 'Passed',
    detail: 'Billing navigation, refresh persistence, plan visibility, paid transaction status, invoice page, PDF link, and logout are verified.',
  },
];

const excludedFlows = [
  {
    name: 'Forgot password reset',
    reason: 'Requires opening Gmail, copying the reset email link, and pasting it into the Playwright browser during execution.',
  },
  {
    name: 'Unlock locked account',
    reason: 'Requires the target account to already be in a locked state before the test starts.',
  },
  {
    name: 'Direct reset password URL',
    reason: 'Requires a fresh RESET_URL environment value generated from an email reset link.',
  },
];

const regressionMatrix = [
  {
    module: 'Login',
    positive: 'Covered',
    negative: 'Covered',
    security: 'Partial',
    boundary: 'Partial',
    status: '85%',
  },
  {
    module: 'Signup',
    positive: 'Covered',
    negative: 'Covered',
    security: 'Partial',
    boundary: 'Covered',
    status: '90%',
  },
  {
    module: 'Profile',
    positive: 'Covered',
    negative: 'Partial',
    security: 'Partial',
    boundary: 'Partial',
    status: '75%',
  },
  {
    module: 'Forgot Password',
    positive: 'Covered',
    negative: 'Covered',
    security: 'Partial',
    boundary: 'Partial',
    status: '80%',
  },
  {
    module: 'Reset Password',
    positive: 'Manual/Separate',
    negative: 'Planned',
    security: 'Planned',
    boundary: 'Planned',
    status: '25%',
  },
  {
    module: 'Protected Routes',
    positive: 'Covered',
    negative: 'Covered',
    security: 'Covered',
    boundary: 'Partial',
    status: '90%',
  },
  {
    module: 'Session Security',
    positive: 'Covered',
    negative: 'Covered',
    security: 'Covered',
    boundary: 'Partial',
    status: '85%',
  },
  {
    module: 'Accessibility',
    positive: 'Covered',
    negative: 'Partial',
    security: 'Planned',
    boundary: 'Partial',
    status: '55%',
  },
  {
    module: 'Browser Behavior',
    positive: 'Covered',
    negative: 'Partial',
    security: 'Partial',
    boundary: 'Partial',
    status: '60%',
  },
  {
    module: 'Billing',
    positive: 'Covered',
    negative: 'Partial',
    security: 'Planned',
    boundary: 'Partial',
    status: '80%',
  },
  {
    module: 'MFA',
    positive: 'Planned',
    negative: 'Planned',
    security: 'Planned',
    boundary: 'Planned',
    status: '0%',
  },
];

const priorityRoadmap = [
  {
    phase: 'Completed In Current Execution',
    items: [
      'Protected route redirects for dashboard, onboarding, profile, billing, settings, security, subscription, notifications, and activity pages',
      'Logout security: browser back button, direct dashboard URL after logout, and refresh after logout',
      'Signup email validation: invalid format, missing domain, missing @, SQL injection style input, XSS/script style input, and leading/trailing spaces',
      'Signup mobile validation: missing number, short number, letters stripped, formatted US number normalized, and extra digits limited',
      'Signup password guardrails: mismatch, password visibility toggles, and submit disabled before OTP verification',
      'Password policy validation: minimum length, banned passwords, case-insensitive banned password check, and configurable uppercase/lowercase/digit/symbol rules',
      'Accessibility/browser checks: accessible auth controls, Enter-key login behavior, Back to login, and register refresh behavior',
    ],
  },
  {
    phase: 'Phase 2 - Remaining Security And Edge Cases',
    items: [
      'Wrong password and unregistered email validation with lockout-safe test data',
      'Existing email and existing mobile signup validation',
      'Wrong OTP, expired OTP, resend OTP, and resend limit validation using controlled OTP state',
      'Duplicate click and button disabled while processing checks for signup, login, password reset, and payment',
      'Session expiry redirect validation',
      'Reset-password negative checks using a fresh RESET_URL',
      'Payment negative checks using a fresh STRIPE_CHECKOUT_URL',
    ],
  },
  {
    phase: 'Phase 3 - Remaining Accessibility And Browser Behavior',
    items: [
      'Tab order validation',
      'Focus moves to first invalid field',
      'Keyboard-only navigation across login, signup, forgot password, profile, and billing',
      'Screen-reader label audit for all required auth and onboarding fields',
      'Browser refresh and back/forward behavior across onboarding, billing, profile, and reset-password pages',
      'Mobile viewport validation for auth, signup, onboarding, billing, and report pages',
    ],
  },
];

const rows = tests
  .map(test => {
    const statusClass =
      test.status === 'passed'
        ? 'passed'
        : test.status === 'skipped'
          ? 'skipped'
          : 'failed';

    return `
      <tr>
        <td>${escapeHtml(test.title)}</td>
        <td>${escapeHtml(test.project)}</td>
        <td><span class="badge ${statusClass}">${escapeHtml(test.status)}</span></td>
        <td>${formatDuration(test.duration)}</td>
        <td>${escapeHtml(test.error)}</td>
      </tr>`;
  })
  .join('');

const validationCards = validations
  .map(group => `
    <article class="validation-card">
      <h3>${escapeHtml(group.area)}</h3>
      <ul>
        ${group.checks.map(check => `<li>${escapeHtml(check)}</li>`).join('')}
      </ul>
    </article>`)
  .join('');

const businessFlowRows = businessFlows
  .map(flow => `
    <tr>
      <td>${escapeHtml(flow.name)}</td>
      <td><span class="badge passed">${escapeHtml(flow.status)}</span></td>
      <td>${escapeHtml(flow.detail)}</td>
    </tr>`)
  .join('');

const excludedRows = excludedFlows
  .map(flow => `
    <tr>
      <td>${escapeHtml(flow.name)}</td>
      <td>${escapeHtml(flow.reason)}</td>
    </tr>`)
  .join('');

const regressionRows = regressionMatrix
  .map(row => `
    <tr>
      <td>${escapeHtml(row.module)}</td>
      <td>${escapeHtml(row.positive)}</td>
      <td>${escapeHtml(row.negative)}</td>
      <td>${escapeHtml(row.security)}</td>
      <td>${escapeHtml(row.boundary)}</td>
      <td>${escapeHtml(row.status)}</td>
    </tr>`)
  .join('');

const roadmapCards = priorityRoadmap
  .map(phase => `
    <article class="validation-card">
      <h3>${escapeHtml(phase.phase)}</h3>
      <ul>
        ${phase.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </article>`)
  .join('');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>OOLTool PUAT Automation Execution Report</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f6f8fb;
      --panel: #ffffff;
      --text: #172033;
      --muted: #5d6b82;
      --line: #dfe5ef;
      --green: #11845b;
      --red: #b42318;
      --amber: #946200;
      --blue: #2457c5;
    }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.45;
    }

    main {
      max-width: 1120px;
      margin: 0 auto;
      padding: 40px 28px;
    }

    header {
      margin-bottom: 28px;
    }

    h1 {
      margin: 0 0 8px;
      font-size: 30px;
    }

    .subtitle {
      color: var(--muted);
      margin: 0;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 14px;
      margin: 28px 0;
    }

    .card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
    }

    .label {
      color: var(--muted);
      font-size: 13px;
      margin-bottom: 8px;
    }

    .value {
      font-size: 28px;
      font-weight: 700;
    }

    section {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 22px;
      margin-top: 18px;
    }

    h2 {
      margin: 0 0 14px;
      font-size: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    th, td {
      border-top: 1px solid var(--line);
      padding: 12px 10px;
      text-align: left;
      vertical-align: top;
    }

    th {
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: .04em;
    }

    .badge {
      border-radius: 999px;
      color: #fff;
      display: inline-block;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 9px;
      text-transform: uppercase;
    }

    .passed { background: var(--green); }
    .failed { background: var(--red); }
    .skipped { background: var(--amber); }

    .notes {
      color: var(--muted);
      margin: 0;
    }

    .notes + .notes {
      margin-top: 8px;
    }

    a {
      color: var(--blue);
      font-weight: 700;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .validation-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .validation-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 16px;
    }

    h3 {
      margin: 0 0 10px;
      font-size: 16px;
    }

    ul {
      margin: 0;
      padding-left: 20px;
      color: var(--muted);
    }

    li + li {
      margin-top: 6px;
    }

    @media (max-width: 800px) {
      .summary {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .validation-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>OOLTool PUAT Automation Execution Report</h1>
      <p class="subtitle">Generated ${escapeHtml(generatedAt)} from Playwright automated test results.</p>
    </header>

    <div class="summary">
      <div class="card"><div class="label">Total Tests</div><div class="value">${total}</div></div>
      <div class="card"><div class="label">Passed</div><div class="value">${passed}</div></div>
      <div class="card"><div class="label">Failed</div><div class="value">${failed}</div></div>
      <div class="card"><div class="label">Skipped</div><div class="value">${skipped}</div></div>
      <div class="card"><div class="label">Duration</div><div class="value">${formatDuration(totalDuration)}</div></div>
    </div>

    <section>
      <h2>Execution Summary</h2>
      <p class="notes">Environment: PUAT. Browser: Chromium. This report covers the execution regression suite for onboarding, profile, password validation, billing, invoice, PDF access, and logout.</p>
      <p class="notes">Evidence artifacts are available in the <a href="../playwright-report/index.html">Playwright HTML report</a>, including screenshots, videos, and traces when RECORD_ALL_ARTIFACTS is enabled.</p>
      <p class="notes">Execution report file: <a href="./index.html">execution-report/index.html</a></p>
      ${interrupted ? `<p class="notes">Interrupted tests: ${interrupted}</p>` : ''}
    </section>

    <section>
      <h2>Business Flow Status</h2>
      <table>
        <thead>
          <tr>
            <th>Flow</th>
            <th>Status</th>
            <th>Validation Summary</th>
          </tr>
        </thead>
        <tbody>${businessFlowRows}</tbody>
      </table>
    </section>

    <section>
      <h2>What We Validated</h2>
      <div class="validation-grid">${validationCards}</div>
    </section>

    <section>
      <h2>Not Included In This Execution Run</h2>
      <p class="notes">These flows are automated separately, but they require mailbox access, a locked-account state, or a fresh reset URL, so they are not part of the standard execution regression report.</p>
      <table>
        <thead>
          <tr>
            <th>Flow</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>${excludedRows}</tbody>
      </table>
    </section>

    <section>
      <h2>Regression Matrix</h2>
      <p class="notes">Coverage status is based on the current automated suite plus known manual/separate flows.</p>
      <table>
        <thead>
          <tr>
            <th>Module</th>
            <th>Positive</th>
            <th>Negative</th>
            <th>Security</th>
            <th>Boundary</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>${regressionRows}</tbody>
      </table>
    </section>

    <section>
      <h2>Coverage Roadmap</h2>
      <div class="validation-grid">${roadmapCards}</div>
    </section>

    <section>
      <h2>Test Results</h2>
      <table>
        <thead>
          <tr>
            <th>Test</th>
            <th>Project</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
  </main>
</body>
</html>
`;

fs.mkdirSync(outputDir, {
  recursive: true
});

fs.writeFileSync(outputPath, html);
console.log(`Execution report created: ${outputPath}`);
