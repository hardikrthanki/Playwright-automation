import {
  BASE_URL
} from './config/testData';

import { CompanyFundamentalsPage }
  from './pages/CompanyFundamentalsPage';

import { DashboardPage }
  from './pages/DashboardPage';

import { EventCalendarPage }
  from './pages/EventCalendarPage';

import { test }
  from './fixtures/subscriberAuth';

import { safeClick }
  from './helpers/safeClick';

/* =============================================================================
TEST SUITE: Event Calendar and Company Fundamentals

PURPOSE
-------
View more on Upcoming Events opens the calendar. All, Earnings, and Dividend
change the list. The first event opens that company, search reloads the
symbol, and the fundamentals tabs render.

RUN
---
npx playwright test tests/EventCalendarFundamentals.spec.ts --reporter=line
============================================================================= */

test.describe(
  'Event Calendar and Company Fundamentals',
  () => {

    test.describe.configure({
      timeout: 180000
    });

    test(
      'View more opens event filters and a company fundamentals page',
      async ({ page }) => {
        const dashboard =
          new DashboardPage(
            page
          );

        const calendar =
          new EventCalendarPage(
            page
          );

        const fundamentals =
          new CompanyFundamentalsPage(
            page
          );

        await page.goto(
          `${BASE_URL}/dashboard`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await dashboard.validateLoaded();

        await test.step(
          'Open the event calendar',
          async () => {
            await safeClick(
              page.getByRole(
                'link',
                {
                  name: /view more/i
                }
              ).first(),
              'View more upcoming events'
            );

            await calendar.validateLoaded();
          }
        );

        await test.step(
          'All, Earnings, and Dividend filters',
          async () => {
            await calendar.showFilter(
              'All'
            );

            await calendar.showFilter(
              'Earnings'
            );

            await calendar.showFilter(
              'Dividend'
            );

            await calendar.showFilter(
              'All'
            );
          }
        );

        let symbol = '';

        await test.step(
          'Open the first event',
          async () => {
            symbol =
              await calendar.openFirstEvent();

            await fundamentals.openFromEvent(
              symbol
            );

            await fundamentals.validateLoaded(
              symbol
            );
          }
        );

        await test.step(
          'Search the same symbol',
          async () => {
            await fundamentals.searchSymbol(
              symbol
            );
          }
        );

        await test.step(
          'Fundamentals tabs',
          async () => {
            await fundamentals.openDetailTab(
              'Overview'
            );

            await fundamentals.openDetailTab(
              'Valuation'
            );

            await fundamentals.openDetailTab(
              'Earnings'
            );

            await fundamentals.openDetailTab(
              'Dividends'
            );
          }
        );

        await test.step(
          'Finance, options, and event calendar',
          async () => {
            await fundamentals.openRelatedView(
              'Finance',
              /finance|financial|statement|income|balance/i
            );

            await page.goBack({
              waitUntil: 'domcontentloaded'
            });

            await fundamentals.validateLoaded(
              symbol
            );

            await fundamentals.openRelatedView(
              'Analyze options',
              /option|strike|expir|chain/i
            );
          }
        );
      }
    );
  }
);
