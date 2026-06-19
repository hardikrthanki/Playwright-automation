// @ts-nocheck

import {
  test,
  expect,
  chromium,
  Page,
  Locator,
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

} from '@playwright/test';

const BASE_URL = 'https://puat.ooltool.com';
const TEST_EMAIL = 'imhardikthanki+09@gmail.com';
const PASSWORD = 'H@rdik9944';


test.setTimeout(60000);
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

async function safeClick(
  locator: Locator,
  label: string
) {
  console.log(`👉 ${label}`);

  await locator.waitFor({
    state: 'visible',
    timeout: 15000,
  });

  await locator.scrollIntoViewIfNeeded();

  await locator.click({
    force: true,
  });
}

/* ============================================================================
   LOGIN PAGE
============================================================================ */

class LoginPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page
      .getByLabel(/^email$/i)
      .or(
        page
          .locator('input[type="email"]')
          .first()
      );

    this.passwordInput = page
      .getByLabel(/^password$/i)
      .or(
        page
          .locator('input[type="password"]')
          .first()
      );

    this.submitButton = page
      .locator('button[type="submit"]')
      .first();
  }

  async login(email: string) {
    console.log('🔐 Logging in');

    await this.page.goto(
      `${BASE_URL}/login`,
      {
        waitUntil: 'domcontentloaded',
      }
    );

    await this.emailInput.fill(email);

    await this.passwordInput.fill(
      PASSWORD
    );

    await safeClick(
      this.submitButton,
      'Submit Login'
    );

    await expect(this.page)
      .toHaveURL(
        /dashboard/,
        {
          timeout: 30000,
        }
      );

    console.log(
      '✅ User landed on Dashboard'
    );

    console.log(
      '🌐 Current URL:',
      this.page.url()
    );
  }
  async logout() {

  console.log(
    '🚪 Logging Out'
  );

  await safeClick(
    this.page.getByText(
      'HT',
      { exact: true }
    ),
    'Open Profile Menu'
  );

  await this.page.waitForTimeout(
    2000
  );

await safeClick(
  this.page.getByText(
    /sign out/i
  ),
  'Click Sign Out'
);

  await expect(this.page)
    .toHaveURL(
      /login/,
      {
        timeout: 30000,
      }
    );

  console.log(
    '✅ Redirected To Login'
  );

  await expect(
    this.page.locator(
      'input[type="email"]'
    )
  ).toBeVisible();

  console.log(
    '✅ Login Page Visible'
  );

  console.log(
    '🎉 Logout Validation Completed'
  );
}
}
/* ============================================================================
   DASHBOARD PAGE
============================================================================ */

class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async validate() {

    console.log(
      '📊 Validating Dashboard'
    );

    await expect(this.page)
      .toHaveURL(
        /dashboard/,
        {
          timeout: 30000,
        }
      );

    console.log(
      '✅ Dashboard Loaded'
    );

    console.log(
      '🔄 Refreshing Dashboard'
    );

    await this.page.reload({
      waitUntil: 'domcontentloaded',
    });

    await expect(this.page)
      .toHaveURL(
        /dashboard/,
        {
          timeout: 30000,
        }
      );

    console.log(
      '✅ Dashboard persists after refresh'
    );
  }
}
/* ============================================================================
   BILLING PAGE
============================================================================ */

class BillingPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async validateOverview() {

    console.log(
      '💳 Validating Billing Overview'
    );
    
await safeClick(
  this.page.getByText(
    'HT',
    { exact: true }
  ),
  'Open Profile Menu'
);


    await safeClick(
      this.page.getByText(
        /billing/i
      ),
      'Open Billing'
    );

    await expect(this.page)
      .toHaveURL(
        /billing/,
        {
          timeout: 15000,
        }
      );

    console.log(
      '✅ Billing Page Opened'
    );
    await expect(
  this.page.getByText(
    /current plan/i
  )
).toBeVisible();

console.log(
  '✅ Current Plan Section Visible'
);
await expect(
  this.page.getByText(
    /income builder/i
  )
).toBeVisible();

console.log(
  '✅ Income Builder Verified'
);
await expect(
  this.page.getByText(
    /^monthly$/i
  )
).toBeVisible();

console.log(
  '✅ Monthly Billing Verified'
);
await expect(
  this.page.getByText(
    /^active$/i
  )
).toBeVisible();

console.log(
  '✅ Active Status Verified'
);
await expect(
  this.page.getByText(
    /next billing date/i
  )
).toBeVisible();

console.log(
  '✅ Next Billing Date Present'
);

console.log(
  '🎉 Billing Overview Validation Completed'
);

}   // <-- closes validateOverview()

async validatePlans() {

  console.log(
    '📦 Validating Plans Tab'
  );

  await safeClick(
    this.page.getByRole(
      'tab',
      {
        name: /plans/i,
      }
    ),
    'Open Plans Tab'
  );

  await this.page.waitForTimeout(
    2000
  );

  await expect(
    this.page.getByText(
      /income builder/i
    )
  ).toBeVisible();

  console.log(
    '✅ Income Builder Plan Visible'
  );
  await expect(
  this.page.getByText(
    /current plan/i
  )
).toBeVisible();

console.log(
  '✅ Current Plan Badge Verified'
);

await expect(
  this.page.getByText(
    /overlay strategists/i
  )
).toBeVisible();

console.log(
  '✅ Upgrade Plan Visible'
);

await expect(
  this.page.getByRole(
    'button',
    {
      name: /upgrade/i,
    }
  ).first()
).toBeVisible();

console.log(
  '✅ Upgrade Option Available'
);
console.log(
  '🎉 Plans Validation Completed'
);

} // closes validatePlans()

