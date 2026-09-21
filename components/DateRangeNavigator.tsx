"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import {
  getTodayString,
  getYesterdayString,
  offsetDateString,
  formatDayLabel,
  formatRangeLabel,
} from "@/lib/analyticsTypes";

export default function DateRangeNavigator({
  value,
  onChange,
  plan = "free",
  className = "",
}: {
  value: string;
  onChange: (val: string) => void;
  plan?: string;
  className?: string;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isPro = plan === "pro" || plan === "enterprise";
  const today = getTodayString();
  const yesterday = getYesterdayString();
  const minAllowedDate = offsetDateString(today, isPro ? -365 : -30);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // Determine current active single date
  let activeSingleDate = today;
  if (value.startsWith("date:")) {
    activeSingleDate = value.replace("date:", "");
  } else if (value === "yesterday") {
    activeSingleDate = yesterday;
  } else if (value === "today" || value === "24h") {
    activeSingleDate = today;
  }

  // Custom date range inputs
  const isCustomRange = value.startsWith("custom:");
  const customParts = useMemo(
    () => (isCustomRange ? value.replace("custom:", "").split("_") : [offsetDateString(today, -6), today]),
    [isCustomRange, value, today]
  );
  const [customStart, setCustomStart] = useState(customParts[0] || offsetDateString(today, -6));
  const [customEnd, setCustomEnd] = useState(customParts[1] || today);

  // Sync inputs whenever modal opens or value changes
  useEffect(() => {
    if (showCustomModal) {
      setCustomStart(customParts[0] || offsetDateString(today, -6));
      setCustomEnd(customParts[1] || today);
    }
  }, [showCustomModal, customParts, today]);

  // Close custom modal on Escape
  useEffect(() => {
    if (!showCustomModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowCustomModal(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showCustomModal]);

  const daysCount = useMemo(() => {
    if (!customStart || !customEnd) return 0;
    const t1 = new Date(customStart).getTime();
    const t2 = new Date(customEnd).getTime();
    return Math.max(1, Math.round(Math.abs(t2 - t1) / (1000 * 60 * 60 * 24)) + 1);
  }, [customStart, customEnd]);

  // Format current label for trigger button
  const currentLabel = useMemo(() => {
    switch (value) {
      case "today":
        return "Today";
      case "yesterday":
        return "Yesterday";
      case "24h":
        return "Past 24 Hours";
      case "7d":
        return "Past 7 Days";
      case "30d":
        return "Past 30 Days";
      case "90d":
        return isPro ? "Past 90 Days" : "Past 30 Days (Free)";
      case "1y":
      case "365d":
      case "all":
        return isPro ? "Past 365 Days" : "Past 30 Days (Free)";
      default:
        if (value.startsWith("date:")) {
          return formatDayLabel(value.replace("date:", ""));
        }
        if (value.startsWith("custom:")) {
          const parts = value.replace("custom:", "").split("_");
          return formatRangeLabel(parts[0], parts[1] || parts[0]);
        }
        return value;
    }
  }, [value, isPro]);

  const isToday = activeSingleDate >= today;
  const isSingleDayMode = value.startsWith("date:") || value === "today" || value === "yesterday";

  const handlePrevDay = () => {
    if (isCustomRange && customParts.length === 2) {
      const t1 = new Date(customParts[0]).getTime();
      const t2 = new Date(customParts[1]).getTime();
      const spanDays = Math.max(1, Math.round(Math.abs(t2 - t1) / (1000 * 60 * 60 * 24)));
      const newStart = offsetDateString(customParts[0], -spanDays);
      const newEnd = offsetDateString(customParts[1], -spanDays);
      onChange(`custom:${newStart}_${newEnd}`);
      return;
    }
    const prev = offsetDateString(activeSingleDate, -1);
    if (prev === yesterday) {
      onChange("yesterday");
    } else {
      onChange(`date:${prev}`);
    }
  };

  const handleNextDay = () => {
    if (isToday && isSingleDayMode) return;
    if (isCustomRange && customParts.length === 2) {
      const t1 = new Date(customParts[0]).getTime();
      const t2 = new Date(customParts[1]).getTime();
      const spanDays = Math.max(1, Math.round(Math.abs(t2 - t1) / (1000 * 60 * 60 * 24)));
      let newStart = offsetDateString(customParts[0], spanDays);
      let newEnd = offsetDateString(customParts[1], spanDays);
      if (newEnd > today) {
        const diff = Math.round((new Date(newEnd).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
        newStart = offsetDateString(newStart, -diff);
        newEnd = today;
      }
      onChange(`custom:${newStart}_${newEnd}`);
      return;
    }
    const next = offsetDateString(activeSingleDate, 1);
    if (next >= today) {
      onChange("today");
    } else if (next === yesterday) {
      onChange("yesterday");
    } else {
      onChange(`date:${next}`);
    }
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStart || !customEnd) return;
    let start = customStart <= customEnd ? customStart : customEnd;
    const end = customStart <= customEnd ? customEnd : customStart;
    if (start < minAllowedDate) {
      start = minAllowedDate;
    }
    if (start === end) {
      if (start === today) onChange("today");
      else if (start === yesterday) onChange("yesterday");
      else onChange(`date:${start}`);
    } else {
      onChange(`custom:${start}_${end}`);
    }
    setShowCustomModal(false);
    setShowDropdown(false);
  };

  const presets = [
    { id: "today", label: "Today", desc: "Since midnight", proOnly: false },
    { id: "yesterday", label: "Yesterday", desc: "Previous full day", proOnly: false },
    { id: "24h", label: "Past 24 Hours", desc: "Rolling 24h window", proOnly: false },
    { id: "7d", label: "Past 7 Days", desc: "Previous week", proOnly: false },
    { id: "30d", label: "Past 30 Days", desc: isPro ? "Previous month" : "Max free tier retention", proOnly: false },
    {
      id: "90d",
      label: "Past 90 Days",
      desc: isPro ? "Previous quarter" : "Clamped to 30d on Free",
      proOnly: !isPro,
    },
    {
      id: "365d",
      label: "Past 365 Days",
      desc: isPro ? "Complete 1-year telemetry" : "Clamped to 30d on Free",
      proOnly: !isPro,
    },
  ];

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Sleek Trigger Button */}
      <div className="flex items-center bg-[#111218] hover:bg-[#14161f] border border-white/[0.08] rounded-xl transition shadow-xs">
        <button
          type="button"
          onClick={handlePrevDay}
          className="p-1 sm:p-1.5 text-zinc-400 hover:text-white transition cursor-pointer"
          title="Previous Window"
        >
          <ChevronLeft size={13} />
        </button>

        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white transition cursor-pointer"
        >
          <Calendar size={13} className="text-zinc-400 shrink-0" />
          <span className="truncate max-w-[85px] xs:max-w-[110px] sm:max-w-[140px] font-mono">{currentLabel}</span>
          <ChevronDown size={11} className={`text-zinc-500 shrink-0 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
        </button>

        <button
          type="button"
          onClick={handleNextDay}
          disabled={isToday && isSingleDayMode}
          className="p-1 sm:p-1.5 text-zinc-400 hover:text-white transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next Window"
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Dropdown Popover */}
      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-[calc(100vw-1.5rem)] max-w-xs sm:w-64 bg-[#111218] border border-white/[0.08] rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
          <div className="px-2.5 py-1.5 border-b border-white/[0.06] flex items-center justify-between text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
            <span>Select Timeframe</span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              {isPro ? "1-Yr Retention" : "30-Day Retention"}
            </span>
          </div>

          <div className="space-y-0.5">
            {presets.map((p) => {
              const isSelected = value === p.id || (p.id === "365d" && (value === "all" || value === "1y"));
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onChange(p.id);
                    setShowDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    isSelected
                      ? "bg-white/[0.1] text-white shadow-xs"
                      : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{p.label}</span>
                    <span className="text-[10px] text-zinc-500 font-normal">{p.desc}</span>
                  </div>
                  {p.proOnly ? (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase font-semibold">
                      PRO
                    </span>
                  ) : isSelected ? (
                    <Check size={13} className="text-emerald-400 shrink-0" />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="pt-1.5 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => {
                setShowDropdown(false);
                setShowCustomModal(true);
              }}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.04] transition cursor-pointer"
            >
              <span>Custom Date Range…</span>
              <Calendar size={12} className="text-zinc-400" />
            </button>
          </div>
        </div>
      )}

      {/* Custom Date Range Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setShowCustomModal(false)} />
          <div className="relative max-w-sm w-full bg-[#111218] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-5 z-10 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-white" />
                <h3 className="text-sm font-bold text-white tracking-tight">Custom Date Range</h3>
              </div>
              <button onClick={() => setShowCustomModal(false)} className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0e0f15] border border-white/[0.06] text-[11px] text-zinc-400 flex items-center justify-between font-mono">
              <span>{isPro ? "Pro plan includes 1-year history" : "Free plan includes 30-day history"}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold">
                {isPro ? "365 DAYS" : "30 DAYS"}
              </span>
            </div>

            <form onSubmit={handleApplyCustom} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-semibold block">Start Date (UTC)</label>
                <input
                  type="date"
                  min={minAllowedDate}
                  max={today}
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e0f15] border border-white/[0.08] text-xs text-white focus:outline-hidden focus:border-white/40 focus:ring-1 focus:ring-white/20 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-semibold block">End Date (UTC)</label>
                <input
                  type="date"
                  min={minAllowedDate}
                  max={today}
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e0f15] border border-white/[0.08] text-xs text-white focus:outline-hidden focus:border-white/40 focus:ring-1 focus:ring-white/20 transition"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#0e0f15] border border-white/[0.06] text-[11px] text-zinc-400 flex items-center justify-between font-mono">
                <span>Selected Window:</span>
                <span className="text-white font-bold tabular-nums">{daysCount} Days</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#14161f] hover:bg-[#181922] text-zinc-300 font-medium text-xs border border-white/[0.08] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition shadow-sm cursor-pointer active:scale-[0.98]"
                >
                  Apply Range
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
