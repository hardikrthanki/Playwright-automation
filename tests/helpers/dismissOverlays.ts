import {
  Page
} from '@playwright/test';

/* =============================================================================
HELPER: dismissOverlays

PURPOSE
-------
Closes the UAT cookie banner and beta announcement so they cannot steal
clicks from Sign up, Create Account, profile menu, or billing tabs.
Playwright force-clicks hit whatever sits at the button's center, so these
overlays must be gone before a real click.
============================================================================= */

export async function dismissOverlays(
  page: Page
) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const overlayButton =
      page.getByRole(
        'button',
        {
          name: /^(essential only|accept( all)?|allow essential cookies|dismiss announcement)$/i
        }
      ).or(
        page.getByRole(
          'button',
          {
            name: /dismiss announcement/i
          }
        )
      ).first();

    const overlayVisible =
      await overlayButton.isVisible().catch(
        () => false
      );

    if (!overlayVisible) {
      return;
    }

    await overlayButton.click({
      timeout: 3000
    }).catch(
      () => overlayButton.click({
        force: true,
        timeout: 3000
      }).catch(
        () => undefined
      )
    );

    await page.waitForTimeout(
      250
    );
  }
}
