"use client";

import { useEffect } from "react";
import Script from "next/script";

interface PulseTrackerProps {
  projectId: string;
  apiKey?: string;
  endpoint?: string;
}

export default function PulseTracker({
  projectId,
  apiKey = "",
  endpoint = "",
}: PulseTrackerProps) {
  return (
    <Script
      id="pulse-analytics-script"
      src={endpoint ? `${endpoint.replace(/\/$/, "")}/pulse.js` : "/pulse.js"}
      strategy="afterInteractive"
      data-project-id={projectId}
      data-api-key={apiKey}
      data-endpoint={endpoint}
    />
  );
}
