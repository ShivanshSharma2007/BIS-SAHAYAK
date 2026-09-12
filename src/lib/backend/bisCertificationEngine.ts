/**
 * BIS Certification Scheme Navigator — Rules Engine
 * =====================================================
 * Comprehensive decision engine covering ALL official BIS certification schemes.
 * Data sourced from:
 *   - Bureau of Indian Standards Act 2016 & Rules 2018
 *   - BIS (Conformity Assessment) Regulations 2018
 *   - DPIIT Quality Control Orders (QCOs) Gazette Notifications
 *   - BIS Fee Notification dated 05.08.2021 (as amended 21.09.2021)
 *   - www.manakonline.in / www.crsbis.in / www.bis.gov.in
 */

import {
  NavigatorAssessmentInputV2,
  NavigatorAssessmentResultV2,
  FeeBreakdownItem,
  SchemeRoadmapStep,
  QCOReference,
} from "./types";

/* ========================================================================= */
/* PRODUCT CATEGORY → SUB-CATEGORY MAP                                       */
/* ========================================================================= */
export const PRODUCT_CATEGORIES: Record<string, {
  label: string;
  division: string;        // BIS Technical Division
  subcategories: string[];
}> = {
  "electronics_it": {
    label: "Electronics & IT Equipment",
    division: "Electronics & IT Division (LITD)",
    subcategories: [
      "Mobile Phones & Tablets",
      "Laptop / Notebook Computers",
      "LED Luminaires & Drivers",
      "Power Adapters / Chargers",
      "Smart TV / Set-Top Box / Projectors",
      "UPS / Inverters (≤5 kVA)",
      "Printers / Scanners / Monitors",
      "Audio / Video Equipment",
      "Network Switches / Routers",
      "Solar PV Inverters & Modules",
    ],
  },
  "electrical_wiring": {
    label: "Electrical Wiring & Accessories",
    division: "Electrotechnical Division (ETD)",
    subcategories: [
      "PVC Insulated Cables & Wires",
      "Plugs & Socket-Outlets (≤16A)",
      "Switches & MCBs",
      "Ceiling Fans & Regulators",
      "Electric Motors",
      "Transformers & Stabilizers",
      "Distribution Boards / Panels",
    ],
  },
  "home_appliances": {
    label: "Home & Kitchen Appliances",
    division: "Electrotechnical Division (ETD)",
    subcategories: [
      "Domestic Gas Stoves",
      "Pressure Cookers",
      "Mixer / Grinder / Juicers",
      "Iron / Toasters / Kettles",
      "Room Air Conditioners",
      "Water Heaters / Geysers",
      "Washing Machines",
      "Refrigerators / Freezers",
      "Microwave Ovens",
    ],
  },
  "automotive": {
    label: "Automotive Components",
    division: "Transport Engineering Division (TED)",
    subcategories: [
      "Helmets (Two-Wheeler)",
      "Automotive Safety Glass",
      "Tyres & Tubes",
      "Lead-Acid Batteries (Automotive)",
      "Lithium-Ion Batteries (EV)",
      "Brake Linings & Pads",
      "Seat Belts & Restraints",
      "Automotive Horns",
    ],
  },
  "chemicals_fertilizers": {
    label: "Chemicals & Fertilizers",
    division: "Chemical Division (CHD)",
    subcategories: [
      "Cement (OPC / PPC / PSC)",
      "White Cement & Coloured Cement",
      "Paints & Varnishes",
      "LPG Cylinders & Valves",
      "Household Insecticides",
      "Detergents & Soaps",
      "Fertilizers (Urea / DAP / NPK)",
      "Industrial Chemicals",
    ],
  },
  "textiles_footwear": {
    label: "Textiles & Footwear",
    division: "Textile Division (TXD)",
    subcategories: [
      "Cotton Fabrics & Yarn",
      "Readymade Garments",
      "Polyester / Blended Fabrics",
      "Leather Footwear",
      "Rubber / PVC Footwear",
      "Jute Products",
      "Sewing Thread",
    ],
  },
  "food_agriculture": {
    label: "Food & Agriculture Products",
    division: "Food & Agriculture Division (FAD)",
    subcategories: [
      "Packaged Drinking Water",
      "Mineral Water",
      "Milk & Dairy Products",
      "Edible Oils & Fats",
      "Wheat Flour / Atta",
      "Rice & Cereals",
      "Honey",
      "Infant Food / Formula",
      "Spices & Condiments",
    ],
  },
  "construction_materials": {
    label: "Construction & Building Materials",
    division: "Civil Engineering Division (CED)",
    subcategories: [
      "Steel Bars & Rods (TMT)",
      "Structural Steel Sections",
      "Plywood & MDF Boards",
      "Ceramic / Vitrified Tiles",
      "PVC / CPVC Pipes & Fittings",
      "GI / CI Pipes",
      "Roofing Sheets (Asbestos/GI)",
      "Sanitary Ware",
      "Float Glass & Safety Glass",
    ],
  },
  "medical_devices": {
    label: "Medical Devices & Healthcare",
    division: "Medical Equipment Division (MED)",
    subcategories: [
      "Surgical Gloves",
      "Syringes & Needles",
      "Condoms",
      "Clinical Thermometers",
      "Wheelchairs & Mobility Aids",
      "Implantable Devices",
      "Diagnostic Equipment",
    ],
  },
  "gold_silver_jewellery": {
    label: "Gold & Silver Jewellery",
    division: "Metallurgy Division (MTD)",
    subcategories: [
      "Gold Jewellery & Artefacts",
      "Gold Coins & Bars",
      "Silver Jewellery & Artefacts",
      "Silver Coins & Bars",
    ],
  },
  "toys_children": {
    label: "Toys & Children Products",
    division: "Mechanical Engineering Division (MED/PCD)",
    subcategories: [
      "Plastic Toys",
      "Stuffed & Soft Toys",
      "Riding Toys / Tricycles",
      "Electrical / Electronic Toys",
      "Projectile & Water Toys",
    ],
  },
  "rubber_plastics": {
    label: "Rubber & Plastic Products",
    division: "Petroleum, Coal & Related Products Division (PCD)",
    subcategories: [
      "PVC Pipes (Non-pressure)",
      "HDPE / LDPE Films",
      "Rubber Hoses & Belting",
      "Carry Bags & Packaging Film",
      "Water Storage Tanks (Plastic)",
    ],
  },
  "steel_metals": {
    label: "Steel & Metals",
    division: "Metallurgy Division (MTD)",
    subcategories: [
      "Stainless Steel Utensils",
      "Aluminium Utensils",
      "Hot-Rolled Steel Coils",
      "Cold-Rolled Steel Strips",
      "Galvanized Steel Sheets",
    ],
  },
  "water_purification": {
    label: "Water Purification & Treatment",
    division: "Chemical Division (CHD)",
    subcategories: [
      "Gravity-Based Water Purifiers",
      "RO / UV Water Purifiers",
      "Water Filter Candles / Cartridges",
    ],
  },
  "solar_renewable": {
    label: "Solar & Renewable Energy",
    division: "Electrotechnical Division (ETD) / MNRE",
    subcategories: [
      "Solar PV Modules (Crystalline Si)",
      "Solar PV Inverters (Grid-tied)",
      "Solar PV Inverters (Off-grid)",
      "Solar Water Heating Systems",
      "Solar Lanterns & LED Luminaires",
      "Lithium-Ion Cells & Battery Packs",
    ],
  },
};

