/**
 * Comprehensive Backend Verification Suite for BIS SAHAYAK (SmartAssist)
 */

async function runSuite() {
  console.log("=================================================================");
  console.log("🚀 STARTING FULL BACKEND INTEGRATION TEST SUITE");
  console.log("=================================================================\n");

  let passed = 0;
  let failed = 0;

  async function testEndpoint(name, testFn) {
    try {
      process.stdout.write(`⏳ Testing: ${name}... `);
      await testFn();
      console.log("✅ PASSED");
      passed++;
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
      failed++;
    }
  }

  // 1. Standards Catalog API
  await testEndpoint("GET /api/standards", async () => {
    const res = await fetch("http://localhost:3000/api/standards");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.standards) || data.standards.length === 0) {
      throw new Error("Invalid standards response format");
    }
  });

  // 2. Standards Search by Keyword
  await testEndpoint("GET /api/standards?search=lithium", async () => {
    const res = await fetch("http://localhost:3000/api/standards?search=lithium");
    const data = await res.json();
    if (!data.success || data.count === 0 || !data.standards[0].standardNumber.includes("16046")) {
      throw new Error(`Expected IS 16046, got ${JSON.stringify(data)}`);
    }
  });

  // 3. Single Standard with Clauses
  await testEndpoint("GET /api/standards/std-1293 (Clauses tree)", async () => {
    const res = await fetch("http://localhost:3000/api/standards/std-1293");
    const data = await res.json();
    if (!data.success || !data.standard.clauses || data.standard.clauses.length < 3) {
      throw new Error("Standard clauses missing or incomplete");
    }
  });

  // 4. Draft Consultation Comments (GET & POST)
  await testEndpoint("POST & GET /api/standards/std-17855/comments", async () => {
    const postRes = await fetch("http://localhost:3000/api/standards/std-17855/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: "Automated Test Suite",
        organization: "National Standards Review Cell",
        comment: "Test comment verifying persistence in database repository",
        section: "Clause 6.1"
      })
    });
    const postData = await postRes.json();
    if (!postData.success || !postData.comment) throw new Error("POST comment failed");

    const getRes = await fetch("http://localhost:3000/api/standards/std-17855/comments");
    const getData = await getRes.json();
    if (!getData.success || getData.comments.length === 0) throw new Error("GET comments failed");
  });

  // 5. Fraud Radar - Genuine Gold HUID
  await testEndpoint("POST /api/fraud-radar/verify (Valid HUID AB1234)", async () => {
    const res = await fetch("http://localhost:3000/api/fraud-radar/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "AB1234" })
    });
    const data = await res.json();
    if (!data.success || data.result.verdict !== "GENUINE_COMPLIANT") {
      throw new Error(`Expected GENUINE_COMPLIANT, got ${data.result?.verdict}`);
    }
  });

  // 6. Fraud Radar - Fake/Counterfeit Gold HUID
  await testEndpoint("POST /api/fraud-radar/verify (Counterfeit HUID 99FAKE)", async () => {
    const res = await fetch("http://localhost:3000/api/fraud-radar/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "99FAKE" })
    });
    const data = await res.json();
    if (!data.success || data.result.verdict !== "CONFIRMED_COUNTERFEIT") {
      throw new Error(`Expected CONFIRMED_COUNTERFEIT, got ${data.result?.verdict}`);
    }
  });

  // 7. Fraud Radar - Official BIS License
  await testEndpoint("POST /api/fraud-radar/verify (BIS License CM/L-8492015)", async () => {
    const res = await fetch("http://localhost:3000/api/fraud-radar/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "CM/L-8492015" })
    });
    const data = await res.json();
    if (!data.success || data.result.verdict !== "GENUINE_COMPLIANT" || !data.result.details["Manufacturer Name"]) {
      throw new Error(`License lookup failed: ${JSON.stringify(data)}`);
    }
  });

  // 8. Geospatial Labs Directory
  await testEndpoint("GET /api/labs (All facilities)", async () => {
    const res = await fetch("http://localhost:3000/api/labs");
    const data = await res.json();
    if (!data.success || data.total !== 12) {
      throw new Error(`Expected 12 labs, got ${data.total}`);
    }
  });

  // 9. Geospatial Labs Product Search
  await testEndpoint("GET /api/labs?search=batteries (Product name search)", async () => {
    const res = await fetch("http://localhost:3000/api/labs?search=batteries");
    const data = await res.json();
    if (!data.success || data.total < 3) {
      throw new Error(`Expected >= 3 battery testing labs, got ${data.total}`);
    }
  });

  // 10. Lab Test Booking
  let bookedTicket = "";
  await testEndpoint("POST /api/labs/book (Create test request)", async () => {
    const res = await fetch("http://localhost:3000/api/labs/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        labId: "LAB-001",
        applicantName: "Aakash Mehta",
        companyName: "Mehta Cables Ltd",
        email: "aakash@mehtacables.com",
        phone: "+91 98112 33445",
        productName: "Copper Power Cable 1.5 sq mm",
        standardNumber: "IS 694",
        urgency: "express"
      })
    });
    const data = await res.json();
    if (!data.success || !data.booking || !data.booking.ticketNumber.startsWith("TR-2026-")) {
      throw new Error(`Booking failed: ${JSON.stringify(data)}`);
    }
    bookedTicket = data.booking.ticketNumber;
  });

  // 11. Fetch Test Bookings by Ticket
  await testEndpoint(`GET /api/labs/bookings?ticket=${bookedTicket}`, async () => {
    const res = await fetch(`http://localhost:3000/api/labs/bookings?ticket=${bookedTicket}`);
    const data = await res.json();
    if (!data.success || data.booking.applicantName !== "Aakash Mehta") {
      throw new Error(`Ticket lookup failed: ${JSON.stringify(data)}`);
    }
  });

  // 12. Certification Scheme Navigator Engine
  await testEndpoint("POST /api/navigator/evaluate (CRS Evaluation for Electronics)", async () => {
    const res = await fetch("http://localhost:3000/api/navigator/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "Electronics & IT Equipment",
        manufacturingLocation: "India",
        targetAudience: "B2C",
        existingCertifications: false
      })
    });
    const data = await res.json();
    if (!data.success || !data.evaluation.schemeName.includes("Compulsory Registration")) {
      throw new Error(`Expected CRS, got ${data.evaluation?.schemeName}`);
    }
  });

  // 13. Dynamic Dashboard Stats
  await testEndpoint("GET /api/dashboard/stats", async () => {
    const res = await fetch("http://localhost:3000/api/dashboard/stats");
    const data = await res.json();
    if (!data.success || data.stats.activeLabsCount !== 12 || data.stats.totalTestBookings < 1) {
      throw new Error(`Stats computation error: ${JSON.stringify(data)}`);
    }
  });

  // 14. GeM Pre-Bid Audit History
  await testEndpoint("GET & POST /api/gem-audit/history", async () => {
    const postRes = await fetch("http://localhost:3000/api/gem-audit/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenderId: "gem-tender-02",
        bidNumber: "GEM/2026/B/912830",
        tenderTitle: "Combined 16A Shuttered Sockets",
        buyerName: "Central Public Works Department (CPWD)",
        vendorName: "Legrand India Electricals",
        gstin: "27AAACL1234F1Z0",
        bisLicense: "CM/L-8492015",
        localContent: 65,
        isMSME: true,
        status: "QUALIFIED",
        riskScore: 6,
        evaluatedClausesCount: 4,
        clausesPassedCount: 4,
        summary: "Audit run verified through automated test suite."
      })
    });
    const postData = await postRes.json();
    if (!postData.success || !postData.audit) throw new Error("POST audit history failed");

    const getRes = await fetch("http://localhost:3000/api/gem-audit/history");
    const getData = await getRes.json();
    if (!getData.success || getData.history.length < 3) throw new Error("GET audit history failed");
  });

  // 15. Regulatory Alerts Feed
  await testEndpoint("GET /api/regulatory-alerts", async () => {
    const res = await fetch("http://localhost:3000/api/regulatory-alerts");
    const data = await res.json();
    if (!data.success || !Array.isArray(data.alerts) || data.alerts.length === 0) {
      throw new Error("Failed to fetch regulatory alerts");
    }
  });

  console.log("\n=================================================================");
  console.log(`🏁 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("=================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runSuite().catch(err => {
  console.error("Test Suite crashed:", err);
  process.exit(1);
});
