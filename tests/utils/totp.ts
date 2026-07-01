import crypto from 'crypto';

/* =============================================================================
UTILITY: TOTP

PURPOSE
-------
Generates RFC 6238-compatible authenticator codes without adding a package
dependency. MFA tests use this for user-side authenticator validation.

============================================================================= */

const base32Alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function decodeBase32(
  value: string
) {

  const normalized =
    value
      .replace(/\s|=/g, '')
      .toUpperCase();

  let bits =
    '';

  for (const character of normalized) {
    const index =
      base32Alphabet.indexOf(
        character
      );

    if (index === -1) {
      throw new Error(
        'MFA secret must be base32 encoded.'
      );
    }

    bits +=
      index
        .toString(2)
        .padStart(
          5,
          '0'
        );
  }

  const bytes: number[] =
    [];

  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(
      parseInt(
        bits.slice(
          index,
          index + 8
        ),
        2
      )
    );
  }

  return Buffer.from(
    bytes
  );
}

export function generateTotp(
  secret: string,
  options: {
    stepSeconds?: number;
    digits?: number;
    offsetSteps?: number;
  } = {}
) {

  const stepSeconds =
    options.stepSeconds ?? 30;

  const digits =
    options.digits ?? 6;

  const offsetSteps =
    options.offsetSteps ?? 0;

  const counter =
    Math.floor(
      Date.now() / 1000 / stepSeconds
    ) + offsetSteps;

  const counterBuffer =
    Buffer.alloc(8);

  counterBuffer.writeUInt32BE(
    Math.floor(counter / 0x100000000),
    0
  );

  counterBuffer.writeUInt32BE(
    counter & 0xffffffff,
    4
  );

  const hmac =
    crypto
      .createHmac(
        'sha1',
        decodeBase32(secret)
      )
      .update(counterBuffer)
      .digest();

  const offset =
    hmac[hmac.length - 1] & 0x0f;

  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return String(
    binary % 10 ** digits
  ).padStart(
    digits,
    '0'
  );
}
