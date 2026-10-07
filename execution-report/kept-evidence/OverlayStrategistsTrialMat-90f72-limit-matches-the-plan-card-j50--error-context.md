# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: OverlayStrategistsTrialMatrix.spec.ts >> Overlay Strategists Trial FRD Matrix >> SC-04 - No-card trial linked-account limit matches the plan card
- Location: tests\OverlayStrategistsTrialMatrix.spec.ts:452:13

# Error details

```
Error: A mobile number that already verified an account should be refused.

expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1260 |         }
  1261 |       )
  1262 |       .toBeTruthy();
  1263 | 
  1264 | 
  1265 | 
  1266 |     Logger.success(
  1267 |       'Registration successful. Verification email sent.'
  1268 |     );
  1269 | 
  1270 | 
  1271 |   }
  1272 | 
  1273 |   async expectDuplicateEmailBlocked(
  1274 |     email: string,
  1275 |     mobileNumber: string
  1276 |   ) {
  1277 |     Logger.info(
  1278 |       `Checking ${email} cannot create another account`
  1279 |     );
  1280 | 
  1281 |     await this.open();
  1282 |     await this.register(
  1283 |       email,
  1284 |       mobileNumber
  1285 |     ).catch(
  1286 |       () => undefined
  1287 |     );
  1288 | 
  1289 |     await expect(
  1290 |       this.page.getByText(
  1291 |         /email.*already|already.*email|already registered|account already exists|email.*exists/i
  1292 |       ).first()
  1293 |     ).toBeVisible({
  1294 |       timeout: 20000
  1295 |     });
  1296 | 
  1297 |     await expect(
  1298 |       this.page
  1299 |     ).toHaveURL(
  1300 |       /register/i
  1301 |     );
  1302 | 
  1303 |     Logger.success(
  1304 |       'Same email cannot create another account'
  1305 |     );
  1306 |   }
  1307 | 
  1308 |   async expectDuplicateMobileBlocked(
  1309 |     email: string,
  1310 |     mobileNumber: string
  1311 |   ) {
  1312 |     Logger.info(
  1313 |       `Checking ${mobileNumber} cannot verify another account`
  1314 |     );
  1315 | 
  1316 |     await this.open();
  1317 | 
  1318 |     await this.firstNameInput.fill(
  1319 |       TEST_USERS.onboarding.firstName
  1320 |     );
  1321 | 
  1322 |     await this.lastNameInput.fill(
  1323 |       TEST_USERS.onboarding.lastName
  1324 |     );
  1325 | 
  1326 |     await this.emailInput.fill(
  1327 |       email
  1328 |     );
  1329 | 
  1330 |     await this.fillMobileNumber(
  1331 |       mobileNumber
  1332 |     );
  1333 | 
  1334 |     await this.waitForSendCodeEnabled();
  1335 |     await this.clickSendCode(1);
  1336 | 
  1337 |     const rejectedOnSend =
  1338 |       this.lastSendOtpStatus === 409 ||
  1339 |       /already registered/i.test(
  1340 |         this.lastSendOtpBody
  1341 |       );
  1342 | 
  1343 |     if (!rejectedOnSend) {
  1344 |       await this.waitForRegistrationOtpInput();
  1345 |       await this.clickVerifyWhenReady();
  1346 |     }
  1347 | 
  1348 |     const rejected =
  1349 |       rejectedOnSend ||
  1350 |       this.mobileNumberTaken ||
  1351 |       await this.page.getByText(
  1352 |         /already registered/i
  1353 |       ).first().isVisible().catch(
  1354 |         () => false
  1355 |       );
  1356 | 
  1357 |     expect(
  1358 |       rejected,
  1359 |       'A mobile number that already verified an account should be refused.'
> 1360 |     ).toBeTruthy();
       |       ^ Error: A mobile number that already verified an account should be refused.
  1361 | 
  1362 |     await expect(
  1363 |       this.submitButton
  1364 |     ).toBeDisabled();
  1365 | 
  1366 |     Logger.success(
  1367 |       'Same mobile number cannot create another account'
  1368 |     );
  1369 |   }
  1370 | 
  1371 |   private async registrationLooksAccepted() {
  1372 |     const url =
  1373 |       this.page.url();
  1374 | 
  1375 |     if (
  1376 |       /verify-email-sent|\/(verify|onboarding|dashboard|plan|risk|compliance|check-email|confirm)/i.test(
  1377 |         url
  1378 |       )
  1379 |     ) {
  1380 |       return true;
  1381 |     }
  1382 | 
  1383 |     const firstNameVisible =
  1384 |       await this.firstNameInput.isVisible().catch(
  1385 |         () => false
  1386 |       );
  1387 | 
  1388 |     const bodyText =
  1389 |       await this.page
  1390 |         .locator(
  1391 |           'body'
  1392 |         )
  1393 |         .innerText()
  1394 |         .catch(
  1395 |           () => ''
  1396 |         );
  1397 | 
  1398 |     if (
  1399 |       !firstNameVisible &&
  1400 |       /check your email|verification link was sent|verify-email/i.test(
  1401 |         bodyText
  1402 |       )
  1403 |     ) {
  1404 |       return true;
  1405 |     }
  1406 | 
  1407 |     return /check your email|a verification link was sent|verification (sent|email|link)|verify your email|confirm your email/i.test(
  1408 |       bodyText
  1409 |     );
  1410 |   }
  1411 | 
  1412 |   private async waitForRegistrationAccepted(
  1413 |     timeoutMs: number
  1414 |   ) {
  1415 |     const started =
  1416 |       Date.now();
  1417 | 
  1418 |     while (
  1419 |       Date.now() -
  1420 |         started <
  1421 |       timeoutMs
  1422 |     ) {
  1423 |       if (
  1424 |         await this.registrationLooksAccepted()
  1425 |       ) {
  1426 |         return true;
  1427 |       }
  1428 | 
  1429 |       await this.page.waitForTimeout(
  1430 |         500
  1431 |       );
  1432 |     }
  1433 | 
  1434 |     return false;
  1435 |   }
  1436 | 
  1437 | 
  1438 | }
  1439 | 
```