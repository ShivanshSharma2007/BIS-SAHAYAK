/**
 * Standard-specific numeric thresholds for the rule-based compliance engine.
 * Each standard maps to a set of measurable parameters with known pass/fail limits.
 * Used by clause-audit/route.ts when Gemini AI is unavailable.
 *
 * Sources: Official Indian Standard documents published by BIS (bis.gov.in)
 */

export interface ThresholdParam {
  param: string;
  displayName: string;
  clause: string;
  unit: string;
  direction: "min" | "max";
  threshold: number;
  keywords: string[];
}

export interface StandardThreshold {
  standard: string;
  title: string;
  category: string;
  thresholds: ThresholdParam[];
}

export const STANDARD_THRESHOLDS: Record<string, StandardThreshold> = {
  "694": {
    standard: "IS 694:2010",
    title: "PVC Insulated Cables for Working Voltages up to and including 1100 V",
    category: "Electrical Cables & Wires",
    thresholds: [
      {
        param: "conductor_resistance",
        displayName: "Conductor Electrical Resistance at 20°C",
        clause: "Clause 5.2",
        unit: "Ω/km",
        direction: "max",
        threshold: 12.1,
        keywords: ["resistance", "ohm/km", "ω/km", "ohm", "conductor"]
      },
      {
        param: "copper_purity",
        displayName: "Copper Conductor Purity",
        clause: "Clause 4.1",
        unit: "%",
        direction: "min",
        threshold: 99.90,
        keywords: ["purity", "copper", "electrolytic", "99.9"]
      },
      {
        param: "insulation_thickness",
        displayName: "Minimum Insulation Radial Thickness",
        clause: "Clause 6.3",
        unit: "mm",
        direction: "min",
        threshold: 0.53,
        keywords: ["insulation", "thickness", "radial", "mm"]
      },
      {
        param: "oxygen_index",
        displayName: "Oxygen Index (Flame Retardance)",
        clause: "Clause 8.1",
        unit: "%",
        direction: "min",
        threshold: 29.0,
        keywords: ["oxygen index", "oxygen", "flame", "retard"]
      },
      {
        param: "hv_withstand",
        displayName: "High Voltage Immersion Withstand",
        clause: "Clause 10.4",
        unit: "kV",
        direction: "min",
        threshold: 3.0,
        keywords: ["immersion", "high voltage", "withstand", "kv", "water"]
      }
    ]
  },

  "1293": {
    standard: "IS 1293:2019",
    title: "Plugs and Socket-Outlets",
    category: "Wiring Accessories",
    thresholds: [
      {
        param: "temperature_rise",
        displayName: "Terminal Temperature Rise at Full Load",
        clause: "Clause 13.2",
        unit: "°C",
        direction: "max",
        threshold: 45.0,
        keywords: ["temperature rise", "temperature", "full load", "45"]
      },
      {
        param: "insulation_resistance",
        displayName: "Insulation Resistance at 500V DC",
        clause: "Clause 15.1",
        unit: "MΩ",
        direction: "min",
        threshold: 5.0,
        keywords: ["insulation resistance", "500v", "megaohm"]
      },
      {
        param: "glow_wire",
        displayName: "Glow Wire Flammability Test Temperature",
        clause: "Clause 20.3",
        unit: "°C",
        direction: "min",
        threshold: 850.0,
        keywords: ["glow wire", "glow", "850", "flammab"]
      },
      {
        param: "dielectric_strength",
        displayName: "Dielectric Strength Withstand",
        clause: "Clause 15.1",
        unit: "V AC",
        direction: "min",
        threshold: 2000.0,
        keywords: ["dielectric", "2000v", "withstand"]
      }
    ]
  },

  "16221": {
    standard: "IS 16221 (Part 2)",
    title: "Grid-Connected Solar PV Inverters",
    category: "Renewable Energy & Inverters",
    thresholds: [
      {
        param: "euro_efficiency",
        displayName: "Euro Weighted Efficiency",
        clause: "Clause 5.1",
        unit: "%",
        direction: "min",
        threshold: 98.2,
        keywords: ["euro efficiency", "efficiency", "weighted"]
      },
      {
        param: "thdi",
        displayName: "Total Harmonic Distortion (Current)",
        clause: "Clause 11.3",
        unit: "%",
        direction: "max",
        threshold: 3.0,
        keywords: ["thd", "harmonic", "distortion"]
      },
      {
        param: "anti_island_trip",
        displayName: "Anti-Islanding Trip Time",
        clause: "Clause 6.4",
        unit: "seconds",
        direction: "max",
        threshold: 2.0,
        keywords: ["anti-island", "islanding", "trip", "disconnect"]
      }
    ]
  },

  "10322": {
    standard: "IS 10322 (Part 5/Sec 3):2012",
    title: "LED Road / Street Light Luminaires",
    category: "Smart Lighting Infrastructure",
    thresholds: [
      {
        param: "luminous_efficacy",
        displayName: "System Luminous Efficacy",
        clause: "Clause 4.3",
        unit: "lm/W",
        direction: "min",
        threshold: 140.0,
        keywords: ["efficacy", "lumen", "lm/w", "luminous"]
      },
      {
        param: "surge_protection",
        displayName: "Surge Protection Device Rating",
        clause: "Clause 7.2",
        unit: "kV",
        direction: "min",
        threshold: 10.0,
        keywords: ["surge", "spd", "kv", "ka"]
      }
    ]
  },

  "7285": {
    standard: "IS 7285 (Part 2):2017",
    title: "Seamless Steel Gas Cylinders",
    category: "Medical Gases & Equipment",
    thresholds: [
      {
        param: "carbon_content",
        displayName: "Maximum Carbon Content in Steel",
        clause: "Clause 5.1",
        unit: "%",
        direction: "max",
        threshold: 0.40,
        keywords: ["carbon", "chemical composition", "steel"]
      },
      {
        param: "hydrostatic_pressure",
        displayName: "Hydrostatic Test Pressure",
        clause: "Clause 7.2",
        unit: "kgf/cm²",
        direction: "min",
        threshold: 250,
        keywords: ["hydrostatic", "pressure", "kgf", "test"]
      },
      {
        param: "volumetric_expansion",
        displayName: "Maximum Permanent Volumetric Expansion",
        clause: "Clause 7.2",
        unit: "%",
        direction: "max",
        threshold: 10.0,
        keywords: ["expansion", "permanent", "volumetric"]
      },
      {
        param: "wall_thickness",
        displayName: "Minimum Wall Thickness",
        clause: "Clause 8.1",
        unit: "mm",
        direction: "min",
        threshold: 5.2,
        keywords: ["wall thickness", "thickness", "wall"]
      }
    ]
  },

  "13252": {
    standard: "IS 13252 (Part 1):2010",
    title: "Information Technology Equipment Safety",
    category: "IT Hardware",
    thresholds: [
      {
        param: "touch_current",
        displayName: "Touch Current for Class I Equipment",
        clause: "Clause 5.1",
        unit: "mA",
        direction: "max",
        threshold: 3.5,
        keywords: ["touch current", "leakage", "ma"]
      },
      {
        param: "battery_thermal_abuse",
        displayName: "Lithium Battery Thermal Abuse Test",
        clause: "Clause 4.3.8",
        unit: "pass/fail",
        direction: "min",
        threshold: 1,
        keywords: ["battery", "lithium", "thermal", "abuse", "is 16046"]
      }
    ]
  }
};

/**
 * Extract a numeric value from report text matching a threshold parameter.
 */
export function extractValueFromReport(text: string, param: ThresholdParam): number | null {
  const lower = text.toLowerCase();
  const hasKeyword = param.keywords.some(kw => lower.includes(kw));
  if (!hasKeyword) return null;

  for (const kw of param.keywords) {
    const kwIdx = lower.indexOf(kw);
    if (kwIdx === -1) continue;
    const start = Math.max(0, kwIdx - 80);
    const end = Math.min(lower.length, kwIdx + kw.length + 120);
    const window = lower.substring(start, end);
    const numbers = window.match(/\d+\.?\d*/g);
    if (numbers && numbers.length > 0) {
      for (const numStr of numbers) {
        const val = parseFloat(numStr);
        if (!isNaN(val) && val > 0 && val < 100000) {
          return val;
        }
      }
    }
  }
  return null;
}

/**
 * Resolve the correct standard threshold set from a standard string like "IS 694:2010"
 */
export function resolveStandardThresholds(standardStr: string): StandardThreshold | null {
  const numMatch = standardStr.match(/IS\s*(?:\/IEC\s*)?(\d+)/i);
  if (!numMatch) return null;
  return STANDARD_THRESHOLDS[numMatch[1]] || null;
}
