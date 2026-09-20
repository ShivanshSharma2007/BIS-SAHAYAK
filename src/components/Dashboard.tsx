"use client";

import { useState, useRef, useEffect } from "react";
import {
  ScanText, FileSpreadsheet, ShieldCheck, MapPin, Network,
  FileCheck, Bell, TrendingUp, Activity, Mic, MicOff,
  AlertCircle, ArrowUpRight, Search, ChevronRight, CheckCircle2,
  X, Loader2, Sparkles, Lock
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { VoiceAssistantManager, POPULAR_VOICE_QUERIES } from "@/lib/speech";
import { getTranslation } from "@/lib/i18n/translations";
import { useSession } from "next-auth/react";

/*
  BIS-inspired card palette
  — Primary: deep navy  #003087
  — Saffron: #FF6B00
  — Green:   #138808
  — Sky:     #0077B6
  — Purple:  #6A0DAD
  — Crimson: #C0182C
*/
const CARDS_META = [
  {
    id: "scanner",
    from: "#818CF8", to: "#A78BFA",           // soft lilac / bright lavender
    iconBg: "rgba(255,255,255,0.25)",
    softBg: "#F5F3FF", border: "#DDD6FE",
    badgeBg: "#EDE9FE", badgeText: "#5B21B6",
    glow: "rgba(129,140,248,0.25)",
  },
  {
    id: "parser",
    from: "#FBBF24", to: "#F59E0B",           // bright sunshine honey gold
    iconBg: "rgba(255,255,255,0.25)",
    softBg: "#FFFBEB", border: "#FDE68A",
    badgeBg: "#FEF3C7", badgeText: "#92400E",
    glow: "rgba(251,191,36,0.25)",
  },
  {
    id: "fraud",
    from: "#34D399", to: "#10B981",           // bright seafoam mint
    iconBg: "rgba(255,255,255,0.25)",
    softBg: "#ECFDF5", border: "#A7F3D0",
    badgeBg: "#D1FAE5", badgeText: "#065F46",
    glow: "rgba(52,211,153,0.25)",
  },
  {
    id: "labs",
    from: "#38BDF8", to: "#0EA5E9",           // airy sky / crystal cyan
    iconBg: "rgba(255,255,255,0.25)",
    softBg: "#F0F9FF", border: "#BAE6FD",
    badgeBg: "#E0F2FE", badgeText: "#0369A1",
    glow: "rgba(56,189,248,0.25)",
  },
  {
    id: "navigator",
    from: "#FB923C", to: "#F97316",           // warm coral saffron / peach orange
    iconBg: "rgba(255,255,255,0.25)",
    softBg: "#FFF7ED", border: "#FED7AA",
    badgeBg: "#FFEDD5", badgeText: "#C2410C",
    glow: "rgba(251,146,60,0.25)",
  },
  {
    id: "auditor",
    from: "#FB7185", to: "#F43F5E",           // soft flamingo rose / coral pink
    iconBg: "rgba(255,255,255,0.25)",
    softBg: "#FFF1F2", border: "#FECDD3",
    badgeBg: "#FFE4E6", badgeText: "#BE123C",
    glow: "rgba(251,113,133,0.25)",
  },
];

function CardIcon({ id }: { id: string }) {
  const cls = "w-[22px] h-[22px]";
  const map: Record<string, React.ReactNode> = {
    scanner:   <ScanText className={cls} />,
    parser:    <FileSpreadsheet className={cls} />,
    fraud:     <ShieldCheck className={cls} />,
    labs:      <MapPin className={cls} />,
    navigator: <Network className={cls} />,
    auditor:   <FileCheck className={cls} />,
  };
  return <>{map[id]}</>;
}

export default function Dashboard() {
  const setActiveDrawer           = useAppStore((s) => s.setActiveDrawer);
  const setSelectedStandardId     = useAppStore((s) => s.setSelectedStandardId);
  const setAssistantOpen          = useAppStore((s) => s.setAssistantOpen);
  const setAssistantInitialPrompt = useAppStore((s) => s.setAssistantInitialPrompt);
  const language                  = useAppStore((s) => s.language);
  const t = getTranslation(language);
  const { data: session } = useSession();
  // @ts-ignore
  const userRole = session?.user?.department || "General";

  const [stats, setStats]               = useState({ standardsCount: 634, activeLabsCount: 12, compliancePassRate: 94.2 });
  const [searchQuery, setSearchQuery]   = useState("");
  const [isListening, setIsListening]   = useState(false);
  const [voiceStatus, setVoiceStatus]   = useState<string | null>(null);
  const [voiceError, setVoiceError]     = useState<string | null>(null);
  const voiceRef = useRef<VoiceAssistantManager | null>(null);

  // Subscribe for Alerts Modal Backend State
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail]         = useState("");
  const [subscribeCategories, setSubscribeCategories] = useState<string[]>([
    "Electronics & IT (CRS)",
    "EV Batteries & Cells",
    "Chemicals & Metals"
  ]);
  const [subscribeLoading, setSubscribeLoading]     = useState(false);
  const [subscribedSuccess, setSubscribedSuccess]   = useState(false);
  const [subscriptionId, setSubscriptionId]         = useState("");

  const availableCategories = [
    "Electronics & IT (CRS)",
    "EV Batteries & Cells",
    "Chemicals & Metals",
    "Smart Wearables",
    "Home Appliances",
    "Gold Hallmarking & HUID"
  ];

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(r => r.json())
      .then(d => { if (d.success && d.stats) setStats(d.stats); })
      .catch(() => {});
    voiceRef.current = new VoiceAssistantManager();
    return () => { voiceRef.current?.stop(); };
  }, []);

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail.trim() || !subscribeEmail.includes("@")) return;

    setSubscribeLoading(true);
    try {
      const res = await fetch("/api/regulatory-alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: subscribeEmail.trim(),
          alertType: "ALL_HIGH_IMPACT",
          categories: subscribeCategories
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubscribedSuccess(true);
        setSubscriptionId(data.subscription?.subscriptionId || `SUB-${Date.now().toString().slice(-6)}`);
      }
    } catch (err) {
      console.error("Subscription error:", err);
    } finally {
      setSubscribeLoading(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setSubscribeCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleListening = async () => {
    if (isListening) { voiceRef.current?.stop(); setIsListening(false); setVoiceStatus(null); return; }
    setVoiceError(null);
    if (!voiceRef.current) voiceRef.current = new VoiceAssistantManager();
    await voiceRef.current.start({
      onStart:  () => { setIsListening(true); setVoiceStatus(t.dashboard.listeningPrompt); },
      onResult: (tr, final) => { setSearchQuery(tr); if (final) { setIsListening(false); setVoiceStatus(null); } },
      onError:  (msg) => { setIsListening(false); setVoiceStatus(null); setVoiceError(msg); },
      onEnd:    () => { setIsListening(false); setVoiceStatus(null); },
    }, language);
  };

  const handleAskAI = (q?: string) => {
    const query = q || searchQuery;
    if (!query.trim()) return;
    if (isListening) { voiceRef.current?.stop(); setIsListening(false); }
    setAssistantInitialPrompt(query.trim());
    setAssistantOpen(true);
    setSearchQuery("");
  };

  const roleToCardsMap: Record<string, string[]> = {
    "Manufacturer": ["scanner", "labs", "navigator"],
    "GovBidder": ["auditor"],
    "QA": ["scanner", "parser", "navigator"],
    "Consumer": ["fraud"]
  };
  
  const allowedCardIds = roleToCardsMap[userRole] || CARDS_META.map(c => c.id);

  const cards = CARDS_META.map((m) => {
    const c = (t.dashboard.cards as any)[m.id];
    const isLocked = !allowedCardIds.includes(m.id);
    return { ...m, title: c.title, description: c.description, stats: c.stats, btn: c.btn, isLocked };
  });

  return (
    <div className="w-full flex flex-col min-h-screen">

      {/* ═══════════════════════════════════
          HERO
      ═══════════════════════════════════ */}
      <section className="bg-[#003087] border-b-4 border-[#FF6B00]">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col items-center text-center">

          {/* Brand row */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-xl bg-white p-1.5 shadow-lg flex-shrink-0">
              <img src="/robot-logo.png" alt="BIS Sahayak" className="w-full h-full object-contain" loading="eager" />
            </div>
            <div className="text-left">
              <h1 className="text-[32px] font-extrabold text-white leading-tight tracking-tight">
                BIS <span className="text-[#FFB347]">Sahayak</span>
              </h1>
              <p className="text-[11px] font-semibold text-blue-200 uppercase tracking-widest mt-0.5">
                SmartAssist · Regulatory Intelligence
              </p>
            </div>
          </div>

          <p className="text-blue-100/80 text-[14px] max-w-xl leading-relaxed mb-7">
            {t.dashboard.description}
          </p>

          {/* ── Search bar ── */}
          <div className="w-full max-w-3xl mb-5">
            <div className={`flex items-center bg-white rounded-xl h-[54px] px-1.5 pl-4 gap-2 shadow-lg transition-all ${
              isListening
                ? "ring-2 ring-rose-400 ring-offset-2 ring-offset-[#003087]"
                : "focus-within:ring-2 focus-within:ring-[#FFB347] focus-within:ring-offset-2 focus-within:ring-offset-[#003087]"
            }`}>
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                placeholder={isListening ? (voiceStatus ?? "Listening…") : t.dashboard.searchPlaceholder}
                className="flex-1 text-[14px] text-slate-800 placeholder:text-slate-400 outline-none bg-transparent font-medium"
              />

              {/* Mic — sky blue pill */}
              <button
                type="button"
                onClick={toggleListening}
                className={`w-[38px] h-[38px] rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  isListening
                    ? "bg-rose-500 text-white"
                    : "bg-[#E0F2FE] text-[#0369A1] hover:bg-[#BAE6FD]"
                } ${isListening ? "animate-pulse" : ""}`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Ask AI — vivid saffron-to-orange gradient (BIS saffron) */}
              <button
                onClick={() => handleAskAI()}
                disabled={!searchQuery.trim()}
                className="h-[38px] px-6 rounded-lg text-white text-[13px] font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                style={{
                  background: "linear-gradient(135deg, #FF6B00 0%, #E63946 100%)",
                  boxShadow: "0 2px 10px rgba(255,107,0,0.4)"
                }}
              >
                Ask AI
              </button>
            </div>

            {/* Listening state */}
            {isListening && (
              <div className="mt-2.5 flex items-center justify-center gap-2 text-rose-300 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping inline-block" />
                {voiceStatus ?? "Listening… speak now"}
                <button onClick={toggleListening} className="underline ml-1 cursor-pointer">Stop</button>
              </div>
            )}
            {voiceError && (
              <div className="mt-2.5 flex items-center gap-2 bg-amber-500/10 border border-amber-400/20 rounded-lg px-3 py-2 text-[12px] text-amber-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="flex-1">{voiceError}</span>
                <button onClick={() => setVoiceError(null)} className="underline cursor-pointer">×</button>
              </div>
            )}
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] text-blue-200/70 font-medium">Try:</span>
            {(t.dashboard.sampleQueries || POPULAR_VOICE_QUERIES).slice(0, 3).map((q: string, i: number) => (
              <button
                key={i}
                onClick={() => { setSearchQuery(q); handleAskAI(q); }}
                className="text-[12px] text-blue-100 hover:text-white border border-white/20 hover:border-white/40 hover:bg-white/10 px-3 py-1 rounded-full transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          CONTENT
      ═══════════════════════════════════ */}
      <section className="flex-1 bg-[#F4F6F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* Coloured left rule */}
              <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(180deg,#FF6B00,#003087)" }} />
              <div>
                <h2 className="text-[15px] font-extrabold text-slate-800 tracking-tight leading-none">
                  Compliance Intelligence Suite
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  BIS-certified AI modules · IS/IEC standards engine
                </p>
              </div>
            </div>
            {/* Status chip */}
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-700">6 Modules Deployed</span>
            </div>
          </div>

          {/* ── Feature Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => {
                  if (card.isLocked) {
                    alert("This feature is locked for your category.");
                    return;
                  }
                  if (card.id === 'labs') {
                    setSelectedStandardId(null);
                  }
                  setActiveDrawer(card.id);
                }}
                className={`group bg-white rounded-2xl overflow-hidden border transition-all duration-200 ${
                  card.isLocked 
                    ? "cursor-not-allowed border-slate-200" 
                    : "cursor-pointer border-slate-200 hover:-translate-y-1"
                }`}
                onMouseEnter={(e) => {
                  if (card.isLocked) return;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px ${card.glow}`;
                  (e.currentTarget as HTMLElement).style.borderColor = card.border;
                }}
                onMouseLeave={(e) => {
                  if (card.isLocked) return;
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                  (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                }}
              >
                {/* Coloured header band with icon + card image */}
                <div
                  className="relative h-[88px] flex items-center justify-between px-5 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${card.from} 0%, ${card.to} 100%)` }}
                >
                  {/* Icon badge */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm relative"
                    style={{ background: card.iconBg, backdropFilter: "blur(4px)" }}
                  >
                    <CardIcon id={card.id} />
                    {card.isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl backdrop-blur-[2px]">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Card illustration circular badge — perfectly frames the circle without square corners */}
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-white/20 backdrop-blur-md border-2 border-white/60 shadow-md shrink-0 flex items-center justify-center">
                    <img
                      src={`/images/cards/${card.id}.png`}
                      alt={card.title}
                      className="w-full h-full object-cover scale-[1.10] transition-transform duration-300 group-hover:scale-125"
                      loading="eager"
                    />
                  </div>

                  {/* Subtle bottom fade */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-6 pointer-events-none"
                    style={{ background: `linear-gradient(to top, ${card.to}55, transparent)` }}
                  />
                </div>

                {/* White body */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-[15px] leading-snug mb-1.5">
                    {card.title}
                  </h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">
                    {card.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-md shrink min-w-0"
                      style={{ background: card.badgeBg, color: card.badgeText }}
                    >
                      {card.stats}
                    </span>
                    <button
                      type="button"
                      disabled={card.isLocked}
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3.5 py-1.5 rounded-lg text-white transition-all shadow-sm shrink-0 ${card.isLocked ? "cursor-not-allowed" : "hover:opacity-90 cursor-pointer"}`}
                      style={{ background: `linear-gradient(135deg, ${card.from}, ${card.to})` }}
                    >
                      {card.isLocked ? (
                        <>
                          <Lock className="w-3.5 h-3.5" /> Locked
                        </>
                      ) : (
                        <>
                          {card.btn || "Open"} <ArrowUpRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Bottom panels ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">

            {/* Regulatory Updates — 7/12 */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
              <div
                className="flex items-center justify-between px-5 py-3.5 shrink-0"
                style={{ background: "linear-gradient(90deg,#003087 0%,#023E8A 100%)" }}
              >
                <h3 className="text-[13px] font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#FFB347]" />
                  Latest Regulatory Updates
                </h3>
                <button
                  onClick={() => setActiveDrawer("alerts")}
                  className="text-[12px] text-[#FFB347] hover:text-white font-semibold flex items-center gap-0.5 cursor-pointer transition-colors"
                >
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="divide-y divide-slate-100 flex-1">
                {[
                  { title: "Smart Wearables included under CRS Phase IV",    date: "Aug 28", tag: "NEW",    tagBg: "#DC2626", dot: "#FCA5A5", desc: "Ministry of Electronics & IT expanded Compulsory Registration Scheme." },
                  { title: "Revised Safety Requirements for EV Battery Packs", date: "Aug 15", tag: "NEW",    tagBg: "#DC2626", dot: "#FCA5A5", desc: "IS 16046 (Part 2) amended with thermal runaway propagation testing." },
                  { title: "Updated Microwave Leakage Tolerance Limits",      date: "Jul 30", tag: "UPDATE", tagBg: "#D97706", dot: "#FCD34D", desc: "IS 302-2-25 revised with stricter microwave leakage limits." },
                ].map((u, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveDrawer("alerts")}
                    className="flex gap-3 px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: u.dot }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                        <span className="text-[13px] font-bold text-slate-800 truncate">{u.title}</span>
                        <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded shrink-0" style={{ background: u.tagBg }}>{u.tag}</span>
                      </div>
                      <p className="text-[12px] text-slate-500 line-clamp-1">{u.desc}</p>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 shrink-0 mt-0.5">{u.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health — 5/12 */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
              <div
                className="px-5 py-3.5 shrink-0"
                style={{ background: "linear-gradient(90deg,#059669 0%,#047857 100%)" }}
              >
                <h3 className="text-[13px] font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-200" />
                  {t.dashboard.telemetryStats.systemHealth}
                </h3>
              </div>
              <div className="px-5 py-3.5 space-y-2 flex-1">
                {[
                  { 
                    label: "BIS Live Sync", 
                    val: "Active", 
                    sub: "e-BIS", 
                    dot: "#22C55E", 
                    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    pulse: true, 
                    drawer: null 
                  },
                  { 
                    label: "GeM Pre-Bid Engine", 
                    val: "Online", 
                    sub: "v2.4", 
                    dot: "#22C55E", 
                    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    pulse: true, 
                    drawer: "auditor" 
                  },
                  { 
                    label: t.dashboard.telemetryStats.standardsIndexed, 
                    val: `${stats.standardsCount}`, 
                    sub: "IS Codes", 
                    dot: "#3B82F6", 
                    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
                    pulse: false, 
                    drawer: "alerts" 
                  },
                  { 
                    label: t.dashboard.telemetryStats.labsMapped, 
                    val: `${stats.activeLabsCount}`, 
                    sub: "NABL Labs", 
                    dot: "#3B82F6", 
                    badgeBg: "bg-sky-50 text-sky-700 border-sky-200",
                    pulse: false, 
                    drawer: "labs" 
                  },
                  { 
                    label: t.dashboard.telemetryStats.passRate, 
                    val: `${stats.compliancePassRate}%`, 
                    sub: "Qualified", 
                    dot: "#8B5CF6", 
                    badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
                    pulse: false, 
                    drawer: "scanner" 
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={() => item.drawer && setActiveDrawer(item.drawer)}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-100 bg-slate-50/70 transition-all ${
                      item.drawer ? "hover:bg-white hover:border-slate-300 hover:shadow-xs cursor-pointer" : ""
                    }`}
                    title={item.drawer ? `Click to open ${item.label}` : undefined}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-2 h-2 rounded-full shrink-0" style={{ background: item.dot }}>
                        {item.pulse && <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ background: item.dot }} />}
                      </div>
                      <span className="text-[12px] font-semibold text-slate-700 truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border font-mono ${item.badgeBg}`}>
                        {item.val} {item.sub && <span className="opacity-70 font-sans font-medium text-[10px] ml-0.5">· {item.sub}</span>}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-4 pt-2">
                <button
                  onClick={() => { setSubscribedSuccess(false); setSubscribeModalOpen(true); }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold text-[#003087] bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" /> Subscribe for Alerts
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SUBSCRIBE FOR ALERTS MODAL
      ═══════════════════════════════════ */}
      {subscribeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#003087]">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">
                    Regulatory Push Alerts
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Get instant BIS QCO Gazette & standard revisions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSubscribeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            {subscribedSuccess ? (
              <div className="py-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  Subscription Activated!
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mb-3">
                  You will receive real-time notifications when new QCO amendments or testing mandates are gazetted.
                </p>
                <span className="text-[11px] font-mono font-bold bg-slate-100 px-3 py-1 rounded-md text-slate-700">
                  ID: {subscriptionId}
                </span>
                <button
                  onClick={() => setSubscribeModalOpen(false)}
                  className="mt-6 px-6 py-2 bg-[#003087] text-white text-xs font-bold rounded-xl hover:bg-[#023E8A] transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribeSubmit} className="pt-4 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Official Email / Dispatch Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="compliance.officer@company.in"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select Regulatory Sectors to Monitor
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                    {availableCategories.map((cat, i) => {
                      const isSelected = subscribeCategories.includes(cat);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-blue-50 border-blue-300 text-[#003087] font-semibold"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}{cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSubscribeModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={subscribeLoading || !subscribeEmail.trim()}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#003087] hover:bg-[#023E8A] disabled:opacity-50 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    {subscribeLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Activate Push Alerts</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
