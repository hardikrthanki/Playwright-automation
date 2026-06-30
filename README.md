# OOLTool Playwright Automation

## Daily Execution

Run the stable execution suite and generate the execution report:

```powershell
$env:RECORD_ALL_ARTIFACTS="true"
npm run execution
```

Stable execution includes the tests that should run without a fresh email link,
locked account, or one-time Stripe checkout URL:

```text
onboarding.spec.ts
AuthNegative.spec.ts
SignupNegative.spec.ts
PasswordPolicy.spec.ts
SessionSecurity.spec.ts
AccessibilityBrowser.spec.ts
Profile.spec.ts
ProfileNegative.spec.ts
ProfilePasswordMismatch.spec.ts
ProfileWrongCurrentPassword.spec.ts
BillingDeep.spec.ts
Subscriber.spec.ts
```

Open the execution report:

```text
C:\Users\BAPS\Documents\Oools_paywright\execution-report\index.html
```

Open the detailed Playwright report with screenshots, videos, and traces:

```powershell
npx playwright show-report
```

## Controlled Tests

Controlled tests need fresh external URLs, so they are not part of the normal execution suite.

Run reset-password negative tests:

```powershell
$env:RESET_URL="https://puat.ooltool.com/reset-password/..."
npm run controlled
```

Run payment negative tests:

```powershell
$env:STRIPE_CHECKOUT_URL="https://checkout.stripe.com/c/pay/..."
npm run controlled
```

Run both controlled areas:

```powershell
$env:RESET_URL="https://puat.ooltool.com/reset-password/..."
$env:STRIPE_CHECKOUT_URL="https://checkout.stripe.com/c/pay/..."
npm run controlled
```

Run only reset-password controlled tests:

```powershell
$env:RESET_URL="https://puat.ooltool.com/reset-password/..."
npm run test:controlled:reset
```

Run only payment controlled tests:

```powershell
$env:STRIPE_CHECKOUT_URL="https://checkout.stripe.com/c/pay/..."
npm run test:controlled:payment
```

Run manual email-link flows:

```powershell
npm run test:controlled:email -- --headed
```

`forgotpassword.spec.ts` pauses while you open the reset email link in the same
Playwright browser. `UnlockAccount.spec.ts` is opt-in and runs only when the
account is already locked and `RUN_UNLOCK_ACCOUNT_TEST=true`.

```powershell
$env:RUN_UNLOCK_ACCOUNT_TEST="true"
npm run test:controlled:email -- --headed
```

If these URLs are not set, controlled tests are skipped by design.

## Useful Commands

```powershell
npm run typecheck
npm run test:stable
npm run test:execution
npm run report:execution
npm run test:controlled
npm run test:controlled:email
npm run test:controlled:reset
npm run test:controlled:payment
npm run report
```

## Report Files

```text
execution-report/index.html
playwright-report/index.html
test-results/
```

`execution-report/index.html` is the summary execution report. `playwright-report/index.html` is the detailed evidence report.

## AIR Documentation

```text
docs/README.md
docs/PRODUCT_VISION.md
docs/ARCHITECTURE.md
docs/DATA_MODEL.md
docs/AIR_CORE.md
docs/ROADMAP.md
docs/air/air-product-specification.md
docs/air/air-design-system-wireframes.md
docs/air/air-decision-log.md
docs/air/air-report-vision-functional-summary.md
config/air.config.json
```

Start with `docs/README.md` for the AIR developer documentation set. The root `docs/*.md` files define AIR as an engineering product: product vision, architecture, data model, parser, AIR Core engines, roadmap, coding standards, and contribution workflow. The `docs/air/` files preserve the earlier product specification, design-system notes, decision log, and report vision.
