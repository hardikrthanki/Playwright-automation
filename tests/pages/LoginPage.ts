import {
  Page,
  Locator,
  expect
} from '@playwright/test';

import { safeClick }
  from '../helpers/safeClick';

import { BasePage }
  from './BasePage';

import { Logger }
  from '../utils/logger';

import {
  URLS,
  WAITS
} from '../config/constants';

import {
  BASE_URL,
  AUTH_SETTINGS
} from '../config/testData';

/* =============================================================================
PAGE OBJECT: LoginPage

PURPOSE
-------
Handles login, logout, and locked-account recovery actions.

FEATURES COVERED
----------------
1. User Login
2. Locked Account Detection
3. Unlock Link Request
4. Logout

============================================================================= */

export class LoginPage
  extends BasePage {

  readonly emailInput: Locator;

  readonly passwordInput: Locator;

  readonly submitButton: Locator;

  readonly accountLockedMessage: Locator;

  readonly emailUnlockLinkButton: Locator;

  constructor(page: Page) {

    super(page);

    this.emailInput =
      page.getByLabel(
        /^email$/i
      ).or(
        page.locator(
          'input[type="email"]'
        ).first()
      );

    this.passwordInput =
      page.getByLabel(
        /^password$/i
      ).or(
        page.locator(
          'input[type="password"]'
        ).first()
      );

    this.submitButton =
      page.locator(
        'button[type="submit"]'
      ).first();

    this.accountLockedMessage =
      page.getByText(
        /your account is temporarily locked/i
      );

    this.emailUnlockLinkButton =
      page.getByRole(
        'button',
        {
          name: /email me an unlock link/i
        }
      );
  }

  private async waitForLoginFormReady() {

    await this.emailInput.waitFor({
      state: 'visible',
      timeout: 15000
    });

    await this.passwordInput.waitFor({
      state: 'visible',
      timeout: 15000
    });

    await expect(
      this.emailInput
    ).toBeEditable({
      timeout: 15000
    });

    await expect(
      this.passwordInput
    ).toBeEditable({
      timeout: 15000
    });

    await expect(
      this.submitButton
    ).toBeVisible({
      timeout: 15000
    });

    await this.page.waitForLoadState(
      'networkidle',
      {
        timeout: 5000
      }
    ).catch(
      () => undefined
    );
  }

  private async fillLoginCredentials(
    email: string,
    password: string
  ) {

    await this.emailInput.fill('');

    await this.emailInput.fill(
      email
    );

    await expect(
      this.emailInput
    ).toHaveValue(
      email,
      {
        timeout: 5000
      }
    );

    await this.passwordInput.fill('');

    await this.passwordInput.fill(
      password
    );

    await expect(
      this.passwordInput
    ).toHaveValue(
      password,
      {
        timeout: 5000
      }
    );

    await expect(
      this.submitButton
    ).toBeEnabled({
      timeout: 15000
    });
  }

  private async completePostLoginMobileVerificationIfVisible() {

    const heading =
      this.page.getByRole(
        'heading',
        {
          name: /verify your mobile number/i
        }
      );

    if (
      !await heading.isVisible({
        timeout: 3000
      }).catch(
        () => false
      )
    ) {
      return false;
    }

    Logger.info(
      'Completing post-login mobile verification'
    );

    const otpInput =
      this.page
        .locator(
          'input[inputmode="numeric"], input[name="otp"], input[placeholder="123456"]'
        )
        .first();

    if (
      !await otpInput.isVisible({
        timeout: 3000
      }).catch(
        () => false
      )
    ) {
      const mobileInput =
        this.page
          .locator(
            'input[type="tel"], input[inputmode="tel"]'
          )
          .first();

      if (
        await mobileInput.isVisible()
          .catch(
            () => false
          ) &&
        await mobileInput.isEditable()
          .catch(
            () => false
          )
      ) {
        await mobileInput.fill(
          process.env.SUBSCRIBER_MOBILE ??
            '2015550123'
        );
      }

      const sendCodeButton =
        this.page.getByRole(
          'button',
          {
            name: /send code via sms/i
          }
        ).first();

      if (
        await sendCodeButton.isVisible()
          .catch(
            () => false
          )
      ) {
        await safeClick(
          sendCodeButton,
          'Send Post-login Mobile OTP'
        );
      }
    }

    await expect(
      otpInput
    ).toBeVisible({
      timeout: 15000
    });

    await otpInput.fill(
      AUTH_SETTINGS.otpCode
    );

    await safeClick(
      this.page.getByRole(
        'button',
        {
          name: /^verify$/i
        }
      ).first(),
      'Verify Post-login Mobile OTP'
    );

    await this.page.waitForURL(
      /\/(dashboard|onboarding)/,
      {
        timeout: 30000
      }
    );

    Logger.success(
      'Post-login mobile verification completed'
    );

    return true;
  }

  private async waitForLoginRedirect() {

    await this.page.waitForURL(
      /\/(dashboard|onboarding|verify-mobile|mobile-verification)/,
      {
        timeout: 30000
      }
    );

    await this.completePostLoginMobileVerificationIfVisible();
  }

  async handleLockedAccount(
    email: string
  ) {

    if (
      await this.accountLockedMessage.isVisible()
    ) {
      Logger.warning(
        `Account is temporarily locked: ${email}`
      );

      if (
        await this.emailUnlockLinkButton.isVisible()
      ) {
        await safeClick(
          this.emailUnlockLinkButton,
          'Email Unlock Link'
        );
      }

      throw new Error(
        `Account is temporarily locked. Check ${email} for the unlock link, unlock the account, then rerun the test.`
      );
    }
  }

  async requestUnlockLink(
    email: string,
    password: string
  ) {

    Logger.info(
      'Requesting account unlock link'
    );

    await this.page.goto(
      `${BASE_URL}/login`,
      {
        waitUntil: 'domcontentloaded'
      }
    );

    await this.emailInput.fill(
      email
    );

    await this.passwordInput.fill(
      password
    );

    await safeClick(
      this.submitButton,
      'Submit Login'
    );

    await expect(
      this.accountLockedMessage
    ).toBeVisible({
      timeout: 10000
    });

    await safeClick(
      this.emailUnlockLinkButton,
      'Email Unlock Link'
    );

    Logger.success(
      'Unlock Link Requested'
    );
  }

  async login(
    email: string,
    password: string
  ) {

    Logger.info(
      'Logging in'
    );

    if (
      !this.page.url().includes(
        URLS.LOGIN
      )
    ) {
      await this.page.goto(
        `${BASE_URL}/login`,
        {
          waitUntil: 'domcontentloaded'
        }
      );
    }

    if (
      /\/(dashboard|onboarding)/.test(
        this.page.url()
      )
    ) {
      Logger.success(
        'User already authenticated'
      );

      console.log(
        'Current URL:',
        this.page.url()
      );

      return;
    }

    if (
      await this.completePostLoginMobileVerificationIfVisible()
    ) {
      Logger.success(
        'Logged in successfully'
      );

      console.log(
        'Current URL:',
        this.page.url()
      );

      return;
    }

    await this.waitForLoginFormReady();

    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(
        `Login Attempt ${attempt}`
      );

      await this.fillLoginCredentials(
        email,
        password
      );

      await safeClick(
        this.submitButton,
        'Submit Login'
      );

      await this.handleLockedAccount(
        email
      );

      try {
        await this.waitForLoginRedirect();

        Logger.success(
          'Logged in successfully'
        );

        console.log(
          'Current URL:',
          this.page.url()
        );

        return;
      } catch {
        console.log(
          'Current URL:',
          this.page.url()
        );

        if (attempt === 3) {
          throw new Error(
            'Login failed after 3 attempts'
          );
        }

        await this.page.waitForTimeout(
          2000
        );

        await this.page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        if (
          await this.completePostLoginMobileVerificationIfVisible()
        ) {
          Logger.success(
            'Logged in successfully'
          );

          console.log(
            'Current URL:',
            this.page.url()
          );

          return;
        }

        await this.waitForLoginFormReady();
      }
    }
  }

  async logout() {

    console.log(
      'Logging Out'
    );

    await safeClick(
      this.page.getByText(
        'HT',
        {
          exact: true
        }
      ),
      'Open Profile Menu'
    );

    await this.page.waitForTimeout(
      WAITS.NORMAL
    );

    await safeClick(
      this.page.getByText(
        /sign out/i
      ),
      'Click Sign Out'
    );

    await expect(
      this.page
    ).toHaveURL(
      /login/,
      {
        timeout: 30000
      }
    );

    await expect(
      this.page.locator(
        'input[type="email"]'
      )
    ).toBeVisible();

    Logger.success(
      'Logout Validation Completed'
    );
  }
}
