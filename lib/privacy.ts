export function anonymizeIp(ip: string): string {
  if (!ip || ip === "Unknown") return "Unknown";
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return parts.slice(0, 3).join(":") + "::";
  }
  return ip;
}

export function redactPii(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;

  const PII_KEYS = ["password", "token", "secret", "auth", "authorization", "cookie", "ssn", "credit_card", "card"];
  const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  if (Array.isArray(obj)) {
    return obj.map((item) => redactPii(item));
  }

  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lower = key.toLowerCase();
    if (PII_KEYS.some((pk) => lower.includes(pk))) {
      clean[key] = "[REDACTED]";
    } else if (typeof value === "string") {
      clean[key] = value.replace(EMAIL_REGEX, "[EMAIL]");
    } else if (typeof value === "object" && value !== null) {
      clean[key] = redactPii(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}