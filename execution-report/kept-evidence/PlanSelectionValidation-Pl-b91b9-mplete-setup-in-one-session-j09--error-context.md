# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: PlanSelectionValidation.spec.ts >> Plan Selection Validation >> Plan catalog pricing overlay trial and complete-setup in one session
- Location: tests\PlanSelectionValidation.spec.ts:268:11

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /\$\s*(?:29\.00|29)(?!\d)/i
Received string:  "Sign Out
Choose Your Plan·
Select a plan to get started with OolTool·
Founding Team's Beta Pricing·
Save while helping us build OolTool — Beta pricing for the first 1,000 users.·
Note: OolTool is iteratively adding new features, new brokers and additional symbols.·
Monthly
Annual
Curious·
Explore your Portfolio·
Free forever
Manual Upload Only
Positions (10)
Simulations (10)
CTAs Refresh
Covered Calls
OOLS Score
Income·
Build your Portfolio·
$290
/year·
BETA
Broker Integration (1)
Account Linked (1)
Positions (100)
CTAs Unlimited
Simulations Unlimited
Covered Calls/Puts CTAs
Earnings Notifications
Dividend Notifications
OOLS Score
Overlay Strategists·
Optimize your Portfolio·
$790
/year·
BETA
Try 30 days free
With card · auto-renews after trial
Try 30 days free
Without card · moves to Free after trial
Broker Integration (5)
Account Linked (10)
Positions (500)
CTAs & Simulations Unlimited
Covered Calls/Puts CTAs
Earnings & Dividends Notifications
ITM/ATM resolve suggestions
Portfolio Analytics
Bulk Portfolio Load
OOLS Score
Portfolio Hedger·
Optimize your Portfolio·
$1,490
/year·
BETA
Broker Integration (10)
Account Linked (20)
Positions (1000)
CTAs & Simulations Unlimited
Covered Calls/Puts CTAs
Protective Puts
Option roll suggestions
Earnings & Dividends Notifications
ITM/ATM resolve suggestions
Portfolio Analytics
Bulk Portfolio Load
OOLS Score
Enterprise·
For RIAs, wealth teams and financial institutions·
Custom·
SSO, SAML, SOC 2·
SaaS and API integrations
Ools SDK and APIs
Customized features
Multi-user teams and role-based access
Firm-wide portfolio analytics
Centralized administration
Audit logs and governance controls
Contact Sales
contact@ooltool.com
Complete Setup
Compliance profile saved"
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - button "Sign Out" [ref=e4] [cursor=pointer]:
        - img
        - text: Sign Out
    - generic [ref=e6]:
      - generic [ref=e7]:
        - link "OolTool" [ref=e8] [cursor=pointer]:
          - /url: /
          - img "OolTool" [ref=e9]
        - heading "Choose Your Plan" [level=1] [ref=e10]
        - paragraph [ref=e11]: Select a plan to get started with OolTool
      - generic [ref=e12]:
        - note [ref=e13]:
          - generic [ref=e14]:
            - img [ref=e16]
            - generic [ref=e19]: Founding Team's Beta Pricing
          - generic [ref=e21]:
            - paragraph [ref=e22]: Save while helping us build OolTool — Beta pricing for the first 1,000 users.
            - paragraph [ref=e23]: "Note: OolTool is iteratively adding new features, new brokers and additional symbols."
        - generic [ref=e25]:
          - button "Monthly" [ref=e26]
          - button "Annual" [active] [ref=e27]
        - generic [ref=e28]:
          - radio "Curious Explore your Portfolio Free forever Manual Upload Only Positions (10) Simulations (10) CTAs Refresh Covered Calls OOLS Score" [checked] [ref=e29] [cursor=pointer]:
            - generic [ref=e30]:
              - img [ref=e31]
              - generic [ref=e33]: Curious
            - paragraph [ref=e34]: Explore your Portfolio
            - generic [ref=e35]: Free forever
            - list [ref=e36]:
              - listitem [ref=e37]:
                - img [ref=e38]
                - text: Manual Upload Only
              - listitem [ref=e40]:
                - img [ref=e41]
                - text: Positions (10)
              - listitem [ref=e43]:
                - img [ref=e44]
                - text: Simulations (10)
              - listitem [ref=e46]:
                - img [ref=e47]
                - text: CTAs Refresh
              - listitem [ref=e49]:
                - img [ref=e50]
                - text: Covered Calls
              - listitem [ref=e52]:
                - img [ref=e53]
                - text: OOLS Score
          - radio "Income Build your Portfolio $290 /year Beta Broker Integration (1) Account Linked (1) Positions (100) CTAs Unlimited Simulations Unlimited Covered Calls/Puts CTAs Earnings Notifications Dividend Notifications OOLS Score" [ref=e55] [cursor=pointer]:
            - generic [ref=e56]:
              - img [ref=e57]
              - generic [ref=e59]: Income
            - paragraph [ref=e60]: Build your Portfolio
            - generic [ref=e63]:
              - paragraph [ref=e64]:
                - generic [ref=e65]: $290
                - generic [ref=e66]: /year
              - generic [ref=e67]: Beta
            - list [ref=e68]:
              - listitem [ref=e69]:
                - img [ref=e70]
                - text: Broker Integration (1)
              - listitem [ref=e72]:
                - img [ref=e73]
                - text: Account Linked (1)
              - listitem [ref=e75]:
                - img [ref=e76]
                - text: Positions (100)
              - listitem [ref=e78]:
                - img [ref=e79]
                - text: CTAs Unlimited
              - listitem [ref=e81]:
                - img [ref=e82]
                - text: Simulations Unlimited
              - listitem [ref=e84]:
                - img [ref=e85]
                - text: Covered Calls/Puts CTAs
              - listitem [ref=e87]:
                - img [ref=e88]
                - text: Earnings Notifications
              - listitem [ref=e90]:
                - img [ref=e91]
                - text: Dividend Notifications
              - listitem [ref=e93]:
                - img [ref=e94]
                - text: OOLS Score
          - radio "Overlay Strategists Optimize your Portfolio $790 /year Beta Try 30 days free With card · auto-renews after trial Try 30 days free Without card · moves to Free after trial Broker Integration (5) Account Linked (10) Positions (500) CTAs & Simulations Unlimited Covered Calls/Puts CTAs Earnings & Dividends Notifications ITM/ATM resolve suggestions Portfolio Analytics Bulk Portfolio Load OOLS Score" [ref=e96] [cursor=pointer]:
            - generic [ref=e98]:
              - img [ref=e99]
              - generic [ref=e101]: Overlay Strategists
            - paragraph [ref=e102]: Optimize your Portfolio
            - generic [ref=e105]:
              - paragraph [ref=e106]:
                - generic [ref=e107]: $790
                - generic [ref=e108]: /year
              - generic [ref=e109]: Beta
            - generic [ref=e111]:
              - button "Try 30 days free With card · auto-renews after trial" [ref=e112]:
                - generic [ref=e113]:
                  - img
                  - text: Try 30 days free
                - generic [ref=e114]: With card · auto-renews after trial
              - button "Try 30 days free Without card · moves to Free after trial" [ref=e115]:
                - generic [ref=e116]:
                  - img
                  - text: Try 30 days free
                - generic [ref=e117]: Without card · moves to Free after trial
            - list [ref=e118]:
              - listitem [ref=e119]:
                - img [ref=e120]
                - text: Broker Integration (5)
              - listitem [ref=e122]:
                - img [ref=e123]
                - text: Account Linked (10)
              - listitem [ref=e125]:
                - img [ref=e126]
                - text: Positions (500)
              - listitem [ref=e128]:
                - img [ref=e129]
                - text: CTAs & Simulations Unlimited
              - listitem [ref=e131]:
                - img [ref=e132]
                - text: Covered Calls/Puts CTAs
              - listitem [ref=e134]:
                - img [ref=e135]
                - text: Earnings & Dividends Notifications
              - listitem [ref=e137]:
                - img [ref=e138]
                - text: ITM/ATM resolve suggestions
              - listitem [ref=e140]:
                - img [ref=e141]
                - text: Portfolio Analytics
              - listitem [ref=e143]:
                - img [ref=e144]
                - text: Bulk Portfolio Load
              - listitem [ref=e146]:
                - img [ref=e147]
                - text: OOLS Score
          - radio "Portfolio Hedger Optimize your Portfolio $1,490 /year Beta Broker Integration (10) Account Linked (20) Positions (1000) CTAs & Simulations Unlimited Covered Calls/Puts CTAs Protective Puts Option roll suggestions Earnings & Dividends Notifications ITM/ATM resolve suggestions Portfolio Analytics Bulk Portfolio Load OOLS Score" [ref=e149] [cursor=pointer]:
            - generic [ref=e150]:
              - img [ref=e151]
              - generic [ref=e153]: Portfolio Hedger
            - paragraph [ref=e154]: Optimize your Portfolio
            - generic [ref=e157]:
              - paragraph [ref=e158]:
                - generic [ref=e159]: $1,490
                - generic [ref=e160]: /year
              - generic [ref=e161]: Beta
            - list [ref=e162]:
              - listitem [ref=e163]:
                - img [ref=e164]
                - text: Broker Integration (10)
              - listitem [ref=e166]:
                - img [ref=e167]
                - text: Account Linked (20)
              - listitem [ref=e169]:
                - img [ref=e170]
                - text: Positions (1000)
              - listitem [ref=e172]:
                - img [ref=e173]
                - text: CTAs & Simulations Unlimited
              - listitem [ref=e175]:
                - img [ref=e176]
                - text: Covered Calls/Puts CTAs
              - listitem [ref=e178]:
                - img [ref=e179]
                - text: Protective Puts
              - listitem [ref=e181]:
                - img [ref=e182]
                - text: Option roll suggestions
              - listitem [ref=e184]:
                - img [ref=e185]
                - text: Earnings & Dividends Notifications
              - listitem [ref=e187]:
                - img [ref=e188]
                - text: ITM/ATM resolve suggestions
              - listitem [ref=e190]:
                - img [ref=e191]
                - text: Portfolio Analytics
              - listitem [ref=e193]:
                - img [ref=e194]
                - text: Bulk Portfolio Load
              - listitem [ref=e196]:
                - img [ref=e197]
                - text: OOLS Score
          - generic [ref=e200]:
            - heading "Enterprise" [level=3] [ref=e201]
            - paragraph [ref=e202]: For RIAs, wealth teams and financial institutions
            - paragraph [ref=e203]: Custom
            - paragraph [ref=e204]: SSO, SAML, SOC 2
            - list [ref=e205]:
              - listitem [ref=e206]:
                - img [ref=e207]
                - generic [ref=e209]: SaaS and API integrations
              - listitem [ref=e210]:
                - img [ref=e211]
                - generic [ref=e213]: Ools SDK and APIs
              - listitem [ref=e214]:
                - img [ref=e215]
                - generic [ref=e217]: Customized features
              - listitem [ref=e218]:
                - img [ref=e219]
                - generic [ref=e221]: Multi-user teams and role-based access
              - listitem [ref=e222]:
                - img [ref=e223]
                - generic [ref=e225]: Firm-wide portfolio analytics
              - listitem [ref=e226]:
                - img [ref=e227]
                - generic [ref=e229]: Centralized administration
              - listitem [ref=e230]:
                - img [ref=e231]
                - generic [ref=e233]: Audit logs and governance controls
            - button "Contact Sales" [ref=e234] [cursor=pointer]:
              - img
              - text: Contact Sales
            - link "contact@ooltool.com" [ref=e235] [cursor=pointer]:
              - /url: mailto:contact@ooltool.com
        - button "Complete Setup" [ref=e236] [cursor=pointer]
  - region "Notifications alt+T":
    - list:
      - listitem [ref=e237]:
        - img [ref=e239]
        - generic [ref=e242]: Compliance profile saved
  - alert [ref=e243]
