import {
  Page
} from '@playwright/test';

import {
  AUTH_SETTINGS,
  BASE_URL
} from '../config/testData';

import { URLS }
  from '../config/constants';

import {
  isGmailAutomationEnabled,
  waitForGmailVerificationLink
} from './gmailImap';

/* =============================================================================
HELPER: waitForManualEmailVerification

PURPOSE
-------
After registration, wait for the Gmail verification link to succeed.
Never click Resend / Send verification link.

The working manual flow is: verify first, then open /login, then Sign in.
Resume Playwright only after the Gmail link confirms the address.
============================================================================= */

export function isEmailVerificationPage(
  page: Page
) {
  return /verify-email/i.test(
    page.url()
  );
}

export async function openFreshLoginPage(
  page: Page
) {
  await page.goto(
    `${BASE_URL}${URLS.LOGIN}`,
    {
      waitUntil: 'domcontentloaded'
    }
  );
}

export async function waitForManualEmailVerification(
  page: Page,
  email: string
) {
  if (
    !AUTH_SETTINGS.emailVerificationRequired
  ) {
    if (
      isEmailVerificationPage(
        page
      )
    ) {
      await openFreshLoginPage(
        page
      );
    }

    return;
  }

  if (
    isGmailAutomationEnabled()
  ) {
    console.log(
      `Reading verification email from Gmail for ${email}`
    );

    try {
      const verificationLink =
        await waitForGmailVerificationLink(
          email
        );

      console.log(
        'Opened verification link from Gmail inbox'
      );

      await page.goto(
        verificationLink,
        {
          waitUntil: 'domcontentloaded'
        }
      );

      await openFreshLoginPage(
        page
      );

      return;
    } catch (
      error
    ) {
      console.log(
        'Gmail inbox automation failed. Falling back to manual pause.'
      );
      console.log(
        error instanceof Error
          ? error.message
          : String(
            error
          )
      );
    }
  }
  console.log(
    '\nMANUAL EMAIL VERIFICATION REQUIRED'
  );
  console.log(
    `Verify email sent to: ${email}`
  );
  console.log(
    'Open Gmail and click the verification link until it succeeds.'
  );
  console.log(
    'Do NOT click Send verification link or Resend in this browser.'
  );
  console.log(
    'After Gmail shows success, resume Playwright. Login will open /login next.'
  );

  await page.pause();

  await openFreshLoginPage(
    page
  );
}
