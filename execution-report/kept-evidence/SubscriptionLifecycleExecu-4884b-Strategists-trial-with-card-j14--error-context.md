# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> Disposable user can start Overlay Strategists trial with card
- Location: tests\SubscriptionLifecycleExecution.spec.ts:163:9

# Error details

```
Error: Automatic Gmail verification failed for imhardikthanki+sub-lifecycl-munyvpxs@gmail.com. locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('input[type="email"], input[name="email"]').first() to be visible

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
        - generic [ref=e14]:
          - button "Monthly" [ref=e15]
          - button "Annual" [ref=e16]
        - generic [ref=e17]:
          - radio "Curious Explore your Portfolio Free forever Manual Upload Only Positions (10) Simulations (10) CTAs Refresh Covered Calls OOLS Score" [checked] [ref=e18] [cursor=pointer]:
            - generic [ref=e19]:
              - img [ref=e20]
              - generic [ref=e22]: Curious
            - paragraph [ref=e23]: Explore your Portfolio
            - generic [ref=e24]: Free forever
            - list [ref=e25]:
              - listitem [ref=e26]:
                - img [ref=e27]
                - text: Manual Upload Only
              - listitem [ref=e29]:
                - img [ref=e30]
                - text: Positions (10)
              - listitem [ref=e32]:
                - img [ref=e33]
                - text: Simulations (10)
              - listitem [ref=e35]:
                - img [ref=e36]
                - text: CTAs Refresh
              - listitem [ref=e38]:
                - img [ref=e39]
                - text: Covered Calls
              - listitem [ref=e41]:
                - img [ref=e42]
                - text: OOLS Score
          - radio "Income Build your Portfolio $29/mo Broker Integration (1) Account Linked (1) Positions (100) CTAs Unlimited Simulations Unlimited Covered Calls/Puts CTAs Earnings Notifications Dividend Notifications OOLS Score" [ref=e44] [cursor=pointer]:
            - generic [ref=e45]:
              - img [ref=e46]
              - generic [ref=e48]: Income
            - paragraph [ref=e49]: Build your Portfolio
            - generic [ref=e50]: $29/mo
            - list [ref=e51]:
              - listitem [ref=e52]:
                - img [ref=e53]
                - text: Broker Integration (1)
              - listitem [ref=e55]:
                - img [ref=e56]
                - text: Account Linked (1)
              - listitem [ref=e58]:
                - img [ref=e59]
                - text: Positions (100)
              - listitem [ref=e61]:
                - img [ref=e62]
                - text: CTAs Unlimited
              - listitem [ref=e64]:
                - img [ref=e65]
                - text: Simulations Unlimited
              - listitem [ref=e67]:
                - img [ref=e68]
                - text: Covered Calls/Puts CTAs
              - listitem [ref=e70]:
                - img [ref=e71]
                - text: Earnings Notifications
              - listitem [ref=e73]:
                - img [ref=e74]
                - text: Dividend Notifications
              - listitem [ref=e76]:
                - img [ref=e77]
                - text: OOLS Score
          - radio "Overlay Strategists Optimize your Portfolio $79/mo Try 30 days free With card · auto-renews after trial Try 30 days free Without card · moves to Free after trial Broker Integration (5) Account Linked (10) Positions (500) CTAs & Simulations Unlimited Covered Calls/Puts CTAs Earnings & Dividends Notifications ITM/ATM resolve suggestions Portfolio Analytics Bulk Portfolio Load OOLS Score" [ref=e79] [cursor=pointer]:
            - generic [ref=e81]:
              - img [ref=e82]
              - generic [ref=e84]: Overlay Strategists
            - paragraph [ref=e85]: Optimize your Portfolio
            - generic [ref=e86]: $79/mo
            - generic [ref=e88]:
              - button "Try 30 days free With card · auto-renews after trial" [ref=e89]:
                - generic [ref=e90]:
                  - img
                  - text: Try 30 days free
                - generic [ref=e91]: With card · auto-renews after trial
              - button "Try 30 days free Without card · moves to Free after trial" [ref=e92]:
                - generic [ref=e93]:
                  - img
                  - text: Try 30 days free
                - generic [ref=e94]: Without card · moves to Free after trial
            - list [ref=e95]:
              - listitem [ref=e96]:
                - img [ref=e97]
                - text: Broker Integration (5)
              - listitem [ref=e99]:
                - img [ref=e100]
                - text: Account Linked (10)
              - listitem [ref=e102]:
                - img [ref=e103]
                - text: Positions (500)
              - listitem [ref=e105]:
                - img [ref=e106]
                - text: CTAs & Simulations Unlimited
              - listitem [ref=e108]:
                - img [ref=e109]
                - text: Covered Calls/Puts CTAs
              - listitem [ref=e111]:
                - img [ref=e112]
                - text: Earnings & Dividends Notifications
              - listitem [ref=e114]:
                - img [ref=e115]
                - text: ITM/ATM resolve suggestions
              - listitem [ref=e117]:
                - img [ref=e118]
                - text: Portfolio Analytics
              - listitem [ref=e120]:
                - img [ref=e121]
                - text: Bulk Portfolio Load
              - listitem [ref=e123]:
                - img [ref=e124]
                - text: OOLS Score
          - radio "Portfolio Hedger Optimize your Portfolio $149/mo Broker Integration (10) Account Linked (20) Positions (1000) CTAs & Simulations Unlimited Covered Calls/Puts CTAs Protective Puts Option roll suggestions Earnings & Dividends Notifications ITM/ATM resolve suggestions Portfolio Analytics Bulk Portfolio Load OOLS Score" [ref=e126] [cursor=pointer]:
            - generic [ref=e127]:
              - img [ref=e128]
              - generic [ref=e130]: Portfolio Hedger
            - paragraph [ref=e131]: Optimize your Portfolio
            - generic [ref=e132]: $149/mo
            - list [ref=e133]:
              - listitem [ref=e134]:
                - img [ref=e135]
                - text: Broker Integration (10)
              - listitem [ref=e137]:
                - img [ref=e138]
                - text: Account Linked (20)
              - listitem [ref=e140]:
                - img [ref=e141]
                - text: Positions (1000)
              - listitem [ref=e143]:
                - img [ref=e144]
                - text: CTAs & Simulations Unlimited
              - listitem [ref=e146]:
                - img [ref=e147]
                - text: Covered Calls/Puts CTAs
              - listitem [ref=e149]:
                - img [ref=e150]
                - text: Protective Puts
              - listitem [ref=e152]:
                - img [ref=e153]
                - text: Option roll suggestions
              - listitem [ref=e155]:
                - img [ref=e156]
                - text: Earnings & Dividends Notifications
              - listitem [ref=e158]:
                - img [ref=e159]
                - text: ITM/ATM resolve suggestions
              - listitem [ref=e161]:
                - img [ref=e162]
                - text: Portfolio Analytics
              - listitem [ref=e164]:
                - img [ref=e165]
                - text: Bulk Portfolio Load
              - listitem [ref=e167]:
                - img [ref=e168]
                - text: OOLS Score
          - generic [ref=e171]:
            - heading "Enterprise" [level=3] [ref=e172]
            - paragraph [ref=e173]: For RIAs, wealth teams and financial institutions
            - paragraph [ref=e174]: Custom
            - paragraph [ref=e175]: SSO, SAML, SOC 2
            - list [ref=e176]:
              - listitem [ref=e177]:
                - img [ref=e178]
                - generic [ref=e180]: SaaS and API integrations
              - listitem [ref=e181]:
                - img [ref=e182]
                - generic [ref=e184]: Ools SDK and APIs
              - listitem [ref=e185]:
                - img [ref=e186]
                - generic [ref=e188]: Customized features
              - listitem [ref=e189]:
                - img [ref=e190]
                - generic [ref=e192]: Multi-user teams and role-based access
              - listitem [ref=e193]:
                - img [ref=e194]
                - generic [ref=e196]: Firm-wide portfolio analytics
              - listitem [ref=e197]:
                - img [ref=e198]
                - generic [ref=e200]: Centralized administration
              - listitem [ref=e201]:
                - img [ref=e202]
                - generic [ref=e204]: Audit logs and governance controls
            - button "Contact Sales" [ref=e205] [cursor=pointer]:
              - img
              - text: Contact Sales
            - link "contact@ooltool.com" [ref=e206] [cursor=pointer]:
              - /url: mailto:contact@ooltool.com
        - button "Complete Setup" [ref=e207] [cursor=pointer]
  - region "Notifications alt+T"
  - alert [ref=e208]
```

