import {
  Page,
  Locator,
  expect
} from '@playwright/test';

import { safeClick }
  from '../helpers/safeClick';
  import { BasePage }
  from './BasePage';

/* =============================================================================
PAGE OBJECT: LoginPage

PURPOSE
-------
Handles user login functionality.

FEATURES COVERED
----------------
1. User Login
2. Login Retry Logic
3. Onboarding Redirect Validation

METHODS
-------
login(email)

USED BY
-------
onboarding.spec.ts

============================================================================= */
import {
  BASE_URL,
  TEST_USERS
} from '../config/testData';

export class LoginPage
  extends BasePage {

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

 constructor(page: Page) {

  super(page);

  this.emailInput = page
      .getByLabel(/^email$/i)
      .or(
        page
          .locator(
            'input[type="email"]'
          )
          .first()
      );

    this.passwordInput = page
      .getByLabel(/^password$/i)
      .or(
        page
          .locator(
            'input[type="password"]'
          )
          .first()
      );

    this.submitButton = page
      .locator(
        'button[type="submit"]'
      )
      .first();
  }

  async login(
  email: string,
  password: string
) {

    console.log(
      '🔐 Logging in'
    );

    if (
      !this.page.url().includes(
        '/login'
      )
    ) {

      await this.page.goto(
        `${BASE_URL}/login`,
        {
          waitUntil:
            'domcontentloaded',
        }
      );
    }

    await this.emailInput.waitFor({
      state: 'visible',
      timeout: 10000,
    });

    await this.passwordInput.waitFor({
      state: 'visible',
      timeout: 10000,
    });

    for (
      let attempt = 1;
      attempt <= 3;
      attempt++
    ) {

      console.log(
        `🔐 Login Attempt ${attempt}`
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

      try {

        await expect(
          this.page
        ).toHaveURL(
          /onboarding/,
          {
            timeout: 20000,
          }
        );

        console.log(
          '✅ Logged in successfully'
        );

        console.log(
          '🌐 Current URL:',
          this.page.url()
        );

        return;

      } catch {

        console.log(
          `⚠️ Login Attempt ${attempt} failed`
        );

        console.log(
          '⚠️ Current URL:',
          this.page.url()
        );

        if (
          this.page.url().includes(
            '/dashboard'
          )
        ) {

          console.log(
            '✅ User already redirected to Dashboard'
          );

          return;
        }

        if (
          attempt === 3
        ) {

          throw new Error(
            '❌ Login failed after 3 attempts'
          );
        }

        console.log(
          '⏳ Waiting 5 seconds before retry...'
        );

        await this.page.waitForTimeout(
          5000
        );

        await this.page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil:
              'domcontentloaded',
          }
        );

        await this.emailInput.waitFor({
          state: 'visible',
          timeout: 10000,
        });

        await this.passwordInput.waitFor({
          state: 'visible',
          timeout: 10000,
        });
      }
    }
  }
  async logout() {

  console.log(
    '🚪 Logging Out'
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
    2000
  );

  await safeClick(
    this.page.getByText(
      /sign out/i
    ),
    'Click Sign Out'
  );

  await expect(this.page)
    .toHaveURL(
      /login/,
      {
        timeout: 30000,
      }
    );

  console.log(
    '✅ Redirected To Login'
  );

  await expect(
    this.page.locator(
      'input[type="email"]'
    )
  ).toBeVisible();

  console.log(
    '✅ Login Page Visible'
  );

  console.log(
    '🎉 Logout Validation Completed'
  );
}
}