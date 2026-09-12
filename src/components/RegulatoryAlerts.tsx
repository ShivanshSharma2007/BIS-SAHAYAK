"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Bell, 
  ExternalLink, 
  Calendar, 
  AlertCircle, 
  Sparkles, 
  Check, 
  Loader2, 
  Send,
  X,
  Filter
} from "lucide-react";
import { RegulatoryAlert } from "@/data/regulatoryAlertsData";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface RegulatoryAlertsProps {
  onOpenQuickAI?: () => void;
}

export default function RegulatoryAlerts({ onOpenQuickAI }: RegulatoryAlertsProps) {
  const [alerts, setAlerts] = useState<RegulatoryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  
  // Push Alert Modal State
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  // Quick AI Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  // Fetch alerts from backend
  const fetchAlerts = async (filter = "ALL") => {
    try {
      setLoading(true);
      const url = filter === "ALL" ? "/api/regulatory-alerts" : `/api/regulatory-alerts?impact=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.alerts) {
        setAlerts(data.alerts);
      }
    } catch (err) {
      console.error("Failed to load regulatory alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(selectedFilter);
  }, [selectedFilter]);

  // Handle Subscribe
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail || !subscribeEmail.includes("@")) return;

    try {
      setSubscribeLoading(true);
      const res = await fetch("/api/regulatory-alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: subscribeEmail,
          alertType: "ALL_UPDATES"
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubscribedSuccess(true);
        setTimeout(() => {
          setSubscribeModalOpen(false);
          setSubscribedSuccess(false);
          setSubscribeEmail("");
        }, 2200);
      }
    } catch (err) {
      console.error("Subscription error:", err);
    } finally {
      setSubscribeLoading(false);
    }
  };

  // Handle Quick AI Query
  const handleRunAiQuery = async (customQuery?: string) => {
    const q = customQuery || aiQuery;
    if (!q.trim()) return;

    try {
      setAiLoading(true);
      setAiAnswer(null);
      const res = await fetch("/api/regulatory-alerts/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q.trim() })
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setAiAnswer(data.answer);
      } else {
        setAiAnswer(data.error || "Failed to generate regulatory analysis.");
      }
    } catch (err: any) {
      setAiAnswer(`Error connecting to AI: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Styling helpers
  const getCardClasses = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200/90 bg-[#fff5f5]";
      case "medium":
        return "border-amber-200/90 bg-[#fffdf0]";
      case "low":
        return "border-blue-200/90 bg-[#f4f9ff]";
      default:
        return "border-slate-200 bg-white";
    }
  };

  const getImpactBadge = (impact: string, severity: string) => {
    switch (severity) {
      case "high":
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 tracking-wider">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{impact}</span>
          </div>
        );
      case "medium":
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 tracking-wider">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>{impact}</span>
          </div>
        );
      case "low":
        return (
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 tracking-wider">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span>{impact}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-20 animate-in fade-in duration-300">
      {/* Sub-Header / Feed Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            Regulatory Delta Feed
          </h2>
          <span className="text-xs bg-slate-200/70 text-slate-600 font-semibold px-2 py-0.5 rounded-full ml-1">
            {alerts.length} Active
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick AI Query Button matching header screenshot */}
          <button
            onClick={() => {
              if (onOpenQuickAI) {
                onOpenQuickAI();
              } else {
                setAiModalOpen(true);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#163f73] hover:bg-[#1e4f8f] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Quick AI Query</span>
          </button>

          {/* Subscribe Button matching screenshot */}
          <button
            onClick={() => setSubscribeModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-slate-600" />
            <span>Subscribe for Push Alerts</span>
          </button>
        </div>
      </div>

      {/* Filter Badges */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {[
          { id: "ALL", label: "All Alerts" },
          { id: "HIGH", label: "High Impact" },
          { id: "MEDIUM", label: "Medium Impact" },
          { id: "LOW", label: "Low Impact" }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              selectedFilter === filter.id
                ? "bg-[#163f73] text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Syncing with official Gazette & BIS regulatory feed...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl border p-5 sm:p-6 shadow-sm hover:shadow-md transition-all ${getCardClasses(
                alert.severity
              )}`}
            >
              {/* Top Row: Impact Badge, NEW pill, and Date */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  {getImpactBadge(alert.impact, alert.severity)}
                  {alert.isNew && (
                    <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide leading-none uppercase">
                      NEW
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{alert.date}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                {alert.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                {alert.description}
              </p>

              {/* Bottom Row: Tags and View Source */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/50">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-slate-100/90 text-slate-600 text-xs px-2.5 py-1 rounded font-mono border border-slate-200/60 shadow-2xs">
                    {alert.orderNo}
                  </span>
                  <span className="bg-slate-100/90 text-slate-600 text-xs px-2.5 py-1 rounded font-medium border border-slate-200/60 shadow-2xs">
                    {alert.category}
                  </span>
                  {alert.standard && (
                    <span className="bg-slate-200/90 text-slate-800 text-xs px-2.5 py-1 rounded font-semibold border border-slate-300/60 shadow-2xs">
                      {alert.standard}
                    </span>
                  )}
                </div>

                <a
                  href={alert.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors group"
                >
                  <span>View Source</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBSCRIBE MODAL */}
      {subscribeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Subscribe for Push Alerts</h3>
              </div>
              <button 
                onClick={() => setSubscribeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {subscribedSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Subscribed Successfully!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  You will now receive real-time push alerts as soon as new Gazette QCO orders or amendments are published.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe}>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Never miss an Indian Standard amendment or Compulsory Registration Order deadline. Get instant push alerts directly to your inbox or device.
                </p>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email / Notification Address
                  </label>
                  <input
                    type="email"
                    required
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    placeholder="compliance.officer@company.com"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setSubscribeModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={subscribeLoading || !subscribeEmail}
                    className="flex items-center gap-2 px-4 py-2 bg-[#163f73] hover:bg-[#1e4f8f] disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
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

      {/* QUICK AI QUERY MODAL */}
      {aiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Regulatory AI Assistant</h3>
                  <p className="text-[11px] text-slate-400">Grounded in the latest Gazette QCO & BIS Delta Feed</p>
                </div>
              </div>
              <button 
                onClick={() => setAiModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Chips */}
            <div className="py-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Sample Regulatory Questions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Deadlines for EV battery packs?",
                  "Smart wearables CRS requirements?",
                  "Microwave leakage limit changes?"
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAiQuery(chip);
                      handleRunAiQuery(chip);
                    }}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-medium transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Response Area */}
            <div className="flex-1 overflow-y-auto my-2 p-4 bg-slate-50 border border-slate-200 rounded-xl min-h-[140px]">
              {aiLoading ? (
                <div className="flex items-center justify-center h-full gap-2 text-slate-500 text-sm py-8">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span>Analyzing Gazette orders with Gemini...</span>
                </div>
              ) : aiAnswer ? (
                <MarkdownRenderer content={aiAnswer} />
              ) : (
                <div className="text-center text-slate-400 text-xs py-8">
                  Ask any question about newly enacted QCOs, enforcement deadlines, or testing clauses above.
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="pt-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRunAiQuery()}
                  placeholder="Ask about these regulatory amendments..."
                  className="flex-1 text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => handleRunAiQuery()}
                  disabled={aiLoading || !aiQuery.trim()}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#163f73] hover:bg-[#1e4f8f] disabled:opacity-50 text-white shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
