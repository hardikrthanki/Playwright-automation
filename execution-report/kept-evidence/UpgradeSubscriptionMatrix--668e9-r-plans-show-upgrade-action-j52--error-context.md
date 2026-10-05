# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UpgradeSubscriptionMatrix.spec.ts >> Upgrade Subscription Use Case 3 Matrix >> SC-77 - Eligible higher-tier plans show upgrade action
- Location: tests\UpgradeSubscriptionMatrix.spec.ts:361:13

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/^paid$/i).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/^paid$/i).first()

```

# Test source

```ts
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
  472 |     throw new Error(
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
  554 |       /^paid$/i
  555 |     );
  556 | 
  557 |   await expect(
  558 |     paidStatusBadges.first()
> 559 |   ).toBeVisible();
      |     ^ Error: expect(locator).toBeVisible() failed
  560 | 
  561 |   console.log(
  562 |     ' Paid Status Verified'
  563 |   );
  564 | }
  565 | async validateInvoicePage() {
  566 | 
  567 | Logger.info(
  568 |   'Validating Invoice Page'
  569 | );
  570 | 
  571 |   const [invoicePage] =
  572 |     await Promise.all([
  573 |       this.page.context().waitForEvent(
  574 |         'page'
  575 |       ),
  576 |       this.page.getByRole(
  577 |         'link',
  578 |         {
  579 |           name: /invoice/i,
  580 |         }
  581 |       ).first().click(),
  582 |     ]);
  583 | 
  584 |   await invoicePage.waitForLoadState(
  585 |     'domcontentloaded'
  586 |   );
  587 | 
  588 |   await expect(
  589 |     invoicePage.getByText(
  590 |       /invoice paid/i
  591 |     )
  592 |   ).toBeVisible();
  593 | 
  594 |   console.log(
  595 |     ' Invoice Page Opened'
  596 |   );
  597 | 
  598 |   await invoicePage.close();
  599 | 
  600 |  Logger.celebration(
  601 |   'Invoice Validation Completed'
  602 | );
  603 | }
  604 | async validatePdfDownload() {
  605 | 
  606 |   Logger.info(
  607 |   'Validating PDF Link'
  608 | );
  609 |   const pdfLink =
  610 |     this.pdfLinks.first();
  611 | 
  612 |   await expect(
  613 |     pdfLink
  614 |   ).toBeVisible();
  615 | 
  616 |   console.log(
  617 |     ' PDF Link Available'
  618 |   );
  619 | 
  620 |   await pdfLink.click({
  621 |     force: true,
  622 |   });
  623 | 
  624 |   console.log(
  625 |     ' PDF Link Clicked'
  626 |   );
  627 | 
  628 |   console.log(
  629 |     ' PDF Validation Completed'
  630 |   );
  631 | }
  632 | 
  633 | async validateBillingUrl() {
  634 | 
  635 |   await expect(
  636 |     this.page
  637 |   ).toHaveURL(
  638 |     /billing/,
  639 |     {
  640 |       timeout: 15000,
  641 |     }
  642 |   );
  643 | }
  644 | 
  645 | async validatePlansTabStable() {
  646 | 
  647 |   Logger.info(
  648 |     'Validating Billing Plans Tab Stability'
  649 |   );
  650 | 
  651 |   await safeClick(
  652 |     this.plansTab,
  653 |     'Open Plans Tab'
  654 |   );
  655 | 
  656 |   await this.validateBillingUrl();
  657 | 
  658 |   await expect(
  659 |     this.page.getByText(
```