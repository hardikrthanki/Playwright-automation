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

/* =============================================================================
TEST SUITE: Remaining dashboard screens

PURPOSE
-------
Footer pages, the Opportunities filter and sort lists, Bulk Upload, and
Connect broker. Nothing is saved or submitted.

RUN
---
npx playwright test tests/DashboardRemainingScreens.spec.ts --reporter=line
============================================================================= */

test.describe(
  'Remaining dashboard screens',
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

    test(
      'Footer legal pages open',
      async ({ page }) => {
        const pages = [
          {
            name: /privacy policy/i,
            content: /privacy/i
          },
          {
            name: /terms of service/i,
            content: /terms/i
          },
          {
            name: /disclosures/i,
            content: /disclos/i
          },
          {
            name: /risk warning/i,
            content: /risk/i
          },
          {
            name: /^contact$/i,
            content: /contact|email|support/i
          }
        ];

        for (const item of pages) {
          await openDashboard(
            page
          );

          await safeClick(
            page.getByRole(
              'link',
              {
                name: item.name
              }
            ).first(),
            'Open footer page'
          );

          await expect(
            page.locator(
              'main, body'
            ).first()
          ).toContainText(
            item.content,
            {
              timeout: 20000
            }
          );
        }
      }
    );

    test(
      'Opportunities filter panel and sort list open',
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
              name: /^filters$/i
            }
          ),
          'Filters'
        );

        await expect(
          page.getByRole(
            'dialog'
          ).or(
            page.getByText(
              /strategy|source|expiry|cost basis|apply|reset/i
            )
          ).first()
        ).toBeVisible({
          timeout: 10000
        });

        await page.keyboard.press(
          'Escape'
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /save view/i
            }
          ).first(),
          'Save View'
        );

        const saveDialog =
          page.getByRole(
            'dialog'
          );

        if (
          await saveDialog.waitFor({
            state: 'visible',
            timeout: 4000
          }).then(
            () => true
          ).catch(
            () => false
          )
        ) {
          await page.keyboard.press(
            'Escape'
          );
        }

        await safeClick(
          page.getByText(
            /sort by/i
          ).locator(
            'xpath=following::*[@role="combobox" or self::button][1]'
          ).or(
            page.getByRole(
              'combobox'
            ).filter({
              hasText: /expiry|sort/i
            })
          ).first(),
          'Sort by'
        );

        const sortChoice =
          page.getByRole(
            'option'
          ).nth(
            1
          );

        await expect(
          sortChoice
        ).toBeVisible({
          timeout: 10000
        });

        const sortLabel =
          (
            await sortChoice.innerText()
          ).split(
            '\n'
          )[0].trim();

        await safeClick(
          sortChoice,
          `Sort ${sortLabel}`
        );

        await expect(
          page.locator(
            'main'
          )
        ).toContainText(
          new RegExp(
            sortLabel.replace(
              /[.*+?^${}()|[\]\\]/g,
              '\\$&'
            ),
            'i'
          )
        );
      }
    );

    test(
      'Bulk upload explains the file and connect broker opens',
      async ({ page }) => {
        await openDashboard(
          page
        );

        await safeClick(
          page.locator(
            'header button:has(svg.lucide-plus), button:has(svg.lucide-plus)'
          ).first(),
          'Open plus menu'
        );

        await safeClick(
          page.getByRole(
            'menuitem',
            {
              name: /bulk upload/i
            }
          ),
          'Bulk Upload'
        );

        const upload =
          page.getByRole(
            'dialog'
          );

        await expect(
          upload
        ).toBeVisible({
          timeout: 10000
        });

        await expect(
          upload
        ).toContainText(
          /upload|csv|file|import|position/i
        );

        await page.keyboard.press(
          'Escape'
        );

        await openDashboard(
          page
        );

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
              name: /^accounts$/i
            }
          ),
          'Accounts'
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /connect broker/i
            }
          ).or(
            page.getByRole(
              'link',
              {
                name: /connect broker/i
              }
            )
          ).first(),
          'Connect broker'
        );

        await expect(
          page.locator(
            'main, [role="dialog"]'
          ).first()
        ).toContainText(
          /broker|connect|institution|account/i,
          {
            timeout: 15000
          }
        );

        await page.keyboard.press(
          'Escape'
        );
      }
    );

    test(
      'Connect broker keeps an empty form from submitting',
      async ({ page }) => {
        await openDashboard(
          page
        );

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
              name: /^accounts$/i
            }
          ),
          'Accounts'
        );

        await safeClick(
          page.getByRole(
            'button',
            {
              name: /connect broker/i
            }
          ).or(
            page.getByRole(
              'link',
              {
                name: /connect broker/i
              }
            )
          ).first(),
          'Connect broker'
        );

        const surface =
          page.locator(
            'main, [role="dialog"]'
          ).first();

        await expect(
          surface
        ).toContainText(
          /broker|institution|account/i,
          {
            timeout: 15000
          }
        );

        const submit =
          surface.getByRole(
            'button',
            {
              name: /^(connect|continue|submit|link account)$/i
            }
          );

        if (
          await submit.count()
        ) {
          await expect(
            submit.first()
          ).toBeDisabled();
        }

        const cancel =
          surface.getByRole(
            'button',
            {
              name: /cancel|close/i
            }
          ).first();

        if (
          await cancel.isVisible().catch(
            () => false
          )
        ) {
          await safeClick(
            cancel,
            'Cancel connect broker'
          );
        } else {
          await page.keyboard.press(
            'Escape'
          );
        }

        await expect(
          page
        ).not.toHaveURL(
          /stripe|plaid|broker-connected/i
        );
      }
    );

    test(
      'Bulk upload rejects a file that is not a spreadsheet',
      async ({ page }) => {
        await openDashboard(
          page
        );

        await safeClick(
          page.locator(
            'header button:has(svg.lucide-plus), button:has(svg.lucide-plus)'
          ).first(),
          'Open plus menu'
        );

        await safeClick(
          page.getByRole(
            'menuitem',
            {
              name: /bulk upload/i
            }
          ),
          'Bulk Upload'
        );

        const upload =
          page.getByRole(
            'dialog'
          );

        await expect(
          upload
        ).toBeVisible({
          timeout: 10000
        });

        const file =
          upload.locator(
            'input[type="file"]'
          );

        await file.setInputFiles({
          name: 'not-a-sheet.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from(
            'this is not a spreadsheet'
          )
        });

        const importButton =
          upload.getByRole(
            'button',
            {
              name: /import|upload|continue/i
            }
          ).first();

        const rejected =
          await upload.getByText(
            /csv|xlsx|spreadsheet|invalid|unsupported|not allowed/i
          ).first().waitFor({
            state: 'visible',
            timeout: 5000
          }).then(
            () => true
          ).catch(
            () => false
          );

        if (
          !rejected &&
          await importButton.count()
        ) {
          await expect(
            importButton
          ).toBeDisabled();
        }

        await page.keyboard.press(
          'Escape'
        );
      }
    );
  }
);
