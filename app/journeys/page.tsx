"use client";

import React from "react";
import PlatformHeader from "@/components/PlatformHeader";
import UserJourneysSection from "@/components/sections/UserJourneysSection";
import { usePlatform } from "@/components/PlatformContext";

export default function DedicatedPage() {
  const { data, loading, projectsLoading } = usePlatform();

  if (projectsLoading || (loading && !data)) {
    return (
      <div className="space-y-6 pb-16 animate-fadeIn">
        <PlatformHeader
          title="User Journeys & Navigation Pathways"
          subtitle="Entry landing routes, exit drop-offs, multi-step session paths, and conversion funnel analysis"
        />
        {/* Top 4 KPI Gauges Shimmer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 bg-card border border-border rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3 w-28 rounded bg-white/[0.06] shimmer" />
                <div className="h-3.5 w-16 rounded bg-white/[0.04] shimmer" />
              </div>
              <div className="h-7 w-20 rounded-lg bg-white/[0.08] shimmer" />
              <div className="h-2.5 w-full rounded bg-white/[0.03] shimmer" />
            </div>
          ))}
        </div>

        {/* Main Unified Journeys Card Container Shimmer */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-32 rounded-xl bg-white/[0.05] shimmer" />
              <div className="h-8 w-32 rounded-xl bg-white/[0.03] shimmer" />
              <div className="h-8 w-36 rounded-xl bg-white/[0.03] shimmer" />
            </div>
            <div className="h-8 w-full sm:w-64 rounded-xl bg-white/[0.04] shimmer" />
          </div>
          <div className="space-y-3 pt-2">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="h-20 w-full rounded-2xl bg-muted/20 border border-border shimmer" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <PlatformHeader
        title="User Journeys & Navigation Pathways"
        subtitle="Entry landing routes, exit drop-offs, multi-step session paths, and conversion funnel analysis"
      />
      <UserJourneysSection />
    </div>
  );
}
