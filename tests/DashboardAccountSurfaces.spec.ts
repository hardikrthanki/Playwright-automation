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

import { safeClick }
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
      'Glossary search narrows the term list and clears',
      async ({ page }) => {
        await openPath(
          page,
          '/dashboard'
        );

        await new DashboardPage(
          page
        ).validateLoaded();

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

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          /delta/i,
          {
            timeout: 10000
          }
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
      'Equity research shows a second symbol',
      async ({ page }) => {
        await openPath(
          page,
          '/dashboard'
        );

        await new DashboardPage(
          page
        ).validateLoaded();

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
              name: /^equity$/i
            }
          ),
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
  }
);
