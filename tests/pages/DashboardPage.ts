/* =============================================================================
PAGE OBJECT: DashboardPage

## PURPOSE

Validates successful user access to the Dashboard.

## FEATURES COVERED

1. Dashboard Load Validation
2. Dashboard URL Validation
3. Page Refresh Validation
4. Session Persistence Validation

## METHODS

validate()

## USED BY

Subscriber.spec.ts

============================================================================= */

import {
  Page,
  expect
} from '@playwright/test';

export class DashboardPage {

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

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

    await this.page.reload({
      waitUntil: 'domcontentloaded',
    });

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