import { Locator } from '@playwright/test';

export async function safeClick(
  locator: Locator,
  label: string
) {
  console.log(`👉 ${label}`);

  await locator.waitFor({
    state: 'visible',
    timeout: 15000,
  });

  await locator.scrollIntoViewIfNeeded();

  await locator.click({
    force: true,
  });
}