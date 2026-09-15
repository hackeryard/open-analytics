"use client";

import React from "react";
import PlatformHeader from "@/components/PlatformHeader";
import AiVisibilityModule from "@/components/AiVisibilityModule";
import { usePlatform } from "@/components/PlatformContext";

import { Bot } from "lucide-react";
import ProFeatureGate from "@/components/ProFeatureGate";

export default function AiVisibilityPage() {
  const { data, loading, activeProjectId, timeRange } = usePlatform();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      <PlatformHeader
        title="GEO & AI Search Radar"
        subtitle="Generative Engine Optimization (GEO) & LLM crawler detection (GPTBot, ClaudeBot, Perplexity), AI citations, and structured data readiness"
      />
      {loading && !data ? (
        <div className="p-16 text-center text-xs font-semibold text-muted-foreground flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading analytics...
        </div>
      ) : (
        <ProFeatureGate
          featureName="GEO & AI Search Radar"
          featureKey="ai_radar"
          icon={Bot}
          description="Autonomous radar tracking for traffic, citations, and content crawlers originating from OpenAI SearchGPT, Perplexity AI, ClaudeBot, Google Gemini, and ByteDance."
          highlights={[
            "Real-time detection of AI search assistant citations & referral traffic",
            "Continuous crawler monitoring for GPTBot, PerplexityBot, ClaudeBot, CCBot",
            "Generative Engine Optimization (GEO) content readiness scoring",
            "Structured schema compliance audit (Schema.org JSON-LD validator)",
            "Automated alerts when AI crawlers hit your high-value conversion pages",
          ]}
        >
          <AiVisibilityModule aiVisibility={data?.aiVisibility} />
        </ProFeatureGate>
      )}
    </div>
  );
}
