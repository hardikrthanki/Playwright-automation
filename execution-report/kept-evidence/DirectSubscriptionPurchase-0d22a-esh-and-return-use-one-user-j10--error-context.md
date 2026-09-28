# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DirectSubscriptionPurchase.spec.ts >> Direct Subscription Purchase >> Paid plan checkout summaries currency refresh and return use one user
- Location: tests\DirectSubscriptionPurchase.spec.ts:273:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  getByText(/choose your plan|pricing|subscription/i).first()
Expected: visible
Received: hidden
Timeout:  30000ms

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for getByText(/choose your plan|pricing|subscription/i).first()
    33 × locator resolved to <h1 class="font-bold text-foreground text-2xl mb-2">…</h1>
       - unexpected value "hidden"

```

# Page snapshot

```yaml
- generic [active]:
  - generic:
    - banner [ref=e1]:
      - button "Sign Out" [ref=e2] [cursor=pointer]:
        - img
        - text: Sign Out
    - generic [ref=e3]:
      - generic:
        - generic:
          - link "OolTool":
            - /url: /
            - img "OolTool"
          - heading "Choose Your Plan" [level=1]
          - paragraph: Select a plan to get started with OolTool
        - generic:
          - generic [ref=e4]:
            - button "Monthly" [ref=e5]
            - button "Annual" [ref=e6]
          - generic:
            - radio "Curious Explore your Portfolio Free forever Manual Upload Only Positions (10) Simulations (10) CTAs Refresh Covered Calls OOLS Score" [checked] [ref=e7] [cursor=pointer]:
              - generic [ref=e9]: Curious
              - paragraph: Explore your Portfolio
              - generic: Free forever
              - list:
                - listitem:
                  - img [ref=e10]
                  - text: Manual Upload Only
                - listitem:
                  - img [ref=e12]
                  - text: Positions (10)
                - listitem:
                  - img [ref=e14]
                  - text: Simulations (10)
                - listitem:
                  - img [ref=e16]
                  - text: CTAs Refresh
                - listitem:
                  - img [ref=e18]
                  - text: Covered Calls
                - listitem:
                  - img [ref=e20]
                  - text: OOLS Score
            - radio "Income Build your Portfolio $29/mo Broker Integration (1) Account Linked (1) Positions (100) CTAs Unlimited Simulations Unlimited Covered Calls/Puts CTAs Earnings Notifications Dividend Notifications OOLS Score" [ref=e22] [cursor=pointer]:
              - generic [ref=e24]: Income
              - paragraph: Build your Portfolio
              - generic: $29/mo
              - list:
                - listitem:
                  - img [ref=e25]
                  - text: Broker Integration (1)
                - listitem:
                  - img [ref=e27]
                  - text: Account Linked (1)
                - listitem:
                  - img [ref=e29]
                  - text: Positions (100)
                - listitem:
                  - img [ref=e31]
                  - text: CTAs Unlimited
                - listitem:
                  - img [ref=e33]
                  - text: Simulations Unlimited
                - listitem:
                  - img [ref=e35]
                  - text: Covered Calls/Puts CTAs
                - listitem:
                  - img [ref=e37]
                  - text: Earnings Notifications
                - listitem:
                  - img [ref=e39]
                  - text: Dividend Notifications
                - listitem:
                  - img [ref=e41]
                  - text: OOLS Score
            - radio "Overlay Strategists Optimize your Portfolio $79/mo Try 30 days free With card · auto-renews after trial Try 30 days free Without card · moves to Free after trial Broker Integration (5) Account Linked (10) Positions (500) CTAs & Simulations Unlimited Covered Calls/Puts CTAs Earnings & Dividends Notifications ITM/ATM resolve suggestions Portfolio Analytics Bulk Portfolio Load OOLS Score" [ref=e43] [cursor=pointer]:
              - generic [ref=e46]: Overlay Strategists
              - paragraph: Optimize your Portfolio
              - generic: $79/mo
              - generic:
                - generic:
                  - button "Try 30 days free With card · auto-renews after trial" [ref=e47]:
                    - generic [ref=e48]:
                      - img
                      - text: Try 30 days free
                    - generic [ref=e49]: With card · auto-renews after trial
                  - button "Try 30 days free Without card · moves to Free after trial" [ref=e50]:
                    - generic [ref=e51]:
                      - img
                      - text: Try 30 days free
                    - generic [ref=e52]: Without card · moves to Free after trial
              - list:
                - listitem:
                  - img [ref=e53]
                  - text: Broker Integration (5)
                - listitem:
                  - img [ref=e55]
                  - text: Account Linked (10)
                - listitem:
                  - img [ref=e57]
                  - text: Positions (500)
                - listitem:
                  - img [ref=e59]
                  - text: CTAs & Simulations Unlimited
                - listitem:
                  - img [ref=e61]
                  - text: Covered Calls/Puts CTAs
                - listitem:
                  - img [ref=e63]
                  - text: Earnings & Dividends Notifications
                - listitem:
                  - img [ref=e65]
                  - text: ITM/ATM resolve suggestions
                - listitem:
                  - img [ref=e67]
                  - text: Portfolio Analytics
                - listitem:
                  - img [ref=e69]
                  - text: Bulk Portfolio Load
                - listitem:
                  - img [ref=e71]
                  - text: OOLS Score
            - radio "Portfolio Hedger Optimize your Portfolio $149/mo Broker Integration (10) Account Linked (20) Positions (1000) CTAs & Simulations Unlimited Covered Calls/Puts CTAs Protective Puts Option roll suggestions Earnings & Dividends Notifications ITM/ATM resolve suggestions Portfolio Analytics Bulk Portfolio Load OOLS Score" [ref=e73] [cursor=pointer]:
              - generic [ref=e75]: Portfolio Hedger
              - paragraph: Optimize your Portfolio
              - generic: $149/mo
              - list:
                - listitem:
                  - img [ref=e76]
                  - text: Broker Integration (10)
                - listitem:
                  - img [ref=e78]
                  - text: Account Linked (20)
                - listitem:
                  - img [ref=e80]
                  - text: Positions (1000)
                - listitem:
                  - img [ref=e82]
                  - text: CTAs & Simulations Unlimited
                - listitem:
                  - img [ref=e84]
                  - text: Covered Calls/Puts CTAs
                - listitem:
                  - img [ref=e86]
                  - text: Protective Puts
                - listitem:
                  - img [ref=e88]
                  - text: Option roll suggestions
                - listitem:
                  - img [ref=e90]
                  - text: Earnings & Dividends Notifications
                - listitem:
                  - img [ref=e92]
                  - text: ITM/ATM resolve suggestions
                - listitem:
                  - img [ref=e94]
                  - text: Portfolio Analytics
                - listitem:
                  - img [ref=e96]
                  - text: Bulk Portfolio Load
                - listitem:
                  - img [ref=e98]
                  - text: OOLS Score
            - generic [ref=e100]:
              - generic:
                - heading "Enterprise" [level=3]
                - paragraph: For RIAs, wealth teams and financial institutions
                - paragraph: Custom
                - paragraph: SSO, SAML, SOC 2
                - list:
                  - listitem:
                    - img [ref=e101]
                    - generic [ref=e103]: SaaS and API integrations
                  - listitem:
                    - img [ref=e104]
                    - generic [ref=e106]: Ools SDK and APIs
                  - listitem:
                    - img [ref=e107]
                    - generic [ref=e109]: Customized features
                  - listitem:
                    - img [ref=e110]
                    - generic [ref=e112]: Multi-user teams and role-based access
                  - listitem:
                    - img [ref=e113]
                    - generic [ref=e115]: Firm-wide portfolio analytics
                  - listitem:
                    - img [ref=e116]
                    - generic [ref=e118]: Centralized administration
                  - listitem:
                    - img [ref=e119]
                    - generic [ref=e121]: Audit logs and governance controls
                - button "Contact Sales" [ref=e122] [cursor=pointer]:
                  - img
                  - text: Contact Sales
                - link "contact@ooltool.com":
                  - /url: mailto:contact@ooltool.com
          - button "Complete Setup" [ref=e123] [cursor=pointer]
  - region "Notifications alt+T"
  - alert [ref=e124]
