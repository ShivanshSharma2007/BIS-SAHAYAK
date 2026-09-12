"use client";

import { Send, Bot, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIInputHub() {
  return (
    <div className="w-80 border-l border-slate-800 bg-slate-950/80 flex flex-col shrink-0">
      <div className="h-16 border-b border-slate-800 flex items-center px-4 gap-3 bg-slate-900/50">
        <Bot className="w-5 h-5 text-blue-400" />
        <h2 className="font-semibold text-sm text-slate-200">AI Compliance Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Empty state for chat */}
        <div className="text-center mt-12">
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-400">
            Ask me about BIS standards, compliance workflows, or upload a product image.
          </p>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="shrink-0 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-white">
            <Camera className="w-4 h-4" />
          </Button>
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Ask a question..." 
              className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 pl-3 pr-10 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-7 w-7 text-blue-400 hover:text-blue-300 hover:bg-transparent">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
