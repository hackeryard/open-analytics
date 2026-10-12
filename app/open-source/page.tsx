import React from "react";
import type { Metadata } from "next";
import {
  Code2,
  Shield,
  Layers,
  Sparkles,
  Server,
  Cloud,
  CheckCircle2,
  Terminal,
  Activity,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { constructPageMetadata, generateBreadcrumbSchema } from "@/lib/seo/metadata";
import FeatureHubLayout from "@/components/public/FeatureHubLayout";

export const metadata: Metadata = constructPageMetadata("/open-source");

const breadcrumbSchema = generateBreadcrumbSchema("/open-source");

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Open Analytics Open-Source Edition",
  description:
    "Open-source, self-hostable web analytics and frontend observability platform licensed under Apache 2.0.",
  applicationCategory: "DeveloperApplication, BusinessApplication",
  license: "https://www.apache.org/licenses/LICENSE-2.0",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function OpenSourcePage() {
  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <JsonLd data={softwareSchema} />

      <FeatureHubLayout
        badge="Apache-2.0 Licensed"
        badgeIcon={Code2}
        h1="Open-source web analytics built in the open"
        subtitle="Transparent, auditable, and community-driven. Own your telemetry data completely or use managed Open Analytics Cloud for hands-off scale."
        problemTitle="The danger of closed-source blackbox analytics"
        problemDescription="Proprietary analytics vendors lock your data into proprietary formats, change privacy terms without notice, monetize your visitors, and enforce predatory pricing tiers."
        problemPoints={[
          "Closed-source trackers prevent security teams from verifying what data is collected from visitors",
          "Proprietary cloud vendors can delete or throttle historical telemetry without recourse",
          "Surveillance advertising incentives conflict directly with visitor data sovereignty",
          "Strict data sovereignty laws (GDPR, HIPAA, Schrems II) mandate on-premise infrastructure control",
        ]}
        solutionTitle="100% open-source core with commercial cloud convenience"
        solutionDescription="Open Analytics provides an open-source core distributed under the permissive Apache License 2.0, coupled with an enterprise cloud tier for teams that want zero server management."
        solutionPillars={[
          {
            title: "Full Code Transparency",
            description: "Inspect the tracker script, ingestion handlers, and aggregation queries. Verify zero hidden tracking cookies.",
            icon: Shield,
          },
          {
            title: "Complete Data Sovereignty",
            description: "Deploy on your own servers or Kubernetes clusters. Keep 100% of telemetry in your private database.",
            icon: Server,
          },
          {
            title: "Managed Cloud Available",
            description: "Prefer not to manage databases, upgrades, and edge SSL? Open Analytics Cloud provides instant infrastructure.",
            icon: Cloud,
          },
        ]}
        technicalArchitectureTitle="Open core architecture and modularity"
        technicalArchitectureDescription="Engineered with clean separation of concerns between client beacon, edge collection, and visualization."
        technicalSteps={[
          {
            step: "01. Tracker Beacon",
            title: "Vanilla TypeScript Client",
            detail: "A zero-dependency, sub-3.2KB asynchronous tracking script that hooks into standard browser APIs.",
          },
          {
            step: "02. Ingestion Pipeline",
            title: "Next.js & Node.js Edge Collector",
            detail: "Stateless edge handlers that validate origins, perform volatile IP masking, and persist raw events.",
          },
          {
            step: "03. Analytics Console",
            title: "Obsidian Precision Workspace",
            detail: "High-contrast developer dashboard built with Next.js 14 App Router, Tailwind CSS, and Chart.js.",
          },
        ]}
        useCases={[
          {
            title: "Regulated Enterprise Deployments",
            description: "Deploy in air-gapped or private cloud environments that strictly forbid third-party data egress.",
            icon: Shield,
          },
          {
            title: "Developer Community Projects",
            description: "Add analytics to open-source tools, documentation sites, and developer hubs without tracking cookies.",
            icon: Code2,
          },
          {
            title: "High-Volume Data Pipelines",
            description: "Ingest millions of monthly events on self-hosted hardware without per-seat or per-event billing penalties.",
            icon: Layers,
          },
        ]}
        metrics={[
          {
            name: "License",
            unit: "Type",
            benchmark: "Apache 2.0",
            description: "Permissive open-source license allowing self-hosting, commercial use, and modifications.",
          },
          {
            name: "Dependencies",
            unit: "Client Script",
            benchmark: "0 External",
            description: "Zero external npm dependencies in the tracking beacon for maximum reliability and security.",
          },
          {
            name: "Database Backend",
            unit: "Storage",
            benchmark: "MongoDB 6.0+",
            description: "Battle-tested document storage with native automated 365-day TTL indexing support.",
          },
          {
            name: "Runtime",
            unit: "Environment",
            benchmark: "Node.js >= 18",
            description: "Standard cross-platform JavaScript runtime compatible with Linux, Docker, and Kubernetes.",
          },
        ]}
        privacyNotes={[
          "Open source ensures full independent auditability of all data processing logic",
          "Zero telemetry reporting back to project maintainers from self-hosted instances",
          "Cryptographic ephemeral salt rotation prevents cross-day tracking",
          "Permissive license with no vendor telemetry traps",
        ]}
        codeSnippet={{
          filename: "Self-Host Quickstart",
          code: `# Clone repository\ngit clone <repository-url>\ncd open-analytics\n\n# Install dependencies\nnpm install\n\n# Start development server\nnpm run dev`,
        }}
        faqs={[
          {
            question: "Is Open Analytics really 100% free for self-hosting?",
            answer:
              "Yes. The entire core platform—including tracker, web analytics, RUM, rage click detection, error triage, and AI bot radar—is licensed under Apache 2.0 and completely free to self-host without feature gates.",
          },
          {
            question: "Why does Open Analytics Cloud exist if the software is open source?",
            answer:
              "Open Analytics Cloud is for teams that want the benefits of Open Analytics without managing MongoDB clusters, automated backups, SSL certificates, edge CDN distribution, and infrastructure scaling.",
          },
          {
            question: "Can I migrate from self-hosted to Cloud (or vice versa)?",
            answer:
              "Yes. Open Analytics uses standard JSON and CSV schemas, allowing you to export and import your projects and telemetry between self-hosted instances and our Cloud platform at any time.",
          },
        ]}
      />
    </>
  );
}
