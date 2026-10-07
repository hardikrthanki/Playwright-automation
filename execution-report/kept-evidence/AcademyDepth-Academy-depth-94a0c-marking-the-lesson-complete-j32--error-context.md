# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AcademyDepth.spec.ts >> Academy depth >> Lessons navigation returns without marking the lesson complete
- Location: tests\AcademyDepth.spec.ts:1107:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /^mark as complete$/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /^mark as complete$/i })

```

# Page snapshot

```yaml
- generic [ref=e2]: Internal Server Error
```

# Test source

```ts
  1032 |             {
  1033 |               name: /^covered call$/i
  1034 |             }
  1035 |           )
  1036 |         ).toBeVisible();
  1037 |       }
  1038 |     );
  1039 | 
  1040 |     test(
  1041 |       'Strategy library clear all restores every strategy',
  1042 |       async ({ page }) => {
  1043 |         await openAcademy(
  1044 |           page,
  1045 |           '/academy'
  1046 |         );
  1047 | 
  1048 |         await safeClick(
  1049 |           page.getByRole(
  1050 |             'link',
  1051 |             {
  1052 |               name: /^strategy library$/i
  1053 |             }
  1054 |           ).first(),
  1055 |           'Strategy library'
  1056 |         );
  1057 | 
  1058 |         await safeClick(
  1059 |           page.locator(
  1060 |             'main'
  1061 |           ).getByRole(
  1062 |             'button',
  1063 |             {
  1064 |               name: /^protection\b/i
  1065 |             }
  1066 |           ),
  1067 |           'Protection strategies'
  1068 |         );
  1069 | 
  1070 |         await expect(
  1071 |           page.locator(
  1072 |             'main'
  1073 |           )
  1074 |         ).toContainText(
  1075 |           /2 of 18/i
  1076 |         );
  1077 | 
  1078 |         await safeClick(
  1079 |           page.getByRole(
  1080 |             'button',
  1081 |             {
  1082 |               name: /^clear all$/i
  1083 |             }
  1084 |           ),
  1085 |           'Clear all strategy filters'
  1086 |         );
  1087 | 
  1088 |         await expect(
  1089 |           page.locator(
  1090 |             'main'
  1091 |           )
  1092 |         ).toContainText(
  1093 |           /18 of 18/i
  1094 |         );
  1095 | 
  1096 |         await expect(
  1097 |           page.getByRole(
  1098 |             'heading',
  1099 |             {
  1100 |               name: /^covered call$/i
  1101 |             }
  1102 |           )
  1103 |         ).toBeVisible();
  1104 |       }
  1105 |     );
  1106 | 
  1107 |     test(
  1108 |       'Lessons navigation returns without marking the lesson complete',
  1109 |       async ({ page }) => {
  1110 |         await openAcademy(
  1111 |           page,
  1112 |           '/academy/lessons'
  1113 |         );
  1114 | 
  1115 |         await safeClick(
  1116 |           page.getByRole(
  1117 |             'link',
  1118 |             {
  1119 |               name: /reading an options chain/i
  1120 |             }
  1121 |           ).first(),
  1122 |           'Open lesson'
  1123 |         );
  1124 | 
  1125 |         await expect(
  1126 |           page.getByRole(
  1127 |             'button',
  1128 |             {
  1129 |               name: /^mark as complete$/i
  1130 |             }
  1131 |           )
> 1132 |         ).toBeVisible();
       |           ^ Error: expect(locator).toBeVisible() failed
  1133 | 
  1134 |         await safeClick(
  1135 |           page.getByRole(
  1136 |             'link',
  1137 |             {
  1138 |               name: /^lessons$/i
  1139 |             }
  1140 |           ).first(),
  1141 |           'Lessons'
  1142 |         );
  1143 | 
  1144 |         await expect(
  1145 |           page
  1146 |         ).toHaveURL(
  1147 |           /\/academy\/lessons/
  1148 |         );
  1149 | 
  1150 |         await expect(
  1151 |           page.getByRole(
  1152 |             'link',
  1153 |             {
  1154 |               name: /reading an options chain/i
  1155 |             }
  1156 |           ).first()
  1157 |         ).toBeVisible();
  1158 |       }
  1159 |     );
  1160 | 
  1161 |     test(
  1162 |       'Strategy library opens Collar and returns',
  1163 |       async ({ page }) => {
  1164 |         await openAcademy(
  1165 |           page,
  1166 |           '/academy'
  1167 |         );
  1168 | 
  1169 |         await safeClick(
  1170 |           page.getByRole(
  1171 |             'link',
  1172 |             {
  1173 |               name: /^strategy library$/i
  1174 |             }
  1175 |           ).first(),
  1176 |           'Strategy library'
  1177 |         );
  1178 | 
  1179 |         await page.getByRole(
  1180 |           'textbox',
  1181 |           {
  1182 |             name: /name or description/i
  1183 |           }
  1184 |         ).fill(
  1185 |           'collar'
  1186 |         );
  1187 | 
  1188 |         await expect(
  1189 |           page.getByRole(
  1190 |             'heading',
  1191 |             {
  1192 |               name: /^collar$/i
  1193 |             }
  1194 |           )
  1195 |         ).toBeVisible();
  1196 | 
  1197 |         await safeClick(
  1198 |           page.locator(
  1199 |             'main a'
  1200 |           ).filter({
  1201 |             hasText: /explore scenario/i
  1202 |           }).first(),
  1203 |           'Open Collar'
  1204 |         );
  1205 | 
  1206 |         await expect(
  1207 |           page
  1208 |         ).toHaveURL(
  1209 |           /\/academy\/strategies\//
  1210 |         );
  1211 | 
  1212 |         await page.goBack({
  1213 |           waitUntil: 'domcontentloaded'
  1214 |         });
  1215 | 
  1216 |         await expect(
  1217 |           page
  1218 |         ).toHaveURL(
  1219 |           /\/academy\/strategies/
  1220 |         );
  1221 |       }
  1222 |     );
  1223 | 
  1224 |     test(
  1225 |       'Strategy library Volatility shows Long Straddle then All restores Covered Call',
  1226 |       async ({ page }) => {
  1227 |         await openAcademy(
  1228 |           page,
  1229 |           '/academy'
  1230 |         );
  1231 | 
  1232 |         await safeClick(
```