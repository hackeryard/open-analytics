"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  Check,
  KeyRound,
  RefreshCw,
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

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlError = searchParams.get("error");
  const urlProvider = searchParams.get("provider");

  // Step state: "credentials" | "otp"
  const [step, setStep] = useState<"credentials" | "otp">("credentials");

  // Form states
  const [name, setName] = useState("");
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
      return `${provider === "google" ? "Google" : "GitHub"} OAuth is not configured. Please check credentials in .env.local.`;
    }
    if (errCode === "google_token_exchange_failed" || errCode === "github_token_exchange_failed") {
      return `Failed to exchange authorization token with ${provider || "provider"}. Please try again.`;
    }
    if (errCode === "invalid_oauth_state") {
      return "OAuth security state mismatch. Please refresh and try again.";
    }
    return `Registration error: ${errCode.replace(/_/g, " ")}`;
  };

  const displayError = error || formatErrorMessage(urlError, urlProvider);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "None", color: "bg-zinc-800" };
    if (password.length < 6) return { score: 1, label: "Too short", color: "bg-rose-500" };
    if (password.length < 9) return { score: 2, label: "Good", color: "bg-amber-400" };
    return { score: 3, label: "Strong", color: "bg-emerald-400" };
  };

  const strength = getPasswordStrength();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);
    setDevOtp(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
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
        const redirectUrl = searchParams.get("redirect") || "/";
        window.location.href = redirectUrl;
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  // Handle OTP Digits change
  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal) {
      const newDigits = [...otpDigits];
      newDigits[index] = "";
      setOtpDigits(newDigits);
      return;
    }

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

  // Submit OTP -> Verify and Issue Session
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

  // Resend OTP
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
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 selection:bg-white/[0.15] selection:text-white flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-white/[0.02] blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* ============================================================ */}
        {/* LEFT COLUMN: HERO SHOWCASE & INCLUDED FEATURES               */}
        {/* ============================================================ */}
        <div className="hidden lg:flex lg:col-span-6 flex-col space-y-8 pr-4">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-[#111218] border border-white/[0.08] text-zinc-300 text-xs font-medium w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">Open Analytics:</span>
            <span>Developer Tier</span>
            <span className="text-zinc-500">•</span>
            <span className="font-mono text-zinc-400 text-[11px]">Free Forever</span>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-white leading-[1.08]">
              Deploy production web telemetry in under 60 seconds.
            </h1>
            <p className="text-base text-zinc-400 leading-relaxed max-w-lg">
              Create your account in seconds, configure your custom measurement properties, and begin collecting GDPR-compliant telemetry immediately.
            </p>
          </div>

          {/* Feature Checklist Card */}
          <div className="rounded-2xl bg-[#111218] border border-white/[0.08] p-6 shadow-xl space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span>Included in Your Developer Account</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                100% FREE
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Instant Project &amp; Snippet Generation</div>
                  <div className="text-[11px] text-zinc-400 leading-relaxed">Instantly generate script tags and ingest endpoints for any framework.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Core Web Vitals &amp; Crash Diagnosis</div>
                  <div className="text-[11px] text-zinc-400 leading-relaxed">Track real user p75 LCP, INP, CLS, unhandled exceptions, and rage clicks.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">AI &amp; LLM Search Visibility Radar</div>
                  <div className="text-[11px] text-zinc-400 leading-relaxed">Know in real time when ChatGPT, Perplexity, and Claude crawl your web pages.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">100% Cookieless Privacy Compliance</div>
                  <div className="text-[11px] text-zinc-400 leading-relaxed">GDPR, CCPA, and PECR compliant with daily rotating cryptographic salt purging.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#111218] border border-white/[0.08]">
              <Lock className="w-4 h-4 text-white shrink-0" />
              <span className="text-zinc-300 font-medium">Granular Team RBAC Roles</span>
            </div>
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#111218] border border-white/[0.08]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-zinc-300 font-medium">Isolated Multi-Tenant Architecture</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: REGISTRATION FORM & OAUTH SIGNUP               */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="bg-[#111218] p-7 sm:p-9 rounded-2xl border border-white/[0.08] shadow-2xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#14161f] border border-white/[0.1] flex items-center justify-center text-white">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-white">Open Analytics</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/80">
                    Register
                  </span>
                </div>
              </div>

              {step === "credentials" ? (
                <>
                  <h2 className="text-2xl font-bold text-white tracking-tight pt-2">
                    Create your account
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Get started with free projects and real-time observability.
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-300 text-xs font-medium mt-1">
                    <KeyRound className="w-3.5 h-3.5 text-white" />
                    <span>Email Verification</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
                    Verify your email
                  </h2>
                  <p className="text-xs text-zinc-400">
                    We sent a 6-digit verification code to{" "}
                    <span className="text-white font-mono font-semibold">{maskedEmail}</span>
                  </p>
                </>
              )}
            </div>

            {/* Error Notification */}
            {displayError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{displayError}</span>
              </div>
            )}

            {/* Success Notification */}
            {successNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successNotice}</span>
              </div>
            )}

            {/* Dev OTP Banner */}
            {step === "otp" && devOtp && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-2.5 animate-fadeIn">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-amber-200">SMTP Credentials Pending in .env.local</div>
                    <div className="text-[11px] text-amber-300/80 leading-relaxed mt-0.5">
                      No email was dispatched because <code className="bg-black/30 px-1 py-0.5 rounded text-amber-200">SMTP_USER</code> is not set.
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-amber-200">Your verification code:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const chars = devOtp.split("");
                      setOtpDigits(chars);
                      otpInputRefs.current[5]?.focus();
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 font-mono font-bold text-xs text-white transition cursor-pointer"
                  >
                    <span>{devOtp}</span>
                    <span className="text-[10px] text-amber-300 underline font-normal ml-1.5">(Auto-fill)</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: CREDENTIALS REGISTRATION FORM */}
            {step === "credentials" && (
              <div className="space-y-5 animate-fadeIn">
                {/* SSO Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="/api/auth/oauth/google"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#14161f] hover:bg-[#181922] border border-white/[0.08] hover:border-white/[0.16] text-xs font-semibold text-white transition cursor-pointer"
                  >
                    <GoogleIcon className="w-4 h-4" />
                    <span>Google</span>
                  </a>

                  <a
                    href="/api/auth/oauth/github"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#14161f] hover:bg-[#181922] border border-white/[0.08] hover:border-white/[0.16] text-xs font-semibold text-white transition cursor-pointer"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.08]" />
                  </div>
                  <span className="relative px-3 bg-[#111218] text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                    Or register with email
                  </span>
                </div>

                {/* Form Fields */}
                <form className="space-y-4" onSubmit={handleRegister}>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        autoComplete="name"
                        className="block w-full pl-10 pr-4 py-2.5 bg-[#0e0f15] border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-hidden focus:border-white/40 focus:ring-1 focus:ring-white/20 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Work Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        autoComplete="email"
                        className="block w-full pl-10 pr-4 py-2.5 bg-[#0e0f15] border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-hidden focus:border-white/40 focus:ring-1 focus:ring-white/20 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                        className="block w-full pl-10 pr-11 py-2.5 bg-[#0e0f15] border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-hidden focus:border-white/40 focus:ring-1 focus:ring-white/20 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-white transition cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password strength indicator */}
                    {password && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#181922] rounded-full overflow-hidden flex gap-1">
                          <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : "bg-transparent"}`} />
                          <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : "bg-transparent"}`} />
                          <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : "bg-transparent"}`} />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 shrink-0 font-semibold">{strength.label}</span>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-zinc-950 bg-white hover:bg-zinc-200 transition shadow-sm disabled:opacity-50 cursor-pointer active:scale-[0.98] mt-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-950 rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Navigation */}
                <div className="text-center pt-2 border-t border-white/[0.08] space-y-2">
                  <p className="text-xs text-zinc-400">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-white hover:underline transition-colors inline-flex items-center gap-1"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </p>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Protected by Email Verification &amp; Session Encryption</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: 6-DIGIT OTP VERIFICATION FORM */}
            {step === "otp" && (
              <div className="space-y-6 animate-fadeIn">
                <form className="space-y-5" onSubmit={handleVerifyOtp}>
                  {/* 6 Digit Inputs */}
                  <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handleOtpPaste}>
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
                        className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold rounded-xl bg-[#0e0f15] border transition-all focus:outline-hidden ${
                          digit
                            ? "border-white/60 text-white bg-white/[0.06]"
                            : "border-white/[0.1] text-white focus:border-white/40 focus:ring-1 focus:ring-white/20"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-[11px] text-center text-zinc-500">
                    Enter the code sent to your inbox. Expires in 10 minutes.
                  </p>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={loading || otpDigits.join("").length !== 6}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-zinc-950 bg-white hover:bg-zinc-200 transition shadow-sm disabled:opacity-50 cursor-pointer active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-950 rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify &amp; Activate Account</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Resend Code & Back Navigation Actions */}
                <div className="pt-2 border-t border-white/[0.08] space-y-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                    <span>Didn&apos;t get the email?</span>
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || resending}
                      onClick={handleResendOtp}
                      className="font-semibold text-white hover:underline disabled:text-zinc-600 transition-colors inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
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
                      className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to details</span>
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

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090a0f] flex items-center justify-center text-xs text-zinc-400 font-mono">Loading console...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}