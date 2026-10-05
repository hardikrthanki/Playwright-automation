# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: MonthlyAnnualBillingChangeMatrix.spec.ts >> Monthly To Annual Billing Change Use Case 5 Matrix >> SC-166 - Current monthly plan is clearly identified before annual switch
- Location: tests\MonthlyAnnualBillingChangeMatrix.spec.ts:361:13

# Error details

```
Error: Billing route opened but billing content did not load. Current URL: https://uat.ooltool.com/dashboard/billing. Visible controls: cloudflare.com | Cloudflare | Click to reveal | Cloudflare. Original error: Error: Waiting for billing page content to load

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false

Call Log:
- Timeout 30000ms exceeded while waiting on the predicate
```

# Test source

```ts
  372 | 
  373 | private async visibleControlSummary() {
  374 |   return this.page.locator(
  375 |     'a, button'
  376 |   )
  377 |     .evaluateAll(
  378 |       elements =>
  379 |         elements
  380 |           .map(
  381 |             element =>
  382 |               (
  383 |                 element.textContent ??
  384 |                 element.getAttribute('aria-label') ??
  385 |                 element.getAttribute('href') ??
  386 |                 ''
  387 |               ).trim()
  388 |           )
  389 |           .filter(Boolean)
  390 |           .slice(0, 30)
  391 |     )
  392 |     .catch(
  393 |       () => []
  394 |     );
  395 | }
  396 | 
  397 | private async waitForBillingContent() {
  398 |   await expect
  399 |     .poll(
  400 |       async () =>
  401 |         this.billingContentIsVisible(),
  402 |       {
  403 |         timeout: 30000,
  404 |         message: 'Waiting for billing page content to load',
  405 |       }
  406 |     )
  407 |     .toBe(
  408 |       true
  409 |     );
  410 | 
  411 |   await expect(
  412 |     this.page.getByText(
  413 |       /this page couldn'?t load|reload to try again/i
  414 |     ).first()
  415 |   ).not.toBeVisible({
  416 |     timeout: 3000,
  417 |   });
  418 | }
  419 | 
  420 | async validateOverview() {
  421 | 
  422 | Logger.info(
  423 |   'Validating Billing Overview'
  424 | );
  425 | 
  426 |   await this.dismissMarketingOverlays();
  427 | 
  428 |   await this.ensureOnApp();
  429 | 
  430 |   if (
  431 |     this.page.url().includes(
  432 |       '/billing'
  433 |     )
  434 |   ) {
  435 |     await this.waitForBillingContent();
  436 | 
  437 | Logger.success(
  438 |   'Billing Page Opened'
  439 | );
  440 | 
  441 |     return;
  442 |   }
  443 | 
  444 |   Logger.info(
  445 |     'Opening billing route directly'
  446 |   );
  447 | 
  448 |   await this.page.goto(
  449 |     this.appUrl(
  450 |       URLS.BILLING
  451 |     ),
  452 |     {
  453 |       waitUntil: 'domcontentloaded',
  454 |       timeout: 30000,
  455 |     }
  456 |   );
  457 | 
  458 |   await expect(this.page)
  459 |     .toHaveURL(
  460 |       /billing/,
  461 |       {
  462 |         timeout: 15000,
  463 |       }
  464 |     );
  465 | 
  466 |   try {
  467 |     await this.waitForBillingContent();
  468 |   } catch (error) {
  469 |     const availableControls =
  470 |       await this.visibleControlSummary();
  471 | 
> 472 |     throw new Error(
      |           ^ Error: Billing route opened but billing content did not load. Current URL: https://uat.ooltool.com/dashboard/billing. Visible controls: cloudflare.com | Cloudflare | Click to reveal | Cloudflare. Original error: Error: Waiting for billing page content to load
  473 |       `Billing route opened but billing content did not load. Current URL: ${this.page.url()}. Visible controls: ${availableControls.join(' | ')}. Original error: ${String(error)}`
  474 |     );
  475 |   }
  476 | 
  477 | Logger.success(
  478 |   'Billing Page Opened'
  479 | );
  480 | }
  481 | async validatePlans() {
  482 | 
  483 |  Logger.info(
  484 |   'Validating Plans Tab'
  485 | );
  486 | 
  487 |   await safeClick(
  488 |     this.plansTab,
  489 |     'Open Plans Tab'
  490 |   );
  491 | 
  492 |   await expect(
  493 |     this.page.getByText(
  494 |       /income builder|build your portfolio/i
  495 |     ).first()
  496 |   ).toBeVisible({
  497 |     timeout: 15000
  498 |   });
  499 | 
  500 |   console.log(
  501 |     ' Income Builder Plan Visible'
  502 |   );
  503 | }
  504 | 
  505 | async validatePlanVisible(
  506 |   planName: string
  507 | ) {
  508 | 
  509 |  Logger.info(
  510 |   `Validating ${planName} Plan`
  511 | );
  512 | 
  513 |   await safeClick(
  514 |     this.plansTab,
  515 |     'Open Plans Tab'
  516 |   );
  517 | 
  518 |   await expect(
  519 |     this.page.getByText(
  520 |       new RegExp(
  521 |         planName.replace(
  522 |           /[.*+?^${}()|[\]\\]/g,
  523 |           '\\$&'
  524 |         ),
  525 |         'i'
  526 |       )
  527 |     ).first()
  528 |   ).toBeVisible({
  529 |     timeout: 15000
  530 |   });
  531 | 
  532 |   Logger.success(
  533 |     `${planName} Plan Visible`
  534 |   );
  535 | }
  536 | async validateTransactions() {
  537 | 
  538 |  Logger.info(
  539 |   'Validating Transactions'
  540 | );
  541 | 
  542 |   await safeClick(
  543 |     this.historyTab,
  544 |     'Open History Tab'
  545 |   );
  546 | 
  547 |   await safeClick(
  548 |     this.transactionsTab,
  549 |     'Open Transactions Tab'
  550 |   );
  551 | 
  552 |   const paidStatusBadges =
  553 |     this.page.getByText(
  554 |       /\bpaid\b/i
  555 |     );
  556 | 
  557 |   await expect(
  558 |     paidStatusBadges.first()
  559 |   ).toBeVisible({
  560 |     timeout: 15000
  561 |   });
  562 | 
  563 |   console.log(
  564 |     ' Paid Status Verified'
  565 |   );
  566 | }
  567 | async validateInvoicePage() {
  568 | 
  569 | Logger.info(
  570 |   'Validating Invoice Page'
  571 | );
  572 | 
```