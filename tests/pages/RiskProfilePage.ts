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

  async fill() {
    Logger.info(
  'Filling Risk Profile'
);

  Logger.step(
  'Open Experience Dropdown'
);

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
    console.log(
  ' Options Experience  Beginner'
);

await safeClick(
  this.page.getByRole('button', {
    name: /^beginner$/i,
  }),
  'Select Beginner'
);

console.log(
  ' Multi-leg Strategies  No'
);

await safeClick(
  this.page.getByRole('button', {
    name: /^no$/i,
  }),
  'Select No'
);

/*
  
*/    console.log(' Risk Tolerance  Moderate');

    await safeClick(
      this.page.getByRole('button', {
        name: /^moderate$/i,
      }),
      'Select Moderate'
    );
    console.log(
      ' Portfolio Loss  Keeping default 10%'
    );

    console.log(
      ' Preferred Duration  30-60 days'
    );

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

    console.log(
      ' Allowed Strategy  Covered Calls'
    );

    await this.selectCheckboxByLabel(
      'Covered Calls'
    );

    console.log(
      ' Allowed Strategy  Cash Secured Puts'
    );

    await this.selectCheckboxByLabel(
      'Cash Secured Puts'
    );

  console.log(' Account Type  Cash');

const cashText = this.page.getByText(/^Cash$/).last();

await cashText.scrollIntoViewIfNeeded();

await cashText.click({ force: true });

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

console.log(
  ' Cash Account Type selected'
);
    await safeClick(
      this.page.getByRole('button', {
        name: /save risk profile/i,
      }),
      'Save Risk Profile'
    );

await expect(
  this.page.getByText(
    /read disclosure/i
  ).first()
).toBeVisible({
  timeout: 15000,
});

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
