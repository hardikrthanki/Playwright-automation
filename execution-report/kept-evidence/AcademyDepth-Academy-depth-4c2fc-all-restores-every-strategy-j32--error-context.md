# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AcademyDepth.spec.ts >> Academy depth >> Strategy library clear all restores every strategy
- Location: tests\AcademyDepth.spec.ts:1023:9

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('main')
Expected pattern: /2 of 18/i
Received string:  "AcademyA self-paced library of options-strategy references, lessons, and definitions.Educational content only - this app does not place trades or provide investment advice.BeginnersOverviewLessonsStrategy LibraryGlossaryStrategy LibraryBrowse 18 options strategies across six categories. Filter by market view, objective, risk profile, and complexity to narrow down what's relevant to you.All18Income5Directional4Protection2Volatility4Precision1Advanced2FiltersMarket viewAny viewObjectiveAny objectiveRisk typeAny riskComplexityAny levelSearch18 of 18 strategiesIncomeBeginnerCovered CallSell one call option against 100 shares you already own.Market viewNeutralObjectiveIncomeMax gainPremium + (strike − cost basis)Max lossCost basis − premium (if shares fall to zero)Risk profileUndefined riskGreek exposureΔΘνΓIdeal environmentFlat to mildly rising prices with moderate implied volatility.Key risks•Caps upside above the strike.•Shares can be called away at the strike.•Full downside on the share leg, less the premium collected.Explore Scenario IncomeBeginnerCash-Secured PutSell a put while holding cash to buy 100 shares at the strike if assigned.Market viewBullishObjectiveIncomeMax gainPremium receivedMax loss(Strike × 100) − premium (if shares fall to zero after assignment)Risk profileDefined riskGreek exposureΔΘνΓIdeal environmentStable to mildly rising prices and a willingness to take ownership of the shares.Key risks•Assignment of shares at the strike.•Share price can fall below the strike before or after assignment.•Capital is tied up as collateral until expiration.Explore Scenario DirectionalBeginnerLong CallBuy a call to participate in upside above the strike.Market viewBullishObjectiveSpeculationMax gainTheoretically unlimited above the strikeMax lossPremium paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentSharp upward moves with expanding implied volatility.Key risks•Time decay erodes value daily.•Underlying stays at or below the strike at expiration.•IV contraction reduces option price even if direction is correct.Explore Scenario DirectionalBeginnerLong PutBuy a put to participate in downside below the strike.Market viewBearishObjectiveSpeculationMax gain(Strike × 100) − premium (if shares fall to zero)Max lossPremium paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentSharp downward moves with expanding implied volatility.Key risks•Time decay erodes value daily.•Underlying stays at or above the strike at expiration.•IV contraction reduces option price.Explore Scenario DirectionalIntermediateBull Call SpreadBuy a call and sell a higher-strike call in the same expiration.Market viewBullishObjectiveDefined riskMax gainDifference between strikes − net debitMax lossNet debit paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentModerate upward move that finishes between the two strikes.Key risks•Gain capped at the upper strike.•Time decay if the underlying stays range-bound.•Early assignment risk on the short leg before expiration.Explore Scenario DirectionalIntermediateBear Put SpreadBuy a put and sell a lower-strike put in the same expiration.Market viewBearishObjectiveDefined riskMax gainDifference between strikes − net debitMax lossNet debit paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentModerate downward move that finishes between the two strikes.Key risks•Gain capped at the lower strike.•Time decay if the underlying stays range-bound.•Early assignment risk on the short leg.Explore Scenario IncomeIntermediateBull Put SpreadSell a put and buy a lower-strike put for a net credit.Market viewBullishObjectiveIncomeMax gainNet credit receivedMax lossWidth of strikes − net creditRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentStable to mildly rising prices with elevated implied volatility.Key risks•Underlying drops through the long strike.•Assignment of the short leg before expiration.•IV expansion increases the cost to close.Explore Scenario IncomeIntermediateBear Call SpreadSell a call and buy a higher-strike call for a net credit.Market viewBearishObjectiveIncomeMax gainNet credit receivedMax lossWidth of strikes − net creditRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentStable to mildly falling prices with elevated implied volatility.Key risks•Underlying rallies through the long strike.•Assignment of the short leg before expiration.•IV expansion increases the cost to close.Explore Scenario IncomeIntermediateIron CondorCombine a bull put spread and a bear call spread on the same expiration.Market viewRange-boundObjectiveIncomeMax gainNet credit receivedMax lossWidth of widest spread − net creditRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentRange-bound prices with elevated implied volatility that contracts over time.Key risks•Breakout in either direction beyond the short strikes.•IV expansion increases the cost to close.•Pinning risk near a short strike at expiration.Explore Scenario VolatilityAdvancedCalendar SpreadSell a near-dated option and buy a longer-dated option at the same strike.Market viewNeutralObjectiveVolatilityMax gainVariable; depends on IV and price at front-month expirationMax lossNet debit paid (typically)Risk profileDefined riskGreek exposureΔΘνΓIdeal environmentStable price near the strike with rising back-month implied volatility.Key risks•Sharp price move in either direction.•IV contraction in the long leg.•Early assignment of the short leg.Explore Scenario VolatilityAdvancedDiagonal SpreadSell a near-dated option at one strike and buy a longer-dated option at a different strike.Market viewNeutralObjectiveCapital efficiencyMax gainVariable; combines vertical and calendar dynamicsMax lossNet debit paid (typically)Risk profileDefined riskGreek exposureΔΘνΓIdeal environmentMildly directional drift with stable to rising back-month implied volatility.Key risks•Adverse directional move past the long leg.•IV contraction in the long leg.•Roll complexity at front-month expiration.Explore Scenario VolatilityIntermediateLong StraddleBuy a call and a put at the same strike and same expiration.Market viewVolatileObjectiveVolatilityMax gainTheoretically unlimited (call side)Max lossTotal premium paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentLarge move in either direction with rising implied volatility.Key risks•Underlying stays near the strike at expiration.•IV contraction (vol crush) after an event.•Time decay accelerates near expiration.Explore Scenario VolatilityIntermediateLong StrangleBuy an out-of-the-money call and an out-of-the-money put at different strikes, same expiration.Market viewVolatileObjectiveVolatilityMax gainTheoretically unlimited (call side)Max lossTotal premium paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentLarge move in either direction with rising implied volatility.Key risks•Range-bound price action between the strikes.•IV contraction after an event.•Time decay erodes both legs.Explore Scenario ProtectionBeginnerProtective PutHold shares and buy a put to floor downside on those shares.Market viewBullishObjectiveHedgingMax gainShare appreciation − premium paidMax loss(Cost basis − strike) + premiumRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentBullish bias with downside concern; moderate implied volatility.Key risks•Premium paid drags on returns if downside doesn't materialize.•IV contraction reduces put value.•Time decay on the put through the holding period.Explore Scenario ProtectionBeginnerCollarHold shares, buy a protective put, and sell a covered call to offset the put cost.Market viewNeutralObjectiveHedgingMax gain(Call strike − cost basis) ± net premiumMax loss(Cost basis − put strike) ± net premiumRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentRange-bound prices and willingness to cap upside in exchange for a floor.Key risks•Upside capped at the call strike.•Assignment of the short call.•Net debit if the put costs more than the call premium collected.Explore Scenario PrecisionAdvancedButterflyCombine three strikes (1 long lower, 2 short middle, 1 long upper) in the same expiration.Market viewNeutralObjectiveDefined riskMax gainWidth between strikes − net debitMax lossNet debit paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentUnderlying pins near the middle strike at expiration.Key risks•Underlying drifts away from the middle strike.•Wide bid/ask spreads on multi-leg orders.•Pin risk at the middle strike on expiration day.Explore Scenario AdvancedAdvancedRatio SpreadBuy one option and sell two or more options at a different strike in the same expiration.Market viewNeutralObjectiveCapital efficiencyMax gainCapped between the strikes; declines beyond the short strikesMax lossTheoretically large beyond the short strikes (uncovered ratio)Risk profileUndefined riskGreek exposureΔΘνΓIdeal environmentModerate directional drift toward - but not beyond - the short strikes.Key risks•Sharp move past the short strikes creates uncapped exposure.•Naked short-leg exposure in some configurations.•Margin requirements can grow with adverse moves.Explore Scenario AdvancedAdvancedBackspreadSell one option and buy two or more options at a further strike in the same expiration.Market viewVolatileObjectiveVolatilityMax gainTheoretically unlimited (long side dominates)Max lossCapped between the strikes (typically)Risk profileDefined riskGreek exposureΔΘνΓIdeal environmentSharp directional move with rising implied volatility.Key risks•Range-bound action between the strikes produces the maximum loss.•Time decay between the strikes.•IV contraction reduces the long-leg value.Explore Scenario All Academy content is educational and informational only. Nothing here is investment advice, a solicitation, or an offer to buy or sell any security. You are solely responsible for any decisions you make at your broker."
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('main')
    4 × locator resolved to <main class="container flex-1 px-4 py-8">…</main>
      - unexpected value "AcademyA self-paced library of options-strategy references, lessons, and definitions.Educational content only - this app does not place trades or provide investment advice.BeginnersOverviewLessonsStrategy LibraryGlossaryStrategy LibraryBrowse 18 options strategies across six categories. Filter by market view, objective, risk profile, and complexity to narrow down what's relevant to you.All18Income5Directional4Protection2Volatility4Precision1Advanced2FiltersMarket viewObjectiveRisk typeComplexitySearch18 of 18 strategiesIncomeBeginnerCovered CallSell one call option against 100 shares you already own.Market viewNeutralObjectiveIncomeMax gainPremium + (strike − cost basis)Max lossCost basis − premium (if shares fall to zero)Risk profileUndefined riskGreek exposureΔΘνΓIdeal environmentFlat to mildly rising prices with moderate implied volatility.Key risks•Caps upside above the strike.•Shares can be called away at the strike.•Full downside on the share leg, less the premium collected.Explore Scenario IncomeBeginnerCash-Secured PutSell a put while holding cash to buy 100 shares at the strike if assigned.Market viewBullishObjectiveIncomeMax gainPremium receivedMax loss(Strike × 100) − premium (if shares fall to zero after assignment)Risk profileDefined riskGreek exposureΔΘνΓIdeal environmentStable to mildly rising prices and a willingness to take ownership of the shares.Key risks•Assignment of shares at the strike.•Share price can fall below the strike before or after assignment.•Capital is tied up as collateral until expiration.Explore Scenario DirectionalBeginnerLong CallBuy a call to participate in upside above the strike.Market viewBullishObjectiveSpeculationMax gainTheoretically unlimited above the strikeMax lossPremium paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentSharp upward moves with expanding implied volatility.Key risks•Time decay erodes value daily.•Underlying stays at or below the strike at expiration.•IV contraction reduces option price even if direction is correct.Explore Scenario DirectionalBeginnerLong PutBuy a put to participate in downside below the strike.Market viewBearishObjectiveSpeculationMax gain(Strike × 100) − premium (if shares fall to zero)Max lossPremium paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentSharp downward moves with expanding implied volatility.Key risks•Time decay erodes value daily.•Underlying stays at or above the strike at expiration.•IV contraction reduces option price.Explore Scenario DirectionalIntermediateBull Call SpreadBuy a call and sell a higher-strike call in the same expiration.Market viewBullishObjectiveDefined riskMax gainDifference between strikes − net debitMax lossNet debit paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentModerate upward move that finishes between the two strikes.Key risks•Gain capped at the upper strike.•Time decay if the underlying stays range-bound.•Early assignment risk on the short leg before expiration.Explore Scenario DirectionalIntermediateBear Put SpreadBuy a put and sell a lower-strike put in the same expiration.Market viewBearishObjectiveDefined riskMax gainDifference between strikes − net debitMax lossNet debit paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentModerate downward move that finishes between the two strikes.Key risks•Gain capped at the lower strike.•Time decay if the underlying stays range-bound.•Early assignment risk on the short leg.Explore Scenario IncomeIntermediateBull Put SpreadSell a put and buy a lower-strike put for a net credit.Market viewBullishObjectiveIncomeMax gainNet credit receivedMax lossWidth of strikes − net creditRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentStable to mildly rising prices with elevated implied volatility.Key risks•Underlying drops through the long strike.•Assignment of the short leg before expiration.•IV expansion increases the cost to close.Explore Scenario IncomeIntermediateBear Call SpreadSell a call and buy a higher-strike call for a net credit.Market viewBearishObjectiveIncomeMax gainNet credit receivedMax lossWidth of strikes − net creditRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentStable to mildly falling prices with elevated implied volatility.Key risks•Underlying rallies through the long strike.•Assignment of the short leg before expiration.•IV expansion increases the cost to close.Explore Scenario IncomeIntermediateIron CondorCombine a bull put spread and a bear call spread on the same expiration.Market viewRange-boundObjectiveIncomeMax gainNet credit receivedMax lossWidth of widest spread − net creditRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentRange-bound prices with elevated implied volatility that contracts over time.Key risks•Breakout in either direction beyond the short strikes.•IV expansion increases the cost to close.•Pinning risk near a short strike at expiration.Explore Scenario VolatilityAdvancedCalendar SpreadSell a near-dated option and buy a longer-dated option at the same strike.Market viewNeutralObjectiveVolatilityMax gainVariable; depends on IV and price at front-month expirationMax lossNet debit paid (typically)Risk profileDefined riskGreek exposureΔΘνΓIdeal environmentStable price near the strike with rising back-month implied volatility.Key risks•Sharp price move in either direction.•IV contraction in the long leg.•Early assignment of the short leg.Explore Scenario VolatilityAdvancedDiagonal SpreadSell a near-dated option at one strike and buy a longer-dated option at a different strike.Market viewNeutralObjectiveCapital efficiencyMax gainVariable; combines vertical and calendar dynamicsMax lossNet debit paid (typically)Risk profileDefined riskGreek exposureΔΘνΓIdeal environmentMildly directional drift with stable to rising back-month implied volatility.Key risks•Adverse directional move past the long leg.•IV contraction in the long leg.•Roll complexity at front-month expiration.Explore Scenario VolatilityIntermediateLong StraddleBuy a call and a put at the same strike and same expiration.Market viewVolatileObjectiveVolatilityMax gainTheoretically unlimited (call side)Max lossTotal premium paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentLarge move in either direction with rising implied volatility.Key risks•Underlying stays near the strike at expiration.•IV contraction (vol crush) after an event.•Time decay accelerates near expiration.Explore Scenario VolatilityIntermediateLong StrangleBuy an out-of-the-money call and an out-of-the-money put at different strikes, same expiration.Market viewVolatileObjectiveVolatilityMax gainTheoretically unlimited (call side)Max lossTotal premium paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentLarge move in either direction with rising implied volatility.Key risks•Range-bound price action between the strikes.•IV contraction after an event.•Time decay erodes both legs.Explore Scenario ProtectionBeginnerProtective PutHold shares and buy a put to floor downside on those shares.Market viewBullishObjectiveHedgingMax gainShare appreciation − premium paidMax loss(Cost basis − strike) + premiumRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentBullish bias with downside concern; moderate implied volatility.Key risks•Premium paid drags on returns if downside doesn't materialize.•IV contraction reduces put value.•Time decay on the put through the holding period.Explore Scenario ProtectionBeginnerCollarHold shares, buy a protective put, and sell a covered call to offset the put cost.Market viewNeutralObjectiveHedgingMax gain(Call strike − cost basis) ± net premiumMax loss(Cost basis − put strike) ± net premiumRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentRange-bound prices and willingness to cap upside in exchange for a floor.Key risks•Upside capped at the call strike.•Assignment of the short call.•Net debit if the put costs more than the call premium collected.Explore Scenario PrecisionAdvancedButterflyCombine three strikes (1 long lower, 2 short middle, 1 long upper) in the same expiration.Market viewNeutralObjectiveDefined riskMax gainWidth between strikes − net debitMax lossNet debit paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentUnderlying pins near the middle strike at expiration.Key risks•Underlying drifts away from the middle strike.•Wide bid/ask spreads on multi-leg orders.•Pin risk at the middle strike on expiration day.Explore Scenario AdvancedAdvancedRatio SpreadBuy one option and sell two or more options at a different strike in the same expiration.Market viewNeutralObjectiveCapital efficiencyMax gainCapped between the strikes; declines beyond the short strikesMax lossTheoretically large beyond the short strikes (uncovered ratio)Risk profileUndefined riskGreek exposureΔΘνΓIdeal environmentModerate directional drift toward - but not beyond - the short strikes.Key risks•Sharp move past the short strikes creates uncapped exposure.•Naked short-leg exposure in some configurations.•Margin requirements can grow with adverse moves.Explore Scenario AdvancedAdvancedBackspreadSell one option and buy two or more options at a further strike in the same expiration.Market viewVolatileObjectiveVolatilityMax gainTheoretically unlimited (long side dominates)Max lossCapped between the strikes (typically)Risk profileDefined riskGreek exposureΔΘνΓIdeal environmentSharp directional move with rising implied volatility.Key risks•Range-bound action between the strikes produces the maximum loss.•Time decay between the strikes.•IV contraction reduces the long-leg value.Explore Scenario All Academy content is educational and informational only. Nothing here is investment advice, a solicitation, or an offer to buy or sell any security. You are solely responsible for any decisions you make at your broker."
    5 × locator resolved to <main class="container flex-1 px-4 py-8">…</main>
      - unexpected value "AcademyA self-paced library of options-strategy references, lessons, and definitions.Educational content only - this app does not place trades or provide investment advice.BeginnersOverviewLessonsStrategy LibraryGlossaryStrategy LibraryBrowse 18 options strategies across six categories. Filter by market view, objective, risk profile, and complexity to narrow down what's relevant to you.All18Income5Directional4Protection2Volatility4Precision1Advanced2FiltersMarket viewAny viewObjectiveAny objectiveRisk typeAny riskComplexityAny levelSearch18 of 18 strategiesIncomeBeginnerCovered CallSell one call option against 100 shares you already own.Market viewNeutralObjectiveIncomeMax gainPremium + (strike − cost basis)Max lossCost basis − premium (if shares fall to zero)Risk profileUndefined riskGreek exposureΔΘνΓIdeal environmentFlat to mildly rising prices with moderate implied volatility.Key risks•Caps upside above the strike.•Shares can be called away at the strike.•Full downside on the share leg, less the premium collected.Explore Scenario IncomeBeginnerCash-Secured PutSell a put while holding cash to buy 100 shares at the strike if assigned.Market viewBullishObjectiveIncomeMax gainPremium receivedMax loss(Strike × 100) − premium (if shares fall to zero after assignment)Risk profileDefined riskGreek exposureΔΘνΓIdeal environmentStable to mildly rising prices and a willingness to take ownership of the shares.Key risks•Assignment of shares at the strike.•Share price can fall below the strike before or after assignment.•Capital is tied up as collateral until expiration.Explore Scenario DirectionalBeginnerLong CallBuy a call to participate in upside above the strike.Market viewBullishObjectiveSpeculationMax gainTheoretically unlimited above the strikeMax lossPremium paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentSharp upward moves with expanding implied volatility.Key risks•Time decay erodes value daily.•Underlying stays at or below the strike at expiration.•IV contraction reduces option price even if direction is correct.Explore Scenario DirectionalBeginnerLong PutBuy a put to participate in downside below the strike.Market viewBearishObjectiveSpeculationMax gain(Strike × 100) − premium (if shares fall to zero)Max lossPremium paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentSharp downward moves with expanding implied volatility.Key risks•Time decay erodes value daily.•Underlying stays at or above the strike at expiration.•IV contraction reduces option price.Explore Scenario DirectionalIntermediateBull Call SpreadBuy a call and sell a higher-strike call in the same expiration.Market viewBullishObjectiveDefined riskMax gainDifference between strikes − net debitMax lossNet debit paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentModerate upward move that finishes between the two strikes.Key risks•Gain capped at the upper strike.•Time decay if the underlying stays range-bound.•Early assignment risk on the short leg before expiration.Explore Scenario DirectionalIntermediateBear Put SpreadBuy a put and sell a lower-strike put in the same expiration.Market viewBearishObjectiveDefined riskMax gainDifference between strikes − net debitMax lossNet debit paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentModerate downward move that finishes between the two strikes.Key risks•Gain capped at the lower strike.•Time decay if the underlying stays range-bound.•Early assignment risk on the short leg.Explore Scenario IncomeIntermediateBull Put SpreadSell a put and buy a lower-strike put for a net credit.Market viewBullishObjectiveIncomeMax gainNet credit receivedMax lossWidth of strikes − net creditRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentStable to mildly rising prices with elevated implied volatility.Key risks•Underlying drops through the long strike.•Assignment of the short leg before expiration.•IV expansion increases the cost to close.Explore Scenario IncomeIntermediateBear Call SpreadSell a call and buy a higher-strike call for a net credit.Market viewBearishObjectiveIncomeMax gainNet credit receivedMax lossWidth of strikes − net creditRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentStable to mildly falling prices with elevated implied volatility.Key risks•Underlying rallies through the long strike.•Assignment of the short leg before expiration.•IV expansion increases the cost to close.Explore Scenario IncomeIntermediateIron CondorCombine a bull put spread and a bear call spread on the same expiration.Market viewRange-boundObjectiveIncomeMax gainNet credit receivedMax lossWidth of widest spread − net creditRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentRange-bound prices with elevated implied volatility that contracts over time.Key risks•Breakout in either direction beyond the short strikes.•IV expansion increases the cost to close.•Pinning risk near a short strike at expiration.Explore Scenario VolatilityAdvancedCalendar SpreadSell a near-dated option and buy a longer-dated option at the same strike.Market viewNeutralObjectiveVolatilityMax gainVariable; depends on IV and price at front-month expirationMax lossNet debit paid (typically)Risk profileDefined riskGreek exposureΔΘνΓIdeal environmentStable price near the strike with rising back-month implied volatility.Key risks•Sharp price move in either direction.•IV contraction in the long leg.•Early assignment of the short leg.Explore Scenario VolatilityAdvancedDiagonal SpreadSell a near-dated option at one strike and buy a longer-dated option at a different strike.Market viewNeutralObjectiveCapital efficiencyMax gainVariable; combines vertical and calendar dynamicsMax lossNet debit paid (typically)Risk profileDefined riskGreek exposureΔΘνΓIdeal environmentMildly directional drift with stable to rising back-month implied volatility.Key risks•Adverse directional move past the long leg.•IV contraction in the long leg.•Roll complexity at front-month expiration.Explore Scenario VolatilityIntermediateLong StraddleBuy a call and a put at the same strike and same expiration.Market viewVolatileObjectiveVolatilityMax gainTheoretically unlimited (call side)Max lossTotal premium paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentLarge move in either direction with rising implied volatility.Key risks•Underlying stays near the strike at expiration.•IV contraction (vol crush) after an event.•Time decay accelerates near expiration.Explore Scenario VolatilityIntermediateLong StrangleBuy an out-of-the-money call and an out-of-the-money put at different strikes, same expiration.Market viewVolatileObjectiveVolatilityMax gainTheoretically unlimited (call side)Max lossTotal premium paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentLarge move in either direction with rising implied volatility.Key risks•Range-bound price action between the strikes.•IV contraction after an event.•Time decay erodes both legs.Explore Scenario ProtectionBeginnerProtective PutHold shares and buy a put to floor downside on those shares.Market viewBullishObjectiveHedgingMax gainShare appreciation − premium paidMax loss(Cost basis − strike) + premiumRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentBullish bias with downside concern; moderate implied volatility.Key risks•Premium paid drags on returns if downside doesn't materialize.•IV contraction reduces put value.•Time decay on the put through the holding period.Explore Scenario ProtectionBeginnerCollarHold shares, buy a protective put, and sell a covered call to offset the put cost.Market viewNeutralObjectiveHedgingMax gain(Call strike − cost basis) ± net premiumMax loss(Cost basis − put strike) ± net premiumRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentRange-bound prices and willingness to cap upside in exchange for a floor.Key risks•Upside capped at the call strike.•Assignment of the short call.•Net debit if the put costs more than the call premium collected.Explore Scenario PrecisionAdvancedButterflyCombine three strikes (1 long lower, 2 short middle, 1 long upper) in the same expiration.Market viewNeutralObjectiveDefined riskMax gainWidth between strikes − net debitMax lossNet debit paidRisk profileDefined riskGreek exposureΔΘνΓIdeal environmentUnderlying pins near the middle strike at expiration.Key risks•Underlying drifts away from the middle strike.•Wide bid/ask spreads on multi-leg orders.•Pin risk at the middle strike on expiration day.Explore Scenario AdvancedAdvancedRatio SpreadBuy one option and sell two or more options at a different strike in the same expiration.Market viewNeutralObjectiveCapital efficiencyMax gainCapped between the strikes; declines beyond the short strikesMax lossTheoretically large beyond the short strikes (uncovered ratio)Risk profileUndefined riskGreek exposureΔΘνΓIdeal environmentModerate directional drift toward - but not beyond - the short strikes.Key risks•Sharp move past the short strikes creates uncapped exposure.•Naked short-leg exposure in some configurations.•Margin requirements can grow with adverse moves.Explore Scenario AdvancedAdvancedBackspreadSell one option and buy two or more options at a further strike in the same expiration.Market viewVolatileObjectiveVolatilityMax gainTheoretically unlimited (long side dominates)Max lossCapped between the strikes (typically)Risk profileDefined riskGreek exposureΔΘνΓIdeal environmentSharp directional move with rising implied volatility.Key risks•Range-bound action between the strikes produces the maximum loss.•Time decay between the strikes.•IV contraction reduces the long-leg value.Explore Scenario All Academy content is educational and informational only. Nothing here is investment advice, a solicitation, or an offer to buy or sell any security. You are solely responsible for any decisions you make at your broker."

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - link "OolTool" [ref=e7] [cursor=pointer]:
          - /url: /dashboard
          - img "OolTool" [ref=e8]
        - navigation [ref=e10]:
          - link "Dashboard" [ref=e11] [cursor=pointer]:
            - /url: /dashboard
          - link "Opportunities" [ref=e12] [cursor=pointer]:
            - /url: /dashboard/opportunities
          - button "Portfolio" [ref=e14]:
            - generic [ref=e15]: Portfolio
            - img [ref=e16]
          - button "Research" [ref=e19]:
            - generic [ref=e20]: Research
            - img [ref=e21]
          - link "Academy" [ref=e23] [cursor=pointer]:
            - /url: /academy
          - link "Support" [ref=e24] [cursor=pointer]:
            - /url: /dashboard/support
        - generic [ref=e25]:
          - button "Prices are delayed, not live market prices. Portfolio value and P&L come from your broker, so they can differ from your broker's dashboard." [ref=e26]: Delayed
          - button "Sync all" [ref=e27] [cursor=pointer]:
            - img
            - generic [ref=e28]: Sync all
          - button "Add options" [ref=e29] [cursor=pointer]:
            - img
          - button "Notifications" [ref=e30] [cursor=pointer]:
            - img [ref=e31]
            - generic [ref=e34]: "18"
          - button "QU" [ref=e35] [cursor=pointer]:
            - generic [ref=e37]: QU
    - main [ref=e38]:
      - generic [ref=e39]:
        - generic [ref=e40]:
          - heading "Academy" [level=1] [ref=e43]
          - paragraph [ref=e44]: A self-paced library of options-strategy references, lessons, and definitions.
          - paragraph [ref=e45]: Educational content only - this app does not place trades or provide investment advice.
        - navigation [ref=e47]:
          - link "Beginners" [ref=e48] [cursor=pointer]:
            - /url: /academy/beginners
            - img [ref=e49]
            - text: Beginners
          - link "Overview" [ref=e52] [cursor=pointer]:
            - /url: /academy
            - img [ref=e53]
            - text: Overview
          - link "Lessons" [ref=e56] [cursor=pointer]:
            - /url: /academy/lessons
            - img [ref=e57]
            - text: Lessons
          - link "Strategy Library" [ref=e59] [cursor=pointer]:
            - /url: /academy/strategies
            - img [ref=e60]
            - text: Strategy Library
          - link "Glossary" [ref=e62] [cursor=pointer]:
            - /url: /academy/glossary
            - img [ref=e63]
            - text: Glossary
        - generic [ref=e66]:
          - generic [ref=e67]:
            - generic [ref=e68]:
              - img [ref=e70]
              - heading "Strategy Library" [level=1] [ref=e72]
            - paragraph [ref=e73]: Browse 18 options strategies across six categories. Filter by market view, objective, risk profile, and complexity to narrow down what's relevant to you.
          - generic [ref=e77]:
            - button "All 18" [ref=e78] [cursor=pointer]:
              - text: All
              - generic [ref=e79]: "18"
            - button "Income 5" [ref=e80] [cursor=pointer]:
              - text: Income
              - generic [ref=e81]: "5"
            - button "Directional 4" [ref=e82] [cursor=pointer]:
              - text: Directional
              - generic [ref=e83]: "4"
            - button "Protection 2" [active] [ref=e84] [cursor=pointer]:
              - text: Protection
              - generic [ref=e85]: "2"
            - button "Volatility 4" [ref=e86] [cursor=pointer]:
              - text: Volatility
              - generic [ref=e87]: "4"
            - button "Precision 1" [ref=e88] [cursor=pointer]:
              - text: Precision
              - generic [ref=e89]: "1"
            - button "Advanced 2" [ref=e90] [cursor=pointer]:
              - text: Advanced
              - generic [ref=e91]: "2"
          - generic [ref=e92]:
            - generic [ref=e93]:
              - img [ref=e94]
              - text: Filters
            - generic [ref=e95]:
              - generic [ref=e96]:
                - generic [ref=e97]: Market view
                - combobox [ref=e98]:
                  - generic: Any view
                  - img
              - generic [ref=e99]:
                - generic [ref=e100]: Objective
                - combobox [ref=e101]:
                  - generic: Any objective
                  - img
              - generic [ref=e102]:
                - generic [ref=e103]: Risk type
                - combobox [ref=e104]:
                  - generic: Any risk
                  - img
              - generic [ref=e105]:
                - generic [ref=e106]: Complexity
                - combobox [ref=e107]:
                  - generic: Any level
                  - img
              - generic [ref=e108]:
                - generic [ref=e109]: Search
                - generic [ref=e110]:
                  - img [ref=e111]
                  - textbox "Name or description…" [ref=e114]
          - generic [ref=e116]: 18 of 18 strategies
          - generic [ref=e117]:
            - generic [ref=e118]:
              - generic [ref=e119]:
                - generic [ref=e121]:
                  - generic [ref=e122]:
                    - generic [ref=e123]: Income
                    - generic [ref=e124]:
                      - 'generic "Complexity: Beginner" [ref=e125]'
                      - text: Beginner
                  - heading "Covered Call" [level=3] [ref=e129]
                - paragraph [ref=e130]: Sell one call option against 100 shares you already own.
              - generic [ref=e131]:
                - generic [ref=e132]:
                  - generic [ref=e133]:
                    - generic [ref=e134]: Market view
                    - generic [ref=e135]:
                      - img [ref=e136]
                      - text: Neutral
                  - generic [ref=e137]:
                    - generic [ref=e138]: Objective
                    - generic [ref=e139]: Income
                  - generic [ref=e140]:
                    - generic [ref=e141]: Max gain
                    - generic [ref=e142]: Premium + (strike − cost basis)
                  - generic [ref=e143]:
                    - generic [ref=e144]: Max loss
                    - generic [ref=e145]: Cost basis − premium (if shares fall to zero)
                - generic [ref=e146]:
                  - generic [ref=e147]: Risk profile
                  - generic [ref=e148]:
                    - img
                    - text: Undefined risk
                - generic [ref=e149]:
                  - generic [ref=e150]: Greek exposure
                  - generic [ref=e151]:
                    - 'button "Δ exposure: Positive" [ref=e152]':
                      - generic [ref=e153]: Δ
                      - img [ref=e154]
                    - 'button "Θ exposure: Positive" [ref=e156]':
                      - generic [ref=e157]: Θ
                      - img [ref=e158]
                    - 'button "ν exposure: Negative" [ref=e160]':
                      - generic [ref=e161]: ν
                      - img [ref=e162]
                    - 'button "Γ exposure: Negative" [ref=e164]':
                      - generic [ref=e165]: Γ
                      - img [ref=e166]
                - generic [ref=e168]:
                  - generic [ref=e169]: Ideal environment
                  - paragraph [ref=e170]: Flat to mildly rising prices with moderate implied volatility.
                - generic [ref=e171]:
                  - generic [ref=e172]: Key risks
                  - list [ref=e173]:
                    - listitem [ref=e174]:
                      - generic [ref=e175]: •
                      - generic [ref=e176]: Caps upside above the strike.
                    - listitem [ref=e177]:
                      - generic [ref=e178]: •
                      - generic [ref=e179]: Shares can be called away at the strike.
                    - listitem [ref=e180]:
                      - generic [ref=e181]: •
                      - generic [ref=e182]: Full downside on the share leg, less the premium collected.
                - link "Explore Scenario" [ref=e184] [cursor=pointer]:
                  - /url: /academy/strategies/covered-call
                  - text: Explore Scenario
                  - img
            - generic [ref=e185]:
              - generic [ref=e186]:
                - generic [ref=e188]:
                  - generic [ref=e189]:
                    - generic [ref=e190]: Income
                    - generic [ref=e191]:
                      - 'generic "Complexity: Beginner" [ref=e192]'
                      - text: Beginner
                  - heading "Cash-Secured Put" [level=3] [ref=e196]
                - paragraph [ref=e197]: Sell a put while holding cash to buy 100 shares at the strike if assigned.
              - generic [ref=e198]:
                - generic [ref=e199]:
                  - generic [ref=e200]:
                    - generic [ref=e201]: Market view
                    - generic [ref=e202]:
                      - img [ref=e203]
                      - text: Bullish
                  - generic [ref=e206]:
                    - generic [ref=e207]: Objective
                    - generic [ref=e208]: Income
                  - generic [ref=e209]:
                    - generic [ref=e210]: Max gain
                    - generic [ref=e211]: Premium received
                  - generic [ref=e212]:
                    - generic [ref=e213]: Max loss
                    - generic [ref=e214]: (Strike × 100) − premium (if shares fall to zero after assignment)
                - generic [ref=e215]:
                  - generic [ref=e216]: Risk profile
                  - generic [ref=e217]: Defined risk
                - generic [ref=e218]:
                  - generic [ref=e219]: Greek exposure
                  - generic [ref=e220]:
                    - 'button "Δ exposure: Positive" [ref=e221]':
                      - generic [ref=e222]: Δ
                      - img [ref=e223]
                    - 'button "Θ exposure: Positive" [ref=e225]':
                      - generic [ref=e226]: Θ
                      - img [ref=e227]
                    - 'button "ν exposure: Negative" [ref=e229]':
                      - generic [ref=e230]: ν
                      - img [ref=e231]
                    - 'button "Γ exposure: Negative" [ref=e233]':
                      - generic [ref=e234]: Γ
                      - img [ref=e235]
                - generic [ref=e237]:
                  - generic [ref=e238]: Ideal environment
                  - paragraph [ref=e239]: Stable to mildly rising prices and a willingness to take ownership of the shares.
                - generic [ref=e240]:
                  - generic [ref=e241]: Key risks
                  - list [ref=e242]:
                    - listitem [ref=e243]:
                      - generic [ref=e244]: •
                      - generic [ref=e245]: Assignment of shares at the strike.
                    - listitem [ref=e246]:
                      - generic [ref=e247]: •
                      - generic [ref=e248]: Share price can fall below the strike before or after assignment.
                    - listitem [ref=e249]:
                      - generic [ref=e250]: •
                      - generic [ref=e251]: Capital is tied up as collateral until expiration.
                - link "Explore Scenario" [ref=e253] [cursor=pointer]:
                  - /url: /academy/strategies/cash-secured-put
                  - text: Explore Scenario
                  - img
            - generic [ref=e254]:
              - generic [ref=e255]:
                - generic [ref=e257]:
                  - generic [ref=e258]:
                    - generic [ref=e259]: Directional
                    - generic [ref=e260]:
                      - 'generic "Complexity: Beginner" [ref=e261]'
                      - text: Beginner
                  - heading "Long Call" [level=3] [ref=e265]
                - paragraph [ref=e266]: Buy a call to participate in upside above the strike.
              - generic [ref=e267]:
                - generic [ref=e268]:
                  - generic [ref=e269]:
                    - generic [ref=e270]: Market view
                    - generic [ref=e271]:
                      - img [ref=e272]
                      - text: Bullish
                  - generic [ref=e275]:
                    - generic [ref=e276]: Objective
                    - generic [ref=e277]: Speculation
                  - generic [ref=e278]:
                    - generic [ref=e279]: Max gain
                    - generic [ref=e280]: Theoretically unlimited above the strike
                  - generic [ref=e281]:
                    - generic [ref=e282]: Max loss
                    - generic [ref=e283]: Premium paid
                - generic [ref=e284]:
                  - generic [ref=e285]: Risk profile
                  - generic [ref=e286]: Defined risk
                - generic [ref=e287]:
                  - generic [ref=e288]: Greek exposure
                  - generic [ref=e289]:
                    - 'button "Δ exposure: Positive" [ref=e290]':
                      - generic [ref=e291]: Δ
                      - img [ref=e292]
                    - 'button "Θ exposure: Negative" [ref=e294]':
                      - generic [ref=e295]: Θ
                      - img [ref=e296]
                    - 'button "ν exposure: Positive" [ref=e298]':
                      - generic [ref=e299]: ν
                      - img [ref=e300]
                    - 'button "Γ exposure: Positive" [ref=e302]':
                      - generic [ref=e303]: Γ
                      - img [ref=e304]
                - generic [ref=e306]:
                  - generic [ref=e307]: Ideal environment
                  - paragraph [ref=e308]: Sharp upward moves with expanding implied volatility.
                - generic [ref=e309]:
                  - generic [ref=e310]: Key risks
                  - list [ref=e311]:
                    - listitem [ref=e312]:
                      - generic [ref=e313]: •
                      - generic [ref=e314]: Time decay erodes value daily.
                    - listitem [ref=e315]:
                      - generic [ref=e316]: •
                      - generic [ref=e317]: Underlying stays at or below the strike at expiration.
                    - listitem [ref=e318]:
                      - generic [ref=e319]: •
                      - generic [ref=e320]: IV contraction reduces option price even if direction is correct.
                - link "Explore Scenario" [ref=e322] [cursor=pointer]:
                  - /url: /academy/strategies/long-call
                  - text: Explore Scenario
                  - img
            - generic [ref=e323]:
              - generic [ref=e324]:
                - generic [ref=e326]:
                  - generic [ref=e327]:
                    - generic [ref=e328]: Directional
                    - generic [ref=e329]:
                      - 'generic "Complexity: Beginner" [ref=e330]'
                      - text: Beginner
                  - heading "Long Put" [level=3] [ref=e334]
                - paragraph [ref=e335]: Buy a put to participate in downside below the strike.
              - generic [ref=e336]:
                - generic [ref=e337]:
                  - generic [ref=e338]:
                    - generic [ref=e339]: Market view
                    - generic [ref=e340]:
                      - img [ref=e341]
                      - text: Bearish
                  - generic [ref=e344]:
                    - generic [ref=e345]: Objective
                    - generic [ref=e346]: Speculation
                  - generic [ref=e347]:
                    - generic [ref=e348]: Max gain
                    - generic [ref=e349]: (Strike × 100) − premium (if shares fall to zero)
                  - generic [ref=e350]:
                    - generic [ref=e351]: Max loss
                    - generic [ref=e352]: Premium paid
                - generic [ref=e353]:
                  - generic [ref=e354]: Risk profile
                  - generic [ref=e355]: Defined risk
                - generic [ref=e356]:
                  - generic [ref=e357]: Greek exposure
                  - generic [ref=e358]:
                    - 'button "Δ exposure: Negative" [ref=e359]':
                      - generic [ref=e360]: Δ
                      - img [ref=e361]
                    - 'button "Θ exposure: Negative" [ref=e363]':
                      - generic [ref=e364]: Θ
                      - img [ref=e365]
                    - 'button "ν exposure: Positive" [ref=e367]':
                      - generic [ref=e368]: ν
                      - img [ref=e369]
                    - 'button "Γ exposure: Positive" [ref=e371]':
                      - generic [ref=e372]: Γ
                      - img [ref=e373]
                - generic [ref=e375]:
                  - generic [ref=e376]: Ideal environment
                  - paragraph [ref=e377]: Sharp downward moves with expanding implied volatility.
                - generic [ref=e378]:
                  - generic [ref=e379]: Key risks
                  - list [ref=e380]:
                    - listitem [ref=e381]:
                      - generic [ref=e382]: •
                      - generic [ref=e383]: Time decay erodes value daily.
                    - listitem [ref=e384]:
                      - generic [ref=e385]: •
                      - generic [ref=e386]: Underlying stays at or above the strike at expiration.
                    - listitem [ref=e387]:
                      - generic [ref=e388]: •
                      - generic [ref=e389]: IV contraction reduces option price.
                - link "Explore Scenario" [ref=e391] [cursor=pointer]:
                  - /url: /academy/strategies/long-put
                  - text: Explore Scenario
                  - img
            - generic [ref=e392]:
              - generic [ref=e393]:
                - generic [ref=e395]:
                  - generic [ref=e396]:
                    - generic [ref=e397]: Directional
                    - generic [ref=e398]:
                      - 'generic "Complexity: Intermediate" [ref=e399]'
                      - text: Intermediate
                  - heading "Bull Call Spread" [level=3] [ref=e403]
                - paragraph [ref=e404]: Buy a call and sell a higher-strike call in the same expiration.
              - generic [ref=e405]:
                - generic [ref=e406]:
                  - generic [ref=e407]:
                    - generic [ref=e408]: Market view
                    - generic [ref=e409]:
                      - img [ref=e410]
                      - text: Bullish
                  - generic [ref=e413]:
                    - generic [ref=e414]: Objective
                    - generic [ref=e415]: Defined risk
                  - generic [ref=e416]:
                    - generic [ref=e417]: Max gain
                    - generic [ref=e418]: Difference between strikes − net debit
                  - generic [ref=e419]:
                    - generic [ref=e420]: Max loss
                    - generic [ref=e421]: Net debit paid
                - generic [ref=e422]:
                  - generic [ref=e423]: Risk profile
                  - generic [ref=e424]: Defined risk
                - generic [ref=e425]:
                  - generic [ref=e426]: Greek exposure
                  - generic [ref=e427]:
                    - 'button "Δ exposure: Positive" [ref=e428]':
                      - generic [ref=e429]: Δ
                      - img [ref=e430]
                    - 'button "Θ exposure: Mixed" [ref=e432]':
                      - generic [ref=e433]: Θ
                      - img [ref=e434]
                    - 'button "ν exposure: Mixed" [ref=e437]':
                      - generic [ref=e438]: ν
                      - img [ref=e439]
                    - 'button "Γ exposure: Mixed" [ref=e442]':
                      - generic [ref=e443]: Γ
                      - img [ref=e444]
                - generic [ref=e447]:
                  - generic [ref=e448]: Ideal environment
                  - paragraph [ref=e449]: Moderate upward move that finishes between the two strikes.
                - generic [ref=e450]:
                  - generic [ref=e451]: Key risks
                  - list [ref=e452]:
                    - listitem [ref=e453]:
                      - generic [ref=e454]: •
                      - generic [ref=e455]: Gain capped at the upper strike.
                    - listitem [ref=e456]:
                      - generic [ref=e457]: •
                      - generic [ref=e458]: Time decay if the underlying stays range-bound.
                    - listitem [ref=e459]:
                      - generic [ref=e460]: •
                      - generic [ref=e461]: Early assignment risk on the short leg before expiration.
                - link "Explore Scenario" [ref=e463] [cursor=pointer]:
                  - /url: /academy/strategies/bull-call-spread
                  - text: Explore Scenario
                  - img
            - generic [ref=e464]:
              - generic [ref=e465]:
                - generic [ref=e467]:
                  - generic [ref=e468]:
                    - generic [ref=e469]: Directional
                    - generic [ref=e470]:
                      - 'generic "Complexity: Intermediate" [ref=e471]'
                      - text: Intermediate
                  - heading "Bear Put Spread" [level=3] [ref=e475]
                - paragraph [ref=e476]: Buy a put and sell a lower-strike put in the same expiration.
              - generic [ref=e477]:
                - generic [ref=e478]:
                  - generic [ref=e479]:
                    - generic [ref=e480]: Market view
                    - generic [ref=e481]:
                      - img [ref=e482]
                      - text: Bearish
                  - generic [ref=e485]:
                    - generic [ref=e486]: Objective
                    - generic [ref=e487]: Defined risk
                  - generic [ref=e488]:
                    - generic [ref=e489]: Max gain
                    - generic [ref=e490]: Difference between strikes − net debit
                  - generic [ref=e491]:
                    - generic [ref=e492]: Max loss
                    - generic [ref=e493]: Net debit paid
                - generic [ref=e494]:
                  - generic [ref=e495]: Risk profile
                  - generic [ref=e496]: Defined risk
                - generic [ref=e497]:
                  - generic [ref=e498]: Greek exposure
                  - generic [ref=e499]:
                    - 'button "Δ exposure: Negative" [ref=e500]':
                      - generic [ref=e501]: Δ
                      - img [ref=e502]
                    - 'button "Θ exposure: Mixed" [ref=e504]':
                      - generic [ref=e505]: Θ
                      - img [ref=e506]
                    - 'button "ν exposure: Mixed" [ref=e509]':
                      - generic [ref=e510]: ν
                      - img [ref=e511]
                    - 'button "Γ exposure: Mixed" [ref=e514]':
                      - generic [ref=e515]: Γ
                      - img [ref=e516]
                - generic [ref=e519]:
                  - generic [ref=e520]: Ideal environment
                  - paragraph [ref=e521]: Moderate downward move that finishes between the two strikes.
                - generic [ref=e522]:
                  - generic [ref=e523]: Key risks
                  - list [ref=e524]:
                    - listitem [ref=e525]:
                      - generic [ref=e526]: •
                      - generic [ref=e527]: Gain capped at the lower strike.
                    - listitem [ref=e528]:
                      - generic [ref=e529]: •
                      - generic [ref=e530]: Time decay if the underlying stays range-bound.
                    - listitem [ref=e531]:
                      - generic [ref=e532]: •
                      - generic [ref=e533]: Early assignment risk on the short leg.
                - link "Explore Scenario" [ref=e535] [cursor=pointer]:
                  - /url: /academy/strategies/bear-put-spread
                  - text: Explore Scenario
                  - img
            - generic [ref=e536]:
              - generic [ref=e537]:
                - generic [ref=e539]:
                  - generic [ref=e540]:
                    - generic [ref=e541]: Income
                    - generic [ref=e542]:
                      - 'generic "Complexity: Intermediate" [ref=e543]'
                      - text: Intermediate
                  - heading "Bull Put Spread" [level=3] [ref=e547]
                - paragraph [ref=e548]: Sell a put and buy a lower-strike put for a net credit.
              - generic [ref=e549]:
                - generic [ref=e550]:
                  - generic [ref=e551]:
                    - generic [ref=e552]: Market view
                    - generic [ref=e553]:
                      - img [ref=e554]
                      - text: Bullish
                  - generic [ref=e557]:
                    - generic [ref=e558]: Objective
                    - generic [ref=e559]: Income
                  - generic [ref=e560]:
                    - generic [ref=e561]: Max gain
                    - generic [ref=e562]: Net credit received
                  - generic [ref=e563]:
                    - generic [ref=e564]: Max loss
                    - generic [ref=e565]: Width of strikes − net credit
                - generic [ref=e566]:
                  - generic [ref=e567]: Risk profile
                  - generic [ref=e568]: Defined risk
                - generic [ref=e569]:
                  - generic [ref=e570]: Greek exposure
                  - generic [ref=e571]:
                    - 'button "Δ exposure: Positive" [ref=e572]':
                      - generic [ref=e573]: Δ
                      - img [ref=e574]
                    - 'button "Θ exposure: Positive" [ref=e576]':
                      - generic [ref=e577]: Θ
                      - img [ref=e578]
                    - 'button "ν exposure: Negative" [ref=e580]':
                      - generic [ref=e581]: ν
                      - img [ref=e582]
                    - 'button "Γ exposure: Negative" [ref=e584]':
                      - generic [ref=e585]: Γ
                      - img [ref=e586]
                - generic [ref=e588]:
                  - generic [ref=e589]: Ideal environment
                  - paragraph [ref=e590]: Stable to mildly rising prices with elevated implied volatility.
                - generic [ref=e591]:
                  - generic [ref=e592]: Key risks
                  - list [ref=e593]:
                    - listitem [ref=e594]:
                      - generic [ref=e595]: •
                      - generic [ref=e596]: Underlying drops through the long strike.
                    - listitem [ref=e597]:
                      - generic [ref=e598]: •
                      - generic [ref=e599]: Assignment of the short leg before expiration.
                    - listitem [ref=e600]:
                      - generic [ref=e601]: •
                      - generic [ref=e602]: IV expansion increases the cost to close.
                - link "Explore Scenario" [ref=e604] [cursor=pointer]:
                  - /url: /academy/strategies/bull-put-spread
                  - text: Explore Scenario
                  - img
            - generic [ref=e605]:
              - generic [ref=e606]:
                - generic [ref=e608]:
                  - generic [ref=e609]:
                    - generic [ref=e610]: Income
                    - generic [ref=e611]:
                      - 'generic "Complexity: Intermediate" [ref=e612]'
                      - text: Intermediate
                  - heading "Bear Call Spread" [level=3] [ref=e616]
                - paragraph [ref=e617]: Sell a call and buy a higher-strike call for a net credit.
              - generic [ref=e618]:
                - generic [ref=e619]:
                  - generic [ref=e620]:
                    - generic [ref=e621]: Market view
                    - generic [ref=e622]:
                      - img [ref=e623]
                      - text: Bearish
                  - generic [ref=e626]:
                    - generic [ref=e627]: Objective
                    - generic [ref=e628]: Income
                  - generic [ref=e629]:
                    - generic [ref=e630]: Max gain
                    - generic [ref=e631]: Net credit received
                  - generic [ref=e632]:
                    - generic [ref=e633]: Max loss
                    - generic [ref=e634]: Width of strikes − net credit
                - generic [ref=e635]:
                  - generic [ref=e636]: Risk profile
                  - generic [ref=e637]: Defined risk
                - generic [ref=e638]:
                  - generic [ref=e639]: Greek exposure
                  - generic [ref=e640]:
                    - 'button "Δ exposure: Negative" [ref=e641]':
                      - generic [ref=e642]: Δ
                      - img [ref=e643]
                    - 'button "Θ exposure: Positive" [ref=e645]':
                      - generic [ref=e646]: Θ
                      - img [ref=e647]
                    - 'button "ν exposure: Negative" [ref=e649]':
                      - generic [ref=e650]: ν
                      - img [ref=e651]
                    - 'button "Γ exposure: Negative" [ref=e653]':
                      - generic [ref=e654]: Γ
                      - img [ref=e655]
                - generic [ref=e657]:
                  - generic [ref=e658]: Ideal environment
                  - paragraph [ref=e659]: Stable to mildly falling prices with elevated implied volatility.
                - generic [ref=e660]:
                  - generic [ref=e661]: Key risks
                  - list [ref=e662]:
                    - listitem [ref=e663]:
                      - generic [ref=e664]: •
                      - generic [ref=e665]: Underlying rallies through the long strike.
                    - listitem [ref=e666]:
                      - generic [ref=e667]: •
                      - generic [ref=e668]: Assignment of the short leg before expiration.
                    - listitem [ref=e669]:
                      - generic [ref=e670]: •
                      - generic [ref=e671]: IV expansion increases the cost to close.
                - link "Explore Scenario" [ref=e673] [cursor=pointer]:
                  - /url: /academy/strategies/bear-call-spread
                  - text: Explore Scenario
                  - img
            - generic [ref=e674]:
              - generic [ref=e675]:
                - generic [ref=e677]:
                  - generic [ref=e678]:
                    - generic [ref=e679]: Income
                    - generic [ref=e680]:
                      - 'generic "Complexity: Intermediate" [ref=e681]'
                      - text: Intermediate
                  - heading "Iron Condor" [level=3] [ref=e685]
                - paragraph [ref=e686]: Combine a bull put spread and a bear call spread on the same expiration.
              - generic [ref=e687]:
                - generic [ref=e688]:
                  - generic [ref=e689]:
                    - generic [ref=e690]: Market view
                    - generic [ref=e691]:
                      - img [ref=e692]
                      - text: Range-bound
                  - generic [ref=e695]:
                    - generic [ref=e696]: Objective
                    - generic [ref=e697]: Income
                  - generic [ref=e698]:
                    - generic [ref=e699]: Max gain
                    - generic [ref=e700]: Net credit received
                  - generic [ref=e701]:
                    - generic [ref=e702]: Max loss
                    - generic [ref=e703]: Width of widest spread − net credit
                - generic [ref=e704]:
                  - generic [ref=e705]: Risk profile
                  - generic [ref=e706]: Defined risk
                - generic [ref=e707]:
                  - generic [ref=e708]: Greek exposure
                  - generic [ref=e709]:
                    - 'button "Δ exposure: Neutral" [ref=e710]':
                      - generic [ref=e711]: Δ
                      - img [ref=e712]
                    - 'button "Θ exposure: Positive" [ref=e713]':
                      - generic [ref=e714]: Θ
                      - img [ref=e715]
                    - 'button "ν exposure: Negative" [ref=e717]':
                      - generic [ref=e718]: ν
                      - img [ref=e719]
                    - 'button "Γ exposure: Negative" [ref=e721]':
                      - generic [ref=e722]: Γ
                      - img [ref=e723]
                - generic [ref=e725]:
                  - generic [ref=e726]: Ideal environment
                  - paragraph [ref=e727]: Range-bound prices with elevated implied volatility that contracts over time.
                - generic [ref=e728]:
                  - generic [ref=e729]: Key risks
                  - list [ref=e730]:
                    - listitem [ref=e731]:
                      - generic [ref=e732]: •
                      - generic [ref=e733]: Breakout in either direction beyond the short strikes.
                    - listitem [ref=e734]:
                      - generic [ref=e735]: •
                      - generic [ref=e736]: IV expansion increases the cost to close.
                    - listitem [ref=e737]:
                      - generic [ref=e738]: •
                      - generic [ref=e739]: Pinning risk near a short strike at expiration.
                - link "Explore Scenario" [ref=e741] [cursor=pointer]:
                  - /url: /academy/strategies/iron-condor
                  - text: Explore Scenario
                  - img
            - generic [ref=e742]:
              - generic [ref=e743]:
                - generic [ref=e745]:
                  - generic [ref=e746]:
                    - generic [ref=e747]: Volatility
                    - generic [ref=e748]:
                      - 'generic "Complexity: Advanced" [ref=e749]'
                      - text: Advanced
                  - heading "Calendar Spread" [level=3] [ref=e753]
                - paragraph [ref=e754]: Sell a near-dated option and buy a longer-dated option at the same strike.
              - generic [ref=e755]:
                - generic [ref=e756]:
                  - generic [ref=e757]:
                    - generic [ref=e758]: Market view
                    - generic [ref=e759]:
                      - img [ref=e760]
                      - text: Neutral
                  - generic [ref=e761]:
                    - generic [ref=e762]: Objective
                    - generic [ref=e763]: Volatility
                  - generic [ref=e764]:
                    - generic [ref=e765]: Max gain
                    - generic [ref=e766]: Variable; depends on IV and price at front-month expiration
                  - generic [ref=e767]:
                    - generic [ref=e768]: Max loss
                    - generic [ref=e769]: Net debit paid (typically)
                - generic [ref=e770]:
                  - generic [ref=e771]: Risk profile
                  - generic [ref=e772]: Defined risk
                - generic [ref=e773]:
                  - generic [ref=e774]: Greek exposure
                  - generic [ref=e775]:
                    - 'button "Δ exposure: Neutral" [ref=e776]':
                      - generic [ref=e777]: Δ
                      - img [ref=e778]
                    - 'button "Θ exposure: Mixed" [ref=e779]':
                      - generic [ref=e780]: Θ
                      - img [ref=e781]
                    - 'button "ν exposure: Positive" [ref=e784]':
                      - generic [ref=e785]: ν
                      - img [ref=e786]
                    - 'button "Γ exposure: Mixed" [ref=e788]':
                      - generic [ref=e789]: Γ
                      - img [ref=e790]
                - generic [ref=e793]:
                  - generic [ref=e794]: Ideal environment
                  - paragraph [ref=e795]: Stable price near the strike with rising back-month implied volatility.
                - generic [ref=e796]:
                  - generic [ref=e797]: Key risks
                  - list [ref=e798]:
                    - listitem [ref=e799]:
                      - generic [ref=e800]: •
                      - generic [ref=e801]: Sharp price move in either direction.
                    - listitem [ref=e802]:
                      - generic [ref=e803]: •
                      - generic [ref=e804]: IV contraction in the long leg.
                    - listitem [ref=e805]:
                      - generic [ref=e806]: •
                      - generic [ref=e807]: Early assignment of the short leg.
                - link "Explore Scenario" [ref=e809] [cursor=pointer]:
                  - /url: /academy/strategies/calendar-spread
                  - text: Explore Scenario
                  - img
            - generic [ref=e810]:
              - generic [ref=e811]:
                - generic [ref=e813]:
                  - generic [ref=e814]:
                    - generic [ref=e815]: Volatility
                    - generic [ref=e816]:
                      - 'generic "Complexity: Advanced" [ref=e817]'
                      - text: Advanced
                  - heading "Diagonal Spread" [level=3] [ref=e821]
                - paragraph [ref=e822]: Sell a near-dated option at one strike and buy a longer-dated option at a different strike.
              - generic [ref=e823]:
                - generic [ref=e824]:
                  - generic [ref=e825]:
                    - generic [ref=e826]: Market view
                    - generic [ref=e827]:
                      - img [ref=e828]
                      - text: Neutral
                  - generic [ref=e829]:
                    - generic [ref=e830]: Objective
                    - generic [ref=e831]: Capital efficiency
                  - generic [ref=e832]:
                    - generic [ref=e833]: Max gain
                    - generic [ref=e834]: Variable; combines vertical and calendar dynamics
                  - generic [ref=e835]:
                    - generic [ref=e836]: Max loss
                    - generic [ref=e837]: Net debit paid (typically)
                - generic [ref=e838]:
                  - generic [ref=e839]: Risk profile
                  - generic [ref=e840]: Defined risk
                - generic [ref=e841]:
                  - generic [ref=e842]: Greek exposure
                  - generic [ref=e843]:
                    - 'button "Δ exposure: Mixed" [ref=e844]':
                      - generic [ref=e845]: Δ
                      - img [ref=e846]
                    - 'button "Θ exposure: Positive" [ref=e849]':
                      - generic [ref=e850]: Θ
                      - img [ref=e851]
                    - 'button "ν exposure: Positive" [ref=e853]':
                      - generic [ref=e854]: ν
                      - img [ref=e855]
                    - 'button "Γ exposure: Mixed" [ref=e857]':
                      - generic [ref=e858]: Γ
                      - img [ref=e859]
                - generic [ref=e862]:
                  - generic [ref=e863]: Ideal environment
                  - paragraph [ref=e864]: Mildly directional drift with stable to rising back-month implied volatility.
                - generic [ref=e865]:
                  - generic [ref=e866]: Key risks
                  - list [ref=e867]:
                    - listitem [ref=e868]:
                      - generic [ref=e869]: •
                      - generic [ref=e870]: Adverse directional move past the long leg.
                    - listitem [ref=e871]:
                      - generic [ref=e872]: •
                      - generic [ref=e873]: IV contraction in the long leg.
                    - listitem [ref=e874]:
                      - generic [ref=e875]: •
                      - generic [ref=e876]: Roll complexity at front-month expiration.
                - link "Explore Scenario" [ref=e878] [cursor=pointer]:
                  - /url: /academy/strategies/diagonal-spread
                  - text: Explore Scenario
                  - img
            - generic [ref=e879]:
              - generic [ref=e880]:
                - generic [ref=e882]:
                  - generic [ref=e883]:
                    - generic [ref=e884]: Volatility
                    - generic [ref=e885]:
                      - 'generic "Complexity: Intermediate" [ref=e886]'
                      - text: Intermediate
                  - heading "Long Straddle" [level=3] [ref=e890]
                - paragraph [ref=e891]: Buy a call and a put at the same strike and same expiration.
              - generic [ref=e892]:
                - generic [ref=e893]:
                  - generic [ref=e894]:
                    - generic [ref=e895]: Market view
                    - generic [ref=e896]:
                      - img [ref=e897]
                      - text: Volatile
                  - generic [ref=e901]:
                    - generic [ref=e902]: Objective
                    - generic [ref=e903]: Volatility
                  - generic [ref=e904]:
                    - generic [ref=e905]: Max gain
                    - generic [ref=e906]: Theoretically unlimited (call side)
                  - generic [ref=e907]:
                    - generic [ref=e908]: Max loss
                    - generic [ref=e909]: Total premium paid
                - generic [ref=e910]:
                  - generic [ref=e911]: Risk profile
                  - generic [ref=e912]: Defined risk
                - generic [ref=e913]:
                  - generic [ref=e914]: Greek exposure
                  - generic [ref=e915]:
                    - 'button "Δ exposure: Neutral" [ref=e916]':
                      - generic [ref=e917]: Δ
                      - img [ref=e918]
                    - 'button "Θ exposure: Negative" [ref=e919]':
                      - generic [ref=e920]: Θ
                      - img [ref=e921]
                    - 'button "ν exposure: Positive" [ref=e923]':
                      - generic [ref=e924]: ν
                      - img [ref=e925]
                    - 'button "Γ exposure: Positive" [ref=e927]':
                      - generic [ref=e928]: Γ
                      - img [ref=e929]
                - generic [ref=e931]:
                  - generic [ref=e932]: Ideal environment
                  - paragraph [ref=e933]: Large move in either direction with rising implied volatility.
                - generic [ref=e934]:
                  - generic [ref=e935]: Key risks
                  - list [ref=e936]:
                    - listitem [ref=e937]:
                      - generic [ref=e938]: •
                      - generic [ref=e939]: Underlying stays near the strike at expiration.
                    - listitem [ref=e940]:
                      - generic [ref=e941]: •
                      - generic [ref=e942]: IV contraction (vol crush) after an event.
                    - listitem [ref=e943]:
                      - generic [ref=e944]: •
                      - generic [ref=e945]: Time decay accelerates near expiration.
                - link "Explore Scenario" [ref=e947] [cursor=pointer]:
                  - /url: /academy/strategies/long-straddle
                  - text: Explore Scenario
                  - img
            - generic [ref=e948]:
              - generic [ref=e949]:
                - generic [ref=e951]:
                  - generic [ref=e952]:
                    - generic [ref=e953]: Volatility
                    - generic [ref=e954]:
                      - 'generic "Complexity: Intermediate" [ref=e955]'
                      - text: Intermediate
                  - heading "Long Strangle" [level=3] [ref=e959]
                - paragraph [ref=e960]: Buy an out-of-the-money call and an out-of-the-money put at different strikes, same expiration.
              - generic [ref=e961]:
                - generic [ref=e962]:
                  - generic [ref=e963]:
                    - generic [ref=e964]: Market view
                    - generic [ref=e965]:
                      - img [ref=e966]
                      - text: Volatile
                  - generic [ref=e970]:
                    - generic [ref=e971]: Objective
                    - generic [ref=e972]: Volatility
                  - generic [ref=e973]:
                    - generic [ref=e974]: Max gain
                    - generic [ref=e975]: Theoretically unlimited (call side)
                  - generic [ref=e976]:
                    - generic [ref=e977]: Max loss
                    - generic [ref=e978]: Total premium paid
                - generic [ref=e979]:
                  - generic [ref=e980]: Risk profile
                  - generic [ref=e981]: Defined risk
                - generic [ref=e982]:
                  - generic [ref=e983]: Greek exposure
                  - generic [ref=e984]:
                    - 'button "Δ exposure: Neutral" [ref=e985]':
                      - generic [ref=e986]: Δ
                      - img [ref=e987]
                    - 'button "Θ exposure: Negative" [ref=e988]':
                      - generic [ref=e989]: Θ
                      - img [ref=e990]
                    - 'button "ν exposure: Positive" [ref=e992]':
                      - generic [ref=e993]: ν
                      - img [ref=e994]
                    - 'button "Γ exposure: Positive" [ref=e996]':
                      - generic [ref=e997]: Γ
                      - img [ref=e998]
                - generic [ref=e1000]:
                  - generic [ref=e1001]: Ideal environment
                  - paragraph [ref=e1002]: Large move in either direction with rising implied volatility.
                - generic [ref=e1003]:
                  - generic [ref=e1004]: Key risks
                  - list [ref=e1005]:
                    - listitem [ref=e1006]:
                      - generic [ref=e1007]: •
                      - generic [ref=e1008]: Range-bound price action between the strikes.
                    - listitem [ref=e1009]:
                      - generic [ref=e1010]: •
                      - generic [ref=e1011]: IV contraction after an event.
                    - listitem [ref=e1012]:
                      - generic [ref=e1013]: •
                      - generic [ref=e1014]: Time decay erodes both legs.
                - link "Explore Scenario" [ref=e1016] [cursor=pointer]:
                  - /url: /academy/strategies/long-strangle
                  - text: Explore Scenario
                  - img
            - generic [ref=e1017]:
              - generic [ref=e1018]:
                - generic [ref=e1020]:
                  - generic [ref=e1021]:
                    - generic [ref=e1022]: Protection
                    - generic [ref=e1023]:
                      - 'generic "Complexity: Beginner" [ref=e1024]'
                      - text: Beginner
                  - heading "Protective Put" [level=3] [ref=e1028]
                - paragraph [ref=e1029]: Hold shares and buy a put to floor downside on those shares.
              - generic [ref=e1030]:
                - generic [ref=e1031]:
                  - generic [ref=e1032]:
                    - generic [ref=e1033]: Market view
                    - generic [ref=e1034]:
                      - img [ref=e1035]
                      - text: Bullish
                  - generic [ref=e1038]:
                    - generic [ref=e1039]: Objective
                    - generic [ref=e1040]: Hedging
                  - generic [ref=e1041]:
                    - generic [ref=e1042]: Max gain
                    - generic [ref=e1043]: Share appreciation − premium paid
                  - generic [ref=e1044]:
                    - generic [ref=e1045]: Max loss
                    - generic [ref=e1046]: (Cost basis − strike) + premium
                - generic [ref=e1047]:
                  - generic [ref=e1048]: Risk profile
                  - generic [ref=e1049]: Defined risk
                - generic [ref=e1050]:
                  - generic [ref=e1051]: Greek exposure
                  - generic [ref=e1052]:
                    - 'button "Δ exposure: Positive" [ref=e1053]':
                      - generic [ref=e1054]: Δ
                      - img [ref=e1055]
                    - 'button "Θ exposure: Negative" [ref=e1057]':
                      - generic [ref=e1058]: Θ
                      - img [ref=e1059]
                    - 'button "ν exposure: Positive" [ref=e1061]':
                      - generic [ref=e1062]: ν
                      - img [ref=e1063]
                    - 'button "Γ exposure: Positive" [ref=e1065]':
                      - generic [ref=e1066]: Γ
                      - img [ref=e1067]
                - generic [ref=e1069]:
                  - generic [ref=e1070]: Ideal environment
                  - paragraph [ref=e1071]: Bullish bias with downside concern; moderate implied volatility.
                - generic [ref=e1072]:
                  - generic [ref=e1073]: Key risks
                  - list [ref=e1074]:
                    - listitem [ref=e1075]:
                      - generic [ref=e1076]: •
                      - generic [ref=e1077]: Premium paid drags on returns if downside doesn't materialize.
                    - listitem [ref=e1078]:
                      - generic [ref=e1079]: •
                      - generic [ref=e1080]: IV contraction reduces put value.
                    - listitem [ref=e1081]:
                      - generic [ref=e1082]: •
                      - generic [ref=e1083]: Time decay on the put through the holding period.
                - link "Explore Scenario" [ref=e1085] [cursor=pointer]:
                  - /url: /academy/strategies/protective-put
                  - text: Explore Scenario
                  - img
            - generic [ref=e1086]:
              - generic [ref=e1087]:
                - generic [ref=e1089]:
                  - generic [ref=e1090]:
                    - generic [ref=e1091]: Protection
                    - generic [ref=e1092]:
                      - 'generic "Complexity: Beginner" [ref=e1093]'
                      - text: Beginner
                  - heading "Collar" [level=3] [ref=e1097]
                - paragraph [ref=e1098]: Hold shares, buy a protective put, and sell a covered call to offset the put cost.
              - generic [ref=e1099]:
                - generic [ref=e1100]:
                  - generic [ref=e1101]:
                    - generic [ref=e1102]: Market view
                    - generic [ref=e1103]:
                      - img [ref=e1104]
                      - text: Neutral
                  - generic [ref=e1105]:
                    - generic [ref=e1106]: Objective
                    - generic [ref=e1107]: Hedging
                  - generic [ref=e1108]:
                    - generic [ref=e1109]: Max gain
                    - generic [ref=e1110]: (Call strike − cost basis) ± net premium
                  - generic [ref=e1111]:
                    - generic [ref=e1112]: Max loss
                    - generic [ref=e1113]: (Cost basis − put strike) ± net premium
                - generic [ref=e1114]:
                  - generic [ref=e1115]: Risk profile
                  - generic [ref=e1116]: Defined risk
                - generic [ref=e1117]:
                  - generic [ref=e1118]: Greek exposure
                  - generic [ref=e1119]:
                    - 'button "Δ exposure: Positive" [ref=e1120]':
                      - generic [ref=e1121]: Δ
                      - img [ref=e1122]
                    - 'button "Θ exposure: Neutral" [ref=e1124]':
                      - generic [ref=e1125]: Θ
                      - img [ref=e1126]
                    - 'button "ν exposure: Neutral" [ref=e1127]':
                      - generic [ref=e1128]: ν
                      - img [ref=e1129]
                    - 'button "Γ exposure: Neutral" [ref=e1130]':
                      - generic [ref=e1131]: Γ
                      - img [ref=e1132]
                - generic [ref=e1133]:
                  - generic [ref=e1134]: Ideal environment
                  - paragraph [ref=e1135]: Range-bound prices and willingness to cap upside in exchange for a floor.
                - generic [ref=e1136]:
                  - generic [ref=e1137]: Key risks
                  - list [ref=e1138]:
                    - listitem [ref=e1139]:
                      - generic [ref=e1140]: •
                      - generic [ref=e1141]: Upside capped at the call strike.
                    - listitem [ref=e1142]:
                      - generic [ref=e1143]: •
                      - generic [ref=e1144]: Assignment of the short call.
                    - listitem [ref=e1145]:
                      - generic [ref=e1146]: •
                      - generic [ref=e1147]: Net debit if the put costs more than the call premium collected.
                - link "Explore Scenario" [ref=e1149] [cursor=pointer]:
                  - /url: /academy/strategies/collar
                  - text: Explore Scenario
                  - img
            - generic [ref=e1150]:
              - generic [ref=e1151]:
                - generic [ref=e1153]:
                  - generic [ref=e1154]:
                    - generic [ref=e1155]: Precision
                    - generic [ref=e1156]:
                      - 'generic "Complexity: Advanced" [ref=e1157]'
                      - text: Advanced
                  - heading "Butterfly" [level=3] [ref=e1161]
                - paragraph [ref=e1162]: Combine three strikes (1 long lower, 2 short middle, 1 long upper) in the same expiration.
              - generic [ref=e1163]:
                - generic [ref=e1164]:
                  - generic [ref=e1165]:
                    - generic [ref=e1166]: Market view
                    - generic [ref=e1167]:
                      - img [ref=e1168]
                      - text: Neutral
                  - generic [ref=e1169]:
                    - generic [ref=e1170]: Objective
                    - generic [ref=e1171]: Defined risk
                  - generic [ref=e1172]:
                    - generic [ref=e1173]: Max gain
                    - generic [ref=e1174]: Width between strikes − net debit
                  - generic [ref=e1175]:
                    - generic [ref=e1176]: Max loss
                    - generic [ref=e1177]: Net debit paid
                - generic [ref=e1178]:
                  - generic [ref=e1179]: Risk profile
                  - generic [ref=e1180]: Defined risk
                - generic [ref=e1181]:
                  - generic [ref=e1182]: Greek exposure
                  - generic [ref=e1183]:
                    - 'button "Δ exposure: Neutral" [ref=e1184]':
                      - generic [ref=e1185]: Δ
                      - img [ref=e1186]
                    - 'button "Θ exposure: Positive" [ref=e1187]':
                      - generic [ref=e1188]: Θ
                      - img [ref=e1189]
                    - 'button "ν exposure: Negative" [ref=e1191]':
                      - generic [ref=e1192]: ν
                      - img [ref=e1193]
                    - 'button "Γ exposure: Mixed" [ref=e1195]':
                      - generic [ref=e1196]: Γ
                      - img [ref=e1197]
                - generic [ref=e1200]:
                  - generic [ref=e1201]: Ideal environment
                  - paragraph [ref=e1202]: Underlying pins near the middle strike at expiration.
                - generic [ref=e1203]:
                  - generic [ref=e1204]: Key risks
                  - list [ref=e1205]:
                    - listitem [ref=e1206]:
                      - generic [ref=e1207]: •
                      - generic [ref=e1208]: Underlying drifts away from the middle strike.
                    - listitem [ref=e1209]:
                      - generic [ref=e1210]: •
                      - generic [ref=e1211]: Wide bid/ask spreads on multi-leg orders.
                    - listitem [ref=e1212]:
                      - generic [ref=e1213]: •
                      - generic [ref=e1214]: Pin risk at the middle strike on expiration day.
                - link "Explore Scenario" [ref=e1216] [cursor=pointer]:
                  - /url: /academy/strategies/butterfly
                  - text: Explore Scenario
                  - img
            - generic [ref=e1217]:
              - generic [ref=e1218]:
                - generic [ref=e1220]:
                  - generic [ref=e1221]:
                    - generic [ref=e1222]: Advanced
                    - generic [ref=e1223]:
                      - 'generic "Complexity: Advanced" [ref=e1224]'
                      - text: Advanced
                  - heading "Ratio Spread" [level=3] [ref=e1228]
                - paragraph [ref=e1229]: Buy one option and sell two or more options at a different strike in the same expiration.
              - generic [ref=e1230]:
                - generic [ref=e1231]:
                  - generic [ref=e1232]:
                    - generic [ref=e1233]: Market view
                    - generic [ref=e1234]:
                      - img [ref=e1235]
                      - text: Neutral
                  - generic [ref=e1236]:
                    - generic [ref=e1237]: Objective
                    - generic [ref=e1238]: Capital efficiency
                  - generic [ref=e1239]:
                    - generic [ref=e1240]: Max gain
                    - generic [ref=e1241]: Capped between the strikes; declines beyond the short strikes
                  - generic [ref=e1242]:
                    - generic [ref=e1243]: Max loss
                    - generic [ref=e1244]: Theoretically large beyond the short strikes (uncovered ratio)
                - generic [ref=e1245]:
                  - generic [ref=e1246]: Risk profile
                  - generic [ref=e1247]:
                    - img
                    - text: Undefined risk
                - generic [ref=e1248]:
                  - generic [ref=e1249]: Greek exposure
                  - generic [ref=e1250]:
                    - 'button "Δ exposure: Mixed" [ref=e1251]':
                      - generic [ref=e1252]: Δ
                      - img [ref=e1253]
                    - 'button "Θ exposure: Positive" [ref=e1256]':
                      - generic [ref=e1257]: Θ
                      - img [ref=e1258]
                    - 'button "ν exposure: Negative" [ref=e1260]':
                      - generic [ref=e1261]: ν
                      - img [ref=e1262]
                    - 'button "Γ exposure: Mixed" [ref=e1264]':
                      - generic [ref=e1265]: Γ
                      - img [ref=e1266]
                - generic [ref=e1269]:
                  - generic [ref=e1270]: Ideal environment
                  - paragraph [ref=e1271]: Moderate directional drift toward - but not beyond - the short strikes.
                - generic [ref=e1272]:
                  - generic [ref=e1273]: Key risks
                  - list [ref=e1274]:
                    - listitem [ref=e1275]:
                      - generic [ref=e1276]: •
                      - generic [ref=e1277]: Sharp move past the short strikes creates uncapped exposure.
                    - listitem [ref=e1278]:
                      - generic [ref=e1279]: •
                      - generic [ref=e1280]: Naked short-leg exposure in some configurations.
                    - listitem [ref=e1281]:
                      - generic [ref=e1282]: •
                      - generic [ref=e1283]: Margin requirements can grow with adverse moves.
                - link "Explore Scenario" [ref=e1285] [cursor=pointer]:
                  - /url: /academy/strategies/ratio-spread
                  - text: Explore Scenario
                  - img
            - generic [ref=e1286]:
              - generic [ref=e1287]:
                - generic [ref=e1289]:
                  - generic [ref=e1290]:
                    - generic [ref=e1291]: Advanced
                    - generic [ref=e1292]:
                      - 'generic "Complexity: Advanced" [ref=e1293]'
                      - text: Advanced
                  - heading "Backspread" [level=3] [ref=e1297]
                - paragraph [ref=e1298]: Sell one option and buy two or more options at a further strike in the same expiration.
              - generic [ref=e1299]:
                - generic [ref=e1300]:
                  - generic [ref=e1301]:
                    - generic [ref=e1302]: Market view
                    - generic [ref=e1303]:
                      - img [ref=e1304]
                      - text: Volatile
                  - generic [ref=e1308]:
                    - generic [ref=e1309]: Objective
                    - generic [ref=e1310]: Volatility
                  - generic [ref=e1311]:
                    - generic [ref=e1312]: Max gain
                    - generic [ref=e1313]: Theoretically unlimited (long side dominates)
                  - generic [ref=e1314]:
                    - generic [ref=e1315]: Max loss
                    - generic [ref=e1316]: Capped between the strikes (typically)
                - generic [ref=e1317]:
                  - generic [ref=e1318]: Risk profile
                  - generic [ref=e1319]: Defined risk
                - generic [ref=e1320]:
                  - generic [ref=e1321]: Greek exposure
                  - generic [ref=e1322]:
                    - 'button "Δ exposure: Mixed" [ref=e1323]':
                      - generic [ref=e1324]: Δ
                      - img [ref=e1325]
                    - 'button "Θ exposure: Negative" [ref=e1328]':
                      - generic [ref=e1329]: Θ
                      - img [ref=e1330]
                    - 'button "ν exposure: Positive" [ref=e1332]':
                      - generic [ref=e1333]: ν
                      - img [ref=e1334]
                    - 'button "Γ exposure: Positive" [ref=e1336]':
                      - generic [ref=e1337]: Γ
                      - img [ref=e1338]
                - generic [ref=e1340]:
                  - generic [ref=e1341]: Ideal environment
                  - paragraph [ref=e1342]: Sharp directional move with rising implied volatility.
                - generic [ref=e1343]:
                  - generic [ref=e1344]: Key risks
                  - list [ref=e1345]:
                    - listitem [ref=e1346]:
                      - generic [ref=e1347]: •
                      - generic [ref=e1348]: Range-bound action between the strikes produces the maximum loss.
                    - listitem [ref=e1349]:
                      - generic [ref=e1350]: •
                      - generic [ref=e1351]: Time decay between the strikes.
                    - listitem [ref=e1352]:
                      - generic [ref=e1353]: •
                      - generic [ref=e1354]: IV contraction reduces the long-leg value.
                - link "Explore Scenario" [ref=e1356] [cursor=pointer]:
                  - /url: /academy/strategies/backspread
                  - text: Explore Scenario
                  - img
        - generic [ref=e1357]:
          - img [ref=e1358]
          - paragraph [ref=e1360]: All Academy content is educational and informational only. Nothing here is investment advice, a solicitation, or an offer to buy or sell any security. You are solely responsible for any decisions you make at your broker.
    - contentinfo [ref=e1361]:
      - generic [ref=e1362]:
        - generic [ref=e1363]:
          - paragraph [ref=e1364]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e1365]:
            - link "Privacy Policy" [ref=e1367] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e1368]:
              - generic [ref=e1369]: ·
              - link "Terms of Service" [ref=e1370] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e1371]:
              - generic [ref=e1372]: ·
              - link "Disclosures" [ref=e1373] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e1374]:
              - generic [ref=e1375]: ·
              - link "Risk Warning" [ref=e1376] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e1377]:
              - generic [ref=e1378]: ·
              - link "Contact" [ref=e1379] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e1380]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e1381]
