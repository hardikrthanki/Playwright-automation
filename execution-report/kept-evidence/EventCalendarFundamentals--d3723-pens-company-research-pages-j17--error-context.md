# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: EventCalendarFundamentals.spec.ts >> Event Calendar and Company Fundamentals >> A day filters by symbol and opens company research pages
- Location: tests\EventCalendarFundamentals.spec.ts:183:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /company fundamentals|equity research/i }).or(getByRole('heading', { name: /^ABBV$/i })).first()
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 20000ms
  - waiting for getByRole('heading', { name: /company fundamentals|equity research/i }).or(getByRole('heading', { name: /^ABBV$/i })).first()

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
          - button "Sync all" [ref=e26] [cursor=pointer]:
            - img
            - generic [ref=e27]: Sync all
          - button "Add options" [ref=e28] [cursor=pointer]:
            - img
          - button "Notifications" [ref=e29] [cursor=pointer]:
            - img [ref=e30]
            - generic [ref=e33]: "18"
          - button "Enter fullscreen" [ref=e34] [cursor=pointer]:
            - img
          - button "Switch to dark theme" [ref=e35] [cursor=pointer]:
            - img
          - button "HT" [ref=e36] [cursor=pointer]:
            - generic [ref=e38]: HT
    - main [ref=e39]:
      - generic [ref=e40]:
        - generic [ref=e41]:
          - heading "Event Calendar" [level=1] [ref=e42]
          - paragraph [ref=e43]: See upcoming equity earnings and dividend dates in a month view so you can plan overlays around the catalysts that matter most.
        - generic [ref=e45]:
          - generic [ref=e46]:
            - generic [ref=e47]:
              - generic [ref=e48]:
                - button "Previous month" [ref=e49] [cursor=pointer]:
                  - img
                - heading "October 2026" [level=2] [ref=e50]
                - button "Next month" [ref=e51] [cursor=pointer]:
                  - img
                - generic [ref=e52]:
                  - button "Month" [ref=e53]:
                    - img [ref=e54]
                    - text: Month
                  - button "Agenda" [ref=e56]:
                    - img [ref=e57]
                    - text: Agenda
              - generic [ref=e58]:
                - button "All" [ref=e59]
                - button "Earnings" [ref=e60]
                - button "Dividend" [ref=e61]
            - generic [ref=e62]:
              - generic [ref=e63]: Su
              - generic [ref=e64]: Mo
              - generic [ref=e65]: Tu
              - generic [ref=e66]: We
              - generic [ref=e67]: Th
              - generic [ref=e68]: Fr
              - generic [ref=e69]: Sa
            - generic [ref=e70]:
              - button "1 ACN APD +10 more" [ref=e75] [cursor=pointer]:
                - generic [ref=e76]: "1"
                - generic [ref=e77]:
                  - button "ACN" [ref=e78]:
                    - img [ref=e79]
                    - generic [ref=e81]: ACN
                  - button "APD" [ref=e82]:
                    - img [ref=e83]
                    - generic [ref=e88]: APD
                  - button "+10 more" [ref=e89]
              - button "2 BMY CSCO +5 more" [ref=e90] [cursor=pointer]:
                - generic [ref=e91]: "2"
                - generic [ref=e92]:
                  - button "BMY" [ref=e93]:
                    - img [ref=e94]
                    - generic [ref=e99]: BMY
                  - button "CSCO" [ref=e100]:
                    - img [ref=e101]
                    - generic [ref=e106]: CSCO
                  - button "+5 more" [ref=e107]
              - button "3" [ref=e108] [cursor=pointer]:
                - generic [ref=e109]: "3"
              - button "4" [ref=e110] [cursor=pointer]:
                - generic [ref=e111]: "4"
              - button "5 ERIE GE +1 more" [ref=e112] [cursor=pointer]:
                - generic [ref=e113]: "5"
                - generic [ref=e114]:
                  - button "ERIE" [ref=e115]:
                    - img [ref=e116]
                    - generic [ref=e121]: ERIE
                  - button "GE" [ref=e122]:
                    - img [ref=e123]
                    - generic [ref=e128]: GE
                  - button "+1 more" [ref=e129]
              - button "6 A DG +3 more" [ref=e130] [cursor=pointer]:
                - generic [ref=e131]: "6"
                - generic [ref=e132]:
                  - button "A" [ref=e133]:
                    - img [ref=e134]
                    - generic [ref=e139]: A
                  - button "DG" [ref=e140]:
                    - img [ref=e141]
                    - generic [ref=e146]: DG
                  - button "+3 more" [ref=e147]
              - button "7 CMCSA LEN" [ref=e148] [cursor=pointer]:
                - generic [ref=e149]: "7"
                - generic [ref=e150]:
                  - button "CMCSA" [ref=e151]:
                    - img [ref=e152]
                    - generic [ref=e157]: CMCSA
                  - button "LEN" [ref=e158]:
                    - img [ref=e159]
                    - generic [ref=e164]: LEN
              - button "8 INTU PEP" [ref=e165] [cursor=pointer]:
                - generic [ref=e166]: "8"
                - generic [ref=e167]:
                  - button "INTU" [ref=e168]:
                    - img [ref=e169]
                    - generic [ref=e174]: INTU
                  - button "PEP" [ref=e175]:
                    - img [ref=e176]
                    - generic [ref=e178]: PEP
              - button "9 DAL DRI +5 more" [ref=e179] [cursor=pointer]:
                - generic [ref=e180]: "9"
                - generic [ref=e181]:
                  - button "DAL" [ref=e182]:
                    - img [ref=e183]
                    - generic [ref=e185]: DAL
                  - button "DRI" [ref=e186]:
                    - img [ref=e187]
                    - generic [ref=e192]: DRI
                  - button "+5 more" [ref=e193]
              - button "10" [ref=e194] [cursor=pointer]:
                - generic [ref=e195]: "10"
              - button "11" [ref=e196] [cursor=pointer]:
                - generic [ref=e197]: "11"
              - button "12 FDX" [ref=e198] [cursor=pointer]:
                - generic [ref=e199]: "12"
                - button "FDX" [ref=e201]:
                  - img [ref=e202]
                  - generic [ref=e204]: FDX
              - button "13 BLK C +6 more" [ref=e205] [cursor=pointer]:
                - generic [ref=e206]: "13"
                - generic [ref=e207]:
                  - button "BLK" [ref=e208]:
                    - img [ref=e209]
                    - generic [ref=e211]: BLK
                  - button "C" [ref=e212]:
                    - img [ref=e213]
                    - generic [ref=e215]: C
                  - button "+6 more" [ref=e216]
              - button "14 ASML BAC +4 more" [ref=e217] [cursor=pointer]:
                - generic [ref=e218]: "14"
                - generic [ref=e219]:
                  - button "ASML" [ref=e220]:
                    - img [ref=e221]
                    - generic [ref=e223]: ASML
                  - button "BAC" [ref=e224]:
                    - img [ref=e225]
                    - generic [ref=e227]: BAC
                  - button "+4 more" [ref=e228]
              - button "15 ABBV ABT +12 more" [ref=e229] [cursor=pointer]:
                - generic [ref=e230]: "15"
                - generic [ref=e231]:
                  - button "ABBV" [ref=e232]:
                    - img [ref=e233]
                    - generic [ref=e238]: ABBV
                  - button "ABT" [ref=e239]:
                    - img [ref=e240]
                    - generic [ref=e245]: ABT
                  - button "+12 more" [ref=e246]
              - button "16 CFG EOG +6 more" [ref=e247] [cursor=pointer]:
                - generic [ref=e248]: "16"
                - generic [ref=e249]:
                  - button "CFG" [ref=e250]:
                    - img [ref=e251]
                    - generic [ref=e253]: CFG
                  - button "EOG" [ref=e254]:
                    - img [ref=e255]
                    - generic [ref=e260]: EOG
                  - button "+6 more" [ref=e261]
              - button "17" [ref=e262] [cursor=pointer]:
                - generic [ref=e263]: "17"
              - button "18" [ref=e264] [cursor=pointer]:
                - generic [ref=e265]: "18"
              - button "19 FITB STLD +2 more" [ref=e266] [cursor=pointer]:
                - generic [ref=e267]: "19"
                - generic [ref=e268]:
                  - button "FITB" [ref=e269]:
                    - img [ref=e270]
                    - generic [ref=e272]: FITB
                  - button "STLD" [ref=e273]:
                    - img [ref=e274]
                    - generic [ref=e276]: STLD
                  - button "+2 more" [ref=e277]
              - button "20 CB CL +25 more" [ref=e278] [cursor=pointer]:
                - generic [ref=e279]: "20"
                - generic [ref=e280]:
                  - button "CB" [ref=e281]:
                    - img [ref=e282]
                    - generic [ref=e284]: CB
                  - button "CL" [ref=e285]:
                    - img [ref=e286]
                    - generic [ref=e291]: CL
                  - button "+25 more" [ref=e292]
              - button "21 ABT CME +11 more" [ref=e293] [cursor=pointer]:
                - generic [ref=e294]: "21"
                - generic [ref=e295]:
                  - button "ABT" [ref=e296]:
                    - img [ref=e297]
                    - generic [ref=e299]: ABT
                  - button "CME" [ref=e300]:
                    - img [ref=e301]
                    - generic [ref=e303]: CME
                  - button "+11 more" [ref=e304]
              - button "22 ALLE APA +31 more" [ref=e305] [cursor=pointer]:
                - generic [ref=e306]: "22"
                - generic [ref=e307]:
                  - button "ALLE" [ref=e308]:
                    - img [ref=e309]
                    - generic [ref=e311]: ALLE
                  - button "APA" [ref=e312]:
                    - img [ref=e313]
                    - generic [ref=e318]: APA
                  - button "+31 more" [ref=e319]
              - button "23 AXP GD +5 more" [ref=e320] [cursor=pointer]:
                - generic [ref=e321]: "23"
                - generic [ref=e322]:
                  - button "AXP" [ref=e323]:
                    - img [ref=e324]
                    - generic [ref=e326]: AXP
                  - button "GD" [ref=e327]:
                    - img [ref=e328]
                    - generic [ref=e330]: GD
                  - button "+5 more" [ref=e331]
              - button "24" [ref=e332] [cursor=pointer]:
                - generic [ref=e333]: "24"
              - button "25" [ref=e334] [cursor=pointer]:
                - generic [ref=e335]: "25"
              - button "26 ACGL ARE +13 more" [ref=e336] [cursor=pointer]:
                - generic [ref=e337]: "26"
                - generic [ref=e338]:
                  - button "ACGL" [ref=e339]:
                    - img [ref=e340]
                    - generic [ref=e342]: ACGL
                  - button "ARE" [ref=e343]:
                    - img [ref=e344]
                    - generic [ref=e346]: ARE
                  - button "+13 more" [ref=e347]
              - button "27 AMT AOS +33 more" [ref=e348] [cursor=pointer]:
                - generic [ref=e349]: "27"
                - generic [ref=e350]:
                  - button "AMT" [ref=e351]:
                    - img [ref=e352]
                    - generic [ref=e354]: AMT
                  - button "AOS" [ref=e355]:
                    - img [ref=e356]
                    - generic [ref=e358]: AOS
                  - button "+33 more" [ref=e359]
              - button "28 APH AVB +27 more" [ref=e360] [cursor=pointer]:
                - generic [ref=e361]: "28"
                - generic [ref=e362]:
                  - button "APH" [ref=e363]:
                    - img [ref=e364]
                    - generic [ref=e366]: APH
                  - button "AVB" [ref=e367]:
                    - img [ref=e368]
                    - generic [ref=e370]: AVB
                  - button "+27 more" [ref=e371]
              - button "29 AAPL AJG +59 more" [ref=e372] [cursor=pointer]:
                - generic [ref=e373]: "29"
                - generic [ref=e374]:
                  - button "AAPL" [ref=e375]:
                    - img [ref=e376]
                    - generic [ref=e378]: AAPL
                  - button "AJG" [ref=e379]:
                    - img [ref=e380]
                    - generic [ref=e382]: AJG
                  - button "+59 more" [ref=e383]
              - button "30 ABBV AON +15 more" [ref=e384] [cursor=pointer]:
                - generic [ref=e385]: "30"
                - generic [ref=e386]:
                  - button "ABBV" [ref=e387]:
                    - img [ref=e388]
                    - generic [ref=e390]: ABBV
                  - button "AON" [ref=e391]:
                    - img [ref=e392]
                    - generic [ref=e394]: AON
                  - button "+15 more" [ref=e395]
              - button "31" [ref=e396] [cursor=pointer]:
                - generic [ref=e397]: "31"
            - generic [ref=e398]:
              - generic [ref=e399]:
                - img [ref=e401]
                - text: Earnings
              - generic [ref=e403]:
                - img [ref=e405]
                - text: Dividend
              - generic [ref=e410]: Click a day or event for details
          - generic [ref=e411]:
            - heading "Events this month" [level=3] [ref=e412]
            - list [ref=e413]:
              - listitem [ref=e414]:
                - button "2026-10-01 Earnings ACN Accenture plc - quarterly earnings (est. EPS 3.19)" [ref=e415]:
                  - generic [ref=e416]:
                    - generic [ref=e417]: 2026-10-01
                    - generic [ref=e418]:
                      - img [ref=e419]
                      - text: Earnings
                    - generic [ref=e421]: ACN
                  - paragraph [ref=e422]: Accenture plc - quarterly earnings (est. EPS 3.19)
              - listitem [ref=e423]:
                - button "2026-10-01 Dividend APD Air Products and Chemicals Inc - ex-dividend (7.2)" [ref=e424]:
                  - generic [ref=e425]:
                    - generic [ref=e426]: 2026-10-01
                    - generic [ref=e427]:
                      - img [ref=e428]
                      - text: Dividend
                    - generic [ref=e433]: APD
                  - paragraph [ref=e434]: Air Products and Chemicals Inc - ex-dividend (7.2)
              - listitem [ref=e435]:
                - button "2026-10-01 Dividend CAH Cardinal Health Inc - ex-dividend (2.048)" [ref=e436]:
                  - generic [ref=e437]:
                    - generic [ref=e438]: 2026-10-01
                    - generic [ref=e439]:
                      - img [ref=e440]
                      - text: Dividend
                    - generic [ref=e445]: CAH
                  - paragraph [ref=e446]: Cardinal Health Inc - ex-dividend (2.048)
              - listitem [ref=e447]:
                - button "2026-10-01 Dividend CPB Campbell’s Co - ex-dividend (1.56)" [ref=e448]:
                  - generic [ref=e449]:
                    - generic [ref=e450]: 2026-10-01
                    - generic [ref=e451]:
                      - img [ref=e452]
                      - text: Dividend
                    - generic [ref=e457]: CPB
                  - paragraph [ref=e458]: Campbell’s Co - ex-dividend (1.56)
              - listitem [ref=e459]:
                - button "2026-10-01 Dividend FRT Federal Realty Investment Trust - ex-dividend (4.52)" [ref=e460]:
                  - generic [ref=e461]:
                    - generic [ref=e462]: 2026-10-01
                    - generic [ref=e463]:
                      - img [ref=e464]
                      - text: Dividend
                    - generic [ref=e469]: FRT
                  - paragraph [ref=e470]: Federal Realty Investment Trust - ex-dividend (4.52)
              - listitem [ref=e471]:
                - button "2026-10-01 Earnings MKC McCormick & Company Incorporated - quarterly earnings (est. EPS 0.75)" [ref=e472]:
                  - generic [ref=e473]:
                    - generic [ref=e474]: 2026-10-01
                    - generic [ref=e475]:
                      - img [ref=e476]
                      - text: Earnings
                    - generic [ref=e478]: MKC
                  - paragraph [ref=e479]: McCormick & Company Incorporated - quarterly earnings (est. EPS 0.75)
              - listitem [ref=e480]:
                - button "2026-10-01 Dividend MRSH Marsh & McLennan Companies, Inc. - ex-dividend (3.69)" [ref=e481]:
                  - generic [ref=e482]:
                    - generic [ref=e483]: 2026-10-01
                    - generic [ref=e484]:
                      - img [ref=e485]
                      - text: Dividend
                    - generic [ref=e490]: MRSH
                  - paragraph [ref=e491]: Marsh & McLennan Companies, Inc. - ex-dividend (3.69)
              - listitem [ref=e492]:
                - button "2026-10-01 Earnings NKE Nike Inc - quarterly earnings (est. EPS 0.44)" [ref=e493]:
                  - generic [ref=e494]:
                    - generic [ref=e495]: 2026-10-01
                    - generic [ref=e496]:
                      - img [ref=e497]
                      - text: Earnings
                    - generic [ref=e499]: NKE
                  - paragraph [ref=e500]: Nike Inc - quarterly earnings (est. EPS 0.44)
              - listitem [ref=e501]:
                - button "2026-10-01 Dividend PGR Progressive Corp - ex-dividend (0.4)" [ref=e502]:
                  - generic [ref=e503]:
                    - generic [ref=e504]: 2026-10-01
                    - generic [ref=e505]:
                      - img [ref=e506]
                      - text: Dividend
                    - generic [ref=e511]: PGR
                  - paragraph [ref=e512]: Progressive Corp - ex-dividend (0.4)
              - listitem [ref=e513]:
                - button "2026-10-01 Dividend PWR Quanta Services Inc - ex-dividend (0.43)" [ref=e514]:
                  - generic [ref=e515]:
                    - generic [ref=e516]: 2026-10-01
                    - generic [ref=e517]:
                      - img [ref=e518]
                      - text: Dividend
                    - generic [ref=e523]: PWR
                  - paragraph [ref=e524]: Quanta Services Inc - ex-dividend (0.43)
              - listitem [ref=e525]:
                - button "2026-10-01 Dividend RJF Raymond James Financial Inc. - ex-dividend (2.12)" [ref=e526]:
                  - generic [ref=e527]:
                    - generic [ref=e528]: 2026-10-01
                    - generic [ref=e529]:
                      - img [ref=e530]
                      - text: Dividend
                    - generic [ref=e535]: RJF
                  - paragraph [ref=e536]: Raymond James Financial Inc. - ex-dividend (2.12)
              - listitem [ref=e537]:
                - button "2026-10-01 Dividend STT State Street Corp - ex-dividend (3.36)" [ref=e538]:
                  - generic [ref=e539]:
                    - generic [ref=e540]: 2026-10-01
                    - generic [ref=e541]:
                      - img [ref=e542]
                      - text: Dividend
                    - generic [ref=e547]: STT
                  - paragraph [ref=e548]: State Street Corp - ex-dividend (3.36)
              - listitem [ref=e549]:
                - button "2026-10-02 Dividend BMY Bristol-Myers Squibb Company - ex-dividend (2.51)" [ref=e550]:
                  - generic [ref=e551]:
                    - generic [ref=e552]: 2026-10-02
                    - generic [ref=e553]:
                      - img [ref=e554]
                      - text: Dividend
                    - generic [ref=e559]: BMY
                  - paragraph [ref=e560]: Bristol-Myers Squibb Company - ex-dividend (2.51)
              - listitem [ref=e561]:
                - button "2026-10-02 Dividend CSCO Cisco Systems Inc - ex-dividend (1.66)" [ref=e562]:
                  - generic [ref=e563]:
                    - generic [ref=e564]: 2026-10-02
                    - generic [ref=e565]:
                      - img [ref=e566]
                      - text: Dividend
                    - generic [ref=e571]: CSCO
                  - paragraph [ref=e572]: Cisco Systems Inc - ex-dividend (1.66)
              - listitem [ref=e573]:
                - button "2026-10-02 Dividend IEX IDEX Corporation - ex-dividend (2.88)" [ref=e574]:
                  - generic [ref=e575]:
                    - generic [ref=e576]: 2026-10-02
                    - generic [ref=e577]:
                      - img [ref=e578]
                      - text: Dividend
                    - generic [ref=e583]: IEX
                  - paragraph [ref=e584]: IDEX Corporation - ex-dividend (2.88)
            - generic [ref=e585]:
              - paragraph [ref=e586]:
                - text: Showing
                - generic [ref=e587]: 1–15
                - text: of 316
              - navigation "Pagination" [ref=e588]:
                - button "First page" [disabled]:
                  - img
                - button "Previous page" [disabled]:
                  - img
                - button "Page 1" [ref=e589] [cursor=pointer]: "1"
                - button "Page 2" [ref=e590] [cursor=pointer]: "2"
                - generic [ref=e591]: …
                - button "Page 21" [ref=e592] [cursor=pointer]: "21"
                - button "Page 22" [ref=e593] [cursor=pointer]: "22"
                - button "Next page" [ref=e594] [cursor=pointer]:
                  - img
                - button "Last page" [ref=e595] [cursor=pointer]:
                  - img
    - contentinfo [ref=e596]:
      - generic [ref=e597]:
        - generic [ref=e598]:
          - paragraph [ref=e599]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e600]:
            - link "Privacy Policy" [ref=e602] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e603]:
              - generic [ref=e604]: ·
              - link "Terms of Service" [ref=e605] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e606]:
              - generic [ref=e607]: ·
              - link "Disclosures" [ref=e608] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e609]:
              - generic [ref=e610]: ·
              - link "Risk Warning" [ref=e611] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e612]:
              - generic [ref=e613]: ·
              - link "Contact" [ref=e614] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e615]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e616]: Event Calendar | OolTool
  - generic [ref=e617]: "0"
