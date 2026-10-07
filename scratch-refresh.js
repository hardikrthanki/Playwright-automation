const fs = require('fs');

function patch(file, edits) {
  let t = fs.readFileSync(file, 'utf8');
  const crlf = t.includes('\r\n');
  t = t.replace(/\r\n/g, '\n');
  for (const [label, oldS, newS] of edits) {
    if (!t.includes(oldS)) {
      console.log('NOT FOUND: ' + label);
      continue;
    }
    t = t.replace(oldS, newS);
    console.log('patched: ' + label);
  }
  fs.writeFileSync(file, crlf ? t.replace(/\n/g, '\r\n') : t);
}

const helper = `// A refresh in the middle of a plan change must not silently drop the
// target the user picked: the confirmation should come back for the same
// plan. Nothing is ever confirmed, so no charge or change is made.
async function stepRefreshKeepsTarget(
  ctx: PackContext,
  options: {
    targetPlan: PaidPlan;
    action: 'upgrade' | 'downgrade' | 'interval';
    interval: Interval;
    targetPattern: RegExp;
    label: string;
  }
) {
  await ctx.billing.validateOverview();

  await ctx.billing.openPlanChangeCalculationPreview({
    targetPlan: options.targetPlan,
    action: options.action,
    interval: options.interval
  });

  await ctx.page.reload({
    waitUntil: 'domcontentloaded'
  });

  const dialog =
    ctx.page
      .locator(
        '[role="dialog"], [role="alertdialog"]'
      )
      .first();

  const restored =
    await dialog
      .isVisible({ timeout: 10000 })
      .catch(() => false);

  expect(
    restored,
    \`After a browser refresh the \${options.label} confirmation closed, so the selected target (\${options.targetPlan} \${options.interval}) was lost. Nothing was charged or changed; the user has to pick the plan again.\`
  ).toBeTruthy();

  expect(
    await dialog.innerText(),
    \`The confirmation shown after refresh should still be for \${options.targetPlan} \${options.interval}.\`
  ).toMatch(options.targetPattern);
}

async function readDowngradeDialog(`;

patch('tests/helpers/subscriptionScenarioPacks.ts', [
  ['helper', 'async function readDowngradeDialog(', helper],
  [
    'upgrade pack downgrade refresh',
    `    steps['single-active-plan'] =
      stepExactlyOneCurrentPlan;
  }

  return {
    setup: async (ctx) => {`,
    `    steps['single-active-plan'] =
      stepExactlyOneCurrentPlan;

    steps['refresh-keeps-downgrade-target'] =
      async (ctx) => {
        await stepRefreshKeepsTarget(ctx, {
          targetPlan: 'Income Builder',
          action: 'downgrade',
          interval: 'monthly',
          targetPattern: /income/i,
          label: 'downgrade'
        });
      };
  }

  return {
    setup: async (ctx) => {`
  ],
  [
    'purchase pack interval refresh',
    `      'single-active-plan':
        stepExactlyOneCurrentPlan
    }
  },

  PURCHASE_DOUBLE_CLICK_INCOME_MONTHLY: {`,
    `      'single-active-plan':
        stepExactlyOneCurrentPlan,

      'refresh-keeps-annual-target':
        async (ctx) => {
          await stepRefreshKeepsTarget(ctx, {
            targetPlan: 'Income Builder',
            action: 'interval',
            interval: 'annual',
            targetPattern: /annual|year|\\/yr/i,
            label: 'monthly-to-annual'
          });
        }
    }
  },

  PURCHASE_DOUBLE_CLICK_INCOME_MONTHLY: {`
  ],
  [
    'm2a pack upgrade + monthly refresh',
    `      'single-active-plan':
        stepExactlyOneCurrentPlan
    }
  },

  INTERVAL_INCOME_ANNUAL_TO_MONTHLY: {`,
    `      'single-active-plan':
        stepExactlyOneCurrentPlan,

      // The user ends this pack on Income annual, so an upgrade to Overlay
      // and a switch back to monthly are both available to preview.
      'refresh-keeps-upgrade-target':
        async (ctx) => {
          await stepRefreshKeepsTarget(ctx, {
            targetPlan: 'Overlay Strategists',
            action: 'upgrade',
            interval: 'annual',
            targetPattern: /overlay/i,
            label: 'upgrade'
          });
        },

      'refresh-keeps-monthly-target':
        async (ctx) => {
          await stepRefreshKeepsTarget(ctx, {
            targetPlan: 'Income Builder',
            action: 'interval',
            interval: 'monthly',
            targetPattern: /monthly|month|\\/mo/i,
            label: 'annual-to-monthly'
          });
        }
    }
  },

  INTERVAL_INCOME_ANNUAL_TO_MONTHLY: {`
  ]
]);

// Matrix rows
const rows = {
  'tests/UpgradeSubscriptionMatrix.spec.ts': {
    'SC-106': 'INTERVAL_INCOME_MONTHLY_TO_ANNUAL:refresh-keeps-upgrade-target'
  },
  'tests/DowngradeSubscriptionMatrix.spec.ts': {
    'SC-148': 'UPGRADE_INCOME_MONTHLY_TO_OVERLAY_MONTHLY:refresh-keeps-downgrade-target'
  },
  'tests/MonthlyAnnualBillingChangeMatrix.spec.ts': {
    'SC-187': 'PURCHASE_INCOME_MONTHLY:refresh-keeps-annual-target'
  },
  'tests/AnnualMonthlyBillingChangeMatrix.spec.ts': {
    'SC-223': 'INTERVAL_INCOME_MONTHLY_TO_ANNUAL:refresh-keeps-monthly-target'
  }
};

for (const [file, map] of Object.entries(rows)) {
  let text = fs.readFileSync(file, 'utf8');
  for (const [id, target] of Object.entries(map)) {
    const re = new RegExp(
      "(id: '" + id + "',[\\s\\S]*?)status: '(?:future|blocked|controlled)',(\\r?\\n\\s*)dependency: '(?:[^'\\\\]|\\\\.)*'"
    );
    if (!re.test(text)) {
      console.log('NO MATCH', file, id);
      continue;
    }
    text = text.replace(
      re,
      (m, head, ws) => head + "status: 'automated'," + ws + "automation: 'scenario:" + target + "'"
    );
    console.log('flipped', id);
  }
  fs.writeFileSync(file, text);
}
