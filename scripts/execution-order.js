/* =============================================================================
EXECUTION ORDER

PURPOSE
-------
Runs Playwright specs in the OOLTool user-journey order from
docs/USER_JOURNEY_COVERAGE.md, not alphabetical file name order.

Playwright itself sorts files by name (AccessibilityBrowser first). One
chromium project per spec, listed in this file, is what actually sequences
a full `playwright test` run with workers: 1.

1. Public auth and signup
2. New-user onboarding, risk/compliance, and plan catalog
3. Stripe trial, checkout, and subscription lifecycle
4. Authenticated dashboard, positions, profile, billing, logout
5. Password recovery, unlock, MFA, and permission access
6. Skip-only coverage matrix last (AIR only)
============================================================================= */

const fs = require('fs');
const path = require('path');

const executableJourneyOrder = [
  'AuthUiValidation.spec.ts',
  'AuthNegative.spec.ts',
  'SignupNegative.spec.ts',
  'PasswordPolicy.spec.ts',
  'AccessibilityBrowser.spec.ts',

  'onboarding.spec.ts',
  'OnboardingFieldValidation.spec.ts',
  'PlanSelectionValidation.spec.ts',

  'OverlayStrategistsTrial.spec.ts',
  'DirectSubscriptionPurchase.spec.ts',
  'PaymentNegative.spec.ts',
  'BlockedScenarioExecution.spec.ts',
  'SubscriptionLifecycleExecution.spec.ts',

  'DashboardNavigation.spec.ts',
  'AddManualPosition.spec.ts',
  'ProfileNegative.spec.ts',
  'ProfileSecurityDisplay.spec.ts',
  'ProfileMobileValidation.spec.ts',
  'ProfilePasswordMismatch.spec.ts',
  'RiskComplianceUpdate.spec.ts',
  'BillingEdgeValidation.spec.ts',
  'BillingSubscriptionManagement.spec.ts',
  'Subscriber.spec.ts',
  'SessionSecurity.spec.ts',

  'forgotpassword.spec.ts',
  'ResetPasswordNegative.spec.ts',
  'ResetPassword.spec.ts',
  'UnlockAccount.spec.ts',
  'AuthConfigurationLimits.spec.ts',
  'MfaUserFlow.spec.ts',
  'PermissionAccess.spec.ts'
];

const matrixOrder = [
  'UserJourneyCoverageMatrix.spec.ts',
  'OverlayStrategistsTrialMatrix.spec.ts',
  'NewSubscriptionPurchaseMatrix.spec.ts',
  'UpgradeSubscriptionMatrix.spec.ts',
  'DowngradeSubscriptionMatrix.spec.ts',
  'MonthlyAnnualBillingChangeMatrix.spec.ts',
  'AnnualMonthlyBillingChangeMatrix.spec.ts',
  'SubscriptionCancellationMatrix.spec.ts',
  'FailedPaymentDunningMatrix.spec.ts',
  'SubscriptionLifecycleE2EMatrix.spec.ts'
];

const playwrightTestMatch = executableJourneyOrder.concat(matrixOrder);

function pick(names) {
  const wanted = new Set(names);
  return playwrightTestMatch.filter((file) => wanted.has(file));
}

