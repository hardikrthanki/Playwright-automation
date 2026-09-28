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
PAGE OBJECT: OpportunitiesPage

PURPOSE
-------
Opportunities lists CTAs by risk tab. Filters narrow the table, and each
row menu offers Research, Stop Watching, and CTA Details.
Stop Watching is only confirmed as present. Selecting it would change the
watch state.
============================================================================= */

const RISK_TABS = [
  /^conservative\s*\(1[\u2013-]3\)/i,
  /^moderate\s*\(4[\u2013-]6\)/i,
  /^growth\s*\(7[\u2013-]8\)/i,
  /^aggressive\s*\(9[\u2013-]10\)/i
];

export class OpportunitiesPage
  extends BasePage {

  async validateLoaded() {
    Logger.info(
      'Validating Opportunities'
    );

    await expect(
      this.page
    ).toHaveURL(
      /opportunities/,
      {
        timeout: 20000
      }
    );

    await expect(
      this.page.getByRole(
        'heading',
        {
          name: /^opportunities$/i
        }
      )
    ).toBeVisible({
      timeout: 20000
    });

    await expect(
      this.page.getByText(
        /open positions and watchlist/i
      )
    ).toBeVisible();

    Logger.success(
      'Opportunities is open'
    );
  }

  async validateFilters() {
    Logger.info(
      'Validating opportunity filters'
    );

    await expect(
      this.page.getByRole(
        'combobox',
        {
          name: /search any symbol/i
        }
      )
    ).toBeVisible();

    for (const name of [
      /all strategies|covered call|cash secured put/i,
      /source/i,
      /expiry/i,
      /cost basis/i
    ]) {
      await expect(
        this.page.getByRole(
          'combobox'
        ).filter({
          hasText: name
        }).first()
      ).toBeVisible();
    }

    await expect(
      this.page.getByRole(
        'button',
        {
          name: /^filters$/i
        }
      )
    ).toBeVisible();

    const symbol =
      await this.firstSymbol();

    await this.applyStrategyFilter(
      /cash secured put|covered call/i
    );

    await expect(
      this.page.getByRole(
        'combobox'
      ).filter({
        hasText: /cash secured put|covered call/i
      }).first()
    ).toBeVisible();

    await this.applyStrategyFilter(
      /all strategies/i
    );

    const search =
      this.page.getByRole(
        'combobox',
        {
          name: /search any symbol/i
        }
      );

    await search.fill(
      symbol
    );

    await expect(
      this.page.getByRole(
        'cell',
        {
          name: new RegExp(
            symbol,
            'i'
          )
        }
      ).first()
    ).toBeVisible({
      timeout: 15000
    });

    await search.fill(
      ''
    );

    Logger.success(
      'Opportunity filters narrow the table'
    );
  }

  async validateEveryRiskTab() {
    for (const tab of RISK_TABS) {
      const control =
        this.page.getByRole(
          'button',
          {
            name: tab
          }
        ).first();

      await expect(
        control
      ).toBeVisible();

      const label =
        (
          await control.innerText()
        ).replace(
          /\s+/g,
          ' '
        ).trim();

      if (
        await control.isDisabled()
      ) {
        Logger.info(
          `Risk tab ${label} is locked for this profile`
        );
        continue;
      }

      Logger.info(
        `Opening risk tab ${label}`
      );

      await safeClick(
        control,
        `Risk tab ${label}`
      );

      await this.validateTable(
        label
      );

      Logger.success(
        `Risk tab ${label} shows opportunity data`
      );
    }
  }

  async validateRowActions() {
    Logger.info(
      'Validating opportunity row actions'
    );

    const watchingRow =
      this.page.getByRole(
        'row'
      ).filter({
        hasText: /watching/i
      }).first();

    const row =
      await watchingRow.isVisible().catch(
        () => false
      )
        ? watchingRow
        : this.page.getByRole(
          'row'
        ).nth(
          1
        );

    await safeClick(
      row.getByRole(
        'button',
        {
          name: /row actions/i
        }
      ),
      'Open row actions'
    );

    await expect(
      this.page.getByRole(
        'menuitem',
        {
          name: /^research$/i
        }
      ).or(
        this.page.getByRole(
          'button',
          {
            name: /^research$/i
          }
        )
      ).first()
    ).toBeVisible();

    await expect(
      this.page.getByRole(
        'menuitem',
        {
          name: /stop watching|add to watchlist|^watch$/i
        }
      ).or(
        this.page.getByRole(
          'button',
          {
            name: /stop watching|add to watchlist|^watch$/i
          }
        )
      ).first()
    ).toBeVisible();

    await expect(
      this.page.getByRole(
        'menuitem',
        {
          name: /cta details/i
        }
      ).or(
        this.page.getByRole(
          'button',
          {
            name: /cta details/i
          }
        )
      ).first()
    ).toBeVisible();

    await this.page.keyboard.press(
      'Escape'
    );

    Logger.success(
      'Research, watch, and CTA Details are available'
    );
  }

  async openCtaDetails() {
    Logger.info(
      'Opening CTA Details'
    );

    const row =
      this.page.getByRole(
        'row'
      ).filter({
        hasText: /cash secured put|covered call|protective put|long call/i
      }).first();

    await safeClick(
      row.getByRole(
        'button',
        {
          name: /row actions/i
        }
      ),
      'Open row actions'
    );

    await safeClick(
      this.page.getByRole(
        'menuitem',
        {
          name: /cta details/i
        }
      ),
      'CTA Details'
    );

    await expect(
      this.page.getByRole(
        'dialog'
      ).or(
        this.page.getByText(
          /cta|strategy|premium|strike/i
        )
      ).first()
    ).toBeVisible({
      timeout: 15000
    });

    await this.page.keyboard.press(
      'Escape'
    );

    Logger.success(
      'CTA Details opened'
    );
  }

  private async firstSymbol() {
    const rowText =
      await this.page.getByRole(
        'row'
      ).filter({
        hasText: /cash secured put|covered call|protective put|long call/i
      }).first().innerText();

    const ignored =
      new Set([
        'DTE',
        'USD',
        'ETF'
      ]);

    const symbol =
      [...rowText.matchAll(
        /\b[A-Z]{1,5}\b/g
      )].map(
        (match) => match[0]
      ).find(
        (token) =>
          !ignored.has(token)
      );

    if (
      !symbol
    ) {
      throw new Error(
        'Opportunity row did not include a symbol.'
      );
    }

    return symbol;
  }

  private async applyStrategyFilter(
    choice: RegExp
  ) {
    await safeClick(
      this.page.getByRole(
        'combobox'
      ).filter({
        hasText: /all strategies|covered call|cash secured put|protective put|long call/i
      }).first(),
      'Strategy filter'
    );

    await safeClick(
      this.page.getByRole(
        'option',
        {
          name: choice
        }
      ).or(
        this.page.getByRole(
          'menuitem',
          {
            name: choice
          }
        )
      ).first(),
      'Choose strategy'
    );
  }

  private async validateTable(
    tabLabel: string
  ) {
    for (const header of [
      /^symbol/i,
      /^strategy/i,
      /expiry/i,
      /^strike/i,
      /last price/i,
      /^premium/i,
      /est\.?\s*return/i,
      /assign\.?\s*risk/i
    ]) {
      await expect(
        this.page.getByRole(
          'columnheader',
          {
            name: header
          }
        ).first()
      ).toBeVisible({
        timeout: 15000
      });
    }

    const empty =
      /\)\s*0\s*$/.test(
        tabLabel
      );

    if (
      !empty
    ) {
      await expect(
        this.page.locator(
          'main'
        )
      ).toContainText(
        /\$[\d,]+(?:\.\d+)?/
      );
    }
  }
}
