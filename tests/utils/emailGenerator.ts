import {
  TEST_USERS
} from '../config/testData';

/* =============================================================================
UTILITY: Email Generator

PURPOSE
-------
Generates unique emails for onboarding tests.

============================================================================= */

export function generateEmail(): string {

  const exactEmail =
    TEST_USERS.onboarding.email;

  if (exactEmail) {
    return exactEmail;
  }

  const emailBases =
    TEST_USERS.onboarding.emailBases.length
      ? TEST_USERS.onboarding.emailBases
      : [
        TEST_USERS.onboarding.emailBase
      ];

  const baseEmail =
    emailBases[
      Date.now() %
      emailBases.length
    ];

  const [
    localPart,
    domain
  ] =
    baseEmail.split('@');

  if (!localPart || !domain) {
    throw new Error(
      'TEST_USERS.onboarding.emailBases must contain valid email addresses.'
    );
  }

  const cleanLocalPart =
    localPart.split('+')[0];

  return `${cleanLocalPart}+${Date.now()}@${domain}`;

}

export function generateMobileNumber(): string {

  const suffix =
    Date.now()
      .toString()
      .slice(-4);

  return `201555${suffix}`;

}
