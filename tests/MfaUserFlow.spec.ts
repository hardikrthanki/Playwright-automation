import {
  expect,
  Page,
  test
} from '@playwright/test';

import {
  BASE_URL,
  MFA_SETTINGS,
  TEST_USERS
} from './config/testData';

import { DashboardPage }
  from './pages/DashboardPage';

import { LoginPage }
  from './pages/LoginPage';

import { MfaPage }
  from './pages/MfaPage';

import { generateTotp }
  from './utils/totp';

import { Logger }
  from './utils/logger';

/* =============================================================================
TEST SUITE: User-side MFA Flows

PURPOSE
-------
Validate user-side MFA behavior for local users, authenticator OTP, backup
codes, trusted devices, retry behavior, and known Google OAuth MFA gaps.

OUT OF SCOPE
------------
Admin Global Security Settings are intentionally not automated here.

RUN
---
PowerShell:
$env:MFA_USER_FLOW_ENABLED="true"
$env:MFA_LOCAL_EMAIL="user@example.com"
$env:MFA_LOCAL_PASSWORD="password"
$env:MFA_LOCAL_TOTP_SECRET="BASE32SECRET"
npx playwright test tests/MfaUserFlow.spec.ts --headed

============================================================================= */

const localMfaUser =
  TEST_USERS.mfaLocal;

const googleMfaUser =
  TEST_USERS.mfaGoogle;

function hasLocalMfaUser() {
  return Boolean(
    MFA_SETTINGS.userFlowEnabled &&
    localMfaUser.email &&
    localMfaUser.password
  );
}

function hasLocalMfaSecret() {
  return Boolean(
    hasLocalMfaUser() &&
    localMfaUser.secret
  );
}

function hasLocalBackupCode() {
  return Boolean(
    hasLocalMfaUser() &&
    localMfaUser.backupCode
  );
}

function hasReuseBackupCode() {
  return Boolean(
    hasLocalMfaUser() &&
    localMfaUser.reuseBackupCode
  );
}

