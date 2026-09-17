import { spawn } from 'node:child_process';

const TEST_PORT = process.env.TEST_PORT || '5050';
const ROOT_URL = process.env.TEST_ROOT_URL || `http://localhost:${TEST_PORT}`;
const API_BASE_URL = process.env.API_BASE_URL || `${ROOT_URL}/api`;
const TEST_FILES = ['tests/api.test.js', 'tests/cart.test.js', 'tests/auth.test.js', 'tests/order.test.js', 'tests/security.test.js'];

let serverProcess = null;
let serverLogs = '';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function readHealth() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const response = await fetch(ROOT_URL, { signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) return false;

    const data = await response.json();
    return data?.message === 'Nexora Backend API is running';
  } catch {
    return false;
  }
}

function appendServerLog(chunk) {
  serverLogs += chunk.toString();
  if (serverLogs.length > 12000) {
    serverLogs = serverLogs.slice(-12000);
  }
}

async function startServerIfNeeded() {
  if (await readHealth()) {
    console.log(`Using existing Nexora server at ${ROOT_URL}`);
    return;
  }

  console.log(`Starting test server at ${ROOT_URL}`);
  serverProcess = spawn(process.execPath, ['src/server.js'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: TEST_PORT,
      NODE_ENV: 'test',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  serverProcess.stdout.on('data', appendServerLog);
  serverProcess.stderr.on('data', appendServerLog);

  for (let attempt = 0; attempt < 30; attempt++) {
    if (serverProcess.exitCode !== null) {
      throw new Error(`Test server exited early.\n${serverLogs}`);
    }
    if (await readHealth()) return;
    await wait(500);
  }

  throw new Error(`Timed out waiting for test server.\n${serverLogs}`);
}

function runTestFile(file) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [file], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        TEST_ROOT_URL: ROOT_URL,
        API_BASE_URL,
      },
      stdio: 'inherit',
    });

    child.on('exit', (code) => resolve(code ?? 1));
    child.on('error', () => resolve(1));
  });
}

async function main() {
  try {
    await startServerIfNeeded();

    for (const file of TEST_FILES) {
      const code = await runTestFile(file);
      if (code !== 0) {
        if (serverLogs.trim()) {
          console.log('\nRecent test server logs:\n');
          console.log(serverLogs.trim());
        }
        process.exit(code);
      }
    }
  } catch (error) {
    console.error(error.message || error);
    process.exit(1);
  } finally {
    if (serverProcess && serverProcess.exitCode === null) {
      serverProcess.kill();
    }
  }
}

main();
