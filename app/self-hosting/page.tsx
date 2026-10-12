import React from "react";
import type { Metadata } from "next";
import {
  Server,
  Terminal,
  Shield,
  Layers,
  Sparkles,
  Database,
  Cpu,
  Lock,
  ArrowRight,
  HardDrive,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import FeatureHubLayout from "@/components/public/FeatureHubLayout";

export const metadata: Metadata = constructPageMetadata("/self-hosting");

const breadcrumbSchema = generateBreadcrumbSchema("/self-hosting");

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Self-Host Open Analytics on Your Own Infrastructure",
  description:
    "Complete deployment guide for self-hosting Open Analytics with Node.js, Docker, MongoDB, and automated data retention policies.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Team",
  },
};

export default function SelfHostingPage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={articleSchema} />

      <FeatureHubLayout
        badge="Self-Hosting Guide"
        badgeIcon={Server}
        h1="Self-host Open Analytics on your own infrastructure"
        subtitle="Deploy on Docker, Linux, or Kubernetes. Total data sovereignty, MongoDB persistence, automated TTL purging, and zero third-party vendor lock-in."
        problemTitle="Why privacy-conscious teams self-host analytics"
        problemDescription="Sending visitor telemetry to US-hosted cloud providers creates legal uncertainty under GDPR, NIS2, and strict data sovereignty frameworks. Self-hosting guarantees total custody of your telemetry data."
        problemPoints={[
          "Third-party analytics servers can expose user data during sub-processor data breaches",
          "Cross-border telemetry transfers risk violating EU Schrems II and regional data privacy laws",
          "Cloud analytics quotas impose steep billing spikes as your web traffic scales",
          "Air-gapped enterprise networks and internal portals cannot send telemetry to external cloud endpoints",
        ]}
        solutionTitle="Simple, reliable, low-maintenance deployment"
        solutionDescription="Open Analytics requires only Node.js and MongoDB to run. It deploys cleanly as a standard container or service with zero external dependencies."
        solutionPillars={[
          {
            title: "Single MongoDB Requirement",
            description: "No complex multi-database stacks or message queues required. Operates with standard MongoDB 6.0+ instances.",
            icon: Database,
          },
          {
            title: "Automated Data Retention",
            description: "Built-in 365-day TTL indexes and purge scripts automatically prevent databases from unbounded disk growth.",
            icon: HardDrive,
          },
          {
            title: "Environment Variable Config",
            description: "Configure ports, database URIs, JWT secrets, and allowed origins entirely through clean standard environment variables.",
            icon: Lock,
          },
        ]}
        technicalArchitectureTitle="Self-hosted infrastructure topology"
        technicalArchitectureDescription="Standard three-tier architecture: edge reverse proxy, Next.js application server, and MongoDB cluster."
        technicalSteps={[
          {
            step: "01. Database Setup",
            title: "MongoDB Cluster Configuration",
            detail: "Provision a local MongoDB container or managed MongoDB Atlas cluster with replica sets for real-time change streams.",
          },
          {
            step: "02. Environment Setup",
            title: ".env.local Configuration",
            detail: "Set MONGODB_URI, JWT_SECRET, and your public domain origins (NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_API_URL).",
          },
          {
            step: "03. Reverse Proxy & Edge",
            title: "Nginx / Cloudflare Configuration",
            detail: "Route apex traffic to the Next.js app and serve `/open.js` with public CORS and HTTP caching headers.",
          },
        ]}
        useCases={[
          {
            title: "Healthcare & FinTech Compliance",
            description: "Keep telemetry in on-premise HIPAA and SOC2-certified private cloud environments without external network egress.",
            icon: Shield,
          },
          {
            title: "Internal Corporate Intranets",
            description: "Track employee portal usage, internal documentation, and private SaaS dashboards with total isolation.",
            icon: Lock,
          },
          {
            title: "Ultra-High Traffic Portals",
            description: "Ingest tens of millions of monthly events on dedicated servers without paying thousands in cloud vendor overage fees.",
            icon: Cpu,
          },
        ]}
        metrics={[
          {
            name: "Minimum CPU",
            unit: "Cores",
            benchmark: "1 vCPU",
            description: "Sufficient to ingest up to 2 million monthly pageviews comfortably.",
          },
          {
            name: "Minimum RAM",
            unit: "Memory",
            benchmark: "1 GB RAM",
            description: "Lightweight runtime footprint with low baseline memory consumption.",
          },
          {
            name: "Database Engine",
            unit: "Version",
            benchmark: "MongoDB 6.0+",
            description: "Standard document database with support for secondary indices and TTL expiration.",
          },
          {
            name: "Network Overhead",
            unit: "Transfer",
            benchmark: "< 3.2 KB / hit",
            description: "Featherweight Brotli compressed payload sent over HTTP/2 or HTTP/3.",
          },
        ]}
        privacyNotes={[
          "100% of telemetry data remains inside your own private database network",
          "Zero analytics pings, beacons, or telemetry phone-home calls to external servers",
          "Ephemeral daily salts rotate locally without external key management dependencies",
          "Completely compliant with GDPR, Swiss FADP, CCPA, and enterprise security policies",
        ]}
        codeSnippet={{
          filename: "Environment Configuration (.env.local)",
          code: `# Database & Auth\nMONGODB_URI=mongodb://localhost:27017/open_analytics\nJWT_SECRET=your_32_character_random_secret_string\n\n# Domain Origins\nNEXT_PUBLIC_APP_URL=https://analytics.yourcompany.com\nNEXT_PUBLIC_API_URL=https://analytics.yourcompany.com\n\n# Port\nPORT=3005`,
        }}
        faqs={[
          {
            question: "How do I upgrade self-hosted Open Analytics to the latest version?",
            answer:
              "Pull the latest updates from your repository and run `npm install && npm run build`. Database schemas automatically adapt backward-compatibly without disruptive migrations.",
          },
          {
            question: "How is data retention handled in self-hosted instances?",
            answer:
              "Open Analytics automatically configures a 365-day TTL index on MongoDB raw collections. You can also run `npm run purge:retention` via cron to manually enforce retention boundaries.",
          },
          {
            question: "Can I run Open Analytics behind Nginx or Caddy?",
            answer:
              "Yes. Open Analytics runs as a standard Node.js HTTP server. Configure Nginx or Caddy as a reverse proxy passing `X-Forwarded-For` and `Host` headers to port 3005.",
          },
        ]}
      />
    </>
  );
}
