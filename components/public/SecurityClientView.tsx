"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Server,
  FileCheck2,
  Check,
  EyeOff,
  Terminal,
  Activity,
  Layers,
  FileCode2,
  AlertCircle,
  Copy,
  ChevronRight,
  Database,
  ArrowRight,
  Fingerprint,
} from "lucide-react";
import { getDashboardUrl } from "@/lib/subdomain";

type SecurityTab =
  | "auth"
  | "network"
  | "telemetry"
  | "keys"
  | "retention"
  | "disclosure";

interface SecuritySection {
  id: SecurityTab;
  label: string;
  badge: string;
  title: string;
  description: string;
  points: { title: string; detail: string; spec: string }[];
  codeSnippet?: { title: string; language: string; code: string };
}

const SECURITY_SECTIONS: SecuritySection[] = [
  {
    id: "auth",
    label: "Authentication & Sessions",
    badge: "Session Hardening",
    title: "Stateless Cryptographic Sessions & RBAC Isolation",
    description:
      "All administrative interactions utilize tamper-proof JSON Web Tokens stored exclusively in secure, browser-isolated cookies with strict role boundaries.",
    points: [
      {
        title: "HttpOnly & SameSite Cookie Storage",
        detail:
          "Authentication credentials never touch localStorage or client-side JavaScript execution context. Cookies are set with HttpOnly, Secure, and SameSite=Lax flags to eliminate cross-site scripting (XSS) exfiltration risks.",
        spec: "RFC 6265bis • HttpOnly • Secure • SameSite=Lax",
      },
      {
        title: "Argon2id & Bcrypt Password Hashing",
        detail:
          "User credentials are protected using salted password hashes with memory-hard cost factors designed to withstand GPU-accelerated dictionary and rainbow table attacks.",
        spec: "12 salt rounds • Memory-hard computational cost",
      },
      {
        title: "Granular 5-Tier Project RBAC",
        detail:
          "Database operations enforce workspace boundaries (Owner, Admin, Editor, Member, Super Admin). Every single query enforces multi-tenant isolation via mandatory projectId scoping.",
        spec: "Zero cross-tenant data leakage by design",
      },
    ],
    codeSnippet: {
      title: "Session Cookie Configuration",
      language: "typescript",
      code: `// lib/auth.ts - Hardened session cookie provisioning
res.cookies.set("open_session", jwtToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30-day session lifetime
});`,
    },
  },
  {
    id: "network",
    label: "Ingestion & CORS",
    badge: "Edge Security",
    title: "Edge Validation, Rate Limiting & Origin Whitelisting",
    description:
      "The Open Analytics edge telemetry gateway strictly validates incoming payloads and filters malicious traffic before database commits.",
    points: [
      {
        title: "Allowed Origins Enforcement",
        detail:
          "Projects declare explicit domain whitelists. Cross-origin tracking requests arriving from unauthorized domains or suspicious host headers are rejected immediately with 403 Forbidden.",
        spec: "Dynamic Origin verification • Project domain binding",
      },
      {
        title: "High-Throughput Token Bucket Rate Limiting",
        detail:
          "Edge endpoints enforce per-IP and per-project velocity ceilings to mitigate telemetry flooding, denial-of-service attempts, and automated spamming.",
        spec: "Sliding window token-bucket • Cloudflare edge caching",
      },
      {
        title: "Strict Transport Security & Modern TLS",
        detail:
          "All traffic requires TLS 1.3 with automated HSTS preloading. We enforce restrictive Content Security Policies, X-Frame-Options: DENY, and X-Content-Type-Options: nosniff.",
        spec: "HSTS max-age=63072000 • includeSubDomains • preload",
      },
    ],
    codeSnippet: {
      title: "Allowed Origin Validation",
      language: "typescript",
      code: `// lib/cors.ts - Origin validation
export function verifyAllowedOrigin(origin: string, allowedOrigins: string[]): boolean {
  if (!origin || allowedOrigins.length === 0) return true;
  const parsed = new URL(origin).hostname;
  return allowedOrigins.some((allowed) => 
    parsed === allowed || parsed.endsWith(\`.\${allowed}\`)
  );
}`,
    },
  },
  {
    id: "telemetry",
    label: "Data Sanitization",
    badge: "Privacy by Design",
    title: "RAM-Level IP Masking & Automated PII Redaction",
    description:
      "Raw visitor identifiers and personal data are stripped before telemetry is committed to permanent storage.",
    points: [
      {
        title: "Daily Rotating 256-Bit Cryptographic Salt",
        detail:
          "Visitor hashes are calculated in volatile memory by combining truncated IP addresses, User-Agents, and an ephemeral salt. Every 24 hours at 00:00 UTC, the salt is deleted, making cross-day visitor re-identification mathematically impossible.",
        spec: "HMAC-SHA256 • Ephemeral 24h key lifecycle",
      },
      {
        title: "IPv4/IPv6 Subnet Truncation",
        detail:
          "Raw IP addresses are never written to disk. IPv4 addresses have their final octet zeroed (/24 masking) and IPv6 addresses have their host portion stripped (/64 masking) prior to ephemeral hashing.",
        spec: "192.168.1.xxx • 2001:db8:85a3::/64",
      },
      {
        title: "Automated PII & Token Redaction",
        detail:
          "URL query strings and event payloads are sanitized to redact sensitive parameters like access_token, api_key, password, email, and session IDs before recording pageviews or error logs.",
        spec: "Regex redaction patterns for 20+ sensitive tokens",
      },
    ],
    codeSnippet: {
      title: "Visitor Hash Derivation",
      language: "typescript",
      code: `// lib/anonymize.ts - In-memory ephemeral visitor hash
export function generateVisitorHash(ip: string, userAgent: string, salt: string): string {
  const maskedIp = maskIpSubnet(ip); // Drops last octet
  return crypto
    .createHmac("sha256", salt)
    .update(\`\${maskedIp}-\${userAgent}\`)
    .digest("hex")
    .slice(0, 16);
}`,
    },
  },
  {
    id: "keys",
    label: "API Keys & Scopes",
    badge: "API Architecture",
    title: "Cryptographic Keys with Scoped Permissions",
    description:
      "Programmatic ingestion and reporting APIs use cryptographically secure tokens with revocable lifecycles.",
    points: [
      {
        title: "Hashed Key Storage",
        detail:
          "API keys are generated with high-entropy CSPRNG tokens. The raw key is displayed once upon creation and stored in MongoDB only as a SHA-256 hash digest.",
        spec: "crypto.randomBytes(32) • One-time display",
      },
      {
        title: "Prefix Recognition & Fast Routing",
        detail:
          "Keys feature recognizable prefixes (oa_live_...) enabling automated secret scanning by tools such as GitHub Secret Scanning and TruffleHog to detect accidental commits.",
        spec: "oa_live_[32 hex characters]",
      },
      {
        title: "Instant Revocation & Audit Logging",
        detail:
          "Project owners can revoke compromised keys instantly via the dashboard or API, terminating active ingestion connections within milliseconds.",
        spec: "Zero-latency revocation enforcement",
      },
    ],
    codeSnippet: {
      title: "API Key Validation",
      language: "typescript",
      code: `// lib/apiKey.ts - Constant-time key comparison
export function verifyApiKey(providedKey: string, storedHash: string): boolean {
  const calculatedHash = crypto.createHash("sha256").update(providedKey).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(calculatedHash),
    Buffer.from(storedHash)
  );
}`,
    },
  },
  {
    id: "retention",
    label: "Retention & Purge",
    badge: "Data Lifecycle",
    title: "Automated 365-Day TTL Index & Full Wipe API",
    description:
      "Data retention is governed by database-enforced expiration timers and project-level cryptographic deletion protocols.",
    points: [
      {
        title: "Automated 365-Day TTL Index Purge",
        detail:
          "All raw telemetry collections (PageView, AnalyticsEvent, ErrorLog, Notification) maintain native MongoDB TTL indexes that purge records older than 365 days automatically without background worker strain.",
        spec: "MongoDB TTL Index • expireAfterSeconds: 31536000",
      },
      {
        title: "Complete Workspace Wipe on Project Deletion",
        detail:
          "When a project owner deletes a project, all historical pageviews, error breadcrumbs, custom events, and Web Vitals entries associated with that projectId are erased immediately.",
        spec: "Synchronous cascade delete across all collections",
      },
      {
        title: "No Data Reselling or Aggregation",
        detail:
          "Open Analytics never pools, monetizes, aggregates, or sells your telemetry. Your data belongs exclusively to your organization, whether self-hosted or using Open Analytics Cloud.",
        spec: "100% customer data sovereignty",
      },
    ],
    codeSnippet: {
      title: "MongoDB TTL Index Definition",
      language: "typescript",
      code: `// models/PageView.ts - Native database TTL index
PageViewSchema.index(
  { timestamp: 1 }, 
  { expireAfterSeconds: 365 * 24 * 60 * 60 } // 365-day TTL
);`,
    },
  },
  {
    id: "disclosure",
    label: "Vulnerability Policy",
    badge: "Responsible Disclosure",
    title: "Security Reporting & Vulnerability Disclosure",
    description:
      "We prioritize fast responses and coordinated disclosure for all discovered vulnerabilities across Open Analytics Cloud and our open-source codebase.",
    points: [
      {
        title: "Dedicated Security Channel",
        detail:
          "Report vulnerabilities directly to our security engineering team at security@openanalytics.org.in. We acknowledge initial reports within 48 business hours.",
        spec: "security@openanalytics.org.in • 48-hour SLA",
      },
      {
        title: "RFC 9116 security.txt Implementation",
        detail:
          "Our security contact information, preferred encryption keys, and disclosure policy are published at /.well-known/security.txt for automated security researcher discovery.",
        spec: "RFC 9116 standard • https://openanalytics.org.in/.well-known/security.txt",
      },
      {
        title: "Safe Harbor for Ethical Researchers",
        detail:
          "We offer safe harbor to security researchers who act in good faith, avoid service degradation, do not access third-party data, and provide reasonable time for remediation prior to public disclosure.",
        spec: "Coordinated disclosure • Safe harbor commitment",
      },
    ],
    codeSnippet: {
      title: "RFC 9116 security.txt",
      language: "text",
      code: `Contact: mailto:security@openanalytics.org.in
Expires: 2027-12-31T23:59:59.000Z
Preferred-Languages: en
Policy: https://openanalytics.org.in/security
Acknowledgments: https://openanalytics.org.in/security#hall-of-fame`,
    },
  },
];

