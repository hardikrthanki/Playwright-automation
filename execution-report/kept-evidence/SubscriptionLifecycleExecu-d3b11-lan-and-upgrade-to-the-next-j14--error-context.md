# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> Purchase each paid plan and upgrade to the next
- Location: tests\SubscriptionLifecycleExecution.spec.ts:158:9

# Error details

```
Error: Could not find downgrade control for Income Builder. Visible controls: Dashboard | Opportunities | Portfolio | Research | Academy | Support | Sync all | HT | Overview | Plans | History | Switch to Free | Current plan | Upgrade | Upgrade | Cancel Subscription | Privacy Policy | Terms of Service | Disclosures | Risk Warning | Contact
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
          - button "Enter fullscreen" [ref=e33] [cursor=pointer]:
            - img
          - button "Switch to dark theme" [ref=e34] [cursor=pointer]:
            - img
          - button "HT" [ref=e35] [cursor=pointer]:
            - generic [ref=e37]: HT
    - main [ref=e38]:
      - generic [ref=e39]:
        - generic [ref=e40]:
          - heading "Billing & Subscription" [level=1] [ref=e41]
          - paragraph [ref=e42]: Manage your plan, payment methods, and billing history.
        - generic [ref=e43]:
          - tablist [ref=e44]:
            - tab "Overview" [ref=e45] [cursor=pointer]: Overview
            - tab "Plans" [active] [selected] [ref=e46] [cursor=pointer]: Plans
            - tab "History" [ref=e47] [cursor=pointer]: History
          - tabpanel "Plans" [ref=e48]:
            - generic [ref=e49]:
              - generic [ref=e51]:
                - img [ref=e52]
                - text: Change Plan
              - generic [ref=e57]:
                - generic [ref=e58]:
                  - generic [ref=e59]:
                    - generic [ref=e60]:
                      - paragraph [ref=e62]: Curious
                      - paragraph [ref=e63]: Explore your Portfolio
                      - paragraph [ref=e64]: Free
                    - list [ref=e65]:
                      - listitem [ref=e66]:
                        - img [ref=e67]
                        - text: Manual Upload Only
                      - listitem [ref=e69]:
                        - img [ref=e70]
                        - text: Positions (10)
                      - listitem [ref=e72]:
                        - img [ref=e73]
                        - text: Simulations (10)
                      - listitem [ref=e75]:
                        - img [ref=e76]
                        - text: CTAs Refresh
                      - listitem [ref=e78]:
                        - img [ref=e79]
                        - text: Covered Calls
                      - listitem [ref=e81]:
                        - img [ref=e82]
                        - text: OOLS Score
                    - button "Switch to Free" [disabled]:
                      - img
                      - text: Switch to Free
                  - generic [ref=e84]:
                    - generic [ref=e85]:
                      - paragraph [ref=e87]: Income
                      - paragraph [ref=e88]: Build your Portfolio
                      - paragraph [ref=e89]: $29/month
                    - list [ref=e90]:
                      - listitem [ref=e91]:
                        - img [ref=e92]
                        - text: Broker Integration (1)
                      - listitem [ref=e94]:
                        - img [ref=e95]
                        - text: Account Linked (1)
                      - listitem [ref=e97]:
                        - img [ref=e98]
                        - text: Positions (100)
                      - listitem [ref=e100]:
                        - img [ref=e101]
                        - text: CTAs Unlimited
                      - listitem [ref=e103]:
                        - img [ref=e104]
                        - text: Simulations Unlimited
                      - listitem [ref=e106]:
                        - img [ref=e107]
                        - text: Covered Calls/Puts CTAs
                      - listitem [ref=e109]:
                        - img [ref=e110]
                        - text: Earnings Notifications
                      - listitem [ref=e112]:
                        - img [ref=e113]
                        - text: Dividend Notifications
                      - listitem [ref=e115]:
                        - img [ref=e116]
                        - text: OOLS Score
                    - button "Current plan" [disabled]:
                      - img
                      - text: Current plan
                  - generic [ref=e118]:
                    - generic [ref=e119]:
                      - paragraph [ref=e121]: Overlay Strategists
                      - paragraph [ref=e122]: Optimize your Portfolio
                      - paragraph [ref=e123]: $79/month
                    - list [ref=e124]:
                      - listitem [ref=e125]:
                        - img [ref=e126]
                        - text: Broker Integration (5)
                      - listitem [ref=e128]:
                        - img [ref=e129]
                        - text: Account Linked (10)
                      - listitem [ref=e131]:
                        - img [ref=e132]
                        - text: Positions (500)
                      - listitem [ref=e134]:
                        - img [ref=e135]
                        - text: CTAs & Simulations Unlimited
                      - listitem [ref=e137]:
                        - img [ref=e138]
                        - text: Covered Calls/Puts CTAs
                      - listitem [ref=e140]:
                        - img [ref=e141]
                        - text: Earnings & Dividends Notifications
                      - listitem [ref=e143]:
                        - img [ref=e144]
                        - text: ITM/ATM resolve suggestions
                      - listitem [ref=e146]:
                        - img [ref=e147]
                        - text: Portfolio Analytics
                      - listitem [ref=e149]:
                        - img [ref=e150]
                        - text: Bulk Portfolio Load
                      - listitem [ref=e152]:
                        - img [ref=e153]
                        - text: OOLS Score
                    - button "Upgrade" [disabled]:
                      - img
                      - text: Upgrade
                  - generic [ref=e155]:
                    - generic [ref=e156]:
                      - paragraph [ref=e158]: Portfolio Hedger
                      - paragraph [ref=e159]: Optimize your Portfolio
                      - paragraph [ref=e160]: $149/month
                    - list [ref=e161]:
                      - listitem [ref=e162]:
                        - img [ref=e163]
                        - text: Broker Integration (10)
                      - listitem [ref=e165]:
                        - img [ref=e166]
                        - text: Account Linked (20)
                      - listitem [ref=e168]:
                        - img [ref=e169]
                        - text: Positions (1000)
                      - listitem [ref=e171]:
                        - img [ref=e172]
                        - text: CTAs & Simulations Unlimited
                      - listitem [ref=e174]:
                        - img [ref=e175]
                        - text: Covered Calls/Puts CTAs
                      - listitem [ref=e177]:
                        - img [ref=e178]
                        - text: Protective Puts
                      - listitem [ref=e180]:
                        - img [ref=e181]
                        - text: Option roll suggestions
                      - listitem [ref=e183]:
                        - img [ref=e184]
                        - text: Earnings & Dividends Notifications
                      - listitem [ref=e186]:
                        - img [ref=e187]
                        - text: ITM/ATM resolve suggestions
                      - listitem [ref=e189]:
                        - img [ref=e190]
                        - text: Portfolio Analytics
                      - listitem [ref=e192]:
                        - img [ref=e193]
                        - text: Bulk Portfolio Load
                      - listitem [ref=e195]:
                        - img [ref=e196]
                        - text: OOLS Score
                    - button "Upgrade" [disabled]:
                      - img
                      - text: Upgrade
                - paragraph [ref=e198]: Upgrades and switching to annual take effect immediately - the prorated difference is charged to your card on file. Downgrades and switching to monthly are scheduled for your next renewal. Switching to the Free plan takes effect at the end of the period you have already paid for - you keep full access until then.
        - generic [ref=e199]:
          - generic [ref=e200]:
            - generic [ref=e201]: Danger Zone
            - generic [ref=e202]: Cancelling will end your paid plan at the end of the current billing period. You'll retain access to paid features until then.
          - button "Cancel Subscription" [ref=e204] [cursor=pointer]
    - contentinfo [ref=e205]:
      - generic [ref=e206]:
        - generic [ref=e207]:
          - paragraph [ref=e208]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e209]:
            - link "Privacy Policy" [ref=e211] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e212]:
              - generic [ref=e213]: ·
              - link "Terms of Service" [ref=e214] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e215]:
              - generic [ref=e216]: ·
              - link "Disclosures" [ref=e217] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e218]:
              - generic [ref=e219]: ·
              - link "Risk Warning" [ref=e220] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e221]:
              - generic [ref=e222]: ·
              - link "Contact" [ref=e223] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e224]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e225]
```

