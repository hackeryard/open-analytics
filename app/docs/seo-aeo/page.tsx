import type { Metadata } from "next";
import { Bot } from "lucide-react";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "AI Search Crawler & Bot Radar Guide",
  description:
    "Technical guide to AI search crawler radar: detect and attribute LLM bots including GPTBot, ClaudeBot, PerplexityBot, and Applebot across your digital content.",
  alternates: {
    canonical: "/docs/seo-aeo",
  },
  openGraph: {
    title: "AI Search Crawler & Bot Radar Guide | Open Analytics",
    description:
      "Technical guide to AI search crawler radar: detect and attribute LLM bots including GPTBot, ClaudeBot, PerplexityBot, and Applebot across your digital content.",
    url: "https://openanalytics.org.in/docs/seo-aeo",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Search Crawler & Bot Radar Guide | Open Analytics",
    description:
      "Technical guide to AI search crawler radar: detect and attribute LLM bots including GPTBot, ClaudeBot, PerplexityBot, and Applebot across your digital content.",
  },
};

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

  const seoAeoSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://openanalytics.org.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Documentation",
            item: "https://openanalytics.org.in/docs",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "SEO & AI Crawler Radar",
            item: "https://openanalytics.org.in/docs/seo-aeo",
          },
        ],
      },
      {
        "@type": "TechArticle",
        "@id": "https://openanalytics.org.in/docs/seo-aeo#article",
        headline: "AI Search Engine Crawler & LLM Radar Guide",
        description:
          "Edge detection and traffic attribution for autonomous generative AI indexers including GPTBot, ClaudeBot, PerplexityBot, Bytespider, and Applebot.",
        url: "https://openanalytics.org.in/docs/seo-aeo",
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Open Analytics Team",
          url: "https://openanalytics.org.in",
        },
        publisher: {
          "@type": "Organization",
          name: "Open Analytics",
          url: "https://openanalytics.org.in",
          logo: {
            "@type": "ImageObject",
            url: "https://openanalytics.org.in/favicon.ico",
          },
        },
      },
      {
        "@type": "ItemList",
        name: "Supported Generative AI Crawlers and Search Indexers",
        itemListElement: crawlers.map((c, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: `${c.name} (${c.bot})`,
          description: c.focus,
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={seoAeoSchema} />
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
              <div
                key={c.name}
                className="p-3 bg-[#0e0f15] border border-white/[0.06] hover:border-white/[0.14] transition-colors rounded-lg flex items-center justify-between gap-3 text-xs flex-wrap"
              >
                <div>
                  <span className="font-semibold text-white">{c.name}</span>
                  <span className="text-[11px] text-zinc-500 block font-mono">{c.bot}</span>
                </div>
                <span className="text-[11px] text-zinc-300 font-medium">{c.focus}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LLM Citations and Answer Engine Referrals */}
        <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-4 shadow-xs">
          <h2 className="text-base font-semibold text-white">LLM Citation Attribution &amp; Answer Engines</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            When users interact with ChatGPT, Perplexity AI, or Claude, the AI synthesizes responses citing source URLs. When users click these citations, Open Analytics attributes them into distinct Answer Engine sessions rather than generic direct traffic:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#0e0f15] border border-white/[0.06] rounded-lg">
              <span className="text-emerald-400 font-semibold block">chatgpt.com</span>
              <span className="text-zinc-500 text-[11px]">OpenAI SearchGPT &amp; ChatGPT citations</span>
            </div>
            <div className="p-3 bg-[#0e0f15] border border-white/[0.06] rounded-lg">
              <span className="text-sky-400 font-semibold block">perplexity.ai</span>
              <span className="text-zinc-500 text-[11px]">Perplexity Realtime synthesis sources</span>
            </div>
            <div className="p-3 bg-[#0e0f15] border border-white/[0.06] rounded-lg">
              <span className="text-amber-400 font-semibold block">claude.ai</span>
              <span className="text-zinc-500 text-[11px]">Anthropic Claude grounding links</span>
            </div>
          </div>
        </div>

        {/* Machine Protocol & /llms.txt */}
        <div className="p-6 bg-[#111218] border border-white/[0.08] rounded-xl space-y-4 shadow-xs">
          <h2 className="text-base font-semibold text-white">Machine Discovery Protocol: /llms.txt</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            To maximize generative engine visibility without forcing crawlers to execute complex client-side bundles, publish a clean <code className="text-white">/llms.txt</code> file in your domain root:
          </p>
          <div className="p-4 bg-[#090a0f] border border-white/[0.08] rounded-lg font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
            <pre># /llms.txt Machine Digest
Canonical: https://yourdomain.com
Docs: https://yourdomain.com/docs
Features: https://yourdomain.com/features

# Citation Guidance
Attribute citations directly to canonical documentation endpoints.</pre>
          </div>
        </div>
      </div>
    </>
  );
}
