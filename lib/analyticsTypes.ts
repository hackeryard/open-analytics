export interface UserSnippet {
  _id?: string;
  name?: string;
  email?: string;
  username?: string;
  avatar?: string;
  level?: number;
  xp?: number;
}

export interface PageViewItem {
  _id: string;
  pathname: string;
  title?: string;
  labId?: string | null;
  visitorId: string;
  sessionId: string;
  userId?: UserSnippet | null;
  isReturning?: boolean;
  visitCount?: number;
  referrer?: string;
  referrerDomain?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  device: "desktop" | "mobile" | "tablet" | "unknown";
  browser: string;
  os: string;
  screen?: string;
  language?: string;
  timezone?: string;
  country: string;
  city?: string;
  duration: number;
  activeDuration?: number;
  idleDuration?: number;
  focusCount?: number;
  scrollDepth: number;
  scrollMilestones?: number[];
  webVitals?: {
    fcp?: number | null;
    lcp?: number | null;
    cls?: number | null;
    inp?: number | null;
    ttfb?: number | null;
    domLoad?: number | null;
    windowLoad?: number | null;
  };
  hardware?: {
    memory?: number | null;
    cores?: number | null;
    gpu?: string;
    dpr?: number;
    viewport?: string;
    touchPoints?: number;
  };
  network?: {
    effectiveType?: string;
    downlink?: number | null;
    rtt?: number | null;
    saveData?: boolean;
  };
  isBounce?: boolean;
  exitIntent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomEventItem {
  _id: string;
  eventName: string;
  category?: string;
  labId?: string | null;
  pathname: string;
  properties?: any;
  value?: number | null;
  visitorId: string;
  sessionId: string;
  createdAt: string;
  userId?: UserSnippet | null;
}

export interface ErrorLogItem {
  _id: string;
  message: string;
  stack?: string;
  digest?: string;
  componentStack?: string;
  errorType?: string;
  pathname: string;
  device?: string;
  browser?: string;
  os?: string;
  status: "new" | "investigating" | "resolved" | "ignored";
  occurrences: number;
  firstOccurredAt?: string;
  lastOccurredAt: string;
  createdAt?: string;
  userId?: UserSnippet | null;
}

export interface ReturningUserItem {
  visitorId: string;
  user?: UserSnippet | null;
  visitCount: number;
  sessionCount: number;
  totalViews: number;
  totalDuration: number;
  topPaths: string[];
  country: string;
  city: string;
  device: string;
  browser: string;
  os: string;
  firstSeen: string;
  lastSeen: string;
}

export interface AnalyticsData {
  seoAnalytics?: any;
  aiVisibility?: any;
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    uniqueSessions: number;
    anonymousSessions?: number;
    authenticatedSessions?: number;
    avgDuration: number;
    avgScrollDepth: number;
    activeUsers: number;
    returningVisitors?: number;
    newVisitors?: number;
    returnRate?: number;
  };
  retention?: {
    totalVisitors: number;
    returningVisitors: number;
    newVisitors: number;
    returnRate: number;
    frequency: { label: string; count: number; percentage: number }[];
  };
  returningUsers?: ReturningUserItem[];
  realtime: {
    totalActiveUsers: number;
    activePaths: { pathname: string; activeUsers: number }[];
  };
  timeseries: {
    label: string;
    views: number;
    visitors: number;
    returningVisitors?: number;
    newVisitors?: number;
    returningViews?: number;
  }[];
  topPages: {
    pathname: string;
    title: string;
    labId: string | null;
    views: number;
    visitors: number;
    avgDuration: number;
    avgScrollDepth: number;
  }[];
  topReferrers: { domain: string; count: number; percentage: number }[];
  utmCampaigns: {
    source: string;
    medium: string;
    campaign: string;
    views: number;
    visitors: number;
    avgDuration: number;
  }[];
  devices: { device: string; count: number; percentage: number }[];
  browsers: { browser: string; count: number; percentage: number }[];
  operatingSystems: { os: string; count: number; percentage: number }[];
  screenResolutions: { screen: string; count: number; percentage: number }[];
  countries: {
    country: string;
    code: string;
    count: number;
    percentage: number;
    continent?: string;
  }[];
  topCities?: {
    city: string;
    country: string;
    countryCode?: string;
    count: number;
    percentage: number;
  }[];
  continents?: {
    continent: string;
    count: number;
    percentage: number;
  }[];
  geoKpis?: {
    nationsCount: number;
    topCountry: { name: string; code: string; count: number; percentage: number } | null;
    topCity: { name: string; country: string; countryCode?: string; count: number } | null;
    internationalRatio: number;
  };
  durationDistribution: { label: string; count: number }[];
  scrollDistribution: { label: string; count: number }[];
  recentPageViews?: PageViewItem[];
  recentEvents: CustomEventItem[];
  recentErrors: ErrorLogItem[];
  errorStats: {
    totalErrors: number;
    uniqueIssues: number;
    statusNew: number;
    statusInvestigating: number;
    statusResolved: number;
  };
  webVitals?: {
    totalMeasured: number;
    overall: {
      lcp: number | null;
      fcp: number | null;
      cls: number | null;
      inp: number | null;
      ttfb: number | null;
      domLoad: number | null;
      windowLoad: number | null;
    };
    distributions: {
      lcp: { good: number; needsImprovement: number; poor: number };
      fcp: { good: number; needsImprovement: number; poor: number };
      cls: { good: number; needsImprovement: number; poor: number };
      inp: { good: number; needsImprovement: number; poor: number };
    };
    pages: {
      pathname: string;
      count: number;
      lcp: number | null;
      fcp: number | null;
      cls: number | null;
      inp: number | null;
      ttfb: number | null;
    }[];
  };
  hardwareDiagnostics?: {
    networkTypes: { type: string; count: number; percentage: number }[];
    gpus: { gpu: string; count: number; percentage: number }[];
    cpuCores: { cores: string; count: number; percentage: number }[];
  };
  labIntelligence?: {
    overview: {
      totalStarts: number;
      totalCompletions: number;
      completionRate: number;
      totalParameterTweaks: number;
      totalQuizAttempts: number;
    };
    labs: {
      labId: string;
      starts: number;
      completes: number;
      completionRate: number;
      parameterTweaks: number;
      stepProgressions: number;
      quizAttempts: number;
      resets: number;
      uniqueStudents: number;
    }[];
  };
  behavioralSignals?: {
    bounceRate: number;
    exitIntentRate: number;
    activeRatio: {
      totalActiveSeconds: number;
      totalIdleSeconds: number;
      activePercentage: number;
      avgActiveSeconds: number;
      avgIdleSeconds: number;
      avgFocusCount: number;
    };
    rageClicks: { element: string; pathname: string; count: number; sampleText: string }[];
    outboundClicks: { href: string; count: number; sampleText: string }[];
  };
  userJourneys?: {
    entryPages: { pathname: string; count: number; percentage: number }[];
    exitPages: { pathname: string; count: number; percentage: number }[];
  };
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds < 1) return "< 1s";
  const m = Math.floor(seconds / 60);


  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

export function formatExactTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function formatExactDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function offsetDateString(dateStr: string, offsetDays: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDayLabel(dateStr: string): string {
  const today = getTodayString();
  const yesterday = getYesterdayString();
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

export function formatRangeLabel(start: string, end: string): string {
  try {
    const [y1, m1, d1] = start.split("-").map(Number);
    const [y2, m2, d2] = end.split("-").map(Number);
    const dt1 = new Date(y1, m1 - 1, d1);
    const dt2 = new Date(y2, m2 - 1, d2);
    const s1 = dt1.toLocaleDateString([], { month: "short", day: "numeric" });
    const s2 = dt2.toLocaleDateString([], { month: "short", day: "numeric" });
    return `${s1} – ${s2}`;
  } catch {
    return `${start} to ${end}`;
  }
}

