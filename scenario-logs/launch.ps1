$env:PLAYWRIGHT_BROWSERS_PATH = "$env:LOCALAPPDATA\ms-playwright"
$env:SKIP_AIR_REPORT = 'true'
$root = 'C:\Users\BAPS\Documents\Oools_paywright'
Set-Location $root

$runs = @(
  @('purchase',   'NewSubscriptionPurchaseMatrix.spec.ts',      'SC-65 |SC-73 |SC-75B |SC-75H '),
  @('upgrade',    'UpgradeSubscriptionMatrix.spec.ts',          'SC-89 |SC-90 |SC-92 |SC-93 |SC-95 |SC-100 |SC-103 |SC-104 '),
  @('up-annual',  'UpgradeSubscriptionMatrix.spec.ts',          'SC-101 '),
  @('up-m2a',     'UpgradeSubscriptionMatrix.spec.ts',          'SC-102 '),
  @('up-dbl',     'UpgradeSubscriptionMatrix.spec.ts',          'SC-105 '),
  @('downgrade',  'DowngradeSubscriptionMatrix.spec.ts',        'SC-121 |SC-122 |SC-125 |SC-126 |SC-127 |SC-129 |SC-141 |SC-142 |SC-143 |SC-145 |SC-152 |SC-153 '),
  @('dn-dbl',     'DowngradeSubscriptionMatrix.spec.ts',        'SC-147 '),
  @('m2a',        'MonthlyAnnualBillingChangeMatrix.spec.ts',   'SC-177 |SC-179 |SC-180 |SC-182 |SC-186 |SC-191 |SC-192 '),
  @('a2m-dbl',    'AnnualMonthlyBillingChangeMatrix.spec.ts',   'SC-222 '),
  @('cancel',     'SubscriptionCancellationMatrix.spec.ts',     'SC-252 |SC-253 |SC-255 |SC-257 |SC-259 |SC-262 |SC-269 |SC-300 '),
  @('cx-dbl',     'SubscriptionCancellationMatrix.spec.ts',     'SC-273 |SC-296 ')
)

foreach ($r in $runs) {
  $name = $r[0]
  $env:PLAYWRIGHT_JSON_OUTPUT_NAME = "scenario-logs/$name.json"
  $cmd = "npx playwright test tests/$($r[1]) -g `"$($r[2])`" --workers=1 --reporter=list --output=scenario-logs/out-$name > scenario-logs/$name.log 2>&1"
  Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', $cmd -WindowStyle Hidden -WorkingDirectory $root
  Start-Sleep -Seconds 6
}
'launched'
