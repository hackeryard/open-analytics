(function() {
  "use strict";
  if (typeof window === "undefined") return;

  // Locate the current script tag and configuration
  let cachedScript = null;
  function getScriptElement() {
    if (cachedScript && document.contains(cachedScript)) return cachedScript;
    if (document.currentScript) {
      cachedScript = document.currentScript;
      return cachedScript;
    }
    const queryMatch = document.querySelector('script[data-project-id], script[src*="open.js"], script#open-analytics-script');
    if (queryMatch) {
      cachedScript = queryMatch;
      return cachedScript;
    }
    const scripts = document.getElementsByTagName("script");
    for (let i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && (scripts[i].src.includes("open.js") || scripts[i].hasAttribute("data-project-id"))) {
        cachedScript = scripts[i];
        return cachedScript;
      }
    }
    return null;
  }

  let configOverrides = {};

  function getConfig() {
    const el = getScriptElement();
    const pid = configOverrides.projectId || (el && (el.getAttribute("data-measurement-id") || el.getAttribute("data-project-id") || el.getAttribute("data-id"))) || (window.__OPEN_ANALYTICS_PROJECT_ID__) || "prj_openlabs";
    const key = configOverrides.apiKey || (el && (el.getAttribute("data-api-key") || el.getAttribute("data-key"))) || "";
    let ep = configOverrides.endpoint || (el && el.getAttribute("data-endpoint")) || "";

    if (!ep) {
      if (el && el.src) {
        try {
          const scriptUrl = new URL(el.src);
          ep = scriptUrl.origin;
        } catch (e) {
          ep = window.location.origin;
        }
      } else {
        ep = window.location.origin;
      }
    }

    return {
      projectId: pid,
      apiKey: key,
      endpoint: ep,
      element: el,
    };
  }

  // 1. Visitor & Session IDs
  function getOrCreateVisitorId() {
    const key = "open_vid";
    let vid = localStorage.getItem(key);
    if (!vid) {
      vid = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : "v_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
      localStorage.setItem(key, vid);
    }
    return vid;
  }

  function getOrCreateSessionId() {
    const key = "open_sid";
    let sid = sessionStorage.getItem(key);
    if (!sid) {
      sid = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : "s_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
      sessionStorage.setItem(key, sid);
    }
    return sid;
  }

  function getVisitorMetadata() {
    const countKey = "open_vc";
    const lastSeenKey = "open_ls";
    const activeKey = "open_active_s";

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
    const cfg = getConfig();
    const fullUrl = cfg.endpoint.replace(/\/$/, "") + urlPath;
    const visitorMeta = getVisitorMetadata();

    const payload = JSON.stringify(Object.assign({}, data, {
      projectId: cfg.projectId,
      apiKey: cfg.apiKey,
      visitorId: getOrCreateVisitorId(),
      sessionId: getOrCreateSessionId(),
      pathname: (data && data.pathname) || currentPath || (typeof window !== "undefined" ? window.location.pathname : "/"),
      isReturning: data.isReturning !== undefined ? data.isReturning : visitorMeta.isReturning,
      visitCount: data.visitCount !== undefined ? data.visitCount : visitorMeta.visitCount,
      timestamp: Date.now(),
    }));

    if (navigator.sendBeacon) {
      try {
        const blob = new Blob([payload], { type: "text/plain;charset=UTF-8" });
        if (navigator.sendBeacon(fullUrl, blob)) return;
      } catch (e) {}
    }

    try {
      fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: payload,
        keepalive: true,
        mode: "cors",
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
    const rawEffectiveType = conn ? conn.effectiveType || "" : "";
    const connType = conn ? conn.type || "" : "";
    const downlink = (conn && typeof conn.downlink === "number") ? conn.downlink : null;
    const rtt = (conn && typeof conn.rtt === "number") ? conn.rtt : null;
    const saveData = Boolean(conn && conn.saveData);

    // 5G Detection Engine:
    // W3C Network Information API historically caps effectiveType string at '4g'.
    // 5G networks are identified via explicit '5g' indicators or high-speed cellular metrics (downlink >= 10 Mbps and RTT <= 50ms).
    let effectiveType = rawEffectiveType;
    let is5G = false;

    if (rawEffectiveType === "5g" || connType === "5g" || connType === "cellular-5g") {
      effectiveType = "5g";
      is5G = true;
    } else if (rawEffectiveType === "4g") {
      if (connType === "cellular" && (downlink >= 10 || (rtt && rtt <= 50))) {
        effectiveType = "5g";
        is5G = true;
      } else if (isMobile && downlink >= 10 && rtt && rtt <= 45 && connType !== "wifi") {
        effectiveType = "5g";
        is5G = true;
      }
    }

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
        effectiveType: effectiveType,
        rawEffectiveType: rawEffectiveType,
        type: connType,
        downlink: downlink,
        rtt: rtt,
        saveData: saveData,
        is5G: is5G,
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
        evaluateEventRules("scroll_depth", { depth: m });
        sendBeacon("/api/v1/collect", {
          type: "event",
          eventName: "autotrack_scroll_" + m + "pct",
          category: "autotrack",
          pathname: currentPath,
          properties: { depth: m },
        });
      }
    }
  }, { passive: true });

  // ── No-Code Custom Event Rules Engine ──
  let customEventRules = [];
  function fetchCustomEventRules() {
    const cfg = getConfig();
    if (!cfg.projectId) return;

    const cacheKey = "open_rules_" + cfg.projectId;
    const cacheTimeKey = "open_rules_t_" + cfg.projectId;
    const cached = sessionStorage.getItem(cacheKey);
    const cachedTime = parseInt(sessionStorage.getItem(cacheTimeKey) || "0", 10);

    if (cached && Date.now() - cachedTime < 180000) {
      try {
        customEventRules = JSON.parse(cached);
        return;
      } catch (e) {}
    }

    const url = cfg.endpoint.replace(/\/$/, "") + "/api/v1/event-rules?projectId=" + encodeURIComponent(cfg.projectId);
    fetch(url, { mode: "cors" })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data.ok && Array.isArray(data.rules)) {
          customEventRules = data.rules;
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(customEventRules));
            sessionStorage.setItem(cacheTimeKey, String(Date.now()));
          } catch (e) {}
          evaluateEventRules("pageview", { pathname: currentPath });
        }
      })
      .catch(function() {});
  }

  function pathMatchesPattern(pattern, pathMatchType, path) {
    if (!pattern || pattern === "*" || pathMatchType === "any") return true;
    const cur = path || window.location.pathname;
    if (pathMatchType === "exact") return cur === pattern;
    if (pathMatchType === "starts_with") return cur.startsWith(pattern);
    if (pathMatchType === "contains") return cur.includes(pattern);
    return cur === pattern || cur.includes(pattern);
  }

  function textMatches(pattern, textMatchType, text) {
    if (!pattern) return true;
    const t = (text || "").toLowerCase().trim();
    const p = pattern.toLowerCase().trim();
    if (textMatchType === "exact") return t === p;
    if (textMatchType === "starts_with") return t.startsWith(p);
    return t.includes(p);
  }

  function evaluateEventRules(triggerType, eventData, targetElement) {
    if (!customEventRules || !customEventRules.length) return;

    for (let i = 0; i < customEventRules.length; i++) {
      const rule = customEventRules[i];
      if (!rule || rule.enabled === false) continue;
      if (rule.triggerType !== triggerType) continue;

      // Check path match
      if (!pathMatchesPattern(rule.pathPattern, rule.pathMatchType, currentPath)) continue;

      let matched = false;

      if (triggerType === "click") {
        if (!targetElement) continue;

        // Check CSS selector match
        if (rule.selector && rule.selector.trim()) {
          try {
            if (targetElement.matches(rule.selector) || (targetElement.closest && targetElement.closest(rule.selector))) {
              matched = true;
            }
          } catch (e) {}
        }

        // Check text match
        if (rule.textMatch && rule.textMatch.trim()) {
          const elText = targetElement.textContent || targetElement.value || targetElement.getAttribute("aria-label") || "";
          if (textMatches(rule.textMatch, rule.textMatchType, elText)) {
            matched = true;
          }
        }

        // If neither selector nor text was specified, match all clicks on the path
        if (!rule.selector && !rule.textMatch) {
          matched = true;
        }
      } else if (triggerType === "form_submit") {
        if (targetElement) {
          if (rule.selector && rule.selector.trim()) {
            try {
              if (targetElement.matches(rule.selector) || (targetElement.closest && targetElement.closest(rule.selector))) {
                matched = true;
              }
            } catch (e) {}
          } else {
            matched = true;
          }
        } else {
          matched = true;
        }
      } else if (triggerType === "pageview" || triggerType === "scroll_depth" || triggerType === "file_download" || triggerType === "outbound_link") {
        matched = true;
      }

      if (matched) {
        sendBeacon("/api/v1/collect", {
          type: "event",
          eventName: rule.name,
          category: "no_code_rule",
          pathname: currentPath,
          value: typeof rule.value === "number" ? rule.value : null,
          properties: Object.assign({}, rule.properties, eventData, {
            ruleId: rule.id,
            triggerType: triggerType,
            triggerSource: "no_code_dashboard_rule",
          }),
        });
      }
    }
  }

  // ── Comprehensive Interaction & Autotrack Engine ──
  const DOWNLOAD_EXTS = /\.(pdf|zip|tar\.gz|tgz|rar|7z|exe|dmg|pkg|deb|rpm|csv|xlsx?|docx?|pptx?|mp3|mp4|mov|avi|json|txt|apk|ipa)$/i;

  let recentClicks = [];
  let lastAutotrackClickTime = 0;

  window.addEventListener("click", function(e) {
    const now = Date.now();
    const target = e.target;
    if (!target) return;

    const tag = (target.tagName || "").toLowerCase();
    const sampleText = (target.textContent || target.value || target.getAttribute("aria-label") || "").trim().slice(0, 60);
    addBreadcrumb("click", { tag: tag, text: sampleText });

    // Find nearest interactive element (button, anchor, role=button, input[button|submit], or data-track/data-oa-event)
    const interactive = target.closest ? target.closest("button, a, [role='button'], input[type='button'], input[type='submit'], [data-oa-event], [data-track], [id]") : target;

    // 1. Evaluate No-Code Event Rules
    evaluateEventRules("click", {
      tag: tag,
      text: sampleText,
      elementId: target.id || (interactive && interactive.id) || "",
    }, target);

    // 2. Outbound link & File Download Autotrack
    const anchor = target.closest ? target.closest("a") : null;
    if (anchor && anchor.href && !anchor.href.startsWith("javascript:")) {
      try {
        const u = new URL(anchor.href);
        const pathname = u.pathname || "";
        const filename = pathname.split("/").pop() || "";

        // File download detection
        if (DOWNLOAD_EXTS.test(pathname) || anchor.hasAttribute("download")) {
          const extMatch = pathname.match(DOWNLOAD_EXTS);
          const ext = extMatch ? extMatch[1].toLowerCase() : "file";
          sendBeacon("/api/v1/collect", {
            type: "event",
            eventName: "autotrack_file_download",
            category: "autotrack",
            pathname: currentPath,
            properties: {
              filename: filename,
              fileExtension: ext,
              href: anchor.href,
              linkText: sampleText,
            },
          });
          evaluateEventRules("file_download", { filename: filename, fileExtension: ext, href: anchor.href }, anchor);
        } else if (u.origin !== window.location.origin) {
          // Outbound link
          sendBeacon("/api/v1/collect", {
            type: "event",
            eventName: "autotrack_outbound_click",
            category: "autotrack",
            pathname: currentPath,
            properties: {
              href: anchor.href,
              hostname: u.hostname,
              linkText: sampleText,
            },
          });
          evaluateEventRules("outbound_link", { href: anchor.href, hostname: u.hostname }, anchor);
        }
      } catch (err) {}
    }

    // 3. Button & CTA Autotrack (Debounced per 200ms)
    if (interactive && (now - lastAutotrackClickTime > 200)) {
      const itag = (interactive.tagName || "").toLowerCase();
      const isButton = itag === "button" || interactive.getAttribute("role") === "button" || (itag === "input" && ["button", "submit"].includes(interactive.type));
      const hasTrackAttr = interactive.hasAttribute("data-oa-event") || interactive.hasAttribute("data-track");

      if (isButton || hasTrackAttr) {
        lastAutotrackClickTime = now;
        const btnText = (interactive.textContent || interactive.value || interactive.getAttribute("aria-label") || sampleText).trim().slice(0, 60);
        sendBeacon("/api/v1/collect", {
          type: "event",
          eventName: hasTrackAttr ? (interactive.getAttribute("data-oa-event") || interactive.getAttribute("data-track") || "cta_click") : "autotrack_button_click",
          category: "autotrack",
          pathname: currentPath,
          properties: {
            elementTag: itag,
            buttonText: btnText,
            elementId: interactive.id || "",
            className: String(interactive.className || "").slice(0, 100),
          },
        });
      }
    }

    // 4. Rage Click Detection: 3 clicks in 500ms within 40px
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

  // ── Form Interactions Autotrack ──
  document.addEventListener("submit", function(e) {
    try {
      const form = e.target;
      if (!form || (form.tagName || "").toLowerCase() !== "form") return;

      const formId = form.id || "";
      const formName = form.name || "";
      const formAction = form.action || "";
      const fieldCount = form.elements ? form.elements.length : 0;

      addBreadcrumb("form:submit", { formId: formId, action: formAction });

      // Evaluate No-Code Event Rules for form submissions
      evaluateEventRules("form_submit", {
        formId: formId,
        formName: formName,
        action: formAction,
        fieldCount: fieldCount,
      }, form);

      // Autotrack form submission
      sendBeacon("/api/v1/collect", {
        type: "event",
        eventName: "autotrack_form_submit",
        category: "autotrack",
        pathname: currentPath,
        properties: {
          formId: formId,
          formName: formName,
          formAction: formAction ? new URL(formAction, window.location.origin).pathname : "",
          fieldCount: fieldCount,
        },
      });
    } catch (err) {}
  }, { capture: true, passive: true });

  // Form Start Autotrack (First input focus)
  const activeFormsStarted = new Set();
  document.addEventListener("focusin", function(e) {
    try {
      const el = e.target;
      if (!el) return;
      const tag = (el.tagName || "").toLowerCase();
      if (!["input", "textarea", "select"].includes(tag)) return;
      if (["hidden", "submit", "button", "image"].includes(el.type)) return;

      const form = el.closest ? el.closest("form") : null;
      const formIdentifier = (form && (form.id || form.name || form.action)) || "form_inline";

      if (!activeFormsStarted.has(formIdentifier)) {
        activeFormsStarted.add(formIdentifier);
        sendBeacon("/api/v1/collect", {
          type: "event",
          eventName: "autotrack_form_start",
          category: "autotrack",
          pathname: currentPath,
          properties: {
            formId: form ? form.id : "",
            firstField: el.name || el.id || el.type,
          },
        });
      }
    } catch (err) {}
  }, { capture: true, passive: true });

  // ── HTML5 Media Autotrack (Video & Audio) ──
  document.addEventListener("play", function(e) {
    try {
      const el = e.target;
      if (!el || !["video", "audio"].includes((el.tagName || "").toLowerCase())) return;
      const src = el.currentSrc || el.src || "";
      sendBeacon("/api/v1/collect", {
        type: "event",
        eventName: "autotrack_media_play",
        category: "autotrack",
        pathname: currentPath,
        properties: {
          mediaType: (el.tagName || "").toLowerCase(),
          mediaSource: src.split("/").pop() || "",
          duration: Math.round(el.duration || 0),
        },
      });
    } catch (err) {}
  }, { capture: true, passive: true });

  document.addEventListener("ended", function(e) {
    try {
      const el = e.target;
      if (!el || !["video", "audio"].includes((el.tagName || "").toLowerCase())) return;
      const src = el.currentSrc || el.src || "";
      sendBeacon("/api/v1/collect", {
        type: "event",
        eventName: "autotrack_media_complete",
        category: "autotrack",
        pathname: currentPath,
        properties: {
          mediaType: (el.tagName || "").toLowerCase(),
          mediaSource: src.split("/").pop() || "",
        },
      });
    } catch (err) {}
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

  // Text Copy Autotrack
  document.addEventListener("copy", function() {
    try {
      const sel = window.getSelection ? window.getSelection().toString() : "";
      if (sel && sel.length > 0) {
        sendBeacon("/api/v1/collect", {
          type: "event",
          eventName: "autotrack_text_copy",
          category: "autotrack",
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

  // 360° Error Tracking Engine
  function formatStack(err, fallbackStack) {
    if (err && err.stack) return String(err.stack);
    if (fallbackStack) return String(fallbackStack);
    try {
      throw new Error();
    } catch (e) {
      return e.stack || "";
    }
  }

  function reportError(errorPayload) {
    const defaultPayload = {
      message: "Uncaught runtime error",
      stack: "",
      errorType: "runtime",
      pathname: currentPath || (typeof window !== "undefined" ? window.location.pathname : "/"),
    };
    const finalData = Object.assign(defaultPayload, errorPayload);
    if (!finalData.stack.includes("[Diagnostic Breadcrumbs]")) {
      finalData.stack = (finalData.stack ? finalData.stack + "\n\n" : "") + "[Diagnostic Breadcrumbs]\n" + JSON.stringify(breadcrumbs, null, 2);
    }
    sendBeacon("/api/v1/error", finalData);
  }

  // 1. Global Event Listener for Runtime & Resource Errors
  window.addEventListener("error", function(e) {
    // Resource load error (e.g. <img>, <script>, <link> failed to load)
    if (e.target && e.target !== window && e.target.tagName) {
      const tag = e.target.tagName.toLowerCase();
      const src = e.target.src || e.target.href || "";
      if (src && !src.includes("open.js")) {
        reportError({
          message: "Resource Load Failed: <" + tag + "> " + src,
          errorType: "resource",
          pathname: currentPath,
          stack: "Failed URL: " + src + "\nTag: <" + tag + ">",
        });
      }
      return;
    }

    const errorObj = e.error || null;
    const msg = (errorObj && errorObj.message) || e.message || "Uncaught runtime error";
    const stack = (errorObj && errorObj.stack) || (e.filename ? e.filename + ":" + e.lineno + ":" + e.colno : "");

    reportError({
      message: msg,
      stack: stack,
      errorType: "runtime",
      pathname: currentPath,
    });
  }, { capture: true });

  // 2. Unhandled Promise Rejections (Async / Network / Fetch throws)
  window.addEventListener("unhandledrejection", function(e) {
    const reason = e.reason;
    const msg = typeof reason === "string" ? reason : (reason && reason.message ? reason.message : "Unhandled Promise Rejection");
    const stack = (reason && reason.stack) ? reason.stack : "";

    reportError({
      message: msg,
      stack: stack,
      errorType: "unhandledrejection",
      pathname: currentPath,
    });
  });

  // 3. Fallback window.onerror
  const existingOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (error) {
      reportError({
        message: error.message || String(message),
        stack: error.stack || (source + ":" + lineno + ":" + colno),
        errorType: "runtime",
        pathname: currentPath,
      });
    }
    if (typeof existingOnError === "function") {
      return existingOnError.apply(this, arguments);
    }
    return false;
  };

  // 4. Safe console.error Interceptor (Captures React component exceptions & hydration errors)
  const originalConsoleError = console.error;
  console.error = function() {
    try {
      const args = Array.prototype.slice.call(arguments);
      addBreadcrumb("console.error", {
        message: args.map(function(a) {
          return typeof a === "object" ? (a && a.message) || "[Object]" : String(a);
        }).join(" ").slice(0, 300),
      });

      let foundError = null;
      let reactErrorMsg = null;
      for (let i = 0; i < args.length; i++) {
        if (args[i] instanceof Error) {
          foundError = args[i];
          break;
        } else if (typeof args[i] === "string") {
          if (args[i].includes("The above error occurred in the") || args[i].includes("Hydration failed") || args[i].includes("Minified React error")) {
            reactErrorMsg = args[i];
          }
        }
      }

      if (foundError) {
        reportError({
          message: foundError.message || "React Component Error",
          stack: foundError.stack || "",
          errorType: "boundary",
          pathname: currentPath,
        });
      } else if (reactErrorMsg) {
        reportError({
          message: reactErrorMsg.slice(0, 300),
          stack: args.join("\n"),
          errorType: reactErrorMsg.includes("Hydration") ? "hydration" : "boundary",
          pathname: currentPath,
        });
      }
    } catch (err) {}

    if (typeof originalConsoleError === "function") {
      originalConsoleError.apply(console, arguments);
    }
  };

  // 5. Automatic 404 Route & Page Not Found Engine
  const reported404Paths = new Set();

  function checkAndReport404(explicitPath) {
    try {
      const pathToCheck = explicitPath || currentPath || (typeof window !== "undefined" ? window.location.pathname : "/");
      if (reported404Paths.has(pathToCheck)) return;

      const title = (document.title || "").toLowerCase();
      const is404Title = title.includes("404") || title.includes("page not found") || title.includes("not found");

      let is404Dom = false;
      const h1 = document.querySelector("h1, h2, [data-next-error], #__next-error, .next-error-h1");
      if (h1) {
        const text = (h1.textContent || "").toLowerCase();
        if (text.includes("404") || text.includes("this page could not be found") || text.includes("page not found")) {
          is404Dom = true;
        }
      }

      const meta404 = document.querySelector('meta[name="prerender-status-code"][content="404"], meta[name="status"][content="404"]');

      if (is404Title || is404Dom || !!meta404) {
        reported404Paths.add(pathToCheck);
        addBreadcrumb("navigation:404", { path: pathToCheck, title: document.title });
        reportError({
          message: "404 Not Found: " + pathToCheck,
          stack: "URL: " + (typeof window !== "undefined" ? window.location.href : pathToCheck) + "\nReferrer: " + (document.referrer || "Direct") + "\nTitle: " + document.title,
          errorType: "not_found",
          pathname: pathToCheck,
        });
      }
    } catch (e) {}
  }

  // 6. Network Fetch & XHR Interceptor (Captures API 4xx/5xx and Network Failures)
  if (typeof window !== "undefined") {
    if (window.fetch) {
      const originalFetch = window.fetch;
      window.fetch = function(input, init) {
        return originalFetch.apply(this, arguments).then(function(res) {
          try {
            const urlStr = typeof input === "string" ? input : (input && input.url ? input.url : "");
            if (urlStr && !urlStr.includes("/api/v1/collect") && !urlStr.includes("/api/v1/error") && !urlStr.includes("/api/v1/identify")) {
              if (res.status === 404) {
                addBreadcrumb("fetch:404", { url: urlStr.slice(0, 150) });
                reportError({
                  message: "HTTP 404 Not Found: " + urlStr,
                  stack: "Status: 404 Not Found\nRequest URL: " + urlStr + "\nCaller Path: " + (currentPath || window.location.pathname),
                  errorType: "not_found",
                  pathname: currentPath || window.location.pathname,
                });
              } else if (res.status >= 400 && res.status < 500) {
                addBreadcrumb("fetch:4xx", { url: urlStr.slice(0, 150), status: res.status });
                reportError({
                  message: "HTTP " + res.status + " Client Error: " + urlStr,
                  stack: "Status: " + res.status + "\nRequest URL: " + urlStr + "\nCaller Path: " + (currentPath || window.location.pathname),
                  errorType: "http_4xx",
                  pathname: currentPath || window.location.pathname,
                });
              } else if (res.status >= 500) {
                addBreadcrumb("fetch:5xx", { url: urlStr.slice(0, 150), status: res.status });
                reportError({
                  message: "HTTP " + res.status + " Server Error: " + urlStr,
                  stack: "Status: " + res.status + "\nRequest URL: " + urlStr + "\nCaller Path: " + (currentPath || window.location.pathname),
                  errorType: "http_5xx",
                  pathname: currentPath || window.location.pathname,
                });
              }
            }
          } catch (e) {}
          return res;
        }).catch(function(err) {
          try {
            const urlStr = typeof input === "string" ? input : (input && input.url ? input.url : "");
            if (urlStr && !urlStr.includes("/api/v1/collect") && !urlStr.includes("/api/v1/error") && !urlStr.includes("/api/v1/identify")) {
              addBreadcrumb("fetch:failed", { url: urlStr.slice(0, 150), error: (err && err.message) || String(err) });
              reportError({
                message: "Network Fetch Failed: " + urlStr,
                stack: (err && err.stack) || ("Fetch error: " + ((err && err.message) || String(err))),
                errorType: "network",
                pathname: currentPath || window.location.pathname,
              });
            }
          } catch (e) {}
          throw err;
        });
      };
    }

    // XHR Interception
    if (window.XMLHttpRequest) {
      const originalXhrOpen = XMLHttpRequest.prototype.open;
      const originalXhrSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function(method, url) {
        this._openMethod = method;
        this._openUrl = url;
        return originalXhrOpen.apply(this, arguments);
      };
      XMLHttpRequest.prototype.send = function() {
        const xhr = this;
        xhr.addEventListener("loadend", function() {
          try {
            const url = String(xhr._openUrl || "");
            if (url && !url.includes("/api/v1/collect") && !url.includes("/api/v1/error") && !url.includes("/api/v1/identify")) {
              if (xhr.status === 404) {
                addBreadcrumb("xhr:404", { url: url.slice(0, 150) });
                reportError({
                  message: "XHR 404 Not Found: " + url,
                  stack: "Method: " + (xhr._openMethod || "GET") + "\nStatus: 404\nURL: " + url,
                  errorType: "not_found",
                  pathname: currentPath || window.location.pathname,
                });
              } else if (xhr.status >= 500) {
                addBreadcrumb("xhr:5xx", { url: url.slice(0, 150), status: xhr.status });
                reportError({
                  message: "XHR " + xhr.status + " Server Error: " + url,
                  stack: "Method: " + (xhr._openMethod || "GET") + "\nStatus: " + xhr.status + "\nURL: " + url,
                  errorType: "http_5xx",
                  pathname: currentPath || window.location.pathname,
                });
              }
            }
          } catch (e) {}
        });
        return originalXhrSend.apply(this, arguments);
      };
    }

    // 7. WebGL Context Loss Tracking
    window.addEventListener("webglcontextlost", function(e) {
      addBreadcrumb("webgl:lost", {});
      reportError({
        message: "WebGL Context Lost: GPU rendering crash",
        stack: "Canvas WebGL context was lost by GPU/driver.",
        errorType: "webgl",
        pathname: currentPath,
      });
    }, { capture: true });

    // 8. Content Security Policy (CSP) Violations
    document.addEventListener("securitypolicyviolation", function(e) {
      addBreadcrumb("csp:violation", { directive: e.violatedDirective, uri: e.blockedURI });
      reportError({
        message: "CSP Violation: " + e.violatedDirective + " blocked " + e.blockedURI,
        stack: "Directive: " + e.violatedDirective + "\nBlocked URI: " + e.blockedURI + "\nOriginal Policy: " + e.originalPolicy,
        errorType: "csp",
        pathname: currentPath,
      });
    });
  }

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

    // Fetch and evaluate active No-Code Event Rules
    fetchCustomEventRules();
    evaluateEventRules("pageview", { pathname: currentPath });

    // Check for 404 routes immediately & asynchronously as Next.js updates DOM
    checkAndReport404(currentPath);
    setTimeout(function() { checkAndReport404(currentPath); }, 150);
    setTimeout(function() { checkAndReport404(currentPath); }, 600);
    setTimeout(function() { checkAndReport404(currentPath); }, 1500);

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
  const publicApi = {
    init: function(opts) {
      if (opts) {
        if (opts.projectId) configOverrides.projectId = opts.projectId;
        if (opts.apiKey) configOverrides.apiKey = opts.apiKey;
        if (opts.endpoint) configOverrides.endpoint = opts.endpoint;
      }
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
    captureError: function(err, context) {
      const msg = typeof err === "string" ? err : (err && err.message) || "Captured Application Error";
      const stack = formatStack(err, (context && context.stack) || "");
      reportError({
        message: msg,
        stack: stack + (context ? "\n\n[Context]\n" + JSON.stringify(context, null, 2) : ""),
        errorType: (context && context.errorType) || "boundary",
        pathname: (context && context.pathname) || currentPath,
        componentStack: (context && context.componentStack) || null,
        digest: (err && err.digest) || (context && context.digest) || null,
      });
    },
    captureException: function(err, context) {
      this.captureError(err, context);
    },
    error: function(err, context) {
      this.captureError(err, context);
    },
    track404: function(pathname, referrer) {
      const targetPath = pathname || currentPath || window.location.pathname;
      reported404Paths.add(targetPath);
      reportError({
        message: "404 Not Found: " + targetPath,
        stack: "URL: " + (typeof window !== "undefined" ? window.location.origin + targetPath : targetPath) + "\nReferrer: " + (referrer || document.referrer || "Direct"),
        errorType: "not_found",
        pathname: targetPath,
      });
    },
    capture404: function(pathname, referrer) {
      this.track404(pathname, referrer);
    },
  };

  window.OpenAnalytics = publicApi;

  const initialCfg = getConfig();
  console.log("[Open Analytics] Tracking active [Project: " + initialCfg.projectId + "]");
})();
