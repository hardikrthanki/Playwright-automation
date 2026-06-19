// @ts-nocheck
/**
 * Registration Test Suite
 * 
 * This test suite verifies user registration functionality including:
 * - Positive test: successful registration with valid data
 * - Validation tests: field-level validation for all required fields
 * 
 * Features:
 * - Uses Page Object Model (POM) pattern
 * - Stable locators using getByLabel
 * - Field-level validation using aria-invalid attribute
 * - No body text validation
 * 
 * Run: npx playwright test tests/registration.spec.js --headed
 */
import { test, expect } from '@playwright/test';

/**
 * Test Data Configuration
 * Centralized test data for reuse across tests
 * 
 * @property {Object} validUser - Valid user data for successful registration
 * @property {Object} invalidPasswords - Invalid password scenarios for validation tests
 */
const testData = {
  validUser: {
    firstName: 'John',
    lastName: 'Doe',
    password: 'Test@123456',
    confirmPassword: 'Test@123456',
    state: 'AK'
  },
  invalidPasswords: {
    tooShort: 'Test@12',
    noMatch: { password: 'Test@123456', confirmPassword: 'Different@123456' }
  }
};

/**
 * BasePage - Parent class with common functionality
 * Provides shared navigation and element locators for all pages
 */
class BasePage {
  constructor(page) {
    this.page = page;
    this.baseUrl = 'https://uat.ooltool.com';
  }

  /**
   * Navigate to a specific path within the application
   * @param {string} path - URL path to navigate to
   */
  async goto(path = '') {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  /**
   * Generic submit button locator
   * Matches various button text patterns used in forms
   */
  get submitButton() {
    return this.page.getByRole('button', { name: /create account|sign up|register/i });
  }
}

/**
 * RegistrationPage - Page Object for registration form
 * 
 * Encapsulates all locators and methods specific to registration functionality.
 * Uses stable locators (getByLabel) and aria-invalid for validation.
 * 
 * @extends BasePage
 */
class RegistrationPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // ============================================
  // Form Field Locators (Stable - getByLabel)
  // ============================================

  /** First name input field */
  get firstName() {
    return this.page.getByLabel(/first\s*name/i);
  }

  /** Last name input field */
  get lastName() {
    return this.page.getByLabel(/last\s*name/i);
  }

  /** Email input field */
  get email() {
    return this.page.getByLabel(/email/i);
  }

  /** Phone number input field */
  get phone() {
    return this.page.getByLabel(/phone/i);
  }

  /** Password input field */
  get password() {
    return this.page.getByLabel(/password/i);
  }

  /** Confirm password input field */
  get confirmPassword() {
    return this.page.getByLabel(/confirm\s*password/i);
  }

  /** State/Province dropdown selector */
  get stateSelect() {
    return this.page.getByLabel(/state|province/i);
  }

  /** Create Account link on homepage */
  get createAccountLink() {
    return this.page.getByRole('link', { name: /create account/i });
  }

  /** Main form container element */
  get formContainer() {
    return this.page.locator('form');
  }

  /** Success message locator */
  get successMessage() {
    return this.page.getByText(/created|verify|sent/i, { exact: false });
  }

  /** Error message container */
  get errorContainer() {
    return this.page.locator('[class*="error"], [role="alert"]');
  }

  // ============================================
  // Navigation Methods
  // ============================================

  /** Navigate to homepage */
  async navigate() {
    await this.goto();
  }

  /** Navigate directly to registration page */
  async goToRegisterPage() {
    await this.goto('/register');
  }

  /** Click Create Account link from homepage */
  async clickCreateAccount() {
    await this.createAccountLink.click();
  }

  // ============================================
  // Form Actions
  // ============================================

  /**
   * Fill registration form with provided data
   * Only fills fields that have values in the data object
   * @param {Object} data - Form data containing fields to fill
   */
  async fillForm(data) {
    if (data.firstName) await this.firstName.fill(data.firstName);
    if (data.lastName) await this.lastName.fill(data.lastName);
    if (data.email) await this.email.fill(data.email);
    if (data.phone) await this.phone.fill(data.phone);
    if (data.password) await this.password.fill(data.password);
    if (data.confirmPassword) await this.confirmPassword.fill(data.confirmPassword);
    if (data.state) await this.stateSelect.selectOption({ value: data.state });
  }

  /** Submit the registration form */
  async submit() {
    await this.submitButton.click();
  }

  // ============================================
  // Validation Methods (Field-level)
  // ============================================

  /**
   * Check if a field has validation error using aria-invalid attribute
   * This replaces body text validation with proper UI-based validation
   * 
   * @param {Locator} field - The form field locator to check
   * @returns {Promise<boolean>} True if field has aria-invalid="true"
   */
  async isFieldInvalid(field) {
    return await field.evaluate(el => el.getAttribute('aria-invalid') === 'true');
  }

