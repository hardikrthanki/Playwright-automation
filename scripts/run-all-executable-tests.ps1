<#
Runs the broadest practical OOLTool automation pass by enabling safe controlled
test gates before starting Playwright.

Some tests still require one-time/manual data and will skip unless you provide
the values below before running this script:

- RESET_URL for reset-password page validation.
- STRIPE_CHECKOUT_URL for Stripe Checkout negative validation.
- MFA_LOCAL_TOTP_SECRET for authenticator/trusted-device tests.
- MFA_LOCAL_BACKUP_CODE for backup-code tests.
- PERMISSION_ALLOWED_EMAIL/PASSWORD and PERMISSION_RESTRICTED_EMAIL/PASSWORD
  for permission-access tests.
- ADMIN_EMAIL/PASSWORD can be used to prepare roles, MFA settings, and account
  state before controlled tests.
- A locked account for unlock-account validation.

Usage:
  .\scripts\run-all-executable-tests.ps1 -Headed
  .\scripts\run-all-executable-tests.ps1 -Headed -GenerateAir
#>

param(
  [switch]$Headed,
  [switch]$GenerateAir
)

$ErrorActionPreference = 'Stop'

function Enable-Flag {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Name
  )

  Set-Item -Path "Env:$Name" -Value 'true'
}

function Set-DefaultEnv {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Name,

    [Parameter(Mandatory = $true)]
    [string]$Value
  )

  if (!(Test-Path "Env:$Name") -or [string]::IsNullOrWhiteSpace((Get-Item "Env:$Name").Value)) {
    Set-Item -Path "Env:$Name" -Value $Value
  }
}

Enable-Flag 'RECORD_ALL_ARTIFACTS'

# Controlled validations that are safe to execute with normal prepared users.
Enable-Flag 'ONBOARDING_FIELD_VALIDATION_ENABLED'
Enable-Flag 'ONBOARDING_FIELD_VALIDATION_FULL_ENABLED'
Enable-Flag 'RISK_COMPLIANCE_VALIDATION_ENABLED'
Enable-Flag 'RISK_COMPLIANCE_UPDATE_ENABLED'
Enable-Flag 'PLAN_SELECTION_VALIDATION_ENABLED'
Enable-Flag 'PLAN_SELECTION_FREE_ACTIVATION_ENABLED'
Enable-Flag 'PROFILE_MOBILE_VALIDATION_ENABLED'
Enable-Flag 'PROFILE_UPDATE_VALIDATION_ENABLED'
Enable-Flag 'BILLING_SUBSCRIPTION_MANAGEMENT_ENABLED'
Enable-Flag 'PROFILE_SECURITY_DISPLAY_ENABLED'
Enable-Flag 'SIGNUP_OTP_LENGTH_VALIDATION_ENABLED'
Enable-Flag 'SIGNUP_OTP_RESEND_VALIDATION_ENABLED'
Enable-Flag 'SIGNUP_DUPLICATE_EMAIL_VALIDATION_ENABLED'

# Stripe Overlay is still a phase-controlled area, but these flags allow the
# implemented browser-safe cases to run when the suite includes the file.
Enable-Flag 'OVERLAY_STRATEGISTS_FLOW_ENABLED'
Enable-Flag 'OVERLAY_STRATEGISTS_TERMS_ENABLED'

Set-DefaultEnv 'AUTH_OTP_CODE' '111111'
Set-DefaultEnv 'PLAN_SELECTION_EXISTING_EMAIL' 'imhardikthanki+plan-selection-prepared@gmail.com'
Set-DefaultEnv 'PLAN_SELECTION_EXISTING_PASSWORD' 'H@rdik9944'
Set-DefaultEnv 'AIR_RESTORE_HISTORY' 'true'
Set-DefaultEnv 'AIR_INCLUDE_MANUAL_DEFECTS' 'false'
Set-DefaultEnv 'ADMIN_EMAIL' 'admin@ooltool.com'
Set-DefaultEnv 'ADMIN_PASSWORD' 'Admin@1234!'

# Avoid enabling destructive Stripe and MFA lifecycle flags by default.
# Uncomment only when using dedicated disposable accounts / fresh one-time data.
# Enable-Flag 'OVERLAY_STRATEGISTS_WITH_CARD_ENABLED'
# Enable-Flag 'OVERLAY_STRATEGISTS_WITHOUT_CARD_ENABLED'
# Enable-Flag 'OVERLAY_STRATEGISTS_STRIPE_NEGATIVE_ENABLED'
# Enable-Flag 'AUTH_CONFIGURATION_LIMITS_ENABLED'
# Enable-Flag 'AUTH_LOCKOUT_LIMIT_VALIDATION_ENABLED'
# Enable-Flag 'AUTH_PASSWORD_RESET_RATE_LIMIT_VALIDATION_ENABLED'
# Enable-Flag 'MFA_USER_FLOW_ENABLED'
# Enable-Flag 'MFA_ALLOW_DESTRUCTIVE_USER_FLOW'
# Enable-Flag 'MFA_MANUAL_OTP_FLOW_ENABLED'
# Enable-Flag 'PERMISSION_TEST_ENABLED'

$playwrightArgs = @('test')

if ($Headed) {
  $playwrightArgs += '--headed'
}

Write-Host 'Running all currently executable tests in one Playwright process.' -ForegroundColor Cyan
Write-Host 'Use run-safe-batched-tests.ps1 for safer multi-batch execution and AIR merge.' -ForegroundColor Cyan
Write-Host 'Running executable automation suite with safe controlled gates enabled...' -ForegroundColor Green
& .\node_modules\.bin\playwright.cmd @playwrightArgs

if ($GenerateAir) {
  Write-Host 'Generating AIR execution report...' -ForegroundColor Green
  node scripts\generate-air-results.js
  node scripts\generate-execution-report.js
}
