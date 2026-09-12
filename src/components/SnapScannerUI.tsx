"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2, AlertTriangle, Zap, CheckCircle2, ChevronRight, FileScan, ScanText, Crosshair, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_BIS_DATA } from "@/data/mockBisData";
import { useAppStore } from "@/store/useAppStore";

export default function SnapScannerUI() {
  const [image, setImage] = useState<File | string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ status: string; progress: number } | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setActiveDrawer = useAppStore(state => state.setActiveDrawer);
  const setSelectedStandardId = useAppStore(state => state.setSelectedStandardId);
  
  const [clauseStatus, setClauseStatus] = useState<Record<string, boolean>>({});

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError("Invalid Upload: Please provide a valid image (JPG/PNG).");
      resetState();
      return;
    }
    resetState();
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const resetState = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setProgress(null);
  };

  const runSampleTest = () => {
    resetState();
    // Use a more industrial/electronic looking image for the demo
    const demoImageUrl = "/sample-rating-plate.jpg";
    setImage(demoImageUrl);
    setPreview(demoImageUrl);
    
    // Auto-scan after setting image for demo
    setTimeout(() => {
      handleScan(demoImageUrl);
    }, 600);
  };

  const compressImage = (fileOrBlob: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileOrBlob);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          // Max dimension 1200px to ensure base64 is well under Vercel's 4.5MB limit
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.8 quality
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        };
        img.onerror = (e) => reject(e);
      };
      reader.onerror = (e) => reject(e);
    });
  };

  const urlToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return compressImage(blob);
  };


  const handleScan = async (eventOrSource?: React.MouseEvent | string) => {
    // If the button clicked it, it passes a MouseEvent. If Live Demo called it, it passes a string.
    const source = typeof eventOrSource === 'string' ? eventOrSource : image;
    if (!source) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress({ status: "Connecting to AI Vision Engine", progress: 20 });

    try {
      let base64Image = "";
      if (typeof source === 'string') {
        base64Image = await urlToBase64(source);
      } else {
        base64Image = await compressImage(source);
      }
      
      setProgress({ status: "Analyzing image contents", progress: 60 });

      const response = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });

      if (!response.ok) {
        let errMsg = "Failed to process image via AI Engine";
        try {
          const errData = await response.json();
          if (errData.error) errMsg = `Server Error: ${errData.error}`;
        } catch (e) {}
        throw new Error(errMsg);
      }

      setProgress({ status: "Finalizing results", progress: 90 });
      const data = await response.json();

      if (!data.isValid) {
        setError(data.reasoning || "Invalid Upload: The provided image does not contain a recognizable product rating plate or BIS label.");
      } else {
        setResult({
          ocrExtracted: data.ocrExtracted,
          matchedStandard: data.matchedStandard,
          reasoning: data.reasoning
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Vision Engine failed. Please ensure the image is clear and well-lit.");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  const toggleClause = (id: string) => {
    setClauseStatus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full h-full flex flex-col font-sans bg-slate-50/50 overflow-y-auto">
      {/* Header Section */}
      <div className="px-8 py-8 border-b border-slate-200 bg-white shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <ScanText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">AI Compliance Scanner</h2>
              <p className="text-slate-500 font-medium mt-1">Upload rating plates for automated BIS standard mapping</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">

            <Button 
              onClick={runSampleTest}
              className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 font-semibold border-none flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Live Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Input & Vision UI */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            
            {/* Error Banner */}
            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="text-red-600 w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium leading-relaxed">{error}</p>
              </div>
            )}

            {/* Scanner Viewfinder */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-indigo-600" /> Viewfinder
                </h3>
                {preview && !loading && !result && (
                  <Button size="sm" variant="ghost" className="h-8 text-slate-500 hover:text-slate-800" onClick={resetState}>
                    Clear
                  </Button>
                )}
              </div>

              <div className="p-6 relative bg-slate-100/50">
                {!preview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl aspect-[4/3] flex flex-col items-center justify-center cursor-pointer transition-all group ${
                      isDragging 
                        ? 'bg-indigo-50 border-indigo-500 scale-[1.02]' 
                        : 'border-slate-300 hover:bg-indigo-50/50 hover:border-indigo-300'
                    }`}
                  >
                    <div className={`w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 transition-transform ${
                      isDragging ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                      <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-indigo-600' : 'text-indigo-500'}`} />
                    </div>
                    <p className="font-bold text-slate-700 text-lg">
                      {isDragging ? 'Drop it here!' : 'Drop product image here'}
                    </p>
                    <p className="text-sm text-slate-500 mt-2 text-center px-8">Supports High-Res JPG/PNG up to 10MB.<br/>Ensure text is clearly visible.</p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] shadow-inner group">
                    <img src={preview} alt="Target" className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-40' : 'opacity-100'}`} />
                    
                    {/* Active Scanning Overlay */}
                    {loading && (
                      <div className="absolute inset-0 z-10">
                        {/* Scanning Line */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500 shadow-[0_0_20px_4px_rgba(99,102,241,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
                        
                        {/* HUD Elements */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="bg-slate-900/80 backdrop-blur-md px-6 py-5 rounded-2xl border border-white/10 flex flex-col items-center min-w-[240px] shadow-2xl">
                            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
                            <p className="font-bold text-white tracking-wide">OCR Processing</p>
                            <p className="text-xs text-indigo-300 mt-1 uppercase tracking-widest font-semibold">
                              {progress?.status || 'Analyzing...'}
                            </p>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden border border-white/5">
                              <div 
                                className="bg-indigo-500 h-full transition-all duration-300 ease-out"
                                style={{ width: `${progress?.progress || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Trigger Button */}
                {preview && !loading && !result && (
                  <div className="mt-6 flex justify-center">
                    <Button 
                      size="lg"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl text-base shadow-xl shadow-slate-900/20" 
                      onClick={handleScan}
                    >
                      <ScanText className="w-5 h-5 mr-2" /> Start AI Extraction
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Extracted Data Visualizer */}
            {result && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Box className="w-4 h-4 text-indigo-600" /> Extracted Parameters
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">
                    High Confidence
                  </span>
                </div>
                <div className="p-6">
                  {Object.keys(result.ocrExtracted || {}).length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(result.ocrExtracted).map(([key, value]) => (
                        <div key={key} className="flex flex-col bg-slate-50/80 hover:bg-slate-50 p-3 rounded-2xl border border-slate-100 transition-colors">
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1 truncate" title={key}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-sm font-bold text-slate-800 break-words" title={value as string}>
                            {value as string}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs font-medium">
                      No parameters could be extracted from this label.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Matched Standard & Checklist */}
          <div className="xl:col-span-7">
            {result ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
                
                {/* Standard Banner */}
                <div className="p-8 border-b border-slate-100 bg-gradient-to-br from-emerald-50 to-teal-50/20 rounded-t-3xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-emerald-500/20 p-1.5 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-emerald-800 uppercase tracking-widest text-xs">Standard Successfully Matched</h3>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h4 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                      {result.matchedStandard.code}
                    </h4>
                    <span className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg uppercase tracking-widest shrink-0">
                      {result.matchedStandard.schemeType}
                    </span>
                  </div>
                  
                  <p className="text-lg font-medium text-slate-700 leading-relaxed mb-6">
                    {result.matchedStandard.title}
                  </p>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-100 shadow-sm">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      <strong className="text-emerald-700">AI Reasoning:</strong> {result.reasoning}
                    </p>
                  </div>
                </div>

                {/* Mandatory Clauses Checklist */}
                <div className="p-8 flex-1 bg-slate-50/30">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Mandatory Testing Clauses</h4>
                  
                  <div className="space-y-4">
                    {result.matchedStandard.mandatoryClauses.map((clause: any) => {
                      const isChecked = !!clauseStatus[clause.id];
                      return (
                        <div 
                          key={clause.id} 
                          className={`group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                            isChecked 
                              ? 'bg-emerald-50/50 border-emerald-500 shadow-sm shadow-emerald-500/10' 
                              : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                          }`}
                          onClick={() => toggleClause(clause.id)}
                        >
                          <div className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                            isChecked 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'bg-slate-50 border-slate-300 group-hover:border-indigo-400'
                          }`}>
                            {isChecked && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1">
                            <span className="shrink-0 text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md tracking-wider">
                              Clause {clause.id}
                            </span>
                            <span className={`text-base font-semibold ${isChecked ? 'text-emerald-900' : 'text-slate-700'}`}>
                              {clause.title || clause.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-6 border-t border-slate-100 bg-white rounded-b-3xl flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={resetState}
                    className="border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold h-12 px-6 rounded-xl"
                  >
                    Scan Another
                  </Button>
                  <Button 
                    onClick={() => {
                      if (result?.matchedStandard?.code) {
                        setSelectedStandardId(result.matchedStandard.code);
                      }
                      setActiveDrawer('labs');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 rounded-xl text-base shadow-lg shadow-indigo-600/20"
                  >
                    Proceed to Lab Finder <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 border-dashed h-full flex flex-col items-center justify-center text-center p-12 min-h-[500px]">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                  <FileScan className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-3">Awaiting Analysis</h3>
                <p className="text-slate-500 max-w-md text-base leading-relaxed">
                  Upload a product label and run the Vision Extraction to view automatically mapped BIS parameters and mandatory standard clauses here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
