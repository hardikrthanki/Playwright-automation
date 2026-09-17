# AIR Automation Validation Summary

Generated: 9/17/2026, 6:07:49 PM

Project: OOLTool

Environment: UAT

Release Decision: NO GO

## Purpose

This document explains what the latest automation execution validated in plain business language. It is generated from AIR using test titles, module mapping, execution status, and evidence metadata.

## Execution Summary

| Metric | Count |
| --- | ---: |
| Unique Tests | 155 |
| Passed | 127 |
| Failed | 2 |
| Skipped / Not Executed | 26 |
| Flaky | 0 |
| Attempts | 155 |

## Status Breakdown

| Status | Count |
| --- | ---: |
| failed | 2 |
| passed | 127 |
| skipped | 26 |

## Area Breakdown

| Area | Validations |
| --- | ---: |
| Accessibility | 15 |
| Authentication | 46 |
| Billing | 39 |
| Dashboard | 16 |
| MFA | 1 |
| Onboarding | 3 |
| Password | 14 |
| Profile | 1 |
| Signup | 20 |

## What Was Validated

| Result | Area | Scenario | Why It Matters | Expected Outcome |
| --- | --- | --- | --- | --- |
| PASS | Authentication | Register -> Verify Email -> Login -> Risk -> Compliance | Confirm users can authenticate safely and invalid access is blocked. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Signup | Signup form blocks empty required fields | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Signup | Signup form blocks invalid email format | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Accessibility | Signup name fields expose browser-friendly autocomplete metadata | Ensure the application remains usable and inspectable for accessibility and browser behavior. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Signup | Signup form blocks missing domain email input | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Signup | Signup form blocks missing @ email input | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Signup | Signup form blocks SQL injection email input | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Signup | Signup form blocks XSS injection email input | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Signup | Signup email trims leading and trailing spaces | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Password | Signup form keeps submit disabled without password and confirmation | Confirm password rules and password-change guardrails protect the account. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Password | Signup form keeps submit disabled when passwords do not match | Confirm password rules and password-change guardrails protect the account. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Signup | Signup form keeps OTP request disabled without mobile number | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Signup | Signup form keeps OTP request disabled for short mobile number | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Signup | Signup mobile input strips letters and keeps OTP disabled | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Signup | Signup mobile input normalizes formatted US number | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Signup | Signup mobile input normalizes spaces and parentheses | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Signup | Signup mobile input limits extra digits to ten digits | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Signup | Signup form shows US mobile number guidance before OTP request | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | Expected controls and information should be visible to the user. |
| PASS | Signup | Signup OTP input limits entry to six digits | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Signup | Signup OTP input trims pasted value to six digits | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Signup | Signup OTP input accepts digits only | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Signup | Signup OTP verify button is enabled only for six digits | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Signup | Signup OTP resend or cooldown state is visible after code request | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | Expected controls and information should be visible to the user. |
| PASS | Onboarding | Signup blocks already registered email address | Confirm the related product behavior is stable and safe for the current execution. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Password | Signup password visibility toggles work for both password fields | Confirm password rules and password-change guardrails protect the account. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Signup | Signup submit stays disabled before mobile OTP verification | Confirm account creation inputs, OTP gates, and onboarding guardrails behave correctly. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Password | Signup password drafts are cleared after refresh | Confirm password rules and password-change guardrails protect the account. | The page should remain usable after refresh without losing required state. |
| PASS | Password | Accepts a valid password that satisfies configured policy | Confirm password rules and password-change guardrails protect the account. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Password | Rejects password shorter than configured minimum length | Confirm password rules and password-change guardrails protect the account. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Password | Rejects banned passwords from configured policy | Confirm password rules and password-change guardrails protect the account. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Password | Banned password comparison is case-insensitive | Confirm password rules and password-change guardrails protect the account. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Password | Uppercase rule follows configuration | Confirm password rules and password-change guardrails protect the account. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Password | Lowercase rule follows configuration | Confirm password rules and password-change guardrails protect the account. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Password | Digit rule follows configuration | Confirm password rules and password-change guardrails protect the account. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Password | Symbol rule follows configuration | Confirm password rules and password-change guardrails protect the account. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Authentication | Login screen navigates to forgot password and back | Confirm users can authenticate safely and invalid access is blocked. | Browser navigation should not break the session or page state. |
| PASS | Authentication | Login direct link remains usable after refresh | Confirm users can authenticate safely and invalid access is blocked. | The page should remain usable after refresh without losing required state. |
| PASS | Authentication | Login password draft is cleared after refresh | Confirm users can authenticate safely and invalid access is blocked. | The page should remain usable after refresh without losing required state. |
| PASS | Authentication | Forgot password back to login clears reset-only navigation state | Confirm users can authenticate safely and invalid access is blocked. | Browser navigation should not break the session or page state. |
| PASS | Authentication | Forgot password email draft is cleared after refresh | Confirm users can authenticate safely and invalid access is blocked. | The page should remain usable after refresh without losing required state. |
| PASS | Authentication | Forgot password direct link remains usable after refresh | Confirm users can authenticate safely and invalid access is blocked. | The page should remain usable after refresh without losing required state. |
| PASS | Authentication | Public auth routes tolerate trailing slash and unknown query parameters | Confirm users can authenticate safely and invalid access is blocked. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Authentication | Login screen navigates to create account | Confirm users can authenticate safely and invalid access is blocked. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Accessibility | Auth pages remain usable with browser back and forward | Ensure the application remains usable and inspectable for accessibility and browser behavior. | Browser navigation should not break the session or page state. |
| PASS | Authentication | Login password visibility control is exposed without submitting form | Confirm users can authenticate safely and invalid access is blocked. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Authentication | Register screen exposes required public form controls | Confirm users can authenticate safely and invalid access is blocked. | Expected controls and information should be visible to the user. |
| PASS | Authentication | Register screen password visibility toggle changes password field type | Confirm users can authenticate safely and invalid access is blocked. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Authentication | Register screen navigates back to login | Confirm users can authenticate safely and invalid access is blocked. | Browser navigation should not break the session or page state. |
| PASS | Authentication | Login form blocks empty required fields | Confirm users can authenticate safely and invalid access is blocked. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Authentication | Login form blocks empty email only | Confirm users can authenticate safely and invalid access is blocked. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Authentication | Login form blocks empty password only | Confirm users can authenticate safely and invalid access is blocked. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Authentication | Login form blocks invalid email format | Confirm users can authenticate safely and invalid access is blocked. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Authentication | Login form rejects SQL injection input | Confirm users can authenticate safely and invalid access is blocked. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Authentication | Login form rejects XSS injection input | Confirm users can authenticate safely and invalid access is blocked. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Authentication | Login form rejects very long email input | Confirm users can authenticate safely and invalid access is blocked. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Authentication | Login form does not authenticate email with leading and trailing spaces | Confirm users can authenticate safely and invalid access is blocked. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Authentication | Login form keeps user on login when invalid credentials are submitted with Enter | Confirm users can authenticate safely and invalid access is blocked. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Authentication | Protected route /dashboard redirects unauthenticated user to login | Confirm users can authenticate safely and invalid access is blocked. | Navigation should route the user to the correct protected or public destination. |
| PASS | Authentication | Protected route /dashboard/profile redirects unauthenticated user to login | Confirm users can authenticate safely and invalid access is blocked. | Navigation should route the user to the correct protected or public destination. |
| PASS | Authentication | Protected route /dashboard/billing redirects unauthenticated user to login | Confirm users can authenticate safely and invalid access is blocked. | Navigation should route the user to the correct protected or public destination. |
| PASS | Authentication | Protected route /onboarding redirects unauthenticated user to login | Confirm users can authenticate safely and invalid access is blocked. | Navigation should route the user to the correct protected or public destination. |
| PASS | Authentication | Protected route /dashboard/settings redirects unauthenticated user to login | Confirm users can authenticate safely and invalid access is blocked. | Navigation should route the user to the correct protected or public destination. |
| PASS | Authentication | Protected route /dashboard/security redirects unauthenticated user to login | Confirm users can authenticate safely and invalid access is blocked. | Navigation should route the user to the correct protected or public destination. |
| PASS | Authentication | Protected route /dashboard/subscription redirects unauthenticated user to login | Confirm users can authenticate safely and invalid access is blocked. | Navigation should route the user to the correct protected or public destination. |
| PASS | Authentication | Protected route /dashboard/notifications redirects unauthenticated user to login | Confirm users can authenticate safely and invalid access is blocked. | Navigation should route the user to the correct protected or public destination. |
| PASS | Authentication | Protected route /dashboard/activity redirects unauthenticated user to login | Confirm users can authenticate safely and invalid access is blocked. | Navigation should route the user to the correct protected or public destination. |
| PASS | Authentication | Forgot password form blocks empty email | Confirm users can authenticate safely and invalid access is blocked. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Authentication | Forgot password form blocks invalid email format | Confirm users can authenticate safely and invalid access is blocked. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Authentication | Forgot password rejects SQL injection input | Confirm users can authenticate safely and invalid access is blocked. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Authentication | Forgot password rejects XSS injection input | Confirm users can authenticate safely and invalid access is blocked. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Authentication | Forgot password rejects very long email input | Confirm users can authenticate safely and invalid access is blocked. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Authentication | Forgot password keeps user on reset page for email with surrounding spaces | Confirm users can authenticate safely and invalid access is blocked. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Accessibility | Login form exposes accessible email and password fields | Ensure the application remains usable and inspectable for accessibility and browser behavior. | Expected controls and information should be visible to the user. |
| PASS | Accessibility | Login page remains usable on mobile viewport | Ensure the application remains usable and inspectable for accessibility and browser behavior. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Accessibility | Login form supports Enter key submission without authenticating invalid data | Ensure the application remains usable and inspectable for accessibility and browser behavior. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Accessibility | Login form keyboard tab order reaches primary controls | Ensure the application remains usable and inspectable for accessibility and browser behavior. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Accessibility | Forgot password form supports Back to login navigation | Ensure the application remains usable and inspectable for accessibility and browser behavior. | Browser navigation should not break the session or page state. |
| PASS | Accessibility | Forgot password form exposes accessible email and submit controls | Ensure the application remains usable and inspectable for accessibility and browser behavior. | Expected controls and information should be visible to the user. |
| PASS | Accessibility | Forgot password page remains usable on mobile viewport | Ensure the application remains usable and inspectable for accessibility and browser behavior. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Accessibility | Forgot password form keyboard tab order reaches primary controls | Ensure the application remains usable and inspectable for accessibility and browser behavior. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Accessibility | Register page keeps form visible after browser refresh | Ensure the application remains usable and inspectable for accessibility and browser behavior. | The page should remain usable after refresh without losing required state. |
| PASS | Accessibility | Register page exposes accessible primary actions | Ensure the application remains usable and inspectable for accessibility and browser behavior. | Expected controls and information should be visible to the user. |
| PASS | Accessibility | Register page remains usable on mobile viewport | Ensure the application remains usable and inspectable for accessibility and browser behavior. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Accessibility | Register form keyboard tab order reaches primary fields | Ensure the application remains usable and inspectable for accessibility and browser behavior. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Onboarding | Fast Risk and Compliance field validation | Confirm the related product behavior is stable and safe for the current execution. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Onboarding | Full Risk and Compliance field validation in one session | Confirm the related product behavior is stable and safe for the current execution. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Billing | Plan catalog pricing overlay trial and complete-setup in one session | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Billing | Curious Explorer free plan completes onboarding without Stripe | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | New user can reach Overlay Strategists trial option | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| FAIL | Billing | New user can start Overlay Strategists trial with card | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | Overlay Strategists with-card trial opens Stripe checkout with trial details | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The requested page, modal, portal, or panel should open without a load error. |
| SKIPPED | Billing | Overlay Strategists with-card trial blocks missing Stripe card details | Confirm subscription, plan, invoice, and billing controls are visible and safe. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| SKIPPED | Billing | Overlay Strategists with-card trial rejects declined Stripe card | Confirm subscription, plan, invoice, and billing controls are visible and safe. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Billing | New user can start Overlay Strategists trial without card | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Billing | Overlay Strategists trial requires terms acceptance | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | Income Builder monthly checkout shows subscription summary before payment | Confirm subscription, plan, invoice, and billing controls are visible and safe. | Expected controls and information should be visible to the user. |
| SKIPPED | Billing | Portfolio Hedger annual checkout shows subscription summary before payment | Confirm subscription, plan, invoice, and billing controls are visible and safe. | Expected controls and information should be visible to the user. |
| SKIPPED | Billing | Income Builder annual checkout shows subscription summary before payment | Confirm subscription, plan, invoice, and billing controls are visible and safe. | Expected controls and information should be visible to the user. |
| SKIPPED | Billing | Marketplace monthly checkout shows subscription summary before payment | Confirm subscription, plan, invoice, and billing controls are visible and safe. | Expected controls and information should be visible to the user. |
| FAIL | Billing | Paid plan checkout summaries currency refresh and return use one user | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The page should remain usable after refresh without losing required state. |
| SKIPPED | Billing | Income Builder checkout shows currency and conversion details before payment | Confirm subscription, plan, invoice, and billing controls are visible and safe. | Expected controls and information should be visible to the user. |
| SKIPPED | Billing | Income Builder checkout preserves context on refresh and returns safely before payment | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The page should remain usable after refresh without losing required state. |
| SKIPPED | Billing | SC-48: Stripe checkout displays renewal or auto-renewal copy before payment | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | SC-61: Missing cardholder name is blocked before subscription activation | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | SC-62: Failed checkout keeps user without active paid subscription | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | SC-63: Closing Stripe checkout returns user safely without activating subscription | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | Disposable user can start Overlay Strategists trial without card | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | Disposable user can start Overlay Strategists trial with card | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | Disposable user can purchase Income Builder monthly and reach Billing | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | Disposable user can purchase Overlay Strategists monthly and reach Billing | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | Disposable user can purchase Portfolio Hedger monthly and reach Billing | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | Disposable user can purchase Marketplace monthly and reach Billing | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | Disposable user can purchase configured paid annual plan and reach Billing | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Billing | Prepared paid user exposes upgrade downgrade and interval controls | Confirm subscription, plan, invoice, and billing controls are visible and safe. | Expected controls and information should be visible to the user. |
| PASS | Billing | Prepared paid user can preview monthly and annual upgrade calculations | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | Prepared paid user can accept terms and submit upgrade payment | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Billing | Prepared paid user can preview downgrade calculations without submitting | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Billing | Prepared paid user can preview billing interval change without submitting | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | Prepared paid user exposes non-destructive cancellation form | Confirm subscription, plan, invoice, and billing controls are visible and safe. | Expected controls and information should be visible to the user. |
| SKIPPED | Billing | Disposable user climbs every monthly then yearly plan and sees yearly cancel options | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| SKIPPED | Billing | Disposable monthly user sees downgrade retention offer | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Billing | Subscription lifecycle calculation rules are deterministic | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Authentication | Authenticated user can open dashboard profile billing and compliance routes | Confirm users can authenticate safely and invalid access is blocked. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Authentication | Authenticated dashboard remains usable on mobile viewport | Confirm users can authenticate safely and invalid access is blocked. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Authentication | Authenticated profile billing and compliance routes remain usable on tablet viewport | Confirm users can authenticate safely and invalid access is blocked. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Authentication | Authenticated deep links with query parameters render expected pages | Confirm users can authenticate safely and invalid access is blocked. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Authentication | Authenticated direct routes tolerate trailing slash and unknown query parameters | Confirm users can authenticate safely and invalid access is blocked. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Dashboard | Dashboard footer legal and support links expose usable targets | Confirm authenticated users can navigate the product without load errors. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Billing | Profile menu exposes billing risk compliance and sign out actions | Confirm subscription, plan, invoice, and billing controls are visible and safe. | Expected controls and information should be visible to the user. |
| PASS | Dashboard | Profile menu navigation actions open the expected pages | Confirm authenticated users can navigate the product without load errors. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Dashboard | Profile menu closes with Escape and outside click | Confirm authenticated users can navigate the product without load errors. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Dashboard | Dashboard top navigation tabs are visible | Confirm authenticated users can navigate the product without load errors. | Expected controls and information should be visible to the user. |
| PASS | Dashboard | Dashboard top navigation links open without load errors | Confirm authenticated users can navigate the product without load errors. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Dashboard | Dashboard top navigation destinations render usable content | Confirm authenticated users can navigate the product without load errors. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Dashboard | Dashboard top navigation destinations stay usable after refresh | Confirm authenticated users can navigate the product without load errors. | The page should remain usable after refresh without losing required state. |
| PASS | Dashboard | Dashboard header notification theme and fullscreen controls are healthy | Confirm authenticated users can navigate the product without load errors. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Dashboard | Dashboard refresh utility reloads data without ending session | Confirm authenticated users can navigate the product without load errors. | The page should remain usable after refresh without losing required state. |
| PASS | Dashboard | Dashboard quick action menu opens without changing session | Confirm authenticated users can navigate the product without load errors. | The requested page, modal, portal, or panel should open without a load error. |
| PASS | Dashboard | Notification panel opens and closes without disrupting dashboard | Confirm authenticated users can navigate the product without load errors. | The requested page, modal, portal, or panel should open without a load error. |
| PASS | Dashboard | Notification panel remains usable after dashboard refresh | Confirm authenticated users can navigate the product without load errors. | The page should remain usable after refresh without losing required state. |
| PASS | Authentication | Key authenticated routes stay usable after refresh | Confirm users can authenticate safely and invalid access is blocked. | The page should remain usable after refresh without losing required state. |
| PASS | Accessibility | Browser back returns from billing to dashboard without ending session | Ensure the application remains usable and inspectable for accessibility and browser behavior. | Browser navigation should not break the session or page state. |
| PASS | Dashboard | Profile menu sign out blocks direct dashboard access | Confirm authenticated users can navigate the product without load errors. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Dashboard | Dashboard plus menu adds equity then cash then option | Confirm authenticated users can navigate the product without load errors. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Password | Profile identity drafts password toggles and navigation in one session | Confirm password rules and password-change guardrails protect the account. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | MFA | Profile security MFA backup codes trusted devices and refresh | Confirm two-factor authentication controls protect the account without breaking login recovery. | The page should remain usable after refresh without losing required state. |
| PASS | Profile | Profile mobile section validation in one session | Confirm profile data and account controls remain visible, stable, and protected. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Password | Password mismatch and wrong current password in one session | Confirm password rules and password-change guardrails protect the account. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Dashboard | Saved Risk Profile and Compliance load edit and survive refresh in one session | Confirm authenticated users can navigate the product without load errors. | The page should remain usable after refresh without losing required state. |
| PASS | Dashboard | Risk Profile and Compliance can be updated from dashboard in one session | Confirm authenticated users can navigate the product without load errors. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Billing | Billing overview plans and history in one session | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Billing | Billing portal plans invoices and return in one session | Confirm subscription, plan, invoice, and billing controls are visible and safe. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Authentication | Subscriber expiry overview logout and login | Confirm users can authenticate safely and invalid access is blocked. | The scenario should complete successfully and leave the application in the expected state. |
| PASS | Authentication | Login once then logout blocks back refresh tabs and protected routes | Confirm users can authenticate safely and invalid access is blocked. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |
| PASS | Authentication | Invalid reset password link does not authenticate user | Confirm users can authenticate safely and invalid access is blocked. | Invalid or unsafe input should be blocked and the user should remain in a safe state. |

