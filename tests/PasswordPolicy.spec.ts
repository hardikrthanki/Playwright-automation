import {
  expect,
  test
} from '@playwright/test';

import {
  PASSWORD_POLICY,
  validatePasswordPolicy
} from './config/testData';

/* =============================================================================
TEST SUITE: Password Policy

PURPOSE
-------
Validate configured password policy rules used by signup, profile password
change, and reset-password automation.

Run:
npx playwright test tests/PasswordPolicy.spec.ts
============================================================================= */

test.describe(
  'Password Policy',
  () => {

    test(
      'Accepts a valid password that satisfies configured policy',
      () => {

        expect(
          () => validatePasswordPolicy(
            'Valid@123456'
          )
        ).not.toThrow();
      }
    );

    test(
      'Rejects password shorter than configured minimum length',
      () => {

        const shortPassword =
          'a'.repeat(
            Math.max(
              PASSWORD_POLICY.minimumLength - 1,
              0
            )
          );

        expect(
          () => validatePasswordPolicy(
            shortPassword
          )
        ).toThrow(
          /at least/i
        );
      }
    );

    test(
      'Rejects banned passwords from configured policy',
      () => {

        const bannedPassword =
          PASSWORD_POLICY.bannedPasswords[0];

        expect(
          bannedPassword
        ).toBeTruthy();

        expect(
          () => validatePasswordPolicy(
            bannedPassword
          )
        ).toThrow(
          /blocked|policy/i
        );
      }
    );

    test(
      'Banned password comparison is case-insensitive',
      () => {

        const bannedPassword =
          PASSWORD_POLICY.bannedPasswords[0];

        expect(
          () => validatePasswordPolicy(
            bannedPassword.toUpperCase()
          )
        ).toThrow(
          /blocked|policy/i
        );
      }
    );

    test(
      'Uppercase rule follows configuration',
      () => {

        const passwordWithoutUppercase =
          'valid@123456';

        if (
          PASSWORD_POLICY.requireUppercase
        ) {
          expect(
            () => validatePasswordPolicy(
              passwordWithoutUppercase
            )
          ).toThrow(
            /uppercase/i
          );
        } else {
          expect(
            () => validatePasswordPolicy(
              passwordWithoutUppercase
            )
          ).not.toThrow();
        }
      }
    );

    test(
      'Lowercase rule follows configuration',
      () => {

        const passwordWithoutLowercase =
          'VALID@123456';

        if (
          PASSWORD_POLICY.requireLowercase
        ) {
          expect(
            () => validatePasswordPolicy(
              passwordWithoutLowercase
            )
          ).toThrow(
            /lowercase/i
          );
        } else {
          expect(
            () => validatePasswordPolicy(
              passwordWithoutLowercase
            )
          ).not.toThrow();
        }
      }
    );

    test(
      'Digit rule follows configuration',
      () => {

        const passwordWithoutDigit =
          'ValidPassword@';

        if (
          PASSWORD_POLICY.requireDigit
        ) {
          expect(
            () => validatePasswordPolicy(
              passwordWithoutDigit
            )
          ).toThrow(
            /digit/i
          );
        } else {
          expect(
            () => validatePasswordPolicy(
              passwordWithoutDigit
            )
          ).not.toThrow();
        }
      }
    );

    test(
      'Symbol rule follows configuration',
      () => {

        const passwordWithoutSymbol =
          'Valid123456';

        if (
          PASSWORD_POLICY.requireSymbol
        ) {
          expect(
            () => validatePasswordPolicy(
              passwordWithoutSymbol
            )
          ).toThrow(
            /symbol/i
          );
        } else {
          expect(
            () => validatePasswordPolicy(
              passwordWithoutSymbol
            )
          ).not.toThrow();
        }
      }
    );
  }
);
