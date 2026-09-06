"use client";

import React from "react";
import { usePlatform } from "@/components/PlatformContext";

export default function PlatformHeader({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
          <span>{title || "Observability & Analytics"}</span>
        </h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
