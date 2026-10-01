# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> User A monthly plan ladder then period-end cancel
- Location: tests\SubscriptionLifecycleExecution.spec.ts:163:9

# Error details

```
Error: expect(received).toBeTruthy()

Received: false

Call Log:
- Timeout 20000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - link "OolTool" [ref=e6] [cursor=pointer]:
        - /url: /
        - img "OolTool" [ref=e7]
      - heading "Create Account" [level=1] [ref=e8]
      - paragraph [ref=e9]: Start your OolTool journey
    - generic [ref=e10]:
      - button "Continue with Google" [ref=e11] [cursor=pointer]:
        - img
        - text: Continue with Google
      - button "Continue with Apple" [ref=e12] [cursor=pointer]:
        - img
        - text: Continue with Apple
      - generic [ref=e17]: Or sign up with email & mobile
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e20]:
            - generic [ref=e21]: First name
            - textbox "First name" [ref=e22]: Hardik
          - generic [ref=e23]:
            - generic [ref=e24]: Last name
            - textbox "Last name" [ref=e25]: Thanki
        - generic [ref=e26]:
          - generic [ref=e27]: Email
          - textbox "Email" [ref=e28]: imhardikthanki+sub-lifecycl-mup7e0zl@gmail.com
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]: Mobile number
            - generic [ref=e32]:
              - img
              - text: Not verified
          - generic [ref=e33]:
            - generic [ref=e34]: "+1"
            - textbox "2015550123" [ref=e35]: "2015556776"
          - paragraph [ref=e36]: US mobile numbers only. We’ll text you a one-time code.
          - generic [ref=e37]:
            - textbox "Enter OTP" [ref=e38]: "111111"
            - generic [ref=e39]:
              - button "Verify" [ref=e40] [cursor=pointer]
              - button "21s" [disabled]
        - generic [ref=e41]:
          - generic [ref=e42]: Password
          - generic [ref=e43]:
            - textbox [ref=e44]
            - button "Show" [ref=e45]:
              - img [ref=e46]
        - generic [ref=e49]:
          - generic [ref=e50]: Confirm password
          - generic [ref=e51]:
            - textbox [ref=e52]
            - button "Show" [ref=e53]:
              - img [ref=e54]
        - button "Create Account" [disabled]
      - paragraph [ref=e57]:
        - text: Already have an account?
        - link "Sign in" [ref=e58] [cursor=pointer]:
          - /url: /login
  - region "Notifications alt+T"
  - alert [ref=e59]
```

# Test source

