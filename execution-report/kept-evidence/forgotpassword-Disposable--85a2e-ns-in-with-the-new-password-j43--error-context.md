# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: forgotpassword.spec.ts >> Disposable user resets password from the email link and signs in with the new password
- Location: tests\forgotpassword.spec.ts:219:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/login/
Received string:  "https://uat.ooltool.com/reset-password/UGuJlQwj_1oEx7OHmR30JnadbRjhO35yNdsvp8x5Hcs"
Timeout: 20000ms

Call log:
  - Expect "toHaveURL" with timeout 20000ms
    23 × unexpected value "https://uat.ooltool.com/reset-password/UGuJlQwj_1oEx7OHmR30JnadbRjhO35yNdsvp8x5Hcs"

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
                - text: ResetFlow#26aA
              - button "Show password" [ref=e15] [cursor=pointer]:
                - img [ref=e16]
          - generic [ref=e19]:
            - text: Confirm Password
            - generic [ref=e20]:
              - textbox "Confirm Password" [ref=e21]: ResetFlow#26aA
              - button "Show password" [ref=e22] [cursor=pointer]:
                - img [ref=e23]
        - generic [ref=e26]:
          - button "Update Password" [active] [ref=e27] [cursor=pointer]
          - link "Back to login" [ref=e28] [cursor=pointer]:
            - /url: /login
  - region "Notifications alt+T"
  - alert [ref=e29]
```

# Test source

```ts
  167 | 
  168 |         await this.page.waitForTimeout(
  169 |           1000
  170 |         );
  171 | 
  172 |         await this.newPasswordInput.fill(
  173 |           this.pendingPassword
  174 |         );
  175 | 
  176 |         await this.confirmPasswordInput.fill(
  177 |           this.pendingPassword
  178 |         );
  179 | 
  180 |         await expect(
  181 |           this.newPasswordInput
  182 |         ).toHaveValue(
  183 |           this.pendingPassword
  184 |         );
  185 | 
  186 |         const responsePromise =
  187 |           this.page.waitForResponse(
  188 |             (response) =>
  189 |               response.request().method() === 'POST' &&
  190 |               /\/auth\/reset-password/i.test(
  191 |                 response.url()
  192 |               ),
  193 |             {
  194 |               timeout: 8000
  195 |             }
  196 |           ).catch(
  197 |             () => null
  198 |           );
  199 | 
  200 |         await this.updatePasswordButton.click({
  201 |           timeout: 8000
  202 |         });
  203 | 
  204 |         const raced =
  205 |           await Promise.race([
  206 |             responsePromise,
  207 |             this.page.waitForTimeout(
  208 |               2000
  209 |             ).then(
  210 |               () => null
  211 |             )
  212 |           ]);
  213 | 
  214 |         if (
  215 |           !raced
  216 |         ) {
  217 |           await this.page.locator(
  218 |             'form'
  219 |           ).evaluate(
  220 |             (form) => {
  221 |               (form as HTMLFormElement).requestSubmit();
  222 |             }
  223 |           );
  224 |         }
  225 | 
  226 |         return responsePromise;
  227 |       };
  228 | 
  229 |     let response =
  230 |       await submitReset();
  231 | 
  232 |     if (
  233 |       !response
  234 |     ) {
  235 |       response =
  236 |         await submitReset();
  237 |     }
  238 | 
  239 |     if (response) {
  240 |       console.log(
  241 |         `Reset response ${response.status()}`
  242 |       );
  243 |     }
  244 | 
  245 |     Logger.success(
  246 |       'Update Password Clicked'
  247 |     );
  248 |   }
  249 | 
  250 |   async validateSuccess() {
  251 | 
  252 |     const confirmed =
  253 |       await this.page.getByText(
  254 |         /password (has been )?(updated|reset|changed)|successfully/i
  255 |       ).first().waitFor({
  256 |         state: 'visible',
  257 |         timeout: 15000
  258 |       }).then(
  259 |         () => true
  260 |       ).catch(
  261 |         () => false
  262 |       );
  263 | 
  264 |     if (!confirmed) {
  265 |       await expect(
  266 |         this.page
> 267 |       ).toHaveURL(
      |         ^ Error: expect(page).toHaveURL(expected) failed
  268 |         /\/login/,
  269 |         {
  270 |           timeout: 20000
  271 |         }
  272 |       );
  273 |     }
  274 | 
  275 |     Logger.success(
  276 |       'Password Updated Successfully'
  277 |     );
  278 |   }
  279 | 
  280 |   async backToLogin() {
  281 | 
  282 |     await safeClick(
  283 |       this.backToLoginLink,
  284 |       'Back To Login'
  285 |     );
  286 | 
  287 |     Logger.success(
  288 |       'Returned To Login'
  289 |     );
  290 |   }
  291 | }
  292 | 
```