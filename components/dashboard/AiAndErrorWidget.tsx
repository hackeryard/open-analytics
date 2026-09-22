"use client";

import React from "react";
import Link from "next/link";
import { Bot, Bug, ArrowRight, CheckCircle2 } from "lucide-react";
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
      <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white">
                <Bot size={15} />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">AI &amp; AEO Crawler Radar</h3>
            </div>
            <Link
              href="/ai-visibility"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-white hover:underline transition"
            >
              <span>AI Radar</span>
              <ArrowRight size={12} />
            </Link>
          </div>
          <p className="text-xs text-zinc-400">Autonomous LLM bot visits (OpenAI, Anthropic, Perplexity) &amp; citations</p>
        </div>

        <div className="space-y-2 flex-1 pt-1">
          {crawlers.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500 font-mono">
              No AI/LLM crawlers detected in this period
            </div>
          ) : (
            crawlers.slice(0, 3).map((c: any, i: number) => (
              <div key={c.botName || i} className="p-3 rounded-xl bg-[#0e0f15] border border-white/[0.06] flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-200 truncate">{c.botName}</span>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-white font-bold tabular-nums">{c.hits || c.count || 0} hits</span>
                  {c.percentage !== undefined && <span className="text-zinc-400">({c.percentage}%)</span>}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span className="text-white font-semibold tabular-nums">{totalBotHits} crawler hits</span>
          <span>{aiVisibility?.overview?.citationReadinessScore ? `Citation Readiness: ${aiVisibility.overview.citationReadinessScore}%` : "AEO Monitoring Active"}</span>
        </div>
      </div>

      {/* 2. Runtime Crash & Exception Triage */}
      <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white">
                <Bug size={15} />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">Crash &amp; Error Triage</h3>
            </div>
            <Link
              href="/errors"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-white hover:underline transition"
            >
              <span>Triage Center</span>
              <ArrowRight size={12} />
            </Link>
          </div>
          <p className="text-xs text-zinc-400">Client JavaScript exceptions, stack traces, and AI debug triage</p>
        </div>

        <div className="space-y-2 flex-1 pt-1">
          {safeErrors.length === 0 ? (
            <div className="py-8 text-center text-xs text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} />
              <span>100% Crash Free — No unhandled runtime exceptions</span>
            </div>
          ) : (
            safeErrors.slice(0, 2).map((err: any, i: number) => (
              <div key={err._id || i} className="p-3 rounded-xl bg-[#0e0f15] border border-rose-500/20 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-[10px] font-semibold uppercase border border-rose-500/20">
                    {err.errorType || "Exception"}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {timeAgo(err.lastOccurredAt)}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-zinc-300 truncate" title={err.message}>
                  {err.message}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span className={totalErrors === 0 ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
            {totalErrors === 0 ? "100% Crash Free" : `${totalErrors} logged incidents`}
          </span>
          <span className="text-zinc-300 font-medium">AI Fix Prompts Active</span>
        </div>
      </div>
    </div>
  );
}
