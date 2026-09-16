import {
  Page
} from '@playwright/test';

import {
  AUTH_SETTINGS,
  BASE_URL
} from '../config/testData';

import { URLS }
  from '../config/constants';

import '../config/loadLocalEnv';

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

Uses Gmail IMAP when GMAIL_APP_PASSWORD is set in .env or the terminal.
Falls back to a headed pause only when automatic verification cannot finish.
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

  console.log(
    `Email verification for ${email}. Gmail IMAP: ${
      isGmailAutomationEnabled()
        ? 'enabled'
        : 'disabled'
    }`
  );

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
      const message =
        error instanceof Error
          ? error.message
          : String(
            error
          );

      console.log(
        'Gmail inbox automation failed.'
      );
      console.log(
        message
      );

      if (process.env.CI) {
        throw new Error(
          `Automatic Gmail verification failed for ${email}. ${message}`
        );
      }

      console.log(
        'Falling back to manual pause.'
      );
    }
  } else {
    console.log(
      'GMAIL_APP_PASSWORD is not set, so automatic Gmail verification is skipped.'
    );
    console.log(
      'Copy .env.example to .env and paste the Gmail App Password, or set $env:GMAIL_APP_PASSWORD in this VS Code terminal.'
    );

    if (process.env.CI) {
      throw new Error(
        `Automatic Gmail verification is not configured for ${email}. Set GMAIL_APP_PASSWORD in .env.`
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
