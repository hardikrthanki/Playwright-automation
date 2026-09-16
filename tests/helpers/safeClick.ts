import { Locator } from '@playwright/test';

import {
  watchDelayMs
} from '../config/watchMode';

/* =============================================================================
HELPER: safeClick

PURPOSE
-------
Waits for a locator to become visible, scrolls it into view, then clicks it.
Use this for app controls that may render below the fold or after async loading.
============================================================================= */

export async function safeClick(
  locator: Locator,
  label: string
) {
  console.log(`[CLICK] ${label}`);

  await locator.waitFor({
    state: 'visible',
    timeout: 15000,
  });

  await locator.scrollIntoViewIfNeeded();

  await locator.click({
    force: true,
  });

  const watchDelay =
    watchDelayMs();

  if (watchDelay > 0) {
    await locator.page().waitForTimeout(
      watchDelay
    );
  }
}
