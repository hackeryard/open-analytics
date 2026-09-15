"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Zap,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Bot,
  Flame,
  Bug,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

export default function DocsOverviewPage() {
  const { activeProjectId } = usePlatform();
  const [copied, setCopied] = useState(false);
  const projectId = activeProjectId || "open_prj_your_key";
  const snippet = `<script defer src="https://api.openanalytics.org.in/open.js" data-project-id="${projectId}"></script>`;

  const onCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <Zap size={13} />
          <span>Universal 1-Line Web Observability</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Open Analytics Documentation
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Open Analytics is a standalone, enterprise-grade web analytics and observability engine built to capture Real User Monitoring (Core Web Vitals), hardware diagnostics, behavioral UX signals, autonomous AI crawler traffic, and 360° automated error triage with zero framework lock-in.
        </p>
      </div>

      <div className="p-6 bg-card border border-border rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs font-mono">
              1
            </div>
            <h2 className="text-lg font-black text-foreground">1-Minute Universal Quickstart</h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Zero Configuration Required</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Paste this single tag into the <code className="text-cyan-400 font-mono bg-muted/60 px-1 py-0.5 rounded">&lt;head&gt;</code> of any HTML document, Next.js layout, React app, WordPress template, or backend application:
        </p>

        <div className="relative bg-[#07090e] border border-border rounded-2xl p-4 font-mono text-xs text-slate-200 overflow-x-auto">
          <pre className="pr-12"><code>{snippet}</code></pre>
          <button
            onClick={onCopy}
            className="absolute right-3 top-3 p-2 rounded-xl bg-muted/60 hover:bg-muted text-slate-300 hover:text-white transition cursor-pointer"
            title="Copy script tag"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <CheckCircle2 size={14} />
            <span>Pre-filled with active project: {projectId}</span>
          </div>
          <Link
            href="/docs/installation"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>See Next.js, React, Vue & Backend Guides</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
