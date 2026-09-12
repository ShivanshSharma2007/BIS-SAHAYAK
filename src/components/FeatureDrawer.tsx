"use client";

import { useAppStore } from "@/store/useAppStore";
import { X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import SnapScannerUI from "./SnapScannerUI";
import FraudRadarUI from "./FraudRadarUI";
import LabFinderUI from "./LabFinderUI";
import StandardsViewerUI from "./StandardsViewerUI";
import ComplianceParserUI from "./ComplianceParserUI";
import NavigatorUI from "./NavigatorUI";
import AuditorUI from "./AuditorUI";
import RegulatoryAlerts from "./RegulatoryAlerts";

export default function FeatureDrawer() {
  const activeDrawer = useAppStore((state) => state.activeDrawer);
  const setActiveDrawer = useAppStore((state) => state.setActiveDrawer);
  const setAssistantOpen = useAppStore((state) => state.setAssistantOpen);
  const setAssistantInitialPrompt = useAppStore((state) => state.setAssistantInitialPrompt);

  const closeDrawer = () => setActiveDrawer(null);

  const getDrawerTitle = () => {
    switch (activeDrawer) {
      case 'scanner': return "Snap-to-Standard Scanner";
      case 'fraud': return "HUID & Fraud Radar";
      case 'labs': return "Geospatial Lab Finder";
      case 'drafts': return "Public Comments";
      case 'pdf': return "Snap-to-Standard — Deep Clause PDF Viewer";
      case 'parser': return "Compliance Parser";
      case 'navigator': return "Certification Scheme Navigator";
      case 'auditor': return "GeM Pre-Bid Compliance Auditor";
      case 'alerts': return "Regulatory Delta Alerts";
      default: return "";
    }
  };

  return (
    <AnimatePresence>
      {activeDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
          
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 right-0 h-full w-full bg-slate-50 border-l border-slate-200 shadow-2xl z-50 flex flex-col ${
              activeDrawer === 'scanner' || activeDrawer === 'labs' || activeDrawer === 'pdf' || activeDrawer === 'drafts' || activeDrawer === 'parser' || activeDrawer === 'auditor' || activeDrawer === 'alerts'
                ? 'max-w-6xl' 
                : 'max-w-md'
            }`}
          >
            {/* Header */}
            <div className="h-14 bg-[#163f73] flex items-center justify-between px-4 shrink-0 text-white">
              <div className="flex items-center gap-4">
                <button onClick={closeDrawer} className="flex items-center gap-1.5 text-blue-200 hover:text-white transition-colors text-sm cursor-pointer">
                  <ArrowLeft className="w-4 h-4" /> Back to Portal
                </button>
                <div className="w-[1px] h-4 bg-[#2c5b9e]"></div>
                <h2 className="text-sm font-semibold tracking-wide">
                  {getDrawerTitle()}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setAssistantInitialPrompt("What are the key deadlines and requirements in the latest Regulatory Delta Alerts feed?");
                    setAssistantOpen(true);
                  }}
                  className="bg-[#1f4a86] border-[#2c5b9e] text-white hover:bg-[#2c5b9e] hover:text-white h-8 rounded px-3 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span className="text-sm leading-none">✨</span> <span className="text-xs">Quick AI Query</span>
                </Button>
                <button 
                  onClick={closeDrawer}
                  className="w-8 h-8 flex items-center justify-center text-blue-200 hover:text-white hover:bg-[#1f4a86] rounded transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto relative bg-white m-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              {activeDrawer === 'scanner' && <SnapScannerUI />}
              {activeDrawer === 'fraud' && <FraudRadarUI />}
              {activeDrawer === 'labs' && <LabFinderUI />}
              {(activeDrawer === 'pdf' || activeDrawer === 'drafts') && <StandardsViewerUI />}
              {activeDrawer === 'parser' && <ComplianceParserUI />}
              {activeDrawer === 'navigator' && <NavigatorUI />}
              {activeDrawer === 'auditor' && <AuditorUI />}
              {activeDrawer === 'alerts' && <RegulatoryAlerts />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
