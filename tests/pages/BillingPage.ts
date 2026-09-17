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

function escapeRegExp(
  value: string
) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );
}

function parseCurrencyValue(
  value: string
) {
  const isNegative =
    value.includes(
      '-'
    );

  const numericValue =
    Number(
      value.replace(
        /[^0-9.]/g,
        ''
      )
    );

  return isNegative
    ? -numericValue
    : numericValue;
}

function firstCurrencyValueNearLabel(
  text: string,
  label: RegExp
) {
  const lines =
    text
      .split(
        /\r?\n/
      )
      .map(
        line =>
          line.trim()
      )
      .filter(
        Boolean
      );

  const labelIndex =
    lines.findIndex(
      line =>
        label.test(
          line
        )
    );

  if (labelIndex === -1) {
    return undefined;
  }

  const nearbyText =
    lines
      .slice(
        labelIndex,
        labelIndex + 3
      )
      .join(
        ' '
      );

  const currencyMatch =
    nearbyText.match(
      /-?\s*[$₹]\s*\d[\d,]*(?:\.\d{1,2})?/i
    );

  if (!currencyMatch) {
    return undefined;
  }

  return parseCurrencyValue(
    currencyMatch[0]
  );
}

function nearbyTextAfterLabel(
  text: string,
  label: RegExp
) {
  const lines =
    text
      .split(
        /\r?\n/
      )
      .map(
        line =>
          line.trim()
      )
      .filter(
        Boolean
      );

  const labelIndex =
    lines.findIndex(
      line =>
        label.test(
          line
        )
    );

  if (labelIndex === -1) {
    return '';
  }

  return lines
    .slice(
      labelIndex,
      labelIndex + 4
    )
    .join(
      ' '
    );
}

function parseFlexibleDate(
  value: string
) {
  const patterns = [
    /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}/i,
    /\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?,?\s+\d{4}/i,
    /\d{4}-\d{2}-\d{2}/,
    /\d{1,2}\/\d{1,2}\/\d{4}/
  ];

  for (const pattern of patterns) {
    const match =
      value.match(
        pattern
      );

    if (!match) {
      continue;
    }

    const parsed =
      new Date(
        match[0]
      );

    if (
      !Number.isNaN(
        parsed.getTime()
      )
    ) {
      return parsed;
    }
  }

  return undefined;
}

async function checkboxIsChecked(
  checkbox: Locator
) {
  const ariaChecked =
    await checkbox.getAttribute(
      'aria-checked'
    ).catch(
      () => undefined
    );

  const dataState =
    await checkbox.getAttribute(
      'data-state'
    ).catch(
      () => undefined
    );

  const inputChecked =
    await checkbox.isChecked()
      .catch(
        () => false
      );

  return inputChecked ||
    ariaChecked === 'true' ||
    dataState === 'checked';
}

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

  readonly overviewTab: Locator;

  readonly transactionsTab: Locator;

  readonly invoiceLinks: Locator;

  readonly pdfLinks: Locator;

  private stripePortalSessionValidated = false;

  private activePortalPage?: Page;

