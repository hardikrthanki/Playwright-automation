import {
  expect,
  Page,
  test
} from '@playwright/test';

import {
  BASE_URL
} from './config/testData';

import { ForgotPasswordPage }
  from './pages/ForgotPasswordPage';

import { RegistrationPage }
  from './pages/RegistrationPage';

/* =============================================================================
TEST SUITE: Accessibility And Browser Behavior

PURPOSE
-------
Validate basic keyboard, accessibility, and browser refresh behavior for public
authentication screens.

Run:
npx playwright test tests/AccessibilityBrowser.spec.ts
============================================================================= */

test.describe(
  'Accessibility And Browser Behavior',
  () => {

    async function expectNoHorizontalOverflow(
      page: Page
    ) {
      await expect
        .poll(
          async () =>
            await page.evaluate(
              () =>
                document.documentElement.scrollWidth <=
                window.innerWidth + 1
            ),
          {
            timeout: 5000,
            message:
              'Page should not create horizontal overflow'
          }
        )
        .toBe(
          true
        );
    }

    async function collectKeyboardFocusLabels(
      page: Page,
      tabPresses: number
    ) {
      const labels: string[] = [];

      for (let index = 0; index < tabPresses; index++) {
        await page.keyboard.press(
          'Tab'
        );

        labels.push(
          await page.evaluate(
            () => {
              const element =
                document.activeElement;

              if (!element) {
                return '';
              }

              const ariaLabel =
                element.getAttribute(
                  'aria-label'
                ) ?? '';

              const name =
                element.getAttribute(
                  'name'
                ) ?? '';

              const type =
                element.getAttribute(
                  'type'
                ) ?? '';

              const placeholder =
                element.getAttribute(
                  'placeholder'
                ) ?? '';

              const text =
                element.textContent ?? '';

              return [
                element.tagName,
                ariaLabel,
                name,
                type,
                placeholder,
                text
              ].join(
                ' '
              );
            }
          )
        );
      }

      return labels.join(
        ' '
      );
    }

    test(
      'Login form exposes accessible email and password fields',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await expect(
          page.getByLabel(
            /^email$/i
          ).or(
            page.locator(
              'input[type="email"]'
            ).first()
          )
        ).toBeVisible();

        await expect(
          page.getByLabel(
            /^password$/i
          ).or(
            page.locator(
              'input[type="password"]'
            ).first()
          )
        ).toBeVisible();

        await expect(
          page.getByRole(
            'button',
            {
              name: /sign in/i
            }
          )
        ).toBeVisible();
      }
    );

    test(
      'Login page remains usable on mobile viewport',
      async ({ page }) => {

        await page.setViewportSize({
          width: 390,
          height: 844
        });

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await expect(
          page.locator(
            'input[type="email"]'
          ).first()
        ).toBeVisible();

        await expect(
          page.locator(
            'input[type="password"]'
          ).first()
        ).toBeVisible();

        await expect(
          page.getByRole(
            'button',
            {
              name: /sign in/i
            }
          )
        ).toBeVisible();

        await expectNoHorizontalOverflow(
          page
        );
      }
    );

    test(
      'Login form supports Enter key submission without authenticating invalid data',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await page.locator(
          'input[type="email"]'
        ).first().fill(
          'invalid-email'
        );

        await page.locator(
          'input[type="password"]'
        ).first().fill(
          'AnyPassword123'
        );

        await page.keyboard.press(
          'Enter'
        );

        await expect(
          page
        ).toHaveURL(
          /\/login/
        );
      }
    );

    test(
      'Login form keyboard tab order reaches primary controls',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        const focusText =
          await collectKeyboardFocusLabels(
            page,
            12
          );

        expect(
          focusText
        ).toMatch(
          /email/i
        );

        expect(
          focusText
        ).toMatch(
          /password/i
        );

        expect(
          focusText
        ).toMatch(
          /sign in/i
        );
      }
    );

    test(
      'Forgot password form supports Back to login navigation',
      async ({ page }) => {

        const forgotPassword =
          new ForgotPasswordPage(page);

        await forgotPassword.open();
        await forgotPassword.backToLogin();

        await expect(
          page
        ).toHaveURL(
          /\/login/,
          {
            timeout: 10000
          }
        );
      }
    );

    test(
      'Forgot password form exposes accessible email and submit controls',
      async ({ page }) => {

        const forgotPassword =
          new ForgotPasswordPage(page);

        await forgotPassword.open();

        await expect(
          page.getByLabel(
            /^email$/i
          ).or(
            forgotPassword.emailInput.first()
          )
        ).toBeVisible();

        await expect(
          forgotPassword.sendResetButton
        ).toBeVisible();
      }
    );

    test(
      'Forgot password page remains usable on mobile viewport',
      async ({ page }) => {

        await page.setViewportSize({
          width: 390,
          height: 844
        });

        const forgotPassword =
          new ForgotPasswordPage(page);

        await forgotPassword.open();

        await expect(
          forgotPassword.emailInput
        ).toBeVisible();

        await expect(
          forgotPassword.sendResetButton
        ).toBeVisible();

        await expectNoHorizontalOverflow(
          page
        );
      }
    );

    test(
      'Forgot password form keyboard tab order reaches primary controls',
      async ({ page }) => {

        const forgotPassword =
          new ForgotPasswordPage(page);

        await forgotPassword.open();

        await expect(
          forgotPassword.emailInput
        ).toBeVisible();

        const focusText =
          await collectKeyboardFocusLabels(
            page,
            10
          );

        expect(
          focusText
        ).toMatch(
          /email/i
        );

        expect(
          focusText
        ).toMatch(
          /send reset link/i
        );

        expect(
          focusText
        ).toMatch(
          /back to login/i
        );
      }
    );

    test(
      'Register page keeps form visible after browser refresh',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/register/,
          {
            timeout: 10000
          }
        );

        await expect(
          registration.firstNameInput
        ).toBeVisible();

        await expect(
          registration.emailInput
        ).toBeVisible();

        await expect(
          registration.mobileInput
        ).toBeVisible();
      }
    );

    test(
      'Register page exposes accessible primary actions',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await expect(
          page.getByRole(
            'button',
            {
              name: /continue with google/i
            }
          )
        ).toBeVisible();

        await expect(
          registration.sendCodeButton
        ).toBeVisible();

        await expect(
          registration.submitButton
        ).toBeVisible();
      }
    );

    test(
      'Register page remains usable on mobile viewport',
      async ({ page }) => {

        await page.setViewportSize({
          width: 390,
          height: 844
        });

        const registration =
          new RegistrationPage(page);

        await page.goto(
          `${BASE_URL}/register`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await expect(
          registration.firstNameInput
        ).toBeVisible({
          timeout: 15000
        });

        await expect(
          registration.emailInput
        ).toBeVisible();

        await expect(
          registration.mobileInput
        ).toBeVisible();

        await expectNoHorizontalOverflow(
          page
        );
      }
    );

    test(
      'Register form keyboard tab order reaches primary fields',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await page.goto(
          `${BASE_URL}/register`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await expect(
          registration.firstNameInput
        ).toBeVisible({
          timeout: 15000
        });

        const focusText =
          await collectKeyboardFocusLabels(
            page,
            24
          );

        expect(
          focusText
        ).toMatch(
          /firstName|first name/i
        );

        expect(
          focusText
        ).toMatch(
          /lastName|last name/i
        );

        expect(
          focusText
        ).toMatch(
          /email/i
        );

        expect(
          focusText
        ).toMatch(
          /tel|mobile|phone|2015550123/i
        );

        expect(
          focusText
        ).toMatch(
          /password/i
        );
      }
    );
  }
);
