"use client";

import Script from "next/script";

export interface OpenAnalyticsTrackerProps {
  /**
   * Unique Open Analytics project identifier (e.g. "prj_076157e66e233a52").
   * This is the only required prop.
   */
  projectId: string;

  /**
   * Optional custom self-hosted endpoint.
   * Defaults to "https://openanalytics.org.in" if omitted.
   */
  endpoint?: string;

  /**
   * Optional client publishable API key for domain authentication.
   */
  apiKey?: string;
}

export const DEFAULT_OPEN_ANALYTICS_ENDPOINT = "https://openanalytics.org.in";

/**
 * OpenAnalyticsTracker
 *
 * Lightweight, zero-configuration tracking component for Next.js and React.
 * Uses Next.js optimized Script component with strategy="afterInteractive"
 * to ensure zero millisecond impact on Core Web Vitals (LCP, INP, CLS) or PageSpeed.
 *
 * Usage:
 * ```tsx
 * <OpenAnalyticsTracker projectId="prj_076157e66e233a52" />
 * ```
 */
export default function OpenAnalyticsTracker({
  projectId,
  endpoint = DEFAULT_OPEN_ANALYTICS_ENDPOINT,
  apiKey = "",
}: OpenAnalyticsTrackerProps) {
  const resolvedEndpoint = (endpoint || DEFAULT_OPEN_ANALYTICS_ENDPOINT).replace(/\/$/, "");

  return (
    <Script
      id="open-analytics-script"
      src={`${resolvedEndpoint}/open.js`}
      strategy="afterInteractive"
      data-project-id={projectId}
      data-endpoint={resolvedEndpoint}
      data-api-key={apiKey}
    />
  );
}

/**
 * Programmatically capture exceptions / errors in React components, error boundaries, or catch blocks.
 */
export function captureError(error: Error | string | unknown, context?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).OpenAnalytics?.captureError) {
    (window as any).OpenAnalytics.captureError(error, context);
  }
}

/**
 * Programmatically track custom business events with optional property payload and revenue value.
 */
export function trackEvent(eventName: string, properties?: Record<string, any>, value?: number) {
  if (typeof window !== "undefined" && (window as any).OpenAnalytics?.track) {
    (window as any).OpenAnalytics.track(eventName, properties, value);
  }
}

/**
 * Programmatically identify an authenticated user and bind their account traits to the visitor session.
 */
export function identifyUser(userId: string, traits?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).OpenAnalytics?.identify) {
    (window as any).OpenAnalytics.identify(userId, traits);
  }
}

/**
 * Programmatically track 404 / Not Found routes in Next.js not-found.tsx or route catchers.
 */
export function track404(pathname?: string, referrer?: string) {
  if (typeof window !== "undefined" && (window as any).OpenAnalytics?.track404) {
    (window as any).OpenAnalytics.track404(pathname, referrer);
  }
}

export const capture404 = track404;
export const identify = identifyUser;
export const track = trackEvent;