const suites = {
  all: playwrightTestMatch,
  executable: executableJourneyOrder,
  matrix: matrixOrder,
  smoke: pick([
    'DashboardNavigation.spec.ts',
    'ProfileNegative.spec.ts',
    'Subscriber.spec.ts',
    'SessionSecurity.spec.ts'
  ]),
  sanity: pick([
    'AuthUiValidation.spec.ts',
    'AuthNegative.spec.ts',
    'SignupNegative.spec.ts',
    'PasswordPolicy.spec.ts',
    'onboarding.spec.ts',
    'DashboardNavigation.spec.ts',
    'AddManualPosition.spec.ts',
    'ProfileNegative.spec.ts',
    'ProfilePasswordMismatch.spec.ts',
    'BillingEdgeValidation.spec.ts',
    'Subscriber.spec.ts',
    'SessionSecurity.spec.ts'
  ]),
  regression: pick([
    'AuthUiValidation.spec.ts',
    'AuthNegative.spec.ts',
    'SignupNegative.spec.ts',
    'PasswordPolicy.spec.ts',
    'AccessibilityBrowser.spec.ts',
    'onboarding.spec.ts',
    'OnboardingFieldValidation.spec.ts',
    'PlanSelectionValidation.spec.ts',
    'DashboardNavigation.spec.ts',
    'AddManualPosition.spec.ts',
    'ProfileNegative.spec.ts',
    'ProfileSecurityDisplay.spec.ts',
    'ProfileMobileValidation.spec.ts',
    'ProfilePasswordMismatch.spec.ts',
    'RiskComplianceUpdate.spec.ts',
    'BillingEdgeValidation.spec.ts',
    'BillingSubscriptionManagement.spec.ts',
    'Subscriber.spec.ts',
    'SessionSecurity.spec.ts',
    'ResetPasswordNegative.spec.ts'
  ]),
  regressionAll: pick([
    'AuthUiValidation.spec.ts',
    'AuthNegative.spec.ts',
    'SignupNegative.spec.ts',
    'PasswordPolicy.spec.ts',
    'AccessibilityBrowser.spec.ts',
    'onboarding.spec.ts',
    'OnboardingFieldValidation.spec.ts',
    'PlanSelectionValidation.spec.ts',
    'OverlayStrategistsTrial.spec.ts',
    'PaymentNegative.spec.ts',
    'DashboardNavigation.spec.ts',
    'AddManualPosition.spec.ts',
    'ProfileNegative.spec.ts',
    'ProfileSecurityDisplay.spec.ts',
    'ProfileMobileValidation.spec.ts',
    'ProfilePasswordMismatch.spec.ts',
    'RiskComplianceUpdate.spec.ts',
    'BillingEdgeValidation.spec.ts',
    'BillingSubscriptionManagement.spec.ts',
    'Subscriber.spec.ts',
    'SessionSecurity.spec.ts',
    'forgotpassword.spec.ts',
    'ResetPasswordNegative.spec.ts',
    'UnlockAccount.spec.ts',
    'MfaUserFlow.spec.ts'
  ]),
  userJourneyStable: pick([
    'AuthUiValidation.spec.ts',
    'onboarding.spec.ts',
    'OnboardingFieldValidation.spec.ts',
    'PlanSelectionValidation.spec.ts',
    'DashboardNavigation.spec.ts',
    'ProfileNegative.spec.ts',
    'ProfileSecurityDisplay.spec.ts',
    'ProfileMobileValidation.spec.ts',
    'ProfilePasswordMismatch.spec.ts',
    'RiskComplianceUpdate.spec.ts',
    'BillingEdgeValidation.spec.ts',
    'BillingSubscriptionManagement.spec.ts',
    'Subscriber.spec.ts',
    'ResetPasswordNegative.spec.ts'
  ]),
  userJourneyControlled: pick([
    'PlanSelectionValidation.spec.ts',
    'forgotpassword.spec.ts',
    'UnlockAccount.spec.ts',
    'AuthConfigurationLimits.spec.ts',
    'MfaUserFlow.spec.ts'
  ]),
  userJourneyFull: pick([
    'AuthUiValidation.spec.ts',
    'onboarding.spec.ts',
    'OnboardingFieldValidation.spec.ts',
    'DashboardNavigation.spec.ts',
    'ProfileNegative.spec.ts',
    'ProfileSecurityDisplay.spec.ts',
    'ProfileMobileValidation.spec.ts',
    'ProfilePasswordMismatch.spec.ts',
    'RiskComplianceUpdate.spec.ts',
    'BillingEdgeValidation.spec.ts',
    'BillingSubscriptionManagement.spec.ts',
    'Subscriber.spec.ts',
    'forgotpassword.spec.ts',
    'UnlockAccount.spec.ts',
    'AuthConfigurationLimits.spec.ts',
    'MfaUserFlow.spec.ts'
  ])
};

