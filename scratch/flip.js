const fs = require('fs');

const map = {
  'MonthlyAnnualBillingChangeMatrix.spec.ts': {
    'SC-178': 'INTERVAL_INCOME_MONTHLY_TO_ANNUAL:subscription-history',
    'SC-181': 'INTERVAL_INCOME_MONTHLY_TO_ANNUAL:invoice-pdf-opens',
    'SC-196': 'INTERVAL_INCOME_MONTHLY_TO_ANNUAL:annual-savings-message'
  },
  'AnnualMonthlyBillingChangeMatrix.spec.ts': {
    'SC-214': 'INTERVAL_INCOME_ANNUAL_TO_MONTHLY:subscription-history',
    'SC-217': 'INTERVAL_INCOME_ANNUAL_TO_MONTHLY:invoice-pdf-opens',
    'SC-232': 'INTERVAL_INCOME_ANNUAL_TO_MONTHLY:loss-of-savings-message',
    'SC-235': 'INTERVAL_INCOME_ANNUAL_TO_MONTHLY:overview-shows-scheduled-monthly'
  },
  'UpgradeSubscriptionMatrix.spec.ts': {
    'SC-94': 'UPGRADE_INCOME_MONTHLY_TO_OVERLAY_MONTHLY:invoice-pdf-opens'
  },
  'SubscriptionCancellationMatrix.spec.ts': {
    'SC-247': 'CANCEL_INCOME_MONTHLY_AT_PERIOD_END:reason-required',
    'SC-250': 'CANCEL_INCOME_MONTHLY_AT_PERIOD_END:final-confirmation-before-cancel',
    'SC-281': 'CANCEL_INCOME_MONTHLY_AT_PERIOD_END:upgrade-after-scheduled-cancel',
    'SC-282': 'CANCEL_INCOME_MONTHLY_AT_PERIOD_END:payment-method-after-cancel',
    'SC-288': 'CANCEL_INCOME_MONTHLY_AT_PERIOD_END:history-entry',
    'SC-289': 'CANCEL_INCOME_MONTHLY_AT_PERIOD_END:no-extra-charge',
    'SC-292': 'CANCEL_INCOME_MONTHLY_AT_PERIOD_END:reason-required',
    'SC-293': 'CANCEL_INCOME_MONTHLY_AT_PERIOD_END:feedback-max-length',
    'SC-294': 'CANCEL_INCOME_MONTHLY_AT_PERIOD_END:policy-link',
    'SC-295': 'CANCEL_INCOME_MONTHLY_AT_PERIOD_END:support-contact'
  }
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
    text = text.replace(re, (m, head, ws) => head + "status: 'automated'," + ws + "automation: 'scenario:" + target + "'");
    console.log('flipped', file, id);
  }
  fs.writeFileSync(p, text);
}
