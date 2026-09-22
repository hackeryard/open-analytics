"use client";

import React, { useState } from "react";
import {
  Code2,
  Copy,
  Check,
  CheckCircle2,
  Zap,
  Terminal,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

export default function InstallationClientView() {
  const { activeProjectId } = usePlatform();
  const [activeTab, setActiveTab] = useState("html");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<null | { ok: boolean; message: string }>(null);
  const [testing, setTesting] = useState(false);

  const projectId = activeProjectId || "open_prj_your_key";
  const host =
    typeof window !== "undefined" &&
    !window.location.host.includes("localhost") &&
    !window.location.host.includes("127.0.0.1")
      ? `https://api.${window.location.host.replace(/^(dashboard\.|api\.|www\.)/i, "")}`
      : "https://api.openanalytics.org.in";

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const frameworks = [
    {
      id: "html",
      label: "HTML / Vanilla JS",
      ext: ".html",
      code: `<!-- Add to <head> -->\n<script defer src="${host}/open.js" data-project-id="${projectId}"></script>`,
      instructions: "Add this script tag inside the <head> section of your HTML template before closing </head>.",
    },
    {
      id: "nextjs_app",
      label: "Next.js (App Router)",
      ext: "app/layout.tsx",
      code: `import Script from "next/script";\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <head>\n        <Script\n          src="${host}/open.js"\n          data-project-id="${projectId}"\n          strategy="afterInteractive"\n        />\n      </head>\n      <body>{children}</body>\n    </html>\n  );\n}`,
      instructions: "In Next.js 13/14/15 App Router, place the Script component inside app/layout.tsx using strategy='afterInteractive'.",
    },
    {
      id: "nextjs_pages",
      label: "Next.js (Pages Router)",
      ext: "pages/_app.tsx",
      code: `import Script from "next/script";\nimport type { AppProps } from "next/app";\n\nexport default function MyApp({ Component, pageProps }: AppProps) {\n  return (\n    <>\n      <Script\n        src="${host}/open.js"\n        data-project-id="${projectId}"\n        strategy="afterInteractive"\n      />\n      <Component {...pageProps} />\n    </>\n  );\n}`,
      instructions: "In Next.js Pages Router, add the Script tag to your custom pages/_app.tsx wrapper.",
    },
    {
      id: "react_vite",
      label: "React (Vite / CRA)",
      ext: "index.html",
      code: `<!-- In your root index.html <head> -->\n<script defer src="${host}/open.js" data-project-id="${projectId}"></script>`,
      instructions: "In Vite or Create React App, simply place the script inside public/index.html or root index.html.",
    },
    {
      id: "vue",
      label: "Vue 3 / Nuxt 3",
      ext: "nuxt.config.ts",
      code: `// Nuxt 3 Configuration\nexport default defineNuxtConfig({\n  app: {\n    head: {\n      script: [\n        {\n          src: "${host}/open.js",\n          "data-project-id": "${projectId}",\n          defer: true\n        }\n      ]\n    }\n  }\n})`,
      instructions: "For Nuxt 3, inject into nuxt.config.ts under app.head.script. For Vite + Vue 3, paste into index.html.",
    },
    {
      id: "svelte",
      label: "SvelteKit",
      ext: "src/app.html",
      code: `<!-- src/app.html -->\n<head>\n  <!-- Open Analytics -->\n  <script defer src="${host}/open.js" data-project-id="${projectId}"></script>\n  %sveltekit.head%\n</head>`,
      instructions: "In SvelteKit, paste directly inside src/app.html inside the <head> block.",
    },
    {
      id: "django",
      label: "Python (Django / Flask)",
      ext: "templates/base.html",
      code: `<!-- templates/base.html -->\n<head>\n  <!-- Open Analytics Observability -->\n  <script defer src="${host}/open.js" data-project-id="${projectId}"></script>\n</head>`,
      instructions: "In Django or Flask, add the script to your base HTML layout template that other templates extend.",
    },
    {
      id: "laravel",
      label: "PHP / Laravel Blade",
      ext: "resources/views/layouts/app.blade.php",
      code: `<!-- resources/views/layouts/app.blade.php -->\n<head>\n  <!-- Open Analytics -->\n  <script defer src="${host}/open.js" data-project-id="${projectId}"></script>\n</head>`,
      instructions: "In Laravel, paste into your layout Blade view (e.g. layouts/app.blade.php) in the <head> tag.",
    },
    {
      id: "wordpress",
      label: "WordPress",
      ext: "functions.php",
      code: `// Add to your active theme's functions.php:\nfunction add_open_analytics() {\n    echo '<script defer src="${host}/open.js" data-project-id="${projectId}"></script>';\n}\nadd_action('wp_head', 'add_open_analytics');`,
      instructions: "Add this hook to your theme's functions.php file, or insert via an 'Insert Headers and Footers' plugin.",
    },
    {
      id: "shopify",
      label: "Shopify",
      ext: "layout/theme.liquid",
      code: `<!-- Inside layout/theme.liquid before </head> -->\n<script defer src="${host}/open.js" data-project-id="${projectId}"></script>`,
      instructions: "In Shopify Admin, go to Online Store > Themes > Edit Code > layout/theme.liquid and paste before </head>.",
    },
  ];

  const currentFw = frameworks.find((f) => f.id === activeTab) || frameworks[0];

  const runTestPing = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/v1/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: projectId,
          pathname: "/docs/installation/test-ping",
          title: "Installation Verification Ping",
          device: "desktop",
          browser: "Documentation Tester",
          os: "System",
          duration: 3,
        }),
      });
      const resData = await res.json();
      if (res.ok && resData.ok) {
        setTestResult({
          ok: true,
          message: `Ping recorded successfully! Project ${projectId} is active and accepting telemetry.`,
        });
      } else {
        setTestResult({ ok: false, message: resData.error || "Failed to verify telemetry ping." });
      }
    } catch (err: any) {
      setTestResult({ ok: false, message: err.message || "Network error reaching ingestion server." });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-300 text-xs font-semibold">
          <Code2 size={13} />
          <span>Multi-Stack Installation Guide</span>
        </div>
        <h1 className="text-3xl font-semibold text-white tracking-tight">
          Install Open Analytics Tracking Code
        </h1>
        <p className="text-sm text-zinc-400">
          Open Analytics works across any modern web framework, static site, or backend stack with a single non-blocking script tag.
        </p>
      </div>

      <div className="flex items-center gap-1.5 p-1 bg-[#111218] border border-white/[0.08] rounded-xl overflow-x-auto no-scrollbar shadow-xs">
        {frameworks.map((fw) => (
          <button
            key={fw.id}
            onClick={() => setActiveTab(fw.id)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 whitespace-nowrap cursor-pointer ${
              activeTab === fw.id
                ? "bg-white text-zinc-950 shadow-xs"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            {fw.label}
          </button>
        ))}
      </div>

      <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-4 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-semibold text-white">{currentFw.label} Setup</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Target file:{" "}
              <code className="font-mono text-zinc-300 bg-[#181922] px-1 py-0.5 rounded border border-white/[0.06]">
                {currentFw.ext}
              </code>
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-[#181922] text-zinc-300 border border-white/[0.08] text-[11px] font-mono">
            Project: {projectId}
          </span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          {currentFw.instructions}
        </p>

        <div className="relative bg-[#090a0f] border border-white/[0.08] rounded-xl p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
          <pre className="pr-12"><code>{currentFw.code}</code></pre>
          <button
            onClick={() => handleCopy(currentFw.id, currentFw.code)}
            className="absolute right-3 top-3 p-2 rounded-lg bg-[#111218] hover:bg-white/[0.06] border border-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Copy code"
          >
            {copiedId === currentFw.id ? (
              <Check size={14} className="text-emerald-400" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>
      </div>

      <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-4 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Terminal size={16} className="text-zinc-300" />
              Verify Installation &amp; Send Test Ping
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Send a simulated heartbeat to test if your project ID is authorized and receiving telemetry.
            </p>
          </div>
          <button
            onClick={runTestPing}
            disabled={testing}
            className="px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-200 font-medium text-xs rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {testing ? (
              <div className="w-3.5 h-3.5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
            ) : (
              <Zap size={13} />
            )}
            <span>Send Test Telemetry Ping</span>
          </button>
        </div>

        {testResult && (
          <div
            className={`p-3.5 rounded-lg border text-xs flex items-center gap-2.5 animate-fadeIn ${
              testResult.ok
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            }`}
          >
            {testResult.ok ? <CheckCircle2 size={16} /> : <Terminal size={16} />}
            <span>{testResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
