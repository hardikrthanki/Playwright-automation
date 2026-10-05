# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: OverlayStrategistsTrialMatrix.spec.ts >> Overlay Strategists Trial FRD Matrix >> SC-36 - With-card authorization failure does not start trial
- Location: tests\OverlayStrategistsTrialMatrix.spec.ts:464:13

# Error details

```
Error: Registration OTP input did not appear after requesting SMS code. Send status 429. {"error":"Too many OTP requests. Try again in 80s.","code":"RATE_LIMITED","request_id":"efeeff9f-73c5-4032-8fb3-f7d004420b68"} Visible diagnostics: mobile="2015554455", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
```

# Test source

```ts
  699 |       attempt++
  700 |     ) {
  701 |       await this.visibleOtpInput()
  702 |         .waitFor({
  703 |           state: 'visible',
  704 |           timeout: 15000
  705 |         })
  706 |         .catch(
  707 |           () => undefined
  708 |         );
  709 | 
  710 |       if (
  711 |         await this.otpFieldIsVisible()
  712 |       ) {
  713 |         return;
  714 |       }
  715 | 
  716 |       const diagnostics =
  717 |         await this.collectOtpRequestDiagnostics();
  718 | 
  719 |       Logger.info(
  720 |         `OTP input not visible after SMS request. Attempt ${attempt}/4. Send status ${this.lastSendOtpStatus}. Visible diagnostics: ${diagnostics}`
  721 |       );
  722 | 
  723 |       const waitSeconds =
  724 |         Number(
  725 |           this.lastSendOtpBody.match(
  726 |             /try again in (\d+)\s*s/i
  727 |           )?.[1] ?? 0
  728 |         );
  729 | 
  730 |       if (
  731 |         this.lastSendOtpStatus === 429 &&
  732 |         waitSeconds > 0 &&
  733 |         !waitedForRateLimit &&
  734 |         attempt < 4
  735 |       ) {
  736 |         waitedForRateLimit = true;
  737 | 
  738 |         const pauseMs =
  739 |           Math.min(
  740 |             waitSeconds + 5,
  741 |             90
  742 |           ) * 1000;
  743 | 
  744 |         Logger.info(
  745 |           `OTP rate limit. Waiting ${Math.round(pauseMs / 1000)}s, then sending once more on the same mobile.`
  746 |         );
  747 | 
  748 |         await this.page.waitForTimeout(
  749 |           pauseMs
  750 |         );
  751 | 
  752 |         await this.clickSendCode(
  753 |           attempt + 1
  754 |         );
  755 | 
  756 |         continue;
  757 |       }
  758 | 
  759 |       const sendRejected =
  760 |         this.lastSendOtpStatus === 0 ||
  761 |         this.lastSendOtpStatus === 409 ||
  762 |         this.lastSendOtpStatus === 429 ||
  763 |         /already registered|too many|rate limit|try again/i.test(
  764 |           this.lastSendOtpBody
  765 |         );
  766 | 
  767 |       if (sendRejected) {
  768 |         const replacement =
  769 |           generateMobileNumber();
  770 | 
  771 |         console.log(
  772 |           `Text code was not sent. Trying mobile ${replacement}`
  773 |         );
  774 | 
  775 |         await this.fillMobileNumber(
  776 |           replacement
  777 |         );
  778 |       }
  779 | 
  780 |       if (
  781 |         attempt === 4
  782 |       ) {
  783 |         if (manualFallback) {
  784 |           Logger.info(
  785 |             'Manual OTP fallback enabled. Complete the OTP request manually, then resume Playwright.'
  786 |           );
  787 | 
  788 |           await this.page.pause();
  789 | 
  790 |           await expect(
  791 |             this.visibleOtpInput()
  792 |           ).toBeVisible({
  793 |             timeout: 30000
  794 |           });
  795 | 
  796 |           return;
  797 |         }
  798 | 
> 799 |         throw new Error(
      |               ^ Error: Registration OTP input did not appear after requesting SMS code. Send status 429. {"error":"Too many OTP requests. Try again in 80s.","code":"RATE_LIMITED","request_id":"efeeff9f-73c5-4032-8fb3-f7d004420b68"} Visible diagnostics: mobile="2015554455", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
  800 |           `Registration OTP input did not appear after requesting SMS code. Send status ${this.lastSendOtpStatus}. ${this.lastSendOtpBody.slice(0, 180)} Visible diagnostics: ${diagnostics}`
  801 |         );
  802 |       }
  803 | 
  804 |       await this.waitForSendCodeEnabled();
  805 | 
  806 |       await this.clickSendCode(
  807 |         attempt + 1
  808 |       );
  809 |     }
  810 |   }
  811 | 
  812 | 
  813 | 
  814 |   private async fillMobileNumber(
  815 |     mobileNumber: string
  816 |   ) {
  817 |     await this.mobileInput.click();
  818 | 
  819 |     await this.mobileInput.fill(
  820 |       ''
  821 |     );
  822 | 
  823 |     await this.mobileInput.fill(
  824 |       mobileNumber
  825 |     );
  826 | 
  827 |     await this.mobileInput.evaluate(
  828 |       (input, value) => {
  829 |         const setter =
  830 |           Object.getOwnPropertyDescriptor(
  831 |             HTMLInputElement.prototype,
  832 |             'value'
  833 |           )?.set;
  834 | 
  835 |         setter?.call(
  836 |           input,
  837 |           value
  838 |         );
  839 | 
  840 |         input.dispatchEvent(
  841 |           new Event(
  842 |             'input',
  843 |             {
  844 |               bubbles: true
  845 |             }
  846 |           )
  847 |         );
  848 | 
  849 |         input.dispatchEvent(
  850 |           new Event(
  851 |             'change',
  852 |             {
  853 |               bubbles: true
  854 |             }
  855 |           )
  856 |         );
  857 |       },
  858 |       mobileNumber
  859 |     );
  860 | 
  861 |     await this.mobileInput.blur();
  862 |   }
  863 | 
  864 | 
  865 | 
  866 |   private async fillPasswordFields() {
  867 |     await this.passwordInput.fill(
  868 |       TEST_USERS.onboarding.password
  869 |     );
  870 | 
  871 |     await this.passwordInput.blur();
  872 | 
  873 |     await this.confirmPasswordInput.fill(
  874 |       TEST_USERS.onboarding.password
  875 |     );
  876 | 
  877 |     await this.confirmPasswordInput.blur();
  878 | 
  879 |     const passwordFields =
  880 |       this.page.locator(
  881 |         'input[type="password"]'
  882 |       );
  883 | 
  884 |     if (
  885 |       await passwordFields.count() >= 2
  886 |     ) {
  887 |       await passwordFields.nth(
  888 |         1
  889 |       ).fill(
  890 |         TEST_USERS.onboarding.password
  891 |       );
  892 |     }
  893 |   }
  894 | 
  895 |   private async acceptVisibleRegistrationConsents() {
  896 |     const boxes =
  897 |       this.page.locator(
  898 |         'input[type="checkbox"], [role="checkbox"]'
  899 |       );
```