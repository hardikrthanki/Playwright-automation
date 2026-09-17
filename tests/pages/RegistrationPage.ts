import {
  Page,
  Locator,
  expect
} from '@playwright/test';

import { safeClick }
from '../helpers/safeClick';

import {
  AUTH_SETTINGS,
  BASE_URL,
  TEST_USERS,
  validatePasswordPolicy
}
from '../config/testData';

import {
  REGISTRATION_CTA_NAME,
  REGISTRATION_SUBMIT_NAME,
  URLS
}
from '../config/constants';

import { BasePage }
from './BasePage';

import { Logger }
from '../utils/logger';


/* =============================================================================
PAGE OBJECT: RegistrationPage

PURPOSE
-------
Handles new user registration process.

FLOW COVERED
------------
1. Open Application
2. Open Start 30-Day Free Trial / Create Account
3. Enter User Details
4. Enter Mobile Number
5. Send SMS OTP
6. Verify OTP
7. Submit Registration
8. Validate Verification Message

USED BY
-------
onboarding.spec.ts

============================================================================= */


export class RegistrationPage
extends BasePage {


  readonly createAccountLink: Locator;

  readonly firstNameInput: Locator;

  readonly lastNameInput: Locator;

  readonly emailInput: Locator;

  readonly mobileInput: Locator;

  readonly sendCodeButton: Locator;

  readonly otpInput: Locator;
  readonly verifyOtpButton: Locator;

  readonly passwordInput: Locator;

  readonly confirmPasswordInput: Locator;

  readonly submitButton: Locator;
  



  constructor(page: Page) {

    super(page);


    this.createAccountLink =
      page.getByRole(
        'link',
        {
          name: REGISTRATION_CTA_NAME
        }
      ).or(
        page.getByRole(
          'button',
          {
            name: REGISTRATION_CTA_NAME
          }
        )
      ).first();


    this.firstNameInput =
      page.locator(
        'input[name="firstName"]'
      );


    this.lastNameInput =
      page.locator(
        'input[name="lastName"]'
      );


    this.emailInput =
      page.locator(
        'input[name="email"]'
      );


    this.mobileInput =
      page.locator(
        'input[type="tel"], input[inputmode="tel"], input[autocomplete="tel-national"], input[autocomplete="tel"]'
      ).first();


    this.sendCodeButton =
      page.getByRole(
        'button',
        {
          name: /send code via sms/i
        }
      );


    this.otpInput =
      page.getByPlaceholder(
        /enter otp|one-time|verification code|123456/i
      ).or(
        page.getByLabel(
          /enter otp|sms code|verification code|one-time code/i
        )
      ).or(
        page.locator(
          'input[autocomplete="one-time-code"], input[name*="otp" i], input[id*="otp" i]'
        )
      ).first();

    this.verifyOtpButton =
      page.getByRole(
        'button',
        {
          name: 'Verify',
          exact: true
        }
      );


    this.passwordInput =
      page.locator(
        'input[name="password"]'
      );


    this.confirmPasswordInput =
      page.locator(
        'input[name="confirmPassword"]'
      );


    this.submitButton =
      page.getByRole(
        'button',
        {
          name: 'Create Account',
          exact: true
        }
      ).or(
        page.getByRole(
          'button',
          {
            name: REGISTRATION_SUBMIT_NAME
          }
        )
      ).or(
        page.locator(
          'button[type="submit"]'
        ).filter({
          hasText: REGISTRATION_SUBMIT_NAME
        })
      ).first();

  }



  private envEnabled(
    name: string
  ) {
    return [
      '1',
      'true',
      'yes',
      'on'
    ].includes(
      (
        process.env[name] ??
        ''
      ).toLowerCase()
    );
  }



  private async collectOtpRequestDiagnostics() {
    const bodyText =
      await this.page
        .locator(
          'body'
        )
        .innerText()
        .catch(
          () => ''
        );

    const relevantLines =
      bodyText
        .split(
          /\r?\n/
        )
        .map(
          line =>
            line.trim()
        )
        .filter(Boolean)
        .filter(
          line =>
            /otp|code|sms|mobile|phone|too many|rate|request|invalid|error|try again|wait/i.test(
              line
            )
        )
        .slice(
          0,
          8
        );

    const mobileValue =
      await this.mobileInput
        .inputValue()
        .catch(
          () => ''
        );

    const sendCodeEnabled =
      await this.sendCodeButton
        .isEnabled()
        .catch(
          () => false
        );

    const stateSummary =
      `mobile="${mobileValue}", sendCodeEnabled=${sendCodeEnabled}`;

    return relevantLines.length > 0
      ? `${stateSummary}; ${relevantLines.join(
        ' | '
      )}`
      : `${stateSummary}; No visible OTP/SMS error text found.`;
  }



  private visibleOtpInput() {
    return this.page.locator(
      'input[placeholder*="OTP" i], input[autocomplete="one-time-code"], input[name*="otp" i], input[id*="otp" i]'
    ).filter({
      visible: true
    }).first();
  }

  private async otpFieldIsVisible() {
    return this.visibleOtpInput()
      .isVisible({
        timeout: 1000
      })
      .catch(
        () => this.otpInput.isVisible({
          timeout: 1000
        }).catch(
          () => false
        )
      );
  }

  private async clickSendCode(
    attempt: number
  ) {
    await this.dismissMarketingOverlays();

    const apiWait =
      this.page.waitForResponse(
        (response) => {
          const method =
            response.request().method();

          return method !==
            'OPTIONS' &&
            method !==
            'GET' &&
            /otp|sms|phone|mobile|verify|code/i.test(
              response.url()
            );
        },
        {
          timeout: 12000
        }
      ).catch(
        () => null
      );

    if (
      attempt <= 1
    ) {
      await safeClick(
        this.sendCodeButton,
        'Send Code via SMS'
      );
    } else if (
      attempt === 2
    ) {
      console.log(
        '[CLICK] Send Code via SMS (force)'
      );

      await this.sendCodeButton.click({
        force: true,
        timeout: 8000
      });
    } else {
      console.log(
        '[CLICK] Send Code via SMS (DOM click)'
      );

      await this.sendCodeButton.evaluate(
        (button) => {
          (button as HTMLButtonElement).click();
        }
      );
    }

    await apiWait;
  }

  private async fillRegistrationOtp() {
    const otpCode =
      AUTH_SETTINGS.otpCode ||
      '111111';

    Logger.info(
      `Entering OTP ${otpCode}`
    );

    const visibleOtp =
      this.visibleOtpInput();

    if (
      await visibleOtp.isVisible({
        timeout: 3000
      }).catch(
        () => false
      )
    ) {
      await visibleOtp.fill(
        otpCode
      );
      return;
    }

    await this.otpInput.fill(
      otpCode
    );
  }

  private async waitForRegistrationOtpInput() {
    const manualFallback =
      this.envEnabled(
        'REGISTRATION_OTP_MANUAL_FALLBACK'
      );

    for (
      let attempt = 1;
      attempt <= 4;
      attempt++
    ) {
      await this.visibleOtpInput()
        .waitFor({
          state: 'visible',
          timeout: 15000
        })
        .catch(
          () => undefined
        );

      if (
        await this.otpFieldIsVisible()
      ) {
        return;
      }

      const diagnostics =
        await this.collectOtpRequestDiagnostics();

      Logger.info(
        `OTP input not visible after SMS request. Attempt ${attempt}/4. Visible diagnostics: ${diagnostics}`
      );

      if (
        attempt === 4
      ) {
        if (manualFallback) {
          Logger.info(
            'Manual OTP fallback enabled. Complete the OTP request manually, then resume Playwright.'
          );

          await this.page.pause();

          await expect(
            this.visibleOtpInput()
          ).toBeVisible({
            timeout: 30000
          });

          return;
        }

        throw new Error(
          `Registration OTP input did not appear after requesting SMS code. Visible diagnostics: ${diagnostics}`
        );
      }

      await this.waitForSendCodeEnabled();

      await this.clickSendCode(
        attempt + 1
      );
    }
  }



  private async fillMobileNumber(
    mobileNumber: string
  ) {
    await this.mobileInput.fill(
      ''
    );

    await this.mobileInput.click();

    await this.mobileInput.fill(
      mobileNumber
    );

    await this.mobileInput.blur();
  }



  private async waitForSendCodeEnabled() {
    const enabled =
      await this.sendCodeButton
        .isEnabled({
          timeout: 15000
        })
        .catch(
          () => false
        );

    if (enabled) {
      return;
    }

    const mobileValue =
      await this.mobileInput
        .inputValue()
        .catch(
          () => ''
        );

    const diagnostics =
      await this.collectOtpRequestDiagnostics();

    throw new Error(
      `Send code via SMS button stayed disabled after entering mobile number "${mobileValue}". Visible diagnostics: ${diagnostics}`
    );
  }



  async open() {


    Logger.info(
      'Opening application'
    );


    await this.page.goto(
      BASE_URL,
      {
        waitUntil:
        'domcontentloaded',

        timeout:
        60000
      }
    );


    await this.dismissMarketingOverlays();


    const registrationCtaVisible =
      await this.createAccountLink.isVisible({
        timeout: 10000
      }).catch(
        () => false
      );

    if (registrationCtaVisible) {
      await safeClick(
        this.createAccountLink,
        'Open Start 30-Day Free Trial'
      );
    } else {
      await this.page.goto(
        `${BASE_URL}${URLS.REGISTER}`,
        {
          waitUntil:
          'domcontentloaded',

          timeout:
          60000
        }
      );
    }

    await expect(
      this.page
    ).toHaveURL(
      /\/register|\/signup|\/sign-up|\/create/,
      {
        timeout: 15000
      }
    );

    await expect(
      this.firstNameInput
    ).toBeVisible({
      timeout: 15000
    });

    await expect(
      this.submitButton
    ).toBeVisible({
      timeout: 15000
    });


    Logger.success(
      'Registration page opened'
    );

  }




  async register(
    email: string,
    mobileNumber =
      TEST_USERS.onboarding.mobile
  ) {


    Logger.step(
      `Registering: ${email}`
    );

    validatePasswordPolicy(
      TEST_USERS.onboarding.password
    );


    await this.firstNameInput.fill(
      TEST_USERS.onboarding.firstName
    );


    await this.lastNameInput.fill(
      TEST_USERS.onboarding.lastName
    );


    console.log(
      'Registration Email:',
      email
    );


    await this.emailInput.fill(
      email
    );


    await this.fillMobileNumber(
      mobileNumber
    );


    if (
      AUTH_SETTINGS.registrationMobileOtpEnabled
    ) {
      await this.waitForSendCodeEnabled();

      await this.clickSendCode(
        1
      );

      await this.waitForRegistrationOtpInput();

      await this.fillRegistrationOtp();

      await safeClick(
        this.verifyOtpButton,
        'Verify OTP'
      );


      Logger.success(
        'OTP Verify Clicked'
      );

      await expect(
        this.page.getByText(
          /^verified$/i
        ).first()
      ).toBeVisible({
        timeout: 15000
      }).catch(
        () => undefined
      );

      await expect(
        this.passwordInput
      ).toBeVisible({
        timeout: 15000
      }).catch(
        () => undefined
      );
    } else {
      Logger.info(
        'Registration mobile OTP is disabled in auth settings'
      );
    }



    await this.passwordInput.fill(
      TEST_USERS.onboarding.password
    );


    await this.confirmPasswordInput.fill(
      TEST_USERS.onboarding.password
    );



    await expect(
      this.submitButton
    ).toBeEnabled({
      timeout: 15000
    });

    await safeClick(
      this.submitButton,
      'Submit Registration'
    );

    await expect
      .poll(
        async () =>
          this.registrationLooksAccepted(),
        {
          timeout: 20000,
          message: 'Waiting for registration success or email-verification screen'
        }
      )
      .toBeTruthy();



    Logger.success(
      'Registration successful. Verification email sent.'
    );


  }

  private async registrationLooksAccepted() {
    const url =
      this.page.url();

    if (
      /verify-email-sent|\/(verify|onboarding|dashboard|plan|risk|compliance|check-email|confirm)/i.test(
        url
      )
    ) {
      return true;
    }

    const firstNameVisible =
      await this.firstNameInput.isVisible().catch(
        () => false
      );

    const bodyText =
      await this.page
        .locator(
          'body'
        )
        .innerText()
        .catch(
          () => ''
        );

    if (
      !firstNameVisible &&
      /check your email|verification link was sent|verify-email/i.test(
        bodyText
      )
    ) {
      return true;
    }

    return /check your email|a verification link was sent|verification (sent|email|link)|verify your email|confirm your email/i.test(
      bodyText
    );
  }

  private async waitForRegistrationAccepted(
    timeoutMs: number
  ) {
    const started =
      Date.now();

    while (
      Date.now() -
        started <
      timeoutMs
    ) {
      if (
        await this.registrationLooksAccepted()
      ) {
        return true;
      }

      await this.page.waitForTimeout(
        500
      );
    }

    return false;
  }


}
