// @ts-nocheck
/* =============================================================================
TEST SUITE: OOLTool Subscriber Regression

## PURPOSE

Validates functionality available to an existing paid subscriber
after successful onboarding and subscription purchase.

## EXECUTION COMMANDS

Run in headed mode:
npx playwright test tests/Subscriber.spec.ts --headed

Run in headless mode:
npx playwright test tests/Subscriber.spec.ts

Run with Playwright UI:
npx playwright test tests/Subscriber.spec.ts --ui

Open last execution report:
npx playwright show-report

## TEST ENVIRONMENT

Application : OOLTool
Environment : PUAT
URL         : https://puat.ooltool.com
Browser     : Chromium

## FLOW COVERED

Step 1  - Subscriber Login
Step 2  - Dashboard Validation
Step 3  - Billing Overview Validation
Step 4  - Subscription Plans Validation
Step 5  - Transaction History Validation
Step 6  - Invoice Page Validation
Step 7  - Invoice Download Validation
Step 8  - Receipt Download Validation
Step 9  - PDF Link Validation
Step 10 - Logout Validation

## VALIDATIONS

✓ Existing subscriber login successful
✓ Dashboard accessible after login
✓ Current subscription details displayed
✓ Income Builder plan displayed correctly
✓ Billing cycle displayed correctly
✓ Active subscription status displayed
✓ Next billing date displayed
✓ Upgrade plans displayed
✓ Upgrade option available
✓ Transaction history available
✓ Paid transaction displayed
✓ Invoice link available
✓ PDF link available
✓ Invoice download successful
✓ Receipt download successful
✓ PDF link accessible
✓ User logout successful

## TEST DATA

• Uses an existing active subscriber account
• Account must have an active Income Builder subscription
• Account must contain transaction history

## DEPENDENCIES

• Subscriber account must exist
• Subscriber account must be active
• Billing history data must be available
• Invoice and receipt records must be available

## EXCLUSIONS

The following validations are covered separately in
onboarding.spec.ts:

• User Registration
• Email Verification
• Risk Profile Completion
• Compliance Completion
• Plan Selection
• Stripe Payment Processing

## EXPECTED RESULT

Existing subscriber can successfully access billing,
transaction history, invoices, receipts, PDF documents,
and logout without errors.

## AUTHOR

Hardik Thanki

============================================================================= */

import {
  test,
  expect,
  Page,
  Locator,
} from '@playwright/test';

import { safeClick } from './helpers/safeClick';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { BillingPage } from './pages/BillingPage';

const BASE_URL = 'https://puat.ooltool.com';
const TEST_EMAIL = 'imhardikthanki+09@gmail.com';
const PASSWORD = 'H@rdik9944';

test.setTimeout(90000);
test(
  'Subscriber Login',
  async ({ page }) => {

    const login = new LoginPage(page);

    await login.login(TEST_EMAIL);

    const dashboard =
      new DashboardPage(page);

    await dashboard.validate();
const billing =
  new BillingPage(page);

await billing.validateOverview();
await billing.validatePlans();
await billing.validateTransactions();
await billing.validateInvoicePage();
await billing.validatePdfDownload();

await login.logout();

  }
);


