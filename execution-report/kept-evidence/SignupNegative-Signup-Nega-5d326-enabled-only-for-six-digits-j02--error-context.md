# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SignupNegative.spec.ts >> Signup Negative Scenarios >> Signup OTP verify button is enabled only for six digits
- Location: tests\SignupNegative.spec.ts:637:11

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator:  getByRole('button', { name: /^(verify|verify code|verify otp)$/i })
Expected: disabled
Received: enabled
Timeout:  5000ms

Call log:
  - Expect "toBeDisabled" with timeout 5000ms
  - waiting for getByRole('button', { name: /^(verify|verify code|verify otp)$/i })
    9 × locator resolved to <button type="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 flex-1 h-10">Verify</button>
      - unexpected value "enabled"

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
            - textbox "Email" [ref=e28]: imhardikthanki+otp-button-state-1791215180640@gmail.com
          - generic [ref=e29]:
            - generic [ref=e30]:
              - generic [ref=e31]: Mobile number
              - generic [ref=e32]:
                - img
                - text: Not verified
            - generic [ref=e33]:
              - generic [ref=e34]: "+1"
              - textbox "2015550123" [ref=e35]: "2015556516"
            - paragraph [ref=e36]: US mobile numbers only. We’ll text you a one-time code.
            - generic [ref=e37]:
              - textbox "Enter OTP" [active] [ref=e38]: "12345"
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
  - region "Notifications alt+T"
  - alert [ref=e61]
```

# Test source

```ts
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
  601 |         ).toHaveValue(
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
> 655 |         ).toBeDisabled({
      |           ^ Error: expect(locator).toBeDisabled() failed
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
  702 |                 /resend|send code|send again|code sent|wait|seconds|\d+s|too many|rate|try again/i
  703 |             })
  704 |             .first();
  705 | 
  706 |         await expect(
  707 |           resendOrCooldown
  708 |         ).toBeVisible({
  709 |           timeout: 10000
  710 |         });
  711 |         }
  712 |       );
  713 |     }
  714 | 
  715 |     if (duplicateEmailValidationEnabled) {
  716 |       test(
  717 |         'Signup blocks already registered email address',
  718 |         async ({ page }) => {
  719 | 
  720 |         const registration =
  721 |           new RegistrationPage(page);
  722 | 
  723 |         await registration.open();
  724 | 
  725 |         await fillRequiredSignupFields(
  726 |           registration,
  727 |           duplicateSignupEmail,
  728 |           generateMobileNumber()
  729 |         );
  730 | 
  731 |         const otpVisible =
  732 |           await requestSignupOtpIfAvailable(
  733 |             registration
  734 |           );
  735 | 
  736 |         test.skip(
  737 |           !otpVisible,
  738 |           'Skipped because signup OTP input did not appear after requesting SMS code.'
  739 |         );
  740 | 
  741 |         await registration.otpInput.first().fill(
  742 |           AUTH_SETTINGS.otpCode
  743 |         );
  744 | 
  745 |         await registration.verifyOtpButton.click();
  746 | 
  747 |         await expect(
  748 |           registration.submitButton
  749 |         ).toBeEnabled({
  750 |           timeout: 15000
  751 |         });
  752 | 
  753 |         await registration.submitButton.click();
  754 | 
  755 |         await expect(
```