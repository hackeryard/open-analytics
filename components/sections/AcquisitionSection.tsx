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
  Share2,
  Filter,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData, formatDuration } from "@/lib/analyticsTypes";

export default function AcquisitionSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData } = usePlatform();
  const data = propData || platformData;

  if (!data) return null;

  const topReferrers = data.topReferrers || [];
  const utmCampaigns = data.utmCampaigns || [];
  const totalReferralViews = topReferrers.reduce((acc, r) => acc + (r.count || 0), 0);
  const totalCampaignViews = utmCampaigns.reduce((acc, u) => acc + (u.views || 0), 0);
  const topReferrer = topReferrers[0] || null;

  return (
    <div className="space-y-6 pb-16">
      {/* ── Top Summary KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Referring Domains</span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <Globe size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
            {topReferrers.length}
          </div>
          <div className="text-[11px] text-zinc-500">
            {totalReferralViews.toLocaleString()} inbound referral hits
          </div>
        </div>

        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Top Inbound Anchor</span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <Compass size={14} />
            </div>
          </div>
          <div className="text-sm sm:text-base font-semibold text-white truncate font-mono" title={topReferrer?.domain || "Direct / Internal"}>
            {topReferrer?.domain || "Direct"}
          </div>
          <div className="text-[11px] text-zinc-500 tabular-nums">
            {topReferrer ? `${topReferrer.count.toLocaleString()} views (${topReferrer.percentage}%)` : "No external referrers"}
          </div>
        </div>

        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Active Campaigns</span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <Tag size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
            {utmCampaigns.length}
          </div>
          <div className="text-[11px] text-zinc-500">
            Tracked UTM marketing channels
          </div>
        </div>

        <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Campaign Attribution</span>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400">
              <BarChart3 size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">
            {totalCampaignViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500">
            Tagged marketing conversions
          </div>
        </div>
      </div>

      {/* ── Main Dual Columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Referring Domains */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <Globe size={15} className="text-zinc-400" />
                <span>Top Referring Domains &amp; Inbound Sources</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                External websites and search engines sending visitor traffic
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500 tabular-nums">
              {topReferrers.length} sources
            </span>
          </div>

          {topReferrers.length === 0 ? (
            <div className="py-12 text-center rounded-lg bg-[#0e0f15] border border-white/[0.04] p-6 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-white/[0.04] text-zinc-400 flex items-center justify-center mx-auto">
                <Globe size={18} />
              </div>
              <p className="text-xs font-medium text-zinc-300">No Referring Domains Yet</p>
              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                Direct traffic and external referrers will automatically populate as visitors arrive.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {topReferrers.map((ref, idx) => (
                <div key={idx} className="space-y-1.5 group">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 text-[11px] font-mono text-zinc-500 tabular-nums">
                        #{idx + 1}
                      </span>
                      <span className="font-mono text-zinc-200 group-hover:text-white transition truncate" title={ref.domain}>
                        {ref.domain}
                      </span>
                    </div>
                    <div className="text-right font-mono text-xs tabular-nums shrink-0 ml-2">
                      <span className="font-medium text-white">{ref.count.toLocaleString()}</span>
                      <span className="text-zinc-500 text-[11px] ml-1.5">({ref.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-[#181922] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.max(2, ref.percentage)}%` }}
                      className="h-full bg-white rounded-full transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* UTM Campaigns Table */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <Tag size={15} className="text-zinc-400" />
                <span>UTM Marketing Campaigns</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Tracking tags attached via utm_source, utm_medium, and utm_campaign
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500 tabular-nums">
              {utmCampaigns.length} campaigns
            </span>
          </div>

          {utmCampaigns.length === 0 ? (
            <div className="py-12 text-center rounded-lg bg-[#0e0f15] border border-white/[0.04] p-6 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-white/[0.04] text-zinc-400 flex items-center justify-center mx-auto">
                <Tag size={18} />
              </div>
              <p className="text-xs font-medium text-zinc-300">No Campaign Traffic Tagged</p>
              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                Append <code className="text-zinc-300 font-mono">?utm_source=...&amp;utm_campaign=...</code> to your share URLs to measure campaign ROI.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {utmCampaigns.map((u, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#0e0f15] border border-white/[0.06] hover:border-white/[0.12] rounded-lg flex items-center justify-between text-xs transition"
                >
                  <div className="space-y-1 min-w-0 pr-3">
                    <span className="font-medium text-white block font-mono truncate" title={u.campaign}>
                      {u.campaign}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                        {u.source || "direct"}
                      </span>
                      <span className="text-zinc-500">&bull;</span>
                      <span>{u.medium || "organic"}</span>
                    </div>
                  </div>
                  <div className="text-right font-mono shrink-0">
                    <span className="font-semibold text-white tabular-nums block">
                      {u.views.toLocaleString()} views
                    </span>
                    <span className="text-[11px] text-zinc-500 tabular-nums block">
                      {u.visitors.toLocaleString()} users &bull; {formatDuration(u.avgDuration)}
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
