# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AnnualMonthlyBillingChangeMatrix.spec.ts >> Annual To Monthly Billing Change Use Case 6 Matrix >> SC-235 - Annual-to-monthly change is represented correctly in billing overview
- Location: tests\AnnualMonthlyBillingChangeMatrix.spec.ts:393:13

# Error details

```
Error: Billing overview should show the scheduled switch to monthly billing and its effective date.

expect(locator).toContainText(expected) failed

Locator: locator('main')
Expected pattern: /(switch|change|billing)[\s\S]{0,60}monthly[\s\S]{0,120}(scheduled|takes effect)|scheduled[\s\S]{0,80}monthly/i
Received string:  "Billing & SubscriptionManage your plan, payment methods, and billing history.OverviewPlansHistoryBilling HistorySubscription changes and Stripe invoice transactions.Subscription HistoryTransactionsSyncGPISI7IF-0001paidAnnualSubscription Create · Oct 7, 2026, 4:47 PMInvoice PDF USD 290.00Danger ZoneCancelling will end your paid plan at the end of the current billing period. You'll retain access to paid features until then.Cancel Subscription"
Timeout: 15000ms

Call log:
  - Billing overview should show the scheduled switch to monthly billing and its effective date. with timeout 15000ms
  - waiting for locator('main')
    18 × locator resolved to <main class="container flex-1 px-4 py-8">…</main>
       - unexpected value "Billing & SubscriptionManage your plan, payment methods, and billing history.OverviewPlansHistoryBilling HistorySubscription changes and Stripe invoice transactions.Subscription HistoryTransactionsSyncGPISI7IF-0001paidAnnualSubscription Create · Oct 7, 2026, 4:47 PMInvoice PDF USD 290.00Danger ZoneCancelling will end your paid plan at the end of the current billing period. You'll retain access to paid features until then.Cancel Subscription"

```

# Test source