/* ========================================================================= */
/* OFFICIAL QCO GAZETTE REFERENCES                                           */
/* ========================================================================= */
const QCO_DATABASE: QCOReference[] = [
  {
    qcoNumber: "S.O. 1293(E)",
    title: "Electrical Wires, Cables & Appliances QCO",
    gazetteDate: "2003-11-14",
    ministry: "DPIIT",
    standardsCovered: ["IS 694", "IS 1293", "IS 302", "IS 3854"],
    penaltySections: ["Section 14", "Section 29"],
  },
  {
    qcoNumber: "S.O. 4511(E)",
    title: "Plugs, Socket-Outlets and Switches QCO",
    gazetteDate: "2020-12-15",
    ministry: "DPIIT",
    standardsCovered: ["IS 1293:2019"],
    penaltySections: ["Section 14", "Section 29"],
  },
  {
    qcoNumber: "S.O. 5765(E)",
    title: "Electronics & IT Goods (CRS) QCO",
    gazetteDate: "2012-10-03",
    ministry: "MeitY",
    standardsCovered: ["IS 13252", "IS 616", "IS 10322", "IS 15885"],
    penaltySections: ["Section 17", "Section 29"],
  },
  {
    qcoNumber: "S.O. 2422(E)",
    title: "Cement QCO",
    gazetteDate: "2003-09-17",
    ministry: "DPIIT",
    standardsCovered: ["IS 269", "IS 455", "IS 1489", "IS 8041", "IS 8042", "IS 8043"],
    penaltySections: ["Section 14", "Section 29"],
  },
  {
    qcoNumber: "S.O. 1350(E)",
    title: "Steel Products QCO",
    gazetteDate: "2015-05-15",
    ministry: "Ministry of Steel",
    standardsCovered: ["IS 1786", "IS 2062", "IS 277"],
    penaltySections: ["Section 14", "Section 29"],
  },
  {
    qcoNumber: "S.O. 820(E)",
    title: "Toys QCO",
    gazetteDate: "2021-03-01",
    ministry: "DPIIT",
    standardsCovered: ["IS 9873 (Part 1-9)", "IS 15644"],
    penaltySections: ["Section 14", "Section 29", "Section 30"],
  },
  {
    qcoNumber: "S.O. 5765(E) / MNRE",
    title: "Solar PV Systems & Components QCO",
    gazetteDate: "2017-12-05",
    ministry: "MNRE / MeitY",
    standardsCovered: ["IS 14286", "IS 16169", "IS 16221"],
    penaltySections: ["Section 14", "Section 17"],
  },
  {
    qcoNumber: "S.O. 1888(E)",
    title: "Helmets QCO",
    gazetteDate: "2018-06-08",
    ministry: "DPIIT",
    standardsCovered: ["IS 4151"],
    penaltySections: ["Section 14", "Section 29"],
  },
  {
    qcoNumber: "S.O. 990(E)",
    title: "LPG Cylinder Valves QCO",
    gazetteDate: "2012-02-29",
    ministry: "DPIIT / MoPNG",
    standardsCovered: ["IS 8737", "IS 3196"],
    penaltySections: ["Section 14", "Section 29"],
  },
  {
    qcoNumber: "Hallmarking Order 2021",
    title: "Mandatory Hallmarking of Gold & Silver Jewellery",
    gazetteDate: "2021-06-23",
    ministry: "Ministry of Consumer Affairs",
    standardsCovered: ["IS 1417", "IS 2112"],
    penaltySections: ["Section 14", "Section 29", "Section 30"],
  },
  {
    qcoNumber: "FSSAI Notification",
    title: "Packaged Drinking Water QCO",
    gazetteDate: "2019-07-01",
    ministry: "MoHFW / FSSAI / DPIIT",
    standardsCovered: ["IS 10500", "IS 14543"],
    penaltySections: ["Section 14", "Section 29"],
  },
  {
    qcoNumber: "S.O. 3480(E)",
    title: "Safety Glass QCO",
    gazetteDate: "2008-07-15",
    ministry: "DPIIT",
    standardsCovered: ["IS 2553"],
    penaltySections: ["Section 14", "Section 29"],
  },
];

