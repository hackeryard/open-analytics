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
| `PAYMENT_PROVIDER` | Optional | Active payment gateway provider (`manual` / `razorpay`) | `manual` (default for temporary offline launch) |
| `RAZORPAY_KEY_ID` | Optional | Razorpay API Key ID (Server) | `rzp_test_...` / `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | Optional | Razorpay API Key Secret (Server) | Secret token from Razorpay dashboard |
| `RAZORPAY_WEBHOOK_SECRET` | Optional | Razorpay Webhook HMAC secret | Custom secret set in Razorpay webhooks |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Optional | Public Razorpay Key ID for client checkout | `rzp_test_...` / `rzp_live_...` |

---

## 3. Data Schemas & Model Contracts

### 3.0 `User` Collection
- `name` (String): User's full name.
- `email` (String, Unique, Index): User's email address.
- `role` (String, Enum: `"super_admin" | "admin" | "editor" | "member"`): User global role.
- `plan` (String, Enum: `"free" | "pro" | "enterprise"`): Active subscription tier (default: `"free"`).
- `planExpiresAt` (Date, Nullable): Expiration date of current paid subscription.
- `billingCycle` (String, Enum: `"monthly" | "annual"`): Billing interval.
- `extraProjectsAllowed` (Number): Extra website slots beyond base limit for Enterprise/add-ons.
- `subscriptionStatus` (String, Enum: `"active" | "trialing" | "past_due" | "canceled" | "expired"`).
- `razorpayCustomerId` (String): Associated Razorpay customer reference.
- `razorpayPaymentId` (String): Latest successful payment ID (`pay_...`).
- `razorpayOrderId` (String): Latest verified Razorpay order ID (`order_...`).
- `lockedActiveProjectId` (String): Designated active tracking website locked when user is on Free plan with multiple projects.
- `activeProjectSelectedAt` (Date, Nullable): Timestamp when the active website was locked.

### 3.0.1 `SubscriptionPlan` Collection
- `planId` (String, Unique): Plan identifier (e.g. `pro-monthly`, `pro-annual`, `enterprise-monthly`, `enterprise-annual`).
- `name` (String): Display name.
- `slug` (String): Identifier slug.
- `tier` (String, Enum: `"free" | "pro" | "enterprise"`).
- `price` (Number): Price in INR.
- `currency` (String, default: `"INR"`).
- `billingInterval` (String, Enum: `"monthly" | "annual"`).
- `features` (Array of Strings): Marketing feature bullets.
- `maxProjects` / `monthlyEventsPerProject` / `maxMembersPerProject` / `retentionDays` (Numbers): Plan limits.
- `isActive` (Boolean): Plan availability status.

### 3.0.2 `SubscriptionRequest` Collection
- `userId` (ObjectId, ref: User): Requester user ID.
- `userEmail` (String): User email address.
- `planId` / `planName` / `tier` / `billingInterval`: Requested plan specifications.
- `price` / `currency`: Verified plan price snapshot at time of request.
- `status` (String, Enum: `"requested" | "contacted" | "payment_pending" | "completed" | "rejected" | "cancelled"`).
- `message` (String): Optional user notes or enterprise requirements.
- `adminNotes` (String): Internal administrator notes.
- `subscriptionId` (ObjectId, ref: Subscription, Nullable): Created subscription upon approval.
- `paymentId` (ObjectId, ref: Payment, Nullable): Associated verified payment record.

### 3.0.3 `Subscription` Collection
- `userId` (ObjectId, ref: User): Subscriber user ID.
- `planId` (String): Plan identifier.
- `planTier` (String, Enum: `"pro" | "enterprise"`).
- `billingCycle` (String, Enum: `"monthly" | "annual"`).
- `status` (String, Enum: `"active" | "past_due" | "canceled" | "expired"`).
- `startDate` (Date): Subscription start timestamp.
- `endDate` (Date): Subscription expiry timestamp.
- `paymentProvider` (String, default: `"manual"`): Payment provider identifier (`"manual" | "razorpay"`).
- `paymentId` (ObjectId, ref: Payment): Primary payment record.

### 3.0.4 `Payment` Collection
- `userId` (ObjectId, ref: User): User ID.
- `requestId` (ObjectId, ref: SubscriptionRequest): Originating request.
- `subscriptionId` (ObjectId, ref: Subscription): Granted subscription.
- `amount` / `currency`: Transaction value in INR.
- `status` (String, Enum: `"pending" | "paid" | "failed" | "refunded"`).
- `provider` (String, Enum: `"manual" | "razorpay"`).
- `providerPaymentId` (String): Reference ID or transaction receipt.
- `paidAt` (Date): Verification timestamp.
- `recordedByAdminId` (ObjectId, ref: User): Administrator who verified funds.
- `notes` (String): Verification memo.

### 3.0.5 `SubscriptionAuditLog` Collection
- `adminId` (ObjectId, Nullable): Admin who performed action.
- `action` (String): Event type (`request_created`, `request_updated`, `request_cancelled`, `subscription_activated`, `subscription_expired`).
- `affectedUserId` (ObjectId): Target subscriber ID.
- `requestId` / `subscriptionId` / `paymentId`: Related document references.
- `metadata` (Mixed): Action payload snapshot.

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
