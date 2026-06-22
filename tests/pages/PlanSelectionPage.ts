import {
  Page,
  expect
} from '@playwright/test';

import { safeClick }
  from '../helpers/safeClick';

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

export class PlanSelectionPage {

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectIncomeBuilderPlan() {

    console.log(
      '💳 Selecting Subscription Plan'
    );

    await this.page.waitForTimeout(
      3000
    );

    await expect(
      this.page.getByText(
        /choose your plan/i
      )
    ).toBeVisible({
      timeout: 15000,
    });

    const monthlyTab =
      this.page.getByRole(
        'button',
        {
          name: /^monthly$/i,
        }
      );

    if (
      await monthlyTab.isVisible()
    ) {

      await safeClick(
        monthlyTab,
        'Select Monthly Tab'
      );

      console.log(
        '✅ Monthly Tab Selected'
      );
    }

    console.log(
      '• Selecting Income Builder Plan'
    );

    const incomeBuilderPlan =
      this.page.getByText(
        'Income Builder',
        {
          exact: true,
        }
      );

    await incomeBuilderPlan
      .scrollIntoViewIfNeeded();

    await safeClick(
      incomeBuilderPlan,
      'Select Income Builder Plan'
    );

    await this.page.waitForTimeout(
      2000
    );

    console.log(
      '✅ Income Builder Plan Selected'
    );

    await safeClick(
      this.page.getByRole(
        'button',
        {
          name:
            /continue to payment/i,
        }
      ),
      'Continue to Payment'
    );

    console.log(
      '✅ Continue to Payment Clicked'
    );
  }
}