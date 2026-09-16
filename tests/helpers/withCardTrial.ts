import {
  Page
} from '@playwright/test';

import { MobileVerificationPage }
  from '../pages/MobileVerificationPage';
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
    /\/(dashboard|verify-mobile)/i,
    {
      timeout: 20000
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
      'QA-CL-005: with-card trial was refused by the once-per-lifetime gate (already_redeemed). Use a fresh user and a unique Stripe test card (4242, 5555...4444, or 4000 0566 5566 5556). This is not a failed trial grant.'
    );
  }

  if (
    /verify-mobile/i.test(
      returnUrl
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

    return;
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
    planSelectionVisible &&
    /onboarding/i.test(
      page.url()
    )
  ) {
    throw new Error(
      'QA-CL-005: with-card trial bounced to Plan Selection. That is the silent already_redeemed card-reuse gate, not a Free-plan trial bug. Use a unique Stripe test card per fresh user.'
    );
  }
}
