import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Terminal,
  Shield,
  Zap,
  HelpCircle,
  LucideIcon,
  Check,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";
import CopyCodeButton from "./CopyCodeButton";
import FaqAccordion from "./FaqAccordion";

export interface MetricItem {
  name: string;
  unit: string;
  benchmark: string;
  description: string;
}

export interface UseCaseItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FeatureHubProps {
  badge: string;
  badgeIcon: LucideIcon;
  h1: string;
  subtitle: string;
  problemTitle: string;
  problemDescription: string;
  problemPoints: string[];
  solutionTitle: string;
  solutionDescription: string;
  solutionPillars: Array<{
    title: string;
    description: string;
    icon: LucideIcon;
  }>;
  technicalArchitectureTitle: string;
  technicalArchitectureDescription: string;
  technicalSteps: Array<{
    step: string;
    title: string;
    detail: string;
  }>;
  interactivePreviewTitle?: string;
  interactivePreview?: React.ReactNode;
  useCases: UseCaseItem[];
  metrics: MetricItem[];
  privacyNotes: string[];
  codeSnippet: {
    filename: string;
    code: string;
  };
  faqs: FaqItem[];
  ctaTitle?: string;
  ctaDescription?: string;
}

export default function FeatureHubLayout({
  badge,
  badgeIcon: BadgeIcon,
  h1,
  subtitle,
  problemTitle,
  problemDescription,
  problemPoints,
  solutionTitle,
  solutionDescription,
  solutionPillars,
  technicalArchitectureTitle,
  technicalArchitectureDescription,
  technicalSteps,
  interactivePreviewTitle,
  interactivePreview,
  useCases,
  metrics,
  privacyNotes,
  codeSnippet,
  faqs,
  ctaTitle = "Start capturing precision telemetry in 60 seconds",
  ctaDescription = "Deploy on your own infrastructure or launch on Open Analytics Cloud. Zero cookies required.",
}: FeatureHubProps) {
  const dashboardUrl = getDashboardUrl("/");

  return (
    <div className="w-full text-zinc-100 selection:bg-white/[0.15] selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-white/[0.02] blur-[120px] -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] text-zinc-300 text-xs font-medium mb-8 transition shadow-xs">
          <BadgeIcon size={13} className="text-emerald-400" />
          <span>{badge}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.08]">
          {h1}
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed mb-8">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <a
            href={dashboardUrl}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/docs/installation"
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#111218] hover:bg-[#181922] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center gap-2"
          >
            <Terminal className="w-4 h-4 text-zinc-400" />
            <span>Installation Guide</span>
          </Link>
        </div>
      </section>

      {/* 2. THE PROBLEM VS THE MEASUREMENT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Problem Card */}
          <div className="p-7 sm:p-8 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 font-mono">
              The Challenge
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {problemTitle}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {problemDescription}
            </p>
            <ul className="space-y-2.5 pt-2 text-xs text-zinc-300 font-mono">
              {problemPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">x</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution Card */}
          <div className="p-7 sm:p-8 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
              What Open Analytics Delivers
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {solutionTitle}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {solutionDescription}
            </p>
            <div className="grid grid-cols-1 gap-3 pt-2">
              {solutionPillars.map((pillar, idx) => {
                const PillarIcon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#14161f] border border-white/[0.06] flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#181922] border border-white/[0.08] flex items-center justify-center shrink-0 text-white">
                      <PillarIcon size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {pillar.title}
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                        {pillar.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS / TECHNICAL ARCHITECTURE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-7 sm:p-10 space-y-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
              Technical Mechanics
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              {technicalArchitectureTitle}
            </h2>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              {technicalArchitectureDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {technicalSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#14161f] border border-white/[0.06] space-y-2 relative"
              >
                <div className="text-xs font-mono font-semibold text-zinc-500">
                  {step.step}
                </div>
                <h3 className="text-sm font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OPTIONAL INTERACTIVE PREVIEW */}
      {interactivePreview && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {interactivePreviewTitle && (
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {interactivePreviewTitle}
              </h2>
            </div>
          )}
          <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-5 sm:p-7 shadow-xl">
            {interactivePreview}
          </div>
        </section>
      )}

      {/* 5. REAL USE CASES */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Production Use Cases
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            How engineering and growth teams rely on Open Analytics in production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {useCases.map((uc, idx) => {
            const UCIcon = uc.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#111218] border border-white/[0.08] hover:border-white/[0.16] space-y-3 transition"
              >
                <div className="w-9 h-9 rounded-lg bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white">
                  <UCIcon size={16} />
                </div>
                <h3 className="text-base font-semibold text-white">
                  {uc.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {uc.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. TELEMETRY METRICS SPECIFICATION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Captured Signals &amp; Benchmarks
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Precision telemetry captured with zero browser performance overhead.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-[#111218]">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#14161f]">
                  <th className="p-4 text-zinc-400 font-semibold">Signal</th>
                  <th className="p-4 text-zinc-400 font-semibold">Unit</th>
                  <th className="p-4 text-zinc-400 font-semibold">Benchmark</th>
                  <th className="p-4 text-zinc-400 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {metrics.map((m, idx) => (
                  <tr key={idx}>
                    <td className="p-4 font-semibold text-white">{m.name}</td>
                    <td className="p-4 text-cyan-400 font-mono">{m.unit}</td>
                    <td className="p-4 text-emerald-400 font-mono font-medium">{m.benchmark}</td>
                    <td className="p-4 text-zinc-400 leading-relaxed">{m.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. PRIVACY & IMPLEMENTATION CODE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Privacy considerations */}
          <div className="p-7 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
              <Shield size={14} />
              <span>Privacy Safeguards</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Privacy by Design &amp; GDPR Exemption
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Open Analytics processes telemetry without invasive user surveillance.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-zinc-300">
              {privacyNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick implementation snippet */}
          <div className="p-7 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
                <Terminal size={14} />
                <span>{codeSnippet.filename}</span>
              </div>
              <CopyCodeButton code={codeSnippet.code} />
            </div>
            <div className="rounded-xl bg-[#08090d] border border-white/[0.08] p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed max-h-[220px]">
              <pre>{codeSnippet.code}</pre>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Async non-blocking beacon weighing &lt;3.2 KB Brotli compressed.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-zinc-300 text-xs font-medium">
            <HelpCircle size={13} />
            <span>Questions &amp; Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <FaqAccordion faqs={faqs} />
      </section>

      {/* 9. BOTTOM CONSOLE CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#111218] border border-white/[0.08] space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight max-w-lg mx-auto">
            {ctaTitle}
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            {ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={dashboardUrl}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Launch Dashboard Free</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/pricing"
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#181922] hover:bg-[#20222c] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] flex items-center justify-center gap-2"
            >
              <span>View Pricing Plans</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
