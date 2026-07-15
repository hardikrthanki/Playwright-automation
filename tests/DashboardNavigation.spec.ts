import {
  expect,
  Page,
  test
} from '@playwright/test';

import {
  BASE_URL,
  TEST_USERS
} from './config/testData';

import { BillingPage }
  from './pages/BillingPage';

import { DashboardPage }
  from './pages/DashboardPage';

import { LoginPage }
  from './pages/LoginPage';

import { ProfilePage }
  from './pages/ProfilePage';

import { RiskCompliancePage }
  from './pages/RiskCompliancePage';

import { safeClick }
  from './helpers/safeClick';

/* =============================================================================
TEST SUITE: Dashboard Navigation

PURPOSE
-------
Validates authenticated navigation across core post-login destinations without
changing account, billing, subscription, or security state.

RUN
---
npx playwright test tests/DashboardNavigation.spec.ts --headed
============================================================================= */

test.describe(
  'Dashboard Navigation',
  () => {

    test.describe.configure({
      timeout: 120000
    });

    test.beforeEach(
      async ({ page }) => {
        const login =
          new LoginPage(page);

        const dashboard =
          new DashboardPage(page);

        await login.login(
          TEST_USERS.subscriber.email,
          TEST_USERS.subscriber.password
        );

        await dashboard.validateLoaded();
      }
    );

    async function expectNoHorizontalOverflow(
      page: Page
    ) {
      await expect
        .poll(
          async () =>
            await page.evaluate(
              () =>
                document.documentElement.scrollWidth <=
                window.innerWidth + 1
            ),
          {
            timeout: 5000,
            message:
              'Authenticated page should not create horizontal overflow'
          }
        )
        .toBe(
          true
        );
    }

    test(
      'Authenticated user can open dashboard profile billing and compliance routes',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        const billing =
          new BillingPage(page);

        const riskCompliance =
          new RiskCompliancePage(page);

        await page.goto(
          `${BASE_URL}/dashboard/profile`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await profile.waitForProfileData();

        await expect(
          profile.emailInput
        ).toBeDisabled();

        await page.goto(
          `${BASE_URL}/dashboard/billing`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await billing.validateBillingUrl();

        await expect(
          billing.plansTab
        ).toBeVisible({
          timeout: 15000
        });

        await riskCompliance.open();

        await expect(
          riskCompliance.riskTab
        ).toBeVisible({
          timeout: 10000
        });

        await expect(
          riskCompliance.complianceTab
        ).toBeVisible({
          timeout: 10000
        });
      }
    );

    test(
      'Authenticated dashboard remains usable on mobile viewport',
      async ({ page }) => {

        const dashboard =
          new DashboardPage(page);

        await page.setViewportSize({
          width: 390,
          height: 844
        });

        await page.goto(
          `${BASE_URL}/dashboard`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await dashboard.validateLoaded();
        await expectNoHorizontalOverflow(page);
      }
    );

    test(
      'Authenticated profile billing and compliance routes remain usable on tablet viewport',
      async ({ page }) => {

        await page.setViewportSize({
          width: 1024,
          height: 768
        });

        const routes = [
          {
            path: '/dashboard/profile',
            url: /\/dashboard\/profile/,
            content: /profile|email|personal/i
          },
          {
            path: '/dashboard/billing',
            url: /\/dashboard\/billing/,
            content: /billing|plan|invoice|transaction|subscription/i
          },
          {
            path: '/dashboard/risk-compliance',
            url: /\/dashboard\/risk-compliance/,
            content: /risk profile|compliance/i
          }
        ];

        for (const route of routes) {
          await page.goto(
            `${BASE_URL}${route.path}`,
            {
              waitUntil: 'domcontentloaded'
            }
          );

          await expect(page).toHaveURL(
            route.url,
            {
              timeout: 15000
            }
          );

          await expect(
            page.locator('body')
          ).toContainText(
            route.content,
            {
              timeout: 15000
            }
          );

          await expectNoHorizontalOverflow(page);
        }
      }
    );

    test(
      'Authenticated deep links with query parameters render expected pages',
      async ({ page }) => {

        const deepLinks = [
          {
            url:
              `${BASE_URL}/dashboard/profile?source=automation`,

            expectedUrl:
              /\/dashboard\/profile/,

            content:
              /profile|personal information|email/i
          },
          {
            url:
              `${BASE_URL}/dashboard/billing?tab=overview`,

            expectedUrl:
              /\/dashboard\/billing/,

            content:
              /billing|current plan|current subscription|plans|history/i
          },
          {
            url:
              `${BASE_URL}/dashboard/risk-compliance?section=risk`,

            expectedUrl:
              /\/dashboard\/risk-compliance/,

            content:
              /risk profile|compliance|investment experience/i
          }
        ];

        for (const deepLink of deepLinks) {
          await page.goto(
            deepLink.url,
            {
              waitUntil: 'domcontentloaded'
            }
          );

          await expect(
            page
          ).toHaveURL(
            deepLink.expectedUrl,
            {
              timeout: 15000
            }
          );

          await expect(
            page
          ).not.toHaveURL(
            /\/login/
          );

          await expect(
            page.locator(
              'body'
            )
          ).toContainText(
            deepLink.content,
            {
              timeout: 15000
            }
          );
        }
      }
    );

    test(
      'Authenticated direct routes tolerate trailing slash and unknown query parameters',
      async ({ page }) => {

        const resilientRoutes = [
          {
            url:
              `${BASE_URL}/dashboard/profile/?unknown=automation-safe-check`,

            expectedUrl:
              /\/dashboard\/profile/,

            content:
              /profile|personal information|email/i
          },
          {
            url:
              `${BASE_URL}/dashboard/billing/?unknown=automation-safe-check`,

            expectedUrl:
              /\/dashboard\/billing/,

            content:
              /billing|current plan|current subscription|plans|history/i
          },
          {
            url:
              `${BASE_URL}/dashboard/risk-compliance/?unknown=automation-safe-check`,

            expectedUrl:
              /\/dashboard\/risk-compliance/,

            content:
              /risk profile|compliance|investment experience/i
          }
        ];

        for (const route of resilientRoutes) {
          await page.goto(
            route.url,
            {
              waitUntil: 'domcontentloaded'
            }
          );

          await expect(
            page
          ).toHaveURL(
            route.expectedUrl,
            {
              timeout: 15000
            }
          );

          await expect(
            page.getByText(
              /this page couldn'?t load|reload to try again/i
            )
          ).not.toBeVisible({
            timeout: 5000
          });

          await expect(
            page.locator(
              'body'
            )
          ).toContainText(
            route.content,
            {
              timeout: 15000
            }
          );
        }
      }
    );

    test(
      'Dashboard footer legal and support links expose usable targets',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/dashboard`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        const footerLinks = [
          /privacy policy/i,
          /terms of service/i,
          /disclosures/i,
          /risk warning/i,
          /contact/i
        ];

        for (const linkName of footerLinks) {
          const link =
            page
              .getByRole(
                'link',
                {
                  name: linkName
                }
              )
              .first();

          await expect(
            link
          ).toBeVisible({
            timeout: 10000
          });

          const href =
            await link.getAttribute(
              'href'
            );

          expect(
            href,
            `${linkName} should have a usable href`
          ).toMatch(
            /^(\/|https?:\/\/)(?!#)/i
          );
        }
      }
    );

    test(
      'Profile menu exposes billing risk compliance and sign out actions',
      async ({ page }) => {

        await safeClick(
          page.getByText(
            'HT',
            {
              exact: true
            }
          ),
          'Open Profile Menu'
        );

        await expect(
          page.getByText(
            /billing/i
          ).first()
        ).toBeVisible({
          timeout: 10000
        });

        await expect(
          page.getByText(
            /risk.*compliance/i
          ).first()
        ).toBeVisible({
          timeout: 10000
        });

        await expect(
          page.getByText(
            /sign out/i
          ).first()
        ).toBeVisible({
          timeout: 10000
        });
      }
    );

    test(
      'Profile menu navigation actions open the expected pages',
      async ({ page }) => {

        const dashboard =
          new DashboardPage(page);

        await dashboard.validateProfileMenuNavigationActions();
      }
    );

    test(
      'Profile menu closes with Escape and outside click',
      async ({ page }) => {

        const dashboard =
          new DashboardPage(page);

        await dashboard.validateProfileMenuDismissal();
      }
    );

    test(
      'Dashboard top navigation tabs are visible',
      async ({ page }) => {

        const topNavigationItems = [
          'Dashboard',
          'Analytics',
          'Portfolio',
          'Accounts',
          'Academy'
        ];

        for (const item of topNavigationItems) {
          await expect(
            page
              .locator(
                'a, button'
              )
              .filter({
                hasText: new RegExp(
                  `^${item}$`,
                  'i'
                )
              })
              .first()
          ).toBeVisible({
            timeout: 10000
          });
        }
      }
    );

    test(
      'Dashboard top navigation links open without load errors',
      async ({ page }) => {

        const dashboard =
          new DashboardPage(page);

        await dashboard.validateTopNavigationRoutes();
      }
    );

    test(
      'Dashboard top navigation destinations render usable content',
      async ({ page }) => {

        const dashboard =
          new DashboardPage(page);

        await dashboard.validateTopNavigationDestinationsRender();
      }
    );

    test(
      'Dashboard top navigation destinations stay usable after refresh',
      async ({ page }) => {

        const dashboard =
          new DashboardPage(page);

        await dashboard.validateTopNavigationDestinationsRefresh();
      }
    );

    test(
      'Dashboard header notification theme and fullscreen controls are healthy',
      async ({ page }) => {

        const dashboard =
          new DashboardPage(page);

        await dashboard.validateHeaderUtilityControls();
      }
    );

    test(
      'Dashboard refresh utility reloads data without ending session',
      async ({ page }) => {

        const dashboard =
          new DashboardPage(page);

        await dashboard.validateRefreshUtilityControl();
      }
    );

    test(
      'Dashboard quick action menu opens without changing session',
      async ({ page }) => {

        const dashboard =
          new DashboardPage(page);

        await dashboard.validateQuickActionControl();
      }
    );

    test(
      'Notification panel opens and closes without disrupting dashboard',
      async ({ page }) => {

        const dashboard =
          new DashboardPage(page);

        await dashboard.validateNotificationPanelBehavior();
      }
    );

    test(
      'Notification panel remains usable after dashboard refresh',
      async ({ page }) => {

        const dashboard =
          new DashboardPage(page);

        await dashboard.validateNotificationPanelAfterRefresh();
      }
    );

    test(
      'Key authenticated routes stay usable after refresh',
      async ({ page }) => {

        const dashboard =
          new DashboardPage(page);

        await dashboard.validateKeyAuthenticatedRoutesRefresh();
      }
    );

    test(
      'Browser back returns from billing to dashboard without ending session',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/dashboard`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await page.goto(
          `${BASE_URL}/dashboard/billing`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await page.goBack({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/dashboard/,
          {
            timeout: 15000
          }
        );

        await expect(
          page
        ).not.toHaveURL(
          /\/login/
        );
      }
    );

    test(
      'Profile menu sign out blocks direct dashboard access',
      async ({ page }) => {

        const dashboard =
          new DashboardPage(page);

        await dashboard.signOutFromProfileMenu();

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
            timeout: 15000
          }
        );
      }
    );
  }
);
