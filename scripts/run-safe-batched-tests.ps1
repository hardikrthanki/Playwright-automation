<#
Runs safe OOLTool automation in smaller batches, stores each batch JSON result,
merges completed batches, then generates AIR.

This is safer than one very long Playwright process because completed batches
still contribute to AIR even if a later batch fails or takes too long.

Usage:
  powershell -ExecutionPolicy Bypass -File scripts\run-safe-batched-tests.ps1
  powershell -ExecutionPolicy Bypass -File scripts\run-safe-batched-tests.ps1 -Headed
#>

param(
  [switch]$Headed,
  [switch]$SkipAir
)

$ErrorActionPreference = 'Continue'

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
Enable-Flag 'OVERLAY_STRATEGISTS_FLOW_ENABLED'
Enable-Flag 'OVERLAY_STRATEGISTS_TERMS_ENABLED'

Set-DefaultEnv 'AUTH_OTP_CODE' '111111'
Set-DefaultEnv 'PLAN_SELECTION_EXISTING_EMAIL' 'imhardikthanki+plan-selection-prepared@gmail.com'
Set-DefaultEnv 'PLAN_SELECTION_EXISTING_PASSWORD' 'H@rdik9944'
Set-DefaultEnv 'AIR_RESTORE_HISTORY' 'true'
Set-DefaultEnv 'AIR_INCLUDE_MANUAL_DEFECTS' 'false'
Set-DefaultEnv 'ADMIN_EMAIL' 'admin@ooltool.com'
Set-DefaultEnv 'ADMIN_PASSWORD' 'Admin@1234!'

$batches = @(
  @{
    Name = '01-auth-session-dashboard'
    Files = @(
      'tests/AuthNegative.spec.ts',
      'tests/AuthUiValidation.spec.ts',
      'tests/SessionSecurity.spec.ts',
      'tests/DashboardHealth.spec.ts',
      'tests/DashboardNavigation.spec.ts'
    )
  },
  @{
    Name = '02-signup-password-accessibility'
    Files = @(
      'tests/SignupNegative.spec.ts',
      'tests/PasswordPolicy.spec.ts',
      'tests/AccessibilityBrowser.spec.ts'
    )
  },
  @{
    Name = '03-profile'
    Files = @(
      'tests/Profile.spec.ts',
      'tests/ProfileNegative.spec.ts',
      'tests/ProfileSecurityDisplay.spec.ts',
      'tests/ProfileMobileValidation.spec.ts',
      'tests/ProfilePasswordMismatch.spec.ts',
      'tests/ProfileWrongCurrentPassword.spec.ts'
    )
  },
  @{
    Name = '04-risk-compliance-onboarding-fields'
    Files = @(
      'tests/RiskComplianceUpdate.spec.ts',
      'tests/OnboardingFieldValidation.spec.ts'
    )
  },
  @{
    Name = '05-plan-reset-overlay'
    Files = @(
      'tests/PlanSelectionValidation.spec.ts',
      'tests/ResetPasswordNegative.spec.ts',
      'tests/OverlayStrategistsTrial.spec.ts'
    )
  },
  @{
    Name = '06-billing'
    Files = @(
      'tests/BillingDeep.spec.ts',
      'tests/BillingEdgeValidation.spec.ts',
      'tests/BillingSubscriptionManagement.spec.ts',
      'tests/Subscriber.spec.ts'
    )
  },
  @{
    Name = '07-onboarding'
    Files = @(
      'tests/onboarding.spec.ts'
    )
  },
  @{
    Name = '08-controlled-gated'
    Files = @(
      'tests/forgotpassword.spec.ts',
      'tests/UnlockAccount.spec.ts',
      'tests/AuthConfigurationLimits.spec.ts',
      'tests/MfaUserFlow.spec.ts',
      'tests/PermissionAccess.spec.ts',
      'tests/DirectSubscriptionPurchase.spec.ts',
      'tests/PaymentNegative.spec.ts'
    )
  },
  @{
    Name = '09-coverage-matrix'
    Files = @(
      'tests/UserJourneyCoverageMatrix.spec.ts',
      'tests/OverlayStrategistsTrialMatrix.spec.ts',
      'tests/NewSubscriptionPurchaseMatrix.spec.ts',
      'tests/UpgradeSubscriptionMatrix.spec.ts',
      'tests/DowngradeSubscriptionMatrix.spec.ts',
      'tests/MonthlyAnnualBillingChangeMatrix.spec.ts',
      'tests/AnnualMonthlyBillingChangeMatrix.spec.ts',
      'tests/SubscriptionCancellationMatrix.spec.ts',
      'tests/FailedPaymentDunningMatrix.spec.ts'
    )
  }
)

$batchDir = Join-Path $PWD 'execution-report\playwright-batches'
New-Item -ItemType Directory -Force -Path $batchDir | Out-Null
Remove-Item -Path (Join-Path $batchDir '*.json') -Force -ErrorAction SilentlyContinue

$failedBatches = @()

Write-Host 'Safe executable automation plan:' -ForegroundColor Cyan
Write-Host "Batches: $($batches.Count)" -ForegroundColor Cyan
$batches | ForEach-Object {
  Write-Host " - $($_.Name): $($_.Files.Count) file(s)" -ForegroundColor Cyan
}
Write-Host 'Playwright prints the test count per batch, not the grand total.' -ForegroundColor Cyan

foreach ($batch in $batches) {
  $name = $batch.Name
  $outputFile = Join-Path $batchDir "$name.json"

  Write-Host "Running batch: $name" -ForegroundColor Green
  Set-Item -Path Env:PLAYWRIGHT_JSON_OUTPUT_NAME -Value $outputFile

  $args = @('test') + $batch.Files + @('--pass-with-no-tests')
  if ($Headed) {
    $args += '--headed'
  }

  & .\node_modules\.bin\playwright.cmd @args
  $exitCode = $LASTEXITCODE

  if ($exitCode -ne 0) {
    $failedBatches += "$name (exit $exitCode)"
    Write-Host "Batch finished with failures: $name" -ForegroundColor Yellow
  }

  if (!(Test-Path $outputFile)) {
    $failedBatches += "$name (missing JSON)"
    Write-Host "Batch did not produce JSON: $name" -ForegroundColor Red
  }
}

Remove-Item -Path Env:PLAYWRIGHT_JSON_OUTPUT_NAME -ErrorAction SilentlyContinue

node scripts\merge-playwright-json-results.js

if (!$SkipAir) {
  node scripts\generate-air-results.js
  node scripts\generate-execution-report.js
}

if ($failedBatches.Count -gt 0) {
  Write-Host 'Completed with failed or incomplete batches:' -ForegroundColor Yellow
  $failedBatches | ForEach-Object { Write-Host " - $_" -ForegroundColor Yellow }
  exit 1
}

Write-Host 'All safe batches completed.' -ForegroundColor Green
