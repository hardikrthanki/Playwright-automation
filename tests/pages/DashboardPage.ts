import {
  expect
} from '@playwright/test';

import { BasePage }
  from './BasePage';

/* ============================================================================
   DASHBOARD PAGE
============================================================================ */
export class DashboardPage
  extends BasePage {
  async validate() {

    console.log(
      '📊 Validating Dashboard'
    );

    await expect(this.page)
      .toHaveURL(
        /dashboard/,
        {
          timeout: 30000,
        }
      );

    console.log(
      '✅ Dashboard Loaded'
    );

    console.log(
      '🔄 Refreshing Dashboard'
    );

  await this.refresh();

    await expect(this.page)
      .toHaveURL(
        /dashboard/,
        {
          timeout: 30000,
        }
      );

    console.log(
      '✅ Dashboard persists after refresh'
    );
  }
}