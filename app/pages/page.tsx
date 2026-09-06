"use client";

import React from "react";
import PlatformHeader from "@/components/PlatformHeader";
import PagesSection from "@/components/sections/PagesSection";
import { usePlatform } from "@/components/PlatformContext";

export default function DedicatedPage() {
  const { data, loading, activeProjectId, timeRange } = usePlatform();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      <PlatformHeader
        title="Top Pages & Route Performance"
        subtitle="Comprehensive breakdown of all routes by pageviews, unique visitors, dwell time, and bounce rate"
      />
      {loading && !data ? (
        <div className="p-16 text-center text-xs font-semibold text-muted-foreground flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading analytics...
        </div>
      ) : (
        <PagesSection />
      )}
    </div>
  );
}
