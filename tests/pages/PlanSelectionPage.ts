import {
  Page,
  Locator,
  expect
} from '@playwright/test';

import { BasePage } from './BasePage';
import { safeClick } from '../helpers/safeClick';
import { Logger } from '../utils/logger';

/* =============================================================================
PAGE OBJECT: PlanSelectionPage

PURPOSE
-------
Handles subscription plan selection during onboarding.

FEATURES COVERED
----------------
1. Plan Selection Page Validation
2. Monthly Billing Selection
3. Income Builder Plan Selection
4. Continue To Payment Navigation

METHODS
-------
selectIncomeBuilderPlan()

USED BY
-------
onboarding.spec.ts

============================================================================= */

export class PlanSelectionPage extends BasePage {


  readonly incomeBuilderPlan: Locator;

  readonly completeSetupButton: Locator;


  constructor(page: Page) {

    super(page);


    this.incomeBuilderPlan =
      page.getByText(
        'Income Builder',
        {
          exact:true
        }
      );


  this.completeSetupButton =
  page.locator(
'button'
).filter({
hasText:/complete setup|continue to payment/i
});

  }



  private planByName(
    planName: string
  ) {
    const escapedName =
      planName.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

    return this.page
      .getByText(
        new RegExp(
          `^${escapedName}$`,
          'i'
        )
      )
      .first();
  }



  private overlayStrategistsWithCardTrialButton() {
    return this.page
      .locator(
        'button'
      )
      .filter({
        hasText:
          /try 30 days free[\s\S]*with card/i
      })
      .first();
  }



  private overlayStrategistsWithoutCardTrialButton() {
    return this.page
      .locator(
        'button'
      )
      .filter({
        hasText:
          /try 30 days free[\s\S]*without card/i
      })
      .first();
  }



  private trialDialog() {
    return this.page
      .getByRole(
        'dialog'
      )
      .filter({
        hasText: /try out pro|try overlay strategists free/i
      })
      .first();
  }



  private trialTermsCheckbox() {
    return this.trialDialog()
      .locator(
        '[role="checkbox"], input[type="checkbox"]'
      )
      .first();
  }



  private trialCancelButton() {
    return this.trialDialog()
      .getByRole(
        'button',
        {
          name: /cancel/i
        }
      )
      .first();
  }



  private startFreeTrialButton() {
    return this.trialDialog()
      .getByRole(
        'button',
        {
          name: /start free trial/i
        }
      )
      .first();
  }



  private monthlyToggle() {
    return this.page
      .getByRole(
        'button',
        {
          name: /monthly/i
        }
      )
      .first();
  }



  private annualToggle() {
    return this.page
      .getByRole(
        'button',
        {
          name: /annual/i
        }
      )
      .first();
  }



  private async trialTermsChecked() {
    const termsCheckbox =
      this.trialTermsCheckbox();

    const ariaChecked =
      await termsCheckbox.getAttribute(
        'aria-checked'
      );

    const dataState =
      await termsCheckbox.getAttribute(
        'data-state'
      );

    const checked =
      await termsCheckbox
        .isChecked()
        .catch(
          () =>
            ariaChecked === 'true' ||
            dataState === 'checked'
        );

    return checked ||
      ariaChecked === 'true' ||
      dataState === 'checked';
  }



  private async setTrialTermsAccepted(
    shouldAccept: boolean
  ) {
    const termsCheckbox =
      this.trialTermsCheckbox();

    await expect(
      termsCheckbox
    ).toBeVisible({
      timeout: 15000
    });

    const checked =
      await this.trialTermsChecked();

    if (checked !== shouldAccept) {
      await safeClick(
        termsCheckbox,
        shouldAccept
          ? 'Accept Trial Terms'
          : 'Decline Trial Terms'
      );
    }
  }



  private async acceptTrialTermsIfNeeded() {
    await this.setTrialTermsAccepted(
      true
    );
  }



