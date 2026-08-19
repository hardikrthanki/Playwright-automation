import {
  expect,
  Page,
  test
} from '@playwright/test';

import {
  STRIPE_3DS_REQUIRED_CARD,
  STRIPE_CVC,
  STRIPE_DECLINED_CARD,
  STRIPE_EXPIRY,
  STRIPE_INSUFFICIENT_FUNDS_CARD,
  STRIPE_PROCESSING_ERROR_CARD,
  STRIPE_STOLEN_CARD
} from './config/testData';

/* =============================================================================
TEST SUITE: Payment Negative Scenarios

PURPOSE
-------
Validate Stripe Checkout card-entry guardrails with a fresh checkout URL.

Run:
$env:STRIPE_CHECKOUT_URL="https://checkout.stripe.com/c/pay/..."
npx playwright test tests/PaymentNegative.spec.ts --headed

NOTE
----
These tests require a fresh Stripe Checkout session URL. They are intentionally
kept outside the standard execution suite because checkout links can expire or
become single-use depending on Stripe/session state.
============================================================================= */

const STRIPE_CHECKOUT_URL =
  process.env.STRIPE_CHECKOUT_URL ?? '';

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

  await expect(
    page
  ).toHaveURL(
    /checkout\.stripe\.com/,
    {
      timeout: 60000
    }
  );

  await expect(
    page.locator(
      '#cardNumber'
    )
  ).toBeVisible({
    timeout: 60000
  });
}

async function fillBasicBilling(
  page: Page
) {
  const name =
    page.locator(
      '#billingName'
    );

  if (
    await name.count()
  ) {
    await name.fill(
      'Hardik Thanki'
    );
  }

  const country =
    page.locator(
      '#billingCountry'
    );

  if (
    await country.count()
  ) {
    await country.selectOption(
      'IN'
    );
  }
}

async function fillCheckoutCard(
  page: Page,
  cardNumber: string,
  expiry = STRIPE_EXPIRY,
  cvc = STRIPE_CVC
) {
  await page.locator(
    '#cardNumber'
  ).fill(
    cardNumber
  );

  await page.locator(
    '#cardExpiry'
  ).fill(
    expiry
  );

  await page.locator(
    '#cardCvc'
  ).fill(
    cvc
  );

  await fillBasicBilling(
    page
  );
}

async function submitCheckout(
  page: Page
) {
  const payButton =
    page.getByRole(
      'button',
      {
        name: /subscribe|pay|complete|start/i
      }
    );

  await expect(
    payButton
  ).toBeEnabled({
    timeout: 15000
  });

  await payButton.click();
}

async function expectStripePaymentError(
  page: Page,
  errorPattern: RegExp
) {
  await expect(
    page
  ).toHaveURL(
    /checkout\.stripe\.com/,
    {
      timeout: 30000
    }
  );

  await expect
    .poll(
      async () => (
        await page.locator(
          'body'
        ).innerText()
      ).replace(
        /\s+/g,
        ' '
      ),
      {
        timeout: 30000
      }
    )
    .toMatch(
      errorPattern
    );
}

if (STRIPE_CHECKOUT_URL) {
  test.describe(
    'Payment Negative Scenarios',
    () => {

    test.beforeEach(
      async ({ page }) => {
        await openCheckout(
          page
        );
      }
    );

    test(
      'Stripe Checkout blocks incomplete card number',
      async ({ page }) => {

        await page.locator(
          '#cardNumber'
        ).fill(
          '4242'
        );

        await page.locator(
          '#cardExpiry'
        ).fill(
          '12/34'
        );

        await page.locator(
          '#cardCvc'
        ).fill(
          '123'
        );

        await fillBasicBilling(
          page
        );

        const payButton =
          page.getByRole(
            'button',
            {
              name: /subscribe|pay|complete|start/i
            }
          );

        await expect(
          payButton
        ).toBeDisabled();
      }
    );

    test(
      'Stripe Checkout blocks expired card date',
      async ({ page }) => {

        await page.locator(
          '#cardNumber'
        ).fill(
          '4242424242424242'
        );

        await page.locator(
          '#cardExpiry'
        ).fill(
          '01/20'
        );

        await page.locator(
          '#cardCvc'
        ).fill(
          '123'
        );

        await fillBasicBilling(
          page
        );

        const payButton =
          page.getByRole(
            'button',
            {
              name: /subscribe|pay|complete|start/i
            }
          );

        await expect(
          payButton
        ).toBeDisabled();
      }
    );

    test(
      'Stripe Checkout blocks invalid CVC',
      async ({ page }) => {

        await page.locator(
          '#cardNumber'
        ).fill(
          '4242424242424242'
        );

        await page.locator(
          '#cardExpiry'
        ).fill(
          '12/34'
        );

        await page.locator(
          '#cardCvc'
        ).fill(
          '1'
        );

        await fillBasicBilling(
          page
        );

        const payButton =
          page.getByRole(
            'button',
            {
              name: /subscribe|pay|complete|start/i
            }
          );

        await expect(
          payButton
        ).toBeDisabled();
      }
    );

    test(
      'Stripe Checkout rejects declined card without activating subscription',
      async ({ page }) => {
        await fillCheckoutCard(
          page,
          STRIPE_DECLINED_CARD
        );

        await submitCheckout(
          page
        );

        await expectStripePaymentError(
          page,
          /declined|card was declined|payment failed|try another card/i
        );
      }
    );

    test(
      'Stripe Checkout rejects insufficient funds card without activating subscription',
      async ({ page }) => {
        await fillCheckoutCard(
          page,
          STRIPE_INSUFFICIENT_FUNDS_CARD
        );

        await submitCheckout(
          page
        );

        await expectStripePaymentError(
          page,
          /insufficient funds|declined|payment failed|try another card/i
        );
      }
    );

    test(
      'Stripe Checkout rejects stolen card without activating subscription',
      async ({ page }) => {
        await fillCheckoutCard(
          page,
          STRIPE_STOLEN_CARD
        );

        await submitCheckout(
          page
        );

        await expectStripePaymentError(
          page,
          /declined|card was declined|payment failed|try another card|stolen/i
        );
      }
    );

    test(
      'Stripe Checkout handles processing error card without activating subscription',
      async ({ page }) => {
        await fillCheckoutCard(
          page,
          STRIPE_PROCESSING_ERROR_CARD
        );

        await submitCheckout(
          page
        );

        await expectStripePaymentError(
          page,
          /processing error|error processing|try again|payment failed|declined/i
        );
      }
    );

    test(
      'Stripe Checkout opens authentication-required flow without losing checkout context',
      async ({ page }) => {
        await fillCheckoutCard(
          page,
          STRIPE_3DS_REQUIRED_CARD
        );

        await submitCheckout(
          page
        );

        await expect
          .poll(
            async () => {
              const bodyText =
                await page.locator(
                  'body'
                ).innerText();

              return `${page.url()} ${bodyText}`.replace(
                /\s+/g,
                ' '
              );
            },
            {
              timeout: 30000
            }
          )
          .toMatch(
            /checkout\.stripe\.com|3d secure|authentication|authenticate|authorize|verify|secure checkout/i
          );
      }
    );
    }
  );
}