```ts
  355 |       await this.mobileVerifiedBadgeVisible()
  356 |     ) {
  357 |       return;
  358 |     }
  359 | 
  360 |     await this.enterRegistrationOtp();
  361 | 
  362 |     if (
  363 |       !await this.verifyOtpButton.isEnabled().catch(
  364 |         () => false
  365 |       )
  366 |     ) {
  367 |       await this.enterRegistrationOtp();
  368 |     }
  369 | 
  370 |     await expect(
  371 |       this.verifyOtpButton
  372 |     ).toBeEnabled({
  373 |       timeout: 20000
  374 |     });
  375 | 
  376 |     await this.dismissMarketingOverlays();
  377 | 
  378 |     try {
  379 |       await this.verifyOtpButton.click({
  380 |         timeout: 8000
  381 |       });
  382 |     } catch {
  383 |       await this.dismissMarketingOverlays();
  384 | 
  385 |       await this.verifyOtpButton.click({
  386 |         force: true,
  387 |         timeout: 8000
  388 |       });
  389 |     }
  390 |   }
  391 | 
  392 |   private async mobileVerifiedBadgeVisible() {
  393 |     return this.page.getByText(
  394 |       /^verified$|mobile number verified/i
  395 |     ).first().isVisible().catch(
  396 |       () => false
  397 |     );
  398 |   }
  399 | 
  400 |   private async mobileVerificationSettled() {
  401 |     if (
  402 |       await this.mobileVerifiedBadgeVisible()
  403 |     ) {
  404 |       return true;
  405 |     }
  406 | 
  407 |     const verifyVisible =
  408 |       await this.verifyOtpButton.isVisible().catch(
  409 |         () => false
  410 |       );
  411 | 
  412 |     if (verifyVisible) {
  413 |       return false;
  414 |     }
  415 | 
  416 |     return !(
  417 |       await this.otpFieldIsVisible()
  418 |     );
  419 |   }
  420 | 
  421 |   private async ensureMobileVerified() {
  422 |     const settled =
  423 |       await expect.poll(
  424 |         async () => this.mobileVerificationSettled(),
  425 |         {
  426 |           timeout: 20000
  427 |         }
  428 |       ).toBeTruthy().then(
  429 |         () => true
  430 |       ).catch(
  431 |         () => false
  432 |       );
  433 | 
  434 |     if (settled) {
  435 |       return;
  436 |     }
  437 | 
  438 |     const verifyStillVisible =
  439 |       await this.verifyOtpButton.isVisible().catch(
  440 |         () => false
  441 |       );
  442 | 
  443 |     if (
  444 |       !verifyStillVisible
  445 |     ) {
  446 |       return;
  447 |     }
  448 | 
  449 |     Logger.info(
  450 |       'Mobile code was not accepted. Verifying once more.'
  451 |     );
  452 | 
  453 |     await this.clickVerifyWhenReady();
  454 | 
> 455 |     await expect.poll(
      |     ^ Error: expect(received).toBeTruthy()
  456 |       async () => this.mobileVerificationSettled(),
  457 |       {
  458 |         timeout: 20000
  459 |       }
  460 |     ).toBeTruthy();
  461 |   }
  462 | 
  463 |   private async otpFieldIsVisible() {
  464 |     return this.visibleOtpInput()
  465 |       .isVisible({
  466 |         timeout: 1000
  467 |       })
  468 |       .catch(
  469 |         () => this.otpInput.isVisible({
  470 |           timeout: 1000
  471 |         }).catch(
  472 |           () => false
  473 |         )
  474 |       );
  475 |   }
  476 | 
  477 |   private async clickSendCode(
  478 |     attempt: number
  479 |   ) {
  480 |     await this.dismissMarketingOverlays();
  481 | 
  482 |     const apiWait =
  483 |       this.page.waitForResponse(
  484 |         (response) => {
  485 |           const method =
  486 |             response.request().method();
  487 | 
  488 |           return method !==
  489 |             'OPTIONS' &&
  490 |             method !==
  491 |             'GET' &&
  492 |             /otp|sms|phone|mobile|verify|code/i.test(
  493 |               response.url()
  494 |             );
  495 |         },
  496 |         {
  497 |           timeout: 12000
  498 |         }
  499 |       ).catch(
  500 |         () => null
  501 |       );
  502 | 
  503 |     if (
  504 |       attempt <= 1
  505 |     ) {
  506 |       await safeClick(
  507 |         this.sendCodeButton,
  508 |         'Send Code via SMS'
  509 |       );
  510 |     } else if (
  511 |       attempt === 2
  512 |     ) {
  513 |       console.log(
  514 |         '[CLICK] Send Code via SMS (force)'
  515 |       );
  516 | 
  517 |       await this.sendCodeButton.click({
  518 |         force: true,
  519 |         timeout: 8000
  520 |       });
  521 |     } else {
  522 |       console.log(
  523 |         '[CLICK] Send Code via SMS (DOM click)'
  524 |       );
  525 | 
  526 |       await this.sendCodeButton.evaluate(
  527 |         (button) => {
  528 |           (button as HTMLButtonElement).click();
  529 |         }
  530 |       );
  531 |     }
  532 | 
  533 |     await apiWait;
  534 |   }
  535 | 
  536 |   private async waitForRegistrationOtpInput() {
  537 |     const manualFallback =
  538 |       this.envEnabled(
  539 |         'REGISTRATION_OTP_MANUAL_FALLBACK'
  540 |       );
  541 | 
  542 |     for (
  543 |       let attempt = 1;
  544 |       attempt <= 4;
  545 |       attempt++
  546 |     ) {
  547 |       await this.visibleOtpInput()
  548 |         .waitFor({
  549 |           state: 'visible',
  550 |           timeout: 15000
  551 |         })
  552 |         .catch(
  553 |           () => undefined
  554 |         );
  555 | 
```