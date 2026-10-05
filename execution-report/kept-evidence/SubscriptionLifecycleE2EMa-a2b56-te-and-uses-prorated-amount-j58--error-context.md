# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleE2EMatrix.spec.ts >> Subscription Lifecycle E2E Matrix >> LC-029 - Monthly-to-annual billing change is immediate and uses prorated amount
- Location: tests\SubscriptionLifecycleE2EMatrix.spec.ts:506:13

# Error details

```
Error: Could not find interval control for Income Builder. Visible controls: Dashboard | Opportunities | Portfolio | Research | Academy | Support | Delayed | Sync all | HT | Overview | Plans | History | Switch to Free | Current plan | Upgrade | Upgrade | Cancel Subscription | Privacy Policy | Terms of Service | Disclosures | Risk Warning | Contact
```

# Test source

```ts
  1188 |   planName: string,
  1189 |   action: 'upgrade' | 'downgrade' | 'interval'
  1190 | ) {
  1191 |   const actionButtons =
  1192 |     this.page
  1193 |       .locator(
  1194 |         'a, button'
  1195 |       )
  1196 |       .filter({
  1197 |         hasText:
  1198 |           this.planActionButtonPattern(
  1199 |             action
  1200 |           )
  1201 |       });
  1202 | 
  1203 |   const buttonCount =
  1204 |     await actionButtons.count();
  1205 | 
  1206 |   for (let index = 0; index < buttonCount; index += 1) {
  1207 |     const button =
  1208 |       actionButtons.nth(
  1209 |         index
  1210 |       );
  1211 | 
  1212 |     const belongsToPlan =
  1213 |       await button.evaluate(
  1214 |         (
  1215 |           element,
  1216 |           targetPlan
  1217 |         ) => {
  1218 |           const plans = [
  1219 |             {
  1220 |               name: 'Curious Explorer',
  1221 |               needles: ['curious explorer', 'curious']
  1222 |             },
  1223 |             {
  1224 |               name: 'Income Builder',
  1225 |               needles: ['income builder', 'income']
  1226 |             },
  1227 |             {
  1228 |               name: 'Overlay Strategists',
  1229 |               needles: ['overlay strategists', 'overlay']
  1230 |             },
  1231 |             {
  1232 |               name: 'Portfolio Hedger',
  1233 |               needles: ['portfolio hedger', 'portfolio hedge']
  1234 |             }
  1235 |           ];
  1236 | 
  1237 |           const matchedPlans = (text: string) =>
  1238 |             plans.filter(
  1239 |               (plan: { name: string; needles: string[] }) =>
  1240 |                 plan.needles.some(
  1241 |                   (needle: string) =>
  1242 |                     text.includes(
  1243 |                       needle
  1244 |                     )
  1245 |                 )
  1246 |             );
  1247 | 
  1248 |           let current =
  1249 |             element.parentElement;
  1250 | 
  1251 |           for (let depth = 0; current && depth < 12; depth += 1) {
  1252 |             const currentText =
  1253 |               (
  1254 |                 current.textContent ?? ''
  1255 |               ).toLowerCase();
  1256 |             const matches =
  1257 |               matchedPlans(
  1258 |                 currentText
  1259 |               );
  1260 | 
  1261 |             if (
  1262 |               matches.length === 1 &&
  1263 |               matches[0].name === targetPlan
  1264 |             ) {
  1265 |               return true;
  1266 |             }
  1267 | 
  1268 |             current =
  1269 |               current.parentElement;
  1270 |           }
  1271 | 
  1272 |           return false;
  1273 |         },
  1274 |         planName
  1275 |       )
  1276 |         .catch(
  1277 |           () => false
  1278 |         );
  1279 | 
  1280 |     if (belongsToPlan) {
  1281 |       return button;
  1282 |     }
  1283 |   }
  1284 | 
  1285 |   const visibleControls =
  1286 |     await this.visibleControlSummary();
  1287 | 
> 1288 |   throw new Error(
       |         ^ Error: Could not find interval control for Income Builder. Visible controls: Dashboard | Opportunities | Portfolio | Research | Academy | Support | Delayed | Sync all | HT | Overview | Plans | History | Switch to Free | Current plan | Upgrade | Upgrade | Cancel Subscription | Privacy Policy | Terms of Service | Disclosures | Risk Warning | Contact
  1289 |     `Could not find ${action} control for ${planName}. Visible controls: ${visibleControls.join(' | ')}`
  1290 |   );
  1291 | }
  1292 | 
  1293 | private planNamePattern(
  1294 |   planName: string
  1295 | ) {
  1296 |   if (
  1297 |     /portfolio/i.test(
  1298 |       planName
  1299 |     )
  1300 |   ) {
  1301 |     return 'Portfolio Hedger|Portfolio Hedge|3-Advanced';
  1302 |   }
  1303 | 
  1304 |   if (
  1305 |     /income/i.test(
  1306 |       planName
  1307 |     )
  1308 |   ) {
  1309 |     return 'Income Builder|Income';
  1310 |   }
  1311 | 
  1312 |   if (
  1313 |     /overlay/i.test(
  1314 |       planName
  1315 |     )
  1316 |   ) {
  1317 |     return 'Overlay Strategists|Overlay';
  1318 |   }
  1319 | 
  1320 |   if (
  1321 |     /curious|free/i.test(
  1322 |       planName
  1323 |     )
  1324 |   ) {
  1325 |     return 'Curious Explorer|Curious|Free';
  1326 |   }
  1327 | 
  1328 |   return escapeRegExp(
  1329 |     planName
  1330 |   );
  1331 | }
  1332 | 
  1333 | private planChangeDialog(
  1334 |   options: {
  1335 |     targetPlan: string;
  1336 |     action: 'upgrade' | 'downgrade' | 'interval';
  1337 |   }
  1338 | ) {
  1339 |   const planName =
  1340 |     this.planNamePattern(
  1341 |       options.targetPlan
  1342 |     );
  1343 | 
  1344 |   const dialogPattern =
  1345 |     options.action === 'interval'
  1346 |       ? new RegExp(
  1347 |           `(?:${planName}).{0,160}(?:annual|monthly|year|charge)|(?:switch|change).{0,40}(?:annual|monthly).{0,80}(?:${planName})`,
  1348 |           'i'
  1349 |         )
  1350 |       : new RegExp(
  1351 |           `(?:${options.action}|switch)\\s+to\\s+(?:${planName})`,
  1352 |           'i'
  1353 |         );
  1354 | 
  1355 |   const titledSurface =
  1356 |     this.page.getByText(
  1357 |       new RegExp(
  1358 |         `(?:upgrade|downgrade|switch)\\s+to\\s+(?:${planName})`,
  1359 |         'i'
  1360 |       )
  1361 |     );
  1362 | 
  1363 |   if (
  1364 |     options.action === 'interval'
  1365 |   ) {
  1366 |     return this.page
  1367 |       .getByRole(
  1368 |         'dialog'
  1369 |       )
  1370 |       .or(
  1371 |         this.page.getByRole(
  1372 |           'alertdialog'
  1373 |         )
  1374 |       )
  1375 |       .filter({
  1376 |         hasText: dialogPattern
  1377 |       })
  1378 |       .first();
  1379 |   }
  1380 | 
  1381 |   return this.page
  1382 |     .getByRole(
  1383 |       'dialog'
  1384 |     )
  1385 |     .or(
  1386 |       this.page.getByRole(
  1387 |         'alertdialog'
  1388 |       )
```