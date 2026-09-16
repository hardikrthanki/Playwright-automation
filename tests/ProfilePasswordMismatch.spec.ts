import {
  test
} from './fixtures/subscriberAuth';

import { ProfilePage }
  from './pages/ProfilePage';

import {
  TEST_USERS
} from './config/testData';

/* =============================================================================
TEST SUITE: Profile Password Guardrails

PURPOSE
-------
One authenticated session validates mismatch and wrong-current-password.
============================================================================= */

test(
  'Password mismatch and wrong current password in one session',
  async ({ page }) => {
    test.setTimeout(
      120000
    );

    const profile =
      new ProfilePage(
        page
      );

    await profile.open();

    await test.step(
      'Password mismatch is blocked',
      async () => {
        await profile.changePasswordMismatch(
          TEST_USERS.subscriber.password,
          'H@rdik1989',
          'H@rdik9999'
        );

        await profile.validatePasswordMismatch();
      }
    );

    await test.step(
      'Wrong current password is blocked',
      async () => {
        await profile.changePasswordMismatch(
          'WrongPassword123',
          'H@rdik1989',
          'H@rdik1989'
        );

        await profile.validateWrongCurrentPassword();
      }
    );
  }
);
