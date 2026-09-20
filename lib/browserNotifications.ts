/**
 * Web Browser Native Notification Alerts Engine
 * Provides native desktop notifications via the HTML5 Web Notification API
 * with audio chimes and intelligent permission management.
 */

export type BrowserNotificationPermission = "granted" | "denied" | "default" | "unsupported";

const LOCAL_STORAGE_KEY = "open_browser_notifications_enabled";

/**
 * Checks whether the current browser environment supports native Web Notifications.
 */
export function isBrowserNotificationSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "Notification" in window;
}

/**
 * Returns the current notification permission status.
 */
export function getBrowserNotificationPermission(): BrowserNotificationPermission {
  if (!isBrowserNotificationSupported()) return "unsupported";
  return Notification.permission as BrowserNotificationPermission;
}

/**
 * Checks whether browser notifications are both permitted and enabled by the user.
 */
export function isBrowserNotificationEnabled(): boolean {
  if (!isBrowserNotificationSupported()) return false;
  if (Notification.permission !== "granted") return false;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored !== "false";
}

/**
 * Toggles or explicitly sets user preference for browser notifications.
 */
export function setBrowserNotificationEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, enabled ? "true" : "false");
}

/**
 * Prompts the user for native browser notification permission.
 */
export async function requestBrowserNotificationPermission(): Promise<BrowserNotificationPermission> {
  if (!isBrowserNotificationSupported()) return "unsupported";

  try {
    const result = await Notification.requestPermission();
    if (result === "granted") {
      setBrowserNotificationEnabled(true);
    }
    return result as BrowserNotificationPermission;
  } catch (err) {
    console.error("Failed to request browser notification permission:", err);
    return getBrowserNotificationPermission();
  }
}

/**
 * Generates an unobtrusive, high-tech synthesized notification audio chime using the Web Audio API.
 * Does not require external audio files and complies with browser autoplay policies.
 */
export function playNotificationChime(): void {
  try {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Dual-tone high-tech chime (D5 to A5)
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.08); // A5

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {
    // Audio autoplay might be restricted if user has not interacted with page yet
  }
}

export interface BrowserNotificationOptions {
  title: string;
  body: string;
  tag?: string;
  actionUrl?: string;
  playSound?: boolean;
  onClick?: () => void;
}

/**
 * Dispatches a native browser notification alert with optional audio chime and click handler.
 */
export function sendBrowserNotification(options: BrowserNotificationOptions): boolean {
  if (!isBrowserNotificationSupported()) return false;
  if (Notification.permission !== "granted") return false;
  if (!isBrowserNotificationEnabled()) return false;

  try {
    if (options.playSound !== false) {
      playNotificationChime();
    }

    const notification = new Notification(options.title, {
      body: options.body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: options.tag,
    });

    notification.onclick = () => {
      try {
        window.focus();
      } catch (e) {}

      if (options.onClick) {
        options.onClick();
      } else if (options.actionUrl) {
        if (typeof window !== "undefined") {
          window.location.href = options.actionUrl;
        }
      }

      notification.close();
    };

    return true;
  } catch (err) {
    console.error("Error creating browser notification:", err);
    return false;
  }
}
