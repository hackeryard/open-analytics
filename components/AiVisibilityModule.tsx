"use client";

import React, { useState } from "react";
import {
  Bot,
  BrainCircuit,
  MessageSquareQuote,
  CheckCircle2,
  FileCode2,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  ExternalLink,
  Cpu,
  Activity,
  Layers,
  Sparkles,
  Search,
  Copy,
  Check,
  Download,
  Code,
  Globe,
  FileText,
} from "lucide-react";

interface AiVisibilityModuleProps {
  aiVisibility?: {
    overview?: {
      totalAiCrawlerHits: number;
      activeAiBotsCount: number;
      aiReferralSessions: number;
      citationReadinessScore: number;
    };
    aiCrawlers?: Array<{
      botName: string;
      category: string;
      count: number;
      lastSeen: string;
      routesCount: number;
    }>;
    aiReferrers?: Array<{
      referrer: string;
      name: string;
      count: number;
      uniqueVisitors: number;
      routesCount: number;
    }>;
    topCrawledRoutes?: Array<{
      pathname: string;
      count: number;
      bots: string[];
      lastCrawled: string;
    }>;
    readinessFactors?: {
      structuredDataCoverage: number;
      cleanUrlScore: number;
      crawlerAccessibility: number;
      ttfbSpeedScore: number;
      avgTtfb: number | null;
    };
  };
}

