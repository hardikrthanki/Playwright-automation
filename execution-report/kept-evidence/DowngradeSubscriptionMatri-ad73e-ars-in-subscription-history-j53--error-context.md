# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DowngradeSubscriptionMatrix.spec.ts >> Downgrade Subscription Use Case 4 Matrix >> SC-142 - Scheduled downgrade appears in subscription history
- Location: tests\DowngradeSubscriptionMatrix.spec.ts:481:13

# Error details

```
Error: Subscription history should list the scheduled downgrade.

expect(locator).toContainText(expected) failed

Locator: locator('main')
Expected pattern: /downgrad|plan change|scheduled/i
Received string:  "Billing & SubscriptionManage your plan, payment methods, and billing history.OverviewPlansHistoryBilling HistorySubscription changes and Stripe invoice transactions.Subscription HistoryTransactionsSyncSubscribed to Overlay StrategistsMonthlyon Oct 7, 2026, 2:23 PMrenews Nov 7, 2026, 2:23 PMNew subscription · USD 7.90Danger ZoneCancelling will end your paid plan at the end of the current billing period. You'll retain access to paid features until then.Cancel Subscription"
Timeout: 15000ms

Call log:
  - Subscription history should list the scheduled downgrade. with timeout 15000ms
  - waiting for locator('main')
    18 × locator resolved to <main class="container flex-1 px-4 py-8">…</main>
       - unexpected value "Billing & SubscriptionManage your plan, payment methods, and billing history.OverviewPlansHistoryBilling HistorySubscription changes and Stripe invoice transactions.Subscription HistoryTransactionsSyncSubscribed to Overlay StrategistsMonthlyon Oct 7, 2026, 2:23 PMrenews Nov 7, 2026, 2:23 PMNew subscription · USD 7.90Danger ZoneCancelling will end your paid plan at the end of the current billing period. You'll retain access to paid features until then.Cancel Subscription"

```

# Test source

