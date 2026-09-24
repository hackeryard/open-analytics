"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { FAQ_ITEMS, FaqItem } from "@/lib/faqData";
import {
  HelpCircle,
  Search,
  X,
  ChevronDown,
  ChevronsUpDown,
  ArrowRight,
  Activity,
  ShieldCheck,
  Zap,
  Bot,
  Cpu,
  Code2,
  Sliders,
  Lock,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  FileText,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Layers,
  Sparkles,
  Link2,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: <Layers className="w-4 h-4" />,
  "General & Setup": <Zap className="w-4 h-4 text-amber-400" />,
  "Privacy & Legal Compliance": <ShieldCheck className="w-4 h-4 text-emerald-400" />,
  "AI & Behavioral Telemetry": <Bot className="w-4 h-4 text-violet-400" />,
  "Architecture & Integration": <Cpu className="w-4 h-4 text-cyan-400" />,
  "Machine-Readable Endpoints": <Code2 className="w-4 h-4 text-blue-400" />,
};

export default function FaqClientView() {
  const dashboardUrl = getDashboardUrl("/");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItemIds, setOpenItemIds] = useState<Set<string>>(
    () => new Set([FAQ_ITEMS[0]?.id || "difference-from-ga4"])
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, "up" | "down">>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Category list with counts
  const categories = useMemo(() => {
    const list = ["All", ...Array.from(new Set(FAQ_ITEMS.map((item) => item.category)))];
    return list.map((cat) => ({
      name: cat,
      count: cat === "All" ? FAQ_ITEMS.length : FAQ_ITEMS.filter((i) => i.category === cat).length,
    }));
  }, []);

  // Filtered FAQs based on category, search input, and tags
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      if (!q) return matchesCategory;

      const matchesSearch =
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Deep linking: Open item if URL hash matches an ID
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const matched = FAQ_ITEMS.find((item) => item.id === hash);
      if (matched) {
        setOpenItemIds((prev) => {
          const next = new Set(prev);
          next.add(matched.id);
          return next;
        });
        if (matched.category !== selectedCategory && selectedCategory !== "All") {
          setSelectedCategory("All");
        }
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 150);
      }
    }
  }, [selectedCategory]);

  // Keyboard shortcut listener (/ or Ctrl+K to search, Esc to clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "/" && document.activeElement?.tagName !== "INPUT") || (e.ctrlKey && e.key === "k")) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape" && searchQuery) {
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery]);

  const toggleItem = (id: string) => {
    setOpenItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    if (openItemIds.size === filteredFaqs.length) {
      setOpenItemIds(new Set());
    } else {
      setOpenItemIds(new Set(filteredFaqs.map((i) => i.id)));
    }
  };

  const copyAnchorLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/faq#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copySnippet = (id: string, code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleFeedback = (id: string, type: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    setFeedbackState((prev) => ({ ...prev, [id]: type }));
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    searchInputRef.current?.focus();
  };

  return (
    <div className="w-full min-h-screen bg-[#090a0f] text-zinc-100 selection:bg-white/[0.15] selection:text-white">
      {/* ============================================================ */}
      {/* 1. HERO & ARCHITECTURE OVERVIEW                              */}
      {/* ============================================================ */}
      <section className="relative pt-24 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-white/[0.06]">
        {/* Subtle Ambient Vignette */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-white/[0.02] blur-[140px] -z-10 pointer-events-none" />

        {/* Release / Scope Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111218] border border-white/[0.08] text-zinc-300 text-xs font-medium mb-8 shadow-xs">
          <HelpCircle size={14} className="text-zinc-400" />
          <span className="font-semibold text-white tracking-wide">Developer Knowledgebase</span>
          <span className="text-zinc-600">•</span>
          <span className="font-mono text-zinc-400 text-[11px]">Telemetry & Architecture FAQs</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.08]">
          Answers engineered for developers and privacy teams.
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed mb-12">
          Definitive technical specifications on sub-3.2KB telemetry ingestion, zero-cookie GDPR exemptions,
          Core Web Vitals RUM monitoring, automated data retention, and AI crawler classification.
        </p>

        {/* 4 Micro Architecture Spec Chips (Bento Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-[#111218] border border-white/[0.08] shadow-[0_1px_3px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Zap size={16} />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">Script Weight</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">&lt; 3.2 KB</div>
            <div className="text-[11px] text-zinc-500 mt-1">Brotli compressed, async execution</div>
          </div>

          <div className="p-4 rounded-xl bg-[#111218] border border-white/[0.08] shadow-[0_1px_3px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <Lock size={16} />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">Client Storage</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">0 Cookies</div>
            <div className="text-[11px] text-zinc-500 mt-1">No LocalStorage or fingerprinting</div>
          </div>

          <div className="p-4 rounded-xl bg-[#111218] border border-white/[0.08] shadow-[0_1px_3px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2 mb-2 text-teal-400">
              <ShieldCheck size={16} />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">GDPR & PECR</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">100% Exempt</div>
            <div className="text-[11px] text-zinc-500 mt-1">Zero consent banner required</div>
          </div>

          <div className="p-4 rounded-xl bg-[#111218] border border-white/[0.08] shadow-[0_1px_3px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2 mb-2 text-violet-400">
              <Bot size={16} />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">AI Bot Radar</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">Real-Time</div>
            <div className="text-[11px] text-zinc-500 mt-1">Autonomous crawler segmentation</div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. COMMAND-CENTER SEARCH & TOOLBAR                           */}
      {/* ============================================================ */}
      <section className="pt-10 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto">
          {/* Main Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-white transition">
              <Search className="w-5 h-5" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions, features, or architecture (e.g. Next.js, GDPR, RUM, reverse-proxy)..."
              className="w-full bg-[#111218] border border-white/[0.08] rounded-2xl pl-12 pr-28 py-4 text-sm sm:text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-white/[0.24] focus:ring-1 focus:ring-white/[0.1] transition shadow-md"
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                  title="Clear search query (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-[#181922] border border-white/[0.08] text-[10px] font-mono text-zinc-400">
                  <span>/</span>
                </kbd>
              )}
            </div>
          </div>

          {/* Action Bar Below Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 px-1 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-mono text-zinc-300 font-semibold tabular-nums">
                {filteredFaqs.length}
              </span>
              <span>
                {filteredFaqs.length === 1 ? "question found" : "questions found"}
              </span>
              {selectedCategory !== "All" && (
                <span className="px-2 py-0.5 rounded-md bg-[#181922] border border-white/[0.08] text-zinc-300 text-[11px]">
                  Category: {selectedCategory}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-white text-[11px]">
                  &quot;{searchQuery}&quot;
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {(searchQuery || selectedCategory !== "All") && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#181922] border border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/[0.2] transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset filters</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleExpandAll}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#181922] border border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/[0.2] transition cursor-pointer"
              >
                <ChevronsUpDown className="w-3.5 h-3.5" />
                <span>
                  {openItemIds.size === filteredFaqs.length && filteredFaqs.length > 0
                    ? "Collapse all"
                    : "Expand all"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. BENTO 2-COLUMN MAIN LAYOUT                                */}
      {/* ============================================================ */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ---------------------------------------------------------- */}
          {/* LEFT COLUMN: STICKY CATEGORIES & SPECIFICATION WIDGETS     */}
          {/* ---------------------------------------------------------- */}
          <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 space-y-6">
            {/* Category Navigator Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#111218] border border-white/[0.08] shadow-[0_1px_3px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center justify-between gap-2 mb-4 px-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  <Sliders size={13} />
                  <span>Categories</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">{categories.length - 1} sections</span>
              </div>

              {/* Category Nav Buttons */}
              <div className="space-y-1.5">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition cursor-pointer ${
                        isSelected
                          ? "bg-white text-zinc-950 font-semibold shadow-xs"
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={isSelected ? "text-zinc-950" : "text-zinc-400"}>
                          {CATEGORY_ICONS[cat.name] || <Layers className="w-4 h-4" />}
                        </span>
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-zinc-900/10 text-zinc-900 font-bold"
                            : "bg-[#181922] text-zinc-400 border border-white/[0.04]"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Architecture Ingestion Specs Card */}
            <div className="p-5 rounded-2xl bg-[#111218] border border-white/[0.08] shadow-[0_1px_3px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold border-b border-white/[0.06] pb-3">
                <Terminal size={14} className="text-zinc-300" />
                <span>Platform Telemetry Specs</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-zinc-500">Ingestion Host</span>
                  <span className="font-mono text-zinc-300 text-[11px]">api.openanalytics.org.in</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-zinc-500">Telemetry Payload</span>
                  <span className="font-mono text-zinc-300 text-[11px]">Brotli JSON (&lt; 3.2KB)</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-zinc-500">Transport Layer</span>
                  <span className="font-mono text-zinc-300 text-[11px]">navigator.sendBeacon</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-zinc-500">Salt Rotation</span>
                  <span className="font-mono text-zinc-300 text-[11px]">Every 24h (00:00 UTC)</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-zinc-500">Data Center Hubs</span>
                  <span className="font-mono text-zinc-300 text-[11px]">Frankfurt & Amsterdam</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-zinc-500">Retention TTL</span>
                  <span className="font-mono text-zinc-300 text-[11px]">365-Day Auto Purge</span>
                </div>
              </div>
            </div>

            {/* Machine Specs Quick Link Card */}
            <div className="p-4 rounded-2xl bg-[#111218] border border-white/[0.08] shadow-[0_1px_3px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                <Sparkles size={13} className="text-blue-400" />
                <span>Machine Interfaces</span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">
                Raw architectural specs formatted for coding agents and LLM scrapers.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#181922] hover:bg-[#20222c] border border-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white transition"
                >
                  <span>/llms.txt</span>
                  <ExternalLink size={11} className="text-zinc-500" />
                </a>
                <a
                  href="/agents.md"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#181922] hover:bg-[#20222c] border border-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white transition"
                >
                  <span>/agents.md</span>
                  <ExternalLink size={11} className="text-zinc-500" />
                </a>
              </div>
            </div>
          </aside>

          {/* ---------------------------------------------------------- */}
          {/* RIGHT COLUMN: INTERACTIVE ACCORDION KNOWLEDGE FEED         */}
          {/* ---------------------------------------------------------- */}
          <main className="w-full flex-1 min-w-0 space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-20 p-8 rounded-3xl bg-[#111218] border border-white/[0.08] space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-zinc-500 mx-auto">
                  <Search size={22} />
                </div>
                <h3 className="text-lg font-semibold text-white">No questions found matching your search.</h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                  We could not find any FAQ entries matching &quot;{searchQuery}&quot;. Try adjusting your keywords or clearing the category filter.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition cursor-pointer shadow-sm inline-flex items-center gap-2"
                  >
                    <RotateCcw size={13} />
                    <span>Clear all filters</span>
                  </button>
                </div>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openItemIds.has(faq.id);
                const isCopied = copiedId === faq.id;
                const feedback = feedbackState[faq.id];

                return (
                  <article
                    key={faq.id}
                    id={faq.id}
                    className={`rounded-2xl bg-[#111218] border transition-all duration-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)] overflow-hidden ${
                      isOpen
                        ? "border-white/[0.18] shadow-lg ring-1 ring-white/[0.04]"
                        : "border-white/[0.08] hover:border-white/[0.14]"
                    }`}
                  >
                    {/* Accordion Trigger Header */}
                    <button
                      type="button"
                      onClick={() => toggleItem(faq.id)}
                      className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition"
                      aria-expanded={isOpen}
                    >
                      <div className="space-y-2 flex-1 min-w-0 pr-2">
                        {/* Category Badge & Anchor Copy Trigger */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#181922] border border-white/[0.08] text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                            {CATEGORY_ICONS[faq.category] || <HelpCircle size={11} />}
                            <span>{faq.category}</span>
                          </span>

                          <button
                            type="button"
                            onClick={(e) => copyAnchorLink(faq.id, e)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition cursor-pointer"
                            title="Copy direct anchor link"
                          >
                            {isCopied ? (
                              <>
                                <Check size={11} className="text-emerald-400" />
                                <span className="text-emerald-400 font-sans font-medium">Link copied!</span>
                              </>
                            ) : (
                              <>
                                <Link2 size={11} />
                                <span>#{faq.id}</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Question Title */}
                        <h3 className="text-base sm:text-lg font-bold text-white leading-snug tracking-tight">
                          {faq.question}
                        </h3>
                      </div>

                      {/* Animated Chevron Indicator */}
                      <div className="mt-1 shrink-0 p-1.5 rounded-lg bg-[#181922] border border-white/[0.08] text-zinc-400">
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 text-zinc-300 ${
                            isOpen ? "rotate-180 text-white" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* Expanded Content Area */}
                    {isOpen && (
                      <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-2 border-t border-white/[0.06] space-y-4">
                        {/* Answer Text */}
                        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                          {faq.answer}
                        </p>

                        {/* Interactive Code Snippet (if provided) */}
                        {faq.codeSnippet && (
                          <div className="rounded-xl bg-[#090a0f] border border-white/[0.08] overflow-hidden my-3">
                            <div className="flex items-center justify-between px-4 py-2 bg-[#111218] border-b border-white/[0.06]">
                              <div className="flex items-center gap-2">
                                <Code2 size={13} className="text-zinc-400" />
                                <span className="text-[11px] font-mono uppercase text-zinc-400">
                                  {faq.codeSnippet.language}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => copySnippet(faq.id, faq.codeSnippet!.code, e)}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#181922] hover:bg-[#20222c] border border-white/[0.08] text-[11px] font-mono text-zinc-300 hover:text-white transition cursor-pointer"
                              >
                                {copiedCodeId === faq.id ? (
                                  <>
                                    <Check size={12} className="text-emerald-400" />
                                    <span className="text-emerald-400 font-sans">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={12} />
                                    <span>Copy snippet</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
                              <code>{faq.codeSnippet.code}</code>
                            </pre>
                          </div>
                        )}

                        {/* Tags and Feedback Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/[0.04]">
                          {/* Tag Badges */}
                          {faq.tags && faq.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              {faq.tags.map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSearchQuery(tag);
                                  }}
                                  className="px-2 py-0.5 rounded bg-[#181922] hover:bg-white/[0.08] text-[11px] font-mono text-zinc-400 hover:text-zinc-200 border border-white/[0.04] transition cursor-pointer"
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Was this helpful feedback */}
                          <div className="flex items-center gap-2 text-xs text-zinc-400 ml-auto">
                            {feedback ? (
                              <span className="text-[11px] font-medium text-emerald-400 inline-flex items-center gap-1">
                                <Check size={12} />
                                <span>Thank you for your feedback!</span>
                              </span>
                            ) : (
                              <>
                                <span className="text-[11px] text-zinc-500">Was this helpful?</span>
                                <div className="inline-flex rounded-lg border border-white/[0.08] p-0.5 bg-[#181922]">
                                  <button
                                    type="button"
                                    onClick={(e) => handleFeedback(faq.id, "up", e)}
                                    className="p-1 rounded hover:bg-white/[0.08] text-zinc-400 hover:text-emerald-400 transition cursor-pointer"
                                    title="Yes, this was helpful"
                                  >
                                    <ThumbsUp size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleFeedback(faq.id, "down", e)}
                                    className="p-1 rounded hover:bg-white/[0.08] text-zinc-400 hover:text-rose-400 transition cursor-pointer"
                                    title="No, needs more detail"
                                  >
                                    <ThumbsDown size={12} />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </main>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. STILL HAVE QUESTIONS (TACTILE OBSIDIAN CONSOLE)           */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#111218] border border-white/[0.08] space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

          <div className="w-14 h-14 rounded-2xl bg-[#181922] border border-white/[0.08] flex items-center justify-center text-white mx-auto shadow-inner">
            <Activity size={26} />
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight max-w-lg mx-auto leading-tight">
            Still have questions about telemetry or migration?
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Read our step-by-step developer documentation or start monitoring your website in under 60 seconds with our free starter tier.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 relative z-10">
            <a
              href={dashboardUrl}
              className="w-full sm:w-auto py-3.5 px-7 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/docs"
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#181922] hover:bg-[#20222c] text-zinc-200 hover:text-white font-medium text-sm transition border border-white/[0.08] flex items-center justify-center gap-2"
            >
              <FileText size={16} className="text-zinc-400" />
              <span>Read Documentation</span>
            </Link>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-[#181922] hover:bg-[#20222c] text-zinc-400 hover:text-white font-mono text-xs transition border border-white/[0.08] flex items-center justify-center gap-1.5"
            >
              <span>/llms.txt</span>
              <ExternalLink size={12} className="text-zinc-500" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
