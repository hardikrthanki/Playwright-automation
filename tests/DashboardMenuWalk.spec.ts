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
TEST SUITE: Each main menu, one at a time

PURPOSE
-------
Opportunities, Portfolio, Research, and Profile are opened from the menu.
Every list that can change is set, checked, and put back. Subscription
changes, sign out, and Risk Profile save stay unclicked.

RUN
---
npx playwright test tests/DashboardMenuWalk.spec.ts --reporter=line
============================================================================= */

test.describe(
  'Each menu scenario',
  () => {

    test.describe.configure({
      timeout: 300000
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

    async function openMenuItem(
      page: Page,
      menu: RegExp,
      item: RegExp,
      label: string
    ) {
      await openHeaderMenu(
        page,
        menu
      );

      await safeClick(
        page.getByRole(
          'menuitem',
          {
            name: item
          }
        ),
        label
      );
    }

    async function pickOption(
      page: Page,
      index: number,
      name: RegExp
    ) {
      const combo =
        page.locator(
          'main'
        ).getByRole(
          'combobox'
        ).nth(
          index
        );

      await safeClick(
        combo,
        'Open list'
      );

      await safeClick(
        page.getByRole(
          'option',
          {
            name
          }
        ).first(),
        'Choose value'
      );

      await expect(
        combo
      ).toContainText(
        name
      );
    }

    async function searchSymbol(
      page: Page,
      symbol: string
    ) {
      const input =
        page.locator(
          'main'
        ).getByRole(
          'combobox'
        ).first();

      await input.fill(
        symbol
      );

      await safeClick(
        page.getByRole(
          'option',
          {
            name: new RegExp(
              symbol,
              'i'
            )
          }
        ).first(),
        `Select ${symbol}`
      );

      const search =
        page.getByRole(
          'button',
          {
            name: /^search$/i
          }
        );

      if (
        await search.waitFor({
          state: 'visible',
          timeout: 3000
        }).then(
          () => true
        ).catch(
          () => false
        )
      ) {
        await safeClick(
          search,
          `Search ${symbol}`
        );
      }
    }

    test(
      'Opportunities menu sets every filter value',
      async ({ page }) => {
        await openDashboard(
          page
        );

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /^opportunities$/i
            }
          ).first(),
          'Opportunities'
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /how opportunities work/i
            }
          ),
          'How Opportunities work'
        );

        await expect(
          page.locator(
            'main, [role="dialog"]'
          ).first()
        ).toContainText(
          /opportunit/i
        );

        await page.keyboard.press(
          'Escape'
        );

        const filters = [
          {
            index: 1,
            options: [
              /^covered call$/i,
              /^cash secured put$/i,
              /^roll forward$/i,
              /^roll covered call$/i,
              /^protective put$/i,
              /^close option$/i,
              /^assignment risk$/i
            ],
            restore: /^all strategies$/i
          },
          {
            index: 2,
            options: [
              /^portfolio$/i,
              /^watchlist$/i,
              /^opportunities$/i
            ],
            restore: /source:\s*all/i
          },
          {
            index: 3,
            options: [
              /next 7 days/i,
              /next 15 days/i,
              /next 30 days/i,
              /next 90 days/i,
              /next 6 months/i
            ],
            restore: /expiry:\s*all/i
          },
          {
            index: 4,
            options: [
              /strike above cost/i,
              /strike below cost/i
            ],
            restore: /cost basis:\s*all/i
          },
          {
            index: 5,
            options: [
              /expiry \(latest\)/i,
              /est\. return/i,
              /^premium$/i,
              /^symbol$/i
            ],
            restore: /expiry \(soonest\)/i
          },
          {
            index: 6,
            options: [
              /^15$/,
              /^25$/
            ],
            restore: /^10$/
          }
        ];

        for (const filter of filters) {
          for (const option of filter.options) {
            await pickOption(
              page,
              filter.index,
              option
            );

            await expect(
              page.locator(
                'main'
              )
            ).toContainText(
              /opportunit|showing|no |\$[\d,]+/i
            );
          }

          await pickOption(
            page,
            filter.index,
            filter.restore
          );
        }

        for (const tab of [
          /conservative\s*\(1/i,
          /moderate\s*\(4/i,
          /growth\s*\(7/i,
          /aggressive\s*\(9/i
        ]) {
          const button =
            page.getByRole(
              'button',
              {
                name: tab
              }
            ).first();

          if (
            await button.isDisabled()
          ) {
            await expect(
              button
            ).toBeDisabled();

            continue;
          }

          await safeClick(
            button,
            'Risk tab'
          );

          await expect(
            page.locator(
              'main'
            )
          ).toContainText(
            /opportunit|showing|no /i
          );
        }
      }
    );

    test(
      'Portfolio menu sorts holdings and opens each item',
      async ({ page }) => {
        await openDashboard(
          page
        );

        await openMenuItem(
          page,
          /^portfolio$/i,
          /^portfolio$/i,
          'Portfolio'
        );

        const show =
          page.getByRole(
            'button',
            {
              name: /^show$/i
            }
          );

        if (
          await show.waitFor({
            state: 'visible',
            timeout: 5000
          }).then(
            () => true
          ).catch(
            () => false
          )
        ) {
          await safeClick(
            show,
            'Show positions'
          );
        }

        for (const column of [
          'Account',
          'Position',
          'Type',
          'Qty',
          'Avg. Price',
          'Last Price',
          'Market value',
          'Unrealized P/L'
        ]) {
          await safeClick(
            page.locator(
              'main'
            ).getByRole(
              'button',
              {
                name: new RegExp(
                  `^${column.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    '\\$&'
                  )}$`,
                  'i'
                )
              }
            ).first(),
            `Sort ${column}`
          );

          await expect(
            page.locator(
              'main tbody tr'
            ).first()
          ).toBeVisible();
        }

        const nextPage =
          page.locator(
            'main'
          ).getByRole(
            'button',
            {
              name: /^2$/
            }
          ).last();

        if (
          await nextPage.waitFor({
            state: 'visible',
            timeout: 3000
          }).then(
            () => true
          ).catch(
            () => false
          )
        ) {
          await safeClick(
            nextPage,
            'Portfolio page 2'
          );

          await safeClick(
            page.locator(
              'main'
            ).getByRole(
              'button',
              {
                name: /^1$/
              }
            ).last(),
            'Portfolio page 1'
          );
        }

        await safeClick(
          page.getByRole(
            'tab',
            {
              name: /^manual\b/i
            }
          ),
          'Manual holdings'
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /manual|position|qty/i
        );

        await openDashboard(
          page
        );

        await openMenuItem(
          page,
          /^portfolio$/i,
          /^accounts$/i,
          'Accounts'
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /connect broker/i
            }
          ).first(),
          'Connect broker'
        );

        await expect(
          page.getByRole(
            'dialog'
          )
        ).toContainText(
          /broker|connect/i
        );

        await page.keyboard.press(
          'Escape'
        );

        await openDashboard(
          page
        );

        await openMenuItem(
          page,
          /^portfolio$/i,
          /^watchlist$/i,
          'Watchlist'
        );

        await safeClick(
          page.getByRole(
            'tab',
            {
              name: /^opportunities\b/i
            }
          ),
          'Watchlist opportunities'
        );

        await safeClick(
          page.getByRole(
            'tab',
            {
              name: /^my watchlist\b/i
            }
          ),
          'My watchlist'
        );

        await openDashboard(
          page
        );

        await openMenuItem(
          page,
          /^portfolio$/i,
          /^analytics$/i,
          'Analytics'
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /^3M$/
            }
          ),
          'Analytics 3M'
        );

        await expect(
          page.getByRole(
            'button',
            {
              name: /^3M$/
            }
          )
        ).toHaveClass(
          /bg-primary/
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /^1W$/
            }
          ),
          'Analytics 1W'
        );
      }
    );

    test(
      'Research menu changes equity, fundamentals, finance, news, calendar, and simulator',
      async ({ page }) => {
        await openDashboard(
          page
        );

        await openMenuItem(
          page,
          /^research$/i,
          /^equity$/i,
          'Equity'
        );

        await searchSymbol(
          page,
          'AAPL'
        );

        const analyze =
          page.getByRole(
            'button',
            {
              name: /^analyze$/i
            }
          );

        if (
          await analyze.waitFor({
            state: 'visible',
            timeout: 4000
          }).then(
            () => true
          ).catch(
            () => false
          )
        ) {
          await safeClick(
            analyze,
            'Analyze AAPL'
          );
        }

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /\$\d[\d,]*(?:\.\d+)?|AAPL/i,
          {
            timeout: 20000
          }
        );

        await openDashboard(
          page
        );

        await openMenuItem(
          page,
          /^research$/i,
          /company fundamentals/i,
          'Company Fundamentals'
        );

        await searchSymbol(
          page,
          'AAPL'
        );

        await expect(
          page.getByRole(
            'heading',
            {
              name: /^AAPL$/
            }
          )
        ).toBeVisible({
          timeout: 20000
        });

        for (const range of [
          '1M',
          'YTD',
          '1Y',
          '3Y',
          '5Y'
        ]) {
          const button =
            page.locator(
              'main'
            ).getByRole(
              'button',
              {
                name: new RegExp(
                  `^${range}$`
                )
              }
            );

          await safeClick(
            button,
            `Chart ${range}`
          );

          await expect(
            button
          ).toHaveClass(
            /bg-primary/
          );
        }

        for (const tab of [
          {
            name: /^overview$/i,
            content: /about the company|market cap|price/i
          },
          {
            name: /^valuation$/i,
            content: /valuation|multiple|p\/e|price/i
          },
          {
            name: /^earnings$/i,
            content: /earnings|eps|revenue/i
          },
          {
            name: /^dividends$/i,
            content: /dividend|yield|payout/i
          }
        ]) {
          await safeClick(
            page.getByRole(
              'tab',
              {
                name: tab.name
              }
            ),
            'Fundamentals tab'
          );

          await expect(
            page.getByRole(
              'tab',
              {
                name: tab.name
              }
            )
          ).toHaveAttribute(
            'aria-selected',
            'true'
          );

          await expect(
            page.locator(
              'main'
            )
          ).toContainText(
            tab.content
          );
        }

        await openDashboard(
          page
        );

        await openMenuItem(
          page,
          /^research$/i,
          /company finance/i,
          'Company Finance'
        );

        await searchSymbol(
          page,
          'AAPL'
        );

        await safeClick(
          page.locator(
            'main'
          ).getByRole(
            'button',
            {
              name: /^quarterly$/i
            }
          ),
          'Quarterly'
        );

        await expect(
          page.locator(
            'main'
          ).getByRole(
            'button',
            {
              name: /^quarterly$/i
            }
          )
        ).toHaveClass(
          /bg-primary/
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /^reset$/i
            }
          ),
          'Reset finance'
        );

        await openDashboard(
          page
        );

        await openMenuItem(
          page,
          /^research$/i,
          /^news$/i,
          'News'
        );

        await safeClick(
          page.getByRole(
            'tab',
            {
              name: /^portfolio\b/i
            }
          ),
          'Portfolio news'
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /headline|research|AAPL|held|news/i
        );

        await safeClick(
          page.getByRole(
            'tab',
            {
              name: /^all$/i
            }
          ),
          'All news'
        );

        await openDashboard(
          page
        );

        await openMenuItem(
          page,
          /^research$/i,
          /event calendar/i,
          'Event calendar'
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /^agenda$/i
            }
          ),
          'Agenda'
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /earnings|dividend|agenda/i
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /^month$/i
            }
          ),
          'Month'
        );

        for (const name of [
          'Earnings',
          'Dividend',
          'All'
        ]) {
          const filter =
            page.locator(
              'main'
            ).getByRole(
              'button',
              {
                name: new RegExp(
                  `^${name}$`,
                  'i'
                )
              }
            );

          await safeClick(
            filter,
            `${name} events`
          );

          await expect(
            filter
          ).toHaveClass(
            /primary/
          );
        }

        await openDashboard(
          page
        );

        await openMenuItem(
          page,
          /^research$/i,
          /^simulator$/i,
          'Simulator'
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /^3M$/
            }
          ),
          'Simulator 3M'
        );

        await expect(
          page.getByRole(
            'button',
            {
              name: /^3M$/
            }
          )
        ).toHaveAttribute(
          'aria-pressed',
          'true'
        );
      }
    );

    test(
      'Profile menu opens billing tabs and restores risk experience',
      async ({ page }) => {
        const dashboard =
          new DashboardPage(
            page
          );

        await openDashboard(
          page
        );

        await dashboard.openProfileMenu();

        await safeClick(
          page.getByRole(
            'menuitem',
            {
              name: /^billing$/i
            }
          ),
          'Billing'
        );

        for (const tab of [
          {
            name: /^overview$/i,
            content: /plan|subscription|billing/i
          },
          {
            name: /^plans$/i,
            content: /plan|upgrade|current/i
          },
          {
            name: /^history$/i,
            content: /history|invoice|transaction|no /i
          }
        ]) {
          await safeClick(
            page.getByRole(
              'tab',
              {
                name: tab.name
              }
            ),
            'Billing tab'
          );

          await expect(
            page.getByRole(
              'tab',
              {
                name: tab.name
              }
            )
          ).toHaveAttribute(
            'aria-selected',
            'true'
          );

          await expect(
            page.locator(
              'main'
            )
          ).toContainText(
            tab.content
          );
        }

        await openDashboard(
          page
        );

        await dashboard.openProfileMenu();

        await safeClick(
          page.getByRole(
            'menuitem',
            {
              name: /risk/i
            }
          ),
          'Risk and compliance'
        );

        const years =
          page.locator(
            'main'
          ).getByRole(
            'combobox'
          ).first();

        for (const option of [
          /^0-1 years$/i,
          /^3-5 years$/i,
          /^5-10 years$/i,
          /^10\+ years$/i,
          /^1-3 years$/i
        ]) {
          await safeClick(
            years,
            'Experience'
          );

          await safeClick(
            page.getByRole(
              'option',
              {
                name: option
              }
            ),
            'Experience value'
          );

          await expect(
            years
          ).toContainText(
            option
          );
        }

        await expect(
          page.getByRole(
            'button',
            {
              name: /update risk profile/i
            }
          )
        ).toBeVisible();
      }
    );
  }
);
