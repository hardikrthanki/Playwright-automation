import { Page } from '@playwright/test';

import { URLS }
  from '../config/constants';
import { BASE_URL }
  from '../config/testData';

/* ============================================================================
PAGE OBJECT: BasePage

PURPOSE
-------
Parent class for all page objects. Provides shared page navigation,
refresh, wait, and URL helper methods.

============================================================================ */

export class BasePage {

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async wait(ms: number) {
    await this.page.waitForTimeout(ms);
  }

  async refresh() {
    await this.page.reload({
      waitUntil: 'domcontentloaded',
    });
  }

  async navigate(url: string) {
    await this.page.goto(url, {
      waitUntil: 'domcontentloaded',
    });
  }

  async dismissMarketingOverlays() {
    const overlayButtons = [
      this.page.getByRole(
        'button',
        {
        name: /accept( all)?|essential only/i
        }
      ).first(),
      this.page.getByRole(
        'button',
        {
          name: /dismiss announcement/i
        }
      ).first()
    ];

    for (const button of overlayButtons) {
      const isVisible =
        await button.isVisible().catch(
          () => false
        );

      if (!isVisible) {
        continue;
      }

      await button.click({
        timeout: 3000
      }).catch(
        () => undefined
      );
    }
  }

  getCurrentUrl() {
    return this.page.url();
  }

  appUrl(
    path: string
  ) {
    try {
      const currentUrl =
        new URL(
          this.page.url()
        );
      const appUrlBase =
        new URL(
          BASE_URL
        );

      if (
        currentUrl.origin ===
        appUrlBase.origin
      ) {
        return new URL(
          path,
          currentUrl
        ).toString();
      }
    } catch {
      // Fall through to BASE_URL when the current tab is about:blank or Stripe.
    }

    return new URL(
      path,
      BASE_URL
    ).toString();
  }

  async ensureOnApp() {
    const currentUrl =
      this.page.url();

    if (
      /^https?:\/\//i.test(
        currentUrl
      ) &&
      !/stripe\.com/i.test(
        currentUrl
      )
    ) {
      return;
    }

    await this.page.goto(
      this.appUrl(
        URLS.DASHBOARD
      ),
      {
        waitUntil: 'domcontentloaded'
      }
    );
  }
}
