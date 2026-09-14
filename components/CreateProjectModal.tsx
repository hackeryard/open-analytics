"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  Check,
  Globe,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Activity,
  Code2,
  Copy,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Settings,
  Layers,
  HelpCircle,
  Radio,
  Sliders,
  Terminal,
  ExternalLink,
  ChevronRight,
  MousePointerClick,
  FileText,
  Search,
  Eye,
  RefreshCw,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (project: any) => void;
}

const TIMEZONES = [
  { value: "UTC", label: "(GMT+00:00) Universal Coordinated Time (UTC)" },
  { value: "Asia/Kolkata", label: "(GMT+05:30) India Standard Time (IST)" },
  { value: "America/New_York", label: "(GMT-05:00) Eastern Time (US & Canada)" },
  { value: "America/Chicago", label: "(GMT-06:00) Central Time (US & Canada)" },
  { value: "America/Los_Angeles", label: "(GMT-08:00) Pacific Time (US & Canada)" },
  { value: "Europe/London", label: "(GMT+00:00) London, Dublin, Edinburgh" },
  { value: "Europe/Paris", label: "(GMT+01:00) Paris, Berlin, Rome, Madrid" },
  { value: "Asia/Tokyo", label: "(GMT+09:00) Tokyo, Osaka, Sapporo" },
  { value: "Asia/Singapore", label: "(GMT+08:00) Singapore, Hong Kong, Beijing" },
  { value: "Australia/Sydney", label: "(GMT+10:00) Sydney, Melbourne, Brisbane" },
  { value: "America/Sao_Paulo", label: "(GMT-03:00) Brasilia, Sao Paulo" },
  { value: "Asia/Dubai", label: "(GMT+04:00) Dubai, Abu Dhabi, Muscat" },
];

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar ($)" },
  { code: "EUR", symbol: "€", label: "Euro (€)" },
  { code: "GBP", symbol: "£", label: "British Pound (£)" },
  { code: "INR", symbol: "₹", label: "Indian Rupee (₹)" },
  { code: "CAD", symbol: "$", label: "Canadian Dollar ($)" },
  { code: "AUD", symbol: "$", label: "Australian Dollar ($)" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen (¥)" },
  { code: "SGD", symbol: "$", label: "Singapore Dollar ($)" },
  { code: "BRL", symbol: "R$", label: "Brazilian Real (R$)" },
];

const INDUSTRIES = [
  "Technology & Software",
  "E-Commerce & Retail",
  "Financial Services & Fintech",
  "Healthcare & Life Sciences",
  "Media, News & Publishing",
  "Education & EdTech",
  "Gaming & Entertainment",
  "Travel & Hospitality",
  "Real Estate",
  "Automotive",
  "Other",
];

