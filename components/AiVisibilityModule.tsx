"use client";

import React from "react";
import {
  Sparkles,
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
  Flame,
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
  openai: { label: "OpenAI / ChatGPT", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  anthropic: { label: "Anthropic / Claude", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  perplexity: { label: "Perplexity AI", bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  google_ai: { label: "Google Gemini", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  meta_ai: { label: "Meta AI / LLaMA", bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/30" },
  bytedance_ai: { label: "ByteDance Doubao", bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30" },
  apple_ai: { label: "Apple Intelligence", bg: "bg-slate-500/10", text: "text-slate-300", border: "border-slate-500/30" },
  cohere_ai: { label: "Cohere AI", bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
  other_bot: { label: "LLM / AI Bot", bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30" },
};

export default function AiVisibilityModule({ aiVisibility }: AiVisibilityModuleProps) {
  const overview = {
    totalAiCrawlerHits: aiVisibility?.overview?.totalAiCrawlerHits ?? 0,
    activeAiBotsCount: aiVisibility?.overview?.activeAiBotsCount ?? 0,
    aiReferralSessions: aiVisibility?.overview?.aiReferralSessions ?? 0,
    citationReadinessScore: aiVisibility?.overview?.citationReadinessScore ?? 50,
  };

  const crawlers = aiVisibility?.aiCrawlers || [];
  const referrers = aiVisibility?.aiReferrers || [];
  const crawledRoutes = aiVisibility?.topCrawledRoutes || [];
  const factors = aiVisibility?.readinessFactors || {
    structuredDataCoverage: 0,
    cleanUrlScore: 96,
    crawlerAccessibility: 80,
    ttfbSpeedScore: 80,
    avgTtfb: null,
  };

  const score = overview.citationReadinessScore;
  const scoreColor =
    score >= 75
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : score >= 50
      ? "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
      : "text-amber-400 border-amber-500/30 bg-amber-500/10";

  return (
    <div className="space-y-6">
      {/* Top AI / AEO KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">AI Crawler Hits</span>
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Bot size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {(overview.totalAiCrawlerHits ?? 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-muted-foreground">GPTBot, ClaudeBot & LLM crawlers</p>
        </div>

        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active AI Entities</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <BrainCircuit size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {(overview.activeAiBotsCount ?? 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-muted-foreground">Distinct LLM families indexing your app</p>
        </div>

        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">AI Referral Sessions</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MessageSquareQuote size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {(overview.aiReferralSessions ?? 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-muted-foreground">Visitors referred by ChatGPT, Claude & Perplexity</p>
        </div>

        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Citation Readiness</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-foreground">
              {score}
            </span>
            <span className="text-xs text-muted-foreground font-mono">/ 100</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${scoreColor}`}>
              {score >= 75 ? "Optimal" : score >= 50 ? "Moderate" : "Needs Work"}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">AEO structured knowledge index</p>
        </div>
      </div>

      {/* AI Crawler Radar & AI Answer Referrals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Crawler Breakdown */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">AI Crawler Radar</h3>
              <p className="text-xs text-muted-foreground">Autonomous foundation model training & indexing robots</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-muted text-foreground border border-border">
              {crawlers.length} Crawlers Observed
            </span>
          </div>

          {crawlers.length === 0 ? (
            <div className="p-8 text-center bg-muted/20 border border-dashed border-border rounded-2xl space-y-2">
              <Bot className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
              <p className="text-sm font-semibold text-foreground">No AI crawlers detected yet</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Visits from GPTBot, ClaudeBot, PerplexityBot, and Google-Extended will appear here as LLMs index your content.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {crawlers.map((c) => {
                const badge = AI_CATEGORY_BADGES[c.category] || AI_CATEGORY_BADGES.other_bot;
                return (
                  <div
                    key={c.botName}
                    className="p-3.5 bg-muted/20 border border-border/80 hover:border-primary/40 rounded-2xl transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                          <Bot size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground font-mono">{c.botName}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${badge.bg} ${badge.text} ${badge.border}`}>
                              {badge.label}
                            </span>
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {c.routesCount ?? 0} routes indexed • Last active: {c.lastSeen ? (isNaN(new Date(c.lastSeen).getTime()) ? String(c.lastSeen) : new Date(c.lastSeen).toLocaleTimeString()) : "Recent"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-foreground font-mono">{(c.count ?? 0).toLocaleString()} hits</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Referral Traffic (Answer Engine Referrals) */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Answer Engine Referrals (AEO)</h3>
              <p className="text-xs text-muted-foreground">Human users clicking citations inside LLM chat interfaces</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              AI Citations
            </span>
          </div>

          {referrers.length === 0 ? (
            <div className="p-8 text-center bg-muted/20 border border-dashed border-border rounded-2xl space-y-2">
              <MessageSquareQuote className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
              <p className="text-sm font-semibold text-foreground">No AI referral visits yet</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                When users click source links in ChatGPT, Perplexity, or Claude, session attribution will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrers.map((r) => (
                <div
                  key={r.referrer}
                  className="p-3.5 bg-muted/20 border border-border/80 hover:border-primary/40 rounded-2xl transition flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <MessageSquareQuote size={16} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-foreground block">{r.name}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {(r.uniqueVisitors ?? 0).toLocaleString()} visitors • {r.routesCount ?? 0} landing destinations
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground font-mono">{(r.count ?? 0).toLocaleString()} sessions</span>
                    <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1 justify-end">
                      Referred <ArrowUpRight size={12} />
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
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Most Indexed Routes by AI</h3>
              <p className="text-xs text-muted-foreground">Pages and endpoints most frequently scraped by LLMs</p>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {crawledRoutes.length} routes
            </span>
          </div>

          {crawledRoutes.length === 0 ? (
            <div className="p-8 text-center bg-muted/20 border border-dashed border-border rounded-2xl space-y-2">
              <FileCode2 className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
              <p className="text-sm font-semibold text-foreground">No indexed routes recorded</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                As AI crawlers request pages, top endpoints will be ranked by scrape frequency.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {crawledRoutes.map((route, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-muted/20 border border-border/80 hover:border-primary/40 rounded-2xl transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-bold text-cyan-400 truncate max-w-md">
                      {route.pathname}
                    </span>
                    <span className="text-xs font-bold font-mono text-foreground">
                      {(route.count ?? 0).toLocaleString()} hits
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1 flex-wrap">
                      {(route.bots || []).map((b) => (
                        <span key={b} className="px-1.5 py-0.2 rounded bg-muted text-foreground border border-border text-[10px] font-mono">
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
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">AEO Readiness Diagnostics</h3>
              <p className="text-xs text-muted-foreground">Auditing factors required for AI models to cite your website</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              <Sparkles size={13} />
              <span>Diagnostic Engine</span>
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Factor 1: Structured Data */}
            <div className="p-3.5 bg-muted/20 border border-border/80 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className={factors.structuredDataCoverage > 0 ? "text-emerald-400" : "text-amber-400"} />
                  <span className="text-sm font-bold text-foreground">Schema.org JSON-LD Markup</span>
                </div>
                <span className="text-xs font-mono font-bold text-foreground">
                  {factors.structuredDataCoverage}% Coverage
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Structured schema helps LLMs parse entities, FAQs, and concepts without hallucinations.
              </p>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all"
                  style={{ width: `${Math.max(5, factors.structuredDataCoverage)}%` }}
                />
              </div>
            </div>

            {/* Factor 2: Crawler Accessibility */}
            <div className="p-3.5 bg-muted/20 border border-border/80 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-sm font-bold text-foreground">Crawler Accessibility</span>
                </div>
                <span className="text-xs font-mono font-bold text-foreground">
                  {factors.crawlerAccessibility}% Score
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Public endpoints are crawlable by verified AI agents without blockages or captcha barriers.
              </p>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all"
                  style={{ width: `${factors.crawlerAccessibility}%` }}
                />
              </div>
            </div>

            {/* Factor 3: Server Response TTFB Speed */}
            <div className="p-3.5 bg-muted/20 border border-border/80 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-cyan-400" />
                  <span className="text-sm font-bold text-foreground">Server TTFB Speed for Scrapers</span>
                </div>
                <span className="text-xs font-mono font-bold text-foreground">
                  {factors.avgTtfb ? `${factors.avgTtfb}ms` : "Optimal"} ({factors.ttfbSpeedScore}%)
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Fast server TTFB response prevents crawler timeouts during deep documentation scraping.
              </p>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all"
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