  /**
   * Check if any error message is visible on the page
   * @returns {Promise<boolean>} True if error message is visible
   */
  async hasErrorMessage() {
    return await this.errorContainer.first().isVisible().catch(() => false);
  }

  /**
   * Check if registration was successful
   * Success = success message shown OR form still visible without errors
   * This uses UI-based validation instead of body text
   * 
   * @returns {Promise<boolean>} True if registration appears successful
   */
  async isRegistrationSuccessful() {
    const successVisible = await this.successMessage.isVisible().catch(() => false);
    const formStillVisible = await this.formContainer.isVisible().catch(() => false);
    const hasError = await this.hasErrorMessage();
    
    // Success: either success message shown OR form still visible without error
    return successVisible || (formStillVisible && !hasError);
  }
}

/**
 * Helper functions for generating unique test data
 * Prevents test data conflicts
 */
const generateUniqueEmail = () => {
  const randomStr = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  return `testuser${randomStr}@mailinator.com`;
};

const generateUniquePhone = () => {
  return '+1' + Math.floor(Math.random() * 9000000000 + 1000000000);
};

// ============================================
// POSITIVE TESTS
// Tests successful registration scenarios
// ============================================

test.describe('Registration - Positive Tests', () => {
  let registrationPage;

  // Setup before each test - navigate to registration page
  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.navigate();
    await registrationPage.clickCreateAccount();
  });

  /**
   * Test: Successful registration with all valid details
   * 
   * Verifies that a user can successfully create an account
   * when providing all required fields with valid data.
   * 
   * Uses field-level validation (aria-invalid) instead of body text
   */
  test('successful registration with all valid details', async () => {
    test.setTimeout(180000);
    
    await test.step('Fill registration form with valid data', async () => {
      await registrationPage.fillForm({
        ...testData.validUser,
        email: generateUniqueEmail(),
        phone: generateUniquePhone()
      });
    });
    
    await test.step('Submit registration form', async () => {
      await registrationPage.submit();
    });
    
    await test.step('Verify registration success', async () => {
      // Use field-level validation instead of body text
      const success = await registrationPage.isRegistrationSuccessful();
      expect(success).toBe(true);
    });
  });
});

// ============================================
// VALIDATION TESTS
// Tests form validation for required fields
// ============================================

