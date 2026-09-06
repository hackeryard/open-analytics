"use client";

import React from "react";
import PlatformHeader from "@/components/PlatformHeader";
import GeoAnalyticsModule from "@/components/GeoAnalyticsModule";
import { usePlatform } from "@/components/PlatformContext";

export default function DedicatedPage() {
  const { data, loading, activeProjectId, timeRange } = usePlatform();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      <PlatformHeader
        title="GEO Atlas & Global Audience Map"
        subtitle="Interactive vector world atlas with pan/zoom navigation, country rankings, and metro area clusters"
      />
      {loading && !data ? (
        <div className="p-16 text-center text-xs font-semibold text-muted-foreground flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading analytics...
        </div>
      ) : (
        <GeoAnalyticsModule countries={data?.countries} topCities={data?.topCities} continents={data?.continents} totalViews={data?.overview?.totalViews} />
      )}
    </div>
  );
}
