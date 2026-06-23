/* =============================================================================
TEST DATA CONFIGURATION

PURPOSE
-------
Stores reusable test data used across Playwright tests.

============================================================================= */

export const BASE_URL =
  'https://puat.ooltool.com';

/* ============================================================================
   TEST USERS
============================================================================ */

export const TEST_USERS = {

  onboarding: {

    firstName: 'Hardik',

    lastName: 'Thanki',

    password: 'Test@123456'
  },

  subscriber: {

    email: 'imhardikthanki+09@gmail.com',

    password: 'H@rdik9944'
  }
};

/* ============================================================================
   STRIPE TEST DATA
============================================================================ */

export const STRIPE_CARD =
  '4242424242424242';

export const STRIPE_EXPIRY =
  '12/34';

export const STRIPE_CVC =
  '123';

export const COUNTRY =
  'IN';