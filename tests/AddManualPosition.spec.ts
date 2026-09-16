import {
  ADD_POSITION_CASH,
  ADD_POSITION_EQUITY,
  ADD_POSITION_OPTION,
  BASE_URL
} from './config/testData';

import { test }
  from './fixtures/subscriberAuth';

import { AddPositionPage }
  from './pages/AddPositionPage';

import { DashboardPage }
  from './pages/DashboardPage';

/* =============================================================================
TEST SUITE: Add Manual Position

PURPOSE
-------
After reaching the dashboard, open the + menu and add positions in this order:
Equity, then Cash, then Option. Option expiry, Call/Put, and strike come from
the searched symbol.

RUN
---
npx playwright test tests/AddManualPosition.spec.ts --headed
============================================================================= */

test.describe(
  'Add Manual Position',
  () => {

    test.describe.configure({
      timeout: 5 * 60 * 1000
    });

    test(
      'Dashboard plus menu adds equity then cash then option',
      async ({ page }) => {
        const addPosition =
          new AddPositionPage(
            page
          );

        await test.step(
          'Open dashboard',
          async () => {
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

        await test.step(
          'Add Equity position first',
          async () => {
            await addPosition.addEquityPosition(
              ADD_POSITION_EQUITY
            );
          }
        );

        await test.step(
          'Add Cash position second',
          async () => {
            await addPosition.addCashUsdPosition(
              ADD_POSITION_CASH.amount
            );
          }
        );

        await test.step(
          'Add Option position last',
          async () => {
            await addPosition.addOptionPosition(
              ADD_POSITION_OPTION
            );
          }
        );
      }
    );
  }
);
