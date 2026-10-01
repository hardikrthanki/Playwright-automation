import fs from 'fs';

import path from 'path';

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
      ? `${normalizedTag.slice(0, 12)}-${Date.now().toString(36)}`
      : Date.now().toString(36);

  return `${cleanLocalPart}+${uniqueSuffix}@${domain}`;

}

const usedMobileFile =
  path.join(
    process.cwd(),
    'test-results',
    'used-mobiles.json'
  );

function usedMobileNumbers(): string[] {
  try {
    const saved =
      JSON.parse(
        fs.readFileSync(
          usedMobileFile,
          'utf8'
        )
      );

    return Array.isArray(saved)
      ? saved.filter(
        (value) =>
          typeof value === 'string'
      )
      : [];
  } catch {
    return [];
  }
}

export function generateMobileNumber(): string {
  const used =
    new Set(
      usedMobileNumbers()
    );

  let number =
    '';

  for (
    let attempt = 0;
    attempt < 40 &&
      (
        !number ||
        used.has(number)
      );
    attempt += 1
  ) {
    const suffix =
      Math.floor(
        Math.random() * 10000
      )
        .toString()
        .padStart(
          4,
          '0'
        );

    number =
      `201555${suffix}`;
  }

  used.add(number);

  fs.mkdirSync(
    path.dirname(
      usedMobileFile
    ),
    {
      recursive: true
    }
  );

  fs.writeFileSync(
    usedMobileFile,
    JSON.stringify(
      [...used]
    )
  );

  return number;
}
