# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: NewSubscriptionPurchaseMatrix.spec.ts >> New Subscription Purchase Use Case 2 Matrix >> SC-75H - Payment receipt or subscription confirmation email is received after purchase
- Location: tests\NewSubscriptionPurchaseMatrix.spec.ts:483:13

# Error details

```
Error: No Gmail message for "payment receipt" arrived for imhardikthanki+buy-inc-mo-muxtyi62@gmail.com within 90s. Subjects seen: ["Your Income subscription is now active","Verify your email for imhardikthanki+buy-inc-mo-muxtyi62@gmail.com"]
```

# Test source

```ts
  550 |     .replace(/<[^>]+>/g, ' ')
  551 |     .replace(/&nbsp;/gi, ' ')
  552 |     .replace(/&amp;/gi, '&')
  553 |     .replace(/\s+/g, ' ')
  554 |     .trim();
  555 | }
  556 | 
  557 | export async function listGmailMessages(
  558 |   email: string,
  559 |   perMailboxLimit = 12
  560 | ): Promise<GmailMessage[]> {
  561 |   return imapSession(async (send) => {
  562 |     const found = new Map<string, GmailMessage>();
  563 | 
  564 |     for (const mailbox of MAILBOXES) {
  565 |       const uids = (
  566 |         await searchMailbox(send, mailbox, email)
  567 |       ).slice(0, perMailboxLimit);
  568 | 
  569 |       for (const uid of uids) {
  570 |         try {
  571 |           const raw = await send(
  572 |             `UID FETCH ${uid} BODY.PEEK[]`
  573 |           );
  574 | 
  575 |           const messageId =
  576 |             headerValue(raw, 'Message-ID') ||
  577 |             `${mailbox}:${uid}`;
  578 | 
  579 |           if (found.has(messageId)) {
  580 |             continue;
  581 |           }
  582 | 
  583 |           found.set(messageId, {
  584 |             mailbox,
  585 |             uid,
  586 |             messageId,
  587 |             subject: decodeMimeWords(
  588 |               headerValue(raw, 'Subject')
  589 |             ),
  590 |             text: plainText(raw)
  591 |           });
  592 |         } catch {
  593 |           // Skip unreadable messages.
  594 |         }
  595 |       }
  596 |     }
  597 | 
  598 |     return [...found.values()];
  599 |   });
  600 | }
  601 | 
  602 | export async function waitForGmailMessageMatching(
  603 |   email: string,
  604 |   options: {
  605 |     label: string;
  606 |     match: (message: GmailMessage) => boolean;
  607 |     ignoreMessageIds?: Set<string>;
  608 |     timeoutMs?: number;
  609 |   }
  610 | ): Promise<GmailMessage> {
  611 |   const timeoutMs = options.timeoutMs ?? 90000;
  612 |   const startedAt = Date.now();
  613 |   let lastSubjects: string[] = [];
  614 |   let lastError = '';
  615 | 
  616 |   while (Date.now() - startedAt < timeoutMs) {
  617 |     try {
  618 |       const messages = await listGmailMessages(email);
  619 | 
  620 |       lastSubjects = messages.map(
  621 |         (message) => message.subject
  622 |       );
  623 | 
  624 |       const hit = messages.find(
  625 |         (message) =>
  626 |           !options.ignoreMessageIds?.has(
  627 |             message.messageId
  628 |           ) &&
  629 |           options.match(message)
  630 |       );
  631 | 
  632 |       if (hit) {
  633 |         console.log(
  634 |           `Gmail "${options.label}" found for ${email}: ${hit.subject}`
  635 |         );
  636 | 
  637 |         return hit;
  638 |       }
  639 |     } catch (error) {
  640 |       lastError = error instanceof Error
  641 |         ? error.message.split('\n')[0]
  642 |         : String(error);
  643 |     }
  644 | 
  645 |     await new Promise((resolve) =>
  646 |       setTimeout(resolve, 4000)
  647 |     );
  648 |   }
  649 | 
> 650 |   throw new Error(
      |         ^ Error: No Gmail message for "payment receipt" arrived for imhardikthanki+buy-inc-mo-muxtyi62@gmail.com within 90s. Subjects seen: ["Your Income subscription is now active","Verify your email for imhardikthanki+buy-inc-mo-muxtyi62@gmail.com"]
  651 |     `No Gmail message for "${options.label}" arrived for ${email} within ${Math.round(timeoutMs / 1000)}s. Subjects seen: ${
  652 |       lastSubjects.length
  653 |         ? JSON.stringify(lastSubjects)
  654 |         : 'none'
  655 |     }${lastError ? `. Last IMAP error: ${lastError}` : ''}`
  656 |   );
  657 | }
  658 | 
```