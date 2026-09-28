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
PAGE OBJECT: CompanyFundamentalsPage

PURPOSE
-------
A calendar event opens one company. Search loads a symbol, and Overview,
Valuation, Earnings, Dividends, Finance, and Analyze options stay on that
company.
============================================================================= */

const TAB_CONTENT: Record<string, RegExp> = {
  Overview:
    /about the company|price history|market cap|52-week|p\/e/i,
  Valuation:
    /valuation|multiple|book|fair value|p\/b|enterprise/i,
  Earnings:
    /earnings|eps|revenue|income/i,
  Dividends:
    /dividend|yield|payout|ex-div/i
};

export class CompanyFundamentalsPage
  extends BasePage {

  async openFromEvent(
    symbol: string
  ) {
    const fundamentals =
      this.page.getByRole(
        'heading',
        {
          name: /company fundamentals/i
        }
      );

    const equityResearch =
      this.page.getByRole(
        'heading',
        {
          name: /equity research/i
        }
      );

    await expect(
      fundamentals.or(
        equityResearch
      )
    ).toBeVisible({
      timeout: 20000
    });

    if (
      await equityResearch.isVisible().catch(
        () => false
      )
    ) {
      const input =
        this.page.getByRole(
          'combobox',
          {
            name: /search company name or symbol|search symbol/i
          }
        );

      await input.fill(
        symbol
      );

      const choice =
        this.page.getByRole(
          'option',
          {
            name: new RegExp(
              symbol,
              'i'
            )
          }
        ).first();

      const choiceReady =
        await choice.waitFor({
          state: 'visible',
          timeout: 4000
        }).then(
          () => true
        ).catch(
          () => false
        );

      if (
        choiceReady
      ) {
        await safeClick(
          choice,
          `Select ${symbol}`
        );
      }

      await safeClick(
        this.page.getByRole(
          'button',
          {
            name: /^analyze$/i
          }
        ),
        `Analyze ${symbol}`
      );

      const fundamentalsLink =
        this.page.getByRole(
          'link',
          {
            name: /company fundamentals/i
          }
        );

      if (
        await fundamentalsLink.isVisible({
          timeout: 15000
        }).catch(
          () => false
        )
      ) {
        await safeClick(
          fundamentalsLink,
          'Open company fundamentals'
        );
      }
    }
  }

  async validateLoaded(
    symbol: string
  ) {
    Logger.info(
      `Validating fundamentals for ${symbol}`
    );

    await expect(
      this.page.getByRole(
        'heading',
        {
          name: /company fundamentals|equity research/i
        }
      ).first()
    ).toBeVisible({
      timeout: 20000
    });

    await expect(
      this.page.getByText(
        new RegExp(
          `\\b${symbol}\\b`
        )
      ).first()
    ).toBeVisible({
      timeout: 15000
    });

    await expect(
      this.page.getByText(
        /\$\d[\d,]*(?:\.\d+)?/
      ).first()
    ).toBeVisible();

    Logger.success(
      `Fundamentals are open for ${symbol}`
    );
  }

  async searchSymbol(
    symbol: string
  ) {
    Logger.info(
      `Searching symbol ${symbol}`
    );

    const input =
      this.page.getByPlaceholder(
        /search symbol/i
      ).or(
        this.page.getByRole(
          'textbox',
          {
            name: /search symbol/i
          }
        )
      ).first();

    await input.fill(
      symbol
    );

    await safeClick(
      this.page.getByRole(
        'button',
        {
          name: /^search$/i
        }
      ),
      `Search ${symbol}`
    );

    await this.validateLoaded(
      symbol
    );

    Logger.success(
      `Search loaded ${symbol}`
    );
  }

  async openDetailTab(
    name: 'Overview' | 'Valuation' | 'Earnings' | 'Dividends'
  ) {
    Logger.info(
      `Opening ${name}`
    );

    const pattern =
      new RegExp(
        `^${name}$`,
        'i'
      );

    const tab =
      this.page.getByRole(
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
      ).first();

    await safeClick(
      tab,
      name
    );

    await expect(
      this.page.locator(
        'main'
      )
    ).toContainText(
      TAB_CONTENT[name],
      {
        timeout: 15000
      }
    );

    Logger.success(
      `${name} is shown`
    );
  }

  async openRelatedView(
    name: 'Finance' | 'Analyze options' | 'Event calendar',
    expected: RegExp
  ) {
    Logger.info(
      `Opening ${name}`
    );

    await safeClick(
      this.page.getByRole(
        'link',
        {
          name: new RegExp(
            name,
            'i'
          )
        }
      ).or(
        this.page.getByRole(
          'button',
          {
            name: new RegExp(
              name,
              'i'
            )
          }
        )
      ).first(),
      name
    );

    await expect(
      this.page.locator(
        'main'
      )
    ).toContainText(
      expected,
      {
        timeout: 20000
      }
    );

    Logger.success(
      `${name} is shown`
    );
  }
}
