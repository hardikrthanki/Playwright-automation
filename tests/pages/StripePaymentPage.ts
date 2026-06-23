import {
  Page,
  expect
} from '@playwright/test';

import { safeClick }
  from '../helpers/safeClick';
  import {
  STRIPE_CARD,
  STRIPE_EXPIRY,
  STRIPE_CVC,
  COUNTRY
} from '../config/testData';
import { BasePage }
  from './BasePage';
  import { Logger }
  from '../utils/logger';

/* =============================================================================
PAGE OBJECT: StripePaymentPage

PURPOSE
-------
Handles Stripe subscription payment process.

FEATURES COVERED
----------------
1. Stripe Checkout Validation
2. Card Details Entry
3. Subscription Purchase
4. Payment Success Validation
5. Dashboard Redirect Validation

METHODS
-------
completePayment()

USED BY
-------
onboarding.spec.ts

============================================================================= */

export class StripePaymentPage
  extends BasePage {

constructor(page: Page) {
  super(page);
  }

  async completePayment() {
Logger.info(
  'Completing Stripe Payment'
);

    await this.page.waitForSelector(
      '#cardNumber',
      { timeout: 60000 }
    );

 Logger.success(
  'Stripe Checkout Loaded'
);

    const emailInput =
      this.page.locator(
        'input[type="email"]'
      );

    if (
      await emailInput.count() > 0
    ) {

      const email =
        await emailInput.inputValue();

      if (!email) {

        console.log(
          'ℹ️ Stripe email already populated'
        );
      }
    }

await this.page.fill(
  '#cardNumber',
  STRIPE_CARD
);

  Logger.success(
  'Card Number Entered'
);
await this.page.fill(
  '#cardExpiry',
  STRIPE_EXPIRY
);


  await this.page.fill(
  '#cardCvc',
  STRIPE_CVC
);
Logger.success(
  'Expiry and CVC Entered'
);
    await this.page.fill(
      '#billingName',
      'Hardik'
    );
Logger.success(
  'Cardholder Name Entered'
);
   await this.page.selectOption(
  '#billingCountry',
   COUNTRY
);

  Logger.success(
  'Country Selected: India'
);

    await this.page.waitForTimeout(
      2000
    );

    const subscribeButton =
      this.page.getByRole(
        'button',
        {
          name: /subscribe/i,
        }
      );

    await expect(
      subscribeButton
    ).toBeEnabled({
      timeout: 30000,
    });

    await safeClick(
      subscribeButton,
      'Subscribe'
    );
Logger.success(
  'Subscribe Clicked'
);

   Logger.info(
  'Waiting for payment processing...'
);

    await this.page.waitForTimeout(
      10000
    );

    await expect(
      this.page
    ).toHaveURL(
      /dashboard/,
      {
        timeout: 120000,
      }
    );

 Logger.success(
  'User redirected to Dashboard after successful payment'
);
Logger.url(
  this.page.url()
);
    try {

      const successToast =
        this.page.getByText(
          /payment successful/i
        );

      await expect(
        successToast
      ).toBeVisible({
        timeout: 10000,
      });

   Logger.success(
  'Success Toast Displayed'
);

    } catch {

      console.log(
        'ℹ️ Success Toast Not Visible'
      );
    }

Logger.celebration(
  'Payment Completed'
);
  }
}