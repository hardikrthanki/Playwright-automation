import {
  Page,
  Locator,
  expect
} from '@playwright/test';

import { BasePage } from './BasePage';
import { safeClick } from '../helpers/safeClick';
import { Logger } from '../utils/logger';

/* =============================================================================
PAGE OBJECT: PlanSelectionPage

PURPOSE
-------
Handles subscription plan selection during onboarding.

FEATURES COVERED
----------------
1. Plan Selection Page Validation
2. Monthly Billing Selection
3. Income Builder Plan Selection
4. Continue To Payment Navigation

METHODS
-------
selectIncomeBuilderPlan()

USED BY
-------
onboarding.spec.ts

============================================================================= */

export class PlanSelectionPage extends BasePage {


  readonly incomeBuilderPlan: Locator;

  readonly completeSetupButton: Locator;


  constructor(page: Page) {

    super(page);


    this.incomeBuilderPlan =
      page.getByText(
        'Income Builder',
        {
          exact:true
        }
      );


  this.completeSetupButton =
  page.locator(
'button'
).filter({
hasText:/complete setup|continue to payment/i
});

  }



  async selectIncomeBuilderPlan() {

  Logger.info(
    'Selecting Income Builder Plan'
  );


  await expect(
    this.page.getByText(
      /choose your plan/i
    )
  ).toBeVisible({
    timeout:30000
  });


  Logger.step(
    'Select Income Builder Plan'
  );


  await safeClick(
    this.incomeBuilderPlan,
    'Income Builder Plan'
  );


  Logger.success(
    'Income Builder Selected'
  );
  console.log(
  "Current URL:",
  this.page.url()
);


console.log(
  "All Buttons:",
  await this.page.locator('button').allTextContents()
);


console.log(
  "All Text:",
  await this.page.locator('body').innerText()
);


  await this.page.waitForTimeout(
    3000
  );


  await expect(
    this.completeSetupButton
  ).toBeVisible({
    timeout:30000
  });


  await safeClick(
    this.completeSetupButton,
    'Complete Setup'
  );


  Logger.success(
    'Complete Setup Clicked'
  );


  await this.page.waitForTimeout(
    5000
  );


  Logger.url(
    this.page.url()
  );

}
}