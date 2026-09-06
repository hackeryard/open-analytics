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
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <Bot size={13} />
          <span>Next-Gen Search & LLM Attribution</span>
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          SEO & AI Crawler Radar (AEO)
        </h1>
        <p className="text-sm text-muted-foreground">
          Track how artificial intelligence search engines and autonomous LLM crawlers index, cite, and discover your web content.
        </p>
      </div>

      <div className="p-6 bg-card border border-border rounded-3xl space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-foreground">Autonomous AI Crawlers Detected</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Pulse inspects incoming User-Agent signatures and referrer headers at the edge to categorize requests from the world's leading generative AI platforms:
        </p>

        <div className="space-y-2">
          {crawlers.map((c) => (
            <div key={c.name} className="p-3 bg-muted/20 border border-border rounded-2xl flex items-center justify-between gap-3 text-xs flex-wrap">
              <div>
                <span className="font-bold text-foreground">{c.name}</span>
                <span className="text-[11px] text-muted-foreground block font-mono">{c.bot}</span>
              </div>
              <span className="text-[11px] text-cyan-400 font-semibold">{c.focus}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
