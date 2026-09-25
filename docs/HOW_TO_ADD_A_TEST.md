# How to Add a Test

One-page guide for developers adding Playwright coverage to OOLTool.
Use this when you ship a new menu, button, sub-menu, or navigation path.

## 1. Pick where the file goes

| Change type | Prefer |
| --- | --- |
| New nav / menu / button (read-only) | Extend `tests/DashboardNavigation.spec.ts`, or copy `tests/_templates/UiControlCheck.spec.ts` |
| Auth / login / password | `tests/Auth*.spec.ts`, `tests/PasswordPolicy.spec.ts` |
| Profile / security display | `tests/Profile*.spec.ts` |
| Billing / plans (display only) | `tests/Billing*.spec.ts` |
| Subscription lifecycle (creates users / Stripe) | Matrix or lifecycle specs — ask QA first |

Keep destructive or Stripe-submit flows gated behind env flags. Read-only UI checks should stay ungated when possible.

## 2. Name and structure

- Spec file: `SomethingMeaningful.spec.ts` under `tests/`
- Suite header comment: purpose + how to run (see existing specs)
- Prefer page objects under `tests/pages/` over raw selectors in the spec
- One behavior per `test(...)` title — plain language a product owner can read

## 3. Map it to an AIR area

AIR groups tests by product area (`config/air.config.json` → `moduleMappings`).
Name the file and test titles with words that match the area, for example:

- Dashboard / nav → titles mentioning dashboard, menu, navigation
- Profile → profile
- Billing → billing, invoice, plan
- Auth → login, unlock, forgot

After the next run + report, the case shows under **Product Health**. Click an area card to open detail.

## 4. Minimal UI pattern

```ts
// open page → use the control → assert the expected screen
await page.goto(`${BASE_URL}/dashboard`);
await safeClick(page.getByRole('link', { name: /billing/i }));
await expect(page).toHaveURL(/billing/i);
```

For authenticated pages, reuse `tests/fixtures/subscriberAuth.ts` when the suite already does.

## 5. Run and refresh AIR

```powershell
npx playwright test tests/YourSpec.spec.ts --headed
npm run report:execution
start execution-report\index.html
```

Confirm the new case appears in the matching area and that Evidence still links to `playwright-report/`.

## Checklist — new menu / button / nav

- [ ] Spec lives under `tests/` (or extends an existing navigation suite)
- [ ] Title describes the user-visible control
- [ ] Uses page object or shared helper (`safeClick`, overlays dismissed)
- [ ] Asserts URL and/or visible heading for the destination
- [ ] Does not change account, billing, or security state unless intentional
- [ ] Words in title/file map to the correct AIR module
- [ ] Local run passes headed
- [ ] `npm run report:execution` regenerated; area shows the new coverage

## Template

Copy: `tests/_templates/UiControlCheck.spec.ts`

Rename the file, replace the placeholders, then delete the `.skip` once ready.

## Related

- Commands: `COMMANDS.md`
- Suite strategy: `docs/TEST_SUITE_STRATEGY.md`
- Contributing: `docs/CONTRIBUTING.md`