async function submitLoginCredentials(
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

async function loginWithMfa(
  page: Page,
  options: {
    rememberDevice?: boolean;
    otpOffsetSteps?: number;
  } = {}
) {

  if (
    !localMfaUser.email ||
    !localMfaUser.password ||
    !localMfaUser.secret
  ) {
    throw new Error(
      'MFA local email, password, and secret are required.'
    );
  }

  await submitLoginCredentials(
    page,
    localMfaUser.email,
    localMfaUser.password
  );

  const mfa =
    new MfaPage(page);

  await mfa.completeChallenge(
    generateTotp(
      localMfaUser.secret,
      {
        offsetSteps:
          options.otpOffsetSteps
      }
    ),
    {
      rememberDevice:
        options.rememberDevice
    }
  );

  await expect(
    page
  ).toHaveURL(
    /\/dashboard/,
    {
      timeout: 30000
    }
  );
}

test.describe(
  'User-side MFA - Local User',
  () => {

    test.beforeEach(() => {
      test.skip(
        !hasLocalMfaUser(),
        'Set MFA_USER_FLOW_ENABLED=true, MFA_LOCAL_EMAIL, and MFA_LOCAL_PASSWORD to run user-side MFA tests.'
      );
    });

    test(
      'Local user enables MFA successfully',
      async ({ page }) => {
        test.setTimeout(
          120000
        );

        const login =
          new LoginPage(page);

        await login.login(
          localMfaUser.email!,
          localMfaUser.password!
        );

        const mfa =
          new MfaPage(page);

        await mfa.openSecuritySettings();
        await mfa.startEnableMfa();

        const secret =
          await mfa.readVisibleSecret();

        test.skip(
          !secret,
          'MFA setup secret is not visible in the UI for automation.'
        );

        await mfa.completeChallenge(
          generateTotp(secret!)
        );

        await mfa.expectMfaEnabled();

        const backupCodes =
          await mfa.collectBackupCodes();

        Logger.info(
          `Backup codes observed: ${backupCodes.length}`
        );
      }
    );

    test(
      'Enable MFA with invalid OTP is rejected',
      async ({ page }) => {
        test.setTimeout(
          120000
        );

        const login =
          new LoginPage(page);

        await login.login(
          localMfaUser.email!,
          localMfaUser.password!
        );

        const mfa =
          new MfaPage(page);

        await mfa.openSecuritySettings();
        await mfa.startEnableMfa();
        await mfa.completeChallenge(
          '000000'
        );
        await mfa.expectMfaError();
      }
    );

    test.describe(
      'MFA challenge login',
      () => {

        test.beforeEach(() => {
          test.skip(
            !hasLocalMfaSecret(),
            'Skipped because MFA_LOCAL_TOTP_SECRET is not configured.'
          );
        });

        test(
          'Login with MFA enabled user using valid OTP',
          async ({ page }) => {
            test.setTimeout(
              120000
            );

            await loginWithMfa(
              page
            );

            const dashboard =
              new DashboardPage(page);

            await dashboard.validate();
          }
        );

        test(
          'Login with invalid OTP is blocked',
          async ({ page }) => {
            test.setTimeout(
              120000
            );

            await submitLoginCredentials(
              page,
              localMfaUser.email!,
              localMfaUser.password!
            );

            const mfa =
              new MfaPage(page);

            await mfa.completeChallenge(
              '000000'
            );
            await mfa.expectMfaError();

            await expect(
              page
            ).not.toHaveURL(
              /\/dashboard/
            );
          }
        );

        test(
          'OTP retry behavior is observed without hardcoded attempt count',
          async ({ page }) => {
            test.setTimeout(
              120000
            );

            await submitLoginCredentials(
              page,
              localMfaUser.email!,
              localMfaUser.password!
            );

            const mfa =
              new MfaPage(page);

            let observedAttempts =
              0;

            for (let attempt = 1; attempt <= MFA_SETTINGS.maxFailedAttempts + 2; attempt++) {
              observedAttempts =
                attempt;

              await mfa.completeChallenge(
                '000000'
              );

              const pageText =
                await page.locator('body').innerText();

              if (
                /too many|rate limit|locked|cooldown|try again later|expired/i.test(pageText)
              ) {
                Logger.warning(
                  `MFA retry limit behavior observed after ${observedAttempts} attempts.`
                );

                break;
              }
            }

            await mfa.expectMfaError();
          }
        );

        test(
          'Expired OTP is rejected',
          async ({ page }) => {
            test.setTimeout(
              120000
            );

            await submitLoginCredentials(
              page,
              localMfaUser.email!,
              localMfaUser.password!
            );

            const mfa =
              new MfaPage(page);

            await mfa.completeChallenge(
              generateTotp(
                localMfaUser.secret!,
                {
                  offsetSteps: -2
                }
              )
            );

            await mfa.expectMfaError();
          }
        );

        test(
          'Future OTP is rejected',
          async ({ page }) => {
            test.setTimeout(
              120000
            );

            await submitLoginCredentials(
              page,
              localMfaUser.email!,
              localMfaUser.password!
            );

            const mfa =
              new MfaPage(page);

            await mfa.completeChallenge(
              generateTotp(
                localMfaUser.secret!,
                {
                  offsetSteps: 2
                }
              )
            );

            await mfa.expectMfaError();
          }
        );
      }
    );

    test.describe(
      'Backup codes',
      () => {

        test.beforeEach(() => {
          test.skip(
            !hasLocalBackupCode(),
            'Set MFA_LOCAL_BACKUP_CODE for backup-code tests.'
          );
        });

        test(
          'Login using valid backup code',
          async ({ page }) => {
            test.setTimeout(
              120000
            );

            await submitLoginCredentials(
              page,
              localMfaUser.email!,
              localMfaUser.password!
            );

            const mfa =
              new MfaPage(page);

            await mfa.completeBackupCode(
              localMfaUser.backupCode!
            );

            await mfa.waitForSuccessfulChallenge();
          }
        );

        test(
          'Invalid backup code is rejected',
          async ({ page }) => {
            test.setTimeout(
              120000
            );

            await submitLoginCredentials(
              page,
              localMfaUser.email!,
              localMfaUser.password!
            );

            const mfa =
              new MfaPage(page);

            await mfa.completeBackupCode(
              'INVALID-CODE'
            );
            await mfa.expectMfaError();
          }
        );

        test(
          'Reuse same backup code is rejected',
          async ({ page }) => {
            test.skip(
              !MFA_SETTINGS.allowDestructiveUserFlow || !hasReuseBackupCode(),
              'Set MFA_ALLOW_DESTRUCTIVE_USER_FLOW=true and MFA_REUSE_BACKUP_CODE with a fresh single-use code.'
            );

            test.setTimeout(
              180000
            );

            await submitLoginCredentials(
              page,
              localMfaUser.email!,
              localMfaUser.password!
            );

            let mfa =
              new MfaPage(page);

            await mfa.completeBackupCode(
              localMfaUser.reuseBackupCode!
            );

            await mfa.waitForSuccessfulChallenge();

            const login =
              new LoginPage(page);

            await login.logout();

            await submitLoginCredentials(
              page,
              localMfaUser.email!,
              localMfaUser.password!
            );

            mfa =
              new MfaPage(page);

            await mfa.completeBackupCode(
              localMfaUser.reuseBackupCode!
            );

            await mfa.expectMfaError();
          }
        );
      }
    );

    test.describe(
      'Remember this device',
      () => {

        test.beforeEach(() => {
          test.skip(
            !hasLocalMfaSecret(),
            'Skipped because MFA_LOCAL_TOTP_SECRET is not configured.'
          );
        });

        test(
          'Remember this device skips OTP in same browser context',
          async ({ page }) => {
            test.setTimeout(
              180000
            );

            await loginWithMfa(
              page,
              {
                rememberDevice: true
              }
            );

            const login =
              new LoginPage(page);

            await login.logout();

            await submitLoginCredentials(
              page,
              localMfaUser.email!,
              localMfaUser.password!
            );

            await expect(
              page
            ).toHaveURL(
              /\/dashboard/,
              {
                timeout: 30000
              }
            );
          }
        );

        test(
          'Without remember this device OTP is requested again',
          async ({ page }) => {
            test.setTimeout(
              180000
            );

            await loginWithMfa(
              page,
              {
                rememberDevice: false
              }
            );

            const login =
              new LoginPage(page);

            await login.logout();

            await submitLoginCredentials(
              page,
              localMfaUser.email!,
              localMfaUser.password!
            );

            const mfa =
              new MfaPage(page);

            await mfa.assertMfaChallengeVisible();
          }
        );

        test(
          'Remembered device is browser-context specific',
          async ({ page, browser }) => {
            test.setTimeout(
              180000
            );

            await loginWithMfa(
              page,
              {
                rememberDevice: true
              }
            );

            const freshContext =
              await browser.newContext();

            const freshPage =
              await freshContext.newPage();

            await submitLoginCredentials(
              freshPage,
              localMfaUser.email!,
              localMfaUser.password!
            );

            const mfa =
              new MfaPage(freshPage);

            await mfa.assertMfaChallengeVisible();

            await freshContext.close();
          }
        );

        test(
          'Clearing browser storage removes trusted device',
          async ({ page }) => {
            test.setTimeout(
              180000
            );

            await loginWithMfa(
              page,
              {
                rememberDevice: true
              }
            );

            const login =
              new LoginPage(page);

            await login.logout();

            const mfa =
              new MfaPage(page);

            await mfa.clearTrustedDeviceStorage();

            await submitLoginCredentials(
              page,
              localMfaUser.email!,
              localMfaUser.password!
            );

            await mfa.assertMfaChallengeVisible();
          }
        );
      }
    );

    test(
      'Manual headed MFA login fallback',
      async ({ page }) => {
        test.skip(
          !MFA_SETTINGS.manualOtpFlowEnabled,
          'Set MFA_MANUAL_OTP_FLOW_ENABLED=true to pause on the MFA challenge for manual OTP entry.'
        );

        test.setTimeout(
          180000
        );

        await submitLoginCredentials(
          page,
          localMfaUser.email!,
          localMfaUser.password!
        );

        const mfa =
          new MfaPage(page);

        await mfa.assertMfaChallengeVisible();

        Logger.info(
          'Manual fallback: enter OTP manually, optionally select Trust this device, click Verify, then resume Playwright.'
        );

        await page.pause();

        await expect(
          page
        ).toHaveURL(
          /\/dashboard/,
          {
            timeout: 30000
          }
        );

        const dashboard =
          new DashboardPage(page);

        await dashboard.validate();

        if (MFA_SETTINGS.manualExpectTrustedDevice) {
          const login =
            new LoginPage(page);

          await login.logout();

          await submitLoginCredentials(
            page,
            localMfaUser.email!,
            localMfaUser.password!
          );

          await expect(
            page
          ).toHaveURL(
            /\/dashboard/,
            {
              timeout: 30000
            }
          );
        }
      }
    );

    test(
      'Regenerate backup codes for local user',
      async ({ page }) => {
        test.skip(
          !MFA_SETTINGS.allowDestructiveUserFlow || !hasLocalMfaSecret(),
          'Set MFA_ALLOW_DESTRUCTIVE_USER_FLOW=true and MFA_LOCAL_TOTP_SECRET to regenerate backup codes.'
        );

        test.setTimeout(
          180000
        );

        await loginWithMfa(
          page
        );

        const mfa =
          new MfaPage(page);

        await mfa.openSecuritySettings();
        await mfa.regenerateBackupCodes(
          localMfaUser.password,
          generateTotp(
            localMfaUser.secret!
          )
        );

        await expect(
          page.getByText(
            /backup codes|new codes|regenerated|success/i
          ).first()
        ).toBeVisible({
          timeout: 15000
        });
      }
    );

    test(
      'Disable MFA for local user',
      async ({ page }) => {
        test.skip(
          !MFA_SETTINGS.allowDestructiveUserFlow || !hasLocalMfaSecret(),
          'Set MFA_ALLOW_DESTRUCTIVE_USER_FLOW=true and MFA_LOCAL_TOTP_SECRET to disable MFA.'
        );

        test.setTimeout(
          180000
        );

        await loginWithMfa(
          page
        );

        const mfa =
          new MfaPage(page);

        await mfa.openSecuritySettings();
        await mfa.disableMfa(
          localMfaUser.password,
          generateTotp(
            localMfaUser.secret!
          )
        );

        await expect(
          page.getByText(
            /mfa disabled|2fa disabled|two-factor disabled|enable.*mfa|enable.*2fa/i
          ).first()
        ).toBeVisible({
          timeout: 15000
        });
      }
    );
  }
);

test.describe(
  'User-side MFA - Google OAuth',
  () => {

    test.beforeEach(() => {
      test.skip(
        !MFA_SETTINGS.allowGoogleUserFlow || !googleMfaUser.email,
        'Set MFA_ALLOW_GOOGLE_USER_FLOW=true and Google MFA test credentials to run Google MFA scenarios.'
      );
    });

    test.fixme(
      'Google user regenerate backup codes does not require application password',
      async () => {
        // Known defect: Google-authenticated users cannot provide an
        // application password for backup-code regeneration.
      }
    );

    test.fixme(
      'Google user disable MFA does not require application password',
      async () => {
        // Known defect: Google-authenticated users cannot provide an
        // application password for disabling MFA.
      }
    );

    test.fixme(
      'Google user enables and completes MFA challenge',
      async () => {
        // Google OAuth automation needs a dedicated authenticated Google
        // fixture/session to avoid external account prompts and CAPTCHA.
      }
    );
  }
);
