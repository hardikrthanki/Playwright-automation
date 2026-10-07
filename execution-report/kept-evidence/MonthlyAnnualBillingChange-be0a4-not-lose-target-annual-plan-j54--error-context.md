# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: MonthlyAnnualBillingChangeMatrix.spec.ts >> Monthly To Annual Billing Change Use Case 5 Matrix >> SC-187 - Browser refresh during interval change does not lose target annual plan
- Location: tests\MonthlyAnnualBillingChangeMatrix.spec.ts:361:13

# Error details

```
Error: Scenario PURCHASE_INCOME_MONTHLY has no step "refresh-keeps-annual-target".
```

# Test source

```ts
  2878 |         file,
  2879 |         'utf8'
  2880 |       )
  2881 |     ) as Array<{
  2882 |       step: string;
  2883 |       status: ScenarioOutcome['status'];
  2884 |       reason?: string;
  2885 |       message?: string;
  2886 |     }>;
  2887 | 
  2888 |     const outcomes =
  2889 |       new Map<string, ScenarioOutcome>();
  2890 | 
  2891 |     for (const row of rows) {
  2892 |       outcomes.set(
  2893 |         row.step,
  2894 |         row.status === 'passed'
  2895 |           ? { status: 'passed' }
  2896 |           : row.status === 'skipped'
  2897 |             ? {
  2898 |                 status: 'skipped',
  2899 |                 reason:
  2900 |                   row.reason ?? ''
  2901 |               }
  2902 |             : {
  2903 |                 status: 'failed',
  2904 |                 error: new Error(
  2905 |                   row.message ??
  2906 |                     'Scenario step failed earlier in this run.'
  2907 |                 )
  2908 |               }
  2909 |       );
  2910 |     }
  2911 | 
  2912 |     return outcomes;
  2913 |   } catch {
  2914 |     return undefined;
  2915 |   }
  2916 | }
  2917 | 
  2918 | export function isScenarioCoverageKey(
  2919 |   key: string
  2920 | ) {
  2921 |   return key.startsWith(
  2922 |     'scenario:'
  2923 |   );
  2924 | }
  2925 | 
  2926 | export async function runScenarioStep(
  2927 |   key: string,
  2928 |   page: Page
  2929 | ): Promise<ScenarioOutcome> {
  2930 |   const [
  2931 |     ,
  2932 |     scenarioName,
  2933 |     stepName
  2934 |   ] = key.split(':');
  2935 | 
  2936 |   const scenario =
  2937 |     scenarioName as ScenarioUserName;
  2938 | 
  2939 |   if (!PACKS[scenario]) {
  2940 |     return {
  2941 |       status: 'failed',
  2942 |       error: new Error(
  2943 |         `Unknown scenario "${scenarioName}" in ${key}.`
  2944 |       )
  2945 |     };
  2946 |   }
  2947 | 
  2948 |   let run =
  2949 |     packRuns.get(scenario);
  2950 | 
  2951 |   if (!run) {
  2952 |     const cached =
  2953 |       loadCachedPack(
  2954 |         scenario
  2955 |       );
  2956 | 
  2957 |     run = cached
  2958 |       ? Promise.resolve(
  2959 |           cached
  2960 |         )
  2961 |       : executePack(
  2962 |           scenario,
  2963 |           page
  2964 |         );
  2965 | 
  2966 |     packRuns.set(
  2967 |       scenario,
  2968 |       run
  2969 |     );
  2970 |   }
  2971 | 
  2972 |   const outcomes =
  2973 |     await run;
  2974 | 
  2975 |   return (
  2976 |     outcomes.get(stepName) ?? {
  2977 |       status: 'failed',
> 2978 |       error: new Error(
       |              ^ Error: Scenario PURCHASE_INCOME_MONTHLY has no step "refresh-keeps-annual-target".
  2979 |         `Scenario ${scenario} has no step "${stepName}".`
  2980 |       )
  2981 |     }
  2982 |   );
  2983 | }
  2984 | 
  2985 | export function listScenarioSteps() {
  2986 |   return Object.fromEntries(
  2987 |     Object.entries(PACKS).map(
  2988 |       ([name, pack]) => [
  2989 |         name,
  2990 |         Object.keys(pack.steps)
  2991 |       ]
  2992 |     )
  2993 |   );
  2994 | }
  2995 | 
```