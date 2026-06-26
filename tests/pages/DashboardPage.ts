import {
  expect
} from '@playwright/test';

import { BasePage }
  from './BasePage';
  import { Logger }
  from '../utils/logger';

/* ============================================================================
PAGE OBJECT: DashboardPage

PURPOSE
-------
Validates that the user reaches the dashboard and remains there after refresh.
============================================================================ */
export class DashboardPage
  extends BasePage {
  async validate() {

Logger.info(
  'Validating Dashboard'
);
    await expect(this.page)
      .toHaveURL(
        /dashboard/,
        {
          timeout: 30000,
        }
      );

  Logger.success(
  'Dashboard Loaded'
);
    Logger.step(
  'Refreshing Dashboard'
);

  await this.refresh();

    await expect(this.page)
      .toHaveURL(
        /dashboard/,
        {
          timeout: 30000,
        }
      );

   Logger.success(
  'Dashboard persists after refresh'
);
  }
}
