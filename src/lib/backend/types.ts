// Authoritative Backend Data Types for BIS SAHAYAK (SmartAssist)

export interface StandardClause {
  id: string;
  clauseNumber: string;
  title: string;
  description: string;
  isMandatory: boolean;
  testMethod?: string;
  acceptableLimit?: string;
}

export interface StandardItem {
  id: string;
  standardNumber: string; // e.g. "IS 1293:2019"
  title: string;
  description: string;
  productCategory: string;
  isMandatory: boolean;
  schemeType: "Scheme-I (ISI Mark)" | "CRS (Compulsory Registration)" | "FMCS" | "Hallmarking";
  status: "Active" | "Draft" | "Under Revision" | "Withdrawn";
  pdfUrl?: string;
  clauses?: StandardClause[];
  keywords: string[];
  lastUpdated: string;
}

export interface DraftComment {
  id: string;
  standardId: string;
  userId: string;
  userName: string;
  organization?: string;
  comment: string;
  section: string;
  createdAt: string;
}

export interface TestBooking {
  id: string;
  ticketNumber: string; // e.g. "TR-2026-8910"
  applicantName: string;
  companyName: string;
  email: string;
  phone: string;
  productName: string;
  standardNumber: string;
  urgency: "standard" | "express";
  labId: string;
  labName: string;
  status: "Pending Review" | "Sample Dispatched" | "In-Testing" | "Report Generated";
  estimatedCost: string;
  leadTime: string;
  createdAt: string;
}

export interface FraudCheckQuery {
  query: string;
  queryType: "huid" | "license" | "standard";
}

export interface FraudVerificationResult {
  query: string;
  queryType: "huid" | "license" | "standard";
  status: "valid" | "invalid" | "huid_valid" | "huid_invalid" | "counterfeit_risk";
  verdict: "GENUINE_COMPLIANT" | "SUSPICIOUS_RISK" | "CONFIRMED_COUNTERFEIT";
  riskScore: number; // 0 (genuine) to 100 (high risk)
  message: string;
  details?: Record<string, any>;
  recommendations: string[];
  verifiedAt: string;
}

export interface GeMAuditHistoryItem {
  id: string;
  tenderId: string;
  bidNumber: string;
  tenderTitle: string;
  buyerName: string;
  vendorName: string;
  gstin: string;
  bisLicense: string;
  localContent: number;
  isMSME: boolean;
  status: "QUALIFIED" | "DISQUALIFIED";
  riskScore: number;
  evaluatedClausesCount: number;
  clausesPassedCount: number;
  summary: string;
  timestamp: string;
}

export interface NavigatorAssessmentInput {
  category: string;
  manufacturingLocation: "India" | "Imported";
  targetAudience: "B2C" | "B2B";
  existingCertifications: boolean;
}

export interface NavigatorAssessmentResult {
  schemeName: string;
  schemeCode: string;
  summary: string;
  isMandatoryUnderQCO: boolean;
  estimatedGovFee: string;
  estimatedLabTestingFee: string;
  estimatedTimeline: string;
  applicableStandards: string[];
  requiredDocuments: string[];
  roadmapSteps: { step: number; title: string; description: string }[];
}

/* ====================================================================== */
/* Extended Navigator V2 Types                                             */
/* ====================================================================== */

export interface NavigatorAssessmentInputV2 {
  category: string;            // Key from PRODUCT_CATEGORIES (e.g. "electronics_it")
  subCategory: string;         // Selected sub-category label
  manufacturingLocation: "India" | "Imported" | "Both";
  targetAudience: "B2C" | "B2B" | "Government";
  businessScale: "Micro" | "Small" | "Medium" | "Large";
  existingCertifications: string[]; // ["ISO 9001", "CE", "FCC", "UL", "None"]
}

export interface FeeBreakdownItem {
  item: string;
  amount: string;
  note?: string;
}

export interface SchemeRoadmapStep {
  step: number;
  title: string;
  description: string;
  estimatedDays?: string;
  portalUrl?: string;
}

export interface QCOReference {
  qcoNumber: string;
  title: string;
  gazetteDate: string;
  ministry: string;
  standardsCovered: string[];
  penaltySections: string[];
}

export interface NavigatorAssessmentResultV2 {
  schemeName: string;
  schemeCode: string;
  schemeVariant: string;
  summary: string;
  isMandatoryUnderQCO: boolean;
  estimatedGovFee: string;
  estimatedLabTestingFee: string;
  estimatedTimeline: string;
  applicableStandards: string[];
  requiredDocuments: string[];
  roadmapSteps: SchemeRoadmapStep[];
  feeBreakdown: FeeBreakdownItem[];
  applicableQCOs: QCOReference[];
  penaltyWarnings: { section: string; warning: string; penalty: string }[];
  officialPortalUrl: string;
  officialHelpline: string;
  msmeEligible: boolean;
}

export interface DashboardStats {
  standardsCount: number;
  activeLabsCount: number;
  compliancePassRate: number; // percentage e.g. 94.2
  pendingQCOAlertsCount: number;
  totalAuditRuns: number;
  totalTestBookings: number;
  systemHealth: "Operational" | "Degraded";
  lastSyncTime: string;
  complianceData?: { month: string; passed: number; failed: number }[];
  sectorData?: { name: string; count: number; color: string }[];
  recentAlerts?: any[];
}
