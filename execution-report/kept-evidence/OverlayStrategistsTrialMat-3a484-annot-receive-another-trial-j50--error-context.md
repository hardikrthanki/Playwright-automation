# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: OverlayStrategistsTrialMatrix.spec.ts >> Overlay Strategists Trial FRD Matrix >> SC-11 - Same email cannot receive another trial
- Location: tests\OverlayStrategistsTrialMatrix.spec.ts:464:13

# Error details

```
Error: A mobile number that already verified an account should be refused.

expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1258 |         }
  1259 |       )
  1260 |       .toBeTruthy();
  1261 | 
  1262 | 
  1263 | 
  1264 |     Logger.success(
  1265 |       'Registration successful. Verification email sent.'
  1266 |     );
  1267 | 
  1268 | 
  1269 |   }
  1270 | 
  1271 |   async expectDuplicateEmailBlocked(
  1272 |     email: string,
  1273 |     mobileNumber: string
  1274 |   ) {
  1275 |     Logger.info(
  1276 |       `Checking ${email} cannot create another account`
  1277 |     );
  1278 | 
  1279 |     await this.open();
  1280 |     await this.register(
  1281 |       email,
  1282 |       mobileNumber
  1283 |     ).catch(
  1284 |       () => undefined
  1285 |     );
  1286 | 
  1287 |     await expect(
  1288 |       this.page.getByText(
  1289 |         /email.*already|already.*email|already registered|account already exists|email.*exists/i
  1290 |       ).first()
  1291 |     ).toBeVisible({
  1292 |       timeout: 20000
  1293 |     });
  1294 | 
  1295 |     await expect(
  1296 |       this.page
  1297 |     ).toHaveURL(
  1298 |       /register/i
  1299 |     );
  1300 | 
  1301 |     Logger.success(
  1302 |       'Same email cannot create another account'
  1303 |     );
  1304 |   }
  1305 | 
  1306 |   async expectDuplicateMobileBlocked(
  1307 |     email: string,
  1308 |     mobileNumber: string
  1309 |   ) {
  1310 |     Logger.info(
  1311 |       `Checking ${mobileNumber} cannot verify another account`
  1312 |     );
  1313 | 
  1314 |     await this.open();
  1315 | 
  1316 |     await this.firstNameInput.fill(
  1317 |       TEST_USERS.onboarding.firstName
  1318 |     );
  1319 | 
  1320 |     await this.lastNameInput.fill(
  1321 |       TEST_USERS.onboarding.lastName
  1322 |     );
  1323 | 
  1324 |     await this.emailInput.fill(
  1325 |       email
  1326 |     );
  1327 | 
  1328 |     await this.fillMobileNumber(
  1329 |       mobileNumber
  1330 |     );
  1331 | 
  1332 |     await this.waitForSendCodeEnabled();
  1333 |     await this.clickSendCode(1);
  1334 | 
  1335 |     const rejectedOnSend =
  1336 |       this.lastSendOtpStatus === 409 ||
  1337 |       /already registered/i.test(
  1338 |         this.lastSendOtpBody
  1339 |       );
  1340 | 
  1341 |     if (!rejectedOnSend) {
  1342 |       await this.waitForRegistrationOtpInput();
  1343 |       await this.clickVerifyWhenReady();
  1344 |     }
  1345 | 
  1346 |     const rejected =
  1347 |       rejectedOnSend ||
  1348 |       this.mobileNumberTaken ||
  1349 |       await this.page.getByText(
  1350 |         /already registered/i
  1351 |       ).first().isVisible().catch(
  1352 |         () => false
  1353 |       );
  1354 | 
  1355 |     expect(
  1356 |       rejected,
  1357 |       'A mobile number that already verified an account should be refused.'
> 1358 |     ).toBeTruthy();
       |       ^ Error: A mobile number that already verified an account should be refused.
  1359 | 
  1360 |     await expect(
  1361 |       this.submitButton
  1362 |     ).toBeDisabled();
  1363 | 
  1364 |     Logger.success(
  1365 |       'Same mobile number cannot create another account'
  1366 |     );
  1367 |   }
  1368 | 
  1369 |   private async registrationLooksAccepted() {
  1370 |     const url =
  1371 |       this.page.url();
  1372 | 
  1373 |     if (
  1374 |       /verify-email-sent|\/(verify|onboarding|dashboard|plan|risk|compliance|check-email|confirm)/i.test(
  1375 |         url
  1376 |       )
  1377 |     ) {
  1378 |       return true;
  1379 |     }
  1380 | 
  1381 |     const firstNameVisible =
  1382 |       await this.firstNameInput.isVisible().catch(
  1383 |         () => false
  1384 |       );
  1385 | 
  1386 |     const bodyText =
  1387 |       await this.page
  1388 |         .locator(
  1389 |           'body'
  1390 |         )
  1391 |         .innerText()
  1392 |         .catch(
  1393 |           () => ''
  1394 |         );
  1395 | 
  1396 |     if (
  1397 |       !firstNameVisible &&
  1398 |       /check your email|verification link was sent|verify-email/i.test(
  1399 |         bodyText
  1400 |       )
  1401 |     ) {
  1402 |       return true;
  1403 |     }
  1404 | 
  1405 |     return /check your email|a verification link was sent|verification (sent|email|link)|verify your email|confirm your email/i.test(
  1406 |       bodyText
  1407 |     );
  1408 |   }
  1409 | 
  1410 |   private async waitForRegistrationAccepted(
  1411 |     timeoutMs: number
  1412 |   ) {
  1413 |     const started =
  1414 |       Date.now();
  1415 | 
  1416 |     while (
  1417 |       Date.now() -
  1418 |         started <
  1419 |       timeoutMs
  1420 |     ) {
  1421 |       if (
  1422 |         await this.registrationLooksAccepted()
  1423 |       ) {
  1424 |         return true;
  1425 |       }
  1426 | 
  1427 |       await this.page.waitForTimeout(
  1428 |         500
  1429 |       );
  1430 |     }
  1431 | 
  1432 |     return false;
  1433 |   }
  1434 | 
  1435 | 
  1436 | }
  1437 | 
```