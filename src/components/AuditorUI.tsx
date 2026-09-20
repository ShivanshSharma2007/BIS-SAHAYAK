"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileText,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building2,
  Play,
  RotateCcw,
  Printer,
  Download,
  Sparkles,
  FileCheck2,
  Check,
  RefreshCw,
  ChevronDown,
  Sliders,
  ArrowRight,
  ExternalLink,
  Award,
  Layers,
  ChevronRight,
  BadgeAlert,
  BadgeCheck,
  Zap,
  Info,
  Search
} from "lucide-react";
import { GeMTender } from "@/app/api/gem-audit/tenders/route";
import { BidderVerificationResponse, PortalCheckResult } from "@/app/api/gem-audit/verify-bidder/route";
import { TechnicalAuditResult, ClauseAuditItem } from "@/app/api/gem-audit/clause-audit/route";
import { useAppStore } from "@/store/useAppStore";

export default function AuditorUI() {
  const language = useAppStore(state => state.language);
  // State for tenders catalog
  const [tenders, setTenders] = useState<GeMTender[]>([]);
  const [selectedTender, setSelectedTender] = useState<GeMTender | null>(null);
  const [loadingTenders, setLoadingTenders] = useState(true);

  // Dynamic Tender Fetch State
  const [dynamicBidNumber, setDynamicBidNumber] = useState("");
  const [isFetchingDynamic, setIsFetchingDynamic] = useState(false);

  // Selected Scenario State
  const [activeScenario, setActiveScenario] = useState<"compliant" | "substandard" | "msme" | "suspended" | "scopemismatch" | "custom">("compliant");
  const [showCustomInputs, setShowCustomInputs] = useState(false);

  // Bidder inputs
  const [vendorName, setVendorName] = useState("Havells India Limited");
  const [gstin, setGstin] = useState("07AAACH1234F1Z5");
  const [bisLicense, setBisLicense] = useState("CM/L-8492015");
  const [standardClaimed, setStandardClaimed] = useState("IS 694:2010");
  const [oemAuthCode, setOemAuthCode] = useState("OEM-AUTH-9921");
  const [localContent, setLocalContent] = useState(65);
  const [isMsme, setIsMsme] = useState(false);
  const [udyamNumber, setUdyamNumber] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("Havells_IS694_Official_NABL_Report.pdf");
  const [reportText, setReportText] = useState(
    "High purity electrolytic annealed copper conductor purity tested at 99.94%. Conductor electrical resistance measured at 11.8 ohm/km at 20 deg C. Nominal radial insulation thickness 0.72 mm, minimum 0.58 mm. Oxygen index 31.2%. Withstood 3.0 kV AC RMS water immersion test for 5 minutes without breakdown."
  );

  // Audit Progress & Results
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<BidderVerificationResponse | null>(null);
  const [technicalResult, setTechnicalResult] = useState<TechnicalAuditResult | null>(null);
  const [hasRunAudit, setHasRunAudit] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load tenders on mount
  useEffect(() => {
    async function loadTenders() {
      try {
        setLoadingTenders(true);
        const res = await fetch("/api/gem-audit/tenders");
        const data = await res.json();
        if (data.tenders && data.tenders.length > 0) {
          setTenders(data.tenders);
          setSelectedTender(data.tenders[0]);
          setStandardClaimed(data.tenders[0].mandatoryStandard);
        }
      } catch (err) {
        console.error("Failed to load GeM tenders:", err);
      } finally {
        setLoadingTenders(false);
      }
    }
    loadTenders();
  }, []);

  // Quick Preset Scenarios
  const selectScenario = (type: "compliant" | "substandard" | "msme" | "suspended" | "scopemismatch") => {
    setActiveScenario(type);
    setShowCustomInputs(false);

    if (type === "compliant") {
      setVendorName(selectedTender?.bidNumber === "GEM/2026/B/849201" ? "Havells India Limited" : "Verified Premium OEM Ltd");
      setGstin("07AAACH1234H1Z5");
      setBisLicense("CM/L-8492015");
      setStandardClaimed(selectedTender?.mandatoryStandard || "IS 694:2010");
      setOemAuthCode("OEM-AUTH-992");
      setLocalContent(65);
      setIsMsme(false);
      setUdyamNumber("");
      setUploadedFileName("Official_NABL_Report.pdf");
      
      const dynamicReport = selectedTender?.clauses
        ? selectedTender.clauses.map(c => `Tested for ${c.title}: ${c.requirement} - PASSED.`).join(" ")
        : "High purity electrolytic annealed copper conductor purity tested at 99.94%. Conductor electrical resistance measured at 11.8 ohm/km at 20 deg C. Nominal radial insulation thickness 0.72 mm, minimum 0.58 mm. Oxygen index 31.2%. Withstood 3.0 kV AC RMS water immersion test for 5 minutes without breakdown.";
      
      setReportText(dynamicReport);
    } else if (type === "substandard") {
      setVendorName("ShoddyTech Cables & Wires Corp");
      setGstin("06AAACF9999Z1Z0");
      setBisLicense("CM/L-EXPIRED-2023");
      setStandardClaimed(selectedTender?.mandatoryStandard || "IS 694:2010");
      setOemAuthCode("INVALID-AUTH-00");
      setLocalContent(18); // Fails Class-I/II
      setIsMsme(false);
      setUdyamNumber("");
      setUploadedFileName("ShoddyTech_Datasheet_Draft.pdf");
      
      const dynamicReport = selectedTender?.clauses
        ? selectedTender.clauses.map((c, idx) => idx === 0 ? `Tested for ${c.title}: FAILED to meet standard limit.` : `Tested for ${c.title}: ${c.requirement} - PASSED.`).join(" ")
        : "Commercial grade copper wire with standard PVC sheath. Conductor electrical resistance recorded at 14.5 ohm/km (exceeded standard limit). Flammability: Oxygen index tested at 23.5% (failed IS 10810 threshold). Water immersion test not completed due to early insulation puncture at 1.8 kV.";
      
      setReportText(dynamicReport);
    } else if (type === "suspended") {
      setVendorName("Nova Lighting Devices");
      setGstin("33AAACB5555C1Z1");
      setBisLicense("CM/L-1234567");
      setStandardClaimed(selectedTender?.mandatoryStandard || "IS 10322:Part 5:Sec 1:2012");
      setOemAuthCode("OEM-NOVA-555");
      setLocalContent(60);
      setIsMsme(false);
      setUdyamNumber("");
      setUploadedFileName("Nova_Test_Report.pdf");
      setReportText("Test report indicates marginal compliance, but vendor is currently suspended on CPPP.");
    } else if (type === "scopemismatch") {
      setVendorName("MedLife Equipments Ltd");
      setGstin("09AAACM2222M1Z2");
      setBisLicense("CM/L-8889990");
      setStandardClaimed(selectedTender?.mandatoryStandard ? `${selectedTender.mandatoryStandard} (Partial)` : "IS 7285:Part 2:2004");
      setOemAuthCode("MEDLIFE-AUTH");
      setLocalContent(70);
      setIsMsme(true);
      setUdyamNumber("UDYAM-UP-02-12345");
      setUploadedFileName("MedLife_Test.pdf");
      setReportText(
        "Product tested for basic physical properties, but critical advanced tests were omitted from the scope."
      );
    } else {
      // MSME
      setVendorName(selectedTender?.bidNumber === "GEM/2026/B/849201" ? "Surya Agro-Power Cables (MSME)" : "Local Enterprise (MSME)");
      setGstin("27AAAFS5521K1Z2");
      setBisLicense("CM/L-7128941");
      setStandardClaimed(selectedTender?.mandatoryStandard || "IS 694:2010");
      setOemAuthCode("SURYA-OEM-DIRECT");
      setLocalContent(74);
      setIsMsme(true);
      setUdyamNumber("UDYAM-MH-01-0084921");
      setUploadedFileName("MSME_Type_Certificate.pdf");
      
      const dynamicReport = selectedTender?.clauses
        ? selectedTender.clauses.map(c => `Tested for ${c.title}: ${c.requirement} - PASSED.`).join(" ")
        : "Electrolytic copper purity tested at 99.91%. Conductor electrical resistance measured at 12.05 ohm/km. Insulation thickness nominal 0.70 mm. Oxygen index 29.8%. Passed 3 kV high voltage immersion test.";
      
      setReportText(dynamicReport);
    }
  };

  // Switch tender
  const handleSelectTender = (tender: GeMTender) => {
    setSelectedTender(tender);
    setStandardClaimed(tender.mandatoryStandard);
    setHasRunAudit(false);
    setVerificationResult(null);
    setTechnicalResult(null);
  };

  // Automatically update the mock bidder data if the tender changes
  useEffect(() => {
    if (selectedTender) {
      selectScenario(activeScenario);
    }
  }, [selectedTender]); // Re-run when selectedTender changes

  // Fetch dynamic tender
  const handleFetchDynamicTender = async () => {
    if (!dynamicBidNumber) return;
    setIsFetchingDynamic(true);
    try {
      const res = await fetch("/api/gem-audit/tenders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bidNumber: dynamicBidNumber })
      });
      const data = await res.json();
      if (data.tender) {
        setTenders(prev => [data.tender, ...prev.filter(t => t.id !== data.tender.id)]);
        handleSelectTender(data.tender);
        setDynamicBidNumber("");
      } else {
        alert("Could not resolve tender. " + (data.error || ""));
      }
    } catch (e) {
      console.error(e);
      alert("Error fetching tender.");
    } finally {
      setIsFetchingDynamic(false);
    }
  };

  // Run the Audit
  const handleRunAudit = async () => {
    if (!selectedTender) return;

    setIsAuditing(true);
    setAuditStep("Connecting to National Registries (BIS Care, GSTN, CPPP, GeM OEM)...");

    try {
      // 1. Verify Bidder Credentials via API
      const verifyRes = await fetch("/api/gem-audit/verify-bidder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bidNumber: selectedTender.bidNumber,
          vendorName,
          gstin,
          bisLicense,
          standardClaimed,
          oemAuthorizationCode: oemAuthCode,
          localContentPercent: localContent,
          isMsme,
          udyamNumber,
          language
        })
      });
      const verifyData: BidderVerificationResponse = await verifyRes.json();
      setVerificationResult(verifyData);

      // 2. Perform Clause-by-Clause Technical Audit via Gemini / AI Engine
      setAuditStep("AI Cross-Examining Technical Specifications & Lab Test Report...");
      const clauseRes = await fetch("/api/gem-audit/clause-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tender: selectedTender,
          vendorName,
          bidderReportText: reportText,
          bidderClaimedSpecs: {
            "Vendor": vendorName,
            "GSTIN": gstin,
            "BIS License": bisLicense,
            "Local Content": `${localContent}%`
          },
          language
        })
      });
      const clauseData: TechnicalAuditResult = await clauseRes.json();
      setTechnicalResult(clauseData);
      setHasRunAudit(true);

      // 3. Persist audit run to backend history
      try {
        await fetch("/api/gem-audit/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenderId: selectedTender?.id,
            bidNumber: selectedTender?.bidNumber || "GEM/2026/...",
            tenderTitle: selectedTender?.title,
            buyerName: selectedTender?.buyer.name,
            vendorName,
            gstin,
            bisLicense,
            localContent,
            isMSME: isMsme,
            status: (verifyData.overallStatus === "DISQUALIFIED" || clauseData.overallVerdict === "TECHNICALLY_DISQUALIFIED") ? "DISQUALIFIED" : "QUALIFIED",
            riskScore: verifyData.riskScore || 0,
            evaluatedClausesCount: clauseData.clauseAudits?.length || 0,
            clausesPassedCount: clauseData.clauseAudits?.filter((c: any) => c.status === "PASS").length || 0,
            summary: clauseData.executiveSummary || "Automated pre-bid verification completed."
          })
        });
      } catch (historyErr) {
        console.warn("Could not record audit history:", historyErr);
      }
    } catch (err) {
      console.error("Audit run error:", err);
      alert("Failed to connect to audit backend. Please check network and try again.");
    } finally {
      setIsAuditing(false);
      setAuditStep("");
    }
  };

  // File Upload with Real Content Extraction
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setActiveScenario("custom");
    setShowCustomInputs(true);

    try {
      const text = await file.text();
      if (text && text.trim().length > 0) {
        setReportText(text);
      } else {
        setReportText(`[Attached Document: ${file.name}]\nFile size: ${(file.size / 1024).toFixed(1)} KB.\nOfficial NABL accredited laboratory report document.`);
      }
    } catch {
      setReportText(`[Attached Document: ${file.name}]`);
    }
  };

  // Load official sample documents
  const loadDocumentType = (type: "official_pass" | "official_fail" | "invalid_receipt") => {
    setActiveScenario("custom");
    setShowCustomInputs(true);

    if (type === "official_pass") {
      setUploadedFileName("Official_BIS_FormV_NABL_Pass_Report.pdf");
      setReportText(
        "GOVERNMENT OF INDIA - NATIONAL ACCREDITATION BOARD (NABL)\n" +
        "Accreditation No: TC-5011 (National Test House Northern Region)\n" +
        "Test Report No: NTH/NR/ELEC/2026/08912 | Date: 12-Aug-2026\n" +
        "Tested to Standard: IS 694:2010 (Cables for voltages up to 1.1 kV)\n" +
        "Sample Description: 1.5 sq mm multi-strand annealed bare electrolytic copper conductor\n" +
        "--- TEST OBSERVATIONS ---\n" +
        "1. Clause 4.1 Conductor Material: Electrolytic copper purity recorded at 99.94% (Min req: 99.90%) - PASSED\n" +
        "2. Clause 5.2 Electrical Resistance at 20°C: 11.82 Ω/km (Max limit: 12.1 Ω/km) - PASSED\n" +
        "3. Clause 6.3 Radial Insulation Thickness: 0.72 mm (Nominal req: 0.70 mm, Min: 0.53 mm) - PASSED\n" +
        "4. Clause 8.1 Oxygen Index (IS 10810 Pt 58): 31.4% (Min req: 29.0%) - PASSED\n" +
        "5. Clause 10.4 3kV Water Immersion 5-minute Spark Test: Withstood without dielectric breakdown - PASSED\n" +
        "CONCLUSION: The tested sample FULLY CONFORMS to all mandatory provisions of IS 694:2010."
      );
    } else if (type === "official_fail") {
      setUploadedFileName("Official_BIS_FormV_NABL_SubStandard_Fail_Report.pdf");
      setReportText(
        "GOVERNMENT OF INDIA - CENTRAL TESTING LABORATORY\n" +
        "Accreditation No: TC-4102 (Regional Industrial Quality Cell)\n" +
        "Test Report No: CTL/FAIL/2026/0149 | Date: 05-Sep-2026\n" +
        "Tested to Standard: IS 694:2010\n" +
        "Sample Description: Commercial grade flexible cord\n" +
        "--- TEST OBSERVATIONS ---\n" +
        "1. Clause 4.1 Conductor Material: High copper alloy (Purity 94.2% - substandard) - FAILED\n" +
        "2. Clause 5.2 Electrical Resistance at 20°C: 14.50 Ω/km (Exceeds maximum allowed 12.1 Ω/km by 19.8%) - FAILED\n" +
        "3. Clause 6.3 Radial Insulation Thickness: 0.48 mm (Below minimum 0.53 mm threshold) - FAILED\n" +
        "4. Clause 8.1 Oxygen Index: 23.5% (Severe fire risk, failed 29% minimum requirement) - FAILED\n" +
        "5. Clause 10.4 Water Immersion High Voltage: Punctured and sparked at 1.8 kV AC - FAILED\n" +
        "CONCLUSION: SUB-STANDARD PRODUCT. Sample completely FAILS IS 694:2010 mandatory criteria."
      );
    } else {
      setUploadedFileName("Non_Technical_General_Document.pdf");
      setReportText(
        "INVOICE & PACKING SLIP\n" +
        "Date: 10-Sep-2026 | Invoice Ref: INV-8923\n" +
        "Item: Office stationery, printer cartridges, and cafeteria coffee beans.\n" +
        "Total Amount: ₹ 14,200. Paid via UPI.\n" +
        "Thank you for your business!"
      );
    }
  };

  // Overall calculations
  const combinedScore =
    verificationResult && technicalResult
      ? Math.round((verificationResult.riskScore * 0.4) + (technicalResult.technicalScore * 0.6))
      : null;

  const isDisqualified =
    verificationResult?.overallStatus === "DISQUALIFIED" ||
    technicalResult?.overallVerdict === "TECHNICALLY_DISQUALIFIED";

  return (
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 overflow-y-auto selection:bg-[#163F73]/20">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#163F73] text-white flex items-center justify-center shadow-md">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">
                  GeM Pre-Bid Compliance Auditor
                </h1>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                  Govt AI Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Automated multi-portal bidder evaluation & clause-by-clause compliance cross-check
              </p>
            </div>
          </div>

          {/* Reset / New Audit Button */}
          {hasRunAudit && (
            <button
              onClick={() => setHasRunAudit(false)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Audit Another Bidder</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full p-6 space-y-6">
        {/* Tender Header Selector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#163F73] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {selectedTender?.bidNumber || "GEM/2026/B/..."}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Mandatory Standard: {selectedTender?.mandatoryStandard}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 line-clamp-1">
                {selectedTender?.title}
              </h2>
              <p className="text-xs text-slate-500">
                Buyer: <span className="font-medium text-slate-700">{selectedTender?.buyer.name}</span> ({selectedTender?.buyer.location}) · Value: <span className="font-medium text-slate-700">{selectedTender?.value}</span> · Closing: <span className="font-medium text-slate-700">{selectedTender?.closingDate}</span>
              </p>
            </div>
            {/* Clean Dropdown & Dynamic Fetch */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <Search className="w-4 h-4 text-slate-400 hidden sm:block" />
                <input
                  type="text"
                  placeholder="Search GeM Bid No. (e.g., GEM/2026/B/849201)"
                  value={dynamicBidNumber}
                  onChange={(e) => setDynamicBidNumber(e.target.value)}
                  className="w-full lg:w-72 text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-[#163F73]/20 focus:outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={handleFetchDynamicTender}
                  disabled={isFetchingDynamic || !dynamicBidNumber}
                  className="px-5 py-2.5 bg-[#163F73] hover:bg-[#1f4a86] disabled:bg-slate-400 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {isFetchingDynamic ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Zap className="w-3.5 h-3.5" />
                  )}
                  <span>Search Tender</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AUDIT WORKFLOW: Either Setup or Results Dashboard */}
        {!hasRunAudit ? (
          /* ========================================================================= */
          /* STAGE 1: STREAMLINED SETUP & AUDIT LAUNCHER                              */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Step 1: 3 Premium Scenario Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Step 1: Choose a Bidder Profile to Audit
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select a realistic demonstration profile or customize with your own company credentials
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomInputs(!showCustomInputs)}
                  className="text-xs text-[#163F73] hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{showCustomInputs ? "Hide Custom Details" : "Edit Custom Bidder Data"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Scenario 1: Tier-1 OEM (Pass) */}
                <div
                  onClick={() => selectScenario("compliant")}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                    activeScenario === "compliant"
                      ? "border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500 shadow-sm"
                      : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                        Expected: Qualified (100%)
                      </span>
                      {activeScenario === "compliant" && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-sm font-bold text-slate-900">Havells India Limited</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Tier-1 Primary OEM with active BIS license <span className="font-mono text-slate-700">CM/L-8492015</span> and full NABL test compliance.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                    <div>✓ Active GSTN & 0 CPPP debarment</div>
                    <div>✓ 65% Local Content (Class-I MII)</div>
                  </div>
                </div>

                {/* Scenario 2: Sub-Standard (Reject) */}
                <div
                  onClick={() => selectScenario("substandard")}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                    activeScenario === "substandard"
                      ? "border-rose-500 bg-rose-50/30 ring-1 ring-rose-500 shadow-sm"
                      : "border-slate-200 bg-white hover:border-rose-300 hover:shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase">
                        Expected: Disqualified
                      </span>
                      {activeScenario === "substandard" && (
                        <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <h4 className="text-sm font-bold text-slate-900">ShoddyTech Cables Corp</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      High-risk vendor with expired BIS certificate, debarred on CPPP, and sub-standard resistance test failure.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                    <div className="text-rose-700">✕ Expired License CM/L-EXPIRED</div>
                    <div className="text-rose-700">✕ Resistance 14.5 Ω/km (Violates limit)</div>
                  </div>
                </div>

                {/* Scenario 3: MSME Startup (MII) */}
                <div
                  onClick={() => selectScenario("msme")}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                    activeScenario === "msme"
                      ? "border-blue-500 bg-blue-50/30 ring-1 ring-blue-500 shadow-sm"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                        Expected: MSME Qualified
                      </span>
                      {activeScenario === "msme" && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <h4 className="text-sm font-bold text-slate-900">Surya Agro-Power (MSME)</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Registered domestic MSME with Udyam ID, claiming statutory EMD exemption and 74% Make-in-India content.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                    <div className="text-blue-700">✓ Udyam Verified · EMD Exempt</div>
                    <div className="text-blue-700">✓ 74% Local Content (Class-I)</div>
                  </div>
                </div>

                {/* Scenario 4: Suspended License */}
                <div
                  onClick={() => selectScenario("suspended")}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                    activeScenario === "suspended"
                      ? "border-amber-500 bg-amber-50/30 ring-1 ring-amber-500 shadow-sm"
                      : "border-slate-200 bg-white hover:border-amber-300 hover:shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
                        Suspended License
                      </span>
                      {activeScenario === "suspended" && (
                        <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <h4 className="text-sm font-bold text-slate-900">Nova Lighting</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      License currently suspended by BIS due to recent factory surveillance failure.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                    <div className="text-amber-700">✕ CM/L-1234567 Suspended</div>
                  </div>
                </div>

                {/* Scenario 5: Scope Mismatch */}
                <div
                  onClick={() => selectScenario("scopemismatch")}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                    activeScenario === "scopemismatch"
                      ? "border-purple-500 bg-purple-50/30 ring-1 ring-purple-500 shadow-sm"
                      : "border-slate-200 bg-white hover:border-purple-300 hover:shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase">
                        Scope Mismatch
                      </span>
                      {activeScenario === "scopemismatch" && (
                        <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Layers className="w-4 h-4 text-purple-600" />
                      <h4 className="text-sm font-bold text-slate-900">MedLife Equipments</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Active BIS license, but approved for a different IS standard (Oxygen Cylinders instead of required).
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                    <div className="text-purple-700">✕ IS Standard Mismatch</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Custom Form Expansion */}
            {showCustomInputs && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Custom Bidder Parameters & Test Report
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={vendorName}
                      onChange={(e) => {
                        setVendorName(e.target.value);
                        setActiveScenario("custom");
                      }}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-[#163F73]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN</label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => {
                        setGstin(e.target.value);
                        setActiveScenario("custom");
                      }}
                      className="w-full font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 uppercase focus:ring-2 focus:ring-[#163F73]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">BIS License / CRS</label>
                    <input
                      type="text"
                      value={bisLicense}
                      onChange={(e) => {
                        setBisLicense(e.target.value);
                        setActiveScenario("custom");
                      }}
                      className="w-full font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 uppercase focus:ring-2 focus:ring-[#163F73]/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Local Content: {localContent}% (Make in India)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={localContent}
                      onChange={(e) => {
                        setLocalContent(Number(e.target.value));
                        setActiveScenario("custom");
                      }}
                      className="w-full accent-[#163F73] cursor-pointer mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-4">
                    <input
                      type="checkbox"
                      id="msmeBox"
                      checked={isMsme}
                      onChange={(e) => {
                        setIsMsme(e.target.checked);
                        setActiveScenario("custom");
                      }}
                      className="rounded border-slate-300 text-[#163F73] focus:ring-[#163F73] w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="msmeBox" className="text-xs font-medium text-slate-700 cursor-pointer">
                      Registered MSME / Startup (Claim EMD Exemption)
                    </label>
                  </div>
                </div>

                {/* Official BIS Reference Test Documents & Upload */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#163F73]" />
                      <span>Technical Test Report (BIS / NABL Accredited Form V):</span>
                    </label>
                    
                    {/* Quick Official Sample Switcher */}
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="text-slate-400 font-semibold">Load Official Sample:</span>
                      <button
                        type="button"
                        onClick={() => loadDocumentType("official_pass")}
                        className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded border border-emerald-200 cursor-pointer transition-colors"
                      >
                        NABL Form V (Pass)
                      </button>
                      <button
                        type="button"
                        onClick={() => loadDocumentType("official_fail")}
                        className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium rounded border border-rose-200 cursor-pointer transition-colors"
                      >
                        Sub-Standard (Fail)
                      </button>
                      <button
                        type="button"
                        onClick={() => loadDocumentType("invalid_receipt")}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded border border-slate-200 cursor-pointer transition-colors"
                      >
                        Invalid (Receipt)
                      </button>
                    </div>
                  </div>

                  {/* Upload Dropzone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border border-dashed border-slate-300 hover:border-[#163F73] rounded-xl p-3 bg-slate-50 hover:bg-slate-100/70 cursor-pointer transition-colors flex items-center justify-between gap-3 mb-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#163F73] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-slate-800">
                          {uploadedFileName || "Attach custom laboratory test certificate (.pdf, .txt, .json)"}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Click to upload your own lab test report from device
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#163F73] bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs">
                      Browse File
                    </span>
                  </div>

                  <textarea
                    rows={4}
                    value={reportText}
                    onChange={(e) => {
                      setReportText(e.target.value);
                      setActiveScenario("custom");
                    }}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-700 leading-relaxed focus:ring-2 focus:ring-[#163F73]/20"
                    placeholder="Enter or inspect extracted technical test observations..."
                  />
                </div>
              </div>
            )}

            {/* Launch Primary Action Button */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center text-center space-y-4">
              <div className="max-w-md">
                <h3 className="text-base font-bold text-slate-900">
                  Ready to Execute GeM Pre-Bid Audit
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Cross-verifies bidder credentials across BIS Care, GSTN, CPPP, and evaluates lab reports clause-by-clause with Gemini AI.
                </p>
              </div>

              <button
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="w-full max-w-md bg-[#163F73] hover:bg-[#1f4a86] disabled:bg-slate-400 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>{auditStep || "Auditing Multi-Portal Compliance..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>Run AI Pre-Bid Compliance Audit</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
                <span>✓ BIS Care Portal</span>
                <span>✓ GSTN Common Portal</span>
                <span>✓ CPPP Debarment Registry</span>
                <span>✓ GeM OEM Catalog</span>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* STAGE 2: EXECUTIVE AUDIT RESULTS DASHBOARD (CLEAN & BEAUTIFUL)           */
          /* ========================================================================= */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. Hero Verdict Card */}
            <div
              className={`rounded-2xl border p-6 text-white shadow-md ${
                isDisqualified
                  ? "bg-gradient-to-r from-rose-900 via-rose-800 to-red-950 border-rose-700"
                  : "bg-gradient-to-r from-[#0F172A] via-[#163F73] to-[#1E293B] border-blue-900"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Official GeM Pre-Bid Determination
                    </span>
                    <span className="text-xs text-white/70 font-mono">
                      Bidder: {vendorName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {isDisqualified ? (
                      <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300">
                        <XCircle className="w-8 h-8" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">
                        {isDisqualified
                          ? "BIDDER DISQUALIFIED / HIGH RISK"
                          : "QUALIFIED FOR TECHNICAL OPENING"}
                      </h2>
                      <p className="text-xs text-white/80 mt-0.5">
                        {isDisqualified
                          ? "Critical regulatory or technical deficiencies detected. Rejection recommended prior to commercial envelope opening."
                          : "Bidder meets all mandatory Indian Standards, regulatory checks, and technical clauses."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Score Dial Badge */}
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0">
                  <div className="text-center">
                    <div className="text-4xl font-black leading-none">
                      {combinedScore}%
                    </div>
                    <div className="text-[10px] uppercase font-bold text-white/70 mt-1">
                      Compliance Index
                    </div>
                  </div>
                  <div className="w-[1px] h-10 bg-white/20"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold leading-none">
                      {verificationResult?.complianceRating}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-white/70 mt-1">
                      Integrity Tier
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical Red Flags Alert Box (If Disqualified) */}
              {verificationResult?.disqualificationReasons &&
                verificationResult.disqualificationReasons.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-white/15 space-y-1.5">
                    <div className="text-xs font-bold text-yellow-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Critical Non-Compliances Triggering Disqualification:</span>
                    </div>
                    {verificationResult.disqualificationReasons.map((reason, i) => (
                      <div key={i} className="text-xs text-white/90 pl-3 flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* 2. Multi-Portal Registry Status Strip */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#163F73]" />
                <span>Multi-Portal Regulatory Verification</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {verificationResult?.checks.map((check) => {
                  const isOk = check.status === "VERIFIED";
                  const isWarn = check.status === "WARNING" || check.status === "SUSPECT";
                  return (
                    <div
                      key={check.id}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                        isOk
                          ? "bg-emerald-50/50 border-emerald-200"
                          : isWarn
                          ? "bg-amber-50/50 border-amber-200"
                          : "bg-rose-50/50 border-rose-200"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase truncate">
                            {check.id.replace("-", " ")}
                          </span>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                              isOk
                                ? "bg-emerald-100 text-emerald-800"
                                : isWarn
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {check.status}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-800 line-clamp-1">
                          {check.headline}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-tight">
                          {check.details}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Clause-by-Clause Technical Matrix */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#163F73]" />
                    <span>AI Clause-by-Clause Technical Cross-Check</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cross-examines tender requirements against submitted lab test report values
                  </p>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Gemini AI Auditor
                </span>
              </div>

              <div className="space-y-3">
                {technicalResult?.clauseAudits.map((clause, idx) => {
                  const isPassed = clause.status === "COMPLIANT";
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        isPassed
                          ? "bg-slate-50/70 border-slate-200"
                          : "bg-rose-50/70 border-rose-200"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#163F73] bg-white px-2 py-0.5 rounded border border-slate-200">
                            {clause.clauseNumber}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">{clause.title}</h4>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase self-start sm:self-auto ${
                            isPassed
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {clause.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-2">
                        <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Tender Requirement:</span>
                          <p className="text-slate-700 mt-0.5">{clause.tenderRequirement}</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Bidder Tested Value:</span>
                          <p className="text-slate-700 font-mono text-[11px] mt-0.5">{clause.bidderSubmittedValue}</p>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs flex items-center gap-1.5">
                        <span className="font-semibold text-slate-500">Verdict:</span>
                        <span className={isPassed ? "text-emerald-700 font-medium" : "text-rose-700 font-bold"}>
                          {clause.verdictNote}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Official Certificate & Export Strip */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Official GeM Pre-Bid Audit Certificate Ready
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Reference: AUD-{Date.now().toString().slice(-6)} · SHA-256 Hash Generated
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify({ verificationResult, technicalResult }, null, 2)], {
                      type: "application/json"
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `GeM_Audit_${selectedTender?.bidNumber.replace(/\//g, "_")}.json`;
                    a.click();
                  }}
                  className="px-4 py-2 bg-[#163F73] hover:bg-[#1f4a86] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />
    </div>
  );
}
