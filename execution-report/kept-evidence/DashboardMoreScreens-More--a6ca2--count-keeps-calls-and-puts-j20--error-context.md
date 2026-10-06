# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DashboardMoreScreens.spec.ts >> More dashboard screens >> Option chain strike count keeps calls and puts
- Location: tests\DashboardMoreScreens.spec.ts:226:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/expiration date/i).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/expiration date/i).first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - link "OolTool" [ref=e7] [cursor=pointer]:
          - /url: /dashboard
          - img "OolTool" [ref=e8]
        - navigation [ref=e10]:
          - link "Dashboard" [ref=e11] [cursor=pointer]:
            - /url: /dashboard
          - link "Opportunities" [ref=e12] [cursor=pointer]:
            - /url: /dashboard/opportunities
          - button "Portfolio" [ref=e14]:
            - generic [ref=e15]: Portfolio
            - img [ref=e16]
          - button "Research" [ref=e19]:
            - generic [ref=e20]: Research
            - img [ref=e21]
          - link "Academy" [ref=e23] [cursor=pointer]:
            - /url: /academy
          - link "Support" [ref=e24] [cursor=pointer]:
            - /url: /dashboard/support
        - generic [ref=e25]:
          - button "Prices are delayed, not live market prices. Portfolio value and P&L come from your broker, so they can differ from your broker's dashboard." [ref=e26]: Delayed
          - button "Sync all" [ref=e27] [cursor=pointer]:
            - img
            - generic [ref=e28]: Sync all
          - button "Add options" [ref=e29] [cursor=pointer]:
            - img
          - button "Notifications" [ref=e30] [cursor=pointer]:
            - img [ref=e31]
            - generic [ref=e34]: "18"
          - button "QU" [ref=e35] [cursor=pointer]:
            - generic [ref=e37]: QU
    - main [ref=e38]:
      - generic [ref=e39]:
        - generic [ref=e40]:
          - heading "Options Research" [level=1] [ref=e41]
          - paragraph [ref=e42]: Search any symbol to explore option chains, expirations, and greeks.
        - generic [ref=e45]:
          - generic [ref=e47]:
            - text: Symbol
            - generic [ref=e48]:
              - img
              - combobox "Search company name or symbol" [ref=e49]: AAPL
              - button "Clear Symbol" [ref=e50]:
                - img [ref=e51]
          - button "Analyze" [ref=e54] [cursor=pointer]
        - generic [ref=e55]:
          - generic [ref=e57]: Search Result
          - generic [ref=e58]:
            - generic [ref=e59]:
              - generic [ref=e60]:
                - generic [ref=e61]:
                  - heading "AAPL" [level=2] [ref=e62]
                  - generic [ref=e63]: Apple Inc.
                - generic [ref=e64]:
                  - generic [ref=e65]:
                    - generic [ref=e66]: LTP
                    - generic [ref=e67]: $332.89
                  - generic [ref=e68]:
                    - img [ref=e69]
                    - text: "-0.80 (-0.24%)"
              - generic [ref=e72]: Bearish
            - generic [ref=e73]:
              - generic [ref=e74]:
                - generic [ref=e76]:
                  - img [ref=e77]
                  - text: Price Action
                - generic [ref=e79]:
                  - generic [ref=e80]:
                    - generic [ref=e81]: LTP
                    - generic [ref=e82]: "332.89"
                  - generic [ref=e83]:
                    - generic [ref=e84]: Open
                    - generic [ref=e85]: "332.81"
                  - generic [ref=e86]:
                    - generic [ref=e87]: Prev Close
                    - generic [ref=e88]: "333.69"
                  - generic [ref=e89]:
                    - generic [ref=e90]: Day High
                    - generic [ref=e91]: "336.21"
                  - generic [ref=e92]:
                    - generic [ref=e93]: Day Low
                    - generic [ref=e94]: "331.65"
                  - generic [ref=e95]:
                    - generic [ref=e96]: Volume
                    - generic [ref=e97]: 32.2M
                  - generic [ref=e98]:
                    - generic [ref=e99]: Avg Volume
                    - generic [ref=e100]: 41.6M
              - generic [ref=e101]:
                - generic [ref=e103]:
                  - img [ref=e104]
                  - text: Volatility
                - generic [ref=e106]:
                  - paragraph [ref=e107]: IV rank and percentile are not available for this symbol yet.
                  - generic [ref=e108]:
                    - generic [ref=e109]:
                      - generic [ref=e110]: Current IV
                      - generic [ref=e111]: "-"
                    - generic [ref=e112]:
                      - generic [ref=e113]: HV 20d
                      - generic [ref=e114]: 20.91%
                    - generic [ref=e115]:
                      - generic [ref=e116]: HV 50d
                      - generic [ref=e117]: 26.76%
              - generic [ref=e118]:
                - generic [ref=e120]:
                  - img [ref=e121]
                  - text: Key Levels
                - generic [ref=e124]:
                  - generic [ref=e125]:
                    - generic [ref=e126]: 52W High
                    - generic [ref=e127]: "345.34"
                  - generic [ref=e128]:
                    - generic [ref=e129]: 52W Low
                    - generic [ref=e130]: "243.42"
                  - generic [ref=e131]:
                    - generic [ref=e132]: 50 DMA
                    - generic [ref=e133]: "322.41"
                  - generic [ref=e134]:
                    - generic [ref=e135]: 100 DMA
                    - generic [ref=e136]: "314.32"
                  - generic [ref=e137]:
                    - generic [ref=e138]: 200 DMA
                    - generic [ref=e139]: "289.45"
                  - generic [ref=e140]:
                    - generic [ref=e141]: Mkt Cap
                    - generic [ref=e142]: 3.97T
              - generic [ref=e143]:
                - generic [ref=e145]:
                  - img [ref=e146]
                  - text: Events & Levels
                - generic [ref=e148]:
                  - generic [ref=e149]:
                    - generic [ref=e150]: Earnings
                    - generic [ref=e151]: 2026-10-29
                  - generic [ref=e152]:
                    - generic [ref=e153]: Ex-Div
                    - generic [ref=e154]: 2026-08-10
                  - generic [ref=e155]:
                    - generic [ref=e156]: Support 1
                    - generic [ref=e157]: "309.90"
                  - generic [ref=e158]:
                    - generic [ref=e159]: Resistance 1
                    - generic [ref=e160]: "345.34"
                  - generic [ref=e161]:
                    - generic [ref=e162]: Support 2
                    - generic [ref=e163]: "300.57"
                  - generic [ref=e164]:
                    - generic [ref=e165]: Resistance 2
                    - generic [ref=e166]: "345.34"
                  - generic [ref=e167]:
                    - generic [ref=e168]: Div Yield
                    - generic [ref=e169]: 0.32%
                  - generic [ref=e170]:
                    - generic [ref=e171]: P/E
                    - generic [ref=e172]: "38.3"
          - link "View company fundamentals →" [ref=e174] [cursor=pointer]:
            - /url: /dashboard/company-fundamentals?symbol=AAPL
          - generic [ref=e176]:
            - generic [ref=e177]:
              - generic [ref=e178]:
                - generic [ref=e179]:
                  - text: Option Chain
                  - generic [ref=e180]: "Exp: 2026-10-07"
                - generic [ref=e181]:
                  - generic [ref=e182]: ITM Calls
                  - generic [ref=e184]: ITM Puts
                  - generic [ref=e186]: ATM
              - generic [ref=e188]:
                - generic [ref=e189]:
                  - generic [ref=e190]: Expiration date
                  - combobox [disabled] [ref=e191]:
                    - generic: 2026-10-07
                    - img
                - generic [ref=e192]:
                  - generic [ref=e193]: Show
                  - combobox [ref=e194]:
                    - generic: All
                    - img
                - generic [ref=e195]:
                  - generic [ref=e196]: Strike count
                  - combobox [ref=e197]:
                    - generic: "10"
                    - img
            - generic [ref=e199]:
              - img [ref=e200]
              - text: Loading option chain…
          - generic [ref=e202]:
            - generic [ref=e204]:
              - img [ref=e205]
              - text: Latest News - AAPL
              - generic [ref=e208]: 10 stories
            - generic [ref=e210]:
              - generic [ref=e213]:
                - generic [ref=e214]:
                  - 'heading "Form 4 Security National Financial For: 5 October By Investing.com" [level=4] [ref=e215]':
                    - 'link "Form 4 Security National Financial For: 5 October By Investing.com" [ref=e216] [cursor=pointer]':
                      - /url: https://ca.investing.com/news/stock-market-news/form-4-security-national-financial-for-5-october-93CH-4866451
                  - generic [ref=e217]: neutral
                - generic [ref=e218]:
                  - generic [ref=e219]: Investing.com Canada
                  - generic [ref=e220]: ·
                  - generic [ref=e221]:
                    - img [ref=e222]
                    - text: 7h ago
              - generic [ref=e227]:
                - generic [ref=e228]:
                  - 'heading "Form 4 Honeywell International For: 5 October By Investing.com" [level=4] [ref=e229]':
                    - 'link "Form 4 Honeywell International For: 5 October By Investing.com" [ref=e230] [cursor=pointer]':
                      - /url: https://ca.investing.com/news/stock-market-news/form-4-honeywell-international--for-5-october-93CH-4866429
                  - generic [ref=e231]: bearish
                - generic [ref=e232]:
                  - generic [ref=e233]: Investing.com Canada
                  - generic [ref=e234]: ·
                  - generic [ref=e235]:
                    - img [ref=e236]
                    - text: 9h ago
              - generic [ref=e241]:
                - generic [ref=e242]:
                  - heading "Qualcomm Licenses Huawei Chip Tech as Its Push Beyond Smartphones Picks Up Speed" [level=4] [ref=e243]:
                    - link "Qualcomm Licenses Huawei Chip Tech as Its Push Beyond Smartphones Picks Up Speed" [ref=e244] [cursor=pointer]:
                      - /url: https://www.benzinga.com/markets/tech/26/10/62168851/qualcomm-licenses-huawei-chip-tech-as-its-push-beyond-smartphones-picks-up-speed
                  - generic [ref=e245]: bearish
                - generic [ref=e246]:
                  - generic [ref=e247]: Benzinga
                  - generic [ref=e248]: ·
                  - generic [ref=e249]:
                    - img [ref=e250]
                    - text: 12h ago
              - generic [ref=e255]:
                - generic [ref=e256]:
                  - heading "Apple adds new Full Disk Access controls on Macs because of AI agents" [level=4] [ref=e257]:
                    - link "Apple adds new Full Disk Access controls on Macs because of AI agents" [ref=e258] [cursor=pointer]:
                      - /url: https://thenextweb.com/news/apple-full-disk-access-ai-agents-mac
                  - generic [ref=e259]: neutral
                - generic [ref=e260]:
                  - generic [ref=e261]: The Next Web
                  - generic [ref=e262]: ·
                  - generic [ref=e263]:
                    - img [ref=e264]
                    - text: 14h ago
              - generic [ref=e269]:
                - generic [ref=e270]:
                  - 'heading "Apple Inc. : Gets a Buy rating from JP Morgan" [level=4] [ref=e271]':
                    - 'link "Apple Inc. : Gets a Buy rating from JP Morgan" [ref=e272] [cursor=pointer]':
                      - /url: https://www.marketscreener.com/news/apple-inc-gets-a-buy-rating-from-jp-morgan-ce785dd8d88af727
                  - generic [ref=e273]: bullish
                - generic [ref=e274]:
                  - generic [ref=e275]: marketscreener.com
                  - generic [ref=e276]: ·
                  - generic [ref=e277]:
                    - img [ref=e278]
                    - text: 15h ago
              - generic [ref=e283]:
                - generic [ref=e284]:
                  - heading "Will Siri Overhaul Help Apple (AAPL) Restore Its AI Credibility?" [level=4] [ref=e285]:
                    - link "Will Siri Overhaul Help Apple (AAPL) Restore Its AI Credibility?" [ref=e286] [cursor=pointer]:
                      - /url: https://sg.finance.yahoo.com/news/siri-overhaul-help-apple-aapl-124652463.html
                  - generic [ref=e287]: bullish
                - generic [ref=e288]:
                  - generic [ref=e289]: Yahoo Finance Singapore
                  - generic [ref=e290]: ·
                  - generic [ref=e291]:
                    - img [ref=e292]
                    - text: 15h ago
              - generic [ref=e297]:
                - generic [ref=e298]:
                  - heading "Who’s Worse At AI Monetization, Tesla or Apple?" [level=4] [ref=e299]:
                    - link "Who’s Worse At AI Monetization, Tesla or Apple?" [ref=e300] [cursor=pointer]:
                      - /url: https://247wallst.com/investing/2026/10/05/whos-worse-at-ai-monetization-tesla-or-apple/
                  - generic [ref=e301]: bullish
                - generic [ref=e302]:
                  - generic [ref=e303]: 24/7 Wall St.
                  - generic [ref=e304]: ·
                  - generic [ref=e305]:
                    - img [ref=e306]
                    - text: 15h ago
              - generic [ref=e311]:
                - generic [ref=e312]:
                  - heading "Microsoft stock adds US$1 trillion in its best quarter since 1998" [level=4] [ref=e313]:
                    - link "Microsoft stock adds US$1 trillion in its best quarter since 1998" [ref=e314] [cursor=pointer]:
                      - /url: https://www.wealthprofessional.ca/news/industry-news/microsoft-stock-adds-us1-trillion-in-its-best-quarter-since-1998/393691
                  - generic [ref=e315]: bullish
                - generic [ref=e316]:
                  - generic [ref=e317]: Wealth Professional
                  - generic [ref=e318]: ·
                  - generic [ref=e319]:
                    - img [ref=e320]
                    - text: 16h ago
              - generic [ref=e325]:
                - generic [ref=e326]:
                  - heading "OKX and NYSE Owner ICE Plan 24/7 Tokenized Stock Trading Under SEC Exemption" [level=4] [ref=e327]:
                    - link "OKX and NYSE Owner ICE Plan 24/7 Tokenized Stock Trading Under SEC Exemption" [ref=e328] [cursor=pointer]:
                      - /url: https://decrypt.co/380032/okx-and-nyse-owner-ice-plan-24-7-tokenized-stock-trading-under-sec-exemption
                  - generic [ref=e329]: bullish
                - generic [ref=e330]:
                  - generic [ref=e331]: Decrypt News
                  - generic [ref=e332]: ·
                  - generic [ref=e333]:
                    - img [ref=e334]
                    - text: 18h ago
              - generic [ref=e339]:
                - generic [ref=e340]:
                  - heading "Investigating Apple's Standing In Technology Hardware, Storage & Peripherals Industry Compared To Com" [level=4] [ref=e341]:
                    - link "Investigating Apple's Standing In Technology Hardware, Storage & Peripherals Industry Compared To Com" [ref=e342] [cursor=pointer]:
                      - /url: https://www.benzinga.com/news/26/10/62155683/investigating-apple-s-standing-technology-hardware-storage-amp-peripherals-industry-compared-competi
                  - generic [ref=e343]: bullish
                - generic [ref=e344]:
                  - generic [ref=e345]: Benzinga
                  - generic [ref=e346]: ·
                  - generic [ref=e347]:
                    - img [ref=e348]
                    - text: 18h ago
        - paragraph [ref=e353]: OolTool™ is a product of Ools Inc. OolTool is an AI Analytics Service providing scenarios and analytics based on volume trends and market dynamics. OOLS does not guarantee any scenario, as market conditions can change. OOLS does not provide custody, auto execution, or trade advice. All scenarios generated are for educating investors on risks and opportunities on their portfolio.
    - contentinfo [ref=e354]:
      - generic [ref=e355]:
        - generic [ref=e356]:
          - paragraph [ref=e357]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e358]:
            - link "Privacy Policy" [ref=e360] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e361]:
              - generic [ref=e362]: ·
              - link "Terms of Service" [ref=e363] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e364]:
              - generic [ref=e365]: ·
              - link "Disclosures" [ref=e366] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e367]:
              - generic [ref=e368]: ·
              - link "Risk Warning" [ref=e369] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e370]:
              - generic [ref=e371]: ·
              - link "Contact" [ref=e372] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e373]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e374]
