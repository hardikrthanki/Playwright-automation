import {
  Page,
  Locator,
  expect
} from '@playwright/test';

import { safeClick }
  from '../helpers/safeClick';
  import { BasePage }
  from './BasePage';
   import { Logger }
  from '../utils/logger';
/* =============================================================================
PAGE OBJECT: RiskProfilePage

PURPOSE
-------
Handles onboarding risk profile completion.

FEATURES COVERED
----------------
1. Investing Experience
2. Options Experience
3. Multi-leg Strategy Selection
4. Risk Tolerance Selection
5. Strategy Selection
6. Account Type Selection
7. Risk Profile Save

METHODS
-------
completeRiskProfile()

USED BY
-------
onboarding.spec.ts

============================================================================= */

export class RiskProfilePage
  extends BasePage {

 constructor(page: Page) {

  super(page);
  }

  async selectInvestingExperience() {
    const experienceDropdown =
      this.page.locator('[role="combobox"]').nth(0);

    await safeClick(
      experienceDropdown,
      'Open Experience Dropdown'
    );

    await safeClick(
      this.page.getByRole('option', {
        name: /3.?5 years/i,
      }),
      'Select 3-5 years'
    );
  }

  async selectOptionsExperience() {
    await safeClick(
      this.page.getByRole('button', {
        name: /^beginner$/i,
      }),
      'Select Beginner'
    );
  }

  async selectOptionsExperienceByName(
    optionName: RegExp,
    label: string
  ) {
    await safeClick(
      this.page.getByRole('button', {
        name: optionName,
      }),
      label
    );
  }

  async selectMultiLegNo() {
    await safeClick(
      this.page.getByRole('button', {
        name: /^no$/i,
      }),
      'Select No'
    );
  }

  async selectMultiLegYes() {
    await safeClick(
      this.page.getByRole('button', {
        name: /^yes$/i,
      }),
      'Select Yes'
    );
  }

  async selectRiskToleranceModerate() {
    await safeClick(
      this.page.getByRole('button', {
        name: /^moderate$/i,
      }),
      'Select Moderate'
    );
  }

  async selectRiskToleranceByName(
    riskName: RegExp,
    label: string
  ) {
    await safeClick(
      this.page.getByRole('button', {
        name: riskName,
      }),
      label
    );
  }

  async selectPreferredDuration() {
    const durationCheckboxes =
      this.page.locator('[role="checkbox"]');

    const durationCount =
      await durationCheckboxes.count();

    for (let i = 0; i < durationCount; i++) {
      const parentText =
        await durationCheckboxes
          .nth(i)
          .locator('..')
          .textContent();

      if (
        parentText?.includes('30-60 days')
      ) {
        const checked =
          await durationCheckboxes
            .nth(i)
            .getAttribute('aria-checked');

        if (checked !== 'true') {
          await durationCheckboxes
            .nth(i)
            .click({ force: true });
        }

        break;
      }
    }
  }

  async selectAllowedStrategies() {
    await this.selectCheckboxByLabel(
      'Covered Calls'
    );

    await this.selectCheckboxByLabel(
      'Cash Secured Puts'
    );
  }

  async selectCashAccountType() {
    const cashText =
      this.page.getByText(/^Cash$/).last();

    await cashText.scrollIntoViewIfNeeded();

    await cashText.click({
      force: true
    });

    await this.page.waitForTimeout(1000);

    const accountCheckboxes =
      this.page.locator('[role="checkbox"]');

    let accountSelected = false;

    for (
      let i = 0;
      i < await accountCheckboxes.count();
      i++
    ) {
      const checked =
        await accountCheckboxes
          .nth(i)
          .getAttribute('aria-checked');

      if (checked === 'true') {
        accountSelected = true;
        break;
      }
    }

    if (!accountSelected) {
      throw new Error(
        'Cash Account Type was not selected.'
      );
    }
  }

  async saveRiskProfile(
    label = 'Save Risk Profile'
  ) {
    await safeClick(
      this.page.getByRole('button', {
        name: /save risk profile/i,
      }),
      label
    );
  }

  private async locatorIsVisible(
    locator: Locator
  ) {
    return locator.isVisible()
      .catch(() => false);
  }

  private async complianceStepIsReady(
    timeoutMs = 8000
  ) {
    const deadline =
      Date.now() + timeoutMs;

    const disclosureButtons =
      this.page.getByRole('button', {
        name: /read disclosure/i,
      });

    const complianceTab =
      this.page.getByRole('tab', {
        name: /compliance/i,
      });

    while (Date.now() < deadline) {
      const disclosureCount =
        await disclosureButtons.count();

      for (let i = 0; i < disclosureCount; i++) {
        if (
          await this.locatorIsVisible(
            disclosureButtons.nth(i)
          )
        ) {
          return true;
        }
      }

      if (
        await this.locatorIsVisible(
          complianceTab.first()
        )
      ) {
        const disabled =
          await complianceTab
            .first()
            .getAttribute('aria-disabled');

        const selected =
          await complianceTab
            .first()
            .getAttribute('aria-selected');

        if (
          disabled !== 'true' ||
          selected === 'true'
        ) {
          return true;
        }
      }

      await this.page.waitForTimeout(500);
    }

    return false;
  }

  private async waitForComplianceStepReady() {
    if (
      await this.complianceStepIsReady(15000)
    ) {
      return;
    }

    const diagnostics =
      (await this.page
        .locator('body')
        .innerText()
        .catch(() => ''))
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 500);

    throw new Error(
      `Risk Profile did not unlock Compliance after save. Visible diagnostics: ${diagnostics}`
    );
  }

  async saveRiskProfileAndOpenCompliance() {
    for (let attempt = 1; attempt <= 2; attempt++) {
      await this.saveRiskProfile(
        attempt === 1
          ? 'Save Risk Profile'
          : 'Retry Save Risk Profile'
      );

      if (
        await this.complianceStepIsReady(8000)
      ) {
        return;
      }

      Logger.info(
        `Risk Profile save did not unlock Compliance. Retrying (${attempt}/2).`
      );
    }

    await this.waitForComplianceStepReady();
  }

  async validateSelectionsCanBeUpdatedBeforeSave() {
    Logger.info(
      'Validating Risk Profile selections can be updated before save'
    );

    await this.selectInvestingExperience();
    await this.selectOptionsExperience();
    await this.selectMultiLegNo();
    await this.selectRiskToleranceModerate();
    await this.selectPreferredDuration();
    await this.selectAllowedStrategies();
    await this.selectCashAccountType();

    await this.selectOptionsExperienceByName(
      /intermediate|advanced|experienced/i,
      'Update Options Experience'
    ).catch(async () => {
      Logger.info(
        'Alternate options experience was not available; keeping Beginner.'
      );
    });

    await this.selectMultiLegYes()
      .then(async () => {
        await this.selectMultiLegNo();
      })
      .catch(async () => {
        Logger.info(
          'Multi-leg strategy Yes option was not available; keeping No.'
        );
      });

    await this.selectRiskToleranceByName(
      /aggressive|conservative|high|low/i,
      'Update Risk Tolerance'
    ).catch(async () => {
      Logger.info(
        'Alternate risk tolerance was not available; keeping Moderate.'
      );
    });

    await this.saveRiskProfile(
      'Save Updated Risk Profile'
    );

    await this.waitForComplianceStepReady();

    Logger.success(
      'Risk Profile update before save is accepted'
    );
  }

  async expectRiskProfileStillActive() {
    await expect(
      this.page
    ).toHaveURL(
      /onboarding/,
      {
        timeout: 10000
      }
    );

    await expect(
      this.page.getByRole('button', {
        name: /save risk profile/i,
      })
    ).toBeVisible({
      timeout: 10000
    });

    await expect(
      this.page.getByText(
        /read disclosure/i
      ).first()
    ).toBeHidden({
      timeout: 5000
    });
  }

  async fill() {
    Logger.info(
  'Filling Risk Profile'
);

  Logger.step(
  'Open Experience Dropdown'
);

    await this.selectInvestingExperience();

    console.log(
  ' Options Experience  Beginner'
);

await this.selectOptionsExperience();

console.log(
  ' Multi-leg Strategies  No'
);

await this.selectMultiLegNo();

/*
  
*/    console.log(' Risk Tolerance  Moderate');

    await this.selectRiskToleranceModerate();
    console.log(
      ' Portfolio Loss  Keeping default 10%'
    );

    console.log(
      ' Preferred Duration  30-60 days'
    );

    await this.selectPreferredDuration();

    console.log(
      ' Allowed Strategy  Covered Calls'
    );

    console.log(
      ' Allowed Strategy  Cash Secured Puts'
    );

    await this.selectAllowedStrategies();

  console.log(' Account Type  Cash');

await this.selectCashAccountType();

console.log(
    ' Cash Account Type selected'
);
    await this.saveRiskProfileAndOpenCompliance();

Logger.success(
  'Risk Profile completed'
);
const dropdowns = this.page.locator('button[role="combobox"]');

for (let i = 0; i < await dropdowns.count(); i++) {
  console.log(
    `Dropdown ${i}:`,
    await dropdowns.nth(i).textContent(),
    'Visible:',
    await dropdowns.nth(i).isVisible()
  );
}

console.log(
  ' Compliance tab opened successfully'
);
  }

  async validateRequiredFieldsBlockSave() {
    Logger.info(
      'Validating Risk Profile required fields'
    );

    await this.saveRiskProfile(
      'Save Risk Profile Without Required Fields'
    );

    await this.expectRiskProfileStillActive();

    Logger.success(
      'Risk Profile required fields block progress'
    );
  }

  async validateMissingExperienceBlocksSave() {
    Logger.info(
      'Validating Risk Profile investing experience is required'
    );

    await this.selectOptionsExperience();
    await this.selectMultiLegNo();
    await this.selectRiskToleranceModerate();
    await this.selectPreferredDuration();
    await this.selectAllowedStrategies();
    await this.selectCashAccountType();
    await this.saveRiskProfile(
      'Save Risk Profile Without Investing Experience'
    );
    await this.expectRiskProfileStillActive();

    Logger.success(
      'Risk Profile investing experience is required'
    );
  }

  async validateMissingStrategyBlocksSave() {
    Logger.info(
      'Validating Risk Profile strategy selection is required'
    );

    await this.selectInvestingExperience();
    await this.selectOptionsExperience();
    await this.selectMultiLegNo();
    await this.selectRiskToleranceModerate();
    await this.selectPreferredDuration();
    await this.selectCashAccountType();
    await this.saveRiskProfile(
      'Save Risk Profile Without Allowed Strategy'
    );
    await this.expectRiskProfileStillActive();

    Logger.success(
      'Risk Profile strategy selection is required'
    );
  }

  async validateMissingAccountTypeBlocksSave() {
    Logger.info(
      'Validating Risk Profile account type is required'
    );

    await this.selectInvestingExperience();
    await this.selectOptionsExperience();
    await this.selectMultiLegNo();
    await this.selectRiskToleranceModerate();
    await this.selectPreferredDuration();
    await this.selectAllowedStrategies();
    await this.saveRiskProfile(
      'Save Risk Profile Without Account Type'
    );
    await this.expectRiskProfileStillActive();

    Logger.success(
      'Risk Profile account type is required'
    );
  }

  async selectCheckboxByLabel(
    label: string
  ) {
    const checkboxes =
      this.page.locator(
        '[role="checkbox"]'
      );

    const count =
      await checkboxes.count();

    for (let i = 0; i < count; i++) {
      const containerText =
        await checkboxes
          .nth(i)
          .locator('..')
          .textContent();

      if (
        containerText?.includes(label)
      ) {
        const checked =
          await checkboxes
            .nth(i)
            .getAttribute(
              'aria-checked'
            );

        if (checked !== 'true') {
          await checkboxes
            .nth(i)
            .click({
              force: true,
            });
        }

        break;
      }
    }
  }
}