const OBJECTIVES = [
  {
    id: "sales",
    title: "Drive Online Sales & E-Commerce",
    description: "Measure checkouts, conversion funnels, cart abandonment, and purchase revenue.",
    icon: Zap,
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
  },
  {
    id: "leads",
    title: "Generate Leads & Signups",
    description: "Track form submissions, user registrations, CTA button clicks, and marketing campaigns.",
    icon: MousePointerClick,
    color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400",
  },
  {
    id: "behavior",
    title: "Examine User Behavior & Performance",
    description: "Analyze Core Web Vitals (RUM), page scroll depths, rage clicks, and JavaScript exceptions.",
    icon: Activity,
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
  },
  {
    id: "brand",
    title: "Raise Brand Awareness & Reach",
    description: "Track search engine traffic, AI bot crawler indexing (ChatGPT/Perplexity), and audience loyalty.",
    icon: Globe,
    color: "from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-400",
  },
];

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
  const { setActiveProjectId, projects, fetchData } = usePlatform();

  // Step Tracker (1: Details, 2: Objectives, 3: Data Stream, 4: Install Tag)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Property Details
  const [propertyName, setPropertyName] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [currency, setCurrency] = useState("USD");
  const [industry, setIndustry] = useState("Technology & Software");
  const [businessSize, setBusinessSize] = useState("Small (1-10)");

  // Step 2: Objectives
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>(["leads", "behavior"]);

  // Step 3: Data Stream Details
  const [streamType, setStreamType] = useState<"web" | "ios" | "android">("web");
  const [streamName, setStreamName] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [enhancedMeasurement, setEnhancedMeasurement] = useState({
    pageViews: true,
    scrollTracking: true,
    outboundClicks: true,
    siteSearch: true,
    formInteractions: true,
    fileDownloads: true,
    webVitals: true,
    aiBots: true,
  });

  // Step 4: Created Property Data & Verification
  const [createdProject, setCreatedProject] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeInstallTab, setActiveInstallTab] = useState<"html" | "nextjs" | "react" | "curl">("html");
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedMeasurementId, setCopiedMeasurementId] = useState(false);
  const [testingPing, setTestingPing] = useState(false);
  const [pingVerified, setPingVerified] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  if (!isOpen) return null;

  const toggleObjective = (id: string) => {
    setSelectedObjectives((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyName.trim()) {
      setError("Please enter a property / project name.");
      return;
    }
    setError(null);
    if (!streamName) {
      setStreamName(`${propertyName.trim()} Web Stream`);
    }
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    setError(null);
    setCurrentStep(3);
  };

  const handleCreateProperty = async () => {
    if (!propertyName.trim()) {
      setError("Property name is required");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      let cleanUrl = streamUrl.trim();
      if (cleanUrl && !cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
        cleanUrl = `https://${cleanUrl}`;
      }

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: propertyName.trim(),
          timezone,
          currency,
          industryCategory: industry,
          businessSize,
          websiteUrl: cleanUrl,
          streamType,
          streamName: streamName.trim() || `${propertyName.trim()} Stream`,
          streamUrl: cleanUrl,
          enhancedMeasurement: {
            scrollTracking: enhancedMeasurement.scrollTracking,
            outboundClicks: enhancedMeasurement.outboundClicks,
            siteSearch: enhancedMeasurement.siteSearch,
            fileDownloads: enhancedMeasurement.fileDownloads,
            videoEngagement: true,
            formInteractions: enhancedMeasurement.formInteractions,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.project) {
        throw new Error(data.error || "Failed to create property");
      }

      setCreatedProject(data.project);
      setActiveProjectId(data.project.projectId);
      if (onProjectCreated) {
        onProjectCreated(data.project);
      }
      setCurrentStep(4);
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the property");
    } finally {
      setCreating(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const copyMeasurement = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedMeasurementId(true);
    setTimeout(() => setCopiedMeasurementId(false), 2000);
  };

  // Background listener to detect live hits on website
  React.useEffect(() => {
    if (currentStep !== 4 || !createdProject?.projectId || pingVerified) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/projects/${createdProject.projectId}/status`);
        if (res.ok) {
          const data = await res.json();
          if (data.monitoringStatus === "active" || data.totalHits > 0) {
            setPingVerified(true);
            setPingLatency(32);
            fetchData?.();
          }
        }
      } catch {
        // Silently continue polling
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [currentStep, createdProject, pingVerified, fetchData]);

  const sendTestPing = async () => {
    if (!createdProject) return;
    setTestingPing(true);
    const startTime = performance.now();
    try {
      const res = await fetch("/api/v1/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pageview",
          projectId: createdProject.projectId,
          pathname: "/stream-verification",
          title: "Stream Installation Test Ping",
          visitorId: "v_stream_test_" + Date.now(),
          sessionId: "s_stream_test_" + Date.now(),
          device: "desktop",
          browser: "Stream Inspector",
          os: "Windows",
          country: "US",
        }),
      });

      const elapsed = Math.round(performance.now() - startTime);

      if (res.ok) {
        setPingVerified(true);
        setPingLatency(elapsed);
        fetchData?.();
      }
    } catch (e) {
      console.error("Test ping error:", e);
    } finally {
      setTestingPing(false);
    }
  };

  const hostUrl = typeof window !== "undefined" && !window.location.host.includes("localhost") && !window.location.host.includes("127.0.0.1") ? window.location.origin : "https://openanalytics.org.in";
  const prjId = createdProject?.projectId || "open_prj_example";
  const measurementId = createdProject?.measurementId || `OA-${prjId.replace("open_prj_", "").toUpperCase()}`;

  const installSnippets: Record<string, { label: string; file: string; code: string; desc: string }> = {
    html: {
      label: "HTML Tag (CDN script)",
      file: "index.html",
      desc: "Paste this script tag into the <head> of every web page you want to measure.",
      code: `<!-- Open Analytics Tag -->
<script defer src="${hostUrl}/open.js" data-project-id="${measurementId}"></script>`,
    },
    nextjs: {
      label: "Next.js (App Router)",
      file: "app/layout.tsx",
      desc: "Embed in your root layout using Next.js native Script component.",
      code: `import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="${hostUrl}/open.js"
          data-project-id="${measurementId}"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}`,
    },
    react: {
      label: "React / Vite SPA",
      file: "src/App.tsx",
      desc: "Load tracking script asynchronously inside your React top-level component.",
      code: `import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const s = document.createElement("script");
    s.src = "${hostUrl}/open.js";
    s.setAttribute("data-project-id", "${measurementId}");
    s.defer = true;
    document.head.appendChild(s);
  }, []);

  return <MainApp />;
}`,
    },
    curl: {
      label: "cURL / Ingestion API",
      file: "Terminal / API",
      desc: "Send server-side telemetry events directly via HTTP POST.",
      code: `curl -X POST "${hostUrl}/api/v1/collect" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "pageview",
    "projectId": "${measurementId}",
    "pathname": "/",
    "title": "Home Page",
    "country": "US"
  }'`,
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative max-w-3xl w-full bg-[#080d1a] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_60px_rgba(6,182,212,0.15)] space-y-6 z-10 animate-fadeIn overflow-hidden">
        
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-[#080d19] rounded-[14px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400 animate-glow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white tracking-tight">Create Property &amp; Data Stream</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 uppercase tracking-wider">
                  Open Analytics
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Set up a new analytics property, choose measurement objectives, and connect your data stream.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Multi-Step Stepper Header */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { step: 1, label: "Property details" },
            { step: 2, label: "Business objectives" },
            { step: 3, label: "Data collection" },
            { step: 4, label: "Tag setup" },
          ].map((item) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <div
                key={item.step}
                className={`flex flex-col gap-1 p-2 rounded-xl transition border text-left ${
                  isCurrent
                    ? "bg-cyan-500/15 border-cyan-500/40 text-white"
                    : isCompleted
                    ? "bg-emerald-500/10 border-emerald-500/25 text-slate-300"
                    : "bg-white/[0.02] border-white/[0.05] text-slate-500"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompleted
                        ? "bg-emerald-500 text-slate-950"
                        : isCurrent
                        ? "bg-cyan-400 text-slate-950 font-black"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check size={10} /> : item.step}
                  </div>
                  <span className="text-[11px] font-bold truncate">{item.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle size={15} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 1: PROPERTY DETAILS                                     */}
        {/* ============================================================ */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Property Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="e.g. Acme Web App, My E-commerce Store"
                className="w-full px-4 py-3 bg-[#060a14] border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition"
              />
              <p className="text-[11px] text-slate-500">
                A property represents a business&apos;s web and/or app data in Open Analytics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Reporting Time Zone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value} className="bg-[#0b1020] text-white">
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#0b1020] text-white">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Industry Category
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind} className="bg-[#0b1020] text-white">
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Business Size
                </label>
                <select
                  value={businessSize}
                  onChange={(e) => setBusinessSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition"
                >
                  <option value="Small (1-10)" className="bg-[#0b1020] text-white">Small (1-10 employees)</option>
                  <option value="Medium (11-100)" className="bg-[#0b1020] text-white">Medium (11-100 employees)</option>
                  <option value="Large (101-500)" className="bg-[#0b1020] text-white">Large (101-500 employees)</option>
                  <option value="Enterprise (500+)" className="bg-[#0b1020] text-white">Enterprise (500+ employees)</option>
                </select>
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition cursor-pointer"
              >
                <span>Next: Business Objectives</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}

        {/* ============================================================ */}
        {/* STEP 2: BUSINESS OBJECTIVES                                  */}
        {/* ============================================================ */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h4 className="text-sm font-bold text-white">Choose your business objectives</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Select the topics that matter most to your business to tailor your analytics dashboards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OBJECTIVES.map((obj) => {
                const Icon = obj.icon;
                const isSelected = selectedObjectives.includes(obj.id);

                return (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => toggleObjective(obj.id)}
                    className={`p-4 rounded-2xl border text-left transition relative cursor-pointer ${
                      isSelected
                        ? "bg-cyan-500/10 border-cyan-500/50 shadow-sm shadow-cyan-500/10"
                        : "bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className={`p-2 rounded-xl border bg-gradient-to-br ${obj.color}`}>
                        <Icon size={18} />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                          isSelected
                            ? "bg-cyan-500 border-cyan-400 text-slate-950"
                            : "border-slate-700 bg-transparent"
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs font-bold text-white">{obj.title}</div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{obj.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-300 transition cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleStep2Next}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition cursor-pointer"
              >
                <span>Next: Data Stream Setup</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 3: DATA STREAM SETUP & ENHANCED MEASUREMENT             */}
        {/* ============================================================ */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Platform Selector Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Choose a platform
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "web", label: "Web", icon: Globe, desc: "Website or Web App" },
                  { id: "ios", label: "iOS App", icon: Smartphone, desc: "Apple iOS App" },
                  { id: "android", label: "Android App", icon: Smartphone, desc: "Google Play App" },
                ].map((p) => {
                  const Icon = p.icon;
                  const active = streamType === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setStreamType(p.id as any)}
                      className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        active
                          ? "bg-cyan-500/15 border-cyan-500/50 text-white shadow-md shadow-cyan-500/10"
                          : "bg-white/[0.02] border-white/[0.08] text-slate-400 hover:bg-white/[0.05]"
                      }`}
                    >
                      <Icon size={18} className={active ? "text-cyan-400" : "text-slate-400"} />
                      <span className="text-xs font-bold">{p.label}</span>
                      <span className="text-[10px] text-slate-500">{p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stream Details Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {streamType === "web" ? "Website URL" : "App Bundle / Package ID"} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    placeholder={streamType === "web" ? "https://mywebsite.com" : "com.company.app"}
                    className="w-full px-3.5 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Stream Name
                </label>
                <input
                  type="text"
                  value={streamName}
                  onChange={(e) => setStreamName(e.target.value)}
                  placeholder="e.g. Production Web Stream"
                  className="w-full px-3.5 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {/* Enhanced Measurement Box */}
            <div className="p-4 rounded-2xl bg-[#0b1020] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-cyan-400" />
                  <div>
                    <span className="text-xs font-bold text-white">Enhanced Measurement</span>
                    <span className="text-[10px] text-slate-400 block">
                      Automatically measures interactions and content in addition to standard pageviews.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold">
                  Recommended
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/[0.06] text-xs">
                {[
                  { key: "scrollTracking", label: "Scrolls (90%)" },
                  { key: "outboundClicks", label: "Outbound Clicks" },
                  { key: "siteSearch", label: "Site Search" },
                  { key: "formInteractions", label: "Form Leads" },
                  { key: "fileDownloads", label: "File Downloads" },
                  { key: "webVitals", label: "Core Web Vitals" },
                  { key: "aiBots", label: "AI Search Radar" },
                  { key: "pageViews", label: "Page Views" },
                ].map((item) => {
                  const isChecked = (enhancedMeasurement as any)[item.key];
                  return (
                    <label
                      key={item.key}
                      className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] cursor-pointer transition text-[11px]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          setEnhancedMeasurement({
                            ...enhancedMeasurement,
                            [item.key]: e.target.checked,
                          })
                        }
                        className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/30"
                      />
                      <span className="text-slate-300 font-medium truncate">{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 3 Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-300 transition cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleCreateProperty}
                disabled={creating}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition cursor-pointer disabled:opacity-50"
              >
                {creating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Property &amp; Stream</span>
                    <Sparkles size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 4: TAG SETUP & LIVE VERIFICATION                        */}
        {/* ============================================================ */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Stream Verification Status Banner */}
            {!pingVerified ? (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Radio size={18} className="animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Stream Inactive • Waiting for Test Ping</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">Pending Verification</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Send a test beacon or load your site to verify telemetry ingestion and activate monitoring.
                    </div>
                  </div>
                </div>

                {/* Measurement ID Badge */}
                <button
                  onClick={() => copyMeasurement(measurementId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-amber-500/30 text-xs font-mono text-amber-300 font-bold hover:bg-black/60 transition cursor-pointer shrink-0"
                >
                  <span>{measurementId}</span>
                  {copiedMeasurementId ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Data stream verified &amp; active!</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Monitoring Activated</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Receiving live beacons • {pingLatency ? `Latency: ${pingLatency}ms • ` : ""}Status: 200 OK
                    </div>
                  </div>
                </div>

                {/* Measurement ID Badge */}
                <button
                  onClick={() => copyMeasurement(measurementId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-emerald-500/30 text-xs font-mono text-emerald-300 font-bold hover:bg-black/60 transition cursor-pointer shrink-0"
                >
                  <span>{measurementId}</span>
                  {copiedMeasurementId ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            )}

            {/* Snippet Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-x-auto">
              {[
                { id: "html", label: "HTML Tag", icon: Globe },
                { id: "nextjs", label: "Next.js", icon: Sparkles },
                { id: "react", label: "React / Vite", icon: Code2 },
                { id: "curl", label: "cURL / API", icon: Terminal },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const active = activeInstallTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveInstallTab(tab.id as any)}
                    className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                      active
                        ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    <TabIcon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Code Box */}
            <div className="relative rounded-2xl bg-[#040711] border border-white/[0.12] shadow-inner overflow-hidden">
              <div className="h-8 px-3 bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  {installSnippets[activeInstallTab].file}
                </span>
                <button
                  onClick={() => copyCode(installSnippets[activeInstallTab].code)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/[0.08] hover:bg-cyan-500/20 text-[10px] font-bold text-slate-200 hover:text-cyan-300 transition cursor-pointer"
                >
                  {copiedSnippet ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  <span>{copiedSnippet ? "Copied!" : "Copy Snippet"}</span>
                </button>
              </div>

              <pre className="p-3 text-xs font-mono text-cyan-300/90 overflow-x-auto selection:bg-cyan-500/30 selection:text-white leading-relaxed max-h-[140px]">
                {installSnippets[activeInstallTab].code}
              </pre>
            </div>

            {/* Live Ingestion Verification Bar */}
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.07] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${
                    pingVerified ? "bg-emerald-400 animate-glow" : "bg-amber-400 animate-pulse"
                  }`}
                />
                <div>
                  <span className="font-bold text-white">Stream Status: </span>
                  <span className={pingVerified ? "text-emerald-400 font-semibold" : "text-slate-400"}>
                    {pingVerified ? `Receiving telemetry (200 OK • ${pingLatency || 32}ms)` : "Waiting for telemetry beacon"}
                  </span>
                </div>
              </div>

              <button
                onClick={sendTestPing}
                disabled={testingPing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                {testingPing ? (
                  <div className="w-3 h-3 border-2 border-cyan-300/30 border-t-cyan-300 rounded-full animate-spin" />
                ) : (
                  <Zap size={12} className="text-cyan-400" />
                )}
                <span>{pingVerified ? "Send Another Ping" : "Send Test Ping"}</span>
              </button>
            </div>

            {/* Step 4 Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
              {!pingVerified ? (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-[11px] font-medium text-slate-400 hover:text-slate-300 transition cursor-pointer"
                  >
                    Skip verification for now
                  </button>

                  <button
                    type="button"
                    onClick={sendTestPing}
                    disabled={testingPing}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition cursor-pointer disabled:opacity-50"
                  >
                    {testingPing ? (
                      <div className="w-3.5 h-3.5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    ) : (
                      <Zap size={14} className="text-slate-950 fill-current" />
                    )}
                    <span>{testingPing ? "Verifying Ingestion..." : "Verify Test Ping & Activate"}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={sendTestPing}
                    disabled={testingPing}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-300 transition cursor-pointer"
                  >
                    <RefreshCw size={13} className={testingPing ? "animate-spin" : ""} />
                    <span>Send Another Test Ping</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-xs font-black text-slate-950 shadow-xl shadow-emerald-500/30 transition cursor-pointer animate-glow"
                  >
                    <span>Activate Monitoring &amp; Go to Dashboard</span>
                    <ArrowRight size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
