const fs = require('fs');

const map = {
  'DowngradeSubscriptionMatrix.spec.ts': { 'SC-164': 'air:downgrade-history' },
  'MonthlyAnnualBillingChangeMatrix.spec.ts': { 'SC-199': 'air:monthly-to-annual-history' },
  'AnnualMonthlyBillingChangeMatrix.spec.ts': { 'SC-238': 'air:annual-to-monthly-history' },
  'SubscriptionCancellationMatrix.spec.ts': { 'SC-297': 'air:cancellation-history', 'SC-298': 'air:cancellation-searchable' },
  'FailedPaymentDunningMatrix.spec.ts': { 'SC-349': 'air:failed-payment-evidence', 'SC-350': 'air:failed-payment-trend' }
};
for (const [file, rows] of Object.entries(map)) {
  const p = 'tests/' + file;
  let text = fs.readFileSync(p, 'utf8');
  for (const [id, target] of Object.entries(rows)) {
    const re = new RegExp(
      "(id: '" + id + "',[\\s\\S]*?)status: '(?:future|blocked|controlled)',(\\r?\\n\\s*)dependency: '(?:[^'\\\\]|\\\\.)*'"
    );
    if (!re.test(text)) {
      console.log('NO MATCH', file, id);
      continue;
    }
    text = text.replace(re, (m, head, ws) => head + "status: 'automated'," + ws + "automation: '" + target + "'");
    console.log('flipped', file, id);
  }
  fs.writeFileSync(p, text);
}

