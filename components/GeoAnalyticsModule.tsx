"use client";

import React, { useState } from "react";
import { Globe, MapPin, Compass, Navigation, TrendingUp, Sparkles, Building2, Flag } from "lucide-react";
import WorldMapAnalytics from "@/components/WorldMapAnalytics";

interface GeoAnalyticsModuleProps {
  countries?: Array<{
    country: string;
    count: number;
    percentage: number;
  }>;
  topCities?: Array<{
    city: string;
    country: string;
    count: number;
    percentage: number;
  }>;
  continents?: Array<{
    continent: string;
    count: number;
    percentage: number;
  }>;
  geoKpis?: {
    totalCountries: number;
    topCountry: {
      code: string;
      name: string;
      count: number;
      percentage: number;
    };
    internationalPercentage: number;
  };
  totalViews?: number;
}

export default function GeoAnalyticsModule({
  countries = [],
  topCities = [],
  continents = [],
  geoKpis,
  totalViews = 0,
}: GeoAnalyticsModuleProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const kpis = geoKpis || {
    totalCountries: countries.length,
    topCountry: {
      code: countries[0]?.country || "N/A",
      name: countries[0]?.country || "None",
      count: countries[0]?.count || 0,
      percentage: countries[0]?.percentage || 0,
    },
    internationalPercentage: 0,
  };

  return (
    <div className="space-y-6">
      {/* Top GEO KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Territories Active</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Globe size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tabular-nums text-white">
            {kpis.totalCountries.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400">Countries &amp; sovereign regions</p>
        </div>

        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Primary Market</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Flag size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-white truncate">
            {kpis.topCountry.name}
          </div>
          <p className="text-[11px] text-zinc-400 font-mono tabular-nums">
            {kpis.topCountry.percentage}% of all traffic ({kpis.topCountry.count.toLocaleString()} hits)
          </p>
        </div>

        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">International Share</span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Compass size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tabular-nums text-white">
            {kpis.internationalPercentage}%
          </div>
          <p className="text-[11px] text-zinc-400">Traffic originating outside top market</p>
        </div>

        <div className="p-4 bg-[#111218] border border-white/[0.08] rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Metro Cities Active</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Building2 size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold tabular-nums text-white">
            {topCities.length.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400">Distinct metropolitan centers</p>
        </div>
      </div>

      {/* Interactive SVG World Atlas */}
      <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Interactive Global Atlas</h3>
            <p className="text-xs text-zinc-400">Vector SVG visualization of worldwide audience concentration</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/[0.06] text-zinc-300 border border-white/[0.08] font-mono">
            Hover to Inspect
          </span>
        </div>

        <WorldMapAnalytics
          countries={countries as any}
          totalViews={totalViews}
          selectedCountryCode={selectedCountry}
          onSelectCountry={(code) => setSelectedCountry(code)}
        />
      </div>

      {/* Country & City Rankings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Rankings Table */}
        <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Top Countries &amp; Regions</h3>
              <p className="text-xs text-zinc-400">Traffic volume breakdown by country</p>
            </div>
            <span className="text-xs text-zinc-400 font-mono tabular-nums">
              {countries.length} regions
            </span>
          </div>

          <div className="space-y-2.5">
            {countries.slice(0, 10).map((c) => (
              <div
                key={c.country}
                onClick={() => setSelectedCountry(c.country === selectedCountry ? null : c.country)}
                className={`p-3 bg-[#0e0f15] border rounded-lg transition-colors cursor-pointer space-y-2 ${
                  selectedCountry === c.country ? "border-white/30 bg-white/[0.04]" : "border-white/[0.06] hover:border-white/[0.14]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-white">{c.country}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-sm font-semibold tabular-nums text-white">{c.count.toLocaleString()} views</span>
                    <span className="text-[11px] tabular-nums text-zinc-400 ml-2">({c.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#181922] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${Math.max(4, c.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cities & Continents */}
        <div className="space-y-6">
          {/* Top Cities */}
          <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Top Metropolitan Areas</h3>
                <p className="text-xs text-zinc-400">City-level visitor clusters</p>
              </div>
              <span className="text-xs text-zinc-400 font-mono tabular-nums">
                {topCities.length} cities
              </span>
            </div>

            <div className="space-y-2">
              {topCities.slice(0, 8).map((city, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-[#0e0f15] border border-white/[0.06] rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-zinc-400" />
                    <span className="text-sm font-semibold text-white">{city.city || "Unknown City"}</span>
                    <span className="text-xs text-zinc-400">({city.country})</span>
                  </div>
                  <div className="text-sm font-mono font-semibold tabular-nums text-white">
                    {city.count.toLocaleString()}{" "}
                    <span className="text-xs text-zinc-400 font-normal">({city.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continents */}
          {continents.length > 0 && (
            <div className="bg-[#111218] border border-white/[0.08] rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-semibold text-white">Continental Distribution</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {continents.map((cont) => (
                  <div key={cont.continent} className="p-3 bg-[#0e0f15] border border-white/[0.06] rounded-lg space-y-1">
                    <span className="text-xs font-semibold text-zinc-400 block">{cont.continent}</span>
                    <span className="text-lg font-semibold tabular-nums text-white block">{cont.count.toLocaleString()}</span>
                    <span className="text-[11px] font-mono tabular-nums text-zinc-400 block">{cont.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}