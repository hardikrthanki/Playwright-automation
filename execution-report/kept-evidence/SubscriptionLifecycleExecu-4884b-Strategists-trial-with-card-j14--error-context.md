# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> Disposable user can start Overlay Strategists trial with card
- Location: tests\SubscriptionLifecycleExecution.spec.ts:139:9

# Error details

```
Error: Automatic Gmail verification failed for imhardikthanki+sub-lifecycl-muv4mmu2@gmail.com. locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('textbox', { name: /^email$/i }).or(locator('input[type="email"], input[name="email"]')).first() to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - button "Sign Out" [ref=e4] [cursor=pointer]:
        - img
        - text: Sign Out
    - generic [ref=e6]:
      - generic [ref=e7]:
        - link "OolTool" [ref=e8] [cursor=pointer]:
          - /url: /
          - img "OolTool" [ref=e9]
        - heading "Choose Your Plan" [level=1] [ref=e10]
        - paragraph [ref=e11]: Select a plan to get started with OolTool
      - generic [ref=e12]:
        - note [ref=e13]:
          - generic [ref=e14]:
            - img [ref=e16]
            - generic [ref=e19]: Founding Team's Beta Pricing
          - generic [ref=e21]:
            - paragraph [ref=e22]: Save while helping us build OolTool — Beta pricing for the first 1,000 users.
            - paragraph [ref=e23]: "Note: OolTool is iteratively adding new features, new brokers and additional symbols."
        - generic [ref=e25]:
          - button "Monthly" [ref=e26]
          - button "Annual" [ref=e27]
        - generic [ref=e28]:
          - radio "Curious Explore your Portfolio Free forever Manual Upload Only Positions (10) Simulations (10) CTAs Refresh Covered Calls OOLS Score" [checked] [ref=e29] [cursor=pointer]:
            - generic [ref=e30]:
              - img [ref=e31]
              - generic [ref=e33]: Curious
            - paragraph [ref=e34]: Explore your Portfolio
            - generic [ref=e35]: Free forever
            - list [ref=e36]:
              - listitem [ref=e37]:
                - img [ref=e38]
                - text: Manual Upload Only
              - listitem [ref=e40]:
                - img [ref=e41]
                - text: Positions (10)
              - listitem [ref=e43]:
                - img [ref=e44]
                - text: Simulations (10)
              - listitem [ref=e46]:
                - img [ref=e47]
                - text: CTAs Refresh
              - listitem [ref=e49]:
                - img [ref=e50]
                - text: Covered Calls
              - listitem [ref=e52]:
                - img [ref=e53]
                - text: OOLS Score
          - radio "Income Build your Portfolio Was $29/month Now $2.90 /month Beta Broker Integration (1) Account Linked (1) Positions (100) CTAs Unlimited Simulations Unlimited Covered Calls/Puts CTAs Earnings Notifications Dividend Notifications OOLS Score" [ref=e55] [cursor=pointer]:
            - generic [ref=e56]:
              - img [ref=e57]
              - generic [ref=e59]: Income
            - paragraph [ref=e60]: Build your Portfolio
            - generic [ref=e62]:
              - paragraph [ref=e63]:
                - generic [ref=e64]: Was
                - text: $29/month
              - generic [ref=e65]:
                - paragraph [ref=e66]:
                  - generic [ref=e67]: Now
                  - generic [ref=e68]: $2.90
                  - generic [ref=e69]: /month
                - generic [ref=e70]: Beta
            - list [ref=e71]:
              - listitem [ref=e72]:
                - img [ref=e73]
                - text: Broker Integration (1)
              - listitem [ref=e75]:
                - img [ref=e76]
                - text: Account Linked (1)
              - listitem [ref=e78]:
                - img [ref=e79]
                - text: Positions (100)
              - listitem [ref=e81]:
                - img [ref=e82]
                - text: CTAs Unlimited
              - listitem [ref=e84]:
                - img [ref=e85]
                - text: Simulations Unlimited
              - listitem [ref=e87]:
                - img [ref=e88]
                - text: Covered Calls/Puts CTAs
              - listitem [ref=e90]:
                - img [ref=e91]
                - text: Earnings Notifications
              - listitem [ref=e93]:
                - img [ref=e94]
                - text: Dividend Notifications
              - listitem [ref=e96]:
                - img [ref=e97]
                - text: OOLS Score
          - radio "Overlay Strategists Optimize your Portfolio Was $79/month Now $7.90 /month Beta Try 30 days free With card · auto-renews after trial Try 30 days free Without card · moves to Free after trial Broker Integration (5) Account Linked (10) Positions (500) CTAs & Simulations Unlimited Covered Calls/Puts CTAs Earnings & Dividends Notifications ITM/ATM resolve suggestions Portfolio Analytics Bulk Portfolio Load OOLS Score" [ref=e99] [cursor=pointer]:
            - generic [ref=e101]:
              - img [ref=e102]
              - generic [ref=e104]: Overlay Strategists
            - paragraph [ref=e105]: Optimize your Portfolio
            - generic [ref=e107]:
              - paragraph [ref=e108]:
                - generic [ref=e109]: Was
                - text: $79/month
              - generic [ref=e110]:
                - paragraph [ref=e111]:
                  - generic [ref=e112]: Now
                  - generic [ref=e113]: $7.90
                  - generic [ref=e114]: /month
                - generic [ref=e115]: Beta
            - generic [ref=e117]:
              - button "Try 30 days free With card · auto-renews after trial" [ref=e118]:
                - generic [ref=e119]:
                  - img
                  - text: Try 30 days free
                - generic [ref=e120]: With card · auto-renews after trial
              - button "Try 30 days free Without card · moves to Free after trial" [ref=e121]:
                - generic [ref=e122]:
                  - img
                  - text: Try 30 days free
                - generic [ref=e123]: Without card · moves to Free after trial
            - list [ref=e124]:
              - listitem [ref=e125]:
                - img [ref=e126]
                - text: Broker Integration (5)
              - listitem [ref=e128]:
                - img [ref=e129]
                - text: Account Linked (10)
              - listitem [ref=e131]:
                - img [ref=e132]
                - text: Positions (500)
              - listitem [ref=e134]:
                - img [ref=e135]
                - text: CTAs & Simulations Unlimited
              - listitem [ref=e137]:
                - img [ref=e138]
                - text: Covered Calls/Puts CTAs
              - listitem [ref=e140]:
                - img [ref=e141]
                - text: Earnings & Dividends Notifications
              - listitem [ref=e143]:
                - img [ref=e144]
                - text: ITM/ATM resolve suggestions
              - listitem [ref=e146]:
                - img [ref=e147]
                - text: Portfolio Analytics
              - listitem [ref=e149]:
                - img [ref=e150]
                - text: Bulk Portfolio Load
              - listitem [ref=e152]:
                - img [ref=e153]
                - text: OOLS Score
          - radio "Portfolio Hedger Optimize your Portfolio Was $149/month Now $14.90 /month Beta Broker Integration (10) Account Linked (20) Positions (1000) CTAs & Simulations Unlimited Covered Calls/Puts CTAs Protective Puts Option roll suggestions Earnings & Dividends Notifications ITM/ATM resolve suggestions Portfolio Analytics Bulk Portfolio Load OOLS Score" [ref=e155] [cursor=pointer]:
            - generic [ref=e156]:
              - img [ref=e157]
              - generic [ref=e159]: Portfolio Hedger
            - paragraph [ref=e160]: Optimize your Portfolio
            - generic [ref=e162]:
              - paragraph [ref=e163]:
                - generic [ref=e164]: Was
                - text: $149/month
              - generic [ref=e165]:
                - paragraph [ref=e166]:
                  - generic [ref=e167]: Now
                  - generic [ref=e168]: $14.90
                  - generic [ref=e169]: /month
                - generic [ref=e170]: Beta
            - list [ref=e171]:
              - listitem [ref=e172]:
                - img [ref=e173]
                - text: Broker Integration (10)
              - listitem [ref=e175]:
                - img [ref=e176]
                - text: Account Linked (20)
              - listitem [ref=e178]:
                - img [ref=e179]
                - text: Positions (1000)
              - listitem [ref=e181]:
                - img [ref=e182]
                - text: CTAs & Simulations Unlimited
              - listitem [ref=e184]:
                - img [ref=e185]
                - text: Covered Calls/Puts CTAs
              - listitem [ref=e187]:
                - img [ref=e188]
                - text: Protective Puts
              - listitem [ref=e190]:
                - img [ref=e191]
                - text: Option roll suggestions
              - listitem [ref=e193]:
                - img [ref=e194]
                - text: Earnings & Dividends Notifications
              - listitem [ref=e196]:
                - img [ref=e197]
                - text: ITM/ATM resolve suggestions
              - listitem [ref=e199]:
                - img [ref=e200]
                - text: Portfolio Analytics
              - listitem [ref=e202]:
                - img [ref=e203]
                - text: Bulk Portfolio Load
              - listitem [ref=e205]:
                - img [ref=e206]
                - text: OOLS Score
          - generic [ref=e209]:
            - heading "Enterprise" [level=3] [ref=e210]
            - paragraph [ref=e211]: For RIAs, wealth teams and financial institutions
            - paragraph [ref=e212]: Custom
            - paragraph [ref=e213]: SSO, SAML, SOC 2
            - list [ref=e214]:
              - listitem [ref=e215]:
                - img [ref=e216]
                - generic [ref=e218]: SaaS and API integrations
              - listitem [ref=e219]:
                - img [ref=e220]
                - generic [ref=e222]: Ools SDK and APIs
              - listitem [ref=e223]:
                - img [ref=e224]
                - generic [ref=e226]: Customized features
              - listitem [ref=e227]:
                - img [ref=e228]
                - generic [ref=e230]: Multi-user teams and role-based access
              - listitem [ref=e231]:
                - img [ref=e232]
                - generic [ref=e234]: Firm-wide portfolio analytics
              - listitem [ref=e235]:
                - img [ref=e236]
                - generic [ref=e238]: Centralized administration
              - listitem [ref=e239]:
                - img [ref=e240]
                - generic [ref=e242]: Audit logs and governance controls
            - button "Contact Sales" [ref=e243] [cursor=pointer]:
              - img
              - text: Contact Sales
            - link "contact@ooltool.com" [ref=e244] [cursor=pointer]:
              - /url: mailto:contact@ooltool.com
        - button "Complete Setup" [ref=e245] [cursor=pointer]
  - region "Notifications alt+T"
  - alert [ref=e246]
```

