import { StandardItem, DraftComment } from "./types";

export const INITIAL_STANDARDS: StandardItem[] = [
  {
    id: "std-1293",
    standardNumber: "IS 1293:2019",
    title: "Plugs and Socket-Outlets for Household and Similar Purposes of Rated Voltage up to 250V and Rated Current up to 16A",
    description: "Specifies constructional, electrical, and flammability safety requirements for domestic plugs and socket-outlets across India.",
    productCategory: "Electrical Wiring Accessories",
    isMandatory: true,
    schemeType: "Scheme-I (ISI Mark)",
    status: "Active",
    keywords: ["plug", "socket", "outlet", "pin", "ampere", "shutter", "flammability"],
    lastUpdated: "2024-01-15T00:00:00Z",
    clauses: [
      {
        id: "cl-1293-1",
        clauseNumber: "Clause 7.1",
        title: "Automatic Safety Shutter Mechanism",
        description: "Live socket contacts must be protected by integral automatic shutters preventing single-pin insertion.",
        isMandatory: true,
        testMethod: "Single probe insertion gauge test (1.0 mm steel wire at 20 N)",
        acceptableLimit: "No contact with live metal"
      },
      {
        id: "cl-1293-2",
        clauseNumber: "Clause 8.1",
        title: "Dimensions and Interchangeability",
        description: "Standard gauge dimensions for 2-pin and 3-pin plugs to prevent improper mating with non-standard sockets.",
        isMandatory: true,
        testMethod: "Go / No-Go Calibrated Plug Gauge Inspection",
        acceptableLimit: "Conforms to Table 1 & Table 2 tolerances"
      },
      {
        id: "cl-1293-3",
        clauseNumber: "Clause 13.2",
        title: "Temperature Rise Under 16A Full Load",
        description: "Terminal and contact temperature rise under continuous full-load current.",
        isMandatory: true,
        testMethod: "Thermocouple measurement after 1 hour continuous current",
        acceptableLimit: "Temperature rise <= 45°C"
      },
      {
        id: "cl-1293-4",
        clauseNumber: "Clause 20.3",
        title: "Glow-Wire Flammability Resistance",
        description: "Resistance of insulating material retaining current-carrying parts to abnormal heat and fire.",
        isMandatory: true,
        testMethod: "Glow-wire test at 850°C",
        acceptableLimit: "No sustained flame or extinction within 30 seconds"
      }
    ]
  },
  {
    id: "std-15885",
    standardNumber: "IS 15885 (Part 2/Sec 13):2012",
    title: "Safety of Lamp Controlgear - Electronic Controlgear for LED Modules",
    description: "Safety guidelines for D.C. or A.C. supplied electronic controlgear (LED drivers, constant voltage/current power supplies) used in luminaires.",
    productCategory: "Lighting & Electronics",
    isMandatory: true,
    schemeType: "CRS (Compulsory Registration)",
    status: "Active",
    keywords: ["led", "driver", "controlgear", "lamp", "power", "luminaire", "lighting"],
    lastUpdated: "2024-02-10T00:00:00Z",
    clauses: [
      {
        id: "cl-15885-1",
        clauseNumber: "Clause 4.1",
        title: "Protection Against Electric Shock",
        description: "Accessible parts of the LED driver must have adequate insulation from primary live circuits.",
        isMandatory: true,
        testMethod: "Standard test finger inspection at 20 N force",
        acceptableLimit: "No electrical contact with SELV/hazardous live parts"
      },
      {
        id: "cl-15885-2",
        clauseNumber: "Clause 7.2",
        title: "Moisture Resistance & Insulation Resistance",
        description: "Withstand 48 hours in humidity chamber (91-95% RH) followed by 500V DC megger test.",
        isMandatory: true,
        testMethod: "Humidity chamber at 25°C followed by 500V DC insulation test",
        acceptableLimit: "Insulation resistance >= 4.0 MΩ"
      },
      {
        id: "cl-15885-3",
        clauseNumber: "Clause 14.1",
        title: "Fault Condition Testing (Short Circuit & Open Circuit)",
        description: "Driver must safely handle output short circuits and transformer primary failures without fire or smoke.",
        isMandatory: true,
        testMethod: "Output terminal direct short-circuit for 4 hours",
        acceptableLimit: "No emission of flames, molten material, or toxic gas"
      }
    ]
  },
  {
    id: "std-16046",
    standardNumber: "IS 16046 (Part 2):2018",
    title: "Secondary Cells and Batteries containing Alkaline or other non-acid Electrolytes - Lithium Systems",
    description: "Mandatory safety requirements for portable sealed secondary lithium cells and batteries (for smartphones, laptops, power tools, EV modules).",
    productCategory: "Energy Storage & Batteries",
    isMandatory: true,
    schemeType: "CRS (Compulsory Registration)",
    status: "Active",
    keywords: ["battery", "lithium", "cell", "li-ion", "pack", "portable", "overcharge"],
    lastUpdated: "2024-03-01T00:00:00Z",
    clauses: [
      {
        id: "cl-16046-1",
        clauseNumber: "Clause 7.2.1",
        title: "Continuous Charging at Constant Voltage",
        description: "Fully charged cells are subjected to continuous charge for 7 days without rupture or fire.",
        isMandatory: true,
        testMethod: "Constant 4.25V per cell charge at 20°C for 168 hours",
        acceptableLimit: "No fire, no explosion, no leakage"
      },
      {
        id: "cl-16046-2",
        clauseNumber: "Clause 7.3.2",
        title: "External Short Circuit at 55°C",
        description: "Fully charged battery pack short-circuited with external resistance < 80 mΩ at elevated ambient temperature.",
        isMandatory: true,
        testMethod: "Direct copper shunt application in thermal chamber at 55°C",
        acceptableLimit: "Case temp <= 150°C; no fire or explosion"
      },
      {
        id: "cl-16046-3",
        clauseNumber: "Clause 7.3.3",
        title: "Free Fall Drop Test",
        description: "Enclosure impact integrity when dropped onto flat concrete floor from 1.0m height.",
        isMandatory: true,
        testMethod: "1.0m drop test on each face onto concrete floor",
        acceptableLimit: "No fire, no explosion, enclosure intact"
      },
      {
        id: "cl-16046-4",
        clauseNumber: "Clause 7.3.4",
        title: "Thermal Abuse Test (130°C Oven)",
        description: "Resistance of cell to extreme thermal runaway conditions in elevated temperature chamber.",
        isMandatory: true,
        testMethod: "Thermal chamber ramped to 130°C +/- 2°C, held for 10 minutes",
        acceptableLimit: "No fire, no explosion"
      },
      {
        id: "cl-16046-5",
        clauseNumber: "Clause 7.3.6",
        title: "Crush and Mechanical Impact Test",
        description: "Mechanical deformation resistance under heavy hydraulic bar press.",
        isMandatory: true,
        testMethod: "Hydraulic piston crush up to 13 kN force",
        acceptableLimit: "No explosion or persistent flame"
      }
    ]
  },
  {
    id: "std-694",
    standardNumber: "IS 694:2010",
    title: "PVC Insulated Cables for Working Voltages up to and including 1100 V",
    description: "Specifies materials, conductor purity, PVC insulation sheath thickness, and flammability parameters for building and industrial power cables.",
    productCategory: "Electrical Cables & Wires",
    isMandatory: true,
    schemeType: "Scheme-I (ISI Mark)",
    status: "Active",
    keywords: ["cable", "wire", "copper", "pvc", "sheath", "conductor", "flame", "voltage"],
    lastUpdated: "2024-02-15T00:00:00Z",
    clauses: [
      {
        id: "cl-694-1",
        clauseNumber: "Clause 4.1",
        title: "Conductor Material Purity & Resistance",
        description: "High-conductivity annealed electrolytic grade copper with electrical resistance strictly within maximum limits.",
        isMandatory: true,
        testMethod: "Kelvin double bridge resistance test at 20°C",
        acceptableLimit: "Maximum 12.1 ohm/km for 1.5 sq mm"
      },
      {
        id: "cl-694-2",
        clauseNumber: "Clause 8.1",
        title: "Oxygen Index Flame Retardancy (IS 10810 Pt 58)",
        description: "Minimum oxygen percentage required to support combustion of cable PVC insulation sheath.",
        isMandatory: true,
        testMethod: "Oxygen index chamber flammability test",
        acceptableLimit: "Oxygen Index >= 29.0%"
      },
      {
        id: "cl-694-3",
        clauseNumber: "Clause 16.2",
        title: "Spark & High Voltage Withstand Test",
        description: "High potential AC spark test to ensure zero pinholes or dielectric breakdown across cable length.",
        isMandatory: true,
        testMethod: "3.0 kV AC spark test across continuous extrusion run",
        acceptableLimit: "Zero insulation puncture/breakdown"
      }
    ]
  },
  {
    id: "std-17855",
    standardNumber: "IS 17855:2022 (Draft Revision)",
    title: "Electric Vehicle (EV) Safety Requirements - Rechargeable Electrical Energy Storage System (REESS)",
    description: "Proposed regulatory update specifying enhanced thermal runaway propagation safeguards, cell venting gas analysis, and crash water-immersion safety.",
    productCategory: "Automotive & EV",
    isMandatory: false,
    schemeType: "Scheme-I (ISI Mark)",
    status: "Draft",
    keywords: ["ev", "electric vehicle", "reess", "battery pack", "thermal runaway", "draft", "automotive"],
    lastUpdated: "2026-08-10T00:00:00Z",
    clauses: [
      {
        id: "cl-17855-1",
        clauseNumber: "Clause 6.1 (Proposed)",
        title: "Single Cell Thermal Runaway Initiation Test",
        description: "Triggering a thermal runaway in a single cell within the battery pack must not propagate to adjacent cells for at least 10 minutes.",
        isMandatory: false,
        testMethod: "Ceramic cartridge heater trigger at 100°C/min inside pack",
        acceptableLimit: "No external fire, hazardous venting into passenger cabin for min 10 minutes"
      },
      {
        id: "cl-17855-2",
        clauseNumber: "Clause 8.4 (Proposed)",
        title: "Saltwater Immersion Ingress Integrity",
        description: "Battery pack submerged in 3.5% NaCl solution to simulate flash flooding conditions.",
        isMandatory: false,
        testMethod: "Submersion for 2 hours followed by 24 hour post-immersion monitoring",
        acceptableLimit: "No fire, no explosion, insulation resistance >= 100 Ω/V"
      }
    ]
  }
];

export const INITIAL_COMMENTS: DraftComment[] = [
  {
    id: "com-001",
    standardId: "std-17855",
    userId: "stakeholder-01",
    userName: "Society of Indian Automobile Manufacturers (SIAM)",
    organization: "SIAM Electric Mobility Committee",
    comment: "Recommending an extension of the compliance transition window to 18 months for Tier-2 pack assemblers to commission automated thermal runaway trigger rigs.",
    section: "Clause 6.1 (Thermal Runaway)",
    createdAt: "2026-08-18T10:30:00Z"
  },
  {
    id: "com-002",
    standardId: "std-17855",
    userId: "stakeholder-02",
    userName: "ARAI Battery Engineering Cell",
    organization: "Automotive Research Association of India",
    comment: "Concur with the 10-minute passenger egress window; propose harmonizing temperature sensor placement with UN ECE R100 Rev 3.",
    section: "Clause 6.1.4 (Sensor Placement)",
    createdAt: "2026-08-22T14:15:00Z"
  }
];
