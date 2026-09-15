#!/usr/bin/env node

import http from "http";

async function testRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });
    req.on("error", reject);
    req.end();
  });
}

async function run() {
  console.log("=== VERIFYING SUBDOMAIN ISOLATION & ROUTING ===");
  let failures = 0;
  const port = process.env.PORT || 3005;

  // 1. Main domain root returns 200 and renders marketing landing
  try {
    const res = await testRequest({
      hostname: "127.0.0.1",
      port,
      path: "/",
      method: "GET",
      headers: { Host: `localhost:${port}` },
    });
    const hasLaunchDashboard = res.body.includes("Launch Dashboard");
    const hasSignIn = res.body.includes(">Sign In<");
    const ok = res.statusCode === 200 && hasLaunchDashboard && !hasSignIn;
    console.log(`[1/6] Main Domain (GET /): status=${res.statusCode}, hasLaunchDashboard=${hasLaunchDashboard}, hasSignIn=${hasSignIn} => ${ok ? "PASS" : "FAIL"}`);
    if (!ok) failures++;
  } catch (e) {
    console.error("[1/6] Main Domain error:", e.message);
    failures++;
  }

  // 2. Main domain /login redirects to dashboard subdomain
  try {
    const res = await testRequest({
      hostname: "127.0.0.1",
      port,
      path: "/login",
      method: "GET",
      headers: { Host: `localhost:${port}` },
    });
    const location = res.headers.location || "";
    const ok = (res.statusCode === 307 || res.statusCode === 308) && location.includes(`dashboard.localhost:${port}/login`);
    console.log(`[2/6] Main Domain (GET /login -> redirect): status=${res.statusCode}, location=${location} => ${ok ? "PASS" : "FAIL"}`);
    if (!ok) failures++;
  } catch (e) {
    console.error("[2/6] Error:", e.message);
    failures++;
  }

  // 3. Main domain internal route (/events) redirects to dashboard subdomain
  try {
    const res = await testRequest({
      hostname: "127.0.0.1",
      port,
      path: "/events",
      method: "GET",
      headers: { Host: `localhost:${port}` },
    });
    const location = res.headers.location || "";
    const ok = (res.statusCode === 307 || res.statusCode === 308) && location.includes(`dashboard.localhost:${port}/events`);
    console.log(`[3/6] Main Domain (GET /events -> redirect): status=${res.statusCode}, location=${location} => ${ok ? "PASS" : "FAIL"}`);
    if (!ok) failures++;
  } catch (e) {
    console.error("[3/6] Error:", e.message);
    failures++;
  }

  // 4. Production Main Domain /login redirects to dashboard.openanalytics.org.in
  try {
    const res = await testRequest({
      hostname: "127.0.0.1",
      port,
      path: "/login",
      method: "GET",
      headers: { Host: "openanalytics.org.in" },
    });
    const location = res.headers.location || "";
    const ok = (res.statusCode === 307 || res.statusCode === 308) && location === "https://dashboard.openanalytics.org.in/login";
    console.log(`[4/6] Production Main Domain (GET /login): location=${location} => ${ok ? "PASS" : "FAIL"}`);
    if (!ok) failures++;
  } catch (e) {
    console.error("[4/6] Error:", e.message);
    failures++;
  }

  // 5. Production Dashboard Subdomain /features redirects to main domain
  try {
    const res = await testRequest({
      hostname: "127.0.0.1",
      port,
      path: "/features",
      method: "GET",
      headers: { Host: "dashboard.openanalytics.org.in" },
    });
    const location = res.headers.location || "";
    const ok = (res.statusCode === 307 || res.statusCode === 308) && location === "https://openanalytics.org.in/features";
    console.log(`[5/6] Production Dashboard (GET /features -> redirect): location=${location} => ${ok ? "PASS" : "FAIL"}`);
    if (!ok) failures++;
  } catch (e) {
    console.error("[5/6] Error:", e.message);
    failures++;
  }

  // 6. Dashboard Subdomain unauthenticated root redirects to /login
  try {
    const res = await testRequest({
      hostname: "127.0.0.1",
      port,
      path: "/",
      method: "GET",
      headers: { Host: `dashboard.localhost:${port}` },
    });
    const location = res.headers.location || "";
    const ok = (res.statusCode === 307 || res.statusCode === 308) && location.includes("/login");
    console.log(`[6/10] Dashboard Subdomain (unauthenticated / -> /login): location=${location} => ${ok ? "PASS" : "FAIL"}`);
    if (!ok) failures++;
  } catch (e) {
    console.error("[6/10] Error:", e.message);
    failures++;
  }

  // 7. API Subdomain root returns 200 JSON with service status
  try {
    const res = await testRequest({
      hostname: "127.0.0.1",
      port,
      path: "/",
      method: "GET",
      headers: { Host: `api.localhost:${port}` },
    });
    const isJson = (res.headers["content-type"] || "").includes("application/json");
    const ok = res.statusCode === 200 && isJson && res.body.includes("OpenAnalytics Telemetry & Ingestion API");
    console.log(`[7/10] API Subdomain (GET / -> Status JSON): status=${res.statusCode}, isJson=${isJson} => ${ok ? "PASS" : "FAIL"}`);
    if (!ok) failures++;
  } catch (e) {
    console.error("[7/10] API Subdomain error:", e.message);
    failures++;
  }

  // 8. API Subdomain /open.js returns 200 with global CORS header
  try {
    const res = await testRequest({
      hostname: "127.0.0.1",
      port,
      path: "/open.js",
      method: "GET",
      headers: { Host: `api.localhost:${port}` },
    });
    const cors = res.headers["access-control-allow-origin"];
    const ok = res.statusCode === 200 && cors === "*";
    console.log(`[8/10] API Subdomain (GET /open.js): status=${res.statusCode}, CORS=${cors} => ${ok ? "PASS" : "FAIL"}`);
    if (!ok) failures++;
  } catch (e) {
    console.error("[8/10] Error:", e.message);
    failures++;
  }

  // 9. API Subdomain /v1/collect handles OPTIONS preflight
  try {
    const res = await testRequest({
      hostname: "127.0.0.1",
      port,
      path: "/v1/collect",
      method: "OPTIONS",
      headers: {
        Host: `api.localhost:${port}`,
        Origin: "https://example.com",
      },
    });
    const cors = res.headers["access-control-allow-origin"];
    const ok = res.statusCode === 204 && !!cors;
    console.log(`[9/10] API Subdomain (OPTIONS /v1/collect): status=${res.statusCode}, CORS=${cors} => ${ok ? "PASS" : "FAIL"}`);
    if (!ok) failures++;
  } catch (e) {
    console.error("[9/10] Error:", e.message);
    failures++;
  }

  // 10. API Subdomain /login redirects to dashboard
  try {
    const res = await testRequest({
      hostname: "127.0.0.1",
      port,
      path: "/login",
      method: "GET",
      headers: { Host: `api.localhost:${port}` },
    });
    const location = res.headers.location || "";
    const ok = (res.statusCode === 307 || res.statusCode === 308) && location.includes("dashboard.");
    console.log(`[10/10] API Subdomain (GET /login -> dashboard redirect): location=${location} => ${ok ? "PASS" : "FAIL"}`);
    if (!ok) failures++;
  } catch (e) {
    console.error("[10/10] Error:", e.message);
    failures++;
  }

  console.log(`=== FINISHED. TOTAL FAILURES: ${failures} ===`);
  process.exit(failures > 0 ? 1 : 0);
}

run();
