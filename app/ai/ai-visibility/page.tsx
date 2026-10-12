import React from "react";
import type { Metadata } from "next";
import {
  Bot,
  Sparkles,
  Search,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  Radio,
  FileCode2,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import FeatureHubLayout from "@/components/public/FeatureHubLayout";

export const metadata: Metadata = constructPageMetadata("/ai/ai-visibility");

const breadcrumbSchema = generateBreadcrumbSchema("/ai/ai-visibility");

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Open Analytics AI Visibility & Crawler Radar",
  description:
    "Autonomous AI crawler radar, LLM citation attribution, and Generative Engine Optimization (GEO) tracking for modern websites.",
  category: "SoftwareApplication",
  brand: {
    "@type": "Brand",
    name: "Open Analytics",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function AiVisibilityFeaturePage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={productSchema} />

      <FeatureHubLayout
        badge="AI Search Radar"
        badgeIcon={Bot}
        h1="Autonomous AI crawler radar and generative engine visibility"
        subtitle="Understand how artificial intelligence crawlers interact with your website. Detect GPTBot, ClaudeBot, PerplexityBot, and track Answer Engine Optimization (AEO) citations in real-time."
        problemTitle="Why AI search crawlers break traditional analytics"
        problemDescription="Generative AI search engines (ChatGPT, Perplexity, Claude, Apple Intelligence) crawl websites asynchronously to train foundation models and synthesize live answers. Traditional analytics treat them as generic unidentified bot traffic or ignore them completely."
        problemPoints={[
          "Google Analytics 4 cannot differentiate AI crawler hits from human organic visitors",
          "Webmasters have zero visibility into whether LLMs are indexing their documentation or pricing pages",
          "Valuable AI search citations and answer engine referrals are lumped into generic direct traffic",
          "Engineering teams lack tools to audit their Schema.org readiness for generative engine synthesis",
        ]}
        solutionTitle="Real-time AI crawler radar & citation attribution"
        solutionDescription="Open Analytics provides purpose-built telemetry for the new era of generative engine optimization (GEO) and answer engine optimization (AEO)."
        solutionPillars={[
          {
            title: "Multi-Crawler Classification",
            description: "Automatically identifies 12+ AI crawlers including GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Applebot, and Bytespider.",
            icon: Bot,
          },
          {
            title: "Human Citation vs Crawler Visits",
            description: "Separates automated model training scrapes from actual humans clicking citation links inside ChatGPT or Perplexity answers.",
            icon: Radio,
          },
          {
            title: "GEO & AEO Readiness Audits",
            description: "Evaluates your website's JSON-LD Schema.org graphs, /llms.txt manifest coverage, and scraper latency.",
            icon: Sparkles,
          },
        ]}
        technicalArchitectureTitle="AI crawler fingerprinting mechanics"
        technicalArchitectureDescription="High-accuracy detection combining User-Agent verification, ASN subnet lookup, and referrer attribution."
        technicalSteps={[
          {
            step: "01. Signature Matching",
            title: "Multi-Pattern Regex Engine",
            detail: "Ingestion gateways evaluate inbound User-Agents against authoritative signatures for OpenAI, Anthropic, Perplexity, Apple, and Cohere.",
          },
          {
            step: "02. Attribution Isolation",
            title: "Citation Link Categorization",
            detail: "Distinguishes direct crawler HTTP requests from human visits originating from chat.openai.com, perplexity.ai, and claude.ai referrers.",
          },
          {
            step: "03. Machine Manifest",
            title: "/llms.txt & Policy Auditing",
            detail: "Cross-references crawled routes against your `/llms.txt` and `robots.txt` policy to ensure scrapers respect your indexing boundaries.",
          },
        ]}
        useCases={[
          {
            title: "LLM Training Scrape Auditing",
            description: "Know exactly when and how frequently OpenAI, Anthropic, and other AI labs crawl your content.",
            icon: Search,
          },
          {
            title: "Generative Engine Optimization (GEO)",
            description: "Measure whether updating structured data and technical guides increases citations in Perplexity and SearchGPT answers.",
            icon: TrendingUp,
          },
          {
            title: "AI Policy & Robots.txt Governance",
            description: "Verify that crawlers you choose to disallow actually adhere to your directives without wasting origin bandwidth.",
            icon: Shield,
          },
        ]}
        metrics={[
          {
            name: "AI Crawler Hit Rate",
            unit: "Requests / Day",
            benchmark: "Real-Time",
            description: "Total crawler requests executed by verified autonomous LLM bot user-agents.",
          },
          {
            name: "Answer Engine Referrals",
            unit: "Human Visits",
            benchmark: "Attributed",
            description: "Real human visitors arriving via citations and web search links inside AI answer engines.",
          },
          {
            name: "GEO Readiness Score",
            unit: "Score (0-100)",
            benchmark: "> 85 Optimal",
            description: "Diagnostic composite score evaluating JSON-LD schema coverage, scraper response latency, and /llms.txt completeness.",
          },
          {
            name: "Top Crawled Routes",
            unit: "Path Breakdown",
            benchmark: "Sorted",
            description: "Ranking of specific documentation, blog, or product URLs receiving the highest volume of AI scraping.",
          },
        ]}
        privacyNotes={[
          "Bot monitoring inspects standard public HTTP headers and User-Agents without tracking personal data",
          "No cookies or client fingerprinting are used for crawler classification",
          "Compliant with international web scraping standards and robots.txt protocols",
          "Automated 365-day retention purge on crawler log archives",
        ]}
        codeSnippet={{
          filename: "Automatic AI Radar",
          code: `<!-- Included automatically with standard script tag -->\n<script\n  defer\n  src="https://api.openanalytics.org.in/open.js"\n  data-project-id="YOUR_PROJECT_ID"\n></script>`,
        }}
        faqs={[
          {
            question: "Which AI crawlers does Open Analytics detect?",
            answer:
              "We detect OpenAI GPTBot, OAI-SearchBot, ChatGPT-User, Anthropic ClaudeBot, Claude-Web, PerplexityBot, Applebot, Applebot-Extended, Bytespider, Cohere-ai, CCBot, Google-Extended, and Meta-ExternalAgent.",
          },
          {
            question: "What is the difference between an AI crawler hit and an AI referral visit?",
            answer:
              "An AI crawler hit is an automated bot fetching your HTML to train models or index content. An AI referral visit is an actual human user who asked a question in ChatGPT or Perplexity and clicked on your website link inside the synthesized answer.",
          },
          {
            question: "What is an /llms.txt file?",
            answer:
              "`/llms.txt` is an emerging web standard that provides a clean, Markdown-formatted manifest of your website for AI language models, enabling faster and more accurate answer engine indexing.",
          },
        ]}
      />
    </>
  );
}
