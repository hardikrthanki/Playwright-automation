import {
  expect
} from '@playwright/test';

import { BasePage }
  from './BasePage';

import { safeClick }
  from '../helpers/safeClick';

import { Logger }
  from '../utils/logger';

/* =============================================================================
PAGE OBJECT: EventCalendarPage

PURPOSE
-------
Upcoming Events "View more" opens the month calendar. All, Earnings, and
Dividend change the event list. An event opens that company's fundamentals.
============================================================================= */

export class EventCalendarPage
  extends BasePage {

  async validateLoaded() {
    Logger.info(
      'Validating Event Calendar'
    );

    await expect(
      this.page
    ).toHaveURL(
      /event-calendar/,
      {
        timeout: 20000
      }
    );

    await expect(
      this.page.getByRole(
        'heading',
        {
          name: /event calendar/i
        }
      )
    ).toBeVisible({
      timeout: 20000
    });

    await expect(
      this.page.getByText(
        /earnings and dividend dates/i
      )
    ).toBeVisible();

    await this.waitForEvents();

    Logger.success(
      'Event Calendar is open'
    );
  }

  private filterControl(
    name: 'All' | 'Earnings' | 'Dividend'
  ) {
    const pattern =
      new RegExp(
        `^${name}$`,
        'i'
      );

    return this.page.getByRole(
      'tab',
      {
        name: pattern
      }
    ).or(
      this.page.getByRole(
        'button',
        {
          name: pattern
        }
      )
    ).or(
      this.page.getByText(
        pattern
      )
    ).first();
  }

  private async waitForEvents() {
    await expect(
      this.page.getByText(
        /loading events/i
      )
    ).toBeHidden({
      timeout: 20000
    });

    await expect
      .poll(
        async () =>
          await this.eventsText(),
        {
          timeout: 20000
        }
      )
      .toMatch(
        /earnings|dividend|showing\s+\d+/i
      );
  }

  async showFilter(
    name: 'All' | 'Earnings' | 'Dividend'
  ) {
    Logger.info(
      `Showing ${name} events`
    );

    await safeClick(
      this.filterControl(
        name
      ),
      `Event filter ${name}`
    );

    await this.waitForEvents();

    const text =
      await this.eventsText();

    if (
      name === 'All'
    ) {
      expect(
        text
      ).toMatch(
        /earnings|dividend/i
      );
    }

    if (
      name === 'Earnings'
    ) {
      expect(
        text
      ).toMatch(
        /earnings/i
      );

      expect(
        text
      ).not.toMatch(
        /\bdividend\b/i
      );
    }

    if (
      name === 'Dividend'
    ) {
      expect(
        text
      ).toMatch(
        /dividend/i
      );

      expect(
        text
      ).not.toMatch(
        /\bearnings\b/i
      );
    }

    expect(
      text
    ).toMatch(
      /\b[A-Z]{1,5}\b/
    );

    Logger.success(
      `${name} events are shown`
    );
  }

  async openFirstEvent() {
    Logger.info(
      'Opening the first listed event'
    );

    await this.waitForEvents();

    const heading =
      this.page.getByRole(
        'heading',
        {
          name: /events this month/i
        }
      );

    await expect(
      heading
    ).toBeVisible({
      timeout: 15000
    });

    const symbol =
      heading.locator(
        'xpath=following::*'
      ).filter({
        hasText: /^[A-Z]{1,5}$/
      }).first();

    await expect(
      symbol
    ).toBeVisible({
      timeout: 15000
    });

    const symbolName =
      (
        await symbol.innerText()
      ).trim();

    await safeClick(
      symbol,
      `Open ${symbolName}`
    );

    Logger.success(
      `Opened event for ${symbolName}`
    );

    return symbolName;
  }

  private async eventsText() {
    const heading =
      this.page.getByRole(
        'heading',
        {
          name: /events this month/i
        }
      );

    await expect(
      heading
    ).toBeVisible({
      timeout: 15000
    });

    return heading.evaluate(
      (node) => {
        let current =
          node as HTMLElement | null;

        while (current) {
          const value =
            current.innerText || '';

          if (
            /showing\s+\d+/i.test(
              value
            ) &&
            value.length < 8000
          ) {
            return value;
          }

          current =
            current.parentElement;
        }

        return node.parentElement?.innerText || '';
      }
    );
  }
}