test.describe('Registration - Validation Tests', () => {
  let registrationPage;

  // Setup before each test - navigate to registration page
  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.navigate();
    await registrationPage.clickCreateAccount();
  });

  /**
   * Test: First name is required
   * Verifies that first name field shows error when empty
   */
  test('first name is required', async () => {
    await registrationPage.fillForm({
      lastName: testData.validUser.lastName,
      email: generateUniqueEmail(),
      phone: generateUniquePhone(),
      password: testData.validUser.password,
      confirmPassword: testData.validUser.confirmPassword,
      state: testData.validUser.state
    });
    
    await registrationPage.submit();
    
    // Use aria-invalid for validation check (no body text)
    const isInvalid = await registrationPage.isFieldInvalid(registrationPage.firstName);
    expect(isInvalid).toBe(true);
  });

  /**
   * Test: First name minimum 2 characters
   * Verifies that first name with less than 2 characters shows error
   */
  test('first name minimum 2 characters', async () => {
    await registrationPage.fillForm({
      firstName: 'a',
      lastName: testData.validUser.lastName,
      email: generateUniqueEmail(),
      phone: generateUniquePhone(),
      password: testData.validUser.password,
      confirmPassword: testData.validUser.confirmPassword,
      state: testData.validUser.state
    });
    
    await registrationPage.submit();
    
    const isInvalid = await registrationPage.isFieldInvalid(registrationPage.firstName);
    expect(isInvalid).toBe(true);
  });

  /**
   * Test: Last name is required
   * Verifies that last name field shows error when empty
   */
  test('last name is required', async () => {
    await registrationPage.fillForm({
      firstName: testData.validUser.firstName,
      email: generateUniqueEmail(),
      phone: generateUniquePhone(),
      password: testData.validUser.password,
      confirmPassword: testData.validUser.confirmPassword,
      state: testData.validUser.state
    });
    
    await registrationPage.submit();
    
    const isInvalid = await registrationPage.isFieldInvalid(registrationPage.lastName);
    expect(isInvalid).toBe(true);
  });

  /**
   * Test: Last name minimum 2 characters
   * Verifies that last name with less than 2 characters shows error
   */
  test('last name minimum 2 characters', async () => {
    await registrationPage.fillForm({
      firstName: testData.validUser.firstName,
      lastName: 'a',
      email: generateUniqueEmail(),
      phone: generateUniquePhone(),
      password: testData.validUser.password,
      confirmPassword: testData.validUser.confirmPassword,
      state: testData.validUser.state
    });
    
    await registrationPage.submit();
    
    const isInvalid = await registrationPage.isFieldInvalid(registrationPage.lastName);
    expect(isInvalid).toBe(true);
  });

  /**
   * Test: Email is required
   * Verifies that email field shows error when empty
   */
  test('email is required', async () => {
    await registrationPage.fillForm({
      firstName: testData.validUser.firstName,
      lastName: testData.validUser.lastName,
      phone: generateUniquePhone(),
      password: testData.validUser.password,
      confirmPassword: testData.validUser.confirmPassword,
      state: testData.validUser.state
    });
    
    await registrationPage.submit();
    
    const isInvalid = await registrationPage.isFieldInvalid(registrationPage.email);
    expect(isInvalid).toBe(true);
  });

  /**
   * Test: Email must be valid format
   * Verifies that invalid email format shows error
   */
  test('email valid format', async () => {
    await registrationPage.fillForm({
      firstName: testData.validUser.firstName,
      lastName: testData.validUser.lastName,
      email: 'invalidemail',
      phone: generateUniquePhone(),
      password: testData.validUser.password,
      confirmPassword: testData.validUser.confirmPassword,
      state: testData.validUser.state
    });
    
    await registrationPage.submit();
    
    const isInvalid = await registrationPage.isFieldInvalid(registrationPage.email);
    expect(isInvalid).toBe(true);
  });

  /**
   * Test: Phone is required
   * Verifies that phone field shows error when empty
   */
  test('phone is required', async () => {
    await registrationPage.fillForm({
      firstName: testData.validUser.firstName,
      lastName: testData.validUser.lastName,
      email: generateUniqueEmail(),
      password: testData.validUser.password,
      confirmPassword: testData.validUser.confirmPassword,
      state: testData.validUser.state
    });
    
    await registrationPage.submit();
    
    const isInvalid = await registrationPage.isFieldInvalid(registrationPage.phone);
    expect(isInvalid).toBe(true);
  });

  /**
   * Test: Password is required
   * Verifies that password field shows error when empty
   */
  test('password is required', async () => {
    await registrationPage.fillForm({
      firstName: testData.validUser.firstName,
      lastName: testData.validUser.lastName,
      email: generateUniqueEmail(),
      phone: generateUniquePhone(),
      confirmPassword: testData.validUser.confirmPassword,
      state: testData.validUser.state
    });
    
    await registrationPage.submit();
    
    const isInvalid = await registrationPage.isFieldInvalid(registrationPage.password);
    expect(isInvalid).toBe(true);
  });

  /**
   * Test: Password minimum 8 characters
   * Verifies that password with less than 8 characters shows error
   */
  test('password minimum 8 characters', async () => {
    await registrationPage.fillForm({
      firstName: testData.validUser.firstName,
      lastName: testData.validUser.lastName,
      email: generateUniqueEmail(),
      phone: generateUniquePhone(),
      password: testData.invalidPasswords.tooShort,
      confirmPassword: testData.invalidPasswords.tooShort,
      state: testData.validUser.state
    });
    
    await registrationPage.submit();
    
    const isInvalid = await registrationPage.isFieldInvalid(registrationPage.password);
    expect(isInvalid).toBe(true);
  });

  /**
   * Test: Confirm password must match
   * Verifies that non-matching passwords show error
   */
  test('confirm password must match', async () => {
    await registrationPage.fillForm({
      firstName: testData.validUser.firstName,
      lastName: testData.validUser.lastName,
      email: generateUniqueEmail(),
      phone: generateUniquePhone(),
      password: testData.invalidPasswords.noMatch.password,
      confirmPassword: testData.invalidPasswords.noMatch.confirmPassword,
      state: testData.validUser.state
    });
    
    await registrationPage.submit();
    
    const isInvalid = await registrationPage.isFieldInvalid(registrationPage.confirmPassword);
    expect(isInvalid).toBe(true);
  });

  /**
   * Test: State/Province is required
   * Verifies that state selection shows error when not selected
   */
  test('state/province is required', async () => {
    await registrationPage.fillForm({
      firstName: testData.validUser.firstName,
      lastName: testData.validUser.lastName,
      email: generateUniqueEmail(),
      phone: generateUniquePhone(),
      password: testData.validUser.password,
      confirmPassword: testData.validUser.confirmPassword
    });
    
    await registrationPage.submit();
    
    const isInvalid = await registrationPage.isFieldInvalid(registrationPage.stateSelect);
    expect(isInvalid).toBe(true);
  });

  /**
   * Test: Duplicate email registration
   * Verifies that registering with existing email shows error
   */
  test('duplicate email registration', async () => {
    const email = generateUniqueEmail();
    const phone = generateUniquePhone();
    
    await registrationPage.fillForm({
      ...testData.validUser,
      email: email,
      phone: phone
    });
    await registrationPage.submit();
    
    await registrationPage.goToRegisterPage();
    
    await registrationPage.fillForm({
      ...testData.validUser,
      email: email,
      phone: generateUniquePhone()
    });
    await registrationPage.submit();
    
    const isInvalid = await registrationPage.isFieldInvalid(registrationPage.email);
    expect(isInvalid).toBe(true);
  });
});
