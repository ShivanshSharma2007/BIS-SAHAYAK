export const MOCK_STANDARDS = [
  {
    code: "IS 13252 (Part 1)",
    title: "Information Technology Equipment - Safety - General Requirements",
    schemeType: "CRS (Compulsory Registration Scheme)",
    productCategory: "Electronics / IT",
    keywords: ["adapter", "power", "laptop", "lenovo", "charger", "computer", "dock", "it equipment"],
    mandatoryClauses: [
      { id: "1.5", title: "Components & Power Supply requirements", status: "pending" },
      { id: "2.1", title: "Protection from electric shock and energy hazards", status: "pending" },
      { id: "4.2", title: "Mechanical strength and enclosures", status: "pending" },
      { id: "5.1", title: "Touch current and protective conductor current", status: "pending" }
    ]
  },
  {
    code: "IS 15885 (Part 2/Sec 13)",
    title: "Safety of Lamp Controlgear - Particular Requirements for D.C. or A.C. Supplied Electronic Controlgear for LED Modules",
    schemeType: "CRS (Compulsory Registration Scheme)",
    productCategory: "Electronics / IT",
    keywords: ["led", "driver", "controlgear", "lamp", "power", "luminaire"],
    mandatoryClauses: [
      { id: "4.1", title: "Protection against electric shock", status: "pending" },
      { id: "7.2", title: "Moisture resistance and insulation", status: "pending" },
      { id: "14.1", title: "Fault conditions testing", status: "pending" }
    ]
  },
  {
    code: "IS 2082",
    title: "Stationary Storage Type Electric Water Heaters",
    schemeType: "Scheme-I (ISI Mark)",
    productCategory: "Home Appliances",
    keywords: ["water", "heater", "geyser", "storage", "electric", "boiler"],
    mandatoryClauses: [
      { id: "5.1", title: "Earthing terminal requirements", status: "pending" },
      { id: "10.3", title: "High voltage test", status: "pending" },
      { id: "11.1", title: "Thermal cut-out operation", status: "pending" }
    ]
  },
  {
    code: "IS 616",
    title: "Audio, Video and Similar Electronic Apparatus - Safety Requirements",
    schemeType: "CRS (Compulsory Registration Scheme)",
    productCategory: "Electronics / IT",
    keywords: ["audio", "video", "tv", "television", "speaker", "amplifier"],
    mandatoryClauses: [
      { id: "9.1", title: "Electric shock hazard under normal operating conditions", status: "pending" },
      { id: "10.2", title: "Insulation requirements", status: "pending" },
      { id: "14.3", title: "Clearances and creepage distances", status: "pending" }
    ]
  },
  {
    code: "IS 1293",
    title: "Plugs and Socket-Outlets of Rated Voltage up to and including 250 Volts and Rated Current up to 16 Amperes",
    schemeType: "Scheme-I (ISI Mark)",
    productCategory: "Electrical Wiring Accessories",
    keywords: ["plug", "socket", "outlet", "pin", "ampere", "volts"],
    mandatoryClauses: [
      { id: "8.1", title: "Dimensions and interchangeability", status: "pending" },
      { id: "9.2", title: "Protection against electric shock", status: "pending" },
      { id: "14.1", title: "Resistance to aging, harmful ingress of water and humidity", status: "pending" }
    ]
  },
  {
    code: "IS 10322",
    title: "Luminaires - General requirements and tests",
    schemeType: "CRS (Compulsory Registration Scheme)",
    productCategory: "Lighting",
    keywords: ["luminaire", "light", "fixture", "led", "bulb", "tube"],
    mandatoryClauses: [
      { id: "3.2", title: "Marking and instructions", status: "pending" },
      { id: "4.5", title: "Construction - mechanical strength", status: "pending" },
      { id: "10.1", title: "Endurance test and thermal test", status: "pending" }
    ]
  },
  {
    code: "IS 4151",
    title: "Protective Helmets for Two Wheeler Riders",
    schemeType: "Scheme-I (ISI Mark)",
    productCategory: "Automotive Accessories",
    keywords: ["helmet", "visor", "strap", "shell", "protective", "rider", "motorcycle", "bike"],
    mandatoryClauses: [
      { id: "5.1", title: "Impact absorption test", status: "pending" },
      { id: "6.2", title: "Retention system effectiveness", status: "pending" },
      { id: "7.1", title: "Peripheral vision clearance", status: "pending" }
    ]
  },
  {
    code: "IS 14543",
    title: "Packaged Drinking Water (Other than Natural Mineral Water)",
    schemeType: "Scheme-I (ISI Mark)",
    productCategory: "Food & Water",
    keywords: ["water", "drinking", "packaged", "bottle", "aqua", "mineral", "purified", "ro", "uv"],
    mandatoryClauses: [
      { id: "4.1", title: "Microbiological requirements", status: "pending" },
      { id: "5.2", title: "Toxic substance limits", status: "pending" },
      { id: "6.3", title: "Packaging and labeling requirements", status: "pending" }
    ]
  }
];

