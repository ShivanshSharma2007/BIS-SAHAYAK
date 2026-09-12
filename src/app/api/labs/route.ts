import { NextRequest, NextResponse } from "next/server";
import { LABS_DIRECTORY, TestingLab, getStandardProductInfo } from "@/data/labsDirectoryData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city")?.toLowerCase();
    const state = searchParams.get("state")?.toLowerCase();
    const category = searchParams.get("category")?.toLowerCase();
    const standard = searchParams.get("standard")?.toLowerCase();
    const search = searchParams.get("search")?.toLowerCase();

    let filtered: TestingLab[] = [...LABS_DIRECTORY];

    if (city && city !== "all") {
      filtered = filtered.filter(lab => lab.city.toLowerCase().includes(city));
    }

    if (state && state !== "all") {
      filtered = filtered.filter(lab => lab.state.toLowerCase().includes(state));
    }

    if (category && category !== "all") {
      filtered = filtered.filter(lab => 
        lab.categories.some(c => c.toLowerCase().includes(category))
      );
    }

    if (standard && standard !== "all") {
      const standardClean = standard.replace(/[^a-z0-9]/g, "");
      filtered = filtered.filter(lab => 
        lab.accreditedStandards.some(s => {
          const sLower = s.toLowerCase();
          const sClean = sLower.replace(/[^a-z0-9]/g, "");
          return sLower.includes(standard) || standard.includes(sLower) || (standardClean && sClean.includes(standardClean)) || (sClean && standardClean.includes(sClean));
        })
      );
    }

    if (search) {
      const searchClean = search.replace(/[^a-z0-9]/g, "");
      filtered = filtered.filter(lab => 
        lab.name.toLowerCase().includes(search) ||
        lab.city.toLowerCase().includes(search) ||
        lab.state.toLowerCase().includes(search) ||
        lab.accreditationNo.toLowerCase().includes(search) ||
        lab.categories.some(c => c.toLowerCase().includes(search)) ||
        lab.accreditedStandards.some(s => {
          const sLower = s.toLowerCase();
          const sClean = sLower.replace(/[^a-z0-9]/g, "");
          if (
            sLower.includes(search) || 
            search.includes(sLower) || 
            (searchClean && sClean.includes(searchClean)) || 
            (sClean && searchClean.includes(sClean))
          ) {
            return true;
          }
          const info = getStandardProductInfo(s);
          return (
            info.name.toLowerCase().includes(search) ||
            info.fullName.toLowerCase().includes(search) ||
            info.category.toLowerCase().includes(search)
          );
        })
      );
    }

    // Generate unique cities and categories for filter dropdowns
    const availableCities = Array.from(new Set(LABS_DIRECTORY.map(l => l.city)));
    const availableCategories = Array.from(new Set(LABS_DIRECTORY.flatMap(l => l.categories)));

    return NextResponse.json({
      success: true,
      total: filtered.length,
      labs: filtered,
      availableCities,
      availableCategories
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch labs" },
      { status: 500 }
    );
  }
}
