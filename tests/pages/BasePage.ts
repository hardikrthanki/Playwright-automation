import { Page } from '@playwright/test';

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

  getCurrentUrl() {
    return this.page.url();
  }
}
