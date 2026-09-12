/**
 * Comprehensive Verification Suite for Universal Official BIS Standards Parser
 */

async function runUniversalParserSuite() {
  console.log("=================================================================");
  console.log("🔬 TESTING UNIVERSAL OFFICIAL BIS STANDARDS PARSER & CALCULATOR");
  console.log("=================================================================\n");

  let passed = 0;
  let failed = 0;

  async function testCase(name, fn) {
    process.stdout.write(`⏳ Testing: ${name}... `);
    try {
      await fn();
      console.log("✅ PASSED");
      passed++;
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
      failed++;
    }
  }

  // 1. Test IS 1786:2008 (Civil Structural - Tata Tiscon TMT Rebar)
  await testCase("Tata Tiscon Fe 500D TMT Steel Rebar (IS 1786:2008)", async () => {
    const reportText = `NATIONAL TEST HOUSE (EASTERN REGION)
Accreditation No: TC-5011 | ULR Number: ULR-TC501126000008912F
Test Report No: NTH/MET/2026/4102 | Date: 14-Feb-2026
Manufacturer: Tata Steel Limited, Jamshedpur Works
Sample: 16 mm TMT Steel Bar Fe 500D | Standard Tested: IS 1786:2008
1. Clause 8.1 - 0.2% Proof Stress: 542.0 N/mm² (Minimum 500.0 N/mm²)
2. Clause 8.2 - TS/YS Ratio: 1.16 (Minimum 1.10)
3. Clause 8.3 - Elongation: 18.5% (Minimum 16.0%)`;

    const res = await fetch("http://localhost:3000/api/parser/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        standardId: "std-1786",
        reportText,
        calculationMode: "strict_numeric"
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error("Expected success: true");
    if (data.overallVerdict !== "COMPLIANT") throw new Error(`Expected COMPLIANT, got ${data.overallVerdict}`);
    if (data.complianceScore !== 100) throw new Error(`Expected 100%, got ${data.complianceScore}%`);
    if (data.reportMetadata.standardNumber !== "IS 1786:2008") throw new Error(`Standard mismatch: ${data.reportMetadata.standardNumber}`);
    if (!data.reportMetadata.isUlrValid) throw new Error("Expected valid 18-char ULR");
  });

  // 2. Test IS 14543:2004 (Food & Water - Packaged Drinking Water)
  await testCase("Packaged Drinking Water Potability (IS 14543:2004)", async () => {
    const reportText = `FOOD RESEARCH & ANALYSIS CENTRE (FRAC)
Accreditation No: TC-6184 | ULR Number: ULR-TC618426000002148F
Report No: FRAC/WTR/2026/782 | Date: 18-Feb-2026
Manufacturer: Bisleri International Pvt Ltd | Standard: IS 14543:2004
1. Clause 3.2 - TDS: 124.0 mg/L (Limit 75-500 mg/L)
2. Clause 3.3 - Toxic Heavy Metals Lead: < 0.001 mg/L (Limit 0.01 mg/L)
3. Clause 4.1 - Microbiological Safety Coliform: Absent in 250 ml sample`;

    const res = await fetch("http://localhost:3000/api/parser/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        standardId: "std-14543",
        reportText,
        calculationMode: "strict_numeric"
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error("Expected success: true");
    if (data.overallVerdict !== "COMPLIANT") throw new Error(`Expected COMPLIANT, got ${data.overallVerdict}`);
    if (data.failedCount > 0) throw new Error("Expected 0 failures");
  });

  // 3. Test IS 1293:2019 (Thermal Failure & Deviation Calculation)
  await testCase("ShoddyTech IS 1293 Temperature Rise & Shutter Jamming (+25.3% Deviation)", async () => {
    const reportText = `NATIONAL TEST HOUSE (NORTHERN REGION)
Accreditation No: TC-5489 | ULR: ULR-TC548924000001842F
Report No: NTH-EL-2026-894 | Standard: IS 1293:2019
Manufacturer: ShoddyTech Electricals Pvt Ltd
Clause 14.1 - Temperature Rise Test: 56.4 K after 45 minutes under continuous 16A load. Exceeds statutory safety limit of 45 K.
Clause 7.1 - Shutter jammed open; probe bypassed shutter.`;

    const res = await fetch("http://localhost:3000/api/parser/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        standardId: "std-1293",
        reportText,
        calculationMode: "strict_numeric"
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error("Expected success: true");
    if (data.overallVerdict !== "NON_COMPLIANT") throw new Error(`Expected NON_COMPLIANT, got ${data.overallVerdict}`);
    
    // Check mathematical deviation calculation
    const tempClause = data.clauseResults.find(c => c.clauseTitle.toLowerCase().includes("temperature"));
    if (!tempClause) throw new Error("Temperature clause not found");
    if (tempClause.status !== "NON_COMPLIANT") throw new Error("Expected temperature clause NON_COMPLIANT");
    if (tempClause.deviationPercent !== 25.3) throw new Error(`Expected +25.3% deviation, got ${tempClause.deviationPercent}%`);
    if (tempClause.riskLevel !== "HIGH") throw new Error("Expected HIGH risk level");
  });

  // 4. Test Auto-Detection from raw document (Helmets IS 4151)
  await testCase("Auto-Detect Standard from Document Content (IS 4151 Helmets)", async () => {
    const reportText = `CENTRAL INSTITUTE OF ROAD TRANSPORT (CIRT), PUNE
Report No: CIRT/HLM/2026/1029 | Date: 10-Feb-2026
Subject: Type approval testing under IS 4151:2015 Protective Helmets for Two Wheeler Riders
Sample: Full Face Motorcycle Helmet Model Stealth-X
Impact absorption drop test recorded peak deceleration 194.0 g.`;

    const res = await fetch("http://localhost:3000/api/parser/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        standardId: "auto",
        reportText,
        calculationMode: "strict_numeric"
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error("Expected success: true");
    if (data.reportMetadata.standardNumber !== "IS 4151:2015") {
      throw new Error(`Expected auto-detected IS 4151:2015, got ${data.reportMetadata.standardNumber}`);
    }
    if (data.totalClausesEvaluated < 3) throw new Error("Expected at least 3 clauses evaluated");
  });

  // 5. Dynamic Standard Resolution for any standard in the 600+ BIS list (e.g. IS 2347 Pressure Cookers)
  await testCase("Dynamic Standard Resolution from Official BIS 600+ List (IS 2347 Cookers)", async () => {
    const reportText = `MECHANICAL TESTING LABORATORY
Test Report No: MTL/CK/2026/512 | Date: 05-Feb-2026
Standard Tested: IS 2347
Product: 5L Hard Anodised Pressure Cooker
Hydrostatic proof pressure test held at 200 kPa for 5 minutes without rupture.`;

    const res = await fetch("http://localhost:3000/api/parser/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        standardId: "auto",
        reportText,
        calculationMode: "strict_numeric"
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error("Expected success: true");
    if (!data.reportMetadata.standardNumber.includes("2347")) {
      throw new Error(`Expected IS 2347 standard, got ${data.reportMetadata.standardNumber}`);
    }
  });

  console.log("\n=================================================================");
  console.log(`🏁 UNIVERSAL PARSER RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("=================================================================\n");

  if (failed > 0) process.exit(1);
}

runUniversalParserSuite().catch(err => {
  console.error("Suite execution error:", err);
  process.exit(1);
});
