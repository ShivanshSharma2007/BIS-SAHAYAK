import { create } from 'zustand';

interface AppState {
  messages: unknown[];
  selectedStandardId: string | null;
  highlightedClauseId: string | null;
  activeDrawer: string | null;
  activeTab: string;
  isAssistantOpen: boolean;
  assistantInitialPrompt: string;
  toasts: unknown[];
  language: string;
  setMessages: (messages: unknown[]) => void;
  setSelectedStandardId: (id: string | null) => void;
  setHighlightedClauseId: (id: string | null) => void;
  setActiveDrawer: (drawer: string | null) => void;
  setActiveTab: (tab: string) => void;
  setAssistantOpen: (open: boolean) => void;
  setAssistantInitialPrompt: (prompt: string) => void;
  setToasts: (toasts: unknown[]) => void;
  setLanguage: (lang: string) => void;
}

const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('bis_sahayak_lang');
      if (stored) return stored;
    } catch (_) {}
  }
  return 'en';
};

export const useAppStore = create<AppState>((set) => ({
  messages: [],
  selectedStandardId: null,
  highlightedClauseId: null,
  activeDrawer: null,
  activeTab: 'command-center',
  isAssistantOpen: false,
  assistantInitialPrompt: '',
  toasts: [],
  language: getInitialLanguage(),
  setMessages: (messages) => set({ messages }),
  setSelectedStandardId: (id) => set({ selectedStandardId: id }),
  setHighlightedClauseId: (id) => set({ highlightedClauseId: id }),
  setActiveDrawer: (drawer) => set({ activeDrawer: drawer }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setAssistantOpen: (open) => set({ isAssistantOpen: open }),
  setAssistantInitialPrompt: (prompt) => set({ assistantInitialPrompt: prompt }),
  setToasts: (toasts) => set({ toasts }),
  setLanguage: (lang) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('bis_sahayak_lang', lang);
      } catch (_) {}
    }
    set({ language: lang });
  },
}));

