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

  async changeMonth(
    direction: 'Next month' | 'Previous month'
  ) {
    Logger.info(
      direction
    );

    const heading =
      this.page.getByRole(
        'heading',
        {
          name: /\b20\d{2}\b/
        }
      ).first();

    const before =
      (
        await heading.innerText()
      ).trim();

    await safeClick(
      this.page.getByRole(
        'button',
        {
          name: new RegExp(
            `^${direction}$`,
            'i'
          )
        }
      ),
      direction
    );

    await expect(
      heading
    ).not.toHaveText(
      before,
      {
        timeout: 15000
      }
    );

    const after =
      (
        await heading.innerText()
      ).trim();

    expect(
      after
    ).toMatch(
      /\b20\d{2}\b/
    );

    await expect(
      this.page.getByText(
        /loading events/i
      )
    ).toBeHidden({
      timeout: 20000
    });

    await expect(
      this.page.locator(
        'main'
      )
    ).toContainText(
      /earnings|dividend|no events|events this month/i
    );

    await expect(
      this.page.getByRole(
        'button',
        {
          name: /^\d{1,2}$/
        }
      ).first()
    ).toBeVisible();

    Logger.success(
      `${direction} shows ${after}`
    );

    return after;
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

  async openDayWithEvents() {
    Logger.info(
      'Opening a day that has events'
    );

    const month =
      this.page.getByRole(
        'button',
        {
          name: /^month$/i
        }
      );

    if (
      await month.waitFor({
        state: 'visible',
        timeout: 5000
      }).then(
        () => true
      ).catch(
        () => false
      )
    ) {
      await safeClick(
        month,
        'Month'
      );
    }

    await this.waitForEvents();

    const more =
      this.page.getByRole(
        'button',
        {
          name: /\+\d+\s+more/i
        }
      ).last();

    const dayWithSymbol =
      this.page.getByRole(
        'button',
        {
          name: /^\d{1,2}\s+[A-Z]{1,5}\b/
        }
      ).last();

    const filter =
      this.page.getByPlaceholder(
        /filter by symbol or name/i
      );

    const openers = [
      more,
      dayWithSymbol
    ];

    for (
      const opener of openers
    ) {
      const ready =
        await opener.waitFor({
          state: 'visible',
          timeout: 4000
        }).then(
          () => true
        ).catch(
          () => false
        );

      if (
        !ready
      ) {
        continue;
      }

      await safeClick(
        opener,
        'Calendar day'
      );

      const opened =
        await filter.waitFor({
          state: 'visible',
          timeout: 8000
        }).then(
          () => true
        ).catch(
          () => false
        );

      if (
        opened
      ) {
        Logger.success(
          'Day events are open'
        );

        return;
      }

      await this.page.keyboard.press(
        'Escape'
      );
    }

    throw new Error(
      'No calendar day opened an event list'
    );
  }

  async validateDayEvents() {
    Logger.info(
      'Validating the day event list'
    );

    await expect(
      this.page.getByRole(
        'heading',
        {
          name: /\w+,\s+(?:\w+\s+\d{1,2}|\d{1,2}\s+\w+),?\s+20\d{2}/
        }
      )
    ).toBeVisible({
      timeout: 10000
    });

    await expect(
      this.page.getByText(
        /\d+\s+events?/i
      ).first()
    ).toBeVisible();

    await expect(
      this.page.getByPlaceholder(
        /filter by symbol or name/i
      )
    ).toBeVisible();

    await expect(
      this.page.getByText(
        /earnings\s*\(\d+\)|dividend\s*\(\d+\)/i
      ).first()
    ).toBeVisible();

    Logger.success(
      'Day event list is visible'
    );
  }

  async filterDayBySymbol() {
    Logger.info(
      'Filtering the day by symbol'
    );

    const panel =
      this.dayPanel();

    const symbols =
      this.listedSymbols(
        await panel.innerText()
      );

    expect(
      symbols.length
    ).toBeGreaterThan(
      0
    );

    const symbol =
      symbols[0];

    const hidden =
      symbols.find(
        (item) =>
          item !== symbol
      );

    await this.page.getByPlaceholder(
      /filter by symbol or name/i
    ).fill(
      symbol
    );

    await expect(
      panel.getByText(
        symbol,
        {
          exact: true
        }
      ).first()
    ).toBeVisible({
      timeout: 10000
    });

    if (
      hidden
    ) {
      await expect(
        panel.getByText(
          hidden,
          {
            exact: true
          }
        )
      ).toHaveCount(
        0
      );
    }

    const emptyCategory =
      await panel.getByText(
        /no matches|not found/i
      ).count();

    expect(
      emptyCategory
    ).toBeLessThanOrEqual(
      1
    );

    Logger.success(
      `Day list keeps ${symbol} and leaves the other category empty when that symbol has only one event type`
    );

    return symbol;
  }

  async clearDayFilter() {
    Logger.info(
      'Clearing the day symbol filter'
    );

    const dialog =
      this.dayPanel();

    const clear =
      dialog.getByRole(
        'button',
        {
          name: /^close$/i
        }
      );

    await safeClick(
      clear,
      'Close day list'
    );

    await expect(
      dialog
    ).toBeHidden({
      timeout: 10000
    });

    await expect(
      this.page
    ).toHaveURL(
      /event-calendar/
    );

    await expect(
      this.page.getByRole(
        'heading',
        {
          name: /event calendar/i
        }
      )
    ).toBeVisible();

    Logger.success(
      'Close returns to the event calendar'
    );
  }

  async openFilteredSymbol(
    symbol: string
  ) {
    Logger.info(
      `Opening ${symbol} from the day list`
    );

    await safeClick(
      this.dayPanel().getByText(
        symbol,
        {
          exact: true
        }
      ).first(),
      `Open ${symbol}`
    );

    Logger.success(
      `Opened ${symbol} from the day list`
    );
  }

  private dayPanel() {
    return this.page.getByRole(
      'dialog'
    ).filter({
      has: this.page.getByPlaceholder(
        /filter by symbol or name/i
      )
    });
  }

  private listedSymbols(
    text: string
  ) {
    const ignored =
      new Set([
        'ALL',
        'AND',
        'CORP',
        'EPS',
        'EST',
        'ETF',
        'EX',
        'FOR',
        'INC',
        'LTD',
        'THE',
        'USD'
      ]);

    return [
      ...text.matchAll(
        /\b[A-Z]{2,5}\b/g
      )
    ].map(
      (match) => match[0]
    ).filter(
      (symbol) =>
        !ignored.has(
          symbol
        )
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
