import {
  Page,
  expect
} from '@playwright/test';

import { safeClick }
  from '../helpers/safeClick';
  import { BasePage }
  from './BasePage';
    import { Logger }
  from '../utils/logger';

/* ============================================================================
PAGE OBJECT: BillingPage

PURPOSE
-------
Validates subscriber billing sections, plan details, transactions, invoices,
and PDF links.
============================================================================ */

export class BillingPage
  extends BasePage {


constructor(page: Page) {
  super(page);
}
  async validateOverview() {

Logger.info(
  'Validating Billing Overview'
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

Logger.success(
  'Billing Page Opened'
);
}
async validatePlans() {

 Logger.info(
  'Validating Plans Tab'
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

  await expect(
    this.page.getByText(
      /income builder/i
    )
  ).toBeVisible();

  console.log(
    ' Income Builder Plan Visible'
  );
}
async validateTransactions() {

 Logger.info(
  'Validating Transactions'
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
    ' Paid Status Verified'
  );
}
async validateInvoicePage() {

Logger.info(
  'Validating Invoice Page'
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
    ' Invoice Page Opened'
  );

  await invoicePage.close();

 Logger.celebration(
  'Invoice Validation Completed'
);
}
async validatePdfDownload() {

  Logger.info(
  'Validating PDF Link'
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
    ' PDF Link Available'
  );

  await pdfLink.click({
    force: true,
  });

  console.log(
    ' PDF Link Clicked'
  );

  console.log(
    ' PDF Validation Completed'
  );
}
}
