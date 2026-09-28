# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleE2EMatrix.spec.ts >> Subscription Lifecycle E2E Matrix >> LC-001 - New user can complete signup prerequisites and reach plan selection
- Location: tests\SubscriptionLifecycleE2EMatrix.spec.ts:506:13

# Error details

```
Error: expect(locator).toBeEnabled() failed

Locator:  getByRole('button', { name: 'Create Account', exact: true }).or(getByRole('button', { name: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).or(locator('button[type="submit"]').filter({ hasText: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).first()
Expected: enabled
Received: disabled
Timeout:  30000ms

Call log:
  - Expect "toBeEnabled" with timeout 30000ms
  - waiting for getByRole('button', { name: 'Create Account', exact: true }).or(getByRole('button', { name: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).or(locator('button[type="submit"]').filter({ hasText: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).first()
    33 × locator resolved to <button disabled type="submit" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 w-full h-11">Create Account</button>
       - unexpected value "disabled"

```

# Test source

```ts
  722 |       });
  723 |     }
  724 | 
  725 |     await expect(
  726 |       this.firstNameInput
  727 |     ).toBeVisible({
  728 |       timeout: 45000
  729 |     });
  730 | 
  731 |     await expect(
  732 |       this.submitButton
  733 |     ).toBeVisible({
  734 |       timeout: 15000
  735 |     });
  736 | 
  737 | 
  738 |     Logger.success(
  739 |       'Registration page opened'
  740 |     );
  741 | 
  742 |   }
  743 | 
  744 | 
  745 | 
  746 | 
  747 |   async register(
  748 |     email: string,
  749 |     mobileNumber =
  750 |       TEST_USERS.onboarding.mobile
  751 |   ) {
  752 | 
  753 | 
  754 |     Logger.step(
  755 |       `Registering: ${email}`
  756 |     );
  757 | 
  758 |     validatePasswordPolicy(
  759 |       TEST_USERS.onboarding.password
  760 |     );
  761 | 
  762 | 
  763 |     await this.firstNameInput.fill(
  764 |       TEST_USERS.onboarding.firstName
  765 |     );
  766 | 
  767 | 
  768 |     await this.lastNameInput.fill(
  769 |       TEST_USERS.onboarding.lastName
  770 |     );
  771 | 
  772 | 
  773 |     console.log(
  774 |       'Registration Email:',
  775 |       email
  776 |     );
  777 | 
  778 | 
  779 |     await this.emailInput.fill(
  780 |       email
  781 |     );
  782 | 
  783 | 
  784 |     await this.fillMobileNumber(
  785 |       mobileNumber
  786 |     );
  787 | 
  788 | 
  789 |     if (
  790 |       AUTH_SETTINGS.registrationMobileOtpEnabled
  791 |     ) {
  792 |       await this.waitForSendCodeEnabled();
  793 | 
  794 |       await this.clickSendCode(
  795 |         1
  796 |       );
  797 | 
  798 |       await this.waitForRegistrationOtpInput();
  799 | 
  800 |       await this.clickVerifyWhenReady();
  801 | 
  802 | 
  803 |       Logger.success(
  804 |         'OTP Verify Clicked'
  805 |       );
  806 | 
  807 |       await this.waitForPasswordFieldsReady();
  808 |     } else {
  809 |       Logger.info(
  810 |         'Registration mobile OTP is disabled in auth settings'
  811 |       );
  812 |     }
  813 | 
  814 | 
  815 | 
  816 |     await this.fillPasswordFields();
  817 | 
  818 |     await this.acceptVisibleRegistrationConsents();
  819 | 
  820 |     await expect(
  821 |       this.submitButton
> 822 |     ).toBeEnabled({
      |       ^ Error: expect(locator).toBeEnabled() failed
  823 |       timeout: 30000
  824 |     });
  825 | 
  826 |     await safeClick(
  827 |       this.submitButton,
  828 |       'Submit Registration'
  829 |     );
  830 | 
  831 |     await expect
  832 |       .poll(
  833 |         async () =>
  834 |           this.registrationLooksAccepted(),
  835 |         {
  836 |           timeout: 20000,
  837 |           message: 'Waiting for registration success or email-verification screen'
  838 |         }
  839 |       )
  840 |       .toBeTruthy();
  841 | 
  842 | 
  843 | 
  844 |     Logger.success(
  845 |       'Registration successful. Verification email sent.'
  846 |     );
  847 | 
  848 | 
  849 |   }
  850 | 
  851 |   private async registrationLooksAccepted() {
  852 |     const url =
  853 |       this.page.url();
  854 | 
  855 |     if (
  856 |       /verify-email-sent|\/(verify|onboarding|dashboard|plan|risk|compliance|check-email|confirm)/i.test(
  857 |         url
  858 |       )
  859 |     ) {
  860 |       return true;
  861 |     }
  862 | 
  863 |     const firstNameVisible =
  864 |       await this.firstNameInput.isVisible().catch(
  865 |         () => false
  866 |       );
  867 | 
  868 |     const bodyText =
  869 |       await this.page
  870 |         .locator(
  871 |           'body'
  872 |         )
  873 |         .innerText()
  874 |         .catch(
  875 |           () => ''
  876 |         );
  877 | 
  878 |     if (
  879 |       !firstNameVisible &&
  880 |       /check your email|verification link was sent|verify-email/i.test(
  881 |         bodyText
  882 |       )
  883 |     ) {
  884 |       return true;
  885 |     }
  886 | 
  887 |     return /check your email|a verification link was sent|verification (sent|email|link)|verify your email|confirm your email/i.test(
  888 |       bodyText
  889 |     );
  890 |   }
  891 | 
  892 |   private async waitForRegistrationAccepted(
  893 |     timeoutMs: number
  894 |   ) {
  895 |     const started =
  896 |       Date.now();
  897 | 
  898 |     while (
  899 |       Date.now() -
  900 |         started <
  901 |       timeoutMs
  902 |     ) {
  903 |       if (
  904 |         await this.registrationLooksAccepted()
  905 |       ) {
  906 |         return true;
  907 |       }
  908 | 
  909 |       await this.page.waitForTimeout(
  910 |         500
  911 |       );
  912 |     }
  913 | 
  914 |     return false;
  915 |   }
  916 | 
  917 | 
  918 | }
  919 | 
```