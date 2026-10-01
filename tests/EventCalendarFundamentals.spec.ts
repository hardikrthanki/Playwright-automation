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
change the list. A day opens its own list. The one symbol filter keeps a
symbol that has earnings or dividends, and the other category may say it
was not found. Close returns to the event calendar. The company behind an
event shows Overview, Valuation, Earnings, Dividends, News, Finance,
Analyze options, and Event calendar.

RUN
---
npx playwright test tests/EventCalendarFundamentals.spec.ts --reporter=line
============================================================================= */

test.describe(
  'Event Calendar and Company Fundamentals',
  () => {

    test.describe.configure({
      timeout: 240000
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
            const companyUrl =
              page.url();

            await fundamentals.openRelatedView(
              'Finance',
              /finance|financial|statement|income|balance/i
            );

            await page.goto(
              companyUrl,
              {
                waitUntil: 'domcontentloaded'
              }
            );

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

    test(
      'A day filters by symbol and opens company research pages',
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

        let symbol = '';

        await test.step(
          'Open a day and filter by symbol',
          async () => {
            await calendar.openDayWithEvents();

            await calendar.validateDayEvents();

            symbol =
              await calendar.filterDayBySymbol();

            await calendar.clearDayFilter();

            await calendar.openDayWithEvents();

            symbol =
              await calendar.filterDayBySymbol();

            await calendar.openFilteredSymbol(
              symbol
            );

            await fundamentals.openFromEvent(
              symbol
            );

            await fundamentals.validateLoaded(
              symbol
            );
          }
        );

        await test.step(
          'Overview, valuation, earnings, and dividends',
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
          'Finance and event calendar',
          async () => {
            const companyUrl =
              page.url();

            await fundamentals.openRelatedView(
              'Finance',
              /finance|financial|statement|income|balance/i
            );

            await page.goto(
              companyUrl,
              {
                waitUntil: 'domcontentloaded'
              }
            );

            await fundamentals.validateLoaded(
              symbol
            );

            await fundamentals.openRelatedView(
              'Event calendar',
              /event calendar|earnings|dividend/i
            );

            await page.goto(
              companyUrl,
              {
                waitUntil: 'domcontentloaded'
              }
            );

            await fundamentals.validateLoaded(
              symbol
            );
          }
        );

        await test.step(
          'Analyze options',
          async () => {
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
