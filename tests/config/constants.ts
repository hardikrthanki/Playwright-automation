/* =============================================================================
CONSTANTS

PURPOSE
-------
Stores shared timeout, wait, and route constants used by Playwright tests.
============================================================================= */

export const TIMEOUTS = {

  SHORT: 5000,

  MEDIUM: 10000,

  LONG: 30000,

  EXTRA_LONG: 60000

};

export const WAITS = {

  SMALL: 1000,

  NORMAL: 2000,

  LARGE: 5000

};

export const URLS = {

  LOGIN: '/login',

  DASHBOARD: '/dashboard',

  ONBOARDING: '/onboarding',

  BILLING: '/billing'

};
