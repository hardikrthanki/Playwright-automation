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
PAGE OBJECT: OptionsResearchPage

PURPOSE
-------
View option exposure opens Options Research. The page shows a searched
symbol, price action, the option chain, and news. Prices change, so the
checks follow the shape of the data.
============================================================================= */

export class OptionsResearchPage
  extends BasePage {

  async validateLoaded() {
    Logger.info(
      'Validating Options Research'
    );

    await expect(
      this.page
    ).toHaveURL(
      /options-research/,
      {
        timeout: 20000
      }
    );

    await expect(
      this.page.getByRole(
        'heading',
        {
          name: /options research/i
        }
      )
    ).toBeVisible({
      timeout: 20000
    });

    await expect(
      this.page.getByRole(
        'button',
        {
          name: /^analyze$/i
        }
      )
    ).toBeVisible();

    Logger.success(
      'Options Research is open'
    );
  }

  async ensureSymbolResult() {
    const hasResult =
      await this.page.getByText(
        /search result/i
      ).isVisible().catch(
        () => false
      );

    if (
      hasResult
    ) {
      return;
    }

    Logger.info(
      'Searching AAPL on Options Research'
    );

    const input =
      this.page.getByRole(
        'combobox'
      ).or(
        this.page.getByRole(
          'textbox'
        )
      ).first();

    await input.fill(
      'AAPL'
    );

    const choice =
      this.page.getByRole(
        'option',
        {
          name: /AAPL/i
        }
      ).first();

    if (
      await choice.isVisible().catch(
        () => false
      )
    ) {
      await safeClick(
        choice,
        'Select AAPL'
      );
    }

    await safeClick(
      this.page.getByRole(
        'button',
        {
          name: /^analyze$/i
        }
      ),
      'Analyze symbol'
    );
  }

  async validateResearchData() {
    await this.ensureSymbolResult();

    await expect(
      this.page.getByText(
        /search result/i
      )
    ).toBeVisible({
      timeout: 20000
    });

    await expect(
      this.page.locator(
        'main'
      )
    ).toContainText(
      /\$\d[\d,]*(?:\.\d+)?/
    );

    await expect(
      this.page.getByText(
        /price action/i
      )
    ).toBeVisible();

    for (const label of [
      /open/i,
      /prev close/i,
      /day low/i,
      /day high/i,
      /volume/i
    ]) {
      await expect(
        this.page.getByText(
          label
        ).first()
      ).toBeVisible();
    }

    await expect(
      this.page.locator(
        'main'
      )
    ).toContainText(
      /volatility/i
    );

    await expect(
      this.page.getByText(
        /key levels/i
      ).first()
    ).toBeVisible();

    await expect(
      this.page.getByText(
        /events\s*&\s*levels/i
      ).first()
    ).toBeVisible();

    await expect(
      this.page.getByRole(
        'heading',
        {
          name: /option chain/i
        }
      ).or(
        this.page.getByText(
          /option chain/i
        )
      ).first()
    ).toBeVisible();

    await expect(
      this.page.getByRole(
        'columnheader',
        {
          name: /^calls$/i
        }
      )
    ).toBeVisible();

    await expect(
      this.page.getByRole(
        'columnheader',
        {
          name: /^puts$/i
        }
      )
    ).toBeVisible();

    await expect(
      this.page.getByRole(
        'columnheader',
        {
          name: /^strike$/i
        }
      ).first()
    ).toBeVisible();

    await expect(
      this.page.getByText(
        /expiration date|20\d{2}-\d{2}-\d{2}/i
      ).first()
    ).toBeVisible();

    await expect(
      this.page.getByText(
        /strike count/i
      ).first()
    ).toBeVisible();

    await expect(
      this.page.getByText(
        /latest news/i
      ).first()
    ).toBeVisible();

    await expect(
      this.page.getByRole(
        'link',
        {
          name: /view company fundamentals/i
        }
      ).or(
        this.page.getByRole(
          'button',
          {
            name: /view company fundamentals/i
          }
        )
      ).first()
    ).toBeVisible();

    Logger.success(
      'Options Research data is shown'
    );
  }

  async validateChainControls() {
    Logger.info(
      'Validating option chain controls'
    );

    await this.ensureSymbolResult();

    for (const label of [
      /expiration date/i,
      /^show$/i,
      /strike count/i
    ]) {
      await expect(
        this.page.getByText(
          label
        ).first()
      ).toBeVisible();
    }

    const strikeCount =
      this.page.getByText(
        /^strike count$/i
      ).locator(
        'xpath=following::*[@role="combobox"][1]'
      );

    await safeClick(
      strikeCount,
      'Strike count'
    );

    const nextChoice =
      this.page.getByRole(
        'option'
      ).nth(
        1
      );

    if (
      await nextChoice.waitFor({
        state: 'visible',
        timeout: 4000
      }).then(
        () => true
      ).catch(
        () => false
      )
    ) {
      await safeClick(
        nextChoice,
        'Change strike count'
      );
    }

    await expect(
      this.page.getByRole(
        'columnheader',
        {
          name: /^calls$/i
        }
      )
    ).toBeVisible({
      timeout: 15000
    });

    Logger.success(
      'Option chain controls keep the chain visible'
    );
  }
}
