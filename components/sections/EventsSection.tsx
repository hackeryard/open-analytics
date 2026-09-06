"use client";

import React, { useState } from "react";
import {
  Zap,
  Search,
  Filter,
  Tag,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData, formatExactTime, formatExactDate, timeAgo } from "@/lib/analyticsTypes";

export default function EventsSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData } = usePlatform();
  const data = propData || platformData;

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  if (!data) return null;

  const filteredEvents = (data?.recentEvents || []).filter(
    (evt) =>
      !searchQuery ||
      evt.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.pathname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.labId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Custom Lab Actions & Learning Milestones
            </h3>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              Showing {filteredEvents.length} events
            </span>
          </div>

          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-12">
                No custom events recorded matching criteria.
              </p>
            ) : (
              filteredEvents.map((evt) => (
                <div
                  key={evt._id}
                  className="p-4 bg-muted/20 border border-border rounded-2xl space-y-2 hover:border-border/80 transition"
                >
                  {/* Event Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold font-mono text-xs">
                        {evt.eventName}
                      </span>

                      {evt.labId && (
                        <span className="px-2 py-0.5 bg-muted text-foreground rounded-lg font-mono text-[11px] font-bold">
                          {evt.labId}
                        </span>
                      )}

                      {evt.pathname && (
                        <a
                          href={String(evt.pathname)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-0.5"
                        >
                          <span>{evt.pathname}</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>

                    {/* Exact Timestamp */}
                    <div className="text-right shrink-0">
                      <div className="font-mono text-xs font-bold text-foreground flex items-center gap-1 justify-end">
                        <Clock size={11} className="text-primary" />
                        <span>{formatExactTime(evt.createdAt)}</span>
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        <span>{timeAgo(evt.createdAt)}</span> &bull; <span>{formatExactDate(evt.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* User info if available */}
                  {evt.userId && (
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <span>User: {evt.userId.name || evt.userId.email}</span>
                      {evt.userId.username && (
                        <span className="text-muted-foreground font-mono text-[11px]">
                          (@{evt.userId.username})
                        </span>
                      )}
                      {evt.userId.level && (
                        <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1 rounded text-[10px] font-mono">
                          Lvl {evt.userId.level}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Properties JSON toggle */}
                  {evt.properties && Object.keys(evt.properties).length > 0 && (
                    <div>
                      <button
                        onClick={() =>
                          setExpandedEventId(expandedEventId === evt._id ? null : evt._id)
                        }
                        className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>
                          {expandedEventId === evt._id ? "Hide Event Payload" : "View Event Payload"}
                        </span>
                        {expandedEventId === evt._id ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                      </button>

                      {expandedEventId === evt._id && (
                        <pre className="mt-2 p-3 bg-black/90 text-emerald-400 text-[10px] font-mono rounded-xl overflow-x-auto border border-emerald-500/20 leading-relaxed">
                          {JSON.stringify(evt.properties, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

  );
}
