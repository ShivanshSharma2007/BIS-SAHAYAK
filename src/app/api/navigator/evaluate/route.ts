import { NextRequest, NextResponse } from "next/server";
import { evaluateScheme, PRODUCT_CATEGORIES } from "@/lib/backend/bisCertificationEngine";
import { NavigatorAssessmentInputV2 } from "@/lib/backend/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      category,
      subCategory,
      manufacturingLocation,
      targetAudience,
      businessScale,
      existingCertifications,
    } = body;

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Product category is required" },
        { status: 400 }
      );
    }

    const input: NavigatorAssessmentInputV2 = {
      category,
      subCategory: subCategory || "",
      manufacturingLocation: manufacturingLocation || "India",
      targetAudience: targetAudience || "B2C",
      businessScale: businessScale || "Large",
      existingCertifications: Array.isArray(existingCertifications)
        ? existingCertifications
        : existingCertifications ? [existingCertifications] : ["None"],
    };

    const evaluation = evaluateScheme(input);

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error: any) {
    console.error("Navigator API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to evaluate certification scheme" },
      { status: 500 }
    );
  }
}

/** GET endpoint to retrieve available product categories and their subcategories */
export async function GET() {
  try {
    const categories = Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => ({
      key,
      label: value.label,
      division: value.division,
      subcategories: value.subcategories,
    }));

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
