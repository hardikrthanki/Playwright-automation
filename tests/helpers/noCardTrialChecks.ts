import {
  Page
} from '@playwright/test';

import {
  generateEmail,
  generateMobileNumber
} from '../utils/emailGenerator';

import {
  isGmailAutomationEnabled,
  waitForGmailSubscriptionNotice
} from './gmailImap';

import { BillingPage }
  from '../pages/BillingPage';

import { RegistrationPage }
  from '../pages/RegistrationPage';

/* =============================================================================
HELPER: No-card trial follow-up

PURPOSE
-------
After a no-card Overlay Strategists trial starts, confirm the limits printed
on the plan card, the billing history record, the subscription email, and
that the same email or mobile cannot open another account.
============================================================================= */

export async function validateNoCardTrialFollowThrough(
  page: Page,
  email: string,
  mobileNumber: string
) {
  const billing =
    new BillingPage(
      page
    );

  await billing.validateOverlayStrategistsDisplayedLimits();
  await billing.validateTrialListedInHistory();

  if (
    isGmailAutomationEnabled()
  ) {
    await waitForGmailSubscriptionNotice(
      email
    );
  } else {
    console.log(
      'Gmail is not configured. Subscription confirmation email was not checked.'
    );
  }

  const browser =
    page.context().browser();

  if (!browser) {
    throw new Error(
      'A fresh browser is required to retry signup with the same email and mobile number.'
    );
  }

  const context =
    await browser.newContext();
  const fresh =
    await context.newPage();

  try {
    await new RegistrationPage(
      fresh
    ).expectDuplicateEmailBlocked(
      email,
      generateMobileNumber()
    );

    await new RegistrationPage(
      fresh
    ).expectDuplicateMobileBlocked(
      generateEmail(
        'same-mobile'
      ),
      mobileNumber
    );
  } finally {
    await context.close();
  }
}
