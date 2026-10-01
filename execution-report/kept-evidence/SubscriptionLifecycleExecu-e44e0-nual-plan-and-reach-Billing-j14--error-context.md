# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> Disposable user can purchase configured paid annual plan and reach Billing
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
          - textbox "Email" [ref=e28]: imhardikthanki+sub-lifecycl-muo34j5j@gmail.com
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]: Mobile number
            - generic [ref=e32]:
              - img
              - text: Not verified
          - generic [ref=e33]:
            - generic [ref=e34]: "+1"
            - textbox "2015550123" [ref=e35]: "2015558970"
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
  349 |       () => undefined
  350 |     );
  351 |   }
  352 | 
  353 |   private async clickVerifyWhenReady() {
  354 |     await this.enterRegistrationOtp();
  355 | 
  356 |     if (
  357 |       !await this.verifyOtpButton.isEnabled().catch(
  358 |         () => false
  359 |       )
  360 |     ) {
  361 |       await this.enterRegistrationOtp();
  362 |     }
  363 | 
  364 |     await expect(
  365 |       this.verifyOtpButton
  366 |     ).toBeEnabled({
  367 |       timeout: 20000
  368 |     });
  369 | 
  370 |     await this.dismissMarketingOverlays();
  371 | 
  372 |     try {
  373 |       await this.verifyOtpButton.click({
  374 |         timeout: 8000
  375 |       });
  376 |     } catch {
  377 |       await this.dismissMarketingOverlays();
  378 | 
  379 |       await this.verifyOtpButton.click({
  380 |         force: true,
  381 |         timeout: 8000
  382 |       });
  383 |     }
  384 |   }
  385 | 
  386 |   private async mobileVerificationSettled() {
  387 |     const verifyVisible =
  388 |       await this.verifyOtpButton.isVisible().catch(
  389 |         () => false
  390 |       );
  391 | 
  392 |     if (verifyVisible) {
  393 |       return false;
  394 |     }
  395 | 
  396 |     const verifiedText =
  397 |       await this.page.getByText(
  398 |         /\bverified\b/i
  399 |       ).filter({
  400 |         hasNotText:
  401 |           /\bnot verified\b|\bunverified\b/i
  402 |       }).first().isVisible().catch(
  403 |         () => false
  404 |       );
  405 | 
  406 |     if (verifiedText) {
  407 |       return true;
  408 |     }
  409 | 
  410 |     return !(
  411 |       await this.otpFieldIsVisible()
  412 |     );
  413 |   }
  414 | 
  415 |   private async ensureMobileVerified() {
  416 |     const settled =
  417 |       await expect.poll(
  418 |         async () => this.mobileVerificationSettled(),
  419 |         {
  420 |           timeout: 20000
  421 |         }
  422 |       ).toBeTruthy().then(
  423 |         () => true
  424 |       ).catch(
  425 |         () => false
  426 |       );
  427 | 
  428 |     if (settled) {
  429 |       return;
  430 |     }
  431 | 
  432 |     const verifyStillVisible =
  433 |       await this.verifyOtpButton.isVisible().catch(
  434 |         () => false
  435 |       );
  436 | 
  437 |     if (
  438 |       !verifyStillVisible
  439 |     ) {
  440 |       return;
  441 |     }
  442 | 
  443 |     Logger.info(
  444 |       'Mobile code was not accepted. Verifying once more.'
  445 |     );
  446 | 
  447 |     await this.clickVerifyWhenReady();
  448 | 
> 449 |     await expect.poll(
      |     ^ Error: expect(received).toBeTruthy()
  450 |       async () => this.mobileVerificationSettled(),
  451 |       {
  452 |         timeout: 20000
  453 |       }
  454 |     ).toBeTruthy();
  455 |   }
  456 | 
  457 |   private async otpFieldIsVisible() {
  458 |     return this.visibleOtpInput()
  459 |       .isVisible({
  460 |         timeout: 1000
  461 |       })
  462 |       .catch(
  463 |         () => this.otpInput.isVisible({
  464 |           timeout: 1000
  465 |         }).catch(
  466 |           () => false
  467 |         )
  468 |       );
  469 |   }
  470 | 
  471 |   private async clickSendCode(
  472 |     attempt: number
  473 |   ) {
  474 |     await this.dismissMarketingOverlays();
  475 | 
  476 |     const apiWait =
  477 |       this.page.waitForResponse(
  478 |         (response) => {
  479 |           const method =
  480 |             response.request().method();
  481 | 
  482 |           return method !==
  483 |             'OPTIONS' &&
  484 |             method !==
  485 |             'GET' &&
  486 |             /otp|sms|phone|mobile|verify|code/i.test(
  487 |               response.url()
  488 |             );
  489 |         },
  490 |         {
  491 |           timeout: 12000
  492 |         }
  493 |       ).catch(
  494 |         () => null
  495 |       );
  496 | 
  497 |     if (
  498 |       attempt <= 1
  499 |     ) {
  500 |       await safeClick(
  501 |         this.sendCodeButton,
  502 |         'Send Code via SMS'
  503 |       );
  504 |     } else if (
  505 |       attempt === 2
  506 |     ) {
  507 |       console.log(
  508 |         '[CLICK] Send Code via SMS (force)'
  509 |       );
  510 | 
  511 |       await this.sendCodeButton.click({
  512 |         force: true,
  513 |         timeout: 8000
  514 |       });
  515 |     } else {
  516 |       console.log(
  517 |         '[CLICK] Send Code via SMS (DOM click)'
  518 |       );
  519 | 
  520 |       await this.sendCodeButton.evaluate(
  521 |         (button) => {
  522 |           (button as HTMLButtonElement).click();
  523 |         }
  524 |       );
  525 |     }
  526 | 
  527 |     await apiWait;
  528 |   }
  529 | 
  530 |   private async waitForRegistrationOtpInput() {
  531 |     const manualFallback =
  532 |       this.envEnabled(
  533 |         'REGISTRATION_OTP_MANUAL_FALLBACK'
  534 |       );
  535 | 
  536 |     for (
  537 |       let attempt = 1;
  538 |       attempt <= 4;
  539 |       attempt++
  540 |     ) {
  541 |       await this.visibleOtpInput()
  542 |         .waitFor({
  543 |           state: 'visible',
  544 |           timeout: 15000
  545 |         })
  546 |         .catch(
  547 |           () => undefined
  548 |         );
  549 | 
```