```ts
  2678 | function cacheFile(
  2679 |   scenario: string
  2680 | ) {
  2681 |   return path.join(
  2682 |     process.cwd(),
  2683 |     'test-results',
  2684 |     'scenario-cache',
  2685 |     process.env.SCENARIO_RUN_ID ??
  2686 |       String(process.ppid),
  2687 |     `${scenario}.json`
  2688 |   );
  2689 | }
  2690 | 
  2691 | function saveCachedPack(
  2692 |   scenario: string,
  2693 |   outcomes: Map<string, ScenarioOutcome>
  2694 | ) {
  2695 |   try {
  2696 |     const file =
  2697 |       cacheFile(scenario);
  2698 | 
  2699 |     fs.mkdirSync(
  2700 |       path.dirname(file),
  2701 |       { recursive: true }
  2702 |     );
  2703 | 
  2704 |     fs.writeFileSync(
  2705 |       file,
  2706 |       JSON.stringify(
  2707 |         [...outcomes.entries()].map(
  2708 |           ([step, outcome]) => ({
  2709 |             step,
  2710 |             status:
  2711 |               outcome.status,
  2712 |             reason:
  2713 |               outcome.status ===
  2714 |               'skipped'
  2715 |                 ? outcome.reason
  2716 |                 : undefined,
  2717 |             message:
  2718 |               outcome.status ===
  2719 |               'failed'
  2720 |                 ? errorText(
  2721 |                     outcome.error
  2722 |                   )
  2723 |                 : undefined
  2724 |           })
  2725 |         )
  2726 |       )
  2727 |     );
  2728 |   } catch {
  2729 |     // Cache is an optimisation only.
  2730 |   }
  2731 | }
  2732 | 
  2733 | function loadCachedPack(
  2734 |   scenario: string
  2735 | ) {
  2736 |   try {
  2737 |     const file =
  2738 |       cacheFile(scenario);
  2739 | 
  2740 |     const stat =
  2741 |       fs.statSync(file);
  2742 | 
  2743 |     if (
  2744 |       Date.now() - stat.mtimeMs >
  2745 |       CACHE_MAX_AGE_MS
  2746 |     ) {
  2747 |       return undefined;
  2748 |     }
  2749 | 
  2750 |     const rows = JSON.parse(
  2751 |       fs.readFileSync(
  2752 |         file,
  2753 |         'utf8'
  2754 |       )
  2755 |     ) as Array<{
  2756 |       step: string;
  2757 |       status: ScenarioOutcome['status'];
  2758 |       reason?: string;
  2759 |       message?: string;
  2760 |     }>;
  2761 | 
  2762 |     const outcomes =
  2763 |       new Map<string, ScenarioOutcome>();
  2764 | 
  2765 |     for (const row of rows) {
  2766 |       outcomes.set(
  2767 |         row.step,
  2768 |         row.status === 'passed'
  2769 |           ? { status: 'passed' }
  2770 |           : row.status === 'skipped'
  2771 |             ? {
  2772 |                 status: 'skipped',
  2773 |                 reason:
  2774 |                   row.reason ?? ''
  2775 |               }
  2776 |             : {
  2777 |                 status: 'failed',
> 2778 |                 error: new Error(
       |                        ^ Error: Billing overview should show the scheduled switch to monthly billing and its effective date.
  2779 |                   row.message ??
  2780 |                     'Scenario step failed earlier in this run.'
  2781 |                 )
  2782 |               }
  2783 |       );
  2784 |     }
  2785 | 
  2786 |     return outcomes;
  2787 |   } catch {
  2788 |     return undefined;
  2789 |   }
  2790 | }
  2791 | 
  2792 | export function isScenarioCoverageKey(
  2793 |   key: string
  2794 | ) {
  2795 |   return key.startsWith(
  2796 |     'scenario:'
  2797 |   );
  2798 | }
  2799 | 
  2800 | export async function runScenarioStep(
  2801 |   key: string,
  2802 |   page: Page
  2803 | ): Promise<ScenarioOutcome> {
  2804 |   const [
  2805 |     ,
  2806 |     scenarioName,
  2807 |     stepName
  2808 |   ] = key.split(':');
  2809 | 
  2810 |   const scenario =
  2811 |     scenarioName as ScenarioUserName;
  2812 | 
  2813 |   if (!PACKS[scenario]) {
  2814 |     return {
  2815 |       status: 'failed',
  2816 |       error: new Error(
  2817 |         `Unknown scenario "${scenarioName}" in ${key}.`
  2818 |       )
  2819 |     };
  2820 |   }
  2821 | 
  2822 |   let run =
  2823 |     packRuns.get(scenario);
  2824 | 
  2825 |   if (!run) {
  2826 |     const cached =
  2827 |       loadCachedPack(
  2828 |         scenario
  2829 |       );
  2830 | 
  2831 |     run = cached
  2832 |       ? Promise.resolve(
  2833 |           cached
  2834 |         )
  2835 |       : executePack(
  2836 |           scenario,
  2837 |           page
  2838 |         );
  2839 | 
  2840 |     packRuns.set(
  2841 |       scenario,
  2842 |       run
  2843 |     );
  2844 |   }
  2845 | 
  2846 |   const outcomes =
  2847 |     await run;
  2848 | 
  2849 |   return (
  2850 |     outcomes.get(stepName) ?? {
  2851 |       status: 'failed',
  2852 |       error: new Error(
  2853 |         `Scenario ${scenario} has no step "${stepName}".`
  2854 |       )
  2855 |     }
  2856 |   );
  2857 | }
  2858 | 
  2859 | export function listScenarioSteps() {
  2860 |   return Object.fromEntries(
  2861 |     Object.entries(PACKS).map(
  2862 |       ([name, pack]) => [
  2863 |         name,
  2864 |         Object.keys(pack.steps)
  2865 |       ]
  2866 |     )
  2867 |   );
  2868 | }
  2869 | 
```