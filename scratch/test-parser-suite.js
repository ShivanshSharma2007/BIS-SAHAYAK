/**
 * Automated Verification Suite for Compliance Report Parser
 */

const { SAMPLE_TEST_REPORTS } = require("../src/data/sampleTestReports.ts");

async function runParserTests() {
  console.log("=================================================================");
  console.log("🔬 TESTING COMPLIANCE REPORT PARSER ENDPOINT & VERIFICATION LOGIC");
  console.log("=================================================================\n");

  let passed = 0;
  let failed = 0;

  async function testCase(name, fn) {
    try {
      process.stdout.write(`⏳ Testing: ${name}... `);
      await fn();
      console.log("✅ PASSED");
      passed++;
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
      failed++;
    }
  }

  // 1. Test Havells IS 694 (Pass Scenario)
  await testCase("Havells IS 694 Cable (Compliant Report)", async () => {
    const sample = SAMPLE_TEST_REPORTS[0];
    const res = await fetch("http://localhost:3000/api/parser/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        standardId: sample.standardId,
        reportText: sample.reportText,
        uploadedFileName: "Havells_Report.pdf"
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error("Expected success: true");
    if (data.overallVerdict !== "COMPLIANT") {
      throw new Error(`Expected COMPLIANT, got ${data.overallVerdict}`);
    }
    if (data.complianceScore < 80) {
      throw new Error(`Expected score >= 80, got ${data.complianceScore}`);
    }
    if (data.passedCount < 3) {
      throw new Error(`Expected passedCount >= 3, got ${data.passedCount}`);
    }
    if (!data.digitalHash || data.digitalHash.length !== 64) {
      throw new Error("Invalid SHA-256 digital verification hash");
    }
  });

  // 2. Test ShoddyTech IS 1293 (Critical Failure Scenario)
  await testCase("ShoddyTech IS 1293 Socket (Critical Failures)", async () => {
    const sample = SAMPLE_TEST_REPORTS[1];
    const res = await fetch("http://localhost:3000/api/parser/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        standardId: sample.standardId,
        reportText: sample.reportText,
        uploadedFileName: "ShoddyTech_Report.pdf"
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error("Expected success: true");
    if (data.overallVerdict !== "NON_COMPLIANT") {
      throw new Error(`Expected NON_COMPLIANT, got ${data.overallVerdict}`);
    }
    if (data.failedCount === 0) {
      throw new Error("Expected at least one failed clause");
    }
    if (!Array.isArray(data.criticalDeficiencies) || data.criticalDeficiencies.length === 0) {
      throw new Error("Expected criticalDeficiencies list");
    }
  });

  // 3. Test Samsung/Exicom IS 16046 (CRS Li-ion Battery Scenario)
  await testCase("Samsung/Exicom IS 16046 Battery Pack (CRS Compliant)", async () => {
    const sample = SAMPLE_TEST_REPORTS[2];
    const res = await fetch("http://localhost:3000/api/parser/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        standardId: sample.standardId,
        reportText: sample.reportText,
        uploadedFileName: "Samsung_Battery_Report.pdf"
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error("Expected success: true");
    if (data.overallVerdict !== "COMPLIANT") {
      throw new Error(`Expected COMPLIANT, got ${data.overallVerdict}`);
    }
    if (data.totalClausesEvaluated < 4) {
      throw new Error(`Expected >= 4 clauses evaluated, got ${data.totalClausesEvaluated}`);
    }
  });

  // 4. Test Missing Text Error Handling
  await testCase("Validation for missing report text", async () => {
    const res = await fetch("http://localhost:3000/api/parser/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        standardId: "std-694",
        reportText: "   "
      })
    });
    if (res.status !== 400) {
      throw new Error(`Expected HTTP 400 for empty reportText, got ${res.status}`);
    }
  });

  console.log("\n=================================================================");
  console.log(`🏁 PARSER TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("=================================================================\n");

  if (failed > 0) process.exit(1);
}

runParserTests();
