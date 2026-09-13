"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Copy, Check, Zap, ArrowLeft, BarChart3, CheckCircle2, AlertCircle, Code2, Globe, Shield } from "lucide-react";

export default function InstallPage() {
  const params = useParams();
  const projectId = (params?.projectId as string) || "";
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedReact, setCopiedReact] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<null | { ok: boolean; message: string }>(null);
  const [hostUrl, setHostUrl] = useState("https://open-analytics.vercel.app");
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((r) => {
        setLoadingAuth(false);
        if (r.status === 403) setAccessDenied(true);
      })
      .catch(() => setLoadingAuth(false));
  }, [projectId]);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.host.includes("localhost")) {
      setHostUrl(window.location.origin);
    }
  }, []);

  const scriptTagCode = `<script defer src="${hostUrl}/open.js" data-project-id="${projectId}"></script>`;
  const reactCode = `import OpenAnalyticsTracker from "@/lib/sdk/OpenAnalyticsTracker";

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <OpenAnalyticsTracker projectId="${projectId}" endpoint="${hostUrl}" />
      </head>
      <body>{children}</body>
    </html>
  );
}`;

  const copyScript = () => {
    navigator.clipboard.writeText(scriptTagCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const copyReact = () => {
    navigator.clipboard.writeText(reactCode);
    setCopiedReact(true);
    setTimeout(() => setCopiedReact(false), 2000);
  };

  const sendTestPing = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(`${hostUrl}/api/v1/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pageview",
          projectId,
          pathname: "/test-install-verification",
          title: "Install Verification Ping",
          visitorId: "v_verify_" + Date.now(),
          sessionId: "s_verify_" + Date.now(),
          device: "desktop",
          browser: "Verification Tester",
          os: "Test Environment",
          country: "United States",
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setTestResult({ ok: true, message: "Connection verified! Open Analytics is actively recording data for " + projectId });
      } else {
        setTestResult({ ok: false, message: data.error || "Failed to verify connection." });
      }
    } catch (err: any) {
      setTestResult({ ok: false, message: err.message || "Network error pinging ingestion API." });
    } finally {
      setTesting(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-200 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-xs text-slate-400">Verifying project authorization...</div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-200 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0e1424] border border-rose-500/20 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Access Restricted</h2>
          <p className="text-xs text-slate-400">
            You do not have permission to view installation keys for project <span className="font-mono text-white">{projectId}</span>. You can only view projects within your account.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md hover:from-cyan-400 hover:to-blue-500 transition"
            >
              <ArrowLeft size={14} />
              Return to Your Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-muted hover:bg-card border border-border text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-foreground flex items-center gap-2">
              <Zap size={20} className="text-primary" />
              Install Open Analytics
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Project Identifier: <span className="font-mono text-primary font-bold">{projectId}</span>
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl transition shadow-sm"
        >
          <BarChart3 size={15} />
          View Dashboard
        </Link>
      </div>

      {/* Primary: 1-Line Script Tag */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-2 inline-block">
              Zero-Code Automatic Setup
            </span>
            <h2 className="text-lg font-black text-foreground">
              Add this 1-line script to your website
            </h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              Paste this single tag anywhere inside the <code className="bg-muted px-1.5 py-0.5 rounded text-primary font-mono">&lt;head&gt;</code> of your website or app.
              No npm packages or tracking code required.
            </p>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="relative group bg-muted/70 border border-border rounded-2xl p-4 font-mono text-xs text-foreground overflow-x-auto">
          <pre className="pr-12 text-blue-300">
            {scriptTagCode}
          </pre>
          <button
            onClick={copyScript}
            className="absolute top-3 right-3 p-2 bg-card hover:bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition shadow-sm"
            title="Copy snippet"
          >
            {copiedScript ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>
        </div>

        {/* What gets auto-tracked */}
        <div className="pt-2">
          <span className="text-xs font-bold text-muted-foreground block mb-2">
            What is automatically captured with zero code:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Pageviews & Dwell Time</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Core Web Vitals (RUM)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Hardware & GPU Diagnostics</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Network Connection Profiling</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Scroll Depth & Milestones</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Rage Clicks & Exit Intent</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>360° JS & Resource Errors</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>User Journey Navigation Paths</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>World Atlas Geolocation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Ping Tool */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Globe size={18} className="text-primary" />
          Test & Verify Ingestion
        </h2>
        <p className="text-xs text-muted-foreground">
          Send a live test payload from this browser to verify that the Open Analytics ingestion API is accepting events for <span className="font-mono text-primary font-bold">{projectId}</span>.
        </p>

        <div className="flex items-center gap-4 pt-1">
          <button
            onClick={sendTestPing}
            disabled={testing}
            className="px-5 py-2.5 bg-muted hover:bg-muted/80 border border-border text-foreground font-bold text-xs rounded-xl transition shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {testing ? (
              <>Sending test ping...</>
            ) : (
              <>
                <Zap size={14} className="text-primary" />
                Send Test Ping
              </>
            )}
          </button>

          {testResult && (
            <div className={`flex items-center gap-2 text-xs font-bold ${testResult.ok ? "text-emerald-400" : "text-rose-400"}`}>
              {testResult.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Optional: React / Next.js Component */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Code2 size={18} className="text-purple-400" />
            React & Next.js Component (Optional)
          </h2>
          <span className="text-xs text-muted-foreground">For React / Next.js developers</span>
        </div>

        <p className="text-xs text-muted-foreground">
          If your project is built in Next.js or React, you can also embed the <code className="bg-muted px-1.5 py-0.5 rounded text-purple-300 font-mono">&lt;OpenAnalyticsTracker /&gt;</code> component directly in your root layout:
        </p>

        <div className="relative group bg-muted/70 border border-border rounded-2xl p-4 font-mono text-xs text-foreground overflow-x-auto">
          <pre className="pr-12 text-purple-300">
            {reactCode}
          </pre>
          <button
            onClick={copyReact}
            className="absolute top-3 right-3 p-2 bg-card hover:bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition shadow-sm"
            title="Copy component"
          >
            {copiedReact ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
