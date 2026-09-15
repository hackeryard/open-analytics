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
    console.log(`[6/6] Dashboard Subdomain (unauthenticated / -> /login): location=${location} => ${ok ? "PASS" : "FAIL"}`);
    if (!ok) failures++;
  } catch (e) {
    console.error("[6/6] Error:", e.message);
    failures++;
  }

  console.log(`=== FINISHED. TOTAL FAILURES: ${failures} ===`);
  process.exit(failures > 0 ? 1 : 0);
}

run();
