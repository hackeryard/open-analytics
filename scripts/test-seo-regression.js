import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("=== Open Analytics: Automated SEO & Registry Regression Suite ===");

const routesFilePath = path.join(rootDir, "lib", "seo", "routes.ts");
if (!fs.existsSync(routesFilePath)) {
  console.error("ERROR: lib/seo/routes.ts not found.");
  process.exit(1);
}

const fileContent = fs.readFileSync(routesFilePath, "utf8");

// Regular expression to parse route entries from ROUTE_REGISTRY
const routeBlockRegex = /"(\/[^"]*)":\s*\{([^}]+)\}/g;
let match;
const parsedRoutes = [];

// Simple emoji detector
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

while ((match = routeBlockRegex.exec(fileContent)) !== null) {
  const routePath = match[1];
  const body = match[2];

  const titleMatch = body.match(/title:\s*"([^"]+)"/);
  const descMatch = body.match(/description:\s*"([^"]+)"/);
  const h1Match = body.match(/h1:\s*"([^"]+)"/);
  const catMatch = body.match(/category:\s*"([^"]+)"/);

  if (titleMatch && descMatch && h1Match) {
    parsedRoutes.push({
      path: routePath,
      title: titleMatch[1],
      description: descMatch[1],
      h1: h1Match[1],
      category: catMatch ? catMatch[1] : "Unknown",
    });
  }
}

console.log(`Found ${parsedRoutes.length} registered routes in ROUTE_REGISTRY.\n`);

let passedCount = 0;
let failureCount = 0;

parsedRoutes.forEach((route) => {
  const issues = [];
  const titleLen = route.title.length;
  const descLen = route.description.length;

  // 1. Title length constraint (strictly 50-60 characters)
  if (titleLen < 50 || titleLen > 60) {
    issues.push(`Title length (${titleLen}) violates 50-60 char standard: "${route.title}"`);
  }

  // 2. Meta description length constraint (strictly 140-160 characters)
  if (descLen < 140 || descLen > 160) {
    issues.push(`Description length (${descLen}) violates 140-160 char standard`);
  }

  // 3. Zero-Emoji constraint
  if (emojiRegex.test(route.title) || emojiRegex.test(route.description) || emojiRegex.test(route.h1)) {
    issues.push(`Zero-Emoji violation detected in route metadata`);
  }

  // 4. Physical page file existence check
  let pagePath;
  if (route.path === "/") {
    pagePath = path.join(rootDir, "app", "page.tsx");
  } else {
    pagePath = path.join(rootDir, "app", route.path.slice(1), "page.tsx");
  }

  if (!fs.existsSync(pagePath)) {
    issues.push(`Missing page.tsx component at: app${route.path}/page.tsx`);
  }

  if (issues.length === 0) {
    passedCount++;
    console.log(`[PASS] ${route.path.padEnd(36)} Title: ${titleLen}ch | Desc: ${descLen}ch`);
  } else {
    failureCount++;
    console.error(`[FAIL] ${route.path}:`);
    issues.forEach((iss) => console.error(`       -> ${iss}`));
  }
});

console.log("\n=======================================================");
console.log(`Results: ${passedCount} passed, ${failureCount} failed out of ${parsedRoutes.length} routes.`);

if (failureCount > 0) {
  console.error("FAILED: SEO regression constraints violated.");
  process.exit(1);
} else {
  console.log("SUCCESS: All public routes adhere to 50-60 char title, 140-160 char description, Zero-Emoji, and file existence standards.");
  process.exit(0);
}
