# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AuthUiValidation.spec.ts >> Auth UI Validation >> Forgot password direct link remains usable after refresh
- Location: tests\AuthUiValidation.spec.ts:487:9

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - link "OolTool" [ref=e4] [cursor=pointer]:
      - /url: /
      - img "OolTool" [ref=e5]
    - generic [ref=e6]:
      - generic [ref=e7]:
        - generic [ref=e8]: Reset Password
        - generic [ref=e9]: Enter your email to receive a reset link
      - generic [ref=e10]:
        - generic [ref=e12]:
          - text: Email
          - textbox "Email" [ref=e13]:
            - /placeholder: you@example.com
        - generic [ref=e14]:
          - button "Send Reset Link" [ref=e15] [cursor=pointer]
          - link "Back to login" [ref=e16] [cursor=pointer]:
            - /url: /login
  - region "Cookie consent" [ref=e17]:
    - generic [ref=e18]:
      - paragraph [ref=e19]:
        - text: We use cookies for login, preferences, and to improve OolTool. Read the
        - link "Privacy Policy" [ref=e20] [cursor=pointer]:
          - /url: /privacy-policy
        - text: .
      - generic [ref=e21]:
        - button "Essential only" [ref=e22] [cursor=pointer]
        - button "Accept" [ref=e23] [cursor=pointer]
  - region "Notifications alt+T"
  - alert [ref=e24]
```