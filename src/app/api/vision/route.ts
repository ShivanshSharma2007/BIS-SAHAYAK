import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { MOCK_BIS_DATA } from '@/data/mockBisData';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// We define a schema for the structured output. 
// This forces Gemini to respond in a predictable JSON format.
const visionSchema = {
  type: Type.OBJECT,
  properties: {
    isValid: {
      type: Type.BOOLEAN,
      description: "True if the image is a product rating plate, label, BIS marking, or technical specification label. False if it is a human face, a landscape, a random object, or unreadable."
    },
    reasoning: {
      type: Type.STRING,
      description: "A brief, professional explanation of why the image was accepted or rejected, and how it matched the standard."
    },
    matchedStandardCode: {
      type: Type.STRING,
      description: "The BIS standard code that best fits this product (e.g., 'IS 13252 (Part 1)' for IT adapters, 'IS 15885' for LED controlgear, 'IS 4151' for helmets, 'IS 14543' for water, 'IS 2082' for water heaters, 'IS 302-2-25' for microwaves, etc.)."
    },
    matchedStandardTitle: {
      type: Type.STRING,
      description: "Full descriptive title of the Indian Standard (e.g., 'Information Technology Equipment - Safety', 'Protective Helmets for Two Wheeler Riders', etc.)."
    },
    schemeType: {
      type: Type.STRING,
      description: "Either 'CRS (Compulsory Registration Scheme)' or 'Scheme-I (ISI Mark)' based on BIS regulations."
    },
    mandatoryClauses: {
      type: Type.ARRAY,
      description: "3-4 typical mandatory testing clauses under this BIS standard.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Clause reference number like '4.1', '7.2'" },
          title: { type: Type.STRING, description: "Clause test name like 'Electric shock protection'" }
        },
        required: ["id", "title"]
      }
    },
    extractedParameters: {
      type: Type.ARRAY,
      description: "List of all technical specifications, ratings, models, serial numbers, standards, and brand names found on the product plate.",
      items: {
        type: Type.OBJECT,
        properties: {
          key: {
            type: Type.STRING,
            description: "Field name, such as 'Brand', 'Model', 'Input Voltage', 'Frequency', 'Wattage', 'Serial Number', 'Standard Reference', 'Registration No', 'Country of Origin'"
          },
          value: {
            type: Type.STRING,
            description: "The extracted value from the image."
          }
        },
        required: ["key", "value"]
      }
    }
  },
  required: ["isValid", "reasoning", "matchedStandardCode", "matchedStandardTitle", "schemeType", "mandatoryClauses", "extractedParameters"]
};

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY");
      return NextResponse.json({ error: 'GEMINI_API_KEY environment variable is missing on the server.' }, { status: 500 });
    }

    const body = await req.json();
    const { image } = body; // Base64 string

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Prepare the base64 part
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: "Analyze this image thoroughly. 1) Determine if it is a product rating plate, BIS label, product packaging, or technical specification label. If it's a person, selfie, landscape, animal, or non-product object, reject it (isValid: false) and explain why in reasoning. 2) If it IS a valid product, extract all visible technical specifications (brand, model, voltage, wattage, frequency, capacity, serial numbers, certifications, standard numbers) into 'extractedParameters'. 3) Identify the exact Indian Standard (IS Code) applicable under BIS guidelines, provide its full official title, the scheme type ('CRS' or 'Scheme-I (ISI Mark)'), and 3-4 mandatory compliance clauses." },
            {
              inlineData: {
                data: base64Data,
                mimeType: 'image/jpeg'
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: visionSchema,
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Failed to get response from Gemini");
    }

    const parsedData = JSON.parse(responseText);

    // Convert array of parameters into a clean key-value object
    const ocrExtracted: Record<string, string> = {};
    if (Array.isArray(parsedData.extractedParameters)) {
      for (const item of parsedData.extractedParameters) {
        if (item.key && item.value) {
          ocrExtracted[item.key] = item.value;
        }
      }
    }

    // Map the returned standard code back to our mock data for the UI, or dynamically construct one
    let matchedStandard = MOCK_BIS_DATA.standards[0];
    if (parsedData.isValid && parsedData.matchedStandardCode) {
      const standardQuery = parsedData.matchedStandardCode.toLowerCase().replace(/[^a-z0-9]/g, '');
      const match = MOCK_BIS_DATA.standards.find(s => {
        const cleanCode = s.code.toLowerCase().replace(/[^a-z0-9]/g, '');
        return cleanCode.includes(standardQuery) || standardQuery.includes(cleanCode);
      });

      if (match) {
        matchedStandard = match;
      } else {
        // Construct dynamic standard definition
        matchedStandard = {
          code: parsedData.matchedStandardCode,
          title: parsedData.matchedStandardTitle || `Indian Standard for ${parsedData.matchedStandardCode}`,
          schemeType: parsedData.schemeType || "CRS (Compulsory Registration Scheme)",
          productCategory: "General Electrical / Industrial",
          keywords: [],
          mandatoryClauses: Array.isArray(parsedData.mandatoryClauses) && parsedData.mandatoryClauses.length > 0
            ? parsedData.mandatoryClauses.map((c: any) => ({ ...c, status: "pending" }))
            : [
                { id: "3.1", title: "Marking and Identification Compliance", status: "pending" },
                { id: "4.2", title: "Electrical and Mechanical Safety Verification", status: "pending" },
                { id: "7.1", title: "Performance and Insulation Integrity", status: "pending" }
              ]
        };
      }
    }

    // Return the combined result
    return NextResponse.json({
      isValid: parsedData.isValid,
      reasoning: parsedData.reasoning,
      ocrExtracted: ocrExtracted,
      matchedStandard: matchedStandard
    });

  } catch (error: any) {
    console.error('Vision API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process image' }, { status: 500 });
  }
}
