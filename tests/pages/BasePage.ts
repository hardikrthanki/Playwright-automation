import { Page } from '@playwright/test';

/* ============================================================================
   BASE PAGE

   Parent class for all Page Objects.

   Common reusable methods should be added here
   instead of duplicating them across pages.
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