/**
 * GeM Tender Scraper & Dynamic Resolver
 * Attempts to fetch real bid documents from bidplus.gem.gov.in.
 * Falls back to AI generation for resilient operation during demos or rate-limiting.
 */

import { generateGeminiWithCascade } from "@/lib/gemini";
import { TenderClause } from "@/app/api/gem-audit/tenders/route";

export interface GeMScraperResult {
  source: "live_scrape" | "ai_generated";
  bidNumber: string;
  title: string;
  buyerName: string;
  department: string;
  mandatoryStandard: string;
  clauses: TenderClause[];
  closingDate?: string;
  rawText?: string;
}

/**
 * Main entry point for resolving a tender.
 * Will try to scrape if bidNumber is provided, otherwise falls back to AI generation.
 */
export async function resolveTender(input: {
  bidNumber?: string;
  manualTitle?: string;
  manualSpecs?: string;
  manualStandard?: string;
}): Promise<GeMScraperResult> {
  const { bidNumber, manualTitle, manualSpecs, manualStandard } = input;

  // Tier 1: Try scraping if we have a bid number and no manual overrides
  if (bidNumber && !manualSpecs) {
    try {
      const scraped = await scrapeGeMBidPage(bidNumber);
      if (scraped) {
        // We got basic details, now ask AI to extract specific technical clauses from the scraped text
        const clauses = await generateClausesFromText(
          scraped.rawText || "",
          scraped.mandatoryStandard
        );
        scraped.clauses = clauses;
        scraped.source = "live_scrape";
        return scraped;
      }
    } catch {
      // Scraping failed, continue to AI fallback
    }
  }

  // Tier 2: AI Generation
  // If we have manual specs, generate clauses from them.
  // If we only have a bid number, generate a realistic mockup.
  
  const title = manualTitle || (bidNumber ? `Supply of Technical Equipment against ${bidNumber}` : "Custom Technical Procurement");
  const standard = manualStandard || "IS Specification";
  const context = manualSpecs || `Generate a realistic technical specification for ${title} under GeM guidelines.`;

  const clauses = await generateClausesFromText(context, standard);

  return {
    source: "ai_generated",
    bidNumber: bidNumber || `GEM/${new Date().getFullYear()}/B/${Math.floor(Math.random() * 900000) + 100000}`,
    title,
    buyerName: "Ministry / Department (Auto-Generated)",
    department: "Central Public Procurement",
    mandatoryStandard: standard,
    clauses,
    closingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  };
}

/**
 * Attempts to scrape bidplus.gem.gov.in for tender details.
 */
async function scrapeGeMBidPage(bidNumber: string): Promise<GeMScraperResult | null> {
  try {
    // GeM's public bid search URL pattern
    const url = `https://bidplus.gem.gov.in/showbidDocument/${bidNumber}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml"
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) return null;

    const html = await response.text();

    if (html.includes("Access Denied") || html.includes("captcha")) {
      return null;
    }

    // Basic HTML extraction (regex-based for resilience against minor DOM changes)
    const titleMatch = html.match(/<div[^>]*class="[^"]*bid_title[^"]*"[^>]*>([^<]+)/i);
    const buyerMatch = html.match(/Buyer Name:<\/strong>\s*<span>([^<]+)/i);
    const deptMatch = html.match(/Department:<\/strong>\s*<span>([^<]+)/i);
    
    // Extract standard if mentioned in text
    let standard = "IS Standard";
    const standardMatch = html.match(/IS\s*\d+(?:\s*:\s*\d{4})?/i);
    if (standardMatch) {
      standard = standardMatch[0];
    }

    if (titleMatch) {
      return {
        source: "live_scrape",
        bidNumber,
        title: titleMatch[1].trim(),
        buyerName: buyerMatch ? buyerMatch[1].trim() : "GeM Buyer",
        department: deptMatch ? deptMatch[1].trim() : "Government Department",
        mandatoryStandard: standard,
        clauses: [], // To be filled by AI
        rawText: html.replace(/<[^>]+>/g, " ") // Strip HTML tags for AI processing
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Uses Gemini AI to read unstructured technical specs or HTML and extract structured compliance clauses.
 */
async function generateClausesFromText(text: string, expectedStandard: string): Promise<TenderClause[]> {
  const prompt = `You are a Government e-Marketplace (GeM) Technical Evaluator.
Extract or generate 4-6 specific technical compliance clauses from the following context for standard: ${expectedStandard}.
If the context is just a title or lacks specific details, generate realistic technical requirements that a government buyer would demand for products under ${expectedStandard}.
Ensure the clauses have specific numeric thresholds where applicable (e.g. resistance, temperature, voltage).

Context:
"""
${text.substring(0, 3000)}
"""

Return ONLY valid JSON in this format:
[
  {
    "clauseNumber": "Clause 1.1",
    "title": "Material Specification",
    "requirement": "Must be made of 99.9% pure electrolytic copper",
    "standard": "${expectedStandard}"
  }
]`;

  try {
    const res = await generateGeminiWithCascade({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      responseMimeType: "application/json"
    });

    const cleaned = res.text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Ultimate fallback if AI is down
    return [
      {
        clauseNumber: "General 1.1",
        title: "Mandatory Certification",
        requirement: `Product must be certified under ${expectedStandard}`,
        standard: expectedStandard
      },
      {
        clauseNumber: "General 1.2",
        title: "Quality Conformance",
        requirement: "Valid NABL accredited laboratory test report required",
        standard: expectedStandard
      }
    ];
  }
}
