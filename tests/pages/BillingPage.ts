import {
  Page,
  Locator,
  expect
} from '@playwright/test';

import { safeClick }
  from '../helpers/safeClick';
  import { BasePage }
  from './BasePage';
    import { Logger }
  from '../utils/logger';
import {
  URLS
} from '../config/constants';

/* ============================================================================
PAGE OBJECT: BillingPage

PURPOSE
-------
Validates subscriber billing sections, plan details, transactions, invoices,
and PDF links.
============================================================================ */

export class BillingPage
  extends BasePage {

  readonly plansTab: Locator;

  readonly historyTab: Locator;

  readonly transactionsTab: Locator;

  readonly invoiceLinks: Locator;

  readonly pdfLinks: Locator;

constructor(page: Page) {
  super(page);

  this.plansTab =
    page.getByRole(
      'tab',
      {
        name: /plans/i,
      }
    );

  this.historyTab =
    page.getByRole(
      'tab',
      {
        name: /history/i,
      }
    );

  this.transactionsTab =
    page.getByText(
      /^transactions$/i
    );

  this.invoiceLinks =
    page.getByRole(
      'link',
      {
        name: /invoice/i,
      }
    );

  this.pdfLinks =
    page.getByRole(
      'link',
      {
        name: /^pdf$/i,
      }
    );
}
async validateOverview() {

Logger.info(
  'Validating Billing Overview'
);

  try {
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

    await this.page.waitForURL(
      /billing/,
      {
        timeout: 5000,
      }
    );
  } catch {
    Logger.info(
      'Billing menu navigation unavailable; opening billing route directly'
    );

    await this.page.goto(
      new URL(
        URLS.BILLING,
        this.page.url()
      ).toString(),
      {
        waitUntil: 'domcontentloaded',
      }
    );
  }

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
    this.plansTab,
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

async validatePlanVisible(
  planName: string
) {

 Logger.info(
  `Validating ${planName} Plan`
);

  await safeClick(
    this.plansTab,
    'Open Plans Tab'
  );

  await expect(
    this.page.getByText(
      new RegExp(
        planName.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&'
        ),
        'i'
      )
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  Logger.success(
    `${planName} Plan Visible`
  );
}
async validateTransactions() {

 Logger.info(
  'Validating Transactions'
);

  await safeClick(
    this.historyTab,
    'Open History Tab'
  );

  await safeClick(
    this.transactionsTab,
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
    this.pdfLinks.first();

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

async validateBillingUrl() {

  await expect(
    this.page
  ).toHaveURL(
    /billing/,
    {
      timeout: 15000,
    }
  );
}

async validatePlansTabStable() {

  Logger.info(
    'Validating Billing Plans Tab Stability'
  );

  await safeClick(
    this.plansTab,
    'Open Plans Tab'
  );

  await this.validateBillingUrl();

  await expect(
    this.page.getByText(
      /income builder|current plan|subscription|plan/i
    ).first()
  ).toBeVisible({
    timeout: 15000,
  });

  await safeClick(
    this.plansTab,
    'Reopen Plans Tab'
  );

  await this.validateBillingUrl();

  Logger.success(
    'Billing Plans Tab Stable'
  );
}

async validateHistoryTabStable() {

  Logger.info(
    'Validating Billing History Tab Stability'
  );

  await safeClick(
    this.historyTab,
    'Open History Tab'
  );

  await safeClick(
    this.transactionsTab,
    'Open Transactions Tab'
  );

  await this.validateBillingUrl();

  await expect(
    this.page.getByText(
      /transactions|paid|invoice|history/i
    ).first()
  ).toBeVisible({
    timeout: 15000,
  });

  Logger.success(
    'Billing History Tab Stable'
  );
}

async validateInvoiceAndPdfLinksHaveTargets() {

  Logger.info(
    'Validating Billing Evidence Links'
  );

  await this.validateHistoryTabStable();

  const invoiceLink =
    this.invoiceLinks.first();

  await expect(
    invoiceLink
  ).toBeVisible({
    timeout: 15000,
  });

  const invoiceHref =
    await invoiceLink.getAttribute(
      'href'
    );

  expect(
    invoiceHref
  ).toBeTruthy();

  const pdfLink =
    this.pdfLinks.first();

  await expect(
    pdfLink
  ).toBeVisible({
    timeout: 15000,
  });

  const pdfHref =
    await pdfLink.getAttribute(
      'href'
    );

  expect(
    pdfHref
  ).toBeTruthy();

  Logger.success(
    'Billing Evidence Links Have Targets'
  );
}
}
