# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DowngradeSubscriptionMatrix.spec.ts >> Downgrade Subscription Use Case 4 Matrix >> SC-151 - Downgrade target excludes plans that are not lower tier
- Location: tests\DowngradeSubscriptionMatrix.spec.ts:481:13

# Error details

```
Error: Overlay Strategists is not a lower plan than Overlay Strategists.

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

# Test source

```ts
  2910 |     'Income Builder',
  2911 |     'Overlay Strategists',
  2912 |     'Portfolio Hedger'
  2913 |   ];
  2914 | 
  2915 |   Logger.info(
  2916 |     'Checking downgrade actions point only at lower plans'
  2917 |   );
  2918 | 
  2919 |   await this.openPlansView();
  2920 | 
  2921 |   const currentPlan =
  2922 |     await this.page.evaluate(
  2923 |       () => {
  2924 |         const plans = [
  2925 |           {
  2926 |             name: 'Portfolio Hedger',
  2927 |             needles: ['portfolio hedger']
  2928 |           },
  2929 |           {
  2930 |             name: 'Overlay Strategists',
  2931 |             needles: ['overlay strategists']
  2932 |           },
  2933 |           {
  2934 |             name: 'Income Builder',
  2935 |             needles: ['income builder']
  2936 |           }
  2937 |         ];
  2938 | 
  2939 |         const nodes =
  2940 |           Array.from(
  2941 |             document.querySelectorAll(
  2942 |               'body *'
  2943 |             )
  2944 |           );
  2945 | 
  2946 |         for (const node of nodes) {
  2947 |           const text =
  2948 |             (
  2949 |               node.textContent ??
  2950 |               ''
  2951 |             ).toLowerCase();
  2952 | 
  2953 |           if (
  2954 |             !/current plan|current subscription/.test(
  2955 |               text
  2956 |             ) ||
  2957 |             text.length > 500
  2958 |           ) {
  2959 |             continue;
  2960 |           }
  2961 | 
  2962 |           const matches =
  2963 |             plans.filter(
  2964 |               (plan) =>
  2965 |                 plan.needles.some(
  2966 |                   (needle) =>
  2967 |                     text.includes(
  2968 |                       needle
  2969 |                     )
  2970 |                 )
  2971 |             );
  2972 | 
  2973 |           if (matches.length === 1) {
  2974 |             return matches[0].name;
  2975 |           }
  2976 |         }
  2977 | 
  2978 |         return '';
  2979 |       }
  2980 |     );
  2981 | 
  2982 |   expect(
  2983 |     order,
  2984 |     'Billing should show one current paid plan.'
  2985 |   ).toContain(
  2986 |     currentPlan
  2987 |   );
  2988 | 
  2989 |   const currentIndex =
  2990 |     order.indexOf(
  2991 |       currentPlan
  2992 |     );
  2993 | 
  2994 |   for (const planName of order) {
  2995 |     const available =
  2996 |       await this.planChangeActionAvailable(
  2997 |         planName,
  2998 |         'downgrade',
  2999 |         'monthly'
  3000 |       );
  3001 | 
  3002 |     if (
  3003 |       order.indexOf(
  3004 |         planName
  3005 |       ) >= currentIndex
  3006 |     ) {
  3007 |       expect(
  3008 |         available,
  3009 |         `${planName} is not a lower plan than ${currentPlan}.`
> 3010 |       ).toBe(
       |         ^ Error: Overlay Strategists is not a lower plan than Overlay Strategists.
  3011 |         false
  3012 |       );
  3013 |     }
  3014 |   }
  3015 | 
  3016 |   if (currentIndex > 0) {
  3017 |     expect(
  3018 |       await this.planChangeActionAvailable(
  3019 |         order[currentIndex - 1],
  3020 |         'downgrade',
  3021 |         'monthly'
  3022 |       ),
  3023 |       `${order[currentIndex - 1]} should be a downgrade from ${currentPlan}.`
  3024 |     ).toBe(
  3025 |       true
  3026 |     );
  3027 |   }
  3028 | 
  3029 |   Logger.success(
  3030 |     `Downgrade targets stay below ${currentPlan}`
  3031 |   );
  3032 | }
  3033 | 
  3034 | async planChangeActionAvailable(
  3035 |   planName: string,
  3036 |   action: PlanChangeAction,
  3037 |   interval: 'monthly' | 'annual'
  3038 | ) {
  3039 |   await this.openPlansView();
  3040 | 
  3041 |   await this.selectBillingIntervalIfAvailable(
  3042 |     interval
  3043 |   );
  3044 | 
  3045 |   try {
  3046 |     await this.findPlanActionButton(
  3047 |       planName,
  3048 |       action
  3049 |     );
  3050 | 
  3051 |     return true;
  3052 |   } catch {
  3053 |     if (action !== 'interval') {
  3054 |       return false;
  3055 |     }
  3056 | 
  3057 |     const intervalSwitch =
  3058 |       this.page.getByRole(
  3059 |         'button',
  3060 |         {
  3061 |           name: /^(?:switch)$|switch to annual|change to annual|to annual|switch to monthly|change to monthly|to monthly/i
  3062 |         }
  3063 |       ).first();
  3064 | 
  3065 |     return intervalSwitch.isVisible({
  3066 |       timeout: 3000
  3067 |     }).catch(
  3068 |       () => false
  3069 |     );
  3070 |   }
  3071 | }
  3072 | 
  3073 | private inAppCancelControl() {
  3074 |   return this.page
  3075 |     .locator(
  3076 |       'a, button'
  3077 |     )
  3078 |     .filter({
  3079 |       hasText:
  3080 |         /cancel (your )?subscription|cancel plan/i
  3081 |     })
  3082 |     .first();
  3083 | }
  3084 | 
  3085 | private cancelOptionControl(
  3086 |   host: Page,
  3087 |   pattern: RegExp
  3088 | ) {
  3089 |   return host
  3090 |     .getByRole(
  3091 |       'button',
  3092 |       {
  3093 |         name: pattern
  3094 |       }
  3095 |     )
  3096 |     .or(
  3097 |       host.getByRole(
  3098 |         'radio',
  3099 |         {
  3100 |           name: pattern
  3101 |         }
  3102 |       )
  3103 |     )
  3104 |     .or(
  3105 |       host.getByRole(
  3106 |         'link',
  3107 |         {
  3108 |           name: pattern
  3109 |         }
  3110 |       )
```