/* ========================================================================= */
/* PENALTY REFERENCE DATABASE (BIS Act 2016)                                 */
/* ========================================================================= */
const BIS_ACT_PENALTIES: Record<string, { section: string; description: string; penalty: string }> = {
  "Section 14": {
    section: "Section 14 — Contravention of QCO",
    description: "Manufacturing, importing, distributing or selling any product covered under QCO without valid BIS license/registration.",
    penalty: "Imprisonment up to 2 years + Fine up to ₹5,00,000 (first offence); up to 5 years + ₹10,00,000 (subsequent)",
  },
  "Section 17": {
    section: "Section 17 — Misuse of Standard Mark",
    description: "Using BIS Standard Mark (ISI/Hallmark) without valid licence or on goods not conforming to Indian Standard.",
    penalty: "Imprisonment up to 1 year + Fine up to ₹1,00,000",
  },
  "Section 29": {
    section: "Section 29 — General Penalty",
    description: "Contravention of any provisions of the BIS Act or Rules for which no specific penalty is prescribed.",
    penalty: "Fine up to ₹2,00,000 (first offence); ₹5,00,000 (subsequent)",
  },
  "Section 30": {
    section: "Section 30 — Offences by Companies",
    description: "Where offence is committed by a company, every director/manager/secretary who was in charge and responsible shall be liable.",
    penalty: "Personal criminal liability for directors and key managerial personnel",
  },
};

/* ========================================================================= */
/* CORE EVALUATION ENGINE                                                     */
/* ========================================================================= */
export function evaluateScheme(input: NavigatorAssessmentInputV2): NavigatorAssessmentResultV2 {
  const {
    category,
    subCategory,
    manufacturingLocation,
    targetAudience,
    businessScale,
    existingCertifications,
  } = input;

  const isImported = manufacturingLocation === "Imported" || manufacturingLocation === "Both";
  const isDomestic = manufacturingLocation === "India" || manufacturingLocation === "Both";
  const isMSME = businessScale === "Micro" || businessScale === "Small" || businessScale === "Medium";
  const isGovtTarget = targetAudience === "Government";
  const catInfo = PRODUCT_CATEGORIES[category];
  const divisionLabel = catInfo?.division || "General";

  // ========== HALLMARKING SCHEME ==========
  if (category === "gold_silver_jewellery") {
    return buildHallmarkingResult(input, subCategory, isMSME);
  }

  // ========== CRS (Electronics & IT) ==========
  if (category === "electronics_it" || category === "solar_renewable") {
    if (isImported && !isDomestic) {
      // Foreign manufacturer of electronics needs FMCS + CRS
      return buildFMCSResult(input, catInfo, isMSME, true);
    }
    return buildCRSResult(input, catInfo, isMSME);
  }

  // ========== FMCS (Foreign Manufacturers) ==========
  if (isImported && !isDomestic) {
    return buildFMCSResult(input, catInfo, isMSME, false);
  }

  // ========== TOYS ==========
  if (category === "toys_children") {
    return buildToysResult(input, catInfo, isMSME, isImported);
  }

  // ========== DEFAULT: Scheme-I ISI Mark ==========
  return buildSchemeIResult(input, catInfo, isMSME, isGovtTarget);
}

/* ========================================================================= */
/* SCHEME BUILDERS                                                           */
/* ========================================================================= */

function buildSchemeIResult(
  input: NavigatorAssessmentInputV2,
  catInfo: typeof PRODUCT_CATEGORIES[string] | undefined,
  isMSME: boolean,
  isGovtTarget: boolean,
): NavigatorAssessmentResultV2 {
  const category = input.category;
  const feeMultiplier = isMSME ? 0.5 : 1.0; // 50% concession for MSME
  const baseAppFee = 1000;
  const markingFee = isMSME ? 1000 : 2000; // Min annual marking fee
  const labTestFee = getLabTestFee(category);

  const feeBreakdown: FeeBreakdownItem[] = [
    { item: "Application Fee (Form IV)", amount: `₹${(baseAppFee * feeMultiplier).toLocaleString("en-IN")}`, note: isMSME ? "50% MSME concession applied" : "Standard rate" },
    { item: "Processing & Assessment Fee", amount: `₹5,000`, note: "Non-refundable" },
    { item: "Factory Inspection Charges", amount: `₹10,000 - ₹15,000`, note: "Travel + DA of BIS officers" },
    { item: "Lab Testing Fee (per sample)", amount: labTestFee, note: "At NABL accredited / BIS recognized lab" },
    { item: "Annual Marking Fee (Minimum)", amount: `₹${markingFee.toLocaleString("en-IN")}`, note: isMSME ? "50% MSME concession (Min ₹1,000/year)" : "Minimum ₹2,000/year or 0.2% of ex-factory value" },
    { item: "ISI Mark Usage / Stamping", amount: "Included in marking fee", note: "After CM/L grant" },
  ];

  const applicableQCOs = getQCOsForCategory(category);

  const roadmapSteps: SchemeRoadmapStep[] = [
    {
      step: 1,
      title: "Online Application Filing (Form IV)",
      description: "Register on BIS Manak Online portal (manakonline.in) under e-BIS Scheme-I. Fill Form IV with factory, product & testing details.",
      estimatedDays: "1-2 days",
      portalUrl: "https://www.manakonline.in",
    },
    {
      step: 2,
      title: "Document Scrutiny by Branch Office",
      description: "BIS Branch Office reviews application, factory license, quality manual, testing equipment list, and raw material sourcing documents.",
      estimatedDays: "7-15 days",
    },
    {
      step: 3,
      title: "Preliminary Factory Inspection",
      description: "BIS technical officer visits factory to audit manufacturing setup, in-house testing lab, quality control processes, and raw material storage.",
      estimatedDays: "1-2 days (on-site)",
    },
    {
      step: 4,
      title: "Independent Sample Testing",
      description: "Factory-sealed samples sent to National Test House (NTH) or BIS-recognized NABL accredited laboratory for complete conformity testing.",
      estimatedDays: "15-30 days",
    },
    {
      step: 5,
      title: "Technical Committee Review",
      description: "Test reports and inspection findings reviewed by BIS technical committee for compliance with applicable Indian Standard.",
      estimatedDays: "7-10 days",
    },
    {
      step: 6,
      title: "Grant of ISI License (CM/L Number)",
      description: "On satisfactory compliance, BIS grants CM/L license certificate. Pay annual minimum marking fee to activate license.",
      estimatedDays: "3-5 days",
    },
    {
      step: 7,
      title: "Periodic Surveillance & Market Monitoring",
      description: "Annual surprise factory inspections, periodic market sample purchases and testing. Licence valid for duration of compliance.",
      estimatedDays: "Ongoing (annual)",
    },
  ];

  const totalTimeline = "30-60 days";
  const penaltyWarnings = buildPenaltyWarnings(applicableQCOs);

  return {
    schemeName: "Product Certification Scheme — ISI Mark",
    schemeCode: "Scheme-I",
    schemeVariant: "Domestic Manufacturing",
    summary: `Traditional BIS conformity certification verifying that your domestic manufacturing facility consistently produces products conforming to the published Indian Standard. Mandatory for products covered under Quality Control Orders (QCOs). ${isMSME ? "MSME units enjoy 50% fee concession on application and marking fees." : ""}`,
    isMandatoryUnderQCO: true,
    estimatedGovFee: isMSME ? "₹7,000 - ₹12,000 (with MSME concession)" : "₹16,000 - ₹22,000",
    estimatedLabTestingFee: labTestFee,
    estimatedTimeline: totalTimeline,
    applicableStandards: getStandardsForCategory(input.category, input.subCategory),
    requiredDocuments: [
      "BIS Form IV — Application for Grant of Licence (Scheme-I)",
      "MSME Udyam Registration Certificate (if applicable)",
      "Factory License / Manufacturing Unit Registration",
      "List of Plant & Machinery with capacity details",
      "List of In-House Testing Equipment with valid calibration certificates (NABL traceable)",
      "Quality Manual / Process Control Plan adhering to ISO 9001:2015",
      "Raw Material Test Certificates & Approved Vendor Invoices",
      "Factory Layout Drawing with production flow diagram",
      "Previous 3 months' production records (if existing unit)",
      "Scheme of Testing and Inspection (STI) declaration",
      isGovtTarget ? "GeM Registration Certificate (for government supply eligibility)" : null,
    ].filter(Boolean) as string[],
    roadmapSteps,
    feeBreakdown,
    applicableQCOs,
    penaltyWarnings,
    officialPortalUrl: "https://www.manakonline.in",
    officialHelpline: "BIS Care: 1800-11-4000 (Toll-Free) | care@bis.gov.in",
    msmeEligible: isMSME,
  };
}

