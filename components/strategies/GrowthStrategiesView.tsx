"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Search,
  Activity,
  Bug,
  Globe,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Code2,
  AlertTriangle,
  Layers,
  XCircle,
  Copy,
  Check,
  Crown,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

interface StrategyItem {
  _id?: string;
  strategyId: string;
  title: string;
  slug: string;
  category: "seo_search" | "cro_ux" | "web_vitals" | "technical_errors" | "geo_expansion";
  priority: "critical" | "high" | "medium" | "low";
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  isQuickWin: boolean;
  score: number;
  headline: string;
  problem: string;
  expectedOutcome: string;
  telemetryEvidence: Array<{
    metric: string;
    currentValue: any;
    targetValue: any;
    source: string;
    affectedUrls?: string[];
    affectedSegments?: string[];
  }>;
  actionSteps: Array<{
    stepNumber: number;
    title: string;
    instruction: string;
    codeSnippet?: string;
    codeLanguage?: string;
  }>;
  status: "recommended" | "in_progress" | "implemented" | "dismissed";
  notes?: string;
  generatedAt: string;
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: any; color: string; border: string; bg: string }
> = {
  seo_search: {
    label: "SEO & Search",
    icon: Search,
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/10",
  },
  cro_ux: {
    label: "CRO & Behavioral UX",
    icon: Flame,
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/10",
  },
  web_vitals: {
    label: "Web Vitals (RUM)",
    icon: Activity,
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
  },
  technical_errors: {
    label: "Technical Stability",
    icon: Bug,
    color: "text-rose-400",
    border: "border-rose-500/20",
    bg: "bg-rose-500/10",
  },
  geo_expansion: {
    label: "Geo Expansion",
    icon: Globe,
    color: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/10",
  },
};

