import fs from 'fs';
import path from 'path';

import {
  test as base
} from '@playwright/test';

import {
  BASE_URL,
  TEST_USERS
} from '../config/testData';

import { LoginPage }
  from '../pages/LoginPage';

import {
  isLoginUrl
} from '../helpers/subscriberSession';

/* =============================================================================
FIXTURE: subscriberAuth

PURPOSE
-------
Logs the shared subscriber in once per run and reuses the saved session so
dashboard, billing, and profile specs do not repeat Sign in.
The saved session is probed against /dashboard so an expired cookie is not
reused.
============================================================================= */

export const SUBSCRIBER_STORAGE_STATE =
  path.join(
    process.cwd(),
    'test-results',
    '.auth',
    'subscriber.json'
  );

let prepareStorage:
  Promise<string> |
  undefined;

export const test = base.extend({
  storageState: async (
    {
      browser
    },
    use
  ) => {
    fs.mkdirSync(
      path.dirname(
        SUBSCRIBER_STORAGE_STATE
      ),
      {
        recursive: true
      }
    );

    if (
      !prepareStorage
    ) {
      prepareStorage =
        (async () => {
          const hasStoredSession =
            fs.existsSync(
              SUBSCRIBER_STORAGE_STATE
            );

          const context =
            await browser.newContext(
              hasStoredSession
                ? {
                    storageState:
                      SUBSCRIBER_STORAGE_STATE
                  }
                : {}
            );

          const page =
            await context.newPage();

          await page.goto(
            `${BASE_URL}/dashboard`,
            {
              waitUntil: 'domcontentloaded'
            }
          );

          if (
            isLoginUrl(
              page.url()
            )
          ) {
            await new LoginPage(
              page
            ).login(
              TEST_USERS.subscriber.email,
              TEST_USERS.subscriber.password
            );
          }

          await context.storageState({
            path: SUBSCRIBER_STORAGE_STATE
          });

          await context.close();

          return SUBSCRIBER_STORAGE_STATE;
        })();
    }

    await use(
      await prepareStorage
    );
  }
});

export {
  expect
} from '@playwright/test';
