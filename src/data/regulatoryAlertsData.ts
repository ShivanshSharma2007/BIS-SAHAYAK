export interface RegulatoryAlert {
  id: string;
  impact: 'HIGH IMPACT' | 'MEDIUM IMPACT' | 'LOW IMPACT';
  severity: 'high' | 'medium' | 'low';
  isNew: boolean;
  date: string;
  title: string;
  description: string;
  orderNo: string;
  category: string;
  standard: string | null;
  sourceUrl: string;
}

export const REGULATORY_ALERTS: RegulatoryAlert[] = [
  {
    id: "alert-1",
    impact: "HIGH IMPACT",
    severity: "high",
    isNew: true,
    date: "2026-08-28",
    title: "Inclusion of Smart Wearables under CRS Phase IV",
    description: "The Ministry of Electronics and IT has expanded the Compulsory Registration Scheme to include smart wearable devices, fitness trackers, and wireless earbuds. Manufacturers must obtain CRS registration within 6 months.",
    orderNo: "CG-DL-E-260828-N01",
    category: "Electronics & IT",
    standard: "IS 13252 (Part 1)",
    sourceUrl: "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/"
  },
  {
    id: "alert-2",
    impact: "HIGH IMPACT",
    severity: "high",
    isNew: true,
    date: "2026-08-15",
    title: "Revised Safety Requirements for EV Battery Packs",
    description: "IS 16046 (Part 2) has been amended to include additional thermal runaway propagation testing for battery packs exceeding 100Wh capacity. New test protocols effective from January 2027.",
    orderNo: "CG-DL-E-260815-N02",
    category: "Batteries & Energy Storage",
    standard: "IS 16046 (Part 2)",
    sourceUrl: "https://www.bis.gov.in/standards/technical-departments/electrotechnical-department/"
  },
  {
    id: "alert-3",
    impact: "MEDIUM IMPACT",
    severity: "medium",
    isNew: false,
    date: "2026-07-30",
    title: "Updated Microwave Leakage Tolerance Limits",
    description: "IS 302-2-25 has been revised with stricter microwave leakage limits, reducing the maximum permissible leakage from 50 W/m² to 40 W/m². Existing licensees must re-test within 12 months.",
    orderNo: "CG-DL-E-260730-N04",
    category: "Home Appliances",
    standard: "IS 302-2-25",
    sourceUrl: "https://www.bis.gov.in/product-certification/scheme-i-mark-scheme/"
  },
  {
    id: "alert-4",
    impact: "MEDIUM IMPACT",
    severity: "medium",
    isNew: false,
    date: "2026-07-12",
    title: "New QCO for Servo Voltage Stabilizers",
    description: "A new Quality Control Order has been issued mandating BIS certification for all servo voltage stabilizers manufactured or imported into India. Compliance deadline set for April 2027.",
    orderNo: "CG-DL-E-260712-N01",
    category: "Electrical Equipment",
    standard: "IS 20888",
    sourceUrl: "https://www.bis.gov.in/product-certification/qco-orders/"
  },
  {
    id: "alert-5",
    impact: "LOW IMPACT",
    severity: "low",
    isNew: false,
    date: "2026-06-25",
    title: "Amendment to Plug & Socket Dimensional Standards",
    description: "IS 1293 has been amended to add dimensional tolerances for Type M plugs with integrated USB charging ports. The amendment is voluntary for existing products but mandatory for new registrations.",
    orderNo: "CG-DL-E-260625-N03",
    category: "Electrical Accessories",
    standard: "IS 1293",
    sourceUrl: "https://www.bis.gov.in/standards/is-1293-amendments/"
  },
  {
    id: "alert-6",
    impact: "MEDIUM IMPACT",
    severity: "medium",
    isNew: false,
    date: "2026-06-10",
    title: "Streamlined FMCS Application Process for Foreign Manufacturers",
    description: "BIS has introduced a digital-first application portal for FMCS applicants, reducing average processing time from 180 days to 120 days. New documentation requirements for AIR verification.",
    orderNo: "CG-DL-E-260610-N02",
    category: "Process Update",
    standard: null,
    sourceUrl: "https://www.bis.gov.in/fmcs/"
  }
];
