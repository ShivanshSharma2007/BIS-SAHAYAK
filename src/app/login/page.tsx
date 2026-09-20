"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { 
  ShieldCheck, ArrowRight, UserCircle2, Building2, Loader2, 
  AlertCircle, CheckCircle2, Lock, Mail, Eye, EyeOff, Sparkles, 
  FileCheck2, Shield, Cpu, ExternalLink, HelpCircle, ChevronDown
} from "lucide-react";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Sign In method: 'password' | 'otp'
  const [signInMethod, setSignInMethod] = useState<'password' | 'otp'>('password');
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err === "NotRegistered" || err === "AccountNotFound") {
        setErrorMessage("Access Denied: No account found with this email. Please register on the Sign Up tab first.");
        setIsSignUp(true);
      }
    }
  }, []);

  const handleLogin = async (loginEmail: string, loginPass: string, demoLabel?: string) => {
    try {
      setErrorMessage(null);
      if (demoLabel) {
        setLoadingDemo(demoLabel);
      } else {
        setIsLoading(true);
      }

      const res = await signIn("credentials", {
        email: loginEmail,
        password: loginPass,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (!res?.ok) {
        setErrorMessage(res?.error || "Invalid officer credentials. Please verify and try again.");
        setIsLoading(false);
        setLoadingDemo(null);
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Authentication failed. Please try again.");
      setIsLoading(false);
      setLoadingDemo(null);
    }
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter an email address first.");
      return;
    }
    if (isSignUp) {
      if (!name.trim()) {
        setErrorMessage("Please enter your full name.");
        return;
      }
      if (!password) {
        setErrorMessage("Please create a password for your account.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        return;
      }
    }
    
    try {
      setIsSendingOtp(true);
      setErrorMessage(null);
      
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, isSignUp }),
      });
      
      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { error: text || "Server error" };
      }
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP.");
      }
      
      setOtpSent(true);
      if (data.devOtp) {
        setOtp(data.devOtp);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) {
      setErrorMessage("Please enter the OTP.");
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const res = await signIn("otp", {
        email: email,
        otp: otp,
        isSignUp: isSignUp ? 'true' : 'false',
        name: isSignUp ? name : undefined,
        department: isSignUp ? (department || "Audit & Surveillance") : undefined,
        password: isSignUp ? password : undefined,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (!res?.ok) {
        setErrorMessage(res?.error || "Invalid OTP. Please try again.");
        setIsLoading(false);
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Authentication failed.");
      setIsLoading(false);
    }
  };

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    await handleLogin(email, password);
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setErrorMessage(null);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      setErrorMessage("Failed to login with Google.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col w-full bg-slate-950 text-slate-900 selection:bg-blue-600 selection:text-white"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", Helvetica, Arial, sans-serif' }}
    >
      <div className="w-full h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] z-50 shrink-0 shadow-sm" />

      <div className="flex-1 flex flex-col lg:flex-row w-full">
        {/* Left Panel */}
        <div className="hidden lg:flex w-[52%] bg-gradient-to-br from-[#061430] via-[#0A1F4D] to-[#0E2866] relative overflow-hidden flex-col justify-between p-12 xl:p-16 border-r border-blue-900/40">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500/15 blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[130px] pointer-events-none" />
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-indigo-500/15 blur-[140px] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl shadow-black/20 border border-white/20 flex items-center justify-center transition-transform hover:scale-105 duration-300">
                <img src="/robot-logo.png" alt="BIS Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl flex items-center gap-1.5">
                    <span className="font-extrabold text-white tracking-tight">BIS</span>
                    <span className="font-semibold text-[#FFB347] tracking-tight">Sahayak</span>
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gradient-to-r from-amber-400/20 to-orange-400/20 text-amber-300 border border-amber-400/30">
                    SmartAssist
                  </span>
                </div>
                <p className="text-blue-200/80 text-xs font-medium tracking-wide">
                  Bureau of Indian Standards &bull; Ministry of Consumer Affairs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[11px] text-blue-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>National Portal Active</span>
            </div>
          </div>

          <div className="relative z-10 max-w-xl my-auto py-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Unified Standards &amp; GeM Compliance Engine</span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.18] tracking-tight mb-5">
              Securing India&apos;s <br />
              <span className="bg-gradient-to-r from-blue-200 via-sky-300 to-amber-200 bg-clip-text text-transparent">
                Quality &amp; Standards
              </span>{" "}
              Ecosystem.
            </h2>

            <p className="text-base text-blue-100/80 font-normal leading-relaxed mb-8 max-w-lg">
              Authorized officer gateway for real-time BIS Scheme-I (ISI) surveillance, 
              CRS registry validation, Gold HUID fraud detection, and automated GeM tender audits.
            </p>

            <div className="grid grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-lg shadow-black/10 hover:bg-white/[0.09] transition-all">
                <div className="text-2xl xl:text-3xl font-black text-white tracking-tight">50,000+</div>
                <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider mt-1">Indian Standards</div>
                <div className="text-[10px] text-blue-300/60 mt-0.5">IS &amp; ISO Harmonized</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-lg shadow-black/10 hover:bg-white/[0.09] transition-all">
                <div className="text-2xl xl:text-3xl font-black text-emerald-400 tracking-tight">99.9%</div>
                <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider mt-1">Registry Uptime</div>
                <div className="text-[10px] text-blue-300/60 mt-0.5">Real-time BIS API</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-lg shadow-black/10 hover:bg-white/[0.09] transition-all">
                <div className="text-2xl xl:text-3xl font-black text-amber-300 tracking-tight">100%</div>
                <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider mt-1">Audit Coverage</div>
                <div className="text-[10px] text-blue-300/60 mt-0.5">GeM Pre-Bid Ready</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {[
                "Scheme-I (ISI Mark)",
                "CRS Electronics",
                "Gold HUID Radar",
                "QCO Gazette Alerts",
                "NABL Labs GeoFinder"
              ].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-blue-900/40 border border-blue-700/40 text-blue-200 text-[11px] font-medium">
                  &bull; {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-blue-800/40 flex items-center justify-between text-xs text-blue-300/80 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Government of India &bull; MeitY &amp; BIS Cybersecurity Standards Compliant</span>
            </div>
            <span className="text-[11px] text-blue-400/60 font-mono">v2.6.4</span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-[48%] bg-white flex flex-col justify-between p-8 sm:p-12 lg:p-14 xl:p-16 relative overflow-y-auto">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50/60 rounded-full blur-3xl pointer-events-none" />

          <div className="lg:hidden mb-8 flex items-center gap-3.5 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 bg-[#0C2461] p-2 rounded-xl shadow-md flex items-center justify-center shrink-0">
              <img src="/robot-logo.png" alt="BIS Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl flex items-center gap-1.5">
                  <span className="font-extrabold text-[#0C2461] tracking-tight">BIS</span>
                  <span className="font-semibold text-[#FFB347] tracking-tight">Sahayak</span>
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-800">
                  SmartAssist
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Official Compliance Intelligence Platform</p>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto my-auto relative z-10">
            
            <div className="mb-7">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-3 border border-blue-100">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Authorized Officer Portal</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1.5">
                {isSignUp ? "Enter your details to register for the workspace." : "Enter your credentials or select a verified role to access the workspace."}
              </p>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setErrorMessage(null); setOtpSent(false); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  !isSignUp ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setErrorMessage(null); setOtpSent(false); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isSignUp ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Sub-toggle for Sign In method */}
            {!isSignUp && (
              <div className="flex items-center justify-center gap-2 mb-5 p-1 bg-slate-50 border border-slate-200/80 rounded-lg">
                <button
                  type="button"
                  onClick={() => { setSignInMethod('password'); setErrorMessage(null); }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    signInMethod === 'password' ? 'bg-[#0C2461] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => { setSignInMethod('otp'); setErrorMessage(null); }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    signInMethod === 'otp' ? 'bg-[#0C2461] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Email OTP Login
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200/90 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                if (isSignUp) {
                  if (!otpSent) {
                    handleSendOtp(e);
                  } else {
                    handleVerifyOtp(e);
                  }
                } else {
                  if (signInMethod === 'password') {
                    handlePasswordSignIn(e);
                  } else {
                    if (!otpSent) {
                      handleSendOtp(e);
                    } else {
                      handleVerifyOtp(e);
                    }
                  }
                }
              }}
              className="space-y-4"
            >
              {isSignUp && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <UserCircle2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required={isSignUp}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading || otpSent}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C2461]/20 focus:border-[#0C2461] transition-all disabled:opacity-60"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                      Category / Role
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <select
                        required={isSignUp}
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        disabled={isLoading || otpSent}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C2461]/20 focus:border-[#0C2461] transition-all disabled:opacity-60 appearance-none"
                      >
                        <option value="" disabled>Select your category...</option>
                        <option value="Manufacturer">Manufacturer / Importer</option>
                        <option value="GovBidder">Government Bidder (B2B)</option>
                        <option value="QA">QA & Compliance Officer</option>
                        <option value="Consumer">Consumer / Retailer (B2C)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                  Official Email ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || !!loadingDemo || (isSignUp && otpSent)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C2461]/20 focus:border-[#0C2461] transition-all disabled:opacity-60"
                    placeholder="officer@bis.gov.in"
                  />
                </div>
              </div>

              {/* Password field for Sign Up OR Password-based Sign In */}
              {(isSignUp || (!isSignUp && signInMethod === 'password')) && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                      {isSignUp ? "Create Password" : "Password"}
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => { setSignInMethod('otp'); setErrorMessage(null); }}
                        className="text-xs font-semibold text-blue-700 hover:underline"
                      >
                        Forgot password? Use OTP
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading || (isSignUp && otpSent)}
                      className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C2461]/20 focus:border-[#0C2461] transition-all disabled:opacity-60"
                      placeholder={isSignUp ? "Minimum 6 characters" : "••••••••"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* OTP Field (shown during SignUp after sending OTP, OR in Sign In if signInMethod === 'otp' and otpSent) */}
              {((isSignUp && otpSent) || (!isSignUp && signInMethod === 'otp' && otpSent)) && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                      6-Digit OTP Code
                    </label>
                    <button 
                      type="button" 
                      onClick={() => handleSendOtp()} 
                      disabled={isSendingOtp} 
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer disabled:opacity-50"
                    >
                      {isSendingOtp ? "Sending..." : "Resend OTP"}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="otp"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={isLoading}
                      maxLength={6}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C2461]/20 focus:border-[#0C2461] transition-all disabled:opacity-60 font-mono tracking-widest text-center"
                      placeholder="••••••"
                    />
                  </div>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>OTP sent to <strong>{email}</strong>. Check your Gmail inbox!</span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !!loadingDemo || isSendingOtp}
                className="w-full py-3.5 px-4 mt-4 bg-gradient-to-r from-[#0C2461] via-[#0F2F7D] to-[#153e90] hover:from-[#0A1E50] hover:to-[#12367E] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#0C2461]/25 hover:shadow-xl hover:shadow-[#0C2461]/35 transition-all flex justify-center items-center gap-2 group active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading || isSendingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{isSendingOtp ? "Sending OTP..." : "Verifying..."}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {isSignUp
                        ? (!otpSent ? "Send Verification Code to Gmail" : "Verify & Complete Registration")
                        : (signInMethod === 'password'
                            ? "Sign In to BIS Portal"
                            : (!otpSent ? "Send OTP to Email" : "Sign In with OTP")
                          )
                      }
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">OR</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              className="w-full mt-6 py-3.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold text-sm rounded-xl shadow-sm transition-all flex justify-center items-center gap-3 group active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              <span>Continue with Google</span>
            </button>


          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-medium relative z-10">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>256-Bit TLS Ministry-Grade Security</span>
            </div>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-slate-600 transition-colors">Helpdesk Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

