# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ProfileMobileValidation.spec.ts >> Profile Mobile Number Validation >> Profile mobile section validation in one session
- Location: tests\ProfileMobileValidation.spec.ts:92:9

# Error details

```
Error: expect(locator).not.toHaveValue(expected) failed

Locator:  locator('#email:disabled').or(locator('form').filter({ has: getByLabel(/first name/i) }).locator('#email')).or(getByLabel(/^email$/i)).first()
Expected: not ""
Received: ""
Timeout:  20000ms

Call log:
  - Expect "not toHaveValue" with timeout 20000ms
  - waiting for locator('#email:disabled').or(locator('form').filter({ has: getByLabel(/first name/i) }).locator('#email')).or(getByLabel(/^email$/i)).first()
    23 × locator resolved to <input disabled value="" id="email" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"/>
       - unexpected value ""

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - link "OolTool" [ref=e7] [cursor=pointer]:
          - /url: /dashboard
          - img "OolTool" [ref=e8]
        - navigation [ref=e10]:
          - link "Dashboard" [ref=e11] [cursor=pointer]:
            - /url: /dashboard
          - link "Opportunities" [ref=e12] [cursor=pointer]:
            - /url: /dashboard/opportunities
          - button "Portfolio" [ref=e14]:
            - generic [ref=e15]: Portfolio
            - img [ref=e16]
          - button "Research" [ref=e19]:
            - generic [ref=e20]: Research
            - img [ref=e21]
          - link "Academy" [ref=e23] [cursor=pointer]:
            - /url: /academy
          - link "Support" [ref=e24] [cursor=pointer]:
            - /url: /dashboard/support
        - generic [ref=e25]:
          - button "Prices are delayed, not live market prices. Portfolio value and P&L come from your broker, so they can differ from your broker's dashboard." [ref=e26]: Delayed
          - button "Sync all" [ref=e27] [cursor=pointer]:
            - img
            - generic [ref=e28]: Sync all
          - button "Add options" [ref=e29] [cursor=pointer]:
            - img
          - button "Notifications" [ref=e30] [cursor=pointer]:
            - img [ref=e31]
            - generic [ref=e34]: "18"
          - button "HT" [ref=e35] [cursor=pointer]:
            - generic [ref=e37]: HT
    - main [ref=e38]:
      - generic [ref=e39]:
        - generic [ref=e40]:
          - heading "Profile" [level=1] [ref=e41]
          - paragraph [ref=e42]: Manage your profile and account settings
        - generic [ref=e43]:
          - generic [ref=e44]:
            - generic [ref=e45]: Personal Information
            - generic [ref=e46]: Update your personal information
          - generic [ref=e48]:
            - generic [ref=e49]:
              - generic [ref=e50]:
                - text: First Name
                - textbox "First Name" [ref=e51]
              - generic [ref=e52]:
                - text: Last Name
                - textbox "Last Name" [ref=e53]
            - generic [ref=e54]:
              - generic [ref=e55]:
                - generic [ref=e56]: Email
                - generic [ref=e57]:
                  - img
                  - text: Not verified
              - textbox "Email" [disabled] [ref=e58]
              - paragraph [ref=e59]: Contact support to change your email
            - button "Save Changes" [ref=e60] [cursor=pointer]
        - generic [ref=e61]:
          - generic [ref=e62]:
            - generic [ref=e63]:
              - img [ref=e64]
              - text: Mobile Number
            - generic [ref=e66]: Verify your mobile number via SMS OTP. Used for security alerts and account recovery.
          - generic [ref=e67]:
            - generic [ref=e68]:
              - generic [ref=e69]:
                - generic [ref=e70]: Mobile number (international format)
                - generic [ref=e71]:
                  - img
                  - text: Not verified
              - generic [ref=e72]:
                - generic [ref=e73]: "+1"
                - textbox "Mobile number (international format)" [ref=e74]:
                  - /placeholder: "2012345678"
              - paragraph [ref=e75]: "Note: SMS OTP delivery is currently supported for US phone numbers only."
            - generic [ref=e76]:
              - button "Send OTP via SMS" [disabled]:
                - img
                - text: Send OTP via SMS
            - list [ref=e77]:
              - listitem [ref=e78]: Enter your number with country code (e.g. +919876543210).
              - listitem [ref=e79]:
                - text: Click
                - strong [ref=e80]: Send OTP via SMS
                - text: .
              - listitem [ref=e81]:
                - text: Enter the OTP you receive and click
                - strong [ref=e82]: Verify
                - text: .
        - generic [ref=e83]:
          - generic [ref=e84]:
            - generic [ref=e85]:
              - img [ref=e86]
              - text: Two-Factor Authentication
            - generic [ref=e89]: Add an extra layer of security to your account using an authenticator app like Google Authenticator, Authy, or 1Password.
          - generic [ref=e90]:
            - list [ref=e91]:
              - listitem [ref=e92]: Install an authenticator app (Google Authenticator, Authy, 1Password).
              - listitem [ref=e93]:
                - text: Click
                - strong [ref=e94]: Enable Authenticator App
                - text: below.
              - listitem [ref=e95]: Scan the QR code or enter the secret manually.
              - listitem [ref=e96]: Enter the 6-digit code shown by your app to confirm.
              - listitem [ref=e97]: Save your backup codes somewhere safe.
            - generic [ref=e98]:
              - button "Enable Authenticator App" [ref=e99] [cursor=pointer]:
                - img
                - text: Enable Authenticator App
              - button "Enable SMS" [ref=e100] [cursor=pointer]:
                - img
                - text: Enable SMS
        - generic [ref=e101]:
          - generic [ref=e102]:
            - generic [ref=e103]:
              - img [ref=e104]
              - text: Trusted Devices
            - generic [ref=e107]: Skip two-factor verification on devices you trust. Your current browser is labeled below.
          - generic [ref=e109]:
            - paragraph [ref=e110]: No trusted devices yet.
            - paragraph [ref=e111]: You'll need to enter a verification code each time you sign in.
        - generic [ref=e112]:
          - generic [ref=e113]:
            - generic [ref=e114]: Danger Zone
            - generic [ref=e115]: Irreversible actions for your account
          - button "Delete Account" [ref=e117] [cursor=pointer]
    - contentinfo [ref=e118]:
      - generic [ref=e119]:
        - generic [ref=e120]:
          - paragraph [ref=e121]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e122]:
            - link "Privacy Policy" [ref=e124] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e125]:
              - generic [ref=e126]: ·
              - link "Terms of Service" [ref=e127] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e128]:
              - generic [ref=e129]: ·
              - link "Disclosures" [ref=e130] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e131]:
              - generic [ref=e132]: ·
              - link "Risk Warning" [ref=e133] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e134]:
              - generic [ref=e135]: ·
              - link "Contact" [ref=e136] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e137]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e138]
```

