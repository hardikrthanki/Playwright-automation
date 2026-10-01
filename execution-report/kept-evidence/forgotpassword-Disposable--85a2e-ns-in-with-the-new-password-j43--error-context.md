# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: forgotpassword.spec.ts >> Disposable user resets password from the email link and signs in with the new password
- Location: tests\forgotpassword.spec.ts:215:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/login/
Received string:  "https://uat.ooltool.com/reset-password/fAeeY4gK12-E6pM7YBTekwEhKwNO4rrZw2BdKc-M2SU"
Timeout: 20000ms

Call log:
  - Expect "toHaveURL" with timeout 20000ms
    23 × unexpected value "https://uat.ooltool.com/reset-password/fAeeY4gK12-E6pM7YBTekwEhKwNO4rrZw2BdKc-M2SU"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - link "OolTool" [ref=e4] [cursor=pointer]:
      - /url: /
      - img "OolTool" [ref=e5]
    - generic [ref=e6]:
      - generic [ref=e7]:
        - generic [ref=e8]: Set New Password
        - generic [ref=e9]: Enter your new password below
      - generic [ref=e10]:
        - generic [ref=e11]:
          - generic [ref=e12]:
            - text: New Password
            - generic [ref=e13]:
              - textbox "New Password" [ref=e14]:
                - /placeholder: Min. 8 characters
              - button "Show password" [ref=e15] [cursor=pointer]:
                - img [ref=e16]
          - generic [ref=e19]:
            - text: Confirm Password
            - generic [ref=e20]:
              - textbox "Confirm Password" [ref=e21]
              - button "Show password" [ref=e22] [cursor=pointer]:
                - img [ref=e23]
        - generic [ref=e26]:
          - button "Update Password" [ref=e27] [cursor=pointer]
          - link "Back to login" [ref=e28] [cursor=pointer]:
            - /url: /login
  - region "Notifications alt+T"
  - alert [ref=e29]
```

# Test source

```ts
  62  |         /^confirm password$/i
  63  |       ).or(
  64  |         page.locator(
  65  |           'form input[type="password"]'
  66  |         ).nth(1)
  67  |       );
  68  | 
  69  |     this.updatePasswordButton =
  70  |       page.getByRole(
  71  |         'button',
  72  |         {
  73  |           name: /update password/i
  74  |         }
  75  |       );
  76  | 
  77  |     this.backToLoginLink =
  78  |       page.getByText(
  79  |         /back to login/i
  80  |       );
  81  |   }
  82  | 
  83  |   async waitForFormReady() {
  84  | 
  85  |     await this.page.waitForLoadState(
  86  |       'domcontentloaded'
  87  |     );
  88  | 
  89  |     await expect(
  90  |       this.newPasswordInput
  91  |     ).toBeVisible({
  92  |       timeout: 30000
  93  |     });
  94  | 
  95  |     await expect(
  96  |       this.confirmPasswordInput
  97  |     ).toBeVisible({
  98  |       timeout: 30000
  99  |     });
  100 |   }
  101 | 
  102 |   async fillPassword(
  103 |     password: string
  104 |   ) {
  105 | 
  106 |     validatePasswordPolicy(
  107 |       password
  108 |     );
  109 | 
  110 |     Logger.info(
  111 |       'Updating Password'
  112 |     );
  113 |     console.log(
  114 |   'Current URL:',
  115 |   this.page.url()
  116 | );
  117 | 
  118 |     await this.waitForFormReady();
  119 | 
  120 |     await this.newPasswordInput.fill(
  121 |       password
  122 |     );
  123 | 
  124 |     await this.confirmPasswordInput.fill(
  125 |       password
  126 |     );
  127 | 
  128 |     Logger.success(
  129 |       'Password Fields Completed'
  130 |     );
  131 |   }
  132 | 
  133 |   async updatePassword() {
  134 | 
  135 |     await safeClick(
  136 |       this.updatePasswordButton,
  137 |       'Update Password'
  138 |     );
  139 | 
  140 |     Logger.success(
  141 |       'Update Password Clicked'
  142 |     );
  143 |   }
  144 | 
  145 |   async validateSuccess() {
  146 | 
  147 |     const confirmed =
  148 |       await this.page.getByText(
  149 |         /password (has been )?(updated|reset|changed)|successfully/i
  150 |       ).first().waitFor({
  151 |         state: 'visible',
  152 |         timeout: 15000
  153 |       }).then(
  154 |         () => true
  155 |       ).catch(
  156 |         () => false
  157 |       );
  158 | 
  159 |     if (!confirmed) {
  160 |       await expect(
  161 |         this.page
> 162 |       ).toHaveURL(
      |         ^ Error: expect(page).toHaveURL(expected) failed
  163 |         /\/login/,
  164 |         {
  165 |           timeout: 20000
  166 |         }
  167 |       );
  168 |     }
  169 | 
  170 |     Logger.success(
  171 |       'Password Updated Successfully'
  172 |     );
  173 |   }
  174 | 
  175 |   async backToLogin() {
  176 | 
  177 |     await safeClick(
  178 |       this.backToLoginLink,
  179 |       'Back To Login'
  180 |     );
  181 | 
  182 |     Logger.success(
  183 |       'Returned To Login'
  184 |     );
  185 |   }
  186 | }
  187 | 
```