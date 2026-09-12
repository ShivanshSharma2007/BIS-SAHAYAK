import { Standard, Lab, ProductRegistration, DraftComment } from './types';

export const mockStandards: Standard[] = [
  {
    id: "std-001",
    standardNumber: "IS 1293:2005",
    title: "Plugs and Socket-Outlets of Rated Voltage up to and including 250 Volts and Rated Current up to 16 Amperes",
    description: "Specifies requirements and tests for plugs and socket-outlets for household and similar purposes.",
    productCategory: "Electrical",
    isMandatory: true,
    status: "Active",
    lastUpdated: "2024-01-15T00:00:00Z"
  },
  {
    id: "std-002",
    standardNumber: "IS 14543:2016",
    title: "Packaged Drinking Water (Other than Packaged Natural Mineral Water)",
    description: "Specification for packaged drinking water to ensure safety and quality.",
    productCategory: "Food & Water",
    isMandatory: true,
    status: "Active",
    lastUpdated: "2023-11-20T00:00:00Z"
  },
  {
    id: "std-003",
    standardNumber: "IS 17855:2022 (Draft)",
    title: "Electric Vehicle Charging Equipment - Safety Requirements",
    description: "Safety standards for EV charging stations and cables.",
    productCategory: "Automotive",
    isMandatory: false,
    status: "Draft",
    lastUpdated: "2024-03-01T00:00:00Z"
  }
];

export const mockLabs: Lab[] = [
  {
    id: "lab-001",
    name: "National Test House (NR)",
    address: "Kamla Nehru Nagar, Ghaziabad, UP",
    latitude: 28.6692,
    longitude: 77.4538,
    contact: "nth-nr@nic.in",
    accreditedStandards: ["std-001", "std-002"]
  },
  {
    id: "lab-002",
    name: "TUV Rheinland India Pvt. Ltd.",
    address: "Electronic City Phase 1, Bangalore, Karnataka",
    latitude: 12.8399,
    longitude: 77.6770,
    contact: "info@ind.tuv.com",
    accreditedStandards: ["std-001", "std-003"]
  },
  {
    id: "lab-003",
    name: "Electronics Regional Test Laboratory (West)",
    address: "MIDC, Andheri East, Mumbai",
    latitude: 19.1136,
    longitude: 72.8697,
    contact: "ertlmumbai@stqc.gov.in",
    accreditedStandards: ["std-001", "std-003"]
  }
];

export const mockProducts: ProductRegistration[] = [
  {
    id: "prod-001",
    isiMark: "CM/L-1234567",
    productName: "Syska 3-Pin Plug",
    manufacturer: "Syska LED Lights Pvt Ltd",
    status: "Valid",
    issueDate: "2022-05-10T00:00:00Z",
    expiryDate: "2025-05-09T00:00:00Z"
  },
  {
    id: "prod-002",
    isiMark: "CM/L-9999999",
    productName: "Generic Wall Socket",
    manufacturer: "Unknown Manufacturer",
    status: "Fake",
    issueDate: "2020-01-01T00:00:00Z",
    expiryDate: "2021-01-01T00:00:00Z"
  }
];

export const mockComments: DraftComment[] = [
  {
    id: "com-001",
    standardId: "std-003",
    userId: "user-abc",
    userName: "Dr. A. Sharma",
    comment: "Section 4.2 needs clarification regarding the IP67 waterproofing standards for outdoor charging stations.",
    section: "4.2",
    createdAt: "2024-03-05T10:30:00Z"
  }
];
