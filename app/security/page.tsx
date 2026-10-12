import React from "react";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import SecurityClientView from "@/components/public/SecurityClientView";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

const baseUrl = "https://openanalytics.org.in";

export const metadata: Metadata = {
  title: "Security Architecture & Standards | Open Analytics",
  description:
    "Explore Open Analytics enterprise security: end-to-end TLS 1.3, multi-tenant RBAC isolation, Argon2id hashing, and automated 365-day TTL retention purges.",
  keywords: [
    "open analytics security architecture",
    "telemetry security",
    "multi-tenant rbac analytics",
    "argon2 password hashing",
    "httponly session cookie security",
    "ip anonymization engineering",
    "rfc 9116 security txt",
    "vulnerability disclosure policy",
    "cors allowed origins analytics",
  ],
  alternates: {
    canonical: `${baseUrl}/security`,
  },
  openGraph: {
    title: "Security Architecture & Standards | Open Analytics",
    description:
      "Explore Open Analytics enterprise security: end-to-end TLS 1.3, multi-tenant RBAC isolation, Argon2id hashing, and automated 365-day TTL retention purges.",
    url: `${baseUrl}/security`,
    type: "article",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Open Analytics Security Architecture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Security Architecture & Standards | Open Analytics",
    description:
      "Explore Open Analytics enterprise security: end-to-end TLS 1.3, multi-tenant RBAC isolation, Argon2id hashing, and automated 365-day TTL retention purges.",
    images: [`${baseUrl}/og-image.png`],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Security",
      item: `${baseUrl}/security`,
    },
  ],
};

const securityArticleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": `${baseUrl}/security/#article`,
  headline: "Open Analytics Enterprise Security & Hardening Architecture",
  description:
    "Technical overview of authentication, session hardening, edge CORS protection, IP masking in memory, and automated database TTL purge routines.",
  author: {
    "@type": "Organization",
    name: "Open Analytics Security Team",
    url: baseUrl,
  },
  publisher: {
    "@type": "Organization",
    name: "Open Analytics",
    url: baseUrl,
  },
};

const securityFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does Open Analytics authenticate and isolate user sessions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sessions are managed using cryptographically signed JSON Web Tokens stored exclusively in HttpOnly, Secure, SameSite=Lax cookies. Telemetry database queries enforce project-level boundaries, preventing cross-tenant data leaks.",
      },
    },
    {
      "@type": "Question",
      name: "How are IP addresses handled securely during telemetry collection?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Raw IP addresses are masked in volatile memory by zeroing the last octet (IPv4 /24) or stripping host portions (IPv6 /64). Ephemeral hashes are generated using daily rotating 256-bit cryptographic salts, and raw IPs are never stored to disk.",
      },
    },
    {
      "@type": "Question",
      name: "What is Open Analytics vulnerability disclosure SLA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Reports submitted to security@openanalytics.org.in receive initial engineering acknowledgment within 48 business hours, following coordinated disclosure guidelines.",
      },
    },
  ],
};

export default function SecurityPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={securityArticleSchema} />
      <JsonLd schema={securityFaqSchema} />
      <PublicNavbar />
      <main>
        <SecurityClientView />
      </main>
      <PublicFooter />
    </>
  );
}
