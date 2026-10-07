const fs = require('fs');
const p = 'tests/helpers/subscriptionScenarioPacks.ts';
let t = fs.readFileSync(p, 'utf8');
const eol = t.includes('\r\n') ? '\r\n' : '\n';
const oldBlock = [
  '  await openTransactions(ctx);',
  '',
  '  await ctx.page.waitForTimeout(1500);',
  '',
  '  return ctx.page',
  '    .getByText(/\\bpaid\\b/i)',
  '    .count();',
  '}'
].join(eol);
const newBlock = [
  '  await openTransactions(ctx);',
  '',
  '  const paid =',
  '    ctx.page.getByText(/\\bpaid\\b/i);',
  '',
  '  // Stripe transactions sync a moment after payment; every disposable',
  '  // user has at least the purchase, so wait for it before counting.',
  '  await expect',
  '    .poll(async () => paid.count(), { timeout: 20000 })',
  '    .toBeGreaterThan(0)',
  '    .catch(() => undefined);',
  '',
  '  await ctx.page.waitForTimeout(1500);',
  '',
  '  return paid.count();',
  '}'
].join(eol);
if (!t.includes(oldBlock)) {
  console.log('OLD BLOCK NOT FOUND (already patched?) ' + t.includes('Stripe transactions sync a moment'));
  process.exit(0);
}
fs.writeFileSync(p, t.replace(oldBlock, newBlock));
console.log('patched');
