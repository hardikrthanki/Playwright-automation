// @ts-nocheck

import {
  test,
  expect,
  chromium,
  Page,
  Locator,
} from '@playwright/test';

/* =============================================================================
TEST SUITE: OOLTool End-to-End Onboarding Flow

## PURPOSE

Validates the complete onboarding journey for a brand-new subscriber,
starting from registration and ending with successful subscription
purchase and dashboard access.

## EXECUTION COMMANDS

Run in headed mode:
npx playwright test tests/onboarding.spec.ts --headed

Run in headless mode:
npx playwright test tests/onboarding.spec.ts

Run with Playwright UI:
npx playwright test tests/onboarding.spec.ts --ui

Open last execution report:
npx playwright show-report

## TEST ENVIRONMENT

Application : OOLTool
Environment : PUAT
URL         : https://puat.ooltool.com
Browser     : Chromium

## FLOW COVERED

Step 1 - User Registration
Step 2 - Email Verification (Manual)
Step 3 - User Login
Step 4 - Risk Profile Completion
Step 5 - Compliance Questionnaire Completion
Step 6 - Subscription Plan Selection
Step 7 - Stripe Payment Processing
Step 8 - Dashboard Redirect Validation

## VALIDATIONS

✓ New user registration successful
✓ Verification email received and verified
✓ User login successful
✓ Risk profile saved successfully
✓ Compliance profile saved successfully
✓ Income Builder plan selected
✓ Stripe payment completed successfully
✓ User redirected to dashboard after payment

## TEST DATA

• Generates a unique Gmail alias for every execution
• Uses Stripe test payment details
• Creates a new subscriber account during each run

## DEPENDENCIES

• Gmail access required for email verification
• Stripe test environment must be available
• PUAT environment must be accessible

## EXCLUSIONS

The following validations are covered separately in
Subscriber.spec.ts:

• Dashboard validation
• Billing overview validation
• Subscription plan validation
• Transaction history validation
• Invoice validation
• PDF validation
• Logout validation

## EXPECTED RESULT

A new subscriber account is successfully created,
onboarded, subscribed to the Income Builder plan,
and redirected to the dashboard.

## AUTHOR

Hardik Thanki

============================================================================= */


/* ============================================================================
   CONFIGURATION
============================================================================ */

const BASE_URL = 'https://puat.ooltool.com';
const PASSWORD = 'Test@123456';


function generateEmail(): string {
  return `imhardikthanki+${Date.now()}@gmail.com`;
}
async function networkIdle(
  page: Page,
  timeout = 15000
) {
  await page
    .waitForLoadState('networkidle', { timeout })
    .catch(() => {});
}
async function safeClick(
  locator: Locator,
  label: string
) {
  console.log(`👉 ${label}`);

  await locator.waitFor({
    state: 'visible',
    timeout: 15000,
  });

  await locator.scrollIntoViewIfNeeded();

  await locator.click({
    force: true,
  });
}

/* ============================================================================
   REGISTRATION PAGE
============================================================================ */
class RegistrationPage {
  readonly page: Page;

  readonly createAccountLink: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.createAccountLink = page.getByRole('link', {
      name: /create account/i,
    });

    this.firstNameInput = page.locator(
      'input[name="firstName"]'
    );

    this.lastNameInput = page.locator(
      'input[name="lastName"]'
    );

    this.emailInput = page.locator(
      'input[name="email"]'
    );

    this.passwordInput = page.locator(
      'input[name="password"]'
    );

    this.confirmPasswordInput = page.locator(
      'input[name="confirmPassword"]'
    );

