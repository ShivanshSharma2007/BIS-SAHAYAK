"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Printer, 
  Download, 
  Sparkles, 
  RefreshCw, 
  ChevronDown, 
  ShieldCheck, 
  ArrowRight, 
  BookOpen, 
  Layers,
  Building2,
  Calendar,
  Hash,
  Award,
  SlidersHorizontal,
  ExternalLink,
  Search,
  Filter,
  Check,
  Zap,
  Cpu,
  BadgeCheck
} from "lucide-react";
import { SAMPLE_TEST_REPORTS, SampleTestReport } from "@/data/sampleTestReports";
import { ComplianceParserResponse, ParsedClauseItem } from "@/app/api/parser/parse/route";
import { useAppStore } from "@/store/useAppStore";

// Extended realistic official test scenarios for quick inspection
const REALISTIC_BIS_SCENARIOS = [
  ...SAMPLE_TEST_REPORTS,
  {
    id: "sample-is1786-pass",
    name: "Tata Tiscon Fe 500D TMT Steel Rebar (IS 1786:2008)",
    scenario: "PASS",
    standardId: "std-1786",
    standardNumber: "IS 1786:2008",
    productName: "High Strength Deformed Steel Bar for Concrete Reinforcement (Fe 500D, 16mm)",
    labName: "National Test House (Eastern Region), Alipore, Kolkata",
    nablAccreditationNo: "TC-5011",
    ulrNumber: "ULR-TC501126000008912F",
    reportNumber: "NTH/MET/2026/4102",
    reportDate: "2026-02-14",
    manufacturer: "Tata Steel Limited, Jamshedpur, Jharkhand",
    sampleBatch: "TSL-TMT-16-B09",
    summary: "Passed mandatory yield strength, TS/YS ratio, elongation, and carbon chemistry under IS 1786.",
    reportText: `NATIONAL TEST HOUSE (EASTERN REGION)
Recognized by Bureau of Indian Standards (BIS) under Scheme-I
Accreditation No: TC-5011 | ULR Number: ULR-TC501126000008912F
Test Report No: NTH/MET/2026/4102 | Date: 14-Feb-2026

CUSTOMER & SAMPLE DETAILS:
Manufacturer: Tata Steel Limited, Jamshedpur Works, Jharkhand
Sample Description: 16 mm Thermo-Mechanically Treated (TMT) Steel Bar Grade Fe 500D
Batch No: TSL-TMT-16-B09 | Standard Tested: IS 1786:2008

TEST RESULTS & STATUTORY CONFORMITY:
1. Clause 8.1 - 0.2% Proof Stress / Yield Stress:
- Specified Requirement: Minimum 500.0 N/mm² (MPa) for Fe 500D grade.
- Observed Test Result: Yield stress measured across 3 specimens averaged 542.0 N/mm². (+8.4% margin).
- Compliance Verdict: COMPLIANT (Pass)

2. Clause 8.2 - Tensile Strength to Yield Ratio (TS / YS):
- Specified Requirement: TS / YS ratio shall not be less than 1.10. Tensile strength >= 565.0 N/mm².
- Observed Test Result: Ultimate tensile strength 628.0 N/mm²; TS/YS ratio = 1.16.
- Compliance Verdict: COMPLIANT (Pass)

3. Clause 8.3 - Percentage Elongation at Gauge Length 5.65√So:
- Specified Requirement: Minimum elongation shall be 16.0% for Fe 500D.
- Observed Test Result: Elongation measured at 18.5%.
- Compliance Verdict: COMPLIANT (Pass)

4. Clause 4.2 - Chemical Composition (OES Spectrometry):
- Specified Requirement: Carbon <= 0.25%, Sulphur <= 0.040%, Phosphorus <= 0.040%, S+P <= 0.075%.
- Observed Test Result: C = 0.21%, S = 0.028%, P = 0.031%, S+P = 0.059%.
- Compliance Verdict: COMPLIANT (Pass)

OVERALL REMARKS:
Sample conforms to IS 1786:2008 Grade Fe 500D. Qualified for structural infrastructure applications.`
  },
  {
    id: "sample-is14543-pass",
    name: "Bisleri Packaged Drinking Water (IS 14543:2004)",
    scenario: "PASS",
    standardId: "std-14543",
    standardNumber: "IS 14543:2004",
    productName: "Packaged Drinking Water (1.0 Litre PET Bottle)",
    labName: "Food Research & Analysis Centre (FRAC), New Delhi",
    nablAccreditationNo: "TC-6184",
    ulrNumber: "ULR-TC618426000002148F",
    reportNumber: "FRAC/WTR/2026/782",
    reportDate: "2026-02-18",
    manufacturer: "Bisleri International Pvt Ltd, Sahibabad, Ghaziabad",
    sampleBatch: "BIS-DEL-26-W04",
    summary: "Passed TDS, heavy metals, pesticide residues, and zero-tolerance microbial tests under IS 14543.",
    reportText: `FOOD RESEARCH & ANALYSIS CENTRE (FRAC)
Accredited by NABL (ISO/IEC 17025) & Approved by BIS
Accreditation No: TC-6184 | ULR Number: ULR-TC618426000002148F
Test Report No: FRAC/WTR/2026/782 | Date: 18-Feb-2026

CUSTOMER & SAMPLE DETAILS:
Manufacturer: Bisleri International Pvt Ltd, Sahibabad Plant
Sample Description: Packaged Drinking Water (1000 ml sealed PET bottle)
Batch No: BIS-DEL-26-W04 | Standard Tested: IS 14543:2004

TEST RESULTS & STATUTORY CONFORMITY:
1. Clause 3.2 - Total Dissolved Solids (TDS) & pH:
- Specified Requirement: TDS between 75.0 and 500.0 mg/L; pH between 6.50 and 8.50.
- Observed Test Result: TDS = 124.0 mg/L; pH = 7.24 at 25°C.
- Compliance Verdict: COMPLIANT (Pass)

2. Clause 3.3 - Toxic Heavy Metals (Lead & Arsenic):
- Specified Requirement: Lead (Pb) <= 0.01 mg/L; Arsenic (As) <= 0.01 mg/L.
- Observed Test Result: Lead < 0.001 mg/L (Below Detection Limit); Arsenic < 0.001 mg/L.
- Compliance Verdict: COMPLIANT (Pass)

3. Clause 4.1 - Microbiological Safety (Coliform & E. coli):
- Specified Requirement: Coliform and E. coli Absent (Zero) in 250 ml sample.
- Observed Test Result: Zero colonies detected in 250 ml filtered sample.
- Compliance Verdict: COMPLIANT (Pass)

4. Clause 3.4 - Total Pesticide Residues:
- Specified Requirement: Individual pesticide <= 0.0001 mg/L; Total pesticides <= 0.0005 mg/L.
- Observed Test Result: Zero pesticide residues detected across 32-compound GC-MS screen.
- Compliance Verdict: COMPLIANT (Pass)

OVERALL REMARKS:
Sample conforms to IS 14543:2004. Validated for BIS ISI Certification Mark.`
  }
];