# Test source

```ts
  62  |     ).catch(
  63  |       () => undefined
  64  |     );
  65  | 
  66  |     const ready =
  67  |       await emailField.waitFor({
  68  |         state: 'visible',
  69  |         timeout: 30000
  70  |       }).then(
  71  |         () => true
  72  |       ).catch(
  73  |         () => false
  74  |       );
  75  | 
  76  |     if (ready) {
  77  |       return;
  78  |     }
  79  |   }
  80  | 
  81  |   await emailField.waitFor({
  82  |     state: 'visible',
  83  |     timeout: 30000
  84  |   });
  85  | }
  86  | 
  87  | export async function waitForManualEmailVerification(
  88  |   page: Page,
  89  |   email: string
  90  | ) {
  91  |   if (
  92  |     !AUTH_SETTINGS.emailVerificationRequired
  93  |   ) {
  94  |     if (
  95  |       isEmailVerificationPage(
  96  |         page
  97  |       )
  98  |     ) {
  99  |       await openFreshLoginPage(
  100 |         page
  101 |       );
  102 |     }
  103 | 
  104 |     return;
  105 |   }
  106 | 
  107 |   console.log(
  108 |     `Email verification for ${email}. Gmail IMAP: ${
  109 |       isGmailAutomationEnabled()
  110 |         ? 'enabled'
  111 |         : 'disabled'
  112 |     }`
  113 |   );
  114 | 
  115 |   if (
  116 |     isGmailAutomationEnabled()
  117 |   ) {
  118 |     console.log(
  119 |       `Reading verification email from Gmail for ${email}`
  120 |     );
  121 | 
  122 |     try {
  123 |       const verificationLink =
  124 |         await waitForGmailVerificationLink(
  125 |           email
  126 |         );
  127 | 
  128 |       console.log(
  129 |         'Opened verification link from Gmail inbox'
  130 |       );
  131 | 
  132 |       await page.goto(
  133 |         verificationLink,
  134 |         {
  135 |           waitUntil: 'domcontentloaded'
  136 |         }
  137 |       );
  138 | 
  139 |       await openFreshLoginPage(
  140 |         page
  141 |       );
  142 | 
  143 |       return;
  144 |     } catch (
  145 |       error
  146 |     ) {
  147 |       const message =
  148 |         error instanceof Error
  149 |           ? error.message
  150 |           : String(
  151 |             error
  152 |           );
  153 | 
  154 |       console.log(
  155 |         'Gmail inbox automation failed.'
  156 |       );
  157 |       console.log(
  158 |         message
  159 |       );
  160 | 
  161 |       if (process.env.CI || process.env.EMAIL_VERIFICATION_PAUSE !== 'true') {
> 162 |         throw new Error(
      |               ^ Error: Automatic Gmail verification failed for imhardikthanki+sub-lifecycl-muv4mmu2@gmail.com. locator.waitFor: Timeout 30000ms exceeded.
  163 |           `Automatic Gmail verification failed for ${email}. ${message}`
  164 |         );
  165 |       }
  166 | 
  167 |       console.log(
  168 |         'Falling back to manual pause.'
  169 |       );
  170 |     }
  171 |   } else {
  172 |     console.log(
  173 |       'GMAIL_APP_PASSWORD is not set, so automatic Gmail verification is skipped.'
  174 |     );
  175 |     console.log(
  176 |       'Copy .env.example to .env and paste the Gmail App Password, or set $env:GMAIL_APP_PASSWORD in this VS Code terminal.'
  177 |     );
  178 | 
  179 |     if (process.env.CI || process.env.EMAIL_VERIFICATION_PAUSE !== 'true') {
  180 |       throw new Error(
  181 |         `Automatic Gmail verification is not configured for ${email}. Set GMAIL_APP_PASSWORD in .env.`
  182 |       );
  183 |     }
  184 |   }
  185 | 
  186 |   console.log(
  187 |     '\nMANUAL EMAIL VERIFICATION REQUIRED'
  188 |   );
  189 |   console.log(
  190 |     `Verify email sent to: ${email}`
  191 |   );
  192 |   console.log(
  193 |     'Open Gmail and click the verification link until it succeeds.'
  194 |   );
  195 |   console.log(
  196 |     'Do NOT click Send verification link or Resend in this browser.'
  197 |   );
  198 |   console.log(
  199 |     'After Gmail shows success, resume Playwright. Login will open /login next.'
  200 |   );
  201 | 
  202 |   await page.pause();
  203 | 
  204 |   await openFreshLoginPage(
  205 |     page
  206 |   );
  207 | }
  208 | 
```