"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

export default function VerificationDocsPage() {
  const { activeProjectId } = usePlatform();
  const [copied, setCopied] = useState(false);
  const projectId = activeProjectId || "open_prj_your_key";

  const curlCommand = `curl -X POST https://open-analytics.vercel.app/api/v1/collect \\\n  -H "Content-Type: application/json" \\\n  -d '{"projectId": "${projectId}", "pathname": "/test-page", "title": "Test Verification", "device": "desktop"}'`;

  const onCopy = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <Terminal size={13} />
          <span>Telemetry Auditing & Diagnostics</span>
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          Testing & Verification Guide
        </h1>
        <p className="text-sm text-muted-foreground">
          Confirm your Open Analytics installation is actively recording events and diagnosing telemetry with these verification steps.
        </p>
      </div>

      <div className="p-6 bg-card border border-border rounded-3xl space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-foreground">1. Browser Network Tab Audit</h2>
        <ol className="space-y-3 text-xs text-muted-foreground list-decimal list-inside leading-relaxed">
          <li>Open your website in Google Chrome, Edge, or Safari.</li>
          <li>Open Developer Tools by pressing <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded">F12</kbd> or <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded">Cmd + Option + I</kbd>.</li>
          <li>Switch to the <strong>Network</strong> tab and filter by <code className="text-cyan-400 font-mono">collect</code> or <code className="text-cyan-400 font-mono">open.js</code>.</li>
          <li>Reload your page. You should see an HTTP 200 request to <code className="text-cyan-400 font-mono">/open.js</code> followed by periodic beacon calls to <code className="text-cyan-400 font-mono">/api/v1/collect</code>.</li>
        </ol>
      </div>

      <div className="p-6 bg-card border border-border rounded-3xl space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-foreground">2. Terminal Ingestion Test (cURL)</h2>
        <p className="text-xs text-muted-foreground">
          You can simulate a client event directly from your terminal using this cURL command:
        </p>
        <div className="relative bg-[#07090e] border border-border rounded-2xl p-4 font-mono text-xs text-slate-200 overflow-x-auto">
          <pre className="pr-12"><code>{curlCommand}</code></pre>
          <button
            onClick={onCopy}
            className="absolute right-3 top-3 p-2 rounded-xl bg-muted/60 hover:bg-muted text-slate-300 hover:text-white transition cursor-pointer"
            title="Copy curl command"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
