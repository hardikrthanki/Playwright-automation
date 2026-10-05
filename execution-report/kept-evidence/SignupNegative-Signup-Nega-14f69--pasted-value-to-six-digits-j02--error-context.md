# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SignupNegative.spec.ts >> Signup Negative Scenarios >> Signup OTP input trims pasted value to six digits
- Location: tests\SignupNegative.spec.ts:583:11

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator:  getByPlaceholder(/enter otp|one-time|verification code|123456/i).or(getByLabel(/enter otp|sms code|verification code|one-time code/i)).or(locator('input[autocomplete="one-time-code"], input[name*="otp" i], input[id*="otp" i]')).first().first()
Expected: "123456"
Received: "12345678"
Timeout:  5000ms

Call log:
  - Expect "toHaveValue" with timeout 5000ms
  - waiting for getByPlaceholder(/enter otp|one-time|verification code|123456/i).or(getByLabel(/enter otp|sms code|verification code|one-time code/i)).or(locator('input[autocomplete="one-time-code"], input[name*="otp" i], input[id*="otp" i]')).first().first()
    9 × locator resolved to <input maxlength="8" value="12345678" inputmode="numeric" placeholder="Enter OTP" autocomplete="one-time-code" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"/>
      - unexpected value "12345678"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - link "OolTool" [ref=e6] [cursor=pointer]:
          - /url: /
          - img "OolTool" [ref=e7]
        - heading "Create Account" [level=1] [ref=e8]
        - paragraph [ref=e9]: Start your OolTool journey
      - generic [ref=e10]:
        - button "Continue with Google" [ref=e11] [cursor=pointer]:
          - img
          - text: Continue with Google
        - button "Continue with Apple" [ref=e12] [cursor=pointer]:
          - img
          - text: Continue with Apple
        - generic [ref=e17]: Or sign up with email & mobile
        - generic [ref=e18]:
          - generic [ref=e19]:
            - generic [ref=e20]:
              - generic [ref=e21]: First name
              - textbox "First name" [ref=e22]: Hardik
            - generic [ref=e23]:
              - generic [ref=e24]: Last name
              - textbox "Last name" [ref=e25]: Thanki
          - generic [ref=e26]:
            - generic [ref=e27]: Email
            - textbox "Email" [ref=e28]: imhardikthanki+otp-paste-1791215155293@gmail.com
          - generic [ref=e29]:
            - generic [ref=e30]:
              - generic [ref=e31]: Mobile number
              - generic [ref=e32]:
                - img
                - text: Not verified
            - generic [ref=e33]:
              - generic [ref=e34]: "+1"
              - textbox "2015550123" [ref=e35]: "2015559279"
            - paragraph [ref=e36]: US mobile numbers only. We’ll text you a one-time code.
            - generic [ref=e37]:
              - textbox "Enter OTP" [active] [ref=e38]: "12345678"
              - generic [ref=e39]:
                - button "Verify" [ref=e40] [cursor=pointer]
                - button "55s" [disabled]
          - generic [ref=e41]:
            - generic [ref=e42]: Password
            - generic [ref=e43]:
              - textbox [ref=e44]: Test@123456
              - button "Show" [ref=e45]:
                - img [ref=e46]
          - generic [ref=e49]:
            - generic [ref=e50]: Confirm password
            - generic [ref=e51]:
              - textbox [ref=e52]: Test@123456
              - button "Show" [ref=e53]:
                - img [ref=e54]
          - button "Create Account" [disabled]
        - paragraph [ref=e57]:
          - text: Already have an account?
          - link "Sign in" [ref=e58] [cursor=pointer]:
            - /url: /login
    - button "Switch to dark theme" [ref=e60] [cursor=pointer]:
      - img
  - region "Cookie consent" [ref=e61]:
    - generic [ref=e62]:
      - paragraph [ref=e63]:
        - text: We use cookies for login, preferences, and to improve OolTool. Read the
        - link "Privacy Policy" [ref=e64] [cursor=pointer]:
          - /url: /privacy-policy
        - text: .
      - generic [ref=e65]:
        - button "Essential only" [ref=e66] [cursor=pointer]
        - button "Accept" [ref=e67] [cursor=pointer]
  - region "Notifications alt+T"
  - alert [ref=e68]: Create Account
