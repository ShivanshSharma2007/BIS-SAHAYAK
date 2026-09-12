"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Globe, ChevronDown, Check, LayoutDashboard,
  ScanText, MapPin, FileCheck, MessageSquare, Zap, Bell,
  ShieldCheck, User, Building2, Award, ExternalLink,
  CheckCircle2, AlertTriangle, RefreshCw, LogOut,
  Info, Sparkles, X, ShieldAlert, FileText
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { SUPPORTED_LANGUAGES, getTranslation } from "@/lib/i18n/translations";
import type { SystemNotification } from "@/app/api/notifications/route";
import type { OfficerProfile } from "@/app/api/auth/profile/route";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Backend state
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifFilter, setNotifFilter] = useState<"ALL" | "UNREAD" | "REGULATORY" | "AUDIT" | "LABS">("ALL");
  const [profile, setProfile] = useState<OfficerProfile | null>(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const setActiveDrawer = useAppStore((state) => state.setActiveDrawer);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const t = getTranslation(language);
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  };

  // Fetch officer profile
  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/profile");
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
      }
    } catch (e) {
      console.error("Failed to fetch profile", e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchProfile();
  }, []);

  if (pathname === '/login' || pathname === '/') {
    return null;
  }

  // Mark single notification as read
  const handleMarkAsRead = async (id: string, actionDrawer?: string, actionTab?: string) => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_READ", id })
      });
      fetchNotifications();
      if (actionDrawer) {
        setActiveDrawer(actionDrawer);
        setNotifOpen(false);
      } else if (actionTab) {
        setActiveTab(actionTab);
        setNotifOpen(false);
      }
    } catch (e) {
      console.error("Error marking read", e);
    }
  };

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_ALL_READ" })
      });
      fetchNotifications();
    } catch (e) {
      console.error("Error marking all read", e);
    }
  };

  // Switch officer role
  const handleRoleChange = async (roleId: "OFFICER" | "AUDITOR" | "LAB_ASSESSOR") => {
    setIsUpdatingRole(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activeRole: roleId })
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
      }
    } catch (e) {
      console.error("Error switching role", e);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (notifFilter === "UNREAD") return !n.read;
    if (notifFilter === "REGULATORY") return n.category === "REGULATORY";
    if (notifFilter === "AUDIT") return n.category === "AUDIT";
    if (notifFilter === "LABS") return n.category === "LABS";
    return true;
  });

  const tabs = [
    { id: "command-center", label: t.header.tabs.commandCenter, icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: "scanner",        label: t.header.tabs.scanner,       icon: <ScanText className="w-3.5 h-3.5" /> },
    { id: "labs",           label: t.header.tabs.labs,          icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: "audits",         label: t.header.tabs.audits,        icon: <FileCheck className="w-3.5 h-3.5" /> },
    { id: "ai",             label: t.header.tabs.ai,            icon: <MessageSquare className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col w-full shrink-0 z-50">

      {/* ── Top bar ── */}
      <header className="h-[58px] bg-[#0C2461] flex items-center justify-between px-5 border-b border-[#1a3578]">

        {/* Brand */}
        <button
          onClick={() => setActiveTab("command-center")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-white p-[3px] flex items-center justify-center shadow-sm shrink-0">
            <img
              src="/robot-logo.png"
              alt="BIS Sahayak"
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>

          <div className="flex flex-col leading-none gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[17px] text-white tracking-tight">BIS</span>
              <span className="font-semibold text-[17px] text-[#FFB347] tracking-tight">Sahayak</span>
              <span className="hidden sm:inline-flex items-center gap-1 bg-[#27AE60] text-white text-[9px] font-extrabold px-2 py-[3px] rounded uppercase tracking-wider">
                <Zap className="w-2.5 h-2.5" strokeWidth={3} />SmartAssist
              </span>
            </div>
            <span className="text-[10px] text-[#8FA8D0] font-medium hidden sm:block">
              {t.header.platformSubtitle}
            </span>
          </div>
        </button>

        {/* Right controls */}
        <div className="flex items-center gap-2.5">
          {/* Live indicator */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#0B5E2A]/60 border border-[#27AE60]/40 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-pulse" />
            <span className="text-[11px] font-semibold text-[#2ECC71]">{t.header.liveDbConnected}</span>
          </div>

          <div className="w-px h-5 bg-white/10 hidden md:block" />

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => { setLangOpen(!langOpen); setNotifOpen(false); setProfileOpen(false); }}
              className="flex items-center gap-1.5 border border-white/15 bg-white/8 hover:bg-white/15 text-white h-8 rounded-lg px-2.5 text-sm font-medium transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#56CCF2] shrink-0" />
              <span className="font-semibold text-sm">{currentLang.nativeName}</span>
              <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded font-mono font-bold uppercase hidden sm:inline">
                {currentLang.code}
              </span>
              <ChevronDown className={`w-3 h-3 text-[#8FA8D0] transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
            </button>

            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute top-full mt-2 right-0 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 overflow-hidden">
                  <div className="px-3.5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Select Language / भाषा चुनें
                  </div>
                  {SUPPORTED_LANGUAGES.map((item) => {
                    const sel = item.code === language;
                    return (
                      <button
                        key={item.code}
                        onClick={() => { setLanguage(item.code); setLangOpen(false); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-blue-50 transition-colors cursor-pointer ${sel ? "bg-blue-50 text-blue-700" : "text-slate-700"}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded min-w-[26px] text-center ${sel ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                            {item.code.toUpperCase()}
                          </span>
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-semibold leading-tight">{item.nativeName}</span>
                            <span className="text-[11px] text-slate-400">{item.label}</span>
                          </div>
                        </div>
                        {sel && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* ── NOTIFICATIONS BELL POPOVER ── */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setLangOpen(false); setProfileOpen(false); }}
              className="relative w-8 h-8 rounded-lg border border-white/15 bg-white/8 hover:bg-white/15 flex items-center justify-center text-[#8FA8D0] hover:text-white transition-colors cursor-pointer"
              title="Official BIS Regulatory & System Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center px-1 shadow-sm animate-pulse border-2 border-[#0C2461]">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute top-full mt-2 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800">
                  
                  {/* Notification Header */}
                  <div className="p-3.5 bg-gradient-to-r from-[#0C2461] to-[#1E3A8A] text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                        <Bell className="w-4 h-4 text-[#FFB347]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-tight">Official BIS Alerts & Notifications</h4>
                        <p className="text-[10px] text-blue-200">{unreadCount} unread regulatory bulletins</p>
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-semibold text-blue-200 hover:text-white hover:underline transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center px-3 py-2 bg-slate-50 border-b border-slate-200 gap-1.5 overflow-x-auto text-[11px]">
                    {[
                      { id: "ALL", label: "All" },
                      { id: "UNREAD", label: `Unread (${unreadCount})` },
                      { id: "REGULATORY", label: "Gazette / QCO" },
                      { id: "AUDIT", label: "GeM Audits" },
                      { id: "LABS", label: "NABL Labs" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setNotifFilter(tab.id as any)}
                        className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          notifFilter === tab.id
                            ? "bg-[#0C2461] text-white shadow-xs"
                            : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/80"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
                    {filteredNotifications.length === 0 ? (
                      <div className="py-8 text-center px-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                        <p className="text-xs font-semibold text-slate-700">No notifications in this filter</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">All regulatory systems are up to date.</p>
                      </div>
                    ) : (
                      filteredNotifications.map((n) => {
                        const isCritical = n.severity === "CRITICAL";
                        return (
                          <div
                            key={n.id}
                            onClick={() => handleMarkAsRead(n.id, n.actionDrawer, n.actionTab)}
                            className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 relative hover:bg-blue-50/50 ${
                              !n.read ? "bg-blue-50/25" : ""
                            }`}
                          >
                            {/* Unread indicator bar */}
                            {!n.read && (
                              <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r" />
                            )}

                            {/* Category Icon */}
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              n.category === "REGULATORY"
                                ? "bg-rose-100 text-rose-700 border border-rose-200"
                                : n.category === "AUDIT"
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : n.category === "LABS"
                                ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                                : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            }`}>
                              {n.category === "REGULATORY" ? <ShieldAlert className="w-4 h-4" /> :
                               n.category === "AUDIT" ? <FileCheck className="w-4 h-4" /> :
                               n.category === "LABS" ? <MapPin className="w-4 h-4" /> :
                               <Sparkles className="w-4 h-4" />}
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                                  isCritical
                                    ? "bg-rose-600 text-white"
                                    : "bg-slate-100 text-slate-600"
                                }`}>
                                  {n.category}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">{n.timestamp}</span>
                              </div>

                              <h5 className={`text-xs leading-snug font-bold ${!n.read ? "text-slate-900" : "text-slate-700"}`}>
                                {n.title}
                              </h5>
                              <p className="text-[11px] text-slate-500 leading-relaxed mt-1 line-clamp-2">
                                {n.message}
                              </p>

                              {n.referenceCode && (
                                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded w-fit">
                                  <span>Ref: {n.referenceCode}</span>
                                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Popover Footer */}
                  <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setActiveDrawer("alerts");
                        setNotifOpen(false);
                      }}
                      className="text-blue-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Open Gazette QCO Bulletin Board</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-[11px]"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── OFFICER PROFILE BADGE & POPOVER ── */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setLangOpen(false); setNotifOpen(false); }}
              className="w-8 h-8 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] border-2 border-[#3B5CB8] hover:border-white flex items-center justify-center text-white font-bold text-xs cursor-pointer transition-all shadow-sm overflow-hidden"
              title="BIS Officer & Inspector Credentials Profile"
            >
              {session?.user?.image ? (
                <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
              ) : (
                session?.user?.name ? session.user.name.charAt(0).toUpperCase() : profile?.avatarInitial || "A"
              )}
            </button>

            {profileOpen && profile && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute top-full mt-2 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800">
                  
                  {/* Government ID Header Card */}
                  <div className="bg-gradient-to-r from-[#0C2461] via-[#153e90] to-[#0C2461] text-white p-4 relative overflow-hidden">
                    {/* Watermark badge */}
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xs pointer-events-none" />
                    
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-extrabold text-xl flex items-center justify-center shadow-md border-2 border-white/40 shrink-0 overflow-hidden">
                          {session?.user?.image ? (
                            <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                          ) : (
                            session?.user?.name ? session.user.name.charAt(0).toUpperCase() : profile.avatarInitial
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-sm text-white">{session?.user?.name || profile.name}</h4>
                            <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-400/30">
                              ACTIVE
                            </span>
                          </div>
                          <p className="text-[11px] text-blue-200 font-medium">{profile.designation}</p>
                          <p className="text-[10px] font-mono text-amber-300 mt-0.5">ID: {profile.badgeNumber}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setProfileOpen(false)}
                        className="text-white/60 hover:text-white p-1 rounded-md cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Ministry info */}
                    <div className="mt-3 pt-2.5 border-t border-white/10 text-[10px] text-blue-100 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#FFB347] shrink-0" />
                      <span className="truncate">{profile.department}</span>
                    </div>
                  </div>

                  {/* Statutory Clearance & Region */}
                  <div className="px-4 py-2.5 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 text-blue-900 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                      <span>{profile.clearanceLevel}</span>
                    </div>
                    <span className="text-slate-500 font-medium">{profile.region}</span>
                  </div>

                  {/* Officer Statistics Grid */}
                  <div className="p-3.5 grid grid-cols-4 gap-2 bg-slate-50 border-b border-slate-200 text-center">
                    <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="text-xs font-black text-[#0C2461]">{profile.stats.auditsConducted}</div>
                      <div className="text-[9px] font-bold text-slate-500 mt-0.5">Audits</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="text-xs font-black text-emerald-600">{profile.stats.licensesVerified}</div>
                      <div className="text-[9px] font-bold text-slate-500 mt-0.5">Licenses</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="text-xs font-black text-rose-600">{profile.stats.activeInvestigations}</div>
                      <div className="text-[9px] font-bold text-slate-500 mt-0.5">Enforce</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="text-xs font-black text-purple-600">{profile.stats.standardsMonitored}</div>
                      <div className="text-[9px] font-bold text-slate-500 mt-0.5">IS Norms</div>
                    </div>
                  </div>

                  {/* Operational Role Switcher */}
                  <div className="p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Operational Inspection Role
                      </span>
                      {isUpdatingRole && (
                        <span className="text-[10px] text-blue-600 font-semibold animate-pulse flex items-center gap-1">
                          <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Switching...
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {profile.availableRoles.map((r) => {
                        const isSelected = profile.activeRole === r.id;
                        return (
                          <button
                            key={r.id}
                            disabled={isUpdatingRole}
                            onClick={() => handleRoleChange(r.id)}
                            className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? "bg-blue-50/70 border-blue-500 text-[#0C2461] shadow-xs"
                                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold flex items-center gap-1.5">
                                <span>{r.label}</span>
                                {isSelected && (
                                  <span className="bg-blue-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{r.desc}</div>
                            </div>
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions & Session info */}
                  <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <div className="text-[10px] text-slate-500">
                      <span>Auth: </span>
                      <span className="font-mono font-semibold text-slate-700">{session?.user?.email || profile.email}</span>
                    </div>
                    {session ? (
                      <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Sign Out</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          alert("Secure Session Locked. Bureau of Indian Standards credentials authenticated.");
                          setProfileOpen(false);
                        }}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Lock Session</span>
                      </button>
                    )}
                  </div>

                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Navigation tabs ── */}
      <nav className="h-10 bg-white flex items-stretch px-4 gap-0.5 overflow-x-auto border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "ai") useAppStore.getState().setAssistantOpen(true);
                else setActiveTab(tab.id);
              }}
              className={`relative flex items-center gap-1.5 px-4 text-[12.5px] font-semibold transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                isActive
                  ? "text-[#0C2461] border-[#0C2461]"
                  : "text-slate-500 border-transparent hover:text-slate-800"
              }`}
            >
              <span className={isActive ? "text-[#0C2461]" : "text-slate-400"}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

