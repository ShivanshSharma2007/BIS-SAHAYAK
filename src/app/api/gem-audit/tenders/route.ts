import { NextResponse } from "next/server";

export interface TenderClause {
  clauseNumber: string;
  title: string;
  requirement: string;
  standard: string;
  criticality: "CRITICAL" | "MAJOR" | "MINOR";
}

export interface GeMTender {
  id: string;
  bidNumber: string;
  title: string;
  category: string;
  buyer: {
    name: string;
    department: string;
    location: string;
  };
  value: string;
  valueNumeric: number;
  publishedDate: string;
  closingDate: string;
  mandatoryStandard: string;
  requiredCertifications: string[];
  localContentRequired: number; // percentage
  emdAmount: string;
  msmeExempt: boolean;
  sampleTestRequired: boolean;
  description: string;
  clauses: TenderClause[];
}

const sampleTenders: GeMTender[] = [
  {
    id: "gem-tender-01",
    bidNumber: "GEM/2026/B/849201",
    title: "Supply of Heavy-Duty PVC Insulated Copper Power Cables (1.1 kV)",
    category: "Electrical Cables & Wires",
    buyer: {
      name: "NTPC Limited",
      department: "Ministry of Power",
      location: "Dadri, Uttar Pradesh"
    },
    value: "₹ 48,50,000",
    valueNumeric: 4850000,
    publishedDate: "02 Sep 2026",
    closingDate: "28 Sep 2026",
    mandatoryStandard: "IS 694:2010",
    requiredCertifications: ["BIS ISI Mark (Scheme-I)", "NABL Accredited Type Test Report"],
    localContentRequired: 50,
    emdAmount: "₹ 97,000",
    msmeExempt: true,
    sampleTestRequired: true,
    description: "Procurement of multi-strand annealed electrolytic copper conductor cables with flame-retardant low-smoke (FRLS) insulation for power distribution panels.",
    clauses: [
      {
        clauseNumber: "Clause 4.1",
        title: "Conductor Material & Purity",
        requirement: "High conductivity electrolytic grade annealed copper per IS 8130, purity not less than 99.90%.",
        standard: "IS 694:2010 / IS 8130",
        criticality: "CRITICAL"
      },
      {
        clauseNumber: "Clause 5.2",
        title: "Conductor Electrical Resistance",
        requirement: "Maximum conductor resistance at 20°C must not exceed 12.1 Ω/km for 1.5 sq mm conductor.",
        standard: "IS 694:2010 Clause 5.2",
        criticality: "CRITICAL"
      },
      {
        clauseNumber: "Clause 6.3",
        title: "Insulation Radial Thickness",
        requirement: "Nominal insulation thickness 0.70 mm, minimum at any point not less than 0.53 mm.",
        standard: "IS 694:2010 Clause 6.3",
        criticality: "MAJOR"
      },
      {
        clauseNumber: "Clause 8.1",
        title: "Flame Retardance & Oxygen Index",
        requirement: "Oxygen Index shall be minimum 29% when tested in accordance with IS 10810 (Part 58).",
        standard: "IS 10810 (Pt 58)",
        criticality: "CRITICAL"
      },
      {
        clauseNumber: "Clause 10.4",
        title: "High Voltage Water Immersion Test",
        requirement: "Withstand 3 kV AC RMS for 5 minutes after 24-hour immersion in water without puncture or breakdown.",
        standard: "IS 694:2010 Clause 10.4",
        criticality: "MAJOR"
      }
    ]
  },
  {
    id: "gem-tender-02",
    bidNumber: "GEM/2026/B/914207",
    title: "Procurement of 16A/6A Modular Switch & Shuttered Socket Outlets",
    category: "Wiring Accessories",
    buyer: {
      name: "Central Public Works Department (CPWD)",
      department: "Ministry of Housing and Urban Affairs",
      location: "New Delhi"
    },
    value: "₹ 24,75,000",
    valueNumeric: 2475000,
    publishedDate: "05 Sep 2026",
    closingDate: "22 Sep 2026",
    mandatoryStandard: "IS 1293:2019",
    requiredCertifications: ["BIS ISI Mark (Mandatory QCO)", "RoHS Compliance"],
    localContentRequired: 60,
    emdAmount: "₹ 49,500",
    msmeExempt: true,
    sampleTestRequired: true,
    description: "Flame-retardant polycarbonate 3-pin combined shuttered sockets (16A & 6A) with silver-alloy contacts for Central Secretariat retrofitting.",
    clauses: [
      {
        clauseNumber: "Clause 7.1",
        title: "Safety Shutter Mechanism",
        requirement: "Live socket contacts must be protected by integral automatic shutters preventing single-pin insertion.",
        standard: "IS 1293:2019 Clause 7.1",
        criticality: "CRITICAL"
      },
      {
        clauseNumber: "Clause 13.2",
        title: "Temperature Rise Under 16A Full Load",
        requirement: "Terminal temperature rise must not exceed 45°C during continuous 16A current draw test.",
        standard: "IS 1293:2019 Clause 13.2",
        criticality: "CRITICAL"
      },
      {
        clauseNumber: "Clause 15.1",
        title: "Insulation Resistance & Dielectric Strength",
        requirement: "Insulation resistance >= 5 MΩ at 500V DC and withstand 2000V AC for 60 seconds.",
        standard: "IS 1293:2019 Clause 15.1",
        criticality: "MAJOR"
      },
      {
        clauseNumber: "Clause 20.3",
        title: "Glow Wire Flammability Test",
        requirement: "Molded parts retaining live parts must withstand 850°C glow-wire test without sustained flame.",
        standard: "IS 1293:2019 Clause 20.3",
        criticality: "CRITICAL"
      }
    ]
  },
  {
    id: "gem-tender-03",
    bidNumber: "GEM/2026/B/728910",
    title: "Commercial Solar String Inverters (50 kW, Grid-Tied)",
    category: "Renewable Energy & Inverters",
    buyer: {
      name: "Solar Energy Corporation of India (SECI)",
      department: "Ministry of New and Renewable Energy",
      location: "Bhopal, Madhya Pradesh"
    },
    value: "₹ 1,15,000,000",
    valueNumeric: 11500000,
    publishedDate: "28 Aug 2026",
    closingDate: "30 Sep 2026",
    mandatoryStandard: "IS 16221 (Part 2) / IS 16169",
    requiredCertifications: ["BIS CRS Registration (Compulsory Registration Scheme)", "MNRE Approved OEM List"],
    localContentRequired: 50,
    emdAmount: "₹ 2,30,000",
    msmeExempt: true,
    sampleTestRequired: false,
    description: "Supply and commissioning of 50kW three-phase transformerless grid-tied solar string inverters with integrated MPPT and anti-islanding protection.",
    clauses: [
      {
        clauseNumber: "Clause 5.1",
        title: "Inverter Conversion Efficiency",
        requirement: "Euro efficiency not less than 98.2% and maximum peak efficiency >= 98.6%.",
        standard: "IS 16221 (Pt 2)",
        criticality: "MAJOR"
      },
      {
        clauseNumber: "Clause 6.4",
        title: "Anti-Islanding Protection Disconnect",
        requirement: "Automatic trip and disconnection from grid within 2.0 seconds upon utility blackout or frequency drift.",
        standard: "IS 16169 / IEC 62116",
        criticality: "CRITICAL"
      },
      {
        clauseNumber: "Clause 8.2",
        title: "Ingress Protection Rating",
        requirement: "Inverter enclosure must be rated minimum IP65 for outdoor installation without secondary shelter.",
        standard: "IS/IEC 60529",
        criticality: "MAJOR"
      },
      {
        clauseNumber: "Clause 11.3",
        title: "Total Harmonic Distortion (THDi)",
        requirement: "Current harmonic distortion injected into grid must be less than 3.0% at rated output.",
        standard: "IEEE 519 / IS 16221",
        criticality: "CRITICAL"
      }
    ]
  },
  {
    id: "gem-tender-04",
    bidNumber: "GEM/2026/B/663812",
    title: "Energy-Efficient LED Street Light Luminaires (90W - 120W)",
    category: "Smart Lighting Infrastructure",
    buyer: {
      name: "Smart City Development Corporation",
      department: "Urban Development Directorate",
      location: "Pune, Maharashtra"
    },
    value: "₹ 36,00,000",
    valueNumeric: 3600000,
    publishedDate: "08 Sep 2026",
    closingDate: "05 Oct 2026",
    mandatoryStandard: "IS 10322 (Part 5/Sec 3):2012",
    requiredCertifications: ["BIS CRS / ISI License", "LM-79 & LM-80 Reports"],
    localContentRequired: 55,
    emdAmount: "₹ 72,000",
    msmeExempt: true,
    sampleTestRequired: true,
    description: "Die-cast aluminum IP66 pressure-tested LED road luminaires with 10 kV internal surge protection for arterial municipal highways.",
    clauses: [
      {
        clauseNumber: "Clause 4.3",
        title: "Luminous Efficacy",
        requirement: "System luminous efficacy must be equal to or greater than 140 lumens per watt at rated wattage.",
        standard: "IS 16107 (Pt 2/Sec 1)",
        criticality: "MAJOR"
      },
      {
        clauseNumber: "Clause 7.2",
        title: "Surge Protection Device (SPD)",
        requirement: "Built-in dual-stage SPD rated for minimum 10 kV / 5 kA surge endurance per IEC 61643-11.",
        standard: "IS 10322 (Pt 5/Sec 3)",
        criticality: "CRITICAL"
      },
      {
        clauseNumber: "Clause 9.5",
        title: "Ingress Protection & Impact Resistance",
        requirement: "Optical and driver compartment rated IP66 with IK08 impact resistance enclosure.",
        standard: "IS/IEC 60529 & IS 10322",
        criticality: "CRITICAL"
      }
    ]
  },
  {
    id: "gem-tender-05",
    bidNumber: "GEM/2026/B/229041",
    title: "Medical Grade Seamless Steel Oxygen Cylinders (D Type)",
    category: "Medical Gases & Equipment",
    buyer: {
      name: "AIIMS New Delhi",
      department: "Ministry of Health and Family Welfare",
      location: "New Delhi"
    },
    value: "₹ 1,45,00,000",
    valueNumeric: 14500000,
    publishedDate: "10 Sep 2026",
    closingDate: "25 Oct 2026",
    mandatoryStandard: "IS 7285 (Part 2):2017",
    requiredCertifications: ["PESO Approval", "BIS ISI Mark (Scheme-I)"],
    localContentRequired: 50,
    emdAmount: "₹ 2,90,000",
    msmeExempt: true,
    sampleTestRequired: true,
    description: "High pressure seamless steel cylinders for medical oxygen storage, water capacity 46.7 Liters.",
    clauses: [
      {
        clauseNumber: "Clause 5.1",
        title: "Material Chemical Composition",
        requirement: "Steel must have Maximum Carbon 0.40%, Maximum Sulphur 0.040%, Maximum Phosphorus 0.040%.",
        standard: "IS 7285 (Part 2)",
        criticality: "CRITICAL"
      },
      {
        clauseNumber: "Clause 7.2",
        title: "Hydrostatic Stretch Test",
        requirement: "Cylinder must withstand hydrostatic test pressure of 250 kgf/cm² without permanent volumetric expansion exceeding 10%.",
        standard: "IS 7285 (Part 2) / IS 5844",
        criticality: "CRITICAL"
      },
      {
        clauseNumber: "Clause 8.1",
        title: "Wall Thickness",
        requirement: "Minimum calculated wall thickness shall not be less than 5.2 mm.",
        standard: "IS 7285 (Part 2)",
        criticality: "MAJOR"
      }
    ]
  },
  {
    id: "gem-tender-06",
    bidNumber: "GEM/2026/B/338902",
    title: "Enterprise Grade Laptops for Government Schools",
    category: "IT Hardware",
    buyer: {
      name: "Kendriya Vidyalaya Sangathan",
      department: "Ministry of Education",
      location: "Multiple Locations"
    },
    value: "₹ 5,80,00,000",
    valueNumeric: 58000000,
    publishedDate: "15 Sep 2026",
    closingDate: "10 Nov 2026",
    mandatoryStandard: "IS 13252 (Part 1):2010",
    requiredCertifications: ["BIS CRS", "BEE Star Rating (Min 4 Star)", "RoHS"],
    localContentRequired: 50,
    emdAmount: "₹ 11,60,000",
    msmeExempt: false,
    sampleTestRequired: false,
    description: "Intel Core i5 / AMD Ryzen 5 based laptops with 16GB RAM, 512GB SSD, pre-loaded with BOSS Linux / Windows 11 Pro.",
    clauses: [
      {
        clauseNumber: "Clause 1.5.1",
        title: "Protection Against Electric Shock",
        requirement: "Equipment shall be constructed such that there is adequate protection against contact with bare parts at hazardous voltages.",
        standard: "IS 13252 (Part 1)",
        criticality: "CRITICAL"
      },
      {
        clauseNumber: "Clause 4.3.8",
        title: "Battery Safety (IS 16046)",
        requirement: "Lithium-ion battery packs must be separately BIS certified under IS 16046 (Part 2) and withstand thermal abuse test.",
        standard: "IS 13252 (Pt 1) / IS 16046",
        criticality: "CRITICAL"
      },
      {
        clauseNumber: "Clause 5.1",
        title: "Touch Current",
        requirement: "Touch current for Class I equipment must not exceed 3.5 mA.",
        standard: "IS 13252 (Part 1)",
        criticality: "MAJOR"
      }
    ]
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bidNumber = searchParams.get("bidNumber");
  const query = searchParams.get("q")?.toLowerCase();

  if (bidNumber) {
    const tender = sampleTenders.find(
      (t) => t.bidNumber.toLowerCase() === bidNumber.toLowerCase() || t.id === bidNumber
    );
    if (!tender) {
      return NextResponse.json({ error: "Tender not found" }, { status: 404 });
    }
    return NextResponse.json({ tender });
  }

  let filtered = sampleTenders;
  if (query) {
    filtered = sampleTenders.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.bidNumber.toLowerCase().includes(query) ||
        t.mandatoryStandard.toLowerCase().includes(query) ||
        t.buyer.name.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    total: filtered.length,
    tenders: filtered
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bidNumber, manualTitle, manualSpecs, manualStandard, generateClauses } = body;

    // Use dynamic scraper + AI resolver
    const { resolveTender } = await import("@/lib/scrapers/gemScraper");
    
    // Check if we should fallback to sample tenders first for known IDs
    if (bidNumber && !generateClauses && !manualSpecs) {
      const existing = sampleTenders.find(
        (t) => t.bidNumber.toLowerCase() === bidNumber.toLowerCase() || t.id === bidNumber
      );
      if (existing) {
        return NextResponse.json({ tender: existing });
      }
    }

    const resolved = await resolveTender({
      bidNumber,
      manualTitle,
      manualSpecs,
      manualStandard
    });

    // Format to match GeMTender structure
    const tender: GeMTender = {
      id: `gem-tender-dynamic-${Date.now()}`,
      bidNumber: resolved.bidNumber,
      title: resolved.title,
      category: "Custom Category",
      buyer: {
        name: resolved.buyerName,
        department: resolved.department,
        location: "India"
      },
      value: "₹ Unknown",
      valueNumeric: 0,
      publishedDate: new Date().toISOString().split("T")[0],
      closingDate: resolved.closingDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      mandatoryStandard: resolved.mandatoryStandard,
      requiredCertifications: ["BIS Certification", "OEM Authorization"],
      localContentRequired: 50,
      emdAmount: "₹ Unknown",
      msmeExempt: true,
      sampleTestRequired: true,
      description: "Dynamically resolved tender specification",
      clauses: resolved.clauses.map(c => ({
        ...c,
        criticality: (c as any).criticality || "MAJOR"
      }))
    };

    return NextResponse.json({ tender, source: resolved.source });
  } catch (error) {
    console.error("Tender resolution failed:", error);
    return NextResponse.json(
      { error: "Failed to resolve tender details" },
      { status: 500 }
    );
  }
}