```

# Test source

```ts
  71  |     ) {
  72  |       const input =
  73  |         this.page.getByRole(
  74  |           'combobox',
  75  |           {
  76  |             name: /search company name or symbol|search symbol/i
  77  |           }
  78  |         );
  79  | 
  80  |       await input.fill(
  81  |         symbol
  82  |       );
  83  | 
  84  |       const choice =
  85  |         this.page.getByRole(
  86  |           'option',
  87  |           {
  88  |             name: new RegExp(
  89  |               symbol,
  90  |               'i'
  91  |             )
  92  |           }
  93  |         ).first();
  94  | 
  95  |       const choiceReady =
  96  |         await choice.waitFor({
  97  |           state: 'visible',
  98  |           timeout: 4000
  99  |         }).then(
  100 |           () => true
  101 |         ).catch(
  102 |           () => false
  103 |         );
  104 | 
  105 |       if (
  106 |         choiceReady
  107 |       ) {
  108 |         await safeClick(
  109 |           choice,
  110 |           `Select ${symbol}`
  111 |         );
  112 |       }
  113 | 
  114 |       await safeClick(
  115 |         this.page.getByRole(
  116 |           'button',
  117 |           {
  118 |             name: /^analyze$/i
  119 |           }
  120 |         ),
  121 |         `Analyze ${symbol}`
  122 |       );
  123 | 
  124 |       const fundamentalsLink =
  125 |         this.page.getByRole(
  126 |           'link',
  127 |           {
  128 |             name: /company fundamentals/i
  129 |           }
  130 |         );
  131 | 
  132 |       if (
  133 |         await fundamentalsLink.isVisible({
  134 |           timeout: 15000
  135 |         }).catch(
  136 |           () => false
  137 |         )
  138 |       ) {
  139 |         await safeClick(
  140 |           fundamentalsLink,
  141 |           'Open company fundamentals'
  142 |         );
  143 |       }
  144 |     }
  145 |   }
  146 | 
  147 |   async validateLoaded(
  148 |     symbol: string
  149 |   ) {
  150 |     Logger.info(
  151 |       `Validating fundamentals for ${symbol}`
  152 |     );
  153 | 
  154 |     await expect(
  155 |       this.page.getByRole(
  156 |         'heading',
  157 |         {
  158 |           name: /company fundamentals|equity research/i
  159 |         }
  160 |       ).or(
  161 |         this.page.getByRole(
  162 |           'heading',
  163 |           {
  164 |             name: new RegExp(
  165 |               `^${symbol}$`,
  166 |               'i'
  167 |             )
  168 |           }
  169 |         )
  170 |       ).first()
> 171 |     ).toBeVisible({
      |       ^ Error: expect(locator).toBeVisible() failed
  172 |       timeout: 20000
  173 |     });
  174 | 
  175 |     await expect(
  176 |       this.page.getByText(
  177 |         new RegExp(
  178 |           `\\b${symbol}\\b`
  179 |         )
  180 |       ).first()
  181 |     ).toBeVisible({
  182 |       timeout: 15000
  183 |     });
  184 | 
  185 |     await expect(
  186 |       this.page.getByText(
  187 |         /\$\d[\d,]*(?:\.\d+)?/
  188 |       ).first()
  189 |     ).toBeVisible();
  190 | 
  191 |     Logger.success(
  192 |       `Fundamentals are open for ${symbol}`
  193 |     );
  194 |   }
  195 | 
  196 |   async searchSymbol(
  197 |     symbol: string
  198 |   ) {
  199 |     Logger.info(
  200 |       `Searching symbol ${symbol}`
  201 |     );
  202 | 
  203 |     const input =
  204 |       this.page.getByPlaceholder(
  205 |         /search symbol/i
  206 |       ).or(
  207 |         this.page.getByRole(
  208 |           'textbox',
  209 |           {
  210 |             name: /search symbol/i
  211 |           }
  212 |         )
  213 |       ).first();
  214 | 
  215 |     await input.fill(
  216 |       symbol
  217 |     );
  218 | 
  219 |     await safeClick(
  220 |       this.page.getByRole(
  221 |         'button',
  222 |         {
  223 |           name: /^search$/i
  224 |         }
  225 |       ),
  226 |       `Search ${symbol}`
  227 |     );
  228 | 
  229 |     await this.validateLoaded(
  230 |       symbol
  231 |     );
  232 | 
  233 |     Logger.success(
  234 |       `Search loaded ${symbol}`
  235 |     );
  236 |   }
  237 | 
  238 |   async openDetailTab(
  239 |     name:
  240 |       | 'Overview'
  241 |       | 'Valuation'
  242 |       | 'Earnings'
  243 |       | 'Dividends'
  244 |       | 'News'
  245 |   ) {
  246 |     Logger.info(
  247 |       `Opening ${name}`
  248 |     );
  249 | 
  250 |     const pattern =
  251 |       new RegExp(
  252 |         `^${name}$`,
  253 |         'i'
  254 |       );
  255 | 
  256 |     const tab =
  257 |       this.page.getByRole(
  258 |         'tab',
  259 |         {
  260 |           name: pattern
  261 |         }
  262 |       ).or(
  263 |         this.page.getByRole(
  264 |           'button',
  265 |           {
  266 |             name: pattern
  267 |           }
  268 |         )
  269 |       ).first();
  270 | 
  271 |     await safeClick(
```