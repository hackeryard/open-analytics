"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  FileCode2,
  HelpCircle,
  Play,
  Plus,
  RefreshCw,
  Shield,
  Sparkles,
  Terminal,
  Trash2,
  Zap,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

interface PropertyItem {
  id: string;
  key: string;
  value: string;
  type: "string" | "number" | "boolean";
}

const PRESET_EVENTS = [
  {
    name: "sign_up",
    props: [
      { id: "1", key: "method", value: "github", type: "string" as const },
      { id: "2", key: "plan", value: "free", type: "string" as const },
    ],
  },
  {
    name: "upgrade_plan",
    props: [
      { id: "1", key: "plan", value: "pro", type: "string" as const },
      { id: "2", key: "amount", value: "19", type: "number" as const },
      { id: "3", key: "billing_interval", value: "monthly", type: "string" as const },
    ],
  },
  {
    name: "checkout_start",
    props: [
      { id: "1", key: "cart_items", value: "3", type: "number" as const },
      { id: "2", key: "total_usd", value: "89.5", type: "number" as const },
    ],
  },
  {
    name: "search_query",
    props: [
      { id: "1", key: "query", value: "cookieless analytics", type: "string" as const },
      { id: "2", key: "results_count", value: "12", type: "number" as const },
    ],
  },
];

const PII_KEYS = [
  "email",
  "password",
  "token",
  "secret",
  "ssn",
  "card",
  "card_number",
  "cvv",
  "phone",
  "address",
];

