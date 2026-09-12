const text = `Testing Laboratory: Apex Metrology Labs, Pune
Manufacturer: Star Industries Ltd, Nagpur
Batch No: STAR-2026-X99
Standard: IS 1786:2008
1. Clause 8.1 - 0.2% Proof Stress: 535.0 N/mm²
2. Clause 8.2 - TS/YS Ratio: 1.15
3. Clause 8.3 - Elongation: 17.5%`;

fetch('http://localhost:3000/api/parser/parse', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ reportText: text, calculationMode: 'strict_numeric' })
})
  .then(r => r.json())
  .then(d => {
    console.log('CUSTOM PARSE RESULT:');
    console.log('Lab Name:', d.reportMetadata.labName);
    console.log('Manufacturer:', d.reportMetadata.manufacturer);
    console.log('Batch:', d.reportMetadata.sampleBatch);
    console.log('Standard:', d.reportMetadata.standardNumber);
    console.log('Score:', d.complianceScore);
    console.log('Verdict:', d.overallVerdict);
  });
