import {
  test
} from '@playwright/test';

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
Validates user profile security/MFA display without enabling, disabling,
regenerating backup codes, or revoking trusted devices.

RUN
---
$env:PROFILE_SECURITY_DISPLAY_ENABLED="true"
npx playwright test tests/ProfileSecurityDisplay.spec.ts --headed
============================================================================= */

const profileSecurityDisplayEnabled =
  process.env.PROFILE_SECURITY_DISPLAY_ENABLED ===
  'true';

const profileSecurityUser = {
  email:
    process.env.PROFILE_SECURITY_EMAIL ??
    TEST_USERS.subscriber.email,

  password:
    process.env.PROFILE_SECURITY_PASSWORD ??
    TEST_USERS.subscriber.password
};

test.describe(
  'Profile Security Display',
  () => {

    test.describe.configure({
      timeout: 120000
    });

    test.skip(
      !profileSecurityDisplayEnabled,
      'Skipped because PROFILE_SECURITY_DISPLAY_ENABLED is not configured.'
    );

    test.beforeEach(
      async ({ page }) => {
        const login =
          new LoginPage(page);

        await login.login(
          profileSecurityUser.email,
          profileSecurityUser.password
        );
      }
    );

    test(
      'Profile security page shows MFA overview state',
      async ({ page }) => {

        const mfa =
          new MfaPage(page);

        await mfa.validateSecurityOverviewReadOnly();
      }
    );

    test(
      'Profile security page shows backup-code controls when MFA is enabled',
      async ({ page }) => {

        const mfa =
          new MfaPage(page);

        await mfa.validateBackupCodeControlsReadOnly();
      }
    );

    test(
      'Profile security page shows trusted devices section',
      async ({ page }) => {

        const mfa =
          new MfaPage(page);

        await mfa.validateTrustedDevicesReadOnly();
      }
    );
  }
);
