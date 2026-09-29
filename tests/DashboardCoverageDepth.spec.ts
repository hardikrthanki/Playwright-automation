import {
  expect,
  Locator,
  Page
} from '@playwright/test';

import {
  BASE_URL
} from './config/testData';

import { DashboardPage }
  from './pages/DashboardPage';

import { test }
  from './fixtures/subscriberAuth';

import { safeClick }
  from './helpers/safeClick';

/* =============================================================================
TEST SUITE: Deeper controls on research, portfolio, academy, and support

PURPOSE
-------
Change a value on each screen and check the screen follows it. Finance
statements, news tabs, analytics ranges, academy pages, a cancelled
watchlist, support fields, simulator duration, and the fundamentals chart.
Nothing is submitted or saved.

RUN
---
npx playwright test tests/DashboardCoverageDepth.spec.ts --reporter=line
============================================================================= */

test.describe(
  'Deeper dashboard controls',
  () => {

    test.describe.configure({
      timeout: 180000
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

    async function openResearchItem(
      page: Page,
      name: RegExp,
      label: string
    ) {
      await safeClick(
        page.getByRole(
          'button',
          {
            name: /^research$/i
          }
        ).first(),
        'Research menu'
      );

      await safeClick(
        page.getByRole(
          'menuitem',
          {
            name
          }
        ),
        label
      );
    }

    async function openPortfolioItem(
      page: Page,
      name: RegExp,
      label: string
    ) {
      await safeClick(
        page.getByRole(
          'button',
          {
            name: /^portfolio$/i
          }
        ).first(),
        'Portfolio menu'
      );

      await safeClick(
        page.getByRole(
          'menuitem',
          {
            name
          }
        ),
        label
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
        ).or(
          page.getByPlaceholder(
            /symbol/i
          )
        ).first();

      await input.fill(
        symbol
      );

      const choice =
        page.getByRole(
          'option',
          {
            name: new RegExp(
              symbol,
              'i'
            )
          }
        ).first();

      if (
        await choice.waitFor({
          state: 'visible',
          timeout: 5000
        }).then(
          () => true
        ).catch(
          () => false
        )
      ) {
        await safeClick(
          choice,
          `Select ${symbol}`
        );
      }

      await safeClick(
        page.getByRole(
          'button',
          {
            name: /^search$/i
          }
        ),
        `Search ${symbol}`
      );
    }

    function rangeButton(
      page: Page,
      name: string
    ) {
      return page.locator(
        'main'
      ).getByRole(
        'button',
        {
          name: new RegExp(
            `^${name}$`
          )
        }
      );
    }

    async function expectChosen(
      button: Locator
    ) {
      await expect(
        button
      ).toHaveClass(
        /bg-primary/
      );
    }

    test(
      'Company Finance switches statements and period, then resets',
      async ({ page }) => {
        await openDashboard(
          page
        );

        await openResearchItem(
          page,
          /company finance/i,
          'Company Finance'
        );

        await searchSymbol(
          page,
          'AAPL'
        );

        await expect(
          page.getByRole(
            'tab',
            {
              name: /^income statement$/i
            }
          )
        ).toBeVisible({
          timeout: 20000
        });

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /total revenue/i
        );

        await safeClick(
          rangeButton(
            page,
            'Quarterly'
          ),
          'Quarterly'
        );

        await expectChosen(
          rangeButton(
            page,
            'Quarterly'
          )
        );

        await safeClick(
          rangeButton(
            page,
            'Annual'
          ),
          'Annual'
        );

        await expectChosen(
          rangeButton(
            page,
            'Annual'
          )
        );

        for (const statement of [
          {
            name: /^balance sheet$/i,
            content: /total assets|liabilit/i
          },
          {
            name: /^cash flow$/i,
            content: /operating cash|cash flow/i
          },
          {
            name: /^ratios$/i,
            content: /ratio|margin|return on/i
          }
        ]) {
          await safeClick(
            page.getByRole(
              'tab',
              {
                name: statement.name
              }
            ),
            'Open statement'
          );

          await expect(
            page.getByRole(
              'tab',
              {
                name: statement.name
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
            statement.content
          );
        }

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /^reset$/i
            }
          ),
          'Reset finance search'
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /search a symbol to view company finance data/i
        );

        await expect(
          page.getByRole(
            'tab',
            {
              name: /^income statement$/i
            }
          )
        ).toHaveCount(
          0
        );
      }
    );

    test(
      'News switches portfolio and watchlist, then searches a symbol',
      async ({ page }) => {
        await openDashboard(
          page
        );

        await openResearchItem(
          page,
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
          /headline|research|read|AAPL|held/i,
          {
            timeout: 20000
          }
        );

        const symbolFilter =
          page.locator(
            'main'
          ).getByRole(
            'combobox'
          ).first();

        if (
          await symbolFilter.waitFor({
            state: 'visible',
            timeout: 4000
          }).then(
            () => true
          ).catch(
            () => false
          )
        ) {
          await safeClick(
            symbolFilter,
            'News symbol filter'
          );

          await safeClick(
            page.getByRole(
              'option',
              {
                name: /^AAPL\b/i
              }
            ).first(),
            'Filter news to AAPL'
          );

          await expect(
            symbolFilter
          ).toContainText(
            /AAPL/i
          );

          await safeClick(
            symbolFilter,
            'News symbol filter'
          );

          await safeClick(
            page.getByRole(
              'option',
              {
                name: /all symbols/i
              }
            ).first(),
            'Show all news symbols'
          );
        }

        await safeClick(
          page.getByRole(
            'tab',
            {
              name: /^watchlist$/i
            }
          ),
          'Watchlist news'
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /add symbols to your watchlist|watchlist/i
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

        await searchSymbol(
          page,
          'AAPL'
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /results for AAPL/i,
          {
            timeout: 20000
          }
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /^reset$/i
            }
          ),
          'Reset news search'
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /search a symbol to see headlines/i
        );
      }
    );

    test(
      'Analytics changes the performance range',
      async ({ page }) => {
        await openDashboard(
          page
        );

        await openPortfolioItem(
          page,
          /^analytics$/i,
          'Analytics'
        );

        await expect(
          page.getByRole(
            'heading',
            {
              name: /^analytics$/i
            }
          )
        ).toBeVisible({
          timeout: 20000
        });

        for (const range of [
          '1M',
          '3M',
          'YTD',
          '1Y',
          'ALL',
          '1W'
        ]) {
          const button =
            rangeButton(
              page,
              range
            );

          await safeClick(
            button,
            `Analytics ${range}`
          );

          await expectChosen(
            button
          );

          await expect(
            page.locator(
              'main'
            )
          ).toContainText(
            /portfolio performance|\$[\d,.]+/i
          );
        }
      }
    );

    test(
      'Academy opens glossary, a lesson, and the strategy library',
      async ({ page }) => {
        await openDashboard(
          page
        );

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /^academy$/i
            }
          ).first(),
          'Academy'
        );

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /^glossary$/i
            }
          ).first(),
          'Glossary'
        );

        await expect(
          page
        ).toHaveURL(
          /\/academy\/glossary/
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /assignment|bid\s*\/\s*ask|breakeven/i
        );

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /^lessons$/i
            }
          ).first(),
          'Lessons'
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /what is a covered call/i,
          {
            timeout: 15000
          }
        );

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /what is a covered call/i
            }
          ).or(
            page.getByRole(
              'button',
              {
                name: /^open$/i
              }
            )
          ).first(),
          'Open covered call lesson'
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /covered call|strike|shares/i,
          {
            timeout: 15000
          }
        );

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /^strategy library$/i
            }
          ).first(),
          'Strategy library'
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /covered call|strateg/i,
          {
            timeout: 15000
          }
        );
      }
    );

    test(
      'Watchlist opens a new list and cancels, then shows opportunities',
      async ({ page }) => {
        await openDashboard(
          page
        );

        await openPortfolioItem(
          page,
          /^watchlist$/i,
          'Watchlist'
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /^new$/i
            }
          ),
          'New watchlist'
        );

        const dialog =
          page.getByRole(
            'dialog'
          );

        await expect(
          dialog
        ).toContainText(
          /create watchlist|name/i
        );

        await safeClick(
          dialog.getByRole(
            'button',
            {
              name: /^cancel$/i
            }
          ),
          'Cancel new watchlist'
        );

        await expect(
          dialog
        ).toBeHidden();

        await safeClick(
          page.getByRole(
            'tab',
            {
              name: /^opportunities\b/i
            }
          ),
          'Watchlist opportunities'
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /no watched opportunities|browse opportunities/i
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

        await expect(
          page.getByRole(
            'heading',
            {
              name: /^watchlist$/i
            }
          )
        ).toBeVisible();
      }
    );

    test(
      'Support changes ticket fields and status without submitting',
      async ({ page }) => {
        await openDashboard(
          page
        );

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /^support$/i
            }
          ).first(),
          'Support'
        );

        const combos =
          page.locator(
            'main'
          ).getByRole(
            'combobox'
          );

        await safeClick(
          combos.nth(
            0
          ),
          'Ticket category'
        );

        await safeClick(
          page.getByRole(
            'option',
            {
              name: /^billing$/i
            }
          ),
          'Billing category'
        );

        await expect(
          combos.nth(
            0
          )
        ).toContainText(
          /billing/i
        );

        await safeClick(
          combos.nth(
            1
          ),
          'Ticket priority'
        );

        await safeClick(
          page.getByRole(
            'option',
            {
              name: /^low$/i
            }
          ),
          'Low priority'
        );

        await expect(
          combos.nth(
            1
          )
        ).toContainText(
          /^low$/i
        );

        const subject =
          page.getByRole(
            'textbox',
            {
              name: /subject/i
            }
          ).or(
            page.getByPlaceholder(
              /subject/i
            )
          ).first();

        await subject.fill(
          'Coverage check'
        );

        await expect(
          subject
        ).toHaveValue(
          'Coverage check'
        );

        await safeClick(
          combos.nth(
            2
          ),
          'Ticket status'
        );

        await safeClick(
          page.getByRole(
            'option',
            {
              name: /^open$/i
            }
          ),
          'Open tickets'
        );

        await expect(
          combos.nth(
            2
          )
        ).toContainText(
          /^open$/i
        );

        await safeClick(
          combos.nth(
            2
          ),
          'Ticket status'
        );

        await safeClick(
          page.getByRole(
            'option',
            {
              name: /all statuses/i
            }
          ),
          'All ticket statuses'
        );

        await expect(
          page.getByRole(
            'button',
            {
              name: /submit ticket/i
            }
          )
        ).toBeVisible();
      }
    );

    test(
      'Simulator changes duration and keeps locked risk profiles locked',
      async ({ page }) => {
        await openDashboard(
          page
        );

        await openResearchItem(
          page,
          /^simulator$/i,
          'Simulator'
        );

        await expect(
          page.getByRole(
            'button',
            {
              name: /growth\s*\(7/i
            }
          )
        ).toBeDisabled();

        await expect(
          page.getByRole(
            'button',
            {
              name: /aggressive\s*\(9/i
            }
          )
        ).toBeDisabled();

        for (const duration of [
          '1M',
          '3M',
          '6M',
          '1Y',
          '1W'
        ]) {
          const button =
            rangeButton(
              page,
              duration
            );

          await safeClick(
            button,
            `Duration ${duration}`
          );

          await expectChosen(
            button
          );
        }

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /simulator|risk profile|duration/i
        );
      }
    );

    test(
      'Company fundamentals chart range changes',
      async ({ page }) => {
        await openDashboard(
          page
        );

        await openResearchItem(
          page,
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
          '1Y',
          '5Y'
        ]) {
          const button =
            rangeButton(
              page,
              range
            );

          await safeClick(
            button,
            `Chart ${range}`
          );

          await expectChosen(
            button
          );

          await expect(
            page.locator(
              'main'
            )
          ).toContainText(
            /\$\d[\d,]*(?:\.\d+)?/
          );
        }
      }
    );
  }
);
