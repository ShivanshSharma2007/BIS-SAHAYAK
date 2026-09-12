export interface Standard {
  id: string;
  standardNumber: string;
  title: string;
  description: string;
  productCategory: string;
  isMandatory: boolean;
  status: 'Active' | 'Draft' | 'Withdrawn';
  pdfUrl?: string;
  lastUpdated: string;
}

export interface Lab {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  contact: string;
  accreditedStandards: string[]; // Array of standard IDs
}

export interface ProductRegistration {
  id: string;
  isiMark: string;
  productName: string;
  manufacturer: string;
  status: 'Valid' | 'Fake' | 'Revoked';
  issueDate: string;
  expiryDate: string;
}

export interface DraftComment {
  id: string;
  standardId: string;
  userId: string;
  userName: string;
  comment: string;
  section: string;
  createdAt: string;
}
