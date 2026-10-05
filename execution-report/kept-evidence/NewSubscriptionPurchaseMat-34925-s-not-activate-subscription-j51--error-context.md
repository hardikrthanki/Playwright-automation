# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: NewSubscriptionPurchaseMatrix.spec.ts >> New Subscription Purchase Use Case 2 Matrix >> SC-60 - Declined card does not activate subscription
- Location: tests\NewSubscriptionPurchaseMatrix.spec.ts:483:13

# Error details

```
Error: Registration OTP input did not appear after requesting SMS code. Visible diagnostics: mobile="2015554425", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
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
      |               ^ Error: Registration OTP input did not appear after requesting SMS code. Visible diagnostics: mobile="2015554425", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
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