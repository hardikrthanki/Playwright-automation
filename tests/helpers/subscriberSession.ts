import {
  expect,
  Page
} from '@playwright/test';

import {
  BASE_URL,
  TEST_USERS
} from '../config/testData';

import { LoginPage }
  from '../pages/LoginPage';

export function isLoginUrl(
  url: string
) {
  return /\/login(?:\?|$)/.test(
    url
  );
}

export async function restoreSubscriberSession(
  page: Page
) {
  await new LoginPage(
    page
  ).login(
    TEST_USERS.subscriber.email,
    TEST_USERS.subscriber.password
  );
}

export async function openAuthenticatedPath(
  page: Page,
  path: string,
  urlPattern: RegExp
) {
  await page.goto(
    `${BASE_URL}${path}`,
    {
      waitUntil: 'domcontentloaded'
    }
  );

  if (
    isLoginUrl(
      page.url()
    )
  ) {
    await restoreSubscriberSession(
      page
    );

    await page.goto(
      `${BASE_URL}${path}`,
      {
        waitUntil: 'domcontentloaded'
      }
    );
  }

  await expect(
    page
  ).toHaveURL(
    urlPattern,
    {
      timeout: 30000
    }
  );
}
