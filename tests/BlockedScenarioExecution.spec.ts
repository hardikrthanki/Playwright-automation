import {
  expect,
  Page,
  test
} from '@playwright/test';

import {
  BASE_URL,
  COUNTRY,
  STRIPE_CARD,
  STRIPE_CVC,
  STRIPE_DECLINED_CARD,
  STRIPE_EXPIRY
} from './config/testData';
import {
  runScenarioStep
} from './helpers/subscriptionScenarioPacks';

/* =============================================================================
TEST SUITE: Blocked Scenario Execution

PURPOSE
-------
Converts matrix scenarios that were previously marked 'future'/'blocked' but
are executable with UI-only coverage (no Stripe API, webhook, email inbox,
or time-travel fixture required).

CONVERTED SCENARIOS
-------------------
- SC-48: Stripe checkout displays renewal or auto-renewal copy before payment
- SC-61: Missing cardholder name is blocked before subscription activation
- SC-62: Failed checkout keeps user without active paid subscription (UI part)
- SC-63: Closing Stripe checkout returns user safely without activation

RUN
---
$env:BLOCKED_SCENARIO_EXECUTION_ENABLED="true"
$env:STRIPE_CHECKOUT_URL="<hosted checkout link>"
npx playwright test tests/BlockedScenarioExecution.spec.ts
============================================================================= */

const STRIPE_CHECKOUT_URL =
  process.env.STRIPE_CHECKOUT_URL ?? '';

const EXECUTION_ENABLED = [
  '1',
  'true',
  'yes',
  'on'
].includes(
  (
    process.env.BLOCKED_SCENARIO_EXECUTION_ENABLED ??
    ''
  ).toLowerCase()
);

const requiresCheckout = () => {
  test.skip(
    !EXECUTION_ENABLED || !STRIPE_CHECKOUT_URL,
    'Set BLOCKED_SCENARIO_EXECUTION_ENABLED=true and STRIPE_CHECKOUT_URL to run.'
  );
};

async function openCheckout(
  page: Page
) {
  await page.goto(
    STRIPE_CHECKOUT_URL,
    {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    }
  );

  await page
    .locator('input[name="cardNumber"], #cardNumber')
    .first()
    .waitFor({
      state: 'visible',
      timeout: 60000
    })
    .catch(() => undefined);
}

async function fillCardOnly(
  page: Page,
  cardNumber: string
) {
  const cardInput = page.locator(
    'input[name="cardNumber"], #cardNumber'
  ).first();

  if (await cardInput.isVisible().catch(() => false)) {
    await cardInput.fill(cardNumber);
  }

  const expiryInput = page.locator(
    'input[name="cardExpiry"], #cardExpiry'
  ).first();

  if (await expiryInput.isVisible().catch(() => false)) {
    await expiryInput.fill(STRIPE_EXPIRY);
  }

  const cvcInput = page.locator(
    'input[name="cardCvc"], #cardCvc'
  ).first();

  if (await cvcInput.isVisible().catch(() => false)) {
    await cvcInput.fill(STRIPE_CVC);
  }

  const countrySelect = page.locator(
    'select[name="billingCountry"], #billingCountry, select[name="country"]'
  ).first();

  if (await countrySelect.isVisible().catch(() => false)) {
    await countrySelect.selectOption(COUNTRY);
  }
}

async function submitCheckout(
  page: Page
) {
  const payButton = page.locator(
    'button:has-text(/subscribe|pay|complete|start/i)'
  ).first();

  await payButton.waitFor({
    state: 'visible',
    timeout: 15000
  });

  await payButton.click();
}

test.describe('Blocked Scenario Execution', () => {

  // SC-48 and SC-61 create a real scenario user first (sign-up, email check,
  // plan checkout). That takes minutes, and a sign-up can also wait out the
  // server's "too many OTP requests" pause, so the default 90s limit makes
  // them fail in a full run even though they pass on their own. Other rows in
  // this file share that user's outcome, so a timeout here cascades.
  test.describe.configure({
    timeout: 20 * 60 * 1000
  });

  test.beforeEach(({}, testInfo) => {
    // SC-48 and SC-61 run on a scenario user; the rest still need a link.
    if (/SC-48|SC-61|SC-62|SC-63/.test(testInfo.title)) {
      return;
    }

    requiresCheckout();
  });

  // SC-48 and SC-61 are answered by the PURCHASE_DOUBLE_CLICK_INCOME_MONTHLY
  // scenario user, who is left unpaid on Stripe checkout. They need no env
  // flags or hosted checkout link.
  test('SC-48: Stripe checkout displays renewal or auto-renewal copy before payment', async ({ page }) => {
    test.info().annotations.push({
      type: 'matrix-id',
      description: 'SC-48'
    });

    const outcome = await runScenarioStep(
      'scenario:PURCHASE_DOUBLE_CLICK_INCOME_MONTHLY:renewal-copy-shown',
      page
    );

    if (outcome.status === 'failed') {
      throw outcome.error;
    }

    test.skip(
      outcome.status === 'skipped',
      outcome.status === 'skipped' ? outcome.reason : ''
    );
  });

  test('SC-61: Missing cardholder name is blocked before subscription activation', async ({ page }) => {
    test.info().annotations.push({
      type: 'matrix-id',
      description: 'SC-61'
    });

    const outcome = await runScenarioStep(
      'scenario:PURCHASE_DOUBLE_CLICK_INCOME_MONTHLY:missing-cardholder-name-blocked',
      page
    );

    if (outcome.status === 'failed') {
      throw outcome.error;
    }

    test.skip(
      outcome.status === 'skipped',
      outcome.status === 'skipped' ? outcome.reason : ''
    );
  });

  // SC-62 and SC-63 run on the same unpaid checkout user as SC-48/SC-61.
  for (const [id, title, step] of [
    [
      'SC-62',
      'SC-62: Failed checkout keeps user without active paid subscription',
      'declined-card-keeps-user-unpaid'
    ],
    [
      'SC-63',
      'SC-63: Closing Stripe checkout returns user safely without activating subscription',
      'closing-checkout-returns-safely'
    ]
  ]) {
    test(title, async ({ page }) => {
      test.info().annotations.push({
        type: 'matrix-id',
        description: id
      });

      const outcome = await runScenarioStep(
        `scenario:PURCHASE_DOUBLE_CLICK_INCOME_MONTHLY:${step}`,
        page
      );

      if (outcome.status === 'failed') {
        throw outcome.error;
      }

      test.skip(
        outcome.status === 'skipped',
        outcome.status === 'skipped' ? outcome.reason : ''
      );
    });
  }

});
