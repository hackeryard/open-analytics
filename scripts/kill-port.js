#!/usr/bin/env node

import { execSync } from "child_process";

const port = process.argv[2] || 3005;
const isWindows = process.platform === "win32";

console.log(`[kill-port] Inspecting port ${port}...`);

try {
  if (isWindows) {
    // 1. Check for PID on Windows
    const netstatOutput = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] });
    const lines = netstatOutput.trim().split("\n");
    const pids = new Set();

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const stateIndex = parts.indexOf("LISTENING");
      if (stateIndex !== -1 && parts[stateIndex + 1]) {
        pids.add(parts[stateIndex + 1]);
      } else {
        const last = parts[parts.length - 1];
        if (/^\d+$/.test(last) && last !== "0") {
          pids.add(last);
        }
      }
    }

    if (pids.size === 0) {
      console.log(`[kill-port] Port ${port} is already free. No process listening.`);
      process.exit(0);
    }

    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
        console.log(`[kill-port] Successfully terminated process PID ${pid} on port ${port}.`);
      } catch (err) {
        // Fallback to PowerShell Stop-Process
        try {
          execSync(`powershell -Command "Stop-Process -Id ${pid} -Force -ErrorAction SilentlyContinue"`, { stdio: "ignore" });
          console.log(`[kill-port] Terminated process PID ${pid} via PowerShell.`);
        } catch (e) {
          console.warn(`[kill-port] Could not kill PID ${pid}:`, e.message);
        }
      }
    }
  } else {
    // Unix / macOS
    const pid = execSync(`lsof -ti :${port}`, { encoding: "utf8" }).trim();
    if (pid) {
      execSync(`kill -9 ${pid}`);
      console.log(`[kill-port] Killed process PID ${pid} on port ${port}.`);
    } else {
      console.log(`[kill-port] Port ${port} is already free.`);
    }
  }
  console.log(`[kill-port] Port ${port} is now clear.`);
} catch (err) {
  // If netstat findstr exits with code 1, it means no connection was found
  console.log(`[kill-port] Port ${port} is already free.`);
}
