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



  async validatePaidPlanEntitlementSummaries() {

    Logger.info(
      'Validating paid plan entitlement summaries'
    );

    const expectedEntitlements = [
      /income builder[\s\S]*broker integration\s*\(1\)/i,
      /income builder[\s\S]*account linked\s*\(1\)/i,
      /income builder[\s\S]*positions\s*\(100\)/i,
      /overlay strategists[\s\S]*broker integration\s*\(5\)/i,
      /overlay strategists[\s\S]*account linked\s*\(10\)/i,
      /overlay strategists[\s\S]*positions\s*\(500\)/i,
      /portfolio hedger[\s\S]*broker integration\s*\(10\)/i,
      /portfolio hedger[\s\S]*account linked\s*\(20\)/i,
      /portfolio hedger[\s\S]*positions\s*\(1000\)/i,
      /marketplace[\s\S]*broker integration\s*\(20\)/i,
      /marketplace[\s\S]*account linked\s*\(100\)/i,
      /marketplace[\s\S]*positions\s*\(10000\)/i
    ];

    for (const planName of [
      'Income Builder',
      'Overlay Strategists',
      'Portfolio Hedger',
      'Marketplace'
    ]) {
      await this.validatePlanVisible(
        planName
      );
    }

    const pageText =
      await this.page
        .locator(
          'body'
        )
        .innerText();

    for (const entitlement of expectedEntitlements) {
      expect(
        pageText
      ).toMatch(
        entitlement
      );
    }

    Logger.success(
      'Paid plan entitlement summaries validated'
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



  async selectAnnualBilling() {

    Logger.info(
      'Selecting annual billing'
    );

    await expect(
      this.annualToggle()
    ).toBeVisible({
      timeout: 15000
    });

    await safeClick(
      this.annualToggle(),
      'Annual Toggle'
    );

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

    Logger.success(
      'Annual billing selected'
    );
  }



  async selectMonthlyBilling() {

    Logger.info(
      'Selecting monthly billing'
    );

    await expect(
      this.monthlyToggle()
    ).toBeVisible({
      timeout: 15000
    });

    await safeClick(
      this.monthlyToggle(),
      'Monthly Toggle'
    );

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

    Logger.success(
      'Monthly billing selected'
    );
  }



  async validatePaidPlanPricingAcrossBillingPeriods() {

    Logger.info(
      'Validating paid plan pricing across billing periods'
    );

    await this.selectMonthlyBilling();

    const monthlyText =
      await this.page
        .locator(
          'body'
        )
        .innerText();

    const monthlyPrices = [
      /\$\s*29\s*\/\s*mo/i,
      /\$\s*79\s*\/\s*mo/i,
      /\$\s*149\s*\/\s*mo/i,
      /\$\s*249\s*\/\s*mo/i
    ];

    for (const price of monthlyPrices) {
      expect(
        monthlyText
      ).toMatch(
        price
      );
    }

    await this.validateOverlayStrategistsTrialOptions();

    await this.selectAnnualBilling();

    const annualText =
      await this.page
        .locator(
          'body'
        )
        .innerText();

    const annualPrices = [
      /\$\s*290\b/i,
      /\$\s*790\b/i,
      /\$\s*1,?490\b/i,
      /\$\s*2,?490\b/i
    ];

    for (const price of annualPrices) {
      expect(
        annualText
      ).toMatch(
        price
      );
    }

    for (const planName of [
      'Income Builder',
      'Overlay Strategists',
      'Portfolio Hedger',
      'Marketplace'
    ]) {
      await this.validatePlanVisible(
        planName
      );
    }

    await this.selectMonthlyBilling();

    Logger.success(
      'Paid plan pricing across billing periods validated'
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



  async validatePlanSelectionCanSwitchWithoutCheckout() {

    Logger.info(
      'Validating plan selection can switch without launching checkout'
    );

    const planNames = [
      'Curious Explorer',
      'Income Builder',
      'Overlay Strategists',
      'Portfolio Hedger',
      'Marketplace'
    ];

    await this.validatePlanCatalog();

    for (const planName of planNames) {
      await safeClick(
        this.planByName(
          planName
        ),
        `Select ${planName} without checkout`
      );

      await expect(
        this.completeSetupButton
      ).toBeVisible({
        timeout: 15000
      });

      await expect(
        this.page
      ).not.toHaveURL(
        /checkout\.stripe\.com|billing\.stripe\.com/i
      );
    }

    Logger.success(
      'Plan selection can switch without launching checkout'
    );
  }



  async validateOverlayStrategistsTrialModalContent(
    mode: 'with-card' | 'without-card'
  ) {

    const expectedCopy: RegExp[] =
      mode === 'with-card'
        ? [
          /securely save your card|payment details|card/i,
          /30-?day|30 days/i,
          /no charge today|free trial/i,
          /after the trial|\$79|auto-renews|automatically/i,
          /unless you cancel|cancel/i
        ]
        : [
          /no card needed|without card/i,
          /30-?day|30 days/i,
          /overlay strategists/i,
          /afterwards|after the trial|subscription end/i,
          /moves to the free plan|free plan/i
        ];

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

    for (const expectedRule of expectedCopy) {
      await expect(
        this.trialDialog()
      ).toContainText(
        expectedRule
      );
    }

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



  async validateNotRedirectedToStripeCheckout() {

    Logger.info(
      'Validating no Stripe checkout redirect occurred'
    );

    await expect(
      this.page
    ).not.toHaveURL(
      /checkout\.stripe\.com|billing\.stripe\.com/i,
      {
        timeout: 5000
      }
    );

    Logger.success(
      'No Stripe checkout redirect occurred'
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
