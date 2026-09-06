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
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold mb-2">
            <BookOpen size={16} className="text-primary" />
            Lab Starts
          </div>
          <div className="text-3xl font-black text-foreground">
            {data.overview.totalStarts.toLocaleString()}
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold mb-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            Lab Completions
          </div>
          <div className="text-3xl font-black text-foreground">
            {data.overview.totalCompletions.toLocaleString()}
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold mb-2">
            <TrendingUp size={16} className="text-blue-500" />
            Completion Rate
          </div>
          <div className="text-3xl font-black text-foreground">
            {data.overview.completionRate}%
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold mb-2">
            <Users size={16} className="text-purple-500" />
            Active Labs Tracked
          </div>
          <div className="text-3xl font-black text-foreground">
            {data.labs.length}
          </div>
        </div>
      </div>

      {/* Labs Funnel Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <BookOpen size={16} className="text-primary" />
            Virtual Labs Performance & Learning Telemetry
          </h3>
          <span className="text-xs text-muted-foreground">Plug-and-play Product Intelligence Module</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
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
            <tbody className="divide-y divide-border/60 font-mono">
              {data.labs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground font-sans">
                    No virtual lab interactions recorded in this timeframe.
                  </td>
                </tr>
              ) : (
                data.labs.map((lab) => (
                  <tr key={lab.labId} className="hover:bg-muted/30 transition">
                    <td className="p-3.5 font-bold font-sans text-foreground">{lab.labId}</td>
                    <td className="p-3.5 text-right">{lab.starts.toLocaleString()}</td>
                    <td className="p-3.5 text-right text-emerald-500 font-semibold">{lab.completes.toLocaleString()}</td>
                    <td className="p-3.5 text-right font-bold text-foreground">{lab.completionRate}%</td>
                    <td className="p-3.5 text-right text-muted-foreground">{lab.parameterTweaks.toLocaleString()}</td>
                    <td className="p-3.5 text-right text-muted-foreground">{lab.quizAttempts.toLocaleString()}</td>
                    <td className="p-3.5 text-right text-muted-foreground">{lab.resets.toLocaleString()}</td>
                    <td className="p-3.5 text-right text-primary font-semibold">{lab.uniqueStudents.toLocaleString()}</td>
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
