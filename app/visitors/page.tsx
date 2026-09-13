"use client";

import React from "react";
import PlatformHeader from "@/components/PlatformHeader";
import AudienceSection from "@/components/sections/AudienceSection";
import { usePlatform } from "@/components/PlatformContext";

export default function VisitorsPage() {
  const { data, loading } = usePlatform();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      <PlatformHeader
        title="Audience & Loyalty Directory"
        subtitle="Comprehensive user intelligence: all visitors, first-time arrivals, repeat returnees, loyalty tiers, and persistent visitor histories"
      />
      {loading && !data ? (
        <div className="p-16 text-center text-xs font-semibold text-muted-foreground flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading audience analytics...
        </div>
      ) : (
        <AudienceSection />
      )}
    </div>
  );
}
