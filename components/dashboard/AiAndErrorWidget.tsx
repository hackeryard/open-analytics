"use client";

import React from "react";
import Link from "next/link";
import { Bot, Bug, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { timeAgo } from "@/lib/analyticsTypes";

export default function AiAndErrorWidget({
  aiVisibility,
  errorStats,
  recentErrors,
}: {
  aiVisibility?: any;
  errorStats?: any;
  recentErrors?: any[];
}) {
  const totalBotHits = aiVisibility?.overview?.totalAiCrawlerHits ?? 0;
  const crawlers = aiVisibility?.aiCrawlers || aiVisibility?.crawlerBreakdown || [];

  const totalErrors = errorStats?.totalErrors ?? 0;
  const safeErrors = recentErrors || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. AI & AEO Crawler Radar */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <Bot size={15} />
              </div>
              <h3 className="text-sm font-black text-white">AI &amp; AEO Crawler Radar</h3>
            </div>
            <Link
              href="/ai-visibility"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition"
            >
              <span>AI Radar</span>
              <ArrowRight size={12} />
            </Link>
          </div>
          <p className="text-[11px] text-muted-foreground">Autonomous LLM bot visits (OpenAI, Anthropic, Perplexity) &amp; citations</p>
        </div>

        <div className="space-y-2 flex-1 pt-1">
          {crawlers.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No AI/LLM crawlers detected in this period
            </div>
          ) : (
            crawlers.slice(0, 3).map((c: any, i: number) => (
              <div key={c.botName || i} className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 truncate">{c.botName}</span>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-white font-bold">{c.hits || c.count || 0} hits</span>
                  {c.percentage !== undefined && <span className="text-pink-400">({c.percentage}%)</span>}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <span className="text-pink-400 font-bold">{totalBotHits} total LLM crawler hits</span>
          <span>{aiVisibility?.overview?.citationReadinessScore ? `Citation Readiness: ${aiVisibility.overview.citationReadinessScore}%` : "AEO Monitoring Active"}</span>
        </div>
      </div>

      {/* 2. Runtime Crash & Exception Triage */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Bug size={15} />
              </div>
              <h3 className="text-sm font-black text-white">Crash &amp; Error Triage</h3>
            </div>
            <Link
              href="/errors"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition"
            >
              <span>Triage Center</span>
              <ArrowRight size={12} />
            </Link>
          </div>
          <p className="text-[11px] text-muted-foreground">Client JavaScript exceptions, stack traces, and 1-click AI triage</p>
        </div>

        <div className="space-y-2 flex-1 pt-1">
          {safeErrors.length === 0 ? (
            <div className="py-6 text-center text-xs text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} />
              <span>100% Crash Free — No unhandled runtime exceptions</span>
            </div>
          ) : (
            safeErrors.slice(0, 2).map((err: any, i: number) => (
              <div key={err._id || i} className="p-2.5 rounded-2xl bg-rose-500/[0.04] border border-rose-500/20 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-mono text-[9px] font-extrabold uppercase">
                    {err.errorType || "Exception"}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {timeAgo(err.lastOccurredAt)}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-200 truncate" title={err.message}>
                  {err.message}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <span className={totalErrors === 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
            {totalErrors === 0 ? "100% Crash Free" : `${totalErrors} logged incidents`}
          </span>
          <span className="text-cyan-400 font-bold">1-Click AI Fix Prompts Active</span>
        </div>
      </div>
    </div>
  );
}