const SECURITY_HEADERS = [
  {
    header: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
    purpose: "Forces browser HTTPS connection for 2 years and protects against SSL stripping.",
  },
  {
    header: "X-Content-Type-Options",
    value: "nosniff",
    purpose: "Prevents MIME-type sniffing attacks by disallowing content type overrides.",
  },
  {
    header: "X-Frame-Options",
    value: "DENY",
    purpose: "Blocks UI clickjacking by prohibiting rendering inside iframes.",
  },
  {
    header: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
    purpose: "Prevents leaking sensitive pathnames or tokens across origin boundaries.",
  },
  {
    header: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
    purpose: "Restricts browser feature access from the telemetry tracking surface.",
  },
];

export default function SecurityClientView() {
  const [activeTab, setActiveTab] = useState<SecurityTab>("auth");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const activeSection =
    SECURITY_SECTIONS.find((s) => s.id === activeTab) || SECURITY_SECTIONS[0];
  const dashboardUrl = getDashboardUrl("/");

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-white">
      {/* Top Banner & Header */}
      <div className="relative border-b border-white/[0.08] overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8 font-mono">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-300">Security Architecture</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Enterprise-Grade Security Standards</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Security Architecture &amp; Data Protection
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
              Explore how Open Analytics safeguards analytical telemetry, enforces
              multi-tenant RBAC isolation, isolates session cookies, and purges
              ephemeral data through cryptographic design.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zero Cookies</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>In-Memory IP Masking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>365-Day Automated Purge</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>RFC 9116 Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <div className="p-3 bg-[#111218] border border-white/[0.08] rounded-xl space-y-1">
              <div className="px-3 py-2 text-xs font-mono uppercase text-zinc-500 tracking-wider">
                Security Pillars
              </div>
              {SECURITY_SECTIONS.map((section) => {
                const isActive = activeTab === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-all ${
                      isActive
                        ? "bg-white text-zinc-950 font-semibold shadow-sm"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <span>{section.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isActive
                          ? "bg-zinc-200 text-zinc-900"
                          : "bg-white/[0.06] text-zinc-400"
                      }`}
                    >
                      {section.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Metrics Card */}
            <div className="p-5 bg-[#111218] border border-white/[0.08] rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Security at a Glance</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-zinc-500">Encryption:</span>
                  <span className="text-white font-mono">TLS 1.3 / AES-256</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-zinc-500">Hashing:</span>
                  <span className="text-white font-mono">Argon2id / SHA-256</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-zinc-500">Salt Lifecycle:</span>
                  <span className="text-white font-mono">24 Hours (Rotating)</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-zinc-500">TTL Retention:</span>
                  <span className="text-white font-mono">365 Days Max</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Disclosure SLA:</span>
                  <span className="text-emerald-400 font-mono">48 Business Hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Section Detail */}
          <div className="lg:col-span-8 space-y-8">
            <div className="p-6 sm:p-8 bg-[#111218] border border-white/[0.08] rounded-xl space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono bg-white/[0.06] text-zinc-300">
                  <span>Section</span>
                  <span>•</span>
                  <span>{activeSection.badge}</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {activeSection.title}
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {activeSection.description}
                </p>
              </div>

              {/* Point-by-point breakdown */}
              <div className="space-y-4 pt-2">
                {activeSection.points.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#0e0f15] border border-white/[0.06] rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-sm font-semibold text-white">
                        {p.title}
                      </h3>
                      <span className="text-[10px] font-mono text-zinc-500 bg-white/[0.04] px-2 py-0.5 rounded shrink-0">
                        {p.spec}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {p.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Code Snippet Box */}
              {activeSection.codeSnippet && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
                    <div className="flex items-center gap-2">
                      <FileCode2 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{activeSection.codeSnippet.title}</span>
                    </div>
                    <button
                      onClick={() =>
                        handleCopyCode(activeSection.codeSnippet?.code || "")
                      }
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      {copiedSnippet ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 bg-[#090a0f] border border-white/[0.08] rounded-lg font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                    <code>{activeSection.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Hardened Security Headers Table */}
            <div className="p-6 sm:p-8 bg-[#111218] border border-white/[0.08] rounded-xl space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase font-mono text-emerald-400 tracking-wider">
                  <Layers className="w-4 h-4" />
                  <span>HTTP Security Headers Profile</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Defense-in-Depth HTTP Headers
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every response dispatched by Open Analytics Cloud and recommended for
                  self-hosted deployments includes strict modern browser defenses.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-zinc-400 font-mono text-[11px]">
                      <th className="pb-3 pr-4">Header</th>
                      <th className="pb-3 pr-4">Policy Value</th>
                      <th className="pb-3">Security Defense</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {SECURITY_HEADERS.map((h, i) => (
                      <tr key={i} className="hover:bg-white/[0.02]">
                        <td className="py-3 pr-4 font-mono text-white font-medium">
                          {h.header}
                        </td>
                        <td className="py-3 pr-4 font-mono text-zinc-400 text-[11px]">
                          {h.value}
                        </td>
                        <td className="py-3 text-zinc-400 leading-relaxed">
                          {h.purpose}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vulnerability Reporting CTA */}
            <div className="p-6 sm:p-8 bg-[#111218] border border-white/[0.08] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1 max-w-lg">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Found a Security Issue?</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Responsible Vulnerability Disclosure
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Please report potential security vulnerabilities to our team. We
                  investigate all reports promptly and coordinate responsible
                  disclosures.
                </p>
              </div>

              <a
                href="mailto:security@openanalytics.org.in"
                className="shrink-0 px-4 py-2.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-colors font-semibold text-xs inline-flex items-center gap-2"
              >
                <span>Report Vulnerability</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
