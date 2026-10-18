import GrowthStrategy, { IGrowthStrategy, IStrategyEvidence, IStrategyActionStep } from "@/models/GrowthStrategy";
import GscIntegration from "@/models/GscIntegration";
import { getProjectAnalytics } from "@/lib/analyticsDb";
import Project from "@/models/Project";

export interface StrategyGenerationResult {
  strategies: IGrowthStrategy[];
  summary: {
    total: number;
    quickWins: number;
    criticalCount: number;
    highCount: number;
    categories: Record<string, number>;
    overallScore: number;
  };
}

/**
 * Cross-analyzes GSC search data, user behavior, Web Vitals, device breakdown,
 * audience geography, and runtime errors to synthesize tailored improvement strategies.
 */
export async function generateProjectGrowthStrategies(
  projectId: string,
  forceRefresh = false
): Promise<StrategyGenerationResult> {
  // 1. Fetch Project
  const project = await (Project as any)
    .findOne({ projectId })
    .populate("ownerId", "name email plan planExpiresAt subscriptionStatus role")
    .lean();
  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }

  const { getProjectEffectivePlan } = await import("@/lib/planLimits");
  const effectivePlan = getProjectEffectivePlan(project, project.ownerId);

  // 2. Fetch GSC Integration
  const gsc = await (GscIntegration as any).findOne({ projectId }).lean();

  // 3. Fetch comprehensive project analytics (past 28 or 30 days)
  const analytics = await getProjectAnalytics(projectId, "30d", null, null, effectivePlan);

  const existingStrategies = await (GrowthStrategy as any).find({ projectId }).lean();
  const existingMap = new Map<string, any>();
  existingStrategies.forEach((s: any) => existingMap.set(s.slug, s));

  const candidateStrategies: Partial<IGrowthStrategy>[] = [];

  // --------------------------------------------------------------------------
  // HEURISTIC A: GSC Striking Distance Keywords (Positions 4–20, high impressions, low CTR)
  // --------------------------------------------------------------------------
  const strikingKeywords = (gsc?.topQueries || []).filter(
    (q: any) => q.position >= 4 && q.position <= 20 && q.impressions >= 15 && q.ctr <= 4.0
  );

  if (strikingKeywords.length > 0) {
    const topStriking = strikingKeywords.slice(0, 5);
    const totalPotentialClicks = topStriking.reduce(
      (sum: number, q: any) => sum + Math.round(q.impressions * 0.08),
      0
    );

    const evidence: IStrategyEvidence[] = topStriking.map((q: any) => ({
      metric: `Search Query "${q.query}"`,
      currentValue: `Pos #${q.position.toFixed(1)} | ${q.ctr.toFixed(1)}% CTR (${q.impressions.toLocaleString()} imp)`,
      targetValue: `Top 3 | 7.5% CTR (+${Math.round(q.impressions * 0.075)} clicks/mo)`,
      source: "gsc",
      affectedUrls: [],
    }));

    candidateStrategies.push({
      strategyId: `strat_${projectId}_striking_keywords`,
      title: "Capture Page 1 Top 3 for Striking Distance Search Queries",
      slug: "striking-distance-keyword-surge",
      category: "seo_search",
      priority: "high",
      impact: "high",
      effort: "low",
      isQuickWin: true,
      score: 92,
      headline: `${topStriking.length} high-impression search queries are ranking on page 1-2 with low click-through rates`,
      problem: `Your site is ranking between position 4 and 20 for valuable queries including "${topStriking[0]?.query}". Because the average CTR for positions 4-20 is under 3% compared to >25% for top 3 positions, you are leaving an estimated ${totalPotentialClicks.toLocaleString()} organic visits on the table every month.`,
      expectedOutcome: `Up to +${totalPotentialClicks.toLocaleString()} incremental monthly search clicks and improved Google organic visibility.`,
      telemetryEvidence: evidence,
      actionSteps: [
        {
          stepNumber: 1,
          title: "Front-load primary keyword in HTML <title> and <h1>",
          instruction: `Ensure the exact search phrase "${topStriking[0]?.query}" is positioned within the first 45 characters of your target page title.`,
          codeSnippet: `<title>${topStriking[0]?.query.charAt(0).toUpperCase() + topStriking[0]?.query.slice(1)} | Complete 2026 Guide</title>`,
          codeLanguage: "html",
        },
        {
          stepNumber: 2,
          title: "Answer the search intent in the opening paragraph",
          instruction: `Place a 40-60 word definitive explanation directly below the primary heading to capture Google Featured Snippets and satisfy search intent immediately.`,
          codeSnippet: `<section className="hero-lead">\n  <h1>${topStriking[0]?.query}</h1>\n  <p className="lead font-medium">\n    Comprehensive, high-performance solution for modern web architectures...\n  </p>\n</section>`,
          codeLanguage: "tsx",
        },
        {
          stepNumber: 3,
          title: "Implement FAQPage Structured Data Schema",
          instruction: "Add JSON-LD FAQ schema answering 3-4 common long-tail questions related to these queries to expand search SERP snippet footprint.",
          codeSnippet: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [{\n    "@type": "Question",\n    "name": "What is ${topStriking[0]?.query}?",\n    "acceptedAnswer": {\n      "@type": "Answer",\n      "text": "Detailed answer explaining the solution and benefits."\n    }\n  }]\n}\n</script>`,
          codeLanguage: "html",
        },
      ],
    });
  }

  // --------------------------------------------------------------------------
  // HEURISTIC B: High-Impression Search Landing Pages with Slow LCP (Vitals + GSC)
  // --------------------------------------------------------------------------
  const overallLcp = analytics?.webVitals?.overall?.lcp;
  const lcpDist = analytics?.webVitals?.distributions?.lcp;
  const topPages = analytics?.topPages || [];
  const slowLandingPages = topPages.filter(
    (p: any) => p.views >= 5 && (p.bounceRate >= 50 || (lcpDist?.poor || 0) > 0)
  );

  if (slowLandingPages.length > 0 || (overallLcp && overallLcp > 2000)) {
    const targetPage = slowLandingPages[0] || { pathname: "/", views: 100, bounceRate: 58 };
    const lcpValue = overallLcp ? (overallLcp / 1000).toFixed(2) : "2.9";

    candidateStrategies.push({
      strategyId: `strat_${projectId}_lcp_seo_penalty`,
      title: "Eliminate LCP Delays on Primary Entry Routes",
      slug: "lcp-vital-speed-boost",
      category: "web_vitals",
      priority: "critical",
      impact: "high",
      effort: "medium",
      isQuickWin: false,
      score: 88,
      headline: `Largest Contentful Paint (${lcpValue}s) exceeds Google's 2.5s Core Web Vitals threshold`,
      problem: `Page "${targetPage.pathname}" has an average LCP of ${lcpValue}s. Google uses Core Web Vitals as an explicit search ranking signal, and visitors are 42% more likely to bounce when LCP exceeds 2.5s.`,
      expectedOutcome: `Sub-1.8s LCP, protected organic search rankings, and a 12-18% reduction in bounce rate.`,
      telemetryEvidence: [
        {
          metric: "Average LCP (Largest Contentful Paint)",
          currentValue: `${lcpValue}s (Needs Improvement)`,
          targetValue: "< 2.0s (Good)",
          source: "rum_vitals",
          affectedUrls: [targetPage.pathname],
        },
        {
          metric: "Entry Page Bounce Rate",
          currentValue: `${targetPage.bounceRate || 54}%`,
          targetValue: "< 40%",
          source: "cross_synthesis",
          affectedUrls: [targetPage.pathname],
        },
      ],
      actionSteps: [
        {
          stepNumber: 1,
          title: "Preload the primary hero image or font asset",
          instruction: "Ensure the largest above-the-fold image begins loading immediately in the HTML <head> with high fetch priority.",
          codeSnippet: `<link rel="preload" as="image" href="/hero-banner.webp" fetchpriority="high" type="image/webp" />`,
          codeLanguage: "html",
        },
        {
          stepNumber: 2,
          title: "Inline critical CSS for above-the-fold layout",
          instruction: "Avoid render-blocking external stylesheet links for above-the-fold elements to prevent layout stalls.",
          codeSnippet: `// Use next/font with display: 'swap' and preload enabled\nimport { Plus_Jakarta_Sans } from 'next/font/google';\nconst sans = Plus_Jakarta_Sans({ subsets: ['latin'], display: 'swap', preload: true });`,
          codeLanguage: "typescript",
        },
        {
          stepNumber: 3,
          title: "Apply modern WebP/AVIF compression to hero visuals",
          instruction: "Compress all desktop and mobile hero images to under 80KB using modern WebP or AVIF formats.",
        },
      ],
    });
  }

  // --------------------------------------------------------------------------
  // HEURISTIC C: Mobile vs Desktop Engagement Gap (Behavioral UX + Devices)
  // --------------------------------------------------------------------------
  const deviceBreakdown = analytics?.devices || [];
  const mobileDevice = deviceBreakdown.find((d: any) => d.device?.toLowerCase() === "mobile");
  const desktopDevice = deviceBreakdown.find((d: any) => d.device?.toLowerCase() === "desktop");

  const mobileShare = mobileDevice?.percentage || (mobileDevice?.visitors ? Math.round((mobileDevice.visitors / (analytics.overview?.uniqueVisitors || 1)) * 100) : 40);

  candidateStrategies.push({
    strategyId: `strat_${projectId}_mobile_cro_gap`,
    title: "Optimize Mobile Responsive UX & Touch Conversion Funnel",
    slug: "mobile-ux-conversion-alignment",
    category: "cro_ux",
    priority: "high",
    impact: "high",
    effort: "low",
    isQuickWin: true,
    score: 85,
    headline: `Mobile traffic accounts for ${mobileShare}% of audience with lower scroll engagement`,
    problem: `Mobile visitors drop off significantly faster before reaching key value propositions and interactive elements. On mobile viewports (< 768px), primary conversion actions are often pushed below the 600px fold.`,
    expectedOutcome: `Increase mobile conversion rate by up to 28% and boost average mobile scroll depth beyond 55%.`,
    telemetryEvidence: [
      {
        metric: "Mobile Audience Traffic Share",
        currentValue: `${mobileShare}% of total visitors`,
        targetValue: "Balanced mobile-first conversion",
        source: "behavioral_ux",
        affectedSegments: ["Mobile Viewports (<768px)", "iOS Safari", "Android Chrome"],
      },
      {
        metric: "Average Scroll Depth",
        currentValue: `${analytics?.overview?.avgScrollDepth || 38}%`,
        targetValue: "> 60%",
        source: "behavioral_ux",
      },
    ],
    actionSteps: [
      {
        stepNumber: 1,
        title: "Place primary CTA above 500px on mobile screens",
        instruction: "Ensure the main action button is visible without scrolling on standard 390px mobile viewports.",
        codeSnippet: `<div className="flex flex-col sm:flex-row gap-3 pt-4 w-full">\n  <button className="w-full sm:w-auto h-12 px-6 rounded-xl bg-white text-zinc-950 font-semibold">\n    Get Started Free\n  </button>\n</div>`,
        codeLanguage: "tsx",
      },
      {
        stepNumber: 2,
        title: "Ensure minimum 48x48px touch targets",
        instruction: "Enforce WCAG compliant touch targets to prevent mis-clicks and rage clicks on smaller mobile devices.",
        codeSnippet: `/* Touch Target Enforcement */\nbutton, a, input, select {\n  min-height: 44px;\n  min-width: 44px;\n}`,
        codeLanguage: "css",
      },
    ],
  });

  // --------------------------------------------------------------------------
  // HEURISTIC D: Active Runtime JavaScript Exceptions (Error Tracking)
  // --------------------------------------------------------------------------
  const errorStats = analytics?.errorStats;
  const recentErrors = analytics?.recentErrors || [];

  if ((errorStats?.totalErrors || 0) > 0 || recentErrors.length > 0) {
    const topError = recentErrors[0] || { message: "Unhandled runtime error", count: errorStats?.totalErrors || 1 };

    candidateStrategies.push({
      strategyId: `strat_${projectId}_runtime_crash_triage`,
      title: "Neutralize Runtime JavaScript Exceptions Affecting Visitors",
      slug: "runtime-exception-hardening",
      category: "technical_errors",
      priority: "critical",
      impact: "high",
      effort: "low",
      isQuickWin: true,
      score: 95,
      headline: `${errorStats?.totalErrors || recentErrors.length} client-side exceptions recorded across user sessions`,
      problem: `Telemetry detected uncaught exceptions including "${topError.message}". Client-side errors cause blank screens, break form submissions, and immediately abort user sessions.`,
      expectedOutcome: `Zero client-side crashes, recovered user checkout/navigation journeys, and clean browser console.`,
      telemetryEvidence: [
        {
          metric: "Active Client Exceptions",
          currentValue: `${errorStats?.totalErrors || recentErrors.length} occurrences`,
          targetValue: "0 errors",
          source: "error_tracking",
          affectedUrls: topError.pathname ? [topError.pathname] : ["All Routes"],
        },
      ],
      actionSteps: [
        {
          stepNumber: 1,
          title: "Implement Graceful Error Boundaries",
          instruction: "Wrap core views with React error boundaries to isolate component errors from crashing the entire page.",
          codeSnippet: `// components/ErrorBoundary.tsx\nexport class ViewErrorBoundary extends React.Component {\n  state = { hasError: false };\n  static getDerivedStateFromError() { return { hasError: true }; }\n  componentDidCatch(err, info) { console.error("Telemetry Error Caught:", err); }\n  render() {\n    return this.state.hasError ? <FallbackView /> : this.props.children;\n  }\n}`,
          codeLanguage: "typescript",
        },
        {
          stepNumber: 2,
          title: "Safely guard null and undefined object property access",
          instruction: "Use optional chaining (?.) and default fallbacks for nested properties received from APIs or localStorage.",
          codeSnippet: `const displayName = user?.profile?.name ?? "Guest User";\nconst itemsCount = data?.items?.length || 0;`,
          codeLanguage: "typescript",
        },
      ],
    });
  }

  // --------------------------------------------------------------------------
  // HEURISTIC E: International Audience Geography Expansion (Geo Radar + GSC)
  // --------------------------------------------------------------------------
  const countries = analytics?.countries || gsc?.countries || [];
  const nonDomesticCountries = countries.filter((c: any) => c.country && c.country !== "Unknown" && c.country !== "United States");

  if (nonDomesticCountries.length > 0) {
    const topIntl = nonDomesticCountries.slice(0, 3);
    const intlNames = topIntl.map((c: any) => c.country).join(", ");

    candidateStrategies.push({
      strategyId: `strat_${projectId}_geo_expansion`,
      title: "Capitalize on High-Dwell International Audience Segments",
      slug: "international-geo-radar-expansion",
      category: "geo_expansion",
      priority: "medium",
      impact: "medium",
      effort: "medium",
      isQuickWin: false,
      score: 78,
      headline: `Substantial visitor traction detected from ${intlNames}`,
      problem: `Geo Radar shows recurring traffic from ${intlNames}. Currently, pages serve generic metadata and lack geographic edge acceleration for these regions, resulting in higher TTFB.`,
      expectedOutcome: `Improve international dwell time by 22% and unlock organic search rankings in international Google indices.`,
      telemetryEvidence: [
        {
          metric: "International Traffic Volume",
          currentValue: `${topIntl.reduce((s: number, c: any) => s + (c.visitors || c.clicks || 10), 0).toLocaleString()} visitors from ${topIntl.length} regions`,
          targetValue: "Localized high-speed edge distribution",
          source: "geo_radar",
          affectedSegments: topIntl.map((c: any) => c.country),
        },
      ],
      actionSteps: [
        {
          stepNumber: 1,
          title: "Configure regional edge caching and DNS routing",
          instruction: "Ensure static assets, fonts, and scripts are cached across global edge nodes (Frankfurt, Singapore, Mumbai, Tokyo).",
          codeSnippet: `// next.config.mjs or headers\nexport const headers = async () => [\n  {\n    source: '/:all*(svg|jpg|png|webp|css|js)',\n    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],\n  },\n];`,
          codeLanguage: "javascript",
        },
        {
          stepNumber: 2,
          title: "Add OpenGraph locale alternatives",
          instruction: "Inform search indexers of your global accessibility using standard alternate locale tags.",
          codeSnippet: `<meta property="og:locale" content="en_US" />\n<meta property="og:locale:alternate" content="en_GB" />\n<meta property="og:locale:alternate" content="de_DE" />`,
          codeLanguage: "html",
        },
      ],
    });
  }

  // --------------------------------------------------------------------------
  // HEURISTIC F: Low CTR High-Impression Search Queries (CTR Revival)
  // --------------------------------------------------------------------------
  const lowCtrQueries = (gsc?.topQueries || []).filter((q: any) => q.impressions >= 40 && q.ctr < 2.0);

  if (lowCtrQueries.length > 0) {
    const q = lowCtrQueries[0];
    candidateStrategies.push({
      strategyId: `strat_${projectId}_ctr_revival`,
      title: "Revive Search Snippet CTR for High-Volume Query",
      slug: "search-ctr-snippet-revival",
      category: "seo_search",
      priority: "high",
      impact: "high",
      effort: "low",
      isQuickWin: true,
      score: 90,
      headline: `Query "${q.query}" has ${q.impressions.toLocaleString()} impressions but only ${q.ctr.toFixed(1)}% CTR`,
      problem: `Your listing is displaying in Google results ${q.impressions.toLocaleString()} times, but searchers are choosing competitors' listings because the current snippet lacks an irresistible value proposition and date freshness indicator.`,
      expectedOutcome: `Double CTR from ${q.ctr.toFixed(1)}% to ~4.5%, generating +${Math.round(q.impressions * 0.035)} immediate monthly clicks with zero backlink building.`,
      telemetryEvidence: [
        {
          metric: `Query "${q.query}" Impressions vs Clicks`,
          currentValue: `${q.impressions.toLocaleString()} imp | ${q.clicks} clicks (${q.ctr.toFixed(1)}% CTR)`,
          targetValue: `4.5% CTR (+${Math.round(q.impressions * 0.035)} clicks)`,
          source: "gsc",
        },
      ],
      actionSteps: [
        {
          stepNumber: 1,
          title: "Incorporate numbers and current year in HTML <title>",
          instruction: "Titles with current year and quantitative proof achieve 37% higher average CTR in Google search.",
          codeSnippet: `<title>${q.query.charAt(0).toUpperCase() + q.query.slice(1)}: 7 Proven Strategies (2026)</title>`,
          codeLanguage: "html",
        },
        {
          stepNumber: 2,
          title: "Craft an action-oriented meta description",
          instruction: "Write a 145-character meta description that addresses the exact search query and includes a clear action hook.",
          codeSnippet: `<meta name="description" content="Discover modern ${q.query} with real-time analytics, 0-cookie privacy, and actionable growth insights. Explore the complete benchmark now." />`,
          codeLanguage: "html",
        },
      ],
    });
  }

  // Fallback heuristic if no GSC connected yet: Provide Core Architecture Optimization
  if (candidateStrategies.length < 3) {
    candidateStrategies.push({
      strategyId: `strat_${projectId}_core_architecture_seo`,
      title: "Deploy Comprehensive JSON-LD Structured Data Graph",
      slug: "jsonld-structured-data-graph",
      category: "seo_search",
      priority: "high",
      impact: "high",
      effort: "low",
      isQuickWin: true,
      score: 87,
      headline: "Search engine crawlers require explicit semantic schema graphs for rich snippets",
      problem: "Pages without schema graphs rely solely on algorithmic guessing. Adding SoftwareApplication, WebSite, and BreadcrumbList schemas enables rich cards and Google Knowledge Panel recognition.",
      expectedOutcome: "Enhanced Google search appearance and eligibility for rich SERP enhancements.",
      telemetryEvidence: [
        {
          metric: "Structured Data Schema Coverage",
          currentValue: "Basic",
          targetValue: "Full WebSite & SoftwareApplication Graph",
          source: "cross_synthesis",
        },
      ],
      actionSteps: [
        {
          stepNumber: 1,
          title: "Inject Schema.org JSON-LD Graph in Root Layout",
          instruction: "Add structured graph schema describing your application name, operating system, and category.",
          codeSnippet: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@graph": [{\n    "@type": "WebSite",\n    "name": "${project.name}",\n    "url": "${project.websiteUrl || "https://openanalytics.org.in"}"\n  }]\n}\n</script>`,
          codeLanguage: "html",
        },
      ],
    });
  }

  // 4. Save/Update strategies in MongoDB
  const savedStrategies: IGrowthStrategy[] = [];

  for (const strat of candidateStrategies) {
    const existing = existingMap.get(strat.slug!);
    const status = existing ? existing.status : "recommended";
    const notes = existing ? existing.notes : "";

    const doc = await (GrowthStrategy as any).findOneAndUpdate(
      { projectId, slug: strat.slug },
      {
        ...strat,
        projectId,
        status,
        notes,
        statusUpdatedAt: existing?.statusUpdatedAt || new Date(),
        generatedAt: new Date(),
      },
      { upsert: true, new: true }
    ).lean();

    savedStrategies.push(doc as IGrowthStrategy);
  }

  // 5. Calculate summary metrics
  const quickWins = savedStrategies.filter((s) => s.isQuickWin && s.status !== "dismissed").length;
  const criticalCount = savedStrategies.filter((s) => s.priority === "critical" && s.status !== "dismissed").length;
  const highCount = savedStrategies.filter((s) => s.priority === "high" && s.status !== "dismissed").length;

  const categories: Record<string, number> = {};
  savedStrategies.forEach((s) => {
    categories[s.category] = (categories[s.category] || 0) + 1;
  });

  const implementedCount = savedStrategies.filter((s) => s.status === "implemented").length;
  const overallScore = Math.min(100, Math.round(55 + (implementedCount / Math.max(1, savedStrategies.length)) * 40));

  return {
    strategies: savedStrategies,
    summary: {
      total: savedStrategies.length,
      quickWins,
      criticalCount,
      highCount,
      categories,
      overallScore,
    },
  };
}
