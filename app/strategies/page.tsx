"use client";

import React from "react";
import PlatformHeader from "@/components/PlatformHeader";
import GrowthStrategiesView from "@/components/strategies/GrowthStrategiesView";
import ProFeatureGate from "@/components/ProFeatureGate";
import { Sparkles } from "lucide-react";

export default function StrategiesDedicatedPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      <PlatformHeader
        title="AI Growth & Improvement Strategies"
        subtitle="Cross-analyzing Google Search Console, user behavior, Web Vitals, device types, geo radar, and runtime exceptions into prioritized action blueprints"
      />

      <ProFeatureGate
        featureName="AI Growth & Improvement Strategies"
        featureKey="growth_strategies"
        icon={Sparkles}
        description="Cross-synthesizes your Google Search Console query rankings with live real-user behavior, Web Vitals RUM, device-specific drop-offs, geo radar, and runtime errors to unlock maximum traffic and conversions."
        highlights={[
          "Autonomous cross-telemetry intelligence engine synthesizing 6 telemetry streams",
          "Striking distance keyword surge strategies with ready-to-copy HTML and schema snippets",
          "Core Web Vitals LCP and CLS speed blueprints for high-impression search landing pages",
          "Runtime JavaScript exception triage protecting core conversion funnels from crashes",
          "Prioritized Impact vs Effort matrix with 1-click Quick Win isolation",
        ]}
      >
        <GrowthStrategiesView />
      </ProFeatureGate>
    </div>
  );
}
