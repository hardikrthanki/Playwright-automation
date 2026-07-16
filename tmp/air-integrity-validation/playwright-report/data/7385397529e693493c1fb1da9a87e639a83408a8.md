# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: air-integrity-fixture.spec.ts >> Retry Validation - fails first attempt then passes on retry
- Location: tmp\air-integrity-validation\tests\air-integrity-fixture.spec.ts:3:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0
```

# Page snapshot

```yaml
- main [ref=e2]:
  - heading "AIR retry validation" [level=1] [ref=e3]
  - paragraph [ref=e4]: Attempt 0
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | 
  3  | test('Retry Validation - fails first attempt then passes on retry', async ({ page }, testInfo) => {
  4  |   await page.setContent(`
  5  |     <main style="font-family: Arial; padding: 24px">
  6  |       <h1>AIR retry validation</h1>
  7  |       <p>Attempt ${testInfo.retry}</p>
  8  |     </main>
  9  |   `);
  10 |   await testInfo.attach(`retry-attempt-${testInfo.retry}-note`, {
  11 |     body: Buffer.from(`Retry validation attempt ${testInfo.retry}`),
  12 |     contentType: 'text/plain',
  13 |   });
  14 |   await testInfo.attach(`retry-attempt-${testInfo.retry}-screenshot`, {
  15 |     body: await page.screenshot(),
  16 |     contentType: 'image/png',
  17 |   });
  18 | 
> 19 |   expect(testInfo.retry).toBe(1);
     |                          ^ Error: expect(received).toBe(expected) // Object.is equality
  20 | });
  21 | 
  22 | test('Failure Evidence - fails with screenshot trace and note evidence', async ({ page }, testInfo) => {
  23 |   await page.setContent(`
  24 |     <main style="font-family: Arial; padding: 24px">
  25 |       <h1>AIR failed evidence validation</h1>
  26 |       <p>This test intentionally fails so AIR can map per-test evidence.</p>
  27 |     </main>
  28 |   `);
  29 |   await testInfo.attach(`failure-attempt-${testInfo.retry}-note`, {
  30 |     body: Buffer.from(`Intentional failure attempt ${testInfo.retry}`),
  31 |     contentType: 'text/plain',
  32 |   });
  33 |   await testInfo.attach(`failure-attempt-${testInfo.retry}-screenshot`, {
  34 |     body: await page.screenshot(),
  35 |     contentType: 'image/png',
  36 |   });
  37 | 
  38 |   expect('intentional-failure').toBe('resolved');
  39 | });
  40 | 
```