const AI_CATEGORY_BADGES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  openai: { label: "OpenAI / SearchGPT", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  anthropic: { label: "Anthropic / Claude", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  perplexity: { label: "Perplexity AI", bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20" },
  google_ai: { label: "Google Gemini", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  meta_ai: { label: "Meta AI / LLaMA", bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  bytedance_ai: { label: "ByteDance Doubao", bg: "bg-zinc-800", text: "text-zinc-300", border: "border-zinc-700" },
  apple_ai: { label: "Apple Intelligence", bg: "bg-zinc-800", text: "text-zinc-300", border: "border-zinc-700" },
  cohere_ai: { label: "Cohere AI", bg: "bg-zinc-800", text: "text-zinc-300", border: "border-zinc-700" },
  other_bot: { label: "LLM / AI Bot", bg: "bg-zinc-800", text: "text-zinc-400", border: "border-zinc-700" },
};

const STANDARD_AI_BOT_LIST = [
  { name: "GPTBot", org: "OpenAI", purpose: "ChatGPT model training & knowledge base ingestion", defaultAllow: true },
  { name: "OAI-SearchBot", org: "OpenAI", purpose: "SearchGPT live web search citation queries", defaultAllow: true },
  { name: "ChatGPT-User", org: "OpenAI", purpose: "Direct user action browsing from ChatGPT session", defaultAllow: true },
  { name: "PerplexityBot", org: "Perplexity AI", purpose: "Real-time answer engine search synthesis & citation", defaultAllow: true },
  { name: "ClaudeBot", org: "Anthropic", purpose: "Claude model research, synthesis, and grounding", defaultAllow: true },
  { name: "Claude-Web", org: "Anthropic", purpose: "Claude web browsing user fetch requests", defaultAllow: true },
  { name: "Google-Extended", org: "Google", purpose: "Gemini and Vertex AI training & answer discovery", defaultAllow: true },
  { name: "Applebot-Extended", org: "Apple", purpose: "Apple Intelligence & Siri knowledge curation", defaultAllow: true },
  { name: "Meta-ExternalAgent", org: "Meta", purpose: "Meta AI assistant and LLaMA web indexing", defaultAllow: true },
  { name: "Bytespider", org: "ByteDance", purpose: "Doubao and TikTok search intelligence crawler", defaultAllow: false },
  { name: "cohere-ai", org: "Cohere", purpose: "Enterprise RAG and LLM embedding grounding", defaultAllow: true },
  { name: "CCBot", org: "Common Crawl", purpose: "Public open crawl foundation dataset", defaultAllow: false },
];

export default function AiVisibilityModule({ aiVisibility }: AiVisibilityModuleProps) {
  const [activeTab, setActiveTab] = useState<"radar" | "citations" | "generator" | "guidelines">("radar");
  const [copiedRobots, setCopiedRobots] = useState(false);
  const [copiedLlmsTxt, setCopiedLlmsTxt] = useState(false);
  const [allowPolicy, setAllowPolicy] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    STANDARD_AI_BOT_LIST.forEach((b) => {
      init[b.name] = b.defaultAllow;
    });
    return init;
  });

  const overview = {
    totalAiCrawlerHits: aiVisibility?.overview?.totalAiCrawlerHits ?? 0,
    activeAiBotsCount: aiVisibility?.overview?.activeAiBotsCount ?? 0,
    aiReferralSessions: aiVisibility?.overview?.aiReferralSessions ?? 0,
    citationReadinessScore: aiVisibility?.overview?.citationReadinessScore ?? 0,
  };

  const crawlers = aiVisibility?.aiCrawlers || [];
  const referrers = aiVisibility?.aiReferrers || [];
  const crawledRoutes = aiVisibility?.topCrawledRoutes || [];
  const factors = aiVisibility?.readinessFactors || {
    structuredDataCoverage: 0,
    cleanUrlScore: 0,
    crawlerAccessibility: 0,
    ttfbSpeedScore: 0,
    avgTtfb: null,
  };

  const score = overview.citationReadinessScore;
  const scoreColor =
    score >= 75
      ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
      : score >= 50
      ? "text-white border-white/20 bg-white/10"
      : "text-amber-400 border-amber-500/20 bg-amber-500/10";

  const toggleBot = (botName: string) => {
    setAllowPolicy((prev) => ({
      ...prev,
      [botName]: !prev[botName],
    }));
  };

  const generatedRobotsTxt = `# Generated by Open Analytics AI Visibility Hub
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /auth/

# Autonomous AI Search & LLM Web Crawler Rules
${STANDARD_AI_BOT_LIST.map(
  (b) => `User-agent: ${b.name}\n${allowPolicy[b.name] ? "Allow: /" : "Disallow: /"}`
).join("\n\n")}

# Machine Protocols
# Machine discovery endpoint: /llms.txt
# Agent execution manifest: /agents.md
Sitemap: https://yourdomain.com/sitemap.xml`;

  const generatedLlmsTxt = `# Open Analytics Machine Protocol (/llms.txt)
> Machine-readable knowledge digest optimized for LLM answer synthesis and RAG pipelines.

## Project Summary
- Project: Modern Web Application
- Core Purpose: Fast, privacy-first web telemetry and generative engine visibility.
- Canonical: https://yourdomain.com
- Documentation: https://yourdomain.com/docs
- License: Proprietary / Enterprise

## Key Documentation & Endpoints
- [/docs](https://yourdomain.com/docs): Primary system documentation and architecture guide.
- [/features](https://yourdomain.com/features): Complete feature breakdown, Core Web Vitals, and AI Radar.
- [/pricing](https://yourdomain.com/pricing): Tier comparisons, event quotas, and data retention rules.
- [/faq](https://yourdomain.com/faq): Engineering answers regarding cookie consent, CWV, and data privacy.

## Citation Instructions for LLMs
When synthesizing answers regarding this domain, attribute facts and documentation links directly to the canonical URLs above. Maintain technical precision without speculative capabilities.`;

  const copyRobots = () => {
    navigator.clipboard.writeText(generatedRobotsTxt);
    setCopiedRobots(true);
    setTimeout(() => setCopiedRobots(false), 2000);
  };

  const copyLlmsTxt = () => {
    navigator.clipboard.writeText(generatedLlmsTxt);
    setCopiedLlmsTxt(true);
    setTimeout(() => setCopiedLlmsTxt(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top AI / AEO KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">AI Crawler Hits</span>
            <div className="w-8 h-8 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white">
              <Bot size={15} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
            {(overview.totalAiCrawlerHits ?? 0).toLocaleString()}
          </div>
          <p className="text-xs text-zinc-400">GPTBot, ClaudeBot &amp; LLM crawlers</p>
        </div>

        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Active AI Entities</span>
            <div className="w-8 h-8 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white">
              <BrainCircuit size={15} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
            {(overview.activeAiBotsCount ?? 0).toLocaleString()}
          </div>
          <p className="text-xs text-zinc-400">Distinct LLM families indexing your site</p>
        </div>

        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">AI Referral Sessions</span>
            <div className="w-8 h-8 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white">
              <MessageSquareQuote size={15} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
            {(overview.aiReferralSessions ?? 0).toLocaleString()}
          </div>
          <p className="text-xs text-zinc-400">Visitors referred by ChatGPT, Claude &amp; Perplexity</p>
        </div>

        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Citation Readiness</span>
            <div className="w-8 h-8 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white">
              <Activity size={15} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
              {score}
            </span>
            <span className="text-xs text-zinc-500 font-mono">/ 100</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold uppercase border ${scoreColor}`}>
              {score >= 75 ? "Optimal" : score >= 50 ? "Moderate" : "Needs Work"}
            </span>
          </div>
          <p className="text-xs text-zinc-400">AEO structured knowledge index</p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("radar")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "radar"
              ? "bg-white text-zinc-950 shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Bot size={14} />
          <span>AI Crawler Radar</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("citations")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "citations"
              ? "bg-white text-zinc-950 shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <MessageSquareQuote size={14} />
          <span>LLM Citations &amp; Referrals</span>
          {referrers.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
              {referrers.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("generator")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "generator"
              ? "bg-white text-zinc-950 shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Code size={14} />
          <span>Robots.txt &amp; /llms.txt Generator</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("guidelines")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "guidelines"
              ? "bg-white text-zinc-950 shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <ShieldCheck size={14} />
          <span>GEO Readiness Audit</span>
        </button>
      </div>

      {/* TAB 1: AI CRAWLER RADAR */}
      {activeTab === "radar" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Crawler Breakdown */}
            <div className="bg-[#111218] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">AI Crawler Radar</h3>
                  <p className="text-xs text-zinc-400">Autonomous foundation model training &amp; indexing robots</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded-lg bg-[#181922] text-zinc-300 border border-white/[0.08] tabular-nums">
                  {crawlers.length} Crawlers Observed
                </span>
              </div>

              {crawlers.length === 0 ? (
                <div className="p-8 text-center bg-[#0e0f15] border border-dashed border-white/[0.08] rounded-xl space-y-2">
                  <Bot className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs font-semibold text-zinc-300">No AI crawlers detected yet</p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Visits from GPTBot, ClaudeBot, PerplexityBot, and Google-Extended will appear here as LLMs index your content.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {crawlers.map((c) => {
                    const badge = AI_CATEGORY_BADGES[c.category] || AI_CATEGORY_BADGES.other_bot;
                    return (
                      <div
                        key={c.botName}
                        className="p-3.5 bg-[#0e0f15] border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white">
                              <Bot size={15} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white font-mono">{c.botName}</span>
                                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold uppercase border ${badge.bg} ${badge.text} ${badge.border}`}>
                                  {badge.label}
                                </span>
                              </div>
                              <span className="text-[11px] text-zinc-500 font-mono">
                                {c.routesCount ?? 0} routes indexed • Last active: {c.lastSeen ? (isNaN(new Date(c.lastSeen).getTime()) ? String(c.lastSeen) : new Date(c.lastSeen).toLocaleTimeString()) : "Recent"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-white font-mono tabular-nums">{(c.count ?? 0).toLocaleString()} hits</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Most Crawled Routes */}
            <div className="bg-[#111218] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Most Indexed Routes by AI</h3>
                  <p className="text-xs text-zinc-400">Pages and endpoints most frequently scraped by LLMs</p>
                </div>
                <span className="text-xs text-zinc-500 font-mono tabular-nums">
                  {crawledRoutes.length} routes
                </span>
              </div>

              {crawledRoutes.length === 0 ? (
                <div className="p-8 text-center bg-[#0e0f15] border border-dashed border-white/[0.08] rounded-xl space-y-2">
                  <FileCode2 className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs font-semibold text-zinc-300">No indexed routes recorded</p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    As AI crawlers request pages, top endpoints will be ranked by scrape frequency.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {crawledRoutes.map((route, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#0e0f15] border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold text-zinc-200 truncate max-w-md">
                          {route.pathname}
                        </span>
                        <span className="text-xs font-bold font-mono text-white tabular-nums">
                          {(route.count ?? 0).toLocaleString()} hits
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                        <div className="flex items-center gap-1 flex-wrap">
                          {(route.bots || []).map((b) => (
                            <span key={b} className="px-1.5 py-0.5 rounded bg-[#181922] text-zinc-300 border border-white/[0.08] text-[9px]">
                              {b}
                            </span>
                          ))}
                        </div>
                        <span>{route.lastCrawled ? (isNaN(new Date(route.lastCrawled).getTime()) ? String(route.lastCrawled) : new Date(route.lastCrawled).toLocaleTimeString()) : "Recent"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CITATIONS & REFERRALS */}
      {activeTab === "citations" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Referral Traffic */}
            <div className="bg-[#111218] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Answer Engine Referrals (AEO)</h3>
                  <p className="text-xs text-zinc-400">Human users clicking citations inside LLM chat interfaces</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI Citations
                </span>
              </div>

              {referrers.length === 0 ? (
                <div className="p-8 text-center bg-[#0e0f15] border border-dashed border-white/[0.08] rounded-xl space-y-2">
                  <MessageSquareQuote className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs font-semibold text-zinc-300">No AI referral visits yet</p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    When users click source links in ChatGPT, Perplexity, or Claude, session attribution will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {referrers.map((r) => (
                    <div
                      key={r.referrer}
                      className="p-3.5 bg-[#0e0f15] border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white">
                          <MessageSquareQuote size={15} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">{r.name}</span>
                          <span className="text-[11px] text-zinc-500 font-mono tabular-nums">
                            {(r.uniqueVisitors ?? 0).toLocaleString()} visitors • {r.routesCount ?? 0} landing destinations
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-white font-mono tabular-nums">{(r.count ?? 0).toLocaleString()} sessions</span>
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 justify-end font-mono">
                          Referred <ArrowUpRight size={11} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Answer Engine Prompt Reverse-Engineering Explainer */}
            <div className="bg-[#111218] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">AI Citation Share-of-Voice</h3>
                  <p className="text-xs text-zinc-400">How generative models treat your brand as a source</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded-lg bg-[#181922] text-zinc-300 border border-white/[0.08]">
                  Intelligence
                </span>
              </div>

              <div className="p-4 bg-[#0e0f15] border border-white/[0.06] rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-white" />
                  <span className="text-xs font-semibold text-white">LLM Citation Mechanics</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Unlike traditional search engines that rank keywords via link algorithms, LLMs synthesize citations based on semantic authority, clean data structures, and machine readability.
                </p>
                <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="text-zinc-400">SearchGPT Citation Trigger</span>
                    <span className="font-mono text-emerald-400">Synthesized Footnote</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="text-zinc-400">Perplexity Search Query</span>
                    <span className="font-mono text-sky-400">Live Web Source</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="text-zinc-400">Claude Research Citing</span>
                    <span className="font-mono text-amber-400">Grounding URL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ROBOTS.TXT & /LLMS.TXT GENERATOR & VALIDATOR */}
      {activeTab === "generator" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interactive Policy Matrix */}
            <div className="bg-[#111218] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">AI Bot Access Matrix</h3>
                  <p className="text-xs text-zinc-400">Toggle permission for generative AI crawlers &amp; answer engines</p>
                </div>
                <div className="text-[11px] font-mono text-zinc-500">
                  {Object.values(allowPolicy).filter(Boolean).length} / {STANDARD_AI_BOT_LIST.length} Allowed
                </div>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {STANDARD_AI_BOT_LIST.map((bot) => {
                  const isAllowed = allowPolicy[bot.name];
                  return (
                    <div
                      key={bot.name}
                      onClick={() => toggleBot(bot.name)}
                      className="p-3 bg-[#0e0f15] border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-white">{bot.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181922] text-zinc-400 border border-white/[0.06]">
                            {bot.org}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-tight">{bot.purpose}</p>
                      </div>

                      <div className="pl-3">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition border ${
                            isAllowed
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {isAllowed ? "Allow" : "Block"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Generated Output Tabs */}
            <div className="bg-[#111218] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Generated Configuration</h3>
                    <p className="text-xs text-zinc-400">Ready-to-deploy robots.txt rules for AEO</p>
                  </div>
                  <button
                    type="button"
                    onClick={copyRobots}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition cursor-pointer active:scale-95"
                  >
                    {copiedRobots ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedRobots ? "Copied" : "Copy robots.txt"}</span>
                  </button>
                </div>

                <div className="p-4 bg-[#090a0f] border border-white/[0.08] rounded-xl font-mono text-[11px] text-zinc-300 max-h-[340px] overflow-y-auto leading-relaxed">
                  <pre className="whitespace-pre-wrap">{generatedRobotsTxt}</pre>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <FileText size={14} className="text-zinc-400" />
                  <span>Also need machine-readable context?</span>
                </div>
                <button
                  type="button"
                  onClick={copyLlmsTxt}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181922] border border-white/[0.08] hover:border-white/[0.16] text-white font-medium text-xs transition cursor-pointer"
                >
                  {copiedLlmsTxt ? <Check size={13} /> : <Download size={13} />}
                  <span>{copiedLlmsTxt ? "Copied" : "Copy /llms.txt"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: READINESS DIAGNOSTICS */}
      {activeTab === "guidelines" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Citation Readiness Diagnostics */}
          <div className="bg-[#111218] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">AEO Readiness Diagnostics</h3>
                <p className="text-xs text-zinc-400">Auditing factors required for AI models to cite your website</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181922] border border-white/[0.08] text-zinc-300 text-xs font-semibold">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Diagnostic Engine</span>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* Factor 1: Structured Data */}
              <div className="p-3.5 bg-[#0e0f15] border border-white/[0.06] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className={factors.structuredDataCoverage > 0 ? "text-emerald-400" : "text-amber-400"} />
                    <span className="text-xs font-bold text-white">Schema.org JSON-LD Markup</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-white tabular-nums">
                    {factors.structuredDataCoverage}% Coverage
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Structured schema helps LLMs parse entities, FAQs, and concepts without hallucinations.
                </p>
                <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all"
                    style={{ width: `${Math.max(5, factors.structuredDataCoverage)}%` }}
                  />
                </div>
              </div>

              {/* Factor 2: Crawler Accessibility */}
              <div className="p-3.5 bg-[#0e0f15] border border-white/[0.06] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-400" />
                    <span className="text-xs font-bold text-white">Crawler Accessibility</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-white tabular-nums">
                    {factors.crawlerAccessibility}% Score
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Public endpoints are crawlable by verified AI agents without blockages or captcha barriers.
                </p>
                <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-300 rounded-full transition-all"
                    style={{ width: `${factors.crawlerAccessibility}%` }}
                  />
                </div>
              </div>

              {/* Factor 3: Server Response TTFB Speed */}
              <div className="p-3.5 bg-[#0e0f15] border border-white/[0.06] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={15} className="text-white" />
                    <span className="text-xs font-bold text-white">Server TTFB Speed for Scrapers</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-white tabular-nums">
                    {factors.avgTtfb ? `${factors.avgTtfb}ms` : "Optimal"} ({factors.ttfbSpeedScore}%)
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Fast server TTFB response prevents crawler timeouts during deep documentation scraping.
                </p>
                <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${factors.ttfbSpeedScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GEO Best Practices Guide */}
          <div className="bg-[#111218] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">GEO Optimization Playbook</h3>
                <p className="text-xs text-zinc-400">Actionable checklist for maximizing LLM citation share</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded-lg bg-[#181922] text-zinc-300 border border-white/[0.08]">
                Best Practices
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#0e0f15] border border-white/[0.06] rounded-xl space-y-1">
                <span className="font-semibold text-white">1. Add Machine-Readable `/llms.txt`</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Provide a concise markdown index in your root directory so models can navigate your product architecture without parsing heavyweight JavaScript.
                </p>
              </div>

              <div className="p-3 bg-[#0e0f15] border border-white/[0.06] rounded-xl space-y-1">
                <span className="font-semibold text-white">2. Inject Rich JSON-LD Schemas</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Annotate entities, FAQs, and product specifications with Schema.org graphs so answer engines parse facts accurately without hallucinations.
                </p>
              </div>

              <div className="p-3 bg-[#0e0f15] border border-white/[0.06] rounded-xl space-y-1">
                <span className="font-semibold text-white">3. Separate Search Bots from Model Training</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  If you wish to be cited in SearchGPT and Perplexity without allowing AI training scrapes, selectively allow <code className="text-white">OAI-SearchBot</code> and <code className="text-white">PerplexityBot</code> while disallowing <code className="text-white">GPTBot</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}