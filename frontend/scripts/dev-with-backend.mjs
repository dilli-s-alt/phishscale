import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendCwd = path.resolve(__dirname, "..");
const backendCwd = path.resolve(frontendCwd, "../backend");
const backendPort = Number(process.env.PORT || 5000);
const backendHealthUrl = `http://127.0.0.1:${backendPort}/api/health`;
const backendLogPath = path.resolve(backendCwd, "backend-dev.log");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isBackendHealthy = async () => {
  try {
    const response = await fetch(backendHealthUrl, {
      headers: {
        Accept: "application/json"
      }
    });

    return response.ok;
  } catch {
    return false;
  }
};

const waitForBackend = async (retries = 30, delayMs = 500) => {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    if (await isBackendHealthy()) {
      return true;
    }

    await sleep(delayMs);
  }

  return false;
};

const readBackendLogTail = (lines = 40) => {
  try {
    const content = fs.readFileSync(backendLogPath, "utf8");
    return content.split("\n").slice(-lines).join("\n").trim();
  } catch {
    return "";
  }
};

let backendProcess = null;
let viteProcess = null;

const cleanup = () => {
  if (viteProcess && !viteProcess.killed) {
    viteProcess.kill("SIGTERM");
  }

  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill("SIGTERM");
  }
};

process.on("SIGINT", () => {
  cleanup();
  process.exit(0);
});

process.on("SIGTERM", () => {
  cleanup();
  process.exit(0);
});

process.on("exit", cleanup);

const start = async () => {
  if (!(await isBackendHealthy())) {
    console.log(`[phishscale] starting backend on ${backendHealthUrl}`);

    fs.writeFileSync(backendLogPath, "", "utf8");
    const logFd = fs.openSync(backendLogPath, "a");

    backendProcess = spawn("npm", ["run", "start"], {
      cwd: backendCwd,
      stdio: ["ignore", logFd, logFd],
      shell: true
    });

    backendProcess.on("exit", (code) => {
      if (code !== 0 && code !== null) {
        console.error(`[phishscale] backend exited with code ${code}. Check ${backendLogPath}`);
      }
    });

    const ready = await waitForBackend();
    if (!ready) {
      console.error(`[phishscale] backend did not become healthy. Check ${backendLogPath}`);
      const logTail = readBackendLogTail();
      if (logTail) {
        console.error("[phishscale] backend log tail:");
        console.error(logTail);
      }
      process.exit(1);
    }

    console.log(`[phishscale] backend ready on port ${backendPort}`);
  } else {
    console.log(`[phishscale] backend already healthy on port ${backendPort}`);
  }

  viteProcess = spawn("npm", ["run", "dev:vite"], {
    cwd: frontendCwd,
    stdio: "inherit",
    shell: true
  });

  viteProcess.on("exit", (code) => {
    cleanup();
    process.exit(code ?? 0);
  });
};

start().catch((error) => {
  console.error("[phishscale] dev launcher failed:", error);
  cleanup();
  process.exit(1);
});
