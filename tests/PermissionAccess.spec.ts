import {
  expect,
  Page,
  test
} from '@playwright/test';

import {
  BASE_URL
} from './config/testData';

import { LoginPage }
  from './pages/LoginPage';

/* =============================================================================
TEST SUITE: Permission Access

PURPOSE
-------
Validates that users with a permission can use the related route/action, while
users without that permission cannot access the same functionality.

RUN
---
$env:PERMISSION_TEST_ENABLED="true"
$env:PERMISSION_ALLOWED_EMAIL="allowed@example.com"
$env:PERMISSION_ALLOWED_PASSWORD="password"
$env:PERMISSION_RESTRICTED_EMAIL="restricted@example.com"
$env:PERMISSION_RESTRICTED_PASSWORD="password"
npm run test:controlled:permissions -- --headed

NOTES
-----
These tests require two prepared users whose permissions differ in the app.
============================================================================= */

type PermissionUser = {
  email?: string;
  password?: string;
};

type PermissionScenario = {
  name: string;
  route: string;
  allowedMarker: RegExp;
  restrictedMarker?: RegExp;
  action?: RegExp;
};

const permissionTestEnabled =
  process.env.PERMISSION_TEST_ENABLED ===
  'true';

const allowedUser: PermissionUser = {
  email:
    process.env.PERMISSION_ALLOWED_EMAIL,

  password:
    process.env.PERMISSION_ALLOWED_PASSWORD
};

const restrictedUser: PermissionUser = {
  email:
    process.env.PERMISSION_RESTRICTED_EMAIL,

  password:
    process.env.PERMISSION_RESTRICTED_PASSWORD
};

const permissionScenarios: PermissionScenario[] = [
  {
    name: 'Billing access',
    route: '/dashboard/billing',
    allowedMarker: /billing|current plan|current subscription|plans|history/i,
    restrictedMarker: /login|access denied|not authorized|permission|forbidden/i,
    action: /manage subscription|manage billing|manage payment methods|billing portal/i
  },
  {
    name: 'Risk and Compliance access',
    route: '/dashboard/risk-compliance',
    allowedMarker: /risk profile|compliance|investment experience/i,
    restrictedMarker: /login|access denied|not authorized|permission|forbidden/i
  },
  {
    name: 'Profile access',
    route: '/dashboard/profile',
    allowedMarker: /profile|personal information|email|change password/i,
    restrictedMarker: /login|access denied|not authorized|permission|forbidden/i
  }
];

function hasConfiguredUsers() {
  return Boolean(
    allowedUser.email &&
    allowedUser.password &&
    restrictedUser.email &&
    restrictedUser.password
  );
}

async function loginAs(
  page: Page,
  user: PermissionUser
) {
  const login =
    new LoginPage(page);

  await login.login(
    user.email!,
    user.password!
  );
}

async function expectRouteAccess(
  page: Page,
  scenario: PermissionScenario
) {
  await page.goto(
    `${BASE_URL}${scenario.route}`,
    {
      waitUntil: 'domcontentloaded'
    }
  );

  await expect(
    page.getByText(
      scenario.allowedMarker
    ).first()
  ).toBeVisible({
    timeout: 15000
  });
}

async function expectRouteBlocked(
  page: Page,
  scenario: PermissionScenario
) {
  await page.goto(
    `${BASE_URL}${scenario.route}`,
    {
      waitUntil: 'domcontentloaded'
    }
  );

  await expect(
    page
      .getByText(
        scenario.restrictedMarker ??
        /login|access denied|not authorized|permission|forbidden/i
      )
      .first()
  ).toBeVisible({
    timeout: 15000
  });
}

if (
  permissionTestEnabled &&
  hasConfiguredUsers()
) {
  test.describe(
    'Permission Access',
    () => {

    test.describe.configure({
      timeout: 120000
    });

    for (const scenario of permissionScenarios) {
      test(
        `Allowed user can access ${scenario.name}`,
        async ({ page }) => {
          await loginAs(
            page,
            allowedUser
          );

          await expectRouteAccess(
            page,
            scenario
          );

          if (scenario.action) {
            await expect(
              page
                .getByRole(
                  'button',
                  {
                    name: scenario.action
                  }
                )
                .or(
                  page.getByRole(
                    'link',
                    {
                      name: scenario.action
                    }
                  )
                )
                .first()
            ).toBeVisible({
              timeout: 10000
            });
          }
        }
      );

      test(
        `Restricted user cannot access ${scenario.name}`,
        async ({ page }) => {
          await loginAs(
            page,
            restrictedUser
          );

          await expectRouteBlocked(
            page,
            scenario
          );
        }
      );
    }
    }
  );
}
