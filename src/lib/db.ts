import fs from 'fs';
import path from 'path';

// Define the User type
export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  department?: string;
};

import { supabase } from './supabaseClient';

export class LocalDB {
  private static getFilePath() {
    return path.join(process.cwd(), 'src', 'data', 'users.json');
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
        if (!error && data) return data as User;
      }
      // Fallback
      const filePath = this.getFilePath();
      if (!fs.existsSync(filePath)) return null;
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const users: User[] = JSON.parse(fileContents);
      return users.find((u) => u.email === email) || null;
    } catch (error) {
      console.error('Error reading db:', error);
      return null;
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) {
          const { password, ...userWithoutPassword } = data as User;
          return userWithoutPassword;
        }
      }
      // Fallback
      const filePath = this.getFilePath();
      if (!fs.existsSync(filePath)) return null;
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const users: User[] = JSON.parse(fileContents);
      const user = users.find((u) => u.id === id);
      if (!user) return null;
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error reading db:', error);
      return null;
    }
  }

  static async createUser(user: Omit<User, 'id'>): Promise<User> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('users')
          .insert([{ ...user }])
          .select()
          .single();
        if (!error && data) return data as User;
        if (error) {
          console.warn('Supabase user insert failed, using local storage fallback:', error.message);
        }
      }
      
      // Fallback
      const filePath = this.getFilePath();
      let users: User[] = [];
      if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        users = JSON.parse(fileContents);
      }
      
      const newUser: User = {
        ...user,
        id: `u${Date.now()}`
      };
      
      users.push(newUser);
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
      
      return newUser;
    } catch (error) {
      console.error('Error writing db:', error);
      throw error;
    }
  }
}

// ---------------------------------------------------------------------------
// ISI Verification and Standards Search Helpers
// ---------------------------------------------------------------------------
import { mockStandards, mockProducts } from './mockData';
import { ProductRegistration, Standard } from './types';
import { OFFICIAL_BIS_STANDARDS } from './backend/bisMasterCatalog';
import { OFFICIAL_BIS_LICENSES } from '@/data/bisOfficialRegistry';

export async function verifyISIMark(isiMark: string): Promise<ProductRegistration | null> {
  const cleanMark = (isiMark || '').trim().toUpperCase();
  if (!cleanMark) return null;

  // 1. Check mockProducts
  const mockMatch = mockProducts.find(
    (p) => p.isiMark.toUpperCase() === cleanMark || p.id.toUpperCase() === cleanMark
  );
  if (mockMatch) return mockMatch;

  // 2. Check OFFICIAL_BIS_LICENSES
  const numericOnly = cleanMark.replace(/[^0-9]/g, '');
  const official = OFFICIAL_BIS_LICENSES.find((lic) => {
    const licUpper = lic.cmlNumber.toUpperCase();
    if (licUpper === cleanMark) return true;
    if (numericOnly && licUpper.replace(/[^0-9]/g, '') === numericOnly) return true;
    return false;
  });

  if (official) {
    return {
      id: official.cmlNumber,
      isiMark: official.cmlNumber,
      productName: official.productScope,
      manufacturer: official.manufacturerName,
      status: official.status === 'OPERATIVE' ? 'Valid' : 'Revoked',
      issueDate: official.validityFrom,
      expiryDate: official.validityTo,
    };
  }

  return null;
}

export async function searchStandards(query: string): Promise<Standard[]> {
  const q = (query || '').toLowerCase().trim();
  if (!q) return mockStandards;

  // Search mockStandards first
  const matches = mockStandards.filter(
    (s) =>
      s.standardNumber.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
  );

  if (matches.length > 0) return matches;

  // Search master catalog and map to Standard format
  const officialMatches: Standard[] = OFFICIAL_BIS_STANDARDS.filter(
    (s) =>
      s.standardNumber.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
  ).map((s) => ({
    id: s.id,
    standardNumber: s.standardNumber,
    title: s.title,
    description: s.description,
    productCategory: s.productCategory,
    isMandatory: s.isMandatory,
    status: (s.status === 'Active'
      ? 'Active'
      : s.status === 'Draft'
      ? 'Draft'
      : 'Withdrawn') as 'Active' | 'Draft' | 'Withdrawn',
    lastUpdated: s.lastUpdated,
  }));

  return officialMatches;
}

