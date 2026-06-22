/* =============================================================================
PAGE OBJECT: BillingPage

## PURPOSE

Validates subscriber billing and subscription functionality.

## FEATURES COVERED

1. Billing Overview
2. Subscription Plans
3. Billing History
4. Transactions
5. Invoice Validation
6. Receipt Validation
7. PDF Validation

## METHODS

validateOverview()
validatePlans()
validateTransactions()
validateInvoicePage()
validatePdfDownload()

## USED BY

Subscriber.spec.ts

============================================================================= */

import {
  Page,
  expect
} from '@playwright/test';

import { safeClick }
  from '../helpers/safeClick';
export class BillingPage {
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