export default function ComplianceParserUI() {
  const [standards, setStandards] = useState<any[]>([]);
  const [selectedStandardId, setSelectedStandardId] = useState<string>("auto");
  const [standardSearch, setStandardSearch] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("ALL");
  const [calculationMode, setCalculationMode] = useState<"strict_numeric" | "auto">("auto");

  const [reportText, setReportText] = useState<string>(SAMPLE_TEST_REPORTS[0].reportText);
  const [uploadedFileName, setUploadedFileName] = useState<string>("Havells_IS694_Official_NABL_Report.pdf");
  const [isScenarioDrawerOpen, setIsScenarioDrawerOpen] = useState<boolean>(false);

  const { setActiveDrawer } = useAppStore();
  const language = useAppStore(state => state.language);
  const [activeTab, setActiveTab] = useState<"upload" | "report">("upload");
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ComplianceParserResponse | null>(null);
  const [clauseFilter, setClauseFilter] = useState<"ALL" | "FAILED" | "PASSED">("ALL");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load complete catalog of official standards
  useEffect(() => {
    async function loadStandards() {
      try {
        const res = await fetch("/api/standards");
        const data = await res.json();
        if (data.success && Array.isArray(data.standards)) {
          setStandards(data.standards);
        }
      } catch (err) {
        console.error("Failed to load standards catalog:", err);
      }
    }
    loadStandards();
  }, []);

  // Filtered standards list for combobox
  const filteredStandards = useMemo(() => {
    let list = standards;
    if (selectedDivision !== "ALL") {
      list = list.filter(s => s.productCategory.toLowerCase().includes(selectedDivision.toLowerCase()));
    }
    if (standardSearch.trim()) {
      const q = standardSearch.toLowerCase().trim();
      list = list.filter(s => 
        s.standardNumber.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.productCategory.toLowerCase().includes(q) ||
        s.keywords?.some((k: string) => k.toLowerCase().includes(q))
      );
    }
    // Strict deduplication by standard ID
    const seen = new Set<string>();
    const deduplicated: any[] = [];
    for (const s of list) {
      if (s?.id && !seen.has(s.id)) {
        seen.add(s.id);
        deduplicated.push(s);
      }
    }
    return deduplicated;
  }, [standards, selectedDivision, standardSearch]);

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploadedFileName(selectedFile.name);
      setParseResult(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setReportText(content);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  // Load a test scenario
  const handleLoadScenario = (scenario: any) => {
    setSelectedStandardId(scenario.standardId);
    setReportText(scenario.reportText);
    setUploadedFileName(`${scenario.manufacturer.split(" ")[0]}_${scenario.standardNumber.replace(/[^\w]/g, "_")}_Report.pdf`);
    setParseResult(null);
    setIsScenarioDrawerOpen(false);
  };

  // When user selects a standard, automatically synchronize the document template for that standard
  const handleStandardChange = (stdId: string) => {
    setSelectedStandardId(stdId);
    setParseResult(null);

    if (stdId === "auto") {
      return;
    }

    const matched = REALISTIC_BIS_SCENARIOS.find(
      s => s.standardId === stdId || s.standardNumber.toLowerCase().includes(stdId.toLowerCase())
    );

    if (matched) {
      setReportText(matched.reportText);
      setUploadedFileName(`${matched.manufacturer.split(" ")[0]}_${matched.standardNumber.replace(/[^\w]/g, "_")}_Official_Report.pdf`);
    } else {
      const std = standards.find(s => s.id === stdId);
      if (std) {
        setReportText(`NATIONAL ACCREDITED TESTING LABORATORY (NABL)
Accredited under ISO/IEC 17025 | Approved by Bureau of Indian Standards (BIS)
Accreditation No: TC-5489 | ULR Number: ULR-TC548926000001092F
Test Report No: LAB/TR/${Date.now().toString().slice(-6)} | Date: ${new Date().toISOString().split("T")[0]}

CUSTOMER & SAMPLE DETAILS:
Manufacturer: [Enter Manufacturer Name]
Sample Description: ${std.title}
Batch / Lot No: BATCH-2026-01 | Standard Tested: ${std.standardNumber}

TEST RESULTS & STATUTORY CONFORMITY:
${std.clauses?.map((c: any, i: number) => `${i + 1}. ${c.clauseNumber} - ${c.title}:
- Specified Requirement: ${c.acceptableLimit}
- Observed Test Result: [Enter observed test measurement here]
- Compliance Verdict: COMPLIANT
`).join("\n") || "No clauses specified."}
OVERALL REMARKS:
Sample submitted for verification under ${std.standardNumber}.`);
        setUploadedFileName(`${std.standardNumber.replace(/[^\w]/g, "_")}_Test_Report.txt`);
      }
    }
  };

  const handleClearReport = () => {
    setReportText("");
    setUploadedFileName("");
    setParseResult(null);
  };

  // Execute Statutory & Calculation Audit
  const handleParseReport = async () => {
    if (!reportText.trim()) return;

    try {
      setIsParsing(true);
      const res = await fetch("/api/parser/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          standardId: selectedStandardId,
          reportText,
          uploadedFileName,
          calculationMode,
          language
        })
      });

      const data = await res.json();
      if (data.success) {
        setParseResult(data);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      } else {
        alert("Parser error: " + (data.error || "Failed to process report."));
      }
    } catch (err: any) {
      console.error("Parse request error:", err);
      alert("Failed to connect to parser service.");
    } finally {
      setIsParsing(false);
    }
  };

  // Filter clauses
  const filteredClauses = parseResult?.clauseResults.filter(clause => {
    if (clauseFilter === "FAILED") return clause.status === "NON_COMPLIANT";
    if (clauseFilter === "PASSED") return clause.status === "COMPLIANT";
    return true;
  }) || [];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Top Regulatory Header Banner */}
      <div className="bg-gradient-to-r from-[#071E3D] via-[#0E2C5C] to-[#0A2247] p-6 text-white border-b border-blue-900/40 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                Official BIS Portal & NABL Registry Connected
              </span>
              <span className="text-xs text-blue-200 font-mono">ISO/IEC 17025 Statutory Engine</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <span>Compliance Report Parser & Clause Verifier</span>
              <span className="text-xs bg-white/10 text-sky-200 px-2.5 py-1 rounded-lg border border-white/15 font-mono font-normal">
                All Indian Standards (IS)
              </span>
            </h2>
            <p className="text-xs text-blue-100/80 mt-1 max-w-2xl">
              Mathematically audit any official laboratory test report against published Bureau of Indian Standards specifications. Calculates threshold margins, checks ULR integrity, and computes compliance scores.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsScenarioDrawerOpen(!isScenarioDrawerOpen)}
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-sky-200 border border-white/20 px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Load BIS Case Study</span>
            </button>

            <button
              onClick={handleParseReport}
              disabled={isParsing || !reportText.trim()}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isParsing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-sky-200" />
                  <span>Auditing Clauses...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <span>Parse & Calculate Compliance</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Case Study Selector */}
        {isScenarioDrawerOpen && (
          <div className="max-w-6xl mx-auto mt-4 p-4 rounded-xl bg-slate-900/80 border border-blue-400/30 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sky-200 uppercase tracking-wide flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Select an Official BIS Test Report Scenario to Inspect:
              </span>
              <button 
                onClick={() => setIsScenarioDrawerOpen(false)}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Close ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {REALISTIC_BIS_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => handleLoadScenario(sc)}
                  className="text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono font-bold text-white group-hover:text-sky-300">{sc.standardNumber}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      sc.scenario === "PASS" ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                    }`}>
                      {sc.scenario === "PASS" ? "Compliant" : "Fail / Hazard"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium line-clamp-1">{sc.productName}</div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{sc.labName}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto w-full p-6 space-y-6 flex-1">
        {/* Main Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Standard Selection & Ingestion Config */}
          <div className="lg:col-span-4 space-y-5">
            {/* Standard Selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Target Indian Standard (IS)
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {standards.length} Standards Loaded
                </span>
              </div>

              {/* Division Filter Pills */}
              <div className="flex flex-wrap gap-1">
                {["ALL", "Electrotechnical", "Electronics", "Civil", "Food"].map((div) => (
                  <button
                    key={div}
                    onClick={() => setSelectedDivision(div)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                      selectedDivision === div 
                        ? "bg-blue-600 text-white" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {div}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search standard (e.g. IS 1786, Cement, Battery)..."
                  value={standardSearch}
                  onChange={(e) => setStandardSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50"
                />
              </div>

              {/* Standards Dropdown */}
              <select
                value={selectedStandardId}
                onChange={(e) => handleStandardChange(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
              >
                <option value="auto">⚡ Auto-Detect Standard from Report Content</option>
                {filteredStandards.map((std, idx) => (
                  <option key={`${std.id}-${idx}`} value={std.id}>
                    {std.standardNumber} — {std.title.slice(0, 50)}...
                  </option>
                ))}
              </select>

              {/* Calculation Mode Toggle */}
              <div className="pt-3 border-t border-slate-100">
                <label className="text-[11px] font-bold text-slate-600 block mb-1.5 flex items-center justify-between">
                  <span>Calculation Engine Mode:</span>
                  <span className="text-[10px] font-normal text-blue-600">
                    {calculationMode === "strict_numeric" ? "Strict Formula" : "Hybrid AI + Math"}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium">
                  <button
                    onClick={() => setCalculationMode("auto")}
                    className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      calculationMode === "auto" ? "bg-white text-blue-700 shadow-xs font-bold" : "text-slate-600"
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    <span>Auto / Hybrid</span>
                  </button>
                  <button
                    onClick={() => setCalculationMode("strict_numeric")}
                    className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      calculationMode === "strict_numeric" ? "bg-white text-blue-700 shadow-xs font-bold" : "text-slate-600"
                    }`}
                  >
                    <Cpu className="w-3 h-3" />
                    <span>Strict Numeric</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Document Upload Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                Upload Lab Test Document
              </span>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/40 hover:bg-blue-50/70 transition-all rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-center cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Click to browse Lab Report</span>
                  <span className="text-[10px] text-slate-400">PDF, TXT, or scan files</span>
                </div>
                {uploadedFileName && (
                  <span className="inline-block mt-1 px-2.5 py-1 bg-white rounded-md text-[11px] font-mono text-blue-700 border border-blue-200 font-semibold max-w-[200px] truncate">
                    {uploadedFileName}
                  </span>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div className="font-semibold text-slate-700 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Statutory Cross-Examination
                </div>
                <p className="leading-relaxed">
                  Extracts NABL accreditation details, ULR checksums, test methods, specified tolerances, and checks observed readings against statutory thresholds.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Lab Report Content & Audit Trigger */}
          <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Laboratory Test Report Document Content
                </span>
              </div>
              <div className="flex items-center gap-2">
                {reportText && (
                  <button
                    onClick={handleClearReport}
                    className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-2.5 py-1 rounded-md transition-all cursor-pointer"
                  >
                    ✕ Clear Editor
                  </button>
                )}
                <button
                  onClick={() => handleStandardChange(selectedStandardId)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-all cursor-pointer"
                >
                  📄 Reset Template
                </button>
                <span className="text-[11px] font-mono text-slate-400">
                  {reportText.length} chars
                </span>
              </div>
            </div>

            <textarea
              value={reportText}
              onChange={(e) => {
                setReportText(e.target.value);
                setParseResult(null);
              }}
              rows={12}
              className="w-full flex-1 font-mono text-xs text-slate-800 bg-slate-50/70 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 leading-relaxed"
              placeholder="Paste or review official lab test report content here..."
            />

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Ready to cross-examine against official BIS statutory thresholds
              </span>
              <button
                onClick={handleParseReport}
                disabled={isParsing || !reportText.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isParsing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-200" />
                    <span>Auditing Clauses...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                    <span>Parse & Calculate Compliance</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live In-Progress Verification Banner */}
        {isParsing && (
          <div className="bg-gradient-to-r from-[#0B254D] via-[#123C77] to-[#0A2247] text-white rounded-2xl p-6 shadow-xl border border-blue-400/30 flex flex-col items-center justify-center gap-3 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-sky-400/40 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-sky-300 animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-white tracking-wide">
                Auditing Laboratory Test Report Clauses...
              </h3>
              <p className="text-xs text-sky-200/90 max-w-md">
                Cross-examining observed test values against statutory requirements, tolerances, and risk thresholds under selected Indian Standard.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-blue-200 mt-2">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> NABL Data Extraction</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span> Statutory Limits Check</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400"></span> Cryptographic SHA-256 Hash</span>
            </div>
          </div>
        )}

        {/* Results Section */}
        {parseResult && (
          <div ref={resultsRef} id="parser-results" className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-300 scroll-mt-6">
            {/* 1. Executive Summary Banner */}
            <div className={`p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 ${
              parseResult.overallVerdict === "COMPLIANT"
                ? "bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-white border-emerald-300"
                : "bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-white border-rose-300"
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  parseResult.overallVerdict === "COMPLIANT"
                    ? "bg-emerald-600 text-white shadow-emerald-500/30"
                    : "bg-rose-600 text-white shadow-rose-500/30"
                }`}>
                  {parseResult.overallVerdict === "COMPLIANT" ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : (
                    <XCircle className="w-8 h-8" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      parseResult.overallVerdict === "COMPLIANT"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}>
                      Verdict: {parseResult.overallVerdict.replace("_", " ")}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Standard: {parseResult.reportMetadata.standardNumber}
                    </span>
                    {parseResult.reportMetadata.isUlrValid && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> ULR Verified
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {parseResult.overallVerdict === "COMPLIANT"
                      ? "Statutory Compliance Criteria Fulfilled"
                      : "Critical Non-Conformances Identified"}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {parseResult.overallVerdict === "COMPLIANT"
                      ? `All ${parseResult.totalClausesEvaluated} mandatory testing parameters satisfy the specified limits of ${parseResult.reportMetadata.standardNumber}.`
                      : `${parseResult.failedCount} out of ${parseResult.totalClausesEvaluated} clauses breached statutory safety or performance thresholds.`}
                  </p>
                </div>
              </div>

              {/* Compliance Score Meter */}
              <div className="flex items-center gap-4 bg-white/80 backdrop-blur p-4 rounded-xl border border-slate-200/80 shrink-0">
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-900">
                    {parseResult.complianceScore}%
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Compliance Index
                  </div>
                </div>
                <div className="h-10 w-[1px] bg-slate-200"></div>
                <div className="space-y-0.5 text-xs">
                  <div className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {parseResult.passedCount} Passed
                  </div>
                  <div className="text-rose-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    {parseResult.failedCount} Failed
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Metadata Strip */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Testing Laboratory</span>
                <span className="font-bold text-slate-800">{parseResult.reportMetadata.labName}</span>
                <span className="text-[10px] text-blue-600 font-mono block">NABL: {parseResult.reportMetadata.nablAccreditationNo}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ULR Number</span>
                <span className="font-mono font-bold text-slate-800">{parseResult.reportMetadata.ulrNumber}</span>
                <span className="text-[10px] text-slate-500 font-mono block">Report: {parseResult.reportMetadata.reportNumber}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Manufacturer & Batch</span>
                <span className="font-semibold text-slate-800 truncate block">{parseResult.reportMetadata.manufacturer}</span>
                <span className="text-[10px] text-slate-500 font-mono block">Batch: {parseResult.reportMetadata.sampleBatch}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Engine Employed</span>
                <span className="font-semibold text-blue-700 block truncate">{parseResult.engineUsed}</span>
                <span className="text-[10px] text-slate-400 font-mono block">Date: {parseResult.reportMetadata.reportDate}</span>
              </div>
            </div>

            {/* 3. Clause-by-Clause Verification Matrix */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Statutory Clause Verification Matrix</span>
                  </h4>
                  <span className="text-xs text-slate-500">
                    Cross-examination of specified standard limits against observed laboratory values
                  </span>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setClauseFilter("ALL")}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      clauseFilter === "ALL" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"
                    }`}
                  >
                    All ({parseResult.clauseResults.length})
                  </button>
                  <button
                    onClick={() => setClauseFilter("PASSED")}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      clauseFilter === "PASSED" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"
                    }`}
                  >
                    Passed ({parseResult.passedCount})
                  </button>
                  <button
                    onClick={() => setClauseFilter("FAILED")}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      clauseFilter === "FAILED" ? "bg-white text-rose-700 shadow-xs" : "text-slate-600"
                    }`}
                  >
                    Failed ({parseResult.failedCount})
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 uppercase text-[10px] tracking-wider font-bold">
                      <th className="py-3 px-4">Clause</th>
                      <th className="py-3 px-4">Test Parameter</th>
                      <th className="py-3 px-4">Specified Limit (BIS)</th>
                      <th className="py-3 px-4">Observed Lab Value</th>
                      <th className="py-3 px-4 text-center">Deviation</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredClauses.map((clause, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                          {clause.clauseNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{clause.clauseTitle}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{clause.notes}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded font-mono text-[11px]">
                            {clause.specifiedRequirement}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`font-mono font-bold ${
                            clause.status === "NON_COMPLIANT" ? "text-rose-700" : "text-emerald-700"
                          }`}>
                            {clause.observedValue}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {typeof clause.deviationPercent === "number" && clause.deviationPercent !== 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 font-mono">
                              +{clause.deviationPercent}%
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono text-[11px]">0.0%</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                            clause.status === "COMPLIANT"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}>
                            {clause.status === "COMPLIANT" ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            {clause.status === "COMPLIANT" ? "Pass" : "Fail"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Critical Deficiencies & Engineering Remediation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Critical Deficiencies */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Statutory Safety Deficiencies Identified</span>
                </h4>
                {parseResult.criticalDeficiencies.length > 0 ? (
                  <ul className="space-y-2">
                    {parseResult.criticalDeficiencies.map((def, i) => (
                      <li key={i} className="text-xs text-rose-900 bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                        <span className="leading-relaxed font-medium">{def}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Zero critical deficiencies found. Sample strictly complies with all mandatory statutory clauses.</span>
                  </div>
                )}
              </div>

              {/* Engineering Remediation */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Engineering Remediation & BIS Advisory</span>
                </h4>
                <ul className="space-y-2">
                  {parseResult.remediationGuidance.map((rem, i) => (
                    <li key={i} className="text-xs text-slate-700 bg-blue-50/60 border border-blue-100 p-3 rounded-xl flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                      <span className="leading-relaxed">{rem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 5. Cryptographic Certificate Verification */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Cryptographic SHA-256 Digital Verification Hash
                </span>
                <div className="font-mono text-xs text-slate-300 break-all">
                  {parseResult.digitalHash}
                </div>
                <div className="text-[11px] text-slate-400">
                  Tamper-evident audit trail certificate for submission to BIS Directorate / GeM Procurement Portal.
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(parseResult, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `BIS_Audit_Report_${parseResult.reportMetadata.standardNumber.replace(/[^\w]/g, "_")}.json`;
                    a.click();
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-white/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
