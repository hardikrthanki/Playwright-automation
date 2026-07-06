import {
  Page,
  test
} from '@playwright/test';

import {
  TEST_USERS
} from './config/testData';

import { LoginPage }
  from './pages/LoginPage';

import { ProfilePage }
  from './pages/ProfilePage';

import {
  generateMobileNumber
} from './utils/emailGenerator';

import { Logger }
  from './utils/logger';

/* =============================================================================
TEST SUITE: Profile Mobile Number Validation

PURPOSE
-------
Validates profile mobile-number controls without changing account data by default.

RUN
---
$env:PROFILE_MOBILE_VALIDATION_ENABLED="true"
npx playwright test tests/ProfileMobileValidation.spec.ts --headed

OPTIONAL SMS FLOW
-----------------
$env:PROFILE_MOBILE_CHANGE_ENABLED="true"
$env:PROFILE_MOBILE_COMPLETE_ENABLED="true"

============================================================================= */

const profileMobileValidationEnabled =
  process.env.PROFILE_MOBILE_VALIDATION_ENABLED ===
  'true';

const profileMobileChangeEnabled =
  process.env.PROFILE_MOBILE_CHANGE_ENABLED ===
  'true';

const profileMobileCompleteEnabled =
  process.env.PROFILE_MOBILE_COMPLETE_ENABLED ===
  'true';

const profileMobileUser = {
  email:
    process.env.PROFILE_MOBILE_EMAIL ??
    TEST_USERS.subscriber.email,

  password:
    process.env.PROFILE_MOBILE_PASSWORD ??
    TEST_USERS.subscriber.password
};

async function loginAndOpenProfile(
  page: Page
) {

  const login =
    new LoginPage(page);

  const profile =
    new ProfilePage(page);

  await login.login(
    profileMobileUser.email,
    profileMobileUser.password
  );

  await profile.open();

  return profile;
}

test.describe(
  'Profile Mobile Number Validation',
  () => {

    test.describe.configure({
      timeout: 90000
    });

    test.skip(
      !profileMobileValidationEnabled,
      'Skipped because PROFILE_MOBILE_VALIDATION_ENABLED is not configured.'
    );

    test(
      'Profile mobile number section is visible',
      async ({ page }) => {

        const profile =
          await loginAndOpenProfile(
            page
          );

        await profile.validateMobileSectionLoaded();
      }
    );

    test(
      'Profile mobile change blocks invalid mobile number',
      async ({ page }) => {

        const profile =
          await loginAndOpenProfile(
            page
          );

        await profile.validateInvalidMobileNumberBlocked();
      }
    );

    test(
      'Profile mobile change can request OTP for valid mobile number',
      async ({ page }) => {

        test.skip(
          !profileMobileChangeEnabled,
          'Skipped because PROFILE_MOBILE_CHANGE_ENABLED is not configured.'
        );

        const mobileNumber =
          generateMobileNumber();

        Logger.info(
          `Profile Mobile Candidate: ${mobileNumber}`
        );

        const profile =
          await loginAndOpenProfile(
            page
          );

        if (
          profileMobileCompleteEnabled
        ) {
          await profile.completeMobileNumberChange(
            mobileNumber
          );

          return;
        }

        await profile.requestMobileNumberOtp(
          mobileNumber
        );
      }
    );
  }
);
