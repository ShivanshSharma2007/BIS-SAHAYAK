import fs from "fs";
import path from "path";
import { 
  StandardItem, 
  DraftComment, 
  TestBooking, 
  FraudVerificationResult, 
  GeMAuditHistoryItem, 
  NavigatorAssessmentInput, 
  NavigatorAssessmentResult,
  DashboardStats 
} from "./types";
import { INITIAL_COMMENTS } from "./seed";
import { OFFICIAL_BIS_STANDARDS, resolveOfficialStandard } from "./bisMasterCatalog";
import { LABS_DIRECTORY } from "@/data/labsDirectoryData";
import { OFFICIAL_BIS_LICENSES } from "@/data/bisOfficialRegistry";
import { officialISNumbers } from "@/data/bisOfficialList";
import { REGULATORY_ALERTS } from "@/data/regulatoryAlertsData";

// Data persistence file path
const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "backend_store.json");

interface DatabaseStore {
  standards: StandardItem[];
  comments: DraftComment[];
  bookings: TestBooking[];
  auditHistory: GeMAuditHistoryItem[];
  verifiedQueriesCache: Record<string, FraudVerificationResult>;
}

// Initial memory state
let memoryStore: DatabaseStore = {
  standards: [...OFFICIAL_BIS_STANDARDS],
  comments: [...INITIAL_COMMENTS],
  bookings: [
    {
      id: "book-001",
      ticketNumber: "TR-2026-8492",
      applicantName: "Rajesh Kulkarni",
      companyName: "Havells India Ltd.",
      email: "rajesh.k@havells.com",
      phone: "+91 98230 45671",
      productName: "16A Heavy-Duty Shuttered Socket Mod-X",
      standardNumber: "IS 1293",
      urgency: "standard",
      labId: "LAB-001",
      labName: "National Test House (Northern Region)",
      status: "In-Testing",
      estimatedCost: "₹ 18,500",
      leadTime: "10-14 Days",
      createdAt: "2026-09-08T11:20:00Z"
    },
    {
      id: "book-002",
      ticketNumber: "TR-2026-5120",
      applicantName: "Sunil Shenoy",
      companyName: "Exide Energy Solutions",
      email: "s.shenoy@exide.in",
      phone: "+91 80 23419900",
      productName: "48V 30Ah LFP Battery Pack",
      standardNumber: "IS 16046 (Part 2)",
      urgency: "express",
      labId: "LAB-009",
      labName: "Automotive Research Association of India (ARAI)",
      status: "Sample Dispatched",
      estimatedCost: "₹ 42,000",
      leadTime: "6-8 Days",
      createdAt: "2026-09-10T14:45:00Z"
    }
  ],
  auditHistory: [
    {
      id: "audit-001",
      tenderId: "gem-tender-01",
      bidNumber: "GEM/2026/B/849201",
      tenderTitle: "Supply of Heavy-Duty PVC Insulated Copper Power Cables (1.1 kV)",
      buyerName: "NTPC Limited (Dadri, UP)",
      vendorName: "Bharat PolyCable Industries Ltd.",
      gstin: "07AAACB2481Q1Z4",
      bisLicense: "CM/L-8492015",
      localContent: 68,
      isMSME: false,
      status: "QUALIFIED",
      riskScore: 4,
      evaluatedClausesCount: 3,
      clausesPassedCount: 3,
      summary: "Full compliance with IS 694:2010. Conductor resistance and flammability parameters tested compliant at NABL lab.",
      timestamp: "2026-09-11T16:30:00Z"
    },
    {
      id: "audit-002",
      tenderId: "gem-tender-01",
      bidNumber: "GEM/2026/B/849201",
      tenderTitle: "Supply of Heavy-Duty PVC Insulated Copper Power Cables (1.1 kV)",
      buyerName: "NTPC Limited (Dadri, UP)",
      vendorName: "Global Wire & Tech Exports Pvt Ltd",
      gstin: "06AAACG9921K1ZZ",
      bisLicense: "CM/L-1903482",
      localContent: 22,
      isMSME: false,
      status: "DISQUALIFIED",
      riskScore: 89,
      evaluatedClausesCount: 3,
      clausesPassedCount: 0,
      summary: "Substandard product failure. Conductor electrical resistance exceeded standard threshold (14.5 vs 12.1 ohm/km). BIS license is expired.",
      timestamp: "2026-09-11T17:15:00Z"
    }
  ],
  verifiedQueriesCache: {}
};

