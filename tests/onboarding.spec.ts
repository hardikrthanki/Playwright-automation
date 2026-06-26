// @ts-nocheck

import {
  test,
  chromium,
  Page,
} from '@playwright/test';
import { RegistrationPage }
  from './pages/RegistrationPage';
import { LoginPage }
  from './pages/LoginPage';
import { MobileVerificationPage }
  from './pages/MobileVerificationPage';
import { PlanSelectionPage }
  from './pages/PlanSelectionPage';
import { StripePaymentPage }
  from './pages/StripePaymentPage';
import { RiskProfilePage }
  from './pages/RiskProfilePage';
import { CompliancePage }
  from './pages/CompliancePage';
import { DashboardPage }
  from './pages/DashboardPage';
import {
  AUTH_SETTINGS,
  TEST_USERS
} from './config/testData';
import {
  generateEmail,
  generateMobileNumber
} from './utils/emailGenerator';

/* =============================================================================
TEST FILE: onboarding.spec.ts

PURPOSE

Validates complete OOLTool user onboarding flow from registration through
subscription purchase.

## EXECUTION COMMANDS

Run in headed mode:
npx playwright test tests/onboarding.spec.ts --headed

Run in headless mode:
npx playwright test tests/onboarding.spec.ts

Run with Playwright UI:
npx playwright test tests/onboarding.spec.ts --ui

Open last execution report:
npx playwright show-report

## TEST ENVIRONMENT

Application : OOLTool
Environment : PUAT
URL         : https://puat.ooltool.com
Browser     : Chromium

FLOW COVERED
User Registration
Email Verification
User Login
Risk Profile Completion
Compliance Profile Completion
Subscription Plan Selection
Stripe Payment Processing
Dashboard Redirect Validation
PAGE OBJECTS USED

RegistrationPage
LoginPage
RiskProfilePage
CompliancePage
PlanSelectionPage
StripePaymentPage

HELPERS USED

safeClick()
networkIdle()

TEST SCENARIOS
Register New User
Verify Email Address
Login Successfully
Complete Risk Profile
Complete Compliance Profile
Select Income Builder Plan
Complete Stripe Payment
Validate Dashboard Access
FRAMEWORK DESIGN

Spec File Responsibility:

Test Flow
Test Orchestration
Assertions

Page Object Responsibility:

Locators
Page Actions
Page Validations

Helper Responsibility:

Shared Reusable Utilities

============================================================================= */

/* ============================================================================
   CONFIGURATION
============================================================================ */

const BASE_URL = 'https://puat.ooltool.com';
const PASSWORD = 'Test@123456';


/* ============================================================================
   MAIN TEST
============================================================================ */

test.describe('OOLTool Onboarding Flow', () => {
  test(
    'Register -> Verify Email -> Login -> Risk -> Compliance',
    async () => {
      test.setTimeout(20 * 60 * 1000); // 20 minutes

      const browser = await chromium.launch({
        headless: false,
      });

      const context = await browser.newContext();

      const page = await context.newPage();
      const email =
        generateEmail();
      const mobileNumber =
        generateMobileNumber();
      console.log(
        'Generated Email:',
        email
      );
      console.log(
        'Generated Mobile:',
        mobileNumber
      );

      console.log(
        `Test Email: ${email}`
      );

      try {
        await test.step(
          'Step 1 - Registration',
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
          'Step 2 - Verify Email',
          async () => {
            if (
              AUTH_SETTINGS.emailVerificationRequired
            ) {
            console.log('\nMANUAL EMAIL VERIFICATION REQUIRED');
            console.log(`Verify email sent to: ${email}`);
            console.log('Open Gmail and click the verification link.');
            console.log('After verification, resume Playwright.');
            await page.pause();
            } else {
              console.log(
                'Email verification is disabled in auth settings'
              );
            }
          }
        );
        await test.step(
          'Step 3 - Login',
          async () => {
            const login =
              new LoginPage(
                page
              );

            await login.login(
              email,
              TEST_USERS.onboarding.password
            );
          }
        );
        await test.step(
          'Step 4 - Mobile Verification',
          async () => {
            const mobileVerification =
              new MobileVerificationPage(
                page
              );

            await mobileVerification.completeIfVisible(
              mobileNumber
            );
          }
        );
        await test.step(
          'Step 5 - Risk Profile',
          async () => {
            const risk =
              new RiskProfilePage(
                page
              );

            await risk.fill();
          }
        );
        await test.step(
          'Step 6 - Compliance',
          async () => {
            const compliance =
              new CompliancePage(
                page
              );

            await compliance.fill();
          }
        );

        await test.step(
          'Step 7 - Plan Selection',
          async () => {

            const planPage =
              new PlanSelectionPage(page);

            await planPage.selectIncomeBuilderPlan();
          }

        );
        await test.step(
          'Step 8 - Stripe Payment',
          async () => {

            const stripe =
              new StripePaymentPage(
                page
              );

            await stripe.completePayment();
          }
        );
        await test.step(
          'Step 9 - Dashboard Validation',
          async () => {
            const dashboard =
              new DashboardPage(page);

            await dashboard.validate();
          }
        );
        console.log(
          'OOLTOOL ONBOARDING FLOW COMPLETED SUCCESSFULLY'
        );

      } finally {

        await browser.close();

        console.log(
          'Browser Closed'
        );
      }
    }
  );
});
