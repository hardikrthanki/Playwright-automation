import {
  expect,
  Page,
  test
} from '@playwright/test';

import {
  BASE_URL,
  TEST_USERS
} from './config/testData';
import { LoginPage }
  from './pages/LoginPage';
import { MobileVerificationPage }
  from './pages/MobileVerificationPage';
import { RiskCompliancePage }
  from './pages/RiskCompliancePage';

/* =============================================================================
TEST SUITE: Risk & Compliance Dashboard Update

PURPOSE
-------
Validates the authenticated post-onboarding Risk & Compliance edit page.

RUN SAFE READ-ONLY CHECKS
-------------------------
$env:RISK_COMPLIANCE_VALIDATION_ENABLED="true"
npx playwright test tests/RiskComplianceUpdate.spec.ts --headed

RUN UPDATE CHECKS
-----------------
$env:RISK_COMPLIANCE_VALIDATION_ENABLED="true"
$env:RISK_COMPLIANCE_UPDATE_ENABLED="true"
npx playwright test tests/RiskComplianceUpdate.spec.ts --headed

NOTES
-----
Saving Risk & Compliance changes can notify account administrators, so update
tests are opt-in and skipped by default.

============================================================================= */

function envEnabled(
  name: string
) {
  return [
    '1',
    'true',
    'yes',
    'on'
  ].includes(
    (
      process.env[name] ??
      ''
    ).toLowerCase()
  );
}

const riskComplianceUser = {
  email:
    process.env.RISK_COMPLIANCE_EMAIL ??
    TEST_USERS.subscriber.email,

  password:
    process.env.RISK_COMPLIANCE_PASSWORD ??
    TEST_USERS.subscriber.password,

  mobile:
    process.env.RISK_COMPLIANCE_MOBILE ??
    TEST_USERS.onboarding.mobile
};

async function loginAndOpenRiskCompliance(
  page: Page
) {
  await new LoginPage(
    page
  ).login(
    riskComplianceUser.email,
    riskComplianceUser.password
  );

  await new MobileVerificationPage(
    page
  ).completeIfVisible(
    riskComplianceUser.mobile
  );

  const riskCompliance =
    new RiskCompliancePage(
      page
    );

  await riskCompliance.open();

  return riskCompliance;
}

async function skipWhenNoAlternateOption(
  action: () => Promise<void>
) {
  try {
    await action();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    if (
      /No alternate .* option was available/i.test(
        message
      )
    ) {
      test.skip(
        true,
        message
      );
    }

    throw error;
  }
}

test.describe(
  'Risk & Compliance Dashboard Update',
  () => {

    test.describe.configure({
      timeout: 5 * 60 * 1000
    });

    test(
      'Saved Risk Profile and Compliance details load',
      async ({ page }) => {
        const riskCompliance =
          await loginAndOpenRiskCompliance(
            page
          );

        await riskCompliance.validateSavedRiskProfileLoaded();
        await riskCompliance.validateSavedComplianceLoaded();
      }
    );

    test(
      'Risk Profile editable controls are available',
      async ({ page }) => {
        const riskCompliance =
          await loginAndOpenRiskCompliance(
            page
          );

        await riskCompliance.validateRiskProfileEditableControls();
      }
    );

    test(
      'Compliance editable controls are available',
      async ({ page }) => {
        const riskCompliance =
          await loginAndOpenRiskCompliance(
            page
          );

        await riskCompliance.validateComplianceEditableControls();
      }
    );

    test(
      'Risk and Compliance tabs remain available after refresh',
      async ({ page }) => {
        const riskCompliance =
          await loginAndOpenRiskCompliance(
            page
          );

        await riskCompliance.validateSavedRiskProfileLoaded();

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await riskCompliance.validateSavedComplianceLoaded();

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await riskCompliance.validateSavedRiskProfileLoaded();
      }
    );

    test(
      'Risk and Compliance route remains usable after browser back and forward',
      async ({ page }) => {
        const riskCompliance =
          await loginAndOpenRiskCompliance(
            page
          );

        await riskCompliance.openRiskProfile();
        await riskCompliance.openCompliance();

        await page.goto(
          `${BASE_URL}/dashboard`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await expect(
          page
        ).toHaveURL(
          /\/dashboard/
        );

        await page.goBack({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/dashboard\/risk-compliance/
        );

        await riskCompliance.openRiskProfile();
        await riskCompliance.openCompliance();

        await page.goForward({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/dashboard/
        );
      }
    );

    if (envEnabled('RISK_COMPLIANCE_UPDATE_ENABLED')) {
      test(
        'Risk Profile can be updated from dashboard',
        async ({ page }) => {

        const riskCompliance =
          await loginAndOpenRiskCompliance(
            page
          );

        await riskCompliance.updateRiskProfile();
        }
      );

      test(
        'Compliance can be updated from dashboard',
        async ({ page }) => {

        const riskCompliance =
          await loginAndOpenRiskCompliance(
            page
          );

        await skipWhenNoAlternateOption(
          () => riskCompliance.updateCompliance()
        );
        }
      );

      test(
        'Risk Profile additional editable fields persist after update',
        async ({ page }) => {

        const riskCompliance =
          await loginAndOpenRiskCompliance(
            page
          );

        await skipWhenNoAlternateOption(
          () => riskCompliance.updateRiskProfileAdditionalFields()
        );
        }
      );

      test(
        'Compliance additional editable fields persist after update',
        async ({ page }) => {

        const riskCompliance =
          await loginAndOpenRiskCompliance(
            page
          );

        await skipWhenNoAlternateOption(
          () => riskCompliance.updateComplianceAdditionalFields()
        );
        }
      );
    }
  }
);
