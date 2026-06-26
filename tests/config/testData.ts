/* =============================================================================
TEST DATA CONFIGURATION

PURPOSE
-------
Stores reusable test data used across Playwright tests.

============================================================================= */

export const BASE_URL =
  process.env.BASE_URL ??
  'https://puat.ooltool.com';

function getBooleanEnv(
  name: string,
  defaultValue: boolean
) {

  const value =
    process.env[name];

  if (value === undefined) {
    return defaultValue;
  }

  return [
    '1',
    'true',
    'yes',
    'on'
  ].includes(
    value.toLowerCase()
  );
}

function getNumberEnv(
  name: string,
  defaultValue: number
) {

  const value =
    process.env[name];

  if (value === undefined) {
    return defaultValue;
  }

  const parsedValue =
    Number(value);

  if (
    Number.isNaN(parsedValue)
  ) {
    throw new Error(
      `${name} must be a number.`
    );
  }

  return parsedValue;
}

/* ============================================================================
   TEST USERS
============================================================================ */

export const TEST_USERS = {

  onboarding: {

    firstName:
      process.env.ONBOARDING_FIRST_NAME ??
      'Hardik',

    lastName:
      process.env.ONBOARDING_LAST_NAME ??
      'Thanki',

    email:
      process.env.ONBOARDING_EMAIL,

    emailBase:
      process.env.ONBOARDING_EMAIL_BASE ??
      'imhardikthanki@gmail.com',

    emailBases:
      (
        process.env.ONBOARDING_EMAIL_BASES ??
        process.env.ONBOARDING_EMAIL_BASE ??
        'imhardikthanki@gmail.com'
      )
        .split(',')
        .map(
          email =>
            email.trim()
        )
        .filter(Boolean),

    mobile:
      process.env.ONBOARDING_MOBILE ??
      '2015550123',

    password:
      process.env.ONBOARDING_PASSWORD ??
      'Test@123456'
  },

  subscriber: {

    email:
      process.env.SUBSCRIBER_EMAIL ??
      'imhardikthanki+09@gmail.com',

    password:
      process.env.SUBSCRIBER_PASSWORD ??
      'H@rdik1989'
  }
};

/* ============================================================================
   AUTH SETTINGS
============================================================================ */

export const AUTH_SETTINGS = {

  otpCode:
    process.env.AUTH_OTP_CODE ??
    '111111',

  emailVerificationLinkExpiryMinutes:
    getNumberEnv(
      'AUTH_EMAIL_VERIFICATION_LINK_EXPIRY_MINUTES',
      5
    ),

  passwordResetLinkExpiryMinutes:
    getNumberEnv(
      'AUTH_PASSWORD_RESET_LINK_EXPIRY_MINUTES',
      5
    ),

  emailVerificationResendsPerWindow:
    getNumberEnv(
      'AUTH_EMAIL_VERIFICATION_RESENDS_PER_WINDOW',
      5
    ),

  emailVerificationResendWindowSeconds:
    getNumberEnv(
      'AUTH_EMAIL_VERIFICATION_RESEND_WINDOW_SECONDS',
      3600
    ),

  registrationMobileOtpEnabled:
    getBooleanEnv(
      'AUTH_REGISTRATION_MOBILE_OTP_ENABLED',
      true
    ),

  postLoginMobileVerificationEnabled:
    getBooleanEnv(
      'AUTH_POST_LOGIN_MOBILE_VERIFICATION_ENABLED',
      true
    ),

  emailVerificationRequired:
    getBooleanEnv(
      'AUTH_EMAIL_VERIFICATION_REQUIRED',
      true
    )
};

/* ============================================================================
   PASSWORD POLICY
============================================================================ */

