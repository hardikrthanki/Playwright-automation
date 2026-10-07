# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AnnualMonthlyBillingChangeMatrix.spec.ts >> Annual To Monthly Billing Change Use Case 6 Matrix >> SC-217 - Invoice or credit note PDF opens after annual-to-monthly change
- Location: tests\AnnualMonthlyBillingChangeMatrix.spec.ts:393:13

# Error details

```
Error: Invoice PDF URL should serve a PDF document.

expect(received).toMatch(expected)

Expected pattern: /pdf/i
Received string:  "application/octet-stream"
```

# Test source

```ts
  2561 | 
  2562 |   try {
  2563 |     await pack.setup(ctx);
  2564 |   } catch (error) {
  2565 |     for (const stepName of Object.keys(
  2566 |       pack.steps
  2567 |     )) {
  2568 |       outcomes.set(
  2569 |         stepName,
  2570 |         error instanceof ScenarioSkip
  2571 |           ? {
  2572 |               status: 'skipped',
  2573 |               reason:
  2574 |                 `${error.reason} (user ${ctx.email || 'not created'})`
  2575 |             }
  2576 |           : {
  2577 |               status: 'failed',
  2578 |               error: new Error(
  2579 |                 `Scenario ${scenario} could not finish its setup flow (user ${ctx.email || 'not created'}): ${errorText(error)}`
  2580 |               )
  2581 |             }
  2582 |       );
  2583 |     }
  2584 | 
  2585 |     saveCachedPack(
  2586 |       scenario,
  2587 |       outcomes
  2588 |     );
  2589 | 
  2590 |     return outcomes;
  2591 |   }
  2592 | 
  2593 |   for (const [
  2594 |     stepName,
  2595 |     run
  2596 |   ] of Object.entries(pack.steps)) {
  2597 |     try {
  2598 |       await run(ctx);
  2599 | 
  2600 |       outcomes.set(
  2601 |         stepName,
  2602 |         { status: 'passed' }
  2603 |       );
  2604 |     } catch (error) {
  2605 |       if (
  2606 |         error instanceof ScenarioSkip
  2607 |       ) {
  2608 |         outcomes.set(
  2609 |           stepName,
  2610 |           {
  2611 |             status: 'skipped',
  2612 |             reason:
  2613 |               error.reason
  2614 |           }
  2615 |         );
  2616 |       } else {
  2617 |         console.log(
  2618 |           `[scenario] ${scenario}:${stepName} FAILED: ${errorText(error).replace(/\u001b\[[0-9;]*m/g, '').replace(/\s+/g, ' ').slice(0, 600)}`
  2619 |         );
  2620 | 
  2621 |         const pageText =
  2622 |           await ctx.page
  2623 |             .locator('main')
  2624 |             .innerText({
  2625 |               timeout: 3000
  2626 |             })
  2627 |             .then((text) =>
  2628 |               text
  2629 |                 .replace(/\s+/g, ' ')
  2630 |                 .slice(0, 900)
  2631 |             )
  2632 |             .catch(() => '');
  2633 | 
  2634 |         if (pageText) {
  2635 |           console.log(
  2636 |             `[scenario] ${scenario}:${stepName} page text: ${pageText}`
  2637 |           );
  2638 |         }
  2639 | 
  2640 |         outcomes.set(
  2641 |           stepName,
  2642 |           {
  2643 |             status: 'failed',
  2644 |             error
  2645 |           }
  2646 |         );
  2647 |       }
  2648 | 
  2649 |       await ctx.page.keyboard
  2650 |         .press('Escape')
  2651 |         .catch(() => undefined);
  2652 |     }
  2653 |   }
  2654 | 
  2655 |   saveCachedPack(
  2656 |     scenario,
  2657 |     outcomes
  2658 |   );
  2659 | 
  2660 |   return outcomes;
> 2661 | }
       |                        ^ Error: Invoice PDF URL should serve a PDF document.
  2662 | 
  2663 | /* Playwright restarts the worker after any failed test, which would lose the
  2664 |    in-memory results and make the next row create a second disposable user.
  2665 |    Results are therefore also stored per Playwright run (parent pid). */
  2666 | 
  2667 | const CACHE_MAX_AGE_MS =
  2668 |   4 * 60 * 60 * 1000;
  2669 | 
  2670 | function cacheFile(
  2671 |   scenario: string
  2672 | ) {
  2673 |   return path.join(
  2674 |     process.cwd(),
  2675 |     'test-results',
  2676 |     'scenario-cache',
  2677 |     process.env.SCENARIO_RUN_ID ??
  2678 |       String(process.ppid),
  2679 |     `${scenario}.json`
  2680 |   );
  2681 | }
  2682 | 
  2683 | function saveCachedPack(
  2684 |   scenario: string,
  2685 |   outcomes: Map<string, ScenarioOutcome>
  2686 | ) {
  2687 |   try {
  2688 |     const file =
  2689 |       cacheFile(scenario);
  2690 | 
  2691 |     fs.mkdirSync(
  2692 |       path.dirname(file),
  2693 |       { recursive: true }
  2694 |     );
  2695 | 
  2696 |     fs.writeFileSync(
  2697 |       file,
  2698 |       JSON.stringify(
  2699 |         [...outcomes.entries()].map(
  2700 |           ([step, outcome]) => ({
  2701 |             step,
  2702 |             status:
  2703 |               outcome.status,
  2704 |             reason:
  2705 |               outcome.status ===
  2706 |               'skipped'
  2707 |                 ? outcome.reason
  2708 |                 : undefined,
  2709 |             message:
  2710 |               outcome.status ===
  2711 |               'failed'
  2712 |                 ? errorText(
  2713 |                     outcome.error
  2714 |                   )
  2715 |                 : undefined
  2716 |           })
  2717 |         )
  2718 |       )
  2719 |     );
  2720 |   } catch {
  2721 |     // Cache is an optimisation only.
  2722 |   }
  2723 | }
  2724 | 
  2725 | function loadCachedPack(
  2726 |   scenario: string
  2727 | ) {
  2728 |   try {
  2729 |     const file =
  2730 |       cacheFile(scenario);
  2731 | 
  2732 |     const stat =
  2733 |       fs.statSync(file);
  2734 | 
  2735 |     if (
  2736 |       Date.now() - stat.mtimeMs >
  2737 |       CACHE_MAX_AGE_MS
  2738 |     ) {
  2739 |       return undefined;
  2740 |     }
  2741 | 
  2742 |     const rows = JSON.parse(
  2743 |       fs.readFileSync(
  2744 |         file,
  2745 |         'utf8'
  2746 |       )
  2747 |     ) as Array<{
  2748 |       step: string;
  2749 |       status: ScenarioOutcome['status'];
  2750 |       reason?: string;
  2751 |       message?: string;
  2752 |     }>;
  2753 | 
  2754 |     const outcomes =
  2755 |       new Map<string, ScenarioOutcome>();
  2756 | 
  2757 |     for (const row of rows) {
  2758 |       outcomes.set(
  2759 |         row.step,
  2760 |         row.status === 'passed'
  2761 |           ? { status: 'passed' }
```