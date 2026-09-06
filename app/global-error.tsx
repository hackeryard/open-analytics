"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Pulse Analytics Global Root Error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
        <div className="relative max-w-md w-full bg-[#0d121f] border border-rose-500/30 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <AlertTriangle size={28} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">Application Error</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              A critical error prevented the application shell from loading.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white text-xs font-bold shadow-md cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
