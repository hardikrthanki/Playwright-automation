# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: PlanSelectionValidation.spec.ts >> Plan Selection Validation >> Curious Explorer free plan completes onboarding without Stripe
- Location: tests\PlanSelectionValidation.spec.ts:371:11

# Error details

```
Error: Registration OTP input did not appear after requesting SMS code. Send status 429. {"error":"Too many OTP requests. Try again in 52s.","code":"RATE_LIMITED","request_id":"19e75f18-fdfa-412a-8cfe-00c9c987fc0a"} Visible diagnostics: mobile="2015557185", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
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
          - textbox "Email" [ref=e28]: imhardikthanki+plan-free-ac-muuysvj0@gmail.com
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]: Mobile number
            - generic [ref=e32]:
              - img
              - text: Not verified
          - generic [ref=e33]:
            - generic [ref=e34]: "+1"
            - textbox "2015550123" [ref=e35]: "2015554841"
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
  - alert [ref=e57]: Create Account
```

# Test source

```ts
  661 |         await this.sendCodeButton.click({
  662 |           force: true,
  663 |           timeout: 5000
  664 |         }).catch(
  665 |           () => undefined
  666 |         );
  667 |       }
  668 |     }
  669 | 
  670 |     const response =
  671 |       await responsePromise;
  672 | 
  673 |     this.lastSendOtpStatus =
  674 |       response?.status() ?? 0;
  675 | 
  676 |     this.lastSendOtpBody =
  677 |       response
  678 |         ? await response.text().catch(
  679 |           () => ''
  680 |         )
  681 |         : '';
  682 | 
  683 |     console.log(
  684 |       `Send OTP ${this.lastSendOtpStatus} ${this.lastSendOtpBody.slice(0, 180)}`
  685 |     );
  686 |   }
  687 | 
  688 |   private async waitForRegistrationOtpInput() {
  689 |     const manualFallback =
  690 |       this.envEnabled(
  691 |         'REGISTRATION_OTP_MANUAL_FALLBACK'
  692 |       );
  693 | 
  694 |     for (
  695 |       let attempt = 1;
  696 |       attempt <= 4;
  697 |       attempt++
  698 |     ) {
  699 |       await this.visibleOtpInput()
  700 |         .waitFor({
  701 |           state: 'visible',
  702 |           timeout: 15000
  703 |         })
  704 |         .catch(
  705 |           () => undefined
  706 |         );
  707 | 
  708 |       if (
  709 |         await this.otpFieldIsVisible()
  710 |       ) {
  711 |         return;
  712 |       }
  713 | 
  714 |       const diagnostics =
  715 |         await this.collectOtpRequestDiagnostics();
  716 | 
  717 |       Logger.info(
  718 |         `OTP input not visible after SMS request. Attempt ${attempt}/4. Send status ${this.lastSendOtpStatus}. Visible diagnostics: ${diagnostics}`
  719 |       );
  720 | 
  721 |       const sendRejected =
  722 |         this.lastSendOtpStatus === 0 ||
  723 |         this.lastSendOtpStatus === 409 ||
  724 |         this.lastSendOtpStatus === 429 ||
  725 |         /already registered|too many|rate limit|try again/i.test(
  726 |           this.lastSendOtpBody
  727 |         );
  728 | 
  729 |       if (sendRejected) {
  730 |         const replacement =
  731 |           generateMobileNumber();
  732 | 
  733 |         console.log(
  734 |           `Text code was not sent. Trying mobile ${replacement}`
  735 |         );
  736 | 
  737 |         await this.fillMobileNumber(
  738 |           replacement
  739 |         );
  740 |       }
  741 | 
  742 |       if (
  743 |         attempt === 4
  744 |       ) {
  745 |         if (manualFallback) {
  746 |           Logger.info(
  747 |             'Manual OTP fallback enabled. Complete the OTP request manually, then resume Playwright.'
  748 |           );
  749 | 
  750 |           await this.page.pause();
  751 | 
  752 |           await expect(
  753 |             this.visibleOtpInput()
  754 |           ).toBeVisible({
  755 |             timeout: 30000
  756 |           });
  757 | 
  758 |           return;
  759 |         }
  760 | 
> 761 |         throw new Error(
      |               ^ Error: Registration OTP input did not appear after requesting SMS code. Send status 429. {"error":"Too many OTP requests. Try again in 52s.","code":"RATE_LIMITED","request_id":"19e75f18-fdfa-412a-8cfe-00c9c987fc0a"} Visible diagnostics: mobile="2015557185", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
  762 |           `Registration OTP input did not appear after requesting SMS code. Send status ${this.lastSendOtpStatus}. ${this.lastSendOtpBody.slice(0, 180)} Visible diagnostics: ${diagnostics}`
  763 |         );
  764 |       }
  765 | 
  766 |       await this.waitForSendCodeEnabled();
  767 | 
  768 |       await this.clickSendCode(
  769 |         attempt + 1
  770 |       );
  771 |     }
  772 |   }
  773 | 
  774 | 
  775 | 
  776 |   private async fillMobileNumber(
  777 |     mobileNumber: string
  778 |   ) {
  779 |     await this.mobileInput.click();
  780 | 
  781 |     await this.mobileInput.fill(
  782 |       ''
  783 |     );
  784 | 
  785 |     await this.mobileInput.fill(
  786 |       mobileNumber
  787 |     );
  788 | 
  789 |     await this.mobileInput.evaluate(
  790 |       (input, value) => {
  791 |         const setter =
  792 |           Object.getOwnPropertyDescriptor(
  793 |             HTMLInputElement.prototype,
  794 |             'value'
  795 |           )?.set;
  796 | 
  797 |         setter?.call(
  798 |           input,
  799 |           value
  800 |         );
  801 | 
  802 |         input.dispatchEvent(
  803 |           new Event(
  804 |             'input',
  805 |             {
  806 |               bubbles: true
  807 |             }
  808 |           )
  809 |         );
  810 | 
  811 |         input.dispatchEvent(
  812 |           new Event(
  813 |             'change',
  814 |             {
  815 |               bubbles: true
  816 |             }
  817 |           )
  818 |         );
  819 |       },
  820 |       mobileNumber
  821 |     );
  822 | 
  823 |     await this.mobileInput.blur();
  824 |   }
  825 | 
  826 | 
  827 | 
  828 |   private async fillPasswordFields() {
  829 |     await this.passwordInput.fill(
  830 |       TEST_USERS.onboarding.password
  831 |     );
  832 | 
  833 |     await this.passwordInput.blur();
  834 | 
  835 |     await this.confirmPasswordInput.fill(
  836 |       TEST_USERS.onboarding.password
  837 |     );
  838 | 
  839 |     await this.confirmPasswordInput.blur();
  840 | 
  841 |     const passwordFields =
  842 |       this.page.locator(
  843 |         'input[type="password"]'
  844 |       );
  845 | 
  846 |     if (
  847 |       await passwordFields.count() >= 2
  848 |     ) {
  849 |       await passwordFields.nth(
  850 |         1
  851 |       ).fill(
  852 |         TEST_USERS.onboarding.password
  853 |       );
  854 |     }
  855 |   }
  856 | 
  857 |   private async acceptVisibleRegistrationConsents() {
  858 |     const boxes =
  859 |       this.page.locator(
  860 |         'input[type="checkbox"], [role="checkbox"]'
  861 |       );
```