"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Copy,
  Check,
  Zap,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Code2,
  Globe,
  Shield,
  Layers,
  Terminal,
  Send,
  BookOpen,
  Settings,
  Flame,
  Activity,
  UserCheck,
  Compass,
  Laptop,
  Radio,
  FileCode,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";

type FrameworkTab = "html" | "next_app" | "next_pages" | "react_vite" | "nuxt" | "sveltekit" | "remix" | "astro";
type SdkTab = "events" | "identify" | "errors" | "notfound" | "page";

export default function InstallPage() {
  const params = useParams();
  const projectId = (params?.projectId as string) || "";
  
  const [activeTab, setActiveTab] = useState<FrameworkTab>("html");
  const [activeSdkTab, setActiveSdkTab] = useState<SdkTab>("events");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedProjectId, setCopiedProjectId] = useState(false);
  
  const [testingType, setTestingType] = useState<"pageview" | "event" | "error" | null>(null);
  const [testResult, setTestResult] = useState<null | { ok: boolean; status: number; duration: number; message: string; payload?: any }>(null);
  
  // Default to production deployment URL in snippets
  const [hostUrl, setHostUrl] = useState("https://open-analytics.vercel.app");
  const [localOrigin, setLocalOrigin] = useState("");
  const [isCustomHost, setIsCustomHost] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then(async (r) => {
        setLoadingAuth(false);
        if (r.status === 403 || r.status === 401) {
          setAccessDenied(true);
        } else if (r.ok) {
          const data = await r.json();
          if (data?.project?.name) {
            setProjectName(data.project.name);
          }
        }
      })
      .catch(() => setLoadingAuth(false));
  }, [projectId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      setLocalOrigin(origin);
      // If deployed on a real production domain, automatically use that domain
      if (!window.location.host.includes("localhost") && !window.location.host.includes("127.0.0.1")) {
        setHostUrl(origin);
      }
    }
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyProjectId = () => {
    navigator.clipboard.writeText(projectId);
    setCopiedProjectId(true);
    setTimeout(() => setCopiedProjectId(false), 2000);
  };

  const formattedHost = hostUrl.replace(/\/$/, "");

  // Code snippets for various frameworks
  const snippets: Record<FrameworkTab, { title: string; filename: string; description: string; code: string }> = {
    html: {
      title: "HTML5 / Plain JavaScript",
      filename: "index.html",
      description: "Insert this single script tag into the <head> or right before the closing </body> tag of your website.",
      code: `<!-- Open Analytics Tracking Script -->
<script
  defer
  src="${formattedHost}/open.js"
  data-project-id="${projectId}">
</script>`,
    },
    next_app: {
      title: "Next.js 13/14/15 (App Router)",
      filename: "app/layout.tsx",
      description: "Embed the tracking script inside your Root Layout using Next.js optimized Script component.",
      code: `import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="${formattedHost}/open.js"
          strategy="afterInteractive"
          data-project-id="${projectId}"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}`,
    },
    next_pages: {
      title: "Next.js (Pages Router)",
      filename: "pages/_app.tsx",
      description: "Add the tracking script with next/script inside your global custom _app.tsx.",
      code: `import type { AppProps } from "next/app";
import Script from "next/script";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src="${formattedHost}/open.js"
        strategy="afterInteractive"
        data-project-id="${projectId}"
      />
      <Component {...pageProps} />
    </>
  );
}`,
    },
    react_vite: {
      title: "React (Vite / CRA)",
      filename: "index.html",
      description: "Paste the script inside index.html in the root or public directory of your Vite or Create React App project.",
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My React App</title>
    
    <!-- Open Analytics -->
    <script
      defer
      src="${formattedHost}/open.js"
      data-project-id="${projectId}">
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    },
    nuxt: {
      title: "Nuxt 3 / Vue.js",
      filename: "nuxt.config.ts",
      description: "Register the script in your global head configuration in nuxt.config.ts.",
      code: `export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          src: "${formattedHost}/open.js",
          defer: true,
          "data-project-id": "${projectId}"
        }
      ]
    }
  }
});`,
    },
    sveltekit: {
      title: "SvelteKit",
      filename: "src/app.html",
      description: "Add the script tag to your root HTML template in src/app.html.",
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
    
    <!-- Open Analytics -->
    <script
      defer
      src="${formattedHost}/open.js"
      data-project-id="${projectId}">
    </script>
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>`,
    },
    remix: {
      title: "Remix",
      filename: "app/root.tsx",
      description: "Add the script tag inside the Head element of your root Remix layout.",
      code: `import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
        <script
          defer
          src="${formattedHost}/open.js"
          data-project-id="${projectId}"
        />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}`,
    },
    astro: {
      title: "Astro",
      filename: "src/layouts/Layout.astro",
      description: "Insert the tracking script into your base Astro layout template.",
      code: `---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    
    <!-- Open Analytics -->
    <script
      is:inline
      defer
      src="${formattedHost}/open.js"
      data-project-id="${projectId}">
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>`,
    },
  };

  // SDK Reference Snippets
  const sdkSnippets: Record<SdkTab, { title: string; subtitle: string; code: string; note: string }> = {
    events: {
      title: "Custom Business Events",
      subtitle: "Track conversions, signups, upgrades, purchases, and custom user actions.",
      code: `// Record custom conversions and telemetry anywhere in your client application
if (typeof window !== "undefined" && window.OpenAnalytics) {
  window.OpenAnalytics.track("plan_upgraded", {
    plan: "enterprise",
    billingCycle: "annual",
    seats: 25,
    currency: "USD"
  }, 499.00);
}`,
      note: "The third parameter (value) is optional and represents numeric monetary value or score for revenue attribution.",
    },
    identify: {
      title: "User Identification",
      subtitle: "Bind persistent user accounts, emails, and custom traits to visitor sessions.",
      code: `// Identify the user upon login or profile update
if (typeof window !== "undefined" && window.OpenAnalytics) {
  window.OpenAnalytics.identify("usr_984721", {
    name: "Sarah Connor",
    email: "sarah@cyberdyne.io",
    organization: "Resistance HQ",
    role: "Team Lead"
  });
}`,
      note: "All future pageviews, events, and errors in this browser will be linked to this user identity.",
    },
    errors: {
      title: "Manual Error & Crash Capture",
      subtitle: "Send handled exceptions, network failures, or React Error Boundary catches.",
      code: `// Capture manual exceptions in try/catch blocks or React Error Boundaries
try {
  await checkoutPaymentGateway(payload);
} catch (error) {
  if (typeof window !== "undefined" && window.OpenAnalytics) {
    window.OpenAnalytics.captureError(error, {
      component: "CheckoutModal",
      step: "stripe_token_exchange",
      cartTotal: 129.99
    });
  }
}`,
      note: "Automatically captures stack traces, browser environment, route pathname, and action breadcrumbs.",
    },
    notfound: {
      title: "Track 404 & Broken Links",
      subtitle: "Record missing routes, broken outbound links, and 404 occurrences.",
      code: `// Place inside your Next.js not-found.tsx or custom 404 error page
if (typeof window !== "undefined" && window.OpenAnalytics) {
  window.OpenAnalytics.track404(
    window.location.pathname,
    document.referrer || undefined
  );
}`,
      note: "Allows your team to identify broken inbound links, missing assets, and typos across your site.",
    },
    page: {
      title: "Single Page App Page Transitions",
      subtitle: "Trigger manual pageview events for custom routers or micro-frontends.",
      code: `// Manually trigger a pageview for custom routing architectures
if (typeof window !== "undefined" && window.OpenAnalytics) {
  window.OpenAnalytics.page("/dashboard/custom-view");
}`,
      note: "Note: The open.js tracker automatically listens to History API (pushState/replaceState) and popstate events without manual intervention.",
    },
  };

  const runDiagnosticPing = async (type: "pageview" | "event" | "error") => {
    setTestingType(type);
    setTestResult(null);
    const startTime = performance.now();

    try {
      let res: Response;
      let payloadSent: any = {};

      if (type === "pageview") {
        payloadSent = {
          type: "pageview",
          projectId,
          pathname: "/diagnostic-verification-ping",
          title: "Diagnostic Verification Test",
          visitorId: "v_verify_" + Math.random().toString(36).substring(2, 9),
          sessionId: "s_verify_" + Math.random().toString(36).substring(2, 9),
          device: "desktop",
          browser: "Diagnostic Tester",
          os: "Test Environment",
          country: "United States",
        };
        res = await fetch("/api/v1/collect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadSent),
        });
      } else if (type === "event") {
        payloadSent = {
          projectId,
          eventName: "verification_test_ping",
          properties: { verifiedAt: new Date().toISOString(), source: "installation_tester" },
          value: 10,
          visitorId: "v_verify_" + Math.random().toString(36).substring(2, 9),
          sessionId: "s_verify_" + Math.random().toString(36).substring(2, 9),
          pathname: "/diagnostic-verification-ping",
        };
        res = await fetch("/api/v1/collect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "event", ...payloadSent }),
        });
      } else {
        payloadSent = {
          projectId,
          message: "VerificationSimulationError: Diagnostic test crash signal",
          stack: "VerificationSimulationError: Diagnostic test crash signal\\n    at runDiagnosticPing (install/page.tsx:320)",
          errorType: "VerificationSimulationError",
          pathname: "/diagnostic-verification-ping",
          visitorId: "v_verify_" + Math.random().toString(36).substring(2, 9),
          sessionId: "s_verify_" + Math.random().toString(36).substring(2, 9),
        };
        res = await fetch("/api/v1/error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadSent),
        });
      }

      const duration = Math.round(performance.now() - startTime);
      const data = await res.json();

      if (res.ok && (data.ok || data.success || data.status === "success" || data.id)) {
        setTestResult({
          ok: true,
          status: res.status,
          duration,
          message: `Ingestion verified! Open Analytics successfully recorded ${type} telemetry for project ${projectId}.`,
          payload: data,
        });
      } else {
        setTestResult({
          ok: false,
          status: res.status,
          duration,
          message: data.error || data.message || "Failed to ingest diagnostic telemetry.",
          payload: data,
        });
      }
    } catch (err: any) {
      const duration = Math.round(performance.now() - startTime);
      setTestResult({
        ok: false,
        status: 0,
        duration,
        message: err.message || "Network error while connecting to Open Analytics ingestion API.",
      });
    } finally {
      setTestingType(null);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="text-xs text-muted-foreground font-mono">Verifying project authorization...</div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-card border border-rose-500/20 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-black text-foreground">Access Restricted</h2>
          <p className="text-xs text-muted-foreground">
            You do not have permission to view installation keys for project <span className="font-mono text-foreground font-bold">{projectId}</span>.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition"
            >
              <ArrowLeft size={14} />
              Return to Workspace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* ── Top Navigation & Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-2xl bg-card hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition shadow-xs"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Zap size={22} className="text-primary" />
                Installation &amp; SDK Guide
              </h1>
              {projectName && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold">
                  {projectName}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">Project ID:</span>
              <button
                onClick={copyProjectId}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-muted border border-border text-xs font-mono font-bold text-primary hover:bg-muted/80 transition"
                title="Click to copy Project ID"
              >
                <span>{projectId}</span>
                {copiedProjectId ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/projects/${projectId}/settings`}
            className="flex items-center gap-2 px-3.5 py-2 bg-card hover:bg-muted border border-border text-foreground text-xs font-bold rounded-xl transition shadow-xs"
          >
            <Settings size={14} className="text-muted-foreground" />
            Project Settings
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl transition shadow-xs"
          >
            <BarChart3 size={15} />
            Live Dashboard
          </Link>
        </div>
      </div>

      {/* ── Security & CORS Whitelist Reminder ── */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0 mt-0.5">
              <Shield size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                Allowed Origins &amp; CORS Domain Security
              </h3>
              <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                By default, your project accepts events from any origin (<code className="px-1.5 py-0.2 rounded bg-muted text-primary font-mono text-[11px]">*</code>).
                To restrict telemetry collection strictly to your production domains (e.g. <code className="px-1.5 py-0.2 rounded bg-muted text-primary font-mono text-[11px]">app.yourdomain.com</code>), configure Allowed Domains in Project Settings.
              </p>
            </div>
          </div>
          <Link
            href={`/projects/${projectId}/settings`}
            className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 border border-border text-foreground text-xs font-bold transition shrink-0 inline-flex items-center gap-1.5"
          >
            Configure Domains
          </Link>
        </div>
      </div>

      {/* ── Framework Quickstart Tabs ── */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider mb-1.5">
              <Sparkles size={12} />
              Zero-Dependency Integration
            </div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">
              Choose Your Platform or Framework
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Copy and paste the snippet into your project. Open Analytics automatically tracks pageviews, Core Web Vitals, hardware, UX signals, and crashes.
            </p>
          </div>
        </div>

        {/* Host Endpoint Configuration Bar */}
        <div className="p-4 bg-muted/40 border border-border/70 rounded-2xl space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-primary" />
              <label className="text-xs font-bold text-foreground">
                Hosted Script Domain / CDN URL:
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHostUrl("https://open-analytics.vercel.app")}
                className="px-2.5 py-1 rounded-lg bg-card hover:bg-muted border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground transition"
              >
                Use Production URL (open-analytics.vercel.app)
              </button>
              {localOrigin && (
                <button
                  type="button"
                  onClick={() => setHostUrl(localOrigin)}
                  className="px-2.5 py-1 rounded-lg bg-card hover:bg-muted border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground transition"
                >
                  Use Current Server URL
                </button>
              )}
            </div>
          </div>
          <input
            type="text"
            value={hostUrl}
            onChange={(e) => {
              setHostUrl(e.target.value);
              setIsCustomHost(true);
            }}
            placeholder="https://open-analytics.vercel.app"
            className="w-full px-3.5 py-2 rounded-xl bg-background border border-border font-mono text-xs text-primary focus:outline-none focus:border-primary shadow-2xs"
          />
          <p className="text-[11px] text-muted-foreground">
            The snippets below will automatically update with this domain. Replace with your hosted Open Analytics domain.
          </p>
        </div>

        {/* Framework Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none border-b border-border/60">
          {(
            [
              { id: "html", label: "HTML5 / Vanilla JS", icon: Code2 },
              { id: "next_app", label: "Next.js (App Router)", icon: Zap },
              { id: "next_pages", label: "Next.js (Pages Router)", icon: Layers },
              { id: "react_vite", label: "React (Vite / CRA)", icon: Laptop },
              { id: "nuxt", label: "Nuxt 3 / Vue", icon: Compass },
              { id: "sveltekit", label: "SvelteKit", icon: Flame },
              { id: "remix", label: "Remix", icon: Radio },
              { id: "astro", label: "Astro", icon: Sparkles },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Code Snippet Box */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode size={16} className="text-primary" />
              <span className="text-xs font-mono font-bold text-foreground">
                {snippets[activeTab].filename}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground hidden sm:inline-block">
              {snippets[activeTab].description}
            </span>
          </div>

          <div className="relative group bg-muted/80 border border-border rounded-2xl p-4 sm:p-5 font-mono text-xs overflow-x-auto">
            <pre className="text-primary-foreground dark:text-cyan-200 pr-12 leading-relaxed">
              {snippets[activeTab].code}
            </pre>
            <button
              onClick={() => copyToClipboard(snippets[activeTab].code, `tab_${activeTab}`)}
              className="absolute top-3 right-3 p-2 bg-card hover:bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition shadow-xs"
              title="Copy snippet"
            >
              {copiedKey === `tab_${activeTab}` ? (
                <Check size={16} className="text-emerald-500" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
        </div>

        {/* What gets auto-tracked */}
        <div className="pt-2 border-t border-border/60">
          <span className="text-xs font-bold text-foreground block mb-3">
            Automatic Observability &amp; Telemetry Signals:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Pageviews &amp; Dwell Times</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Core Web Vitals (RUM)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Hardware &amp; GPU Diagnostics</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Network Type (4G/5G/WiFi)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Vertical Scroll Milestones</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Rage Clicks &amp; Exit Intent</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Runtime JS Crash Triage</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>User Journey Flows</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── JavaScript SDK Reference (window.OpenAnalytics) ── */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-wider mb-1.5">
              <Terminal size={12} />
              Client SDK API
            </div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">
              JavaScript SDK Reference (<code className="font-mono text-primary">window.OpenAnalytics</code>)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Use programmatic methods to record business conversions, identify users, log custom errors, and monitor not-found pages.
            </p>
          </div>
        </div>

        {/* SDK Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none border-b border-border/60">
          {(
            [
              { id: "events", label: "1. Custom Events (.track)", icon: Activity },
              { id: "identify", label: "2. User Identify (.identify)", icon: UserCheck },
              { id: "errors", label: "3. Error Capture (.captureError)", icon: AlertCircle },
              { id: "notfound", label: "4. 404 Pages (.track404)", icon: Compass },
              { id: "page", label: "5. SPA Routing (.page)", icon: Layers },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeSdkTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSdkTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SDK Active Tab View */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground">
              {sdkSnippets[activeSdkTab].title}
            </h4>
            <p className="text-xs text-muted-foreground">
              {sdkSnippets[activeSdkTab].subtitle}
            </p>
          </div>

          <div className="relative group bg-muted/80 border border-border rounded-2xl p-4 sm:p-5 font-mono text-xs overflow-x-auto">
            <pre className="text-blue-300 dark:text-cyan-200 pr-12 leading-relaxed">
              {sdkSnippets[activeSdkTab].code}
            </pre>
            <button
              onClick={() => copyToClipboard(sdkSnippets[activeSdkTab].code, `sdk_${activeSdkTab}`)}
              className="absolute top-3 right-3 p-2 bg-card hover:bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition shadow-xs"
              title="Copy SDK snippet"
            >
              {copiedKey === `sdk_${activeSdkTab}` ? (
                <Check size={16} className="text-emerald-500" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>

          <div className="p-3 bg-muted/40 border border-border/50 rounded-xl text-xs text-muted-foreground">
            <span className="font-bold text-foreground mr-1.5">Note:</span>
            {sdkSnippets[activeSdkTab].note}
          </div>
        </div>
      </div>

      {/* ── Live Ingestion Diagnostic & Verification Tester ── */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-[10px] font-black uppercase tracking-wider mb-1.5">
              <Globe size={12} />
              Live Ingestion Diagnostic
            </div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">
              Test &amp; Verify Telemetry Pipeline
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Send a test telemetry signal directly from this browser to verify backend ingestion for <span className="font-mono text-primary font-bold">{projectId}</span>.
            </p>
          </div>
        </div>

        {/* Trigger Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => runDiagnosticPing("pageview")}
            disabled={testingType !== null}
            className="flex items-center justify-center gap-2 p-3.5 bg-muted hover:bg-muted/80 border border-border rounded-2xl text-foreground font-bold text-xs transition shadow-xs disabled:opacity-50"
          >
            {testingType === "pageview" ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Zap size={15} className="text-primary" />
            )}
            <span>Send Test Pageview</span>
          </button>

          <button
            onClick={() => runDiagnosticPing("event")}
            disabled={testingType !== null}
            className="flex items-center justify-center gap-2 p-3.5 bg-muted hover:bg-muted/80 border border-border rounded-2xl text-foreground font-bold text-xs transition shadow-xs disabled:opacity-50"
          >
            {testingType === "event" ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Activity size={15} className="text-blue-500" />
            )}
            <span>Send Custom Event</span>
          </button>

          <button
            onClick={() => runDiagnosticPing("error")}
            disabled={testingType !== null}
            className="flex items-center justify-center gap-2 p-3.5 bg-muted hover:bg-muted/80 border border-border rounded-2xl text-foreground font-bold text-xs transition shadow-xs disabled:opacity-50"
          >
            {testingType === "error" ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <AlertCircle size={15} className="text-rose-500" />
            )}
            <span>Send Test Error Crash</span>
          </button>
        </div>

        {/* Diagnostic Response Output */}
        {testResult && (
          <div
            className={`p-4 rounded-2xl border ${
              testResult.ok
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
            } space-y-2`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                {testResult.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{testResult.message}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] opacity-80">
                <span>HTTP {testResult.status}</span>
                <span>•</span>
                <span>{testResult.duration}ms</span>
              </div>
            </div>

            {testResult.payload && (
              <pre className="mt-2 p-3 bg-card/70 border border-border rounded-xl font-mono text-[11px] text-foreground overflow-x-auto">
                {JSON.stringify(testResult.payload, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* ── React SDK Helper Component ── */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Code2 size={18} className="text-primary" />
            React SDK Component Helper
          </h2>
          <span className="text-xs text-muted-foreground">Available at <code className="font-mono text-primary">lib/sdk/OpenAnalyticsTracker.tsx</code></span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          For Next.js App Router projects, you can import the provided helper component directly—only <code className="font-mono text-primary">projectId</code> is required:
        </p>

        <div className="relative group bg-muted/80 border border-border rounded-2xl p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-primary-foreground dark:text-cyan-200 pr-12 leading-relaxed">
{`import OpenAnalyticsTracker from "@/lib/sdk/OpenAnalyticsTracker";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <OpenAnalyticsTracker projectId="${projectId}" />
      </head>
      <body>{children}</body>
    </html>
  );
}`}
          </pre>
          <button
            onClick={() =>
              copyToClipboard(
                `import OpenAnalyticsTracker from "@/lib/sdk/OpenAnalyticsTracker";\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <head>\n        <OpenAnalyticsTracker projectId="${projectId}" />\n      </head>\n      <body>{children}</body>\n    </html>\n  );\n}`,
                "react_helper"
              )
            }
            className="absolute top-3 right-3 p-2 bg-card hover:bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition shadow-xs"
            title="Copy component snippet"
          >
            {copiedKey === "react_helper" ? (
              <Check size={16} className="text-emerald-500" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
