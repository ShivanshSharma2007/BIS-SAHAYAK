"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronRight, ChevronLeft, RotateCcw, Check, Loader2,
  AlertTriangle, ExternalLink, Shield, BadgeIndianRupee,
  Clock, FileText, Scale, Building2, Zap,
  ChevronDown, ChevronUp, Phone, Info
} from "lucide-react";

interface CategoryInfo {
  key: string;
  label: string;
  division: string;
  subcategories: string[];
}

interface FeeBreakdownItem {
  item: string;
  amount: string;
  note?: string;
}

interface SchemeRoadmapStep {
  step: number;
  title: string;
  description: string;
  estimatedDays?: string;
  portalUrl?: string;
}

interface QCOReference {
  qcoNumber: string;
  title: string;
  gazetteDate: string;
  ministry: string;
  standardsCovered: string[];
}

interface PenaltyWarning {
  section: string;
  warning: string;
  penalty: string;
}

interface EvaluationResult {
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
  penaltyWarnings: PenaltyWarning[];
  officialPortalUrl: string;
  officialHelpline: string;
  msmeEligible: boolean;
}

const TOTAL_STEPS = 6;

const MANUFACTURING_OPTIONS = [
  { value: "India", label: "Manufactured in India", desc: "Domestic manufacturing facility" },
  { value: "Imported", label: "Imported from outside India", desc: "Foreign manufacturing unit" },
  { value: "Both", label: "Both (Domestic + Imported)", desc: "Multi-country manufacturing" },
];

const AUDIENCE_OPTIONS = [
  { value: "B2C", label: "Direct to Consumer (B2C)", desc: "Retail market / end consumers" },
  { value: "B2B", label: "Industrial / Business (B2B)", desc: "Bulk supply / institutional" },
  { value: "Government", label: "Government Procurement (GeM)", desc: "GeM / PSU / Defence supply" },
];

const SCALE_OPTIONS = [
  { value: "Micro", label: "Micro Enterprise", desc: "Investment ≤ ₹1 Cr · Turnover ≤ ₹5 Cr" },
  { value: "Small", label: "Small Enterprise", desc: "Investment ≤ ₹10 Cr · Turnover ≤ ₹50 Cr" },
  { value: "Medium", label: "Medium Enterprise", desc: "Investment ≤ ₹50 Cr · Turnover ≤ ₹250 Cr" },
  { value: "Large", label: "Large Enterprise", desc: "Above MSME thresholds" },
];

const CERTIFICATION_OPTIONS = [
  { value: "ISO 9001", label: "ISO 9001:2015 (QMS)" },
  { value: "CE", label: "CE Marking (EU)" },
  { value: "FCC", label: "FCC (USA)" },
  { value: "UL", label: "UL Listed (USA)" },
  { value: "CB", label: "CB Scheme (IECEE)" },
  { value: "None", label: "No existing certifications" },
];

