# OOLTool Playwright Automation

## Daily Execution

Run the stable execution suite and generate the execution report:

```powershell
$env:RECORD_ALL_ARTIFACTS="true"
npm run execution
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

If these URLs are not set, controlled tests are skipped by design.

## Useful Commands

```powershell
npm run typecheck
npm run test:execution
npm run report:execution
npm run test:controlled
npm run report
```

## Report Files

```text
execution-report/index.html
playwright-report/index.html
test-results/
```

`execution-report/index.html` is the summary execution report. `playwright-report/index.html` is the detailed evidence report.
