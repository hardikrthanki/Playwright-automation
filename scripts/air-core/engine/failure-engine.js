function getFailureSeverity(test = {}) {
  if (test.critical) {
    return 'Critical';
  }

  return 'High';
}

function getFailureCategory(test = {}) {
  if (test.category) {
    return test.category;
  }

  const title = String(test.title ?? '').toLowerCase();
  const error = String(test.error ?? '').toLowerCase();

  if (title.includes('payment') || title.includes('billing')) {
    return 'Billing';
  }

  if (
    title.includes('login') ||
    title.includes('auth') ||
    title.includes('session') ||
    title.includes('mfa') ||
    title.includes('2fa') ||
    title.includes('two-factor') ||
    title.includes('backup code') ||
    title.includes('authenticator')
  ) {
    return 'Authentication';
  }

  if (title.includes('password')) {
    return 'Password';
  }

  if (title.includes('signup') || title.includes('register') || title.includes('otp')) {
    return 'Registration';
  }

  if (error.includes('timeout')) {
    return 'Timeout';
  }

  return 'Functional';
}

function getBusinessImpact(test = {}) {
  if (test.businessImpact) {
    return test.businessImpact;
  }

  if (test.critical) {
    return 'Critical business flow may be blocked.';
  }

  return 'Module behavior requires review before release confidence is confirmed.';
}

function getRecommendedInvestigationAction(test = {}) {
  if (test.recommendedInvestigationAction) {
    return test.recommendedInvestigationAction;
  }

  const category = getFailureCategory(test);

  if (category === 'Timeout') {
    return 'Review trace, network timing, and page readiness for the failed step.';
  }

  if (category === 'Billing') {
    return 'Review billing evidence, payment state, transaction data, and related service logs.';
  }

  if (category === 'Authentication') {
    return 'Review login/session evidence, auth state, and user account configuration.';
  }

  return 'Open attached evidence, reproduce the scenario, and confirm whether the issue is product, data, or automation related.';
}

function getEvidenceLinks(test = {}, evidence = {}) {
  return Object.entries(evidence)
    .filter(([, value]) => Array.isArray(value))
    .flatMap(([type, items]) =>
      items
        .filter(item => item.testId === test.id)
        .map(item => ({
          type: item.type ?? type,
          name: item.name ?? item.type ?? type,
          path: item.path ?? '',
          contentType: item.contentType ?? '',
        }))
    );
}

function buildFailedTests(tests = [], evidence = {}) {
  return tests
    .filter(test => test.status === 'failed')
    .map(test => ({
      testId: test.id,
      testName: test.title,
      title: test.title,
      module: test.module ?? 'General',
      file: test.file ?? '',
      status: test.status,
      severity: getFailureSeverity(test),
      category: getFailureCategory(test),
      businessImpact: getBusinessImpact(test),
      errorMessage: test.error ?? '',
      error: test.error ?? '',
      evidence: getEvidenceLinks(test, evidence),
      recommendedInvestigationAction: getRecommendedInvestigationAction(test),
    }));
}

module.exports = {
  buildFailedTests,
  getBusinessImpact,
  getEvidenceLinks,
  getFailureCategory,
  getFailureSeverity,
  getRecommendedInvestigationAction,
};