```

# Test source

```ts
  501 | 
  502 |     test(
  503 |       'Signup mobile input limits extra digits to ten digits',
  504 |       async ({ page }) => {
  505 | 
  506 |         const registration =
  507 |           new RegistrationPage(page);
  508 | 
  509 |         await registration.open();
  510 | 
  511 |         await registration.mobileInput.fill(
  512 |           '12345678901'
  513 |         );
  514 | 
  515 |         await expect(
  516 |           registration.mobileInput
  517 |         ).toHaveValue(
  518 |           '2345678901'
  519 |         );
  520 | 
  521 |         await expect(
  522 |           registration.sendCodeButton
  523 |         ).toBeEnabled();
  524 |       }
  525 |     );
  526 | 
  527 |     test(
  528 |       'Signup form shows US mobile number guidance before OTP request',
  529 |       async ({ page }) => {
  530 | 
  531 |         const registration =
  532 |           new RegistrationPage(page);
  533 | 
  534 |         await registration.open();
  535 | 
  536 |         await expect(
  537 |           registration.mobileInput
  538 |         ).toBeVisible();
  539 | 
  540 |         await expect(
  541 |           page.getByText(
  542 |             /US mobile numbers only/i
  543 |           )
  544 |         ).toBeVisible();
  545 |       }
  546 |     );
  547 | 
  548 |     if (otpLengthValidationEnabled) {
  549 |       test(
  550 |         'Signup OTP input limits entry to six digits',
  551 |         async ({ page }) => {
  552 | 
  553 |         const registration =
  554 |           new RegistrationPage(page);
  555 | 
  556 |         await openSignupOtpInput(
  557 |           registration,
  558 |           'otp-length'
  559 |         );
  560 | 
  561 |         await registration.otpInput.first().fill(
  562 |           '1234567'
  563 |         );
  564 | 
  565 |         await expect
  566 |           .poll(
  567 |             async () =>
  568 |               (
  569 |                 await registration.otpInput
  570 |                   .first()
  571 |                   .inputValue()
  572 |               ).length,
  573 |             {
  574 |               timeout: 5000
  575 |             }
  576 |           )
  577 |           .toBeLessThanOrEqual(
  578 |             6
  579 |           );
  580 |         }
  581 |       );
  582 | 
  583 |       test(
  584 |         'Signup OTP input trims pasted value to six digits',
  585 |         async ({ page }) => {
  586 | 
  587 |         const registration =
  588 |           new RegistrationPage(page);
  589 | 
  590 |         await openSignupOtpInput(
  591 |           registration,
  592 |           'otp-paste'
  593 |         );
  594 | 
  595 |         await registration.otpInput.first().fill(
  596 |           '1234567890'
  597 |         );
  598 | 
  599 |         await expect(
  600 |           registration.otpInput.first()
> 601 |         ).toHaveValue(
      |           ^ Error: expect(locator).toHaveValue(expected) failed
  602 |           '123456',
  603 |           {
  604 |             timeout: 5000
  605 |           }
  606 |         );
  607 |         }
  608 |       );
  609 | 
  610 |       test(
  611 |         'Signup OTP input accepts digits only',
  612 |         async ({ page }) => {
  613 | 
  614 |         const registration =
  615 |           new RegistrationPage(page);
  616 | 
  617 |         await openSignupOtpInput(
  618 |           registration,
  619 |           'otp-numeric'
  620 |         );
  621 | 
  622 |         await registration.otpInput.first().fill(
  623 |           '12ab 34!@'
  624 |         );
  625 | 
  626 |         await expect(
  627 |           registration.otpInput.first()
  628 |         ).toHaveValue(
  629 |           '1234',
  630 |           {
  631 |             timeout: 5000
  632 |           }
  633 |         );
  634 |         }
  635 |       );
  636 | 
  637 |       test(
  638 |         'Signup OTP verify button is enabled only for six digits',
  639 |         async ({ page }) => {
  640 | 
  641 |         const registration =
  642 |           new RegistrationPage(page);
  643 | 
  644 |         await openSignupOtpInput(
  645 |           registration,
  646 |           'otp-button-state'
  647 |         );
  648 | 
  649 |         await registration.otpInput.first().fill(
  650 |           '12345'
  651 |         );
  652 | 
  653 |         await expect(
  654 |           registration.verifyOtpButton
  655 |         ).toBeDisabled({
  656 |           timeout: 5000
  657 |         });
  658 | 
  659 |         await registration.otpInput.first().fill(
  660 |           '123456'
  661 |         );
  662 | 
  663 |         await expect(
  664 |           registration.verifyOtpButton
  665 |         ).toBeEnabled({
  666 |           timeout: 5000
  667 |         });
  668 | 
  669 |         await registration.otpInput.first().fill(
  670 |           '123'
  671 |         );
  672 | 
  673 |         await expect(
  674 |           registration.verifyOtpButton
  675 |         ).toBeDisabled({
  676 |           timeout: 5000
  677 |         });
  678 |         }
  679 |       );
  680 |     }
  681 | 
  682 |     if (otpResendValidationEnabled) {
  683 |       test(
  684 |         'Signup OTP resend or cooldown state is visible after code request',
  685 |         async ({ page }) => {
  686 | 
  687 |         const registration =
  688 |           new RegistrationPage(page);
  689 | 
  690 |         await openSignupOtpInput(
  691 |           registration,
  692 |           'otp-resend-state'
  693 |         );
  694 | 
  695 |         const resendOrCooldown =
  696 |           page
  697 |             .locator(
  698 |               'button, [role="button"], p, span, div'
  699 |             )
  700 |             .filter({
  701 |               hasText:
```