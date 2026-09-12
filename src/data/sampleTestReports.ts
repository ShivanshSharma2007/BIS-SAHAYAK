/**
 * Official Sample NABL Laboratory Test Reports for BIS Sahayak Compliance Parser
 */

export interface SampleTestReport {
  id: string;
  name: string;
  scenario: "PASS" | "FAIL" | "BORDERLINE";
  standardId: string;
  standardNumber: string;
  productName: string;
  labName: string;
  nablAccreditationNo: string;
  ulrNumber: string;
  reportNumber: string;
  reportDate: string;
  manufacturer: string;
  sampleBatch: string;
  summary: string;
  reportText: string;
}

export const SAMPLE_TEST_REPORTS: SampleTestReport[] = [
  {
    id: "sample-is694-pass",
    name: "Havells Heavy Duty Copper Cable (100% Compliant)",
    scenario: "PASS",
    standardId: "std-694",
    standardNumber: "IS 694:2010",
    productName: "PVC Insulated Electric Cable 1.5 sq mm (Single Core)",
    labName: "Electrical Research and Development Association (ERDA)",
    nablAccreditationNo: "TC-5489",
    ulrNumber: "ULR-TC548924000001842F",
    reportNumber: "ERDA/CAB/2026/0482",
    reportDate: "2026-02-14",
    manufacturer: "Havells India Limited, Plant II, Haridwar",
    sampleBatch: "HV-CAB-2026-B81",
    summary: "Complete compliance under IS 694:2010 for conductor resistance, insulation thickness, and high voltage test.",
    reportText: `ELECTRICAL RESEARCH AND DEVELOPMENT ASSOCIATION (ERDA)
NABL ACCREDITED TESTING LABORATORY (ISO/IEC 17025:2017)
Accreditation Certificate No: TC-5489 | ULR Number: ULR-TC548924000001842F
Test Report No: ERDA/CAB/2026/0482 | Date of Issue: 14-Feb-2026

CUSTOMER & SAMPLE DETAILS:
Manufacturer: Havells India Limited, Industrial Area, Haridwar, Uttarakhand
Sample Description: 1.5 sq mm Single Core PVC Insulated Unsheathed Cable (1100 V)
Sample Batch No: HV-CAB-2026-B81 | Sampling Date: 02-Feb-2026
Standard Tested Against: IS 694:2010 (Incorporating Amendment Nos. 1 & 2)

TEST RESULTS & CLAUSE-BY-CLAUSE CONFORMITY:

1. Clause 6.2 - Conductor Construction & Electrical Resistance at 20°C:
- Specified Requirement: Plain annealed copper conductor class 2. Maximum electrical resistance at 20°C shall not exceed 12.10 Ohm/km.
- Observed Test Result: Conductor resistance measured across 5 specimens averaged 11.82 Ohm/km at 20°C.
- Compliance Verdict: COMPLIANT (Pass)

2. Clause 8.1 - Radial Thickness of PVC Insulation:
- Specified Requirement: Nominal radial insulation thickness 0.70 mm. Minimum thickness at any point shall not fall below 0.53 mm.
- Observed Test Result: Nominal thickness measured 0.72 mm; lowest measured point across 10 cross-sections was 0.61 mm.
- Compliance Verdict: COMPLIANT (Pass)

3. Clause 13.2 - High Voltage Spark Test:
- Specified Requirement: Complete core shall withstand continuous in-line spark testing at 6.0 kV AC RMS without breakdown.
- Observed Test Result: 1000 meters tested continuously at 6.0 kV spark voltage; zero breakdowns or flashovers recorded.
- Compliance Verdict: COMPLIANT (Pass)

4. Clause 16.3 - Flammability Test (Flame Retardant Characteristics):
- Specified Requirement: After removal of test flame, the sample shall extinguish within 60 seconds and char length < 540 mm.
- Observed Test Result: Sample self-extinguished within 14.5 seconds; measured char length was 168 mm.
- Compliance Verdict: COMPLIANT (Pass)

OVERALL REMARKS:
The submitted sample strictly conforms to all statutory testing requirements of IS 694:2010. Recommended for ISI mark renewal.`
  },
  {
    id: "sample-is1293-fail",
    name: "ShoddyTech Combined Shuttered Socket (Critical Failures)",
    scenario: "FAIL",
    standardId: "std-1293",
    standardNumber: "IS 1293:2019",
    productName: "16A/6A Combined 3-Pin Shuttered Modular Socket",
    labName: "National Test House (NTH), Western Region",
    nablAccreditationNo: "TC-6120",
    ulrNumber: "ULR-TC612026000009123P",
    reportNumber: "NTH/WR/ELEC/2026/1094",
    reportDate: "2026-03-01",
    manufacturer: "ShoddyTech Electricals Pvt Ltd, Bhiwandi, Maharashtra",
    sampleBatch: "ST-SOC-2026-X04",
    summary: "Critical thermal and shutter endurance failures violating electrical appliance mandatory safety clauses.",
    reportText: `NATIONAL TEST HOUSE (NTH - WR), MUMBAI
Accreditation Certificate No: TC-6120 | ULR Number: ULR-TC612026000009123P
Test Report No: NTH/WR/ELEC/2026/1094 | Date of Issue: 01-Mar-2026

CUSTOMER & SAMPLE DETAILS:
Applicant: ShoddyTech Electricals Pvt Ltd, Bhiwandi, Maharashtra
Sample Description: 16A/6A Combined 3-Pin Modular Shuttered Socket (250V AC)
Sample Batch No: ST-SOC-2026-X04 | Standard: IS 1293:2019

TEST RESULTS & CLAUSE-BY-CLAUSE CONFORMITY:

1. Clause 9.1 - Protection Against Electric Shock:
- Specified Requirement: Live socket contacts shall not be accessible with standard test probe when plug is partially withdrawn or angled.
- Observed Test Result: Standard test finger does not contact live terminals when un-shuttered plug is inserted.
- Compliance Verdict: COMPLIANT (Pass)

2. Clause 10.2 - Provision for Earthing & Contact Sequence:
- Specified Requirement: Earth pin shall make contact before live pins engage and break after live pins disengage.
- Observed Test Result: Earth pin lead contact verified; earth continuity resistance measured 0.02 Ohm.
- Compliance Verdict: COMPLIANT (Pass)

3. Clause 13.1 - Durability & Shutter Mechanism Endurance Test:
- Specified Requirement: Shutter mechanism must operate reliably for a minimum of 10,000 insertion and withdrawal cycles under load.
- Observed Test Result: Mechanical jamming observed at cycle 4,210. Shutter failed to spring back over live contacts, leaving live pin chamber exposed.
- Compliance Verdict: NON_COMPLIANT (Critical Failure)

4. Clause 14 - Temperature Rise Test at Terminals:
- Specified Requirement: Terminal temperature rise shall not exceed 45 K when carrying rated continuous current of 16A AC.
- Observed Test Result: Terminal temperature rise reached 56.4 K after 45 minutes of rated current due to sub-standard brass contact alloys. Exceeds statutory safety limit by 11.4 K (+25.3%).
- Compliance Verdict: NON_COMPLIANT (Severe Fire/Thermal Hazard)

OVERALL REMARKS:
The submitted socket sample FAILED mandatory safety clauses 13.1 and 14 of IS 1293:2019. Rejected for BIS certification and disqualified from public procurement.`
  },
  {
    id: "sample-is16046-pass",
    name: "Samsung/Exicom Li-ion Secondary Cell Pack (CRS Compliant)",
    scenario: "PASS",
    standardId: "std-16046",
    standardNumber: "IS 16046 (Part 2):2018",
    productName: "Rechargeable Lithium-ion Battery Pack (3.7V, 5000 mAh)",
    labName: "Central Power Research Institute (CPRI), Bengaluru",
    nablAccreditationNo: "TC-5021",
    ulrNumber: "ULR-TC502126000004521F",
    reportNumber: "CPRI/BAT/2026/893",
    reportDate: "2026-02-20",
    manufacturer: "Exicom Power Systems Ltd, Gurugram, Haryana",
    sampleBatch: "EXI-LI-5000-A2",
    summary: "Passed CRS mandatory environmental abuse, external short circuit, and crush tests under IS 16046 (Part 2).",
    reportText: `CENTRAL POWER RESEARCH INSTITUTE (CPRI)
Recognized by Bureau of Indian Standards (BIS) under Compulsory Registration Scheme (CRS)
Accreditation No: TC-5021 | ULR Number: ULR-TC502126000004521F
Test Report No: CPRI/BAT/2026/893 | Date of Issue: 20-Feb-2026

CUSTOMER & SAMPLE DETAILS:
Manufacturer: Exicom Power Systems Ltd, Udyog Vihar, Gurugram
Sample Description: Sealed Secondary Lithium-ion Battery Pack (Model: EX-5000Li, 3.7V 5000mAh)
Batch No: EXI-LI-5000-A2 | Standard Tested: IS 16046 (Part 2):2018 / IEC 62133-2:2017

TEST RESULTS & CLAUSE-BY-CLAUSE CONFORMITY:

1. Clause 7.2.1 - Continuous Charging at Constant Voltage:
- Specified Requirement: Fully charged cells subjected to continuous charge for 7 days at manufacturer's max voltage without fire or rupture.
- Observed Test Result: Maintained 4.25V continuous charge for 168 hours; zero explosion, fire, or electrolyte leakage.
- Compliance Verdict: COMPLIANT (Pass)

2. Clause 7.3.2 - External Short-Circuit Test at 55°C:
- Specified Requirement: Cells shorted at 55°C +/- 5°C with external resistance < 100 mOhm until case temperature returns to steady state.
- Observed Test Result: Short-circuit current peak 142A; cell temperature peaked at 94.2°C; internal PTC tripped; no explosion or fire.
- Compliance Verdict: COMPLIANT (Pass)

3. Clause 7.3.3 - Free Fall Drop Test:
- Specified Requirement: Pack dropped from 1.0 m height onto concrete surface, 3 drops on each face.
- Observed Test Result: Enclosure intact; no internal short circuit; open circuit voltage retained at 3.68V.
- Compliance Verdict: COMPLIANT (Pass)

4. Clause 7.3.4 - Thermal Abuse Test (130°C Oven):
- Specified Requirement: Chamber heated at 5°C/min to 130°C +/- 2°C and held for 10 minutes without fire or explosion.
- Observed Test Result: 130°C held for 10 mins; safety vent activated cleanly; zero fire or explosive disassembly.
- Compliance Verdict: COMPLIANT (Pass)

5. Clause 7.3.6 - Mechanical Crush Test:
- Specified Requirement: Cell crushed between flat hydraulic plates with 13 kN force without explosion or fire.
- Observed Test Result: 13.1 kN applied; maximum deformation 2.4 mm; no ignition or thermal runaway.
- Compliance Verdict: COMPLIANT (Pass)

OVERALL REMARKS:
Sample conforms to IS 16046 (Part 2):2018. Eligible for BIS CRS Registration grant under Scheme II.`
  }
];
