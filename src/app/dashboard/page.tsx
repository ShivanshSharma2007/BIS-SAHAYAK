"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppStore } from "@/store/useAppStore";
import Dashboard from "@/components/Dashboard";
import LabFinderUI from "@/components/LabFinderUI";
import SnapScannerUI from "@/components/SnapScannerUI";
import RegulatoryAlerts from "@/components/RegulatoryAlerts";
import AuditorUI from "@/components/AuditorUI";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { activeTab } = useAppStore();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex-1 w-full h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "command-center":
        return <Dashboard />;
      case "regulatory-alerts":
      case "alerts":
        return <RegulatoryAlerts />;
      case "lab-finder":
      case "labs":
        return <LabFinderUI />;
      case "snap-scanner":
      case "scanner":
        return <SnapScannerUI />;
      case "audits":
      case "auditor":
        return <AuditorUI />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-50">
      {renderContent()}
    </div>
  );
}
