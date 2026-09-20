/**
 * CPPP (Central Public Procurement Portal) Debarment Database
 * Realistic mock debarment records for pre-bid compliance checking.
 * Based on real debarment order formats from eprocure.gov.in
 *
 * In production, this would be populated via scraping eprocure.gov.in/cppp/debarmentlist
 */

export interface DebarmentRecord {
  companyName: string;
  aliases: string[];           // alternative names / trade names
  pan: string;
  gstin?: string;
  debarmentOrderNo: string;
  issuingAuthority: string;
  ministry: string;
  reason: string;
  debarmentPeriod: string;     // e.g. "24 Months"
  effectiveFrom: string;
  effectiveTo: string;
  status: "ACTIVE" | "EXPIRED" | "UNDER_REVIEW";
}

export const CPPP_DEBARMENT_LIST: DebarmentRecord[] = [
  {
    companyName: "ShoddyTech Cables & Wires Corp",
    aliases: ["shoddytech", "shoddy tech", "shoddy cables"],
    pan: "AAACF9999Z",
    gstin: "06AAACF9999Z1Z0",
    debarmentOrderNo: "DoE/Proc/Debar/2024/098",
    issuingAuthority: "Department of Expenditure",
    ministry: "Ministry of Finance",
    reason: "Supply of sub-standard cables with falsified BIS test certificates under GeM Contract GEM/2023/B/410923",
    debarmentPeriod: "24 Months",
    effectiveFrom: "15-Mar-2024",
    effectiveTo: "14-Mar-2026",
    status: "ACTIVE"
  },
  {
    companyName: "FakeCorp Electricals Ltd",
    aliases: ["fakecorp", "fake corp", "fake electricals"],
    pan: "AABCF8812K",
    gstin: "07AABCF8812K1Z5",
    debarmentOrderNo: "GFR/151/2023/DEL/442",
    issuingAuthority: "Central Vigilance Commission",
    ministry: "Ministry of Commerce",
    reason: "Fraudulent submission of counterfeit ISI marks on unshuttered socket-outlets. FIR No. 2023/CBI/RC-044",
    debarmentPeriod: "36 Months",
    effectiveFrom: "01-Jan-2023",
    effectiveTo: "31-Dec-2025",
    status: "ACTIVE"
  },
  {
    companyName: "Brilliance Imports Trading Co",
    aliases: ["brilliance imports", "brilliance trading"],
    pan: "AAICD2233M",
    debarmentOrderNo: "MoP/Proc/2024/BL-019",
    issuingAuthority: "Central Electricity Authority",
    ministry: "Ministry of Power",
    reason: "Import of non-BIS-certified LED luminaires with forged CRS R-numbers. Violation of Electronics & IT Goods QCO 2023",
    debarmentPeriod: "24 Months",
    effectiveFrom: "20-Jul-2024",
    effectiveTo: "19-Jul-2026",
    status: "ACTIVE"
  },
  {
    companyName: "MedStar Surgical Instruments Pvt Ltd",
    aliases: ["medstar", "med star", "medstar surgical"],
    pan: "AADCM4456H",
    debarmentOrderNo: "MoHFW/Debar/2024/031",
    issuingAuthority: "CDSCO (Central Drugs Standard Control Organisation)",
    ministry: "Ministry of Health & Family Welfare",
    reason: "Supply of medical oxygen cylinders with expired hydrostatic test certificates to AIIMS procurement. Patient safety violation",
    debarmentPeriod: "36 Months",
    effectiveFrom: "01-Apr-2024",
    effectiveTo: "31-Mar-2027",
    status: "ACTIVE"
  },
  {
    companyName: "QuickFix Solar Solutions LLP",
    aliases: ["quickfix solar", "quickfix", "quick fix solar"],
    pan: "AAIFQ7789L",
    debarmentOrderNo: "MNRE/Proc/BL/2025/007",
    issuingAuthority: "Solar Energy Corporation of India",
    ministry: "Ministry of New & Renewable Energy",
    reason: "Non-performance on 10MW rooftop solar installation contract. Abandoned site after 30% advance payment",
    debarmentPeriod: "24 Months",
    effectiveFrom: "15-Jan-2025",
    effectiveTo: "14-Jan-2027",
    status: "ACTIVE"
  },
  {
    companyName: "GlobalTech Computer Systems",
    aliases: ["globaltech", "global tech computers", "globaltech systems"],
    pan: "AABCG3344N",
    debarmentOrderNo: "MoE/IT/Debar/2025/014",
    issuingAuthority: "Kendriya Vidyalaya Sangathan",
    ministry: "Ministry of Education",
    reason: "Supply of refurbished laptops labelled as new with falsified BEE Star Ratings under PM Vidyalakshmi Scheme contract",
    debarmentPeriod: "24 Months",
    effectiveFrom: "01-Jun-2025",
    effectiveTo: "31-May-2027",
    status: "ACTIVE"
  },
  {
    companyName: "DragonWire Industrial Cables (China)",
    aliases: ["dragonwire", "dragon wire", "dragonwire industrial"],
    pan: "FOREIGN-DW",
    debarmentOrderNo: "DPIIT/QCO/2024/Debar-051",
    issuingAuthority: "DPIIT",
    ministry: "Ministry of Commerce & Industry",
    reason: "Systematic violation of QCO by importing and re-labelling non-ISI marked cables with fake CM/L numbers across 8 states",
    debarmentPeriod: "Permanent (5 Years Minimum)",
    effectiveFrom: "01-Aug-2024",
    effectiveTo: "31-Jul-2029",
    status: "ACTIVE"
  },
  {
    companyName: "NovaPower Electronics Pvt Ltd",
    aliases: ["novapower", "nova power", "nova electronics"],
    pan: "AADCN5566R",
    debarmentOrderNo: "BEE/Proc/2024/BL-008",
    issuingAuthority: "Bureau of Energy Efficiency",
    ministry: "Ministry of Power",
    reason: "Falsified BEE Star Rating labels on ceiling fans. Actual energy consumption 30% higher than declared rating",
    debarmentPeriod: "18 Months",
    effectiveFrom: "10-Sep-2024",
    effectiveTo: "09-Mar-2026",
    status: "ACTIVE"
  },
  {
    companyName: "SafeGuard Fire Equipment Co",
    aliases: ["safeguard fire", "safeguard equipment"],
    pan: "AAKCS8899T",
    debarmentOrderNo: "MoHA/Fire/2023/Debar-022",
    issuingAuthority: "National Disaster Management Authority",
    ministry: "Ministry of Home Affairs",
    reason: "Fire extinguishers failed pressure tests during surprise market surveillance. 40% batch failure rate",
    debarmentPeriod: "24 Months",
    effectiveFrom: "15-Nov-2023",
    effectiveTo: "14-Nov-2025",
    status: "ACTIVE"
  },
  {
    companyName: "PrimeSteel Fabricators",
    aliases: ["primesteel", "prime steel", "prime fabricators"],
    pan: "AAECF7711P",
    debarmentOrderNo: "CPWD/Proc/BL/2025/003",
    issuingAuthority: "Central Public Works Department",
    ministry: "Ministry of Housing & Urban Affairs",
    reason: "Structural steel bars supplied did not meet IS 1786 Fe-500D specifications. Tested tensile strength 25% below requirement",
    debarmentPeriod: "24 Months",
    effectiveFrom: "01-Feb-2025",
    effectiveTo: "31-Jan-2027",
    status: "ACTIVE"
  }
];

/**
 * Search the debarment list by company name, PAN, or GSTIN.
 * Returns matching records or empty array.
 */
export function searchDebarmentList(query: string): DebarmentRecord[] {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 3) return [];

  return CPPP_DEBARMENT_LIST.filter(record => {
    if (record.status !== "ACTIVE") return false;

    // Match by company name or aliases
    if (record.companyName.toLowerCase().includes(q)) return true;
    if (record.aliases.some(alias => q.includes(alias) || alias.includes(q))) return true;

    // Match by PAN (extracted from GSTIN chars 3-12)
    const queryPAN = q.length === 15 ? q.substring(2, 12).toUpperCase() : q.toUpperCase();
    if (record.pan === queryPAN) return true;

    // Match by GSTIN
    if (record.gstin && record.gstin.toLowerCase() === q) return true;

    return false;
  });
}