```

# Test source

```ts
  630 |             if (
  631 |               /latest news/i.test(
  632 |                 value
  633 |               ) &&
  634 |               value.length > 12 &&
  635 |               value.length < 5000
  636 |             ) {
  637 |               return value;
  638 |             }
  639 | 
  640 |             current =
  641 |               current.parentElement;
  642 |           }
  643 | 
  644 |           return node.textContent || '';
  645 |         }
  646 |       );
  647 | 
  648 |     expect(
  649 |       text
  650 |     ).toMatch(
  651 |       /latest news/i
  652 |     );
  653 | 
  654 |     expect(
  655 |       text
  656 |     ).toMatch(
  657 |       /[A-Za-z]{4,}|no news|no articles/i
  658 |     );
  659 | 
  660 |     Logger.success(
  661 |       'Latest news is shown'
  662 |     );
  663 |   }
  664 | 
  665 |   private labeledCombobox(
  666 |     label: RegExp
  667 |   ) {
  668 |     return this.page.getByText(
  669 |       label
  670 |     ).first().locator(
  671 |       'xpath=following::*[@role="combobox"][1]'
  672 |     );
  673 |   }
  674 | 
  675 |   private async expectChainHeaders() {
  676 |     await expect(
  677 |       this.page.getByText(
  678 |         /loading option chain/i
  679 |       )
  680 |     ).toBeHidden({
  681 |       timeout: 20000
  682 |     });
  683 | 
  684 |     await expect(
  685 |       this.page.getByRole(
  686 |         'columnheader',
  687 |         {
  688 |           name: /^calls$/i
  689 |         }
  690 |       )
  691 |     ).toBeVisible({
  692 |       timeout: 20000
  693 |     });
  694 | 
  695 |     await expect(
  696 |       this.page.getByRole(
  697 |         'columnheader',
  698 |         {
  699 |           name: /^puts$/i
  700 |         }
  701 |       )
  702 |     ).toBeVisible();
  703 | 
  704 |     await expect(
  705 |       this.page.getByRole(
  706 |         'columnheader',
  707 |         {
  708 |           name: /^strike$/i
  709 |         }
  710 |       ).first()
  711 |     ).toBeVisible();
  712 |   }
  713 | 
  714 |   async validateChainControls() {
  715 |     Logger.info(
  716 |       'Validating option chain controls'
  717 |     );
  718 | 
  719 |     await this.ensureSymbolResult();
  720 | 
  721 |     for (const label of [
  722 |       /expiration date/i,
  723 |       /^show$/i,
  724 |       /strike count/i
  725 |     ]) {
  726 |       await expect(
  727 |         this.page.getByText(
  728 |           label
  729 |         ).first()
> 730 |       ).toBeVisible();
      |         ^ Error: expect(locator).toBeVisible() failed
  731 |     }
  732 | 
  733 |     const strikeCount =
  734 |       this.page.getByText(
  735 |         /^strike count$/i
  736 |       ).locator(
  737 |         'xpath=following::*[@role="combobox"][1]'
  738 |       );
  739 | 
  740 |     const before =
  741 |       this.firstLine(
  742 |         await strikeCount.innerText()
  743 |       );
  744 | 
  745 |     await safeClick(
  746 |       strikeCount,
  747 |       'Strike count'
  748 |     );
  749 | 
  750 |     const options =
  751 |       this.page.getByRole(
  752 |         'option'
  753 |       );
  754 | 
  755 |     await expect(
  756 |       options.first()
  757 |     ).toBeVisible({
  758 |       timeout: 8000
  759 |     });
  760 | 
  761 |     const count =
  762 |       await options.count();
  763 | 
  764 |     let picked = '';
  765 | 
  766 |     for (
  767 |       let index = 0;
  768 |       index < count;
  769 |       index += 1
  770 |     ) {
  771 |       const label =
  772 |         this.firstLine(
  773 |           await options.nth(
  774 |             index
  775 |           ).innerText()
  776 |         );
  777 | 
  778 |       if (
  779 |         label &&
  780 |         label !== before
  781 |       ) {
  782 |         picked = label;
  783 | 
  784 |         await safeClick(
  785 |           options.nth(
  786 |             index
  787 |           ),
  788 |           `Strike count ${label}`
  789 |         );
  790 | 
  791 |         break;
  792 |       }
  793 |     }
  794 | 
  795 |     if (
  796 |       picked
  797 |     ) {
  798 |       await expect(
  799 |         strikeCount
  800 |       ).toContainText(
  801 |         picked,
  802 |         {
  803 |           timeout: 10000
  804 |         }
  805 |       );
  806 |     }
  807 | 
  808 |     await expect(
  809 |       this.page.getByRole(
  810 |         'columnheader',
  811 |         {
  812 |           name: /^calls$/i
  813 |         }
  814 |       )
  815 |     ).toBeVisible({
  816 |       timeout: 15000
  817 |     });
  818 | 
  819 |     Logger.success(
  820 |       'Option chain controls keep the chain visible'
  821 |     );
  822 |   }
  823 | }
  824 | 
```