  async confirmTrialModal() {

    Logger.info(
      'Confirming Overlay Strategists trial modal'
    );

    await expect(
      this.trialDialog()
    ).toBeVisible({
      timeout: 15000
    });

    await expect(
      this.trialDialog()
    ).toContainText(
      /try out pro|try overlay strategists free|overlay strategists free for 30 days/i,
      {
        timeout: 15000
      }
    );

    await this.acceptTrialTermsIfNeeded();

    await expect(
      this.startFreeTrialButton()
    ).toBeEnabled({
      timeout: 15000
    });

    await safeClick(
      this.startFreeTrialButton(),
      'Start free trial'
    );

    Logger.success(
      'Start free trial submitted'
    );
  }



  async validatePlanVisible(
    planName: string
  ) {

    Logger.info(
      `Validating ${planName} plan visibility`
    );

    await expect(
      this.page.getByText(
        /choose your plan|pricing|subscription/i
      ).first()
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      this.planByName(
        planName
      )
    ).toBeVisible({
      timeout: 30000
    });

    Logger.success(
      `${planName} plan is visible`
    );
  }



  async validatePlanCatalog() {

    Logger.info(
      'Validating plan catalog and feature summary'
    );

    const expectedPlans = [
      'Curious Explorer',
      'Income Builder',
      'Overlay Strategists',
      'Portfolio Hedger',
      'Marketplace'
    ];

    for (const planName of expectedPlans) {
      await this.validatePlanVisible(
        planName
      );
    }

    const bodyText =
      await this.page
        .locator(
          'body'
        )
        .innerText();

    expect(
      bodyText
    ).toMatch(
      /free forever|manual upload|broker integration|account linked/i
    );

    expect(
      bodyText
    ).toMatch(
      /covered calls|protective puts|portfolio analytics|marketplace access/i
    );

    Logger.success(
      'Plan catalog and feature summary validated'
    );
  }



  async validateTrialPresentation(
    planName: string
  ) {

    Logger.info(
      `Validating ${planName} trial presentation`
    );

    await this.validatePlanVisible(
      planName
    );

    const pageText =
      await this.page
        .locator(
          'body'
        )
        .innerText();

    expect(
      pageText
    ).toMatch(
      /trial|try it out|start trial|free|30/i
    );

    Logger.success(
      `${planName} trial details are presented`
    );
  }



  async validateOverlayStrategistsTrialOptions() {

    Logger.info(
      'Validating Overlay Strategists trial options'
    );

    await this.validatePlanVisible(
      'Overlay Strategists'
    );

    await expect(
      this.overlayStrategistsWithCardTrialButton()
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      this.overlayStrategistsWithoutCardTrialButton()
    ).toBeVisible({
      timeout: 30000
    });

    Logger.success(
      'Overlay Strategists with-card and without-card trial options are visible'
    );
  }



  async validateOverlayStrategistsFeatureSummary() {

    Logger.info(
      'Validating Overlay Strategists feature summary'
    );

    await this.validatePlanVisible(
      'Overlay Strategists'
    );

    const pageText =
      await this.page
        .locator(
          'body'
        )
        .innerText();

    const expectedFeatures = [
      /broker integration\s*\(5\)/i,
      /account linked\s*\(10\)/i,
      /positions\s*\(500\)/i,
      /ctas\s*&\s*simulations unlimited/i,
      /covered calls\/puts ctas/i,
      /earnings\s*&\s*dividends notifications/i,
      /itm\/atm resolve suggestions/i,
      /portfolio analytics/i,
      /bulk portfolio load/i,
      /ools score/i
    ];

    for (const feature of expectedFeatures) {
      expect(
        pageText
      ).toMatch(
        feature
      );
    }

    Logger.success(
      'Overlay Strategists feature summary validated'
    );
  }



