"use client";

import WorldMapAnalytics from "@/components/WorldMapAnalytics";

import React, { useState } from "react";
import {
  Globe,
  Laptop,
  Smartphone,
  Tablet,
  Activity,
  Layers,
  Sparkles,
  PieChart,
  X,
  MapPin,
  TrendingUp,
  Compass,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData } from "@/lib/analyticsTypes";
import { getFullCountryName, getCountryFlag, getContinentForCountry } from "@/lib/countries";

export default function TechSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData } = usePlatform();
  const data = propData || platformData;

  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string | null>(null);

  if (!data) return null;

  return (
        <div className="space-y-6">
          {/* Global Audience Geography & Geo Command Center */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                  <Globe className="text-primary" size={20} />
                  Global Audience Geography
                </h2>
                <p className="text-xs text-muted-foreground">
                  Live geographic density, sovereign nation distribution, and regional telemetry
                </p>
              </div>

              {selectedCountryFilter && (
                <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/25 text-xs font-bold text-primary">
                  <span>
                    {getFullCountryName(selectedCountryFilter)} ({selectedCountryFilter.toUpperCase()})
                  </span>
                  <button
                    onClick={() => setSelectedCountryFilter(null)}
                    className="p-1 rounded-md hover:bg-primary/20 transition-colors"
                    title="Clear geographic filter"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Geo KPI Metrics Banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {/* Nations Reached */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border shadow-sm flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <Globe size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-muted-foreground truncate">
                    Nations Reached
                  </div>
                  <div className="text-base sm:text-xl font-black text-foreground">
                    {data.geoKpis?.nationsCount ?? data.countries.length}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-muted-foreground truncate">Sovereign territories</div>
                </div>
              </div>

              {/* Top Country */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border shadow-sm flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Globe size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-muted-foreground truncate">
                    Top Country
                  </div>
                  <div className="text-xs sm:text-sm font-black text-foreground truncate">
                    {data.geoKpis?.topCountry?.name || "None"}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-muted-foreground font-mono truncate">
                    {data.geoKpis?.topCountry ? `${data.geoKpis.topCountry.count} views (${data.geoKpis.topCountry.percentage}%)` : "—"}
                  </div>
                </div>
              </div>

              {/* Top Active City */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border shadow-sm flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-muted-foreground truncate">
                    Top Active City
                  </div>
                  <div className="text-xs sm:text-sm font-black text-foreground truncate">
                    {data.geoKpis?.topCity?.name || "Global / Unknown"}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-muted-foreground truncate font-mono">
                    {data.geoKpis?.topCity ? `${data.geoKpis.topCity.count} views (${data.geoKpis.topCity.country})` : "—"}
                  </div>
                </div>
              </div>

              {/* International Traffic Share */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border shadow-sm flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <TrendingUp size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-muted-foreground truncate">
                    International Share
                  </div>
                  <div className="text-base sm:text-xl font-black text-foreground">
                    {data.geoKpis?.internationalRatio ?? 0}%
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-muted-foreground truncate">Traffic outside top nation</div>
                </div>
              </div>
            </div>

            {/* Vector Interactive World Map Component */}
            <WorldMapAnalytics
              countries={data.countries}
              totalViews={data.overview.totalViews}
              selectedCountryCode={selectedCountryFilter}
              onSelectCountry={(code) => setSelectedCountryFilter((prev) => (prev === code ? null : code))}
            />

            {/* Geographic Breakdown Cards: Top Countries, Top Cities, Continents */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Top Countries Leaderboard */}
              <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Globe size={13} className="text-primary" /> Top Countries ({data.countries.length})
                  </h3>
                  {selectedCountryFilter && (
                    <button
                      onClick={() => setSelectedCountryFilter(null)}
                      className="text-[10px] font-bold text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {data.countries.map((c, idx) => {
                    const isSelected = selectedCountryFilter === c.code;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedCountryFilter(isSelected ? null : c.code)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all ${isSelected
                          ? "bg-primary/15 border-primary text-foreground shadow-sm"
                          : "bg-muted/30 border-border hover:bg-muted/60 text-foreground"
                          }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="flex items-center gap-2 truncate">
                            <span className="px-1.5 py-0.5 rounded bg-muted/80 text-[10px] font-mono font-bold text-muted-foreground uppercase">{c.code}</span>
                            <span className="truncate">{c.country}</span>
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground shrink-0">
                            {c.count} ({c.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, c.percentage)}%` }}
                            className={`h-full rounded-full ${isSelected ? "bg-primary" : "bg-primary/70"}`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Top Cities Leaderboard */}
              <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <MapPin size={13} className="text-purple-500" /> Top Active Cities ({data.topCities?.length || 0})
                  </h3>
                  {selectedCountryFilter && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {selectedCountryFilter}
                    </span>
                  )}
                </div>
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {(!data.topCities || data.topCities.length === 0) ? (
                    <div className="text-center py-8 text-xs text-muted-foreground">
                      No city telemetry recorded yet
                    </div>
                  ) : (
                    data.topCities
                      .filter((city) => !selectedCountryFilter || city.countryCode === selectedCountryFilter)
                      .map((city, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-muted/30 border border-border space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1.5 truncate">
                              <span className="px-1 py-0.5 rounded bg-muted/80 text-[9px] font-mono font-bold text-muted-foreground uppercase">{city.countryCode || "—"}</span>
                              <span className="text-foreground truncate">{city.city}</span>
                              <span className="text-[10px] text-muted-foreground font-normal truncate">
                                ({city.country})
                              </span>
                            </span>
                            <span className="font-mono text-muted-foreground shrink-0 text-[11px]">
                              {city.count} views
                            </span>
                          </div>
                          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              style={{ width: `${Math.min(100, city.percentage)}%` }}
                              className="h-full bg-purple-500/70 rounded-full"
                            />
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Continents & Regional Distribution */}
              <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Compass size={13} className="text-emerald-500" /> Continents &amp; Regions
                </h3>
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {(!data.continents || data.continents.length === 0) ? (
                    <div className="text-center py-8 text-xs text-muted-foreground">
                      No continent data recorded yet
                    </div>
                  ) : (
                    data.continents.map((cont, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-muted/30 border border-border space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-foreground">{cont.continent}</span>
                          <span className="font-mono text-muted-foreground text-[11px]">
                            {cont.count} views ({cont.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, cont.percentage)}%` }}
                            className="h-full bg-emerald-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Client Systems & Diagnostics Section */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Laptop size={16} /> Client Hardware &amp; Environments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Device Types */}
              <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Device Split
                </h3>
                <div className="space-y-3">
                  {data.devices.map((d, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="capitalize text-foreground flex items-center gap-1.5">
                          {d.device === "mobile" ? (
                            <Smartphone size={14} />
                          ) : d.device === "tablet" ? (
                            <Tablet size={14} />
                          ) : (
                            <Laptop size={14} />
                          )}
                          {d.device}
                        </span>
                        <span>{d.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div style={{ width: `${d.percentage}%` }} className="h-full bg-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browsers */}
              <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Top Browsers
                </h3>
                <div className="space-y-2">
                  {data.browsers.map((b, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border text-xs font-bold"
                    >
                      <span className="text-foreground">{b.browser}</span>
                      <span className="font-mono text-muted-foreground">{b.count} views</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operating Systems */}
              <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Operating Systems
                </h3>
                <div className="space-y-2">
                  {data.operatingSystems.map((o, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border text-xs font-bold"
                    >
                      <span className="text-foreground">{o.os}</span>
                      <span className="font-mono text-muted-foreground">{o.count} views</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Screen Resolutions */}
              <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Screen Resolutions
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {(!data.screenResolutions || data.screenResolutions.length === 0) ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">
                      No screen data recorded yet
                    </div>
                  ) : (
                    data.screenResolutions.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border text-xs font-bold"
                      >
                        <span className="text-foreground font-mono">{s.screen || "Unknown"}</span>
                        <span className="font-mono text-muted-foreground text-[11px]">{s.count} views</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

  );
}
