"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { TestingLab, getStandardProductInfo } from "@/data/labsDirectoryData";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Create custom pin icons using SVG for zero external asset dependencies
const createLabIcon = (isSelected: boolean) => {
  const color = isSelected ? "#ef4444" : "#2563eb";
  const glow = isSelected ? "rgba(239, 68, 68, 0.4)" : "rgba(37, 99, 235, 0.3)";
  
  return L.divIcon({
    className: "custom-lab-marker",
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      ">
        <div style="
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${glow};
          animation: pulse 2s infinite;
        "></div>
        <div style="
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${color};
          border: 2.5px solid #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Component to handle smooth map flying when selected lab changes & size invalidation
function MapController({ selectedLab }: { selectedLab: TestingLab | null }) {
  const map = useMap();
  
  useEffect(() => {
    // Invalidate map size on mount and after render to prevent any tile clipping or bottom cutoff
    const timer1 = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [map]);

  useEffect(() => {
    if (selectedLab) {
      map.flyTo([selectedLab.latitude, selectedLab.longitude], 12, {
        duration: 1.2
      });
    }
  }, [selectedLab, map]);

  return null;
}

interface MapComponentProps {
  labs: TestingLab[];
  selectedLab: TestingLab | null;
  onSelectLab: (lab: TestingLab) => void;
  onRequestTest?: (lab: TestingLab) => void;
}

export default function MapComponent({ 
  labs, 
  selectedLab, 
  onSelectLab,
  onRequestTest 
}: MapComponentProps) {
  // Center of India positioned to frame entire subcontinent without bottom cut
  const defaultCenter: [number, number] = [21.5, 78.9629];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 relative z-0 shadow-inner bg-slate-100">
      <MapContainer 
        center={defaultCenter} 
        zoom={4.3} 
        minZoom={3.8}
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', minHeight: '440px' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {labs.map(lab => {
          const isSelected = selectedLab?.id === lab.id;
          return (
            <Marker 
              key={lab.id} 
              position={[lab.latitude, lab.longitude]}
              icon={createLabIcon(isSelected)}
              eventHandlers={{
                click: () => onSelectLab(lab)
              }}
            >
              <Popup className="font-sans text-slate-900 min-w-[240px]">
                <div className="p-1">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      NABL {lab.accreditationNo}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      ★ {lab.rating}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">
                    {lab.name}
                  </h4>
                  
                  <p className="text-xs text-slate-600 mb-2">
                    {lab.address}
                  </p>

                  <div className="mb-2.5">
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                      APPROVED PRODUCT STANDARDS:
                    </span>
                    <div className="flex flex-col gap-1">
                      {lab.accreditedStandards.slice(0, 3).map((std, i) => {
                        const info = getStandardProductInfo(std);
                        return (
                          <div key={i} className="flex items-center justify-between text-[11px] bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded">
                            <span className="font-semibold text-slate-800 truncate mr-1.5">{info.name}</span>
                            <span className="text-[9px] font-mono text-slate-500 shrink-0 font-medium">{std}</span>
                          </div>
                        );
                      })}
                      {lab.accreditedStandards.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          +{lab.accreditedStandards.length - 3} more standards
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block leading-none">TURNAROUND</span>
                      <span className="font-bold text-slate-700 text-[11px]">{lab.leadTime}</span>
                    </div>
                    {onRequestTest && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRequestTest(lab);
                        }}
                        className="bg-[#163f73] hover:bg-[#1e4f8f] text-white text-[11px] font-bold px-2.5 py-1 rounded transition-colors"
                      >
                        Book Test
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapController selectedLab={selectedLab} />
      </MapContainer>
    </div>
  );
}
