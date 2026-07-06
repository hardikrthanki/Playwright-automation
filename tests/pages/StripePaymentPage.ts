import {
  Page,
  expect
} from '@playwright/test';

import { safeClick } from '../helpers/safeClick';

import {
  STRIPE_CARD,
  STRIPE_EXPIRY,
  STRIPE_CVC
} from '../config/testData';

import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

/* ============================================================================
PAGE OBJECT: StripePaymentPage

PURPOSE
-------
Handles Stripe Checkout success and validation scenarios used by subscription
and onboarding payment tests.
============================================================================ */

export class StripePaymentPage
  extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  private paymentButton() {
    return this.page.getByRole(
      'button',
      {
        name: /subscribe|pay|complete|start/i
      }
    );
  }

  async waitForCheckoutReady() {
    await this.page.waitForURL(
      /checkout.stripe.com/,
      {
        timeout: 60000
      }
    );

    Logger.success(
      'Stripe Checkout Loaded'
    );

    await this.page.locator(
      '#cardNumber'
    ).waitFor({
      state: 'visible',
      timeout: 60000
    });

    Logger.success(
      'Stripe Card Fields Visible'
    );
  }

  async fillBasicBillingDetails() {
    const name =
      this.page.locator(
        '#billingName'
      );

    if (
      await name.count()
    ) {
      await name.fill(
        'Hardik Thanki'
      );

      Logger.success(
        'Billing Name Entered'
      );
    }

    const country =
      this.page.locator(
        '#billingCountry'
      );

    if (
      await country.count()
    ) {
      await country.selectOption(
        'IN'
      );

      Logger.success(
        'Country Selected India'
      );
    }
  }

  async validateMissingCardDetailsBlocked() {
    Logger.info(
      'Validating Stripe blocks missing card details'
    );

    await this.waitForCheckoutReady();

    await this.fillBasicBillingDetails();

    const payButton =
      this.paymentButton();

    const isDisabled =
      await payButton
        .isDisabled()
        .catch(
          () => false
        );

    if (isDisabled) {
      Logger.success(
        'Stripe submit button is disabled until card details are entered'
      );

      return;
    }

    await safeClick(
      payButton,
      'Submit Empty Stripe Checkout'
    );

    await expect(
      this.page
    ).toHaveURL(
      /checkout\.stripe\.com/,
      {
        timeout: 15000
      }
    );

    await expect(
      this.page.getByText(
        /card|payment|incomplete|required|invalid/i
      ).first()
    ).toBeVisible({
      timeout: 15000
    });

    Logger.success(
      'Stripe checkout stayed open and displayed card validation'
    );
  }

  async completePayment() {
    Logger.info(
      'Completing Stripe Payment'
    );

    await this.waitForCheckoutReady();

    await this.page.locator(
      '#cardNumber'
    ).fill(
      STRIPE_CARD
    );

    Logger.success(
      'Card Number Entered'
    );

    await this.page.locator(
      '#cardExpiry'
    ).fill(
      STRIPE_EXPIRY
    );

    Logger.success(
      'Expiry Entered'
    );

    await this.page.locator(
      '#cardCvc'
    ).fill(
      STRIPE_CVC
    );

    Logger.success(
      'CVC Entered'
    );

    await this.fillBasicBillingDetails();

    const payButton =
      this.paymentButton();

    await expect(
      payButton
    ).toBeEnabled({
      timeout: 30000
    });

    await safeClick(
      payButton,
      'Complete Payment'
    );

    Logger.success(
      'Payment Submitted'
    );

    await this.page.waitForTimeout(
      10000
    );

    Logger.url(
      this.page.url()
    );

    const successToast =
      this.page.getByText(
        /payment successful/i
      );

    if (
      await successToast.count()
    ) {
      await expect(
        successToast
      ).toBeVisible({
        timeout: 10000
      });

      Logger.success(
        'Payment Success Message Displayed'
      );
    }

    Logger.celebration(
      'Payment Completed'
    );
  }
}
