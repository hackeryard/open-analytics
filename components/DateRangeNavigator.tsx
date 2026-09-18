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
      <div className="flex items-center bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition shadow-xs">
        <button
          type="button"
          onClick={handlePrevDay}
          className="p-1 sm:p-1.5 text-muted-foreground hover:text-white transition cursor-pointer"
          title="Previous Window"
        >
          <ChevronLeft size={13} />
        </button>

        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:text-white transition cursor-pointer"
        >
          <Calendar size={13} className="text-cyan-400 shrink-0" />
          <span className="truncate max-w-[85px] xs:max-w-[110px] sm:max-w-[140px]">{currentLabel}</span>
          <ChevronDown size={11} className={`text-muted-foreground shrink-0 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
        </button>

        <button
          type="button"
          onClick={handleNextDay}
          disabled={isToday && isSingleDayMode}
          className="p-1 sm:p-1.5 text-muted-foreground hover:text-white transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next Window"
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Dropdown Popover */}
      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-64 glass-card border border-white/[0.12] rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
          <div className="px-2.5 py-1.5 border-b border-white/[0.07] flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            <span>Select Timeframe</span>
            <span className="text-[9px] font-mono text-cyan-400 font-bold">
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
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                    isSelected
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                      : "text-slate-300 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{p.label}</span>
                    <span className="text-[10px] text-muted-foreground font-normal">{p.desc}</span>
                  </div>
                  {p.proOnly ? (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 uppercase font-bold tracking-wider">
                      PRO
                    </span>
                  ) : isSelected ? (
                    <Check size={13} className="text-cyan-400 shrink-0" />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="pt-1.5 border-t border-white/[0.07]">
            <button
              type="button"
              onClick={() => {
                setShowDropdown(false);
                setShowCustomModal(true);
              }}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold text-cyan-400 hover:bg-cyan-500/10 transition cursor-pointer"
            >
              <span>Custom Date Range…</span>
              <Sparkles size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Custom Date Range Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowCustomModal(false)} />
          <div className="relative max-w-sm w-full glass-card border border-white/[0.12] rounded-3xl p-6 shadow-2xl space-y-5 z-10 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-cyan-400" />
                <h3 className="text-sm font-black text-white">Custom Date Range</h3>
              </div>
              <button onClick={() => setShowCustomModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-center justify-between">
              <span>{isPro ? "Pro plan includes 1-year history" : "Free plan includes 30-day history"}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 uppercase font-bold tracking-wider">
                {isPro ? "365 DAYS" : "30 DAYS MAX"}
              </span>
            </div>

            <form onSubmit={handleApplyCustom} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">Start Date (UTC)</label>
                <input
                  type="date"
                  min={minAllowedDate}
                  max={today}
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080d19] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">End Date (UTC)</label>
                <input
                  type="date"
                  min={minAllowedDate}
                  max={today}
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080d19] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[11px] text-muted-foreground flex items-center justify-between font-mono">
                <span>Selected Window:</span>
                <span className="text-cyan-400 font-bold">{daysCount} Days</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md cursor-pointer"
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