async validateTransactions() {

  console.log(
    '💰 Validating Transactions'
  );

  await safeClick(
    this.page.getByRole(
      'tab',
      {
        name: /history/i,
      }
    ),
    'Open History Tab'
  );

  await this.page.waitForTimeout(
    2000
  );

await safeClick(
  this.page.getByText(
    /^transactions$/i
  ),
  'Open Transactions Tab'
);
 
  

  await expect(
    this.page.getByText(
      /^paid$/i
    )
  ).toBeVisible();

  console.log(
    '✅ Paid Status Verified'
  );

  await expect(
    this.page.getByText(
      /^monthly$/i
    )
  ).toBeVisible();

  console.log(
    '✅ Monthly Billing Verified'
  );

  await expect(
    this.page.getByText(
      /USD\s*29\.00/i
    )
  ).toBeVisible();

  console.log(
    '✅ Transaction Amount Verified'
  );

  await expect(
    this.page.getByRole(
      'link',
      {
        name: /invoice/i,
      }
    )
  ).toBeVisible();

  console.log(
    '✅ Invoice Link Verified'
  );

  await expect(
    this.page.getByRole(
      'link',
      {
        name: /pdf/i,
      }
    )
  ).toBeVisible();

  console.log(
    '✅ PDF Link Verified'
  );

  console.log(
    '🎉 Transactions Validation Completed'
  );
}
async validateInvoiceDetails() {

  console.log(
    '🧾 Validating Invoice Details'
  );

  await safeClick(
    this.page.getByRole(
      'link',
      {
        name: /invoice/i,
      }
    ),
    'Open Invoice'
  );

  await expect(
    this.page.getByText(
      /invoice paid/i
    )
  ).toBeVisible();

  console.log(
    '✅ Invoice Paid Page Opened'
  );

  await expect(
    this.page.getByText(
      /\$29\.00/i
    )
  ).toBeVisible();

  console.log(
    '✅ Invoice Amount Verified'
  );

  await expect(
    this.page.getByText(
      /invoice number/i
    )
  ).toBeVisible();

  console.log(
    '✅ Invoice Number Visible'
  );

  await expect(
    this.page.getByRole(
      'button',
      {
        name: /download invoice/i,
      }
    )
  ).toBeVisible();

  console.log(
    '✅ Download Invoice Available'
  );

  await expect(
    this.page.getByRole(
      'button',
      {
        name: /download receipt/i,
      }
    )
  ).toBeVisible();

  console.log(
    '✅ Download Receipt Available'
  );
  const downloadPromise =
  this.page.waitForEvent(
    'download'
  );

await safeClick(
  this.page.getByRole(
    'link',
    {
      name: /pdf/i,
    }
  ),
  'Download PDF'
);

const download =
  await downloadPromise;

console.log(
  '✅ PDF Downloaded:',
  download.suggestedFilename()
);

}
async validateInvoicePage() {

  console.log(
    '🧾 Validating Invoice Page'
  );

  const [invoicePage] =
    await Promise.all([
      this.page.context().waitForEvent(
        'page'
      ),
      this.page.getByRole(
        'link',
        {
          name: /invoice/i,
        }
      ).click(),
    ]);

  await invoicePage.waitForLoadState(
    'domcontentloaded'
  );

  await invoicePage.waitForTimeout(
    5000
  );

  await expect(
    invoicePage.getByText(
      /invoice paid/i
    )
  ).toBeVisible();

  console.log(
    '✅ Invoice Page Opened'
  );

  /*
    Download Invoice
  */

  const invoiceDownloadPromise =
    invoicePage.waitForEvent(
      'download'
    );

  await safeClick(
    invoicePage.getByRole(
      'button',
      {
        name: /download invoice/i,
      }
    ),
    'Download Invoice'
  );

  const invoiceDownload =
    await invoiceDownloadPromise;

  console.log(
    '✅ Invoice Downloaded:',
    invoiceDownload.suggestedFilename()
  );

  await invoicePage.waitForTimeout(
    3000
  );

  /*
    Download Receipt
  */

  const receiptDownloadPromise =
    invoicePage.waitForEvent(
      'download'
    );

  await safeClick(
    invoicePage.getByRole(
      'button',
      {
        name: /download receipt/i,
      }
    ),
    'Download Receipt'
  );

  const receiptDownload =
    await receiptDownloadPromise;

  console.log(
    '✅ Receipt Downloaded:',
    receiptDownload.suggestedFilename()
  );

  await invoicePage.waitForTimeout(
    3000
  );

  await invoicePage.close();

  console.log(
    '🎉 Invoice Validation Completed'
  );
}
async validatePdfDownload() {

  console.log(
    '📄 Validating PDF Link'
  );

  const pdfLink =
    this.page.getByRole(
      'link',
      {
        name: /^pdf$/i,
      }
    );

  await expect(pdfLink).toBeVisible();

  console.log(
    '✅ PDF Link Available'
  );

  await pdfLink.click({
    force: true,
  });

  await this.page.waitForTimeout(
    3000
  );

  console.log(
    '✅ PDF Link Clicked'
  );

  console.log(
    '🎉 PDF Validation Completed'
  );
}
}