```

# Test source

```ts
  957  |         await page.goBack({
  958  |           waitUntil: 'domcontentloaded'
  959  |         });
  960  | 
  961  |         await expect(
  962  |           page
  963  |         ).toHaveURL(
  964  |           /\/academy\/strategies/
  965  |         );
  966  |       }
  967  |     );
  968  | 
  969  |     test(
  970  |       'Strategy library search finds Collar and clears',
  971  |       async ({ page }) => {
  972  |         await openAcademy(
  973  |           page,
  974  |           '/academy'
  975  |         );
  976  | 
  977  |         await safeClick(
  978  |           page.getByRole(
  979  |             'link',
  980  |             {
  981  |               name: /^strategy library$/i
  982  |             }
  983  |           ).first(),
  984  |           'Strategy library'
  985  |         );
  986  | 
  987  |         const search =
  988  |           page.getByRole(
  989  |             'textbox',
  990  |             {
  991  |               name: /name or description/i
  992  |             }
  993  |           );
  994  | 
  995  |         await search.fill(
  996  |           'collar'
  997  |         );
  998  | 
  999  |         await expect(
  1000 |           page.getByRole(
  1001 |             'heading',
  1002 |             {
  1003 |               name: /^collar$/i
  1004 |             }
  1005 |           )
  1006 |         ).toBeVisible();
  1007 | 
  1008 |         await search.fill(
  1009 |           ''
  1010 |         );
  1011 | 
  1012 |         await expect(
  1013 |           page.getByRole(
  1014 |             'heading',
  1015 |             {
  1016 |               name: /^covered call$/i
  1017 |             }
  1018 |           )
  1019 |         ).toBeVisible();
  1020 |       }
  1021 |     );
  1022 | 
  1023 |     test(
  1024 |       'Strategy library clear all restores every strategy',
  1025 |       async ({ page }) => {
  1026 |         await openAcademy(
  1027 |           page,
  1028 |           '/academy'
  1029 |         );
  1030 | 
  1031 |         await safeClick(
  1032 |           page.getByRole(
  1033 |             'link',
  1034 |             {
  1035 |               name: /^strategy library$/i
  1036 |             }
  1037 |           ).first(),
  1038 |           'Strategy library'
  1039 |         );
  1040 | 
  1041 |         await safeClick(
  1042 |           page.locator(
  1043 |             'main'
  1044 |           ).getByRole(
  1045 |             'button',
  1046 |             {
  1047 |               name: /^protection\b/i
  1048 |             }
  1049 |           ),
  1050 |           'Protection strategies'
  1051 |         );
  1052 | 
  1053 |         await expect(
  1054 |           page.locator(
  1055 |             'main'
  1056 |           )
> 1057 |         ).toContainText(
       |           ^ Error: expect(locator).toContainText(expected) failed
  1058 |           /2 of 18/i
  1059 |         );
  1060 | 
  1061 |         await safeClick(
  1062 |           page.getByRole(
  1063 |             'button',
  1064 |             {
  1065 |               name: /^clear all$/i
  1066 |             }
  1067 |           ),
  1068 |           'Clear all strategy filters'
  1069 |         );
  1070 | 
  1071 |         await expect(
  1072 |           page.locator(
  1073 |             'main'
  1074 |           )
  1075 |         ).toContainText(
  1076 |           /18 of 18/i
  1077 |         );
  1078 | 
  1079 |         await expect(
  1080 |           page.getByRole(
  1081 |             'heading',
  1082 |             {
  1083 |               name: /^covered call$/i
  1084 |             }
  1085 |           )
  1086 |         ).toBeVisible();
  1087 |       }
  1088 |     );
  1089 | 
  1090 |     test(
  1091 |       'Lessons navigation returns without marking the lesson complete',
  1092 |       async ({ page }) => {
  1093 |         await openAcademy(
  1094 |           page,
  1095 |           '/academy/lessons'
  1096 |         );
  1097 | 
  1098 |         await safeClick(
  1099 |           page.getByRole(
  1100 |             'link',
  1101 |             {
  1102 |               name: /reading an options chain/i
  1103 |             }
  1104 |           ).first(),
  1105 |           'Open lesson'
  1106 |         );
  1107 | 
  1108 |         await expect(
  1109 |           page.getByRole(
  1110 |             'button',
  1111 |             {
  1112 |               name: /^mark as complete$/i
  1113 |             }
  1114 |           )
  1115 |         ).toBeVisible();
  1116 | 
  1117 |         await safeClick(
  1118 |           page.getByRole(
  1119 |             'link',
  1120 |             {
  1121 |               name: /^lessons$/i
  1122 |             }
  1123 |           ).first(),
  1124 |           'Lessons'
  1125 |         );
  1126 | 
  1127 |         await expect(
  1128 |           page
  1129 |         ).toHaveURL(
  1130 |           /\/academy\/lessons/
  1131 |         );
  1132 | 
  1133 |         await expect(
  1134 |           page.getByRole(
  1135 |             'link',
  1136 |             {
  1137 |               name: /reading an options chain/i
  1138 |             }
  1139 |           ).first()
  1140 |         ).toBeVisible();
  1141 |       }
  1142 |     );
  1143 | 
  1144 |     test(
  1145 |       'Strategy library opens Collar and returns',
  1146 |       async ({ page }) => {
  1147 |         await openAcademy(
  1148 |           page,
  1149 |           '/academy'
  1150 |         );
  1151 | 
  1152 |         await safeClick(
  1153 |           page.getByRole(
  1154 |             'link',
  1155 |             {
  1156 |               name: /^strategy library$/i
  1157 |             }
```