# Test source

```ts
  1024 |   planName: string,
  1025 |   action: 'upgrade' | 'downgrade' | 'interval'
  1026 | ) {
  1027 |   const actionButtons =
  1028 |     this.page
  1029 |       .locator(
  1030 |         'a, button'
  1031 |       )
  1032 |       .filter({
  1033 |         hasText:
  1034 |           this.planActionButtonPattern(
  1035 |             action
  1036 |           )
  1037 |       });
  1038 | 
  1039 |   const buttonCount =
  1040 |     await actionButtons.count();
  1041 | 
  1042 |   for (let index = 0; index < buttonCount; index += 1) {
  1043 |     const button =
  1044 |       actionButtons.nth(
  1045 |         index
  1046 |       );
  1047 | 
  1048 |     const belongsToPlan =
  1049 |       await button.evaluate(
  1050 |         (
  1051 |           element,
  1052 |           targetPlan
  1053 |         ) => {
  1054 |           const plans = [
  1055 |             {
  1056 |               name: 'Curious Explorer',
  1057 |               needles: ['curious explorer', 'curious']
  1058 |             },
  1059 |             {
  1060 |               name: 'Income Builder',
  1061 |               needles: ['income builder', 'income']
  1062 |             },
  1063 |             {
  1064 |               name: 'Overlay Strategists',
  1065 |               needles: ['overlay strategists', 'overlay']
  1066 |             },
  1067 |             {
  1068 |               name: 'Portfolio Hedger',
  1069 |               needles: ['portfolio hedger', 'portfolio hedge']
  1070 |             }
  1071 |           ];
  1072 | 
  1073 |           const matchedPlans = (text: string) =>
  1074 |             plans.filter(
  1075 |               (plan: { name: string; needles: string[] }) =>
  1076 |                 plan.needles.some(
  1077 |                   (needle: string) =>
  1078 |                     text.includes(
  1079 |                       needle
  1080 |                     )
  1081 |                 )
  1082 |             );
  1083 | 
  1084 |           let current =
  1085 |             element.parentElement;
  1086 | 
  1087 |           for (let depth = 0; current && depth < 12; depth += 1) {
  1088 |             const currentText =
  1089 |               (
  1090 |                 current.textContent ?? ''
  1091 |               ).toLowerCase();
  1092 |             const matches =
  1093 |               matchedPlans(
  1094 |                 currentText
  1095 |               );
  1096 | 
  1097 |             if (
  1098 |               matches.length === 1 &&
  1099 |               matches[0].name === targetPlan
  1100 |             ) {
  1101 |               return true;
  1102 |             }
  1103 | 
  1104 |             current =
  1105 |               current.parentElement;
  1106 |           }
  1107 | 
  1108 |           return false;
  1109 |         },
  1110 |         planName
  1111 |       )
  1112 |         .catch(
  1113 |           () => false
  1114 |         );
  1115 | 
  1116 |     if (belongsToPlan) {
  1117 |       return button;
  1118 |     }
  1119 |   }
  1120 | 
  1121 |   const visibleControls =
  1122 |     await this.visibleControlSummary();
  1123 | 
> 1124 |   throw new Error(
       |         ^ Error: Could not find downgrade control for Income Builder. Visible controls: Dashboard | Opportunities | Portfolio | Research | Academy | Support | Sync all | HT | Overview | Plans | History | Switch to Free | Current plan | Upgrade | Upgrade | Cancel Subscription | Privacy Policy | Terms of Service | Disclosures | Risk Warning | Contact
  1125 |     `Could not find ${action} control for ${planName}. Visible controls: ${visibleControls.join(' | ')}`
  1126 |   );
  1127 | }
  1128 | 
  1129 | private planNamePattern(
  1130 |   planName: string
  1131 | ) {
  1132 |   if (
  1133 |     /portfolio/i.test(
  1134 |       planName
  1135 |     )
  1136 |   ) {
  1137 |     return 'Portfolio Hedger|Portfolio Hedge|3-Advanced';
  1138 |   }
  1139 | 
  1140 |   if (
  1141 |     /income/i.test(
  1142 |       planName
  1143 |     )
  1144 |   ) {
  1145 |     return 'Income Builder|Income';
  1146 |   }
  1147 | 
  1148 |   if (
  1149 |     /overlay/i.test(
  1150 |       planName
  1151 |     )
  1152 |   ) {
  1153 |     return 'Overlay Strategists|Overlay';
  1154 |   }
  1155 | 
  1156 |   if (
  1157 |     /curious|free/i.test(
  1158 |       planName
  1159 |     )
  1160 |   ) {
  1161 |     return 'Curious Explorer|Curious|Free';
  1162 |   }
  1163 | 
  1164 |   return escapeRegExp(
  1165 |     planName
  1166 |   );
  1167 | }
  1168 | 
  1169 | private planChangeDialog(
  1170 |   options: {
  1171 |     targetPlan: string;
  1172 |     action: 'upgrade' | 'downgrade' | 'interval';
  1173 |   }
  1174 | ) {
  1175 |   const planName =
  1176 |     this.planNamePattern(
  1177 |       options.targetPlan
  1178 |     );
  1179 | 
  1180 |   const dialogPattern =
  1181 |     options.action === 'interval'
  1182 |       ? new RegExp(
  1183 |           `(?:${planName}).{0,160}(?:annual|monthly|year|charge)|(?:switch|change).{0,40}(?:annual|monthly).{0,80}(?:${planName})`,
  1184 |           'i'
  1185 |         )
  1186 |       : new RegExp(
  1187 |           `(?:${options.action}|switch)\\s+to\\s+(?:${planName})`,
  1188 |           'i'
  1189 |         );
  1190 | 
  1191 |   const titledSurface =
  1192 |     this.page.getByText(
  1193 |       new RegExp(
  1194 |         `(?:upgrade|downgrade|switch)\\s+to\\s+(?:${planName})`,
  1195 |         'i'
  1196 |       )
  1197 |     );
  1198 | 
  1199 |   if (
  1200 |     options.action === 'interval'
  1201 |   ) {
  1202 |     return this.page
  1203 |       .getByRole(
  1204 |         'dialog'
  1205 |       )
  1206 |       .or(
  1207 |         this.page.getByRole(
  1208 |           'alertdialog'
  1209 |         )
  1210 |       )
  1211 |       .filter({
  1212 |         hasText: dialogPattern
  1213 |       })
  1214 |       .first();
  1215 |   }
  1216 | 
  1217 |   return this.page
  1218 |     .getByRole(
  1219 |       'dialog'
  1220 |     )
  1221 |     .or(
  1222 |       this.page.getByRole(
  1223 |         'alertdialog'
  1224 |       )
```