# Test source

```ts
  199 |   async updateProfile(
  200 |     firstName: string,
  201 |     lastName: string
  202 |   ) {
  203 | 
  204 |     Logger.info(
  205 |       'Updating Profile'
  206 |     );
  207 | 
  208 |     await this.firstNameInput.fill(
  209 |       firstName
  210 |     );
  211 | 
  212 |     await this.lastNameInput.fill(
  213 |       lastName
  214 |     );
  215 | 
  216 |     await safeClick(
  217 |       this.saveChangesButton,
  218 |       'Save Changes'
  219 |     );
  220 | 
  221 |     Logger.success(
  222 |       'Profile Updated'
  223 |     );
  224 |   }
  225 | 
  226 |   async changePassword(
  227 |     currentPassword: string,
  228 |     newPassword: string
  229 |   ) {
  230 | 
  231 |     Logger.info(
  232 |       'Changing Password'
  233 |     );
  234 | 
  235 |     await this.currentPasswordInput.fill(
  236 |       currentPassword
  237 |     );
  238 | 
  239 |     await this.newPasswordInput.fill(
  240 |       newPassword
  241 |     );
  242 | 
  243 |     await this.confirmPasswordInput.fill(
  244 |       newPassword
  245 |     );
  246 | 
  247 |     await safeClick(
  248 |       this.changePasswordButton,
  249 |       'Change Password'
  250 |     );
  251 | 
  252 |     Logger.success(
  253 |       'Password Change Submitted'
  254 |     );
  255 |   }
  256 |   async validateProfileLoaded() {
  257 | 
  258 |   Logger.info(
  259 |     'Validating Profile Data'
  260 |   );
  261 | 
  262 |   await expect(
  263 |     this.firstNameInput
  264 |   ).not.toHaveValue('');
  265 | 
  266 |   await expect(
  267 |     this.lastNameInput
  268 |   ).not.toHaveValue('');
  269 | 
  270 |   await expect(
  271 |     this.emailInput
  272 |   ).not.toHaveValue('');
  273 | 
  274 |   await expect(
  275 |     this.emailInput
  276 |   ).toBeDisabled();
  277 | 
  278 |   Logger.success(
  279 |     'Profile Data Loaded'
  280 |   );
  281 | 
  282 |   Logger.success(
  283 |     'Email Field Disabled'
  284 |   );
  285 | }
  286 | async waitForProfileData() {
  287 | 
  288 |   await expect(
  289 |     this.page
  290 |   ).toHaveURL(
  291 |     /\/dashboard\/profile/,
  292 |     {
  293 |       timeout: 15000
  294 |     }
  295 |   );
  296 | 
  297 |   await expect(
  298 |     this.emailInput
> 299 |   ).not.toHaveValue(
      |         ^ Error: expect(locator).not.toHaveValue(expected) failed
  300 |     '',
  301 |     {
  302 |       timeout: 20000
  303 |     }
  304 |   );
  305 | }
  306 | 
  307 | async validatePersonalInfoControls() {
  308 | 
  309 |   Logger.info(
  310 |     'Validating Profile Personal Info Controls'
  311 |   );
  312 | 
  313 |   await expect(
  314 |     this.firstNameInput
  315 |   ).toBeVisible({
  316 |     timeout: 10000
  317 |   });
  318 | 
  319 |   await expect(
  320 |     this.lastNameInput
  321 |   ).toBeVisible({
  322 |     timeout: 10000
  323 |   });
  324 | 
  325 |   await expect(
  326 |     this.emailInput
  327 |   ).toBeVisible({
  328 |     timeout: 10000
  329 |   });
  330 | 
  331 |   await expect(
  332 |     this.emailInput
  333 |   ).toBeDisabled();
  334 | 
  335 |   await expect(
  336 |     this.saveChangesButton
  337 |   ).toBeVisible({
  338 |     timeout: 10000
  339 |   });
  340 | 
  341 |   Logger.success(
  342 |     'Profile Personal Info Controls Validated'
  343 |   );
  344 | }
  345 | 
  346 | async updateProfileAndValidatePersistence(
  347 |   firstName: string,
  348 |   lastName: string
  349 | ) {
  350 | 
  351 |   await this.updateProfile(
  352 |     firstName,
  353 |     lastName
  354 |   );
  355 | 
  356 |   await this.page.reload({
  357 |     waitUntil: 'domcontentloaded'
  358 |   });
  359 | 
  360 |   await this.waitForProfileData();
  361 | 
  362 |   await expect(
  363 |     this.firstNameInput
  364 |   ).toHaveValue(
  365 |     firstName,
  366 |     {
  367 |       timeout: 15000
  368 |     }
  369 |   );
  370 | 
  371 |   await expect(
  372 |     this.lastNameInput
  373 |   ).toHaveValue(
  374 |     lastName,
  375 |     {
  376 |       timeout: 15000
  377 |     }
  378 |   );
  379 | 
  380 |   Logger.success(
  381 |     'Profile Update Persisted After Refresh'
  382 |   );
  383 | }
  384 | async validatePasswordMismatch() {
  385 | 
  386 |   await expect(
  387 |     this.page.getByText(
  388 |       /passwords do not match/i
  389 |     )
  390 |   ).toBeVisible();
  391 | 
  392 |   Logger.success(
  393 |     'Password Mismatch Message Verified'
  394 |   );
  395 | }
  396 | async validateWrongCurrentPassword() {
  397 | 
  398 |   await expect(
  399 |     this.page.getByText(
```