  async validateBillingToggle() {

    Logger.info(
      'Validating monthly and annual billing toggle'
    );

    await expect(
      this.monthlyToggle()
    ).toBeVisible({
      timeout: 15000
    });

    await expect(
      this.annualToggle()
    ).toBeVisible({
      timeout: 15000
    });

    await safeClick(
      this.annualToggle(),
      'Annual Toggle'
    );

    const annualText =
      await this.page
        .locator(
          'body'
        )
        .innerText();

    await expect(
      this.page.locator(
        'body'
      )
    ).toContainText(
      /annual|year|yr|\/y/i,
      {
        timeout: 10000
      }
    );

    await safeClick(
      this.monthlyToggle(),
      'Monthly Toggle'
    );

    const monthlyText =
      await this.page
        .locator(
          'body'
        )
        .innerText();

    await expect(
      this.page.locator(
        'body'
      )
    ).toContainText(
      /monthly|\/mo|per month/i,
      {
        timeout: 10000
      }
    );

    expect(
      monthlyText
    ).not.toEqual(
      annualText
    );

    Logger.success(
      'Monthly and annual billing toggle validated'
    );
  }



  async validateCompleteSetupRequiresPlanSelection() {

    Logger.info(
      'Validating Complete Setup initial state'
    );

    await expect(
      this.page.getByText(
        /choose your plan/i
      ).first()
    ).toBeVisible({
      timeout: 30000
    });

    const completeVisible =
      await this.completeSetupButton
        .first()
        .isVisible()
        .catch(
          () => false
        );

    if (completeVisible) {
      const completeEnabled =
        await this.completeSetupButton
          .first()
          .isEnabled()
          .catch(
            () => false
          );

      if (completeEnabled) {
        await expect(
          this.page
            .getByRole(
              'radio',
              {
                checked: true
              }
            )
            .first()
        ).toBeVisible({
          timeout: 5000
        });
      } else {
        await expect(
          this.completeSetupButton.first()
        ).toBeDisabled({
          timeout: 5000
        });
      }
    }

    Logger.success(
      'Complete Setup initial state is safe'
    );
  }



  async validateOverlayStrategistsTrialModalContent(
    mode: 'with-card' | 'without-card'
  ) {

    const expectedCopy =
      mode === 'with-card'
        ? /securely save your card|auto-renews|after the trial|\$79|card/i
        : /no card needed|moves to the free plan|without card/i;

    Logger.info(
      `Validating Overlay Strategists ${mode} trial modal content`
    );

    await expect(
      this.trialDialog()
    ).toBeVisible({
      timeout: 15000
    });

    await expect(
      this.trialDialog()
    ).toContainText(
      /try out pro|try overlay strategists free/i
    );

    await expect(
      this.trialDialog()
    ).toContainText(
      expectedCopy
    );

    Logger.success(
      `Overlay Strategists ${mode} trial modal content validated`
    );
  }



  async closeTrialModal() {

    const closeButton =
      this.trialDialog()
        .getByRole(
          'button',
          {
            name: /close/i
          }
        )
        .or(
          this.trialCancelButton()
        )
        .first();

    await safeClick(
      closeButton,
      'Close Trial Modal'
    );

    await expect(
      this.trialDialog()
    ).toBeHidden({
      timeout: 10000
    });
  }



  async cancelTrialModal() {

    await safeClick(
      this.trialCancelButton(),
      'Cancel Trial Modal'
    );

    await expect(
      this.trialDialog()
    ).toBeHidden({
      timeout: 10000
    });
  }



  async openOverlayStrategistsTrialWithCardModal() {

    Logger.info(
      'Opening Overlay Strategists with-card trial modal'
    );

    await this.validateOverlayStrategistsTrialOptions();

    await safeClick(
      this.overlayStrategistsWithCardTrialButton(),
      'Try 30 days free with card'
    );

    await expect(
      this.trialDialog()
    ).toBeVisible({
      timeout: 15000
    });
  }