## Skipped / Blocked / Controlled Coverage

| Category | Scenario | Reason / Next Action |
| --- | --- | --- |
| Skipped | Signup OTP input trims pasted value to six digits | Scenario was not executed in this run. |
| Skipped | New user can reach Overlay Strategists trial option | Scenario was not executed in this run. |
| Controlled | Overlay Strategists with-card trial opens Stripe checkout with trial details | Scenario was not executed in this run. |
| Controlled | Overlay Strategists with-card trial blocks missing Stripe card details | Scenario was not executed in this run. |
| Controlled | Overlay Strategists with-card trial rejects declined Stripe card | Scenario was not executed in this run. |
| Skipped | Income Builder monthly checkout shows subscription summary before payment | Scenario was not executed in this run. |
| Skipped | Portfolio Hedger annual checkout shows subscription summary before payment | Scenario was not executed in this run. |
| Skipped | Income Builder annual checkout shows subscription summary before payment | Scenario was not executed in this run. |
| Skipped | Marketplace monthly checkout shows subscription summary before payment | Scenario was not executed in this run. |
| Skipped | Income Builder checkout shows currency and conversion details before payment | Scenario was not executed in this run. |
| Skipped | Income Builder checkout preserves context on refresh and returns safely before payment | Scenario was not executed in this run. |
| Controlled | SC-48: Stripe checkout displays renewal or auto-renewal copy before payment | Scenario was not executed in this run. |
| Skipped | SC-61: Missing cardholder name is blocked before subscription activation | Scenario was not executed in this run. |
| Skipped | SC-62: Failed checkout keeps user without active paid subscription | Scenario was not executed in this run. |
| Controlled | SC-63: Closing Stripe checkout returns user safely without activating subscription | Scenario was not executed in this run. |
| Skipped | Disposable user can start Overlay Strategists trial without card | Scenario was not executed in this run. |
| Skipped | Disposable user can start Overlay Strategists trial with card | Scenario was not executed in this run. |
| Skipped | Disposable user can purchase Income Builder monthly and reach Billing | Scenario was not executed in this run. |
| Skipped | Disposable user can purchase Overlay Strategists monthly and reach Billing | Scenario was not executed in this run. |
| Skipped | Disposable user can purchase Portfolio Hedger monthly and reach Billing | Scenario was not executed in this run. |
| Skipped | Disposable user can purchase Marketplace monthly and reach Billing | Scenario was not executed in this run. |
| Skipped | Disposable user can purchase configured paid annual plan and reach Billing | Scenario was not executed in this run. |
| Skipped | Prepared paid user can accept terms and submit upgrade payment | Scenario was not executed in this run. |
| Skipped | Prepared paid user exposes non-destructive cancellation form | Scenario was not executed in this run. |
| Skipped | Disposable user climbs every monthly then yearly plan and sees yearly cancel options | Scenario was not executed in this run. |
| Skipped | Disposable monthly user sees downgrade retention offer | Scenario was not executed in this run. |
| Traceability | UJ-001 - New user registers with email, password, US mobile, and static OTP | Documented matrix scenario. Covered by onboarding.spec.ts > Step 1 - Registration, but it was not included in this AIR execution. |
| Traceability | UJ-002 - Duplicate registered email is rejected during signup | Documented matrix scenario. Covered by SignupNegative.spec.ts > duplicate email validation, but it was not included in this AIR execution. |
| Traceability | UJ-003 - Registration OTP input does not accept more than six digits | Documented matrix scenario. Covered by SignupNegative.spec.ts > OTP length validation, but it was not included in this AIR execution. |
| Traceability | UJ-004 - Invalid email, weak password, missing fields, and password mismatch are blocked | Documented matrix scenario. Covered by SignupNegative.spec.ts and PasswordPolicy.spec.ts, but it was not included in this AIR execution. |
| Future | UJ-005 - User completes email verification handoff before first login | Requires email inbox access or backend verification-link test hook. |
| Traceability | UJ-006 - Verified user logs in and reaches dashboard or onboarding continuation | Documented matrix scenario. Covered by onboarding.spec.ts and Subscriber.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-007 - Login validates wrong password, unregistered email, empty fields, injection, and XSS input | Documented matrix scenario. Covered by AuthNegative.spec.ts, but it was not included in this AIR execution. |
| Future | UJ-008 - Temporarily locked account can request email unlock link | Requires a locked-account fixture and email-link handoff. |
| Traceability | UJ-009 - Protected dashboard routes redirect unauthenticated users to login | Documented matrix scenario. Covered by SessionSecurity.spec.ts and AuthNegative.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-010 - Logout prevents browser-back and direct protected URL access | Documented matrix scenario. Covered by SessionSecurity.spec.ts and Subscriber.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-011 - Forgot password request validates empty, invalid, unregistered, and security input | Documented matrix scenario. Covered by ResetPasswordNegative.spec.ts, but it was not included in this AIR execution. |
| Future | UJ-012 - Forgot password sends reset link and reset page accepts valid password update | Requires email reset-link handoff or reset URL fixture. |
| Traceability | UJ-013 - Reset password validates mismatch, weak password, and back-to-login behavior | Documented matrix scenario. Covered by ResetPasswordNegative.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-014 - Risk profile field validation blocks incomplete or invalid profile submission | Documented matrix scenario. Covered by OnboardingFieldValidation.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-015 - Risk profile saved progress persists after refresh and can be updated from dashboard | Documented matrix scenario. Covered by OnboardingFieldValidation.spec.ts and RiskComplianceUpdate.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-016 - Compliance required fields, state, broker approval, and accreditation are validated | Documented matrix scenario. Covered by OnboardingFieldValidation.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-017 - Compliance values persist and can be edited from the dashboard | Documented matrix scenario. Covered by RiskComplianceUpdate.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-018 - Plan page displays Monthly and Annual pricing and toggles correctly | Documented matrix scenario. Covered by PlanSelectionValidation.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-019 - Curious Explorer free plan completes onboarding without Stripe checkout | Documented matrix scenario. Covered by PlanSelectionValidation.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-020 - Overlay Strategists trial can start without card and route to dashboard | Documented matrix scenario. Covered by OverlayStrategistsTrial.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-021 - Overlay Strategists trial can start with card and auto-renew terms are shown | Documented matrix scenario. Covered by OverlayStrategistsTrial.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-022 - Paid plan selection redirects to Stripe checkout and accepts sandbox card details | Documented matrix scenario. Covered by onboarding.spec.ts and DirectSubscriptionPurchase.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-023 - Stripe checkout validates incomplete, expired, invalid CVC, and declined-card scenarios | Documented matrix scenario. Covered by PaymentNegative.spec.ts and OverlayStrategistsTrial.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-024 - New dashboard loads after onboarding and primary dashboard health is verified | Documented matrix scenario. Covered by DashboardNavigation.spec.ts and Subscriber.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-025 - Top navigation routes open without load errors | Documented matrix scenario. Covered by DashboardNavigation.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-026 - Dashboard header notification, theme, and fullscreen controls remain healthy | Documented matrix scenario. Covered by DashboardNavigation.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-027 - Profile page loads saved user details and keeps email read-only | Documented matrix scenario. Covered by ProfileNegative.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-028 - Profile change-password form validates mismatch and wrong current password | Documented matrix scenario. Covered by ProfilePasswordMismatch.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-029 - Profile mobile number change validation is enforced | Documented matrix scenario. Covered by ProfileMobileValidation.spec.ts, but it was not included in this AIR execution. |
| Future | UJ-030 - User enables authenticator app MFA and saves generated backup codes | Requires TOTP secret or manual authenticator OTP handoff during enablement. |
| Future | UJ-031 - MFA login accepts valid OTP and rejects invalid OTP | Requires MFA_LOCAL_TOTP_SECRET or manual OTP fallback. |
| Future | UJ-032 - Backup code login succeeds once and used backup code cannot be reused | Requires fresh one-time backup code fixture; backup codes are single-use. |
| Future | UJ-033 - Trusted-device checkbox allows remembered device to skip MFA on next login | Requires stable browser profile plus MFA_LOCAL_TOTP_SECRET or manual OTP. |
| Future | UJ-034 - Removing trusted device requires MFA again on next login | Requires trusted-device fixture and MFA_LOCAL_TOTP_SECRET or manual OTP. |
| Future | UJ-035 - Disabling 2FA removes MFA challenge for future login | Requires account with enabled MFA and password/OTP confirmation. |
| Traceability | UJ-036 - Billing overview displays current plan, active status, billing interval, and next renewal | Documented matrix scenario. Covered by BillingEdgeValidation.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-037 - Billing plans show upgrade, downgrade, or current-plan status controls | Documented matrix scenario. Covered by BillingEdgeValidation.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-038 - Subscription history, transaction history, invoice page, and PDF link are available | Documented matrix scenario. Covered by BillingEdgeValidation.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-039 - Manage subscription opens Stripe portal with subscription and payment details | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-040 - Stripe portal cancel-subscription form accepts reason and feedback without accidental cancellation | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts, but it was not included in this AIR execution. |
| Blocked | UJ-041 - Cancelled subscription retains access until end of billing cycle | Requires subscription lifecycle fixture, billing-cycle date control, or Stripe/API state validation. |
| Blocked | UJ-042 - Upgrade and downgrade proration behavior is validated across monthly and annual plans | Requires Stripe subscription update API visibility and deterministic customer fixtures. |
| Future | UJ-043 - Role-based permissions hide or block unauthorized functionality | Requires role/permission matrix, admin fixture, and expected access rules. |
| Future | UJ-044 - Role change from member to admin applies correct MFA policy on next login | Requires confirmed MFA role-policy behavior and admin API/UI fixture. |
| Blocked | UJ-045 - Notification and email events are captured for signup, trial, billing, unlock, and password reset | Requires email inbox/API access, notification test hooks, or message capture service. |
| Blocked | UJ-046 - Audit trail records security, billing, trial, and profile changes | Requires admin/API/DB access to audit log records. |
| Traceability | UJ-047 - User can sign out successfully from the application | Documented matrix scenario. Covered by Subscriber.spec.ts and DashboardNavigation.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-048 - Accessibility and keyboard navigation checks cover core auth and dashboard surfaces | Documented matrix scenario. Covered by AccessibilityBrowser.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-049 - Password visibility toggle shows and hides entered password without changing value | Documented matrix scenario. Covered by AuthUiValidation.spec.ts, but it was not included in this AIR execution. |
| Future | UJ-050 - Deep link to protected page redirects to login and returns to intended page after authentication | Requires confirmed return-url behavior and stable protected route fixture. |
| Future | UJ-051 - Expired session redirects to login without exposing protected dashboard data | Requires token/session expiry control or backend test hook. |
| Future | UJ-052 - Multiple browser tabs keep session state consistent after logout | Requires multi-tab session fixture and deterministic logout propagation behavior. |
| Future | UJ-053 - Login lockout and unlock-link rate limits follow admin configuration | Requires rate-limit configuration API/admin access and safe lockout fixture. |
| Future | UJ-054 - Signup, login, forgot-password, and plan terms links open valid policy pages | Requires final list of legal routes and expected link destinations. |
| Traceability | UJ-055 - Email input trims leading and trailing spaces before validation | Documented matrix scenario. Covered by AuthNegative.spec.ts and SignupNegative.spec.ts, but it was not included in this AIR execution. |
| Future | UJ-056 - Same mobile number is allowed across multiple accounts when business rule permits it | Requires explicit business-rule confirmation and two-account fixture using same mobile number. |
| Traceability | UJ-057 - Onboarding step refresh keeps saved progress and does not duplicate submissions | Documented matrix scenario. Covered by OnboardingFieldValidation.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-058 - Profile menu displays correct user name and email after login | Documented matrix scenario. Covered by ProfileNegative.spec.ts and DashboardNavigation.spec.ts, but it was not included in this AIR execution. |
| Traceability | UJ-059 - Authenticated dashboard footer exposes legal and support destinations | Documented matrix scenario. Covered by DashboardNavigation.spec.ts > Dashboard footer legal and support links expose usable targets, but it was not included in this AIR execution. |
| Traceability | UJ-060 - Authenticated dashboard routes tolerate trailing slash and unknown query parameters | Documented matrix scenario. Covered by DashboardNavigation.spec.ts > Authenticated direct routes tolerate trailing slash and unknown query parameters, but it was not included in... |
| Traceability | UJ-061 - Public login, forgot-password, and registration routes tolerate trailing slash and unknown query parameters | Documented matrix scenario. Covered by AuthUiValidation.spec.ts > Public auth routes tolerate trailing slash and unknown query parameters, but it was not included in this AIR ex... |
| Traceability | UJ-062 - Dashboard notification panel can be opened, dismissed, reopened, and used after refresh | Documented matrix scenario. Covered by DashboardNavigation.spec.ts > Notification panel opens and closes without disrupting dashboard; Notification panel remains usable after da... |
| Blocked | UJ-063 - Overlay Strategists free trial is limited to one verified email and mobile identity | Business rule confirmed: a new user must have verified email/mobile identity, and the free trial is allowed only once per unique user identity. Requires safe repeat-trial fixtur... |
| Traceability | SC-01 - Start trial without payment details | Documented matrix scenario. Covered by OverlayStrategistsTrial.spec.ts > New user can start Overlay Strategists trial without card, but it was not included in this AIR execution. |
| Traceability | SC-02 - Trial is displayed as available | Documented matrix scenario. Covered by OverlayStrategistsTrial.spec.ts > New user can reach Overlay Strategists trial option after email/mobile onboarding prerequisites; PlanSel... |
| Future | SC-03 - Broker account limit is one | Confirmed product bug: manual entry is currently counted as broker integration. Expected behavior is that manual entry must not consume broker-integration limit. |
| Blocked | SC-04 - No-card trial linked-account limit requires confirmation | FRD says no-card trial has 5 linked accounts, but paid Overlay Strategists UI displays Account Linked (10). Confirm whether no-card trial should remain reduced at 5 or match pai... |
| Blocked | SC-05 - No-card trial portfolio position limit is 100 | FRD expected limit is 100 positions for no-card trial. Enforcement requires safely creating/importing portfolio positions through a seed fixture or backend/API support. |
| Traceability | SC-06 - Premium Overlay Strategists features are presented | Documented matrix scenario. Covered by PlanSelectionValidation.spec.ts > Overlay Strategists feature limits and premium benefits are displayed, but it was not included in this A... |
| Future | SC-07 - Start trial with valid card | Confirmed product bug: after activating the free trial with a valid payment card, Billing still displays Free Plan and does not show the saved payment method. Expected Billing s... |
| Blocked | SC-08 - No subscription charge during trial | Requires Stripe test account/API access to verify ledger/payment intent amount. |
| Future | SC-09 - Card information is securely saved | Confirmed product bug: saved card details are not displayed on Billing after with-card trial activation. Stripe/API validation is still needed later to confirm backend payment-m... |
| Traceability | SC-10 - Existing paid subscriber cannot start trial | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Paid subscriber is not offered Overlay Strategists trial CTA, but it was not included in this AIR... |
| Blocked | SC-11 - Same email cannot receive another trial | FRD rule: trial is available once per user lifetime and eligibility should use identifiers such as email address, payment method fingerprint, and other platform-specific identif... |
| Blocked | SC-12 - Same verified mobile number cannot receive another trial | Platform rule aligned to FRD identity controls: verified mobile is treated as a platform-specific identifier for one-time trial eligibility. Requires a safe repeat-phone fixture... |
| Blocked | SC-13 - Same payment method cannot receive another trial | Requires Stripe payment-method fingerprint visibility through API/admin. |
| Blocked | SC-14 - Trial lasts exactly 30 days | Requires admin/API time travel or scheduler controls to set trial start/end dates. |
| Blocked | SC-15 - Day 25 no-card reminder is sent once | Requires scheduler trigger and email/in-app notification capture. |
| Blocked | SC-16 - Day 28 no-card reminder is sent once | Requires scheduler trigger and email/in-app notification capture. |
| Blocked | SC-17 - Day 29 no-card final reminder is sent once | Requires scheduler trigger and email/in-app notification capture. |
| Blocked | SC-18 - Day 29 with-card final reminder is sent once | Requires scheduler trigger and email/in-app notification capture. |
| Blocked | SC-19 - No-card trial downgrades to Free after expiry | Requires admin/API expiry control or scheduler trigger for trial expiry. |
| Blocked | SC-20 - Broker integrations disconnect after no-card expiry | Requires expired trial fixture plus broker connection data. |
| Blocked | SC-21 - Imported portfolio positions are deleted after no-card expiry | Requires portfolio seed data and DB/admin validation of deletion. |
| Blocked | SC-22 - Premium features are unavailable after expiry | Requires expired trial fixture and feature entitlement selectors. |
| Blocked | SC-23 - Subscribe prompt appears after trial expiry | Requires expired trial fixture. |
| Blocked | SC-24 - With-card trial converts to paid after expiry | Requires trial expiry scheduler plus Stripe subscription/invoice validation. |
| Blocked | SC-25 - Billing starts automatically after with-card trial expiry | Requires Stripe invoice/payment validation after trial conversion. |
| Future | SC-26 - Trial user can subscribe before trial ends | Requires active trial fixture and controlled upgrade/plan-change checkout path. |
| Blocked | SC-27 - Billing cycle resets after trial-to-paid subscription | Requires Stripe/API visibility for billing cycle anchor and renewal date. |
| Blocked | SC-28 - Failed payment after trial expiry enters grace period | Requires trial expiry, failed renewal card fixture, scheduler/webhook control, and grace-period config. |
| Blocked | SC-29 - Failed billing reminder is sent | Requires failed-payment fixture plus notification capture. |
| Future | SC-30 - Removing only payment method during trial keeps trial active until expiry | Requires active with-card trial account and payment-method management UI/API. Business rule: user can cancel any time but keeps plan access until trial expiry. |
| Traceability | SC-31 - Terms must be accepted before activating trial | Documented matrix scenario. Covered by OverlayStrategistsTrial.spec.ts / PlanSelectionValidation.spec.ts > trial terms required, but it was not included in this AIR execution. |
| Future | SC-32 - Communication preference selection is supported | Requires confirmation of communication preference UI location and expected options. |
| Blocked | SC-33 - Trial activation audit log is created | Requires admin/API/DB access to audit log records. |
| Blocked | SC-34 - Trial conversion audit log is created | Requires admin/API/DB access to audit log records after trial conversion. |
| Blocked | SC-35 - Reminder analytics are tracked | Requires analytics/admin event visibility. |
| Traceability | SC-36 - With-card authorization failure does not start trial | Documented matrix scenario. Covered by OverlayStrategistsTrial.spec.ts > Overlay Strategists with-card trial rejects declined Stripe card, but it was not included in this AIR ex... |
| Traceability | SC-36 - New user can purchase Income Builder monthly subscription during onboarding | Documented matrix scenario. Covered by onboarding.spec.ts > Income Builder Stripe checkout payment completion, but it was not included in this AIR execution. |
| Traceability | SC-37 - Income Builder monthly checkout shows selected plan before payment | Documented matrix scenario. Covered by DirectSubscriptionPurchase.spec.ts > Income Builder monthly checkout shows subscription summary before payment, but it was not included in... |
| Traceability | SC-38 - Portfolio Hedger annual checkout shows selected plan before payment | Documented matrix scenario. Covered by DirectSubscriptionPurchase.spec.ts > Portfolio Hedger annual checkout shows subscription summary before payment, but it was not included i... |
| Traceability | SC-39 - Marketplace monthly checkout shows selected plan before payment | Documented matrix scenario. Covered by DirectSubscriptionPurchase.spec.ts > Marketplace monthly checkout shows subscription summary before payment, but it was not included in th... |
| Traceability | SC-40 - Annual paid checkout displays selected plan and billing interval before payment | Documented matrix scenario. Covered by DirectSubscriptionPurchase.spec.ts > Income Builder annual and Portfolio Hedger annual checkout summaries before payment, but it was not i... |
| Traceability | SC-41 - Paid subscription can be started from onboarding plan selection | Documented matrix scenario. Covered by PlanSelectionValidation.spec.ts > User can switch plan selections without launching Stripe checkout; onboarding.spec.ts, DirectSubscriptio... |
| Future | SC-42 - Paid subscription can be started from pricing entry point | Requires confirmed pricing page route/selectors and reusable logged-in fixture. |
| Blocked | SC-43 - Paid subscription can be started from expired trial upgrade prompt | Requires expired-trial fixture or scheduler/API time control. |
| Traceability | SC-44 - Paid subscription can be started from billing/settings plan action | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Billing plans show plan action or status controls, but it was not included in this AIR execution. |
| Traceability | SC-45 - Stripe checkout displays subscriber email | Documented matrix scenario. Covered by DirectSubscriptionPurchase.spec.ts > validateSubscriptionCheckoutDetails, but it was not included in this AIR execution. |
| Traceability | SC-46 - Stripe checkout displays selected plan name | Documented matrix scenario. Covered by DirectSubscriptionPurchase.spec.ts > validateSubscriptionCheckoutDetails, but it was not included in this AIR execution. |
| Traceability | SC-47 - Stripe checkout displays correct billing interval | Documented matrix scenario. Covered by DirectSubscriptionPurchase.spec.ts > validateSubscriptionCheckoutDetails, but it was not included in this AIR execution. |
| Traceability | SC-49 - Stripe checkout exposes card number, expiry, CVC, country, and cardholder name fields | Documented matrix scenario. Covered by DirectSubscriptionPurchase.spec.ts and PaymentNegative.spec.ts, but it was not included in this AIR execution. |
| Traceability | SC-50 - Successful sandbox card payment activates subscription | Documented matrix scenario. Covered by onboarding.spec.ts > Stripe checkout payment completion, but it was not included in this AIR execution. |
| Traceability | SC-51 - Successful payment redirects user back to OOLTool dashboard | Documented matrix scenario. Covered by onboarding.spec.ts and OverlayStrategistsTrial.spec.ts, but it was not included in this AIR execution. |
| Traceability | SC-52 - Dashboard shows active subscription after successful purchase | Documented matrix scenario. Covered by Subscriber.spec.ts, but it was not included in this AIR execution. |
| Traceability | SC-53 - Billing overview shows current paid plan and active status | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts, but it was not included in this AIR execution. |
| Traceability | SC-54 - Transaction history records successful paid invoice | Documented matrix scenario. Covered by Subscriber.spec.ts > Transactions tab paid status, but it was not included in this AIR execution. |
| Traceability | SC-55 - Invoice details page opens after successful purchase | Documented matrix scenario. Covered by Subscriber.spec.ts > Invoice page opens successfully, but it was not included in this AIR execution. |
| Traceability | SC-56 - Invoice PDF link is available after successful purchase | Documented matrix scenario. Covered by Subscriber.spec.ts > Invoice PDF link is available and opens, but it was not included in this AIR execution. |
| Traceability | SC-57 - Incomplete card number is blocked in Stripe checkout | Documented matrix scenario. Covered by PaymentNegative.spec.ts > Stripe Checkout blocks incomplete card number, but it was not included in this AIR execution. |
| Traceability | SC-58 - Expired card date is blocked in Stripe checkout | Documented matrix scenario. Covered by PaymentNegative.spec.ts > Stripe Checkout blocks expired card date, but it was not included in this AIR execution. |
| Traceability | SC-59 - Invalid CVC is blocked in Stripe checkout | Documented matrix scenario. Covered by PaymentNegative.spec.ts > Stripe Checkout blocks invalid CVC, but it was not included in this AIR execution. |
| Traceability | SC-60 - Declined card does not activate subscription | Documented matrix scenario. Covered by PaymentNegative.spec.ts and OverlayStrategistsTrial.spec.ts, but it was not included in this AIR execution. |
| Traceability | SC-64 - Payment currency and conversion details are displayed correctly | Documented matrix scenario. Covered by DirectSubscriptionPurchase.spec.ts > Income Builder checkout shows currency and conversion details before payment, but it was not included... |
| Blocked | SC-65 - Successful subscription confirmation email is sent | Requires email inbox/API access or notification capture. |
| Blocked | SC-66 - Successful purchase creates Stripe customer and subscription records | Requires Stripe sandbox API/admin access to validate customer/subscription objects. |
| Traceability | SC-67 - Manage subscription portal opens for newly purchased subscription | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Manage subscription opens Stripe portal with subscription details, but it was not included in this... |
| Traceability | SC-68 - Stripe portal shows current subscription and payment method | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > validateStripePortalSession, but it was not included in this AIR execution. |
| Traceability | SC-69 - Stripe portal invoice history is available | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > validateStripePortalSession, but it was not included in this AIR execution. |
| Traceability | SC-70 - Stripe portal return link navigates back to OOLTool | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > validateStripePortalSession, but it was not included in this AIR execution. |
| Traceability | SC-71 - Cancel subscription form accepts reason and feedback without final cancellation | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Cancel subscription form accepts reason and feedback without cancelling, but it was not included i... |
| Blocked | SC-72 - Subscription purchase audit log is created | Requires admin/API/DB access to audit log records. |
| Blocked | SC-73 - Duplicate checkout session cannot create duplicate paid subscriptions | Requires backend/API visibility into checkout session idempotency and subscription count. |
| Blocked | SC-74 - Expired checkout session cannot activate subscription | Requires expired checkout-session fixture or Stripe/API session control. |
| Future | SC-75 - Retry after failed payment starts a clean checkout session | Requires failed-payment fixture plus clean retry/session validation. |
| Traceability | SC-75A - Terms and subscription terms must be accepted before paid checkout starts | Documented matrix scenario. Covered by PlanSelectionValidation.spec.ts and OverlayStrategistsTrial.spec.ts, but it was not included in this AIR execution. |
| Blocked | SC-75B - Double-clicking purchase does not create duplicate checkout sessions | Requires backend/API visibility into checkout session creation and idempotency keys. |
| Traceability | SC-75C - Browser back from Stripe checkout returns without activating subscription | Documented matrix scenario. Covered by DirectSubscriptionPurchase.spec.ts > Income Builder checkout preserves context on refresh and returns safely before payment, but it was no... |
| Traceability | SC-75D - Refreshing Stripe checkout keeps selected plan and customer context | Documented matrix scenario. Covered by DirectSubscriptionPurchase.spec.ts > Income Builder checkout preserves context on refresh and returns safely before payment, but it was no... |
| Blocked | SC-75E - 3DS or authentication-required card flow is handled without losing subscription context | Requires Stripe sandbox 3DS card fixture and confirmation handling rules. |
| Blocked | SC-75F - Delayed Stripe webhook keeps subscription pending until payment confirmation is received | Requires webhook delay/retry control or backend subscription state API. |
| Future | SC-75G - User cannot access paid entitlements before successful payment confirmation | Requires entitlement selectors and safe failed/pending checkout fixture. |
| Blocked | SC-75H - Payment receipt or subscription confirmation email is received after purchase | Requires email inbox/API access or notification capture service. |
| Future | SC-75I - Invoice PDF amount, currency, and plan match the purchased subscription | Requires deterministic plan amount fixture and PDF content parsing/validation. |
| Traceability | SC-75J - Saved payment method last four digits are shown correctly after purchase | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Stripe portal shows current subscription and payment method, but it was not included in this AIR e... |
| Future | SC-75K - Checkout network interruption shows recoverable error and allows retry | Requires controlled network failure injection and retry expectation. |
| Traceability | SC-75L - Currency and conversion-fee copy remains visible for non-USD checkout | Documented matrix scenario. Covered by DirectSubscriptionPurchase.spec.ts > Income Builder checkout shows currency and conversion details before payment, but it was not included... |
| Traceability | SC-76 - Current lower-tier paid subscription is displayed before upgrade | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Manage subscription opens Stripe portal with subscription details, but it was not included in this... |
| Traceability | SC-77 - Eligible higher-tier plans show upgrade action | Documented matrix scenario. Covered by BillingEdgeValidation.spec.ts > Billing plans expose lifecycle action summary without changing subscription, but it was not included in th... |
| Traceability | SC-78 - Current plan does not show upgrade action for itself | Documented matrix scenario. Covered by BillingEdgeValidation.spec.ts > Billing plans expose lifecycle action summary without changing subscription, but it was not included in th... |
| Future | SC-79 - Upgrade from Income Builder to Overlay Strategists is available | Business rule confirmed: active users can upgrade to any plan at any time. Requires dedicated lower-tier paid account fixture with active Income Builder subscription. |
| Future | SC-80 - Upgrade from Overlay Strategists to Portfolio Hedger is available | Business rule confirmed: active users can upgrade to any plan at any time. Requires dedicated Overlay Strategists paid account fixture. |
| Future | SC-81 - Upgrade from Portfolio Hedger to Marketplace is available | Business rule confirmed: active users can upgrade to any plan at any time. Requires dedicated Portfolio Hedger paid account fixture. |
| Traceability | SC-82 - Upgrade CTA opens Stripe checkout or customer portal update screen | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > Prepared paid user can preview monthly and annual upgrade calculations, but it was not included i... |
| Traceability | SC-83 - Upgrade screen displays current plan and target plan | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > upgrade calculation preview shows target plan, but it was not included in this AIR execution. |
| Traceability | SC-84 - Upgrade screen displays new price and billing interval | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > upgrade calculation preview validates plan charge and interval copy, but it was not included in t... |
| Traceability | SC-85 - Upgrade screen displays prorated amount before confirmation | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > upgrade preview validates unused-time credit and amount due today. Stripe invoice-ID reconciliati... |
| Blocked | SC-86 - Upgrade starts a new billing cycle and displays next renewal date | Business rule confirmed: upgrade starts a new billing cycle. Requires stable billing-cycle fixture or Stripe subscription API access. |
| Traceability | SC-87 - User can cancel upgrade before payment confirmation | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > upgrade calculation preview is closed without submitting, but it was not included in this AIR exe... |
| Blocked | SC-88 - Successful upgrade immediately updates active plan | Requires dedicated upgrade account and approval to submit upgrade payment/update. |
| Blocked | SC-89 - Successful upgrade unlocks target-plan entitlements | Requires entitlement selectors and post-upgrade account fixture. |
| Blocked | SC-90 - Successful upgrade keeps existing user data and portfolio data | Requires portfolio/broker seed data and post-upgrade data integrity validation. |
| Future | SC-91 - Successful upgrade records subscription history entry | Requires post-upgrade subscription history fixture. |
| Blocked | SC-92 - Successful upgrade records transaction history entry | Requires Stripe invoice/payment record visibility after upgrade. |
| Blocked | SC-93 - Successful upgrade creates invoice with correct prorated amount | Business rule confirmed: prorated charge is required on upgrade. Requires Stripe invoice API/admin access and deterministic proration. |
| Future | SC-94 - Upgrade invoice PDF opens and matches plan change details | Requires post-upgrade invoice PDF fixture and PDF content validation. |
| Blocked | SC-95 - Upgrade confirmation email is sent | Requires email inbox/API access or notification capture service. |
| Blocked | SC-96 - Failed upgrade payment does not change current plan | Requires failed-payment upgrade fixture and post-failure billing state validation. |
| Future | SC-97 - Declined card during upgrade shows payment failure message | Requires upgrade checkout fixture with Stripe declined-card path. |
| Future | SC-98 - Incomplete payment details during upgrade are blocked | Requires upgrade checkout fixture and Stripe validation selectors. |
| Future | SC-99 - Upgrade retry after failed payment starts clean retry flow | Requires failed upgrade payment fixture and retry behavior confirmation. |
| Blocked | SC-100 - Upgrade from monthly lower plan to monthly higher plan is handled correctly | Business rule confirmed: upgrade is allowed and starts a new billing cycle with prorated charge. Requires lower monthly plan account and Stripe proration validation. |
| Blocked | SC-101 - Upgrade from annual lower plan to annual higher plan is handled correctly | Business rule confirmed: upgrade is allowed and starts a new billing cycle with prorated charge. Requires annual lower-plan account and Stripe proration validation. |
| Blocked | SC-102 - Upgrade from monthly lower plan to annual higher plan is handled correctly | Business rule confirmed: upgrade across billing interval is allowed and starts a new billing cycle with prorated charge. Requires Stripe proration visibility. |
| Blocked | SC-103 - Upgrade preserves billing customer and payment method | Requires Stripe customer/payment-method API or admin visibility. |
| Blocked | SC-104 - Upgrade does not create duplicate active subscriptions | Requires backend/Stripe subscription count visibility. |
| Blocked | SC-105 - Double-clicking upgrade action is idempotent | Requires backend/API visibility into idempotency or duplicate checkout prevention. |
| Future | SC-106 - Browser refresh during upgrade flow does not lose selected target plan | Requires stable upgrade flow session and refresh behavior. |
| Future | SC-107 - Browser back from upgrade checkout returns without changing plan | Requires safe upgrade checkout cancel/return validation. |
| Blocked | SC-108 - Upgrade is blocked for cancelled subscription after access end date | Requires cancelled/expired subscription fixture. |
| Blocked | SC-109 - Upgrade is available for subscription scheduled to cancel before end date when allowed | Business rule confirmed: users can upgrade any time while access is active. Requires scheduled-cancellation fixture to verify behavior before access end date. |
| Blocked | SC-110 - Upgrade audit log is created | Requires admin/API/DB access to audit log records. |
| Blocked | SC-111 - Upgrade webhook processing updates subscription status correctly | Requires webhook event visibility or backend state API. |
| Blocked | SC-112 - Upgrade failure webhook does not unlock higher-tier entitlement | Requires failed upgrade webhook fixture and entitlement validation. |
| Traceability | SC-113 - Current higher-tier subscription is displayed before downgrade | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Manage subscription opens Stripe portal with subscription details, but it was not included in this... |
| Traceability | SC-114 - Eligible lower-tier plans show downgrade action | Documented matrix scenario. Covered by BillingEdgeValidation.spec.ts > Billing plans expose lifecycle action summary without changing subscription, but it was not included in th... |
| Traceability | SC-115 - Current plan does not show downgrade action for itself | Documented matrix scenario. Covered by BillingEdgeValidation.spec.ts > Billing plans expose lifecycle action summary without changing subscription, but it was not included in th... |
| Future | SC-116 - Downgrade from Marketplace to Portfolio Hedger is available | Requires Marketplace paid account fixture. |
| Future | SC-117 - Downgrade from Portfolio Hedger to Overlay Strategists is available | Requires Portfolio Hedger paid account fixture. |
| Future | SC-118 - Downgrade from Overlay Strategists to Income Builder is available | Requires Overlay Strategists paid account fixture. |
| Blocked | SC-119 - Downgrade from paid plan to Free is only available when business rules allow it | Requires confirmed business rule for paid-to-free downgrade and fixture account. |
| Traceability | SC-120 - Downgrade confirmation displays current plan and target plan | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > Prepared paid user can preview downgrade calculations without submitting, but it was not included... |
| Blocked | SC-121 - Downgrade confirmation displays lost feature warning | SubscriptionLifecycleExecution.spec.ts looks for lost-feature/limit copy when present. Dedicated comparison warning copy is still not a guaranteed selector, so this FRD row stay... |
| Blocked | SC-122 - Downgrade confirmation displays account limits after downgrade | Requires plan limit metadata and downgrade confirmation screen. |
| Traceability | SC-123 - Downgrade requires user acknowledgement before confirmation | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > downgrade preview terms checkbox is required before Confirm & pay, but it was not included in thi... |
| Traceability | SC-124 - User can cancel downgrade before confirmation | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > downgrade preview is closed without submitting, but it was not included in this AIR execution. |
| Blocked | SC-125 - Downgrade is scheduled for end of current billing cycle when applicable | Requires Stripe subscription schedule/API visibility and deterministic cycle date. |
| Blocked | SC-126 - Immediate downgrade is blocked or allowed according to business rules | Requires confirmed downgrade timing rule and Stripe/API validation. |
| Blocked | SC-127 - Downgrade keeps current higher-tier access until effective date | Requires scheduled downgrade fixture and entitlement validation before effective date. |
| Blocked | SC-128 - Downgrade applies lower-tier entitlements after effective date | Requires scheduler/time control and entitlement validation after effective date. |
| Blocked | SC-129 - Downgrade does not delete user account data immediately | Requires seeded portfolio/broker/account data and post-downgrade data integrity validation. |
| Blocked | SC-130 - Downgrade handles existing broker connections above new plan limit | Requires broker connection seed data above target plan limit. |
| Blocked | SC-131 - Downgrade handles portfolio positions above new plan limit | Requires portfolio position seed data above target plan limit. |
| Blocked | SC-132 - Downgrade handles linked accounts above new plan limit | Requires linked-account seed data above target plan limit. |
| Blocked | SC-133 - Downgrade warning clearly explains restricted features | Requires downgrade warning UI/copy fixture. |
| Blocked | SC-134 - Downgrade from annual higher plan to annual lower plan is handled correctly | Requires annual higher-plan fixture and Stripe subscription schedule validation. |
| Blocked | SC-135 - Downgrade from monthly higher plan to monthly lower plan is handled correctly | Requires monthly higher-plan fixture and Stripe subscription update validation. |
| Blocked | SC-136 - Downgrade from annual higher plan to monthly lower plan follows business rule | Requires confirmed interval-change rule and Stripe schedule validation. |
| Blocked | SC-137 - Downgrade from monthly higher plan to annual lower plan follows business rule | Requires confirmed interval-change rule and Stripe proration/schedule validation. |
| Blocked | SC-138 - Downgrade with pending cancellation follows correct precedence | Requires account fixture with scheduled cancellation plus downgrade eligibility rule. |
| Blocked | SC-139 - Downgrade with unpaid invoice is blocked or handled correctly | Requires unpaid invoice fixture and expected business rule. |
| Blocked | SC-140 - Downgrade with failed payment state is blocked or handled correctly | Requires failed-payment subscription fixture. |
| Blocked | SC-141 - Scheduled downgrade appears in billing overview | Requires scheduled downgrade fixture. |
| Blocked | SC-142 - Scheduled downgrade appears in subscription history | Requires scheduled downgrade fixture and history UI state. |
| Blocked | SC-143 - Downgrade confirmation email is sent | Requires email inbox/API access or notification capture service. |
| Blocked | SC-144 - Downgrade audit log is created | Requires admin/API/DB access to audit log records. |
| Blocked | SC-145 - User can resume or cancel scheduled downgrade before effective date when allowed | Requires scheduled downgrade fixture and confirmed resume/cancel rule. |
| Blocked | SC-146 - Cancelling scheduled downgrade keeps current plan active | Requires scheduled downgrade fixture and Stripe schedule cancellation validation. |
| Blocked | SC-147 - Double-clicking downgrade confirmation is idempotent | Requires backend/API visibility into duplicate downgrade prevention. |
| Future | SC-148 - Browser refresh during downgrade confirmation does not lose selected target plan | Requires stable downgrade flow and refresh behavior. |
| Future | SC-149 - Browser back from downgrade flow does not change plan | Requires safe downgrade cancel/back behavior fixture. |
| Future | SC-150 - Downgrade is not available to users without active paid subscription | Requires free/trial/cancelled account fixtures and expected UI state. |
| Future | SC-151 - Downgrade target excludes plans that are not lower tier | Requires plan ranking rules and multi-plan account fixture. |
| Blocked | SC-152 - Downgrade preserves billing customer and saved payment method | Requires Stripe customer/payment-method API visibility. |
| Blocked | SC-153 - Downgrade does not create duplicate subscription records | Requires backend/Stripe subscription count visibility. |
| Blocked | SC-154 - Downgrade webhook updates subscription status correctly | Requires webhook event visibility or backend state API. |
| Blocked | SC-155 - Downgrade failure webhook keeps current plan unchanged | Requires failed downgrade webhook fixture and entitlement validation. |
| Blocked | SC-156 - Downgrade effective-date reminder notification is sent when configured | Requires scheduler control and notification capture. |
| Blocked | SC-157 - Downgrade applies feature limits consistently across dashboard modules | Requires entitlement selectors across dashboard modules. |
| Blocked | SC-158 - Downgrade handles broker integration removal or restriction according to rule | Requires broker integration data and confirmed retention/removal rule. |
| Blocked | SC-159 - Downgrade handles bulk portfolio import availability according to target plan | Requires feature entitlement selectors for bulk portfolio load. |
| Blocked | SC-160 - Downgrade handles analytics availability according to target plan | Requires analytics entitlement selectors and target-plan fixture. |
| Blocked | SC-161 - Downgrade invoice or credit note is generated when applicable | Requires Stripe invoice/credit-note API visibility and confirmed billing rule. |
| Future | SC-162 - Downgrade with currency conversion displays correct amount and currency | Requires deterministic currency fixture and Stripe copy expectations. |
| Blocked | SC-163 - Downgrade API rejects unauthorized or cross-account downgrade attempts | Requires backend/API support for authorization validation. |
| Future | SC-164 - Downgrade can be reported correctly in AIR evidence and history | Requires completed downgrade execution fixture and AIR historical comparison run. |
| Traceability | SC-165 - Monthly plan subscriber sees annual billing option | Documented matrix scenario. Covered by PlanSelectionValidation.spec.ts > Monthly and Annual pricing toggle, but it was not included in this AIR execution. |
| Traceability | SC-166 - Current monthly plan is clearly identified before annual switch | Documented matrix scenario. Covered by BillingEdgeValidation.spec.ts > Billing plans expose billing interval summary without changing subscription, but it was not included in th... |
| Traceability | SC-167 - Annual price is displayed for the same subscription tier | Documented matrix scenario. Covered by PlanSelectionValidation.spec.ts > Monthly and Annual pricing toggle, but it was not included in this AIR execution. |
| Traceability | SC-168 - Annual switch action is available only for active monthly subscriptions | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > Prepared paid user can preview billing interval change without submitting. Enable SUB_LIFECYCLE_I... |
| Future | SC-169 - Annual switch is not shown for already annual subscription | Requires dedicated annual paid-account fixture. |
| Traceability | SC-170 - Annual switch confirmation displays current monthly plan and target annual plan | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > interval preview shows target plan and annual billing copy, but it was not included in this AIR e... |
| Traceability | SC-171 - Annual switch confirmation displays yearly amount | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > interval preview validates annual plan charge and recurring amount, but it was not included in th... |
| Traceability | SC-172 - Annual switch confirmation displays prorated credit or charge | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > interval preview validates unused-time credit and amount due today. Stripe invoice-ID reconciliat... |
| Traceability | SC-173 - Annual switch confirmation displays next renewal date | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > interval preview asserts next billing date copy, but it was not included in this AIR execution. |
| Traceability | SC-174 - User can cancel monthly-to-annual change before confirmation | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > interval preview is closed without submitting, but it was not included in this AIR execution. |
| Blocked | SC-175 - Successful monthly-to-annual change updates billing interval | Requires dedicated monthly account and approval to submit interval change. |
| Blocked | SC-176 - Successful monthly-to-annual change preserves same plan tier | Requires post-change billing state validation through UI/API. |
| Blocked | SC-177 - Successful monthly-to-annual change preserves entitlements | Requires entitlement selectors and post-change account fixture. |
| Future | SC-178 - Successful monthly-to-annual change records subscription history | Requires completed interval-change fixture. |
| Blocked | SC-179 - Successful monthly-to-annual change records transaction history when charge exists | Requires Stripe invoice/payment visibility for interval change. |
| Blocked | SC-180 - Invoice or receipt shows correct annual amount after interval change | Requires Stripe invoice/API and deterministic amount validation. |
| Future | SC-181 - Invoice PDF opens after monthly-to-annual change | Requires completed interval-change invoice fixture. |
| Blocked | SC-182 - Confirmation email is sent after monthly-to-annual change | Requires email inbox/API access or notification capture. |
| Blocked | SC-183 - Failed payment during monthly-to-annual change keeps monthly billing active | Requires failed-payment fixture and post-failure billing state validation. |
| Future | SC-184 - Declined card during interval change shows payment failure | Requires billing-change checkout with declined-card fixture. |
| Future | SC-185 - Incomplete payment details during interval change are blocked | Requires billing-change checkout fixture and Stripe validation selectors. |
| Blocked | SC-186 - Double-clicking annual switch confirmation is idempotent | Requires backend/API visibility into duplicate interval-change prevention. |
| Future | SC-187 - Browser refresh during interval change does not lose target annual plan | Requires stable interval-change flow and refresh behavior. |
| Future | SC-188 - Browser back from interval-change checkout returns without changing billing interval | Requires safe checkout cancel/return validation. |
| Blocked | SC-189 - Monthly-to-annual change is blocked for cancelled subscription after end date | Requires cancelled/expired subscription fixture. |
| Blocked | SC-190 - Monthly-to-annual change follows rule for subscription scheduled to cancel | Requires scheduled-cancellation fixture and confirmed business rule. |
| Blocked | SC-191 - Monthly-to-annual change preserves Stripe customer and payment method | Requires Stripe customer/payment-method API visibility. |
| Blocked | SC-192 - Monthly-to-annual change does not create duplicate active subscriptions | Requires backend/Stripe subscription count visibility. |
| Blocked | SC-193 - Monthly-to-annual change audit log is created | Requires admin/API/DB access to audit log records. |
| Blocked | SC-194 - Monthly-to-annual webhook updates billing interval correctly | Requires webhook event visibility or backend state API. |
| Blocked | SC-195 - Monthly-to-annual failure webhook leaves monthly billing unchanged | Requires failed webhook fixture and billing state validation. |
| Future | SC-196 - Annual savings messaging is displayed accurately | Requires final pricing/savings copy expectations. |
| Blocked | SC-197 - Monthly-to-annual change respects tax and currency configuration | Requires Stripe tax/currency API visibility. |
| Traceability | SC-198 - Monthly-to-annual change keeps billing portal return link working | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Stripe portal return link opens application content, but it was not included in this AIR execution. |
| Future | SC-199 - Monthly-to-annual change can be represented in AIR history | Requires completed interval-change execution and AIR historical comparison run. |
| Traceability | SC-200 - Monthly-to-annual matrix coverage is visible in AIR blocked/skipped coverage | Documented matrix scenario. Covered by MonthlyAnnualBillingChangeMatrix.spec.ts, but it was not included in this AIR execution. |
| Traceability | SC-201 - Annual plan subscriber sees monthly billing option | Documented matrix scenario. Covered by PlanSelectionValidation.spec.ts > Monthly and Annual pricing toggle, but it was not included in this AIR execution. |
| Traceability | SC-202 - Current annual plan is clearly identified before monthly switch | Documented matrix scenario. Covered by BillingEdgeValidation.spec.ts > Billing plans expose billing interval summary without changing subscription, but it was not included in th... |
| Traceability | SC-203 - Monthly price is displayed for the same subscription tier | Documented matrix scenario. Covered by PlanSelectionValidation.spec.ts > Monthly and Annual pricing toggle, but it was not included in this AIR execution. |
| Traceability | SC-204 - Monthly switch action is available only for active annual subscriptions | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > interval preview with SUB_LIFECYCLE_INTERVAL_TO=monthly and an annual paid fixture, but it was no... |
| Future | SC-205 - Monthly switch is not shown for already monthly subscription | Requires dedicated monthly paid-account fixture. |
| Traceability | SC-206 - Annual-to-monthly confirmation displays current annual plan and target monthly plan | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > interval preview shows target plan and monthly billing copy when SUB_LIFECYCLE_INTERVAL_TO=monthl... |
| Traceability | SC-207 - Annual-to-monthly confirmation displays monthly amount | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > interval preview validates monthly plan charge and recurring amount, but it was not included in t... |
| Blocked | SC-208 - Annual-to-monthly confirmation displays whether change is immediate or scheduled | Requires confirmed business rule and Stripe subscription schedule visibility. |
| Traceability | SC-209 - Annual-to-monthly confirmation displays next renewal date | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > interval preview asserts next billing date copy, but it was not included in this AIR execution. |
| Traceability | SC-210 - User can cancel annual-to-monthly change before confirmation | Documented matrix scenario. Covered by SubscriptionLifecycleExecution.spec.ts > interval preview is closed without submitting, but it was not included in this AIR execution. |
| Blocked | SC-211 - Successful annual-to-monthly change updates billing interval when effective | Requires dedicated annual account and approval to submit interval change. |
| Blocked | SC-212 - Successful annual-to-monthly change preserves same plan tier | Requires post-change billing state validation through UI/API. |
| Blocked | SC-213 - Successful annual-to-monthly change preserves entitlements until effective date | Requires entitlement selectors and scheduled interval-change fixture. |
| Future | SC-214 - Annual-to-monthly change records subscription history | Requires completed interval-change fixture. |
| Blocked | SC-215 - Annual-to-monthly change records transaction history when charge or credit exists | Requires Stripe invoice/payment/credit visibility for interval change. |
| Blocked | SC-216 - Invoice or credit note shows correct annual-to-monthly amount | Requires Stripe invoice/credit-note API and deterministic amount validation. |
| Future | SC-217 - Invoice or credit note PDF opens after annual-to-monthly change | Requires completed interval-change invoice or credit-note fixture. |
| Blocked | SC-218 - Confirmation email is sent after annual-to-monthly change | Requires email inbox/API access or notification capture. |
| Blocked | SC-219 - Failed payment during annual-to-monthly change keeps annual billing active | Requires failed-payment fixture and post-failure billing state validation. |
| Future | SC-220 - Declined card during annual-to-monthly change shows payment failure | Requires billing-change checkout with declined-card fixture. |
| Future | SC-221 - Incomplete payment details during annual-to-monthly change are blocked | Requires billing-change checkout fixture and Stripe validation selectors. |
| Blocked | SC-222 - Double-clicking monthly switch confirmation is idempotent | Requires backend/API visibility into duplicate interval-change prevention. |
| Future | SC-223 - Browser refresh during annual-to-monthly flow does not lose selected target monthly plan | Requires stable interval-change flow and refresh behavior. |
| Future | SC-224 - Browser back from annual-to-monthly checkout returns without changing billing interval | Requires safe checkout cancel/return validation. |
| Blocked | SC-225 - Annual-to-monthly change is blocked for cancelled subscription after end date | Requires cancelled/expired subscription fixture. |
| Blocked | SC-226 - Annual-to-monthly change follows rule for subscription scheduled to cancel | Requires scheduled-cancellation fixture and confirmed business rule. |
| Blocked | SC-227 - Annual-to-monthly change preserves Stripe customer and payment method | Requires Stripe customer/payment-method API visibility. |
| Blocked | SC-228 - Annual-to-monthly change does not create duplicate active subscriptions | Requires backend/Stripe subscription count visibility. |
| Blocked | SC-229 - Annual-to-monthly change audit log is created | Requires admin/API/DB access to audit log records. |
| Blocked | SC-230 - Annual-to-monthly webhook updates billing interval correctly | Requires webhook event visibility or backend state API. |
| Blocked | SC-231 - Annual-to-monthly failure webhook leaves annual billing unchanged | Requires failed webhook fixture and billing state validation. |
| Future | SC-232 - Loss of annual savings message is displayed accurately | Requires final pricing/savings copy expectations. |
| Blocked | SC-233 - Annual-to-monthly change respects tax and currency configuration | Requires Stripe tax/currency API visibility. |
| Traceability | SC-234 - Annual-to-monthly change keeps billing portal return link working | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Stripe portal return link opens application content, but it was not included in this AIR execution. |
| Future | SC-235 - Annual-to-monthly change is represented correctly in billing overview | Requires completed interval-change fixture. |
| Blocked | SC-236 - Annual-to-monthly scheduled change can be cancelled before effective date | Requires scheduled interval-change fixture and confirmed cancellation rule. |
| Blocked | SC-237 - Cancelling annual-to-monthly scheduled change keeps annual billing active | Requires Stripe schedule cancellation validation. |
| Future | SC-238 - Annual-to-monthly change can be reported correctly in AIR history | Requires completed interval-change execution and AIR historical comparison run. |
| Traceability | SC-239 - Annual-to-monthly matrix coverage is visible in AIR blocked/skipped coverage | Documented matrix scenario. Covered by AnnualMonthlyBillingChangeMatrix.spec.ts, but it was not included in this AIR execution. |
| Blocked | SC-240 - Annual-to-monthly API rejects unauthorized or cross-account interval changes | Requires backend/API support for authorization validation. |
| Traceability | SC-241 - Current subscription details are shown before cancellation | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Manage subscription opens Stripe portal with subscription details, but it was not included in this... |
| Traceability | SC-242 - Manage subscription portal opens from billing overview | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Manage subscription opens Stripe portal with subscription details, but it was not included in this... |
| Traceability | SC-243 - Cancel subscription action is available for active paid subscription | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Cancel subscription form accepts reason and feedback without cancelling, but it was not included i... |
| Traceability | SC-244 - Cancellation form opens without immediately cancelling subscription | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Cancel subscription form accepts reason and feedback without cancelling, but it was not included i... |
| Traceability | SC-245 - Cancellation form displays selected subscription name and price | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Cancel subscription form accepts reason and feedback without cancelling, but it was not included i... |
| Traceability | SC-246 - Cancellation reason dropdown is visible | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Cancel subscription form accepts reason and feedback without cancelling, but it was not included i... |
| Future | SC-247 - Cancellation reason is required before final cancellation | Requires a dedicated safe cancellation fixture to validate final-submit guardrails. |
| Traceability | SC-248 - Cancellation feedback accepts user text | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Cancel subscription form accepts reason and feedback without cancelling, but it was not included i... |
| Traceability | SC-249 - Go back from cancellation form leaves subscription unchanged | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Cancel subscription form accepts reason and feedback without cancelling, but it was not included i... |
| Future | SC-250 - Continue to cancellation shows final confirmation before destructive action | Requires fixture where final confirmation can be opened without impacting shared accounts. |
| Blocked | SC-251 - Final cancellation requires explicit confirmation | Requires backend/admin reset support for disposable paid subscription fixture. |
| Blocked | SC-252 - Dedicated fixture can be cancelled successfully | Requires disposable paid subscription that may be safely cancelled. |
| Blocked | SC-253 - Cancellation confirmation message is displayed | Requires safe final cancellation execution. |
| Traceability | SC-254 - Subscription becomes scheduled to cancel at period end | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Cancel subscription form accepts reason and feedback without cancelling, but it was not included i... |
| Blocked | SC-255 - Paid access remains available until current billing period ends | Requires time-controlled or backend subscription period fixture. |
| Traceability | SC-256 - Billing overview displays scheduled cancellation state | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Cancel subscription form accepts reason and feedback without cancelling, but it was not included i... |
| Future | SC-257 - Scheduled cancellation state persists after refresh | Requires stable scheduled-cancel fixture that can be reused without mutation. |
| Traceability | SC-258 - Already scheduled cancellation state is detected safely | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Stripe portal cancellation lifecycle state is readable without cancelling, but it was not included... |
| Future | SC-259 - Resume or reactivate action is visible when subscription is scheduled to cancel | Requires product-supported resume cancellation control or Stripe portal fixture. |
| Blocked | SC-260 - Resume cancellation keeps paid subscription active | Requires safe scheduled-cancel fixture and backend reset support. |
| Blocked | SC-261 - Cancellation reason is captured for audit or analytics | Requires admin/API access to cancellation metadata. |
| Blocked | SC-262 - Cancellation confirmation email is sent | Requires mailbox access and safe final cancellation fixture. |
| Blocked | SC-263 - Cancellation does not issue immediate refund unless policy allows it | Requires Stripe/backend verification of refund behavior. |
| Blocked | SC-264 - Refund action is restricted to authorized admin workflow | Requires admin permissions and refund test fixture. |
| Traceability | SC-265 - Invoice history remains visible after cancellation is scheduled | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Stripe portal shows paid invoice history, but it was not included in this AIR execution. |
| Traceability | SC-266 - Payment method remains visible while subscription remains active | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Manage subscription opens Stripe portal with subscription details, but it was not included in this... |
| Future | SC-267 - Danger-zone cancellation entry opens expected cancellation flow | Requires product-side danger-zone control to be stable and non-destructive in tests. |
| Future | SC-268 - Destructive cancellation controls are guarded against accidental clicks | Requires final confirmation flow fixture. |
| Blocked | SC-269 - Paid feature entitlement remains during cancellation grace period | Requires entitlement API or seeded billing period fixture. |
| Blocked | SC-270 - Paid feature entitlement is removed after billing period ends | Requires time-travel, webhook simulation, or backend fixture. |
| Future | SC-271 - Browser back from cancellation page does not change subscription | Requires safe portal navigation fixture. |
| Future | SC-272 - Refresh during cancellation form preserves safe state | Requires safe portal form-state fixture. |
| Blocked | SC-273 - Double-clicking final cancellation is idempotent | Requires backend idempotency verification for final cancellation. |
| Blocked | SC-274 - No-card trial can be cancelled without payment method | Requires active no-card trial fixture. |
| Blocked | SC-275 - Card-backed trial can be cancelled before auto-renewal | Requires active card-backed trial fixture. |
| Blocked | SC-276 - Subscription with unpaid invoice follows configured cancellation rule | Requires unpaid invoice fixture. |
| Blocked | SC-277 - Pending upgrade is handled before cancellation | Requires pending upgrade fixture. |
| Blocked | SC-278 - Pending downgrade is handled before cancellation | Requires pending downgrade fixture. |
| Future | SC-279 - Annual subscription cancellation keeps annual end date clear | Requires active annual paid fixture. |
| Future | SC-280 - Monthly subscription cancellation keeps monthly end date clear | Requires active monthly paid fixture. |
| Future | SC-281 - Upgrade is blocked or clearly handled after subscription is scheduled to cancel | Safe cancellation lifecycle state is readable in the Stripe portal; exact upgrade behavior after scheduled cancellation still requires a scheduled-cancel fixture. |
| Future | SC-282 - Payment method update behavior is clear after cancellation is scheduled | Requires scheduled-cancel fixture. |
| Traceability | SC-283 - Return link works after visiting cancellation portal | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Stripe portal return link opens application content, but it was not included in this AIR execution. |
| Blocked | SC-284 - Cancellation portal deep link requires authenticated customer session | Requires secure portal deep-link fixture. |
| Blocked | SC-285 - Unauthorized cross-account cancellation is blocked by backend | Requires backend/API authorization test support. |
| Blocked | SC-286 - Stripe cancellation webhook updates cancel-at-period-end state | Requires webhook simulation or Stripe event fixture. |
| Blocked | SC-287 - Webhook retry does not duplicate cancellation records | Requires webhook idempotency test support. |
| Future | SC-288 - Subscription cancellation history entry is displayed | Requires historical cancelled subscription fixture. |
| Future | SC-289 - Transaction history does not create an unexpected extra charge on cancellation | Requires final cancellation fixture with billing history verification. |
| Traceability | SC-290 - Invoice PDF remains accessible after cancellation is scheduled | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Stripe portal shows paid invoice history, but it was not included in this AIR execution. |
| Blocked | SC-291 - Cancellation reason analytics can be reviewed by admin | Requires admin analytics access. |
| Future | SC-292 - Missing cancellation reason blocks final cancellation when required | Requires final cancellation form validation fixture. |
| Future | SC-293 - Cancellation feedback max length is handled safely | Requires final cancellation form validation fixture. |
| Future | SC-294 - Cancellation terms or policy link opens correctly | Requires stable Stripe portal policy link selector. |
| Future | SC-295 - Support contact is available during cancellation flow | Requires support link/copy confirmation in portal. |
| Blocked | SC-296 - Duplicate cancellation request does not duplicate subscription state | Requires backend idempotency validation. |
| Future | SC-297 - Cancellation state is represented in AIR historical intelligence | Requires multiple historical AIR executions with cancellation state. |
| Future | SC-298 - Cancellation state is searchable in AIR | Requires cancellation state in normalized AIR data. |
| Traceability | SC-299 - Cancellation matrix coverage appears in AIR blocked and skipped coverage | Documented matrix scenario. Covered by CoverageGapEngine > skipped matrix ingestion, but it was not included in this AIR execution. |
| Blocked | SC-300 - Final cancellation scenario uses disposable fixture only | Requires dedicated disposable paid account and reset process. |
| Traceability | SC-301 - Declined card at checkout does not activate subscription | Documented matrix scenario. Covered by PaymentNegative.spec.ts > Stripe Checkout blocks declined or incomplete payment, but it was not included in this AIR execution. |
| Traceability | SC-302 - Invalid CVC is blocked during Stripe checkout | Documented matrix scenario. Covered by PaymentNegative.spec.ts > Stripe Checkout blocks invalid CVC, but it was not included in this AIR execution. |
| Traceability | SC-303 - Expired card date is blocked during Stripe checkout | Documented matrix scenario. Covered by PaymentNegative.spec.ts > Stripe Checkout blocks expired card date, but it was not included in this AIR execution. |
| Traceability | SC-304 - Incomplete card number is blocked during Stripe checkout | Documented matrix scenario. Covered by PaymentNegative.spec.ts > Stripe Checkout blocks incomplete card number, but it was not included in this AIR execution. |
| Blocked | SC-305 - Renewal payment failure changes subscription to past-due state | Requires Stripe renewal failure webhook fixture. |
| Blocked | SC-306 - Failed renewal creates an unpaid invoice | Requires failed renewal invoice fixture. |
| Blocked | SC-307 - First dunning email is sent after failed renewal | Requires mailbox access and failed renewal fixture. |
| Blocked | SC-308 - Retry schedule follows configured dunning cadence | Requires time-controlled retry scheduler or backend API. |
| Blocked | SC-309 - Grace period starts after failed renewal | Requires billing status fixture and entitlement API. |
| Blocked | SC-310 - Paid access is retained during configured grace period | Requires grace-period entitlement fixture. |
| Blocked | SC-311 - Paid access is restricted after grace period expires | Requires time-travel or backend state fixture. |
| Blocked | SC-312 - Updating payment method recovers past-due subscription | Requires past-due fixture and Stripe portal recovery flow. |
| Traceability | SC-313 - Add payment method screen opens from Stripe portal | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Stripe portal exposes payment recovery entry points without saving, but it was not included in thi... |
| Traceability | SC-314 - Billing information update screen opens from Stripe portal | Documented matrix scenario. Covered by BillingSubscriptionManagement.spec.ts > Stripe portal exposes payment recovery entry points without saving, but it was not included in thi... |
| Blocked | SC-315 - Successful retry marks failed invoice as paid | Requires retry payment success webhook fixture. |
| Blocked | SC-316 - Repeated failed retries do not duplicate invoice records | Requires webhook idempotency validation. |
| Blocked | SC-317 - Final failed renewal cancels or downgrades subscription according to policy | Requires dunning policy decision and backend fixture. |
| Future | SC-318 - No-card trial expiry downgrades user to free plan | Covered conceptually in trial matrix; requires time-controlled trial expiry. |
| Blocked | SC-319 - In-app failed payment notification is displayed | Requires past-due account fixture. |
| Blocked | SC-320 - invoice.payment_failed webhook is processed correctly | Requires webhook simulation or backend integration test. |
| Blocked | SC-321 - customer.subscription.updated webhook updates billing status | Requires webhook simulation or backend integration test. |
| Blocked | SC-322 - invoice.payment_succeeded webhook recovers subscription | Requires webhook simulation or backend integration test. |
| Blocked | SC-323 - Duplicate webhook delivery is idempotent | Requires webhook replay support. |
| Blocked | SC-324 - Failed payment creates audit log entry | Requires admin/API audit log access. |
| Blocked | SC-325 - Payment recovery creates audit log entry | Requires admin/API audit log access. |
| Blocked | SC-326 - Dunning email includes plan name and failed amount | Requires mailbox access and failed payment fixture. |
| Blocked | SC-327 - Dunning email includes update payment link | Requires mailbox access and failed payment fixture. |
| Blocked | SC-328 - Update payment link opens Stripe portal | Requires dunning email link fixture. |
| Blocked | SC-329 - Expired payment update link is handled clearly | Requires expired portal session fixture. |
| Blocked | SC-330 - Unauthorized payment update attempt is blocked | Requires backend/API authorization validation. |
| Blocked | SC-331 - Failed payment after upgrade keeps previous plan active | Requires upgrade payment failure fixture. |
| Blocked | SC-332 - Failed payment after interval change keeps previous billing interval | Requires billing interval payment failure fixture. |
| Blocked | SC-333 - Admin can retry failed payment when supported | Requires admin billing management support. |
| Blocked | SC-334 - Removed payment method before renewal triggers failed payment flow | Requires saved payment method removal fixture. |
| Traceability | SC-335 - Insufficient funds card is handled during checkout | Documented matrix scenario. Covered by PaymentNegative.spec.ts > Stripe Checkout rejects insufficient funds card without activating subscription, but it was not included in this... |
| Traceability | SC-336 - Authentication-required payment is handled gracefully | Documented matrix scenario. Covered by PaymentNegative.spec.ts > Stripe Checkout opens authentication-required flow without losing checkout context, but it was not included in t... |
| Future | SC-337 - Issuer unavailable payment failure is handled gracefully | Processing-error checkout is covered in PaymentNegative.spec.ts; a dedicated issuer-unavailable fixture still requires Stripe/API support. |
| Future | SC-338 - Fraud-blocked payment does not activate subscription | Stolen-card checkout decline is covered in PaymentNegative.spec.ts; a true fraud/Radar blocked-payment fixture still requires Stripe/API support. |
| Blocked | SC-339 - Expired saved card renewal follows dunning flow | Requires saved expired-card renewal fixture. |
| Blocked | SC-340 - Invalid country or currency setup is handled safely | Requires Stripe/customer currency fixture. |
| Blocked | SC-341 - Tax calculation failure prevents incorrect subscription activation | Requires backend/Stripe tax failure simulation. |
| Blocked | SC-342 - Unpaid invoice PDF or invoice view is available when configured | Requires unpaid invoice fixture. |
| Blocked | SC-343 - Paid-after-retry invoice PDF opens successfully | Requires recovered invoice fixture. |
| Blocked | SC-344 - Transaction history shows failed payment status | Requires failed payment fixture visible in app history. |
| Blocked | SC-345 - Billing overview shows past-due or payment issue state | Requires past-due account fixture. |
| Blocked | SC-346 - Dashboard banner warns user about payment issue | Requires past-due account fixture. |
| Blocked | SC-347 - Feature access remains correct during payment grace period | Requires grace-period entitlement fixture. |
| Blocked | SC-348 - Feature access is restricted after payment suspension | Requires suspended account fixture. |
| Future | SC-349 - AIR records failed payment evidence when available | Requires failed payment execution artifacts in AIR. |
| Future | SC-350 - AIR history highlights failed payment trend | Requires historical failed payment executions. |
| Blocked | SC-351 - Dunning retry configuration is validated against admin settings | Requires admin dunning configuration API or UI fixture. |
| Traceability | SC-352 - Failed payment and dunning matrix coverage is visible in AIR blocked coverage | Documented matrix scenario. Covered by CoverageGapEngine > skipped matrix ingestion, but it was not included in this AIR execution. |

## Notes

- This summary does not replace Playwright evidence, traces, videos, or screenshots.
- Failed scenarios should still be reviewed in AIR Failure Intelligence.
- Controlled and blocked scenarios are listed so stakeholders understand what was not executed and why.