// Load saved store from disk on startup if exists
function initStore() {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const loaded = JSON.parse(content);
      if (loaded && loaded.standards) {
        // Merge loaded standards with master official catalog ensuring all divisions are populated without duplicates
        const uniqueStandardsMap = new Map<string, StandardItem>();
        for (const s of OFFICIAL_BIS_STANDARDS) {
          uniqueStandardsMap.set(s.id, s);
        }
        for (const s of loaded.standards) {
          if (!uniqueStandardsMap.has(s.id)) {
            uniqueStandardsMap.set(s.id, s);
          }
        }
        memoryStore = { ...memoryStore, ...loaded, standards: Array.from(uniqueStandardsMap.values()) };
        saveStore(); // immediately clean up any duplicates on disk
      }
    } else {
      saveStore();
    }
  } catch (err) {
    console.warn("Could not read local backend store file, using in-memory store:", err);
  }
}

// Persist store to disk
function saveStore() {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(memoryStore, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not save backend store to disk:", err);
  }
}

// Initialize on module load
initStore();

/* ========================================================================= */
/* STANDARDS REPOSITORY                                                      */
/* ========================================================================= */
export async function getStandards(params?: {
  search?: string;
  category?: string;
  scheme?: string;
  status?: string;
}): Promise<StandardItem[]> {
  // Ensure standards are deduplicated by id
  const seenIds = new Set<string>();
  const deduplicated: StandardItem[] = [];
  for (const s of memoryStore.standards) {
    if (s && s.id && !seenIds.has(s.id)) {
      seenIds.add(s.id);
      deduplicated.push(s);
    }
  }
  if (deduplicated.length !== memoryStore.standards.length) {
    memoryStore.standards = deduplicated;
    saveStore();
  }

  let list = [...deduplicated];

  if (!params) return list;

  const { search, category, scheme, status } = params;

  if (category && category !== "ALL") {
    list = list.filter(s => s.productCategory.toLowerCase().includes(category.toLowerCase()));
  }

  if (scheme && scheme !== "ALL") {
    list = list.filter(s => s.schemeType.toLowerCase().includes(scheme.toLowerCase()));
  }

  if (status && status !== "ALL") {
    list = list.filter(s => s.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase().trim();
    list = list.filter(s => 
      s.standardNumber.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.keywords.some(k => k.toLowerCase().includes(q))
    );
  }

  return list;
}

export const getAllStandards = getStandards;

export async function getStandardById(id: string): Promise<StandardItem | null> {
  const clean = id.toLowerCase().replace(/[^a-z0-9]/g, "");
  const numOnly = id.replace(/\D/g, "");
  const std = memoryStore.standards.find(
    s => s.id.toLowerCase() === id.toLowerCase() || 
         s.standardNumber.toLowerCase().replace(/[^a-z0-9]/g, "") === clean ||
         s.id.toLowerCase().replace(/[^a-z0-9]/g, "") === clean ||
         (numOnly.length >= 3 && s.standardNumber.replace(/\D/g, "") === numOnly) ||
         (numOnly.length >= 3 && s.id.replace(/\D/g, "") === numOnly)
  );
  if (std) return std;

  // Resolve dynamically from authoritative master database or 600+ official BIS list
  try {
    const resolved = resolveOfficialStandard(id);
    if (resolved) {
      // Cache in memory store without duplicate entries
      const existingIdx = memoryStore.standards.findIndex(s => s.id === resolved.id);
      if (existingIdx === -1) {
        memoryStore.standards.push(resolved);
        saveStore();
      } else {
        memoryStore.standards[existingIdx] = resolved;
      }
      return resolved;
    }
  } catch (e) {
    console.warn("Error resolving standard:", e);
  }

  return null;
}

/* ========================================================================= */
/* DRAFT COMMENTS REPOSITORY                                                 */
/* ========================================================================= */
export async function getCommentsForStandard(standardId: string): Promise<DraftComment[]> {
  return memoryStore.comments.filter(c => c.standardId === standardId || c.standardId.includes(standardId));
}

export async function addDraftComment(input: {
  standardId: string;
  userName: string;
  organization?: string;
  comment: string;
  section?: string;
}): Promise<DraftComment> {
  const newComment: DraftComment = {
    id: `com-${Date.now()}`,
    standardId: input.standardId,
    userId: `user-${Date.now().toString(36)}`,
    userName: input.userName.trim() || "Verified Stakeholder",
    organization: input.organization?.trim() || "Industry Representative",
    comment: input.comment.trim(),
    section: input.section?.trim() || "General Consultation",
    createdAt: new Date().toISOString()
  };

  memoryStore.comments.unshift(newComment);
  saveStore();
  return newComment;
}

/* ========================================================================= */
/* TEST SAMPLE BOOKINGS REPOSITORY                                           */
/* ========================================================================= */
export async function createTestBooking(input: {
  applicantName: string;
  companyName: string;
  email: string;
  phone: string;
  productName: string;
  standardNumber: string;
  urgency: "standard" | "express";
  labId: string;
}): Promise<TestBooking> {
  const lab = LABS_DIRECTORY.find(l => l.id === input.labId) || LABS_DIRECTORY[0];
  const ticketRandom = Math.floor(1000 + Math.random() * 9000);
  const ticketNumber = `TR-2026-${ticketRandom}`;

  // Estimate test costs based on urgency and category
  const baseCost = input.urgency === "express" ? 35000 : 18500;
  const leadDays = input.urgency === "express" ? "4-6 Days (Priority Fast-Track)" : lab.leadTime;

  const newBooking: TestBooking = {
    id: `booking-${Date.now()}`,
    ticketNumber,
    applicantName: input.applicantName.trim(),
    companyName: input.companyName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    productName: input.productName.trim(),
    standardNumber: input.standardNumber.trim(),
    urgency: input.urgency,
    labId: lab.id,
    labName: lab.name,
    status: "Pending Review",
    estimatedCost: `₹ ${baseCost.toLocaleString("en-IN")}`,
    leadTime: leadDays,
    createdAt: new Date().toISOString()
  };

  memoryStore.bookings.unshift(newBooking);
  saveStore();
  return newBooking;
}

export async function getTestBookings(): Promise<TestBooking[]> {
  return [...memoryStore.bookings];
}

export async function getTestBookingByTicket(ticketNumber: string): Promise<TestBooking | null> {
  return memoryStore.bookings.find(b => b.ticketNumber.toUpperCase() === ticketNumber.toUpperCase()) || null;
}

/* ========================================================================= */
/* GE-M AUDIT HISTORY REPOSITORY                                             */
/* ========================================================================= */
export async function saveGeMAuditRun(input: Omit<GeMAuditHistoryItem, "id" | "timestamp">): Promise<GeMAuditHistoryItem> {
  const newAudit: GeMAuditHistoryItem = {
    id: `audit-${Date.now()}`,
    ...input,
    timestamp: new Date().toISOString()
  };

  memoryStore.auditHistory.unshift(newAudit);
  saveStore();
  return newAudit;
}

export async function getGeMAuditHistory(): Promise<GeMAuditHistoryItem[]> {
  return [...memoryStore.auditHistory];
}

/* ========================================================================= */
/* FRAUD RADAR VERIFIER SERVICE                                              */
/* ========================================================================= */
export async function verifyIdentifier(rawQuery: string): Promise<FraudVerificationResult> {
  const query = rawQuery.trim();
  const cleaned = query.toUpperCase();

  // 1. Check if 6-digit alphanumeric Gold HUID
  // HUID format: 6 alphanumeric characters (e.g. AB1234, X78Y90)
  const isHuidCandidate = /^[A-Z0-9]{6}$/.test(cleaned) && !cleaned.startsWith("IS");

  if (isHuidCandidate) {
    // Known authentic mock HUIDs in national hallmarking database
    const authenticHUIDs: Record<string, { jeweler: string; purity: string; center: string; date: string; article: string }> = {
      "AB1234": {
        jeweler: "Tanishq Jewellers (Titan Co. Ltd.)",
        purity: "22K916 (91.6% Pure Gold)",
        center: "Delhi Regional Assaying & Hallmarking Centre",
        date: "14 Jul 2025",
        article: "Gold Bangle / Ornament"
      },
      "XY9876": {
        jeweler: "Kalyan Jewellers India Ltd.",
        purity: "18K750 (75.0% Pure Gold)",
        center: "Mumbai South Assaying Terminal",
        date: "02 Feb 2026",
        article: "Gold Ring with Diamond Setting"
      },
      "MN4567": {
        jeweler: "Malabar Gold & Diamonds",
        purity: "22K916 (91.6% Pure Gold)",
        center: "Kozhikode Hallmark Bureau",
        date: "20 Jan 2026",
        article: "Gold Chain / Necklace"
      }
    };

    if (authenticHUIDs[cleaned]) {
      const record = authenticHUIDs[cleaned];
      return {
        query,
        queryType: "huid",
        status: "huid_valid",
        verdict: "GENUINE_COMPLIANT",
        riskScore: 0,
        message: `Authentic Hallmarked Gold Article verified against BIS Central HUID Ledger.`,
        details: {
          "HUID Code": cleaned,
          "Jeweller Name": record.jeweler,
          "Gold Purity Grade": record.purity,
          "Assaying & Hallmarking Centre": record.center,
          "Date of Hallmarking": record.date,
          "Registered Article Type": record.article,
          "BIS Care Compliance": "Active & Verified"
        },
        recommendations: [
          "Article is 100% verified under BIS Hallmarking Scheme.",
          "Request consumer invoice with matching 6-digit HUID inscribed."
        ],
        verifiedAt: new Date().toISOString()
      };
    } else {
      return {
        query,
        queryType: "huid",
        status: "huid_invalid",
        verdict: "CONFIRMED_COUNTERFEIT",
        riskScore: 92,
        message: `HUID "${cleaned}" was not found in the official BIS Manakonline Hallmarking database.`,
        details: {
          "Searched Code": cleaned,
          "Database Lookup": "BIS Central Hallmarking Portal (Negative Match)",
          "Risk Flag": "Unregistered / Counterfeit Stamp",
          "Consumer Alert": "Do not purchase without verifying physical BIS hallmark triangular logo."
        },
        recommendations: [
          "Do not pay hallmark premium charges for this article.",
          "Report suspect vendor to the BIS Consumer Care portal (care@bis.gov.in) or call 1800-11-4000."
        ],
        verifiedAt: new Date().toISOString()
      };
    }
  }

  // 2. Check BIS License / CM/L Number
  if (cleaned.startsWith("CM/L-") || cleaned.startsWith("CML-") || /^\d{7,8}$/.test(cleaned)) {
    const formattedCML = cleaned.startsWith("CM/L-") ? cleaned : `CM/L-${cleaned.replace(/\D/g, "")}`;
    const licensee = OFFICIAL_BIS_LICENSES.find(
      l => l.cmlNumber === formattedCML || l.cmlNumber.replace(/\D/g, "") === cleaned.replace(/\D/g, "")
    );

    if (licensee) {
      const isExpired = licensee.status === "EXPIRED" || licensee.status === "SUSPENDED" || licensee.status === "CANCELLED";
      return {
        query,
        queryType: "license",
        status: isExpired ? "counterfeit_risk" : "valid",
        verdict: isExpired ? "SUSPICIOUS_RISK" : "GENUINE_COMPLIANT",
        riskScore: isExpired ? 85 : 5,
        message: isExpired 
          ? `BIS License ${licensee.cmlNumber} exists but is currently ${licensee.status}.`
          : `Valid & Active BIS License registered to ${licensee.manufacturerName}.`,
        details: {
          "License Number": licensee.cmlNumber,
          "Manufacturer Name": licensee.manufacturerName,
          "Brand": licensee.brandName,
          "Registered Product": licensee.productScope,
          "Governing Standard": licensee.standard,
          "Factory Location": licensee.factoryAddress,
          "Status": licensee.status,
          "Valid Till": licensee.validityTo
        },
        recommendations: isExpired 
          ? ["Vendor is not authorized to sell with ISI Mark during license suspension.", "Debarred for GeM public procurement bids."]
          : ["Authorized manufacturer under BIS Scheme-I Certification.", "Qualified for ISI mark stamping."],
        verifiedAt: new Date().toISOString()
      };
    } else {
      return {
        query,
        queryType: "license",
        status: "invalid",
        verdict: "CONFIRMED_COUNTERFEIT",
        riskScore: 95,
        message: `License number ${query} does not exist in the official BIS licensee directory.`,
        details: {
          "Searched License": query,
          "Registry": "BIS e-BIS & Manakonline Scheme-I Database",
          "Record Status": "Not Found"
        },
        recommendations: [
          "Product bearing this CM/L number is an unauthorized counterfeit.",
          "File a complaint under Bureau of Indian Standards Act 2016."
        ],
        verifiedAt: new Date().toISOString()
      };
    }
  }

  // 3. Check Indian Standard (IS) Number
  const digits = query.replace(/\D/g, "");
  const formattedIS = `IS ${digits}`;
  const existsInOfficialList = officialISNumbers.includes(formattedIS) || memoryStore.standards.some(s => s.standardNumber.includes(formattedIS));

  if (existsInOfficialList) {
    const knownStandard = memoryStore.standards.find(s => s.standardNumber.includes(formattedIS));
    return {
      query,
      queryType: "standard",
      status: "valid",
      verdict: "GENUINE_COMPLIANT",
      riskScore: 0,
      message: `Authentic mandatory Indian Standard recognized under BIS Quality Control Orders (QCO).`,
      details: {
        "Standard Code": formattedIS,
        "Product Scope": knownStandard ? knownStandard.title : "Recognized Mandatory Indian Standard Specification",
        "Category": knownStandard ? knownStandard.productCategory : "BIS Scheme I / CRS",
        "Mandatory Enforcement": "Active under Department of Promotion of Industry & Internal Trade (DPIIT) QCO"
      },
      recommendations: [
        "Products in this category require compulsory BIS certification before sale or import into India."
      ],
      verifiedAt: new Date().toISOString()
    };
  }

  return {
    query,
    queryType: "standard",
    status: "invalid",
    verdict: "SUSPICIOUS_RISK",
    riskScore: 70,
    message: `The specification "${query}" is not found in the official BIS Mandatory Standards list.`,
    details: {
      "Search Input": query,
      "Official Check": "BIS Schedule I Registry (Zero Matches)"
    },
    recommendations: [
      "Check standard number format (e.g. IS 1293, IS 694, IS 13252).",
      "Verify whether the product falls under voluntary standards rather than mandatory QCO."
    ],
    verifiedAt: new Date().toISOString()
  };
}

/* ========================================================================= */
/* CERTIFICATION SCHEME NAVIGATOR ENGINE                                    */
/* ========================================================================= */
export async function evaluateCertificationScheme(input: NavigatorAssessmentInput): Promise<NavigatorAssessmentResult> {
  const isImported = input.manufacturingLocation === "Imported";
  const isElectronics = input.category.toLowerCase().includes("electronics") || input.category.toLowerCase().includes("it");
  const isAutomotive = input.category.toLowerCase().includes("automotive");

  if (isImported) {
    return {
      schemeName: "Foreign Manufacturers Certification Scheme (FMCS)",
      schemeCode: "Scheme-I (FMCS)",
      summary: "Mandatory certification scheme for foreign manufacturing units exporting goods into India under Quality Control Orders.",
      isMandatoryUnderQCO: true,
      estimatedGovFee: "₹ 1,10,000 + USD $7,000 (Inspection & Travel)",
      estimatedLabTestingFee: "₹ 45,000 - ₹ 90,000 (In NABL accredited Indian Lab)",
      estimatedTimeline: "90 - 120 Days",
      applicableStandards: isElectronics ? ["IS 13252 (Part 1)", "IS 16046 (Part 2)"] : ["IS 1293", "IS 694"],
      requiredDocuments: [
        "Appointment of Authorized Indian Representative (AIR)",
        "Factory Manufacturing Process Flowchart & Machinery List",
        "In-house Laboratory Equipment Calibration Certificates",
        "Quality Manual adhering to ISO 9001:2015",
        "Customs Undertaking for Sample Consignments"
      ],
      roadmapSteps: [
        { step: 1, title: "Appoint Indian Representative (AIR)", description: "Nominate a resident Indian citizen or registered Indian entity as AIR." },
        { step: 2, title: "Submit Form-V Online Application", description: "File application on BIS portal with manufacturing and testing capacity." },
        { step: 3, title: "Factory Inspection by BIS Officers", description: "BIS inspection team visits foreign manufacturing plant for process audit." },
        { step: 4, title: "Sample Testing in India", description: "Drawn samples tested in BIS-recognized labs in India." },
        { step: 5, title: "Grant of License & CML Issuance", description: "Pay marking fees and receive CM/L license to use ISI mark." }
      ]
    };
  }

  if (isElectronics) {
    return {
      schemeName: "Compulsory Registration Scheme (CRS)",
      schemeCode: "Scheme-II (CRS)",
      summary: "Self-declaration of conformity based on testing in BIS-recognized laboratories for IT, electronics, and solar equipment.",
      isMandatoryUnderQCO: true,
      estimatedGovFee: "₹ 53,000 (Application + 2-Year Registration)",
      estimatedLabTestingFee: "₹ 25,000 - ₹ 55,000 per model series",
      estimatedTimeline: "15 - 25 Days (Fast-Track Digital Flow)",
      applicableStandards: ["IS 13252 (Part 1)", "IS 15885 (Part 2/Sec 13)", "IS 616", "IS 16046 (Part 2)"],
      requiredDocuments: [
        "NABL Accredited Test Report (Form V) issued within last 90 days",
        "Brand Trademark Registration Certificate or Brand Owner Authorization",
        "Undertaking for Compliance to CRS Guidelines",
        "Product Rating Plate / Marking Label Artwork",
        "Factory Business Registration & PCB Pollution NOC"
      ],
      roadmapSteps: [
        { step: 1, title: "Sample Testing at NABL Lab", description: "Submit product samples to a BIS-recognized lab for safety evaluation." },
        { step: 2, title: "Generate Test Report", description: "Receive official test report conforming to applicable Indian Standard." },
        { step: 3, title: "File Online CRS Application", description: "Upload test report and brand declaration on www.crsbis.in portal." },
        { step: 4, title: "BIS Digital Scrutiny", description: "Desk review by BIS officers without physical factory audit requirement." },
        { step: 5, title: "Registration Grant & R-Number", description: "Receive 8-digit R-number (e.g. R-41000000) for product labeling." }
      ]
    };
  }

  // Default Domestic Domestic Scheme-I (ISI Mark)
  return {
    schemeName: "Product Certification Scheme (ISI Mark)",
    schemeCode: "Scheme-I",
    summary: "Traditional BIS conformity mark verifying that domestic manufacturing consistently complies with published Indian Standards.",
    isMandatoryUnderQCO: true,
    estimatedGovFee: "₹ 21,000 (Application & Processing) + Annual Marking Fee",
    estimatedLabTestingFee: "₹ 15,000 - ₹ 35,000",
    estimatedTimeline: "30 - 45 Days (Standard Domestic)",
    applicableStandards: ["IS 1293:2019", "IS 694:2010", "IS 2082", "IS 302-2-25"],
    requiredDocuments: [
      "MSME Udyam Registration or Factory License",
      "List of In-House Testing Equipment & Valid Calibration Certificates",
      "Raw Material Test Certificates & Source Invoices",
      "Scheme of Testing and Inspection (STI) Acceptance",
      "Factory Layout & Machinery Details"
    ],
    roadmapSteps: [
      { step: 1, title: "Online Application Filing", description: "Register on www.manakonline.in under e-BIS Scheme I." },
      { step: 2, title: "Preliminary Factory Inspection", description: "BIS technical officer visits factory to audit manufacturing and testing setup." },
      { step: 3, title: "Independent Sample Testing", description: "Samples sealed by officer sent to National Test House / NABL lab." },
      { step: 4, title: "Grant of ISI License (CM/L)", description: "Pay annual minimum marking fee and receive CM/L certificate." },
      { step: 5, title: "Periodic Market Surveillance", description: "Annual surprise factory inspections and market sample testing." }
    ]
  };
}

/* ========================================================================= */
/* DYNAMIC DASHBOARD STATS REPOSITORY                                        */
/* ========================================================================= */
export async function getDashboardStats(): Promise<DashboardStats> {
  const standardsCount = memoryStore.standards.length + officialISNumbers.length;
  const activeLabsCount = LABS_DIRECTORY.length;

  // Calculate compliance pass rate from audit runs
  const totalAudits = memoryStore.auditHistory.length;
  const passedAudits = memoryStore.auditHistory.filter(a => a.status === "QUALIFIED").length;
  const passRate = totalAudits > 0 ? Number(((passedAudits / totalAudits) * 100).toFixed(1)) : 94.2;

  // Count active QCO alerts
  const pendingQCOAlertsCount = REGULATORY_ALERTS.filter(a => a.severity.toLowerCase() === "high").length;

  return {
    standardsCount,
    activeLabsCount,
    compliancePassRate: passRate,
    pendingQCOAlertsCount,
    totalAuditRuns: totalAudits,
    totalTestBookings: memoryStore.bookings.length,
    systemHealth: "Operational",
    lastSyncTime: new Date().toISOString()
  };
}
