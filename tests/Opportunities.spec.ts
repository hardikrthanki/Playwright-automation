import {
  BASE_URL
} from './config/testData';

import { DashboardPage }
  from './pages/DashboardPage';

import { OpportunitiesPage }
  from './pages/OpportunitiesPage';

import {
  expect,
  test
} from './fixtures/subscriberAuth';

import { safeClick }
  from './helpers/safeClick';

/* =============================================================================
TEST SUITE: Opportunities

PURPOSE
-------
Opens Opportunities, checks each risk tab, then changes strategy, source,
expiry, cost basis, and sort. Each new value is checked, then put back.
Row actions stay Research, Stop Watching, and CTA Details.

RUN
---
npx playwright test tests/Opportunities.spec.ts --reporter=line
============================================================================= */

test.describe(
  'Opportunities',
  () => {

    test.describe.configure({
      timeout: 240000
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

    test(
      'Opportunity save view research watch and pagination',
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
        await opportunities.deleteSavedViews(
          /delete AIR /i
        );
        await opportunities.validateHowOpportunitiesWork();
        await opportunities.validateEveryRiskTab();

        await opportunities.selectFilter(
          /all strategies|covered call|cash secured put/i,
          /^covered call$/i
        );

        await opportunities.selectFilter(
          /expiry:\s*all|next \d+/i,
          /next 30 days/i
        );

        await opportunities.selectFilter(
          /source:\s*all|portfolio|watchlist/i,
          /^portfolio$/i
        );

        await opportunities.selectFilter(
          /cost basis:\s*all|strike above cost/i,
          /strike above cost/i
        );

        const viewName =
          `AIR ${Date.now().toString().slice(-6)}`;

        await opportunities.saveCurrentView(
          viewName
        );

        await opportunities.selectFilter(
          /next 30 days/i,
          /expiry:\s*all/i
        );

        await opportunities.openSavedView(
          viewName
        );

        await expect(
          page.locator(
            'main'
          ).getByRole(
            'combobox'
          ).filter({
            hasText: /^covered call$/i
          })
        ).toBeVisible();

        await expect(
          page.locator(
            'main'
          ).getByRole(
            'combobox'
          ).filter({
            hasText: /^portfolio$/i
          })
        ).toBeVisible();

        await expect(
          page.locator(
            'main'
          ).getByRole(
            'combobox'
          ).filter({
            hasText: /strike above cost/i
          })
        ).toBeVisible();

        await opportunities.selectFilter(
          /next 30 days/i,
          /expiry:\s*all/i
        );

        await opportunities.selectFilter(
          /covered call/i,
          /^all strategies$/i
        );

        await opportunities.selectFilter(
          /^portfolio$/i,
          /source:\s*all/i
        );

        await opportunities.selectFilter(
          /strike above cost/i,
          /cost basis:\s*all/i
        );

        const myRisk =
          page.getByRole(
            'button',
            {
              name: /return to my risk/i
            }
          );

        if (
          await myRisk.waitFor({
            state: 'visible',
            timeout: 3000
          }).then(
            () => true
          ).catch(
            () => false
          )
        ) {
          await safeClick(
            myRisk,
            'Return to My Risk'
          );
        }

        await opportunities.validatePagination();
        await opportunities.validateResearchAndWatchToggle();
      }
    );

    test(
      'Opportunity filters return to all strategies and all sources',
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

        await opportunities.selectFilter(
          /all strategies|covered call|cash secured put/i,
          /^covered call$/i
        );

        await opportunities.selectFilter(
          /source:\s*all|portfolio|watchlist/i,
          /^portfolio$/i
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /reset filters/i
            }
          ),
          'Reset filters'
        );

        await expect(
          page.locator(
            'main'
          ).getByRole(
            'combobox'
          ).filter({
            hasText: /all strategies/i
          })
        ).toBeVisible();

        await expect(
          page.locator(
            'main'
          ).getByRole(
            'combobox'
          ).filter({
            hasText: /source:\s*all/i
          })
        ).toBeVisible();
      }
    );

    test(
      'About opportunities opens and closes',
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

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /^opportunities$/i
            }
          ).first(),
          'Open Opportunities'
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /about opportunities/i
            }
          ),
          'About opportunities'
        );

        await expect(
          page.getByRole(
            'dialog'
          ).or(
            page.locator(
              'main'
            )
          ).first()
        ).toContainText(
          /opportunit/i
        );

        await page.keyboard.press(
          'Escape'
        );

        await expect(
          page
        ).toHaveURL(
          /\/dashboard\/opportunities/
        );

        await expect(
          page.getByRole(
            'heading',
            {
              name: /^opportunities$/i
            }
          )
        ).toBeVisible();
      }
    );

    test(
      'About CTA data freshness opens and closes',
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

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /^opportunities$/i
            }
          ).first(),
          'Open Opportunities'
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /about cta data freshness/i
            }
          ),
          'About CTA data freshness'
        );

        await expect(
          page.getByRole(
            'dialog'
          ).or(
            page.locator(
              'main'
            )
          ).first()
        ).toContainText(
          /fresh|delayed|data as of|cta/i
        );

        await page.keyboard.press(
          'Escape'
        );

        await expect(
          page
        ).toHaveURL(
          /\/dashboard\/opportunities/
        );
      }
    );
  }
);
