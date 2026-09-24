"use client";

import React from "react";
import PlatformHeader from "@/components/PlatformHeader";
import DevicesSection from "@/components/sections/DevicesSection";
import { usePlatform } from "@/components/PlatformContext";

export default function DevicesPage() {
  const { data, loading } = usePlatform();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6">
      <PlatformHeader
        title="Devices & Hardware Diagnostics"
        subtitle="Executive hardware intelligence: client form factors, screen aspect ratios, web browsers, operating systems, unmasked WebGL GPUs, and 5G network telemetry"
      />
      {loading && !data ? (
        <div className="p-16 text-center text-xs font-semibold text-muted-foreground flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading device analytics...
        </div>
      ) : (
        <DevicesSection />
      )}
    </div>
  );
}
