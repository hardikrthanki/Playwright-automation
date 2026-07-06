import {
  TEST_USERS
} from '../config/testData';

/* =============================================================================
UTILITY: Email Generator

PURPOSE
-------
Generates unique emails for onboarding tests.

============================================================================= */

function normalizeEmailTag(
  scenarioTag?: string
) {
  if (!scenarioTag) {
    return '';
  }

  return scenarioTag
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      '-'
    )
    .replace(
      /^-+|-+$/g,
      ''
    );
}

export function generateEmail(
  scenarioTag?: string
): string {

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

  const normalizedTag =
    normalizeEmailTag(
      scenarioTag
    );

  const uniqueSuffix =
    normalizedTag
      ? `${normalizedTag}-${Date.now()}`
      : `${Date.now()}`;

  return `${cleanLocalPart}+${uniqueSuffix}@${domain}`;

}

export function generateMobileNumber(): string {

  const suffix =
    Date.now()
      .toString()
      .slice(-4);

  return `201555${suffix}`;

}
