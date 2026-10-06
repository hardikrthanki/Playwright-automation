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

import { safeClick, openHeaderMenuItem }
  from './helpers/safeClick';

async function openPath(
  page: Page,
  path: string
) {
  let lastError: unknown;

  for (
    let attempt = 0;
    attempt < 2;
    attempt += 1
  ) {
    try {
      await page.goto(
        `${BASE_URL}${path}`,
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
TEST SUITE: Signed-in account surfaces

PURPOSE
-------
Glossary search filters the term list and clears. Equity research is
searched for a second symbol, then any chart, news, or overview tab is
selected.

RUN
---
npx playwright test tests/DashboardAccountSurfaces.spec.ts --reporter=line
============================================================================= */

test.describe(
  'Signed-in account surfaces',
  () => {

    test.describe.configure({
      timeout: 240000
    });

    test(
      'Equity research shows a second symbol',
      async ({ page }) => {
        await openPath(
          page,
          '/dashboard'
        );

        await new DashboardPage(
          page
        ).validateLoaded();

        await openHeaderMenuItem(
          page,
          /^research$/i,
          /^equity$/i,
          'Equity research'
        );

        const search =
          page.getByRole(
            'combobox',
            {
              name: /search|symbol/i
            }
          ).or(
            page.getByRole(
              'textbox',
              {
                name: /search|symbol/i
              }
            )
          ).first();

        await search.fill(
          'MSFT'
        );

        const choice =
          page.getByRole(
            'option',
            {
              name: /MSFT/i
            }
          ).first();

        if (
          await choice.waitFor({
            state: 'visible',
            timeout: 8000
          }).then(
            () => true
          ).catch(
            () => false
          )
        ) {
          await safeClick(
            choice,
            'Select MSFT'
          );
        }

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
            'Analyze MSFT'
          );
        }

        await expect(
          page.getByRole(
            'heading',
            {
              name: /^MSFT$/
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
          /\$\d[\d,]*(?:\.\d+)?/
        );

        for (const name of [
          'Chart',
          'News',
          'Overview'
        ]) {
          const tab =
            page.getByRole(
              'tab',
              {
                name: new RegExp(
                  `^${name}$`,
                  'i'
                )
              }
            );

          if (
            !await tab.waitFor({
              state: 'visible',
              timeout: 2000
            }).then(
              () => true
            ).catch(
              () => false
            )
          ) {
            continue;
          }

          await safeClick(
            tab,
            `Equity ${name}`
          );

          await expect(
            tab
          ).toHaveAttribute(
            'aria-selected',
            'true'
          );
        }
      }
    );

    test(
      'Equity research unknown symbol does not open a company',
      async ({ page }) => {
        await openPath(
          page,
          '/dashboard'
        );

        await new DashboardPage(
          page
        ).validateLoaded();

        await openHeaderMenuItem(
          page,
          /^research$/i,
          /^equity$/i,
          'Equity research'
        );

        const search =
          page.getByRole(
            'combobox',
            {
              name: /search|symbol/i
            }
          ).or(
            page.getByRole(
              'textbox',
              {
                name: /search|symbol/i
              }
            )
          ).first();

        await search.fill(
          'ZZZNOTASYMBOL'
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /no results found/i
        );

        const analyze =
          page.getByRole(
            'button',
            {
              name: /^analyze$/i
            }
          );

        await safeClick(
          analyze,
          'Analyze unknown symbol'
        );

        await expect(
          page
        ).toHaveURL(
          /equity-research/
        );

        await expect(
          page.getByRole(
            'heading',
            {
              name: /^ZZZNOTASYMBOL$/
            }
          )
        ).toHaveCount(
          0
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /no results found|search for a symbol/i
        );
      }
    );

    test(
      'Glossary opens one term and clears the search',
      async ({ page }) => {
        await openPath(
          page,
          '/academy/glossary'
        );

        const search =
          page.getByRole(
            'textbox',
            {
              name: /search/i
            }
          ).or(
            page.getByPlaceholder(
              /search/i
            )
          ).first();

        await search.fill(
          'delta'
        );

        const term =
          page.getByRole(
            'heading',
            {
              name: /^delta$/i
            }
          );

        await safeClick(
          term,
          'Open Delta'
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /options greek|option's price|\$1 move/i
        );

        await search.fill(
          ''
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /assignment|bid\s*\/\s*ask|breakeven/i
        );
      }
    );

    test(
      'Glossary search shows only matching terms',
      async ({ page }) => {
        await openPath(
          page,
          '/academy/glossary'
        );

        const search =
          page.locator(
            'main'
          ).getByRole(
            'textbox',
            {
              name: /search/i
            }
          ).or(
            page.locator(
              'main'
            ).getByPlaceholder(
              /search/i
            )
          ).first();

        const assignment =
          page.locator(
            'main'
          ).getByRole(
            'heading',
            {
              name: /^assignment$/i
            }
          );

        const vega =
          page.locator(
            'main'
          ).getByRole(
            'heading',
            {
              name: /^vega$/i
            }
          );

        await expect(
          assignment
        ).toBeVisible();

        await search.fill(
          'vega'
        );

        await expect(
          vega
        ).toBeVisible();

        await expect(
          assignment
        ).toBeHidden({
          timeout: 15000
        });

        await search.fill(
          'ZZZNOTATERM'
        );

        await expect(
          assignment
        ).toBeHidden();

        await expect(
          vega
        ).toBeHidden();

        await expect(
          page
        ).toHaveURL(
          /\/academy\/glossary/
        );

        await search.fill(
          ''
        );

        await expect(
          assignment
        ).toBeVisible();

        await expect(
          vega
        ).toBeVisible();
      }
    );

    test(
      'Equity research clears a typed symbol',
      async ({ page }) => {
        await openPath(
          page,
          '/dashboard'
        );

        await new DashboardPage(
          page
        ).validateLoaded();

        await openHeaderMenuItem(
          page,
          /^research$/i,
          /^equity$/i,
          'Equity research'
        );

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
          'ZZZNOTASYMBOL'
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /no results found/i
        );

        const clear =
          page.locator(
            'main'
          ).getByRole(
            'button',
            {
              name: /clear/i
            }
          ).or(
            page.locator(
              'main button:has(svg.lucide-x)'
            )
          ).first();

        await safeClick(
          clear,
          'Clear equity symbol'
        );

        await expect(
          input
        ).toHaveValue(
          ''
        );

        await expect(
          page.getByRole(
            'heading',
            {
              name: /^ZZZNOTASYMBOL$/
            }
          )
        ).toHaveCount(
          0
        );
      }
    );

    test(
      'Equity research keeps an empty symbol on the search prompt',
      async ({ page }) => {
        await openPath(
          page,
          '/dashboard'
        );

        await new DashboardPage(
          page
        ).validateLoaded();

        await openHeaderMenuItem(
          page,
          /^research$/i,
          /^equity$/i,
          'Equity research'
        );

        const analyze =
          page.getByRole(
            'button',
            {
              name: /^analyze$/i
            }
          );

        if (
          await analyze.isEnabled().catch(
            () => false
          )
        ) {
          await safeClick(
            analyze,
            'Analyze empty symbol'
          );
        }

        await expect(
          page
        ).toHaveURL(
          /equity-research/
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /search for a symbol/i
        );
      }
    );
  }
);
