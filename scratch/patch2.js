const fs = require('fs');
const p = 'tests/helpers/subscriptionScenarioPacks.ts';
let t = fs.readFileSync(p, 'utf8');
const crlf = t.includes('\r\n');
t = t.replace(/\r\n/g, '\n');

function swap(oldS, newS, label) {
  if (!t.includes(oldS)) {
    console.log('NOT FOUND: ' + label);
    return;
  }
  t = t.replace(oldS, newS);
  console.log('patched: ' + label);
}

swap(
  `      'overview-shows-scheduled-monthly':
        async (ctx) => {
          await ctx.billing.validateOverview();
`,
  `      'overview-shows-scheduled-monthly':
        async (ctx) => {
          await ctx.billing.validateOverview();

          // Tabs are sticky; make sure Overview (not History) is showing.
          await clickTab(
            ctx.billing.overviewTab
          );
`,
  'overview tab click'
);

swap(
  `      'no-extra-charge':
        async (ctx) => {
          await stepTransactionPaidCount(
            ctx,
            0
          );
        },`,
  `      // Cancelling at period end must leave the purchase as the only
      // charge: no second invoice, update, refund or credit note.
      'no-extra-charge':
        async (ctx) => {
          await openTransactions(ctx);

          await expect(
            ctx.page.locator('main')
          ).toContainText(
            /Subscription Create/i,
            {
              timeout: 20000
            }
          );

          const text =
            await mainText(ctx);

          const amounts =
            text.match(
              /USD\\s?[\\d,]+\\.\\d{2}/g
            ) ?? [];

          expect(
            amounts.length,
            \`Cancelling should not add a charge; Transactions show \${amounts.join(', ')}.\`
          ).toBe(1);

          expect(
            text
          ).not.toMatch(
            /Subscription (Update|Cancel)|refund|credit note/i
          );
        },`,
  'no-extra-charge'
);

fs.writeFileSync(p, crlf ? t.replace(/\n/g, '\r\n') : t);
