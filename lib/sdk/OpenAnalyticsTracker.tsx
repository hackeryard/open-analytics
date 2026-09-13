"use client";

import Script from "next/script";

export interface OpenAnalyticsTrackerProps {
  projectId: string;
  apiKey?: string;
  endpoint?: string;
}

export default function OpenAnalyticsTracker({
  projectId,
  apiKey = "",
  endpoint = "",
}: OpenAnalyticsTrackerProps) {
  return (
    <Script
      id="open-analytics-script"
      src={endpoint ? `${endpoint.replace(/\/$/, "")}/open.js` : "/open.js"}
      strategy="afterInteractive"
      data-project-id={projectId}
      data-api-key={apiKey}
      data-endpoint={endpoint}
    />
  );
}