export default function NavigatorUI() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [manufacturingLocation, setManufacturingLocation] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [businessScale, setBusinessScale] = useState("");
  const [existingCertifications, setExistingCertifications] = useState<string[]>([]);

  // Results
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    fees: true,
    documents: false,
    roadmap: true,
    qco: false,
    penalties: false,
    standards: false,
  });

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/navigator/evaluate");
        const data = await res.json();
        if (data.success && data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  const currentCategory = categories.find(c => c.key === selectedCategory);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = useCallback(async () => {
    setStep(TOTAL_STEPS + 1);
    setLoading(true);
    try {
      const res = await fetch("/api/navigator/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory,
          subCategory: selectedSubCategory,
          manufacturingLocation,
          targetAudience,
          businessScale,
          existingCertifications,
        }),
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
      }
    } catch (err) {
      console.error("Navigator API evaluation failed:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSubCategory, manufacturingLocation, targetAudience, businessScale, existingCertifications]);

  const handleRestart = () => {
    setStep(1);
    setSelectedCategory("");
    setSelectedSubCategory("");
    setManufacturingLocation("");
    setTargetAudience("");
    setBusinessScale("");
    setExistingCertifications([]);
    setEvaluation(null);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedCategory;
      case 2: return !!selectedSubCategory;
      case 3: return !!manufacturingLocation;
      case 4: return !!targetAudience;
      case 5: return !!businessScale;
      case 6: return existingCertifications.length > 0;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === TOTAL_STEPS) {
      handleSubmit();
    } else if (canProceed()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleCertification = (value: string) => {
    if (value === "None") {
      setExistingCertifications(["None"]);
      return;
    }
    setExistingCertifications(prev => {
      const filtered = prev.filter(c => c !== "None");
      if (filtered.includes(value)) {
        return filtered.filter(c => c !== value);
      }
      return [...filtered, value];
    });
  };

  // Helper to get scheme badge color
  const getSchemeBadgeColor = (code: string) => {
    if (code.includes("CRS")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (code.includes("FMCS")) return "bg-amber-50 text-amber-700 border-amber-200";
    if (code.includes("Hallmarking")) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-blue-50 text-[#163f73] border-blue-200";
  };

  /* ======================================================================= */
  /* RENDER                                                                   */
  /* ======================================================================= */
  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#163f73]" />
              BIS Certification Scheme Navigator
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Official regulatory roadmap · Fee estimations · Documentation requirements
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 py-5">
        {/* ============ WIZARD STEPS ============ */}
        {step <= TOTAL_STEPS ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Step {step} of {TOTAL_STEPS}
                </span>
                <span className="text-[10px] font-bold text-[#163f73]">
                  {Math.round((step / TOTAL_STEPS) * 100)}% Complete
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#163f73] to-[#2563eb] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Product Category */}
            {step === 1 && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Product Category</h3>
                <p className="text-xs text-slate-500 mb-4">Select the primary category of your product by BIS Technical Division</p>
                {loadingCategories ? (
                  <div className="py-12 flex justify-center">
                    <Loader2 className="w-6 h-6 text-[#163f73] animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.key}
                        onClick={() => { setSelectedCategory(cat.key); setSelectedSubCategory(""); }}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer group ${
                          selectedCategory === cat.key
                            ? "border-[#163f73] bg-blue-50/40 ring-1 ring-[#163f73]/20"
                            : "border-slate-200 hover:border-[#163f73]/50 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-semibold block ${selectedCategory === cat.key ? "text-[#163f73]" : "text-slate-700"}`}>
                            {cat.label}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{cat.division}</span>
                        </div>
                        {selectedCategory === cat.key ? (
                          <Check className="w-5 h-5 text-[#163f73] shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#163f73] transition-colors shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Sub-Category */}
            {step === 2 && currentCategory && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Product Sub-Category</h3>
                <p className="text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-[#163f73]">{currentCategory.label}</span> — select the specific product type
                </p>
                <p className="text-[10px] text-slate-400 mb-4">This helps determine the exact Indian Standard (IS) and certification scheme applicable</p>
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {currentCategory.subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubCategory(sub)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer group ${
                        selectedSubCategory === sub
                          ? "border-[#163f73] bg-blue-50/40 ring-1 ring-[#163f73]/20"
                          : "border-slate-200 hover:border-[#163f73]/50 hover:bg-slate-50/50"
                      }`}
                    >
                      <span className={`text-sm font-semibold ${selectedSubCategory === sub ? "text-[#163f73]" : "text-slate-700"}`}>
                        {sub}
                      </span>
                      {selectedSubCategory === sub ? (
                        <Check className="w-5 h-5 text-[#163f73] shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#163f73] transition-colors shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Manufacturing Location */}
            {step === 3 && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Manufacturing Location</h3>
                <p className="text-xs text-slate-500 mb-4">This determines whether Scheme-I (Domestic), FMCS (Foreign), or both apply</p>
                <div className="space-y-2.5">
                  {MANUFACTURING_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setManufacturingLocation(opt.value)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left cursor-pointer group ${
                        manufacturingLocation === opt.value
                          ? "border-[#163f73] bg-blue-50/40 ring-1 ring-[#163f73]/20"
                          : "border-slate-200 hover:border-[#163f73]/50 hover:bg-slate-50/50"
                      }`}
                    >
                      <div>
                        <span className={`text-sm font-semibold block ${manufacturingLocation === opt.value ? "text-[#163f73]" : "text-slate-700"}`}>
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-slate-400">{opt.desc}</span>
                      </div>
                      {manufacturingLocation === opt.value ? (
                        <Check className="w-5 h-5 text-[#163f73] shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#163f73] transition-colors shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Target Audience */}
            {step === 4 && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Target Audience</h3>
                <p className="text-xs text-slate-500 mb-4">Government procurement (GeM) may require additional compliance documentation</p>
                <div className="space-y-2.5">
                  {AUDIENCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTargetAudience(opt.value)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left cursor-pointer group ${
                        targetAudience === opt.value
                          ? "border-[#163f73] bg-blue-50/40 ring-1 ring-[#163f73]/20"
                          : "border-slate-200 hover:border-[#163f73]/50 hover:bg-slate-50/50"
                      }`}
                    >
                      <div>
                        <span className={`text-sm font-semibold block ${targetAudience === opt.value ? "text-[#163f73]" : "text-slate-700"}`}>
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-slate-400">{opt.desc}</span>
                      </div>
                      {targetAudience === opt.value ? (
                        <Check className="w-5 h-5 text-[#163f73] shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#163f73] transition-colors shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Business Scale */}
            {step === 5 && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Business Scale (MSME Status)</h3>
                <p className="text-xs text-slate-500 mb-4">MSME units (Micro/Small/Medium) get <span className="font-bold text-emerald-600">50% fee concession</span> on application & marking fees</p>
                <div className="space-y-2.5">
                  {SCALE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setBusinessScale(opt.value)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left cursor-pointer group ${
                        businessScale === opt.value
                          ? "border-[#163f73] bg-blue-50/40 ring-1 ring-[#163f73]/20"
                          : "border-slate-200 hover:border-[#163f73]/50 hover:bg-slate-50/50"
                      }`}
                    >
                      <div>
                        <span className={`text-sm font-semibold block ${businessScale === opt.value ? "text-[#163f73]" : "text-slate-700"}`}>
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-slate-400">{opt.desc}</span>
                      </div>
                      {businessScale === opt.value ? (
                        <Check className="w-5 h-5 text-[#163f73] shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#163f73] transition-colors shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Existing Certifications */}
            {step === 6 && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Existing Certifications</h3>
                <p className="text-xs text-slate-500 mb-4">Select all international certifications you currently hold (select multiple)</p>
                <div className="space-y-2.5">
                  {CERTIFICATION_OPTIONS.map((opt) => {
                    const isSelected = existingCertifications.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleCertification(opt.value)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left cursor-pointer group ${
                          isSelected
                            ? "border-[#163f73] bg-blue-50/40 ring-1 ring-[#163f73]/20"
                            : "border-slate-200 hover:border-[#163f73]/50 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected ? "bg-[#163f73] border-[#163f73]" : "border-slate-300"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className={`text-sm font-semibold ${isSelected ? "text-[#163f73]" : "text-slate-700"}`}>
                            {opt.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all cursor-pointer ${
                  step === 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 text-xs font-bold px-6 py-2.5 rounded-lg transition-all cursor-pointer ${
                  canProceed()
                    ? "bg-[#163f73] text-white hover:bg-[#1a4d8c] shadow-sm"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {step === TOTAL_STEPS ? "Evaluate Scheme" : "Continue"}
                {step === TOTAL_STEPS ? <Zap className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

        ) : loading ? (
          /* ============ LOADING STATE ============ */
          <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-[#163f73] animate-spin" />
              <Shield className="w-6 h-6 text-[#163f73] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">Evaluating BIS Regulatory Framework...</p>
              <p className="text-xs text-slate-400 mt-1">Analyzing QCO applicability, fee schedules, and compliance requirements</p>
            </div>
          </div>

        ) : evaluation ? (
          /* ============ RESULTS ============ */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 space-y-4">

            {/* Primary Scheme Card */}
            <div className="border border-slate-200 rounded-2xl p-5 shadow-xs bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#163f73] to-[#2563eb]" />
              <div className="pl-3">
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${getSchemeBadgeColor(evaluation.schemeCode)}`}>
                    {evaluation.schemeCode}
                  </span>
                  {evaluation.isMandatoryUnderQCO && (
                    <span className="inline-block px-2.5 py-0.5 bg-red-50 text-red-700 text-[10px] font-bold rounded-full border border-red-200 uppercase tracking-wider">
                      Mandatory QCO
                    </span>
                  )}
                  {evaluation.msmeEligible && (
                    <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 uppercase tracking-wider">
                      MSME Eligible
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-0.5">{evaluation.schemeName}</h3>
                <p className="text-[11px] font-mono font-semibold text-slate-400 mb-2">{evaluation.schemeVariant}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{evaluation.summary}</p>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
                <div className="flex items-center gap-1.5 mb-1">
                  <BadgeIndianRupee className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gov Fee</span>
                </div>
                <span className="text-base font-bold text-slate-900 block">{evaluation.estimatedGovFee}</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lab Testing</span>
                </div>
                <span className="text-base font-bold text-slate-900 block">{evaluation.estimatedLabTestingFee}</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timeline</span>
                </div>
                <span className="text-base font-bold text-[#163f73] block">{evaluation.estimatedTimeline}</span>
              </div>
            </div>

            {/* Collapsible Sections */}

            {/* Fee Breakdown */}
            {evaluation.feeBreakdown && evaluation.feeBreakdown.length > 0 && (
              <CollapsibleSection
                title="Fee Breakdown"
                icon={<BadgeIndianRupee className="w-4 h-4" />}
                isOpen={expandedSections.fees}
                onToggle={() => toggleSection("fees")}
              >
                <div className="divide-y divide-slate-100">
                  {evaluation.feeBreakdown.map((fee, idx) => (
                    <div key={idx} className="flex items-start justify-between py-2.5 gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-slate-700 block">{fee.item}</span>
                        {fee.note && <span className="text-[10px] text-slate-400">{fee.note}</span>}
                      </div>
                      <span className="text-xs font-bold text-slate-900 shrink-0 text-right">{fee.amount}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Certification Roadmap */}
            {evaluation.roadmapSteps && evaluation.roadmapSteps.length > 0 && (
              <CollapsibleSection
                title="Step-by-Step Certification Roadmap"
                icon={<FileText className="w-4 h-4" />}
                isOpen={expandedSections.roadmap}
                onToggle={() => toggleSection("roadmap")}
              >
                <div className="space-y-4">
                  {evaluation.roadmapSteps.map((s, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="shrink-0 flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-[#163f73] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                          {s.step}
                        </div>
                        {idx < evaluation.roadmapSteps.length - 1 && (
                          <div className="w-0.5 flex-1 bg-slate-200 mt-1" />
                        )}
                      </div>
                      <div className="pt-0.5 pb-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-bold text-slate-900">{s.title}</p>
                          {s.estimatedDays && (
                            <span className="text-[9px] font-semibold text-[#163f73] bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100">
                              {s.estimatedDays}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{s.description}</p>
                        {s.portalUrl && (
                          <a
                            href={s.portalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#163f73] mt-1 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {s.portalUrl.replace("https://www.", "").replace("https://", "")}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Required Documents */}
            {evaluation.requiredDocuments && evaluation.requiredDocuments.length > 0 && (
              <CollapsibleSection
                title={`Mandatory Documents (${evaluation.requiredDocuments.length})`}
                icon={<FileText className="w-4 h-4" />}
                isOpen={expandedSections.documents}
                onToggle={() => toggleSection("documents")}
              >
                <div className="space-y-1.5">
                  {evaluation.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Applicable Standards */}
            {evaluation.applicableStandards && evaluation.applicableStandards.length > 0 && (
              <CollapsibleSection
                title="Applicable Indian Standards"
                icon={<Scale className="w-4 h-4" />}
                isOpen={expandedSections.standards}
                onToggle={() => toggleSection("standards")}
              >
                <div className="space-y-1.5">
                  {evaluation.applicableStandards.map((std, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Info className="w-3.5 h-3.5 text-[#163f73] shrink-0 mt-0.5" />
                      <span className="font-medium">{std}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* QCO References */}
            {evaluation.applicableQCOs && evaluation.applicableQCOs.length > 0 && (
              <CollapsibleSection
                title="Quality Control Order (QCO) References"
                icon={<Building2 className="w-4 h-4" />}
                isOpen={expandedSections.qco}
                onToggle={() => toggleSection("qco")}
              >
                <div className="space-y-3">
                  {evaluation.applicableQCOs.map((qco, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#163f73] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {qco.qcoNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">{qco.gazetteDate}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700">{qco.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Ministry: {qco.ministry}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {qco.standardsCovered.map((std, i) => (
                          <span key={i} className="text-[9px] font-mono font-semibold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {std}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Penalty Warnings */}
            {evaluation.penaltyWarnings && evaluation.penaltyWarnings.length > 0 && (
              <CollapsibleSection
                title="Penalty & Non-Compliance Warnings"
                icon={<AlertTriangle className="w-4 h-4" />}
                isOpen={expandedSections.penalties}
                onToggle={() => toggleSection("penalties")}
                variant="danger"
              >
                <div className="space-y-3">
                  {evaluation.penaltyWarnings.map((pw, idx) => (
                    <div key={idx} className="bg-red-50/50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs font-bold text-red-800 mb-0.5">{pw.section}</p>
                      <p className="text-xs text-red-700 leading-relaxed">{pw.warning}</p>
                      <p className="text-[10px] font-semibold text-red-600 mt-1.5 bg-red-100/50 px-2 py-1 rounded">
                        ⚖️ Penalty: {pw.penalty}
                      </p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Official Portal & Helpline */}
            <div className="bg-gradient-to-r from-[#163f73] to-[#1e5399] rounded-2xl p-5 text-white">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-3">Official BIS Resources</h4>
              <div className="space-y-2.5">
                <a
                  href={evaluation.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-white hover:text-blue-200 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Apply Online: {evaluation.officialPortalUrl.replace("https://www.", "").replace("https://", "")}
                </a>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs">{evaluation.officialHelpline}</span>
                </div>
              </div>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ========================================================================= */
/* Collapsible Section Component                                             */
/* ========================================================================= */
function CollapsibleSection({
  title,
  icon,
  isOpen,
  onToggle,
  children,
  variant = "default",
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  variant?: "default" | "danger";
}) {
  return (
    <div className={`bg-white border rounded-2xl shadow-2xs overflow-hidden ${
      variant === "danger" ? "border-red-200" : "border-slate-200"
    }`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors cursor-pointer ${
          variant === "danger" ? "hover:bg-red-50/30" : "hover:bg-slate-50/50"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={variant === "danger" ? "text-red-500" : "text-[#163f73]"}>{icon}</span>
          <span className={`text-xs font-bold uppercase tracking-wider ${
            variant === "danger" ? "text-red-700" : "text-slate-800"
          }`}>
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
