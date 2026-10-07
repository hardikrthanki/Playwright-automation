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
  await page.waitForTimeout(4000);
  await page.getByRole('tab', { name: /^plans/i }).or(page.getByText(/^Plans$/)).first().click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: /^annual/i }).first().click();
  await page.waitForTimeout(1500);
  const btns = await page.locator('main button').evaluateAll((els) => els.map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim()));
  out.push('BUTTONS: ' + JSON.stringify(btns));
  // click the Upgrade button inside the card containing "Overlay Strategists"
  const card = page.locator('div').filter({ hasText: /^Overlay Strategists/ }).filter({ has: page.getByRole('button', { name: /upgrade|current|switch/i }) }).last();
  out.push('CARD: ' + (await card.innerText().catch(() => 'none')).replace(/\s+/g, ' ').slice(0, 600));
  const up = card.getByRole('button', { name: /upgrade|switch/i }).first();
  out.push('UP visible: ' + (await up.isVisible().catch(() => false)));
  await up.click();
  await page.waitForTimeout(3500);
  const dialogs = await page.locator('[role="dialog"], [role="alertdialog"]').evaluateAll((els) => els.map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 1500)));
  out.push('DIALOGS: ' + JSON.stringify(dialogs));
  out.push('URL: ' + page.url());
  out.push('MAIN: ' + (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 1500));
  await page.screenshot({ path: 'scratch/m2a-click.png' });
  fs.writeFileSync('scratch/probe3.txt', out.join('\n\n'));
  await browser.close();
})().catch((e) => { fs.writeFileSync('scratch/probe3.txt', 'ERR ' + e.message); process.exit(1); });
