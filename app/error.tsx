"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, Terminal } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Pulse Analytics Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 blur-[120px] pointer-events-none" />

      <div className="relative max-w-lg w-full bg-[#0d121f]/90 border border-rose-500/30 rounded-3xl p-8 shadow-2xl space-y-6 text-center z-10 backdrop-blur-xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-lg shadow-rose-500/10">
          <AlertTriangle size={28} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-white">Something went wrong</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Pulse encountered an unexpected runtime error while rendering this observability module.
          </p>
        </div>

        {error?.message && (
          <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-left font-mono text-xs text-rose-300/90 space-y-1 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold">
              <Terminal size={12} />
              <span>Diagnostics</span>
            </div>
            <p className="break-all">{error.message}</p>
            {error.digest && (
              <span className="text-[10px] text-slate-500 block">Digest: {error.digest}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white text-xs font-bold shadow-md transition cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-bold border border-white/[0.08] transition"
          >
            <Home size={14} />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
