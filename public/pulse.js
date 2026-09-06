(function() {
  "use strict";
  if (typeof window === "undefined") return;

  // Locate the current script tag and configuration
  const currentScript = document.currentScript || (function() {
    const scripts = document.getElementsByTagName("script");
    for (let i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.includes("pulse.js")) return scripts[i];
    }
    return null;
  })();

  const projectId = currentScript ? (currentScript.getAttribute("data-project-id") || currentScript.getAttribute("data-id") || "prj_openlabs") : "prj_openlabs";
  const apiKey = currentScript ? (currentScript.getAttribute("data-api-key") || currentScript.getAttribute("data-key") || "") : "";
  let endpoint = currentScript ? (currentScript.getAttribute("data-endpoint") || "") : "";

  if (!endpoint) {
    if (currentScript && currentScript.src) {
      try {
        const scriptUrl = new URL(currentScript.src);
        endpoint = scriptUrl.origin;
      } catch (e) {
        endpoint = window.location.origin;
      }
    } else {
      endpoint = window.location.origin;
    }
  }

  // 1. Visitor & Session IDs
  function getOrCreateVisitorId() {
    const key = "pulse_vid";
    let vid = localStorage.getItem(key);
    if (!vid) {
      vid = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : "v_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
      localStorage.setItem(key, vid);
    }
    return vid;
  }

  function getOrCreateSessionId() {
    const key = "pulse_sid";
    let sid = sessionStorage.getItem(key);
    if (!sid) {
      sid = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : "s_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
      sessionStorage.setItem(key, sid);
    }
    return sid;
  }

  function getVisitorMetadata() {
    const countKey = "pulse_vc";
    const lastSeenKey = "pulse_ls";
    const activeKey = "pulse_active_s";

    const rawCount = parseInt(localStorage.getItem(countKey) || "0", 10);
    const lastSeen = parseInt(localStorage.getItem(lastSeenKey) || "0", 10);
    const isActive = sessionStorage.getItem(activeKey);

    let visitCount = rawCount;
    if (!isActive) {
      visitCount = rawCount + 1;
      localStorage.setItem(countKey, String(visitCount));
      localStorage.setItem(lastSeenKey, String(Date.now()));
      sessionStorage.setItem(activeKey, "1");
    }

    return {
      isReturning: visitCount > 1,
      visitCount: visitCount,
    };
  }

  // 2. Beacon Dispatcher
  function sendBeacon(urlPath, data) {
    const fullUrl = endpoint.replace(/\/$/, "") + urlPath;
    const visitorMeta = getVisitorMetadata();

    const payload = JSON.stringify(Object.assign({}, data, {
      projectId: projectId,
      apiKey: apiKey,
      visitorId: getOrCreateVisitorId(),
      sessionId: getOrCreateSessionId(),
      isReturning: data.isReturning !== undefined ? data.isReturning : visitorMeta.isReturning,
      visitCount: data.visitCount !== undefined ? data.visitCount : visitorMeta.visitCount,
      timestamp: Date.now(),
    }));

    if (navigator.sendBeacon) {
      try {
        const blob = new Blob([payload], { type: "application/json" });
        if (navigator.sendBeacon(fullUrl, blob)) return;
      } catch (e) {}
    }

    try {
      fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: payload,
        keepalive: true,
      }).catch(function() {});
    } catch (e) {}
  }

  // 3. Breadcrumbs Queue
  const breadcrumbs = [];
  function addBreadcrumb(action, data) {
    breadcrumbs.push({
      time: Date.now(),
      action: action,
      data: data || {},
    });
    if (breadcrumbs.length > 10) breadcrumbs.shift();
  }

  // 4. Client Tech Extraction
  function getTech() {
    const ua = navigator.userAgent;
    const isMobile = /mobile|android|iphone/i.test(ua);
    const isTablet = /ipad|tablet/i.test(ua);
    const device = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

    let browser = "Browser";
    if (/chrome|crios/i.test(ua)) browser = "Chrome";
    else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
    else if (/edg/i.test(ua)) browser = "Edge";

    let os = "OS";
    if (/windows/i.test(ua)) os = "Windows";
    else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
    else if (/linux/i.test(ua)) os = "Linux";
    else if (/android/i.test(ua)) os = "Android";
    else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";

    let timezone = "";
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch (e) {}

    let gpu = "";
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
        }
      }
    } catch (e) {}

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    return {
      device: device,
      browser: browser,
      os: os,
      screen: (window.screen ? window.screen.width + "x" + window.screen.height : ""),
      language: navigator.language || "en",
      timezone: timezone,
      hardware: {
        memory: navigator.deviceMemory || null,
        cores: navigator.hardwareConcurrency || null,
        gpu: gpu ? gpu.replace(/ANGLE \((.*)\)/, "$1").slice(0, 100) : "",
        dpr: window.devicePixelRatio || 1,
        viewport: window.innerWidth + "x" + window.innerHeight,
        touchPoints: navigator.maxTouchPoints || 0,
      },
      network: {
        effectiveType: conn ? conn.effectiveType || "" : "",
        downlink: (conn && typeof conn.downlink === "number") ? conn.downlink : null,
        rtt: (conn && typeof conn.rtt === "number") ? conn.rtt : null,
        saveData: Boolean(conn && conn.saveData),
      },
    };
  }

  // 5. Active Page Tracking State
  let currentPath = window.location.pathname;
  let pageStartTime = Date.now();
  let maxScroll = 0;
  let activeSeconds = 0;
  let idleSeconds = 0;
  let focusCount = 1;
  let lastActivity = Date.now();
  let exitIntentFired = false;
  const scrollMilestones = new Set();
  const vitals = { fcp: null, lcp: null, cls: null, inp: null, ttfb: null, domLoad: null, windowLoad: null };

  function markActive() {
    lastActivity = Date.now();
  }

  window.addEventListener("pointerdown", markActive, { passive: true });
  window.addEventListener("keydown", markActive, { passive: true });
  window.addEventListener("touchstart", markActive, { passive: true });
  window.addEventListener("scroll", markActive, { passive: true });
  window.addEventListener("focus", function() {
    focusCount++;
    markActive();
  });

  setInterval(function() {
    if (document.visibilityState === "visible") {
      if (Date.now() - lastActivity < 30000) {
        activeSeconds++;
      } else {
        idleSeconds++;
      }
    }
  }, 1000);

  // Scroll Tracking
  window.addEventListener("scroll", function() {
    const h = document.documentElement;
    const b = document.body;
    const scrollTop = h.scrollTop || b.scrollTop;
    const scrollHeight = h.scrollHeight || b.scrollHeight;
    const clientHeight = h.clientHeight;

    if (scrollHeight <= clientHeight) {
      maxScroll = 100;
      return;
    }

    const pct = Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
    if (pct > maxScroll) maxScroll = pct;

    const milestones = [25, 50, 75, 90, 100];
    for (let i = 0; i < milestones.length; i++) {
      const m = milestones[i];
      if (pct >= m && !scrollMilestones.has(m)) {
        scrollMilestones.add(m);
        addBreadcrumb("scroll", { depth: m });
      }
    }
  }, { passive: true });

  // Rage Clicks
  let recentClicks = [];
  window.addEventListener("click", function(e) {
    const now = Date.now();
    const target = e.target;
    if (!target) return;

    const tag = (target.tagName || "").toLowerCase();
    const sampleText = (target.textContent || "").trim().slice(0, 30);
    addBreadcrumb("click", { tag: tag, text: sampleText });

    // Outbound link
    const anchor = target.closest ? target.closest("a") : null;
    if (anchor && anchor.href && !anchor.href.startsWith("javascript:")) {
      try {
        const u = new URL(anchor.href);
        if (u.origin !== window.location.origin) {
          sendBeacon("/api/v1/collect", {
            type: "event",
            eventName: "ux_outbound_click",
            category: "ux",
            pathname: currentPath,
            properties: { href: anchor.href, text: sampleText },
          });
        }
      } catch (err) {}
    }

    // Rage click check: 3 clicks in 500ms within 40px
    recentClicks.push({ x: e.clientX, y: e.clientY, time: now });
    recentClicks = recentClicks.filter(function(c) { return now - c.time < 1000; });

    if (recentClicks.length >= 3) {
      const first = recentClicks[recentClicks.length - 3];
      const last = recentClicks[recentClicks.length - 1];
      if ((last.time - first.time <= 500) && Math.hypot(last.x - first.x, last.y - first.y) < 40) {
        recentClicks = [];
        sendBeacon("/api/v1/collect", {
          type: "event",
          eventName: "ux_rage_click",
          category: "ux",
          pathname: currentPath,
          properties: {
            element: (target.id ? "#" + target.id : target.className ? "." + String(target.className).split(" ")[0] : tag),
            text: sampleText,
          },
        });
      }
    }
  }, { capture: true, passive: true });

  // Desktop Exit Intent
  document.addEventListener("mouseleave", function(e) {
    if (e.clientY <= 0 && !exitIntentFired) {
      exitIntentFired = true;
      sendBeacon("/api/v1/collect", {
        type: "event",
        eventName: "ux_exit_intent",
        category: "ux",
        pathname: currentPath,
      });
    }
  });

  // Text Copy
  document.addEventListener("copy", function() {
    try {
      const sel = window.getSelection ? window.getSelection().toString() : "";
      if (sel && sel.length > 0) {
        sendBeacon("/api/v1/collect", {
          type: "event",
          eventName: "ux_text_copy",
          category: "ux",
          pathname: currentPath,
          properties: { length: sel.length },
        });
      }
    } catch (e) {}
  }, { passive: true });

  // Web Vitals RUM
  if ("PerformanceObserver" in window) {
    try {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        const nav = navEntries[0];
        if (nav.responseStart > 0) vitals.ttfb = Math.round(nav.responseStart);
        if (nav.domContentLoadedEventEnd > 0) vitals.domLoad = Math.round(nav.domContentLoadedEventEnd);
        if (nav.loadEventEnd > 0) vitals.windowLoad = Math.round(nav.loadEventEnd);
      }
    } catch (e) {}

    try {
      new PerformanceObserver(function(list) {
        list.getEntries().forEach(function(entry) {
          if (entry.name === "first-contentful-paint") {
            vitals.fcp = Math.round(entry.startTime);
          }
        });
      }).observe({ type: "paint", buffered: true });
    } catch (e) {}

    try {
      new PerformanceObserver(function(list) {
        const entries = list.getEntries();
        if (entries.length > 0) {
          vitals.lcp = Math.round(entries[entries.length - 1].startTime);
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
    } catch (e) {}

    let clsVal = 0;
    try {
      new PerformanceObserver(function(list) {
        list.getEntries().forEach(function(entry) {
          if (!entry.hadRecentInput) {
            clsVal += entry.value;
            vitals.cls = Number(clsVal.toFixed(4));
          }
        });
      }).observe({ type: "layout-shift", buffered: true });
    } catch (e) {}

    try {
      new PerformanceObserver(function(list) {
        list.getEntries().forEach(function(entry) {
          const duration = Math.round(entry.duration || (entry.processingStart ? entry.processingStart - entry.startTime : 0));
          if (duration > (vitals.inp || 0)) vitals.inp = duration;
        });
      }).observe({ type: "first-input", buffered: true });
    } catch (e) {}
  }

  // 360° Error Tracking
  window.addEventListener("error", function(e) {
    // Resource load error
    if (e.target && e.target !== window && e.target.tagName) {
      const tag = e.target.tagName.toLowerCase();
      const src = e.target.src || e.target.href || "";
      if (src && !src.includes("pulse.js")) {
        sendBeacon("/api/v1/error", {
          message: "Resource Load Failed: <" + tag + "> " + src,
          errorType: "resource",
          pathname: currentPath,
          stack: JSON.stringify({ breadcrumbs: breadcrumbs }),
        });
      }
      return;
    }

    const msg = e.message || "Uncaught runtime error";
    sendBeacon("/api/v1/error", {
      message: msg,
      stack: (e.error && e.error.stack ? e.error.stack : "") + "\n\n[Diagnostic Breadcrumbs]\n" + JSON.stringify(breadcrumbs, null, 2),
      errorType: "runtime",
      pathname: currentPath,
    });
  }, { capture: true });

  window.addEventListener("unhandledrejection", function(e) {
    const reason = e.reason;
    const msg = typeof reason === "string" ? reason : reason && reason.message ? reason.message : "Unhandled Promise Rejection";
    sendBeacon("/api/v1/error", {
      message: msg,
      stack: (reason && reason.stack ? reason.stack : "") + "\n\n[Diagnostic Breadcrumbs]\n" + JSON.stringify(breadcrumbs, null, 2),
      errorType: "unhandledrejection",
      pathname: currentPath,
    });
  });

  // Pageview Trigger
  function triggerPageview(path) {
    currentPath = path || window.location.pathname;
    pageStartTime = Date.now();
    maxScroll = 0;
    activeSeconds = 0;
    idleSeconds = 0;
    focusCount = 1;
    exitIntentFired = false;
    scrollMilestones.clear();

    // Detect structured data (Schema.org / JSON-LD / Microdata) for AEO citation readiness
    let structuredDataDetected = false;
    try {
      if (document.querySelector('script[type="application/ld+json"]') || document.querySelector('[itemscope]')) {
        structuredDataDetected = true;
      }
    } catch (e) {}

    const tech = getTech();
    let utmSource = null, utmMedium = null, utmCampaign = null;
    if (window.location.search) {
      try {
        const sp = new URLSearchParams(window.location.search);
        utmSource = sp.get("utm_source");
        utmMedium = sp.get("utm_medium");
        utmCampaign = sp.get("utm_campaign");
      } catch (e) {}
    }

    sendBeacon("/api/v1/collect", Object.assign({
      type: "pageview",
      pathname: currentPath,
      title: document.title || "",
      referrer: document.referrer || "",
      utmSource: utmSource,
      utmMedium: utmMedium,
      utmCampaign: utmCampaign,
      structuredDataDetected: structuredDataDetected,
    }, tech));
  }

  function triggerHeartbeat() {
    const duration = Math.max(1, Math.round((Date.now() - pageStartTime) / 1000));
    const isBounce = duration < 10 && maxScroll < 25 && focusCount <= 1;

    sendBeacon("/api/v1/collect", {
      type: "heartbeat",
      pathname: currentPath,
      duration: duration,
      activeDuration: activeSeconds,
      idleDuration: idleSeconds,
      focusCount: focusCount,
      scrollDepth: maxScroll,
      scrollMilestones: Array.from(scrollMilestones),
      webVitals: vitals,
      isBounce: isBounce,
      exitIntent: exitIntentFired,
    });
  }

  // Periodic and pagehide heartbeats
  setInterval(function() {
    if (document.visibilityState === "visible") triggerHeartbeat();
  }, 25000);

  window.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") triggerHeartbeat();
  });
  window.addEventListener("pagehide", triggerHeartbeat);

  // Initial trigger
  triggerPageview();

  // SPA Route Change Listener
  const originalPushState = history.pushState;
  history.pushState = function() {
    triggerHeartbeat();
    originalPushState.apply(this, arguments);
    triggerPageview(window.location.pathname);
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function() {
    triggerHeartbeat();
    originalReplaceState.apply(this, arguments);
    triggerPageview(window.location.pathname);
  };

  window.addEventListener("popstate", function() {
    triggerHeartbeat();
    triggerPageview(window.location.pathname);
  });

  // Global Public API
  window.Pulse = {
    init: function(opts) {
      if (opts && opts.projectId) currentScript.setAttribute("data-project-id", opts.projectId);
      if (opts && opts.apiKey) currentScript.setAttribute("data-api-key", opts.apiKey);
    },
    track: function(eventName, properties, value) {
      sendBeacon("/api/v1/collect", {
        type: "event",
        eventName: eventName,
        category: (properties && properties.category) || "custom",
        pathname: currentPath,
        properties: properties || {},
        value: typeof value === "number" ? value : null,
      });
    },
    page: function(path) {
      triggerHeartbeat();
      triggerPageview(path);
    },
    identify: function(userId, traits) {
      sendBeacon("/api/v1/identify", {
        userId: userId,
        traits: traits || {},
      });
    },
  };

  console.log("⚡ Pulse Analytics tracking active [Project: " + projectId + "]");
})();
