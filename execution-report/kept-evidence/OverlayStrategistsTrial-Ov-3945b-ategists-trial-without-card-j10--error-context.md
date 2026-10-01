# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: OverlayStrategistsTrial.spec.ts >> Overlay Strategists Trial Experience >> New user can start Overlay Strategists trial without card
- Location: tests\OverlayStrategistsTrial.spec.ts:730:11

# Error details

```
Error: Registration OTP input did not appear after requesting SMS code. Visible diagnostics: mobile="2015557843", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
          - textbox "Email" [ref=e28]: imhardikthanki+overlay-with-mupaexum@gmail.com
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]: Mobile number
            - generic [ref=e32]:
              - img
              - text: Not verified
          - generic [ref=e33]:
            - generic [ref=e34]: "+1"
            - textbox "2015550123" [ref=e35]: "2015557843"
          - paragraph [ref=e36]: US mobile numbers only. We’ll text you a one-time code.
          - button "Send code via SMS" [ref=e38] [cursor=pointer]:
            - img
            - text: Send code via SMS
        - generic [ref=e39]:
          - generic [ref=e40]: Password
          - generic [ref=e41]:
            - textbox [ref=e42]
            - button "Show" [ref=e43]:
              - img [ref=e44]
        - generic [ref=e47]:
          - generic [ref=e48]: Confirm password
          - generic [ref=e49]:
            - textbox [ref=e50]
            - button "Show" [ref=e51]:
              - img [ref=e52]
        - button "Create Account" [disabled]
      - paragraph [ref=e55]:
        - text: Already have an account?
        - link "Sign in" [ref=e56] [cursor=pointer]:
          - /url: /login
  - region "Notifications alt+T"
  - alert [ref=e57]
```

# Test source

```ts
  596 |           return method !==
  597 |             'OPTIONS' &&
  598 |             method !==
  599 |             'GET' &&
  600 |             /otp|sms|phone|mobile|verify|code/i.test(
  601 |               response.url()
  602 |             );
  603 |         },
  604 |         {
  605 |           timeout: 12000
  606 |         }
  607 |       ).catch(
  608 |         () => null
  609 |       );
  610 | 
  611 |     if (
  612 |       attempt <= 1
  613 |     ) {
  614 |       await safeClick(
  615 |         this.sendCodeButton,
  616 |         'Send Code via SMS'
  617 |       );
  618 |     } else if (
  619 |       attempt === 2
  620 |     ) {
  621 |       console.log(
  622 |         '[CLICK] Send Code via SMS (force)'
  623 |       );
  624 | 
  625 |       await this.sendCodeButton.click({
  626 |         force: true,
  627 |         timeout: 8000
  628 |       });
  629 |     } else {
  630 |       console.log(
  631 |         '[CLICK] Send Code via SMS (DOM click)'
  632 |       );
  633 | 
  634 |       await this.sendCodeButton.evaluate(
  635 |         (button) => {
  636 |           (button as HTMLButtonElement).click();
  637 |         }
  638 |       );
  639 |     }
  640 | 
  641 |     await apiWait;
  642 |   }
  643 | 
  644 |   private async waitForRegistrationOtpInput() {
  645 |     const manualFallback =
  646 |       this.envEnabled(
  647 |         'REGISTRATION_OTP_MANUAL_FALLBACK'
  648 |       );
  649 | 
  650 |     for (
  651 |       let attempt = 1;
  652 |       attempt <= 4;
  653 |       attempt++
  654 |     ) {
  655 |       await this.visibleOtpInput()
  656 |         .waitFor({
  657 |           state: 'visible',
  658 |           timeout: 15000
  659 |         })
  660 |         .catch(
  661 |           () => undefined
  662 |         );
  663 | 
  664 |       if (
  665 |         await this.otpFieldIsVisible()
  666 |       ) {
  667 |         return;
  668 |       }
  669 | 
  670 |       const diagnostics =
  671 |         await this.collectOtpRequestDiagnostics();
  672 | 
  673 |       Logger.info(
  674 |         `OTP input not visible after SMS request. Attempt ${attempt}/4. Visible diagnostics: ${diagnostics}`
  675 |       );
  676 | 
  677 |       if (
  678 |         attempt === 4
  679 |       ) {
  680 |         if (manualFallback) {
  681 |           Logger.info(
  682 |             'Manual OTP fallback enabled. Complete the OTP request manually, then resume Playwright.'
  683 |           );
  684 | 
  685 |           await this.page.pause();
  686 | 
  687 |           await expect(
  688 |             this.visibleOtpInput()
  689 |           ).toBeVisible({
  690 |             timeout: 30000
  691 |           });
  692 | 
  693 |           return;
  694 |         }
  695 | 
> 696 |         throw new Error(
      |               ^ Error: Registration OTP input did not appear after requesting SMS code. Visible diagnostics: mobile="2015557843", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
  697 |           `Registration OTP input did not appear after requesting SMS code. Visible diagnostics: ${diagnostics}`
  698 |         );
  699 |       }
  700 | 
  701 |       await this.waitForSendCodeEnabled();
  702 | 
  703 |       await this.clickSendCode(
  704 |         attempt + 1
  705 |       );
  706 |     }
  707 |   }
  708 | 
  709 | 
  710 | 
  711 |   private async fillMobileNumber(
  712 |     mobileNumber: string
  713 |   ) {
  714 |     await this.mobileInput.fill(
  715 |       ''
  716 |     );
  717 | 
  718 |     await this.mobileInput.click();
  719 | 
  720 |     await this.mobileInput.fill(
  721 |       mobileNumber
  722 |     );
  723 | 
  724 |     await this.mobileInput.blur();
  725 |   }
  726 | 
  727 | 
  728 | 
  729 |   private async fillPasswordFields() {
  730 |     await this.passwordInput.fill(
  731 |       TEST_USERS.onboarding.password
  732 |     );
  733 | 
  734 |     await this.passwordInput.blur();
  735 | 
  736 |     await this.confirmPasswordInput.fill(
  737 |       TEST_USERS.onboarding.password
  738 |     );
  739 | 
  740 |     await this.confirmPasswordInput.blur();
  741 | 
  742 |     const passwordFields =
  743 |       this.page.locator(
  744 |         'input[type="password"]'
  745 |       );
  746 | 
  747 |     if (
  748 |       await passwordFields.count() >= 2
  749 |     ) {
  750 |       await passwordFields.nth(
  751 |         1
  752 |       ).fill(
  753 |         TEST_USERS.onboarding.password
  754 |       );
  755 |     }
  756 |   }
  757 | 
  758 |   private async acceptVisibleRegistrationConsents() {
  759 |     const boxes =
  760 |       this.page.locator(
  761 |         'input[type="checkbox"], [role="checkbox"]'
  762 |       );
  763 | 
  764 |     const count =
  765 |       await boxes.count();
  766 | 
  767 |     for (
  768 |       let index = 0;
  769 |       index < count;
  770 |       index++
  771 |     ) {
  772 |       const box =
  773 |         boxes.nth(
  774 |           index
  775 |         );
  776 | 
  777 |       const checked =
  778 |         await box.isChecked().catch(
  779 |           async () =>
  780 |             (
  781 |               await box.getAttribute(
  782 |                 'aria-checked'
  783 |               )
  784 |             ) === 'true'
  785 |         );
  786 | 
  787 |       if (
  788 |         checked
  789 |       ) {
  790 |         continue;
  791 |       }
  792 | 
  793 |       const id =
  794 |         await box.getAttribute(
  795 |           'id'
  796 |         );
```