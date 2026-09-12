"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  Search, 
  MapPin, 
  Navigation, 
  FileCheck, 
  Loader2, 
  Phone, 
  Mail, 
  Sparkles, 
  Building2, 
  Clock, 
  Check, 
  X, 
  ArrowUpRight,
  SlidersHorizontal,
  Compass
} from "lucide-react";
import { TestingLab, getStandardProductInfo } from "@/data/labsDirectoryData";
import { useAppStore } from "@/store/useAppStore";

// Dynamically import MapComponent to prevent Next.js SSR window errors
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-3 border border-slate-800 shadow-inner">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      <span className="text-xs font-bold tracking-widest uppercase text-slate-300">
        Initializing India Geospatial Lab Network...
      </span>
    </div>
  )
});

export default function LabFinderUI() {
  const selectedStandardId = useAppStore(state => state.selectedStandardId);
  const setSelectedStandardId = useAppStore(state => state.setSelectedStandardId);

  const [labs, setLabs] = useState<TestingLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(selectedStandardId || "");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [selectedLab, setSelectedLab] = useState<TestingLab | null>(null);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingLab, setBookingLab] = useState<TestingLab | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccessTicket, setBookingSuccessTicket] = useState<any | null>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  // Form State
  const [applicantName, setApplicantName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [productName, setProductName] = useState("");
  const [standardNumber, setStandardNumber] = useState(selectedStandardId || "");
  const [urgency, setUrgency] = useState("standard");

  // Fetch labs from backend
  const fetchLabs = async (overrideSearch?: string) => {
    try {
      setLoading(true);
      const query = overrideSearch !== undefined ? overrideSearch : searchQuery;
      const params = new URLSearchParams();
      if (query.trim()) params.append("search", query.trim());
      if (selectedCategory !== "ALL") params.append("category", selectedCategory);
      if (selectedCity !== "ALL") params.append("city", selectedCity);

      const res = await fetch(`/api/labs?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.labs) {
        setLabs(data.labs);
        if (data.labs.length > 0) {
          setSelectedLab(data.labs[0]);
        } else {
          setSelectedLab(null);
        }
      }
    } catch (err) {
      console.error("Failed to fetch labs from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStandardId) {
      setSearchQuery(selectedStandardId);
      setStandardNumber(selectedStandardId);
      fetchLabs(selectedStandardId);
    } else {
      fetchLabs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedCity, selectedStandardId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLabs();
  };

  // Open booking modal
  const handleOpenBooking = (lab: TestingLab) => {
    setBookingLab(lab);
    setStandardNumber(lab.accreditedStandards[0] || "");
    setBookingSuccessTicket(null);
    setBookingModalOpen(true);
  };

  // Submit test request to backend
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !email || !productName || !standardNumber || !bookingLab) return;

    try {
      setBookingLoading(true);
      const res = await fetch("/api/labs/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labId: bookingLab.id,
          applicantName,
          companyName,
          email,
          phone,
          productName,
          standardNumber,
          urgency
        })
      });
      const data = await res.json();
      if (data.success && data.booking) {
        const b = data.booking;
        setBookingSuccessTicket({
          ticketId: b.ticketNumber,
          sampleDetails: {
            standardNumber: b.standardNumber,
            dispatchDeadline: "3 Days from Today",
            estimatedTurnaround: b.leadTime
          },
          lab: {
            name: bookingLab.name,
            address: bookingLab.address
          }
        });
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setBookingLoading(false);
    }
  };

  const categories = [
    { id: "ALL", label: "All Facilities" },
    { id: "Electronics", label: "Electronics & IT" },
    { id: "Batteries", label: "EV & Batteries" },
    { id: "Lighting", label: "Luminaires & LED" },
    { id: "Electrical", label: "Wiring & Plugs" },
    { id: "Home Appliances", label: "Appliances" }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 pb-24 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-700 bg-blue-100/70 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> India Testing Infrastructure
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Geospatial Lab Finder
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Locate BIS-recognized & NABL-accredited compliance laboratories across Indian industrial corridors
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white border border-slate-200 shadow-xs px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-600">Active Facilities:</span>
            <span className="font-bold text-slate-900">{labs.length} Mapped</span>
          </div>
          <div className="bg-white border border-slate-200 shadow-xs px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-600">Avg Lead Time:</span>
            <span className="font-bold text-slate-900">5-12 Days</span>
          </div>
        </div>
      </div>

      {/* Auto-Filtered from Snap Scanner Banner */}
      {selectedStandardId && (
        <div className="mb-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 border border-indigo-500/30 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-indigo-950/20 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500 text-white px-2 py-0.5 rounded">
                  Snap-to-Standard Match
                </span>
                <span className="text-xs text-indigo-200">
                  {labs.length} accredited {labs.length === 1 ? 'lab' : 'labs'} located
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-100">
                Filtered specifically for standard: <span className="text-amber-300 font-bold">{selectedStandardId}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedStandardId(null);
              setSearchQuery("");
              fetchLabs("");
            }}
            className="text-xs font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            <span>Show All Nationwide Labs</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by product (e.g. Plugs, Batteries, LED, Water, Helment), city, lab name, or standard (IS 1293)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="submit"
              className="flex-1 md:flex-none px-5 py-2.5 bg-[#163f73] hover:bg-[#1e4f8f] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Labs</span>
            </button>
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#163f73] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid: Interactive Map + Directory List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / TOP: Interactive India Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-2.5 shadow-sm flex flex-col h-[520px] lg:h-[680px] sticky top-4">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Interactive Geospatial Map of India</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Click any pin to inspect lab capabilities
            </span>
          </div>

          <div className="flex-1 w-full rounded-xl overflow-hidden relative">
            <MapComponent 
              labs={labs} 
              selectedLab={selectedLab} 
              onSelectLab={(lab) => setSelectedLab(lab)} 
              onRequestTest={(lab) => handleOpenBooking(lab)}
            />
          </div>

          {/* Selected Lab Card in Map Footer */}
          {selectedLab && (
            <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 truncate">{selectedLab.name}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded shrink-0">
                    {selectedLab.accreditationNo}
                  </span>
                </div>
                <p className="text-slate-500 truncate mt-0.5">{selectedLab.address}</p>
              </div>
              <button
                onClick={() => handleOpenBooking(selectedLab)}
                className="bg-[#D97706] hover:bg-[#b45309] text-white font-bold px-3 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer"
              >
                Request Test
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Searchable Labs Directory Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Accredited Laboratories ({labs.length})
            </h3>
            <span className="text-xs text-slate-400">Sorted by proximity</span>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
              <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Scanning testing database...</p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
              {labs.map((lab) => {
                const isSelected = selectedLab?.id === lab.id;
                return (
                  <div
                    key={lab.id}
                    onClick={() => setSelectedLab(lab)}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/30 shadow-md ring-1 ring-blue-400/30"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-blue-600 text-white" : "bg-[#0F172A] text-white"
                        }`}>
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">
                            {lab.name}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Navigation className="w-3 h-3 text-slate-400" /> {lab.city}, {lab.state}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                        {lab.accreditationNo}
                      </span>
                    </div>

                    {/* Standards list */}
                    <div className="my-3">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Approved Testing Standards & Products:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {lab.accreditedStandards.map((std, i) => {
                          const info = getStandardProductInfo(std);
                          return (
                            <span
                              key={i}
                              title={info.fullName}
                              className="inline-flex items-center gap-1.5 text-xs bg-slate-50 hover:bg-slate-100 text-slate-800 font-medium px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs transition-colors"
                            >
                              <span className="font-semibold text-slate-900">{info.name}</span>
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-200/60 px-1.5 py-0.2 rounded font-medium">
                                {std}
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                      <div className="flex items-center gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block leading-none">LEAD TIME</span>
                          <span className="font-bold text-slate-700">{lab.leadTime}</span>
                        </div>
                        <div className="w-[1px] h-6 bg-slate-200"></div>
                        <div>
                          <span className="text-[10px] text-slate-400 block leading-none">TYPE</span>
                          <span className="font-medium text-slate-600">{lab.type}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBooking(lab);
                        }}
                        className="bg-[#D97706] hover:bg-[#b45309] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <span>Request Test</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {labs.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
                  <p className="text-sm font-semibold text-slate-600">No testing laboratories found.</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching for &quot;Plugs&quot;, &quot;Batteries&quot;, &quot;Bengaluru&quot;, or &quot;IS 1293&quot;.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SAMPLE TEST BOOKING MODAL */}
      {bookingModalOpen && bookingLab && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                  Official NABL Dispatch
                </span>
                <h3 className="font-bold text-slate-900 text-lg mt-1">
                  Reserve Sample Testing Slot
                </h3>
                <p className="text-xs text-slate-500">
                  Target Lab: <strong className="text-slate-800">{bookingLab.name}</strong> ({bookingLab.city})
                </p>
              </div>
              <button 
                onClick={() => setBookingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccessTicket ? (
              <div className="py-4 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <Check className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-slate-900 text-lg">Testing Slot Reserved!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your sample dispatch ticket has been generated.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Booking Reference:</span>
                    <span className="font-mono font-bold text-blue-700">{bookingSuccessTicket.ticketId}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Target Standard:</span>
                    <span className="font-bold text-slate-800">{bookingSuccessTicket.sampleDetails.standardNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Sample Dispatch Deadline:</span>
                    <span className="font-bold text-red-600">{bookingSuccessTicket.sampleDetails.dispatchDeadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Turnaround:</span>
                    <span className="font-bold text-emerald-700">{bookingSuccessTicket.sampleDetails.estimatedTurnaround}</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1.5">
                  <span className="font-bold block text-amber-800">Dispatch Instructions:</span>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-800">
                    <li>Pack 3 production-grade samples securely with tamper-evident seal.</li>
                    <li>Write <strong>{bookingSuccessTicket.ticketId}</strong> clearly on the parcel.</li>
                    <li>Send parcel to: {bookingSuccessTicket.lab.address}.</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="w-full py-2.5 bg-[#163f73] hover:bg-[#1e4f8f] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Done & Close Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Applicant Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Ramesh Verma"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Tech Pvt Ltd"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ramesh@acme.in"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Product Name / Model *
                    </label>
                    <input
                      type="text"
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. 50W LED Driver Mod-A"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Applicable Product / IS Standard *
                    </label>
                    <select
                      value={standardNumber}
                      onChange={(e) => setStandardNumber(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
                    >
                      {bookingLab.accreditedStandards.map((std, i) => {
                        const info = getStandardProductInfo(std);
                        return (
                          <option key={i} value={std}>
                            {info.name} ({std})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Testing Urgency
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      urgency === "standard" ? "border-blue-500 bg-blue-50/50" : "border-slate-200"
                    }`}>
                      <input 
                        type="radio" 
                        name="urgency" 
                        checked={urgency === "standard"} 
                        onChange={() => setUrgency("standard")} 
                        className="text-blue-600"
                      />
                      <div>
                        <span className="font-bold block">Standard Turnaround</span>
                        <span className="text-[10px] text-slate-500">{bookingLab.leadTime}</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      urgency === "express" ? "border-amber-500 bg-amber-50/50" : "border-slate-200"
                    }`}>
                      <input 
                        type="radio" 
                        name="urgency" 
                        checked={urgency === "express"} 
                        onChange={() => setUrgency("express")} 
                        className="text-amber-600"
                      />
                      <div>
                        <span className="font-bold text-amber-900 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" /> Express Fast-Track
                        </span>
                        <span className="text-[10px] text-slate-500">3-5 Days Priority</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#163f73] hover:bg-[#1e4f8f] disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    {bookingLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Confirm & Reserve Slot</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
