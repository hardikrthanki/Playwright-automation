# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionCancellationMatrix.spec.ts >> Subscription Cancellation Use Case 7 Matrix >> SC-274 - No-card trial can be cancelled without payment method
- Location: tests\SubscriptionCancellationMatrix.spec.ts:553:13

# Error details

```
Error: Manage subscription control was not found. Visible controls: Dashboard | Opportunities | Portfolio | Research | Academy | Support | Sync all | 1 | HT | Overview | Plans | History | Privacy Policy | Terms of Service | Disclosures | Risk Warning | Contact
```

# Test source

```ts
  4581 |     !alreadyOnHistory
  4582 |   ) {
  4583 |     await this.validateHistoryTabStable();
  4584 |   }
  4585 | 
  4586 |   const invoiceLink =
  4587 |     this.invoiceLinks.first();
  4588 | 
  4589 |   await expect(
  4590 |     invoiceLink
  4591 |   ).toBeVisible({
  4592 |     timeout: 15000,
  4593 |   });
  4594 | 
  4595 |   const invoiceHref =
  4596 |     await invoiceLink.getAttribute(
  4597 |       'href'
  4598 |     );
  4599 | 
  4600 |   expect(
  4601 |     invoiceHref
  4602 |   ).toBeTruthy();
  4603 | 
  4604 |   const pdfLink =
  4605 |     this.pdfLinks.first();
  4606 | 
  4607 |   await expect(
  4608 |     pdfLink
  4609 |   ).toBeVisible({
  4610 |     timeout: 15000,
  4611 |   });
  4612 | 
  4613 |   const pdfHref =
  4614 |     await pdfLink.getAttribute(
  4615 |       'href'
  4616 |     );
  4617 | 
  4618 |   expect(
  4619 |     pdfHref
  4620 |   ).toBeTruthy();
  4621 | 
  4622 |   Logger.success(
  4623 |     'Billing Evidence Links Have Targets'
  4624 |   );
  4625 | }
  4626 | 
  4627 | private async manageSubscriptionControl() {
  4628 |   if (
  4629 |     /stripe\.com/i.test(
  4630 |       this.page.url()
  4631 |     )
  4632 |   ) {
  4633 |     throw new Error(
  4634 |       `Manage subscription was requested while still on Stripe: ${this.page.url()}`
  4635 |     );
  4636 |   }
  4637 | 
  4638 |   const manageName =
  4639 |     /manage subscription|manage billing|billing portal|customer portal|subscription settings|manage plan|manage payment methods|payment methods\s*&\s*invoices|update payment method|change payment method/i;
  4640 | 
  4641 |   const candidates = [
  4642 |     this.page.getByRole(
  4643 |       'button',
  4644 |       {
  4645 |         name: manageName,
  4646 |       }
  4647 |     ),
  4648 |     this.page.getByRole(
  4649 |       'link',
  4650 |       {
  4651 |         name: manageName,
  4652 |       }
  4653 |     ),
  4654 |     this.page.locator(
  4655 |       'a[href*="billing.stripe.com"], a[href*="stripe.com"]'
  4656 |     ).filter({
  4657 |       hasText: manageName,
  4658 |     }),
  4659 |     this.page.locator(
  4660 |       'button, a, [role="button"]'
  4661 |     ).filter({
  4662 |       hasText: manageName,
  4663 |     }),
  4664 |   ];
  4665 | 
  4666 |   for (const candidate of candidates) {
  4667 |     const control =
  4668 |       candidate.first();
  4669 | 
  4670 |     if (
  4671 |       await control.isVisible({
  4672 |         timeout: 2000
  4673 |       }).catch(
  4674 |         () => false
  4675 |       )
  4676 |     ) {
  4677 |       return control;
  4678 |     }
  4679 |   }
  4680 | 
> 4681 |   throw new Error(
       |         ^ Error: Manage subscription control was not found. Visible controls: Dashboard | Opportunities | Portfolio | Research | Academy | Support | Sync all | 1 | HT | Overview | Plans | History | Privacy Policy | Terms of Service | Disclosures | Risk Warning | Contact
  4682 |     `Manage subscription control was not found. Visible controls: ${(await this.visibleControlSummary()).join(' | ')}`
  4683 |   );
  4684 | }
  4685 | 
  4686 | private async clickStripePortalControl(
  4687 |   locator: Locator,
  4688 |   label: string
  4689 | ) {
  4690 |   console.log(`[CLICK] ${label}`);
  4691 | 
  4692 |   await locator.waitFor({
  4693 |     state: 'visible',
  4694 |     timeout: 15000
  4695 |   });
  4696 | 
  4697 |   try {
  4698 |     await locator.click({
  4699 |       timeout: 5000
  4700 |     });
  4701 |   } catch {
  4702 |     await locator.click({
  4703 |       force: true,
  4704 |       timeout: 8000
  4705 |     });
  4706 |   }
  4707 | }
  4708 | 
  4709 | private async dismissStripeCancelDialog(
  4710 |   portalPage: Page
  4711 | ) {
  4712 |   const layer =
  4713 |     portalPage.locator(
  4714 |       '#__sail-layer-containers, [role="dialog"]'
  4715 |     ).filter({
  4716 |       hasText: /cancel your subscription/i
  4717 |     }).last();
  4718 | 
  4719 |   const goBack =
  4720 |     layer.getByRole(
  4721 |       'button',
  4722 |       {
  4723 |         name: /^go back$/i
  4724 |       }
  4725 |     ).last();
  4726 | 
  4727 |   if (
  4728 |     !await goBack.isVisible({
  4729 |       timeout: 2000
  4730 |     }).catch(
  4731 |       () => false
  4732 |     )
  4733 |   ) {
  4734 |     return false;
  4735 |   }
  4736 | 
  4737 |   await this.clickStripePortalControl(
  4738 |     goBack,
  4739 |     'Go Back From Cancel Subscription'
  4740 |   );
  4741 | 
  4742 |   await portalPage.getByText(
  4743 |     /cancel your subscription/i
  4744 |   ).first().waitFor({
  4745 |     state: 'hidden',
  4746 |     timeout: 10000
  4747 |   }).catch(
  4748 |     () => undefined
  4749 |   );
  4750 | 
  4751 |   return true;
  4752 | }
  4753 | 
  4754 | private async ensurePortalOverview(
  4755 |   portalPage: Page
  4756 | ) {
  4757 |   for (let attempt = 0; attempt < 4; attempt++) {
  4758 |     const overviewReady =
  4759 |       await this.waitForPortalOverview(
  4760 |         portalPage,
  4761 |         attempt === 0 ? 3000 : 5000
  4762 |       );
  4763 | 
  4764 |     if (
  4765 |       overviewReady
  4766 |     ) {
  4767 |       return;
  4768 |     }
  4769 | 
  4770 |     if (
  4771 |       await this.dismissStripeCancelDialog(
  4772 |         portalPage
  4773 |       )
  4774 |     ) {
  4775 |       continue;
  4776 |     }
  4777 | 
  4778 |     const goBack =
  4779 |       portalPage.getByRole(
  4780 |         'button',
  4781 |         {
```