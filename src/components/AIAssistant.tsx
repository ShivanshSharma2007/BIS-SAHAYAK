"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Send, Bot, User, X, MessageSquare, Mic, MicOff } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useAppStore } from "@/store/useAppStore";
import { VoiceAssistantManager } from "@/lib/speech";
import { getTranslation } from "@/lib/i18n/translations";

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export default function AIAssistant() {
  const pathname = usePathname();
  const isAssistantOpen = useAppStore((state) => state.isAssistantOpen);
  const setAssistantOpen = useAppStore((state) => state.setAssistantOpen);
  const assistantInitialPrompt = useAppStore((state) => state.assistantInitialPrompt);
  const setAssistantInitialPrompt = useAppStore((state) => state.setAssistantInitialPrompt);
  const language = useAppStore((state) => state.language);

  const t = getTranslation(language);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: t.assistant.welcome
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Update welcome message if user switches language and hasn't started a deep chat yet
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === '1') {
        return [{ id: '1', sender: 'ai', text: t.assistant.welcome }];
      }
      return prev;
    });
  }, [language, t.assistant.welcome]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync with store open state
  useEffect(() => {
    if (isAssistantOpen) {
      setIsOpen(true);
    }
  }, [isAssistantOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setAssistantOpen(false);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const voiceManagerRef = useRef<VoiceAssistantManager | null>(null);

  useEffect(() => {
    voiceManagerRef.current = new VoiceAssistantManager();
    return () => {
      voiceManagerRef.current?.stop();
    };
  }, []);

  const toggleListening = async () => {
    if (isListening) {
      voiceManagerRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!voiceManagerRef.current) {
      voiceManagerRef.current = new VoiceAssistantManager();
    }

    const started = await voiceManagerRef.current.start({
      onStart: () => {
        setIsListening(true);
      },
      onResult: (transcript, isFinal) => {
        setInput(transcript);
        if (isFinal) {
          setIsListening(false);
        }
      },
      onError: (errMessage) => {
        setIsListening(false);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'ai',
          text: `🎙️ **Microphone Notice**: ${errMessage}`
        }]);
      },
      onEnd: () => {
        setIsListening(false);
      }
    }, language);

    if (!started) {
      setIsListening(false);
    }
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    if (isListening && voiceManagerRef.current) {
      voiceManagerRef.current.stop();
      setIsListening(false);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Call AI Backend
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage], language }),
      });


      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text
      }]);
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const isQuota = error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED');
      const friendlyMessage = isQuota
        ? "⚠️ **High Traffic Notice**: Gemini AI is temporarily experiencing high demand. Please try again shortly, or ask directly about **Indian Standards (IS)**, **HUID Gold Hallmarking**, or **GeM Procurement**."
        : (error.message || "I encountered an issue processing your request. Please try again.");

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: friendlyMessage
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // If prompt came from Dashboard or Header
  useEffect(() => {
    if (assistantInitialPrompt) {
      setIsOpen(true);
      setAssistantOpen(true);
      handleSend(assistantInitialPrompt);
      setAssistantInitialPrompt("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assistantInitialPrompt]);

  if (pathname === '/login' || pathname === '/') {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => {
            setIsOpen(true);
            setAssistantOpen(true);
          }}
          className="fixed bottom-6 right-6 p-2 bg-gradient-to-tr from-[#0C254D] via-[#113873] to-blue-600 text-white rounded-full shadow-xl shadow-blue-900/30 hover:shadow-2xl hover:scale-105 transition-all z-50 flex items-center justify-center border-2 border-white/30 group cursor-pointer"
          title="Open BIS Sahayak AI"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 shadow-xs shrink-0 flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="BIS Sahayak" 
              width={40} 
              height={40} 
              className="object-contain w-full h-full"
            />
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-[420px] h-[540px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-slate-200/80 animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0C254D] via-[#113873] to-[#0A2247] p-3.5 flex justify-between items-center text-white shrink-0 shadow-sm border-b border-blue-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 border border-white/20 shadow-xs shrink-0 flex items-center justify-center">
                <img 
                  src="/robot-logo.png" 
                  alt="BIS Sahayak" 
                  className="object-contain w-full h-full"
                  loading="eager"
                />
              </div>

              <div>
                <h3 className="font-extrabold text-sm tracking-wide flex items-center gap-1.5 leading-none">
                  <span>BIS</span>
                  <span className="text-[#FFB347] font-semibold">Sahayak</span>
                  <span className="text-[10px] bg-blue-400/20 text-sky-200 px-1.5 py-0.5 rounded font-mono font-bold">AI</span>
                </h3>
                <p className="text-[11px] text-blue-100/80 flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span> Gemini AI Active
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            <div className="text-center mb-4">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 bg-slate-200/60 px-2.5 py-1 rounded-full">
                Regulatory Intelligence Session
              </span>
            </div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2.5 max-w-[90%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex shrink-0 items-center justify-center mt-1 text-xs shadow-sm ${
                    msg.sender === 'user' ? 'bg-[#D97706] text-white' : 'bg-white border border-slate-200 text-slate-700'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div className={`p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-[#D97706] text-white rounded-tr-sm font-medium' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                  }`}>
                    {msg.sender === 'ai' ? (
                      <MarkdownRenderer content={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2.5 max-w-[85%] flex-row">
                  <div className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-600 flex shrink-0 items-center justify-center mt-1 shadow-sm">
                    <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 rounded-tl-sm flex items-center gap-1.5 shadow-sm h-10">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Listening Overlay Banner */}
          {isListening && (
            <div className="bg-red-50 border-t border-red-200 px-4 py-2 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs font-semibold text-red-700">Listening... Speak now</span>
              </div>
              <button 
                onClick={toggleListening}
                className="text-[11px] font-bold text-red-600 hover:text-red-800 uppercase tracking-wider"
              >
                Stop
              </button>
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Listening to your voice..." : t.assistant.placeholder}
                className={`w-full bg-slate-50 border rounded-full py-2.5 pl-4 pr-20 text-sm focus:outline-none transition-all ${
                  isListening
                    ? "border-red-400 ring-4 ring-red-400/20 bg-red-50/20 placeholder:text-red-400"
                    : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                }`}
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleListening}
                  title={isListening ? "Stop voice listening" : "Click to speak with microphone"}
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-all cursor-pointer ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse shadow-md shadow-red-500/40"
                      : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Send message"
                >
                  <Send className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
