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
  const txt = async (n) => (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, n);
  const buttons = async (label) => {
    const list = await page.locator('main button, main a').evaluateAll((els) =>
      els.map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim()).filter(Boolean));
    out.push(label + ' BUTTONS: ' + JSON.stringify(list));
  };
  out.push('OVERVIEW: ' + (await txt(1500)));
  await page.getByRole('tab', { name: /plans/i }).or(page.getByText(/^Plans$/)).first().click();
  await page.waitForTimeout(2000);
  await buttons('monthly-view');
  out.push('PLANS MONTHLY: ' + (await txt(2200)));
  const annual = page.getByRole('button', { name: /^annual/i }).first();
  if (await annual.isVisible().catch(() => false)) {
    await annual.click();
    await page.waitForTimeout(2000);
    await buttons('annual-view');
    out.push('PLANS ANNUAL: ' + (await txt(2800)));
    await page.screenshot({ path: 'scratch/plans-annual.png', fullPage: true });
  } else out.push('NO ANNUAL TOGGLE');
  fs.writeFileSync('scratch/probe.txt', out.join('\n\n'));
  await browser.close();
})().catch((e) => { fs.writeFileSync('scratch/probe.txt', 'ERR ' + e.message); process.exit(1); });
