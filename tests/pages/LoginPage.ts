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
  BASE_URL
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

    await this.emailInput.waitFor({
      state: 'visible',
      timeout: 10000
    });

    await this.passwordInput.waitFor({
      state: 'visible',
      timeout: 10000
    });

    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(
        `Login Attempt ${attempt}`
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

      await this.handleLockedAccount(
        email
      );

      try {
        await this.page.waitForURL(
          /\/(dashboard|onboarding)/,
          {
            timeout: 20000
          }
        );

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

        await this.emailInput.waitFor({
          state: 'visible',
          timeout: 10000
        });

        await this.passwordInput.waitFor({
          state: 'visible',
          timeout: 10000
        });
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
