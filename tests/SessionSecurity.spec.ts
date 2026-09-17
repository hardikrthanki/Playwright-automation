import {
  expect,
  test
} from '@playwright/test';

import {
  BASE_URL,
  TEST_USERS
} from './config/testData';

import { LoginPage }
  from './pages/LoginPage';

/* =============================================================================
TEST SUITE: Session Security

PURPOSE
-------
One login, then logout and protected-route checks in a single flow.

Run:
npx playwright test tests/SessionSecurity.spec.ts --headed
============================================================================= */

test.describe(
  'Session Security',
  () => {

    test.describe.configure({
      timeout: 4 * 60 * 1000
    });

    test(
      'Login once then logout blocks back refresh tabs and protected routes',
      async ({
        page,
        context,
        browser
      }) => {
        const login =
          new LoginPage(
            page
          );

        await test.step(
          'Login',
          async () => {
            await login.login(
              TEST_USERS.subscriber.email,
              TEST_USERS.subscriber.password
            );

            await expect(
              page
            ).toHaveURL(
              /\/dashboard/,
              {
                timeout: 30000
              }
            );
          }
        );

        const dashboardTab =
          await context.newPage();

        try {
          await test.step(
            'Authenticated session can open dashboard in a new tab',
            async () => {
              await dashboardTab.goto(
                `${BASE_URL}/dashboard`,
                {
                  waitUntil: 'domcontentloaded'
                }
              );

              await expect(
                dashboardTab
              ).toHaveURL(
                /\/dashboard/,
                {
                  timeout: 30000
                }
              );
            }
          );

          await test.step(
            'Authenticated storage does not leak into a fresh browser context',
            async () => {
              const isolatedContext =
                await browser.newContext();

              try {
                const isolatedPage =
                  await isolatedContext.newPage();

                await isolatedPage.goto(
                  `${BASE_URL}/dashboard`,
                  {
                    waitUntil: 'domcontentloaded'
                  }
                );

                await expect(
                  isolatedPage
                ).toHaveURL(
                  /\/login/,
                  {
                    timeout: 30000
                  }
                );

                await expect(
                  isolatedPage.locator(
                    'input[type="email"]'
                  ).first()
                ).toBeVisible();
              } finally {
                await isolatedContext.close();
              }
            }
          );

          await test.step(
            'Logout',
            async () => {
              await login.logout();
            }
          );

          await test.step(
            'Logout invalidates dashboard access in an already opened tab',
            async () => {
              await dashboardTab.goto(
                `${BASE_URL}/dashboard`,
                {
                  waitUntil: 'domcontentloaded'
                }
              );

              await expect(
                dashboardTab
              ).toHaveURL(
                /\/login/,
                {
                  timeout: 30000
                }
              );
            }
          );
        } finally {
          await dashboardTab.close();
        }

        await test.step(
          'Logout prevents browser back and direct dashboard access',
          async () => {
            await page.goBack({
              waitUntil: 'domcontentloaded'
            });

            await expect(
              page
            ).toHaveURL(
              /\/login/,
              {
                timeout: 30000
              }
            );

            await page.goto(
              `${BASE_URL}/dashboard`,
              {
                waitUntil: 'domcontentloaded'
              }
            );

            await expect(
              page
            ).toHaveURL(
              /\/login/,
              {
                timeout: 30000
              }
            );
          }
        );

        await test.step(
          'Logged-out session remains on login after refresh',
          async () => {
            await page.reload({
              waitUntil: 'domcontentloaded'
            });

            await expect(
              page
            ).toHaveURL(
              /\/login/,
              {
                timeout: 30000
              }
            );
          }
        );

        const protectedRoutes = [
          '/onboarding',
          '/dashboard/profile',
          '/dashboard/billing',
          '/dashboard/risk-compliance',
          '/dashboard/security',
          '/dashboard/notifications',
          '/dashboard/activity',
          '/dashboard/settings',
          '/dashboard/subscription',
          '/dashboard/profile/?source=bookmark',
          '/dashboard/billing/?tab=history',
          '/dashboard/risk-compliance/?section=compliance',
          '/dashboard/settings/?source=direct',
          '/dashboard/security/?source=direct',
          '/dashboard/subscription/?source=direct'
        ];

        await test.step(
          'Logout blocks direct access to protected routes',
          async () => {
            for (const route of protectedRoutes) {
              await page.goto(
                `${BASE_URL}${route}`,
                {
                  waitUntil: 'domcontentloaded'
                }
              );

              await expect(
                page
              ).toHaveURL(
                /\/login/,
                {
                  timeout: 30000
                }
              );

              await expect(
                page.locator(
                  'input[type="email"]'
                ).first()
              ).toBeVisible({
                timeout: 10000
              });
            }
          }
        );
      }
    );
  }
);