const PRIORITY_BADGES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  critical: { label: "Critical", bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
  high: { label: "High Priority", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  medium: { label: "Medium", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  low: { label: "Low", bg: "bg-zinc-800", text: "text-zinc-400", border: "border-white/[0.08]" },
};

export default function GrowthStrategiesView() {
  const { activeProjectId, activeProject } = usePlatform();
  const [strategies, setStrategies] = useState<StrategyItem[]>([]);
  const [summary, setSummary] = useState<any>({
    total: 0,
    quickWins: 0,
    criticalCount: 0,
    implementedCount: 0,
    inProgressCount: 0,
    categories: {},
    overallScore: 68,
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [quickWinsOnly, setQuickWinsOnly] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const isPro =
    activeProject?.effectivePlan === "pro" ||
    activeProject?.effectivePlan === "enterprise" ||
    activeProject?.plan === "pro" ||
    activeProject?.plan === "enterprise";

  const fetchStrategies = async () => {
    if (!activeProjectId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/strategies`);
      const data = await res.json();
      if (res.ok) {
        setStrategies(data.strategies || []);
        if (data.summary) setSummary(data.summary);
      }
    } catch (err: any) {
      console.error("Failed to load strategies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, [activeProjectId]);

  const handleGenerate = async () => {
    if (!activeProjectId) return;
    setGenerating(true);
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/strategies`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setStrategies(data.strategies || []);
        if (data.summary) setSummary(data.summary);
      }
    } catch (err: any) {
      console.error("Failed to generate strategies:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleStatusChange = async (strategyId: string, newStatus: string) => {
    if (!activeProjectId) return;
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/strategies/${strategyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStrategies((prev) =>
          prev.map((s) => (s.strategyId === strategyId || s.slug === strategyId ? { ...s, status: newStatus as any } : s))
        );
        fetchStrategies();
      }
    } catch (err: any) {
      console.error("Failed to update strategy status:", err);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredStrategies = strategies.filter((s) => {
    if (selectedCategory !== "all" && s.category !== selectedCategory) return false;
    if (selectedStatus !== "all" && s.status !== selectedStatus) return false;
    if (quickWinsOnly && !s.isQuickWin) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Strategy Health Score Banner */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Sparkles size={16} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              AI Growth &amp; Strategy Engine
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
              Pro Telemetry
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Autonomous Website Improvement Blueprints
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Synthesizes Google Search Console rankings, Core Web Vitals (RUM), behavioral drop-offs, device breakdowns, geo radar, and runtime exceptions into prioritized, step-by-step optimization strategies.
          </p>
        </div>

        {/* Score & Refresh Button */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          {/* Health Score Pill */}
          <div className="p-3 sm:p-4 rounded-xl bg-[#0e0f15] border border-white/[0.08] flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-zinc-800"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-emerald-400 transition-all duration-1000"
                  strokeWidth="4"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 - (125.6 * (summary.overallScore || 65)) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-xs font-bold text-white tabular-nums">
                {summary.overallScore || 68}%
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Strategy Score</span>
              <span className="text-xs font-semibold text-zinc-300">
                {summary.implementedCount} of {summary.total} Done
              </span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="py-3 px-5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={generating ? "animate-spin" : ""} />
            <span>{generating ? "Synthesizing..." : "Run Cross-Analysis"}</span>
          </button>
        </div>
      </div>

      {/* Cross-Telemetry Telemetry Streams Indicator */}
      <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <Layers size={14} className="text-zinc-400" />
          <span className="font-semibold text-white">Synthesized Telemetry Streams:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono text-[11px]">
            <Search size={12} />
            <span>GSC Search Queries</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[11px]">
            <Activity size={12} />
            <span>Web Vitals (RUM)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px]">
            <Flame size={12} />
            <span>Behavioral UX</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-[11px]">
            <Globe size={12} />
            <span>Geo Radar</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-[11px]">
            <Bug size={12} />
            <span>Runtime Errors</span>
          </span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === "all"
                ? "bg-white text-zinc-950"
                : "bg-[#0e0f15] text-zinc-400 hover:text-white border border-white/[0.06]"
            }`}
          >
            All ({strategies.length})
          </button>
          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
            const count = summary.categories?.[key] || 0;
            const IconComp = cfg.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === key
                    ? "bg-white text-zinc-950"
                    : "bg-[#0e0f15] text-zinc-400 hover:text-white border border-white/[0.06]"
                }`}
              >
                <IconComp size={12} />
                <span>{cfg.label}</span>
                {count > 0 && <span className="text-[10px] opacity-70">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Status Filter & Quick Win Toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={() => setQuickWinsOnly(!quickWinsOnly)}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer border ${
              quickWinsOnly
                ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                : "bg-[#0e0f15] text-zinc-400 border-white/[0.06] hover:text-white"
            }`}
          >
            <Zap size={13} className={quickWinsOnly ? "text-amber-400" : ""} />
            <span>Quick Wins Only</span>
            {summary.quickWins > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                {summary.quickWins}
              </span>
            )}
          </button>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-1.5 px-3 rounded-lg bg-[#0e0f15] border border-white/[0.08] text-xs text-white focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="recommended">Recommended</option>
            <option value="in_progress">In Progress</option>
            <option value="implemented">Implemented</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Strategy Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-16 text-center text-xs font-semibold text-zinc-400 flex items-center justify-center gap-2 bg-[#111218] border border-white/[0.08] rounded-xl">
            <RefreshCw size={16} className="animate-spin text-white" />
            Analyzing project telemetry...
          </div>
        ) : filteredStrategies.length === 0 ? (
          <div className="p-16 text-center bg-[#111218] border border-dashed border-white/[0.08] rounded-xl space-y-3">
            <Sparkles className="w-10 h-10 text-zinc-500 mx-auto opacity-50" />
            <p className="text-sm font-semibold text-white">No strategies match the selected filters</p>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Click &quot;Run Cross-Analysis&quot; to synthesize fresh telemetry or reset your active filters.
            </p>
          </div>
        ) : (
          filteredStrategies.map((strat) => {
            const cat = CATEGORY_CONFIG[strat.category] || CATEGORY_CONFIG.seo_search;
            const priority = PRIORITY_BADGES[strat.priority] || PRIORITY_BADGES.medium;
            const isExpanded = !!expandedCards[strat.strategyId];
            const CatIcon = cat.icon;

            return (
              <div
                key={strat.strategyId}
                className={`bg-[#111218] border rounded-xl overflow-hidden transition-all shadow-xs ${
                  strat.status === "implemented"
                    ? "border-emerald-500/20 opacity-90"
                    : strat.status === "dismissed"
                    ? "border-white/[0.04] opacity-50"
                    : strat.isQuickWin
                    ? "border-amber-400/30 hover:border-amber-400/50"
                    : "border-white/[0.08] hover:border-white/[0.14]"
                }`}
              >
                {/* Card Main Row */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Badge & Meta Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Category Pill */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${cat.bg} ${cat.border} ${cat.color}`}
                      >
                        <CatIcon size={13} />
                        <span>{cat.label}</span>
                      </span>

                      {/* Priority Pill */}
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border ${priority.bg} ${priority.border} ${priority.text}`}
                      >
                        {priority.label}
                      </span>

                      {/* Quick Win Tag */}
                      {strat.isQuickWin && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30 uppercase">
                          <Zap size={11} className="fill-amber-400" />
                          <span>Quick Win</span>
                        </span>
                      )}

                      {/* Impact / Effort */}
                      <span className="text-[11px] text-zinc-400 font-mono">
                        Impact: <span className="text-white font-semibold capitalize">{strat.impact}</span> | Effort:{" "}
                        <span className="text-white font-semibold capitalize">{strat.effort}</span>
                      </span>
                    </div>

                    {/* Status Pill / Switcher */}
                    <div className="flex items-center gap-1.5">
                      {strat.status === "implemented" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 size={13} />
                          <span>Implemented</span>
                        </span>
                      ) : strat.status === "in_progress" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Clock size={13} />
                          <span>In Progress</span>
                        </span>
                      ) : strat.status === "dismissed" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-400 border border-white/[0.06]">
                          <XCircle size={13} />
                          <span>Dismissed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                          <span>Recommended</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Headline */}
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {strat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 font-medium">
                      {strat.headline}
                    </p>
                  </div>

                  {/* Problem Description */}
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {strat.problem}
                  </p>

                  {/* Telemetry Evidence Box */}
                  {strat.telemetryEvidence && strat.telemetryEvidence.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-[#0e0f15] border border-white/[0.06] space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">
                        Observed Telemetry Evidence
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {strat.telemetryEvidence.map((ev, i) => (
                          <div key={i} className="flex flex-col gap-0.5">
                            <span className="text-zinc-400 font-medium">{ev.metric}:</span>
                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              <span className="text-rose-400 font-semibold">{ev.currentValue}</span>
                              <ArrowRight size={11} className="text-zinc-600" />
                              <span className="text-emerald-400 font-semibold">{ev.targetValue}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expected Outcome */}
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                    <TrendingUp size={14} className="shrink-0" />
                    <span>Expected Gain: {strat.expectedOutcome}</span>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => toggleExpand(strat.strategyId)}
                      className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Code2 size={14} />
                      <span>{isExpanded ? "Hide Implementation Blueprint" : "View Implementation Blueprint"}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <div className="flex items-center gap-2 flex-wrap">
                      {strat.status !== "in_progress" && strat.status !== "implemented" && (
                        <button
                          onClick={() => handleStatusChange(strat.strategyId, "in_progress")}
                          className="py-1.5 px-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-xs font-semibold text-blue-300 transition cursor-pointer"
                        >
                          Start Working
                        </button>
                      )}

                      {strat.status !== "implemented" && (
                        <button
                          onClick={() => handleStatusChange(strat.strategyId, "implemented")}
                          className="py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-semibold text-emerald-300 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={13} />
                          <span>Mark Implemented</span>
                        </button>
                      )}

                      {strat.status !== "dismissed" && (
                        <button
                          onClick={() => handleStatusChange(strat.strategyId, "dismissed")}
                          className="py-1.5 px-2.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable Step-by-Step Blueprint */}
                {isExpanded && (
                  <div className="bg-[#0e0f15] border-t border-white/[0.08] p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Code2 size={16} className="text-amber-400" />
                        <span>Step-by-Step Execution Blueprint</span>
                      </h4>
                      <span className="text-xs text-zinc-400 font-mono">
                        {strat.actionSteps?.length || 0} Action Steps
                      </span>
                    </div>

                    <div className="space-y-4">
                      {strat.actionSteps?.map((step) => {
                        const snippetKey = `${strat.strategyId}_${step.stepNumber}`;
                        return (
                          <div
                            key={step.stepNumber}
                            className="p-4 rounded-xl bg-[#111218] border border-white/[0.06] space-y-2.5"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-white/[0.08] text-white flex items-center justify-center text-[10px] font-bold font-mono">
                                {step.stepNumber}
                              </span>
                              <span className="text-sm font-semibold text-white">{step.title}</span>
                            </div>

                            <p className="text-xs text-zinc-400 leading-relaxed pl-7">
                              {step.instruction}
                            </p>

                            {step.codeSnippet && (
                              <div className="pl-7 pt-1">
                                <div className="relative rounded-lg bg-[#090a0f] border border-white/[0.08] p-3 font-mono text-[11px] text-zinc-200 overflow-x-auto">
                                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/[0.06] text-[10px] text-zinc-500 uppercase tracking-wider">
                                    <span>{step.codeLanguage || "Snippet"}</span>
                                    <button
                                      onClick={() => copySnippet(step.codeSnippet!, snippetKey)}
                                      className="hover:text-white transition flex items-center gap-1 cursor-pointer"
                                    >
                                      {copiedIndex === snippetKey ? (
                                        <>
                                          <Check size={11} className="text-emerald-400" />
                                          <span className="text-emerald-400">Copied</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy size={11} />
                                          <span>Copy</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <pre className="whitespace-pre-wrap leading-relaxed">{step.codeSnippet}</pre>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