function buildCRSResult(
  input: NavigatorAssessmentInputV2,
  catInfo: typeof PRODUCT_CATEGORIES[string] | undefined,
  isMSME: boolean,
): NavigatorAssessmentResultV2 {
  const isSolar = input.category === "solar_renewable";

  const feeBreakdown: FeeBreakdownItem[] = [
    { item: "Application Fee (Online CRS Portal)", amount: "₹1,000", note: "Non-refundable" },
    { item: "Registration Fee (2-year validity)", amount: isSolar ? "₹50,000" : "₹25,000 - ₹50,000", note: "Per product model/variant" },
    { item: "Lab Testing Fee (NABL Lab)", amount: isSolar ? "₹80,000 - ₹1,50,000" : "₹25,000 - ₹65,000", note: "Depends on product complexity and standards" },
    { item: "Inclusion of Additional Model/Variant", amount: "₹10,000 - ₹20,000", note: "Incremental per model under same registration" },
    { item: "Renewal Fee (every 2 years)", amount: "₹10,000 - ₹25,000", note: "Must submit fresh test report within 90 days" },
  ];

  const applicableQCOs = getQCOsForCategory(input.category);

  const roadmapSteps: SchemeRoadmapStep[] = [
    {
      step: 1,
      title: "Product Sample Testing at BIS-Recognized Lab",
      description: "Submit product samples to a NABL accredited lab recognized by BIS for complete safety and performance evaluation per applicable Indian Standard.",
      estimatedDays: "7-15 days",
    },
    {
      step: 2,
      title: "Obtain Official Test Report",
      description: "Receive conformity test report (valid for 90 days from issuance). Report must reference exact IS number and all test parameters.",
      estimatedDays: "3-5 days",
    },
    {
      step: 3,
      title: "File Online CRS Application",
      description: "Upload test report, brand/trademark authorization, product photos, and rating plate artwork on the CRS portal (crsbis.in).",
      estimatedDays: "1-2 days",
      portalUrl: "https://www.crsbis.in",
    },
    {
      step: 4,
      title: "BIS Digital Scrutiny (Desk Review)",
      description: "BIS officer reviews test reports and documentation digitally. No physical factory audit is required under CRS for most product categories.",
      estimatedDays: "5-10 days",
    },
    {
      step: 5,
      title: "Registration Grant & R-Number Issuance",
      description: "Receive unique 8-digit R-number (e.g., R-41XXXXXX) for mandatory product labeling. Registration valid for 2 years.",
      estimatedDays: "2-3 days",
    },
    {
      step: 6,
      title: "Market Surveillance & Renewal",
      description: "BIS conducts periodic market sample testing. Registration must be renewed every 2 years with fresh test reports.",
      estimatedDays: "Ongoing (biennial renewal)",
    },
  ];

  return {
    schemeName: "Compulsory Registration Scheme (CRS)",
    schemeCode: "Scheme-II (CRS)",
    schemeVariant: isSolar ? "Solar & Renewable Energy Equipment" : "Electronics & IT Products",
    summary: `Self-declaration based conformity assessment for ${isSolar ? "solar PV and renewable energy" : "electronics, IT, and audio-visual"} equipment. No factory inspection is required — registration is based on test reports from BIS-recognized NABL accredited laboratories. Mandatory for all products notified under ${isSolar ? "MNRE and MeitY" : "MeitY"} Quality Control Orders.`,
    isMandatoryUnderQCO: true,
    estimatedGovFee: "₹26,000 - ₹51,000 (Application + Registration)",
    estimatedLabTestingFee: isSolar ? "₹80,000 - ₹1,50,000" : "₹25,000 - ₹65,000",
    estimatedTimeline: "15-30 days (Fast-Track Digital Flow)",
    applicableStandards: getStandardsForCategory(input.category, input.subCategory),
    requiredDocuments: [
      "NABL Accredited Test Report (conforming to applicable IS) — issued within last 90 days",
      "Brand Trademark Registration Certificate (or Brand Owner Authorization Letter)",
      "Undertaking for Compliance to CRS Guidelines (Annexure-I)",
      "Product Rating Plate / Marking Label Artwork (with model/variant details)",
      "Factory / Business Registration (GST, Udyog Aadhaar / Udyam if MSME)",
      "Manufacturer Authorization Letter (for brands using third-party manufacturing)",
      "Previous CRS Registration Certificate (for renewal/inclusion applications)",
      "Product Photos — Front, Back, Label, Rating Plate (high-resolution)",
    ],
    roadmapSteps,
    feeBreakdown,
    applicableQCOs,
    penaltyWarnings: buildPenaltyWarnings(applicableQCOs),
    officialPortalUrl: "https://www.crsbis.in",
    officialHelpline: "CRS Helpdesk: crs@bis.gov.in | 011-2323 1946",
    msmeEligible: isMSME,
  };
}

