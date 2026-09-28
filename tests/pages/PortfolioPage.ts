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
PAGE OBJECT: PortfolioPage

PURPOSE
-------
Portfolio holdings show an overview and one tab per account source.
Each tab keeps the positions table.
============================================================================= */

export class PortfolioPage
  extends BasePage {

  async validateLoaded() {
    Logger.info(
      'Validating Portfolio'
    );

    await expect(
      this.page
    ).toHaveURL(
      /portfolio/,
      {
        timeout: 20000
      }
    );

    await expect(
      this.page.getByRole(
        'heading',
        {
          name: /^portfolio$/i
        }
      )
    ).toBeVisible({
      timeout: 20000
    });

    await expect(
      this.page.getByText(
        /portfolio overview/i
      )
    ).toBeVisible();

    await expect(
      this.page.getByText(
        /^accounts$/i
      ).first()
    ).toBeVisible();

    await expect(
      this.page.getByText(
        /^positions$/i
      ).first()
    ).toBeVisible();

    await expect(
      this.page.locator(
        'main'
      )
    ).toContainText(
      /\$[\d,.]+/
    );

    Logger.success(
      'Portfolio overview is shown'
    );
  }

  async validateEveryHoldingsTab() {
    const tabNames =
      await this.holdingTabNames();

    expect(
      tabNames.length
    ).toBeGreaterThan(
      0
    );

    for (const name of tabNames) {
      Logger.info(
        `Opening portfolio tab ${name}`
      );

      const pattern =
        new RegExp(
          `^${this.escape(name)}$`,
          'i'
        );

      await safeClick(
        this.page.getByRole(
          'button',
          {
            name: pattern
          }
        ).or(
          this.page.getByRole(
            'tab',
            {
              name: pattern
            }
          )
        ).first(),
        `Portfolio tab ${name}`
      );

      await this.validatePositionsTable();

      Logger.success(
        `Portfolio tab ${name} shows positions`
      );
    }
  }

  private async validatePositionsTable() {
    const showPositions =
      this.page.getByRole(
        'button',
        {
          name: /^show$/i
        }
      );

    if (
      await showPositions.isVisible().catch(
        () => false
      )
    ) {
      await safeClick(
        showPositions,
        'Show positions'
      );
    }

    for (const header of [
      /position/i,
      /type/i,
      /qty/i,
      /avg\.?\s*price/i,
      /last price/i,
      /market value/i
    ]) {
      await expect(
        this.page.getByRole(
          'columnheader',
          {
            name: header
          }
        )
      ).toBeVisible({
        timeout: 15000
      });
    }

    await expect(
      this.page.getByText(
        /equity|cash|option/i
      ).first()
    ).toBeVisible();

    await expect(
      this.page.locator(
        'main'
      )
    ).toContainText(
      /showing/i
    );
  }

  private async holdingTabNames() {
    const controls =
      this.page.locator(
        'main'
      ).getByRole(
        'button'
      ).or(
        this.page.locator(
          'main'
        ).getByRole(
          'tab'
        )
      );

    const count =
      await controls.count();

    const names: string[] = [];

    for (
      let index = 0;
      index < count;
      index++
    ) {
      const name =
        (
          await controls.nth(
            index
          ).innerText()
        ).replace(
          /\s+/g,
          ' '
        ).trim();

      if (
        /^all$/i.test(
          name
        ) ||
        /^manual\b/i.test(
          name
        ) ||
        /^.+\(\d+\)$/.test(
          name
        )
      ) {
        names.push(
          name
        );
      }
    }

    return [...new Set(names)];
  }

  private escape(
    value: string
  ) {
    return value.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
  }
}