export const PASSWORD_POLICY = {

  minimumLength:
    getNumberEnv(
      'PASSWORD_MINIMUM_LENGTH',
      8
    ),

  requireUppercase:
    getBooleanEnv(
      'PASSWORD_REQUIRE_UPPERCASE',
      false
    ),

  requireLowercase:
    getBooleanEnv(
      'PASSWORD_REQUIRE_LOWERCASE',
      false
    ),

  requireDigit:
    getBooleanEnv(
      'PASSWORD_REQUIRE_DIGIT',
      false
    ),

  requireSymbol:
    getBooleanEnv(
      'PASSWORD_REQUIRE_SYMBOL',
      false
    ),

  bannedPasswords:
    (
      process.env.PASSWORD_BANNED_PASSWORDS ??
      'password,123456,qwerty,letmein,admin'
    )
      .split(',')
      .map(
        password =>
          password.trim()
      )
      .filter(Boolean),

  expiryDays:
    getNumberEnv(
      'PASSWORD_EXPIRY_DAYS',
      0
    )
};

/* ============================================================================
   MFA SETTINGS
============================================================================ */

export const MFA_SETTINGS = {

  availableToUsers:
    getBooleanEnv(
      'MFA_AVAILABLE_TO_USERS',
      true
    ),

  requireForAdminRoles:
    getBooleanEnv(
      'MFA_REQUIRE_FOR_ADMIN_ROLES',
      false
    ),

  requireForAllUsers:
    getBooleanEnv(
      'MFA_REQUIRE_FOR_ALL_USERS',
      false
    ),

  allowTotp:
    getBooleanEnv(
      'MFA_ALLOW_TOTP',
      true
    ),

  allowSmsSecondFactor:
    getBooleanEnv(
      'MFA_ALLOW_SMS_SECOND_FACTOR',
      false
    ),

  recoveryCodesPerUser:
    getNumberEnv(
      'MFA_RECOVERY_CODES_PER_USER',
      5
    ),

  maxFailedAttempts:
    getNumberEnv(
      'MFA_MAX_FAILED_ATTEMPTS',
      5
    ),

  lockoutDurationMinutes:
    getNumberEnv(
      'MFA_LOCKOUT_DURATION_MINUTES',
      30
    ),

  trustedDevicesEnabled:
    getBooleanEnv(
      'MFA_TRUSTED_DEVICES_ENABLED',
      true
    ),

  trustedDeviceLifetimeDays:
    getNumberEnv(
      'MFA_TRUSTED_DEVICE_LIFETIME_DAYS',
      15
    ),

  forceAfterFailedLogins:
    getNumberEnv(
      'MFA_FORCE_AFTER_FAILED_LOGINS',
      3
    ),

  forceAfterPasswordChange:
    getBooleanEnv(
      'MFA_FORCE_AFTER_PASSWORD_CHANGE',
      true
    ),

  forceAfterSensitiveProfileChanges:
    getBooleanEnv(
      'MFA_FORCE_AFTER_SENSITIVE_PROFILE_CHANGES',
      true
    ),

  forceFromUnusualLocation:
    getBooleanEnv(
      'MFA_FORCE_FROM_UNUSUAL_LOCATION',
      false
    )
};

/* ============================================================================
   RATE LIMIT SETTINGS
============================================================================ */

export const AUTH_RATE_LIMITS = {

  authEmailsPerWindow:
    getNumberEnv(
      'RATE_AUTH_EMAILS_PER_WINDOW',
      30
    ),

  authEmailsWindowSeconds:
    getNumberEnv(
      'RATE_AUTH_EMAILS_WINDOW_SECONDS',
      3600
    ),

  authSmsPerWindow:
    getNumberEnv(
      'RATE_AUTH_SMS_PER_WINDOW',
      30
    ),

  authSmsWindowSeconds:
    getNumberEnv(
      'RATE_AUTH_SMS_WINDOW_SECONDS',
      3600
    ),

  tokenVerificationsPerWindow:
    getNumberEnv(
      'RATE_TOKEN_VERIFICATIONS_PER_WINDOW',
      30
    ),

  tokenVerificationsWindowSeconds:
    getNumberEnv(
      'RATE_TOKEN_VERIFICATIONS_WINDOW_SECONDS',
      300
    ),

  signupsAndSigninsPerWindow:
    getNumberEnv(
      'RATE_SIGNUPS_SIGNINS_PER_WINDOW',
      30
    ),

  signupsAndSigninsWindowSeconds:
    getNumberEnv(
      'RATE_SIGNUPS_SIGNINS_WINDOW_SECONDS',
      300
    ),

  passwordResetsPerWindow:
    getNumberEnv(
      'RATE_PASSWORD_RESETS_PER_WINDOW',
      5
    ),

  passwordResetsWindowSeconds:
    getNumberEnv(
      'RATE_PASSWORD_RESETS_WINDOW_SECONDS',
      3600
    )
};

