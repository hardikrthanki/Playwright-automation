# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AnnualMonthlyBillingChangeMatrix.spec.ts >> Annual To Monthly Billing Change Use Case 6 Matrix >> SC-223 - Browser refresh during annual-to-monthly flow does not lose selected target monthly plan
- Location: tests\AnnualMonthlyBillingChangeMatrix.spec.ts:393:13

# Error details

```
Error: Scenario INTERVAL_INCOME_MONTHLY_TO_ANNUAL has no step "refresh-keeps-monthly-target".
```

# Test source

```ts
  2878 |     }
  2879 | 
  2880 |     const rows = JSON.parse(
  2881 |       fs.readFileSync(
  2882 |         file,
  2883 |         'utf8'
  2884 |       )
  2885 |     ) as Array<{
  2886 |       step: string;
  2887 |       status: ScenarioOutcome['status'];
  2888 |       reason?: string;
  2889 |       message?: string;
  2890 |     }>;
  2891 | 
  2892 |     const outcomes =
  2893 |       new Map<string, ScenarioOutcome>();
  2894 | 
  2895 |     for (const row of rows) {
  2896 |       outcomes.set(
  2897 |         row.step,
  2898 |         row.status === 'passed'
  2899 |           ? { status: 'passed' }
  2900 |           : row.status === 'skipped'
  2901 |             ? {
  2902 |                 status: 'skipped',
  2903 |                 reason:
  2904 |                   row.reason ?? ''
  2905 |               }
  2906 |             : {
  2907 |                 status: 'failed',
  2908 |                 error: new Error(
  2909 |                   row.message ??
  2910 |                     'Scenario step failed earlier in this run.'
  2911 |                 )
  2912 |               }
  2913 |       );
  2914 |     }
  2915 | 
  2916 |     return outcomes;
  2917 |   } catch {
  2918 |     return undefined;
  2919 |   }
  2920 | }
  2921 | 
  2922 | export function isScenarioCoverageKey(
  2923 |   key: string
  2924 | ) {
  2925 |   return key.startsWith(
  2926 |     'scenario:'
  2927 |   );
  2928 | }
  2929 | 
  2930 | export async function runScenarioStep(
  2931 |   key: string,
  2932 |   page: Page
  2933 | ): Promise<ScenarioOutcome> {
  2934 |   const [
  2935 |     ,
  2936 |     scenarioName,
  2937 |     stepName
  2938 |   ] = key.split(':');
  2939 | 
  2940 |   const scenario =
  2941 |     scenarioName as ScenarioUserName;
  2942 | 
  2943 |   if (!PACKS[scenario]) {
  2944 |     return {
  2945 |       status: 'failed',
  2946 |       error: new Error(
  2947 |         `Unknown scenario "${scenarioName}" in ${key}.`
  2948 |       )
  2949 |     };
  2950 |   }
  2951 | 
  2952 |   let run =
  2953 |     packRuns.get(scenario);
  2954 | 
  2955 |   if (!run) {
  2956 |     const cached =
  2957 |       loadCachedPack(
  2958 |         scenario
  2959 |       );
  2960 | 
  2961 |     run = cached
  2962 |       ? Promise.resolve(
  2963 |           cached
  2964 |         )
  2965 |       : executePack(
  2966 |           scenario,
  2967 |           page
  2968 |         );
  2969 | 
  2970 |     packRuns.set(
  2971 |       scenario,
  2972 |       run
  2973 |     );
  2974 |   }
  2975 | 
  2976 |   const outcomes =
  2977 |     await run;
> 2978 | 
       |              ^ Error: Scenario INTERVAL_INCOME_MONTHLY_TO_ANNUAL has no step "refresh-keeps-monthly-target".
  2979 |   return (
  2980 |     outcomes.get(stepName) ?? {
  2981 |       status: 'failed',
  2982 |       error: new Error(
  2983 |         `Scenario ${scenario} has no step "${stepName}".`
  2984 |       )
  2985 |     }
  2986 |   );
  2987 | }
  2988 | 
  2989 | export function listScenarioSteps() {
  2990 |   return Object.fromEntries(
  2991 |     Object.entries(PACKS).map(
  2992 |       ([name, pack]) => [
  2993 |         name,
  2994 |         Object.keys(pack.steps)
  2995 |       ]
  2996 |     )
  2997 |   );
  2998 | }
  2999 | 
```