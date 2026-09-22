"use client";

import React from "react";
import { Search, Globe, Bot, ArrowUpRight, TrendingUp, ExternalLink, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

interface SeoAnalyticsModuleProps {
  seoAnalytics?: {
    overview?: {
      totalSearchVisits?: number;
      uniqueSearchVisitors?: number;
      searchShare?: number;
      organicShare?: number;
      searchCrawlerHits?: number;
    };
    searchEngines?: Array<{
      engine: string;
      name: string;
      count?: number;
      uniqueVisitors?: number;
      percentage?: number;
    }>;
    searchLandingPages?: Array<{
      pathname: string;
      count?: number;
      uniqueVisitors?: number;
      engines?: string[];
    }>;
    searchCrawlers?: Array<{
      botName: string;
      count?: number;
      lastSeen?: string;
    }>;
  };
  totalViews?: number;
}

const SEARCH_ENGINE_ICONS: Record<string, { bg: string; text: string; border: string }> = {
  google: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  bing: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  duckduckgo: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
  yahoo: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  ecosia: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  baidu: { bg: "bg-blue-600/10", text: "text-blue-400", border: "border-blue-600/20" },
  yandex: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
};

export default function SeoAnalyticsModule({ seoAnalytics, totalViews = 0 }: SeoAnalyticsModuleProps) {
  const overview = {
    totalSearchVisits: seoAnalytics?.overview?.totalSearchVisits ?? 0,
    uniqueSearchVisitors: seoAnalytics?.overview?.uniqueSearchVisitors ?? seoAnalytics?.overview?.totalSearchVisits ?? 0,
    searchShare: seoAnalytics?.overview?.searchShare ?? seoAnalytics?.overview?.organicShare ?? 0,
    searchCrawlerHits: seoAnalytics?.overview?.searchCrawlerHits ?? 0,
  };

  const engines = seoAnalytics?.searchEngines || [];
  const landingPages = seoAnalytics?.searchLandingPages || [];
  const crawlers = seoAnalytics?.searchCrawlers || [];

  return (
    <div className="space-y-6">
      {/* Top SEO KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Organic Search Visits</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Search size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tabular-nums text-white">
            {(overview.totalSearchVisits || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400">Referred via organic search results</p>
        </div>

        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Unique Search Visitors</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Globe size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tabular-nums text-white">
            {(overview.uniqueSearchVisitors || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400">Distinct organic audience reach</p>
        </div>

        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Search Traffic Share</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tabular-nums text-white">
            {overview.searchShare}%
          </div>
          <p className="text-[11px] text-zinc-400 font-mono tabular-nums">Of total site traffic volume ({(totalViews || 0).toLocaleString()} views)</p>
        </div>

        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Search Engine Crawls</span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Bot size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tabular-nums text-white">
            {(overview.searchCrawlerHits || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400">Googlebot, Bingbot &amp; indexers</p>
        </div>
      </div>

      {/* Search Engine Breakdown & Search Bot Crawlers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Engine Distribution */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Search Engine Distribution</h3>
              <p className="text-xs text-zinc-400">Organic referrals by search provider</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#0e0f15] text-zinc-300 border border-white/[0.08] tabular-nums">
              {engines.length} Providers Active
            </span>
          </div>

          {engines.length === 0 ? (
            <div className="p-8 text-center bg-[#0e0f15] border border-dashed border-white/[0.08] rounded-xl space-y-2">
              <Search className="w-8 h-8 text-zinc-500 mx-auto opacity-50" />
              <p className="text-sm font-semibold text-white">No search referrals recorded yet</p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Organic search visitors from Google, Bing, and DuckDuckGo will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {engines.map((eng) => {
                const colors = SEARCH_ENGINE_ICONS[eng.engine] || {
                  bg: "bg-white/[0.06]",
                  text: "text-zinc-300",
                  border: "border-white/[0.08]",
                };
                return (
                  <div
                    key={eng.engine}
                    className="p-3 bg-[#0e0f15] border border-white/[0.06] hover:border-white/[0.14] rounded-lg transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-md ${colors.bg} border ${colors.border} flex items-center justify-center font-semibold text-xs ${colors.text}`}>
                          {eng.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-white block">{eng.name}</span>
                          <span className="text-[11px] text-zinc-400 font-mono tabular-nums">{(eng.uniqueVisitors ?? 0).toLocaleString()} unique visitors</span>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-sm font-semibold tabular-nums text-white block">{(eng.count ?? 0).toLocaleString()} visits</span>
                        <span className="text-[11px] tabular-nums text-zinc-400">{eng.percentage ?? 0}% share</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-[#181922] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all"
                        style={{ width: `${Math.max(4, eng.percentage ?? 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Search Engine Crawlers & Indexers */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Search Engine Crawler Activity</h3>
              <p className="text-xs text-zinc-400">Robots indexing site structure and content</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#0e0f15] text-zinc-300 border border-white/[0.08] tabular-nums">
              {crawlers.length} Crawlers Observed
            </span>
          </div>

          {crawlers.length === 0 ? (
            <div className="p-8 text-center bg-[#0e0f15] border border-dashed border-white/[0.08] rounded-xl space-y-2">
              <Bot className="w-8 h-8 text-zinc-500 mx-auto opacity-50" />
              <p className="text-sm font-semibold text-white">No search bot crawls logged</p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Hits from Googlebot, Bingbot, and other verified web crawlers are tracked automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {crawlers.map((c) => {
                const dateVal = c.lastSeen ? new Date(c.lastSeen) : null;
                const timeStr = dateVal && !isNaN(dateVal.getTime())
                  ? dateVal.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                  : (c.lastSeen || "Recent");

                return (
                  <div
                    key={c.botName}
                    className="p-3 bg-[#0e0f15] border border-white/[0.06] hover:border-white/[0.14] rounded-lg transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                        <Bot size={16} />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white block font-mono">{c.botName}</span>
                        <span className="text-[11px] text-zinc-400 font-mono tabular-nums">
                          Last seen: {timeStr}
                        </span>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-sm font-semibold tabular-nums text-white block">{(c.count ?? 0).toLocaleString()} crawls</span>
                      <span className="text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        Indexed
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Search Landing Pages */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Top Organic Landing Pages</h3>
            <p className="text-xs text-zinc-400">URLs receiving the highest share of organic search entry points</p>
          </div>
          <span className="text-xs text-zinc-400 font-mono tabular-nums">
            {landingPages.length} landing pages
          </span>
        </div>

        {landingPages.length === 0 ? (
          <div className="p-8 text-center bg-[#0e0f15] border border-dashed border-white/[0.08] rounded-xl space-y-2">
            <ExternalLink className="w-8 h-8 text-zinc-500 mx-auto opacity-50" />
            <p className="text-sm font-semibold text-white">No organic landing page data</p>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              As visitors enter your site from search engines, target URLs will be ranked here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold border-b border-white/[0.08] bg-[#0e0f15]">
                <tr>
                  <th className="py-3 px-4">Landing Path</th>
                  <th className="py-3 px-4 text-center">Referring Engines</th>
                  <th className="py-3 px-4 text-right">Unique Visitors</th>
                  <th className="py-3 px-4 text-right">Total Visits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] font-mono">
                {landingPages.map((page, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-white truncate max-w-md">{page.pathname}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {(page.engines || []).map((eng) => (
                          <span
                            key={eng}
                            className="px-2 py-0.5 text-[10px] rounded bg-white/[0.06] text-zinc-300 border border-white/[0.08] uppercase font-semibold"
                          >
                            {eng}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-zinc-400">
                      {(page.uniqueVisitors ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold tabular-nums text-white">
                      {(page.count ?? 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}