function buildFMCSResult(
  input: NavigatorAssessmentInputV2,
  catInfo: typeof PRODUCT_CATEGORIES[string] | undefined,
  isMSME: boolean,
  isCRSProduct: boolean,
): NavigatorAssessmentResultV2 {
  const feeBreakdown: FeeBreakdownItem[] = [
    { item: "Application Fee (Form V)", amount: "₹1,00,000", note: "Non-refundable, payable to BIS HQ" },
    { item: "Assessment & Processing Fee", amount: "₹20,000 - ₹30,000", note: "Depends on product category" },
    { item: "BIS Inspection Team Travel (International)", amount: "USD $5,000 - $8,000", note: "Actual airfare + per diem as per BIS rules" },
    { item: "Hotel & Accommodation of BIS Officers", amount: "USD $1,500 - $3,000", note: "For 3-5 day factory inspection" },
    { item: "Lab Testing Fee (in Indian NABL Lab)", amount: "₹45,000 - ₹1,20,000", note: "Drawn samples tested in India" },
    { item: "Annual Marking Fee", amount: "₹2,000 minimum / 0.2% FOB value", note: "Whichever is higher" },
    { item: "AIR Appointment Registration", amount: "₹5,000", note: "Authorized Indian Representative filing" },
  ];

  const applicableQCOs = getQCOsForCategory(input.category);

  const roadmapSteps: SchemeRoadmapStep[] = [
    {
      step: 1,
      title: "Appoint Authorized Indian Representative (AIR)",
      description: "Nominate a resident Indian citizen or registered Indian entity as AIR. AIR must be domiciled in India and authorized to act on behalf of the foreign manufacturer.",
      estimatedDays: "5-10 days",
    },
    {
      step: 2,
      title: "Submit Form-V Application Online",
      description: "File FMCS application on BIS portal through AIR with factory details, manufacturing process, testing capacity, and quality management system documentation.",
      estimatedDays: "3-5 days",
      portalUrl: "https://www.manakonline.in/FMCS/eBISLogin",
    },
    {
      step: 3,
      title: "Document Verification & Pre-Approval",
      description: "BIS Central Marks Department (CMD) reviews submitted documents and grants preliminary approval for factory inspection.",
      estimatedDays: "15-30 days",
    },
    {
      step: 4,
      title: "Factory Inspection by BIS Officers",
      description: "BIS inspection team (2-3 officers) visits foreign manufacturing plant for comprehensive process audit, quality system review, and drawing of test samples.",
      estimatedDays: "3-5 days (on-site)",
    },
    {
      step: 5,
      title: "Sample Testing in BIS-Recognized Indian Lab",
      description: "Samples drawn during factory inspection are shipped to India and tested at NABL accredited / BIS recognized laboratories.",
      estimatedDays: "20-45 days",
    },
    {
      step: 6,
      title: "Review by Technical Committee",
      description: "Inspection reports and test results reviewed by BIS technical committee. Factory may be asked to address non-conformities.",
      estimatedDays: "10-15 days",
    },
    {
      step: 7,
      title: "Grant of Licence & CM/L Issuance",
      description: "On satisfactory compliance, BIS grants FMCS licence with CM/L number. Pay marking fees to activate license for ISI mark usage.",
      estimatedDays: "5-7 days",
    },
    {
      step: 8,
      title: "Periodic Surveillance Inspections",
      description: "Annual/biennial re-inspections at foreign factory. Market samples in India also tested periodically.",
      estimatedDays: "Ongoing (annual/biennial)",
    },
  ];

  return {
    schemeName: "Foreign Manufacturers Certification Scheme (FMCS)",
    schemeCode: "Scheme-I (FMCS)",
    schemeVariant: isCRSProduct ? "FMCS for CRS Products (Electronics/IT)" : "FMCS for QCO Products",
    summary: `Mandatory certification scheme for foreign manufacturing units exporting goods into India under Quality Control Orders. Requires appointment of an Authorized Indian Representative (AIR), factory inspection by BIS officers at the foreign facility, and sample testing in Indian NABL laboratories. ${isCRSProduct ? "For electronics/IT products, FMCS registration may be combined with CRS requirements." : ""}`,
    isMandatoryUnderQCO: true,
    estimatedGovFee: "₹1,20,000 + USD $7,000 - $12,000 (Inspection & Travel)",
    estimatedLabTestingFee: "₹45,000 - ₹1,20,000",
    estimatedTimeline: "90-150 days",
    applicableStandards: getStandardsForCategory(input.category, input.subCategory),
    requiredDocuments: [
      "BIS Form V — Application for FMCS Licence",
      "Appointment of Authorized Indian Representative (AIR) — notarized and apostilled",
      "AIR Identity Proof (Aadhaar + PAN) and Indian Address Proof",
      "Factory Manufacturing Process Flowchart with Machinery List & capacity details",
      "Quality Management System Certificate (ISO 9001:2015 preferred)",
      "In-house Laboratory Equipment List with Calibration Certificates",
      "Product Technical Specifications & Test Reports (from accredited labs)",
      "Factory Registration / Business License of foreign entity",
      "Import-Export Code (IEC) of the Indian importer (if applicable)",
      "Customs Undertaking for Sample Consignments into India",
      "Previous certifications held (CE, FCC, UL, CB — if any)",
      "Passport copies of factory key personnel for inspection coordination",
    ],
    roadmapSteps,
    feeBreakdown,
    applicableQCOs,
    penaltyWarnings: buildPenaltyWarnings(applicableQCOs),
    officialPortalUrl: "https://www.manakonline.in/FMCS/eBISLogin",
    officialHelpline: "FMCS Cell: fmcs@bis.gov.in | 011-2323 5229",
    msmeEligible: false,
  };
}

