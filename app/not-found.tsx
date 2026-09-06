import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] pointer-events-none" />

      <div className="relative max-w-md w-full bg-[#0d121f]/90 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl space-y-6 text-center z-10 backdrop-blur-xl">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-500/10">
          <Compass size={28} />
        </div>

        <div className="space-y-2">
          <div className="text-4xl font-black tracking-tight text-white font-mono">404</div>
          <h2 className="text-xl font-bold tracking-tight text-white">Route Not Found</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The analytics view or API route you requested does not exist or has been moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition"
          >
            <Home size={14} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