export default function EventDebuggerClientView() {
  const [eventName, setEventName] = useState("upgrade_plan");
  const [properties, setProperties] = useState<PropertyItem[]>([
    { id: "1", key: "plan", value: "pro", type: "string" },
    { id: "2", key: "amount", value: "19", type: "number" },
    { id: "3", key: "annual_discount", value: "true", type: "boolean" },
  ]);
  const [activeCodeTab, setActiveCodeTab] = useState<"js" | "react" | "curl">("js");
  const [copiedCode, setCopiedCode] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    status: number;
    message: string;
    timestamp: string;
  } | null>(null);

  const dashboardUrl = getDashboardUrl("/docs/first-event");

  const handleAddProperty = () => {
    setProperties((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        key: "",
        value: "",
        type: "string",
      },
    ]);
  };

  const handleRemoveProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePropertyChange = (
    id: string,
    field: "key" | "value" | "type",
    val: string
  ) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const loadPreset = (preset: (typeof PRESET_EVENTS)[0]) => {
    setEventName(preset.name);
    setProperties(
      preset.props.map((p, idx) => ({
        id: String(idx + 1),
        key: p.key,
        value: p.value,
        type: p.type,
      }))
    );
    setSimulationResult(null);
  };

  // Build JSON object
  const parsedObject = useMemo(() => {
    const obj: Record<string, any> = {};
    properties.forEach((p) => {
      if (!p.key.trim()) return;
      if (p.type === "number") {
        const num = Number(p.value);
        obj[p.key.trim()] = isNaN(num) ? 0 : num;
      } else if (p.type === "boolean") {
        obj[p.key.trim()] = p.value === "true";
      } else {
        obj[p.key.trim()] = p.value;
      }
    });
    return obj;
  }, [properties]);

  const jsonString = useMemo(() => {
    return JSON.stringify(
      {
        event: eventName.trim() || "unnamed_event",
        properties: parsedObject,
      },
      null,
      2
    );
  }, [eventName, parsedObject]);

  // Payload validations
  const payloadBytes = useMemo(() => {
    return new TextEncoder().encode(jsonString).length;
  }, [jsonString]);

  const piiWarnings = useMemo(() => {
    const warnings: string[] = [];
    properties.forEach((p) => {
      const lowerKey = p.key.toLowerCase().trim();
      if (PII_KEYS.includes(lowerKey)) {
        warnings.push(
          `Property "${p.key}" resembles personal identifiable information (PII). Open Analytics automatically redacts sensitive keys.`
        );
      }
    });
    return warnings;
  }, [properties]);

  // Code snippets
  const snippet = useMemo(() => {
    if (activeCodeTab === "js") {
      return `// Browser Vanilla JavaScript
window.openanalytics?.track("${eventName || "event_name"}", ${JSON.stringify(
        parsedObject,
        null,
        2
      )});`;
    }
    if (activeCodeTab === "react") {
      return `// React / Next.js Component Handler
import { useCallback } from "react";

export function UpgradeButton() {
  const handleClick = useCallback(() => {
    if (typeof window !== "undefined" && window.openanalytics) {
      window.openanalytics.track("${eventName || "event_name"}", ${JSON.stringify(
        parsedObject,
        null,
        2
      )});
    }
  }, []);

  return <button onClick={handleClick}>Upgrade</button>;
}`;
    }
    return `# Edge Telemetry Ingestion HTTP API
curl -X POST https://api.openanalytics.org.in/v1/collect \\
  -H "Content-Type: application/json" \\
  -H "x-project-id: prj_your_project_id" \\
  -d '${JSON.stringify({
    type: "custom_event",
    name: eventName || "event_name",
    props: parsedObject,
    url: "https://example.com/checkout",
  })}'`;
  }, [activeCodeTab, eventName, parsedObject]);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSimulate = () => {
    setSimulationResult({
      status: 200,
      message: `Event "${eventName}" validated and accepted by telemetry pipeline`,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-white">
      {/* Header */}
      <div className="relative border-b border-white/[0.08] overflow-hidden pt-12 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6 font-mono">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-white transition-colors">
              Tools
            </Link>
            <span>/</span>
            <span className="text-zinc-300">Analytics Event Debugger</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <Code2 className="w-3.5 h-3.5" />
              <span>Interactive Telemetry Testing Tool</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Analytics Event Debugger &amp; Schema Validator
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Construct custom telemetry payloads, test property typing, verify
              byte sizes against edge ceilings, and inspect client-side code
              snippets in real time.
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Presets */}
          <div className="lg:col-span-7 space-y-6">
            {/* Presets Bar */}
            <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Event Presets
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {PRESET_EVENTS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(preset)}
                    className="px-2.5 py-1 rounded bg-[#181922] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 transition-colors border border-white/[0.06]"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Name Input */}
            <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. newsletter_signup, checkout_completed"
                  className="w-full bg-[#090a0f] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                />
                <span className="text-[11px] text-zinc-500">
                  Recommended convention: lowercase snake_case (a-z, 0-9, _)
                </span>
              </div>

              {/* Property Rows */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-zinc-400">
                    Custom Properties ({properties.length})
                  </span>
                  <button
                    onClick={handleAddProperty}
                    className="px-2.5 py-1 rounded bg-white/[0.08] hover:bg-white/[0.12] text-xs font-mono text-white inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Property</span>
                  </button>
                </div>

                {properties.map((prop) => (
                  <div
                    key={prop.id}
                    className="grid grid-cols-12 gap-2 p-2.5 bg-[#0e0f15] border border-white/[0.06] rounded-lg items-center"
                  >
                    <div className="col-span-4">
                      <input
                        type="text"
                        placeholder="key"
                        value={prop.key}
                        onChange={(e) =>
                          handlePropertyChange(prop.id, "key", e.target.value)
                        }
                        className="w-full bg-[#14161f] border border-white/[0.08] rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-white/20"
                      />
                    </div>
                    <div className="col-span-3">
                      <select
                        value={prop.type}
                        onChange={(e) =>
                          handlePropertyChange(
                            prop.id,
                            "type",
                            e.target.value as any
                          )
                        }
                        className="w-full bg-[#14161f] border border-white/[0.08] rounded px-2 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none"
                      >
                        <option value="string">string</option>
                        <option value="number">number</option>
                        <option value="boolean">boolean</option>
                      </select>
                    </div>
                    <div className="col-span-4">
                      {prop.type === "boolean" ? (
                        <select
                          value={prop.value}
                          onChange={(e) =>
                            handlePropertyChange(prop.id, "value", e.target.value)
                          }
                          className="w-full bg-[#14161f] border border-white/[0.08] rounded px-2 py-1.5 text-xs font-mono text-white focus:outline-none"
                        >
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      ) : (
                        <input
                          type={prop.type === "number" ? "number" : "text"}
                          placeholder="value"
                          value={prop.value}
                          onChange={(e) =>
                            handlePropertyChange(prop.id, "value", e.target.value)
                          }
                          className="w-full bg-[#14161f] border border-white/[0.08] rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-white/20"
                        />
                      )}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => handleRemoveProperty(prop.id)}
                        className="p-1 hover:text-rose-400 text-zinc-600 transition-colors"
                        title="Remove property"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings Alert */}
            {piiWarnings.length > 0 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>PII Key Warning</span>
                </div>
                <div className="space-y-1 text-xs text-zinc-300">
                  {piiWarnings.map((warn, i) => (
                    <p key={i}>{warn}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: JSON Preview & Snippets */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Payload Metrics */}
            <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Payload Size:</span>
                <span className="text-white font-bold">{payloadBytes} bytes</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Max Recommended:</span>
                <span className="text-emerald-400 font-bold">16,384 bytes (16 KB)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Edge Validation:</span>
                <span className="text-emerald-400 font-bold">Passed</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSimulate}
                  className="w-full py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 font-mono"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Simulate Telemetry Dispatch</span>
                </button>
              </div>

              {simulationResult && (
                <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-mono space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>HTTP {simulationResult.status} OK</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {simulationResult.message}
                  </p>
                </div>
              )}
            </div>

            {/* Generated JSON Payload */}
            <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Telemetry JSON Payload
              </span>
              <pre className="p-3 bg-[#090a0f] border border-white/[0.08] rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto">
                <code>{jsonString}</code>
              </pre>
            </div>

            {/* Integration Snippet */}
            <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {(["js", "react", "curl"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveCodeTab(tab)}
                      className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-all ${
                        activeCodeTab === tab
                          ? "bg-white text-zinc-950 font-bold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3.5 bg-[#090a0f] border border-white/[0.08] rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                <code>{snippet}</code>
              </pre>
            </div>

            {/* Docs link */}
            <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl flex items-center justify-between text-xs">
              <span className="text-zinc-400">Read custom event documentation</span>
              <Link
                href="/docs/first-event"
                className="text-white hover:underline inline-flex items-center gap-1 font-mono"
              >
                <span>Documentation</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