```ts
  1290 |         }
  1291 |     }
  1292 |   },
  1293 | 
  1294 |   DOWNGRADE_OVERLAY_TO_INCOME_MONTHLY: {
  1295 |     setup: async (ctx) => {
  1296 |       await buyPlan(
  1297 |         ctx,
  1298 |         'Overlay Strategists',
  1299 |         'monthly'
  1300 |       );
  1301 |     },
  1302 |     steps: {
  1303 |       'impact-warning':
  1304 |         async (ctx) => {
  1305 |           const text =
  1306 |             await readDowngradeDialog(
  1307 |               ctx,
  1308 |               'Income Builder'
  1309 |             );
  1310 | 
  1311 |           expect(
  1312 |             text,
  1313 |             'Downgrade confirmation should warn about features that will be lost or restricted.'
  1314 |           ).toMatch(
  1315 |             /feature|lose|restrict|reduced|no longer/i
  1316 |           );
  1317 |         },
  1318 | 
  1319 |       'account-limits-shown':
  1320 |         async (ctx) => {
  1321 |           const text =
  1322 |             await readDowngradeDialog(
  1323 |               ctx,
  1324 |               'Income Builder'
  1325 |             );
  1326 | 
  1327 |           expect(
  1328 |             text,
  1329 |             'Downgrade confirmation should show the limits of the lower plan (brokers, accounts, positions).'
  1330 |           ).toMatch(
  1331 |             /limit|up to|\d+\s*(broker|account|position)|broker|position/i
  1332 |           );
  1333 |         },
  1334 | 
  1335 |       'schedule-at-renewal':
  1336 |         async (ctx) => {
  1337 |           await ctx.billing.validateOverview();
  1338 | 
  1339 |           await ctx.billing.declineRetentionAndPreviewOrScheduleDowngrade({
  1340 |             currentPlan:
  1341 |               'Overlay Strategists',
  1342 |             targetPlan:
  1343 |               'Income Builder',
  1344 |             schedule: true
  1345 |           });
  1346 |         },
  1347 | 
  1348 |       'access-kept-until-effective-date':
  1349 |         async (ctx) => {
  1350 |           await stepActivePlan(
  1351 |             ctx,
  1352 |             'Overlay Strategists'
  1353 |           );
  1354 | 
  1355 |           await openPlansTab(ctx);
  1356 | 
  1357 |           await expect(
  1358 |             ctx.page.locator('main')
  1359 |           ).not.toContainText(
  1360 |             /downgrade (is )?complete|you are now on income builder/i
  1361 |           );
  1362 |         },
  1363 | 
  1364 |       'scheduled-downgrade-in-overview':
  1365 |         async (ctx) => {
  1366 |           await ctx.billing.validateOverview();
  1367 | 
  1368 |           const text =
  1369 |             await mainText(ctx);
  1370 | 
  1371 |           expect(
  1372 |             text,
  1373 |             'Billing overview should show "Downgrade to Income scheduled" with its effective date.'
  1374 |           ).toMatch(
  1375 |             /downgrade to income[\s\S]{0,40}scheduled[\s\S]{0,80}takes effect/i
  1376 |           );
  1377 |         },
  1378 | 
  1379 |       'scheduled-downgrade-in-history':
  1380 |         async (ctx) => {
  1381 |           await ctx.billing.validateOverview();
  1382 | 
  1383 |           await clickTab(
  1384 |             ctx.billing.historyTab
  1385 |           );
  1386 | 
  1387 |           await expect(
  1388 |             ctx.page.locator('main'),
  1389 |             'Subscription history should list the scheduled downgrade.'
> 1390 |           ).toContainText(
       |             ^ Error: Subscription history should list the scheduled downgrade.
  1391 |             /downgrad|plan change|scheduled/i,
  1392 |             {
  1393 |               timeout: 15000
  1394 |             }
  1395 |           );
  1396 |         },
  1397 | 
  1398 |       'confirmation-email':
  1399 |         async (ctx) => {
  1400 |           await waitForEmail(
  1401 |             ctx,
  1402 |             'downgrade confirmation',
  1403 |             (mail) =>
  1404 |               subjectMatches(
  1405 |                 mail,
  1406 |                 /downgrad|plan change|plan (has )?(changed|updated)|subscription (updated|changed)|scheduled/i
  1407 |               )
  1408 |           );
  1409 |         },
  1410 | 
  1411 |       'saved-card-preserved':
  1412 |         stepSavedCardPreserved,
  1413 | 
  1414 |       'single-active-plan':
  1415 |         stepExactlyOneCurrentPlan,
  1416 | 
  1417 |       'user-data-preserved':
  1418 |         stepUserDataPreserved,
  1419 | 
  1420 |       'cancel-scheduled-downgrade':
  1421 |         async (ctx) => {
  1422 |           const control =
  1423 |             await findCancelScheduledControl(
  1424 |               ctx,
  1425 |               /cancel (the )?(scheduled )?(downgrade|change)|keep (my )?(current )?plan|undo (the )?(downgrade|change)|don'?t downgrade|stay on overlay/i
  1426 |             );
  1427 | 
  1428 |           await control.click();
  1429 | 
  1430 |           const confirm =
  1431 |             ctx.page
  1432 |               .getByRole('dialog')
  1433 |               .getByRole('button', {
  1434 |                 name: /^(yes|confirm|keep|cancel downgrade)/i
  1435 |               })
  1436 |               .first();
  1437 | 
  1438 |           if (
  1439 |             await confirm
  1440 |               .isVisible({
  1441 |                 timeout: 3000
  1442 |               })
  1443 |               .catch(() => false)
  1444 |           ) {
  1445 |             await confirm.click();
  1446 |           }
  1447 | 
  1448 |           await stepActivePlan(
  1449 |             ctx,
  1450 |             'Overlay Strategists'
  1451 |           );
  1452 |         }
  1453 |     }
  1454 |   },
  1455 | 
  1456 |   DOWNGRADE_DOUBLE_CLICK_OVERLAY_TO_INCOME: {
  1457 |     setup: async (ctx) => {
  1458 |       await buyPlan(
  1459 |         ctx,
  1460 |         'Overlay Strategists',
  1461 |         'monthly'
  1462 |       );
  1463 | 
  1464 |       startRequestRecorder(ctx);
  1465 | 
  1466 |       await ctx.billing.validateOverview();
  1467 | 
  1468 |       await ctx.billing.openMonthlyDowngradeOrRetention({
  1469 |         targetPlan:
  1470 |           'Income Builder'
  1471 |       });
  1472 | 
  1473 |       const decline =
  1474 |         ctx.page
  1475 |           .getByRole('dialog')
  1476 |           .getByRole('button', {
  1477 |             name: /decline|no,? thanks|continue|downgrade anyway|skip|not now/i
  1478 |           })
  1479 |           .first();
  1480 | 
  1481 |       if (
  1482 |         await decline
  1483 |           .isVisible({ timeout: 3000 })
  1484 |           .catch(() => false)
  1485 |       ) {
  1486 |         await decline.click();
  1487 |       }
  1488 | 
  1489 |       await confirmWithDoubleClick(
  1490 |         ctx
```