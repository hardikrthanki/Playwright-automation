/**
 * Test Data Configuration
 * 
 * Contains test data used across all test files:
 * - validUser: Valid user credentials for testing
 * - weakPasswords: Various weak password patterns for validation testing
 * - urls: Application URLs for different pages
 * 
 * This file is used by test files for consistent test data
 */

module.exports = {
  validUser: {
    email: 'testuser' + Date.now() + '@example.com',
    password: 'Test@123456'
  },
  weakPasswords: {
    tooShort: 'Test@12',
    noUppercase: 'test@123456',
    noLowercase: 'TEST@123456',
    noNumber: 'Test@abcdef'
  },
  urls: {
    signup: 'https://uat.ooltool.com/signup',
    login: 'https://uat.ooltool.com/login',
    home: 'https://uat.ooltool.com/'
  }
};