function buildHallmarkingResult(
  input: NavigatorAssessmentInputV2,
  subCategory: string,
  isMSME: boolean,
): NavigatorAssessmentResultV2 {
  const isGold = subCategory.toLowerCase().includes("gold");
  const isSilver = subCategory.toLowerCase().includes("silver");

  const feeBreakdown: FeeBreakdownItem[] = [
    { item: "Registration Fee (Jeweller)", amount: "₹7,500 (1 year) / ₹12,000 (3 years)", note: "Per registered showroom/outlet" },
    { item: "HUID Hallmarking Charge per Article", amount: isGold ? "₹45 per article" : "₹25 per article", note: "Charged by BIS-recognized Assaying & Hallmarking Centre" },
    { item: "Purity Testing (Assaying) Fee", amount: "₹200 - ₹500 per lot", note: "XRF or Fire Assay method" },
    { item: "HUID Engraving & Certification", amount: "Included in hallmarking charge", note: "Unique 6-character alphanumeric HUID stamped on article" },
  ];

  const applicableQCOs: QCOReference[] = [
    QCO_DATABASE.find(q => q.qcoNumber === "Hallmarking Order 2021")!,
  ].filter(Boolean);

  const roadmapSteps: SchemeRoadmapStep[] = [
    {
      step: 1,
      title: "Jeweller Registration on BIS Portal",
      description: "Register as authorized jeweller on BIS portal (bis.gov.in). Submit GST, trade license, and PAN card of the business entity.",
      estimatedDays: "3-5 days",
      portalUrl: "https://www.manakonline.in",
    },
    {
      step: 2,
      title: "Submit Articles to AHC",
      description: "Take gold/silver articles to nearest BIS-recognized Assaying & Hallmarking Centre (AHC) for purity testing.",
      estimatedDays: "1-2 days",
    },
    {
      step: 3,
      title: "Purity Testing & Assaying",
      description: `AHC tests articles using XRF spectroscopy or fire assay method. ${isGold ? "Gold articles tested for 14K (585), 18K (750), 20K (833), 22K (916), 24K (999) purity grades." : "Silver articles tested for 800, 900, 925 (Sterling), 999 fineness."}`,
      estimatedDays: "1-3 days",
    },
    {
      step: 4,
      title: "HUID Stamping & Certification",
      description: "Conforming articles are laser-engraved with unique 6-character HUID code and BIS hallmark triangular logo. HUID linked to central BIS database.",
      estimatedDays: "Same day (after assaying)",
    },
    {
      step: 5,
      title: "Sale with HUID Verification",
      description: "Hallmarked articles sold with HUID visible to consumers. Consumers can verify authenticity via BIS Care App or HUID verification portal.",
      estimatedDays: "Ongoing",
      portalUrl: "https://bis.gov.in/verify-huid",
    },
  ];

  return {
    schemeName: "BIS Hallmarking Scheme",
    schemeCode: "Hallmarking",
    schemeVariant: isGold ? "Gold Jewellery & Artefacts" : "Silver Jewellery & Artefacts",
    summary: `Mandatory hallmarking scheme for ${isGold ? "gold" : "silver"} jewellery and artefacts in India. Every article must be assayed for purity at a BIS-recognized Assaying & Hallmarking Centre (AHC) and engraved with a unique 6-character Hallmark Unique ID (HUID). ${isGold ? "Mandatory in all 256 districts of India since April 2023." : "Silver hallmarking is mandatory for articles of 999 and 925 fineness."}`,
    isMandatoryUnderQCO: true,
    estimatedGovFee: "₹7,500 - ₹12,000 (Jeweller Registration)",
    estimatedLabTestingFee: isGold ? "₹45 per article" : "₹25 per article",
    estimatedTimeline: "3-7 days (Jeweller Registration + First Hallmarking)",
    applicableStandards: isGold
      ? ["IS 1417 — Gold Jewellery (Caratage & Fineness)", "IS 1418 — Marking of Gold Jewellery"]
      : ["IS 2112 — Silver & Silver Alloys (Fineness)", "IS 2113 — Marking of Silver Articles"],
    requiredDocuments: [
      "GST Registration Certificate of Jeweller/Firm",
      "Trade License / Shop & Establishment Certificate",
      "PAN Card of Proprietor / Business Entity",
      "Aadhaar Card of Authorized Signatory",
      "Photographs of Showroom / Outlet",
      "Bank Account Details (for online registration payment)",
    ],
    roadmapSteps,
    feeBreakdown,
    applicableQCOs,
    penaltyWarnings: [
      {
        section: "Section 14 — BIS Act 2016",
        warning: `Sale of non-hallmarked ${isGold ? "gold" : "silver"} jewellery in notified districts is a criminal offence.`,
        penalty: "Imprisonment up to 1 year + Fine up to ₹5,00,000 (first offence)",
      },
      {
        section: "Section 30 — Offences by Companies",
        warning: "Directors and key managerial personnel of jewellery firms are personally liable.",
        penalty: "Personal criminal liability extends to every director/manager/secretary in charge",
      },
      {
        section: "Consumer Protection",
        warning: "Consumers can verify HUID via BIS Care App. Fake hallmarks are traceable and prosecutable.",
        penalty: "Additional liability under Consumer Protection Act 2019",
      },
    ],
    officialPortalUrl: "https://www.manakonline.in",
    officialHelpline: "BIS Hallmarking Helpline: 1800-11-4000 | hallmarking@bis.gov.in",
    msmeEligible: isMSME,
  };
}

