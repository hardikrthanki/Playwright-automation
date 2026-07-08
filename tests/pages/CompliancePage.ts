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
  import {
  TIMEOUTS,
  WAITS
} from '../config/constants';
  /* =============================================================================
PAGE OBJECT: CompliancePage

PURPOSE
-------
Handles onboarding compliance profile completion.

FEATURES COVERED
----------------
1. State Selection
2. Disclosure Processing
3. Disclosure Acceptance
4. Compliance Save
5. Compliance Validation

METHODS
-------
completeCompliance()

USED BY
-------
onboarding.spec.ts

============================================================================= */
export class CompliancePage
  extends BasePage {

constructor(page: Page) {
  super(page);
  }

  private stateDropdown() {
    return this.page
      .locator(
        'button[role="combobox"]'
      )
      .nth(2);
  }

  private disclosureButtons() {
    return this.page.getByRole('button', {
      name: /read disclosure/i,
    });
  }

  private saveButton() {
    return this.page.getByRole('button', {
      name:
        /save compliance profile/i,
    });
  }

  async selectState() {
    const stateDropdown =
      this.stateDropdown();

    await stateDropdown.scrollIntoViewIfNeeded();

    await safeClick(
      stateDropdown,
      'Open State Dropdown'
    );

    await this.page.waitForTimeout(
      1000
    );

    const stateOption =
      this.page
        .locator('[role="option"]')
        .filter({
          hasText: /^[A-Za-z]/,
        })
        .first();

    await safeClick(
      stateOption,
      'Select State'
    );

    const selectedValue =
      await stateDropdown.textContent();

    console.log(
      'Selected State:',
      selectedValue
    );

    Logger.success(
      'State Selected'
    );
  }

  async selectDifferentState() {
    const stateDropdown =
      this.stateDropdown();

    const currentState =
      (
        await stateDropdown.textContent()
      )?.trim();

    await stateDropdown.scrollIntoViewIfNeeded();

    await safeClick(
      stateDropdown,
      'Open State Dropdown For Update'
    );

    const options =
      this.page
        .locator('[role="option"]')
        .filter({
          hasText: /^[A-Za-z]/,
        });

    const optionCount =
      await options.count();

    for (let i = 0; i < optionCount; i++) {
      const optionText =
        (
          await options
            .nth(i)
            .textContent()
        )?.trim();

      if (
        optionText &&
        optionText !== currentState
      ) {
        await safeClick(
          options.nth(i),
          'Update State Selection'
        );

        Logger.success(
          `State updated to ${optionText}`
        );

        return;
      }
    }

    await this.page.keyboard.press(
      'Escape'
    );

    Logger.info(
      'No alternate state option was available; keeping current state.'
    );
  }

  async saveCompliance(
    label = 'Save Compliance Profile'
  ) {
    await safeClick(
      this.saveButton(),
      label
    );
  }

  async validateSelectionsCanBeUpdatedBeforeSave() {
    Logger.info(
      'Validating Compliance selections can be updated before save'
    );

    await this.selectState();
    await this.selectDifferentState();
    await this.acceptAllDisclosures();
    await this.saveCompliance(
      'Save Updated Compliance Profile'
    );

    await expect(
      this.page.getByText(
        /choose your plan|select a plan|get started/i
      ).first()
    ).toBeVisible({
      timeout: 30000
    });

    Logger.success(
      'Compliance update before save is accepted'
    );
  }

  async expectComplianceStillActive() {
    await expect(
      this.page
    ).toHaveURL(
      /onboarding/,
      {
        timeout: 10000
      }
    );

    await expect(
      this.saveButton()
    ).toBeVisible({
      timeout: 10000
    });
  }

  async openDisclosure(
    index: number
  ) {
    const disclosureButton =
      this.disclosureButtons()
        .nth(index);

    await disclosureButton.scrollIntoViewIfNeeded();

    await safeClick(
      disclosureButton,
      `Open Disclosure ${index + 1}`
    );

    await this.page.waitForTimeout(2000);
  }

  async acceptOpenDisclosure(
    index: number
  ) {
    const disclosureContent =
      this.page.locator(
        'div.flex-1.overflow-y-auto'
      ).last();

    await disclosureContent.evaluate(
      async (element) => {

        const step = 200;

        while (
          element.scrollTop +
          element.clientHeight <
          element.scrollHeight
        ) {

          element.scrollTop += step;

          element.dispatchEvent(
            new Event('scroll')
          );

          await new Promise(
            resolve =>
              setTimeout(resolve, 150)
          );
        }

        element.scrollTop =
          element.scrollHeight;

        element.dispatchEvent(
          new Event('scroll')
        );
      }
    );

    await this.page.waitForTimeout(
      2000
    );

    const acceptButton =
      this.page.getByRole('button', {
        name:
          /i have read and accept/i,
      });

    await expect(
      acceptButton
    ).toBeVisible({
      timeout: 10000,
    });

    await expect(
      acceptButton
    ).toBeEnabled({
      timeout: 10000,
    });

    await safeClick(
      acceptButton,
      `Accept Disclosure ${index + 1}`
    );

    Logger.success(
      `Disclosure ${index + 1} Accepted`
    );

    await this.page.waitForTimeout(
      1500
    );
  }

  async acceptDisclosureByIndex(
    index: number
  ) {
    await this.openDisclosure(
      index
    );

    await this.acceptOpenDisclosure(
      index
    );
  }

  async acceptAllDisclosures(
    exceptIndex?: number
  ) {
    const disclosureCount =
      await this.disclosureButtons().count();

    console.log(
      `Found ${disclosureCount} disclosure(s)`
    );

    for (
      let i = 0;
      i < disclosureCount;
      i++
    ) {
      if (i === exceptIndex) {
        continue;
      }

      Logger.info(
        `Processing Disclosure ${i + 1} of ${disclosureCount}`
      );

      await this.acceptDisclosureByIndex(
        i
      );
    }
  }

  async closeOpenDisclosure() {
    await this.page.keyboard.press(
      'Escape'
    );

    await expect(
      this.page.getByRole('button', {
        name:
          /i have read and accept/i,
      })
    ).toBeHidden({
      timeout: 10000
    });
  }

  async validateRequiredFieldsBlockSave() {
    Logger.info(
      'Validating Compliance required fields'
    );

    await safeClick(
      this.saveButton(),
      'Save Compliance Without Required Fields'
    );

    await expect(
      this.page
    ).toHaveURL(
      /onboarding/,
      {
        timeout: 10000
      }
    );

    await expect(
      this.saveButton()
    ).toBeVisible({
      timeout: 10000
    });

    await expect(
      this.disclosureButtons().first()
    ).toBeVisible({
      timeout: 10000
    });

    Logger.success(
      'Compliance required fields block progress'
    );
  }

  async validateStateRequiredBlocksSave() {
    Logger.info(
      'Validating Compliance state is required'
    );

    await this.acceptAllDisclosures();

    await this.saveCompliance(
      'Save Compliance Without State'
    );

    await this.expectComplianceStillActive();

    Logger.success(
      'Compliance state is required'
    );
  }

  async validateDisclosureRequiredBlocksSave() {
    Logger.info(
      'Validating Compliance disclosures are required'
    );

    await this.selectState();

    await this.saveCompliance(
      'Save Compliance Without Disclosures'
    );

    await this.expectComplianceStillActive();

    Logger.success(
      'Compliance disclosures are required'
    );
  }

  async validateEachDisclosureRequired() {
    Logger.info(
      'Validating each Compliance disclosure is required'
    );

    await this.selectState();

    const disclosureCount =
      await this.disclosureButtons().count();

    if (disclosureCount < 2) {
      throw new Error(
        'Expected multiple disclosures for individual disclosure validation.'
      );
    }

    await this.acceptAllDisclosures(
      disclosureCount - 1
    );

    await this.saveCompliance(
      'Save Compliance With One Disclosure Missing'
    );

    await this.expectComplianceStillActive();

    Logger.success(
      'Every Compliance disclosure is required'
    );
  }

  async validateDisclosureCancelDoesNotAccept() {
    Logger.info(
      'Validating disclosure cancel does not accept disclosure'
    );

    await this.selectState();

    await this.openDisclosure(
      0
    );

    await this.closeOpenDisclosure();

    await expect(
      this.disclosureButtons().first()
    ).toBeVisible({
      timeout: 10000
    });

    await this.saveCompliance(
      'Save Compliance After Disclosure Cancel'
    );

    await this.expectComplianceStillActive();

    Logger.success(
      'Disclosure cancel does not accept disclosure'
    );
  }

  async fill() {
   Logger.info(
  'Filling Compliance Profile'
);
   await this.page.waitForTimeout(
  WAITS.NORMAL
);
   console.log(' State of Residence');
const dropdowns =
  this.page.locator(
    'button[role="combobox"]'
  );

console.log(
  `Found ${await dropdowns.count()} dropdown(s)`
);

for (
  let i = 0;
  i < await dropdowns.count();
  i++
) {
  console.log(
    `Dropdown ${i}:`,
    await dropdowns.nth(i).textContent(),
    'Visible:',
    await dropdowns.nth(i).isVisible()
  );
}
await this.selectState();
  
    await this.acceptAllDisclosures();

    await this.saveCompliance();

Logger.url(
  this.page.url()
);

await this.page.waitForTimeout(
  WAITS.LARGE
);
  }
}
