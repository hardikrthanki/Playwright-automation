import {
  Locator,
  Page
} from '@playwright/test';

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

  try {
    await locator.waitFor({
      state: 'visible',
      timeout: 15000,
    });
  } catch {
    // A survey or cookie layer often appears a moment after the first
    // dismiss during a long run. Clear it and wait for the target again.
    await dismissOverlays(
      page
    );

    await locator.waitFor({
      state: 'visible',
      timeout: 15000,
    });
  }

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
    }).catch(
      async () => {
        await locator.click({
          force: true,
          timeout: 8000
        });
      }
    );
  }

  const watchDelay =
    watchDelayMs();

  if (watchDelay > 0) {
    await locator.page().waitForTimeout(
      watchDelay
    );
  }
}

export async function openHeaderMenuItem(
  page: Page,
  menuName: RegExp,
  itemName: RegExp,
  label: string
) {
  const menuButton =
    page.getByRole(
      'button',
      {
        name: menuName
      }
    ).first();

  const choices =
    () => [
      page.getByRole(
        'menuitem',
        {
          name: itemName
        }
      ).first(),
      page.getByRole(
        'option',
        {
          name: itemName
        }
      ).first(),
      page.getByRole(
        'link',
        {
          name: itemName
        }
      ).first()
    ];

  let visibleChoice: Locator | undefined;

  for (
    let attempt = 1;
    attempt <= 2 && !visibleChoice;
    attempt += 1
  ) {
    await safeClick(
      menuButton,
      `${label} menu`
    );

    for (const candidate of choices()) {
      if (
        await candidate.isVisible({
          timeout: 2000
        }).catch(
          () => false
        )
      ) {
        visibleChoice = candidate;
        break;
      }
    }
  }

  await safeClick(
    visibleChoice ??
      page.getByRole(
        'menuitem',
        {
          name: itemName
        }
      ).first(),
    label
  );
}
