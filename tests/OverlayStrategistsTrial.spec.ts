import {
  expect,
  test
} from '@playwright/test';

import {
  AUTH_SETTINGS,
  TEST_USERS
} from './config/testData';
import {
  generateEmail,
  generateMobileNumber
} from './utils/emailGenerator';
import { CompliancePage }
  from './pages/CompliancePage';
import { LoginPage }
  from './pages/LoginPage';
import { MobileVerificationPage }
  from './pages/MobileVerificationPage';
import { PlanSelectionPage }
  from './pages/PlanSelectionPage';
import { RegistrationPage }
  from './pages/RegistrationPage';
import { RiskProfilePage }
  from './pages/RiskProfilePage';
import { StripePaymentPage }
  from './pages/StripePaymentPage';
import { DashboardPage }
  from './pages/DashboardPage';
import { BillingPage }
  from './pages/BillingPage';

/* =============================================================================
TEST SUITE: Overlay Strategists Trial

PURPOSE
-------
Starts the Subscription Management coverage from Use Case 1: Overlay
Strategists Trial Experience. The file is gated because trial creation can
consume eligibility for the generated user and still requires manual email
verification in PUAT.

Run:
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
npx playwright test tests/OverlayStrategistsTrial.spec.ts --headed
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

if (
  envEnabled(
    'OVERLAY_STRATEGISTS_FLOW_ENABLED'
  )
) {
  test.describe(
    'Overlay Strategists Trial Experience',
    () => {

    test.describe.configure({
      timeout: 20 * 60 * 1000
    });

    test(
      'New user can reach Overlay Strategists trial option',
      async ({ page }) => {

        const email =
          generateEmail(
            'overlay-trial-discovery'
          );

        const mobileNumber =
          generateMobileNumber();

        console.log(
          'Overlay Trial Email:',
          email
        );

        console.log(
          'Overlay Trial Mobile:',
          mobileNumber
        );

        await test.step(
          'Register new user',
          async () => {
            const registration =
              new RegistrationPage(
                page
              );

            await registration.open();

            await registration.register(
              email,
              mobileNumber
            );
          }
        );

        await test.step(
          'Verify email manually when enabled',
          async () => {
            if (
              AUTH_SETTINGS.emailVerificationRequired
            ) {
              console.log(
                '\nMANUAL EMAIL VERIFICATION REQUIRED'
              );
              console.log(
                `Verify email sent to: ${email}`
              );
              console.log(
                'Open Gmail and click the verification link.'
              );
              console.log(
                'After verification, resume Playwright.'
              );

              await page.pause();
            }
          }
        );

        await test.step(
          'Login and complete onboarding prerequisites',
          async () => {
            const login =
              new LoginPage(
                page
              );

            await login.login(
              email,
              TEST_USERS.onboarding.password
            );

            await new MobileVerificationPage(
              page
            ).completeIfVisible(
              mobileNumber
            );

            await new RiskProfilePage(
              page
            ).fill();

            await new CompliancePage(
              page
            ).fill();
          }
        );

        await test.step(
          'Validate Overlay Strategists trial availability',
          async () => {
            const planPage =
              new PlanSelectionPage(
                page
              );

            await planPage.validateOverlayStrategistsTrialOptions();

            await expect(
              page.getByText(
                /overlay strategists/i
              ).first()
            ).toBeVisible();
          }
        );
      }
    );

    if (
      envEnabled(
        'OVERLAY_STRATEGISTS_WITH_CARD_ENABLED'
      )
    ) {
      test(
        'New user can start Overlay Strategists trial with card',
        async ({ page }) => {

        const email =
          generateEmail(
            'overlay-with-card'
          );

        const mobileNumber =
          generateMobileNumber();

        console.log(
          'Overlay With Card Trial Email:',
          email
        );

        console.log(
          'Overlay With Card Trial Mobile:',
          mobileNumber
        );

        await test.step(
          'Register new user',
          async () => {
            const registration =
              new RegistrationPage(
                page
              );

            await registration.open();

            await registration.register(
              email,
              mobileNumber
            );
          }
        );

        await test.step(
          'Verify email manually when enabled',
          async () => {
            if (
              AUTH_SETTINGS.emailVerificationRequired
            ) {
              console.log(
                '\nMANUAL EMAIL VERIFICATION REQUIRED'
              );
              console.log(
                `Verify email sent to: ${email}`
              );
              console.log(
                'Open Gmail and click the verification link.'
              );
              console.log(
                'After verification, resume Playwright.'
              );

              await page.pause();
            }
          }
        );

        await test.step(
          'Login and complete onboarding prerequisites',
          async () => {
            const login =
              new LoginPage(
                page
              );

            await login.login(
              email,
              TEST_USERS.onboarding.password
            );

            await new MobileVerificationPage(
              page
            ).completeIfVisible(
              mobileNumber
            );

            await new RiskProfilePage(
              page
            ).fill();

            await new CompliancePage(
              page
            ).fill();
          }
        );

        await test.step(
          'Select Overlay Strategists with-card trial',
          async () => {
            const planPage =
              new PlanSelectionPage(
                page
              );

            await planPage.selectOverlayStrategistsTrialWithCard();
          }
        );

        await test.step(
          'Complete Stripe trial checkout',
          async () => {
            const stripe =
              new StripePaymentPage(
                page
              );

            await stripe.completePayment();
          }
        );

        await test.step(
          'Validate dashboard after trial checkout',
          async () => {
            const dashboard =
              new DashboardPage(
                page
              );

            await dashboard.validateLoaded();
          }
        );
        }
      );
    }

    if (
      envEnabled(
        'OVERLAY_STRATEGISTS_STRIPE_CHECKOUT_DETAILS_ENABLED'
      )
    ) {
      test(
        'Overlay Strategists with-card trial opens Stripe checkout with trial details',
        async ({ page }) => {

        const email =
          generateEmail(
            'overlay-stripe-checkout-details'
          );

        const mobileNumber =
          generateMobileNumber();

        console.log(
          'Overlay Stripe Checkout Details Email:',
          email
        );

        console.log(
          'Overlay Stripe Checkout Details Mobile:',
          mobileNumber
        );

        await test.step(
          'Register new user',
          async () => {
            const registration =
              new RegistrationPage(
                page
              );

            await registration.open();

            await registration.register(
              email,
              mobileNumber
            );
          }
        );

        await test.step(
          'Verify email manually when enabled',
          async () => {
            if (
              AUTH_SETTINGS.emailVerificationRequired
            ) {
              console.log(
                '\nMANUAL EMAIL VERIFICATION REQUIRED'
              );
              console.log(
                `Verify email sent to: ${email}`
              );
              console.log(
                'Open Gmail and click the verification link.'
              );
              console.log(
                'After verification, resume Playwright.'
              );

              await page.pause();
            }
          }
        );

        await test.step(
          'Login and complete onboarding prerequisites',
          async () => {
            const login =
              new LoginPage(
                page
              );

            await login.login(
              email,
              TEST_USERS.onboarding.password
            );

            await new MobileVerificationPage(
              page
            ).completeIfVisible(
              mobileNumber
            );

            await new RiskProfilePage(
              page
            ).fill();

            await new CompliancePage(
              page
            ).fill();
          }
        );

        await test.step(
          'Open Stripe checkout for Overlay Strategists trial',
          async () => {
            const planPage =
              new PlanSelectionPage(
                page
              );

            await planPage.selectOverlayStrategistsTrialWithCard();
          }
        );

        await test.step(
          'Validate Stripe checkout trial details without payment',
          async () => {
            const stripe =
              new StripePaymentPage(
                page
              );

            await stripe.validateTrialCheckoutDetails(
              email
            );
          }
        );
        }
      );
    }

    if (
      envEnabled(
        'OVERLAY_STRATEGISTS_STRIPE_NEGATIVE_ENABLED'
      )
    ) {
      test(
        'Overlay Strategists with-card trial blocks missing Stripe card details',
        async ({ page }) => {

        const email =
          generateEmail(
            'overlay-stripe-missing-card'
          );

        const mobileNumber =
          generateMobileNumber();

        console.log(
          'Overlay Stripe Missing Card Email:',
          email
        );

        console.log(
          'Overlay Stripe Missing Card Mobile:',
          mobileNumber
        );

        await test.step(
          'Register new user',
          async () => {
            const registration =
              new RegistrationPage(
                page
              );

            await registration.open();

            await registration.register(
              email,
              mobileNumber
            );
          }
        );

        await test.step(
          'Verify email manually when enabled',
          async () => {
            if (
              AUTH_SETTINGS.emailVerificationRequired
            ) {
              console.log(
                '\nMANUAL EMAIL VERIFICATION REQUIRED'
              );
              console.log(
                `Verify email sent to: ${email}`
              );
              console.log(
                'Open Gmail and click the verification link.'
              );
              console.log(
                'After verification, resume Playwright.'
              );

              await page.pause();
            }
          }
        );

        await test.step(
          'Login and complete onboarding prerequisites',
          async () => {
            const login =
              new LoginPage(
                page
              );

            await login.login(
              email,
              TEST_USERS.onboarding.password
            );

            await new MobileVerificationPage(
              page
            ).completeIfVisible(
              mobileNumber
            );

            await new RiskProfilePage(
              page
            ).fill();

            await new CompliancePage(
              page
            ).fill();
          }
        );

        await test.step(
          'Open Stripe checkout for Overlay Strategists trial',
          async () => {
            const planPage =
              new PlanSelectionPage(
                page
              );

            await planPage.selectOverlayStrategistsTrialWithCard();
          }
        );

        await test.step(
          'Validate Stripe blocks missing card details',
          async () => {
            const stripe =
              new StripePaymentPage(
                page
              );

            await stripe.validateMissingCardDetailsBlocked();
          }
        );
        }
      );
    }

    if (
      envEnabled(
        'OVERLAY_STRATEGISTS_DECLINED_CARD_ENABLED'
      )
    ) {
      test(
        'Overlay Strategists with-card trial rejects declined Stripe card',
        async ({ page }) => {

        const email =
          generateEmail(
            'overlay-declined-card'
          );

        const mobileNumber =
          generateMobileNumber();

        console.log(
          'Overlay Declined Card Email:',
          email
        );

        console.log(
          'Overlay Declined Card Mobile:',
          mobileNumber
        );

        await test.step(
          'Register new user',
          async () => {
            const registration =
              new RegistrationPage(
                page
              );

            await registration.open();

            await registration.register(
              email,
              mobileNumber
            );
          }
        );

        await test.step(
          'Verify email manually when enabled',
          async () => {
            if (
              AUTH_SETTINGS.emailVerificationRequired
            ) {
              console.log(
                '\nMANUAL EMAIL VERIFICATION REQUIRED'
              );
              console.log(
                `Verify email sent to: ${email}`
              );
              console.log(
                'Open Gmail and click the verification link.'
              );
              console.log(
                'After verification, resume Playwright.'
              );

              await page.pause();
            }
          }
        );

        await test.step(
          'Login and complete onboarding prerequisites',
          async () => {
            const login =
              new LoginPage(
                page
              );

            await login.login(
              email,
              TEST_USERS.onboarding.password
            );

            await new MobileVerificationPage(
              page
            ).completeIfVisible(
              mobileNumber
            );

            await new RiskProfilePage(
              page
            ).fill();

            await new CompliancePage(
              page
            ).fill();
          }
        );

        await test.step(
          'Open Stripe checkout for Overlay Strategists trial',
          async () => {
            const planPage =
              new PlanSelectionPage(
                page
              );

            await planPage.selectOverlayStrategistsTrialWithCard();
          }
        );

        await test.step(
          'Validate Stripe rejects declined card',
          async () => {
            const stripe =
              new StripePaymentPage(
                page
              );

            await stripe.validateDeclinedCardRejected();
          }
        );
        }
      );
    }

    if (
      envEnabled(
        'OVERLAY_STRATEGISTS_WITHOUT_CARD_ENABLED'
      )
    ) {
      test(
        'New user can start Overlay Strategists trial without card',
        async ({ page }) => {

        const email =
          generateEmail(
            'overlay-without-card'
          );

        const mobileNumber =
          generateMobileNumber();

        console.log(
          'Overlay Without Card Trial Email:',
          email
        );

        console.log(
          'Overlay Without Card Trial Mobile:',
          mobileNumber
        );

        await test.step(
          'Register new user',
          async () => {
            const registration =
              new RegistrationPage(
                page
              );

            await registration.open();

            await registration.register(
              email,
              mobileNumber
            );
          }
        );

        await test.step(
          'Verify email manually when enabled',
          async () => {
            if (
              AUTH_SETTINGS.emailVerificationRequired
            ) {
              console.log(
                '\nMANUAL EMAIL VERIFICATION REQUIRED'
              );
              console.log(
                `Verify email sent to: ${email}`
              );
              console.log(
                'Open Gmail and click the verification link.'
              );
              console.log(
                'After verification, resume Playwright.'
              );

              await page.pause();
            }
          }
        );

        await test.step(
          'Login and complete onboarding prerequisites',
          async () => {
            const login =
              new LoginPage(
                page
              );

            await login.login(
              email,
              TEST_USERS.onboarding.password
            );

            await new MobileVerificationPage(
              page
            ).completeIfVisible(
              mobileNumber
            );

            await new RiskProfilePage(
              page
            ).fill();

            await new CompliancePage(
              page
            ).fill();
          }
        );

        await test.step(
          'Select Overlay Strategists without-card trial',
          async () => {
            const planPage =
              new PlanSelectionPage(
                page
              );

            await planPage.validateOverlayStrategistsTrialOptions();
            await planPage.validateOverlayStrategistsFeatureSummary();
            await planPage.selectOverlayStrategistsTrialWithoutCard();
            await planPage.validateNotRedirectedToStripeCheckout();
          }
        );

        await test.step(
          'Validate dashboard after no-card trial starts',
          async () => {
            const dashboard =
              new DashboardPage(
                page
              );

            await dashboard.validateLoaded();
          }
        );

        await test.step(
          'Validate Overlay Strategists plan in billing',
          async () => {
            const billing =
              new BillingPage(
                page
              );

            await billing.validateOverview();

            await billing.validatePlanVisible(
              'Overlay Strategists'
            );

            await billing.validatePlansTabStable();
          }
        );
        }
      );
    }

    if (
      envEnabled(
        'OVERLAY_STRATEGISTS_TERMS_ENABLED'
      )
    ) {
      test(
        'Overlay Strategists trial requires terms acceptance',
        async ({ page }) => {

        const email =
          generateEmail(
            'overlay-terms-required'
          );

        const mobileNumber =
          generateMobileNumber();

        console.log(
          'Overlay Terms Validation Email:',
          email
        );

        console.log(
          'Overlay Terms Validation Mobile:',
          mobileNumber
        );

        await test.step(
          'Register new user',
          async () => {
            const registration =
              new RegistrationPage(
                page
              );

            await registration.open();

            await registration.register(
              email,
              mobileNumber
            );
          }
        );

        await test.step(
          'Verify email manually when enabled',
          async () => {
            if (
              AUTH_SETTINGS.emailVerificationRequired
            ) {
              console.log(
                '\nMANUAL EMAIL VERIFICATION REQUIRED'
              );
              console.log(
                `Verify email sent to: ${email}`
              );
              console.log(
                'Open Gmail and click the verification link.'
              );
              console.log(
                'After verification, resume Playwright.'
              );

              await page.pause();
            }
          }
        );

        await test.step(
          'Login and complete onboarding prerequisites',
          async () => {
            const login =
              new LoginPage(
                page
              );

            await login.login(
              email,
              TEST_USERS.onboarding.password
            );

            await new MobileVerificationPage(
              page
            ).completeIfVisible(
              mobileNumber
            );

            await new RiskProfilePage(
              page
            ).fill();

            await new CompliancePage(
              page
            ).fill();
          }
        );

        await test.step(
          'Validate terms are required before trial can start',
          async () => {
            const planPage =
              new PlanSelectionPage(
                page
              );

            await planPage.openOverlayStrategistsTrialWithoutCardModal();

            await planPage.validateTrialTermsRequired();
          }
        );
        }
      );
    }
    }
  );
}
