import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Terminal,
  Code2,
  Zap,
  HelpCircle,
  LucideIcon,
  Layers,
  Bug,
  Activity,
  Shield,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";
import CopyCodeButton from "./CopyCodeButton";
import FaqAccordion from "./FaqAccordion";

export interface CodeStep {
  title: string;
  description: string;
  filename: string;
  code: string;
}

export interface DeveloperGuideProps {
  frameworkName: string;
  frameworkIcon: LucideIcon;
  badge: string;
  h1: string;
  subtitle: string;
  installCommand: string;
  quickSetupCode: {
    filename: string;
    code: string;
  };
  featuresCovered: string[];
  steps: CodeStep[];
  customEventExample: {
    title: string;
    description: string;
    filename: string;
    code: string;
  };
  webVitalsDetail: string;
  errorTrackingDetail: string;
  faqs: Array<{ question: string; answer: string }>;
}

export default function DeveloperGuideLayout({
  frameworkName,
  frameworkIcon: FrameworkIcon,
  badge,
  h1,
  subtitle,
  installCommand,
  quickSetupCode,
  featuresCovered,
  steps,
  customEventExample,
  webVitalsDetail,
  errorTrackingDetail,
  faqs,
}: DeveloperGuideProps) {
  const dashboardUrl = getDashboardUrl("/");

  return (
    <div className="w-full text-zinc-100 selection:bg-white/[0.15] selection:text-white">
      {/* 1. HERO */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-white/[0.02] blur-[120px] -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-zinc-300 text-xs font-medium mb-8">
          <FrameworkIcon size={14} className="text-cyan-400" />
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
            <span>Universal Integration</span>
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          {featuresCovered.map((feat, idx) => (
            <span
              key={idx}
              className="text-xs px-3 py-1 rounded-full bg-[#14161f] border border-white/[0.06] text-zinc-300 font-mono"
            >
              {feat}
            </span>
          ))}
        </div>
      </section>

      {/* 2. QUICK INSTALL BAR */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Quick Installation
            </span>
            <CopyCodeButton code={installCommand} label="Copy Command" className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-zinc-200 transition cursor-pointer" />
          </div>
          <div className="rounded-xl bg-[#08090d] border border-white/[0.06] p-3.5 font-mono text-xs text-zinc-200 overflow-x-auto">
            <code>{installCommand}</code>
          </div>
        </div>
      </section>

      {/* 3. STEP BY STEP IMPLEMENTATION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Complete {frameworkName} Integration Guide
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Follow these steps to track pageviews, custom events, Core Web Vitals, and errors.
          </p>
        </div>

        {steps.map((step, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#111218] border border-white/[0.08] p-6 sm:p-7 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs flex items-center justify-center font-mono font-semibold">
                    {idx + 1}
                  </span>
                  <span>{step.title}</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">{step.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono text-zinc-500">{step.filename}</span>
                <CopyCodeButton code={step.code} label="" className="p-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 transition cursor-pointer flex items-center justify-center" />
              </div>
            </div>

            <div className="rounded-xl bg-[#08090d] border border-white/[0.06] p-4 font-mono text-xs text-zinc-200 overflow-x-auto leading-relaxed max-h-[300px]">
              <pre>{step.code}</pre>
            </div>
          </div>
        ))}
      </section>

      {/* 4. CUSTOM EVENTS & TRACKING */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                Custom Events &amp; Conversions
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {customEventExample.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {customEventExample.description}
              </p>
            </div>
            <CopyCodeButton code={customEventExample.code} label="Copy" className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-zinc-200 transition cursor-pointer shrink-0" />
          </div>

          <div className="rounded-xl bg-[#08090d] border border-white/[0.06] p-4 font-mono text-xs text-zinc-200 overflow-x-auto leading-relaxed max-h-[250px]">
            <pre>{customEventExample.code}</pre>
          </div>
        </div>
      </section>

      {/* 5. CORE WEB VITALS & ERROR MONITORING DEEP DIVE */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 uppercase">
              <Zap size={14} />
              <span>Core Web Vitals RUM</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Automated Field Performance
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {webVitalsDetail}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-rose-400 uppercase">
              <Bug size={14} />
              <span>Error Observability</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Runtime Crash Triage
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {errorTrackingDetail}
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-zinc-300 text-xs font-medium">
            <HelpCircle size={13} />
            <span>Developer Questions</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <FaqAccordion faqs={faqs} />
      </section>

      {/* 7. CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#111218] border border-white/[0.08] space-y-5 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Add Open Analytics to your {frameworkName} app today
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Zero cookies, sub-3.2 KB payload, real-time Core Web Vitals RUM, and automated crash triage.
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
              href="/docs"
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#181922] hover:bg-[#20222c] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] flex items-center justify-center gap-2"
            >
              <span>Explore Documentation</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
