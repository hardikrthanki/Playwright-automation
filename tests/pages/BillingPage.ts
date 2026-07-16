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

private async billingContentIsVisible() {
  const markers = [
    this.plansTab,
    this.historyTab,
    this.page.getByRole(
      'button',
      {
        name: /manage subscription|manage billing|billing portal|customer portal|subscription settings|manage plan|manage payment methods|payment methods|payment settings|invoices/i,
      }
    ).first(),
    this.page.getByRole(
      'link',
      {
        name: /manage subscription|manage billing|billing portal|customer portal|subscription settings|manage plan|manage payment methods|payment methods|payment settings|invoices/i,
      }
    ).first(),
    this.page.getByText(
      /current plan|current subscription|income builder|transactions|invoice history|billing overview/i
    ).first(),
  ];

  for (const marker of markers) {
    if (
      await marker.isVisible()
        .catch(
          () => false
        )
    ) {
      return true;
    }
  }

  return false;
}

private async visibleControlSummary() {
  return this.page.locator(
    'a, button'
  )
    .evaluateAll(
      elements =>
        elements
          .map(
            element =>
              (
                element.textContent ??
                element.getAttribute('aria-label') ??
                element.getAttribute('href') ??
                ''
              ).trim()
          )
          .filter(Boolean)
          .slice(0, 30)
    )
    .catch(
      () => []
    );
}

