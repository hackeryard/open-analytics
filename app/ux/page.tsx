"use client";

import React from "react";
import PlatformHeader from "@/components/PlatformHeader";
import BehavioralUxSection from "@/components/sections/BehavioralUxSection";
import { usePlatform } from "@/components/PlatformContext";

import { Flame } from "lucide-react";
import ProFeatureGate from "@/components/ProFeatureGate";

export default function DedicatedPage() {
  const { data, loading, projectsLoading } = usePlatform();

  if (projectsLoading || (loading && !data)) {
    return (
      <div className="space-y-6 pb-16 animate-fadeIn">
        <PlatformHeader
          title="Behavioral UX & User Friction Radar"
          subtitle="Frustration signals tracking including rage clicks, dead clicks, rapid exit intent, and active dwell duration"
        />

        {/* 4 Key UX Metric Cards Shimmer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 bg-card border border-border rounded-2xl space-y-3">
              <div className="h-3 w-20 rounded bg-white/[0.06] shimmer" />
              <div className="h-7 w-16 rounded-lg bg-white/[0.08] shimmer" />
              <div className="h-2.5 w-full rounded bg-white/[0.03] shimmer" />
            </div>
          ))}
        </div>

        {/* Rage Clicks Radar Card Shimmer */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="h-4 w-48 rounded bg-white/[0.06] shimmer" />
            <div className="h-4 w-24 rounded bg-white/[0.04] shimmer" />
          </div>
          <div className="space-y-3 pt-2">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-12 w-full rounded-xl bg-muted/20 border border-border shimmer" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PlatformHeader
        title="Behavioral UX & User Friction Radar"
        subtitle="Frustration signals tracking including rage clicks, dead clicks, rapid exit intent, and active dwell duration"
      />
      <ProFeatureGate
        featureName="Behavioral UX & Rage Click Radar"
        featureKey="behavioral"
        icon={Flame}
        description="Detect user frustration signals in real time before users abandon your site. Pinpoint broken buttons, unresponsive elements, and dead clicks."
        highlights={[
          "Autonomous Rage Click detection (3+ rapid taps in 800ms)",
          "Dead Click analysis (clicks on elements yielding zero DOM response)",
          "Element selector & route breakdown for fast developer triage",
          "Device & browser distribution of frustrated sessions",
          "Prioritized friction impact score to guide UX optimizations",
        ]}
      >
        <BehavioralUxSection />
      </ProFeatureGate>
    </div>
  );
}