function buildToysResult(
  input: NavigatorAssessmentInputV2,
  catInfo: typeof PRODUCT_CATEGORIES[string] | undefined,
  isMSME: boolean,
  isImported: boolean,
): NavigatorAssessmentResultV2 {
  const feeBreakdown: FeeBreakdownItem[] = isImported
    ? [
        { item: "Application Fee (FMCS)", amount: "₹1,00,000", note: "Foreign manufacturer application" },
        { item: "BIS Officer Inspection Travel", amount: "USD $5,000 - $8,000", note: "International factory inspection" },
        { item: "Lab Testing Fee (per toy category)", amount: "₹40,000 - ₹75,000", note: "Physical/mechanical + Chemical migration tests" },
        { item: "Annual Marking Fee", amount: "₹2,000 minimum", note: "Or 0.2% of ex-factory value" },
      ]
    : [
        { item: "Application Fee (Form IV)", amount: isMSME ? "₹500" : "₹1,000", note: isMSME ? "50% MSME concession" : "Standard" },
        { item: "Processing Fee", amount: "₹5,000", note: "Non-refundable" },
        { item: "Factory Inspection Charges", amount: "₹10,000 - ₹15,000", note: "BIS officer travel + DA" },
        { item: "Lab Testing Fee (per toy category)", amount: "₹30,000 - ₹65,000", note: "IS 9873 series — 9 parts: mechanical, chemical, flammability, etc." },
        { item: "Annual Marking Fee", amount: isMSME ? "₹1,000" : "₹2,000", note: "Minimum annual fee" },
      ];

  const applicableQCOs = [QCO_DATABASE.find(q => q.qcoNumber === "S.O. 820(E)")!].filter(Boolean);

  const roadmapSteps: SchemeRoadmapStep[] = [
    {
      step: 1,
      title: isImported ? "Appoint AIR & File FMCS Application" : "Online Application (Form IV)",
      description: isImported
        ? "Foreign toy manufacturer must appoint Authorized Indian Representative and file FMCS application."
        : "Register on manakonline.in and file Scheme-I application with factory and product details.",
      estimatedDays: isImported ? "10-15 days" : "1-3 days",
    },
    {
      step: 2,
      title: "Comprehensive Toy Testing (IS 9873 Series)",
      description: "Complete testing under IS 9873 (all applicable parts): Part 1 (Mechanical/Physical), Part 2 (Flammability), Part 3 (Chemical Migration), Part 4 (Chemistry Sets), etc.",
      estimatedDays: "15-25 days",
    },
    {
      step: 3,
      title: "Factory Inspection",
      description: "BIS officer inspects manufacturing facility for quality control, material sourcing, and production process audit.",
      estimatedDays: isImported ? "3-5 days (international)" : "1-2 days",
    },
    {
      step: 4,
      title: "License Grant & ISI Marking",
      description: "On compliance, BIS grants CM/L license. All toys must bear ISI mark before sale in India.",
      estimatedDays: "5-10 days",
    },
    {
      step: 5,
      title: "Age Grading & Warning Labels",
      description: "Mandatory age-appropriate labeling per IS 9873 and safety warnings as prescribed by the standard.",
      estimatedDays: "Concurrent with licensing",
    },
  ];

  return {
    schemeName: isImported ? "FMCS for Toys" : "Product Certification (ISI Mark) — Toys",
    schemeCode: isImported ? "Scheme-I (FMCS)" : "Scheme-I",
    schemeVariant: "Toys & Children Products (Mandatory since 2021)",
    summary: `All toys sold in India must comply with IS 9873 (Safety of Toys) series and carry ISI mark since S.O. 820(E) QCO effective March 2021. This covers mechanical/physical properties, flammability, chemical migration of harmful elements (lead, cadmium, etc.), and age-appropriate labeling. ${isImported ? "Foreign manufacturers must obtain FMCS certification." : "Domestic manufacturers need Scheme-I certification."}`,
    isMandatoryUnderQCO: true,
    estimatedGovFee: isImported ? "₹1,20,000 + USD $5,000+" : isMSME ? "₹6,500 (with concession)" : "₹16,000+",
    estimatedLabTestingFee: "₹30,000 - ₹75,000 (IS 9873 full series)",
    estimatedTimeline: isImported ? "90-120 days" : "30-50 days",
    applicableStandards: [
      "IS 9873 (Part 1) — Mechanical & Physical Properties",
      "IS 9873 (Part 2) — Flammability",
      "IS 9873 (Part 3) — Migration of Certain Elements (Chemical Safety)",
      "IS 9873 (Part 4) — Chemistry Sets & Related Activities",
      "IS 9873 (Part 5) — Chemical Toys other than Chemistry Sets",
      "IS 9873 (Part 7) — Finger Paints",
      "IS 9873 (Part 9) — Organic Compounds",
      "IS 15644 — Safety of Electric Toys",
    ],
    requiredDocuments: [
      isImported ? "BIS Form V — FMCS Application" : "BIS Form IV — Scheme-I Application",
      isImported ? "AIR Appointment Letter (notarized, apostilled)" : "MSME Udyam Registration (if applicable)",
      "Factory License / Business Registration",
      "Complete IS 9873 Test Reports from NABL Lab (all applicable parts)",
      "Age Grading Declaration per IS 9873 Part 1 Clause 4.6",
      "Chemical Migration Test Reports (lead, cadmium, chromium, barium, mercury)",
      "Material Safety Data Sheets (MSDS) for raw materials",
      "Product Photographs with Safety Warning Labels",
    ],
    roadmapSteps,
    feeBreakdown,
    applicableQCOs,
    penaltyWarnings: [
      {
        section: "Section 14 — BIS Act 2016",
        warning: "Sale of non-ISI marked toys is a criminal offence since March 2021.",
        penalty: "Imprisonment up to 2 years + Fine up to ₹5,00,000",
      },
      {
        section: "S.O. 820(E) — Toy QCO",
        warning: "E-commerce platforms are also liable for listing non-certified toys.",
        penalty: "Platform delisting + prosecution under BIS Act",
      },
      {
        section: "Section 30 — Company Officers",
        warning: "Directors and importers are personally liable for non-compliance.",
        penalty: "Personal criminal liability for key managerial personnel",
      },
    ],
    officialPortalUrl: isImported ? "https://www.manakonline.in/FMCS/eBISLogin" : "https://www.manakonline.in",
    officialHelpline: "BIS Toy Cell: toys@bis.gov.in | 011-2323 1946",
    msmeEligible: isMSME && !isImported,
  };
}

