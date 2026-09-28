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
PAGE OBJECT: AccountsPage

PURPOSE
-------
Manage Accounts opens the connected broker accounts. View positions continues
to the portfolio holdings.
============================================================================= */

export class AccountsPage
  extends BasePage {

  async validateLoaded() {
    Logger.info(
      'Validating Accounts'
    );

    await expect(
      this.page
    ).toHaveURL(
      /accounts/,
      {
        timeout: 20000
      }
    );

    await expect(
      this.page.getByRole(
        'heading',
        {
          name: /^accounts$/i
        }
      )
    ).toBeVisible({
      timeout: 20000
    });

    await expect(
      this.page.getByText(
        /connected broker accounts/i
      )
    ).toBeVisible();

    await expect(
      this.page.getByRole(
        'button',
        {
          name: /connect broker/i
        }
      ).or(
        this.page.getByRole(
          'link',
          {
            name: /connect broker/i
          }
        )
      ).first()
    ).toBeVisible();

    await expect(
      this.page.getByText(
        /manual entry/i
      ).first()
    ).toBeVisible();

    await expect(
      this.page.getByText(
        /manual portfolio/i
      ).first()
    ).toBeVisible();

    for (const label of [
      /invested/i,
      /current value/i,
      /unrealized/i,
      /cash balance/i
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
      /\$[\d,.]+/
    );

    Logger.success(
      'Accounts are shown'
    );
  }

  async openPositions() {
    Logger.info(
      'Opening positions from Accounts'
    );

    await safeClick(
      this.page.getByRole(
        'link',
        {
          name: /view positions/i
        }
      ).or(
        this.page.getByRole(
          'button',
          {
            name: /view positions/i
          }
        )
      ).first(),
      'View positions'
    );
  }
}
