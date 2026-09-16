import {
  TEST_USERS
} from './config/testData';

import { test }
  from './fixtures/subscriberAuth';

import { BillingPage }
  from './pages/BillingPage';

import { LoginPage }
  from './pages/LoginPage';

/* =============================================================================
TEST SUITE: Billing Subscription Management

PURPOSE
-------
One authenticated session validates Stripe portal, plans, invoices, and
optional mutating-adjacent screens without submitting cancellation.

RUN
---
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

const billingUser = {
  email:
    process.env.BILLING_MANAGEMENT_EMAIL ??
    TEST_USERS.subscriber.email,

  password:
    process.env.BILLING_MANAGEMENT_PASSWORD ??
    TEST_USERS.subscriber.password
};

const usesSharedSubscriber =
  billingUser.email ===
  TEST_USERS.subscriber.email;

test.describe(
  'Billing Subscription Management',
  () => {

    test.describe.configure({
      timeout: 5 * 60 * 1000
    });

    test(
      'Billing portal plans invoices and return in one session',
      async ({ page }) => {
        if (
          !usesSharedSubscriber
        ) {
          await new LoginPage(
            page
          ).login(
            billingUser.email,
            billingUser.password
          );
        }

        const billing =
          new BillingPage(
            page
          );

        await test.step(
          'Plan action or status controls',
          async () => {
            await billing.validatePlanActionControls();
          }
        );

        await test.step(
          'Paid subscriber is not offered Overlay Strategists trial CTA',
          async () => {
            await billing.validatePaidSubscriberTrialCtaIsNotOffered();
          }
        );

        await test.step(
          'Stripe portal overview invoices and return',
          async () => {
            await billing.validateSubscriptionPortalOverview();
            await billing.validateSubscriptionPortalInvoiceHistory();
            await billing.validateSubscriptionPortalReturnToApplication();
          }
        );

        if (
          !envEnabled(
            'BILLING_SUBSCRIPTION_MANAGEMENT_ENABLED'
          )
        ) {
          return;
        }

        await test.step(
          'Add payment method opens without saving',
          async () => {
            await billing.validateAddPaymentMethodOpensWithoutSaving();
          }
        );

        await test.step(
          'Payment recovery entry points',
          async () => {
            await billing.validatePaymentRecoveryEntryPointsSummary();
          }
        );

        await test.step(
          'Billing information update opens without saving',
          async () => {
            await billing.validateBillingInformationUpdateOpensWithoutSaving();
          }
        );

        await test.step(
          'Cancel form accepts reason without cancelling',
          async () => {
            await billing.validateCancelSubscriptionFormWithoutCancelling();
          }
        );

        await test.step(
          'Cancellation lifecycle is readable without cancelling',
          async () => {
            await billing.validateSubscriptionPortalCancellationLifecycleSummary();
          }
        );
      }
    );
  }
);
