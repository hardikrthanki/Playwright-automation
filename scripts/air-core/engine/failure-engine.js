function getFailureText(test = {}) {
  return `${test.title ?? ''}\n${test.error ?? ''}`.toLowerCase();
}

function hasAny(value, patterns) {
  return patterns.some(pattern => value.includes(pattern));
}

function getFailureType(test = {}) {
  if (test.manualDefect) {
    return 'Product';
  }

  const text = getFailureText(test);

  if (
    hasAny(
      text,
      [
        'err_connection_closed',
        'err_connection_reset',
        'err_internet_disconnected',
        'econnreset',
        'epipe',
        'target page, context or browser has been closed',
        'browser has been closed',
        'page.goto: net::',
        'login failed after 3 attempts'
      ]
    )
  ) {
    return 'Environment';
  }

  if (
    hasAny(
      text,
      [
        'stripe portal',
        'billing subscription management',
        'cancel subscription form accepts reason',
        'current subscription',
        'payment method',
        'billing information',
        'already scheduled to cancel',
        'checkout.stripe.com'
      ]
    )
  ) {
    return 'Test Data / External State';
  }

  if (
    hasAny(
      text,
      [
        'password visibility control',
        'expected: not "password"',
        'locator.waitfor: timeout',
        'element(s) not found',
        'strict mode violation',
        'to be visible',
        'tohaveurl'
      ]
    )
  ) {
    return 'Automation';
  }

  return 'Product';
}

function getFailureSeverity(test = {}) {
  const failureType = getFailureType(test);

  if (failureType !== 'Product') {
    return 'Medium';
  }

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

  const failureType = getFailureType(test);

  if (failureType !== 'Product') {
    return 'Execution evidence requires review; product impact is not confirmed.';
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

  const failureType = getFailureType(test);

  if (failureType === 'Environment') {
    return 'Rerun the scenario and review network/session stability before logging a product defect.';
  }

  if (failureType === 'Automation') {
    return 'Review selector, timing, and assertion logic before treating this as a product defect.';
  }

  if (failureType === 'Test Data / External State') {
    return 'Verify account state, external portal state, and prepared test data, then rerun the scenario.';
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
      failureType: getFailureType(test),
      releaseImpact: getFailureType(test) === 'Product'
        ? 'Product Review'
        : 'Automation / Environment Review',
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
  getFailureType,
  getRecommendedInvestigationAction,
};
