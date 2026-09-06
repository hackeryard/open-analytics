"use client";

import React from "react";
import PlatformHeader from "@/components/PlatformHeader";
import UserJourneysSection from "@/components/sections/UserJourneysSection";
import { usePlatform } from "@/components/PlatformContext";

export default function DedicatedPage() {
  const { data, loading, activeProjectId, timeRange } = usePlatform();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      <PlatformHeader
        title="User Journeys & Navigation Pathways"
        subtitle="Entry landing routes, exit drop-offs, multi-step session paths, and conversion funnel analysis"
      />
      {loading && !data ? (
        <div className="p-16 text-center text-xs font-semibold text-muted-foreground flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading analytics...
        </div>
      ) : (
        <UserJourneysSection />
      )}
    </div>
  );
}
