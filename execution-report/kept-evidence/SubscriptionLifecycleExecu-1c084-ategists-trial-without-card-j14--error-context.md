# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> Disposable user can start Overlay Strategists trial without card
- Location: tests\SubscriptionLifecycleExecution.spec.ts:158:9

# Error details

```
Error: Registration OTP input did not appear after requesting SMS code. Visible diagnostics: mobile="2015552730", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
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
          - textbox "Email" [ref=e28]: imhardikthanki+sub-lifecycl-mupj4zzm@gmail.com
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]: Mobile number
            - generic [ref=e32]:
              - img
              - text: Not verified
          - generic [ref=e33]:
            - generic [ref=e34]: "+1"
            - textbox "2015550123" [ref=e35]: "2015559302"
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
  655 |       await this.sendCodeButton.evaluate(
  656 |         (button) => {
  657 |           (button as HTMLButtonElement).click();
  658 |         }
  659 |       ).catch(
  660 |         () => undefined
  661 |       );
  662 |     }
  663 | 
  664 |     const response =
  665 |       await responsePromise;
  666 | 
  667 |     this.lastSendOtpStatus =
  668 |       response?.status() ?? 0;
  669 | 
  670 |     this.lastSendOtpBody =
  671 |       response
  672 |         ? await response.text().catch(
  673 |           () => ''
  674 |         )
  675 |         : '';
  676 | 
  677 |     console.log(
  678 |       `Send OTP ${this.lastSendOtpStatus} ${this.lastSendOtpBody.slice(0, 180)}`
  679 |     );
  680 |   }
  681 | 
  682 |   private async waitForRegistrationOtpInput() {
  683 |     const manualFallback =
  684 |       this.envEnabled(
  685 |         'REGISTRATION_OTP_MANUAL_FALLBACK'
  686 |       );
  687 | 
  688 |     for (
  689 |       let attempt = 1;
  690 |       attempt <= 4;
  691 |       attempt++
  692 |     ) {
  693 |       await this.visibleOtpInput()
  694 |         .waitFor({
  695 |           state: 'visible',
  696 |           timeout: 15000
  697 |         })
  698 |         .catch(
  699 |           () => undefined
  700 |         );
  701 | 
  702 |       if (
  703 |         await this.otpFieldIsVisible()
  704 |       ) {
  705 |         return;
  706 |       }
  707 | 
  708 |       const diagnostics =
  709 |         await this.collectOtpRequestDiagnostics();
  710 | 
  711 |       Logger.info(
  712 |         `OTP input not visible after SMS request. Attempt ${attempt}/4. Send status ${this.lastSendOtpStatus}. Visible diagnostics: ${diagnostics}`
  713 |       );
  714 | 
  715 |       const sendRejected =
  716 |         this.lastSendOtpStatus === 0 ||
  717 |         this.lastSendOtpStatus === 409 ||
  718 |         this.lastSendOtpStatus === 429 ||
  719 |         /already registered|too many|rate limit|try again/i.test(
  720 |           this.lastSendOtpBody
  721 |         );
  722 | 
  723 |       if (sendRejected) {
  724 |         const replacement =
  725 |           generateMobileNumber();
  726 | 
  727 |         console.log(
  728 |           `Text code was not sent. Trying mobile ${replacement}`
  729 |         );
  730 | 
  731 |         await this.fillMobileNumber(
  732 |           replacement
  733 |         );
  734 |       }
  735 | 
  736 |       if (
  737 |         attempt === 4
  738 |       ) {
  739 |         if (manualFallback) {
  740 |           Logger.info(
  741 |             'Manual OTP fallback enabled. Complete the OTP request manually, then resume Playwright.'
  742 |           );
  743 | 
  744 |           await this.page.pause();
  745 | 
  746 |           await expect(
  747 |             this.visibleOtpInput()
  748 |           ).toBeVisible({
  749 |             timeout: 30000
  750 |           });
  751 | 
  752 |           return;
  753 |         }
  754 | 
> 755 |         throw new Error(
      |               ^ Error: Registration OTP input did not appear after requesting SMS code. Visible diagnostics: mobile="2015552730", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
  756 |           `Registration OTP input did not appear after requesting SMS code. Visible diagnostics: ${diagnostics}`
  757 |         );
  758 |       }
  759 | 
  760 |       await this.waitForSendCodeEnabled();
  761 | 
  762 |       await this.clickSendCode(
  763 |         attempt + 1
  764 |       );
  765 |     }
  766 |   }
  767 | 
  768 | 
  769 | 
  770 |   private async fillMobileNumber(
  771 |     mobileNumber: string
  772 |   ) {
  773 |     await this.mobileInput.click();
  774 | 
  775 |     await this.mobileInput.fill(
  776 |       ''
  777 |     );
  778 | 
  779 |     await this.mobileInput.fill(
  780 |       mobileNumber
  781 |     );
  782 | 
  783 |     await this.mobileInput.evaluate(
  784 |       (input, value) => {
  785 |         const setter =
  786 |           Object.getOwnPropertyDescriptor(
  787 |             HTMLInputElement.prototype,
  788 |             'value'
  789 |           )?.set;
  790 | 
  791 |         setter?.call(
  792 |           input,
  793 |           value
  794 |         );
  795 | 
  796 |         input.dispatchEvent(
  797 |           new Event(
  798 |             'input',
  799 |             {
  800 |               bubbles: true
  801 |             }
  802 |           )
  803 |         );
  804 | 
  805 |         input.dispatchEvent(
  806 |           new Event(
  807 |             'change',
  808 |             {
  809 |               bubbles: true
  810 |             }
  811 |           )
  812 |         );
  813 |       },
  814 |       mobileNumber
  815 |     );
  816 | 
  817 |     await this.mobileInput.blur();
  818 |   }
  819 | 
  820 | 
  821 | 
  822 |   private async fillPasswordFields() {
  823 |     await this.passwordInput.fill(
  824 |       TEST_USERS.onboarding.password
  825 |     );
  826 | 
  827 |     await this.passwordInput.blur();
  828 | 
  829 |     await this.confirmPasswordInput.fill(
  830 |       TEST_USERS.onboarding.password
  831 |     );
  832 | 
  833 |     await this.confirmPasswordInput.blur();
  834 | 
  835 |     const passwordFields =
  836 |       this.page.locator(
  837 |         'input[type="password"]'
  838 |       );
  839 | 
  840 |     if (
  841 |       await passwordFields.count() >= 2
  842 |     ) {
  843 |       await passwordFields.nth(
  844 |         1
  845 |       ).fill(
  846 |         TEST_USERS.onboarding.password
  847 |       );
  848 |     }
  849 |   }
  850 | 
  851 |   private async acceptVisibleRegistrationConsents() {
  852 |     const boxes =
  853 |       this.page.locator(
  854 |         'input[type="checkbox"], [role="checkbox"]'
  855 |       );
```