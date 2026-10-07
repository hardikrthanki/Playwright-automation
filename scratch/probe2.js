const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const out = [];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto('https://uat.ooltool.com/login', { waitUntil: 'domcontentloaded' });
  await page.getByRole('textbox', { name: /^email$/i }).fill(process.env.PROBE_EMAIL);
  await page.getByRole('textbox', { name: /^password$/i }).fill(process.env.PROBE_PASSWORD);
  await page.getByRole('button', { name: /^(sign in|log in)$/i }).click();
  await page.waitForURL(/dashboard|onboarding/, { timeout: 60000 });
  await page.goto('https://uat.ooltool.com/dashboard/billing', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  // History tab
  await page.getByRole('tab', { name: /history/i }).or(page.getByText(/^History$/)).first().click();
  await page.waitForTimeout(2000);
  out.push('HISTORY: ' + (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 2500));
  const links = await page.locator('main a').evaluateAll((els) =>
    els.map((e) => ((e.textContent ?? '').replace(/\s+/g, ' ').trim() + ' -> ' + e.getAttribute('href') + ' target=' + e.getAttribute('target'))));
  out.push('HISTORY LINKS: ' + JSON.stringify(links));
  await page.getByRole('tab', { name: /^transactions/i }).or(page.getByText(/^Transactions$/)).first().click().catch(() => {});
  await page.waitForTimeout(2000);
  const links2 = await page.locator('main a').evaluateAll((els) =>
    els.map((e) => ((e.textContent ?? '').replace(/\s+/g, ' ').trim() + ' -> ' + e.getAttribute('href') + ' target=' + e.getAttribute('target'))));
  out.push('TX LINKS: ' + JSON.stringify(links2));

  // Cancel dialog (read only)
  await page.getByRole('tab', { name: /overview/i }).or(page.getByText(/^Overview$/)).first().click();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: /^cancel subscription$/i }).first().click();
  await page.waitForTimeout(2500);
  const dlg = page.locator('[role="dialog"], [role="alertdialog"]').first();
  out.push('CANCEL DIALOG: ' + ((await dlg.innerText().catch(() => 'NO DIALOG')) || '').replace(/\s+/g, ' '));
  out.push('DIALOG BUTTONS: ' + JSON.stringify(await dlg.locator('button').evaluateAll((els) => els.map((e) => ({ t: (e.textContent ?? '').trim(), d: e.disabled })))));
  out.push('DIALOG FIELDS: ' + JSON.stringify(await dlg.locator('textarea, input, select, [role="combobox"], [role="radio"]').evaluateAll((els) => els.map((e) => ({ tag: e.tagName, type: e.type, name: e.name, ph: e.placeholder, max: e.maxLength, req: e.required, aria: e.getAttribute('aria-label') })))));
  out.push('DIALOG LINKS: ' + JSON.stringify(await dlg.locator('a').evaluateAll((els) => els.map((e) => ((e.textContent ?? '').trim() + ' -> ' + e.getAttribute('href'))))));
  await page.screenshot({ path: 'scratch/cancel-dialog.png' });
  fs.writeFileSync('scratch/probe2.txt', out.join('\n\n'));
  await page.keyboard.press('Escape');
  await browser.close();
})().catch((e) => { fs.writeFileSync('scratch/probe2.txt', 'ERR ' + e.message); process.exit(1); });
