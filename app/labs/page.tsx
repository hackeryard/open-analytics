"use client";

import React from "react";
import PlatformHeader from "@/components/PlatformHeader";
import VirtualLabsModule from "@/components/VirtualLabsModule";
import { usePlatform } from "@/components/PlatformContext";

export default function DedicatedPage() {
  const { data, loading, activeProjectId, timeRange } = usePlatform();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      <PlatformHeader
        title="Virtual Labs & Product Analytics"
        subtitle="Interactive simulation telemetry, experiment completions, parameter tweaks, and learner progression"
      />
      {loading && !data ? (
        <div className="p-16 text-center text-xs font-medium text-zinc-400 flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading analytics...</span>
        </div>
      ) : data?.labIntelligence ? (
        <VirtualLabsModule data={data.labIntelligence} />
      ) : (
        <div className="p-12 text-center text-xs font-medium text-zinc-400 bg-[#111218] border border-white/[0.08] rounded-xl">
          No simulation or virtual lab telemetry recorded yet.
        </div>
      )}
    </div>
  );
}
