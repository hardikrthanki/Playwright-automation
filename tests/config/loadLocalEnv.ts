import fs from 'fs';
import path from 'path';

/* =============================================================================
Load gitignored .env into process.env so Gmail IMAP works in a fresh
VS Code terminal without re-setting $env:GMAIL_APP_PASSWORD every run.
Existing process env values always win.
============================================================================= */

export function loadLocalEnv(
  projectRoot = process.cwd()
) {
  const roots = [
    projectRoot,
    path.resolve(__dirname, '..', '..')
  ];

  const envFiles = [
    ...new Set(
      roots.flatMap((root) => [
        path.join(root, '.env'),
        path.join(root, '.env.local')
      ])
    )
  ];

  for (const envPath of envFiles) {
    if (!fs.existsSync(envPath)) {
      continue;
    }

    const text = fs.readFileSync(
      envPath,
      'utf8'
    ).replace(/^\uFEFF/, '');

    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.replace(/^\uFEFF/, '').trim();

      if (!line || line.startsWith('#')) {
        continue;
      }

      const separator = line.indexOf('=');

      if (separator <= 0) {
        continue;
      }

      const key = line.slice(0, separator).trim();
      let value = line.slice(separator + 1).trim();

      if (
        (
          value.startsWith('"') &&
          value.endsWith('"')
        ) ||
        (
          value.startsWith("'") &&
          value.endsWith("'")
        )
      ) {
        value = value.slice(1, -1);
      }

      const current = process.env[key];

      if (
        current === undefined ||
        current === ''
      ) {
        process.env[key] = value;
      }
    }
  }
}

loadLocalEnv();
