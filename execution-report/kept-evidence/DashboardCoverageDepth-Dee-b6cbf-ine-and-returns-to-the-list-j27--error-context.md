# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DashboardCoverageDepth.spec.ts >> Deeper dashboard controls >> News opens one headline and returns to the list
- Location: tests\DashboardCoverageDepth.spec.ts:1144:9

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/dashboard\/news/
Received string:  "about:blank"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "about:blank"

```

# Test source

```ts
  1100 |             }
  1101 |           );
  1102 | 
  1103 |         if (
  1104 |           await search.isEnabled()
  1105 |         ) {
  1106 |           await safeClick(
  1107 |             search,
  1108 |             'Search unknown symbol'
  1109 |           );
  1110 |         }
  1111 | 
  1112 |         await expect(
  1113 |           page.getByRole(
  1114 |             'heading',
  1115 |             {
  1116 |               name: /^ZZZNOTASYMBOL$/
  1117 |             }
  1118 |           )
  1119 |         ).toHaveCount(
  1120 |           0
  1121 |         );
  1122 | 
  1123 |         await expect(
  1124 |           page.getByRole(
  1125 |             'tab',
  1126 |             {
  1127 |               name: /^income statement$/i
  1128 |             }
  1129 |           )
  1130 |         ).toHaveCount(
  1131 |           0
  1132 |         );
  1133 | 
  1134 |         await expect(
  1135 |           page.locator(
  1136 |             'main'
  1137 |           )
  1138 |         ).toContainText(
  1139 |           /search a symbol|no result|not found|no match/i
  1140 |         );
  1141 |       }
  1142 |     );
  1143 | 
  1144 |     test(
  1145 |       'News opens one headline and returns to the list',
  1146 |       async ({ page }) => {
  1147 |         await openDashboard(
  1148 |           page
  1149 |         );
  1150 | 
  1151 |         await openResearchItem(
  1152 |           page,
  1153 |           /^news$/i,
  1154 |           'News'
  1155 |         );
  1156 | 
  1157 |         const story =
  1158 |           page.locator(
  1159 |             'main a[href]'
  1160 |           ).filter({
  1161 |             hasText: /[A-Za-z]{8,}/
  1162 |           }).first();
  1163 | 
  1164 |         await expect(
  1165 |           story
  1166 |         ).toBeVisible({
  1167 |           timeout: 20000
  1168 |         });
  1169 | 
  1170 |         const href =
  1171 |           await story.getAttribute(
  1172 |             'href'
  1173 |           );
  1174 | 
  1175 |         await safeClick(
  1176 |           story,
  1177 |           'Open news headline'
  1178 |         );
  1179 | 
  1180 |         await expect(
  1181 |           page
  1182 |         ).not.toHaveURL(
  1183 |           /\/dashboard\/news\/?$/
  1184 |         );
  1185 | 
  1186 |         await expect(
  1187 |           page.locator(
  1188 |             'main, article'
  1189 |           ).first()
  1190 |         ).toContainText(
  1191 |           /[A-Za-z]{8,}/
  1192 |         );
  1193 | 
  1194 |         await page.goBack({
  1195 |           waitUntil: 'domcontentloaded'
  1196 |         });
  1197 | 
  1198 |         await expect(
  1199 |           page
> 1200 |         ).toHaveURL(
       |           ^ Error: expect(page).toHaveURL(expected) failed
  1201 |           /\/dashboard\/news/
  1202 |         );
  1203 | 
  1204 |         expect(
  1205 |           href || ''
  1206 |         ).not.toEqual(
  1207 |           ''
  1208 |         );
  1209 |       }
  1210 |     );
  1211 | 
  1212 |     test(
  1213 |       'Company Fundamentals opens a second symbol',
  1214 |       async ({ page }) => {
  1215 |         await openDashboard(
  1216 |           page
  1217 |         );
  1218 | 
  1219 |         await openResearchItem(
  1220 |           page,
  1221 |           /company fundamentals/i,
  1222 |           'Company Fundamentals'
  1223 |         );
  1224 | 
  1225 |         await searchSymbol(
  1226 |           page,
  1227 |           'AAPL'
  1228 |         );
  1229 | 
  1230 |         await searchSymbol(
  1231 |           page,
  1232 |           'MSFT'
  1233 |         );
  1234 | 
  1235 |         await expect(
  1236 |           page.getByRole(
  1237 |             'heading',
  1238 |             {
  1239 |               name: /^MSFT$/
  1240 |             }
  1241 |           )
  1242 |         ).toBeVisible({
  1243 |           timeout: 20000
  1244 |         });
  1245 | 
  1246 |         await expect(
  1247 |           page.getByRole(
  1248 |             'heading',
  1249 |             {
  1250 |               name: /^AAPL$/
  1251 |             }
  1252 |           )
  1253 |         ).toHaveCount(
  1254 |           0
  1255 |         );
  1256 | 
  1257 |         await expect(
  1258 |           page.locator(
  1259 |             'main'
  1260 |           )
  1261 |         ).toContainText(
  1262 |           /\$\d[\d,]*(?:\.\d+)?/
  1263 |         );
  1264 |       }
  1265 |     );
  1266 | 
  1267 |     test(
  1268 |       'Simulator clears the searched symbol',
  1269 |       async ({ page }) => {
  1270 |         await openDashboard(
  1271 |           page
  1272 |         );
  1273 | 
  1274 |         await openResearchItem(
  1275 |           page,
  1276 |           /^simulator$/i,
  1277 |           'Simulator'
  1278 |         );
  1279 | 
  1280 |         const input =
  1281 |           page.getByRole(
  1282 |             'combobox',
  1283 |             {
  1284 |               name: /search company name or symbol|search symbol/i
  1285 |             }
  1286 |           ).or(
  1287 |             page.getByPlaceholder(
  1288 |               /search|symbol/i
  1289 |             )
  1290 |           ).first();
  1291 | 
  1292 |         await input.fill(
  1293 |           'MSFT'
  1294 |         );
  1295 | 
  1296 |         const choice =
  1297 |           page.getByRole(
  1298 |             'option',
  1299 |             {
  1300 |               name: /MSFT/i
```