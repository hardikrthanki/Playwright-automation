import tls from 'tls';

import {
  BASE_URL,
  TEST_USERS
} from '../config/testData';

import '../config/loadLocalEnv';

/* =============================================================================
HELPER: Gmail IMAP verification

PURPOSE
-------
Reads the OOLTool verification link from Gmail.

Requires a Google App Password in gitignored .env or the terminal:

GMAIL_USER=imhardikthanki@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
============================================================================= */

const MAILBOXES = [
  'INBOX',
  '[Gmail]/All Mail',
  '[Gmail]/Spam',
  '[Google Mail]/All Mail',
  '[Google Mail]/Spam'
];

function envTimeoutMs() {
  const parsed = Number(
    process.env.GMAIL_IMAP_TIMEOUT_MS
  );

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return 180000;
}

export function isGmailAutomationEnabled() {
  return Boolean(
    gmailAppPassword()
  );
}

function gmailUser() {
  return (
    process.env.GMAIL_USER ??
    TEST_USERS.onboarding.emailBase ??
    ''
  ).trim();
}

function gmailAppPassword() {
  return (
    process.env.GMAIL_APP_PASSWORD ??
    ''
  ).replace(/\s+/g, '');
}

function decodeQuotedPrintable(value: string) {
  return value
    .replace(/=\r?\n/g, '')
    .replace(/=([0-9A-Fa-f]{2})/g, (_match, hex) =>
      String.fromCharCode(Number.parseInt(hex, 16))
    );
}

function decodeBase64(value: string) {
  try {
    return Buffer.from(
      value.replace(/\s+/g, ''),
      'base64'
    ).toString('utf8');
  } catch {
    return '';
  }
}

function decodeMime(rawEmail: string) {
  const quoted = decodeQuotedPrintable(rawEmail);
  const withBase64 = quoted.replace(
    /Content-Transfer-Encoding:\s*base64\s*\r?\n\r?\n([A-Za-z0-9+/=\s]+)/gi,
    (_match, body: string) => `\n${decodeBase64(body)}\n`
  );

  return `${quoted}\n${withBase64}`;
}

