import {
  expect,
  Page
} from '@playwright/test';

import {
  BASE_URL,
  TEST_USERS
} from './config/testData';
import { test }
  from './fixtures/subscriberAuth';
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

const usesSharedSubscriber =
  riskComplianceUser.email ===
  TEST_USERS.subscriber.email;

async function openRiskCompliance(
  page: Page
) {
  if (
    !usesSharedSubscriber
  ) {
    await new LoginPage(
      page
    ).login(
      riskComplianceUser.email,
      riskComplianceUser.password
    );
  }

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
      'Saved Risk Profile and Compliance load edit and survive refresh in one session',
      async ({ page }) => {
        const riskCompliance =
          await openRiskCompliance(
            page
          );

        await test.step(
          'Saved details load',
          async () => {
            await riskCompliance.validateSavedRiskProfileLoaded();
            await riskCompliance.validateSavedComplianceLoaded();
          }
        );

        await test.step(
          'Risk Profile editable controls',
          async () => {
            await riskCompliance.validateRiskProfileEditableControls();
          }
        );

        await test.step(
          'Compliance editable controls',
          async () => {
            await riskCompliance.validateComplianceEditableControls();
          }
        );

        await test.step(
          'Tabs remain available after refresh',
          async () => {
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

        await test.step(
          'Route remains usable after browser back and forward',
          async () => {
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
      }
    );

    if (envEnabled('RISK_COMPLIANCE_UPDATE_ENABLED')) {
      test(
        'Risk Profile and Compliance can be updated from dashboard in one session',
        async ({ page }) => {
          const riskCompliance =
            await openRiskCompliance(
              page
            );

          await test.step(
            'Update Risk Profile',
            async () => {
              await riskCompliance.updateRiskProfile();
            }
          );

          await test.step(
            'Update Compliance',
            async () => {
              await skipWhenNoAlternateOption(
                () => riskCompliance.updateCompliance()
              );
            }
          );

          await test.step(
            'Risk Profile additional fields persist',
            async () => {
              await skipWhenNoAlternateOption(
                () => riskCompliance.updateRiskProfileAdditionalFields()
              );
            }
          );

          await test.step(
            'Compliance additional fields persist',
            async () => {
              await skipWhenNoAlternateOption(
                () => riskCompliance.updateComplianceAdditionalFields()
              );
            }
          );
        }
      );
    }
  }
);
