/* =============================================================================
TEST SUITE: OOLTool Subscriber Billing Validation

## PURPOSE

Validates subscriber functionality after successful onboarding
and subscription purchase.

Ensures that an active subscriber can access billing information,
subscription details, invoices, receipts, transaction history,
and logout functionality.

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

Step 1  - User Login
Step 2  - Dashboard Validation
Step 3  - Billing Overview Validation
Step 4  - Subscription Plan Validation
Step 5  - Transaction History Validation
Step 6  - Invoice Validation
Step 7  - Invoice Download Validation
Step 8  - Receipt Download Validation
Step 9  - PDF Validation
Step 10 - Logout Validation

## VALIDATIONS

 Subscriber login successful
 Dashboard accessible
 Billing page accessible
 Current subscription visible
 Billing cycle visible
 Active subscription status verified
 Transaction history available
 Invoice link available
 Invoice download successful
 Receipt download successful
 PDF link available
 Logout successful

## TEST DATA

Subscriber Email : [imhardikthanki+09@gmail.com](mailto:imhardikthanki+09@gmail.com)
Subscription Plan : Income Builder
Environment       : PUAT

## DEPENDENCIES

 Active subscriber account required
 Valid subscription required
 Billing data available
 Stripe invoice records available

## PAGE OBJECTS USED

 LoginPage.ts
 DashboardPage.ts
 BillingPage.ts

## HELPERS USED

 safeClick.ts

## EXPECTED RESULT

Subscriber successfully logs in, accesses billing
information, validates invoices and transactions,
and logs out successfully.

## AUTHOR

Hardik Thanki

============================================================================= */

import {
  test
} from '@playwright/test';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { BillingPage } from './pages/BillingPage';
import {
  TEST_USERS
} from './config/testData';
test.setTimeout(90000);
test(
  'Subscriber Login',
  async ({ page }) => {

    const login = new LoginPage(page);

    await login.login(
  TEST_USERS.subscriber.email,
  TEST_USERS.subscriber.password
);

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


