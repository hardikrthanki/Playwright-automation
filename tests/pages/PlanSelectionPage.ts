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
        /income builder|build your portfolio/i
      ).first();


  this.completeSetupButton =
    page.locator(
      'button'
    ).filter({
      hasText: /complete setup|continue to payment/i
    }).first();

  }



  private planByName(
    planName: string
  ) {
    if (
      /curious/i.test(
        planName
      )
    ) {
      return this.page
        .getByText(
          /^curious$|curious explorer|explore your portfolio/i
        )
        .first();
    }

    if (
      /income/i.test(
        planName
      )
    ) {
      return this.page
        .getByText(
          /^income$|income builder|build your portfolio/i
        )
        .first();
    }

    if (
      /overlay/i.test(
        planName
      )
    ) {
      return this.page
        .getByText(
          /overlay strategists/i
        )
        .first();
    }

    if (
      /portfolio|hedger/i.test(
        planName
      )
    ) {
      return this.page
        .getByText(
          /portfolio hedger/i
        )
        .first();
    }

    const escapedName =
      planName.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

    return this.page
      .getByText(
        new RegExp(
          escapedName,
          'i'
        )
      )
      .first();
  }

  async isPlanOffered(
    planName: string
  ) {
    return this.planByName(
      planName
    ).isVisible({
      timeout: 3000
    }).catch(
      () => false
    );
  }

  private async catalogPlans() {
    const plans = [
      'Curious Explorer',
      'Income Builder',
      'Overlay Strategists',
      'Portfolio Hedger'
    ];

    if (
      await this.isPlanOffered(
        'Marketplace'
      )
    ) {
      plans.push(
        'Marketplace'
      );
    }

    return plans;
  }

  private async waitAfterCompleteSetup(
    expectStripe = true
  ) {
    if (expectStripe) {
      await this.page.waitForURL(
        /checkout\.stripe\.com|billing\.stripe\.com/i,
        {
          timeout: 30000
        }
      );

      return;
    }

    await this.page.waitForURL(
      /\/(dashboard|onboarding|verify-mobile)/i,
      {
        timeout: 30000
      }
    ).catch(
      () => undefined
    );
  }

  private hasLeftPlanSelection() {
    return /checkout\.stripe\.com|billing\.stripe\.com|\/dashboard/i.test(
      this.page.url()
    );
  }

  private async clickCompleteSetupIfStillOnPlans() {
    if (
      this.hasLeftPlanSelection()
    ) {
      return;
    }

    const completeSetupVisible =
      await this.completeSetupButton.isVisible({
        timeout: 5000
      }).catch(
        () => false
      );

    if (!completeSetupVisible) {
      return;
    }

    await safeClick(
      this.completeSetupButton,
      'Complete Setup'
    );
  }

  private async finishTrialStart(
    expectStripe: boolean
  ) {
    const navigated =
      await this.page.waitForURL(
        expectStripe
          ? /checkout\.stripe\.com|billing\.stripe\.com/i
          : /\/dashboard/i,
        {
          timeout: 15000
        }
      ).then(
        () => true
      ).catch(
        () => false
      );

    if (navigated) {
      return;
    }

    await this.clickCompleteSetupIfStillOnPlans();
    await this.waitAfterCompleteSetup(
      expectStripe
    );
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
          name: /^monthly$/i
        }
      )
      .last();
  }



  private annualToggle() {
    return this.page
      .getByRole(
        'button',
        {
          name: /^annual$/i
        }
      )
      .last();
  }

  async waitUntilCatalogVisible() {
    await this.dismissMarketingOverlays();

    const catalogReady =
      this.monthlyToggle()
        .or(
          this.completeSetupButton
        )
        .or(
          this.page
            .getByRole(
              'radio',
              {
                name: /curious|income|overlay/i
              }
            )
            .first()
        );

    if (
      !await catalogReady.isVisible({
        timeout: 8000
      }).catch(
        () => false
      )
    ) {
      await this.page.goto(
        this.appUrl(
          '/onboarding'
        ),
        {
          waitUntil: 'domcontentloaded'
        }
      );

      await this.dismissMarketingOverlays();
    }

    await expect(
      this.monthlyToggle()
    ).toBeVisible({
      timeout: 30000
    });
  }

  private async catalogToggleInViewport() {
    const box =
      await this.monthlyToggle()
        .boundingBox()
        .catch(
          () => null
        );

    if (
      !box ||
      box.width < 1 ||
      box.height < 1
    ) {
      return false;
    }

    const viewport =
      this.page.viewportSize();

    if (!viewport) {
      return true;
    }

    return (
      box.y >= 0 &&
      box.y < viewport.height
    );
  }

  async returnFromCheckoutBeforePayment() {
    await this.page.goBack({
      waitUntil: 'domcontentloaded'
    });

    await expect(
      this.page
    ).not.toHaveURL(
      /checkout\.stripe\.com|billing\.stripe\.com/i,
      {
        timeout: 15000
      }
    );

    // Stripe history-back can leave the catalog in the DOM while the
    // viewport stays blank. Load onboarding again before the next plan.
    await this.page.goto(
      this.appUrl(
        '/onboarding'
      ),
      {
        waitUntil: 'domcontentloaded'
      }
    );

    await this.waitUntilCatalogVisible();

    await this.scrollCatalogToggleIntoView(
      this.monthlyToggle()
    );

    if (
      !await this.catalogToggleInViewport()
    ) {
      await this.page.reload({
        waitUntil: 'domcontentloaded'
      });

      await this.waitUntilCatalogVisible();

      await this.scrollCatalogToggleIntoView(
        this.monthlyToggle()
      );
    }
  }

  private async scrollCatalogToggleIntoView(
    toggle: Locator
  ) {
    await toggle.evaluate(
      (element) => {
        element.scrollIntoView({
          block: 'center',
          inline: 'nearest'
        });

        let parent =
          element.parentElement;

        while (parent) {
          const style =
            window.getComputedStyle(
              parent
            );

          if (
            /auto|scroll|hidden/.test(
              style.overflowY
            )
          ) {
            const parentRect =
              parent.getBoundingClientRect();

            const elRect =
              element.getBoundingClientRect();

            parent.scrollTop +=
              elRect.top -
              parentRect.top -
              parent.clientHeight / 2 +
              elRect.height / 2;
          }

          parent =
            parent.parentElement;
        }

        const rect =
          element.getBoundingClientRect();

        const top =
          window.scrollY +
          rect.top -
          window.innerHeight / 2 +
          rect.height / 2;

        window.scrollTo(
          0,
          Math.max(
            0,
            top
          )
        );
      }
    ).catch(
      () => undefined
    );
  }

  private async billingToggleSelected(
    toggle: Locator
  ) {
    return toggle.evaluate(
      (element) =>
        element.classList.contains(
          'bg-primary'
        )
    ).catch(
      () => false
    );
  }

  private async clickBillingToggle(
    toggle: Locator,
    label: string
  ) {
    await this.dismissMarketingOverlays();

    await this.scrollCatalogToggleIntoView(
      toggle
    );

    try {
      await safeClick(
        toggle,
        label
      );
    } catch {
      await this.scrollCatalogToggleIntoView(
        toggle
      );

      try {
        await toggle.click({
          force: true,
          timeout: 5000
        });
      } catch {
        console.log(
          `[CLICK] ${label} via DOM click`
        );

        await toggle.evaluate(
          (element: HTMLElement) =>
            element.click()
        );
      }
    }
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

    const expectedPlans =
      await this.catalogPlans();

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
      /covered calls|protective puts|portfolio analytics/i
    );

    if (
      expectedPlans.includes(
        'Marketplace'
      )
    ) {
      expect(
        bodyText
      ).toMatch(
        /marketplace access/i
      );
    }

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
      /(?:income(?:\s+builder)?|build your portfolio)[\s\S]{0,800}broker integration\s*\(1\)/i,
      /(?:income(?:\s+builder)?|build your portfolio)[\s\S]{0,800}account linked\s*\(1\)/i,
      /(?:income(?:\s+builder)?|build your portfolio)[\s\S]{0,800}positions\s*\(100\)/i,
      /overlay strategists[\s\S]{0,800}broker integration\s*\(5\)/i,
      /overlay strategists[\s\S]{0,800}account linked\s*\(10\)/i,
      /overlay strategists[\s\S]{0,800}positions\s*\(500\)/i,
      /portfolio hedger[\s\S]{0,800}broker integration\s*\(10\)/i,
      /portfolio hedger[\s\S]{0,800}account linked\s*\(20\)/i,
      /portfolio hedger[\s\S]{0,800}positions\s*\(1000\)/i
    ];

    if (
      await this.isPlanOffered(
        'Marketplace'
      )
    ) {
      expectedEntitlements.push(
        /marketplace[\s\S]*broker integration\s*\(20\)/i,
        /marketplace[\s\S]*account linked\s*\(100\)/i,
        /marketplace[\s\S]*positions\s*\(10000\)/i
      );
    }

    for (const planName of await this.catalogPlans()) {
      if (
        planName ===
          'Curious Explorer'
      ) {
        continue;
      }

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

    await this.clickBillingToggle(
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

    await this.clickBillingToggle(
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

    if (
      !await this.billingToggleSelected(
        this.annualToggle()
      )
    ) {
      await this.clickBillingToggle(
        this.annualToggle(),
        'Annual Toggle'
      );
    }

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

    if (
      !await this.billingToggleSelected(
        this.monthlyToggle()
      )
    ) {
      await this.clickBillingToggle(
        this.monthlyToggle(),
        'Monthly Toggle'
      );
    }

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

    const marketplaceOffered =
      await this.isPlanOffered(
        'Marketplace'
      );

    const monthlyPrices = [
      /\$\s*29\s*\/\s*mo/i,
      /\$\s*79\s*\/\s*mo/i,
      /\$\s*149\s*\/\s*mo/i
    ];

    if (marketplaceOffered) {
      monthlyPrices.push(
        /\$\s*249\s*\/\s*mo/i
      );
    }

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
      /\$\s*1,?490\b/i
    ];

    if (marketplaceOffered) {
      annualPrices.push(
        /\$\s*2,?490\b/i
      );
    }

    for (const price of annualPrices) {
      expect(
        annualText
      ).toMatch(
        price
      );
    }

    for (const planName of await this.catalogPlans()) {
      if (
        planName ===
          'Curious Explorer'
      ) {
        continue;
      }

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

    const planNames =
      await this.catalogPlans();

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

    await this.finishTrialStart(
      true
    );

    Logger.success(
      'Overlay Strategists trial with card selected'
    );
  }



  async selectOverlayStrategistsTrialWithoutCard() {

    Logger.info(
      'Selecting Overlay Strategists trial without card'
    );

    await this.openOverlayStrategistsTrialWithoutCardModal();

    await this.confirmTrialModal();

    await this.finishTrialStart(
      false
    );

    Logger.success(
      'Overlay Strategists trial without card selected'
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

    await this.waitAfterCompleteSetup(
      !/curious explorer/i.test(
        planName
      )
    );
  }



  async selectOverlayStrategistsPlan() {

    await this.selectPlan(
      'Overlay Strategists'
    );
  }



  async selectIncomeBuilderPlan() {
    await this.selectPlan(
      'Income Builder'
    );
  }
}