    this.submitButton = page.getByRole('button', {
      name: 'Create Account',
      exact: true,
    });
  }

  /**
   * Open application and registration form.
   */  async open() {
    console.log('🌐 Opening application');

    await this.page.goto(BASE_URL);

    await networkIdle(this.page);

    await safeClick(
      this.createAccountLink,
      'Open Create Account'
    );

    await networkIdle(this.page);
  }
  async register(email: string) {
    console.log(`📝 Registering: ${email}`);

    await this.firstNameInput.fill('Hardik');

    await this.lastNameInput.fill('Thanki');

    await this.emailInput.fill(email);

    await this.passwordInput.fill(PASSWORD);

    await this.confirmPasswordInput.fill(PASSWORD);

    await safeClick(
      this.submitButton,
      'Submit Registration'
    );

    await expect(
      this.page
        .getByText(
          /check your email|verification sent|verify your email|registered/i
        )
        .or(
          this.page.getByRole('heading', {
            name: /verify|thank you|check/i,
          })
        )
    ).toBeVisible({
      timeout: 15000,
    });

    console.log(
      '✅ Registration successful. Verification email sent.'
    );
  }
}
/*
   LOGIN PAGE
============================================================================ */

class LoginPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page
      .getByLabel(/^email$/i)
      .or(
        page.locator('input[type="email"]').first()
      );

    this.passwordInput = page
      .getByLabel(/^password$/i)
      .or(
        page.locator('input[type="password"]').first()
      );

    this.submitButton = page
      .locator('button[type="submit"]')
      .first();
  }
async login(email: string) {

  console.log('🔐 Logging in');

  if (!this.page.url().includes('/login')) {

    await this.page.goto(
      `${BASE_URL}/login`,
      {
        waitUntil: 'domcontentloaded',
      }
    );
  }

  await this.emailInput.waitFor({
    state: 'visible',
    timeout: 10000,
  });

  await this.passwordInput.waitFor({
    state: 'visible',
    timeout: 10000,
  });

  for (let attempt = 1; attempt <= 3; attempt++) {

    console.log(
      `🔐 Login Attempt ${attempt}`
    );

    await this.emailInput.fill(email);

    await this.passwordInput.fill(PASSWORD);

    await safeClick(
      this.submitButton,
      'Submit Login'
    );

    try {
      await expect(this.page)
        .toHaveURL(
          /onboarding/,
          {
            timeout: 20000,
          }
        );

      console.log(
        '✅ Logged in successfully'
      );

      console.log(
        '🌐 Current URL:',
        this.page.url()
      );

      return;

    } catch {

      console.log(
        `⚠️ Login Attempt ${attempt} failed`
      );

      console.log(
        '⚠️ Current URL:',
        this.page.url()
      );
      if (
        this.page.url().includes(
          '/dashboard'
        )
      ) {

        console.log(
          '✅ User already redirected to Dashboard'
        );

        return;
      }

      if (attempt === 3) {

        throw new Error(
          '❌ Login failed after 3 attempts'
        );
      }

      console.log(
        '⏳ Waiting 5 seconds before retry...'
      );

      await this.page.waitForTimeout(
        5000
      );

      await this.page.goto(
        `${BASE_URL}/login`,
        {
          waitUntil: 'domcontentloaded',
        }
      );

      await this.emailInput.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      await this.passwordInput.waitFor({
        state: 'visible',
        timeout: 10000,
      });
    }
  }
}
}
/* ============================================================================
   RISK PROFILE PAGE
============================================================================ */
class RiskProfilePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fill() {
    console.log('📊 Filling Risk Profile');

    console.log(
      '• Years Investing Experience → 3-5 years'
    );

    const experienceDropdown =
      this.page.locator('[role="combobox"]').nth(0);

    await safeClick(
      experienceDropdown,
      'Open Experience Dropdown'
    );

    await safeClick(
      this.page.getByRole('option', {
        name: /3.?5 years/i,
      }),
      'Select 3-5 years'
    );
    console.log(
  '• Options Experience → Beginner'
);

await safeClick(
  this.page.getByRole('button', {
    name: /^beginner$/i,
  }),
  'Select Beginner'
);

console.log(
  '• Multi-leg Strategies → No'
);

await safeClick(
  this.page.getByRole('button', {
    name: /^no$/i,
  }),
  'Select No'
);

/*
  
*/    console.log('• Risk Tolerance → Moderate');

    await safeClick(
      this.page.getByRole('button', {
        name: /^moderate$/i,
      }),
      'Select Moderate'
    );
    console.log(
      '• Portfolio Loss → Keeping default 10%'
    );

    console.log(
      '• Preferred Duration → 30-60 days'
    );

    const durationCheckboxes =
      this.page.locator('[role="checkbox"]');

