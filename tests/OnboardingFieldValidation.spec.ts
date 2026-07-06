import {
  Page,
  expect,
  test
} from '@playwright/test';

import {
  AUTH_SETTINGS,
  BASE_URL,
  TEST_USERS
} from './config/testData';
import {
  generateEmail,
  generateMobileNumber
} from './utils/emailGenerator';
import { CompliancePage }
  from './pages/CompliancePage';
import { LoginPage }
  from './pages/LoginPage';
import { MobileVerificationPage }
  from './pages/MobileVerificationPage';
import { RegistrationPage }
  from './pages/RegistrationPage';
import { RiskProfilePage }
  from './pages/RiskProfilePage';

/* =============================================================================
TEST SUITE: Onboarding Field Validation

PURPOSE
-------
Validates required-field guardrails for Risk Profile and Compliance onboarding
steps. These tests use fresh users because onboarding state is one-time per
account in PUAT.

Run:
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
npx playwright test tests/OnboardingFieldValidation.spec.ts --headed
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

function getExistingOnboardingUser() {
  const email =
    process.env.ONBOARDING_FIELD_VALIDATION_EXISTING_EMAIL;

  const password =
    process.env.ONBOARDING_FIELD_VALIDATION_EXISTING_PASSWORD;

  const mobile =
    process.env.ONBOARDING_FIELD_VALIDATION_EXISTING_MOBILE;

  if (
    !email ||
    !password
  ) {
    return undefined;
  }

  return {
    email,
    password,
    mobile:
      mobile ??
      TEST_USERS.onboarding.mobile
  };
}

async function registerAndLoginFreshUser(
  page: Page,
  scenario: string
) {
  const existingUser =
    getExistingOnboardingUser();

  if (existingUser) {
    console.log(
      `${scenario} Existing onboarding email:`,
      existingUser.email
    );

    const login =
      new LoginPage(
        page
      );

    await login.login(
      existingUser.email,
      existingUser.password
    );

    await new MobileVerificationPage(
      page
    ).completeIfVisible(
      existingUser.mobile
    );

    if (
      !/\/onboarding/.test(
        page.url()
      )
    ) {
      await page.goto(
        `${BASE_URL}/onboarding`,
        {
          waitUntil: 'domcontentloaded'
        }
      );
    }

    await expect(
      page
    ).toHaveURL(
      /onboarding/,
      {
        timeout: 30000
      }
    );

    return;
  }

  const email =
    generateEmail(
      scenario
    );

  const mobileNumber =
    generateMobileNumber();

  console.log(
    `${scenario} Email:`,
    email
  );

  console.log(
    `${scenario} Mobile:`,
    mobileNumber
  );

  const registration =
    new RegistrationPage(
      page
    );

  await registration.open();

  await registration.register(
    email,
    mobileNumber
  );

  if (
    AUTH_SETTINGS.emailVerificationRequired
  ) {
    console.log(
      '\nMANUAL EMAIL VERIFICATION REQUIRED'
    );
    console.log(
      `Verify email sent to: ${email}`
    );
    console.log(
      'Open Gmail and click the verification link.'
    );
    console.log(
      'After verification, resume Playwright.'
    );

    await page.pause();
  }

  const login =
    new LoginPage(
      page
    );

  await login.login(
    email,
    TEST_USERS.onboarding.password
  );

  await new MobileVerificationPage(
    page
  ).completeIfVisible(
    mobileNumber
  );

  await expect(
    page
  ).toHaveURL(
    /onboarding/,
    {
      timeout: 30000
    }
  );
}

async function openComplianceForFreshUser(
  page: Page,
  scenario: string
) {
  await registerAndLoginFreshUser(
    page,
    scenario
  );

  await new RiskProfilePage(
    page
  ).fill();

  await expect(
    page.getByRole('button', {
      name:
        /save compliance profile/i,
    })
  ).toBeVisible({
    timeout: 15000
  });
}

test.describe(
  'Onboarding Field Validation',
  () => {

    test.describe.configure({
      timeout: 20 * 60 * 1000
    });

    test.skip(
      !envEnabled(
        'ONBOARDING_FIELD_VALIDATION_ENABLED'
      ),
      'Skipped because ONBOARDING_FIELD_VALIDATION_ENABLED is not configured.'
    );

    test(
      'Fast Risk and Compliance field validation',
      async ({ page }) => {
        await registerAndLoginFreshUser(
          page,
          'fast-risk-compliance-validation'
        );

        const risk =
          new RiskProfilePage(
            page
          );

        await risk.validateRequiredFieldsBlockSave();

        await risk.validateMissingExperienceBlocksSave();

        await risk.selectInvestingExperience();

        await risk.saveRiskProfile();

        await expect(
          page.getByText(
            /read disclosure/i
          ).first()
        ).toBeVisible({
          timeout: 15000
        });

        const compliance =
          new CompliancePage(
            page
          );

        await compliance.validateRequiredFieldsBlockSave();

        await compliance.validateDisclosureRequiredBlocksSave();

        await compliance.acceptAllDisclosures();

        await compliance.saveCompliance();

        await expect(
          page.getByText(
            /choose your plan|select a plan|get started/i
          ).first()
        ).toBeVisible({
          timeout: 30000
        });
      }
    );

    test.describe(
      'Full field-level regression',
      () => {

        test.skip(
          !envEnabled(
            'ONBOARDING_FIELD_VALIDATION_FULL_ENABLED'
          ),
          'Skipped because ONBOARDING_FIELD_VALIDATION_FULL_ENABLED is not configured.'
        );

    test(
      'Risk Profile required fields block onboarding progress',
      async ({ page }) => {
        await registerAndLoginFreshUser(
          page,
          'risk-validation'
        );

        const risk =
          new RiskProfilePage(
            page
          );

        await risk.validateRequiredFieldsBlockSave();

        await risk.fill();

        await expect(
          page.getByText(
            /read disclosure/i
          ).first()
        ).toBeVisible({
          timeout: 15000
        });
      }
    );

    test(
      'Compliance required fields and disclosures block onboarding progress',
      async ({ page }) => {
        await registerAndLoginFreshUser(
          page,
          'compliance-validation'
        );

        const risk =
          new RiskProfilePage(
            page
          );

        await risk.fill();

        const compliance =
          new CompliancePage(
            page
          );

        await compliance.validateRequiredFieldsBlockSave();

        await compliance.fill();

        await expect(
          page.getByText(
            /choose your plan|select a plan|get started/i
          ).first()
        ).toBeVisible({
          timeout: 30000
        });
      }
    );

    test(
      'Risk Profile investing experience field is required',
      async ({ page }) => {
        await registerAndLoginFreshUser(
          page,
          'risk-experience-required'
        );

        await new RiskProfilePage(
          page
        ).validateMissingExperienceBlocksSave();
      }
    );

    test(
      'Risk Profile strategy selection is required',
      async ({ page }) => {
        await registerAndLoginFreshUser(
          page,
          'risk-strategy-required'
        );

        await new RiskProfilePage(
          page
        ).validateMissingStrategyBlocksSave();
      }
    );

    test(
      'Risk Profile account type selection is required',
      async ({ page }) => {
        await registerAndLoginFreshUser(
          page,
          'risk-account-type-required'
        );

        await new RiskProfilePage(
          page
        ).validateMissingAccountTypeBlocksSave();
      }
    );

    test(
      'Risk Profile saved progress persists after refresh',
      async ({ page }) => {
        await registerAndLoginFreshUser(
          page,
          'risk-persistence'
        );

        await new RiskProfilePage(
          page
        ).fill();

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page.getByText(
            /read disclosure/i
          ).first()
        ).toBeVisible({
          timeout: 15000
        });
      }
    );

    test(
      'Compliance state field is required',
      async ({ page }) => {
        await openComplianceForFreshUser(
          page,
          'compliance-state-required'
        );

        await new CompliancePage(
          page
        ).validateStateRequiredBlocksSave();
      }
    );

    test(
      'Compliance disclosures are required',
      async ({ page }) => {
        await openComplianceForFreshUser(
          page,
          'compliance-disclosures-required'
        );

        await new CompliancePage(
          page
        ).validateDisclosureRequiredBlocksSave();
      }
    );

    test(
      'Every Compliance disclosure must be accepted',
      async ({ page }) => {
        await openComplianceForFreshUser(
          page,
          'compliance-each-disclosure-required'
        );

        await new CompliancePage(
          page
        ).validateEachDisclosureRequired();
      }
    );

    test(
      'Compliance disclosure cancel does not accept disclosure',
      async ({ page }) => {
        await openComplianceForFreshUser(
          page,
          'compliance-disclosure-cancel'
        );

        await new CompliancePage(
          page
        ).validateDisclosureCancelDoesNotAccept();
      }
    );

    test(
      'Compliance saved progress persists after refresh',
      async ({ page }) => {
        await openComplianceForFreshUser(
          page,
          'compliance-persistence'
        );

        await new CompliancePage(
          page
        ).fill();

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page.getByText(
            /choose your plan|select a plan|get started/i
          ).first()
        ).toBeVisible({
          timeout: 30000
        });
      }
    );
      }
    );
  }
);
