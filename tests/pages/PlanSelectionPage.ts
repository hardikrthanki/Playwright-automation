import {
  Page,
  expect
} from '@playwright/test';

import { safeClick }
  from '../helpers/safeClick';
  import { BasePage }
  from './BasePage';
    import { Logger }
  from '../utils/logger';

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

export class PlanSelectionPage
  extends BasePage {

 constructor(page: Page) {
  super(page);
  }

  async selectIncomeBuilderPlan() {
Logger.info(
  'Selecting Subscription Plan'
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
Logger.step(
  'Select Monthly Tab'
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

Logger.success(
  'Monthly Tab Selected'
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

   Logger.success(
  'Continue to Payment Clicked'
);
  }
}