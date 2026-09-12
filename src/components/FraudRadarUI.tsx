"use client";

import { useState } from "react";
import { ShieldCheck, ShieldAlert, CheckCircle, Search, AlertTriangle, Info, Clock, ArrowRight } from "lucide-react";
import { officialISNumbers } from "../data/bisOfficialList";

type SearchResult = {
  status: "valid" | "invalid" | "huid_valid" | "huid_invalid" | null;
  message: string;
  details?: Record<string, string>;
};

type HistoryItem = {
  query: string;
  timestamp: Date;
  status: SearchResult["status"];
};

export default function FraudRadarUI() {
  const [inputValue, setInputValue] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<SearchResult>({ status: null, message: "" });
  
  // New state for recent searches history
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleVerify = async (queryOverride?: string) => {
    const queryToUse = (queryOverride || inputValue).trim();
    if (!queryToUse) return;

    if (!queryOverride) {
      setInputValue(queryToUse);
    }

    setIsScanning(true);
    setResult({ status: null, message: "" });

    try {
      const res = await fetch("/api/fraud-radar/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryToUse })
      });
      const data = await res.json();

      if (data.success && data.result) {
        const r = data.result;
        const currentResult: SearchResult = {
          status: r.status,
          message: r.message,
          details: r.details
        };
        setResult(currentResult);

        setHistory(prev => {
          const filtered = prev.filter(item => item.query.toUpperCase() !== queryToUse.toUpperCase());
          return [{ query: queryToUse, timestamp: new Date(), status: r.status }, ...filtered].slice(0, 5);
        });
      } else {
        setResult({
          status: "invalid",
          message: data.error || `Unable to verify ${queryToUse} against BIS registry.`
        });
      }
    } catch (err: any) {
      setResult({
        status: "invalid",
        message: err.message || "Network error communicating with BIS verification ledger."
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            HUID & Fraud Radar
          </h2>
          <p className="text-xs text-slate-500">Live verification against official BIS registry</p>
        </div>
      </div>

      <div className="p-6">
        {/* Search Input */}
        <div className="relative border-2 border-indigo-100 bg-white shadow-sm rounded-xl flex items-center mb-6 overflow-hidden focus-within:border-indigo-400 transition-colors">
          <div className="pl-4 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            className="w-full h-14 pl-3 pr-28 bg-transparent border-none text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 text-base font-medium"
            placeholder="Enter HUID or IS Number (e.g. IS 12330)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
          />
          <div className="absolute right-1.5">
            <button 
              onClick={() => handleVerify()}
              disabled={isScanning || !inputValue.trim()}
              className="h-11 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scanning</span>
                </>
              ) : "Verify"}
            </button>
          </div>
        </div>

        {/* History Section - Only show when no result is currently displayed and we have history */}
        {!result.status && !isScanning && history.length > 0 && (
          <div className="mb-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-600">Recent Verifications</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {history.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    setInputValue(item.query);
                    handleVerify(item.query);
                  }}
                  className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      (item.status === 'valid' || item.status === 'huid_valid') ? 'bg-emerald-500' : 'bg-rose-500'
                    }`} />
                    <span className="font-medium text-slate-700">{item.query}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="text-xs">{item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Helper text if no result yet and no history */}
        {!result.status && !isScanning && history.length === 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              Enter an IS Number (like <strong>IS 12330</strong>) to check if it belongs to the official mandatory certification list. Or enter a 6-digit alphanumeric code for HUID check.
            </p>
          </div>
        )}

        {/* Results */}
        {result.status && (
          <div className={`p-6 rounded-xl border-2 animate-in slide-in-from-bottom-2 fade-in duration-300 ${
            (result.status === 'valid' || result.status === 'huid_valid') 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-rose-50 border-rose-200'
          }`}>
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                (result.status === 'valid' || result.status === 'huid_valid') ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
              }`}>
                {(result.status === 'valid' || result.status === 'huid_valid') ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <ShieldAlert className="w-6 h-6" />
                )}
              </div>
              
              <div className="pt-1">
                <h3 className={`text-lg font-bold ${
                  (result.status === 'valid' || result.status === 'huid_valid') ? 'text-emerald-800' : 'text-rose-800'
                }`}>
                  {(result.status === 'valid' || result.status === 'huid_valid') ? 'Verification Successful' : 'Verification Failed'}
                </h3>
                <p className={`text-sm mt-1 ${
                  (result.status === 'valid' || result.status === 'huid_valid') ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {result.message}
                </p>
              </div>
            </div>

            {/* Details Table */}
            {result.details && (
              <div className="mt-6 bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(result.details).map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                        <td className="py-3 px-4 font-medium text-slate-500 border-b border-slate-100 w-1/3">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800 border-b border-slate-100">
                          {value as React.ReactNode}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {(result.status === 'invalid' || result.status === 'huid_invalid') && (
              <div className="mt-4 bg-white/60 p-4 rounded-lg flex items-center gap-3 border border-rose-100">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-xs text-slate-600 font-medium">
                  We recommend against purchasing this product. Please report the counterfeit seller to the BIS care desk.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
