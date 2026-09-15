"use client";

import React from "react";
import PlatformHeader from "@/components/PlatformHeader";
import EventsSection from "@/components/sections/EventsSection";
import { usePlatform } from "@/components/PlatformContext";
import { Zap } from "lucide-react";
import ProFeatureGate from "@/components/ProFeatureGate";

export default function DedicatedPage() {
  const { data, loading, activeProjectId, timeRange } = usePlatform();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      <PlatformHeader
        title="Custom Business Events Stream"
        subtitle="Telemetry log of application-specific custom tracking events, categories, and property payloads"
      />
      {loading && !data ? (
        <div className="p-16 text-center text-xs font-semibold text-muted-foreground flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading analytics...
        </div>
      ) : (
        <ProFeatureGate
          featureName="Custom Events & Conversion Rules"
          featureKey="custom_events"
          icon={Zap}
          description="Track custom business conversions, signup milestones, purchase values, and automate tracking with our no-code click and form event rules engine."
          highlights={[
            "Code-based event telemetry via open.event('name', { payload, value })",
            "No-code event rules engine targeting CSS selectors, clicks, and form submissions",
            "Monetary value and conversion revenue tracking per business event",
            "Full JSON metadata payload inspector and category breakdown",
            "Real-time custom event stream with instant live payload filtering",
          ]}
        >
          <EventsSection />
        </ProFeatureGate>
      )}
    </div>
  );
}
