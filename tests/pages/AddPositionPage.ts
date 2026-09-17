import {
  expect,
  Locator
} from '@playwright/test';

import { BasePage }
  from './BasePage';

import { safeClick }
  from '../helpers/safeClick';

import { Logger }
  from '../utils/logger';

import {
  ADD_POSITION_CASH,
  ADD_POSITION_EQUITY,
  ADD_POSITION_OPTION
} from '../config/testData';

/* =============================================================================
PAGE OBJECT: AddPositionPage

PURPOSE
-------
Opens the dashboard + menu, chooses Enter Manually, and adds Equity, Cash,
or Option positions. Option expiry, Call/Put, and strike depend on the
searched symbol.
============================================================================= */

export class AddPositionPage
  extends BasePage {

  private plusButton() {
    return this.page
      .locator(
        'header button:has(svg.lucide-plus), nav button:has(svg.lucide-plus), button:has(svg.lucide-plus)'
      )
      .first();
  }

  private enterManuallyItem() {
    return this.page
      .getByRole(
        'menuitem',
        {
          name: /enter manually/i
        }
      )
      .or(
        this.page.getByRole(
          'option',
          {
            name: /enter manually/i
          }
        )
      )
      .or(
        this.page.getByText(
          /^enter manually$/i
        )
      )
      .first();
  }

  private dialog() {
    return this.page
      .getByRole(
        'dialog'
      )
      .filter({
        hasText: /add position/i
      })
      .or(
        this.page.locator(
          '[role="dialog"]'
        ).filter({
          hasText: /add position/i
        })
      )
      .first();
  }

  private labeledCombobox(
    label: RegExp
  ) {
    const dialog =
      this.dialog();

    return dialog
      .getByText(
        label
      )
      .locator(
        'xpath=following::button[@role="combobox"][1]'
      )
      .or(
        dialog.getByRole(
          'combobox',
          {
            name: label
          }
        )
      )
      .first();
  }

  private positionTypeCombobox() {
    return this.dialog()
      .locator(
        'button[role="combobox"]'
      )
      .first();
  }

  private optionRightCombobox() {
    return this.dialog()
      .locator(
        'button[role="combobox"]'
      )
      .filter({
        hasText: /call or put/i
      })
      .first();
  }

  private symbolInput() {
    const dialog =
      this.dialog();

    return dialog
      .getByPlaceholder(
        /search company name or symbol/i
      )
      .or(
        dialog.getByLabel(
          /company \/ symbol|^symbol$/i
        )
      )
      .or(
        dialog.getByRole(
          'combobox',
          {
            name: /search company|symbol/i
          }
        )
      )
      .first();
  }

  private quantityInput() {
    return this.dialog()
      .getByRole(
        'spinbutton'
      )
      .nth(0);
  }

  private priceInput() {
    return this.dialog()
      .getByRole(
        'spinbutton'
      )
      .nth(1);
  }

  private amountInput() {
    const dialog =
      this.dialog();

    return dialog
      .getByLabel(
        /^amount$/i
      )
      .or(
        dialog.locator(
          'input[inputmode="decimal"], input[type="number"], input[name="amount"]'
        )
      )
      .or(
        this.page.getByLabel(
          /^amount$/i
        )
      )
      .first();
  }

  private addPositionButton() {
    return this.page.getByRole(
      'button',
      {
        name: /^add position$/i
      }
    ).last();
  }

  private openList() {
    return this.page
      .locator(
        '[role="listbox"]:visible, [data-radix-select-content]:visible, [data-radix-popper-content-wrapper]:visible'
      )
      .last();
  }

  private async selectComboboxOption(
    combobox: Locator,
    option: RegExp,
    label: string
  ) {
    await expect(
      combobox
    ).toBeEnabled({
      timeout: 15000
    });

    await safeClick(
      combobox,
      `Open ${label}`
    );

    const list =
      this.openList();

    await expect(
      list
    ).toBeVisible({
      timeout: 15000
    });

    const optionLocator =
      list
        .getByRole(
          'option',
          {
            name: option
          }
        )
        .or(
          list
            .locator(
              '[role="option"]'
            )
            .filter({
              hasText: option
            })
        )
        .or(
          list.getByText(
            option
          )
        )
        .first();

    await safeClick(
      optionLocator,
      `Select ${label}`
    );
  }

  private async selectFirstListOption(
    label: string,
    optionFilter?: RegExp
  ) {
    const list =
      this.openList();

    await expect(
      list
    ).toBeVisible({
      timeout: 15000
    });

    const options =
      optionFilter
        ? list
            .locator(
              '[role="option"]:visible'
            )
            .filter({
              hasText: optionFilter
            })
        : list.locator(
            '[role="option"]:visible'
          );

    await safeClick(
      options.first(),
      `Select first ${label}`
    );
  }

  async openManualEntry() {
    Logger.info(
      'Opening Add Position from dashboard + menu'
    );

    await this.dismissMarketingOverlays();

    await this.waitForSuccessToastToClear();

    await expect(
      this.plusButton()
    ).toBeVisible({
      timeout: 15000
    });

    for (let attempt = 1; attempt <= 3; attempt++) {
      await safeClick(
        this.plusButton(),
        `Open + menu (${attempt})`
      );

      const menuVisible =
        await this.enterManuallyItem()
          .isVisible({
            timeout: 4000
          })
          .catch(
            () => false
          );

      if (menuVisible) {
        break;
      }

      if (attempt === 3) {
        await expect(
          this.enterManuallyItem()
        ).toBeVisible({
          timeout: 10000
        });
      }
    }

    await safeClick(
      this.enterManuallyItem(),
      'Enter Manually'
    );

    await expect(
      this.page.getByRole(
        'heading',
        {
          name: /add position/i
        }
      )
    ).toBeVisible({
      timeout: 15000
    });

    Logger.success(
      'Add Position manual entry opened'
    );
  }

  async addCashUsdPosition(
    amount =
      ADD_POSITION_CASH.amount
  ) {
    await this.openManualEntry();

    Logger.info(
      `Adding Cash position: USD ${amount}`
    );

    await this.selectComboboxOption(
      this.positionTypeCombobox(),
      /^cash$/i,
      'Type Cash'
    );

    await this.selectComboboxOption(
      this.labeledCombobox(
        /^currency$/i
      ),
      ADD_POSITION_CASH.currencyOption,
      'Currency USD'
    );

    const amountInput =
      this.amountInput();

    await expect(
      amountInput
    ).toBeVisible({
      timeout: 10000
    });

    await amountInput.click();

    await amountInput.fill(
      ''
    );

    await amountInput.fill(
      amount
    );

    await this.submitPosition();

    Logger.success(
      `Cash USD ${amount} position added`
    );
  }

  private async fillDialogInput(
    input: Locator,
    value: string
  ) {
    await expect(
      input
    ).toBeVisible({
      timeout: 10000
    });

    await input.click();

    await input.fill(
      ''
    );

    await input.fill(
      value
    );
  }

  private async searchAndSelectSymbol(
    search: string,
    symbol: string
  ) {
    Logger.info(
      `Searching symbol: ${search}`
    );

    await this.fillDialogInput(
      this.symbolInput(),
      search
    );

    const symbolPattern =
      new RegExp(
        `^${symbol}\\b`,
        'i'
      );

    const symbolChoice =
      this.openList()
        .getByRole(
          'option',
          {
            name: symbolPattern
          }
        )
        .or(
          this.page
            .getByRole(
              'option',
              {
                name: symbolPattern
              }
            )
        )
        .or(
          this.dialog().getByText(
            new RegExp(
              `^${symbol}$`,
              'i'
            )
          )
        )
        .first();

    await expect(
      symbolChoice
    ).toBeVisible({
      timeout: 15000
    });

    await safeClick(
      symbolChoice,
      `Select symbol ${symbol}`
    );

    Logger.success(
      `Symbol selected: ${symbol}`
    );
  }

  private async waitForSuccessToastToClear() {
    const toast =
      this.page.getByText(
        /position added successfully/i
      );

    const toastVisible =
      await toast
        .isVisible()
        .catch(
          () => false
        );

    if (
      !toastVisible
    ) {
      return;
    }

    await toast.waitFor({
      state: 'hidden',
      timeout: 20000
    });
  }

  private async submitPosition() {
    await expect(
      this.addPositionButton()
    ).toBeEnabled({
      timeout: 10000
    });

    await safeClick(
      this.addPositionButton(),
      'Add Position'
    );

    await expect(
      this.page.getByRole(
        'heading',
        {
          name: /add position/i
        }
      )
    ).toBeHidden({
      timeout: 20000
    });

    const toast =
      this.page.getByText(
        /position added successfully/i
      );

    await toast
      .waitFor({
        state: 'visible',
        timeout: 8000
      })
      .catch(
        () => undefined
      );

    await this.waitForSuccessToastToClear();
  }

  async addEquityPosition(
    equity =
      ADD_POSITION_EQUITY
  ) {
    await this.openManualEntry();

    Logger.info(
      `Adding Equity position: ${equity.symbol}`
    );

    await this.selectComboboxOption(
      this.positionTypeCombobox(),
      /^equity$/i,
      'Type Equity'
    );

    await this.searchAndSelectSymbol(
      equity.search,
      equity.symbol
    );

    await expect(
      this.quantityInput()
    ).toBeEnabled({
      timeout: 15000
    });

    await this.fillDialogInput(
      this.quantityInput(),
      equity.quantity
    );

    await this.fillDialogInput(
      this.priceInput(),
      equity.price
    );

    await this.submitPosition();

    Logger.success(
      `Equity ${equity.symbol} position added`
    );
  }

  async addOptionPosition(
    options =
      ADD_POSITION_OPTION
  ) {
    await this.openManualEntry();

    Logger.info(
      `Adding Option position: ${options.symbol} ${options.right}`
    );

    await this.selectComboboxOption(
      this.positionTypeCombobox(),
      /^option$/i,
      'Type Option'
    );

    await this.searchAndSelectSymbol(
      options.search,
      options.symbol
    );

    Logger.info(
      `Option ${options.symbol}: selecting expiry for this symbol`
    );

    const expiry =
      this.labeledCombobox(
        /^expiry$/i
      );

    await expect(
      expiry
    ).toBeEnabled({
      timeout: 15000
    });

    await expect(
      expiry
    ).not.toContainText(
      /select symbol first/i,
      {
        timeout: 15000
      }
    );

    await safeClick(
      expiry,
      'Open Expiry'
    );

    await this.selectFirstListOption(
      'Expiry',
      /\d{4}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i
    );

    await expect(
      expiry
    ).not.toContainText(
      /select expiry/i,
      {
        timeout: 10000
      }
    );

    const optionRight =
      this.optionRightCombobox();

    await expect(
      optionRight
    ).toBeEnabled({
      timeout: 15000
    });

    await this.selectComboboxOption(
      optionRight,
      new RegExp(
        `^${options.right}$`,
        'i'
      ),
      `Option ${options.right}`
    );

    const strike =
      this.labeledCombobox(
        /^strike$/i
      );

    await expect(
      strike
    ).toBeEnabled({
      timeout: 15000
    });

    await expect(
      strike
    ).not.toContainText(
      /select type first/i,
      {
        timeout: 15000
      }
    );

    await safeClick(
      strike,
      'Open Strike'
    );

    await this.selectFirstListOption(
      'Strike',
      /\d/
    );

    await expect(
      this.quantityInput()
    ).toBeEnabled({
      timeout: 15000
    });

    await this.fillDialogInput(
      this.quantityInput(),
      options.quantity
    );

    await this.fillDialogInput(
      this.priceInput(),
      options.price
    );

    await this.submitPosition();

    Logger.success(
      `Option ${options.symbol} ${options.right} position added`
    );
  }
}
