/* =============================================================================
PAGE OBJECT: LoginPage

## PURPOSE

Handles user authentication and session termination.

## FEATURES COVERED

1. User Login
2. Dashboard Redirect Validation
3. User Logout
4. Login Page Validation

## METHODS

login(email)
logout()

## USED BY

Subscriber.spec.ts
onboarding.spec.ts

============================================================================= */

import {
  Page,
  Locator,
  expect
} from '@playwright/test';

import { safeClick } from '../helpers/safeClick';
const BASE_URL =
  'https://puat.ooltool.com';
  
const PASSWORD =
  'H@rdik9944';
export class LoginPage {
    readonly page: Page;
  
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
  
    constructor(page: Page) {
      this.page = page;
  
      this.emailInput = page
        .getByLabel(/^email$/i)
        .or(
          page
            .locator('input[type="email"]')
            .first()
        );
  
      this.passwordInput = page
        .getByLabel(/^password$/i)
        .or(
          page
            .locator('input[type="password"]')
            .first()
        );
  
      this.submitButton = page
        .locator('button[type="submit"]')
        .first();
    }
  
   async login(email: string) {

  console.log('🔐 Logging in');

  await this.page.goto(
    `${BASE_URL}/login`,
    {
      waitUntil: 'domcontentloaded',
    }
  );

  await this.emailInput.fill(email);

  await this.passwordInput.fill(
    PASSWORD
  );

  await safeClick(
    this.submitButton,
    'Submit Login'
  );

  await this.page.waitForTimeout(
    3000
  );
  await expect(this.page)
    .toHaveURL(
      /dashboard/,
      {
        timeout: 30000,
      }
    );

  console.log(
    '✅ User landed on Dashboard'
  );

  console.log(
    '🌐 Current URL:',
    this.page.url()
  );
}

  async logout() {

  console.log(
    '🚪 Logging Out'
  );

await safeClick(
  this.page.getByText(
    'HT',
    { exact: true }
  ),
  'Open Profile Menu'
);
await this.page.waitForTimeout(
  1000
);
const pageText =
  await this.page.locator('body').innerText();
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
