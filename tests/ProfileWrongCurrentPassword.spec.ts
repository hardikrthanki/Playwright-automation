import {
  test
} from '@playwright/test';

import { LoginPage }
  from './pages/LoginPage';

import { ProfilePage }
  from './pages/ProfilePage';

import {
  TEST_USERS
} from './config/testData';

/* =============================================================================
TEST SUITE: Wrong Current Password

PURPOSE
-------
Validate error message when user enters incorrect current password.

Run:
npx playwright test tests/ProfileWrongCurrentPassword.spec.ts --headed

============================================================================= */

test(
  'Wrong Current Password Validation',
  async ({ page }) => {
    test.setTimeout(
      90000
    );

    const login =
      new LoginPage(page);

    const profile =
      new ProfilePage(page);


    await login.login(
      TEST_USERS.subscriber.email,
      TEST_USERS.subscriber.password
    );

    await profile.open();


    await profile.changePasswordMismatch(
      'WrongPassword123',
      'H@rdik1989',
      'H@rdik1989'
    );


    await profile.validateWrongCurrentPassword();

  }
);
