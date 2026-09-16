import fs from 'fs';
import path from 'path';

import {
  test as base
} from '@playwright/test';

import {
  TEST_USERS
} from '../config/testData';

import { LoginPage }
  from '../pages/LoginPage';

/* =============================================================================
FIXTURE: subscriberAuth

PURPOSE
-------
Logs the shared subscriber in once per run and reuses the saved session so
dashboard, billing, and profile specs do not repeat Sign in.
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
          if (
            fs.existsSync(
              SUBSCRIBER_STORAGE_STATE
            )
          ) {
            const ageMs =
              Date.now() -
              fs.statSync(
                SUBSCRIBER_STORAGE_STATE
              ).mtimeMs;

            if (
              ageMs <
              30 *
              60 *
              1000
            ) {
              return SUBSCRIBER_STORAGE_STATE;
            }
          }

          const page =
            await browser.newPage();

          await new LoginPage(
            page
          ).login(
            TEST_USERS.subscriber.email,
            TEST_USERS.subscriber.password
          );

          await page.context().storageState({
            path: SUBSCRIBER_STORAGE_STATE
          });

          await page.close();

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
