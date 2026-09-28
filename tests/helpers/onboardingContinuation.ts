import {
  Page
} from '@playwright/test';

import { CompliancePage }
  from '../pages/CompliancePage';
import { RiskProfilePage }
  from '../pages/RiskProfilePage';

async function planSelectionIsVisible(
  page: Page
) {
  return page.getByRole(
    'heading',
    {
      name: /choose your plan/i
    }
  ).or(
    page.getByRole(
      'button',
      {
        name: /^monthly$/i
      }
    )
  ).first().isVisible().catch(
    () => false
  );
}

export async function completeRiskAndComplianceUnlessPlanReady(
  page: Page
) {
  const planOrRisk =
    page.getByRole(
      'heading',
      {
        name: /choose your plan/i
      }
    ).or(
      page.locator(
        '[role="combobox"]'
      ).first()
    ).or(
      page.getByRole(
        'button',
        {
          name: /save risk profile/i
        }
      )
    );

  await planOrRisk.first().waitFor({
    state: 'visible',
    timeout: 20000
  }).catch(
    () => undefined
  );

  if (
    await planSelectionIsVisible(
      page
    )
  ) {
    return;
  }

  await new RiskProfilePage(
    page
  ).fill();

  if (
    await planSelectionIsVisible(
      page
    )
  ) {
    return;
  }

  await new CompliancePage(
    page
  ).fill();
}