export const MOCK_LABS = [
  {
    id: "LAB-001",
    name: "National Test House (WR)",
    location: "Mumbai, Maharashtra",
    accreditationNo: "TC-1234",
    leadTime: "12-15 Days",
    categories: ["Electronics", "Home Appliances"],
    status: "Active",
    rating: 4.8
  },
  {
    id: "LAB-002",
    name: "UL India Pvt Ltd",
    location: "Bengaluru, Karnataka",
    accreditationNo: "TC-5678",
    leadTime: "7-10 Days",
    categories: ["Electronics / IT", "Lighting"],
    status: "Active",
    rating: 4.9
  },
  {
    id: "LAB-003",
    name: "TUV Rheinland India",
    location: "Gurugram, Haryana",
    accreditationNo: "TC-9012",
    leadTime: "10-14 Days",
    categories: ["Toys", "Home Appliances", "Lighting"],
    status: "Active",
    rating: 4.7
  },
  {
    id: "LAB-004",
    name: "Electronics Regional Test Laboratory (ERTL)",
    location: "New Delhi, Delhi",
    accreditationNo: "TC-3456",
    leadTime: "15-20 Days",
    categories: ["Electronics / IT"],
    status: "Active",
    rating: 4.5
  },
  {
    id: "LAB-005",
    name: "Intertek India Pvt Ltd",
    location: "Chennai, Tamil Nadu",
    accreditationNo: "TC-7890",
    leadTime: "8-12 Days",
    categories: ["Electrical Wiring Accessories", "Textiles"],
    status: "Active",
    rating: 4.6
  }
];

export const MOCK_ALERTS = [
  {
    id: "ALT-001",
    type: "qco",
    date: "2026-09-10",
    title: "New Quality Control Order for Smart Wearables",
    description: "DPIIT has issued a new QCO mandating CRS registration for all smart wearables and smartwatches imported or manufactured after October 1st, 2026.",
    severity: "high"
  },
  {
    id: "ALT-002",
    type: "tender",
    date: "2026-09-08",
    title: "GeM Tender Requirement Update: LED Streetlights",
    description: "All new GeM tenders for Class A LED Streetlights now require IS 10322 compliance test reports directly uploaded via the unified API.",
    severity: "medium"
  },
  {
    id: "ALT-003",
    type: "amendment",
    date: "2026-09-05",
    title: "IS 2082 Amendment 4 Published",
    description: "Revised safety limits for thermal cut-outs in electric water heaters have been published. Manufacturers have 6 months to transition.",
    severity: "medium"
  },
  {
    id: "ALT-004",
    type: "qco",
    date: "2026-09-01",
    title: "Extension on Medical Electronics QCO",
    description: "The deadline for mandatory certification of specific diagnostic medical electronics has been extended to January 2027.",
    severity: "low"
  }
];

export const MOCK_SCAN_RESULT = {
  identifiedProduct: "LED Driver (Constant Current)",
  confidence: 98,
  ocrExtracted: {
    inputVoltage: "100-240V AC",
    outputVoltage: "24-42V DC",
    wattage: "36W Max",
    brand: "LumiPower"
  },
  matchedStandard: MOCK_STANDARDS[0],
  reasoning: "The scanned label clearly indicates 'LED Driver' with DC output parameters, which strictly falls under IS 15885 (Part 2/Sec 13) for A.C. or D.C. supplied electronic controlgear."
};

export const MOCK_BIS_DATA = {
  standards: MOCK_STANDARDS,
  labs: MOCK_LABS,
  alerts: MOCK_ALERTS,
  scanResult: MOCK_SCAN_RESULT
};