# Test source

```ts
  34  | ) {
  35  |   return /verify-email/i.test(
  36  |     page.url()
  37  |   );
  38  | }
  39  | 
  40  | export async function openFreshLoginPage(
  41  |   page: Page
  42  | ) {
  43  |   await page.goto(
  44  |     `${BASE_URL}${URLS.LOGIN}`,
  45  |     {
  46  |       waitUntil: 'commit',
  47  |       timeout: 60000
  48  |     }
  49  |   );
  50  | 
  51  |   await page.locator(
  52  |     'input[type="email"], input[name="email"]'
  53  |   ).first().waitFor({
  54  |     state: 'visible',
  55  |     timeout: 30000
  56  |   });
  57  | }
  58  | 
  59  | export async function waitForManualEmailVerification(
  60  |   page: Page,
  61  |   email: string
  62  | ) {
  63  |   if (
  64  |     !AUTH_SETTINGS.emailVerificationRequired
  65  |   ) {
  66  |     if (
  67  |       isEmailVerificationPage(
  68  |         page
  69  |       )
  70  |     ) {
  71  |       await openFreshLoginPage(
  72  |         page
  73  |       );
  74  |     }
  75  | 
  76  |     return;
  77  |   }
  78  | 
  79  |   console.log(
  80  |     `Email verification for ${email}. Gmail IMAP: ${
  81  |       isGmailAutomationEnabled()
  82  |         ? 'enabled'
  83  |         : 'disabled'
  84  |     }`
  85  |   );
  86  | 
  87  |   if (
  88  |     isGmailAutomationEnabled()
  89  |   ) {
  90  |     console.log(
  91  |       `Reading verification email from Gmail for ${email}`
  92  |     );
  93  | 
  94  |     try {
  95  |       const verificationLink =
  96  |         await waitForGmailVerificationLink(
  97  |           email
  98  |         );
  99  | 
  100 |       console.log(
  101 |         'Opened verification link from Gmail inbox'
  102 |       );
  103 | 
  104 |       await page.goto(
  105 |         verificationLink,
  106 |         {
  107 |           waitUntil: 'domcontentloaded'
  108 |         }
  109 |       );
  110 | 
  111 |       await openFreshLoginPage(
  112 |         page
  113 |       );
  114 | 
  115 |       return;
  116 |     } catch (
  117 |       error
  118 |     ) {
  119 |       const message =
  120 |         error instanceof Error
  121 |           ? error.message
  122 |           : String(
  123 |             error
  124 |           );
  125 | 
  126 |       console.log(
  127 |         'Gmail inbox automation failed.'
  128 |       );
  129 |       console.log(
  130 |         message
  131 |       );
  132 | 
  133 |       if (process.env.CI || process.env.EMAIL_VERIFICATION_PAUSE !== 'true') {
> 134 |         throw new Error(
      |               ^ Error: Automatic Gmail verification failed for imhardikthanki+sub-lifecycl-munyvpxs@gmail.com. locator.waitFor: Timeout 30000ms exceeded.
  135 |           `Automatic Gmail verification failed for ${email}. ${message}`
  136 |         );
  137 |       }
  138 | 
  139 |       console.log(
  140 |         'Falling back to manual pause.'
  141 |       );
  142 |     }
  143 |   } else {
  144 |     console.log(
  145 |       'GMAIL_APP_PASSWORD is not set, so automatic Gmail verification is skipped.'
  146 |     );
  147 |     console.log(
  148 |       'Copy .env.example to .env and paste the Gmail App Password, or set $env:GMAIL_APP_PASSWORD in this VS Code terminal.'
  149 |     );
  150 | 
  151 |     if (process.env.CI || process.env.EMAIL_VERIFICATION_PAUSE !== 'true') {
  152 |       throw new Error(
  153 |         `Automatic Gmail verification is not configured for ${email}. Set GMAIL_APP_PASSWORD in .env.`
  154 |       );
  155 |     }
  156 |   }
  157 | 
  158 |   console.log(
  159 |     '\nMANUAL EMAIL VERIFICATION REQUIRED'
  160 |   );
  161 |   console.log(
  162 |     `Verify email sent to: ${email}`
  163 |   );
  164 |   console.log(
  165 |     'Open Gmail and click the verification link until it succeeds.'
  166 |   );
  167 |   console.log(
  168 |     'Do NOT click Send verification link or Resend in this browser.'
  169 |   );
  170 |   console.log(
  171 |     'After Gmail shows success, resume Playwright. Login will open /login next.'
  172 |   );
  173 | 
  174 |   await page.pause();
  175 | 
  176 |   await openFreshLoginPage(
  177 |     page
  178 |   );
  179 | }
  180 | 
```