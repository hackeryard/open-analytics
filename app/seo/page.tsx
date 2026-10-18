"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PlatformHeader from "@/components/PlatformHeader";
import SeoAnalyticsModule from "@/components/SeoAnalyticsModule";
import GscDashboardView from "@/components/seo/GscDashboardView";
import GrowthStrategiesView from "@/components/strategies/GrowthStrategiesView";
import ProFeatureGate from "@/components/ProFeatureGate";
import { usePlatform } from "@/components/PlatformContext";
import { Search, Globe, Sparkles, BarChart2 } from "lucide-react";

export default function SeoDedicatedPage() {
  const { data, loading, activeProject } = usePlatform();
  const searchParams = useSearchParams();
  const initialTab = (searchParams?.get("tab") as "gsc" | "telemetry" | "strategies") || "gsc";
  const [activeTab, setActiveTab] = useState<"gsc" | "telemetry" | "strategies">(initialTab);

  useEffect(() => {
    const tabParam = searchParams?.get("tab");
    if (tabParam === "gsc" || tabParam === "telemetry" || tabParam === "strategies") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      <PlatformHeader
        title="SEO & Search Intelligence"
        subtitle="Google Search Console keyword rankings, organic crawler indexers, and automated cross-telemetry growth strategies"
      />

      {/* Primary Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("gsc")}
          className={`py-2 px-4 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "gsc"
              ? "bg-white text-zinc-950 shadow-xs"
              : "bg-[#111218] text-zinc-400 hover:text-white border border-white/[0.06]"
          }`}
        >
          <Search size={14} />
          <span>Google Search Console</span>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">
            Pro
          </span>
        </button>

        <button
          onClick={() => setActiveTab("strategies")}
          className={`py-2 px-4 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "strategies"
              ? "bg-white text-zinc-950 shadow-xs"
              : "bg-[#111218] text-zinc-400 hover:text-white border border-white/[0.06]"
          }`}
        >
          <Sparkles size={14} className="text-amber-400" />
          <span>Growth Strategies</span>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">
            Pro
          </span>
        </button>

        <button
          onClick={() => setActiveTab("telemetry")}
          className={`py-2 px-4 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "telemetry"
              ? "bg-white text-zinc-950 shadow-xs"
              : "bg-[#111218] text-zinc-400 hover:text-white border border-white/[0.06]"
          }`}
        >
          <BarChart2 size={14} />
          <span>Organic Referrers &amp; Crawlers</span>
        </button>
      </div>

      {/* Tab 1: Google Search Console */}
      {activeTab === "gsc" && (
        <ProFeatureGate
          featureName="Google Search Console Integration"
          featureKey="gsc"
          icon={Search}
          description="Sync verified Google Search Console performance data to inspect search query rankings, click-through rates, striking distance keywords, and top organic landing pages directly in Open Analytics."
          highlights={[
            "Google Search Console OAuth 2.0 and automated 28-day telemetry sync",
            "Keyword rankings, impressions, and exact CTR breakdown per search query",
            "Automatic detection of Striking Distance keywords (rank 4–20) with high traffic upside",
            "Device and geographical country distribution directly from Google SERP",
          ]}
        >
          <GscDashboardView onSwitchToStrategies={() => setActiveTab("strategies")} />
        </ProFeatureGate>
      )}

      {/* Tab 2: Growth Strategies */}
      {activeTab === "strategies" && (
        <ProFeatureGate
          featureName="AI Growth & Improvement Strategies"
          featureKey="growth_strategies"
          icon={Sparkles}
          description="Synthesize your Google Search Console performance with Core Web Vitals, behavioral UX drop-offs, device breakdowns, geo radar, and runtime errors to generate prioritized step-by-step optimization blueprints."
          highlights={[
            "Autonomous cross-telemetry analysis combining search data with real-user metrics",
            "Striking distance keyword surge strategies with ready-to-use HTML and schema code",
            "Core Web Vitals LCP and CLS remediation on top search landing pages",
            "Runtime error triage preventing crashes on primary visitor conversion funnels",
            "Prioritized Impact vs Effort matrix with 1-click Quick Win isolation",
          ]}
        >
          <GrowthStrategiesView />
        </ProFeatureGate>
      )}

      {/* Tab 3: Organic Telemetry (Free Core Analytics) */}
      {activeTab === "telemetry" && (
        <>
          {loading && !data ? (
            <div className="p-16 text-center text-xs font-semibold text-muted-foreground flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Loading organic telemetry...
            </div>
          ) : (
            <SeoAnalyticsModule
              seoAnalytics={data?.seoAnalytics}
              totalViews={data?.overview?.totalViews}
            />
          )}
        </>
      )}
    </div>
  );
}
