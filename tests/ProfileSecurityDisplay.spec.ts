import {
  test
} from './fixtures/subscriberAuth';

import {
  TEST_USERS
} from './config/testData';

import { LoginPage }
  from './pages/LoginPage';

import { MfaPage }
  from './pages/MfaPage';

/* =============================================================================
TEST SUITE: Profile Security Display

PURPOSE
-------
One authenticated session validates MFA overview, backup codes, trusted
devices, and refresh stability.

RUN
---
npx playwright test tests/ProfileSecurityDisplay.spec.ts --headed
============================================================================= */

const profileSecurityUser = {
  email:
    process.env.PROFILE_SECURITY_EMAIL ??
    TEST_USERS.subscriber.email,

  password:
    process.env.PROFILE_SECURITY_PASSWORD ??
    TEST_USERS.subscriber.password
};

const usesSharedSubscriber =
  profileSecurityUser.email ===
  TEST_USERS.subscriber.email;

test.describe(
  'Profile Security Display',
  () => {

    test.describe.configure({
      timeout: 120000
    });

    test(
      'Profile security MFA backup codes trusted devices and refresh',
      async ({ page }) => {
        if (
          !usesSharedSubscriber
        ) {
          await new LoginPage(
            page
          ).login(
            profileSecurityUser.email,
            profileSecurityUser.password
          );
        }

        const mfa =
          new MfaPage(
            page
          );

        await test.step(
          'MFA overview',
          async () => {
            await mfa.validateSecurityOverviewReadOnly();
          }
        );

        await test.step(
          'Backup-code controls',
          async () => {
            await mfa.validateBackupCodeControlsReadOnly();
          }
        );

        await test.step(
          'Trusted devices',
          async () => {
            await mfa.validateTrustedDevicesReadOnly();
          }
        );

        await test.step(
          'Refresh keeps security page stable',
          async () => {
            await page.reload({
              waitUntil: 'domcontentloaded'
            });

            await mfa.validateSecurityOverviewReadOnly();
            await mfa.validateTrustedDevicesReadOnly();
          }
        );
      }
    );
  }
);
