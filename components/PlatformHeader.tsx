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
    <div className="mb-5 sm:mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
      <div className="space-y-1 min-w-0">
        <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <span className="truncate">{title || "Observability & Analytics"}</span>
        </h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