/* ========================================================================= */
/* HELPER FUNCTIONS                                                          */
/* ========================================================================= */

function getLabTestFee(category: string): string {
  const feeLookup: Record<string, string> = {
    "electronics_it": "₹25,000 - ₹65,000",
    "electrical_wiring": "₹15,000 - ₹35,000",
    "home_appliances": "₹18,000 - ₹45,000",
    "automotive": "₹30,000 - ₹80,000",
    "chemicals_fertilizers": "₹12,000 - ₹30,000",
    "textiles_footwear": "₹8,000 - ₹20,000",
    "food_agriculture": "₹10,000 - ₹25,000",
    "construction_materials": "₹15,000 - ₹40,000",
    "medical_devices": "₹25,000 - ₹60,000",
    "gold_silver_jewellery": "₹45 per article (hallmarking)",
    "toys_children": "₹30,000 - ₹65,000",
    "rubber_plastics": "₹10,000 - ₹25,000",
    "steel_metals": "₹15,000 - ₹35,000",
    "water_purification": "₹20,000 - ₹40,000",
    "solar_renewable": "₹80,000 - ₹1,50,000",
  };
  return feeLookup[category] || "₹15,000 - ₹40,000";
}

function getStandardsForCategory(category: string, subCategory?: string): string[] {
  const standardsMap: Record<string, string[]> = {
    "electronics_it": ["IS 13252 (Part 1) — Safety of IT Equipment", "IS 616 — Audio/Video Equipment Safety", "IS 10322 — Luminaires", "IS 15885 — Audio Equipment", "IS 16046 — Battery Packs"],
    "electrical_wiring": ["IS 694:2010 — PVC Cables up to 1100V", "IS 1293:2019 — Plugs & Socket-Outlets", "IS 302 — Domestic Electrical Appliances", "IS 3854 — Switches for Domestic Use"],
    "home_appliances": ["IS 302 (Part 2) — Domestic Appliances Safety", "IS 4246 — Domestic Gas Stoves", "IS 2347 — Pressure Cookers", "IS 3615 — Mixers/Grinders"],
    "automotive": ["IS 4151 — Protective Helmets", "IS 2553 — Safety Glass", "IS 15627 — Automotive Tyres", "IS 14164 — Seat Belts"],
    "chemicals_fertilizers": ["IS 269 — OPC Cement", "IS 1489 — PPC Cement", "IS 455 — PSC Cement", "IS 3196 — LPG Cylinder Valves"],
    "textiles_footwear": ["IS 11871 — Readymade Garments", "IS 15298 — Leather Footwear"],
    "food_agriculture": ["IS 10500 — Drinking Water", "IS 14543 — Packaged Drinking Water", "IS 7462 — Pasteurized Milk"],
    "construction_materials": ["IS 1786 — TMT Steel Bars", "IS 2062 — Structural Steel", "IS 2553 — Safety Glass", "IS 12592 — Plywood"],
    "medical_devices": ["IS 4148 — Examination Gloves", "IS 7816 — Disposable Syringes", "IS 3521 — Condoms"],
    "gold_silver_jewellery": ["IS 1417 — Gold Jewellery Fineness", "IS 2112 — Silver Fineness"],
    "toys_children": ["IS 9873 (Parts 1-9) — Safety of Toys", "IS 15644 — Electrical Toys Safety"],
    "rubber_plastics": ["IS 4985 — UPVC Pipes", "IS 7328 — HDPE Films"],
    "steel_metals": ["IS 1786 — TMT Bars", "IS 2062 — Hot-Rolled Steel", "IS 277 — GI Sheets"],
    "water_purification": ["IS 16240 — Non-Electric Gravity Purifiers", "IS 16622 — RO/UV Purifiers"],
    "solar_renewable": ["IS 14286 — PV Modules", "IS 16169 — Grid-Connected Inverters", "IS 16221 — PV Inverter Safety"],
  };
  return standardsMap[category] || ["Applicable Indian Standard per product category"];
}

function getQCOsForCategory(category: string): QCOReference[] {
  const qcoMapping: Record<string, string[]> = {
    "electronics_it": ["S.O. 5765(E)"],
    "electrical_wiring": ["S.O. 1293(E)", "S.O. 4511(E)"],
    "home_appliances": ["S.O. 1293(E)"],
    "automotive": ["S.O. 1888(E)", "S.O. 3480(E)"],
    "chemicals_fertilizers": ["S.O. 2422(E)", "S.O. 990(E)"],
    "toys_children": ["S.O. 820(E)"],
    "gold_silver_jewellery": ["Hallmarking Order 2021"],
    "construction_materials": ["S.O. 1350(E)", "S.O. 3480(E)"],
    "food_agriculture": ["FSSAI Notification"],
    "solar_renewable": ["S.O. 5765(E) / MNRE"],
    "steel_metals": ["S.O. 1350(E)"],
  };

  const qcoNumbers = qcoMapping[category] || [];
  return qcoNumbers
    .map(num => QCO_DATABASE.find(q => q.qcoNumber === num))
    .filter(Boolean) as QCOReference[];
}

function buildPenaltyWarnings(applicableQCOs: QCOReference[]): NavigatorAssessmentResultV2["penaltyWarnings"] {
  const penaltySections = new Set<string>();
  for (const qco of applicableQCOs) {
    for (const section of qco.penaltySections) {
      penaltySections.add(section);
    }
  }

  return Array.from(penaltySections).map(section => {
    const penaltyInfo = BIS_ACT_PENALTIES[section];
    return {
      section: penaltyInfo?.section || section,
      warning: penaltyInfo?.description || "Non-compliance with BIS regulations",
      penalty: penaltyInfo?.penalty || "As per BIS Act 2016",
    };
  });
}
