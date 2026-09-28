# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AnnualMonthlyBillingChangeMatrix.spec.ts >> Annual To Monthly Billing Change Use Case 6 Matrix >> SC-201 - Annual plan subscriber sees monthly billing option
- Location: tests\AnnualMonthlyBillingChangeMatrix.spec.ts:393:13

# Error details

```
Error: expect(locator).toBeEnabled() failed

Locator:  getByRole('button', { name: 'Create Account', exact: true }).or(getByRole('button', { name: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).or(locator('button[type="submit"]').filter({ hasText: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).first()
Expected: enabled
Received: disabled
Timeout:  15000ms

Call log:
  - Expect "toBeEnabled" with timeout 15000ms
  - waiting for getByRole('button', { name: 'Create Account', exact: true }).or(getByRole('button', { name: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).or(locator('button[type="submit"]').filter({ hasText: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).first()
    18 × locator resolved to <button disabled type="submit" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 w-full h-11">Create Account</button>
       - unexpected value "disabled"

```

# Test source

```ts
  592 |       timeout: 15000
  593 |     });
  594 | 
  595 | 
  596 |     Logger.success(
  597 |       'Registration page opened'
  598 |     );
  599 | 
  600 |   }
  601 | 
  602 | 
  603 | 
  604 | 
  605 |   async register(
  606 |     email: string,
  607 |     mobileNumber =
  608 |       TEST_USERS.onboarding.mobile
  609 |   ) {
  610 | 
  611 | 
  612 |     Logger.step(
  613 |       `Registering: ${email}`
  614 |     );
  615 | 
  616 |     validatePasswordPolicy(
  617 |       TEST_USERS.onboarding.password
  618 |     );
  619 | 
  620 | 
  621 |     await this.firstNameInput.fill(
  622 |       TEST_USERS.onboarding.firstName
  623 |     );
  624 | 
  625 | 
  626 |     await this.lastNameInput.fill(
  627 |       TEST_USERS.onboarding.lastName
  628 |     );
  629 | 
  630 | 
  631 |     console.log(
  632 |       'Registration Email:',
  633 |       email
  634 |     );
  635 | 
  636 | 
  637 |     await this.emailInput.fill(
  638 |       email
  639 |     );
  640 | 
  641 | 
  642 |     await this.fillMobileNumber(
  643 |       mobileNumber
  644 |     );
  645 | 
  646 | 
  647 |     if (
  648 |       AUTH_SETTINGS.registrationMobileOtpEnabled
  649 |     ) {
  650 |       await this.waitForSendCodeEnabled();
  651 | 
  652 |       await this.clickSendCode(
  653 |         1
  654 |       );
  655 | 
  656 |       await this.waitForRegistrationOtpInput();
  657 | 
  658 |       await this.fillRegistrationOtp();
  659 | 
  660 |       await safeClick(
  661 |         this.verifyOtpButton,
  662 |         'Verify OTP'
  663 |       );
  664 | 
  665 | 
  666 |       Logger.success(
  667 |         'OTP Verify Clicked'
  668 |       );
  669 | 
  670 |       await this.waitForPasswordFieldsReady();
  671 |     } else {
  672 |       Logger.info(
  673 |         'Registration mobile OTP is disabled in auth settings'
  674 |       );
  675 |     }
  676 | 
  677 | 
  678 | 
  679 |     await this.passwordInput.fill(
  680 |       TEST_USERS.onboarding.password
  681 |     );
  682 | 
  683 | 
  684 |     await this.confirmPasswordInput.fill(
  685 |       TEST_USERS.onboarding.password
  686 |     );
  687 | 
  688 | 
  689 | 
  690 |     await expect(
  691 |       this.submitButton
> 692 |     ).toBeEnabled({
      |       ^ Error: expect(locator).toBeEnabled() failed
  693 |       timeout: 15000
  694 |     });
  695 | 
  696 |     await safeClick(
  697 |       this.submitButton,
  698 |       'Submit Registration'
  699 |     );
  700 | 
  701 |     await expect
  702 |       .poll(
  703 |         async () =>
  704 |           this.registrationLooksAccepted(),
  705 |         {
  706 |           timeout: 20000,
  707 |           message: 'Waiting for registration success or email-verification screen'
  708 |         }
  709 |       )
  710 |       .toBeTruthy();
  711 | 
  712 | 
  713 | 
  714 |     Logger.success(
  715 |       'Registration successful. Verification email sent.'
  716 |     );
  717 | 
  718 | 
  719 |   }
  720 | 
  721 |   private async registrationLooksAccepted() {
  722 |     const url =
  723 |       this.page.url();
  724 | 
  725 |     if (
  726 |       /verify-email-sent|\/(verify|onboarding|dashboard|plan|risk|compliance|check-email|confirm)/i.test(
  727 |         url
  728 |       )
  729 |     ) {
  730 |       return true;
  731 |     }
  732 | 
  733 |     const firstNameVisible =
  734 |       await this.firstNameInput.isVisible().catch(
  735 |         () => false
  736 |       );
  737 | 
  738 |     const bodyText =
  739 |       await this.page
  740 |         .locator(
  741 |           'body'
  742 |         )
  743 |         .innerText()
  744 |         .catch(
  745 |           () => ''
  746 |         );
  747 | 
  748 |     if (
  749 |       !firstNameVisible &&
  750 |       /check your email|verification link was sent|verify-email/i.test(
  751 |         bodyText
  752 |       )
  753 |     ) {
  754 |       return true;
  755 |     }
  756 | 
  757 |     return /check your email|a verification link was sent|verification (sent|email|link)|verify your email|confirm your email/i.test(
  758 |       bodyText
  759 |     );
  760 |   }
  761 | 
  762 |   private async waitForRegistrationAccepted(
  763 |     timeoutMs: number
  764 |   ) {
  765 |     const started =
  766 |       Date.now();
  767 | 
  768 |     while (
  769 |       Date.now() -
  770 |         started <
  771 |       timeoutMs
  772 |     ) {
  773 |       if (
  774 |         await this.registrationLooksAccepted()
  775 |       ) {
  776 |         return true;
  777 |       }
  778 | 
  779 |       await this.page.waitForTimeout(
  780 |         500
  781 |       );
  782 |     }
  783 | 
  784 |     return false;
  785 |   }
  786 | 
  787 | 
  788 | }
  789 | 
```