suites.stable = suites.regression;
suites.execution = suites.regression;

function testPaths(files) {
  return files.map((file) => `tests/${file}`);
}

const executableBatches = [
  {
    name: '01-public-auth',
    files: testPaths([
      'AuthUiValidation.spec.ts',
      'AuthNegative.spec.ts',
      'SignupNegative.spec.ts',
      'PasswordPolicy.spec.ts',
      'AccessibilityBrowser.spec.ts'
    ])
  },
  {
    name: '02-onboarding-plans',
    files: testPaths([
      'onboarding.spec.ts',
      'OnboardingFieldValidation.spec.ts',
      'PlanSelectionValidation.spec.ts'
    ])
  },
  {
    name: '03-stripe-checkout-lifecycle',
    files: testPaths([
      'OverlayStrategistsTrial.spec.ts',
      'DirectSubscriptionPurchase.spec.ts',
      'PaymentNegative.spec.ts',
      'BlockedScenarioExecution.spec.ts',
      'SubscriptionLifecycleExecution.spec.ts'
    ])
  },
  {
    name: '04-dashboard-profile',
    files: testPaths([
      'DashboardNavigation.spec.ts',
      'AddManualPosition.spec.ts',
      'ProfileNegative.spec.ts',
      'ProfileSecurityDisplay.spec.ts',
      'ProfileMobileValidation.spec.ts',
      'ProfilePasswordMismatch.spec.ts'
    ])
  },
  {
    name: '05-billing-session',
    files: testPaths([
      'RiskComplianceUpdate.spec.ts',
      'BillingEdgeValidation.spec.ts',
      'BillingSubscriptionManagement.spec.ts',
      'Subscriber.spec.ts',
      'SessionSecurity.spec.ts'
    ])
  },
  {
    name: '06-recovery-mfa-permissions',
    files: testPaths([
      'forgotpassword.spec.ts',
      'ResetPasswordNegative.spec.ts',
      'ResetPassword.spec.ts',
      'UnlockAccount.spec.ts',
      'AuthConfigurationLimits.spec.ts',
      'MfaUserFlow.spec.ts',
      'PermissionAccess.spec.ts'
    ])
  }
];

const allBatches = executableBatches.concat([
  {
    name: '07-coverage-matrix',
    files: testPaths(matrixOrder)
  }
]);

function assertAllSpecsAreListed() {
  const testsDir = path.join(__dirname, '..', 'tests');
  const onDisk = fs
    .readdirSync(testsDir)
    .filter((file) => file.endsWith('.spec.ts'))
    .sort();
  const listed = [...playwrightTestMatch].sort();
  const missing = onDisk.filter((file) => !listed.includes(file));
  const extra = listed.filter((file) => !onDisk.includes(file));

  if (missing.length || extra.length) {
    const details = [
      missing.length
        ? `on disk but not in scripts/execution-order.js: ${missing.join(', ')}`
        : '',
      extra.length
        ? `listed but missing from tests/: ${extra.join(', ')}`
        : ''
    ]
      .filter(Boolean)
      .join('\n');
    throw new Error(`Execution order is out of date.\n${details}`);
  }
}

function printOrder(files = playwrightTestMatch) {
  files.forEach((file, index) => {
    const step = String(index + 1).padStart(2, '0');
    console.log(`${step}  ${file}`);
  });
}

module.exports = {
  executableJourneyOrder,
  matrixOrder,
  playwrightTestMatch,
  suites,
  executableBatches,
  allBatches,
  testPaths,
  assertAllSpecsAreListed,
  printOrder
};
