const fs = require('fs');
const path = require('path');
const tls = require('tls');

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  for (const rawLine of fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/)) {
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
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnv(path.join(process.cwd(), '.env'));

const user = (process.env.GMAIL_USER || '').trim();
const password = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

if (!user || !password) {
  console.error('GMAIL_IMAP_CHECK: missing GMAIL_USER or GMAIL_APP_PASSWORD');
  process.exit(2);
}

function quote(value) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

const socket = tls.connect({
  host: 'imap.gmail.com',
  port: 993,
  servername: 'imap.gmail.com'
});

socket.setEncoding('utf8');

let buffer = '';
let tagCount = 0;
let greeted = false;

socket.on('data', (chunk) => {
  buffer += chunk;
});

socket.on('error', (error) => {
  console.error(`GMAIL_IMAP_CHECK: connection failed: ${error.message}`);
  process.exit(1);
});

function waitFor(pattern, timeoutMs = 20000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      if (pattern.test(buffer)) {
        clearInterval(timer);
        const snapshot = buffer;
        buffer = '';
        resolve(snapshot);
        return;
      }

      if (Date.now() - started > timeoutMs) {
        clearInterval(timer);
        reject(new Error(`timed out waiting for ${pattern}`));
      }
    }, 50);
  });
}

async function send(command) {
  tagCount += 1;
  const tag = `A${tagCount}`;
  socket.write(`${tag} ${command}\r\n`);
  const response = await waitFor(new RegExp(`^${tag} (OK|NO|BAD)`, 'm'));
  if (!new RegExp(`^${tag} OK`, 'm').test(response)) {
    throw new Error(response.split(/\r?\n/).slice(-3).join(' ').trim());
  }
  return response;
}

(async () => {
  await waitFor(/\* OK/i);
  greeted = true;
  await send(`LOGIN ${quote(user)} ${quote(password)}`);
  await send('SELECT INBOX');
  await send('LOGOUT').catch(() => undefined);
  console.log('GMAIL_IMAP_CHECK: login ok');
  socket.destroy();
  process.exit(0);
})().catch((error) => {
  console.error(`GMAIL_IMAP_CHECK: ${greeted ? 'login failed' : 'greeting failed'}: ${error.message}`);
  socket.destroy();
  process.exit(1);
});
