"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  Radio,
  TrendingUp,
  RefreshCw,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlError = searchParams.get("error");
  const urlProvider = searchParams.get("provider");

  // Step state: "credentials" | "otp"
  const [step, setStep] = useState<"credentials" | "otp">("credentials");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // OTP states
  const [tempToken, setTempToken] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [smtpConfigured, setSmtpConfigured] = useState<boolean>(true);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus first OTP input on step transition
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const formatErrorMessage = (errCode: string | null, provider: string | null) => {
    if (!errCode) return null;
    if (errCode === "oauth_not_configured") {
      return `${provider === "google" ? "Google" : "GitHub"} OAuth is not configured. Please check your credentials in .env.local.`;
    }
    if (errCode === "google_token_exchange_failed" || errCode === "github_token_exchange_failed") {
      return `Failed to exchange authorization token with ${provider || "provider"}. Please try again.`;
    }
    if (errCode === "invalid_oauth_state") {
      return "OAuth security state mismatch. Please refresh and try again.";
    }
    if (errCode === "google_auth_cancelled" || errCode === "github_auth_cancelled") {
      return "Authentication was cancelled.";
    }
    return `Authentication error: ${errCode.replace(/_/g, " ")}`;
  };

  const displayError = error || formatErrorMessage(urlError, urlProvider);

  // 1. Submit Credentials -> Request OTP
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);
    setDevOtp(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.requiresOtp) {
        setTempToken(data.tempToken);
        setMaskedEmail(data.maskedEmail || email);
        setStep("otp");
        setResendCooldown(60);
        setSmtpConfigured(data.smtpConfigured !== false);
        if (data.devOtp) {
          setDevOtp(data.devOtp);
        } else {
          setSuccessNotice(`Verification code dispatched to ${data.maskedEmail || email}`);
        }
        setOtpDigits(["", "", "", "", "", ""]);
      } else {
        // Fallback direct login (if OTP was bypassed or session directly issued)
        const redirectUrl = searchParams.get("redirect") || "/";
        window.location.href = redirectUrl;
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  // 2. Handle OTP Digits change
  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal) {
      const newDigits = [...otpDigits];
      newDigits[index] = "";
      setOtpDigits(newDigits);
      return;
    }

    // If pasted multiple digits
    if (cleanVal.length > 1) {
      const chars = cleanVal.slice(0, 6).split("");
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = chars[i] || "";
      }
      setOtpDigits(newDigits);
      const nextIdx = Math.min(chars.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-advance
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const chars = pastedData.split("");
    const newDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < chars.length; i++) {
      newDigits[i] = chars[i];
    }
    setOtpDigits(newDigits);
    const nextIdx = Math.min(chars.length, 5);
    otpInputRefs.current[nextIdx]?.focus();
  };

  // 3. Submit OTP -> Verify and Issue Session
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      setError("Please enter all 6 digits of your verification code.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to verify code");
      }

      const redirectUrl = searchParams.get("redirect") || "/";
      window.location.href = redirectUrl;
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  }

  // 4. Resend OTP
  async function handleResendOtp() {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError(null);
    setSuccessNotice(null);

    try {
      const res = await fetch("/api/auth/login/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      setResendCooldown(60);
      setSmtpConfigured(data.smtpConfigured !== false);
      if (data.devOtp) {
        setDevOtp(data.devOtp);
      } else {
        setSuccessNotice(data.message || "A new code was dispatched to your email.");
      }
      setOtpDigits(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden bg-grid-pattern">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-0 right-1/4 w-[550px] h-[550px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse-subtle" />
      <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN: HERO SHOWCASE & LIVE INTELLIGENCE DEMO          */}
        {/* ============================================================ */}
        <div className="hidden lg:flex lg:col-span-6 flex-col space-y-8 pr-4">
          {/* Platform Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-bold w-fit shadow-lg shadow-cyan-500/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-glow" />
            <span className="tracking-wide">OPEN ANALYTICS • OBSERVABILITY 2.4</span>
          </div>

          {/* Headline & Mission */}
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Real-time analytics with{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                privacy &amp; speed
              </span>{" "}
              by design.
            </h1>
            <p className="text-base text-slate-400 leading-relaxed">
              Experience lightweight telemetry ingestion, sub-second query latency, AI crawler visibility, and privacy compliance without annoying cookie banners.
            </p>
          </div>

          {/* Live Interactive Telemetry Card */}
          <div className="relative rounded-3xl bg-[#0b1020]/90 border border-white/[0.1] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl space-y-5 animate-float-slow">
            {/* Top Stat Bar */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white">418</span>
                    <span className="text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +28.4%
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Active visitors online now</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">Latency</span>
                <span className="text-xs font-mono font-bold text-cyan-400">1.8 ms avg</span>
              </div>
            </div>

            {/* Core Web Vitals Summary Pills */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-center">
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">LCP Score</span>
                <span className="text-xs font-bold text-emerald-400">0.58s (Good)</span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">INP Speed</span>
                <span className="text-xs font-bold text-emerald-400">14ms (Instant)</span>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">CLS Shift</span>
                <span className="text-xs font-bold text-emerald-400">0.00 (Zero)</span>
              </div>
            </div>
          </div>

          {/* Architectural Guarantees Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300 font-medium">100% GDPR &amp; CCPA Compliant</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-slate-300 font-medium">&lt; 3.2 KB Brotli Async Beacon</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: LOGIN FORM OR OTP VERIFICATION                 */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="bg-[#0b1020]/90 backdrop-blur-2xl p-7 sm:p-9 rounded-3xl border border-white/[0.12] shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(6,182,212,0.1)] space-y-6 relative overflow-hidden transition-all duration-300">
            
            {/* Top Ambient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Brand Logo Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/25">
                  <div className="w-full h-full bg-[#080d19] rounded-[14px] flex items-center justify-center">
                    <Activity className="w-5 h-5 text-cyan-400 animate-glow" />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-black tracking-tight text-white">Open</span>
                  <span className="text-[10px] ml-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold uppercase tracking-wider">
                    Analytics
                  </span>
                </div>
              </div>

              {step === "credentials" ? (
                <>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight pt-2">
                    Sign in to your account
                  </h2>
                  <p className="text-xs text-slate-400">
                    Enter your credentials to receive an authentication code.
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold mt-1">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Two-Factor Authentication</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight pt-1">
                    Enter verification code
                  </h2>
                  <p className="text-xs text-slate-400">
                    We sent a 6-digit one-time passcode to{" "}
                    <span className="text-cyan-300 font-mono font-semibold">{maskedEmail}</span>
                  </p>
                </>
              )}
            </div>

            {/* Error Notification */}
            {displayError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{displayError}</span>
              </div>
            )}

            {/* Success Notification */}
            {successNotice && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successNotice}</span>
              </div>
            )}

            {/* Development OTP Banner when SMTP is not configured in .env.local */}
            {step === "otp" && devOtp && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs space-y-2.5 animate-fadeIn">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-200">SMTP Credentials Pending in .env.local</div>
                    <div className="text-[11px] text-amber-300/80 leading-relaxed mt-0.5">
                      No email was delivered to your inbox because <code className="bg-black/30 px-1 py-0.5 rounded text-amber-200">SMTP_USER</code> and <code className="bg-black/30 px-1 py-0.5 rounded text-amber-200">SMTP_PASS</code> are empty in <code className="bg-black/30 px-1 py-0.5 rounded text-amber-200">.env.local</code>.
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-amber-200">Your generated OTP code:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const chars = devOtp.split("");
                      setOtpDigits(chars);
                      otpInputRefs.current[5]?.focus();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 font-mono font-bold text-xs text-amber-200 transition cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    <span className="tracking-widest text-sm text-white">{devOtp}</span>
                    <span className="text-[10px] font-sans text-amber-400 underline font-normal">(Click to auto-fill)</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* STEP 1: CREDENTIALS INPUT FORM                               */}
            {/* ============================================================ */}
            {step === "credentials" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Single Sign-On (OAuth) Provider Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="/api/auth/oauth/google"
                    className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-cyan-500/40 text-xs font-bold text-white transition-all cursor-pointer shadow-sm group hover:scale-[1.02]"
                  >
                    <GoogleIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Google SSO</span>
                  </a>

                  <a
                    href="/api/auth/oauth/github"
                    className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-cyan-500/40 text-xs font-bold text-white transition-all cursor-pointer shadow-sm group hover:scale-[1.02]"
                  >
                    <GithubIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>GitHub SSO</span>
                  </a>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <span className="relative px-3 bg-[#0b1020] text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
                    Or continue with password
                  </span>
                </div>

                {/* Form Fields */}
                <form className="space-y-4" onSubmit={handleLogin}>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative rounded-2xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        autoComplete="email"
                        className="block w-full pl-10 pr-4 py-3 bg-[#060a14] border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <div className="relative rounded-2xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        autoComplete="current-password"
                        className="block w-full pl-10 pr-11 py-3 bg-[#060a14] border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all disabled:opacity-50 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Continue to Verification</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Navigation */}
                <div className="text-center pt-2 border-t border-slate-800/80 space-y-2">
                  <p className="text-xs text-slate-400">
                    Don&apos;t have an account yet?{" "}
                    <Link
                      href="/register"
                      className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Create Account</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </p>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Protected by Nodemailer 2-Factor OTP</span>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* STEP 2: 6-DIGIT OTP VERIFICATION FORM                        */}
            {/* ============================================================ */}
            {step === "otp" && (
              <div className="space-y-6 animate-fadeIn">
                <form className="space-y-5" onSubmit={handleVerifyOtp}>
                  {/* 6 Digit Inputs */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-black rounded-2xl bg-[#060a14] border transition-all focus:outline-none focus:scale-105 ${
                          digit
                            ? "border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20 bg-cyan-500/5"
                            : "border-slate-700/80 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-[11px] text-center text-slate-500">
                    Enter the code sent to your inbox. It will expire in 10 minutes.
                  </p>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={loading || otpDigits.join("").length !== 6}
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all disabled:opacity-50 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify &amp; Sign In</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Resend Code & Back Navigation Actions */}
                <div className="pt-2 border-t border-slate-800/80 space-y-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                    <span>Didn&apos;t get the email?</span>
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || resending}
                      onClick={handleResendOtp}
                      className="font-bold text-cyan-400 hover:text-cyan-300 disabled:text-slate-600 transition-colors inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {resending && <RefreshCw className="w-3 h-3 animate-spin" />}
                      <span>
                        {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Code"}
                      </span>
                    </button>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep("credentials");
                        setError(null);
                        setSuccessNotice(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to email &amp; password</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050811] flex items-center justify-center text-xs text-slate-400">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}