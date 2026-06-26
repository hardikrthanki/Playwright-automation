import {
  expect,
  Page,
  test
} from '@playwright/test';

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

test.describe(
  'Payment Negative Scenarios',
  () => {

    test.skip(
      !STRIPE_CHECKOUT_URL,
      'STRIPE_CHECKOUT_URL is required for payment negative validation.'
    );

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
  }
);
