# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AcademyDepth.spec.ts >> Academy depth >> Strategy library opens Protective Put and returns
- Location: tests\AcademyDepth.spec.ts:916:9

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('main')
Expected pattern: /put|downside|protection|premium/i
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('main')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - img [ref=e4]
  - heading "This page couldn’t load" [level=1] [ref=e6]
  - paragraph [ref=e7]: Reload to try again, or go back.
  - generic [ref=e8]:
    - button "Reload" [ref=e10] [cursor=pointer]
    - button "Back" [ref=e11] [cursor=pointer]
```

# Test source

```ts
  870  |           page,
  871  |           '/academy/beginners'
  872  |         );
  873  | 
  874  |         await safeClick(
  875  |           page.getByRole(
  876  |             'link',
  877  |             {
  878  |               name: /why might investors use options/i
  879  |             }
  880  |           ).first(),
  881  |           'Open unmarked beginner lesson'
  882  |         );
  883  | 
  884  |         await expect(
  885  |           page
  886  |         ).toHaveURL(
  887  |           /\/academy\/beginners/
  888  |         );
  889  | 
  890  |         await expect(
  891  |           page.locator(
  892  |             'main'
  893  |           )
  894  |         ).toContainText(
  895  |           /investor|option|hedge|income/i
  896  |         );
  897  | 
  898  |         const completeLesson =
  899  |           page.getByRole(
  900  |             'button',
  901  |             {
  902  |               name: /^mark as complete$/i
  903  |             }
  904  |           );
  905  | 
  906  |         if (
  907  |           await completeLesson.count()
  908  |         ) {
  909  |           await expect(
  910  |             completeLesson
  911  |           ).toBeVisible();
  912  |         }
  913  |       }
  914  |     );
  915  | 
  916  |     test(
  917  |       'Strategy library opens Protective Put and returns',
  918  |       async ({ page }) => {
  919  |         await openAcademy(
  920  |           page,
  921  |           '/academy'
  922  |         );
  923  | 
  924  |         await safeClick(
  925  |           page.getByRole(
  926  |             'link',
  927  |             {
  928  |               name: /^strategy library$/i
  929  |             }
  930  |           ).first(),
  931  |           'Strategy library'
  932  |         );
  933  | 
  934  |         await safeClick(
  935  |           page.locator(
  936  |             'main'
  937  |           ).getByRole(
  938  |             'button',
  939  |             {
  940  |               name: /^protection\b/i
  941  |             }
  942  |           ),
  943  |           'Protection strategies'
  944  |         );
  945  | 
  946  |         const strategy =
  947  |           page.locator(
  948  |             'main a'
  949  |           ).filter({
  950  |             hasText: /explore scenario/i
  951  |           }).first();
  952  | 
  953  |         await strategy.scrollIntoViewIfNeeded();
  954  | 
  955  |         await safeClick(
  956  |           strategy,
  957  |           'Open Protective Put'
  958  |         );
  959  | 
  960  |         await expect(
  961  |           page
  962  |         ).toHaveURL(
  963  |           /\/academy\/strategies\//
  964  |         );
  965  | 
  966  |         await expect(
  967  |           page.locator(
  968  |             'main'
  969  |           )
> 970  |         ).toContainText(
       |           ^ Error: expect(locator).toContainText(expected) failed
  971  |           /put|downside|protection|premium/i
  972  |         );
  973  | 
  974  |         await page.goBack({
  975  |           waitUntil: 'domcontentloaded'
  976  |         });
  977  | 
  978  |         await expect(
  979  |           page
  980  |         ).toHaveURL(
  981  |           /\/academy\/strategies/
  982  |         );
  983  |       }
  984  |     );
  985  | 
  986  |     test(
  987  |       'Strategy library search finds Collar and clears',
  988  |       async ({ page }) => {
  989  |         await openAcademy(
  990  |           page,
  991  |           '/academy'
  992  |         );
  993  | 
  994  |         await safeClick(
  995  |           page.getByRole(
  996  |             'link',
  997  |             {
  998  |               name: /^strategy library$/i
  999  |             }
  1000 |           ).first(),
  1001 |           'Strategy library'
  1002 |         );
  1003 | 
  1004 |         const search =
  1005 |           page.getByRole(
  1006 |             'textbox',
  1007 |             {
  1008 |               name: /name or description/i
  1009 |             }
  1010 |           );
  1011 | 
  1012 |         await search.fill(
  1013 |           'collar'
  1014 |         );
  1015 | 
  1016 |         await expect(
  1017 |           page.getByRole(
  1018 |             'heading',
  1019 |             {
  1020 |               name: /^collar$/i
  1021 |             }
  1022 |           )
  1023 |         ).toBeVisible();
  1024 | 
  1025 |         await search.fill(
  1026 |           ''
  1027 |         );
  1028 | 
  1029 |         await expect(
  1030 |           page.getByRole(
  1031 |             'heading',
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
```