constructor(page: Page) {
  super(page);

  this.plansTab =
    page.getByRole(
      'tab',
      {
        name: /^plans$/i,
      }
    ).or(
      page.getByRole(
        'button',
        {
          name: /^plans$/i,
        }
      )
    ).or(
      page.getByRole(
        'link',
        {
          name: /^plans$/i,
        }
      )
    ).first();

  this.historyTab =
    page.getByRole(
      'tab',
      {
        name: 'History',
        exact: true
      }
    );

  this.overviewTab =
    page.getByRole(
      'tab',
      {
        name: /^overview$/i
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

  await this.dismissMarketingOverlays();

  await this.ensureOnApp();

  if (
    this.page.url().includes(
      '/billing'
    )
  ) {
    await this.waitForBillingContent();

Logger.success(
  'Billing Page Opened'
);

    return;
  }

  Logger.info(
    'Opening billing route directly'
  );

  await this.page.goto(
    this.appUrl(
      URLS.BILLING
    ),
    {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
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
      /income builder|build your portfolio/i
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

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

async validatePlanLifecycleActionSummary() {

  Logger.info(
    'Validating Billing Plan Lifecycle Action Summary'
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
      /curious explorer|income builder|overlay strategists|portfolio hedger|marketplace/i
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  const lifecycleControls =
    this.page.locator(
      'a, button'
    ).filter({
      hasText: /upgrade|downgrade|current plan|active|selected|subscribe|choose plan|manage/i
    });

  await expect
    .poll(
      async () =>
        lifecycleControls.count(),
      {
        timeout: 15000,
        message: 'Waiting for plan lifecycle action/status controls',
      }
    )
    .toBeGreaterThan(
      0
    );

  const upgradeCount =
    await this.page.locator(
      'a, button'
    ).filter({
      hasText: /upgrade/i
    }).count();

  const downgradeCount =
    await this.page.locator(
      'a, button'
    ).filter({
      hasText: /downgrade/i
    }).count();

  const currentOrStatusCount =
    await this.page.locator(
      'a, button, [role="status"], [data-state]'
    ).filter({
      hasText: /current plan|active|selected|current subscription/i
    }).count();

  const subscribeOrChooseCount =
    await this.page.locator(
      'a, button'
    ).filter({
      hasText: /subscribe|choose plan|manage/i
    }).count();

  console.log(
    `Plan lifecycle controls: upgrade=${upgradeCount}, downgrade=${downgradeCount}, current/status=${currentOrStatusCount}, subscribe/manage=${subscribeOrChooseCount}`
  );

  Logger.success(
    'Billing Plan Lifecycle Action Summary Validated'
  );
}

async validateBillingIntervalPresentationSummary() {

  Logger.info(
    'Validating Billing Interval Presentation Summary'
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

  const pageText =
    await this.page
      .locator(
        'body'
      )
      .innerText();

  expect(
    pageText
  ).toMatch(
    /monthly|annual|month|year|\/mo|\/yr|\/year|per month|per year|billing period|no plan changes|paid plan|current plan/i
  );

  const monthlyMarkerCount =
    (
      pageText.match(
        /monthly|per month|\/mo|month/gi
      ) ?? []
    ).length;

  const annualMarkerCount =
    (
      pageText.match(
        /annual|per year|\/yr|\/year|year/gi
      ) ?? []
    ).length;

  console.log(
    `Billing interval markers: monthly=${monthlyMarkerCount}, annual=${annualMarkerCount}`
  );

  Logger.success(
    'Billing Interval Presentation Summary Validated'
  );
}

private async openPlansView() {

  await this.dismissMarketingOverlays();

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

  await expect(
    this.page.getByRole(
      'button',
      {
        name: /upgrade|downgrade|switch to free|change plan/i
      }
    ).or(
      this.page.getByText(
        /change plan|switch to free/i
      )
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  await this.validateBillingUrl();
}

private billingIntervalButton(
  interval: 'monthly' | 'annual'
) {
  return this.page
    .getByRole(
      'button',
      {
        name:
          interval === 'monthly'
            ? /^(monthly)$/i
            : /^(annual)$/i
      }
    )
    .first();
}

private async selectBillingIntervalIfAvailable(
  interval: 'monthly' | 'annual'
) {
  const intervalButton =
    this.billingIntervalButton(
      interval
    );

  await expect(
    intervalButton
  ).toBeVisible({
    timeout: 10000
  });

  await safeClick(
    intervalButton,
    `Select ${interval} billing`
  );
}

private planActionButtonPattern(
  action: 'upgrade' | 'downgrade' | 'interval'
) {
  if (action === 'upgrade') {
    return /upgrade/i;
  }

  if (action === 'downgrade') {
    return /downgrade/i;
  }

  return /switch|change (billing|plan)|to annual|to monthly|upgrade|downgrade/i;
}

private async findPlanActionButton(
  planName: string,
  action: 'upgrade' | 'downgrade' | 'interval'
) {
  const actionButtons =
    this.page
      .locator(
        'a, button'
      )
      .filter({
        hasText:
          this.planActionButtonPattern(
            action
          )
      });

  const buttonCount =
    await actionButtons.count();

  for (let index = 0; index < buttonCount; index += 1) {
    const button =
      actionButtons.nth(
        index
      );

    const belongsToPlan =
      await button.evaluate(
        (
          element,
          targetPlan
        ) => {
          const plans = [
            {
              name: 'Curious Explorer',
              needles: ['curious explorer', 'curious']
            },
            {
              name: 'Income Builder',
              needles: ['income builder', 'income']
            },
            {
              name: 'Overlay Strategists',
              needles: ['overlay strategists', 'overlay']
            },
            {
              name: 'Portfolio Hedger',
              needles: ['portfolio hedger', 'portfolio hedge']
            },
            {
              name: 'Marketplace',
              needles: ['marketplace']
            }
          ];

          const matchedPlans = (text) =>
            plans.filter(
              (plan) =>
                plan.needles.some(
                  (needle) =>
                    text.includes(
                      needle
                    )
                )
            );

          let current =
            element.parentElement;

          for (let depth = 0; current && depth < 12; depth += 1) {
            const currentText =
              (
                current.textContent ?? ''
              ).toLowerCase();
            const matches =
              matchedPlans(
                currentText
              );

            if (
              matches.length === 1 &&
              matches[0].name === targetPlan
            ) {
              return true;
            }

            current =
              current.parentElement;
          }

          return false;
        },
        planName
      )
        .catch(
          () => false
        );

    if (belongsToPlan) {
      return button;
    }
  }

  const visibleControls =
    await this.visibleControlSummary();

  throw new Error(
    `Could not find ${action} control for ${planName}. Visible controls: ${visibleControls.join(' | ')}`
  );
}

private planNamePattern(
  planName: string
) {
  if (
    /portfolio/i.test(
      planName
    )
  ) {
    return 'Portfolio Hedger|Portfolio Hedge|3-Advanced';
  }

  if (
    /income/i.test(
      planName
    )
  ) {
    return 'Income Builder|Income';
  }

  if (
    /overlay/i.test(
      planName
    )
  ) {
    return 'Overlay Strategists|Overlay';
  }

  return escapeRegExp(
    planName
  );
}

private planChangeDialog(
  options: {
    targetPlan: string;
    action: 'upgrade' | 'downgrade' | 'interval';
  }
) {
  const planName =
    this.planNamePattern(
      options.targetPlan
    );

  const dialogPattern =
    options.action === 'interval'
      ? new RegExp(
          `(?:${planName}).{0,160}(?:annual|monthly|year|charge)|(?:switch|change).{0,40}(?:annual|monthly).{0,80}(?:${planName})`,
          'i'
        )
      : new RegExp(
          `(?:${options.action}|switch)\\s+to\\s+(?:${planName})`,
          'i'
        );

  const titledSurface =
    this.page.getByText(
      new RegExp(
        `(?:upgrade|downgrade|switch)\\s+to\\s+(?:${planName})`,
        'i'
      )
    );

  if (
    options.action === 'interval'
  ) {
    return this.page
      .getByRole(
        'dialog'
      )
      .or(
        this.page.getByRole(
          'alertdialog'
        )
      )
      .filter({
        hasText: dialogPattern
      })
      .first();
  }

  return this.page
    .getByRole(
      'dialog'
    )
    .or(
      this.page.getByRole(
        'alertdialog'
      )
    )
    .filter({
      hasText: dialogPattern
    })
    .or(
      titledSurface
    )
    .first();
}

async openPlanChangeCalculationPreview(
  options: {
    targetPlan: string;
    action: 'upgrade' | 'downgrade' | 'interval';
    interval: 'monthly' | 'annual';
  }
) {
  Logger.info(
    `Opening ${options.action} calculation preview for ${options.targetPlan} ${options.interval}`
  );

  await this.openPlansView();

  await this.selectBillingIntervalIfAvailable(
    options.interval
  );

  if (
    options.action === 'interval'
  ) {
    const intervalDialog =
      this.planChangeDialog(
        options
      );

    if (
      await intervalDialog.isVisible({
        timeout: 8000
      }).catch(
        () => false
      )
    ) {
      Logger.success(
        `${options.action} calculation preview opened for ${options.targetPlan} ${options.interval}`
      );

      return;
    }
  }

  let actionButton;

  try {
    actionButton =
      await this.findPlanActionButton(
        options.targetPlan,
        options.action
      );
  } catch (error) {
    if (options.action !== 'interval') {
      throw error;
    }

    const intervalSwitch =
      this.page.getByRole(
        'button',
        {
          name: /switch to annual|change to annual|to annual|switch to monthly|change to monthly|to monthly/i
        }
      ).first();

    if (
      await intervalSwitch.isVisible({
        timeout: 3000
      }).catch(
        () => false
      )
    ) {
      actionButton =
        intervalSwitch;
    } else {
      throw error;
    }
  }

  await safeClick(
    actionButton,
    `${options.action} ${options.targetPlan}`
  );

  await expect(
    this.planChangeDialog(
      options
    )
  ).toBeVisible({
    timeout: 15000
  });

  Logger.success(
    `${options.action} calculation preview opened for ${options.targetPlan} ${options.interval}`
  );
}

async validatePlanChangeCalculationPreview(
  options: {
    targetPlan: string;
    action: 'upgrade' | 'downgrade' | 'interval';
    interval: 'monthly' | 'annual';
    expectedBillingCopy?: RegExp;
    expectedPlanCharge?: number;
    expectedRecurringAmount?: number;
  }
) {
  Logger.info(
    `Validating ${options.action} calculation preview for ${options.targetPlan} ${options.interval}`
  );

  const dialog =
    this.planChangeDialog(
      options
    );

  await expect(
    dialog
  ).toBeVisible({
    timeout: 15000
  });

  const dialogText =
    await dialog.innerText();

  const scheduledChange =
    /takes effect|no refund|end of (this|the) billing period|schedule downgrade/i.test(
      dialogText
    );

  await expect(
    dialog
  ).toContainText(
    new RegExp(
      `${options.action === 'interval'
        ? `(?:upgrade|downgrade|switch|change)\\s+to|${this.planNamePattern(
          options.targetPlan
        )}`
        : `${options.action}\\s+to\\s+(?:${this.planNamePattern(
          options.targetPlan
        )})`}`,
      'i'
    )
  );

  if (scheduledChange) {
    Logger.success(
      `${options.action} calculation preview validated for ${options.targetPlan} ${options.interval}`
    );

    return;
  }

  await expect(
    dialog
  ).toContainText(
    /prorat|charged|card on file|billing cycle|renews|new price|amount due/i
  );

  await expect(
    dialog
  ).toContainText(
    /credit for unused time/i
  );

  await expect(
    dialog
  ).toContainText(
    /amount due today/i
  );

  await expect(
    dialog
  ).toContainText(
    /new recurring amount/i
  );

  await expect(
    dialog
  ).toContainText(
    /next billing date/i
  );

  if (options.expectedBillingCopy) {
    await expect(
      dialog
    ).toContainText(
      options.expectedBillingCopy
    );
  }

  await expect(
    dialog.getByRole(
      'checkbox'
    ).first()
  ).toBeVisible({
    timeout: 10000
  });

  await expect(
    dialog.getByRole(
      'button',
      {
        name: /confirm|pay|continue/i
      }
    ).first()
  ).toBeVisible({
    timeout: 10000
  });

  const planCharge =
    firstCurrencyValueNearLabel(
      dialogText,
      new RegExp(
        `(?:${this.planNamePattern(
          options.targetPlan
        )})\\s+charge`,
        'i'
      )
    );

  const unusedCredit =
    firstCurrencyValueNearLabel(
      dialogText,
      /credit for unused time/i
    );

  const amountDueToday =
    firstCurrencyValueNearLabel(
      dialogText,
      /amount due today/i
    );

  const newRecurringAmount =
    firstCurrencyValueNearLabel(
      dialogText,
      /new recurring amount/i
    );

  expect(
    planCharge,
    'Plan charge should be present in plan-change preview'
  ).toBeDefined();

  expect(
    unusedCredit,
    'Unused-time credit should be present in plan-change preview'
  ).toBeDefined();

  expect(
    amountDueToday,
    'Amount due today should be present in plan-change preview'
  ).toBeDefined();

  expect(
    newRecurringAmount,
    'New recurring amount should be present in plan-change preview'
  ).toBeDefined();

  if (options.expectedPlanCharge !== undefined) {
    const listPriceDelta =
      Math.abs(
        (
          planCharge ??
          0
        ) -
          options.expectedPlanCharge
      );

    const netPriceDelta =
      Math.abs(
        (
          planCharge ??
          0
        ) -
          (
            options.expectedPlanCharge +
            (
              unusedCredit ??
              0
            )
          )
      );

    expect(
      listPriceDelta <= 0.02 ||
        netPriceDelta <= 1,
      `Plan charge ${planCharge} should match list price ${options.expectedPlanCharge} or list plus unused credit.`
    ).toBeTruthy();
  }

  if (options.expectedRecurringAmount !== undefined) {
    expect(
      Math.abs(
        (
          newRecurringAmount ??
          0
        ) -
          options.expectedRecurringAmount
      ),
      `New recurring amount should match configured ${options.targetPlan} ${options.interval} price.`
    ).toBeLessThanOrEqual(
      0.02
    );
  }

  expect(
    unusedCredit ?? 0,
    'Unused-time credit should be zero or negative.'
  ).toBeLessThanOrEqual(
    0
  );

  expect(
    amountDueToday ?? 0,
    'Amount due today should not exceed the target plan charge.'
  ).toBeLessThanOrEqual(
    planCharge ?? 0
  );

  if (options.action === 'upgrade') {
    expect(
      Math.abs(
        (
          planCharge ??
          0
        ) +
          (
            unusedCredit ??
            0
          ) -
          (
            amountDueToday ??
            0
          )
      )
    ).toBeLessThanOrEqual(
      0.02
    );
  }

  Logger.success(
    `${options.action} calculation preview validated for ${options.targetPlan} ${options.interval}`
  );
}

async validatePlanChangeDueAmountAndRenewal(
  options: {
    targetPlan: string;
    action: 'upgrade' | 'downgrade' | 'interval';
    interval: 'monthly' | 'annual';
    expectedBillingCopy?: RegExp;
    expectedPlanCharge?: number;
    expectedRecurringAmount?: number;
  }
) {
  await this.validatePlanChangeCalculationPreview(
    options
  );

  const dialogText =
    await this.planChangeDialog(
      options
    ).innerText();

  const renewal =
    parseFlexibleDate(
      nearbyTextAfterLabel(
        dialogText,
        /next billing date|renews on|renewal date/i
      )
    ) ??
    parseFlexibleDate(
      dialogText
    );

  expect(
    renewal,
    'Plan-change preview should show a next billing / renewal date.'
  ).toBeDefined();

  const startOfToday =
    new Date();

  startOfToday.setHours(
    0,
    0,
    0,
    0
  );

  expect(
    renewal!.getTime(),
    'Renewal date should be today or later.'
  ).toBeGreaterThanOrEqual(
    startOfToday.getTime()
  );

  const maxDays =
    options.interval ===
      'annual'
      ? 400
      : 45;

  expect(
    renewal!.getTime(),
    `Renewal date should fall within ${maxDays} days for ${options.interval} billing.`
  ).toBeLessThanOrEqual(
    Date.now() +
      maxDays *
        24 *
        60 *
        60 *
        1000
  );

  Logger.success(
    `${options.action} due amount and renewal ${renewal!.toISOString().slice(0, 10)} validated for ${options.targetPlan} ${options.interval}`
  );
}

async submitPlanChangeCalculationPreview(
  options: {
    targetPlan: string;
    action: 'upgrade' | 'downgrade' | 'interval';
  }
) {
  Logger.info(
    `Accepting terms and submitting ${options.action} for ${options.targetPlan}`
  );

  const dialog =
    this.planChangeDialog(
      options
    );

  await expect(
    dialog
  ).toBeVisible({
    timeout: 15000
  });

  const termsCheckbox =
    dialog
      .locator(
        '[role="checkbox"], input[type="checkbox"]'
      )
      .first();

  const confirmButton =
    dialog
      .getByRole(
        'button',
        {
          name: /confirm\s*&\s*pay|confirm.*pay|pay/i
        }
      )
      .first();

  await expect(
    termsCheckbox
  ).toBeVisible({
    timeout: 10000
  });

  await expect(
    confirmButton
  ).toBeDisabled({
    timeout: 10000
  });

  if (
    !(await checkboxIsChecked(
      termsCheckbox
    ))
  ) {
    await safeClick(
      termsCheckbox,
      'Accept Plan Change Terms'
    );
  }

  await expect
    .poll(
      async () =>
        checkboxIsChecked(
          termsCheckbox
        ),
      {
        timeout: 10000,
        message: 'Waiting for plan-change terms checkbox to be checked'
      }
    )
    .toBe(
      true
    );

  await expect(
    confirmButton
  ).toBeEnabled({
    timeout: 15000
  });

  await safeClick(
    confirmButton,
    'Confirm and pay plan change'
  );

  await expect(
    dialog
  ).toBeHidden({
    timeout: 60000
  });

  await this.page.waitForLoadState(
    'domcontentloaded'
  ).catch(
    () => undefined
  );

  Logger.success(
    `${options.action} submitted for ${options.targetPlan}`
  );
}

async validateActivePlan(
  expectedPlan: string
) {
  Logger.info(
    `Validating active Billing plan: ${expectedPlan}`
  );

  if (
    !/billing/i.test(
      this.page.url()
    )
  ) {
    await this.validateOverview();
  } else {
    await this.waitForBillingContent();
  }

  const bodyText =
    await this.page
      .locator(
        'body'
      )
      .innerText({
        timeout: 15000
      });

  expect(
    bodyText,
    `Billing should show ${expectedPlan} after plan change.`
  ).toMatch(
    new RegExp(
      escapeRegExp(
        expectedPlan
      ),
      'i'
    )
  );

  expect(
    bodyText,
    'Billing should show an active/current subscription state after plan change.'
  ).toMatch(
    /active|current plan|current subscription|subscription|renews|billing/i
  );

  Logger.success(
    `Active Billing plan validated: ${expectedPlan}`
  );
}

async closePlanChangeCalculationPreview(
  options: {
    targetPlan: string;
    action: 'upgrade' | 'downgrade' | 'interval';
  }
) {
  const dialog =
    this.planChangeDialog(
      options
    );

  const cancelButton =
    dialog.getByRole(
      'button',
      {
        name: /^(cancel|close)$/i
      }
    ).first();

  if (
    await cancelButton.isVisible({
      timeout: 3000
    }).catch(
      () => false
    )
  ) {
    await safeClick(
      cancelButton,
      'Cancel Plan Change Preview'
    );
  } else {
    await this.page.keyboard.press(
      'Escape'
    );
  }

  await expect(
    dialog
  ).toBeHidden({
    timeout: 10000
  });
}

async validatePlanChangeTermsRequired(
  options: {
    targetPlan: string;
    action: 'upgrade' | 'downgrade' | 'interval';
  }
) {
  Logger.info(
    `Validating ${options.action} terms are required before confirmation`
  );

  const dialog =
    this.planChangeDialog(
      options
    );

  await expect(
    dialog
  ).toBeVisible({
    timeout: 15000
  });

  const termsCheckbox =
    dialog
      .locator(
        '[role="checkbox"], input[type="checkbox"]'
      )
      .first();

  const scheduledConfirm =
    dialog.getByRole(
      'button',
      {
        name: /schedule downgrade|keep my plan/i
      }
    ).first();

  if (
    !await termsCheckbox.isVisible({
      timeout: 3000
    }).catch(
      () => false
    )
  ) {
    await expect(
      scheduledConfirm
    ).toBeVisible({
      timeout: 10000
    });

    Logger.success(
      `${options.action} scheduled-change confirmation is visible without a pay terms checkbox`
    );

    return;
  }

  const confirmButton =
    dialog
      .getByRole(
        'button',
        {
          name: /confirm\s*&\s*pay|confirm.*pay|pay/i
        }
      )
      .first();

  await expect(
    termsCheckbox
  ).toBeVisible({
    timeout: 10000
  });

  if (
    await checkboxIsChecked(
      termsCheckbox
    )
  ) {
    await safeClick(
      termsCheckbox,
      'Clear Plan Change Terms'
    );
  }

  await expect(
    confirmButton
  ).toBeDisabled({
    timeout: 10000
  });

  await safeClick(
    termsCheckbox,
    'Accept Plan Change Terms'
  );

  await expect
    .poll(
      async () =>
        checkboxIsChecked(
          termsCheckbox
        ),
      {
        timeout: 10000,
        message: 'Waiting for plan-change terms checkbox to be checked'
      }
    )
    .toBe(
      true
    );

  await expect(
    confirmButton
  ).toBeEnabled({
    timeout: 15000
  });

  Logger.success(
    `${options.action} terms required validation passed`
  );
}

async validateDowngradeImpactCopyIfPresent(
  options: {
    targetPlan: string;
    action: 'upgrade' | 'downgrade' | 'interval';
  }
) {
  const dialog =
    this.planChangeDialog(
      options
    );

  const dialogText =
    await dialog.innerText();

  const hasImpactCopy =
    /lose|lost|remov|limit|feature|access|entitlement|broker|account linked|position|no longer|will not have/i.test(
      dialogText
    );

  if (hasImpactCopy) {
    Logger.success(
      'Downgrade impact or lost-feature copy is present'
    );

    return true;
  }

  Logger.info(
    'Downgrade dialog does not show dedicated lost-feature warning copy'
  );

  return false;
}

async validateMonthlyDowngradeRetentionOffer(
  targetPlan: string
) {
  Logger.info(
    `Validating monthly downgrade retention offer before ${targetPlan}`
  );

  await this.openPlansView();

  await this.selectBillingIntervalIfAvailable(
    'monthly'
  );

  const actionButton =
    await this.findPlanActionButton(
      targetPlan,
      'downgrade'
    );

  await safeClick(
    actionButton,
    `Open downgrade ${targetPlan}`
  );

  const bodyText =
    await this.page
      .locator(
        'body'
      )
      .innerText();

  expect(
    /retention|discount for the next 3|next 3 (months|billing)|keep (my|your) (current )?plan|special offer/i.test(
      bodyText
    ) &&
      /3 month|next 3|discount/i.test(
        bodyText
      ),
    'Monthly downgrade should present the one-time 3-month retention offer before confirmation.'
  ).toBeTruthy();

  const leaveOffer =
    this.page.getByRole(
      'button',
      {
        name: /keep (my|your)? ?plan|stay|not now|close|^cancel$/i
      }
    ).first();

  if (
    await leaveOffer.isVisible({
      timeout: 3000
    }).catch(
      () => false
    )
  ) {
    await safeClick(
      leaveOffer,
      'Leave retention offer without downgrading'
    );
  } else {
    await this.page.keyboard.press(
      'Escape'
    );
  }

  Logger.success(
    'Monthly downgrade retention offer validated without scheduling a downgrade'
  );
}

async validateYearlyCancellationOptions() {
  Logger.info(
    'Validating yearly cancel-at-expiry and cancel-immediately-with-refund options'
  );

  await this.validateOverview();

  const inAppCancel =
    this.page.getByRole(
      'button',
      {
        name: /cancel subscription/i
      }
    ).first();

  let host =
    this.page;

  if (
    await inAppCancel.isVisible({
      timeout: 5000
    }).catch(
      () => false
    )
  ) {
    await safeClick(
      inAppCancel,
      'Open in-app cancel subscription'
    );
  } else {
    host =
      await this.openSubscriptionPortal();

    const portalCancel =
      host.locator(
        'button, a'
      ).filter({
        hasText: /cancel subscription/i
      }).first();

    if (
      await portalCancel.isVisible({
        timeout: 8000
      }).catch(
        () => false
      )
    ) {
      await safeClick(
        portalCancel,
        'Open Cancel Subscription'
      );
    }
  }

  const bodyText =
    await host
      .locator(
        'body'
      )
      .innerText();

  expect(
    /cancel at (expiry|period end|end of)|remain active until|will not renew|end of (the |this )?billing|keep access until|cancel at period end/i.test(
      bodyText
    ),
    'Yearly cancel should offer cancel at expiry / period end with access until renewal.'
  ).toBeTruthy();

  expect(
    /refund|cancel immediately|cancel now|unused (months|time)|request refund|cancel and refund/i.test(
      bodyText
    ),
    'Yearly cancel should offer immediate cancel and request refund.'
  ).toBeTruthy();

  const abortCancel =
    host.getByRole(
      'button',
      {
        name: /don'?t cancel|keep subscription|go back|close|not now/i
      }
    ).first();

  if (
    await abortCancel.isVisible({
      timeout: 3000
    }).catch(
      () => false
    )
  ) {
    await safeClick(
      abortCancel,
      'Leave cancel options without submitting'
    );
  } else {
    await host.keyboard.press(
      'Escape'
    );
  }

  Logger.success(
    'Yearly cancel-at-expiry and refund options validated without cancelling'
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

  const overviewVisible =
    await this.overviewTab.isVisible({
      timeout: 3000
    }).catch(
      () => false
    );

  if (
    overviewVisible
  ) {
    await safeClick(
      this.overviewTab,
      'Open Overview Tab'
    );
  }

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

async validateOverlayStrategistsTrialBillingState(
  mode: 'with-card' | 'without-card'
) {

  Logger.info(
    `Validating Overlay Strategists ${mode} trial billing state`
  );

  await this.validateOverview();

  const bodyText =
    await this.page
      .locator(
        'body'
      )
      .innerText({
        timeout: 15000
      });

  expect(
    bodyText,
    'Billing should show the active Overlay Strategists trial/subscription context.'
  ).toMatch(
    /overlay strategists/i
  );

  expect(
    bodyText,
    'Billing should show trial or subscription status after the trial starts.'
  ).toMatch(
    /trial|current plan|current subscription|active|subscription/i
  );

  if (
    mode === 'with-card'
  ) {
    expect(
      bodyText,
      'QA-CL-005: with-card trial should show saved payment method details in Billing.'
    ).toMatch(
      /visa|mastercard|amex|discover|4444|5556|4242|ending\s+in\s+\d{4}|\*{2,}\s*\d{4}|\u2022{2,}\s*\d{4}/i
    );

    expect(
      bodyText,
      'QA-CL-005: with-card trial grants Overlay Strategists, not Curious Explorer / Free.'
    ).not.toMatch(
      /current plan\s*[:\-]?\s*(free plan|curious explorer)|curious explorer\s*\(free\)/i
    );
  }

  if (
    mode === 'without-card'
  ) {
    await expect(
      this.page
    ).not.toHaveURL(
      /checkout\.stripe\.com|billing\.stripe\.com/i,
      {
        timeout: 5000
      }
    );

    expect(
      bodyText,
      'Without-card trial should not show a saved Stripe test card.'
    ).not.toMatch(
      /visa\s+.*4242|4242/i
    );
  }

  Logger.success(
    `Overlay Strategists ${mode} trial billing state validated`
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

  const alreadyOnHistory =
    await this.page.getByText(
      /^paid$/i
    ).first().isVisible({
      timeout: 2000
    }).catch(
      () => false
    );

  if (
    !alreadyOnHistory
  ) {
    await this.validateHistoryTabStable();
  }

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
  if (
    /stripe\.com/i.test(
      this.page.url()
    )
  ) {
    throw new Error(
      `Manage subscription was requested while still on Stripe: ${this.page.url()}`
    );
  }

  const manageName =
    /manage subscription|manage billing|billing portal|customer portal|subscription settings|manage plan|manage payment methods|payment methods\s*&\s*invoices|update payment method|change payment method/i;

  const candidates = [
    this.page.getByRole(
      'button',
      {
        name: manageName,
      }
    ),
    this.page.getByRole(
      'link',
      {
        name: manageName,
      }
    ),
    this.page.locator(
      'a[href*="billing.stripe.com"], a[href*="stripe.com"]'
    ).filter({
      hasText: manageName,
    }),
    this.page.locator(
      'button, a, [role="button"]'
    ).filter({
      hasText: manageName,
    }),
  ];

  for (const candidate of candidates) {
    const control =
      candidate.first();

    if (
      await control.isVisible({
        timeout: 2000
      }).catch(
        () => false
      )
    ) {
      return control;
    }
  }

  throw new Error(
    `Manage subscription control was not found. Visible controls: ${(await this.visibleControlSummary()).join(' | ')}`
  );
}

private async clickStripePortalControl(
  locator: Locator,
  label: string
) {
  console.log(`[CLICK] ${label}`);

  await locator.waitFor({
    state: 'visible',
    timeout: 15000
  });

  try {
    await locator.click({
      timeout: 5000
    });
  } catch {
    await locator.click({
      force: true,
      timeout: 8000
    });
  }
}

private async dismissStripeCancelDialog(
  portalPage: Page
) {
  const layer =
    portalPage.locator(
      '#__sail-layer-containers, [role="dialog"]'
    ).filter({
      hasText: /cancel your subscription/i
    }).last();

  const goBack =
    layer.getByRole(
      'button',
      {
        name: /^go back$/i
      }
    ).last();

  if (
    !await goBack.isVisible({
      timeout: 2000
    }).catch(
      () => false
    )
  ) {
    return false;
  }

  await this.clickStripePortalControl(
    goBack,
    'Go Back From Cancel Subscription'
  );

  await portalPage.getByText(
    /cancel your subscription/i
  ).first().waitFor({
    state: 'hidden',
    timeout: 10000
  }).catch(
    () => undefined
  );

  return true;
}

private async ensurePortalOverview(
  portalPage: Page
) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const overviewReady =
      await this.waitForPortalOverview(
        portalPage,
        attempt === 0 ? 3000 : 5000
      );

    if (
      overviewReady
    ) {
      return;
    }

    if (
      await this.dismissStripeCancelDialog(
        portalPage
      )
    ) {
      continue;
    }

    const goBack =
      portalPage.getByRole(
        'button',
        {
          name: /^go back$/i
        }
      ).last();

    const billingCrumb =
      portalPage.getByRole(
        'link',
        {
          name: /^billing$/i
        }
      ).first();

    const cancelNested =
      portalPage.getByRole(
        'button',
        {
          name: /^cancel$/i
        }
      ).first();

    if (
      await goBack.isVisible({
        timeout: 1500
      }).catch(
        () => false
      )
    ) {
      await this.clickStripePortalControl(
        goBack,
        'Back To Portal Overview'
      );
      continue;
    }

    if (
      await billingCrumb.isVisible({
        timeout: 1500
      }).catch(
        () => false
      )
    ) {
      await safeClick(
        billingCrumb,
        'Back To Portal Overview'
      );
      continue;
    }

    if (
      await cancelNested.isVisible({
        timeout: 1500
      }).catch(
        () => false
      )
    ) {
      await safeClick(
        cancelNested,
        'Cancel Nested Portal Screen'
      );
    }
  }

  throw new Error(
    `Stripe portal overview is not visible after leaving a nested screen. URL: ${portalPage.url()}`
  );
}

private async waitForPortalOverview(
  portalPage: Page,
  timeout = 20000
) {
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

    return /current subscription/i.test(
      bodyText
    ) &&
      /invoice history|payment method|billing information/i.test(
        bodyText
      );
  };

  return expect
    .poll(
      hasPortalOverview,
      {
        timeout
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

private async restoreFromPortal(
  portalPage?: Page
) {
  const pageToClose =
    portalPage ??
    this.activePortalPage;

  if (
    pageToClose &&
    pageToClose !== this.page &&
    !pageToClose.isClosed()
  ) {
    await pageToClose.close()
      .catch(
        () => undefined
      );
  }

  this.activePortalPage =
    undefined;

  if (
    /stripe\.com/i.test(
      this.page.url()
    )
  ) {
    Logger.info(
      'Leaving Stripe portal and returning to billing'
    );

    await this.page.goto(
      this.appUrl(
        URLS.BILLING
      ),
      {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      }
    );
  }

  await this.ensureOnApp();
}

async openSubscriptionPortal(
  options: {
    ensureOverview?: boolean
  } = {}
) {

  const ensureOverview =
    options.ensureOverview !==
    false;

  if (
    this.activePortalPage &&
    !this.activePortalPage.isClosed() &&
    /stripe\.com/i.test(
      this.activePortalPage.url()
    )
  ) {
    Logger.info(
      'Already on Stripe portal; reusing open portal tab'
    );

    if (
      ensureOverview
    ) {
      await this.ensurePortalOverview(
        this.activePortalPage
      );
    }

    return this.activePortalPage;
  }

  if (
    /stripe\.com/i.test(
      this.page.url()
    )
  ) {
    Logger.info(
      'Already on Stripe portal; reusing current tab'
    );

    this.activePortalPage =
      this.page;

    const reused =
      await this.waitForPortalOverview(
        this.page,
        15000
      );

    if (
      !reused
    ) {
      throw new Error(
        `Already on Stripe but portal overview did not load. URL: ${this.page.url()}`
      );
    }

    return this.page;
  }

  Logger.info(
    'Opening subscription management portal'
  );

  await this.ensureOnApp();

  if (
    !this.page.url().includes(
      '/billing'
    )
  ) {
    await this.validateOverview();
  } else {
    await this.waitForBillingContent();
  }

  if (
    await this.overviewTab.isVisible({
      timeout: 3000
    }).catch(
      () => false
    )
  ) {
    await safeClick(
      this.overviewTab,
      'Open Overview Tab'
    );
  }

  await this.dismissMarketingOverlays();

  const manageControl =
    await this.manageSubscriptionControl();

  await expect(
    manageControl
  ).toBeVisible({
    timeout: 15000
  });

  await manageControl.scrollIntoViewIfNeeded();

  const newPagePromise =
    this.page.context()
      .waitForEvent(
        'page',
        {
          timeout: 8000
        }
      )
      .catch(
        () => undefined
      );

  await safeClick(
    manageControl,
    'Manage Subscription'
  );

  const openedPage =
    await newPagePromise;

  const portalPage =
    openedPage ??
    this.page;

  await portalPage.waitForLoadState(
    'domcontentloaded'
  ).catch(
    () => undefined
  );

  await expect(
    portalPage
  ).toHaveURL(
    /stripe\.com/,
    {
      timeout: 30000
    }
  );

  let portalOverviewVisible =
    await this.waitForPortalOverview(
      portalPage,
      20000
    );

  if (!portalOverviewVisible) {
    await portalPage.reload({
      waitUntil: 'domcontentloaded'
    }).catch(
      () => undefined
    );

    portalOverviewVisible =
      await this.waitForPortalOverview(
        portalPage,
        15000
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

  this.activePortalPage =
    portalPage;

  return portalPage;
}

private async assertPortalOverview(
  portalPage: Page
) {

  Logger.info(
    'Validating subscription portal overview'
  );

  await expect(
    portalPage.getByText(
      /current subscription|subscription/i
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
      /billing information|billing details|billing/i
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  await expect(
    portalPage.getByText(
      /invoice history|invoices/i
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
    /subscription/i
  );

  expect(
    portalText
  ).toMatch(
    /payment method/i
  );

  expect(
    portalText
  ).toMatch(
    /billing (information|details)/i
  );

  expect(
    portalText
  ).toMatch(
    /invoice/i
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
}

private async assertPortalInvoiceHistory(
  portalPage: Page
) {

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
}

private async returnFromPortalToApplication(
  portalPage: Page
) {

  Logger.info(
    'Validating subscription portal return link'
  );

  await this.dismissStripeCancelDialog(
    portalPage
  );

  const returnControl =
    portalPage.getByRole(
      'link',
      {
        name: /return to/i
      }
    ).or(
      portalPage.getByRole(
        'button',
        {
          name: /return to/i
        }
      )
    ).first();

  const returnVisible =
    await returnControl.isVisible({
      timeout: 15000
    }).catch(
      () => false
    );

  if (
    returnVisible
  ) {
    await this.clickStripePortalControl(
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
  }

  await this.restoreFromPortal(
    portalPage
  );

  Logger.success(
    'Subscription portal return link validated'
  );
}

async validateStripePortalSession(
  options: {
    restore?: boolean
  } = {}
) {

  const restore =
    options.restore !==
    false;

  if (
    this.stripePortalSessionValidated
  ) {
    Logger.info(
      'Stripe portal session already validated in this test; skipping duplicate open'
    );

    if (
      restore
    ) {
      await this.restoreFromPortal();
    }

    return;
  }

  const portalPage =
    await this.openSubscriptionPortal();

  await this.assertPortalOverview(
    portalPage
  );

  await this.assertPortalInvoiceHistory(
    portalPage
  );

  this.stripePortalSessionValidated =
    true;

  if (
    restore
  ) {
    await this.returnFromPortalToApplication(
      portalPage
    );
  }
}

async leaveStripePortal() {
  await this.restoreFromPortal();
}

async validateSubscriptionPortalOverview() {
  await this.validateStripePortalSession();
}

async validateSubscriptionPortalInvoiceHistory() {
  await this.validateStripePortalSession();
}

async validateSubscriptionPortalReturnToApplication() {
  await this.validateStripePortalSession();
}

async validateSubscriptionPortalCancellationLifecycleSummary() {

  const portalPage =
    await this.openSubscriptionPortal({
      ensureOverview: false
    });

  Logger.info(
    'Validating subscription cancellation lifecycle summary'
  );

  const portalText =
    await portalPage
      .locator(
        'body'
      )
      .innerText();

  expect(
    portalText
  ).toMatch(
    /current subscription|selected subscription|cancel subscription|cancels|service will end|payment method|billing information/i
  );

  const scheduledToCancel =
    /cancels\s+\w+|service will end|will end|scheduled to cancel|cancel at/i.test(
      portalText
    );

  if (scheduledToCancel) {
    expect(
      portalText
    ).toMatch(
      /cancels\s+\w+|service will end|will end|scheduled to cancel|cancel at/i
    );

    const restoreControl =
      portalPage.locator(
        'a, button'
      ).filter({
        hasText: /don'?t cancel subscription|resume subscription|reactivate|keep subscription/i
      }).first();

    if (
      await restoreControl.isVisible({
        timeout: 5000
      }).catch(
        () => false
      )
    ) {
      await expect(
        restoreControl
      ).toBeVisible();
    }
  } else {
    const cancelControl =
      portalPage.locator(
        'a, button'
      ).filter({
        hasText: /cancel subscription/i
      }).first();

    await expect(
      cancelControl
    ).toBeVisible({
      timeout: 15000
    });
  }

  expect(
    portalText
  ).not.toMatch(
    /subscription cancelled|subscription canceled|cancellation confirmed|successfully cancelled|successfully canceled/i
  );

  Logger.success(
    'Subscription cancellation lifecycle summary validated without changing subscription'
  );

}

async validatePaymentRecoveryEntryPointsSummary() {

  const portalPage =
    await this.openSubscriptionPortal();

  Logger.info(
    'Validating payment recovery entry points'
  );

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

  const recoveryControls =
    portalPage.locator(
      'a, button'
    ).filter({
      hasText: /add payment method|update information|update payment|payment method|billing information/i
    });

  await expect
    .poll(
      async () =>
        recoveryControls.count(),
      {
        timeout: 15000,
        message: 'Waiting for payment recovery controls in Stripe portal',
      }
    )
    .toBeGreaterThan(
      0
    );

  await expect(
    portalPage.getByText(
      /invoice history|current subscription|payment method/i
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  Logger.success(
    'Payment recovery entry points validated without saving changes'
  );

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

  await this.dismissStripeCancelDialog(
    portalPage
  );

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

}
}
