"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Globe,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link2,
  Unlink,
  Layers,
  ArrowUpRight,
  Filter,
  Check,
  Zap,
  Bot,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

interface GscDashboardViewProps {
  onSwitchToStrategies?: () => void;
}

export default function GscDashboardView({ onSwitchToStrategies }: GscDashboardViewProps) {
  const { activeProjectId, activeProject } = usePlatform();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [integration, setIntegration] = useState<any>(null);
  const [sites, setSites] = useState<any[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [showSitePicker, setShowSitePicker] = useState(false);
  const [activeTab, setActiveTab] = useState<"queries" | "pages" | "devices" | "countries">("queries");
  const [queryFilter, setQueryFilter] = useState("");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isPro =
    activeProject?.effectivePlan === "pro" ||
    activeProject?.effectivePlan === "enterprise" ||
    activeProject?.plan === "pro" ||
    activeProject?.plan === "enterprise";

  const fetchGscData = async () => {
    if (!activeProjectId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/integrations/gsc`);
      const data = await res.json();
      if (res.ok) {
        setIntegration(data.integration);
        setSelectedSite(data.siteUrl || "");
      }
    } catch (err: any) {
      console.error("Failed to load GSC data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGscData();
  }, [activeProjectId]);

  const handleInitiateOAuth = async () => {
    if (!activeProjectId) return;
    setConnecting(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/integrations/gsc/auth`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to initiate Google OAuth. Verify credentials or try demo mode.",
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setConnecting(false);
    }
  };

  const handleSync = async () => {
    if (!activeProjectId) return;
    setSyncing(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/integrations/gsc/sync`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: "success", text: "Search Console data synced successfully." });
        await fetchGscData();
      } else {
        setStatusMessage({ type: "error", text: data.error || "Sync failed. Ensure your property is verified and permissions are granted." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Sync failed" });
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!activeProjectId || !confirm("Disconnect Google Search Console for this project?")) return;
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/integrations/gsc`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIntegration(null);
        setSelectedSite("");
        setStatusMessage({ type: "success", text: "Google Search Console disconnected." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Disconnect error" });
    }
  };

  const isConnected = integration && integration.status === "connected";
  const metrics = integration?.metrics || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  const topQueries = integration?.topQueries || [];
  const topPages = integration?.topPages || [];
  const devices = integration?.devices || [];
  const countries = integration?.countries || [];

  // Striking distance opportunities: Position 4.0 - 20.0 with high impressions
  const strikingDistance = topQueries.filter(
    (q: any) => q.position >= 4 && q.position <= 20 && q.impressions >= 15
  );

  const filteredQueries = topQueries.filter((q: any) =>
    q.query.toLowerCase().includes(queryFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Status banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
              : "bg-red-500/10 border-red-500/20 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-zinc-400 hover:text-white transition"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Integration Control Bar */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Search size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">Google Search Console</h3>
              {isConnected ? (
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Connected
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] uppercase font-semibold rounded-full bg-zinc-800 text-zinc-400 border border-white/[0.06]">
                  Not Connected
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              {isConnected
                ? `Property: ${integration?.siteUrl || "Active"} | Synced: ${
                    integration?.lastSyncAt
                      ? new Date(integration.lastSyncAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
                      : "Never"
                  }`
                : "Connect your verified Google Search Console property to pull organic search keywords and CTR"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {isConnected ? (
            <>
              <button
                onClick={handleSync}
                disabled={syncing}
                className="py-2 px-3.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={13} className={syncing ? "animate-spin" : ""} />
                <span>{syncing ? "Syncing..." : "Sync Now"}</span>
              </button>

              <button
                onClick={handleDisconnect}
                className="py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-semibold text-red-300 transition flex items-center gap-1 cursor-pointer"
                title="Disconnect Google Search Console"
              >
                <Unlink size={13} />
                <span>Disconnect</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleInitiateOAuth}
              disabled={connecting}
              className="py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Link2 size={14} />
              <span>{connecting ? "Connecting..." : "Connect Search Console"}</span>
            </button>
          )}

          {onSwitchToStrategies && (
            <button
              onClick={onSwitchToStrategies}
              className="py-2 px-3.5 rounded-lg bg-gradient-to-r from-amber-400/20 to-cyan-400/20 hover:from-amber-400/30 hover:to-cyan-400/30 border border-amber-400/30 text-amber-300 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>View Generated Strategies</span>
            </button>
          )}
        </div>
      </div>

      {/* Top 4 GSC Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Search Clicks</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tabular-nums text-white">
            {(metrics.clicks || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">Organic Google clicks ({metrics.dateRangeLabel || "28 days"})</p>
        </div>

        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Search Impressions</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Globe size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tabular-nums text-white">
            {(metrics.impressions || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">Total Google SERP impressions</p>
        </div>

        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Average CTR</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tabular-nums text-white">
            {metrics.ctr || 0}%
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">Click-through rate from search</p>
        </div>

        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Average Position</span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Search size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tabular-nums text-white">
            #{metrics.position || 0}
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">Average ranking on Google search</p>
        </div>
      </div>

      {/* Striking Distance Opportunities Spotlight */}
      {strikingDistance.length > 0 && (
        <div className="bg-[#111218] border border-amber-500/20 rounded-xl p-5 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Sparkles size={14} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Striking Distance Keywords (Positions 4–20)</h4>
                <p className="text-xs text-zinc-400">High-impression keywords that can reach page 1 top 3 with on-page optimization</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 tabular-nums">
              {strikingDistance.length} Quick Wins Detected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {strikingDistance.slice(0, 6).map((q: any) => (
              <div
                key={q.query}
                className="p-3 rounded-lg bg-[#0e0f15] border border-white/[0.06] space-y-2 hover:border-amber-400/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white truncate max-w-[180px]">{q.query}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    Pos #{q.position}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>{(q.impressions || 0).toLocaleString()} impressions</span>
                  <span className="text-white font-semibold">{q.ctr}% CTR</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Console Breakdown Views */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-xl overflow-hidden shadow-xs">
        {/* Tab Header */}
        <div className="p-4 border-b border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0e0f15]">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#111218] border border-white/[0.06]">
            <button
              onClick={() => setActiveTab("queries")}
              className={`py-1.5 px-3 rounded-md text-xs font-semibold transition ${
                activeTab === "queries"
                  ? "bg-white text-zinc-950 shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Search Queries ({topQueries.length})
            </button>
            <button
              onClick={() => setActiveTab("pages")}
              className={`py-1.5 px-3 rounded-md text-xs font-semibold transition ${
                activeTab === "pages"
                  ? "bg-white text-zinc-950 shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Landing Pages ({topPages.length})
            </button>
            <button
              onClick={() => setActiveTab("devices")}
              className={`py-1.5 px-3 rounded-md text-xs font-semibold transition ${
                activeTab === "devices"
                  ? "bg-white text-zinc-950 shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Devices ({devices.length})
            </button>
            <button
              onClick={() => setActiveTab("countries")}
              className={`py-1.5 px-3 rounded-md text-xs font-semibold transition ${
                activeTab === "countries"
                  ? "bg-white text-zinc-950 shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Countries ({countries.length})
            </button>
          </div>

          {activeTab === "queries" && (
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Filter search queries..."
                value={queryFilter}
                onChange={(e) => setQueryFilter(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#111218] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-white/[0.2]"
              />
            </div>
          )}
        </div>

        {/* Tab Content: Queries */}
        {activeTab === "queries" && (
          <div className="overflow-x-auto">
            {filteredQueries.length === 0 ? (
              <div className="p-12 text-center text-zinc-400 space-y-2">
                <Search className="w-8 h-8 mx-auto text-zinc-500 opacity-50" />
                <p className="text-sm font-semibold text-white">No search queries found</p>
                <p className="text-xs">Connect your Google Search Console property and click Sync Now to load organic search telemetry.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold border-b border-white/[0.08] bg-[#0e0f15]">
                  <tr>
                    <th className="py-3 px-4">Search Query Keyword</th>
                    <th className="py-3 px-4 text-right">Clicks</th>
                    <th className="py-3 px-4 text-right">Impressions</th>
                    <th className="py-3 px-4 text-right">CTR</th>
                    <th className="py-3 px-4 text-right">Avg Position</th>
                    <th className="py-3 px-4 text-center">Opportunity Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] font-mono">
                  {filteredQueries.map((q: any, idx: number) => {
                    const isStriking = q.position >= 4 && q.position <= 20;
                    const isDominant = q.position <= 3;
                    return (
                      <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">
                          <span className="hover:text-blue-400 transition">{q.query}</span>
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-white font-semibold">
                          {(q.clicks || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-zinc-400">
                          {(q.impressions || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-zinc-300">
                          {q.ctr}%
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-white font-semibold">
                          #{q.position}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isDominant ? (
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Top 3 Dominant
                            </span>
                          ) : isStriking ? (
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                              Striking Distance
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-medium bg-zinc-800 text-zinc-400 border border-white/[0.06]">
                              Page 2+
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab Content: Landing Pages */}
        {activeTab === "pages" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold border-b border-white/[0.08] bg-[#0e0f15]">
                <tr>
                  <th className="py-3 px-4">Landing Page URL</th>
                  <th className="py-3 px-4 text-right">Clicks</th>
                  <th className="py-3 px-4 text-right">Impressions</th>
                  <th className="py-3 px-4 text-right">CTR</th>
                  <th className="py-3 px-4 text-right">Avg Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] font-mono">
                {topPages.map((p: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white max-w-md truncate">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{p.page}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-white font-semibold">
                      {(p.clicks || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-zinc-400">
                      {(p.impressions || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-zinc-300">
                      {p.ctr}%
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-white font-semibold">
                      #{p.position}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content: Devices */}
        {activeTab === "devices" && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {devices.map((d: any) => {
              const icon =
                d.device.toLowerCase() === "mobile" ? (
                  <Smartphone size={18} />
                ) : d.device.toLowerCase() === "tablet" ? (
                  <Tablet size={18} />
                ) : (
                  <Laptop size={18} />
                );

              return (
                <div
                  key={d.device}
                  className="p-4 rounded-xl bg-[#0e0f15] border border-white/[0.06] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-zinc-300">
                        {icon}
                      </div>
                      <span className="text-sm font-semibold capitalize text-white">{d.device}</span>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">Pos #{d.position}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
                    <div className="p-2 rounded bg-[#111218]">
                      <span className="text-[10px] text-zinc-500 uppercase block">Clicks</span>
                      <span className="text-sm font-semibold text-white">{d.clicks}</span>
                    </div>
                    <div className="p-2 rounded bg-[#111218]">
                      <span className="text-[10px] text-zinc-500 uppercase block">Impr</span>
                      <span className="text-sm font-semibold text-white">{d.impressions}</span>
                    </div>
                    <div className="p-2 rounded bg-[#111218]">
                      <span className="text-[10px] text-zinc-500 uppercase block">CTR</span>
                      <span className="text-sm font-semibold text-emerald-400">{d.ctr}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab Content: Countries */}
        {activeTab === "countries" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold border-b border-white/[0.08] bg-[#0e0f15]">
                <tr>
                  <th className="py-3 px-4">Country Region</th>
                  <th className="py-3 px-4 text-right">Clicks</th>
                  <th className="py-3 px-4 text-right">Impressions</th>
                  <th className="py-3 px-4 text-right">CTR</th>
                  <th className="py-3 px-4 text-right">Avg Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] font-mono">
                {countries.map((c: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      <span>{c.country}</span>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-white font-semibold">
                      {(c.clicks || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-zinc-400">
                      {(c.impressions || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-zinc-300">
                      {c.ctr}%
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-white font-semibold">
                      #{c.position}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
