import {
  expect,
  test
} from '@playwright/test';

import {
  BASE_URL
} from './config/testData';

/* =============================================================================
TEST SUITE: Public Route Guard

PURPOSE
-------
Guest checks that do not need a signed-in user:
- Risk and Compliance cannot be opened directly
- An unknown address does not open the dashboard
- Public sign-in screens show a title and a heading

Run:
npx playwright test tests/PublicRouteGuard.spec.ts
============================================================================= */

const publicScreens = [
  {
    path: '/login',
    heading: /sign in|log in|welcome/i
  },
  {
    path: '/register',
    heading: /sign up|create account|register|get started|free trial/i
  },
  {
    path: '/forgot-password',
    heading: /forgot|reset|password/i
  }
];

test.describe(
  'Public Route Guard',
  () => {

    test(
      'Guest opening Risk and Compliance is sent to sign in',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/dashboard/risk-compliance`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await expect(
          page
        ).toHaveURL(
          /\/login/,
          {
            timeout: 15000
          }
        );

        await expect(
          page.locator(
            'input[type="email"]'
          ).first()
        ).toBeVisible();

        await expect(
          page.getByRole(
            'heading',
            {
              name: /risk|compliance/i
            }
          )
        ).toHaveCount(0);
      }
    );

    test(
      'Unknown address does not open the dashboard',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/not-a-real-ooltool-page`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await expect(
          page
        ).not.toHaveURL(
          /\/dashboard/
        );

        const signIn =
          page.locator(
            'input[type="email"]'
          ).first();

        const missingPage =
          page.getByText(
            /not found|does not exist|doesn't exist|404/i
          ).first();

        await expect(
          signIn.or(missingPage).first()
        ).toBeVisible({
          timeout: 15000
        });
      }
    );

    for (const screen of publicScreens) {
      test(
        `Public ${screen.path} screen shows a title and a heading`,
        async ({ page }) => {

          await page.goto(
            `${BASE_URL}${screen.path}`,
            {
              waitUntil: 'domcontentloaded'
            }
          );

          const title =
            (await page.title()).trim();

          expect(
            title.length,
            `${screen.path} should have a page title`
          ).toBeGreaterThan(0);

          await expect(
            page.getByText(
              screen.heading
            ).first()
          ).toBeVisible();
        }
      );
    }
  }
);
