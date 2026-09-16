<#
Runs the entire Playwright suite in headed mode, including Stripe execution
flags, skipped/blocked matrix rows, then generates AIR.

Usage:
  powershell -ExecutionPolicy Bypass -File scripts\run-complete-headed-air.ps1
#>

$ErrorActionPreference = 'Continue'

Set-Location (Split-Path -Parent $PSScriptRoot)

if (-not $env:PLAYWRIGHT_BROWSERS_PATH) {
  $env:PLAYWRIGHT_BROWSERS_PATH = Join-Path $env:USERPROFILE 'AppData\Local\ms-playwright'
}

node scripts\upsert-env-flags.js

$flags = @(
  'AUTH_EMAIL_VERIFICATION_REQUIRED',
  'ONBOARDING_FIELD_VALIDATION_ENABLED',
  'ONBOARDING_FIELD_VALIDATION_FULL_ENABLED',
  'RISK_COMPLIANCE_VALIDATION_ENABLED',
  'RISK_COMPLIANCE_UPDATE_ENABLED',
  'PLAN_SELECTION_VALIDATION_ENABLED',
  'PLAN_SELECTION_FREE_ACTIVATION_ENABLED',
  'PROFILE_MOBILE_VALIDATION_ENABLED',
  'PROFILE_UPDATE_VALIDATION_ENABLED',
  'BILLING_SUBSCRIPTION_MANAGEMENT_ENABLED',
  'PROFILE_SECURITY_DISPLAY_ENABLED',
  'SIGNUP_OTP_LENGTH_VALIDATION_ENABLED',
  'SIGNUP_OTP_RESEND_VALIDATION_ENABLED',
  'SIGNUP_DUPLICATE_EMAIL_VALIDATION_ENABLED',
  'OVERLAY_STRATEGISTS_FLOW_ENABLED',
  'OVERLAY_STRATEGISTS_TERMS_ENABLED',
  'OVERLAY_STRATEGISTS_WITH_CARD_ENABLED',
  'OVERLAY_STRATEGISTS_WITHOUT_CARD_ENABLED',
  'OVERLAY_STRATEGISTS_STRIPE_CHECKOUT_DETAILS_ENABLED',
  'OVERLAY_STRATEGISTS_STRIPE_NEGATIVE_ENABLED',
  'OVERLAY_STRATEGISTS_DECLINED_CARD_ENABLED',
  'DIRECT_SUBSCRIPTION_PURCHASE_ENABLED',
  'SUBSCRIPTION_LIFECYCLE_EXECUTION_ENABLED',
  'SUB_LIFECYCLE_TRIAL_WITHOUT_CARD_ENABLED',
  'SUB_LIFECYCLE_TRIAL_WITH_CARD_ENABLED',
  'SUB_LIFECYCLE_INCOME_MONTHLY_ENABLED',
  'SUB_LIFECYCLE_PLAN_CONTROLS_ENABLED',
  'SUB_LIFECYCLE_UPGRADE_PREVIEW_ENABLED',
  'SUB_LIFECYCLE_DOWNGRADE_PREVIEW_ENABLED',
  'SUB_LIFECYCLE_INTERVAL_PREVIEW_ENABLED',
  'SUB_LIFECYCLE_CANCEL_FORM_ENABLED',
  'SUB_LIFECYCLE_OVERLAY_MONTHLY_ENABLED',
  'SUB_LIFECYCLE_PORTFOLIO_MONTHLY_ENABLED',
  'SUB_LIFECYCLE_MARKETPLACE_MONTHLY_ENABLED',
  'SUB_LIFECYCLE_PAID_ANNUAL_ENABLED',
  'SUB_LIFECYCLE_UPGRADE_SUBMIT_ENABLED'
)

foreach ($flag in $flags) {
  Set-Item -Path "Env:$flag" -Value 'true'
}

$env:HEADED = 'true'
$env:AIR_REPORT_SCOPE = 'latest'
$env:AIR_RESTORE_HISTORY = 'true'

Write-Host 'Complete headed suite: all specs, Stripe execution flags on, then AIR.' -ForegroundColor Cyan
Write-Host 'Matrix rows still skip on purpose so AIR can classify skipped/blocked.' -ForegroundColor Cyan

& .\node_modules\.bin\playwright.cmd test --headed
$playwrightExit = $LASTEXITCODE

$env:AIR_REPORT_SCOPE = 'latest'
npm run report:execution

if ($playwrightExit -ne 0) {
  Write-Host "Playwright finished with exit code $playwrightExit. AIR was still generated." -ForegroundColor Yellow
  exit $playwrightExit
}

Write-Host 'Complete headed suite finished. AIR opened.' -ForegroundColor Green
