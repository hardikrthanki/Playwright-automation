/* =============================================================================
EXECUTION ORDER

PURPOSE
-------
Runs Playwright specs in the OOLTool user-journey order from
docs/USER_JOURNEY_COVERAGE.md, not alphabetical file name order.

Playwright itself sorts files by name (AccessibilityBrowser first). One
numbered chromium project per spec is what actually sequences a full
`playwright test` run with workers: 1.

Journey sequence:
1. Register new user (onboarding), then signup/password rules
2. Login screens after an account can be created
3. Risk/compliance fields and plan catalog
4. Stripe trial, checkout, and subscription lifecycle
5. Authenticated dashboard, positions, profile
6. Billing, logout, and session
7. Password recovery, unlock, MFA, and permission access
8. Stripe FRD matrix (automated rows execute unique UI keys; blocked/future stay skip)
9. User-journey coverage matrix last (skip-only AIR)
============================================================================= */

const fs = require('fs');
const path = require('path');

const coreExecutableJourneyOrder = [
  'onboarding.spec.ts',
  'SignupNegative.spec.ts',
  'PasswordPolicy.spec.ts',

  'AuthUiValidation.spec.ts',
  'AuthNegative.spec.ts',
  'AccessibilityBrowser.spec.ts',

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

const stripeMatrixOrder = [
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

const userJourneyMatrixOrder = [
  'UserJourneyCoverageMatrix.spec.ts'
];

const matrixOrder = userJourneyMatrixOrder.concat(stripeMatrixOrder);

const executableJourneyOrder = coreExecutableJourneyOrder.concat(
  stripeMatrixOrder
);

const playwrightTestMatch = executableJourneyOrder.concat(
  userJourneyMatrixOrder
);

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
    'onboarding.spec.ts',
    'OnboardingFieldValidation.spec.ts',
    'AuthUiValidation.spec.ts',
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
    name: '01-register',
    files: testPaths([
      'onboarding.spec.ts',
      'SignupNegative.spec.ts',
      'PasswordPolicy.spec.ts'
    ])
  },
  {
    name: '02-login-auth-ui',
    files: testPaths([
      'AuthUiValidation.spec.ts',
      'AuthNegative.spec.ts',
      'AccessibilityBrowser.spec.ts'
    ])
  },
  {
    name: '03-onboarding-plans',
    files: testPaths([
      'OnboardingFieldValidation.spec.ts',
      'PlanSelectionValidation.spec.ts'
    ])
  },
  {
    name: '04-stripe-checkout-lifecycle',
    files: testPaths([
      'OverlayStrategistsTrial.spec.ts',
      'DirectSubscriptionPurchase.spec.ts',
      'PaymentNegative.spec.ts',
      'BlockedScenarioExecution.spec.ts',
      'SubscriptionLifecycleExecution.spec.ts'
    ])
  },
  {
    name: '05-dashboard-profile',
    files: testPaths([
      'DashboardNavigation.spec.ts',
      'AddManualPosition.spec.ts',
      'ProfileNegative.spec.ts',
      'ProfileSecurityDisplay.spec.ts',
      'ProfileMobileValidation.spec.ts',
      'ProfilePasswordMismatch.spec.ts',
      'RiskComplianceUpdate.spec.ts'
    ])
  },
  {
    name: '06-billing-session',
    files: testPaths([
      'BillingEdgeValidation.spec.ts',
      'BillingSubscriptionManagement.spec.ts',
      'Subscriber.spec.ts',
      'SessionSecurity.spec.ts'
    ])
  },
  {
    name: '07-recovery-mfa-permissions',
    files: testPaths([
      'forgotpassword.spec.ts',
      'ResetPasswordNegative.spec.ts',
      'ResetPassword.spec.ts',
      'UnlockAccount.spec.ts',
      'AuthConfigurationLimits.spec.ts',
      'MfaUserFlow.spec.ts',
      'PermissionAccess.spec.ts'
    ])
  },
  {
    name: '08-stripe-matrix',
    files: testPaths(stripeMatrixOrder)
  }
];

const allBatches = executableBatches.concat([
  {
    name: '09-user-journey-matrix',
    files: testPaths(userJourneyMatrixOrder)
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
  console.log('User-journey order (registration first):');
  files.forEach((file, index) => {
    const step = String(index + 1).padStart(2, '0');
    const label =
      index === 0
        ? '  <- register new user'
        : '';
    console.log(`${step}  ${file}${label}`);
  });
}

function journeyProjectName(index) {
  return `j${String(index + 1).padStart(2, '0')}`;
}

module.exports = {
  coreExecutableJourneyOrder,
  stripeMatrixOrder,
  userJourneyMatrixOrder,
  executableJourneyOrder,
  matrixOrder,
  playwrightTestMatch,
  suites,
  executableBatches,
  allBatches,
  testPaths,
  journeyProjectName,
  assertAllSpecsAreListed,
  printOrder
};
