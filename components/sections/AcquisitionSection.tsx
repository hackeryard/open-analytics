"use client";

import React from "react";
import {
  Compass,
  Globe,
  Tag,
  Layers,
  ExternalLink,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData, formatDuration } from "@/lib/analyticsTypes";

export default function AcquisitionSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData } = usePlatform();
  const data = propData || platformData;

  if (!data) return null;

  return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Referring Domains */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Top Referring Domains & Sources
              </h3>
              <div className="space-y-3">
                {data.topReferrers.map((ref, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="font-mono text-foreground">{ref.domain}</span>
                      <span className="text-muted-foreground">
                        {ref.count} views ({ref.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        style={{ width: `${ref.percentage}%` }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* UTM Campaigns Table */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                UTM Marketing Campaigns
              </h3>
              {data.utmCampaigns.length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center">
                  No UTM campaign traffic recorded yet. Add ?utm_source=... to your share links.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {data.utmCampaigns.map((u, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-muted/20 border border-border rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground block font-mono">
                          {u.campaign}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {u.source} &bull; {u.medium}
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-black text-foreground">{u.views} views</span>
                        <span className="block text-[10px] text-muted-foreground">
                          {u.visitors} visitors ({formatDuration(u.avgDuration)})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

  );
}
