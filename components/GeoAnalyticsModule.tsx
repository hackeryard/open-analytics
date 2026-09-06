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
        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Territories Active</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Globe size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {kpis.totalCountries.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted-foreground">Countries & sovereign regions</p>
        </div>

        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Primary Market</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Flag size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-foreground truncate">
            {kpis.topCountry.name}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {kpis.topCountry.percentage}% of all traffic ({kpis.topCountry.count.toLocaleString()} hits)
          </p>
        </div>

        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">International Share</span>
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Compass size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {kpis.internationalPercentage}%
          </div>
          <p className="text-[11px] text-muted-foreground">Traffic originating outside top market</p>
        </div>

        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Metro Cities Active</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Building2 size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">
            {topCities.length.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted-foreground">Distinct metropolitan centers</p>
        </div>
      </div>

      {/* Interactive SVG World Atlas */}
      <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Interactive Global Atlas</h3>
            <p className="text-xs text-muted-foreground">Vector SVG visualization of worldwide audience concentration</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
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
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Top Countries & Regions</h3>
              <p className="text-xs text-muted-foreground">Traffic volume breakdown by country</p>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {countries.length} regions
            </span>
          </div>

          <div className="space-y-3">
            {countries.slice(0, 10).map((c) => (
              <div
                key={c.country}
                onClick={() => setSelectedCountry(c.country === selectedCountry ? null : c.country)}
                className={`p-3 bg-muted/20 border rounded-2xl transition cursor-pointer space-y-2 ${
                  selectedCountry === c.country ? "border-primary bg-primary/5" : "border-border/80 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-foreground">{c.country}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground">{c.count.toLocaleString()} views</span>
                    <span className="text-[11px] font-mono text-cyan-400 ml-2">({c.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
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
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Top Metropolitan Areas</h3>
                <p className="text-xs text-muted-foreground">City-level visitor clusters</p>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {topCities.length} cities
              </span>
            </div>

            <div className="space-y-2.5">
              {topCities.slice(0, 8).map((city, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-muted/20 border border-border/80 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-cyan-400" />
                    <span className="text-sm font-bold text-foreground">{city.city || "Unknown City"}</span>
                    <span className="text-xs text-muted-foreground">({city.country})</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-foreground">
                    {city.count.toLocaleString()}{" "}
                    <span className="text-xs text-muted-foreground font-normal">({city.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continents */}
          {continents.length > 0 && (
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-foreground">Continental Distribution</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {continents.map((cont) => (
                  <div key={cont.continent} className="p-3 bg-muted/20 border border-border/80 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-muted-foreground block">{cont.continent}</span>
                    <span className="text-lg font-black text-foreground block">{cont.count.toLocaleString()}</span>
                    <span className="text-[11px] font-mono text-cyan-400 block">{cont.percentage}%</span>
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