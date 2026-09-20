import { GoogleGenAI } from '@google/genai';

// Ranked list of active Google Gemini models to automatically cascade through on quota exhaustion (429) or deprecation (404)
export const CANDIDATE_GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

interface GenerateOptions {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  responseSchema?: any;
}

/**
 * Executes Gemini content generation with automated multi-model cascade failover.
 * If one model hits free-tier quota (429) or deprecation (404), it seamlessly falls over
 * to the next active model in the pool.
 */
export async function generateGeminiWithCascade(options: GenerateOptions): Promise<{ text: string; modelUsed: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in .env.local');
  }

  const ai = new GoogleGenAI({ apiKey });
  let lastError: any = null;

  for (const model of CANDIDATE_GEMINI_MODELS) {
    try {
      const config: any = {};
      if (options.systemInstruction) config.systemInstruction = options.systemInstruction;
      if (options.responseMimeType) config.responseMimeType = options.responseMimeType;
      if (options.responseSchema) config.responseSchema = options.responseSchema;

      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      const text = response.text || '';
      return { text, modelUsed: model };
    } catch (err: any) {
      lastError = err;
      const status = err.status || err.code;
      const msg = err.message || '';
      console.warn(`[Gemini Cascade] Model ${model} encountered ${status}: ${msg.slice(0, 100)}. Trying next candidate...`);
      // Continue to next model in the pool
    }
  }

  // If all models exhausted their quotas, generate deterministic fallback response for regulatory queries
  const fallback = generateOfflineBISResponse(options.contents);
  if (fallback) {
    return { text: fallback, modelUsed: 'BIS-Sahayak-Offline-Engine' };
  }

  throw lastError || new Error('All Gemini models exhausted their quota limits.');
}

/**
 * Intelligent deterministic fallback response engine when all cloud models are rate-limited.
 * Guarantees that users never receive an unhandled raw JSON error.
 */
