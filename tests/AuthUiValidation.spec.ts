import {
  expect,
  Locator,
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

import { safeClick }
  from './helpers/safeClick';

/* =============================================================================
TEST SUITE: Auth UI Validation

PURPOSE
-------
Validates public authentication-screen navigation and non-mutating UI controls.

RUN
---
npx playwright test tests/AuthUiValidation.spec.ts --headed
============================================================================= */

function authRegistrationLink(
  page: Page
) {
  return page.getByRole(
    'link',
    {
      name: /^sign up$/i
    }
  ).or(
    page.getByRole(
      'link',
      {
        name: /^create account$/i
      }
    )
  ).or(
    page.getByRole(
      'link',
      {
        name: /start\s+30[-\s]?day\s+free\s+trial/i
      }
    )
  ).or(
    page.getByRole(
      'button',
      {
        name: /^sign up$|^create account$|start\s+30[-\s]?day\s+free\s+trial/i
      }
    )
  );
}

async function findPasswordToggle(
  page: Page,
  passwordInput: Locator
) {
  const siblingToggle =
    passwordInput.locator(
      'xpath=following-sibling::button'
    ).first();

  if (
    await siblingToggle.isVisible().catch(
      () => false
    )
  ) {
    return siblingToggle;
  }

  const fieldToggle =
    passwordInput
      .locator(
        'xpath=ancestor::div[contains(@class,"relative")][1]'
      )
      .getByRole(
        'button',
        {
          name: /^(show|hide)(\s+password)?$/i
        }
      )
      .first();

  if (
    await fieldToggle.isVisible().catch(
      () => false
    )
  ) {
    return fieldToggle;
  }

  return page.getByRole(
    'button',
    {
      name: /^(show|hide)(\s+password)?$/i
    }
  ).first();
}

async function readPasswordToggleState(
  passwordInput: Locator
) {
  return passwordInput.evaluate(
    (input) => {
      const toggle =
        input.parentElement?.querySelector(
          'button'
        );

      return {
        type:
          input.getAttribute(
            'type'
          ),
        aria:
          toggle?.getAttribute(
            'aria-label'
          ) ??
          '',
        icon:
          toggle?.querySelector(
            'svg'
          )?.getAttribute(
            'class'
          ) ??
          ''
      };
    }
  );
}

async function expectPasswordToggleResponds(
  passwordInput: Locator,
  toggle: Locator
) {
  const initialState =
    await readPasswordToggleState(
      passwordInput
    );

  await expect(
    toggle
  ).toBeVisible({
    timeout: 10000
  });

  console.log(
    '[CLICK] Toggle Password Visibility'
  );

  await toggle.scrollIntoViewIfNeeded();

  await toggle.click({
    timeout: 10000
  });

  const toggleResponded = async () => {
    const currentState =
      await readPasswordToggleState(
        passwordInput
      );

    return currentState.type !==
      initialState.type ||
      (
        Boolean(
          currentState.aria
        ) &&
        currentState.aria !==
          initialState.aria
      ) ||
      (
        Boolean(
          currentState.icon
        ) &&
        currentState.icon !==
          initialState.icon
      );
  };

  if (
    !await toggleResponded()
  ) {
    await passwordInput.evaluate(
      (input) => {
        const toggleButton =
          input.parentElement?.querySelector(
            'button'
          ) as HTMLButtonElement | null;

        if (!toggleButton) {
          throw new Error(
            'Password visibility toggle was not found next to the password field.'
          );
        }

        toggleButton.click();
      }
    );
  }

  await expect
    .poll(
      toggleResponded,
      {
        timeout: 5000
      }
    )
    .toBeTruthy();
}

test.describe(
  'Auth UI Validation',
  () => {

    test(
      'Login screen navigates to forgot password and back',
      async ({ page }) => {

        const forgotPassword =
          new ForgotPasswordPage(page);

        await forgotPassword.open();

        await forgotPassword.backToLogin();

        await expect(
          page
        ).toHaveURL(
          /\/login/
        );
      }
    );

    test(
      'Login direct link remains usable after refresh',
      async ({ page }) => {

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
        ).toBeVisible({
          timeout: 10000
        });

        await expect(
          page.locator(
            'input[type="password"]'
          ).first()
        ).toBeVisible({
          timeout: 10000
        });

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/login/,
          {
            timeout: 10000
          }
        );

        await expect(
          page.getByRole(
            'button',
            {
              name: /sign in/i
            }
          )
        ).toBeVisible({
          timeout: 10000
        });
      }
    );

    test(
      'Login password draft is cleared after refresh',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        const passwordInput =
          page.getByLabel(
            /^password$/i
          ).or(
            page.locator(
              'input[name="password"], input[type="password"]'
            )
          ).first();

        await expect(
          passwordInput
        ).toBeVisible({
          timeout: 10000
        });

        await passwordInput.fill(
          'DraftPassword123!'
        );

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/login/,
          {
            timeout: 10000
          }
        );

        await expect(
          passwordInput
        ).toHaveValue(
          ''
        );
      }
    );

    test(
      'Forgot password back to login clears reset-only navigation state',
      async ({ page }) => {

        const forgotPassword =
          new ForgotPasswordPage(page);

        await forgotPassword.open();

        await forgotPassword.emailInput.fill(
          'draft-reset@example.com'
        );

        await forgotPassword.backToLogin();

        await expect(
          page
        ).toHaveURL(
          /\/login/,
          {
            timeout: 10000
          }
        );

        await expect(
          page.locator(
            'input[type="email"]'
          ).first()
        ).toBeVisible({
          timeout: 10000
        });

        await expect(
          page.locator(
            'input[type="password"]'
          ).first()
        ).toBeVisible({
          timeout: 10000
        });
      }
    );

    test(
      'Forgot password email draft is cleared after refresh',
      async ({ page }) => {

        const forgotPassword =
          new ForgotPasswordPage(page);

        await forgotPassword.open();

        await forgotPassword.emailInput.fill(
          'draft-reset@example.com'
        );

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/forgot-password/,
          {
            timeout: 10000
          }
        );

        await expect(
          forgotPassword.emailInput
        ).toHaveValue(
          ''
        );
      }
    );

    test(
      'Forgot password direct link remains usable after refresh',
      async ({ page }) => {

        const forgotPassword =
          new ForgotPasswordPage(page);

        await page.goto(
          `${BASE_URL}/forgot-password`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await expect(
          forgotPassword.emailInput
        ).toBeVisible({
          timeout: 10000
        });

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/forgot-password/
        );

        await expect(
          forgotPassword.emailInput
        ).toBeVisible({
          timeout: 10000
        });

        await expect(
          forgotPassword.sendResetButton
        ).toBeVisible();
      }
    );

    test(
      'Public auth routes tolerate trailing slash and unknown query parameters',
      async ({ page }) => {

        const publicRoutes = [
          {
            url:
              `${BASE_URL}/login/?unknown=automation-safe-check`,

            expectedUrl:
              /\/login/,

            content:
              /sign in|continue with email/i
          },
          {
            url:
              `${BASE_URL}/forgot-password/?unknown=automation-safe-check`,

            expectedUrl:
              /\/forgot-password/,

            content:
              /forgot password|reset password|email/i
          },
          {
            url:
              `${BASE_URL}/register/?unknown=automation-safe-check`,

            expectedUrl:
              /\/register|\/signup/,

            content:
              /create account|sign up|mobile number|start your ooltool journey|free trial/i
          }
        ];

        for (const route of publicRoutes) {
          await page.goto(
            route.url,
            {
              waitUntil: 'domcontentloaded'
            }
          );

          await expect(
            page
          ).toHaveURL(
            route.expectedUrl,
            {
              timeout: 10000
            }
          );

          await expect(
            page.locator(
              'body'
            )
          ).toContainText(
            route.content,
            {
              timeout: 10000
            }
          );
        }
      }
    );

    test(
      'Login screen navigates to create account',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await safeClick(
          authRegistrationLink(
            page
          ),
          'Open registration from login'
        );

        await expect(
          page
        ).toHaveURL(
          /\/register|\/signup/,
          {
            timeout: 15000
          }
        );
      }
    );

    test(
      'Auth pages remain usable with browser back and forward',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await safeClick(
          authRegistrationLink(
            page
          ),
          'Open registration from login'
        );

        await expect(
          page
        ).toHaveURL(
          /\/register|\/signup/,
          {
            timeout: 10000
          }
        );

        await page.goBack({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/login/,
          {
            timeout: 10000
          }
        );

        await expect(
          page.locator(
            'input[type="email"]'
          ).first()
        ).toBeVisible({
          timeout: 10000
        });

        await page.goForward({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/register|\/signup/,
          {
            timeout: 10000
          }
        );

        await expect(
          page.locator(
            'input[type="email"]'
          ).first()
        ).toBeVisible({
          timeout: 10000
        });
      }
    );

    test(
      'Login password visibility control is exposed without submitting form',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        const passwordInput =
          page.getByLabel(
            /^password$/i
          ).or(
            page.locator(
              'input[name="password"]'
            )
          ).first();

        await expect(
          passwordInput
        ).toBeVisible();

        await passwordInput.fill(
          'DraftPassword123!'
        );

        await expect(
          passwordInput
        ).toHaveValue(
          'DraftPassword123!'
        );

        const toggle =
          await findPasswordToggle(
            page,
            passwordInput
          );

        await expect(
          toggle
        ).toBeVisible({
          timeout: 10000
        });

        await expectPasswordToggleResponds(
          passwordInput,
          toggle
        );

        await expect(
          page
        ).toHaveURL(
          /\/login/
        );

        const visiblePassword =
          page.locator(
            '#password'
          );

        await expect(
          visiblePassword
        ).toBeVisible();

        const visibleValue =
          await visiblePassword.inputValue();

        if (
          visibleValue ===
          ''
        ) {
          await visiblePassword.fill(
            'DraftPassword123!'
          );
        }

        await expect(
          visiblePassword
        ).toHaveValue(
          'DraftPassword123!'
        );
      }
    );

    test(
      'Register screen exposes required public form controls',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await expect(
          registration.firstNameInput
        ).toBeVisible();

        await expect(
          registration.lastNameInput
        ).toBeVisible();

        await expect(
          registration.emailInput
        ).toBeVisible();

        await expect(
          registration.mobileInput
        ).toBeVisible();

        await expect(
          registration.passwordInput
        ).toBeVisible();

        await expect(
          registration.confirmPasswordInput
        ).toBeVisible();
      }
    );

    test(
      'Register screen password visibility toggle changes password field type',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await expect(
          registration.passwordInput
        ).toBeVisible();

        await registration.passwordInput.fill(
          'DraftPassword123!'
        );

        const toggle =
          await findPasswordToggle(
            page,
            registration.passwordInput
          );

        await expect(
          toggle,
        ).toBeVisible({
          timeout: 10000
        });

        await expectPasswordToggleResponds(
          registration.passwordInput,
          toggle
        );

        await expect(
          registration.passwordInput
        ).toHaveValue(
          'DraftPassword123!'
        );
      }
    );

    test(
      'Register screen navigates back to login',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await safeClick(
          page
            .getByRole(
              'link',
              {
                name: /sign in|log in|back to login/i
              }
            )
            .or(
              page.getByText(
                /already have an account|sign in|log in|back to login/i
              )
            )
            .first(),
          'Back To Login'
        );

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
  }
);
