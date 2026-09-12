"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { 
  ShieldCheck, ArrowRight, UserCircle2, Building2, Loader2, 
  AlertCircle, CheckCircle2, Lock, Mail, Eye, EyeOff, Sparkles, 
  FileCheck2, Shield, Cpu, ExternalLink, HelpCircle
} from "lucide-react";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        // Automatic immediate redirect to the website dashboard
        window.location.href = "/dashboard";
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Authentication failed. Please try again.");
      setIsLoading(false);
      setLoadingDemo(null);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col w-full bg-slate-950 text-slate-900 selection:bg-blue-600 selection:text-white"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", Helvetica, Arial, sans-serif' }}
    >
      {/* Top National Tri-Color Accent Ribbon */}
      <div className="w-full h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] z-50 shrink-0 shadow-sm" />

      <div className="flex-1 flex flex-col lg:flex-row w-full">
        {/* ===================================================================== */}
        {/* LEFT PANEL - Premium National Standards Intelligence Showcase (52%) */}
        {/* ===================================================================== */}
        <div className="hidden lg:flex w-[52%] bg-gradient-to-br from-[#061430] via-[#0A1F4D] to-[#0E2866] relative overflow-hidden flex-col justify-between p-12 xl:p-16 border-r border-blue-900/40">
          
          {/* Ambient Glows and Tech Grid */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500/15 blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[130px] pointer-events-none" />
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-indigo-500/15 blur-[140px] pointer-events-none" />

          {/* Subtle Grid Background Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" 
          />

          {/* Top Brand Header */}
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

          {/* Central Hero Pitch */}
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

            {/* Live Metrics Cards */}
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

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {[
                "Scheme-I (ISI Mark)",
                "CRS Electronics",
                "Gold HUID Radar",
                "QCO Gazette Alerts",
                "NABL Labs GeoFinder"
              ].map((tag) => (
                <span 
                  key={tag} 
                  className="px-2.5 py-1 rounded-lg bg-blue-900/40 border border-blue-700/40 text-blue-200 text-[11px] font-medium"
                >
                  &bull; {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Left Panel Footer */}
          <div className="relative z-10 pt-6 border-t border-blue-800/40 flex items-center justify-between text-xs text-blue-300/80 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Government of India &bull; MeitY &amp; BIS Cybersecurity Standards Compliant</span>
            </div>
            <span className="text-[11px] text-blue-400/60 font-mono">v2.6.4</span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT PANEL - Clean, Focused Officer Login Canvas (48%)               */}
        {/* ===================================================================== */}
        <div className="w-full lg:w-[48%] bg-white flex flex-col justify-between p-8 sm:p-12 lg:p-14 xl:p-16 relative overflow-y-auto">
          
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50/60 rounded-full blur-3xl pointer-events-none" />

          {/* Mobile-Only Header */}
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
            
            {/* Title & Introduction */}
            <div className="mb-7">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-3 border border-blue-100">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Authorized Officer Portal</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1.5">
                Enter your credentials or select a verified role to access the workspace.
              </p>
            </div>



            {/* Error Notification Alert */}
            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200/90 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Main Login Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin(email, password);
              }}
              className="space-y-4"
            >
              {/* Email Input */}
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
                    disabled={isLoading || !!loadingDemo}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C2461]/20 focus:border-[#0C2461] transition-all disabled:opacity-60"
                    placeholder="officer@bis.gov.in"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                    Security Password
                  </label>
                  <a href="#" className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || !!loadingDemo}
                    className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C2461]/20 focus:border-[#0C2461] transition-all disabled:opacity-60"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0C2461] focus:ring-[#0C2461]/30 cursor-pointer" 
                  />
                  <span>Keep session active on this terminal</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !!loadingDemo}
                className="w-full py-3.5 px-4 mt-2 bg-gradient-to-r from-[#0C2461] via-[#0F2F7D] to-[#153e90] hover:from-[#0A1E50] hover:to-[#12367E] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#0C2461]/25 hover:shadow-xl hover:shadow-[#0C2461]/35 transition-all flex justify-center items-center gap-2 group active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying Officer Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to BIS Portal</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Section (Essential for SIH Evaluation) */}
            <div className="mt-8 pt-6 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Quick Demo Access (1-Click Test)
                </span>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  Evaluator Presets
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Admin Demo Button */}
                <button
                  type="button"
                  disabled={isLoading || !!loadingDemo}
                  onClick={() => {
                    setEmail("demo@bis.gov.in");
                    setPassword("demo_password");
                    handleLogin("demo@bis.gov.in", "demo_password", "admin");
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-300 transition-all text-left group disabled:opacity-60 cursor-pointer shadow-xs hover:shadow-sm"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    {loadingDemo === "admin" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserCircle2 className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-[#0C2461] truncate flex items-center gap-1.5">
                      <span>Compliance Admin</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">demo@bis.gov.in</div>
                    <div className="text-[9px] text-blue-600 font-semibold mt-0.5">Full Audit &amp; Admin Rights</div>
                  </div>
                </button>

                {/* Review Officer Demo Button */}
                <button
                  type="button"
                  disabled={isLoading || !!loadingDemo}
                  onClick={() => {
                    setEmail("user@bis.gov.in");
                    setPassword("demo_password");
                    handleLogin("user@bis.gov.in", "demo_password", "user");
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-amber-50/60 hover:border-amber-300 transition-all text-left group disabled:opacity-60 cursor-pointer shadow-xs hover:shadow-sm"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    {loadingDemo === "user" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Building2 className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-amber-800 truncate flex items-center gap-1.5">
                      <span>Review Officer</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">user@bis.gov.in</div>
                    <div className="text-[9px] text-amber-700 font-semibold mt-0.5">Standards &amp; Labs Desk</div>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Right Panel Footer */}
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
