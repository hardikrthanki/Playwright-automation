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
import { BASE_URL }
  from '../config/testData';

/* =============================================================================
PAGE OBJECT: RiskCompliancePage

PURPOSE
-------
Handles the authenticated dashboard Risk & Compliance edit page.

FEATURES COVERED
----------------
1. Saved Risk Profile View
2. Risk Profile Update
3. Saved Compliance View
4. Compliance Update

NOTES
-----
Saving this page can notify account administrators, so update tests are gated.

============================================================================= */

export class RiskCompliancePage
  extends BasePage {

  readonly heading: Locator;

  readonly riskTab: Locator;

  readonly complianceTab: Locator;

  constructor(page: Page) {
    super(page);

    this.heading =
      page.getByRole('heading', {
        name: /risk profile.*compliance/i
      }).or(
        page.getByText(
          /risk profile.*compliance/i
        ).first()
      );

    this.riskTab =
      page.locator('button').filter({
        hasText: /risk profile/i
      }).first();

    this.complianceTab =
      page.locator('button').filter({
        hasText: /compliance/i
      }).first();
  }

  async open() {
    Logger.info(
      'Opening Risk & Compliance page'
    );

    await this.page.goto(
      `${BASE_URL}/dashboard/risk-compliance`,
      {
        waitUntil: 'domcontentloaded'
      }
    );

    await expect(
      this.page
    ).toHaveURL(
      /\/dashboard\/risk-compliance/,
      {
        timeout: 30000
      }
    );

    await expect(
      this.heading
    ).toBeVisible({
      timeout: 15000
    });

    Logger.success(
      'Risk & Compliance page loaded'
    );
  }

  async openRiskProfile() {
    await this.page.evaluate(
      () => window.scrollTo(0, 0)
    );

    await safeClick(
      this.riskTab,
      'Open Risk Profile Tab'
    );

    await expect(
      this.page.getByText(
        /investment experience/i
      ).first()
    ).toBeVisible({
      timeout: 10000
    });
  }

  async openCompliance() {
    await this.page.evaluate(
      () => window.scrollTo(0, 0)
    );

    await expect(
      this.complianceTab
    ).toBeVisible({
      timeout: 10000
    });

    await safeClick(
      this.complianceTab,
      'Open Compliance Tab'
    );

    await expect(
      this.page.getByText(
        /state|disclosure|compliance/i
      ).first()
    ).toBeVisible({
      timeout: 10000
    });
  }

  async validateSavedRiskProfileLoaded() {
    Logger.info(
      'Validating saved Risk Profile details'
    );

    await this.openRiskProfile();

    await expect(
      this.page.getByText(
        /previously saved risk profile|years of investing experience|options trading experience/i
      ).first()
    ).toBeVisible({
      timeout: 10000
    });

    await expect(
      this.page.locator(
        'button[role="combobox"]'
      ).first()
    ).toBeVisible({
      timeout: 10000
    });

    Logger.success(
      'Saved Risk Profile details loaded'
    );
  }

  async validateRiskProfileEditableControls() {
    Logger.info(
      'Validating Risk Profile editable controls'
    );

    await this.openRiskProfile();

    await expect(
      this.page.getByText(
        /years of investing experience/i
      ).first()
    ).toBeVisible({
      timeout: 10000
    });

    await expect(
      this.page.getByText(
        /options trading experience/i
      ).first()
    ).toBeVisible({
      timeout: 10000
    });

    await expect(
      this.page.getByText(
        /multi-leg|spreads/i
      ).first()
    ).toBeVisible({
      timeout: 10000
    });

    await expect(
      this.page.locator(
        'button[role="combobox"]'
      ).first()
    ).toBeVisible({
      timeout: 10000
    });

    const riskButtons =
      this.page.locator(
        'button'
      ).filter({
        hasText:
          /none|beginner|intermediate|advanced|yes|no|conservative|moderate|aggressive|low|medium|high/i
      });

    await expect
      .poll(
        async () =>
          riskButtons.count(),
        {
          timeout: 10000,
          message:
            'Risk Profile should expose selectable option controls'
        }
      )
      .toBeGreaterThan(
        0
      );

    await expect(
      this.page.getByRole('button', {
        name: /save|update|submit|resubmit/i
      }).last()
    ).toBeVisible({
      timeout: 10000
    });

    Logger.success(
      'Risk Profile editable controls available'
    );
  }

  async validateSavedComplianceLoaded() {
    Logger.info(
      'Validating saved Compliance details'
    );

    await this.openCompliance();

    await expect(
      this.page.getByText(
        /previously saved compliance|state|disclosure/i
      ).first()
    ).toBeVisible({
      timeout: 10000
    });

    Logger.success(
      'Saved Compliance details loaded'
    );
  }

  async validateComplianceEditableControls() {
    Logger.info(
      'Validating Compliance editable controls'
    );

    await this.openCompliance();

    await expect(
      this.page.getByText(
        /state/i
      ).first()
    ).toBeVisible({
      timeout: 10000
    });

    await expect(
      this.page.locator(
        'button[role="combobox"]'
      ).first()
    ).toBeVisible({
      timeout: 10000
    });

    const optionalComplianceFields =
      [
        /broker.*approval|option.*approval|options.*approval/i,
        /accreditation|accredited/i,
        /broker.*dealer|affiliated|financial industry|finra/i,
        /control person|director|officer|public company/i,
        /politically exposed|political/i,
      ];

    let visibleOptionalFieldCount = 0;

    for (const field of optionalComplianceFields) {
      if (
        await this.page.getByText(
          field
        ).first().isVisible({
          timeout: 1000
        }).catch(() => false)
      ) {
        visibleOptionalFieldCount++;
      }
    }

    Logger.info(
      `Visible optional compliance field count: ${visibleOptionalFieldCount}`
    );

    await expect(
      this.page.getByRole('button', {
        name: /save|update|submit|resubmit/i
      }).last()
    ).toBeVisible({
      timeout: 10000
    });

    Logger.success(
      'Compliance editable controls available'
    );
  }

  async selectVisibleOption(
    optionNames: RegExp,
    label: string
  ): Promise<string> {
    const option =
      this.page.getByRole('button', {
        name: optionNames
      }).first();

    await expect(
      option
    ).toBeVisible({
      timeout: 10000
    });

    await safeClick(
      option,
      label
    );

    return (
      await option.textContent()
    )?.trim() ?? '';
  }

  escapeRegex(
    value: string
  ) {
    return value.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
  }

  async visibleButtonByExactText(
    optionText: string
  ) {
    return this.page.locator('button').filter({
      hasText:
        new RegExp(
          `^\\s*${this.escapeRegex(optionText)}\\s*$`,
          'i'
        )
    }).first();
  }

  async isButtonSelected(
    button: Locator
  ) {
    const className =
      await button.getAttribute(
        'class'
      ) ?? '';

    const ariaPressed =
      await button.getAttribute(
        'aria-pressed'
      );

    const ariaSelected =
      await button.getAttribute(
        'aria-selected'
      );

    const dataState =
      await button.getAttribute(
        'data-state'
      );

    return (
      /border-primary|bg-primary|text-primary|bg-emerald|border-emerald|text-emerald/.test(
        className
      ) ||
      ariaPressed === 'true' ||
      ariaSelected === 'true' ||
      dataState === 'checked' ||
      dataState === 'active'
    );
  }

  async selectDifferentGlobalButton(
    optionTexts: string[],
    label: string,
    required = true
  ) {
    let currentValue = '';

    for (const optionText of optionTexts) {
      const option =
        await this.visibleButtonByExactText(
          optionText
        );

      if (
        await option.isVisible({
          timeout: 1500
        }).catch(() => false) &&
        await this.isButtonSelected(
          option
        )
      ) {
        currentValue = optionText;
        break;
      }
    }

    const alternate =
      optionTexts.find(
        optionText =>
          optionText.toLowerCase() !==
          currentValue.toLowerCase()
      ) ?? optionTexts[0];

    const alternateButton =
      await this.visibleButtonByExactText(
        alternate
      );

    if (
      !await alternateButton.isVisible({
        timeout: 2500
      }).catch(() => false)
    ) {
      if (required) {
        throw new Error(
          `${label} option was not visible.`
        );
      }

      Logger.info(
        `${label} was not visible; skipping optional update.`
      );

      return undefined;
    }

    await safeClick(
      alternateButton,
      `Update ${label} to ${alternate}`
    );

    return {
      before: currentValue,
      after: alternate
    };
  }

  async selectDifferentButtonNearText(
    fieldLabel: RegExp,
    optionTexts: string[],
    label: string
  ) {
    const fieldText =
      this.page.getByText(
        fieldLabel
      ).first();

    if (
      !await fieldText.isVisible({
        timeout: 2500
      }).catch(() => false)
    ) {
      Logger.info(
        `${label} field was not visible; skipping optional update.`
      );

      return undefined;
    }

    const container =
      fieldText.locator(
        'xpath=ancestor::*[.//button][1]'
      );

    let currentValue = '';

    for (const optionText of optionTexts) {
      const option =
        container.locator('button').filter({
          hasText:
            new RegExp(
              `^\\s*${this.escapeRegex(optionText)}\\s*$`,
              'i'
            )
        }).first();

      if (
        await option.isVisible({
          timeout: 1000
        }).catch(() => false) &&
        await this.isButtonSelected(
          option
        )
      ) {
        currentValue = optionText;
        break;
      }
    }

    const alternate =
      optionTexts.find(
        optionText =>
          optionText.toLowerCase() !==
          currentValue.toLowerCase()
      ) ?? optionTexts[0];

    const alternateButton =
      container.locator('button').filter({
        hasText:
          new RegExp(
            `^\\s*${this.escapeRegex(alternate)}\\s*$`,
            'i'
          )
      }).first();

    if (
      !await alternateButton.isVisible({
        timeout: 2500
      }).catch(() => false)
    ) {
      Logger.info(
        `${label} alternate option was not visible; skipping optional update.`
      );

      return undefined;
    }

    await safeClick(
      alternateButton,
      `Update ${label} to ${alternate}`
    );

    return {
      before: currentValue,
      after: alternate,
      fieldLabel
    };
  }

  async selectDifferentComboboxOption(
    comboIndex: number,
    label: string
  ) {
    const dropdown =
      this.page.locator(
        'button[role="combobox"]'
      ).nth(comboIndex);

    await expect(
      dropdown
    ).toBeVisible({
      timeout: 10000
    });

    const currentValue =
      (
        await dropdown.textContent()
      )?.trim() ?? '';

    await safeClick(
      dropdown,
      `Open ${label} Dropdown`
    );

    const options =
      this.page.locator(
        '[role="option"]'
      ).filter({
        hasText: /^[A-Za-z]/,
      });

    const optionCount =
      await options.count();

    for (let i = 0; i < optionCount; i++) {
      const option =
        options.nth(i);

      const optionText =
        (
          await option.textContent()
        )?.trim() ?? '';

      if (
        optionText &&
        optionText !== currentValue
      ) {
        await safeClick(
          option,
          `Select ${label}: ${optionText}`
        );

        return {
          before: currentValue,
          after: optionText
        };
      }
    }

    await this.page.keyboard.press(
      'Escape'
    );

    throw new Error(
      `No alternate ${label} option was available.`
    );
  }

  async selectedButtonByText(
    optionText: string
  ) {
    return this.page.locator('button').filter({
      hasText:
        new RegExp(
          this.escapeRegex(
            optionText
          ),
          'i'
        )
    }).first();
  }

  async expectButtonSelectionPersisted(
    optionText: string,
    label: string
  ) {
    const selectedButton =
      await this.selectedButtonByText(
        optionText
      );

    await expect(
      selectedButton
    ).toBeVisible({
      timeout: 10000
    });

    await expect
      .poll(
        async () => {
          const className =
            await selectedButton.getAttribute(
              'class'
            ) ?? '';

          const ariaPressed =
            await selectedButton.getAttribute(
              'aria-pressed'
            );

          const ariaSelected =
            await selectedButton.getAttribute(
              'aria-selected'
            );

          const dataState =
            await selectedButton.getAttribute(
              'data-state'
            );

          return (
            /border-primary|bg-primary|text-primary|bg-emerald|border-emerald|text-emerald/.test(
              className
            ) ||
            ariaPressed === 'true' ||
            ariaSelected === 'true' ||
            dataState === 'checked' ||
            dataState === 'active'
          );
        },
        {
          message:
            `${label} should remain selected after reload`,
          timeout: 10000
        }
      )
      .toBe(true);
  }

  async expectButtonSelectionPersistedNearText(
    fieldLabel: RegExp,
    optionText: string,
    label: string
  ) {
    const fieldText =
      this.page.getByText(
        fieldLabel
      ).first();

    await expect(
      fieldText
    ).toBeVisible({
      timeout: 10000
    });

    const container =
      fieldText.locator(
        'xpath=ancestor::*[.//button][1]'
      );

    const selectedButton =
      container.locator('button').filter({
        hasText:
          new RegExp(
            `^\\s*${this.escapeRegex(optionText)}\\s*$`,
            'i'
          )
      }).first();

    await expect(
      selectedButton
    ).toBeVisible({
      timeout: 10000
    });

    await expect
      .poll(
        async () =>
          this.isButtonSelected(
            selectedButton
          ),
        {
          message:
            `${label} should remain selected after reload`,
          timeout: 10000
        }
      )
      .toBe(true);
  }

  async saveCurrentSection(
    label: string
  ) {
    const saveButton =
      this.page.getByRole('button', {
        name: /save|update|submit|resubmit/i
      }).last();

    await expect(
      saveButton
    ).toBeVisible({
      timeout: 10000
    });

    await safeClick(
      saveButton,
      label
    );

    await expect(
      this.page.getByText(
        /saved|updated|submitted|success|review the details/i
      ).first()
    ).toBeVisible({
      timeout: 15000
    });
  }

  async updateRiskProfile() {
    Logger.info(
      'Updating saved Risk Profile'
    );

    await this.openRiskProfile();

    const optionsExperience =
      await this.selectDifferentGlobalButton(
        [
          'None',
          'Beginner',
          'Intermediate',
          'Advanced'
        ],
        'Options Trading Experience'
      );

    const multiLegAnswer =
      await this.selectDifferentGlobalButton(
        [
          'Yes',
          'No'
        ],
        'Multi-leg Strategy Answer'
      );

    await this.saveCurrentSection(
      'Save Risk Profile Update'
    );

    Logger.success(
      'Risk Profile update submitted'
    );

    await this.open();
    await this.openRiskProfile();

    if (optionsExperience?.after) {
      await this.expectButtonSelectionPersisted(
        optionsExperience.after,
        'Options Trading Experience'
      );
    }

    if (multiLegAnswer?.after) {
      await this.expectButtonSelectionPersisted(
        multiLegAnswer.after,
        'Multi-leg Strategy Answer'
      );
    }

    Logger.success(
      'Risk Profile update persisted'
    );
  }

  async updateRiskProfileAdditionalFields() {
    Logger.info(
      'Updating additional saved Risk Profile fields'
    );

    await this.openRiskProfile();

    const investingExperience =
      await this.selectDifferentComboboxOption(
        0,
        'Years of Investing Experience'
      );

    const optionsExperience =
      await this.selectDifferentButtonNearText(
        /options trading experience/i,
        [
          'None',
          'Beginner',
          'Intermediate',
          'Advanced'
        ],
        'Options Trading Experience'
      );

    const multiLegAnswer =
      await this.selectDifferentButtonNearText(
        /multi-leg|spreads/i,
        [
          'Yes',
          'No'
        ],
        'Multi-leg Strategy Answer'
      );

    const riskTolerance =
      await this.selectDifferentButtonNearText(
        /risk tolerance|risk level/i,
        [
          'Conservative',
          'Moderate',
          'Aggressive',
          'Low',
          'Medium',
          'High'
        ],
        'Risk Tolerance'
      );

    const investmentObjective =
      await this.selectDifferentButtonNearText(
        /investment objective|primary objective|goal/i,
        [
          'Income',
          'Growth',
          'Balanced',
          'Capital Preservation',
          'Speculation'
        ],
        'Investment Objective'
      );

    const timeHorizon =
      await this.selectDifferentButtonNearText(
        /time horizon|investment horizon/i,
        [
          'Short Term',
          'Medium Term',
          'Long Term',
          '0-1 years',
          '1-3 years',
          '3-5 years',
          '5+ years'
        ],
        'Investment Time Horizon'
      );

    await this.saveCurrentSection(
      'Save Additional Risk Profile Updates'
    );

    Logger.success(
      'Additional Risk Profile update submitted'
    );

    await this.open();
    await this.openRiskProfile();

    if (investingExperience.after) {
      await expect(
        this.page.locator(
          'button[role="combobox"]'
        ).first(),
        'Years of investing experience should remain selected after reload'
      ).toContainText(
        investingExperience.after,
        {
          timeout: 10000
        }
      );
    }

    if (optionsExperience?.after) {
      await this.expectButtonSelectionPersistedNearText(
        /options trading experience/i,
        optionsExperience.after,
        'Options Trading Experience'
      );
    }

    if (multiLegAnswer?.after) {
      await this.expectButtonSelectionPersistedNearText(
        /multi-leg|spreads/i,
        multiLegAnswer.after,
        'Multi-leg Strategy Answer'
      );
    }

    if (riskTolerance?.after) {
      await this.expectButtonSelectionPersistedNearText(
        /risk tolerance|risk level/i,
        riskTolerance.after,
        'Risk Tolerance'
      );
    }

    if (investmentObjective?.after) {
      await this.expectButtonSelectionPersistedNearText(
        /investment objective|primary objective|goal/i,
        investmentObjective.after,
        'Investment Objective'
      );
    }

    if (timeHorizon?.after) {
      await this.expectButtonSelectionPersistedNearText(
        /time horizon|investment horizon/i,
        timeHorizon.after,
        'Investment Time Horizon'
      );
    }

    Logger.success(
      'Additional Risk Profile updates persisted'
    );
  }

  async updateCompliance() {
    Logger.info(
      'Updating saved Compliance'
    );

    await this.openCompliance();

    const selectedState =
      await this.selectDifferentComboboxOption(
        0,
        'Compliance State'
      );

    const brokerApproval =
      await this.selectDifferentButtonNearText(
        /broker.*approval|option.*approval|options.*approval/i,
        [
          'Yes',
          'No'
        ],
        'Broker Option Approval'
      );

    const accreditation =
      await this.selectDifferentButtonNearText(
        /accreditation|accredited/i,
        [
          'Yes',
          'No'
        ],
        'Accreditation'
      );

    await this.saveCurrentSection(
      'Save Compliance Update'
    );

    Logger.success(
      'Compliance update submitted'
    );

    await this.open();
    await this.openCompliance();

    if (selectedState.after) {
      await expect(
        this.page.locator(
          'button[role="combobox"]'
        ).first(),
        'Compliance state should remain selected after reload'
      ).toContainText(
        selectedState.after,
        {
          timeout: 10000
        }
      );
    }

    if (brokerApproval?.after) {
      await this.expectButtonSelectionPersistedNearText(
        /broker.*approval|option.*approval|options.*approval/i,
        brokerApproval.after,
        'Broker Option Approval'
      );
    }

    if (accreditation?.after) {
      await this.expectButtonSelectionPersistedNearText(
        /accreditation|accredited/i,
        accreditation.after,
        'Accreditation'
      );
    }

    Logger.success(
      'Compliance update persisted'
    );
  }

  async updateComplianceAdditionalFields() {
    Logger.info(
      'Updating additional saved Compliance fields'
    );

    await this.openCompliance();

    const selectedState =
      await this.selectDifferentComboboxOption(
        0,
        'Compliance State'
      );

    const brokerApproval =
      await this.selectDifferentButtonNearText(
        /broker.*approval|option.*approval|options.*approval/i,
        [
          'Yes',
          'No'
        ],
        'Broker Option Approval'
      );

    const accreditation =
      await this.selectDifferentButtonNearText(
        /accreditation|accredited/i,
        [
          'Yes',
          'No'
        ],
        'Accreditation'
      );

    const affiliatedBroker =
      await this.selectDifferentButtonNearText(
        /broker.*dealer|affiliated|financial industry|finra/i,
        [
          'Yes',
          'No'
        ],
        'Broker Dealer Affiliation'
      );

    const controlPerson =
      await this.selectDifferentButtonNearText(
        /control person|director|officer|public company/i,
        [
          'Yes',
          'No'
        ],
        'Control Person Disclosure'
      );

    const politicalExposure =
      await this.selectDifferentButtonNearText(
        /politically exposed|political/i,
        [
          'Yes',
          'No'
        ],
        'Political Exposure Disclosure'
      );

    await this.saveCurrentSection(
      'Save Additional Compliance Updates'
    );

    Logger.success(
      'Additional Compliance update submitted'
    );

    await this.open();
    await this.openCompliance();

    if (selectedState.after) {
      await expect(
        this.page.locator(
          'button[role="combobox"]'
        ).first(),
        'Compliance state should remain selected after reload'
      ).toContainText(
        selectedState.after,
        {
          timeout: 10000
        }
      );
    }

    if (brokerApproval?.after) {
      await this.expectButtonSelectionPersistedNearText(
        /broker.*approval|option.*approval|options.*approval/i,
        brokerApproval.after,
        'Broker Option Approval'
      );
    }

    if (accreditation?.after) {
      await this.expectButtonSelectionPersistedNearText(
        /accreditation|accredited/i,
        accreditation.after,
        'Accreditation'
      );
    }

    if (affiliatedBroker?.after) {
      await this.expectButtonSelectionPersistedNearText(
        /broker.*dealer|affiliated|financial industry|finra/i,
        affiliatedBroker.after,
        'Broker Dealer Affiliation'
      );
    }

    if (controlPerson?.after) {
      await this.expectButtonSelectionPersistedNearText(
        /control person|director|officer|public company/i,
        controlPerson.after,
        'Control Person Disclosure'
      );
    }

    if (politicalExposure?.after) {
      await this.expectButtonSelectionPersistedNearText(
        /politically exposed|political/i,
        politicalExposure.after,
        'Political Exposure Disclosure'
      );
    }

    Logger.success(
      'Additional Compliance updates persisted'
    );
  }
}
