"use server";

import { verifyISIMark } from "@/lib/db";
import { ProductRegistration } from "@/lib/types";

export async function verifyISIAction(isiMark: string): Promise<{ success: boolean; result?: ProductRegistration | null; error?: string }> {
  try {
    const result = await verifyISIMark(isiMark);
    return { success: true, result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
