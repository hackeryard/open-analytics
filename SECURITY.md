# Security Policy

Open Analytics takes the security and privacy of web telemetry, user profiles, and operational infrastructure seriously. This document outlines our security architecture, data handling practices, and vulnerability disclosure procedures.

---

## 1. Supported Versions

Security updates are actively applied to the following release tracks:

| Version Track | Supported | Status |
| :--- | :--- | :--- |
| `v3.x` (Current) | Yes | Actively maintained with security patches |
| `v2.x` | No | Legacy release; upgrade to v3.x recommended |
| `< v2.0` | No | Deprecated |

---

## 2. Privacy & Telemetry Security Architecture

Open Analytics is engineered from the ground up to prevent unauthorized identification, data leakage, and tracking abuse:

### 1. Zero Cookies & Cryptographic Hashing
- No persistent cookies, LocalStorage tracking tokens, or canvas fingerprinting are written to client browsers.
- Visitor uniqueness is established using an HMAC-SHA-256 pseudo-anonymous hash derived from daily rotating client attributes and an ephemeral salt.
- The cryptographic salt rotates every midnight at 00:00 UTC, permanently disconnecting visitor tracking across consecutive days.

### 2. IP Anonymization & Discard
- Raw IP addresses are processed strictly in volatile memory at the edge for geographic country lookup.
- IP addresses are never written to disk or stored in MongoDB collections.

### 3. Automatic PII Redaction
- Ingestion pipelines automatically redact common Personally Identifiable Information (PII) from URL query strings, referrers, and payload parameters (e.g. `email`, `token`, `password`, `key`, `ssn`).

### 4. Allowed Origins & CORS Hardening
- Project owners can define allowed domain origins.
- Ingestion endpoints reject cross-origin requests from unauthorized origins unless configured for wildcard development.

### 5. Multi-Tenant Project Isolation & RBAC
- Analytical queries enforce strict tenant scoping via `projectId`.
- Role-based access control (RBAC) enforces granular permissions across `owner`, `admin`, `editor`, and `member` roles.

### 6. Data Retention Limits
- Raw telemetry collections (`PageView`, `AnalyticsEvent`, `ErrorLog`, `Notification`) enforce a 365-day TTL index.
- Automated purge runs daily via scheduled retention scripts to prevent permanent data accumulation.

---

## 3. Reporting a Vulnerability

If you discover a potential security vulnerability in Open Analytics, please report it responsibly:

### Disclosure Protocol
1. **Email:** Send details directly to `security@openanalytics.org.in` (or open a confidential security advisory on GitHub).
2. **Details to Include:**
   - Type of vulnerability (e.g. SSRF, XSS, authentication bypass, data leakage)
   - Step-by-step reproduction instructions or proof-of-concept script
   - Affected routes, endpoints, or components
   - Impact assessment
3. **Response Window:**
   - Initial acknowledgement within 48 hours.
   - Status update and patch evaluation within 5 business days.
4. **Public Disclosure:**
   - Please do not disclose vulnerabilities publicly or discuss them in public GitHub issues until a patched release has been validated and deployed.

Thank you for helping keep Open Analytics secure for developers, businesses, and website visitors worldwide.
