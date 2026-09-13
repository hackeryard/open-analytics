// Open Analytics Bot, Search Engine & AI Crawler Detector

export interface BotDetectionResult {
  isBot: boolean;
  visitorType: "human" | "search_bot" | "ai_crawler";
  botCategory:
    | "none"
    | "openai"
    | "anthropic"
    | "perplexity"
    | "google_ai"
    | "meta_ai"
    | "bytedance_ai"
    | "apple_ai"
    | "cohere_ai"
    | "search_engine"
    | "other_bot";
  botName: string;
}

export interface ReferrerDetectionResult {
  searchEngine: string | null;
  aiReferrer: string | null;
  referrerDomain: string;
}

const AI_BOTS: Array<{ pattern: RegExp; category: BotDetectionResult["botCategory"]; name: string }> = [
  { pattern: /GPTBot/i, category: "openai", name: "GPTBot" },
  { pattern: /ChatGPT-User/i, category: "openai", name: "ChatGPT-User" },
  { pattern: /OAI-SearchBot/i, category: "openai", name: "OAI-SearchBot" },
  { pattern: /ClaudeBot/i, category: "anthropic", name: "ClaudeBot" },
  { pattern: /Claude-Web/i, category: "anthropic", name: "Claude-Web" },
  { pattern: /anthropic-ai/i, category: "anthropic", name: "Anthropic-AI" },
  { pattern: /PerplexityBot/i, category: "perplexity", name: "PerplexityBot" },
  { pattern: /Google-Extended/i, category: "google_ai", name: "Google-Extended" },
  { pattern: /GoogleOther/i, category: "google_ai", name: "GoogleOther" },
  { pattern: /Meta-ExternalAgent/i, category: "meta_ai", name: "Meta-ExternalAgent" },
  { pattern: /FacebookBot/i, category: "meta_ai", name: "FacebookBot" },
  { pattern: /Bytespider/i, category: "bytedance_ai", name: "Bytespider" },
  { pattern: /Applebot-Extended/i, category: "apple_ai", name: "Applebot-Extended" },
  { pattern: /cohere-ai/i, category: "cohere_ai", name: "Cohere-AI" },
  { pattern: /Diffbot/i, category: "other_bot", name: "Diffbot" },
  { pattern: /CCBot/i, category: "other_bot", name: "CCBot" },
  { pattern: /Amazonbot/i, category: "other_bot", name: "Amazonbot" },
];

const SEARCH_BOTS: Array<{ pattern: RegExp; name: string }> = [
  { pattern: /Googlebot/i, name: "Googlebot" },
  { pattern: /Bingbot/i, name: "Bingbot" },
  { pattern: /Slurp/i, name: "Yahoo Slurp" },
  { pattern: /DuckDuckBot/i, name: "DuckDuckBot" },
  { pattern: /Baiduspider/i, name: "Baiduspider" },
  { pattern: /YandexBot/i, name: "YandexBot" },
  { pattern: /Sogou/i, name: "Sogou Spider" },
  { pattern: /Exabot/i, name: "Exabot" },
  { pattern: /facebot/i, name: "Facebot" },
  { pattern: /ia_archiver/i, name: "Alexa/Internet Archive" },
];

const AI_REFERRERS: Array<{ domainPattern: RegExp; key: string }> = [
  { domainPattern: /(^|\.)chatgpt\.com$/i, key: "chatgpt" },
  { domainPattern: /(^|\.)perplexity\.ai$/i, key: "perplexity" },
  { domainPattern: /(^|\.)claude\.ai$/i, key: "claude" },
  { domainPattern: /gemini\.google\.com$/i, key: "gemini" },
  { domainPattern: /copilot\.microsoft\.com$/i, key: "copilot" },
  { domainPattern: /(^|\.)you\.com$/i, key: "you" },
  { domainPattern: /(^|\.)poe\.com$/i, key: "poe" },
];

const SEARCH_REFERRERS: Array<{ domainPattern: RegExp; key: string }> = [
  { domainPattern: /(^|\.)google\./i, key: "google" },
  { domainPattern: /(^|\.)bing\.com$/i, key: "bing" },
  { domainPattern: /(^|\.)duckduckgo\.com$/i, key: "duckduckgo" },
  { domainPattern: /(^|\.)yahoo\.com$/i, key: "yahoo" },
  { domainPattern: /(^|\.)ecosia\.org$/i, key: "ecosia" },
  { domainPattern: /(^|\.)baidu\.com$/i, key: "baidu" },
  { domainPattern: /(^|\.)yandex\./i, key: "yandex" },
  { domainPattern: /(^|\.)sogou\.com$/i, key: "sogou" },
  { domainPattern: /(^|\.)ask\.com$/i, key: "ask" },
];

export function detectBot(userAgent: string = ""): BotDetectionResult {
  if (!userAgent || typeof userAgent !== "string") {
    return { isBot: false, visitorType: "human", botCategory: "none", botName: "" };
  }

  // 1. Check AI Crawlers first
  for (const bot of AI_BOTS) {
    if (bot.pattern.test(userAgent)) {
      return {
        isBot: true,
        visitorType: "ai_crawler",
        botCategory: bot.category,
        botName: bot.name,
      };
    }
  }

  // 2. Check Standard Search Engine Crawlers
  for (const bot of SEARCH_BOTS) {
    if (bot.pattern.test(userAgent)) {
      return {
        isBot: true,
        visitorType: "search_bot",
        botCategory: "search_engine",
        botName: bot.name,
      };
    }
  }

  // 3. Generic bot heuristics
  if (/bot|crawler|spider|headless|crawl|archiver|transcoder/i.test(userAgent)) {
    return {
      isBot: true,
      visitorType: "search_bot",
      botCategory: "other_bot",
      botName: userAgent.substring(0, 40),
    };
  }

  return {
    isBot: false,
    visitorType: "human",
    botCategory: "none",
    botName: "",
  };
}

export function detectReferrer(referrerUrl: string = ""): ReferrerDetectionResult {
  if (!referrerUrl || typeof referrerUrl !== "string") {
    return { searchEngine: null, aiReferrer: null, referrerDomain: "Direct" };
  }

  try {
    const url = new URL(referrerUrl.startsWith("http") ? referrerUrl : `https://${referrerUrl}`);
    const host = url.hostname.toLowerCase();

    // Check AI Referrers
    for (const ai of AI_REFERRERS) {
      if (ai.domainPattern.test(host)) {
        return {
          searchEngine: null,
          aiReferrer: ai.key,
          referrerDomain: host,
        };
      }
    }

    // Check Search Referrers
    for (const search of SEARCH_REFERRERS) {
      if (search.domainPattern.test(host)) {
        return {
          searchEngine: search.key,
          aiReferrer: null,
          referrerDomain: host,
        };
      }
    }

    return {
      searchEngine: null,
      aiReferrer: null,
      referrerDomain: host || "Direct",
    };
  } catch (err) {
    return {
      searchEngine: null,
      aiReferrer: null,
      referrerDomain: referrerUrl.substring(0, 50) || "Direct",
    };
  }
}

export function detectBotAndReferrer(input: {
  userAgent?: string;
  referrer?: string;
}) {
  const bot = detectBot(input.userAgent || "");
  const ref = detectReferrer(input.referrer || "");

  return {
    ...bot,
    ...ref,
  };
}