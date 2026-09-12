export interface TestingLab {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
  accreditationNo: string;
  leadTime: string;
  categories: string[];
  accreditedStandards: string[];
  contactEmail: string;
  phone: string;
  rating: number;
  type: "Government" | "Private Accredited";
}

export interface StandardProductInfo {
  code: string;
  name: string;
  fullName: string;
  category: string;
}

export const BIS_STANDARDS_MAP: Record<string, StandardProductInfo> = {
  "IS 1293": {
    code: "IS 1293",
    name: "Plugs & Sockets",
    fullName: "Plugs and Socket-Outlets for Household and Similar Purposes (up to 250V / 16A)",
    category: "Electrical Accessories"
  },
  "IS 15885 (Part 2/Sec 13)": {
    code: "IS 15885 (Part 2/Sec 13)",
    name: "LED Drivers & Controlgear",
    fullName: "Electronic Controlgear for LED Modules (LED Drivers & Power Supplies)",
    category: "Lighting & Electronics"
  },
  "IS 302-2-25": {
    code: "IS 302-2-25",
    name: "Microwaves & Kitchen Appliances",
    fullName: "Safety of Household Electrical Appliances - Particular Requirements for Microwave Ovens",
    category: "Home Appliances"
  },
  "IS 14543": {
    code: "IS 14543",
    name: "Packaged Drinking Water",
    fullName: "Packaged Drinking Water (Other than Packaged Natural Mineral Water)",
    category: "Food & Water"
  },
  "IS 13252 (Part 1)": {
    code: "IS 13252 (Part 1)",
    name: "IT Equipment & Laptops",
    fullName: "Information Technology Equipment - General Safety Requirements (Laptops, Printers, Servers)",
    category: "Electronics & IT"
  },
  "IS 616": {
    code: "IS 616",
    name: "Audio, Video & Smart TVs",
    fullName: "Audio, Video and Similar Electronic Apparatus - Safety Requirements",
    category: "Consumer Electronics"
  },
  "IS 16046 (Part 2)": {
    code: "IS 16046 (Part 2)",
    name: "Lithium Batteries & Cells",
    fullName: "Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes (Lithium Systems)",
    category: "Energy Storage"
  },
  "IS 10322": {
    code: "IS 10322",
    name: "LED Luminaires & Streetlights",
    fullName: "Luminaires - General Requirements and Tests (Streetlights, Floodlights)",
    category: "Lighting"
  },
  "IS 2082": {
    code: "IS 2082",
    name: "Electric Water Heaters / Geysers",
    fullName: "Stationary Storage Type Electric Water Heaters",
    category: "Home Appliances"
  },
  "IS 4151": {
    code: "IS 4151",
    name: "Two-Wheeler Helmets",
    fullName: "Protective Helmets for Two Wheeler Riders",
    category: "Automotive Safety"
  },
  "IS 17855": {
    code: "IS 17855",
    name: "Electric Vehicles (EV Safety)",
    fullName: "Electrically Propelled Road Vehicles - Safety Requirements & EV Powertrain",
    category: "Automotive & EV"
  },
  "IS 20888": {
    code: "IS 20888",
    name: "AC Static Energy Meters",
    fullName: "AC Static Transformer Operated Watthour and VAR-Hour Meters",
    category: "Power Equipment"
  },
  "IS 694": {
    code: "IS 694",
    name: "PVC Insulated Power Cables",
    fullName: "PVC Insulated Cables for Working Voltages up to and including 1100 V",
    category: "Electrical Cables"
  },
  "IS 16221 (Part 2)": {
    code: "IS 16221 (Part 2)",
    name: "Solar String Inverters",
    fullName: "Safety of Power Converters for Use in Photovoltaic Power Systems",
    category: "Renewable Energy"
  },
  "IS 16169": {
    code: "IS 16169",
    name: "Grid-Tied PV Inverters",
    fullName: "Test Procedure of Islanding Prevention Measures for Utility-Interconnected Photovoltaic Inverters",
    category: "Renewable Energy"
  }
};

