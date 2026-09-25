import { NextRequest, NextResponse } from "next/server";
import { REGULATORY_ALERTS } from "@/data/regulatoryAlertsData";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  category: "REGULATORY" | "AUDIT" | "LABS" | "SYSTEM";
  severity: "CRITICAL" | "UPDATE" | "INFO";
  timestamp: string;
  read: boolean;
  actionDrawer?: string;
  actionTab?: string;
  referenceCode?: string;
}

// In-memory notification store with persistent real-world seed data
let notificationsStore: SystemNotification[] = [
  {
    id: "NOTIF-001",
    title: "CRS Phase IV Expansion Gazetted",
    message: "Ministry of Electronics & IT (MeitY) has mandated IS 16046 (Part 2) for smart wearables and IoT equipment.",
    category: "REGULATORY",
    severity: "CRITICAL",
    timestamp: "Aug 28",
    read: false,
    actionDrawer: "alerts",
    referenceCode: "CG-DL-E-280826"
  },
  {
    id: "NOTIF-002",
    title: "GeM Pre-Bid Audit Qualified",
    message: "Tender GEM/2026/B/894120 successfully verified against IS 1293:2019 standards with AAA risk tier.",
    category: "AUDIT",
    severity: "UPDATE",
    timestamp: "1 hour ago",
    read: false,
    actionDrawer: "auditor",
    referenceCode: "GEM/2026/B/894120"
  },
  {
    id: "NOTIF-003",
    title: "NABL Laboratory Scope Expanded",
    message: "ERTL (North) Delhi has added high-voltage spark testing capacity for IS 15885 LED controlgear.",
    category: "LABS",
    severity: "INFO",
    timestamp: "3 hours ago",
    read: false,
    actionDrawer: "labs",
    referenceCode: "NABL-TC-5021"
  },
  {
    id: "NOTIF-004",
    title: "Gold HUID Real-Time Sync Active",
    message: "Central BIS Hallmarking repository synced 42,800 new laser-inscribed HUID tokens.",
    category: "SYSTEM",
    severity: "INFO",
    timestamp: "Yesterday",
    read: true,
    actionDrawer: "fraud",
    referenceCode: "HUID-SYNC-2026"
  }
];

export async function GET() {
  try {
    const unreadCount = notificationsStore.filter(n => !n.read).length;
    return NextResponse.json({
      success: true,
      unreadCount,
      notifications: notificationsStore
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, id } = await req.json();

    if (action === "MARK_ALL_READ") {
      notificationsStore = notificationsStore.map(n => ({ ...n, read: true }));
      return NextResponse.json({ success: true, message: "All notifications marked as read", unreadCount: 0 });
    }

    if (action === "MARK_READ" && id) {
      notificationsStore = notificationsStore.map(n => n.id === id ? { ...n, read: true } : n);
      const unreadCount = notificationsStore.filter(n => !n.read).length;
      return NextResponse.json({ success: true, message: "Notification marked as read", unreadCount });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process notification update" },
      { status: 500 }
    );
  }
}
