import {
  expect,
  Locator,
  Page
} from '@playwright/test';

import { BasePage }
  from './BasePage';

import { safeClick }
  from '../helpers/safeClick';

import { Logger }
  from '../utils/logger';

import {
  BASE_URL
} from '../config/testData';

/* =============================================================================
PAGE OBJECT: MfaPage

PURPOSE
-------
Handles user-side MFA setup, challenge, backup code, trusted-device,
regeneration, and disable interactions.

NOTES
-----
Selectors are intentionally resilient because MFA screens can vary by state
and provider. Admin/global security settings are not handled here.

============================================================================= */

export class MfaPage
  extends BasePage {

  readonly challengeInput: Locator;

  readonly submitButton: Locator;

  readonly rememberDeviceCheckbox: Locator;

  constructor(page: Page) {

    super(page);

    this.challengeInput =
      page.locator(
        'input[autocomplete="one-time-code"], input[name*="otp" i], input[name*="mfa" i], input[name*="code" i], input[id*="otp" i], input[id*="mfa" i], input[id*="code" i]'
      ).first();

    this.submitButton =
      page.getByRole(
        'button',
        {
          name: /verify\s*&\s*enable|verify and enable|verify|continue|submit|confirm|enable|disable|regenerate|update|sign in/i
        }
      ).first();

    this.rememberDeviceCheckbox =
      page.getByLabel(
        /remember.*device|trust.*device|don't ask again/i
      ).or(
        page.locator(
          'input[type="checkbox"]'
        ).first()
      );
  }

  async openSecuritySettings() {

    Logger.info(
      'Opening user Security / MFA settings'
    );

    const routes =
      [
        '/dashboard/security',
        '/dashboard/profile/security',
        '/dashboard/profile',
        '/dashboard/settings/security',
        '/dashboard/settings'
      ];

    for (const route of routes) {
      await this.page.goto(
        `${BASE_URL}${route}`,
        {
          waitUntil: 'domcontentloaded'
        }
      );

      const securitySignal =
        this.page.getByText(
          /mfa|2fa|two-factor|multi-factor|authenticator|backup codes|security/i
        ).first();

      if (
        await securitySignal.isVisible({
          timeout: 5000
        }).catch(() => false)
      ) {
        Logger.success(
          `Security settings opened: ${route}`
        );

        return;
      }
    }

    throw new Error(
      'Could not locate user Security / MFA settings page.'
    );
  }

  async startEnableMfa() {

    await safeClick(
      this.page.getByRole(
        'button',
        {
          name: /enable.*authenticator|enable.*authenticator app|enable.*mfa|enable.*2fa|enable.*two-factor|set up.*authenticator|setup.*authenticator/i
        }
      ).or(
        this.page.getByText(
          /enable.*authenticator|enable.*authenticator app|enable.*mfa|enable.*2fa|set up.*authenticator/i
        )
      ).first(),
      'Enable MFA'
    );
  }

  async assertMfaChallengeVisible() {

    await expect(
      this.page.getByText(
        /mfa|2fa|two-factor|multi-factor|verification code|authenticator|backup code/i
      ).first()
    ).toBeVisible({
      timeout: 30000
    });
  }

  async readVisibleSecret() {

    const otpauthLocator =
      this.page.locator(
        'a[href^="otpauth://"], img[src*="otpauth"], [data-secret], input[value]'
      );

    const count =
      await otpauthLocator.count();

    for (let index = 0; index < count; index++) {
      const element =
        otpauthLocator.nth(index);

      const attributes =
        [
          await element.getAttribute('data-secret'),
          await element.getAttribute('href'),
          await element.getAttribute('src'),
          await element.getAttribute('value')
        ];

      for (const attribute of attributes) {
        const secret =
          this.extractSecret(attribute ?? '');

        if (secret) {
          return secret;
        }
      }
    }

    const bodyText =
      await this.page.locator('body').innerText();

    return this.extractSecret(
      bodyText
    );
  }

  extractSecret(value: string) {

    const otpauthMatch =
      value.match(
        /secret=([A-Z2-7=]+)/i
      );

    if (otpauthMatch?.[1]) {
      return decodeURIComponent(
        otpauthMatch[1]
      );
    }

    const base32Match =
      value.match(
        /\b[A-Z2-7]{16,}\b/i
      );

    return base32Match?.[0];
  }

  async completeChallenge(
    code: string,
    options: {
      rememberDevice?: boolean;
    } = {}
  ) {

    await this.assertMfaChallengeVisible();

    await this.challengeInput.fill(
      code
    );

    if (
      options.rememberDevice &&
      await this.rememberDeviceCheckbox.isVisible().catch(() => false)
    ) {
      await this.rememberDeviceCheckbox.check({
        force: true
      });
    }

    await safeClick(
      this.submitButton,
      'Submit MFA Code'
    );
  }

  async completeBackupCode(
    code: string
  ) {

    this.validateBackupCode(
      code
    );

    await this.assertMfaChallengeVisible();

    const backupMode =
      this.page.getByRole(
        'button',
        {
          name: /use a backup code|backup code|recovery code/i
        }
      ).or(
        this.page.getByRole(
          'link',
          {
            name: /use a backup code|backup code|recovery code/i
          }
        )
      ).or(
        this.page.getByText(
          /use a backup code|backup code|recovery code/i
        )
      ).first();

    const backupModeVisible =
      await backupMode.waitFor({
        state: 'visible',
        timeout: 5000
      }).then(
        () => true
      ).catch(
        () => false
      );

    if (backupModeVisible) {
      await safeClick(
        backupMode,
        'Use Backup Code'
      );

      await expect(
        this.page.getByText(
          /backup code|recovery code/i
        ).first()
      ).toBeVisible({
        timeout: 10000
      });
    }

    await this.completeChallenge(
      code
    );
  }

  validateBackupCode(
    code: string
  ) {

    const normalizedCode =
      code.trim().toUpperCase();

    if (
      !/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2}$/.test(normalizedCode)
    ) {
      throw new Error(
        `Backup code "${code}" is incomplete. Expected format is XXXX-XXXX-XX. Use the Copy or Download button from the backup-code modal to get the full code.`
      );
    }
  }

  async collectBackupCodes() {

    const bodyText =
      await this.page.locator('body').innerText();

    return Array.from(
      new Set(
        bodyText.match(
          /\b[A-Z0-9]{4,}[-\s]?[A-Z0-9]{4,}\b/g
        ) ?? []
      )
    );
  }

  async expectMfaEnabled() {

    await expect(
      this.page.getByText(
        /mfa enabled|2fa enabled|two-factor enabled|backup codes|disable.*mfa|disable.*2fa/i
      ).first()
    ).toBeVisible({
      timeout: 15000
    });
  }

  async expectMfaError() {

    await expect(
      this.page.getByText(
        /invalid|incorrect|expired|failed|try again|rate limit|too many|locked|cooldown/i
      ).first()
    ).toBeVisible({
      timeout: 10000
    });
  }

  async waitForSuccessfulChallenge() {

    const errorPattern =
      /invalid|incorrect|expired|failed|attempt|try again|rate limit|too many|locked|lockout|cooldown/i;

    const errorMessage =
      this.page.getByText(
        errorPattern
      ).first();

    await expect
      .poll(
        async () => {
          if (/\/dashboard/.test(this.page.url())) {
            return 'success';
          }

          if (
            await errorMessage.isVisible().catch(() => false)
          ) {
            return `error: ${await errorMessage.innerText()}`;
          }

          const bodyText =
            await this.page.locator('body').innerText().catch(() => '');

          if (errorPattern.test(bodyText)) {
            const matchedLine =
              bodyText
                .split(/\r?\n/)
                .find(line => errorPattern.test(line.trim()));

            return `error: ${matchedLine?.trim() ?? 'MFA challenge error detected'}`;
          }

          return 'pending';
        },
        {
          timeout: 30000,
          intervals: [500, 1000, 2000]
        }
      )
      .toBe(
        'success'
      );
  }

  async regenerateBackupCodes(
    currentPassword?: string,
    verificationCode?: string
  ) {

    await safeClick(
      this.page.getByRole(
        'button',
        {
          name: /regenerate.*backup|new backup|recovery codes/i
        }
      ).first(),
      'Regenerate Backup Codes'
    );

    await this.fillOptionalPasswordAndCode(
      currentPassword,
      verificationCode
    );

    await safeClick(
      this.submitButton,
      'Confirm Regenerate Backup Codes'
    );
  }

  async disableMfa(
    currentPassword?: string,
    verificationCode?: string
  ) {

    await safeClick(
      this.page.getByRole(
        'button',
        {
          name: /disable.*mfa|disable.*2fa|turn off.*two-factor/i
        }
      ).first(),
      'Disable MFA'
    );

    await this.fillOptionalPasswordAndCode(
      currentPassword,
      verificationCode
    );

    await safeClick(
      this.submitButton,
      'Confirm Disable MFA'
    );
  }

  async fillOptionalPasswordAndCode(
    currentPassword?: string,
    verificationCode?: string
  ) {

    if (currentPassword) {
      const passwordInput =
        this.page.locator(
          'input[type="password"]'
        ).first();

      if (
        await passwordInput.isVisible().catch(() => false)
      ) {
        await passwordInput.fill(
          currentPassword
        );
      }
    }

    if (verificationCode) {
      if (
        await this.challengeInput.isVisible().catch(() => false)
      ) {
        await this.challengeInput.fill(
          verificationCode
        );
      }
    }
  }

  async clearTrustedDeviceStorage() {

    await this.page.context().clearCookies();

    await this.page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  }
}
