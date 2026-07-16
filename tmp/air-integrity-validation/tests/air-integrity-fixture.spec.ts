import { expect, test } from '@playwright/test';

test('Retry Validation - fails first attempt then passes on retry', async ({ page }, testInfo) => {
  await page.setContent(`
    <main style="font-family: Arial; padding: 24px">
      <h1>AIR retry validation</h1>
      <p>Attempt ${testInfo.retry}</p>
    </main>
  `);
  await testInfo.attach(`retry-attempt-${testInfo.retry}-note`, {
    body: Buffer.from(`Retry validation attempt ${testInfo.retry}`),
    contentType: 'text/plain',
  });
  await testInfo.attach(`retry-attempt-${testInfo.retry}-screenshot`, {
    body: await page.screenshot(),
    contentType: 'image/png',
  });

  expect(testInfo.retry).toBe(1);
});

test('Failure Evidence - fails with screenshot trace and note evidence', async ({ page }, testInfo) => {
  await page.setContent(`
    <main style="font-family: Arial; padding: 24px">
      <h1>AIR failed evidence validation</h1>
      <p>This test intentionally fails so AIR can map per-test evidence.</p>
    </main>
  `);
  await testInfo.attach(`failure-attempt-${testInfo.retry}-note`, {
    body: Buffer.from(`Intentional failure attempt ${testInfo.retry}`),
    contentType: 'text/plain',
  });
  await testInfo.attach(`failure-attempt-${testInfo.retry}-screenshot`, {
    body: await page.screenshot(),
    contentType: 'image/png',
  });

  expect('intentional-failure').toBe('resolved');
});
