import {
  Page,
  Locator,
  expect
} from '@playwright/test';

import {
  BasePage
}
from './BasePage';

import {
  safeClick
}
from '../helpers/safeClick';


import {
  Logger
}
from '../utils/logger';

/* =============================================================================
PAGE OBJECT: OnboardingPage

PURPOSE
-------
Handles new user registration onboarding flow.

FLOW COVERED
------------
1. Open Create Account Page
2. Fill Personal Information
3. Enter Mobile Number
4. Send SMS OTP
5. Verify OTP
6. Set Password
7. Create Account

============================================================================= */


export class OnboardingPage
extends BasePage {


readonly firstNameInput: Locator;

readonly lastNameInput: Locator;

readonly emailInput: Locator;

readonly mobileInput: Locator;

readonly sendOtpButton: Locator;

readonly otpInput: Locator;

readonly verifyOtpButton: Locator;

readonly passwordInput: Locator;

readonly confirmPasswordInput: Locator;

readonly createAccountButton: Locator;

constructor(page: Page){

super(page);

this.firstNameInput =
page.getByLabel(
/first name/i
);



this.lastNameInput =
page.getByLabel(
/last name/i
);

this.emailInput =
page.getByLabel(
/email/i
);
this.mobileInput =
page.locator(
'input[type="tel"]'
);

this.sendOtpButton =
page.getByRole(
'button',
{
name:/send code via sms/i
}
);

this.otpInput =
page.locator(
'input[name="otp"]'
);

this.verifyOtpButton =
page.getByRole(
'button',
{
name:/verify/i
}
);

this.passwordInput =
page.getByLabel(
/password/i
);

this.confirmPasswordInput =
page.getByLabel(
/confirm password/i
);

this.createAccountButton =
page.getByRole(
'button',
{
name:/create account/i
}
);

}

async open(){

Logger.info(
'Opening Create Account Page'
);


await this.page.goto(
'https://puat.ooltool.com/register'
);

await expect(
this.createAccountButton
).toBeVisible();

Logger.success(
'Registration Page Opened'
);


}

async fillPersonalInformation(
firstName:string,
lastName:string,
email:string,
mobile:string
){


Logger.info(
'Filling Registration Details'
);

await this.firstNameInput.fill(
firstName
);

await this.lastNameInput.fill(
lastName
);
await this.emailInput.fill(
email
);
await this.mobileInput.fill(
mobile
);

Logger.success(
'Personal Information Filled'
);

}

async sendMobileOtp(){


Logger.info(
'Sending Mobile OTP'
);
await safeClick(
this.sendOtpButton,
'Send OTP Via SMS'
);

Logger.success(
'OTP Sent'
);

}
async verifyMobileOtp(){
Logger.info(
'Entering OTP'
);

await this.otpInput.fill(
'111111'
);

await safeClick(
this.verifyOtpButton,
'Verify OTP'
);

Logger.success(
'Mobile OTP Verified'
);

}

async setPassword(
password:string
){

Logger.info(
'Setting Password'
);

await this.passwordInput.fill(
password
);

await this.confirmPasswordInput.fill(
password
);

Logger.success(
'Password Filled'
);


}

async createAccount(){
Logger.info(
'Creating Account'
);
await safeClick(
this.createAccountButton,
'Create Account'
);
Logger.success(
'Account Creation Submitted'
);

}

}