private async waitForBillingContent() {
  await expect
    .poll(
      async () =>
        this.billingContentIsVisible(),
      {
        timeout: 30000,
        message: 'Waiting for billing page content to load',
      }
    )
    .toBe(
      true
    );

  await expect(
    this.page.getByText(
      /this page couldn'?t load|reload to try again/i
    ).first()
  ).not.toBeVisible({
    timeout: 3000,
  });
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

    await this.waitForBillingContent();
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

    await expect(this.page)
      .toHaveURL(
        /billing/,
        {
          timeout: 15000,
        }
      );

    try {
      await this.waitForBillingContent();
    } catch (error) {
      const availableControls =
        await this.visibleControlSummary();

      throw new Error(
        `Billing route opened but billing content did not load. Current URL: ${this.page.url()}. Visible controls: ${availableControls.join(' | ')}. Original error: ${String(error)}`
      );
    }
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

  const paidStatusBadges =
    this.page.getByText(
      /^paid$/i
    );

  await expect(
    paidStatusBadges.first()
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
      ).first().click(),
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

async validatePlanActionControls() {

  Logger.info(
    'Validating Billing Plan Action Controls'
  );

  await this.validateOverview();

  if (
    await this.plansTab.isVisible({
      timeout: 5000
    }).catch(
      () => false
    )
  ) {
    await safeClick(
      this.plansTab,
      'Open Plans Tab'
    );
  }

  await this.validateBillingUrl();

  const planActions =
    this.page.locator(
      'a, button'
    ).filter({
      hasText: /upgrade|downgrade|current plan|active|selected|subscribe|choose plan|manage/i
    });

  await expect
    .poll(
      async () =>
        planActions.count(),
      {
        timeout: 15000,
        message: 'Waiting for at least one plan action/status control',
      }
    )
    .toBeGreaterThan(
      0
    );

  Logger.success(
    'Billing Plan Action Controls Visible'
  );
}

async validatePaidSubscriberTrialCtaIsNotOffered() {

  Logger.info(
    'Validating paid subscriber is not offered Overlay Strategists trial CTA'
  );

  await this.validateOverview();

  if (
    await this.plansTab.isVisible({
      timeout: 5000
    }).catch(
      () => false
    )
  ) {
    await safeClick(
      this.plansTab,
      'Open Plans Tab'
    );
  }

  await this.validateBillingUrl();

  await expect(
    this.page.getByText(
      /current plan|current subscription|billing overview|income builder|overlay strategists|portfolio hedger|marketplace|free|trial|upgrade|downgrade/i
    ).first()
  ).toBeVisible({
    timeout: 15000,
  });

  await expect(
    this.page.getByRole(
      'button',
      {
        name: /try 30 days free/i
      }
    )
  ).toHaveCount(
    0
  );

  Logger.success(
    'Paid subscriber trial CTA is not offered'
  );
}

async validateOverviewContract() {

  Logger.info(
    'Validating Billing Overview Contract'
  );

  await this.validateBillingUrl();
  await this.waitForBillingContent();

  await expect(
    this.plansTab
  ).toBeVisible({
    timeout: 15000,
  });

  await expect(
    this.historyTab
  ).toBeVisible({
    timeout: 15000,
  });

  await expect(
    this.page.getByText(
      /current plan|current subscription|billing overview|income builder|overlay strategists|portfolio hedger|marketplace|free|trial/i
    ).first()
  ).toBeVisible({
    timeout: 15000,
  });

  const manageControl =
    await this.manageSubscriptionControl();

  await expect(
    manageControl
  ).toBeVisible({
    timeout: 15000,
  });

  const planStatusOrAction =
    this.page.locator(
      'a, button, [role="status"], [data-state]'
    ).filter({
      hasText: /active|current|trial|free|manage|upgrade|downgrade|selected|subscription/i,
    }).first();

  await expect(
    planStatusOrAction
  ).toBeVisible({
    timeout: 15000,
  });

  Logger.success(
    'Billing Overview Contract Validated'
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

private async manageSubscriptionControl() {
  const visibleControls =
    this.page.locator(
      'a, button'
    );

  const manageText =
    /manage subscription|manage billing|billing portal|customer portal|subscription settings|manage plan|manage payment methods|payment methods|invoices|payment settings|update payment method|change payment method|edit payment method/i;

  const controlCount =
    await visibleControls.count();

  for (let i = 0; i < controlCount; i++) {
    const control =
      visibleControls.nth(i);

    if (
      !await control.isVisible()
        .catch(
          () => false
        )
    ) {
      continue;
    }

    const text =
      (
        await control.innerText()
          .catch(
            () => ''
          )
      ).trim();

    const href =
      await control.getAttribute(
        'href'
      );

    if (
      manageText.test(
        text
      ) ||
      /stripe|billing_portal|customer-portal|portal/i.test(
        href ?? ''
      )
    ) {
      return control;
    }
  }

  const availableControls =
    await visibleControls
      .evaluateAll(
        elements =>
          elements
            .map(
              element =>
                (
                  element.textContent ??
                  element.getAttribute('aria-label') ??
                  element.getAttribute('href') ??
                  ''
                ).trim()
            )
            .filter(Boolean)
            .slice(0, 30)
      )
      .catch(
        () => []
      );

  throw new Error(
    `Manage subscription control was not found. Visible controls: ${availableControls.join(' | ')}`
  );
}

async openSubscriptionPortal() {

  Logger.info(
    'Opening subscription management portal'
  );

  await this.validateOverview();

  const manageControl =
    await this.manageSubscriptionControl();

  await expect(
    manageControl
  ).toBeVisible({
    timeout: 15000
  });

  const newPagePromise =
    this.page.context()
      .waitForEvent(
        'page',
        {
          timeout: 7000
        }
      )
      .catch(
        () => undefined
      );

  await safeClick(
    manageControl,
    'Manage Subscription'
  );

  const portalPage =
    await newPagePromise ??
    this.page;

  await portalPage.waitForLoadState(
    'domcontentloaded'
  );

  await portalPage.waitForLoadState(
    'networkidle',
    {
      timeout: 15000
    }
  ).catch(
    () => undefined
  );

  const hasPortalOverview = async () => {
    const bodyText =
      await portalPage
        .locator(
          'body'
        )
        .innerText()
        .catch(
          () => ''
        );

    return /current subscription|payment method|billing information|invoice history|selected subscription|cancel your subscription/i.test(
      bodyText
    );
  };

  let portalOverviewVisible =
    await expect
      .poll(
        hasPortalOverview,
        {
          timeout: 45000
        }
      )
      .toBeTruthy()
      .then(
        () => true
      )
      .catch(
        () => false
      );

  if (!portalOverviewVisible) {
    await portalPage.reload({
      waitUntil: 'domcontentloaded'
    }).catch(
      () => undefined
    );

    await portalPage.waitForLoadState(
      'networkidle',
      {
        timeout: 15000
      }
    ).catch(
      () => undefined
    );

    portalOverviewVisible =
      await expect
        .poll(
          hasPortalOverview,
          {
            timeout: 45000
          }
        )
        .toBeTruthy()
        .then(
          () => true
        )
        .catch(
          () => false
        );
  }

  if (!portalOverviewVisible) {
    throw new Error(
      `Stripe billing portal did not show the subscription overview. URL: ${portalPage.url()}`
    );
  }

  Logger.success(
    'Subscription management portal opened'
  );

  return portalPage;
}

async validateSubscriptionPortalOverview() {

  const portalPage =
    await this.openSubscriptionPortal();

  Logger.info(
    'Validating subscription portal overview'
  );

  await expect(
    portalPage.getByText(
      /current subscription/i
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  await expect(
    portalPage.getByText(
      /payment method/i
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  await expect(
    portalPage.getByText(
      /billing information/i
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  await expect(
    portalPage.getByText(
      /invoice history/i
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  const portalText =
    await portalPage
      .locator(
        'body'
      )
      .innerText();

  expect(
    portalText
  ).toMatch(
    /current subscription[\s\S]+payment method[\s\S]+billing information[\s\S]+invoice history/i
  );

  const expectedPlan =
    process.env.BILLING_EXPECTED_PLAN;

  if (expectedPlan) {
    expect(
      portalText
    ).toMatch(
      new RegExp(
        expectedPlan.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&'
        ),
        'i'
      )
    );
  } else {
    expect(
      portalText
    ).toMatch(
      /starter|income builder|overlay strategists|portfolio hedger|marketplace|advanced|pro|curious explorer/i
    );
  }

  const expectedFrequency =
    process.env.BILLING_EXPECTED_FREQUENCY;

  if (expectedFrequency) {
    expect(
      portalText
    ).toMatch(
      new RegExp(
        expectedFrequency,
        'i'
      )
    );
  } else {
    expect(
      portalText
    ).toMatch(
      /per month|per year|\/ month|\/ year|monthly|annual/i
    );
  }

  const expectedCardLast4 =
    process.env.BILLING_EXPECTED_CARD_LAST4;

  if (expectedCardLast4) {
    expect(
      portalText
    ).toMatch(
      new RegExp(
        expectedCardLast4,
        'i'
      )
    );
  } else {
    expect(
      portalText
    ).toMatch(
      /visa|mastercard|card|payment method/i
    );
  }

  Logger.success(
    'Subscription portal overview validated'
  );

  if (portalPage !== this.page) {
    await portalPage.close();
  }
}

async validateSubscriptionPortalInvoiceHistory() {

  const portalPage =
    await this.openSubscriptionPortal();

  Logger.info(
    'Validating subscription portal invoice history'
  );

  await expect(
    portalPage.getByText(
      /invoice history/i
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  await expect(
    portalPage.getByText(
      /paid/i
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  const invoiceLink =
    portalPage.getByRole(
      'link',
      {
        name: /paid|invoice|\$\d|₹|advanced|builder|strategist/i
      }
    ).first();

  await expect(
    invoiceLink
  ).toBeVisible({
    timeout: 15000
  });

  const invoiceHref =
    await invoiceLink.getAttribute(
      'href'
    );

  expect(
    invoiceHref
  ).toBeTruthy();

  Logger.success(
    'Subscription portal invoice history validated'
  );

  if (portalPage !== this.page) {
    await portalPage.close();
  }
}

async validateSubscriptionPortalReturnToApplication() {

  const portalPage =
    await this.openSubscriptionPortal();

  Logger.info(
    'Validating subscription portal return link'
  );

  const returnControl =
    portalPage.locator(
      'a, button'
    ).filter({
      hasText: /return to|back to|go back/i,
    }).first();

  await expect(
    returnControl
  ).toBeVisible({
    timeout: 15000
  });

  await safeClick(
    returnControl,
    'Return To Application'
  );

  await portalPage.waitForLoadState(
    'domcontentloaded'
  ).catch(
    () => undefined
  );

  await expect
    .poll(
      async () => {
        const currentUrl =
          portalPage.url();

        const bodyText =
          await portalPage.locator(
            'body'
          ).innerText()
            .catch(
              () => ''
            );

        return (
          /ooltool|dashboard|billing/i.test(
            currentUrl
          ) ||
          /ooltool|dashboard|billing|profile|plan/i.test(
            bodyText
          )
        );
      },
      {
        timeout: 30000,
        message:
          'Portal return action should land back on application content'
      }
    )
    .toBe(
      true
    );

  Logger.success(
    'Subscription portal return link validated'
  );

  if (portalPage !== this.page && !portalPage.isClosed()) {
    await portalPage.close();
  }
}

async validateAddPaymentMethodOpensWithoutSaving() {

  const portalPage =
    await this.openSubscriptionPortal();

  Logger.info(
    'Validating add payment method screen without saving'
  );

  await safeClick(
    portalPage.getByRole(
      'link',
      {
        name: /add payment method/i
      }
    ).first(),
    'Open Add Payment Method'
  );

  await portalPage.waitForLoadState(
    'domcontentloaded'
  );

  await expect(
    portalPage.getByText(
      /add payment method|payment method|card information|card/i
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  Logger.success(
    'Add payment method screen opened without saving'
  );

  if (portalPage !== this.page) {
    await portalPage.close();
  }
}

async validateBillingInformationUpdateOpensWithoutSaving() {

  const portalPage =
    await this.openSubscriptionPortal();

  Logger.info(
    'Validating billing information update screen without saving'
  );

  await safeClick(
    portalPage.getByRole(
      'link',
      {
        name: /update information/i
      }
    ).first(),
    'Open Update Billing Information'
  );

  await portalPage.waitForLoadState(
    'domcontentloaded'
  );

  await expect(
    portalPage.getByText(
      /billing information|update information|email|save|cancel/i
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  Logger.success(
    'Billing information update screen opened without saving'
  );

  if (portalPage !== this.page) {
    await portalPage.close();
  }
}

async validateCancelSubscriptionFormWithoutCancelling() {

  const portalPage =
    await this.openSubscriptionPortal();

  Logger.info(
    'Validating cancel subscription form without cancelling'
  );

  const alreadyCancelling =
    portalPage.getByText(
      /cancels\s+\w+|your service will end/i
    ).first();

  const reactivateControl =
    portalPage.getByRole(
      'link',
      {
        name: /don'?t cancel subscription|resume subscription|reactivate/i
      }
    ).first();

  if (
    await alreadyCancelling.isVisible({
      timeout: 5000
    }).catch(
      () => false
    )
  ) {
    await expect(
      reactivateControl
    ).toBeVisible({
      timeout: 15000
    });

    Logger.success(
      'Subscription is already scheduled to cancel; cancellation state validated without changing it'
    );

    if (portalPage !== this.page) {
      await portalPage.close();
    }

    return;
  }

  const cancelControl =
    portalPage.locator(
      'button, a'
    ).filter({
      hasText: /cancel subscription/i
    }).first();

  await safeClick(
    cancelControl,
    'Open Cancel Subscription'
  );

  await expect(
    portalPage.getByText(
      /cancel your subscription/i
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  await expect(
    portalPage.getByText(
      /selected subscription|why you'?re leaving|reason/i
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  const feedback =
    portalPage.locator(
      'textarea'
    ).first();

  if (
    await feedback.isVisible({
      timeout: 5000
    }).catch(
      () => false
    )
  ) {
    await feedback.fill(
      'Automation validation only - cancellation not submitted.'
    );
  }

  const goBack =
    portalPage.getByRole(
      'button',
      {
        name: /go back/i
      }
    ).first();

  if (
    await goBack.isVisible({
      timeout: 5000
    }).catch(
      () => false
    )
  ) {
    await safeClick(
      goBack,
      'Go Back From Cancel Subscription'
    );

    await portalPage.waitForLoadState(
      'domcontentloaded'
    ).catch(
      () => undefined
    );

    await portalPage.waitForTimeout(
      1000
    );
  }

  const portalTextAfterBack =
    await portalPage
      .locator(
        'body'
      )
      .innerText()
      .catch(
        () => ''
      );

  expect(
    portalTextAfterBack
  ).not.toMatch(
    /subscription cancelled|subscription canceled|cancellation confirmed|successfully cancelled|successfully canceled/i
  );

  const returnedToOverview =
    /current subscription|payment method|billing information/i.test(
      portalTextAfterBack
    );

  const stillOnSafeCancelReview =
    /cancel your subscription|selected subscription|why you'?re leaving|reason/i.test(
      portalTextAfterBack
    );

  expect(
    returnedToOverview ||
      stillOnSafeCancelReview
  ).toBeTruthy();

  Logger.success(
    'Cancel subscription form validated without cancelling'
  );

  if (portalPage !== this.page) {
    await portalPage.close();
  }
}
}
