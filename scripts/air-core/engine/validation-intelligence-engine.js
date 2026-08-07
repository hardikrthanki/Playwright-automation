function normalizeText(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleText(test = {}) {
  return normalizeText([
    test.title,
    test.file,
    test.module,
  ].filter(Boolean).join(' ')).toLowerCase();
}

function lastTitleSegment(test = {}) {
  return normalizeText(test.title)
    .split(' > ')
    .map(part => part.trim())
    .filter(Boolean)
    .at(-1) || normalizeText(test.title) || 'Unnamed validation';
}

function inferValidationArea(test = {}) {
  const module = normalizeText(test.module);

  if (module && module !== 'General') {
    return module;
  }

  const text = titleText(test);

  if (text.includes('billing') || text.includes('subscription') || text.includes('stripe')) return 'Billing';
  if (text.includes('mfa') || text.includes('2fa') || text.includes('authenticator')) return 'MFA';
  if (text.includes('forgot') || text.includes('reset password')) return 'Password Recovery';
  if (text.includes('password')) return 'Password';
  if (text.includes('signup') || text.includes('register') || text.includes('onboarding')) return 'Signup';
  if (text.includes('login') || text.includes('auth')) return 'Authentication';
  if (text.includes('profile')) return 'Profile';
  if (text.includes('risk')) return 'Risk Profile';
  if (text.includes('compliance')) return 'Compliance';
  if (text.includes('dashboard')) return 'Dashboard';
  if (text.includes('session')) return 'Session Security';
  if (text.includes('accessibility')) return 'Accessibility';

  return 'General';
}

function inferBusinessPurpose(area) {
  const purposes = {
    Accessibility: 'Ensure the application remains usable and inspectable for accessibility and browser behavior.',
    Authentication: 'Confirm users can authenticate safely and invalid access is blocked.',
    Billing: 'Confirm subscription, plan, invoice, and billing controls are visible and safe.',
    Compliance: 'Confirm compliance information loads, can be reviewed, and remains stable.',
    Dashboard: 'Confirm authenticated users can navigate the product without load errors.',
    MFA: 'Confirm two-factor authentication controls protect the account without breaking login recovery.',
    Password: 'Confirm password rules and password-change guardrails protect the account.',
    'Password Recovery': 'Confirm account recovery pages behave safely without exposing or changing credentials.',
    Profile: 'Confirm profile data and account controls remain visible, stable, and protected.',
    'Risk Profile': 'Confirm risk profile information loads, can be reviewed, and remains stable.',
    'Session Security': 'Confirm protected routes and session behavior prevent unauthorized access.',
    Signup: 'Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly.',
  };

  return purposes[area] ?? 'Confirm the related product behavior is stable and safe for the current execution.';
}

function inferExpectedOutcome(test = {}) {
  const text = titleText(test);

  if (text.includes('blocks') || text.includes('rejects') || text.includes('not authenticate')) {
    return 'Invalid or unsafe input should be blocked and the user should remain in a safe state.';
  }

  if (text.includes('redirect') || text.includes('protected route')) {
    return 'Navigation should route the user to the correct protected or public destination.';
  }

  if (text.includes('refresh')) {
    return 'The page should remain usable after refresh without losing required state.';
  }

  if (text.includes('back') || text.includes('forward')) {
    return 'Browser navigation should not break the session or page state.';
  }

  if (text.includes('visible') || text.includes('shows') || text.includes('exposes')) {
    return 'Expected controls and information should be visible to the user.';
  }

  if (text.includes('opens')) {
    return 'The requested page, modal, portal, or panel should open without a load error.';
  }

  if (text.includes('persist')) {
    return 'Saved values should remain available after navigation or refresh.';
  }

  if (text.includes('without saving') || text.includes('without cancelling')) {
    return 'The validation should inspect the flow without mutating subscription or account state.';
  }

  return 'The scenario should complete successfully and leave the application in the expected state.';
}

function getEvidenceExpectation(test = {}) {
  const status = String(test.status ?? '').toLowerCase();
  const attachments = Array.isArray(test.attachments) ? test.attachments.length : 0;
  const attempts = Array.isArray(test.attempts) ? test.attempts : [];
  const attemptEvidence = attempts.reduce(
    (count, attempt) => count + (Array.isArray(attempt.attachments) ? attempt.attachments.length : 0),
    0
  );

  if (status === 'failed') {
    return attachments + attemptEvidence > 0
      ? 'Failure evidence should be reviewed from screenshot, trace, video, or logs.'
      : 'No per-test failure evidence was captured for this failed scenario.';
  }

  if (attachments + attemptEvidence > 0) {
    return 'Execution artifacts are available for review.';
  }

  return 'No evidence review is required for this passing validation.';
}

function getOutcome(status) {
  const normalizedStatus = String(status ?? 'unknown').toLowerCase();

  if (normalizedStatus === 'passed') return 'Validated successfully';
  if (normalizedStatus === 'failed') return 'Validation failed';
  if (normalizedStatus === 'flaky') return 'Validated after retry';
  if (normalizedStatus === 'skipped') return 'Not executed';
  if (normalizedStatus === 'interrupted') return 'Interrupted';

  return 'Review required';
}

function buildValidationForTest(test = {}) {
  const area = inferValidationArea(test);
  const scenario = lastTitleSegment(test);

  return {
    area,
    scenario,
    summary: `${area}: ${scenario}`,
    businessPurpose: inferBusinessPurpose(area),
    expectedOutcome: inferExpectedOutcome(test),
    outcome: getOutcome(test.status),
    evidenceExpectation: getEvidenceExpectation(test),
    source: 'AIR validation intelligence derived from test title, module mapping, status, and artifacts.',
  };
}

function countBy(items = [], key) {
  return items.reduce((counts, item) => {
    const value = item?.[key] ?? 'Unknown';
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function buildValidationIntelligence(model = {}) {
  const tests = (model.tests ?? []).map(test => ({
    ...test,
    validation: {
      ...(test.validation ?? {}),
      ...buildValidationForTest(test),
    },
  }));
  const testsById = new Map(
    tests.map(test => [
      test.id ?? test.testId ?? test.title,
      test,
    ])
  );
  const failedTests = (model.failedTests ?? []).map(failure => {
    const matchingTest =
      testsById.get(failure.testId) ??
      testsById.get(failure.id) ??
      tests.find(test => test.title === failure.testName || test.title === failure.title);
    const sourceRecord = {
      ...(matchingTest ?? {}),
      ...failure,
      title: failure.testName ?? failure.title ?? matchingTest?.title,
      module: failure.module ?? matchingTest?.module,
      status: failure.status ?? matchingTest?.status,
    };

    return {
      ...failure,
      validation: {
        ...(failure.validation ?? {}),
        ...buildValidationForTest(sourceRecord),
      },
    };
  });

  return {
    ...model,
    tests,
    failedTests,
    failures: failedTests,
    validationIntelligence: {
      summary: {
        total: tests.length,
        byStatus: countBy(tests, 'status'),
        byArea: countBy(tests.map(test => test.validation), 'area'),
      },
      generatedFrom: [
        'test title',
        'module mapping',
        'execution status',
        'attempt/evidence metadata',
      ],
      purpose:
        'Explain what each automation test validated in business-readable language.',
    },
  };
}

module.exports = {
  buildValidationForTest,
  buildValidationIntelligence,
  inferValidationArea,
};
