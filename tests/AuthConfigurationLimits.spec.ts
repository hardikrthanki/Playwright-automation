import {
  expect,
  Page,
  test
} from '@playwright/test';

import {
  AUTH_LOCKOUT_SETTINGS,
  AUTH_RATE_LIMITS,
  BASE_URL,
  TEST_USERS
} from './config/testData';

import { ForgotPasswordPage }
  from './pages/ForgotPasswordPage';

/* =============================================================================
TEST SUITE: Auth Configuration Limits

PURPOSE
-------
Validates configurable authentication controls such as login lockout and
password-reset email request limits.

IMPORTANT
---------
These tests are opt-in because they intentionally exercise lockout/rate-limit
behavior and can temporarily affect the configured account.

Run lockout validation:
$env:AUTH_CONFIGURATION_LIMITS_ENABLED="true"
$env:AUTH_LOCKOUT_LIMIT_VALIDATION_ENABLED="true"
$env:AUTH_LOCKOUT_EMAIL="imhardikthanki+lockout-test@gmail.com"
$env:AUTH_LOCKOUT_PASSWORD="ValidPasswordHere"
npx playwright test tests/AuthConfigurationLimits.spec.ts -g "login lockout" --headed

Run password-reset rate-limit validation:
$env:AUTH_CONFIGURATION_LIMITS_ENABLED="true"
$env:AUTH_PASSWORD_RESET_RATE_LIMIT_VALIDATION_ENABLED="true"
$env:AUTH_RATE_LIMIT_EMAIL="imhardikthanki+rate-limit-test@gmail.com"
npx playwright test tests/AuthConfigurationLimits.spec.ts -g "password reset" --headed
============================================================================= */

const authConfigurationLimitsEnabled =
  process.env.AUTH_CONFIGURATION_LIMITS_ENABLED ===
  'true';

const lockoutLimitValidationEnabled =
  process.env.AUTH_LOCKOUT_LIMIT_VALIDATION_ENABLED ===
  'true';

const passwordResetRateLimitValidationEnabled =
  process.env.AUTH_PASSWORD_RESET_RATE_LIMIT_VALIDATION_ENABLED ===
  'true';

const maxRequestsToExercise =
  Number(
    process.env.AUTH_LIMIT_MAX_REQUESTS_TO_EXERCISE ??
    '10'
  );

const lockoutEmail =
  process.env.AUTH_LOCKOUT_EMAIL;

const lockoutPassword =
  process.env.AUTH_LOCKOUT_PASSWORD;

const wrongPassword =
  process.env.AUTH_LOCKOUT_WRONG_PASSWORD ??
  'WrongPassword@12345';

const rateLimitEmail =
  process.env.AUTH_RATE_LIMIT_EMAIL ??
  lockoutEmail ??
  TEST_USERS.subscriber.email;

function skipWhenLimitIsTooHigh(
  configuredLimit: number,
  scenario: string
) {
  test.skip(
    configuredLimit > maxRequestsToExercise,
    `${scenario} configured limit (${configuredLimit}) is higher than AUTH_LIMIT_MAX_REQUESTS_TO_EXERCISE (${maxRequestsToExercise}).`
  );
}

async function attemptLogin(
  page: Page,
  email: string,
  password: string
) {
  await page.goto(
    `${BASE_URL}/login`,
    {
      waitUntil: 'domcontentloaded'
    }
  );

  await page.locator(
    'input[type="email"]'
  ).first().fill(
    email
  );

  await page.locator(
    'input[type="password"]'
  ).first().fill(
    password
  );

  await page.locator(
    'button[type="submit"]'
  ).first().click();
}

async function isVisible(
  page: Page,
  pattern: RegExp
) {
  return page
    .getByText(
      pattern
    )
    .first()
    .isVisible({
      timeout: 1500
    })
    .catch(
      () => false
    );
}

test.describe(
  'Auth Configuration Limits',
  () => {

    if (
      authConfigurationLimitsEnabled &&
      lockoutLimitValidationEnabled &&
      lockoutEmail &&
      lockoutPassword
    ) {
      test(
        'Configured failed login attempts trigger account lockout',
        async ({ page }) => {

        skipWhenLimitIsTooHigh(
          AUTH_LOCKOUT_SETTINGS.maxFailedLoginAttempts,
          'Login lockout'
        );

        const configuredLockoutEmail =
          lockoutEmail as string;

        for (
          let attempt = 1;
          attempt <= AUTH_LOCKOUT_SETTINGS.maxFailedLoginAttempts;
          attempt++
        ) {
          await attemptLogin(
            page,
            configuredLockoutEmail,
            wrongPassword
          );

          if (
            await isVisible(
              page,
              /temporarily locked|account.*locked|unlock link/i
            )
          ) {
            break;
          }

          await expect(
            page
          ).toHaveURL(
            /\/login/,
            {
              timeout: 5000
            }
          );
        }

        await expect(
          page.getByText(
            /your account is temporarily locked/i
          )
        ).toBeVisible({
          timeout: 10000
        });

        await expect(
          page.getByRole(
            'button',
            {
              name: /email me an unlock link/i
            }
          )
        ).toBeVisible({
          timeout: 10000
        });
        }
      );
    }

    if (
      authConfigurationLimitsEnabled &&
      passwordResetRateLimitValidationEnabled
    ) {
      test(
        'Configured password reset email request limit is enforced',
        async ({ page }) => {

        skipWhenLimitIsTooHigh(
          AUTH_RATE_LIMITS.passwordResetsPerWindow + 1,
          'Password reset rate limit'
        );

        const forgotPassword =
          new ForgotPasswordPage(page);

        let rateLimitObserved =
          false;

        for (
          let request = 1;
          request <= AUTH_RATE_LIMITS.passwordResetsPerWindow + 1;
          request++
        ) {
          await forgotPassword.open();

          await forgotPassword.requestReset(
            rateLimitEmail
          );

          if (
            await isVisible(
              page,
              /too many|rate limit|limit reached|try again later|wait|requests exceeded/i
            )
          ) {
            rateLimitObserved =
              true;
            break;
          }

          await expect(
            page.getByText(
              /check your email/i
            )
          ).toBeVisible({
            timeout: 10000
          });
        }

        expect(
          rateLimitObserved,
          `Expected password reset rate limit after ${AUTH_RATE_LIMITS.passwordResetsPerWindow + 1} requests.`
        ).toBe(
          true
        );
        }
      );
    }

  }
);
