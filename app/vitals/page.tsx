"use client";

import React from "react";
import PlatformHeader from "@/components/PlatformHeader";
import WebVitalsSection from "@/components/sections/WebVitalsSection";
import { usePlatform } from "@/components/PlatformContext";

import { Activity } from "lucide-react";
import ProFeatureGate from "@/components/ProFeatureGate";

export default function DedicatedPage() {
  const { data, loading, activeProjectId, timeRange } = usePlatform();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      <PlatformHeader
        title="Real User Monitoring & Core Web Vitals"
        subtitle="Field performance telemetry for LCP, INP, CLS, FCP, and TTFB across client devices and routes"
      />
      {loading && !data ? (
        <div className="p-16 text-center text-xs font-semibold text-muted-foreground flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading analytics...
        </div>
      ) : (
        <ProFeatureGate
          featureName="Core Web Vitals (RUM)"
          featureKey="rum"
          icon={Activity}
          description="Capture real user field telemetry (LCP, INP, CLS, TTFB, and FCP) across all visitor devices and networks without synthetic testing artifacts."
          highlights={[
            "Real user p75 percentiles for Largest Contentful Paint (LCP)",
            "Interaction to Next Paint (INP) latency tracking",
            "Cumulative Layout Shift (CLS) layout stability scoring",
            "Time to First Byte (TTFB) & First Contentful Paint (FCP) field metrics",
            "Route-by-route and device-by-device performance breakdown",
          ]}
        >
          <WebVitalsSection />
        </ProFeatureGate>
      )}
    </div>
  );
}
