import { AnalyticsData, PageViewItem, ErrorLogItem, ReturningUserItem, CustomEventItem } from "@/lib/analyticsTypes";

export function generateDemoTelemetry(timeRange = "7d"): {
  analytics: AnalyticsData;
  pageviews: PageViewItem[];
  liveVisitorCount: number;
} {
  const now = new Date();

  // Generate timeseries based on timeRange
  const days = timeRange === "24h" || timeRange === "today" ? 24 : timeRange === "30d" ? 30 : 7;
  const isHourly = timeRange === "24h" || timeRange === "today";

  const timeseries = Array.from({ length: days }).map((_, i) => {
    let label = "";
    if (isHourly) {
      const h = (now.getHours() - (days - 1 - i) + 24) % 24;
      label = `${h.toString().padStart(2, "0")}:00`;
    } else {
      const d = new Date(now.getTime() - (days - 1 - i) * 86400000);
      label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }

    // Realistic curve with diurnal swings
    const base = isHourly ? 180 + Math.sin((i / 24) * Math.PI * 2) * 110 : 3200 + Math.sin(i * 0.9) * 900;
    const views = Math.max(45, Math.round(base + Math.random() * 250));
    const visitors = Math.round(views * 0.42);
    const returningViews = Math.round(views * 0.38);

    return {
      label,
      views,
      visitors,
      returningViews,
    };
  });

  const totalViews = timeseries.reduce((acc, t) => acc + t.views, 0);
  const uniqueVisitors = timeseries.reduce((acc, t) => acc + t.visitors, 0);
  const returningVisitors = Math.round(uniqueVisitors * 0.428);

  const topPages = [
    { pathname: "/", title: "Pulse Cloud — Standalone Analytics", labId: null, views: Math.round(totalViews * 0.38), visitors: Math.round(uniqueVisitors * 0.39), avgDuration: 135, avgScrollDepth: 68 },
    { pathname: "/docs/installation", title: "Installation & SDK Setup | Pulse", labId: null, views: Math.round(totalViews * 0.22), visitors: Math.round(uniqueVisitors * 0.21), avgDuration: 215, avgScrollDepth: 84 },
    { pathname: "/pricing", title: "Transparent Cloud & Enterprise Pricing", labId: null, views: Math.round(totalViews * 0.14), visitors: Math.round(uniqueVisitors * 0.15), avgDuration: 88, avgScrollDepth: 72 },
    { pathname: "/features/rum", title: "Real User Monitoring (RUM) Engine", labId: null, views: Math.round(totalViews * 0.11), visitors: Math.round(uniqueVisitors * 0.10), avgDuration: 180, avgScrollDepth: 79 },
    { pathname: "/blog/react-web-vitals-2026", title: "Diagnosing INP & LCP in Next.js 14", labId: null, views: Math.round(totalViews * 0.09), visitors: Math.round(uniqueVisitors * 0.09), avgDuration: 245, avgScrollDepth: 91 },
    { pathname: "/app/dashboard", title: "Workspace Telemetry Console", labId: null, views: Math.round(totalViews * 0.06), visitors: Math.round(uniqueVisitors * 0.06), avgDuration: 340, avgScrollDepth: 60 },
  ];

  const topReferrers = [
    { domain: "Direct / App", count: Math.round(totalViews * 0.42), percentage: 42 },
    { domain: "google.com", count: Math.round(totalViews * 0.26), percentage: 26 },
    { domain: "github.com", count: Math.round(totalViews * 0.14), percentage: 14 },
    { domain: "twitter.com / x.com", count: Math.round(totalViews * 0.09), percentage: 9 },
    { domain: "news.ycombinator.com", count: Math.round(totalViews * 0.06), percentage: 6 },
    { domain: "linkedin.com", count: Math.round(totalViews * 0.03), percentage: 3 },
  ];

  const countries = [
    { country: "United States", code: "US", count: Math.round(uniqueVisitors * 0.38), percentage: 38, continent: "North America" },
    { country: "Germany", code: "DE", count: Math.round(uniqueVisitors * 0.16), percentage: 16, continent: "Europe" },
    { country: "United Kingdom", code: "GB", count: Math.round(uniqueVisitors * 0.13), percentage: 13, continent: "Europe" },
    { country: "India", code: "IN", count: Math.round(uniqueVisitors * 0.11), percentage: 11, continent: "Asia" },
    { country: "Canada", code: "CA", count: Math.round(uniqueVisitors * 0.07), percentage: 7, continent: "North America" },
    { country: "Japan", code: "JP", count: Math.round(uniqueVisitors * 0.06), percentage: 6, continent: "Asia" },
    { country: "France", code: "FR", count: Math.round(uniqueVisitors * 0.05), percentage: 5, continent: "Europe" },
    { country: "Australia", code: "AU", count: Math.round(uniqueVisitors * 0.04), percentage: 4, continent: "Oceania" },
  ];

  const devices = [
    { device: "desktop", count: Math.round(uniqueVisitors * 0.65), percentage: 65 },
    { device: "mobile", count: Math.round(uniqueVisitors * 0.30), percentage: 30 },
    { device: "tablet", count: Math.round(uniqueVisitors * 0.05), percentage: 5 },
  ];

  const browsers = [
    { browser: "Chrome", count: Math.round(uniqueVisitors * 0.64), percentage: 64 },
    { browser: "Safari", count: Math.round(uniqueVisitors * 0.22), percentage: 22 },
    { browser: "Edge", count: Math.round(uniqueVisitors * 0.08), percentage: 8 },
    { browser: "Firefox", count: Math.round(uniqueVisitors * 0.06), percentage: 6 },
  ];

  const operatingSystems = [
    { os: "Mac OS", count: Math.round(uniqueVisitors * 0.44), percentage: 44 },
    { os: "Windows", count: Math.round(uniqueVisitors * 0.36), percentage: 36 },
    { os: "iOS", count: Math.round(uniqueVisitors * 0.12), percentage: 12 },
    { os: "Android", count: Math.round(uniqueVisitors * 0.05), percentage: 5 },
    { os: "Linux", count: Math.round(uniqueVisitors * 0.03), percentage: 3 },
  ];

  const screenResolutions = [
    { screen: "1920x1080", count: Math.round(uniqueVisitors * 0.42), percentage: 42 },
    { screen: "2560x1440", count: Math.round(uniqueVisitors * 0.24), percentage: 24 },
    { screen: "1440x900", count: Math.round(uniqueVisitors * 0.18), percentage: 18 },
    { screen: "390x844", count: Math.round(uniqueVisitors * 0.16), percentage: 16 },
  ];

  const utmCampaigns = [
    { source: "google", medium: "cpc", campaign: "brand_search_2026", views: 2400, visitors: 980, avgDuration: 185 },
    { source: "twitter", medium: "social", campaign: "launch_v1", views: 1600, visitors: 740, avgDuration: 142 },
  ];

  const durationDistribution = [
    { label: "0-10s", count: Math.round(uniqueVisitors * 0.22) },
    { label: "10-30s", count: Math.round(uniqueVisitors * 0.18) },
    { label: "30s-1m", count: Math.round(uniqueVisitors * 0.24) },
    { label: "1m-3m", count: Math.round(uniqueVisitors * 0.22) },
    { label: "3m+", count: Math.round(uniqueVisitors * 0.14) },
  ];

  const scrollDistribution = [
    { label: "0-25%", count: Math.round(uniqueVisitors * 0.15) },
    { label: "25-50%", count: Math.round(uniqueVisitors * 0.25) },
    { label: "50-75%", count: Math.round(uniqueVisitors * 0.35) },
    { label: "75-100%", count: Math.round(uniqueVisitors * 0.25) },
  ];

  const webVitals = {
    totalMeasured: Math.round(uniqueVisitors * 0.88),
    overall: {
      lcp: 1180,
      inp: 42,
      cls: 0.015,
      fcp: 820,
      ttfb: 142,
      domLoad: 680,
      windowLoad: 1240,
    },
    distributions: {
      lcp: { good: 92, needsImprovement: 6, poor: 2 },
      fcp: { good: 94, needsImprovement: 5, poor: 1 },
      cls: { good: 98, needsImprovement: 2, poor: 0 },
      inp: { good: 96, needsImprovement: 3, poor: 1 },
    },
    pages: [
      { pathname: "/", count: 840, lcp: 1100, fcp: 780, cls: 0.01, inp: 38, ttfb: 120 },
      { pathname: "/docs/installation", count: 520, lcp: 1250, fcp: 840, cls: 0.02, inp: 45, ttfb: 150 },
    ],
  };

  const errorStats = {
    totalErrors: 3,
    uniqueIssues: 3,
    statusNew: 1,
    statusInvestigating: 1,
    statusResolved: 1,
  };

  const recentErrors: ErrorLogItem[] = [
    {
      _id: "err_demo_01",
      message: "ResizeObserver loop completed with undelivered notifications.",
      errorType: "Warning",
      pathname: "/docs/installation",
      status: "resolved",
      occurrences: 8,
      lastOccurredAt: new Date(now.getTime() - 14 * 60000).toISOString(),
      browser: "Chrome 124",
      os: "Mac OS",
      device: "desktop",
      stack: "Error: ResizeObserver loop\n  at handleResize (webpack-internal:///./components/CodeBlock.tsx:42:12)",
    },
    {
      _id: "err_demo_02",
      message: "TypeError: Cannot read properties of undefined (reading 'dimensions')",
      errorType: "TypeError",
      pathname: "/features/rum",
      status: "new",
      occurrences: 4,
      lastOccurredAt: new Date(now.getTime() - 52 * 60000).toISOString(),
      browser: "Safari 17",
      os: "iOS",
      device: "mobile",
      stack: "TypeError: Cannot read properties of undefined\n  at computeLayoutShift (./lib/vitals.ts:118:24)",
    },
    {
      _id: "err_demo_03",
      message: "NetworkError: Failed to execute 'sendBeacon' on 'Navigator': quota exceeded",
      errorType: "NetworkError",
      pathname: "/",
      status: "investigating",
      occurrences: 2,
      lastOccurredAt: new Date(now.getTime() - 180 * 60000).toISOString(),
      browser: "Firefox 125",
      os: "Windows",
      device: "desktop",
      stack: "NetworkError: Failed to execute 'sendBeacon'\n  at flushEventQueue (./public/pulse.js:84:16)",
    },
  ];

  const behavioralSignals = {
    bounceRate: 26.4,
    exitIntentRate: 4.2,
    activeRatio: {
      totalActiveSeconds: 48500,
      totalIdleSeconds: 12400,
      activePercentage: 79.6,
      avgActiveSeconds: 142,
      avgIdleSeconds: 32,
      avgFocusCount: 3,
    },
    rageClicks: [
      { element: "button#checkout-annual", pathname: "/pricing", count: 18, sampleText: "Annual Subscription" },
      { element: "code.copy-snippet", pathname: "/docs/installation", count: 9, sampleText: "npm install" },
    ],
    outboundClicks: [
      { href: "https://github.com", count: 142, sampleText: "Star on GitHub" },
      { href: "https://x.com", count: 84, sampleText: "Follow on X" },
    ],
  };

  const aiVisibility = {
    overview: {
      totalAiCrawlerHits: 378,
      distinctAiBots: 5,
      schemaCoverageRate: 94.2,
    },
    crawlerBreakdown: [
      { botName: "GPTBot (OpenAI)", hits: 162, percentage: 42.8, status: "Active indexing" },
      { botName: "ClaudeBot (Anthropic)", hits: 104, percentage: 27.5, status: "Active indexing" },
      { botName: "PerplexityBot", hits: 68, percentage: 18.0, status: "Active searching" },
      { botName: "Bytespider (ByteDance)", hits: 32, percentage: 8.5, status: "Crawl permitted" },
      { botName: "Google-Extended (Gemini)", hits: 12, percentage: 3.2, status: "AI Training" },
    ],
    topAiCrawledPages: [
      { pathname: "/docs/installation", hits: 148, lastCrawled: "12m ago" },
      { pathname: "/features/rum", hits: 112, lastCrawled: "35m ago" },
      { pathname: "/blog/react-web-vitals-2026", hits: 82, lastCrawled: "1h ago" },
      { pathname: "/", hits: 36, lastCrawled: "2h ago" },
    ],
  };

  const seoAnalytics = {
    overview: {
      totalSearchVisits: Math.round(uniqueVisitors * 0.26),
      uniqueSearchVisitors: Math.round(uniqueVisitors * 0.22),
      searchShare: 26.4,
      organicShare: 26.4,
      searchCrawlerHits: 412,
      avgPosition: 4.8,
    },
    searchEngines: [
      { engine: "google", name: "Google", count: Math.round(uniqueVisitors * 0.22), uniqueVisitors: Math.round(uniqueVisitors * 0.19), percentage: 84 },
      { engine: "duckduckgo", name: "DuckDuckGo", count: Math.round(uniqueVisitors * 0.025), uniqueVisitors: Math.round(uniqueVisitors * 0.02), percentage: 10 },
      { engine: "bing", name: "Bing", count: Math.round(uniqueVisitors * 0.015), uniqueVisitors: Math.round(uniqueVisitors * 0.01), percentage: 6 },
    ],
    searchLandingPages: [
      { pathname: "/blog/react-web-vitals-2026", count: 840, uniqueVisitors: 620, engines: ["Google", "Bing"] },
      { pathname: "/docs/installation", count: 620, uniqueVisitors: 510, engines: ["Google"] },
      { pathname: "/features/rum", count: 410, uniqueVisitors: 340, engines: ["Google", "DuckDuckGo"] },
      { pathname: "/", count: 290, uniqueVisitors: 260, engines: ["Google"] },
    ],
    searchCrawlers: [
      { botName: "Googlebot", count: 284, lastSeen: new Date(now.getTime() - 15 * 60000).toISOString() },
      { botName: "Bingbot", count: 128, lastSeen: new Date(now.getTime() - 42 * 60000).toISOString() },
    ],
  };

  const userJourneys = {
    entryPages: [
      { pathname: "/", count: 480, percentage: 44 },
      { pathname: "/blog/react-web-vitals-2026", count: 320, percentage: 28 },
      { pathname: "/docs/installation", count: 210, percentage: 18 },
      { pathname: "/pricing", count: 110, percentage: 10 },
    ],
    exitPages: [
      { pathname: "/pricing", count: 180, percentage: 38 },
      { pathname: "/", count: 140, percentage: 26 },
      { pathname: "/blog/react-web-vitals-2026", count: 110, percentage: 24 },
    ],
  };

  const returningUsers: ReturningUserItem[] = [
    {
      visitorId: "usr_pulse_alpha98",
      visitCount: 14,
      sessionCount: 18,
      totalViews: 92,
      totalDuration: 1840,
      topPaths: ["/app/dashboard", "/docs/installation", "/vitals"],
      country: "United States",
      city: "San Francisco",
      device: "desktop",
      browser: "Chrome",
      os: "Mac OS",
      firstSeen: new Date(now.getTime() - 28 * 86400000).toISOString(),
      lastSeen: new Date(now.getTime() - 4 * 60000).toISOString(),
    },
    {
      visitorId: "usr_pulse_beta42",
      visitCount: 9,
      sessionCount: 11,
      totalViews: 54,
      totalDuration: 940,
      topPaths: ["/vitals", "/errors", "/live-feed"],
      country: "Germany",
      city: "Berlin",
      device: "desktop",
      browser: "Firefox",
      os: "Linux",
      firstSeen: new Date(now.getTime() - 14 * 86400000).toISOString(),
      lastSeen: new Date(now.getTime() - 12 * 60000).toISOString(),
    },
    {
      visitorId: "usr_pulse_gamma17",
      visitCount: 7,
      sessionCount: 8,
      totalViews: 38,
      totalDuration: 720,
      topPaths: ["/docs/installation", "/pricing"],
      country: "United Kingdom",
      city: "London",
      device: "mobile",
      browser: "Safari",
      os: "iOS",
      firstSeen: new Date(now.getTime() - 10 * 86400000).toISOString(),
      lastSeen: new Date(now.getTime() - 25 * 60000).toISOString(),
    },
  ];

  const recentEvents: CustomEventItem[] = [
    {
      _id: "evt_demo_1",
      eventName: "sdk_script_installed",
      category: "Onboarding",
      pathname: "/docs/installation",
      properties: { framework: "Next.js 14", version: "1.0.0" },
      visitorId: "usr_pulse_alpha98",
      sessionId: "ses_alpha98_1",
      createdAt: new Date(now.getTime() - 2 * 60000).toISOString(),
    },
    {
      _id: "evt_demo_2",
      eventName: "rage_click_triggered",
      category: "UX Signal",
      pathname: "/pricing",
      properties: { selector: "button#checkout-annual", clickCount: 5 },
      visitorId: "usr_pulse_gamma17",
      sessionId: "ses_gamma17_2",
      createdAt: new Date(now.getTime() - 8 * 60000).toISOString(),
    },
    {
      _id: "evt_demo_3",
      eventName: "project_created",
      category: "Workspace",
      pathname: "/app/dashboard",
      properties: { projectId: "prj_demo_saas" },
      visitorId: "usr_pulse_beta42",
      sessionId: "ses_beta42_1",
      createdAt: new Date(now.getTime() - 19 * 60000).toISOString(),
    },
  ];

  const samplePageviews: PageViewItem[] = [
    {
      _id: "pv_demo_1",
      pathname: "/",
      title: "Pulse Cloud — Standalone Analytics",
      visitorId: "usr_pulse_alpha98",
      sessionId: "ses_alpha98_1",
      device: "desktop",
      browser: "Chrome 124",
      os: "Mac OS",
      country: "United States",
      city: "San Francisco",
      duration: 184,
      scrollDepth: 78,
      referrerDomain: "news.ycombinator.com",
      createdAt: new Date(now.getTime() - 12000).toISOString(),
      updatedAt: new Date(now.getTime() - 12000).toISOString(),
      isReturning: true,
      visitCount: 14,
    },
    {
      _id: "pv_demo_2",
      pathname: "/docs/installation",
      title: "Installation & SDK Setup | Pulse",
      visitorId: "usr_pulse_beta42",
      sessionId: "ses_beta42_1",
      device: "desktop",
      browser: "Firefox 125",
      os: "Linux",
      country: "Germany",
      city: "Berlin",
      duration: 290,
      scrollDepth: 95,
      referrerDomain: "github.com",
      createdAt: new Date(now.getTime() - 35000).toISOString(),
      updatedAt: new Date(now.getTime() - 35000).toISOString(),
      isReturning: true,
      visitCount: 9,
    },
    {
      _id: "pv_demo_3",
      pathname: "/features/rum",
      title: "Real User Monitoring (RUM) Engine",
      visitorId: "usr_pulse_gamma17",
      sessionId: "ses_gamma17_2",
      device: "mobile",
      browser: "Safari 17",
      os: "iOS",
      country: "United Kingdom",
      city: "London",
      duration: 88,
      scrollDepth: 54,
      referrerDomain: "google.com",
      createdAt: new Date(now.getTime() - 65000).toISOString(),
      updatedAt: new Date(now.getTime() - 65000).toISOString(),
      isReturning: false,
      visitCount: 1,
    },
    {
      _id: "pv_demo_4",
      pathname: "/pricing",
      title: "Transparent Cloud & Enterprise Pricing",
      visitorId: "usr_pulse_delta55",
      sessionId: "ses_delta55_1",
      device: "desktop",
      browser: "Edge 124",
      os: "Windows",
      country: "India",
      city: "Bengaluru",
      duration: 140,
      scrollDepth: 82,
      referrerDomain: "Direct / App",
      createdAt: new Date(now.getTime() - 110000).toISOString(),
      updatedAt: new Date(now.getTime() - 110000).toISOString(),
      isReturning: true,
      visitCount: 3,
    },
  ];

  return {
    analytics: {
      overview: {
        totalViews,
        uniqueVisitors,
        uniqueSessions: Math.round(totalViews * 0.72),
        avgDuration: 168,
        avgScrollDepth: 74,
        activeUsers: 14,
        returningVisitors,
        newVisitors: uniqueVisitors - returningVisitors,
        returnRate: 42.8,
      },
      retention: {
        totalVisitors: uniqueVisitors,
        returningVisitors,
        newVisitors: uniqueVisitors - returningVisitors,
        returnRate: 42.8,
        frequency: [
          { label: "1 Visit", count: Math.round(uniqueVisitors * 0.572), percentage: 57.2 },
          { label: "2-5 Visits", count: Math.round(uniqueVisitors * 0.264), percentage: 26.4 },
          { label: "6-10 Visits", count: Math.round(uniqueVisitors * 0.112), percentage: 11.2 },
          { label: "10+ Visits", count: Math.round(uniqueVisitors * 0.052), percentage: 5.2 },
        ],
      },
      realtime: {
        totalActiveUsers: 14,
        activePaths: [
          { pathname: "/", activeUsers: 6 },
          { pathname: "/docs/installation", activeUsers: 4 },
          { pathname: "/pricing", activeUsers: 3 },
          { pathname: "/features/rum", activeUsers: 1 },
        ],
      },
      timeseries,
      topPages,
      topReferrers,
      countries,
      devices,
      browsers,
      operatingSystems,
      screenResolutions,
      utmCampaigns,
      durationDistribution,
      scrollDistribution,
      webVitals,
      errorStats,
      recentErrors,
      behavioralSignals,
      aiVisibility,
      seoAnalytics,
      userJourneys,
      returningUsers,
      recentEvents,
    },
    pageviews: samplePageviews,
    liveVisitorCount: 14,
  };
}
