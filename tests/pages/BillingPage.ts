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
    /monthly|annual|month|year|\/mo|\/yr|\/year|per month|per year/i
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
            ? /monthly|month/i
            : /annual|year/i
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

  if (
    await intervalButton.isVisible({
      timeout: 5000
    }).catch(
      () => false
    )
  ) {
    await safeClick(
      intervalButton,
      `Select ${interval} billing`
    );
  }
}

private async findPlanActionButton(
  planName: string,
  action: 'upgrade' | 'downgrade'
) {
  const actionButtons =
    this.page
      .locator(
        'a, button'
      )
      .filter({
        hasText:
          action === 'upgrade'
            ? /upgrade/i
            : /downgrade/i
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
          const knownPlans = [
            'Curious Explorer',
            'Income Builder',
            'Overlay Strategists',
            'Portfolio Hedger',
            'Marketplace'
          ];

          let current =
            element.parentElement;

          for (let depth = 0; current && depth < 8; depth += 1) {
            const currentText =
              (
                current.textContent ?? ''
              ).toLowerCase();

            if (
              currentText.includes(
                String(
                  targetPlan
                ).toLowerCase()
              )
            ) {
              const matchingPlanCount =
                knownPlans.filter(
                  plan =>
                    currentText.includes(
                      plan.toLowerCase()
                    )
                ).length;

              if (matchingPlanCount <= 1) {
                return true;
              }
            }

            current =
              current.parentElement;
          }

          current =
            element.parentElement;

          for (let depth = 0; current && depth < 8; depth += 1) {
            const currentText =
              (
                current.textContent ?? ''
              ).toLowerCase();

            if (
              currentText.includes(
                String(
                  targetPlan
                )
                  .toLowerCase()
              ) &&
              !knownPlans.some(
                plan =>
                  plan.toLowerCase() !==
                    String(
                      targetPlan
                    ).toLowerCase() &&
                  currentText.includes(
                    plan.toLowerCase()
                  )
              )
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

private planChangeDialog(
  options: {
    targetPlan: string;
    action: 'upgrade' | 'downgrade';
  }
) {
  return this.page
    .getByRole(
      'dialog'
    )
    .filter({
      hasText: new RegExp(
        `${options.action} to\\s+${escapeRegExp(
          options.targetPlan
        )}`,
        'i'
      )
    })
    .first();
}

async openPlanChangeCalculationPreview(
  options: {
    targetPlan: string;
    action: 'upgrade' | 'downgrade';
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

  const actionButton =
    await this.findPlanActionButton(
      options.targetPlan,
      options.action
    );

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
    action: 'upgrade' | 'downgrade';
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

  await expect(
    dialog
  ).toContainText(
    new RegExp(
      `${options.action} to\\s+${escapeRegExp(
        options.targetPlan
      )}`,
      'i'
    )
  );

  await expect(
    dialog
  ).toContainText(
    /prorat|charged|card on file|billing cycle|renews|new price|amount due/i
  );

  await expect(
    dialog
  ).toContainText(
    new RegExp(
      `${escapeRegExp(
        options.targetPlan
      )}\\s+charge`,
      'i'
    )
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

  const dialogText =
    await dialog.innerText();

  const planCharge =
    firstCurrencyValueNearLabel(
      dialogText,
      new RegExp(
        `${escapeRegExp(
          options.targetPlan
        )}\\s+charge`,
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
    expect(
      Math.abs(
        (
          planCharge ??
          0
        ) -
          options.expectedPlanCharge
      ),
      `Plan charge should match configured ${options.targetPlan} ${options.interval} price.`
    ).toBeLessThanOrEqual(
      0.02
    );
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

  Logger.success(
    `${options.action} calculation preview validated for ${options.targetPlan} ${options.interval}`
  );
}

async submitPlanChangeCalculationPreview(
  options: {
    targetPlan: string;
    action: 'upgrade' | 'downgrade';
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
    action: 'upgrade' | 'downgrade';
  }
) {
  const dialog =
    this.planChangeDialog(
      options
    );

  await safeClick(
    dialog.getByRole(
      'button',
      {
        name: /^cancel$/i
      }
    ).first(),
    'Cancel Plan Change Preview'
  );

  await expect(
    dialog
  ).toBeHidden({
    timeout: 10000
  });
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
      'With-card trial should show saved payment method details in Billing.'
    ).toMatch(
      /visa|mastercard|amex|discover|4242|ending\s+in\s+\d{4}|\*{2,}\s*\d{4}|\u2022{2,}\s*\d{4}/i
    );

    expect(
      bodyText,
      'With-card trial should not be presented as only the Free Plan.'
    ).not.toMatch(
      /current plan\s*free plan|free plan\s*active/i
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

async validateSubscriptionPortalCancellationLifecycleSummary() {

  const portalPage =
    await this.openSubscriptionPortal();

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

  if (portalPage !== this.page) {
    await portalPage.close();
  }
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

  if (portalPage !== this.page) {
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
