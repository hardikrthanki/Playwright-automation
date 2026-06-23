import {
  Page,
  expect
} from '@playwright/test';

import { safeClick }
  from '../helpers/safeClick';
  import { BasePage }
  from './BasePage';

/* ============================================================================
   BILLING PAGE
============================================================================ */

export class BillingPage
  extends BasePage {


constructor(page: Page) {
  super(page);
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
}
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
}
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

  await expect(
    invoicePage.getByText(
      /invoice paid/i
    )
  ).toBeVisible();

  console.log(
    '✅ Invoice Page Opened'
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

  await expect(
    pdfLink
  ).toBeVisible();

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