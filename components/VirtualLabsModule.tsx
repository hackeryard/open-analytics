"use client";

import React from "react";
import { BookOpen, CheckCircle2, Sliders, HelpCircle, RotateCcw, Users, TrendingUp } from "lucide-react";

interface VirtualLabsModuleProps {
  data: {
    overview: {
      totalStarts: number;
      totalCompletions: number;
      completionRate: number;
    };
    labs: Array<{
      labId: string;
      starts: number;
      completes: number;
      completionRate: number;
      parameterTweaks: number;
      stepProgressions: number;
      quizAttempts: number;
      resets: number;
      uniqueStudents: number;
    }>;
  };
}

export default function VirtualLabsModule({ data }: VirtualLabsModuleProps) {
  if (!data) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111218] border border-white/[0.08] p-5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-2">
            <BookOpen size={16} className="text-zinc-300" />
            Lab Starts
          </div>
          <div className="text-3xl font-semibold tabular-nums text-white">
            {data.overview.totalStarts.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#111218] border border-white/[0.08] p-5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            Lab Completions
          </div>
          <div className="text-3xl font-semibold tabular-nums text-white">
            {data.overview.totalCompletions.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#111218] border border-white/[0.08] p-5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-2">
            <TrendingUp size={16} className="text-blue-400" />
            Completion Rate
          </div>
          <div className="text-3xl font-semibold tabular-nums text-white">
            {data.overview.completionRate}%
          </div>
        </div>

        <div className="bg-[#111218] border border-white/[0.08] p-5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-2">
            <Users size={16} className="text-purple-400" />
            Active Labs Tracked
          </div>
          <div className="text-3xl font-semibold tabular-nums text-white">
            {data.labs.length}
          </div>
        </div>
      </div>

      {/* Labs Funnel Table */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-white/[0.08] bg-[#0e0f15] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <BookOpen size={16} className="text-zinc-300" />
            Virtual Labs Performance &amp; Learning Telemetry
          </h3>
          <span className="text-xs text-zinc-400">Plug-and-play Product Intelligence Module</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#0e0f15] text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Lab Identifier</th>
                <th className="p-3.5 text-right">Starts</th>
                <th className="p-3.5 text-right">Completions</th>
                <th className="p-3.5 text-right">Completion Rate</th>
                <th className="p-3.5 text-right">Parameter Tweaks</th>
                <th className="p-3.5 text-right">Quiz Attempts</th>
                <th className="p-3.5 text-right">Resets</th>
                <th className="p-3.5 text-right">Unique Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] font-mono">
              {data.labs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-400 font-sans">
                    No virtual lab interactions recorded in this timeframe.
                  </td>
                </tr>
              ) : (
                data.labs.map((lab) => (
                  <tr key={lab.labId} className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-3.5 font-semibold font-sans text-white">{lab.labId}</td>
                    <td className="p-3.5 text-right tabular-nums text-zinc-300">{lab.starts.toLocaleString()}</td>
                    <td className="p-3.5 text-right tabular-nums text-emerald-400 font-semibold">{lab.completes.toLocaleString()}</td>
                    <td className="p-3.5 text-right tabular-nums font-semibold text-white">{lab.completionRate}%</td>
                    <td className="p-3.5 text-right tabular-nums text-zinc-400">{lab.parameterTweaks.toLocaleString()}</td>
                    <td className="p-3.5 text-right tabular-nums text-zinc-400">{lab.quizAttempts.toLocaleString()}</td>
                    <td className="p-3.5 text-right tabular-nums text-zinc-400">{lab.resets.toLocaleString()}</td>
                    <td className="p-3.5 text-right tabular-nums text-zinc-200 font-semibold">{lab.uniqueStudents.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
