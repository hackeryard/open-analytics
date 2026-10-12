import React from "react";
import Link from "next/link";
import {
  Check,
  X,
  Zap,
  Shield,
  Activity,
  Bot,
  Bug,
  HelpCircle,
  Clock,
  ArrowRight,
  Server,
  Layers,
  Terminal,
  Code2,
  LucideIcon,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

export interface ComparisonRow {
  feature: string;
  openAnalytics: string;
  competitor: string;
  whyItMatters: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ComparisonLayoutProps {
  competitorName: string;
  competitorBadge: string;
  badgeIcon: LucideIcon;
  h1: string;
  subtitle: string;
  quickAnswer: {
    winner: string;
    summary: string;
    keyPoints: string[];
  };
  whatIsOpenAnalytics: string;
  whatIsCompetitor: string;
  featureMatrix: ComparisonRow[];
  privacyComparison: {
    openAnalyticsDetail: string;
    competitorDetail: string;
  };
  rumWebVitalsDetail: string;
  errorMonitoringDetail: string;
  aiBotVisibilityDetail: string;
  pricingDetail: {
    openAnalyticsPricing: string;
    competitorPricing: string;
  };
  whoShouldUseOpenAnalytics: string[];
  whoShouldUseCompetitor: string[];
  migrationSteps: Array<{
    step: string;
    title: string;
    detail: string;
  }>;
  faqs: FaqItem[];
  otherComparisons?: Array<{
    name: string;
    href: string;
  }>;
}

export default function ComparisonLayout({
  competitorName,
  competitorBadge,
  badgeIcon: BadgeIcon,
  h1,
  subtitle,
  quickAnswer,
  whatIsOpenAnalytics,
  whatIsCompetitor,
  featureMatrix,
  privacyComparison,
  rumWebVitalsDetail,
  errorMonitoringDetail,
  aiBotVisibilityDetail,
  pricingDetail,
  whoShouldUseOpenAnalytics,
  whoShouldUseCompetitor,
  migrationSteps,
  faqs,
  otherComparisons = [
    { name: "Google Analytics 4", href: "/alternatives/google-analytics" },
    { name: "Plausible", href: "/alternatives/plausible" },
    { name: "Umami", href: "/alternatives/umami" },
    { name: "Matomo", href: "/alternatives/matomo" },
    { name: "PostHog", href: "/alternatives/posthog" },
  ],
}: ComparisonLayoutProps) {
  const dashboardUrl = getDashboardUrl("/");

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 selection:bg-white selection:text-zinc-950">
      {/* 1. Header & Hero */}
      <section className="relative pt-32 pb-20 px-6 border-b border-white/[0.08] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-6">
            <BadgeIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span>{competitorBadge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 font-sans">
            {h1}
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-10 font-sans">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={dashboardUrl}
              className="px-6 py-3 rounded-lg bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 shadow-sm font-sans"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/self-hosting"
              className="px-6 py-3 rounded-lg bg-[#111218] border border-white/[0.08] text-zinc-300 font-semibold text-sm hover:bg-[#181922] hover:text-white transition-colors inline-flex items-center gap-2 font-sans"
            >
              <Server className="w-4 h-4 text-zinc-400" />
              <span>Self-Hosting Guide</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Quick Answer / Executive Summary */}
      <section className="py-16 px-6 border-b border-white/[0.08] bg-[#0e0f15]/50">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-xl bg-[#111218] border border-white/[0.08] relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
              <Zap className="w-4 h-4 text-white" />
              <span>Quick Summary & Executive Recommendation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 font-sans">
              {quickAnswer.winner}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6 font-sans">
              {quickAnswer.summary}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
              {quickAnswer.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span className="text-xs text-zinc-300 font-sans leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Overview Comparison */}
      <section className="py-20 px-6 border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-sans">
              Architectural Philosophy
            </h2>
            <p className="text-sm text-zinc-400 font-sans">
              Understanding the core design decisions behind both platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl bg-[#111218] border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-white mb-4">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Open Analytics</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-sans">
                  Unified Observability + Cookieless Telemetry
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed font-sans mb-6">
                  {whatIsOpenAnalytics}
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] text-xs font-mono text-zinc-400">
                Core: &lt;3.2KB beacon • Real User Monitoring • AI crawler radar
              </div>
            </div>

            <div className="p-8 rounded-xl bg-[#0e0f15] border border-white/[0.06] flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 mb-4">
                  <BadgeIcon className="w-3.5 h-3.5" />
                  <span>{competitorName}</span>
                </div>
                <h3 className="text-xl font-bold text-zinc-200 mb-3 font-sans">
                  {competitorName} Ecosystem
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-sans mb-6">
                  {whatIsCompetitor}
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] text-xs font-mono text-zinc-500">
                Alternative footprint and telemetry paradigm
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Complete Head-to-Head Comparison Matrix */}
      <section className="py-20 px-6 border-b border-white/[0.08] bg-[#0e0f15]/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-sans">
              Head-to-Head Technical Matrix
            </h2>
            <p className="text-sm text-zinc-400 font-sans">
              Direct comparison of runtime footprint, data privacy, ingestion speed, and advanced diagnostics.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#111218]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#181922]/60 text-xs font-mono uppercase tracking-wider text-zinc-400">
                  <th className="py-4 px-6">Capability / Feature</th>
                  <th className="py-4 px-6 text-white font-semibold">Open Analytics</th>
                  <th className="py-4 px-6">{competitorName}</th>
                  <th className="py-4 px-6 hidden lg:table-cell">Engineering Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-sm">
                {featureMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-medium text-white font-sans">{row.feature}</td>
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-white bg-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{row.openAnalytics}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-zinc-400">
                      <span>{row.competitor}</span>
                    </td>
                    <td className="py-4 px-6 text-xs text-zinc-400 hidden lg:table-cell font-sans leading-relaxed">
                      {row.whyItMatters}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. Deep Dives: Privacy, RUM, Errors, and AI */}
      <section className="py-20 px-6 border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Privacy & Cookies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                <Shield className="w-4 h-4 text-white" />
                <span>Zero Cookies & Privacy Compliance</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-sans">
                No Consent Banners, Zero Fingerprinting
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans mb-4">
                {privacyComparison.openAnalyticsDetail}
              </p>
              <div className="p-4 rounded-lg bg-[#0e0f15] border border-white/[0.06] text-xs text-zinc-400 font-sans">
                <strong className="text-zinc-300 font-medium block mb-1">Competitor Approach:</strong>
                {privacyComparison.competitorDetail}
              </div>
            </div>
            <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08] space-y-4 font-mono text-xs">
              <div className="text-zinc-400 uppercase text-[10px] tracking-wider">Privacy Checklist</div>
              <div className="flex items-center justify-between p-3 rounded bg-[#090a0f] border border-white/[0.06]">
                <span className="text-zinc-300">Cookie Consent Popup</span>
                <span className="text-emerald-400 font-bold">NOT REQUIRED</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-[#090a0f] border border-white/[0.06]">
                <span className="text-zinc-300">IP Storage</span>
                <span className="text-emerald-400 font-bold">0 BYTES STORED</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-[#090a0f] border border-white/[0.06]">
                <span className="text-zinc-300">Daily Salt Rotation</span>
                <span className="text-emerald-400 font-bold">AUTOMATED SHA-256</span>
              </div>
            </div>
          </div>

          {/* RUM & Error Monitoring */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 p-6 rounded-xl bg-[#111218] border border-white/[0.08] space-y-4">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-white" />
                <h4 className="text-base font-bold text-white font-sans">Observability Integration</h4>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {rumWebVitalsDetail}
              </p>
              <div className="pt-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-2 mb-2 text-xs font-mono text-zinc-300">
                  <Bug className="w-4 h-4 text-zinc-400" />
                  <span>Frontend Error Capture:</span>
                </div>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {errorMonitoringDetail}
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                <Bot className="w-4 h-4 text-white" />
                <span>AI Search & Crawler Visibility</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-sans">
                Next-Gen Bot & LLM Radar
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans mb-4">
                {aiBotVisibilityDetail}
              </p>
              <div className="p-4 rounded-lg bg-[#0e0f15] border border-white/[0.06] text-xs text-zinc-400 font-sans">
                Track when SearchGPT, ClaudeBot, PerplexityBot, and Google-Extended index your content, distinguishing conversational AI ingestion from human visitors automatically.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing & TCO Comparison */}
      <section className="py-20 px-6 border-b border-white/[0.08] bg-[#0e0f15]/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-sans">
              Pricing & Cost of Ownership
            </h2>
            <p className="text-sm text-zinc-400 font-sans">
              Compare infrastructure overhead and billing models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">Open Analytics</div>
              <div className="text-2xl font-bold text-white mb-3 font-sans">Cloud or Self-Host</div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-4">
                {pricingDetail.openAnalyticsPricing}
              </p>
              <div className="text-xs font-mono text-emerald-400">
                100% Free Open-Source Self-Hosting
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#0e0f15] border border-white/[0.06]">
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">{competitorName}</div>
              <div className="text-2xl font-bold text-zinc-200 mb-3 font-sans">Comparative TCO</div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-4">
                {pricingDetail.competitorPricing}
              </p>
              <div className="text-xs font-mono text-zinc-500">
                Tied to monthly pageview tiers or server infra
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Who Should Use Which Platform? */}
      <section className="py-20 px-6 border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-sans">
              Choosing the Right Tool
            </h2>
            <p className="text-sm text-zinc-400 font-sans">
              Clear criteria to help your engineering team decide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl bg-[#111218] border border-white/[0.08]">
              <h3 className="text-lg font-bold text-white mb-4 font-sans flex items-center gap-2">
                <Check className="w-5 h-5 text-white" />
                <span>Choose Open Analytics if you need:</span>
              </h3>
              <ul className="space-y-3">
                {whoShouldUseOpenAnalytics.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 font-sans">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 rounded-xl bg-[#0e0f15] border border-white/[0.06]">
              <h3 className="text-lg font-bold text-zinc-300 mb-4 font-sans flex items-center gap-2">
                <Layers className="w-5 h-5 text-zinc-400" />
                <span>Choose {competitorName} if you:</span>
              </h3>
              <ul className="space-y-3">
                {whoShouldUseCompetitor.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-400 font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Migration Guide */}
      <section className="py-20 px-6 border-b border-white/[0.08] bg-[#0e0f15]/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
              <Clock className="w-4 h-4 text-white" />
              <span>Quick Migration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-sans">
              Migrate in Under 60 Seconds
            </h2>
            <p className="text-sm text-zinc-400 font-sans">
              No complex event rewriting required. Swap the script tag and deploy.
            </p>
          </div>

          <div className="space-y-4">
            {migrationSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-[#111218] border border-white/[0.08] flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-white shrink-0">
                  {step.step}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-sans mb-1">{step.title}</h4>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQs */}
      <section className="py-20 px-6 border-b border-white/[0.08]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
              <HelpCircle className="w-4 h-4 text-white" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-[#111218] border border-white/[0.08]"
              >
                <h3 className="text-sm sm:text-base font-bold text-white mb-2 font-sans">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Other Alternatives Hub Links */}
      {otherComparisons.length > 0 && (
        <section className="py-16 px-6 border-b border-white/[0.08] bg-[#0e0f15]/30">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400 mb-6">
              Compare With Other Analytics Platforms
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {otherComparisons.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="px-4 py-2 rounded-lg bg-[#111218] border border-white/[0.08] text-xs font-sans text-zinc-300 hover:text-white hover:border-white/20 transition-colors"
                >
                  vs {item.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. Final CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-sans">
            Ready to upgrade your analytics?
          </h2>
          <p className="text-base text-zinc-400 max-w-xl mx-auto mb-8 font-sans">
            Deploy Open Analytics in 60 seconds. Eliminate cookie banners and gain full frontend observability with sub-3.2KB overhead.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={dashboardUrl}
              className="px-6 py-3.5 rounded-lg bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 shadow-sm font-sans"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/self-hosting"
              className="px-6 py-3.5 rounded-lg bg-[#111218] border border-white/[0.08] text-zinc-300 font-semibold text-sm hover:bg-[#181922] hover:text-white transition-colors font-sans"
            >
              <span>Self-Hosting Guide</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