function extractVerificationLink(rawEmail: string) {
  const decoded = decodeMime(rawEmail)
    .replace(/&amp;/gi, '&')
    .replace(/&#x3d;|=3D/gi, '=');

  const escapedBase = BASE_URL.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

  const patterns = [
    new RegExp(`${escapedBase}/[^\\s"'<>\\\\]+`, 'ig'),
    /https?:\/\/(?:www\.)?ooltool\.com\/[^\s"'<>\\]+/ig,
    /https?:\/\/[^\s"'<>\\]*uat\.ooltool\.com\/[^\s"'<>\\]*/ig,
    /https?:\/\/[^\s"'<>\\]*(?:verify-email|email-verif|confirm-email|\/verify)[^\s"'<>\\]*/ig
  ];

  const links: string[] = [];

  for (const pattern of patterns) {
    const matches = decoded.match(pattern) ?? [];
    links.push(...matches);
  }

  const unique = [
    ...new Set(
      links.map((link) =>
        link
          .replace(/&amp;/g, '&')
          .replace(/[),.;>"'\]]+$/g, '')
      )
    )
  ];

  const preferred = unique.find((link) =>
    /verify|confirm|token/i.test(link)
  );

  return preferred ?? unique[0];
}

function quoteImap(value: string) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function collectUids(response: string) {
  const line = response.match(/^\* SEARCH[^\r\n]*/m)?.[0] ?? '';

  return [
    ...new Set(
      [...line.matchAll(/\b(\d+)\b/g)].map((match) => match[1])
    )
  ];
}

function newestUids(uids: string[], limit = 8) {
  return uids.slice(-limit).reverse();
}

async function readImapResponse(
  socket: tls.TLSSocket,
  state: { buffer: string },
  tag: string
) {
  const timeout = Date.now() + 45000;

  while (Date.now() < timeout) {
    if (new RegExp(`^${tag} (NO|BAD)`, 'm').test(state.buffer)) {
      const response = state.buffer;
      state.buffer = '';
      throw new Error(response.slice(-500).trim());
    }

    if (new RegExp(`^${tag} OK`, 'm').test(state.buffer)) {
      const response = state.buffer;
      state.buffer = '';
      return response;
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  throw new Error('Gmail IMAP timed out');
}

async function imapSession<T>(
  run: (
    send: (command: string) => Promise<string>
  ) => Promise<T>
) {
  const user = gmailUser();
  const password = gmailAppPassword();

  if (!user) {
    throw new Error('GMAIL_USER is not set');
  }

  if (!password) {
    throw new Error('GMAIL_APP_PASSWORD is not set');
  }

  const state = {
    buffer: ''
  };

  const socket = await new Promise<tls.TLSSocket>((resolve, reject) => {
    const connection = tls.connect({
      host: 'imap.gmail.com',
      port: 993,
      servername: 'imap.gmail.com'
    });

    connection.setEncoding('utf8');

    connection.on('data', (chunk: string) => {
      state.buffer += chunk;
    });

    connection.once('error', reject);
    connection.once('secureConnect', () => resolve(connection));
  });

  socket.setTimeout(45000);

  try {
    const greetingTimeout = Date.now() + 15000;
    let greeted = false;

    while (Date.now() < greetingTimeout) {
      if (/\* OK/i.test(state.buffer)) {
        state.buffer = '';
        greeted = true;
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    if (!greeted) {
      throw new Error('Gmail IMAP greeting timed out');
    }

    let tagCount = 0;

    const send = async (command: string) => {
      tagCount += 1;
      const tag = `A${tagCount}`;
      socket.write(`${tag} ${command}\r\n`);
      return readImapResponse(socket, state, tag);
    };

    await send(`LOGIN ${quoteImap(user)} ${quoteImap(password)}`);

    try {
      return await run(send);
    } finally {
      await send('LOGOUT').catch(() => undefined);
    }
  } finally {
    socket.destroy();
  }
}

function searchCommands(email: string) {
  const uniqueLocal = email.split('@')[0]?.split('+')[1];

  const commands = [
    `UID SEARCH X-GM-RAW ${quoteImap(`newer_than:2d deliveredto:${email}`)}`,
    `UID SEARCH X-GM-RAW ${quoteImap(`newer_than:2d to:${email}`)}`,
    `UID SEARCH X-GM-RAW ${quoteImap(`newer_than:2d ${email}`)}`,
    `UID SEARCH HEADER Delivered-To ${quoteImap(email)}`,
    `UID SEARCH TO ${quoteImap(email)}`,
    `UID SEARCH TEXT ${quoteImap(email)}`
  ];

  if (uniqueLocal) {
    commands.push(
      `UID SEARCH X-GM-RAW ${quoteImap(`newer_than:2d ${uniqueLocal}`)}`,
      `UID SEARCH TEXT ${quoteImap(uniqueLocal)}`
    );
  }

  return commands;
}

async function searchMailbox(
  send: (command: string) => Promise<string>,
  mailbox: string,
  email: string
) {
  try {
    await send(`SELECT ${quoteImap(mailbox)}`);
  } catch {
    return [];
  }

  const uids: string[] = [];

  for (const command of searchCommands(email)) {
    try {
      const response = await send(command);
      uids.push(...collectUids(response));

      if (uids.length > 0) {
        return newestUids(uids);
      }
    } catch {
      // Try the next Gmail search syntax.
    }
  }

  return newestUids(uids);
}

async function fetchLink(
  send: (command: string) => Promise<string>,
  uid: string
) {
  const body = await send(`UID FETCH ${uid} BODY.PEEK[]`);
  return extractVerificationLink(body);
}

async function imapRequest(email: string) {
  return imapSession(async (send) => {
    for (const mailbox of MAILBOXES) {
      const uids = await searchMailbox(send, mailbox, email);

      for (const uid of uids) {
        const link = await fetchLink(send, uid);

        if (link) {
          console.log(
            `Found verification link in Gmail ${mailbox} UID ${uid}`
          );
          return link;
        }
      }
    }

    throw new Error(
      `No Gmail verification message found for ${email}`
    );
  });
}

export async function waitForGmailVerificationLink(
  email: string,
  timeoutMs = envTimeoutMs()
) {
  const startedAt = Date.now();
  let lastError: Error | undefined;
  let attempt = 0;

  while (Date.now() - startedAt < timeoutMs) {
    attempt += 1;

    try {
      return await imapRequest(email);
    } catch (error) {
      lastError = error instanceof Error
        ? error
        : new Error(String(error));

      const remainingMs = timeoutMs - (Date.now() - startedAt);

      if (attempt === 1 || attempt % 3 === 0) {
        console.log(
          `Gmail IMAP attempt ${attempt} for ${email}: ${lastError.message.split('\n')[0]}`
        );
      }

      if (remainingMs <= 0) {
        break;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(2000, remainingMs))
      );
    }
  }

  throw lastError ?? new Error(
    `Timed out waiting for Gmail verification mail to ${email}`
  );
}
