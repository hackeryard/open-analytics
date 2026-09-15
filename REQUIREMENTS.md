# System Requirements & Technical Specifications: Open Analytics

## 1. Environment & Infrastructure Prerequisites

| Component | Minimum Requirement | Recommended |
| :--- | :--- | :--- |
| **Node.js** | v18.17.0+ | v20.x LTS |
| **Package Manager** | npm v9+ or yarn v1.22+ | yarn / pnpm |
| **Database** | MongoDB v6.0+ | MongoDB v7.0+ or MongoDB Atlas |
| **Memory (RAM)** | 1 GB for local development | 2 GB+ for production server |
| **Disk Space** | 500 MB for node_modules | SSD storage for database indexes |

---

## 2. Environment Variables Configuration

| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb://localhost:27017/open_analytics` |
| `JWT_SECRET` | Yes | Secret key for signing session tokens | `32+ characters random string` |
| `NEXT_PUBLIC_APP_URL` | Yes | Root URL of hosted dashboard | `https://openanalytics.org.in` |
| `NEXT_PUBLIC_API_URL` | Optional | Dedicated API & telemetry subdomain | `https://api.openanalytics.org.in` |
| `NODE_ENV` | Optional | Runtime environment | `development` / `production` |

---

## 3. Data Schemas & Model Contracts

### 3.1 `Project` Collection
- `projectId` (String, Unique, Index): Project identifier (e.g. `prj_abc123`).
- `name` (String): Human-readable workspace name.
- `slug` (String, Lowercase): URL-safe slug.
- `ownerId` (ObjectId, ref: User): Primary project owner.
- `members` (Array of objects): List of `{ userId: ObjectId, role: "admin" | "editor" | "member" }`.
- `publishableKey` (String, Unique): Public client key (`pk_live_...`).
- `secretKey` (String): Server-side ingestion secret (`sk_live_...`).
- `allowedDomains` (Array of Strings): Permitted CORS origins (e.g. `["app.acme.com"]` or `["*"]`).
- `settings`: Object containing `ipAnonymization`, `piiRedaction`, `dataRetentionDays`, and `errorRules`.

### 3.2 `PageView` Collection
- `projectId` (String, Indexed): Multi-tenant isolation key.
- `pathname` (String, Indexed): Active URL route path.
- `visitorId` (String, Indexed): Persistent client UUID stored in localStorage.
- `sessionId` (String, Indexed): Ephemeral session UUID reset after 30m idle.
- `duration` / `activeDuration` / `idleDuration` (Number): Dwell telemetry in seconds.
- `scrollDepth` (Number, 0-100): Maximum vertical scroll percentage.
- `isBounce` (Boolean): True if visitor only performed a single hit in session.
- `isReturning` (Boolean): True if visitor has visited before.
- `visitCount` (Number): Cumulative visit sequence number.
- `webVitals`: Object with `lcp`, `inp`, `cls`, `fcp`, `ttfb` metrics in milliseconds.
- `hardware`: Object with `memory`, `cores`, `gpu`, `dpr`, `viewport`.
- `network`: Object with `effectiveType` (5G/4G), `downlink`, `rtt`.

### 3.3 `SystemError` Collection
- `projectId` (String, Indexed): Multi-tenant isolation key.
- `message` (String): Error message string.
- `stack` (String): Full error stack trace.
- `errorType` (String): E.g. `TypeError`, `NetworkError`, `UnhandledRejection`.
- `pathname` (String): Route where error occurred.
- `occurrences` (Number): Frequency counter.
- `status` (Enum: `"new"` | `"investigating"` | `"resolved"` | `"ignored"`).
- `breadcrumbs` (Array): Circular buffer of preceding user actions.

---

## 4. Role-Based Access Control (RBAC) Matrix

| Action / Capability | Member | Editor | Admin | Owner | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| View Analytics & Real-Time Streams | Yes | Yes | Yes | Yes | Yes |
| View Errors & Behavioral Signals | Yes | Yes | Yes | Yes | Yes |
| Update Error Triage Status | No | Yes | Yes | Yes | Yes |
| Manage Error Suppression Rules | No | Yes | Yes | Yes | Yes |
| Modify Project Settings & Domains | No | No | Yes | Yes | Yes |
| Invite / Remove Team Members | No | No | Yes | Yes | Yes |
| Transfer Project Ownership | No | No | No | Yes | Yes |
| Permanently Delete Project | No | No | No | Yes | Yes |

---

## 5. Security & Privacy Compliance

1. **Cookieless Tracking**: The client script (`open.js`) operates without storing tracking cookies, using `localStorage` and `sessionStorage` strictly for pseudo-anonymous session coherence.
2. **GDPR/CCPA IP Anonymization**: When enabled, the last octet of IPv4 addresses is masked (`192.168.1.0`) and IPv6 addresses are truncated.
3. **Automated PII Sanitization**: URL query parameters containing tokens, password fields, or email identifiers are stripped before ingestion.
4. **CORS Origin Whitelisting**: Public endpoints validate `Origin` / `Referer` headers against `project.allowedDomains`.

---

## 6. Client Script & SDK API Contract

### 6.1 Script Tag Attributes
- `src`: Hosted script URL (e.g. `https://your-domain.com/open.js`).
- `data-project-id`: Target workspace project identifier (`prj_...`).
- `data-endpoint`: Optional server base URL if script is hosted on CDN/subdomain.
- `data-api-key`: Optional publishable API key (`pk_live_...`).

### 6.2 Global SDK Methods (`window.OpenAnalytics`)
- `track(eventName: string, properties?: object, value?: number)`: Ingests custom business/conversion events.
- `identify(userId: string, traits?: object)`: Binds persistent user identifier and traits to current visitor session.
- `captureError(err: Error | string, context?: object)`: Forwards manual errors, stack traces, and component stacks to error triage.
- `track404(pathname?: string, referrer?: string)`: Records broken link/not-found occurrences.
- `page(pathname?: string)`: Manually triggers pageview transitions for custom routing architectures.