export function generateOfflineBISResponse(contents: any): string | null {
  try {
    let lastUserQuery = '';
    if (Array.isArray(contents)) {
      for (let i = contents.length - 1; i >= 0; i--) {
        const item = contents[i];
        if (item.role === 'user') {
          if (typeof item.parts?.[0]?.text === 'string') {
            lastUserQuery = item.parts[0].text.toLowerCase().trim();
            break;
          }
        }
      }
    } else if (typeof contents === 'string') {
      lastUserQuery = contents.toLowerCase().trim();
    }

    if (!lastUserQuery) return null;

    // 1. Greetings
    if (/^(hi|hello|hey|namaste|greetings|start|help|halp|good\s*(morning|afternoon|evening))\b/i.test(lastUserQuery)) {
      return `Namaste! I am **BIS Sahayak AI**, your digital assistant for the Bureau of Indian Standards (BIS) SmartAssist platform.

Here is how I can assist you:
* **Indian Standards (IS)**: Search specifications, clauses, and test limits (e.g., IS 1293, IS 694, IS 16046, IS 15885).
* **Gold Hallmarking & HUID**: Verify 6-digit alphanumeric HUID codes and jeweler registrations under BIS regulations.
* **Certification Schemes**: Explore ISI Mark (Scheme I), CRS (Scheme II for Electronics/IT), and ECO Mark pathways.
* **GeM Pre-Bid Compliance**: Audit public tenders, Make-in-India (MII) local content ratios, and vendor licenses.
* **Recognized Testing Labs**: Find certified NABL/BIS laboratories and book testing slots.

What regulatory or compliance query can I help you with today?`;
    }

    // 2. HUID & Hallmarking
    if (/huid|hallmark|gold|carat|jewel/i.test(lastUserQuery)) {
      return `### Hallmarking & HUID Verification Guide

**What is HUID?**
* **Hallmark Unique Identification (HUID)** is a 6-digit alphanumeric code laser-engraved on every certified gold article (e.g., \`AB1234\`).
* Mandatory components of gold hallmarking in India:
  1. **BIS Standard Logo** (Triangle mark)
  2. **Purity in Karat and Fineness** (e.g., 22K916, 18K750, 14K585)
  3. **6-digit HUID code**

**How to Verify:**
* Open the **Fraud Radar** tab in this portal or use the official **BIS Care App**.
* Enter the 6-character code to check the jeweler's registration number, Assaying & Hallmarking Centre (AHC) details, and hallmarking date.`;
    }

    // 3. Cables / IS 694
    if (/694|cable|wire|conductor/i.test(lastUserQuery)) {
      return `### IS 694:2010 — PVC Insulated Cables for Working Voltages up to and Including 1100 V

* **Scope**: Covers single-core and multi-core unsheathed and sheathed electric cables with copper or aluminium conductors.
* **Key Test Requirements**:
  * **Conductor Resistance**: Maximum allowable values defined in Table 3 (e.g., max 12.1 Ω/km for 1.5 sq mm copper at 20°C).
  * **Insulation Thickness**: Average thickness must not fall below nominal values (Clause 8.1).
  * **Spark Test**: High-voltage spark testing applied continuously during manufacturing (Clause 13.2).
  * **Flammability Test**: Flame retardant characteristics under Bunsen burner test (Clause 16.3).
* **Certification Scheme**: Scheme I (ISI Mark Certification).`;
    }

    // 4. Plugs & Sockets / IS 1293
    if (/1293|plug|socket|switch/i.test(lastUserQuery)) {
      return `### IS 1293:2019 — Plugs and Socket-Outlets for Domestic and Similar Purposes

* **Scope**: Covers 6A and 16A two-pole and three-pole shuttered plugs and socket-outlets for AC voltages up to 250V.
* **Safety Clauses**:
  * **Clause 9**: Protection against electric shock; live pins must not be accessible when partially engaged.
  * **Clause 10**: Provision for earthing; earth pin must make contact before live pins and break after live pins.
  * **Clause 13.1**: Shutter mechanism durability (minimum 10,000 continuous operating cycles).
  * **Clause 14**: Temperature rise test; terminals must not exceed 45K rise under rated current.
* **Enforcement**: Mandatory under the Electrical Appliances QCO (Quality Control Order).`;
    }

    // 5. Batteries / IS 16046
    if (/16046|battery|lithium|cell/i.test(lastUserQuery)) {
      return `### IS 16046 (Part 2):2018 — Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes (Lithium Systems)

* **Scope**: Portable sealed secondary lithium cells and batteries for use in portable electronics, laptops, and smartphones.
* **Key Clauses & Tests**:
  * **Continuous Charging at Constant Voltage** (Clause 7.2.1).
  * **External Short-Circuit Test** (Clause 7.3.2) at ambient and elevated temperatures.
  * **Free Fall Drop Test** (Clause 7.3.3) from 1.0 m onto concrete surface.
  * **Thermal Abuse Test** (Clause 7.3.4) at 130°C for 10 minutes.
  * **Crush Test** (Clause 7.3.6) between hydraulic press plates.
* **Certification Scheme**: Compulsory Registration Scheme (CRS - Scheme II).`;
    }

    // 6. GeM / Pre-Bid Audits
    if (/gem|tender|bid|mii|make in india|msme/i.test(lastUserQuery)) {
      return `### GeM Pre-Bid Compliance & Public Procurement Rules

* **Make-in-India (MII) Categories**:
  * **Class-I Local Supplier**: Local content >= 50% (eligible for purchase preference and margin of purchase preference).
  * **Class-II Local Supplier**: Local content >= 20% and < 50% (no purchase preference).
  * **Non-Local Supplier**: Local content < 20% (restricted in domestic tenders up to ₹200 Crores).
* **MSME / Startup Benefits**:
  * Exemption from Earnest Money Deposit (EMD) under Rule 170 of GFR 2017.
  * Relaxation of prior turnover and prior experience criteria, subject to meeting technical specifications.
* **Mandatory BIS Compliance**:
  * If a tender specifies an Indian Standard (IS), the bidder must provide a valid **CML license** or **NABL test report** covering the specified scope.`;
    }

    // 7. General Fallback
    return `### BIS Regulatory Intelligence Response

Thank you for your inquiry regarding Indian regulatory standards and certification.

**Key Verification & Guidance Resources:**
* **Verify BIS Licenses (CM/L)**: Check the **BIS Care App** or **Fraud Radar** tab to validate licensee status, expiration dates, and registered scopes.
* **Mandatory Standards (QCOs)**: Over 600 product categories now require mandatory BIS certification before manufacturing, importing, or selling in India.
* **Testing & Certification**:
  * **Scheme I (ISI Mark)**: Requires factory inspection, in-house testing facilities, and sample testing at recognized labs.
  * **Scheme II (CRS)**: Self-declaration of conformity based on testing at BIS-recognized NABL laboratories (primarily for Electronics & IT goods).

*Tip: You can ask specific questions about standard numbers (e.g., IS 1293, IS 694, IS 16046), HUID hallmarking, GeM tender rules, or lab testing requirements.*`;
  } catch (e) {
    return null;
  }
}

/**
 * Translates a JSON object's string values into the target language.
 */
export async function translateJSON(data: any, targetLanguage: string): Promise<any> {
  if (!targetLanguage || targetLanguage.toLowerCase() === 'english' || targetLanguage.toLowerCase() === 'en') {
    return data;
  }

  try {
    const prompt = `You are a professional translator. Translate all human-readable string values in the following JSON object into ${targetLanguage}. 
DO NOT translate keys, URLs, standard numbers (like "IS 1293"), or IDs. Return ONLY the translated JSON object.

JSON:
${JSON.stringify(data, null, 2)}`;

    const res = await generateGeminiWithCascade({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      responseMimeType: "application/json",
    });

    const rawJson = (res.text || "{}").replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Translation failed, falling back to original:", error);
    return data; // Fallback to english
  }
}
