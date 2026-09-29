import {
  BASE_URL
} from './config/testData';

import { AccountsPage }
  from './pages/AccountsPage';

import { DashboardPage }
  from './pages/DashboardPage';

import { PortfolioPage }
  from './pages/PortfolioPage';

import { test }
  from './fixtures/subscriberAuth';

import { safeClick }
  from './helpers/safeClick';

async function openDashboard(
  page: import('@playwright/test').Page
) {
  let lastError: unknown;

  for (
    let attempt = 0;
    attempt < 2;
    attempt += 1
  ) {
    try {
      await page.goto(
        `${BASE_URL}/dashboard`,
        {
          waitUntil: 'domcontentloaded',
          timeout: 45000
        }
      );
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

/* =============================================================================
TEST SUITE: Account and position prompts

PURPOSE
-------
Manage Accounts opens delete and disconnect confirmations. View positions
opens edit and delete. Each prompt is cancelled, so nothing is removed.

RUN
---
npx playwright test tests/DashboardPositionActions.spec.ts --reporter=line
============================================================================= */

test.describe(
  'Account and position prompts',
  () => {

    test.describe.configure({
      timeout: 180000
    });

    test(
      'Delete and disconnect confirmations can be cancelled',
      async ({ page }) => {
        const dashboard =
          new DashboardPage(
            page
          );

        const accounts =
          new AccountsPage(
            page
          );

        await openDashboard(
          page
        );

        await dashboard.validateLoaded();

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /manage accounts/i
            }
          ).first(),
          'Manage accounts'
        );

        await accounts.validateLoaded();
        await accounts.verifyDeleteAndDisconnect();
      }
    );

    test(
      'Edit and delete position prompts can be cancelled',
      async ({ page }) => {
        const dashboard =
          new DashboardPage(
            page
          );

        const accounts =
          new AccountsPage(
            page
          );

        const portfolio =
          new PortfolioPage(
            page
          );

        await openDashboard(
          page
        );

        await dashboard.validateLoaded();

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /manage accounts/i
            }
          ).first(),
          'Manage accounts'
        );

        await accounts.validateLoaded();
        await accounts.openPositions();
        await portfolio.validateLoaded();
        await portfolio.verifyEditAndDelete();
      }
    );
  }
);