```

# Test source

```ts
  622 |           () =>
  623 |             ariaChecked === 'true' ||
  624 |             dataState === 'checked'
  625 |         );
  626 | 
  627 |     return checked ||
  628 |       ariaChecked === 'true' ||
  629 |       dataState === 'checked';
  630 |   }
  631 | 
  632 | 
  633 | 
  634 |   private async setTrialTermsAccepted(
  635 |     shouldAccept: boolean
  636 |   ) {
  637 |     const termsCheckbox =
  638 |       this.trialTermsCheckbox();
  639 | 
  640 |     await expect(
  641 |       termsCheckbox
  642 |     ).toBeVisible({
  643 |       timeout: 15000
  644 |     });
  645 | 
  646 |     const checked =
  647 |       await this.trialTermsChecked();
  648 | 
  649 |     if (checked !== shouldAccept) {
  650 |       await safeClick(
  651 |         termsCheckbox,
  652 |         shouldAccept
  653 |           ? 'Accept Trial Terms'
  654 |           : 'Decline Trial Terms'
  655 |       );
  656 |     }
  657 |   }
  658 | 
  659 | 
  660 | 
  661 |   private async acceptTrialTermsIfNeeded() {
  662 |     await this.setTrialTermsAccepted(
  663 |       true
  664 |     );
  665 |   }
  666 | 
  667 | 
  668 | 
  669 |   async confirmTrialModal() {
  670 | 
  671 |     Logger.info(
  672 |       'Confirming Overlay Strategists trial modal'
  673 |     );
  674 | 
  675 |     await expect(
  676 |       this.trialDialog()
  677 |     ).toBeVisible({
  678 |       timeout: 15000
  679 |     });
  680 | 
  681 |     await expect(
  682 |       this.trialDialog()
  683 |     ).toContainText(
  684 |       /try out pro|try overlay strategists free|overlay strategists free for 30 days/i,
  685 |       {
  686 |         timeout: 15000
  687 |       }
  688 |     );
  689 | 
  690 |     await this.acceptTrialTermsIfNeeded();
  691 | 
  692 |     await expect(
  693 |       this.startFreeTrialButton()
  694 |     ).toBeEnabled({
  695 |       timeout: 15000
  696 |     });
  697 | 
  698 |     await safeClick(
  699 |       this.startFreeTrialButton(),
  700 |       'Start free trial'
  701 |     );
  702 | 
  703 |     Logger.success(
  704 |       'Start free trial submitted'
  705 |     );
  706 |   }
  707 | 
  708 | 
  709 | 
  710 |   async validatePlanVisible(
  711 |     planName: string
  712 |   ) {
  713 | 
  714 |     Logger.info(
  715 |       `Validating ${planName} plan visibility`
  716 |     );
  717 | 
  718 |     await expect(
  719 |       this.page.getByText(
  720 |         /choose your plan|pricing|subscription/i
  721 |       ).first()
> 722 |     ).toBeVisible({
      |       ^ Error: expect(locator).toBeVisible() failed
  723 |       timeout: 30000
  724 |     });
  725 | 
  726 |     await expect(
  727 |       this.planByName(
  728 |         planName
  729 |       )
  730 |     ).toBeVisible({
  731 |       timeout: 30000
  732 |     });
  733 | 
  734 |     Logger.success(
  735 |       `${planName} plan is visible`
  736 |     );
  737 |   }
  738 | 
  739 | 
  740 | 
  741 |   async validatePlanCatalog() {
  742 | 
  743 |     Logger.info(
  744 |       'Validating plan catalog and feature summary'
  745 |     );
  746 | 
  747 |     const expectedPlans =
  748 |       await this.catalogPlans();
  749 | 
  750 |     for (const planName of expectedPlans) {
  751 |       await this.validatePlanVisible(
  752 |         planName
  753 |       );
  754 |     }
  755 | 
  756 |     const bodyText =
  757 |       await this.page
  758 |         .locator(
  759 |           'body'
  760 |         )
  761 |         .innerText();
  762 | 
  763 |     expect(
  764 |       bodyText
  765 |     ).toMatch(
  766 |       /free forever|manual upload|broker integration|account linked/i
  767 |     );
  768 | 
  769 |     expect(
  770 |       bodyText
  771 |     ).toMatch(
  772 |       /covered calls|protective puts|portfolio analytics/i
  773 |     );
  774 | 
  775 |     if (
  776 |       expectedPlans.includes(
  777 |         'Marketplace'
  778 |       )
  779 |     ) {
  780 |       expect(
  781 |         bodyText
  782 |       ).toMatch(
  783 |         /marketplace access/i
  784 |       );
  785 |     }
  786 | 
  787 |     Logger.success(
  788 |       'Plan catalog and feature summary validated'
  789 |     );
  790 |   }
  791 | 
  792 | 
  793 | 
  794 |   async validateTrialPresentation(
  795 |     planName: string
  796 |   ) {
  797 | 
  798 |     Logger.info(
  799 |       `Validating ${planName} trial presentation`
  800 |     );
  801 | 
  802 |     await this.validatePlanVisible(
  803 |       planName
  804 |     );
  805 | 
  806 |     const pageText =
  807 |       await this.page
  808 |         .locator(
  809 |           'body'
  810 |         )
  811 |         .innerText();
  812 | 
  813 |     expect(
  814 |       pageText
  815 |     ).toMatch(
  816 |       /trial|try it out|start trial|free|30/i
  817 |     );
  818 | 
  819 |     Logger.success(
  820 |       `${planName} trial details are presented`
  821 |     );
  822 |   }
```