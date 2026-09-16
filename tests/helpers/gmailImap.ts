import tls from 'tls';

import {
  BASE_URL,
  TEST_USERS
} from '../config/testData';

/* =============================================================================
HELPER: Gmail IMAP verification

PURPOSE
-------
Reads the verification email from Gmail and returns the OOLTool link.
Requires a Google App Password:

$env:GMAIL_USER="imhardikthanki@gmail.com"
$env:GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
============================================================================= */

export function isGmailAutomationEnabled() {
  return Boolean(
    process.env.GMAIL_APP_PASSWORD?.replace(
      /\s+/g,
      ''
    )
  );
}

function gmailUser() {
  return process.env.GMAIL_USER ??
    TEST_USERS.onboarding.emailBase;
}

function gmailAppPassword() {
  return (
    process.env.GMAIL_APP_PASSWORD ??
    ''
  ).replace(
    /\s+/g,
    ''
  );
}

function decodeQuotedPrintable(
  value: string
) {
  return value
    .replace(
      /=\r?\n/g,
      ''
    )
    .replace(
      /=([0-9A-Fa-f]{2})/g,
      (_match, hex) =>
        String.fromCharCode(
          Number.parseInt(
            hex,
            16
          )
        )
    );
}

function extractVerificationLink(
  rawEmail: string
) {
  const decoded =
    decodeQuotedPrintable(
      rawEmail
    );

  const escapedBase =
    BASE_URL.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

  const match =
    decoded.match(
      new RegExp(
        `${escapedBase}/[^\\s"'<>\\\\]+`,
        'i'
      )
    ) ??
    decoded.match(
      /https?:\/\/[^\s"'<>\\]*verify[^\s"'<>\\]*/i
    );

  if (
    !match
  ) {
    return undefined;
  }

  return match[0]
    .replace(
      /&amp;/g,
      '&'
    )
    .replace(
      /[),.;]+$/,
      ''
    );
}

function quoteImap(
  value: string
) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

async function readImapResponse(
  socket: tls.TLSSocket,
  state: {
    buffer: string;
  },
  tag: string
) {
  const timeout =
    Date.now() +
    25000;

  while (
    Date.now() <
    timeout
  ) {
    if (
      new RegExp(
        `^${tag} (NO|BAD)`,
        'm'
      ).test(
        state.buffer
      )
    ) {
      throw new Error(
        state.buffer.slice(
          -400
        )
      );
    }

    if (
      new RegExp(
        `^${tag} OK`,
        'm'
      ).test(
        state.buffer
      )
    ) {
      const response =
        state.buffer;

      state.buffer =
        '';

      return response;
    }

    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          50
        )
    );
  }

  throw new Error(
    'Gmail IMAP timed out'
  );
}

async function imapRequest(
  email: string
) {
  const user =
    gmailUser();

  const password =
    gmailAppPassword();

  const state = {
    buffer: ''
  };

  const socket =
    await new Promise<tls.TLSSocket>(
      (resolve, reject) => {
        const connection =
          tls.connect(
            {
              host: 'imap.gmail.com',
              port: 993,
              servername: 'imap.gmail.com'
            }
          );

        connection.setEncoding(
          'utf8'
        );

        connection.on(
          'data',
          (chunk: string) => {
            state.buffer +=
              chunk;
          }
        );

        connection.once(
          'error',
          reject
        );

        connection.once(
          'secureConnect',
          () =>
            resolve(
              connection
            )
        );
      }
    );

  socket.setTimeout(
    30000
  );

  const waitForGreeting =
    async () => {
      const timeout =
        Date.now() +
        15000;

      while (
        Date.now() <
        timeout
      ) {
        if (
          /\* OK/i.test(
            state.buffer
          )
        ) {
          state.buffer =
            '';

          return;
        }

        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              50
            )
        );
      }

      throw new Error(
        'Gmail IMAP greeting timed out'
      );
    };

  let tagCount =
    0;

  const send = async (
    command: string
  ) => {
    tagCount +=
      1;

    const tag =
      `A${tagCount}`;

    socket.write(
      `${tag} ${command}\r\n`
    );

    return readImapResponse(
      socket,
      state,
      tag
    );
  };

  try {
    await waitForGreeting();

    await send(
      `LOGIN ${quoteImap(user)} ${quoteImap(password)}`
    );

    await send(
      'SELECT INBOX'
    );

    const search =
      await send(
        `UID SEARCH X-GM-RAW ${quoteImap(`newer_than:2d to:${email}`)}`
      );

    let uids =
      [
        ...search.matchAll(
          /\* SEARCH[^\n]*/g
        )
      ]
        .flatMap(
          line =>
            [
              ...line[0].matchAll(
                /\b(\d+)\b/g
              )
            ]
              .map(
                match =>
                  match[1]
              )
        );

    if (
      uids.length ===
      0
    ) {
      const fallback =
        await send(
          `UID SEARCH TEXT ${quoteImap(email)}`
        );

      uids =
        [
          ...fallback.matchAll(
            /\* SEARCH[^\n]*/g
          )
        ]
          .flatMap(
            line =>
              [
                ...line[0].matchAll(
                  /\b(\d+)\b/g
                )
              ]
                .map(
                  match =>
                    match[1]
                )
        );
    }

    const uid =
      uids.at(
        -1
      );

    if (
      !uid
    ) {
      throw new Error(
        `No Gmail message found for ${email}`
      );
    }

    const body =
      await send(
        `UID FETCH ${uid} BODY.PEEK[]`
      );

    await send(
      'LOGOUT'
    ).catch(
      () => undefined
    );

    const link =
      extractVerificationLink(
        body
      );

    if (
      !link
    ) {
      throw new Error(
        `Gmail message for ${email} did not contain a verification link`
      );
    }

    return link;
  } finally {
    socket.destroy();
  }
}

export async function waitForGmailVerificationLink(
  email: string,
  timeoutMs =
    90000
) {
  const startedAt =
    Date.now();

  let lastError:
    Error |
    undefined;

  while (
    Date.now() -
    startedAt <
    timeoutMs
  ) {
    try {
      return await imapRequest(
        email
      );
    } catch (
      error
    ) {
      lastError =
        error instanceof Error
          ? error
          : new Error(
            String(
              error
            )
          );

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            5000
          )
      );
    }
  }

  throw lastError ??
    new Error(
      `Timed out waiting for Gmail verification mail to ${email}`
    );
}