export function getStandardProductInfo(code: string): StandardProductInfo {
  if (BIS_STANDARDS_MAP[code]) {
    return BIS_STANDARDS_MAP[code];
  }
  const cleanCode = code.split(":")[0].trim();
  if (BIS_STANDARDS_MAP[cleanCode]) {
    return BIS_STANDARDS_MAP[cleanCode];
  }
  for (const key of Object.keys(BIS_STANDARDS_MAP)) {
    if (code.startsWith(key) || key.startsWith(cleanCode)) {
      return BIS_STANDARDS_MAP[key];
    }
  }
  return {
    code,
    name: code,
    fullName: `Indian Standard Specification: ${code}`,
    category: "General Standard"
  };
}

export const LABS_DIRECTORY: TestingLab[] = [
  {
    id: "LAB-001",
    name: "National Test House (Northern Region)",
    city: "Ghaziabad",
    state: "Uttar Pradesh",
    address: "Kamla Nehru Nagar, Ghaziabad, UP 201002",
    latitude: 28.6692,
    longitude: 77.4538,
    accreditationNo: "TC-5011",
    leadTime: "10-14 Days",
    categories: ["Electronics & IT", "Electrical", "Mechanical"],
    accreditedStandards: ["IS 1293", "IS 15885 (Part 2/Sec 13)", "IS 302-2-25", "IS 14543"],
    contactEmail: "nth-nr@gov.in",
    phone: "+91 120 2789871",
    rating: 4.8,
    type: "Government"
  },
  {
    id: "LAB-002",
    name: "Electronics Regional Test Laboratory (ERTL North)",
    city: "New Delhi",
    state: "Delhi",
    address: "Okhla Industrial Area Phase II, New Delhi 110020",
    latitude: 28.5355,
    longitude: 77.2568,
    accreditationNo: "TC-3456",
    leadTime: "7-10 Days",
    categories: ["Electronics & IT", "Telecommunications", "Medical Devices"],
    accreditedStandards: ["IS 13252 (Part 1)", "IS 616", "IS 16046 (Part 2)"],
    contactEmail: "ertl-north@stqc.gov.in",
    phone: "+91 11 26385412",
    rating: 4.6,
    type: "Government"
  },
  {
    id: "LAB-003",
    name: "TUV Rheinland India Pvt. Ltd.",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Electronic City Phase 1, Bengaluru 560100",
    latitude: 12.8399,
    longitude: 77.6770,
    accreditationNo: "TC-9012",
    leadTime: "5-7 Days",
    categories: ["Electronics & IT", "Lighting & Luminaires", "Batteries"],
    accreditedStandards: ["IS 15885 (Part 2/Sec 13)", "IS 10322", "IS 16046 (Part 2)", "IS 1293"],
    contactEmail: "info@ind.tuv.com",
    phone: "+91 80 46498000",
    rating: 4.9,
    type: "Private Accredited"
  },
  {
    id: "LAB-004",
    name: "UL India Pvt. Ltd.",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Yeshwantpur Suburb, Bengaluru 560022",
    latitude: 13.0033,
    longitude: 77.5891,
    accreditationNo: "TC-5678",
    leadTime: "6-8 Days",
    categories: ["Electronics & IT", "Automotive Batteries", "Appliances"],
    accreditedStandards: ["IS 16046 (Part 2)", "IS 302-2-25", "IS 13252 (Part 1)"],
    contactEmail: "testing.india@ul.com",
    phone: "+91 80 41384400",
    rating: 4.9,
    type: "Private Accredited"
  },
  {
    id: "LAB-005",
    name: "Electronics Regional Test Laboratory (ERTL West)",
    city: "Mumbai",
    state: "Maharashtra",
    address: "MIDC Area, Andheri East, Mumbai 400093",
    latitude: 19.1136,
    longitude: 72.8697,
    accreditationNo: "TC-2189",
    leadTime: "12-15 Days",
    categories: ["Electronics & IT", "Home Appliances", "Safety Compliance"],
    accreditedStandards: ["IS 1293", "IS 616", "IS 2082", "IS 302-2-25"],
    contactEmail: "ertlmumbai@stqc.gov.in",
    phone: "+91 22 28325867",
    rating: 4.7,
    type: "Government"
  },
  {
    id: "LAB-006",
    name: "SAMEER (Centre for Electromagnetics)",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "CIT Campus, Taramani, Chennai 600113",
    latitude: 12.9830,
    longitude: 80.2594,
    accreditationNo: "TC-6124",
    leadTime: "7-12 Days",
    categories: ["EMI/EMC Testing", "Electronics & IT", "RF Components"],
    accreditedStandards: ["IS 616", "IS 13252 (Part 1)", "IS 15885 (Part 2/Sec 13)"],
    contactEmail: "cem@sameer.gov.in",
    phone: "+91 44 22541817",
    rating: 4.8,
    type: "Government"
  },
  {
    id: "LAB-007",
    name: "Intertek India Pvt. Ltd.",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "Guindy Industrial Estate, Chennai 600032",
    latitude: 13.0117,
    longitude: 80.2227,
    accreditationNo: "TC-7890",
    leadTime: "6-9 Days",
    categories: ["Electrical Wiring Accessories", "Plugs & Sockets", "Textiles"],
    accreditedStandards: ["IS 1293", "IS 10322", "IS 2082"],
    contactEmail: "chennai.testing@intertek.com",
    phone: "+91 44 42994545",
    rating: 4.6,
    type: "Private Accredited"
  },
  {
    id: "LAB-008",
    name: "National Test House (Eastern Region)",
    city: "Kolkata",
    state: "West Bengal",
    address: "Block CP, Sector V, Salt Lake, Kolkata 700091",
    latitude: 22.5867,
    longitude: 88.4178,
    accreditationNo: "TC-5012",
    leadTime: "10-15 Days",
    categories: ["Chemical", "Mechanical", "Electrical Wiring"],
    accreditedStandards: ["IS 1293", "IS 14543", "IS 2082"],
    contactEmail: "nth-er@gov.in",
    phone: "+91 33 23673869",
    rating: 4.5,
    type: "Government"
  },
  {
    id: "LAB-009",
    name: "Automotive Research Association of India (ARAI)",
    city: "Pune",
    state: "Maharashtra",
    address: "Survey No. 102, Vetal Hill, Off Paud Road, Kothrud, Pune 411038",
    latitude: 18.5284,
    longitude: 73.8138,
    accreditationNo: "TC-1044",
    leadTime: "12-16 Days",
    categories: ["EV Battery Packs", "Automotive Safety", "Helmets"],
    accreditedStandards: ["IS 16046 (Part 2)", "IS 4151", "IS 17855"],
    contactEmail: "director@araiindia.com",
    phone: "+91 20 30231111",
    rating: 4.9,
    type: "Government"
  },
  {
    id: "LAB-010",
    name: "Central Power Research Institute (CPRI)",
    city: "Hyderabad",
    state: "Telangana",
    address: "Medipally, Uppal, Hyderabad 500039",
    latitude: 17.4019,
    longitude: 78.5602,
    accreditationNo: "TC-4421",
    leadTime: "8-12 Days",
    categories: ["High Voltage Testing", "Servo Stabilizers", "Cables"],
    accreditedStandards: ["IS 20888", "IS 1293", "IS 2082"],
    contactEmail: "cpri-hyd@nic.in",
    phone: "+91 40 27202148",
    rating: 4.7,
    type: "Government"
  },
  {
    id: "LAB-011",
    name: "Electrical Research and Development Association (ERDA)",
    city: "Vadodara",
    state: "Gujarat",
    address: "ERDA Road, Makarpura Industrial Estate, Vadodara 390010",
    latitude: 22.2570,
    longitude: 73.1956,
    accreditationNo: "TC-3320",
    leadTime: "7-11 Days",
    categories: ["Electrical Equipment", "Transformers", "Stabilizers"],
    accreditedStandards: ["IS 20888", "IS 302-2-25", "IS 1293"],
    contactEmail: "erda@erda.org",
    phone: "+91 265 2642942",
    rating: 4.8,
    type: "Private Accredited"
  },
  {
    id: "LAB-012",
    name: "CSIR - Central Scientific Instruments Organisation",
    city: "Chandigarh",
    state: "Punjab / Haryana",
    address: "Sector 30-C, Chandigarh 160030",
    latitude: 30.7107,
    longitude: 76.7974,
    accreditationNo: "TC-6781",
    leadTime: "10-14 Days",
    categories: ["Precision Instruments", "Optics & Lighting", "Smart Sensors"],
    accreditedStandards: ["IS 10322", "IS 13252 (Part 1)", "IS 15885 (Part 2/Sec 13)"],
    contactEmail: "head.bdg@csio.res.in",
    phone: "+91 172 2657190",
    rating: 4.7,
    type: "Government"
  }
];
