"use client";

import { useState, useEffect } from "react";
import { FileSearch, Plus, FileText, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";

export default function StandardsViewerUI() {
  const activeDrawer = useAppStore(state => state.activeDrawer);
  const [activeTab, setActiveTab] = useState<'document' | 'comments'>(activeDrawer === 'drafts' ? 'comments' : 'document');
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const standardId = "std-17855";
  const standardNumber = "IS 17855:2022 (Draft Revision)";
  const standardTitle = "Electric Vehicle (EV) Safety Requirements - Rechargeable Electrical Energy Storage System (REESS)";

  // Fetch comments from backend on mount
  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const res = await fetch(`/api/standards/${standardId}/comments`);
      const data = await res.json();
      if (data.success && data.comments) {
        setComments(data.comments);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentText = newComment.trim();
    setNewComment("");

    try {
      const res = await fetch(`/api/standards/${standardId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: commentText,
          userName: "Industry Engineering Stakeholder",
          organization: "Automotive Safety & Compliance Forum",
          section: "Clause 6.1 (Thermal Runaway)"
        })
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setComments(prev => [data.comment, ...prev]);
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 overflow-hidden">
      <div className="mb-4 shrink-0 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileSearch className="text-purple-600 w-5 h-5" /> 
              {standardNumber}
            </h2>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
              Open for Public Comments
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-sm max-w-lg line-clamp-1">
            {standardTitle}
          </p>
        </div>
        <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shrink-0 shadow-xs">
          <button 
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'document' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
            onClick={() => setActiveTab('document')}
          >
            Draft Clauses
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'comments' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
            onClick={() => setActiveTab('comments')}
          >
            <span>Consultation Comments</span>
            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {comments.length}
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden relative shadow-xs">
        {activeTab === 'document' ? (
          <div className="w-full h-full p-5 overflow-y-auto space-y-4">
            <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900">
                <span className="font-bold block text-sm mb-1">Bureau of Indian Standards — Wide Circulation Draft</span>
                This document is issued for public comments under BIS Standard Formulation Rules. Stakeholders, manufacturers, and academic bodies are invited to submit technical views.
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    Clause 6.1 (Proposed)
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Mandatory Provision
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Single Cell Thermal Runaway Propagation Safeguard
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Triggering a thermal runaway in a single cell within the battery pack must not propagate to adjacent cells for at least 10 minutes, allowing passenger cabin evacuation.
                </p>
                <div className="mt-2 text-[11px] bg-slate-50 p-2 rounded text-slate-700">
                  <span className="font-semibold text-slate-800">Test Method:</span> Ceramic cartridge heater trigger at 100°C/min · <span className="font-semibold text-slate-800">Limit:</span> Zero flame emission for min 10 minutes.
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    Clause 8.4 (Proposed)
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Environmental Test
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Saltwater Immersion & Ingress Integrity
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Battery pack submerged in 3.5% NaCl solution to simulate monsoon flash flooding conditions with post-immersion isolation monitoring.
                </p>
                <div className="mt-2 text-[11px] bg-slate-50 p-2 rounded text-slate-700">
                  <span className="font-semibold text-slate-800">Test Method:</span> Submersion for 2 hours followed by 24 hour rest · <span className="font-semibold text-slate-800">Limit:</span> Insulation resistance &gt;= 100 Ω/V.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col bg-white">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <form onSubmit={handlePostComment} className="flex gap-2">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Add your stakeholder feedback to this public draft..." 
                  className="flex-1 bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-2xs"
                />
                <Button type="submit" size="sm" className="bg-[#163f73] hover:bg-[#1e4f8f] text-white px-4 shrink-0 shadow-xs cursor-pointer font-bold text-xs">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Post Feedback
                </Button>
              </form>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingComments ? (
                <div className="text-center py-8 text-xs text-slate-400">Loading consultation comments from database...</div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">No public comments submitted yet. Be the first to comment!</div>
              ) : (
                comments.map((comment: any) => (
                  <div key={comment.id} className="bg-white border border-slate-200 shadow-2xs rounded-xl p-4">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                          {comment.userName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{comment.userName}</span>
                          {comment.organization && (
                            <span className="text-[10px] text-slate-500 block">{comment.organization}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mb-2">
                      <span className="inline-block bg-amber-50 text-[10px] font-bold text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                        {comment.section}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {comment.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
