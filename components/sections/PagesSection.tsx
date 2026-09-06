"use client";

import React, { useState } from "react";
import {
  Layers,
  Search,
  Eye,
  Clock,
  BarChart3,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData, formatDuration } from "@/lib/analyticsTypes";

export default function PagesSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData } = usePlatform();
  const data = propData || platformData;

  const [searchQuery, setSearchQuery] = useState("");

  if (!data) return null;

  return (
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Most Visited Lab Routes & Pages
            </h3>
            <span className="text-xs font-bold text-foreground font-mono">
              Top {data.topPages.length} Pages
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3.5">Route / Page Title Path</th>
                  <th className="p-3.5 text-right">Total Views</th>
                  <th className="p-3.5 text-right">Unique Visitors</th>
                  <th className="p-3.5 text-right">Avg Dwell Time</th>
                  <th className="p-3.5 text-right">Avg Scroll Depth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.topPages.map((page, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition">
                    <td className="p-3.5">
                      <a
                        href={String(page.pathname)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-foreground hover:text-primary flex items-center gap-1.5 font-mono"
                      >
                        <span>{page.pathname}</span>
                        <ExternalLink size={11} className="text-muted-foreground" />
                      </a>
                      {page.title && page.title !== page.pathname && (
                        <span className="text-[11px] text-muted-foreground block truncate max-w-md">
                          {page.title}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-black font-mono text-foreground">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-mono text-muted-foreground">
                      {page.visitors.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {formatDuration(page.avgDuration)}
                    </td>
                    <td className="p-3.5 text-right font-mono text-muted-foreground">
                      {page.avgScrollDepth}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

  );
}