```

# Test source

```ts
  1016 |       }
  1017 |     );
  1018 | 
  1019 |     Logger.success(
  1020 |       'Annual billing selected'
  1021 |     );
  1022 |   }
  1023 | 
  1024 | 
  1025 | 
  1026 |   async selectMonthlyBilling() {
  1027 | 
  1028 |     Logger.info(
  1029 |       'Selecting monthly billing'
  1030 |     );
  1031 | 
  1032 |     await expect(
  1033 |       this.monthlyToggle()
  1034 |     ).toBeVisible({
  1035 |       timeout: 15000
  1036 |     });
  1037 | 
  1038 |     if (
  1039 |       !await this.billingToggleSelected(
  1040 |         this.monthlyToggle()
  1041 |       )
  1042 |     ) {
  1043 |       await this.clickBillingToggle(
  1044 |         this.monthlyToggle(),
  1045 |         'Monthly Toggle'
  1046 |       );
  1047 |     }
  1048 | 
  1049 |     await expect(
  1050 |       this.page.locator(
  1051 |         'body'
  1052 |       )
  1053 |     ).toContainText(
  1054 |       /monthly|\/mo|per month/i,
  1055 |       {
  1056 |         timeout: 10000
  1057 |       }
  1058 |     );
  1059 | 
  1060 |     Logger.success(
  1061 |       'Monthly billing selected'
  1062 |     );
  1063 |   }
  1064 | 
  1065 | 
  1066 | 
  1067 |   async validatePaidPlanPricingAcrossBillingPeriods() {
  1068 | 
  1069 |     Logger.info(
  1070 |       'Validating paid plan pricing across billing periods'
  1071 |     );
  1072 | 
  1073 |     await this.selectMonthlyBilling();
  1074 | 
  1075 |     const monthlyText =
  1076 |       await this.page
  1077 |         .locator(
  1078 |           'body'
  1079 |         )
  1080 |         .innerText();
  1081 | 
  1082 |     const monthlyPrices = [
  1083 |       shownPricePattern(PLAN_PRICES['Income Builder'].monthly),
  1084 |       shownPricePattern(PLAN_PRICES['Overlay Strategists'].monthly),
  1085 |       shownPricePattern(PLAN_PRICES['Portfolio Hedger'].monthly)
  1086 |     ];
  1087 | 
  1088 |     for (const price of monthlyPrices) {
  1089 |       expect(
  1090 |         monthlyText
  1091 |       ).toMatch(
  1092 |         price
  1093 |       );
  1094 |     }
  1095 | 
  1096 |     await this.validateOverlayStrategistsTrialOptions();
  1097 | 
  1098 |     await this.selectAnnualBilling();
  1099 | 
  1100 |     const annualText =
  1101 |       await this.page
  1102 |         .locator(
  1103 |           'body'
  1104 |         )
  1105 |         .innerText();
  1106 | 
  1107 |     const annualPrices = [
  1108 |       shownPricePattern(PLAN_PRICES['Income Builder'].annual),
  1109 |       shownPricePattern(PLAN_PRICES['Overlay Strategists'].annual),
  1110 |       shownPricePattern(PLAN_PRICES['Portfolio Hedger'].annual)
  1111 |     ];
  1112 | 
  1113 |     for (const price of annualPrices) {
  1114 |       expect(
  1115 |         annualText
> 1116 |       ).toMatch(
       |         ^ Error: expect(received).toMatch(expected)
  1117 |         price
  1118 |       );
  1119 |     }
  1120 | 
  1121 |     for (const planName of await this.catalogPlans()) {
  1122 |       if (
  1123 |         planName ===
  1124 |           'Curious Explorer'
  1125 |       ) {
  1126 |         continue;
  1127 |       }
  1128 | 
  1129 |       await this.validatePlanVisible(
  1130 |         planName
  1131 |       );
  1132 |     }
  1133 | 
  1134 |     await this.selectMonthlyBilling();
  1135 | 
  1136 |     Logger.success(
  1137 |       'Paid plan pricing across billing periods validated'
  1138 |     );
  1139 |   }
  1140 | 
  1141 | 
  1142 | 
  1143 |   async validateCompleteSetupRequiresPlanSelection() {
  1144 | 
  1145 |     Logger.info(
  1146 |       'Validating Complete Setup initial state'
  1147 |     );
  1148 | 
  1149 |     await expect(
  1150 |       this.page.getByText(
  1151 |         /choose your plan/i
  1152 |       ).first()
  1153 |     ).toBeVisible({
  1154 |       timeout: 30000
  1155 |     });
  1156 | 
  1157 |     const completeVisible =
  1158 |       await this.completeSetupButton
  1159 |         .first()
  1160 |         .isVisible()
  1161 |         .catch(
  1162 |           () => false
  1163 |         );
  1164 | 
  1165 |     if (completeVisible) {
  1166 |       const completeEnabled =
  1167 |         await this.completeSetupButton
  1168 |           .first()
  1169 |           .isEnabled()
  1170 |           .catch(
  1171 |             () => false
  1172 |           );
  1173 | 
  1174 |       if (completeEnabled) {
  1175 |         await expect(
  1176 |           this.page
  1177 |             .getByRole(
  1178 |               'radio',
  1179 |               {
  1180 |                 checked: true
  1181 |               }
  1182 |             )
  1183 |             .first()
  1184 |         ).toBeVisible({
  1185 |           timeout: 5000
  1186 |         });
  1187 |       } else {
  1188 |         await expect(
  1189 |           this.completeSetupButton.first()
  1190 |         ).toBeDisabled({
  1191 |           timeout: 5000
  1192 |         });
  1193 |       }
  1194 |     }
  1195 | 
  1196 |     Logger.success(
  1197 |       'Complete Setup initial state is safe'
  1198 |     );
  1199 |   }
  1200 | 
  1201 | 
  1202 | 
  1203 |   async validatePlanSelectionCanSwitchWithoutCheckout() {
  1204 | 
  1205 |     Logger.info(
  1206 |       'Validating plan selection can switch without launching checkout'
  1207 |     );
  1208 | 
  1209 |     const planNames =
  1210 |       await this.catalogPlans();
  1211 | 
  1212 |     await this.validatePlanCatalog();
  1213 | 
  1214 |     for (const planName of planNames) {
  1215 |       await safeClick(
  1216 |         this.planByName(
```