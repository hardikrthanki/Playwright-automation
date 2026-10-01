# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> Prepared paid user can accept terms and submit upgrade payment
- Location: tests\SubscriptionLifecycleExecution.spec.ts:158:9

# Error details

```
Error: Send code via SMS button stayed disabled after entering mobile number "2015550578". Visible diagnostics: mobile="2015550578", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code.
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
          - textbox "Email" [ref=e28]: imhardikthanki+sub-lifecycl-mupar025@gmail.com
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]: Mobile number
            - generic [ref=e32]:
              - img
              - text: Not verified
          - generic [ref=e33]:
            - generic [ref=e34]: "+1"
            - textbox "2015550123" [ref=e35]: "2015550578"
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
  797 | 
  798 |       if (
  799 |         id
  800 |       ) {
  801 |         const label =
  802 |           this.page.locator(
  803 |             `label[for="${id}"]`
  804 |           );
  805 | 
  806 |         if (
  807 |           await label.isVisible().catch(
  808 |             () => false
  809 |           )
  810 |         ) {
  811 |           await label.click({
  812 |             force: true
  813 |           });
  814 |           continue;
  815 |         }
  816 |       }
  817 | 
  818 |       await box.check({
  819 |         force: true
  820 |       }).catch(
  821 |         async () => {
  822 |           await box.click({
  823 |             force: true
  824 |           }).catch(
  825 |             () => undefined
  826 |           );
  827 |         }
  828 |       );
  829 |     }
  830 |   }
  831 | 
  832 |   private async waitForPasswordFieldsReady() {
  833 |     await expect(
  834 |       this.passwordInput
  835 |     ).toBeEditable({
  836 |       timeout: 5000
  837 |     });
  838 | 
  839 |     await expect(
  840 |       this.confirmPasswordInput
  841 |     ).toBeEditable({
  842 |       timeout: 5000
  843 |     });
  844 |   }
  845 | 
  846 | 
  847 | 
  848 |   private async waitForSendCodeEnabled() {
  849 |     const enabled =
  850 |       await this.sendCodeButton
  851 |         .isEnabled({
  852 |           timeout: 15000
  853 |         })
  854 |         .catch(
  855 |           () => false
  856 |         );
  857 | 
  858 |     if (enabled) {
  859 |       return;
  860 |     }
  861 | 
  862 |     const mobileValue =
  863 |       await this.mobileInput
  864 |         .inputValue()
  865 |         .catch(
  866 |           () => ''
  867 |         );
  868 | 
  869 |     const diagnostics =
  870 |       await this.collectOtpRequestDiagnostics();
  871 | 
> 872 |     throw new Error(
      |           ^ Error: Send code via SMS button stayed disabled after entering mobile number "2015550578". Visible diagnostics: mobile="2015550578", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code.
  873 |       `Send code via SMS button stayed disabled after entering mobile number "${mobileValue}". Visible diagnostics: ${diagnostics}`
  874 |     );
  875 |   }
  876 | 
  877 | 
  878 | 
  879 |   async open() {
  880 | 
  881 | 
  882 |     Logger.info(
  883 |       'Opening application'
  884 |     );
  885 | 
  886 | 
  887 |     await this.page.goto(
  888 |       BASE_URL,
  889 |       {
  890 |         waitUntil:
  891 |         'domcontentloaded',
  892 | 
  893 |         timeout:
  894 |         60000
  895 |       }
  896 |     );
  897 | 
  898 | 
  899 |     await this.dismissMarketingOverlays();
  900 | 
  901 | 
  902 |     const registrationCtaVisible =
  903 |       await this.createAccountLink.isVisible({
  904 |         timeout: 10000
  905 |       }).catch(
  906 |         () => false
  907 |       );
  908 | 
  909 |     if (registrationCtaVisible) {
  910 |       await safeClick(
  911 |         this.createAccountLink,
  912 |         'Open Start 30-Day Free Trial'
  913 |       );
  914 |     } else {
  915 |       await this.page.goto(
  916 |         `${BASE_URL}${URLS.REGISTER}`,
  917 |         {
  918 |           waitUntil:
  919 |           'domcontentloaded',
  920 | 
  921 |           timeout:
  922 |           60000
  923 |         }
  924 |       );
  925 |     }
  926 | 
  927 |     await expect(
  928 |       this.page
  929 |     ).toHaveURL(
  930 |       /\/register|\/signup|\/sign-up|\/create/,
  931 |       {
  932 |         timeout: 15000
  933 |       }
  934 |     );
  935 | 
  936 |     const firstNameReady =
  937 |       await this.firstNameInput
  938 |         .isVisible()
  939 |         .catch(
  940 |           () => false
  941 |         );
  942 | 
  943 |     if (
  944 |       !firstNameReady
  945 |     ) {
  946 |       await this.page.reload({
  947 |         waitUntil: 'commit',
  948 |         timeout: 60000
  949 |       });
  950 |     }
  951 | 
  952 |     await expect(
  953 |       this.firstNameInput
  954 |     ).toBeVisible({
  955 |       timeout: 45000
  956 |     });
  957 | 
  958 |     await expect(
  959 |       this.submitButton
  960 |     ).toBeVisible({
  961 |       timeout: 15000
  962 |     });
  963 | 
  964 | 
  965 |     Logger.success(
  966 |       'Registration page opened'
  967 |     );
  968 | 
  969 |   }
  970 | 
  971 | 
  972 | 
```