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
Received string:  "https://uat.ooltool.com/reset-password/oW8vRcDFmXXa2sMCc-8-6ZheGBbyAYXJOEoP7siqTSE"
Timeout: 20000ms

Call log:
  - Expect "toHaveURL" with timeout 20000ms
    23 × unexpected value "https://uat.ooltool.com/reset-password/oW8vRcDFmXXa2sMCc-8-6ZheGBbyAYXJOEoP7siqTSE"

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
              - textbox "Confirm Password" [active] [ref=e21]: ResetFlow#26aA
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
  259 |                 response.url()
  260 |               ),
  261 |             {
  262 |               timeout: 15000
  263 |             }
  264 |           ).catch(
  265 |             () => null
  266 |           );
  267 | 
  268 |         const requestStarted =
  269 |           this.page.waitForRequest(
  270 |             (request) =>
  271 |               request.method() === 'POST' &&
  272 |               /\/auth\/reset-password/i.test(
  273 |                 request.url()
  274 |               ),
  275 |             {
  276 |               timeout: 15000
  277 |             }
  278 |           ).then(
  279 |             () => true
  280 |           ).catch(
  281 |             () => false
  282 |           );
  283 | 
  284 |         await this.updatePasswordButton.click({
  285 |           noWaitAfter: true,
  286 |           timeout: 8000
  287 |         });
  288 | 
  289 |         const started =
  290 |           await Promise.race([
  291 |             requestStarted,
  292 |             this.page.waitForTimeout(
  293 |               3000
  294 |             ).then(
  295 |               () => false
  296 |             )
  297 |           ]);
  298 | 
  299 |         if (!started) {
  300 |           await this.confirmPasswordInput.press(
  301 |             'Enter'
  302 |           ).catch(
  303 |             () => undefined
  304 |           );
  305 | 
  306 |           await this.updatePasswordButton.evaluate(
  307 |             (button) => {
  308 |               (button as HTMLButtonElement).click();
  309 |             }
  310 |           ).catch(
  311 |             () => undefined
  312 |           );
  313 |         }
  314 | 
  315 |         return responsePromise;
  316 |       };
  317 | 
  318 |     let response =
  319 |       await submitReset();
  320 | 
  321 |     for (
  322 |       let attempt = 1;
  323 |       attempt < 3 &&
  324 |       !response;
  325 |       attempt++
  326 |     ) {
  327 |       response =
  328 |         await submitReset();
  329 |     }
  330 | 
  331 |     if (response) {
  332 |       console.log(
  333 |         `Reset response ${response.status()}`
  334 |       );
  335 |     }
  336 | 
  337 |     Logger.success(
  338 |       'Update Password Clicked'
  339 |     );
  340 |   }
  341 | 
  342 |   async validateSuccess() {
  343 | 
  344 |     const confirmed =
  345 |       await this.page.getByText(
  346 |         /password (has been )?(updated|reset|changed)|successfully/i
  347 |       ).first().waitFor({
  348 |         state: 'visible',
  349 |         timeout: 15000
  350 |       }).then(
  351 |         () => true
  352 |       ).catch(
  353 |         () => false
  354 |       );
  355 | 
  356 |     if (!confirmed) {
  357 |       await expect(
  358 |         this.page
> 359 |       ).toHaveURL(
      |         ^ Error: expect(page).toHaveURL(expected) failed
  360 |         /\/login/,
  361 |         {
  362 |           timeout: 20000
  363 |         }
  364 |       );
  365 |     }
  366 | 
  367 |     Logger.success(
  368 |       'Password Updated Successfully'
  369 |     );
  370 |   }
  371 | 
  372 |   async backToLogin() {
  373 | 
  374 |     await safeClick(
  375 |       this.backToLoginLink,
  376 |       'Back To Login'
  377 |     );
  378 | 
  379 |     Logger.success(
  380 |       'Returned To Login'
  381 |     );
  382 |   }
  383 | }
  384 | 
```