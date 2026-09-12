"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CentralSearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full max-w-2xl mx-auto relative group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
        <Search className="h-5 w-5" />
      </div>
      <input
        type="text"
        className="w-full h-14 pl-12 pr-24 bg-slate-900 border border-slate-700 rounded-full text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
        placeholder="Search IS standards, HUID, or compliance docs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="absolute inset-y-2 right-2">
        <Button className="rounded-full bg-blue-600 hover:bg-blue-500 text-white px-6">
          Search
        </Button>
      </div>
    </div>
  );
}
