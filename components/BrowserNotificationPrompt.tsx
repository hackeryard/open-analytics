"use client";

import React from "react";
import { Radio, X, Check, ShieldAlert } from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";

export default function BrowserNotificationPrompt() {
  const {
    browserNotificationsSupported,
    browserNotificationsPermission,
    showBrowserPermissionPrompt,
    requestBrowserNotificationPermission,
    dismissBrowserPermissionPrompt,
  } = usePlatform();

  if (
    !browserNotificationsSupported ||
    browserNotificationsPermission !== "default" ||
    !showBrowserPermissionPrompt
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)] sm:w-[420px] bg-[#080d1a] p-4 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
          <Radio size={18} className="animate-pulse" />
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black text-white tracking-wide flex items-center gap-1.5">
              <span>Enable Desktop Alerts</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </span>
            <button
              onClick={dismissBrowserPermissionPrompt}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
              title="Dismiss"
              aria-label="Dismiss notification prompt"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            Get instant operating system alerts when repeated errors (5x+), error velocity storms, or critical crashes happen on your tracked websites.
          </p>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={async () => {
                await requestBrowserNotificationPermission();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
            >
              <Check size={14} className="stroke-[3]" />
              <span>Allow Notifications</span>
            </button>

            <button
              type="button"
              onClick={dismissBrowserPermissionPrompt}
              className="px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] font-bold text-xs transition cursor-pointer"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
