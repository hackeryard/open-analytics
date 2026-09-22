"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FAQ_ITEMS } from "@/lib/faqData";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Activity,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

export default function FaqClientView() {
  const dashboardUrl = getDashboardUrl("/");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(FAQ_ITEMS.map((item) => item.category)))];
  }, []);

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full text-zinc-100 selection:bg-white/[0.15] selection:text-white">
      {/* ============================================================ */}
      {/* 1. HERO SECTION & SEARCH                                     */}
      {/* ============================================================ */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient top vignette */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-white/[0.02] blur-[120px] -z-10 pointer-events-none" />

        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-zinc-300 text-xs font-medium mb-8 shadow-xs">
          <HelpCircle size={13} />
          <span>Frequently Asked Questions</span>
          <span className="text-zinc-500">•</span>
          <span className="font-mono text-zinc-400 text-[11px]">Knowledgebase</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.06]">
          Everything you need to know about Open Analytics.
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed mb-10">
          Clear, developer-grade answers about telemetry architecture, cookieless privacy, script performance, and AI bot tracking.
        </p>

        {/* Search Bar Input */}
        <div className="max-w-xl mx-auto relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search questions or keywords (e.g. cookies, nextjs, rum, pricing)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111218] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-white/[0.2] transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-white text-zinc-950 font-semibold shadow-xs"
                  : "bg-[#111218] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/[0.16]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. FAQ ACCORDION LIST                                        */}
      {/* ============================================================ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-2xl bg-[#111218] border border-white/[0.08] space-y-3">
              <HelpCircle className="w-8 h-8 text-zinc-600 mx-auto" />
              <div className="text-sm font-medium text-zinc-300">No questions found matching your search.</div>
              <div className="text-xs text-zinc-500">Try searching for other terms or reset category filters.</div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-2 text-xs text-white underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-xl bg-[#111218] border border-white/[0.08] overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                        {faq.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="mt-1 text-zinc-500 shrink-0">
                      {isOpen ? <ChevronUp size={16} className="text-white" /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-3 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. STILL HAVE QUESTIONS (TACTILE OBSIDIAN CONSOLE)           */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#111218] border border-white/[0.08] space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white mx-auto">
            <Activity size={24} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight max-w-md mx-auto">
            Still have questions about telemetry or migration?
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Read our technical developer documentation or start a live free property on your website in 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={dashboardUrl}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/docs"
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#181922] hover:bg-[#20222c] text-zinc-300 hover:text-white font-medium text-sm transition border border-white/[0.08] flex items-center justify-center gap-2"
            >
              <span>Read Documentation</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
