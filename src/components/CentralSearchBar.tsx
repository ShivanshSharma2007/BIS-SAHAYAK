"use client";

import { Search, Sparkles, Loader2, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CentralSearchBar() {
  const [query, setQuery] = useState("");
  const [isSemantic, setIsSemantic] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setShowResults(false);
    
    // Simulate network delay and embedding generation
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative group flex flex-col gap-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors z-10">
          <Search className="h-5 w-5" />
        </div>
        
        <input
          type="text"
          className="w-full h-16 pl-12 pr-32 bg-white/90 backdrop-blur-md border-2 border-slate-200/50 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-lg text-lg"
          placeholder="Search IS standards, HUID, or compliance docs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        
        <div className="absolute inset-y-2 right-2 flex items-center gap-2">
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
            className="h-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 font-semibold shadow-md transition-all disabled:opacity-70"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <label className="flex items-center gap-2 cursor-pointer group/toggle">
          <div className="relative flex items-center">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={isSemantic}
              onChange={() => setIsSemantic(!isSemantic)}
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${isSemantic ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isSemantic ? 'transform translate-x-4' : ''}`}></div>
          </div>
          <span className="text-sm font-medium text-slate-600 group-hover/toggle:text-slate-900 transition-colors flex items-center gap-1.5">
            <Sparkles className={`w-4 h-4 ${isSemantic ? 'text-indigo-500' : 'text-slate-400'}`} />
            Gemini Semantic Search & Embeddings
          </span>
        </label>
        
        {isSearching && isSemantic && (
          <span className="text-xs font-semibold text-indigo-600 animate-pulse flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            Generating Vector Embeddings...
          </span>
        )}
      </div>

      {/* Mock Results UI */}
      {showResults && (
        <div className="absolute top-full left-0 w-full mt-4 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in slide-in-from-top-4 fade-in duration-300 text-left">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-800">
              {isSemantic ? "Semantic Matches" : "Keyword Matches"}
            </h4>
            {isSemantic && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Contextually Relevant
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {isSemantic ? `IS Standard Document (Semantic Match ${i})` : `Standard Document ${i}`}
                    </h5>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {isSemantic 
                        ? "This document was retrieved based on the semantic meaning of your query using vector embeddings, ensuring highly relevant conceptual matches even if exact keywords differ."
                        : "This document contains exact keyword matches for your search query."}
                    </p>
                    {isSemantic && (
                      <div className="mt-2 flex gap-2">
                         <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                           Similarity Score: {0.99 - (i * 0.04)}
                         </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
