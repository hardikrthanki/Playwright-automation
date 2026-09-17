import {
  Page
} from '@playwright/test';

import {
  TEST_USERS
} from './config/testData';

import { test }
  from './fixtures/subscriberAuth';

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
One authenticated session validates the mobile section. OTP/update remains
opt-in.

RUN
---
npx playwright test tests/ProfileMobileValidation.spec.ts --headed
============================================================================= */

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

const usesSharedSubscriber =
  profileMobileUser.email ===
  TEST_USERS.subscriber.email;

async function openProfile(
  page: Page
) {
  if (
    !usesSharedSubscriber
  ) {
    await new LoginPage(
      page
    ).login(
      profileMobileUser.email,
      profileMobileUser.password
    );
  }

  const profile =
    new ProfilePage(
      page
    );

  await profile.open();

  return profile;
}

test.describe(
  'Profile Mobile Number Validation',
  () => {

    test.describe.configure({
      timeout: 180000
    });

    test(
      'Profile mobile section validation in one session',
      async ({ page }) => {
        const profile =
          await openProfile(
            page
          );

        await test.step(
          'Mobile section is visible',
          async () => {
            await profile.validateMobileSectionLoaded();
          }
        );

        await test.step(
          'Invalid mobile number is blocked',
          async () => {
            await profile.validateInvalidMobileNumberBlocked();
          }
        );

        await test.step(
          'Invalid mobile formats are blocked',
          async () => {
            await profile.validateInvalidMobileNumberCandidatesBlocked();
          }
        );

        await test.step(
          'Mobile section remains visible after refresh',
          async () => {
            await profile.validateMobileSectionLoaded();

            await page.reload({
              waitUntil: 'domcontentloaded'
            });

            await profile.waitForProfileData();
            await profile.validateMobileSectionLoaded();
          }
        );

        if (
          profileMobileChangeEnabled
        ) {
          const mobileNumber =
            generateMobileNumber();

          Logger.info(
            `Profile Mobile Candidate: ${mobileNumber}`
          );

          if (
            profileMobileCompleteEnabled
          ) {
            await profile.completeMobileNumberChange(
              mobileNumber
            );
          } else {
            await profile.requestMobileNumberOtp(
              mobileNumber
            );
          }
        }
      }
    );
  }
);
