import {
  BASE_URL
} from './config/testData';

import { AccountsPage }
  from './pages/AccountsPage';

import { DashboardPage }
  from './pages/DashboardPage';

import { OptionsResearchPage }
  from './pages/OptionsResearchPage';

import { PortfolioPage }
  from './pages/PortfolioPage';

import { test }
  from './fixtures/subscriberAuth';

import { safeClick }
  from './helpers/safeClick';

/* =============================================================================
TEST SUITE: Options Research and Portfolio Accounts

PURPOSE
-------
View option exposure and View full expiry calendar open Options Research and its chain.
Manage Accounts opens the broker account, View positions opens holdings,
and every holdings tab shows the positions table.

RUN
---
npx playwright test tests/DashboardResearchPortfolio.spec.ts --reporter=line
============================================================================= */

test.describe(
  'Options Research and Portfolio Accounts',
  () => {

    test.describe.configure({
      timeout: 180000
    });

    test.beforeEach(
      async ({ page }) => {
        const dashboard =
          new DashboardPage(
            page
          );

        await page.goto(
          `${BASE_URL}/dashboard`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await dashboard.validateLoaded();
      }
    );

    test(
      'View option exposure opens options research data',
      async ({ page }) => {
        const research =
          new OptionsResearchPage(
            page
          );

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /view option exposure/i
            }
          ).first(),
          'View option exposure'
        );

        await research.validateLoaded();
        await research.validateResearchData();
      }
    );

    test(
      'View full expiry calendar opens the option chain',
      async ({ page }) => {
        const research =
          new OptionsResearchPage(
            page
          );

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /view full expiry calendar/i
            }
          ).first(),
          'View full expiry calendar'
        );

        await research.validateLoaded();
        await research.validateResearchData();
      }
    );

    test(
      'Manage accounts opens positions and every holdings tab',
      async ({ page }) => {
        const accounts =
          new AccountsPage(
            page
          );

        const portfolio =
          new PortfolioPage(
            page
          );

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
        await portfolio.validateEveryHoldingsTab();
      }
    );
  }
);
