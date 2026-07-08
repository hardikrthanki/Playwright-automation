import {
  test
} from '@playwright/test';

import {
  TEST_USERS
} from './config/testData';
import { BillingPage }
  from './pages/BillingPage';
import { LoginPage }
  from './pages/LoginPage';

/* =============================================================================
TEST SUITE: Billing Subscription Management

PURPOSE
-------
Validates Stripe subscription-management portal access without mutating the
subscription. Cancellation is opened for form validation only; the final
cancellation action is never submitted.

RUN
---
$env:BILLING_SUBSCRIPTION_MANAGEMENT_ENABLED="true"
npx playwright test tests/BillingSubscriptionManagement.spec.ts --headed
============================================================================= */

function envEnabled(
  name: string
) {
  return [
    '1',
    'true',
    'yes',
    'on'
  ].includes(
    (
      process.env[name] ??
      ''
    ).toLowerCase()
  );
}

test.describe(
  'Billing Subscription Management',
  () => {

    test.describe.configure({
      timeout: 3 * 60 * 1000
    });

    test.skip(
      !envEnabled(
        'BILLING_SUBSCRIPTION_MANAGEMENT_ENABLED'
      ),
      'Skipped because BILLING_SUBSCRIPTION_MANAGEMENT_ENABLED is not configured.'
    );

    test.beforeEach(
      async ({ page }) => {
        await new LoginPage(
          page
        ).login(
          process.env.BILLING_MANAGEMENT_EMAIL ??
            TEST_USERS.subscriber.email,
          process.env.BILLING_MANAGEMENT_PASSWORD ??
            TEST_USERS.subscriber.password
        );
      }
    );

    test(
      'Manage subscription opens Stripe portal with subscription details',
      async ({ page }) => {
        await new BillingPage(
          page
        ).validateSubscriptionPortalOverview();
      }
    );

    test(
      'Billing plans show plan action or status controls',
      async ({ page }) => {
        await new BillingPage(
          page
        ).validatePlanActionControls();
      }
    );

    test(
      'Stripe portal shows paid invoice history',
      async ({ page }) => {
        await new BillingPage(
          page
        ).validateSubscriptionPortalInvoiceHistory();
      }
    );

    test(
      'Stripe add payment method screen opens without saving',
      async ({ page }) => {
        await new BillingPage(
          page
        ).validateAddPaymentMethodOpensWithoutSaving();
      }
    );

    test(
      'Stripe billing information update screen opens without saving',
      async ({ page }) => {
        await new BillingPage(
          page
        ).validateBillingInformationUpdateOpensWithoutSaving();
      }
    );

    test(
      'Cancel subscription form accepts reason and feedback without cancelling',
      async ({ page }) => {
        await new BillingPage(
          page
        ).validateCancelSubscriptionFormWithoutCancelling();
      }
    );
  }
);
