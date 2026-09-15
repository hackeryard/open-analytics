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
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  Radio,
  Bot,
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
      return `${provider === "google" ? "Google" : "GitHub"} OAuth is not configured. Please check your credentials in .env.local.`;
    }
    if (errCode === "google_token_exchange_failed" || errCode === "github_token_exchange_failed") {
      return `Failed to exchange authorization token with ${provider || "provider"}. Please try again.`;
    }
    if (errCode === "invalid_oauth_state") {
      return "OAuth security state mismatch. Please refresh and try again.";
    }
    return `Authentication error: ${errCode.replace(/_/g, " ")}`;
  };

  const displayError = error || formatErrorMessage(urlError, urlProvider);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "None", color: "bg-slate-700" };
    if (password.length < 6) return { score: 1, label: "Too short", color: "bg-rose-500" };
    if (password.length < 9) return { score: 2, label: "Good", color: "bg-amber-500" };
    return { score: 3, label: "Strong", color: "bg-emerald-500" };
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
    <div className="min-h-screen bg-[#050811] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden bg-grid-pattern">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-0 left-1/4 w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse-subtle" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN: ONBOARDING HIGHLIGHTS & ARCHITECTURE SHOWCASE    */}
        {/* ============================================================ */}
        <div className="hidden lg:flex lg:col-span-6 flex-col space-y-8 pr-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-bold w-fit shadow-lg shadow-violet-500/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="tracking-wide">INSTANT WORKSPACE PROVISIONING</span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Deploy production web intelligence in{" "}
              <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                under 60 seconds.
              </span>
            </h1>
            <p className="text-base text-slate-400 leading-relaxed">
              Create your account in seconds, configure your custom measurement properties and web streams, and begin collecting GDPR-compliant telemetry.
            </p>
          </div>

          {/* Interactive Feature Checklist Card */}
          <div className="rounded-3xl bg-[#0b1020]/90 border border-white/[0.1] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl space-y-4 animate-float-slow">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span>Included in Your Developer Account</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                100% FREE TIER
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Automated Project &amp; API Key Generation</div>
                  <div className="text-xs text-slate-400">Instantly generate client publishable keys and ingest endpoints.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Full Core Web Vitals &amp; Crash Diagnosis</div>
                  <div className="text-xs text-slate-400">Track LCP, INP, CLS, unhandled exceptions, and rage clicks.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">AI &amp; LLM Search Visibility Radar</div>
                  <div className="text-xs text-slate-400">Know when ChatGPT, Perplexity, and Claude index your pages.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Privacy-First (No Cookie Consent Needed)</div>
                  <div className="text-xs text-slate-400">GDPR, CCPA, and PECR compliant with cryptographic session hashing.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Team Collaboration */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-300 font-medium">Granular Team RBAC Roles</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-slate-300 font-medium">Full Tenant Data Isolation</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: REGISTRATION FORM & OAUTH SIGNUP               */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="bg-[#0b1020]/90 backdrop-blur-2xl p-7 sm:p-9 rounded-3xl border border-white/[0.12] shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(139,92,246,0.1)] space-y-6 relative overflow-hidden">
            
            {/* Top Ambient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-violet-500/20 to-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Brand Logo Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-lg shadow-violet-500/25">
                  <div className="w-full h-full bg-[#080d19] rounded-[14px] flex items-center justify-center">
                    <Activity className="w-5 h-5 text-cyan-400 animate-glow" />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-black tracking-tight text-white">Open</span>
                  <span className="text-[10px] ml-1.5 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-bold uppercase tracking-wider">
                    Analytics
                  </span>
                </div>
              </div>

              {step === "credentials" ? (
                <>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight pt-2">
                    Create your account
                  </h2>
                  <p className="text-xs text-slate-400">
                    Get started with free unlimited projects and real-time observability.
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold mt-1">
                    <KeyRound className="w-3.5 h-3.5 text-violet-400" />
                    <span>Email Verification</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight pt-1">
                    Verify your email
                  </h2>
                  <p className="text-xs text-slate-400">
                    We sent a 6-digit verification code to{" "}
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
                  <span className="text-[11px] font-medium text-amber-200">Your verification code:</span>
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

            {/* STEP 1: CREDENTIALS REGISTRATION FORM */}
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
                    className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-violet-500/40 text-xs font-bold text-white transition-all cursor-pointer shadow-sm group hover:scale-[1.02]"
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
                    Or register with email
                  </span>
                </div>

                {/* Form Fields */}
                <form className="space-y-4" onSubmit={handleRegister}>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative rounded-2xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        autoComplete="name"
                        className="block w-full pl-10 pr-4 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Work Email Address
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
                        placeholder="alex@company.com"
                        autoComplete="email"
                        className="block w-full pl-10 pr-4 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400 transition-all"
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
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                        className="block w-full pl-10 pr-11 py-2.5 bg-[#060a14] border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password strength indicator */}
                    {password && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                          <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : "bg-transparent"}`} />
                          <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : "bg-transparent"}`} />
                          <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : "bg-transparent"}`} />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0 font-semibold">{strength.label}</span>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-400 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all disabled:opacity-50 cursor-pointer hover:scale-[1.01] active:scale-[0.99] mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Navigation */}
                <div className="text-center pt-2 border-t border-slate-800/80 space-y-2">
                  <p className="text-xs text-slate-400">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </p>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
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
                            ? "border-violet-400 text-violet-300 shadow-sm shadow-violet-500/20 bg-violet-500/5"
                            : "border-slate-700/80 text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
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
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-400 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all disabled:opacity-50 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify &amp; Activate Account</span>
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
                      className="font-bold text-violet-400 hover:text-violet-300 disabled:text-slate-600 transition-colors inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
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
    <Suspense fallback={<div className="min-h-screen bg-[#050811] flex items-center justify-center text-xs text-slate-400">Loading...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}