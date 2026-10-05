# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> Disposable user can purchase Overlay Strategists monthly and reach Billing
- Location: tests\SubscriptionLifecycleExecution.spec.ts:139:9

# Error details

```
Error: Registration OTP input did not appear after requesting SMS code. Send status 429. {"error":"Too many OTP requests. Try again in 16s.","code":"RATE_LIMITED","request_id":"51dec1bc-ed4a-4b93-b81e-7439a715a02c"} Visible diagnostics: mobile="2015552055", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
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
          - textbox "Email" [ref=e28]: imhardikthanki+sub-lifecycl-muuz6jjd@gmail.com
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]: Mobile number
            - generic [ref=e32]:
              - img
              - text: Not verified
          - generic [ref=e33]:
            - generic [ref=e34]: "+1"
            - textbox "2015550123" [ref=e35]: "2015553026"
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
  721 |       const waitSeconds =
  722 |         Number(
  723 |           this.lastSendOtpBody.match(
  724 |             /try again in (\d+)\s*s/i
  725 |           )?.[1] ?? 0
  726 |         );
  727 | 
  728 |       if (
  729 |         this.lastSendOtpStatus === 429 &&
  730 |         waitSeconds > 0 &&
  731 |         attempt < 4
  732 |       ) {
  733 |         const pauseMs =
  734 |           Math.min(
  735 |             waitSeconds + 2,
  736 |             90
  737 |           ) * 1000;
  738 | 
  739 |         Logger.info(
  740 |           `OTP rate limit. Waiting ${Math.round(pauseMs / 1000)}s, then sending once more on the same mobile.`
  741 |         );
  742 | 
  743 |         await this.page.waitForTimeout(
  744 |           pauseMs
  745 |         );
  746 | 
  747 |         await this.clickSendCode(
  748 |           attempt + 1
  749 |         );
  750 | 
  751 |         continue;
  752 |       }
  753 | 
  754 |       const sendRejected =
  755 |         this.lastSendOtpStatus === 0 ||
  756 |         this.lastSendOtpStatus === 409 ||
  757 |         this.lastSendOtpStatus === 429 ||
  758 |         /already registered|too many|rate limit|try again/i.test(
  759 |           this.lastSendOtpBody
  760 |         );
> 761 | 
      |               ^ Error: Registration OTP input did not appear after requesting SMS code. Send status 429. {"error":"Too many OTP requests. Try again in 16s.","code":"RATE_LIMITED","request_id":"51dec1bc-ed4a-4b93-b81e-7439a715a02c"} Visible diagnostics: mobile="2015552055", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
  762 |       if (sendRejected) {
  763 |         const replacement =
  764 |           generateMobileNumber();
  765 | 
  766 |         console.log(
  767 |           `Text code was not sent. Trying mobile ${replacement}`
  768 |         );
  769 | 
  770 |         await this.fillMobileNumber(
  771 |           replacement
  772 |         );
  773 |       }
  774 | 
  775 |       if (
  776 |         attempt === 4
  777 |       ) {
  778 |         if (manualFallback) {
  779 |           Logger.info(
  780 |             'Manual OTP fallback enabled. Complete the OTP request manually, then resume Playwright.'
  781 |           );
  782 | 
  783 |           await this.page.pause();
  784 | 
  785 |           await expect(
  786 |             this.visibleOtpInput()
  787 |           ).toBeVisible({
  788 |             timeout: 30000
  789 |           });
  790 | 
  791 |           return;
  792 |         }
  793 | 
  794 |         throw new Error(
  795 |           `Registration OTP input did not appear after requesting SMS code. Send status ${this.lastSendOtpStatus}. ${this.lastSendOtpBody.slice(0, 180)} Visible diagnostics: ${diagnostics}`
  796 |         );
  797 |       }
  798 | 
  799 |       await this.waitForSendCodeEnabled();
  800 | 
  801 |       await this.clickSendCode(
  802 |         attempt + 1
  803 |       );
  804 |     }
  805 |   }
  806 | 
  807 | 
  808 | 
  809 |   private async fillMobileNumber(
  810 |     mobileNumber: string
  811 |   ) {
  812 |     await this.mobileInput.click();
  813 | 
  814 |     await this.mobileInput.fill(
  815 |       ''
  816 |     );
  817 | 
  818 |     await this.mobileInput.fill(
  819 |       mobileNumber
  820 |     );
  821 | 
  822 |     await this.mobileInput.evaluate(
  823 |       (input, value) => {
  824 |         const setter =
  825 |           Object.getOwnPropertyDescriptor(
  826 |             HTMLInputElement.prototype,
  827 |             'value'
  828 |           )?.set;
  829 | 
  830 |         setter?.call(
  831 |           input,
  832 |           value
  833 |         );
  834 | 
  835 |         input.dispatchEvent(
  836 |           new Event(
  837 |             'input',
  838 |             {
  839 |               bubbles: true
  840 |             }
  841 |           )
  842 |         );
  843 | 
  844 |         input.dispatchEvent(
  845 |           new Event(
  846 |             'change',
  847 |             {
  848 |               bubbles: true
  849 |             }
  850 |           )
  851 |         );
  852 |       },
  853 |       mobileNumber
  854 |     );
  855 | 
  856 |     await this.mobileInput.blur();
  857 |   }
  858 | 
  859 | 
  860 | 
  861 |   private async fillPasswordFields() {
```