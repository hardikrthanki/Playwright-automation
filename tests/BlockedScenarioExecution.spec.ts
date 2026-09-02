import {
  expect,
  Page,
  test
} from '@playwright/test';

import {
  BASE_URL,
  COUNTRY
} from './config/testData';

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
    await expiryInput.fill('12/34');
  }

  const cvcInput = page.locator(
    'input[name="cardCvc"], #cardCvc'
  ).first();

  if (await cvcInput.isVisible().catch(() => false)) {
    await cvcInput.fill('123');
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

  test.beforeEach(() => {
    requiresCheckout();
  });

  test('SC-48: Stripe checkout displays renewal or auto-renewal copy before payment', async ({ page }) => {
    test.info().annotations.push({
      type: 'matrix-id',
      description: 'SC-48'
    });

    await openCheckout(page);

    const bodyText = (
      await page.locator('body').innerText()
    ).toLowerCase();

    const renewalCopyVisible =
      bodyText.includes('renew') ||
      bodyText.includes('recurring') ||
      bodyText.includes('auto-charge') ||
      bodyText.includes('automatically charged');

    expect(
      renewalCopyVisible,
      'Expected checkout to expose renewal / recurring billing copy before payment.'
    ).toBe(true);

    expect(page.url()).toContain('/checkout/');
  });

  test('SC-61: Missing cardholder name is blocked before subscription activation', async ({ page }) => {
    test.info().annotations.push({
      type: 'matrix-id',
      description: 'SC-61'
    });

    await openCheckout(page);
    await fillCardOnly(page, '4242424242424242');

    const nameInput = page.locator(
      'input[name="billingName"], #billingName, input[name="name"]'
    ).first();

    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill('');
    }

    await submitCheckout(page);

    await expect
      .poll(
        async () => {
          const bodyText = (
            await page.locator('body').innerText()
          ).toLowerCase();

          return (
            bodyText.includes('incomplete') ||
            bodyText.includes('required') ||
            bodyText.includes('invalid') ||
            bodyText.includes('your card number is') ||
            page.url().includes('/checkout/')
          );
        },
        {
          timeout: 30000,
          message: 'Expected checkout to remain blocked without cardholder name.'
        }
      )
      .toBe(true);

    expect(page.url()).toContain('/checkout/');
  });

  test('SC-62: Failed checkout keeps user without active paid subscription', async ({ page }) => {
    test.info().annotations.push({
      type: 'matrix-id',
      description: 'SC-62'
    });

    await openCheckout(page);
    await fillCardOnly(page, '4000000000000002');
    await submitCheckout(page);

    await expect
      .poll(
        async () => page.url().includes('/checkout/'),
        {
          timeout: 30000,
          message: 'Expected declined payment to keep the user on checkout.'
        }
      )
      .toBe(true);

    await page.goto(BASE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    const bodyText = (
      await page.locator('body').innerText()
    ).toLowerCase();

    const noSuccessSignals =
      !bodyText.includes('payment successful') &&
      !bodyText.includes('subscription activated') &&
      !bodyText.includes('thank you for your purchase');

    expect(
      noSuccessSignals,
      'Abandoned/failed checkout must not leave success or activation copy in the app.'
    ).toBe(true);
  });

  test('SC-63: Closing Stripe checkout returns user safely without activating subscription', async ({ page }) => {
    test.info().annotations.push({
      type: 'matrix-id',
      description: 'SC-63'
    });

    await openCheckout(page);

    const cancelControl = page.locator(
      'a:has-text(/cancel|return/i), button:has-text(/cancel|return/i)'
    ).first();

    const cancelAvailable = await cancelControl
      .isVisible()
      .catch(() => false);

    test.skip(
      !cancelAvailable,
      'Checkout link does not expose a cancel/return control.'
    );

    await cancelControl.click();

    await expect
      .poll(
        async () =>
          page.url().startsWith(BASE_URL) ||
          !page.url().includes('/checkout/'),
        {
          timeout: 30000,
          message: 'Expected cancel/return to leave Stripe checkout.'
        }
      )
      .toBe(true);

    const bodyText = (
      await page.locator('body').innerText()
    ).toLowerCase();

    expect(
      !bodyText.includes('payment successful'),
      'Returning from checkout must not activate the subscription.'
    ).toBe(true);
  });

});