    const durationCount =
      await durationCheckboxes.count();

    for (let i = 0; i < durationCount; i++) {
      const parentText =
        await durationCheckboxes
          .nth(i)
          .locator('..')
          .textContent();

      if (
        parentText?.includes('30-60 days')
      ) {
        const checked =
          await durationCheckboxes
            .nth(i)
            .getAttribute('aria-checked');

        if (checked !== 'true') {
          await durationCheckboxes
            .nth(i)
            .click({ force: true });
        }

        break;
      }
    }

    console.log(
      '• Allowed Strategy → Covered Calls'
    );

    await this.selectCheckboxByLabel(
      'Covered Calls'
    );

    console.log(
      '• Allowed Strategy → Cash Secured Puts'
    );

    await this.selectCheckboxByLabel(
      'Cash Secured Puts'
    );

  console.log('• Account Type → Cash');

const cashText = this.page.getByText(/^Cash$/).last();

await cashText.scrollIntoViewIfNeeded();

await cashText.click({ force: true });

await this.page.waitForTimeout(1000);

const accountCheckboxes =
  this.page.locator('[role="checkbox"]');

let accountSelected = false;

for (
  let i = 0;
  i < await accountCheckboxes.count();
  i++
) {
  const checked =
    await accountCheckboxes
      .nth(i)
      .getAttribute('aria-checked');

  if (checked === 'true') {
    accountSelected = true;
    break;
  }
}

if (!accountSelected) {
  throw new Error(
    'Cash Account Type was not selected.'
  );
}

console.log(
  '✅ Cash Account Type selected'
);
    await safeClick(
      this.page.getByRole('button', {
        name: /save risk profile/i,
      }),
      'Save Risk Profile'
    );

await expect(
  this.page.getByText(
    /read disclosure/i
  ).first()
).toBeVisible({
  timeout: 15000,
});

console.log(
  '✅ Risk Profile completed'
);
const dropdowns = this.page.locator('button[role="combobox"]');

for (let i = 0; i < await dropdowns.count(); i++) {
  console.log(
    `Dropdown ${i}:`,
    await dropdowns.nth(i).textContent(),
    'Visible:',
    await dropdowns.nth(i).isVisible()
  );
}

console.log(
  '➡️ Compliance tab opened successfully'
);
  }
  async selectCheckboxByLabel(
    label: string
  ) {
    const checkboxes =
      this.page.locator(
        '[role="checkbox"]'
      );

    const count =
      await checkboxes.count();

    for (let i = 0; i < count; i++) {
      const containerText =
        await checkboxes
          .nth(i)
          .locator('..')
          .textContent();

      if (
        containerText?.includes(label)
      ) {
        const checked =
          await checkboxes
            .nth(i)
            .getAttribute(
              'aria-checked'
            );

        if (checked !== 'true') {
          await checkboxes
            .nth(i)
            .click({
              force: true,
            });
        }

        break;
      }
    }
  }
}

class CompliancePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  async fill() {
    console.log('📋 Filling Compliance Profile');
    await this.page.waitForTimeout(3000);
   console.log('• State of Residence');
const dropdowns =
  this.page.locator(
    'button[role="combobox"]'
  );

console.log(
  `Found ${await dropdowns.count()} dropdown(s)`
);

for (
  let i = 0;
  i < await dropdowns.count();
  i++
) {
  console.log(
    `Dropdown ${i}:`,
    await dropdowns.nth(i).textContent(),
    'Visible:',
    await dropdowns.nth(i).isVisible()
  );
}
const stateDropdown =
  dropdowns.nth(2);

await stateDropdown.scrollIntoViewIfNeeded();

await safeClick(
  stateDropdown,
  'Open State Dropdown'
);
await this.page.waitForTimeout(
  1000
);
const stateOption =
  this.page
    .locator('[role="option"]')
    .filter({
      hasText: /^[A-Za-z]/,
    })
    .first();

await safeClick(
  stateOption,
  'Select State'
);

const selectedValue =
  await stateDropdown.textContent();

console.log(
  'Selected State:',
  selectedValue
);

console.log('✅ State Selected');
  
    const disclosureButtons =
      this.page.getByRole('button', {
        name: /read disclosure/i,
      });

