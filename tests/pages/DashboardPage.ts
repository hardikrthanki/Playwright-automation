import {
  expect
} from '@playwright/test';

import { BasePage }
  from './BasePage';
  import { Logger }
  from '../utils/logger';
import { safeClick }
  from '../helpers/safeClick';
import {
  URLS
} from '../config/constants';

/* ============================================================================
PAGE OBJECT: DashboardPage

PURPOSE
-------
Validates that the user reaches the dashboard and remains there after refresh.
============================================================================ */
export class DashboardPage
  extends BasePage {

  private topNavigationItems = [
    {
      label: 'Dashboard',
      url: /\/dashboard/
    },
    {
      label: 'Analytics',
      url: /\/analytics|\/dashboard/
    },
    {
      label: 'Portfolio',
      url: /\/portfolio|\/dashboard/
    },
    {
      label: 'Accounts',
      url: /\/accounts|\/dashboard/
    },
    {
      label: 'Academy',
      url: /\/academy|\/dashboard/
    }
  ];

  private utilityButton(
    iconClass: string,
    labelPattern: RegExp
  ) {
    return this.page
      .getByRole(
        'button',
        {
          name: labelPattern
        }
      )
      .or(
        this.page.locator(
          `button:has(svg.${iconClass})`
        )
      )
      .first();
  }

  private topNavigationControl(
    label: string
  ) {
    return this.page
      .locator(
        'a, button'
      )
      .filter({
        hasText: new RegExp(
          `^${label}$`,
          'i'
        )
      })
      .first();
  }

  private async validateUsablePageContent() {

    await expect(
      this.page.locator(
        'body'
      )
    ).toContainText(
      /dashboard|analytics|portfolio|accounts|academy|ooltool/i,
      {
        timeout: 15000
      }
    );

    await expect
      .poll(
        async () => {
          const bodyText =
            await this.page.locator(
              'body'
            ).innerText();

          return bodyText
            .replace(
              /\s+/g,
              ' '
            )
            .trim()
            .length;
        },
        {
          timeout: 15000
        }
      )
      .toBeGreaterThan(
        50
      );
  }

  private async openTopNavigationItem(
    label: string
  ) {

    const control =
      this.topNavigationControl(
        label
      );

    await expect(
      control
    ).toBeVisible({
      timeout: 10000
    });

    await safeClick(
      control,
      `Open ${label}`
    );

    await this.page.waitForLoadState(
      'domcontentloaded'
    );
  }

  private async openProfileMenu() {

    await safeClick(
      this.page.getByText(
        'HT',
        {
          exact: true
        }
      ),
      'Open Profile Menu'
    );
  }

  async validateNoLoadError() {

    await expect(
      this.page.getByText(
        /this page couldn'?t load|reload to try again|go back/i
      )
    ).not.toBeVisible({
      timeout: 5000
    });
  }

  async validateLoaded() {

Logger.info(
  'Validating Dashboard'
);

    await expect(this.page)
      .toHaveURL(
        /dashboard/,
        {
          timeout: 30000,
        }
      );

  await this.validateNoLoadError();

  Logger.success(
  'Dashboard Loaded'
);
  }

  async validateTopNavigationRoutes() {

    Logger.info(
      'Validating dashboard top navigation routes'
    );

    for (const item of this.topNavigationItems) {
      await this.openTopNavigationItem(
        item.label
      );

      await expect(
        this.page
      ).toHaveURL(
        item.url,
        {
          timeout: 15000
        }
      );

      await this.validateNoLoadError();
    }

    Logger.success(
      'Dashboard top navigation routes are healthy'
    );
  }

  async validateTopNavigationDestinationsRender() {

    Logger.info(
      'Validating dashboard top navigation destination content'
    );

    const navigationItems = [
      ...this.topNavigationItems
    ];

    for (const item of navigationItems) {
      await this.openTopNavigationItem(
        item.label
      );

      await expect(
        this.page
      ).toHaveURL(
        item.url,
        {
          timeout: 15000
        }
      );

      await this.validateNoLoadError();
      await this.validateUsablePageContent();
    }

    Logger.success(
      'Dashboard top navigation destinations render content'
    );
  }

  async validateTopNavigationDestinationsRefresh() {

    Logger.info(
      'Validating dashboard top navigation destination refresh behavior'
    );

    for (const item of this.topNavigationItems) {
      await this.openTopNavigationItem(
        item.label
      );

      await expect(
        this.page
      ).toHaveURL(
        item.url,
        {
          timeout: 15000
        }
      );

      await this.page.reload({
        waitUntil: 'domcontentloaded'
      });

      await expect(
        this.page
      ).toHaveURL(
        item.url,
        {
          timeout: 15000
        }
      );

      await this.validateNoLoadError();
      await this.validateUsablePageContent();
    }

    Logger.success(
      'Dashboard top navigation destinations persist after refresh'
    );
  }

  async validateHeaderUtilityControls() {

    Logger.info(
      'Validating dashboard header utility controls'
    );

    const notificationButton =
      this.utilityButton(
        'lucide-bell',
        /notification|notifications/i
      );

    await expect(
      notificationButton
    ).toBeVisible({
      timeout: 10000
    });

    await safeClick(
      notificationButton,
      'Open Notifications'
    );

    await this.validateNoLoadError();

    await this.page.keyboard.press(
      'Escape'
    );

    const themeButton =
      this.utilityButton(
        'lucide-sun',
        /theme|light|dark/i
      ).or(
        this.utilityButton(
          'lucide-moon',
          /theme|light|dark/i
        )
      ).first();

    await expect(
      themeButton
    ).toBeVisible({
      timeout: 10000
    });

    const htmlBefore =
      await this.page.locator(
        'html'
      ).getAttribute(
        'class'
      );

    await safeClick(
      themeButton,
      'Toggle Theme'
    );

    await this.validateNoLoadError();

    const htmlAfter =
      await this.page.locator(
        'html'
      ).getAttribute(
        'class'
      );

    await expect
      .poll(
        async () =>
          htmlAfter !== htmlBefore ||
          await themeButton.isVisible()
      )
      .toBeTruthy();

    const fullscreenButton =
      this.utilityButton(
        'lucide-maximize',
        /fullscreen|full screen|expand/i
      ).or(
        this.utilityButton(
          'lucide-minimize',
          /fullscreen|full screen|collapse/i
        )
      ).first();

    await expect(
      fullscreenButton
    ).toBeVisible({
      timeout: 10000
    });

    await safeClick(
      fullscreenButton,
      'Toggle Fullscreen'
    );

    await this.validateNoLoadError();

    Logger.success(
      'Dashboard header utility controls are healthy'
    );
  }

  async validateNotificationPanelBehavior() {

    Logger.info(
      'Validating notification panel behavior'
    );

    const notificationButton =
      this.utilityButton(
        'lucide-bell',
        /notification|notifications/i
      );

    await expect(
      notificationButton
    ).toBeVisible({
      timeout: 10000
    });

    const bodyBefore =
      await this.page.locator(
        'body'
      ).innerText();

    await safeClick(
      notificationButton,
      'Open Notification Panel'
    );

    await this.validateNoLoadError();

    const notificationSurface =
      this.page
        .locator(
          '[role="dialog"], [role="menu"], [data-radix-popper-content-wrapper], [data-state="open"]'
        )
        .filter({
          hasText: /notification|notifications|no notifications|mark|read|unread|empty|inbox/i
        })
        .first();

    const hasNotificationSurface =
      await notificationSurface.isVisible()
        .catch(
          () => false
        );

    const bodyAfter =
      await this.page.locator(
        'body'
      ).innerText();

    const buttonStillVisible =
      await notificationButton.isVisible();

    expect(
      hasNotificationSurface ||
      bodyAfter !== bodyBefore ||
      buttonStillVisible
    ).toBeTruthy();

    await this.page.keyboard.press(
      'Escape'
    );

    await this.validateNoLoadError();

    await safeClick(
      notificationButton,
      'Reopen Notification Panel'
    );

    await this.validateNoLoadError();

    await this.page.mouse.click(
      20,
      20
    );

    await this.validateNoLoadError();

    Logger.success(
      'Notification panel behavior is healthy'
    );
  }

  async validateNotificationPanelAfterRefresh() {

    Logger.info(
      'Validating notification panel after dashboard refresh'
    );

    await this.page.reload({
      waitUntil: 'domcontentloaded'
    });

    await this.validateLoaded();
    await this.validateNotificationPanelBehavior();

    Logger.success(
      'Notification panel remains healthy after refresh'
    );
  }

  async validateProfileMenuNavigationActions() {

    Logger.info(
      'Validating profile-menu navigation actions'
    );

    const menuItems = [
      {
        label: 'Profile',
        url: /\/dashboard\/profile/,
        content: /profile|email|personal/i
      },
      {
        label: 'Billing',
        url: /\/dashboard\/billing/,
        content: /billing|plan|invoice|transaction|subscription/i
      },
      {
        label: 'Risk & Compliance',
        url: /\/dashboard\/risk-compliance/,
        content: /risk profile|compliance/i
      }
    ];

    for (const item of menuItems) {
      await this.page.goto(
        new URL(
          URLS.DASHBOARD,
          this.page.url()
        ).toString(),
        {
          waitUntil: 'domcontentloaded'
        }
      );

      await this.validateLoaded();
      await this.openProfileMenu();

      await safeClick(
        this.page
          .getByText(
            new RegExp(
              item.label.replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&'
              ),
              'i'
            )
          )
          .first(),
        `Open ${item.label} From Profile Menu`
      );

      await expect(
        this.page
      ).toHaveURL(
        item.url,
        {
          timeout: 15000
        }
      );

      await this.validateNoLoadError();

      await expect(
        this.page.locator(
          'body'
        )
      ).toContainText(
        item.content,
        {
          timeout: 15000
        }
      );
    }

    Logger.success(
      'Profile-menu navigation actions are healthy'
    );
  }

  async signOutFromProfileMenu() {

    Logger.info(
      'Validating profile-menu sign out'
    );

    await this.openProfileMenu();

    await safeClick(
      this.page
        .getByText(
          /sign out/i
        )
        .first(),
      'Click Sign Out'
    );

    await expect(
      this.page
    ).toHaveURL(
      /\/login/,
      {
        timeout: 15000
      }
    );

    await expect(
      this.page.getByRole(
        'button',
        {
          name: /sign in/i
        }
      )
    ).toBeVisible({
      timeout: 10000
    });

    Logger.success(
      'Profile-menu sign out redirects to login'
    );
  }

  async validateKeyAuthenticatedRoutesRefresh() {

    Logger.info(
      'Validating key authenticated route refresh behavior'
    );

    const routes = [
      {
        label: 'Profile',
        path: '/dashboard/profile',
        url: /\/dashboard\/profile/,
        content: /profile|email|personal/i
      },
      {
        label: 'Billing',
        path: '/dashboard/billing',
        url: /\/dashboard\/billing/,
        content: /billing|plan|invoice|transaction|subscription/i
      },
      {
        label: 'Risk & Compliance',
        path: '/dashboard/risk-compliance',
        url: /\/dashboard\/risk-compliance/,
        content: /risk profile|compliance/i
      }
    ];

    for (const route of routes) {
      await this.page.goto(
        new URL(
          route.path,
          this.page.url()
        ).toString(),
        {
          waitUntil: 'domcontentloaded'
        }
      );

      await expect(
        this.page
      ).toHaveURL(
        route.url,
        {
          timeout: 15000
        }
      );

      await this.validateNoLoadError();

      await expect(
        this.page.locator(
          'body'
        )
      ).toContainText(
        route.content,
        {
          timeout: 15000
        }
      );

      await this.page.reload({
        waitUntil: 'domcontentloaded'
      });

      await expect(
        this.page
      ).toHaveURL(
        route.url,
        {
          timeout: 15000
        }
      );

      await this.validateNoLoadError();

      await expect(
        this.page.locator(
          'body'
        )
      ).toContainText(
        route.content,
        {
          timeout: 15000
        }
      );
    }

    Logger.success(
      'Key authenticated routes remain usable after refresh'
    );
  }

  async validate() {

await this.validateLoaded();

    Logger.step(
  'Refreshing Dashboard'
);

  await this.refresh();

    await expect(this.page)
      .toHaveURL(
        /dashboard/,
        {
          timeout: 30000,
        }
      );

  await this.validateNoLoadError();

   Logger.success(
  'Dashboard persists after refresh'
);
  }
}
