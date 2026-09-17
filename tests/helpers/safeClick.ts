import { Locator } from '@playwright/test';

import {
  dismissOverlays
} from './dismissOverlays';
import {
  watchDelayMs
} from '../config/watchMode';

/* =============================================================================
HELPER: safeClick

PURPOSE
-------
Waits for a locator to become visible, scrolls it into view, then clicks it.
Overlays are dismissed first. Real clicks are used so cookie/announcement
layers cannot swallow Create Account, Sign up, profile, or Plans actions.
============================================================================= */

export async function safeClick(
  locator: Locator,
  label: string
) {
  console.log(`[CLICK] ${label}`);

  const page =
    locator.page();

  await dismissOverlays(
    page
  );

  await locator.waitFor({
    state: 'visible',
    timeout: 15000,
  });

  await locator.scrollIntoViewIfNeeded({
    timeout: 5000,
  }).catch(
    () => undefined
  );

  try {
    await locator.click({
      timeout: 8000,
    });
  } catch {
    await dismissOverlays(
      page
    );

    await locator.scrollIntoViewIfNeeded({
      timeout: 5000,
    }).catch(
      () => undefined
    );

    await locator.click({
      timeout: 8000,
    });
  }

  const watchDelay =
    watchDelayMs();

  if (watchDelay > 0) {
    await locator.page().waitForTimeout(
      watchDelay
    );
  }
}
