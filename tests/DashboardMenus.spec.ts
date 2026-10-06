import {
  expect,
  Page
} from '@playwright/test';

import {
  BASE_URL
} from './config/testData';

import { DashboardPage }
  from './pages/DashboardPage';

import { test }
  from './fixtures/subscriberAuth';

import {
  openHeaderMenu,
  safeClick
} from './helpers/safeClick';

/* =============================================================================
TEST SUITE: Dashboard menus

PURPOSE
-------
Research and Portfolio menus open each destination and show page content.

RUN
---
npx playwright test tests/DashboardMenus.spec.ts --reporter=line
============================================================================= */

test.describe(
  'Dashboard menus',
  () => {

    test.describe.configure({
      timeout: 240000
    });

    async function openDashboard(
      page: Page
    ) {
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

    async function openMenu(
      page: Page,
      name: RegExp,
      label: string
    ) {
      void label;

      await openHeaderMenu(
        page,
        name
      );
    }

    test(
      'Research menu opens fundamentals finance news calendar and simulator',
      async ({ page }) => {
        const destinations = [
          {
            name: /company fundamentals/i,
            content: /fundamental|symbol|search|company/i
          },
          {
            name: /company finance/i,
            content: /finance|statement|symbol|search|income/i
          },
          {
            name: /^news$/i,
            content: /news|headline|article|market/i
          },
          {
            name: /event calendar/i,
            content: /event calendar|earnings|dividend/i
          },
          {
            name: /^simulator$/i,
            content: /simulator|simulation|scenario|strategy/i
          }
        ];

        for (const destination of destinations) {
          await openDashboard(
            page
          );

          await openMenu(
            page,
            /^research$/i,
            'Research menu'
          );

          await safeClick(
            page.getByRole(
              'menuitem',
              {
                name: destination.name
              }
            ),
            'Open research destination'
          );

          await expect(
            page.locator(
              'main'
            )
          ).toContainText(
            destination.content,
            {
              timeout: 20000
            }
          );
        }
      }
    );

    test(
      'Portfolio menu opens each holdings destination',
      async ({ page }) => {
        await openDashboard(
          page
        );

        await openMenu(
          page,
          /^portfolio$/i,
          'Portfolio menu'
        );

        const items =
          page.getByRole(
            'menuitem'
          );

        await expect(
          items.first()
        ).toBeVisible({
          timeout: 10000
        });

        const names =
          await items.allInnerTexts();

        expect(
          names.length
        ).toBeGreaterThan(
          0
        );

        for (const name of names) {
          const label =
            name.replace(
              /\s+/g,
              ' '
            ).trim();

          if (
            !label
          ) {
            continue;
          }

          await openDashboard(
            page
          );

          await openMenu(
            page,
            /^portfolio$/i,
            'Portfolio menu'
          );

          await safeClick(
            page.getByRole(
              'menuitem',
              {
                name: new RegExp(
                  `^${label.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    '\\$&'
                  )}$`,
                  'i'
                )
              }
            ),
            label
          );

          await expect(
            page.locator(
              'main'
            )
          ).toContainText(
            /portfolio|account|position|holding|broker|connect|watchlist|symbol/i,
            {
              timeout: 20000
            }
          );
        }
      }
    );
  }
);
