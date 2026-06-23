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
  async fill() {
   Logger.info(
  'Filling Compliance Profile'
);
   await this.page.waitForTimeout(
  WAITS.NORMAL
);
   console.log('• State of Residence');
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
const stateDropdown =
  dropdowns.nth(2);

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
  
    const disclosureButtons =
      this.page.getByRole('button', {
        name: /read disclosure/i,
      });

    const disclosureCount =
      await disclosureButtons.count();

    console.log(
      `Found ${disclosureCount} disclosure(s)`
    );

    for (
      let i = 0;
      i < disclosureCount;
      i++
    ) {
    Logger.info(
  `Processing Disclosure ${i + 1} of ${disclosureCount}`
);
      await disclosureButtons
        .nth(i)
        .scrollIntoViewIfNeeded();

      await safeClick(
        disclosureButtons.nth(i),
        `Open Disclosure ${i + 1}`
      );
      await this.page.waitForTimeout(2000);
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
        `Accept Disclosure ${i + 1}`
      );

    Logger.success(
  `Disclosure ${i + 1} Accepted`
);
      await this.page.waitForTimeout(
        1500
      );
    }
    await safeClick(
      this.page.getByRole('button', {
        name:
          /save compliance profile/i,
      }),
      'Save Compliance Profile'
    );

Logger.url(
  this.page.url()
);

await this.page.waitForTimeout(
  WAITS.LARGE
);
  }
}