export const API_RATE_LIMITS = {

  authRequestsPerWindow:
    getNumberEnv(
      'RATE_API_AUTH_REQUESTS_PER_WINDOW',
      5
    ),

  authWindowSeconds:
    getNumberEnv(
      'RATE_API_AUTH_WINDOW_SECONDS',
      60
    ),

  readRequestsPerWindow:
    getNumberEnv(
      'RATE_API_READ_REQUESTS_PER_WINDOW',
      60
    ),

  readWindowSeconds:
    getNumberEnv(
      'RATE_API_READ_WINDOW_SECONDS',
      60
    ),

  writeRequestsPerWindow:
    getNumberEnv(
      'RATE_API_WRITE_REQUESTS_PER_WINDOW',
      20
    ),

  writeWindowSeconds:
    getNumberEnv(
      'RATE_API_WRITE_WINDOW_SECONDS',
      60
    ),

  publicRequestsPerWindow:
    getNumberEnv(
      'RATE_API_PUBLIC_REQUESTS_PER_WINDOW',
      30
    ),

  publicWindowSeconds:
    getNumberEnv(
      'RATE_API_PUBLIC_WINDOW_SECONDS',
      60
    )
};

export const OTP_RATE_LIMITS = {

  perPhoneMaxOtpsPerWindow:
    getNumberEnv(
      'RATE_OTP_PER_PHONE_MAX_PER_WINDOW',
      5
    ),

  perPhoneWindowSeconds:
    getNumberEnv(
      'RATE_OTP_PER_PHONE_WINDOW_SECONDS',
      600
    ),

  perUserMaxOtpsPerWindow:
    getNumberEnv(
      'RATE_OTP_PER_USER_MAX_PER_WINDOW',
      10
    ),

  perUserWindowSeconds:
    getNumberEnv(
      'RATE_OTP_PER_USER_WINDOW_SECONDS',
      600
    )
};

export function validatePasswordPolicy(
  password: string
) {

  if (
    password.length <
    PASSWORD_POLICY.minimumLength
  ) {
    throw new Error(
      `Password must be at least ${PASSWORD_POLICY.minimumLength} characters.`
    );
  }

  if (
    PASSWORD_POLICY.requireUppercase &&
    !/[A-Z]/.test(password)
  ) {
    throw new Error(
      'Password must contain an uppercase letter.'
    );
  }

  if (
    PASSWORD_POLICY.requireLowercase &&
    !/[a-z]/.test(password)
  ) {
    throw new Error(
      'Password must contain a lowercase letter.'
    );
  }

  if (
    PASSWORD_POLICY.requireDigit &&
    !/[0-9]/.test(password)
  ) {
    throw new Error(
      'Password must contain a digit.'
    );
  }

  if (
    PASSWORD_POLICY.requireSymbol &&
    !/[^A-Za-z0-9]/.test(password)
  ) {
    throw new Error(
      'Password must contain a symbol.'
    );
  }

  if (
    PASSWORD_POLICY.bannedPasswords.some(
      bannedPassword =>
        bannedPassword.toLowerCase() ===
        password.toLowerCase()
    )
  ) {
    throw new Error(
      'Password is blocked by the configured password policy.'
    );
  }
}

/* ============================================================================
   STRIPE TEST DATA
============================================================================ */

export const STRIPE_CARD =
  process.env.STRIPE_CARD ??
  '4242424242424242';

export const STRIPE_EXPIRY =
  process.env.STRIPE_EXPIRY ??
  '12/34';

export const STRIPE_CVC =
  process.env.STRIPE_CVC ??
  '123';

export const COUNTRY =
  process.env.COUNTRY ??
  'IN';