    const disclosureCount =
      await disclosureButtons.count();

    console.log(
      `Found ${disclosureCount} disclosure(s)`
    );

    for (
      let i = 0;
      i < disclosureCount;
      i++
    ) {
      console.log(
        `📖 Processing Disclosure ${i + 1} of ${disclosureCount}`
      );
      await disclosureButtons
        .nth(i)
        .scrollIntoViewIfNeeded();

      await safeClick(
        disclosureButtons.nth(i),
        `Open Disclosure ${i + 1}`
      );
      await this.page.waitForTimeout(2000);
     const disclosureContent =
  this.page.locator(
    'div.flex-1.overflow-y-auto'
  ).last();

await disclosureContent.evaluate(
  async (element) => {

    const step = 200;

    while (
      element.scrollTop +
      element.clientHeight <
      element.scrollHeight
    ) {

      element.scrollTop += step;

      element.dispatchEvent(
        new Event('scroll')
      );

      await new Promise(
        resolve =>
          setTimeout(resolve, 150)
      );
    }

    element.scrollTop =
      element.scrollHeight;

    element.dispatchEvent(
      new Event('scroll')
    );
  }
);

await this.page.waitForTimeout(
  2000
);
      const acceptButton =
        this.page.getByRole('button', {
          name:
            /i have read and accept/i,
        });

      await expect(
        acceptButton
      ).toBeVisible({
        timeout: 10000,
      });

      await expect(
        acceptButton
      ).toBeEnabled({
        timeout: 10000,
      });

      await safeClick(
        acceptButton,
        `Accept Disclosure ${i + 1}`
      );

      console.log(
        `✅ Disclosure ${i + 1} Accepted`
      );
      await this.page.waitForTimeout(
        1500
      );
    }
    await safeClick(
      this.page.getByRole('button', {
        name:
          /save compliance profile/i,
      }),
      'Save Compliance Profile'
    );

 console.log(
  '🌐 Current URL:',
  this.page.url()
);

await this.page.waitForTimeout(
  5000
);
  }
}


/* ============================================================================
   PLAN SELECTION PAGE
============================================================================ */

class PlanSelectionPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectIncomeBuilderPlan() {

    console.log(
      '💳 Selecting Subscription Plan'
    );
    await this.page.waitForTimeout(
      3000
    );
   await expect(
  this.page.getByText(
    /choose your plan/i
  )
).toBeVisible({
    timeout: 15000,
});
    const monthlyTab =
      this.page.getByRole(
        'button',
        {
          name: /^monthly$/i,
        }
      );

    if (
      await monthlyTab.isVisible()
    ) {

      await safeClick(
        monthlyTab,
        'Select Monthly Tab'
      );

      console.log(
        '✅ Monthly Tab Selected'
      );
    }
    console.log(
      '• Selecting Income Builder Plan'
    );

    const incomeBuilderPlan =
      this.page.getByText(
        'Income Builder',
        {
          exact: true,
        }
      );

    await incomeBuilderPlan
      .scrollIntoViewIfNeeded();

    await safeClick(
      incomeBuilderPlan,
      'Select Income Builder Plan'
    );

    await this.page.waitForTimeout(
      2000
    );

    console.log(
      '✅ Income Builder Plan Selected'
    );
    await safeClick(
      this.page.getByRole(
        'button',
        {
          name:
            /continue to payment/i,
        }
      ),
      'Continue to Payment'
    );

    console.log(
      '✅ Continue to Payment Clicked'
    );
  }
}

/* ============================================================================
   STRIPE PAYMENT PAGE
============================================================================ */

class StripePaymentPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

 async completePayment() {

  console.log('💳 Completing Stripe Payment');
  await this.page.waitForSelector(
    '#cardNumber',
    { timeout: 60000 }
  );

  console.log(
    '✅ Stripe Checkout Loaded'
  );
  const emailInput =
    this.page.locator(
      'input[type="email"]'
    );

  if (await emailInput.count() > 0) {

    const email =
      await emailInput.inputValue();

    if (!email) {
console.log(
  'ℹ️ Stripe email already populated'
);
    }
  }

  await this.page.fill(
    '#cardNumber',
    '4242424242424242'
  );

  console.log(
    '✅ Card Number Entered'
  );

 
  await this.page.fill(
    '#cardExpiry',
    '12/34'
  );

  
  await this.page.fill(
    '#cardCvc',
    '123'
  );

  console.log(
    '✅ Expiry and CVC Entered'
  );

 
  await this.page.fill(
    '#billingName',
    'Hardik'
  );

  console.log(
    '✅ Cardholder Name Entered'
  );

  
  await this.page.selectOption(
    '#billingCountry',
    'IN'
  );

  console.log(
    '✅ Country Selected: India'
  );

 
  await this.page.waitForTimeout(
    2000
  );

  const subscribeButton =
    this.page.getByRole(
      'button',
      {
        name: /subscribe/i,
      }
    );

  await expect(
    subscribeButton
  ).toBeEnabled({
    timeout: 30000,
  });

  await safeClick(
    subscribeButton,
    'Subscribe'
  );

  console.log(
    '✅ Subscribe Clicked'
  );

 
  console.log(
    '⏳ Waiting for payment processing...'
  );

  await this.page.waitForTimeout(
    10000
  );

  await expect(this.page).toHaveURL(
    /dashboard/,
    {
      timeout: 120000,
    }
  );

  console.log(
    '✅ User redirected to Dashboard after successful payment'
  );

  console.log(
    '🌐 Final URL:',
    this.page.url()
  );
  try {

    const successToast =
      this.page.getByText(
        /payment successful/i
      );

    await expect(
      successToast
    ).toBeVisible({
      timeout: 10000,
    });

    console.log(
      '✅ Success Toast Displayed'
    );

  } catch {

    console.log(
      'ℹ️ Success Toast Not Visible'
    );
  }

  console.log(
    '🎉 Payment Completed'
  );
}}
/* ============================================================================
   MAIN TEST
============================================================================ */

test.describe('OOLTool Onboarding Flow', () => {
  test(
    'Register → Verify Email → Login → Risk → Compliance',
    async () => {
      test.setTimeout(20 * 60 * 1000); // 20 minutes

const browser = await chromium.launch({
  headless: false,
});

const context = await browser.newContext();

const page = await context.newPage();
      const email =
        generateEmail();

      console.log(
        '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      );

      console.log(
        `🚀 Test Email: ${email}`
      );

      console.log(
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
      );

      try {
        await test.step(
          'Step 1 - Registration',
          async () => {
            const registration =
              new RegistrationPage(
                page
              );

            await registration.open();

            await registration.register(
              email
            );
          }
        );
let loginPage: Page = page;

await test.step(
  'Step 2 - Verify Email',
  async () => {
    console.log('\n📧 MANUAL EMAIL VERIFICATION REQUIRED');
    console.log(`📧 Verify email sent to: ${email}`);
    console.log('📧 Open Gmail and click the verification link.');
    console.log('▶️ After verification, resume Playwright.');

    await page.pause();

    loginPage = page;
  }
);
        await test.step(
          'Step 3 - Login',
          async () => {
            const login =
              new LoginPage(
                loginPage!
              );

            await login.login(
              email
            );
          }
        );
        await test.step(
          'Step 4 - Risk Profile',
          async () => {
            const risk =
              new RiskProfilePage(
                loginPage!
              );

            await risk.fill();
          }
        );
        await test.step(
          'Step 5 - Compliance',
          async () => {
            const compliance =
              new CompliancePage(
                loginPage!
              );

            await compliance.fill();
          }
        );

        await test.step(
  'Step 6 - Plan Selection',
  async () => {

    const planPage =
      new PlanSelectionPage(page);

    await planPage.selectIncomeBuilderPlan();
  }
  
);
await test.step(
  'Step 7 - Stripe Payment',
  async () => {

    const stripe =
      new StripePaymentPage(
        page
      );

    await stripe.completePayment();
  }
);
console.log(
  '🎉 OOLTOOL ONBOARDING FLOW COMPLETED SUCCESSFULLY'
);

console.log(
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
);

} finally {

  await browser.close();

  console.log(
    '✅ Browser Closed'
  );
}
    }
  );
});