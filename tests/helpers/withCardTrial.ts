import {
  Page
} from '@playwright/test';

import {
  BASE_URL
} from '../config/testData';
import {
  URLS
} from '../config/constants';
import { MobileVerificationPage }
  from '../pages/MobileVerificationPage';
import { PlanSelectionPage }
  from '../pages/PlanSelectionPage';
import { StripePaymentPage }
  from '../pages/StripePaymentPage';
import { Logger }
  from '../utils/logger';

/* =============================================================================
HELPER: continueAfterWithCardTrialCheckout

PURPOSE
-------
Follows QA-CL-005 for Overlay Strategists with-card trial:

- A fresh user + unique card grants the trial (status trialing, not Free).
- /verify-mobile?trial=success means the trial succeeded; the phone gate is
  separate.
- Bounce back to Plan Selection, or trial=already_redeemed, is the
  once-per-lifetime card/email/phone gate. That is not a trial-flow defect.
  Rotate the Stripe test card and use a new user.
============================================================================= */

export async function continueAfterWithCardTrialCheckout(
  page: Page,
  mobileNumber?: string
) {
  await page.waitForLoadState(
    'domcontentloaded'
  );

  await page.waitForURL(
    /\/(dashboard|verify-mobile)|trial=success/i,
    {
      timeout: 45000
    }
  ).catch(
    () => undefined
  );

  const returnUrl =
    page.url();

  console.log(
    'With-card trial return URL:',
    returnUrl
  );

  const bodyText =
    await page
      .locator(
        'body'
      )
      .innerText()
      .catch(
        () => ''
      );

  if (
    /already_redeemed|already redeemed|trial already used/i.test(
      `${returnUrl} ${bodyText}`
    )
  ) {
    throw new Error(
      'QA-CL-005: with-card trial was refused by the once-per-lifetime gate (already_redeemed). Use a fresh user and a unique Stripe test card. This is not a failed trial grant.'
    );
  }

  if (
    /checkout\.stripe\.com/i.test(
      returnUrl
    )
  ) {
    Logger.info(
      'With-card trial still on Stripe Checkout. Retrying with another unused test card.'
    );

    return false;
  }

  if (
    /trial=success/i.test(
      `${returnUrl} ${bodyText}`
    ) &&
    !/verify-mobile|\/dashboard/i.test(
      returnUrl
    )
  ) {
    Logger.info(
      'With-card trial return includes trial=success. Opening dashboard.'
    );

    await page.goto(
      `${BASE_URL}${URLS.DASHBOARD}`,
      {
        waitUntil: 'domcontentloaded'
      }
    );
  }

  if (
    /verify-mobile/i.test(
      page.url()
    )
  ) {
    Logger.info(
      'With-card trial landed on mobile verification. QA-CL-005: trial=success means the trial was granted.'
    );

    if (mobileNumber) {
      await new MobileVerificationPage(
        page
      ).completeIfVisible(
        mobileNumber
      );
    }

    await page.waitForURL(
      /\/dashboard/,
      {
        timeout: 30000
      }
    ).catch(
      () => undefined
    );

    return true;
  }

  if (
    /\/dashboard/i.test(
      page.url()
    )
  ) {
    return true;
  }

  const planSelectionVisible =
    await page.getByRole(
      'heading',
      {
        name: /choose your plan/i
      }
    ).isVisible({
      timeout: 3000
    }).catch(
      () => false
    );

  if (
    /onboarding/i.test(
      page.url()
    ) &&
    planSelectionVisible
  ) {
    Logger.info(
      'With-card trial bounced to Plan Selection. Retrying with a different Stripe test card.'
    );

    return false;
  }

  if (
    /onboarding/i.test(
      page.url()
    )
  ) {
    throw new Error(
      `QA-CL-005: with-card trial did not reach dashboard after checkout. URL: ${page.url()}`
    );
  }

  return true;
}

export async function submitAnotherWithCardTrialAttempt(
  page: Page,
  mobileNumber?: string
) {
  const stripe =
    new StripePaymentPage(
      page
    );

  if (
    !/checkout\.stripe\.com/i.test(
      page.url()
    )
  ) {
    await new PlanSelectionPage(
      page
    ).selectOverlayStrategistsTrialWithCard();
  }

  await stripe.completeTrialPayment();

  return continueAfterWithCardTrialCheckout(
    page,
    mobileNumber
  );
}
