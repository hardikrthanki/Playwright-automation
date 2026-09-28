# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleE2EMatrix.spec.ts >> Subscription Lifecycle E2E Matrix >> LC-017 - Stripe checkout shows subscriber email, selected plan, billing interval, and card fields
- Location: tests\SubscriptionLifecycleE2EMatrix.spec.ts:506:13

# Error details

```
Error: Registration OTP input did not appear after requesting SMS code. Visible diagnostics: mobile="2015556695", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
```

# Test source

```ts
  350 |         force: true,
  351 |         timeout: 8000
  352 |       });
  353 |     } else {
  354 |       console.log(
  355 |         '[CLICK] Send Code via SMS (DOM click)'
  356 |       );
  357 | 
  358 |       await this.sendCodeButton.evaluate(
  359 |         (button) => {
  360 |           (button as HTMLButtonElement).click();
  361 |         }
  362 |       );
  363 |     }
  364 | 
  365 |     await apiWait;
  366 |   }
  367 | 
  368 |   private async fillRegistrationOtp() {
  369 |     const otpCode =
  370 |       AUTH_SETTINGS.otpCode ||
  371 |       '111111';
  372 | 
  373 |     Logger.info(
  374 |       `Entering OTP ${otpCode}`
  375 |     );
  376 | 
  377 |     const visibleOtp =
  378 |       this.visibleOtpInput();
  379 | 
  380 |     if (
  381 |       await visibleOtp.isVisible({
  382 |         timeout: 3000
  383 |       }).catch(
  384 |         () => false
  385 |       )
  386 |     ) {
  387 |       await visibleOtp.fill(
  388 |         otpCode
  389 |       );
  390 |       return;
  391 |     }
  392 | 
  393 |     await this.otpInput.fill(
  394 |       otpCode
  395 |     );
  396 |   }
  397 | 
  398 |   private async waitForRegistrationOtpInput() {
  399 |     const manualFallback =
  400 |       this.envEnabled(
  401 |         'REGISTRATION_OTP_MANUAL_FALLBACK'
  402 |       );
  403 | 
  404 |     for (
  405 |       let attempt = 1;
  406 |       attempt <= 4;
  407 |       attempt++
  408 |     ) {
  409 |       await this.visibleOtpInput()
  410 |         .waitFor({
  411 |           state: 'visible',
  412 |           timeout: 15000
  413 |         })
  414 |         .catch(
  415 |           () => undefined
  416 |         );
  417 | 
  418 |       if (
  419 |         await this.otpFieldIsVisible()
  420 |       ) {
  421 |         return;
  422 |       }
  423 | 
  424 |       const diagnostics =
  425 |         await this.collectOtpRequestDiagnostics();
  426 | 
  427 |       Logger.info(
  428 |         `OTP input not visible after SMS request. Attempt ${attempt}/4. Visible diagnostics: ${diagnostics}`
  429 |       );
  430 | 
  431 |       if (
  432 |         attempt === 4
  433 |       ) {
  434 |         if (manualFallback) {
  435 |           Logger.info(
  436 |             'Manual OTP fallback enabled. Complete the OTP request manually, then resume Playwright.'
  437 |           );
  438 | 
  439 |           await this.page.pause();
  440 | 
  441 |           await expect(
  442 |             this.visibleOtpInput()
  443 |           ).toBeVisible({
  444 |             timeout: 30000
  445 |           });
  446 | 
  447 |           return;
  448 |         }
  449 | 
> 450 |         throw new Error(
      |               ^ Error: Registration OTP input did not appear after requesting SMS code. Visible diagnostics: mobile="2015556695", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
  451 |           `Registration OTP input did not appear after requesting SMS code. Visible diagnostics: ${diagnostics}`
  452 |         );
  453 |       }
  454 | 
  455 |       await this.waitForSendCodeEnabled();
  456 | 
  457 |       await this.clickSendCode(
  458 |         attempt + 1
  459 |       );
  460 |     }
  461 |   }
  462 | 
  463 | 
  464 | 
  465 |   private async fillMobileNumber(
  466 |     mobileNumber: string
  467 |   ) {
  468 |     await this.mobileInput.fill(
  469 |       ''
  470 |     );
  471 | 
  472 |     await this.mobileInput.click();
  473 | 
  474 |     await this.mobileInput.fill(
  475 |       mobileNumber
  476 |     );
  477 | 
  478 |     await this.mobileInput.blur();
  479 |   }
  480 | 
  481 | 
  482 | 
  483 |   private async fillPasswordFields() {
  484 |     await this.passwordInput.fill(
  485 |       TEST_USERS.onboarding.password
  486 |     );
  487 | 
  488 |     await this.passwordInput.blur();
  489 | 
  490 |     await this.confirmPasswordInput.fill(
  491 |       TEST_USERS.onboarding.password
  492 |     );
  493 | 
  494 |     await this.confirmPasswordInput.blur();
  495 |   }
  496 | 
  497 |   private async acceptVisibleRegistrationConsents() {
  498 |     const boxes =
  499 |       this.page.locator(
  500 |         'input[type="checkbox"], [role="checkbox"]'
  501 |       );
  502 | 
  503 |     const count =
  504 |       await boxes.count();
  505 | 
  506 |     for (
  507 |       let index = 0;
  508 |       index < count;
  509 |       index++
  510 |     ) {
  511 |       const box =
  512 |         boxes.nth(
  513 |           index
  514 |         );
  515 | 
  516 |       if (
  517 |         !await box.isVisible().catch(
  518 |           () => false
  519 |         )
  520 |       ) {
  521 |         continue;
  522 |       }
  523 | 
  524 |       const checked =
  525 |         await box.isChecked().catch(
  526 |           async () =>
  527 |             (
  528 |               await box.getAttribute(
  529 |                 'aria-checked'
  530 |               )
  531 |             ) === 'true'
  532 |         );
  533 | 
  534 |       if (
  535 |         !checked
  536 |       ) {
  537 |         await box.click({
  538 |           force: true
  539 |         });
  540 |       }
  541 |     }
  542 |   }
  543 | 
  544 |   private async waitForPasswordFieldsReady() {
  545 |     await expect(
  546 |       this.passwordInput
  547 |     ).toBeEditable({
  548 |       timeout: 5000
  549 |     });
  550 | 
```