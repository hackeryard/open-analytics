"use client";

import React from "react";
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

export default function AiVisibilityModule({ aiVisibility }: AiVisibilityModuleProps) {
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

      {/* AI Crawler Radar & AI Answer Referrals */}
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

        {/* AI Referral Traffic (Answer Engine Referrals) */}
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
      </div>

      {/* Most Crawled Routes & AI Citation Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
}