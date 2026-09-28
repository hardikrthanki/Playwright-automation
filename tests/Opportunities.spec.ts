import {
  BASE_URL
} from './config/testData';

import { DashboardPage }
  from './pages/DashboardPage';

import { OpportunitiesPage }
  from './pages/OpportunitiesPage';

import { test }
  from './fixtures/subscriberAuth';

import { safeClick }
  from './helpers/safeClick';

/* =============================================================================
TEST SUITE: Opportunities

PURPOSE
-------
Opens Opportunities, checks each risk tab, the strategy and symbol filters,
and the three row actions: Research, Stop Watching, and CTA Details.

RUN
---
npx playwright test tests/Opportunities.spec.ts --reporter=line
============================================================================= */

test.describe(
  'Opportunities',
  () => {

    test.describe.configure({
      timeout: 180000
    });

    test(
      'Opportunity tabs filters and row actions show CTA data',
      async ({ page }) => {
        const dashboard =
          new DashboardPage(
            page
          );

        const opportunities =
          new OpportunitiesPage(
            page
          );

        await page.goto(
          `${BASE_URL}/dashboard`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await dashboard.validateLoaded();

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /^opportunities$/i
            }
          ).first(),
          'Open Opportunities'
        );

        await opportunities.validateLoaded();
        await opportunities.validateEveryRiskTab();
        await opportunities.validateFilters();
        await opportunities.validateRowActions();
      }
    );
  }
);