  async openOverlayStrategistsTrialWithoutCardModal() {

    Logger.info(
      'Opening Overlay Strategists without-card trial modal'
    );

    await this.validateOverlayStrategistsTrialOptions();

    await safeClick(
      this.overlayStrategistsWithoutCardTrialButton(),
      'Try 30 days free without card'
    );

    await expect(
      this.trialDialog()
    ).toBeVisible({
      timeout: 15000
    });
  }



  async validateTrialTermsRequired() {

    Logger.info(
      'Validating trial terms are required'
    );

    await this.setTrialTermsAccepted(
      false
    );

    await expect(
      this.startFreeTrialButton()
    ).toBeDisabled({
      timeout: 10000
    });

    await this.setTrialTermsAccepted(
      true
    );

    await expect(
      this.startFreeTrialButton()
    ).toBeEnabled({
      timeout: 10000
    });

    Logger.success(
      'Trial terms required validation passed'
    );
  }



  async selectOverlayStrategistsTrialWithCard() {

    Logger.info(
      'Selecting Overlay Strategists trial with card'
    );

    await this.openOverlayStrategistsTrialWithCardModal();

    await this.confirmTrialModal();

    await expect(
      this.completeSetupButton
    ).toBeVisible({
      timeout: 30000
    });

    await safeClick(
      this.completeSetupButton,
      'Complete Setup'
    );

    Logger.success(
      'Overlay Strategists trial with card selected'
    );

    await this.page.waitForTimeout(
      5000
    );
  }



  async selectOverlayStrategistsTrialWithoutCard() {

    Logger.info(
      'Selecting Overlay Strategists trial without card'
    );

    await this.openOverlayStrategistsTrialWithoutCardModal();

    await this.confirmTrialModal();

    await expect(
      this.completeSetupButton
    ).toBeVisible({
      timeout: 30000
    });

    await safeClick(
      this.completeSetupButton,
      'Complete Setup'
    );

    Logger.success(
      'Overlay Strategists trial without card selected'
    );

    await this.page.waitForTimeout(
      5000
    );
  }



  async selectPlan(
    planName: string
  ) {

    Logger.info(
      `Selecting ${planName} Plan`
    );

    await this.validatePlanVisible(
      planName
    );

    await safeClick(
      this.planByName(
        planName
      ),
      `${planName} Plan`
    );

    await expect(
      this.completeSetupButton
    ).toBeVisible({
      timeout: 30000
    });

    await safeClick(
      this.completeSetupButton,
      'Complete Setup'
    );

    Logger.success(
      `${planName} selected`
    );

    await this.page.waitForTimeout(
      5000
    );
  }



  async selectOverlayStrategistsPlan() {

    await this.selectPlan(
      'Overlay Strategists'
    );
  }



  async selectIncomeBuilderPlan() {

  Logger.info(
    'Selecting Income Builder Plan'
  );


  await expect(
    this.page.getByText(
      /choose your plan/i
    )
  ).toBeVisible({
    timeout:30000
  });


  Logger.step(
    'Select Income Builder Plan'
  );


  await safeClick(
    this.incomeBuilderPlan,
    'Income Builder Plan'
  );


  Logger.success(
    'Income Builder Selected'
  );
  console.log(
  "Current URL:",
  this.page.url()
);


console.log(
  "All Buttons:",
  await this.page.locator('button').allTextContents()
);


console.log(
  "All Text:",
  await this.page.locator('body').innerText()
);


  await this.page.waitForTimeout(
    3000
  );


  await expect(
    this.completeSetupButton
  ).toBeVisible({
    timeout:30000
  });


  await safeClick(
    this.completeSetupButton,
    'Complete Setup'
  );


  Logger.success(
    'Complete Setup Clicked'
  );


  await this.page.waitForTimeout(
    5000
  );


  Logger.url(
    this.page.url()
  );

}
}
