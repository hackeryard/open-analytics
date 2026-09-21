"use client";

import React from "react";
import { Bot } from "lucide-react";

export default function SeoAeoDocsPage() {
  const crawlers = [
    { name: "OpenAI", bot: "GPTBot, ChatGPT-User, OAI-SearchBot", focus: "ChatGPT indexer & citation retrieval" },
    { name: "Anthropic", bot: "ClaudeBot, Claude-Web, anthropic-ai", focus: "Claude knowledge training & web research" },
    { name: "Perplexity AI", bot: "PerplexityBot", focus: "Real-time answer engine search synthesis" },
    { name: "ByteDance / Doubao", bot: "Bytespider", focus: "Doubao LLM crawler and content indexer" },
    { name: "Google AI", bot: "Google-Extended, GoogleOther", focus: "Gemini knowledge ingestion" },
    { name: "Meta AI", bot: "Meta-ExternalAgent, FacebookBot", focus: "Llama web search and social indexing" },
    { name: "Apple Intelligence", bot: "Applebot-Extended", focus: "Siri & Apple Intelligence answer retrieval" },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-300 text-xs font-semibold">
          <Bot size={13} />
          <span>Next-Gen Search &amp; LLM Attribution</span>
        </div>
        <h1 className="text-3xl font-semibold text-white tracking-tight">
          SEO &amp; AI Crawler Radar (AEO)
        </h1>
        <p className="text-sm text-zinc-400">
          Track how artificial intelligence search engines and autonomous LLM crawlers index, cite, and discover your web content.
        </p>
      </div>

      <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-4 shadow-xs">
        <h2 className="text-base font-semibold text-white">Autonomous AI Crawlers Detected</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Open Analytics inspects incoming User-Agent signatures and referrer headers at the edge to categorize requests from the world's leading generative AI platforms:
        </p>

        <div className="space-y-2">
          {crawlers.map((c) => (
            <div key={c.name} className="p-3 bg-[#0e0f15] border border-white/[0.06] hover:border-white/[0.14] transition-colors rounded-lg flex items-center justify-between gap-3 text-xs flex-wrap">
              <div>
                <span className="font-semibold text-white">{c.name}</span>
                <span className="text-[11px] text-zinc-500 block font-mono">{c.bot}</span>
              </div>
              <span className="text-[11px] text-zinc-300 font-medium">{c.focus}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
