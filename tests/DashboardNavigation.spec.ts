import {
  expect,
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
