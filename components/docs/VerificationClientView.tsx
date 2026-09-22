"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

export default function VerificationClientView() {
  const { activeProjectId } = usePlatform();
  const [copied, setCopied] = useState(false);
  const projectId = activeProjectId || "open_prj_your_key";

  const curlCommand = `curl -X POST https://api.openanalytics.org.in/v1/collect \\\n  -H "Content-Type: application/json" \\\n  -d '{"projectId": "${projectId}", "pathname": "/test-page", "title": "Test Verification", "device": "desktop"}'`;

  const onCopy = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-300 text-xs font-semibold">
          <Terminal size={13} />
          <span>Telemetry Auditing &amp; Diagnostics</span>
        </div>
        <h1 className="text-3xl font-semibold text-white tracking-tight">
          Testing &amp; Verification Guide
        </h1>
        <p className="text-sm text-zinc-400">
          Confirm your Open Analytics installation is actively recording events and diagnosing telemetry with these verification steps.
        </p>
      </div>

      <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-4 shadow-xs">
        <h2 className="text-base font-semibold text-white">1. Browser Network Tab Audit</h2>
        <ol className="space-y-3 text-xs text-zinc-400 list-decimal list-inside leading-relaxed">
          <li>Open your website in Google Chrome, Edge, or Safari.</li>
          <li>
            Open Developer Tools by pressing{" "}
            <kbd className="font-mono bg-[#181922] text-zinc-300 px-1.5 py-0.5 rounded border border-white/[0.06]">
              F12
            </kbd>{" "}
            or{" "}
            <kbd className="font-mono bg-[#181922] text-zinc-300 px-1.5 py-0.5 rounded border border-white/[0.06]">
              Cmd + Option + I
            </kbd>
            .
          </li>
          <li>
            Switch to the <strong className="text-white">Network</strong> tab and filter by{" "}
            <code className="text-zinc-200 font-mono bg-[#181922] px-1 py-0.5 rounded">collect</code>{" "}
            or{" "}
            <code className="text-zinc-200 font-mono bg-[#181922] px-1 py-0.5 rounded">open.js</code>
            .
          </li>
          <li>
            Reload your page. You should see an HTTP 200 request to{" "}
            <code className="text-zinc-200 font-mono bg-[#181922] px-1 py-0.5 rounded">/open.js</code>{" "}
            followed by periodic beacon calls to{" "}
            <code className="text-zinc-200 font-mono bg-[#181922] px-1 py-0.5 rounded">
              /v1/collect
            </code>
            .
          </li>
        </ol>
      </div>

      <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-4 shadow-xs">
        <h2 className="text-base font-semibold text-white">2. Terminal Ingestion Test (cURL)</h2>
        <p className="text-xs text-zinc-400">
          You can simulate a client event directly from your terminal using this cURL command:
        </p>
        <div className="relative bg-[#090a0f] border border-white/[0.08] rounded-xl p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
          <pre className="pr-12"><code>{curlCommand}</code></pre>
          <button
            onClick={onCopy}
            className="absolute right-3 top-3 p-2 rounded-lg bg-[#111218] hover:bg-white/[0.06] border border-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Copy curl command"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
