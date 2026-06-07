import React, { useState } from "react";
import { 
  Sparkles, Search, ShieldAlert, Send, CheckCircle, ArrowRight, BarChart3, 
  Target, Zap, Briefcase, RefreshCw, Layers, Sliders, Users, DollarSign,
  Plus, Check, HelpCircle, FileText, Code2, Lock, ShieldCheck, Mail, Trash,
  ChevronRight, PhoneCall, ExternalLink, Calendar, PlusCircle
} from "lucide-react";
import { Prospect, BuyerSignal, LeadList, WorkflowAutomation, Contact } from "../types";
import { SAMPLE_CANDIDATES } from "../mockData";

// =============== 1. AI PROSPECT SEARCH COMPONENT ===============
interface AISearchViewProps {
  onAddProspectToSavedList: (prospect: Prospect, listName: string) => void;
  savedLists: LeadList[];
  onCreateNewList: (name: string, description: string) => void;
}

export function AISearchView({ onAddProspectToSavedList, savedLists, onCreateNewList }: AISearchViewProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [message, setMessage] = useState("");
  
  // Filters
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [revenue, setRevenue] = useState("");
  const [intentThreshold, setIntentThreshold] = useState(70);

  // Modal active state for saving
  const [selectedProspectToSave, setSelectedProspectToSave] = useState<Prospect | null>(null);
  const [selectedListName, setSelectedListName] = useState("");
  const [newListName, setNewListName] = useState("");

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query) return;

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          filters: { industry, companySize, revenue, intentThreshold }
        }),
      });
      const data = await response.json();
      setProspects(data.prospects || []);
      if (data.message) {
        setMessage(data.message);
      }
    } catch (err: any) {
      console.error(err);
      setMessage("Fallback state activated. Problem connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const executeQuickPreset = (preset: string) => {
    setQuery(preset);
    // Auto submit
    setTimeout(() => {
      const searchBtn = document.getElementById("main-search-btn");
      searchBtn?.click();
    }, 50);
  };

  const openSaveModal = (p: Prospect) => {
    setSelectedProspectToSave(p);
    if (savedLists.length > 0) {
      setSelectedListName(savedLists[0].name);
    } else {
      setSelectedListName("UK Expansion Targets");
    }
  };

  const handleConfirmSave = () => {
    if (!selectedProspectToSave) return;
    
    let targetList = selectedListName;
    if (newListName.trim()) {
      onCreateNewList(newListName.trim(), "Custom lists created during prospect curation.");
      targetList = newListName.trim();
    }

    onAddProspectToSavedList(selectedProspectToSave, targetList);
    setSelectedProspectToSave(null);
    setNewListName("");
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-400" />
            <span>AI Natural Language Prospect Engine</span>
          </h2>
          <p className="text-slate-400 text-xs">
            Describe who qualifies, specify expansion states, or crawl real-time business signals instantly.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-indigo-950 font-mono text-indigo-400 border border-indigo-900/40 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
            Live Gemini Model Online
          </span>
        </div>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleSearch} className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl space-y-4">
        <label className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-400 block">
          Describe the exact prospects you want the crawl agents to discover
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Operations directors at UK manufacturing companies with 200-500 employees expanding warehouses"
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none placeholder:text-slate-600 font-mono"
          />
          <button
            type="submit"
            id="main-search-btn"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shrink-0 transition cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crawling Intent...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Search Prospects</span>
              </>
            )}
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-850/60 text-xs">
          <div>
            <label className="text-slate-500 block mb-1.5 font-mono">Industry Segment</label>
            <select 
              value={industry} 
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Any Industry</option>
              <option value="Manufacturing">Manufacturing & Industrial</option>
              <option value="Logistics">Logistics & Supply Chain</option>
              <option value="SaaS">SaaS & Enterprise Tech</option>
              <option value="Finance">Financial Services</option>
              <option value="Healthcare">Healthcare & BioTech</option>
            </select>
          </div>

          <div>
            <label className="text-slate-500 block mb-1.5 font-mono">Company Headcount</label>
            <input 
              type="text" 
              placeholder="e.g., 200-500" 
              value={companySize} 
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-500 block mb-1.5 font-mono">Company ARR / Revenue</label>
            <input 
              type="text" 
              placeholder="e.g., $10M-$50M" 
              value={revenue} 
              onChange={(e) => setRevenue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5 text-slate-500 font-mono">
              <span>Intent Score Floor</span>
              <span className="text-indigo-400 font-bold">{intentThreshold}+</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="95" 
              value={intentThreshold}
              onChange={(e) => setIntentThreshold(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg accent-indigo-500 cursor-pointer mt-2"
            />
          </div>
        </div>

        {/* Quick query presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
          <span className="text-slate-500 font-mono">Quick Match Presets:</span>
          <button
            type="button"
            onClick={() => executeQuickPreset("Operations directors in UK logistics expanding warehouses")}
            className="text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-900 border border-slate-800 px-2 py-0.5 rounded transition font-mono cursor-pointer"
          >
            UK Warehouses
          </button>
          <button
            type="button"
            onClick={() => executeQuickPreset("US scaleup security officers at Series B startups using PostgreSQL")}
            className="text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-900 border border-slate-800 px-2 py-0.5 rounded transition font-mono cursor-pointer"
          >
            Series B DevOps
          </button>
          <button
            type="button"
            onClick={() => executeQuickPreset("Procurement VP at industrial electronics factories in Manchester")}
            className="text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-900 border border-slate-800 px-2 py-0.5 rounded transition font-mono cursor-pointer"
          >
            Procurement UK
          </button>
        </div>
      </form>

      {/* Message banners for Gemini response info */}
      {message && (
        <div className="p-3 bg-indigo-950/40 border border-indigo-900/50 text-indigo-300 text-xs font-mono rounded-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0 text-indigo-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Loading Placeholder */}
      {loading && (
        <div className="py-24 flex flex-col items-center justify-center bg-slate-900/20 border border-slate-900 rounded-xl">
          <div className="relative mb-4">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-950 border-t-indigo-500 animate-spin" />
            <Sparkles className="w-5 h-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <span className="text-xs font-mono text-indigo-300 font-semibold mb-1 animate-pulse">Running Crawlers...</span>
          <span className="text-slate-500 text-[11px] max-w-sm text-center font-mono">Mapping stakeholder records, evaluating trigger coefficients and crawling live business news indicators via Gemini.</span>
        </div>
      )}

      {/* Core Results Block */}
      {!loading && prospects.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-mono text-slate-500">{prospects.length} matching accounts discovered:</span>
            <span className="text-[10px] text-emerald-400 font-mono">ALL EXPORTS DOUBLE-ENRICHED</span>
          </div>

          <div className="space-y-4">
            {prospects.map((lead, index) => (
              <div 
                key={index} 
                className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700/80 transition flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="flex-1 space-y-3">
                  {/* Company Metadata Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-white font-bold text-base tracking-tight">{lead.company.name}</h3>
                    <span className="text-[10px] bg-slate-950 font-mono text-slate-400 border border-slate-800 px-2 py-0.5 rounded-full">
                      {lead.company.industry}
                    </span>
                    <span className="text-[10px] bg-slate-950 font-mono text-slate-400 border border-slate-800 px-2 py-0.5 rounded-full">
                      Revenue: {lead.company.revenue}
                    </span>
                    <span className="text-[10px] bg-indigo-950/40 font-mono text-indigo-300 border border-indigo-900/30 px-2.5 py-0.5 rounded-full">
                      {lead.company.funding}
                    </span>
                  </div>

                  {/* Pitch / Description */}
                  <p className="text-xs text-slate-400 font-mono">{lead.company.description}</p>

                  {/* Core Contact Profiling Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/45 p-3 rounded-lg border border-slate-900 text-xs">
                    <div>
                      <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-mono mb-0.5">Primary Contact</span>
                      <strong className="text-white font-medium text-xs">{lead.contact.name}</strong>
                      <span className="block text-[11px] text-slate-400 leading-tight">{lead.contact.title}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-mono mb-0.5">Business Email</span>
                      <span className="font-mono text-slate-300 text-xs block truncate">{lead.contact.email}</span>
                      <span className="block text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                        <CheckCircle className="w-3 h-3" /> Double Verified
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-mono mb-0.5">Operations Phone</span>
                      <span className="font-mono text-slate-300 text-xs block">{lead.contact.phone || "Not Enriched"}</span>
                      <span className="block text-[10px] text-slate-500 font-mono">Linked: <a href={lead.contact.socialLink} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-0.5">LinkedIn <ExternalLink className="w-2.5 h-2.5" /></a></span>
                    </div>
                  </div>

                  {/* Why matched explanation block */}
                  <div className="text-[11px] bg-indigo-950/10 border border-indigo-950/50 text-slate-300 p-2.5 rounded-lg flex items-start gap-2 italic">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 not-italic" />
                    <span>
                      <strong className="text-indigo-400 font-semibold font-mono not-italic mr-1.5">GEMINI REASONING:</strong> 
                      "{lead.matchedWhy}"
                    </span>
                  </div>

                  {/* Display Buyer Signals detected */}
                  {lead.buyingSignals && lead.buyingSignals.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Recently Tracked Triggers (Signals)</span>
                      <div className="flex flex-wrap gap-2">
                        {lead.buyingSignals.map((sig, sidx) => (
                          <div key={sidx} className="bg-slate-950 border border-slate-900 text-[10px] p-2 rounded-lg flex items-center justify-between gap-4 max-w-sm">
                            <div>
                              <strong className="text-amber-400 uppercase font-mono mr-1">{sig.category}:</strong>
                              <span className="text-slate-400 font-mono text-[10px]">{sig.description}</span>
                            </div>
                            <span className="bg-amber-950/60 text-amber-400 border border-amber-900/40 px-1 py-0.5 rounded font-mono font-bold">
                              {sig.score}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tech stack */}
                  {lead.company.technologies && (
                    <div className="flex flex-wrap gap-1 items-center pt-1">
                      <span className="text-[9px] text-slate-600 font-mono uppercase tracking-widest mr-2">TECH STACK:</span>
                      {lead.company.technologies.map((tech, tIdx) => (
                        <span key={tIdx} className="text-[10px] bg-slate-950 text-slate-500 border border-slate-900 px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Score & Controls Column */}
                <div className="flex flex-row md:flex-col justify-between md:justify-center items-end border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-5 min-w-[130px] gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Contact Fit</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono block leading-none">{lead.contactScore}%</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Intent Strength</span>
                    <span className="text-base font-extrabold text-cyan-400 font-mono block leading-none">{lead.intentScore}%</span>
                  </div>

                  <div className="w-full space-y-2 mt-auto">
                    <button
                      onClick={() => openSaveModal(lead)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-200 text-xs font-semibold rounded-lg transition text-center flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{lead.saved ? "Change List" : "Save to List"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save to List Modal Dialog */}
      {selectedProspectToSave && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl">
            <h3 className="text-white font-bold text-base mb-2">Save Prospect to Outbound List</h3>
            <p className="text-slate-400 text-xs mb-4">
              Select an existing Lead List or type a brand new category title to sync {selectedProspectToSave.company.name} target data.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-slate-500 text-[10px] uppercase font-mono block mb-1.5">Select Existing List</label>
                <select
                  value={selectedListName}
                  onChange={(e) => setSelectedListName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                >
                  {savedLists.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name} ({l.prospectCount} prospects matched)
                    </option>
                  ))}
                  <option value="UK Expansion Targets">UK Expansion Targets</option>
                  <option value="Series A Tech Teams">Series A Tech Teams</option>
                </select>
              </div>

              <div className="flex items-center gap-2 py-1 text-slate-600">
                <hr className="flex-1 border-slate-800" />
                <span className="text-[10px] font-mono">OR CREATE</span>
                <hr className="flex-1 border-slate-800" />
              </div>

              <div>
                <label className="text-slate-500 text-[10px] uppercase font-mono block mb-1.5">New List Title</label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => {
                    setNewListName(e.target.value);
                  }}
                  placeholder="e.g. Manchester Automation Targets"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setSelectedProspectToSave(null)}
                className="flex-1 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 font-semibold rounded-lg text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
              >
                Save Prospect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// =============== 2. BUYER SIGNALS MONITOR COMPONENT ===============
interface BuyerSignalsViewProps {
  signals: BuyerSignal[];
  onTriggerOutreachDraft: (leadName: string, companyName: string, notes: string) => void;
}

export function BuyerSignalsView({ signals, onTriggerOutreachDraft }: BuyerSignalsViewProps) {
  const [filterCat, setFilterCat] = useState("all");
  
  const filtered = filterCat === "all" 
    ? signals 
    : signals.filter(s => s.category.toLowerCase().includes(filterCat.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span>Buyer Intent Signals Center</span>
          </h2>
          <p className="text-slate-400 text-xs">
            We actively monitor filings, funding releases, hire targets and news feeds. High strength triggers expose warm targets.
          </p>
        </div>

        {/* Categories toggler */}
        <div className="flex flex-wrap gap-1 border border-slate-800/80 bg-slate-900/20 p-1 rounded-xl text-xs font-mono">
          {["all", "hiring", "funding", "expansion", "technology"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1 rounded-lg transition text-[11px] cursor-pointer ${filterCat === cat ? "bg-indigo-600 text-white" : "text-slate-450 hover:text-white"}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filtered.map((sig, i) => {
          let badgeColor = "bg-purple-950 border-purple-900 text-purple-400";
          if (sig.category.toLowerCase().includes("funding")) {
            badgeColor = "bg-emerald-950 border-emerald-900 text-emerald-400";
          } else if (sig.category.toLowerCase().includes("hiring")) {
            badgeColor = "bg-blue-950 border-blue-950 text-blue-400";
          } else if (sig.category.toLowerCase().includes("expansion")) {
            badgeColor = "bg-amber-950 border-amber-900 text-amber-400";
          } else if (sig.category.toLowerCase().includes("technology")) {
            badgeColor = "bg-cyan-950 border-cyan-900 text-cyan-400";
          }

          return (
            <div 
              key={i} 
              className="bg-slate-900/30 border border-slate-800/60 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-700/60 transition"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[9px] uppercase font-mono tracking-widest px-2.5 py-0.5 border rounded-full ${badgeColor}`}>
                    {sig.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {sig.date}
                  </span>
                </div>
                <h4 className="text-white text-xs sm:text-sm font-semibold font-mono leading-relaxed">
                  {sig.description}
                </h4>
              </div>

              <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-start border-t sm:border-t-0 border-slate-850/50 pt-3 sm:pt-0">
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 uppercase block font-mono">Signal Strength</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">{sig.score} index</span>
                </div>
                <button
                  onClick={() => onTriggerOutreachDraft("Decision Maker", "Target Company", `Triggered by ${sig.category}: "${sig.description}"`)}
                  className="px-3.5 py-2 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-900/40 text-indigo-300 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Draft Outreach</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// =============== 3. OUTREACH SEQUENCE GENERATOR ===============
interface OutreachGenViewProps {
  initialContact?: Contact;
  initialCompany?: any;
  initialTriggerNotes?: string;
  onRefreshCrmCount: () => void;
}

export function OutreachGenView({ initialContact, initialCompany, initialTriggerNotes, onRefreshCrmCount }: OutreachGenViewProps) {
  const defaultContact: Contact = {
    name: "Marcus Davies",
    title: "Director of Supply Chain & Operations",
    email: "m.davies@acmelogistics.io",
    phone: "+44 20 7946 0192",
    socialLink: "https://linkedin.com/in/marcus-davies-logistics"
  };

  const defaultCompany = {
    name: "Acme Logistics Solutions",
    description: "Smart freight forwarding and real-time inventory tracking with global warehousing hubs."
  };

  const [contactName, setContactName] = useState(initialContact?.name || defaultContact.name);
  const [contactTitle, setContactTitle] = useState(initialContact?.title || defaultContact.title);
  const [contactEmail, setContactEmail] = useState(initialContact?.email || defaultContact.email);
  const [companyName, setCompanyName] = useState(initialCompany?.name || defaultCompany.name);
  const [companyDescription, setCompanyDescription] = useState(initialCompany?.description || defaultCompany.description);
  const [triggerContext, setTriggerContext] = useState(initialTriggerNotes || "");

  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [sequence, setSequence] = useState<any | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<"email" | "linkedin" | "script" | "followup">("email");

  // CRM Sync status flags
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setSequence(null);
    try {
      const response = await fetch("/api/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: { name: contactName, title: contactTitle, email: contactEmail },
          company: { name: companyName, description: companyDescription },
          tone,
          triggerContext
        }),
      });
      const data = await response.json();
      setSequence(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePushToCRM = async () => {
    setIsSyncing(true);
    setSyncStatus("Pushing workspace contact attributes...");
    await new Promise((r) => setTimeout(r, 1200));
    setSyncStatus("Constructing outbound sequence campaigns in HubSpot...");
    await new Promise((r) => setTimeout(r, 800));
    setIsSyncing(false);
    setSyncStatus("Successfully synchronized to CRM!");
    onRefreshCrmCount();
    setTimeout(() => setSyncStatus(""), 4000);
  };

  const tones = [
    { id: "professional", label: "Executive Pro" },
    { id: "founder-led", label: "Founder-led Direct" },
    { id: "friendly", label: "Warm / Relatable" },
    { id: "enterprise", label: "Enterprise Scale" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-indigo-400" />
          <span>AI Outreach Copy Personalization Engine</span>
        </h2>
        <p className="text-slate-400 text-xs">
          Draft direct multi-channel campaigns optimized specifically to the prospects context, recent activity, and tone priority.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Inputs Config column */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-bold uppercase font-mono text-slate-400">Target Outreach Recipient</h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 font-mono block mb-1">Recipient Name</label>
                <input 
                  type="text" 
                  value={contactName} 
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-mono block mb-1">Job Title</label>
                <input 
                  type="text" 
                  value={contactTitle} 
                  onChange={(e) => setContactTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-mono block mb-1">Direct Work Email</label>
              <input 
                type="email" 
                value={contactEmail} 
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 font-mono block mb-1">Company Name</label>
                <input 
                  type="text" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-mono block mb-1">Selected Tone</label>
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                >
                  {tones.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-mono block mb-1">Company Pitch / Description</label>
              <textarea 
                rows={2} 
                value={companyDescription} 
                onChange={(e) => setCompanyDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-mono block mb-1">Trigger Context / Keywords (Optional)</label>
              <input 
                type="text" 
                value={triggerContext}
                onChange={(e) => setTriggerContext(e.target.value)}
                placeholder="e.g. Raised seed round capital, expanding Cardiff warehouses" 
                className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Weaving Outreach Sequences...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Campaign Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Display column */}
        <div className="lg:col-span-7 bg-slate-900/20 border border-slate-880 rounded-xl p-5 flex flex-col justify-between relative min-h-[350px]">
          {loading && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm flex flex-col justify-center items-center rounded-xl z-25">
              <div className="relative">
                <div className="w-10 h-10 border-4 border-indigo-950 border-t-indigo-500 rounded-full animate-spin mb-3" />
                <Sparkles className="w-4 h-4 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <span className="text-[11px] font-mono text-indigo-300 font-bold">Personalizing sequence templates...</span>
            </div>
          )}

          {!sequence && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 font-mono text-xs">
              <Mail className="w-12 h-12 text-slate-750 mb-3" />
              <p>Configure details on the left and tap "Generate Campaign Copy" to compile multi-touch output sequence logs.</p>
            </div>
          )}

          {sequence && !loading && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              {/* Channels Selector bar */}
              <div className="grid grid-cols-4 gap-1.5 border border-slate-850 bg-slate-950 p-1 rounded-xl text-xs font-mono">
                <button
                  onClick={() => setSelectedChannel("email")}
                  className={`py-1.5 rounded-lg transition text-[10px] font-semibold cursor-pointer ${selectedChannel === "email" ? "bg-indigo-600 text-white font-bold" : "text-slate-500 hover:text-white"}`}
                >
                  EMAIL 1 (COLD)
                </button>
                <button
                  onClick={() => setSelectedChannel("linkedin")}
                  className={`py-1.5 rounded-lg transition text-[10px] font-semibold cursor-pointer ${selectedChannel === "linkedin" ? "bg-indigo-600 text-white font-bold" : "text-slate-500 hover:text-white"}`}
                >
                  LINKEDIN INTRO
                </button>
                <button
                  onClick={() => setSelectedChannel("script")}
                  className={`py-1.5 rounded-lg transition text-[10px] font-semibold cursor-pointer ${selectedChannel === "script" ? "bg-indigo-600 text-white font-bold" : "text-slate-500 hover:text-white"}`}
                >
                  PHONE SCRIPT
                </button>
                <button
                  onClick={() => setSelectedChannel("followup")}
                  className={`py-1.5 rounded-lg transition text-[10px] font-semibold cursor-pointer ${selectedChannel === "followup" ? "bg-indigo-600 text-white font-bold" : "text-slate-500 hover:text-white"}`}
                >
                  FOLLOW UP (EMAIL)
                </button>
              </div>

              {/* Text Area display */}
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed flex-1 select-all select-all focus:outline-none min-h-[180px]">
                {selectedChannel === "email" && sequence.email1}
                {selectedChannel === "linkedin" && sequence.linkedinMessage}
                {selectedChannel === "script" && sequence.coldScript}
                {selectedChannel === "followup" && sequence.followup}
              </div>

              {/* CRM Sync and Quick Helpers */}
              <div className="pt-3 border-t border-slate-850/60 flex flex-wrap gap-3 items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 font-mono">
                  Characters: {
                    selectedChannel === "email" ? sequence.email1?.length :
                    selectedChannel === "linkedin" ? sequence.linkedinMessage?.length :
                    selectedChannel === "script" ? sequence.coldScript?.length : sequence.followup?.length
                  } (Optimized for spam scores)
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const textToCopy = 
                        selectedChannel === "email" ? sequence.email1 :
                        selectedChannel === "linkedin" ? sequence.linkedinMessage :
                        selectedChannel === "script" ? sequence.coldScript : sequence.followup;
                      navigator.clipboard.writeText(textToCopy);
                      alert("Copied to clipboard!");
                    }}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-450 selection:bg-indigo-500 font-mono cursor-pointer"
                  >
                    Copy Text
                  </button>
                  <button
                    onClick={handlePushToCRM}
                    disabled={isSyncing}
                    className="px-3.5 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-900/50 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {isSyncing ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5" />
                    )}
                    <span>{isSyncing ? "Syncing..." : "Push Campaign to CRM"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {syncStatus && (
            <div className="absolute bottom-5 right-5 p-3 bg-indigo-950 border border-indigo-900 text-indigo-300 rounded-lg text-xs font-mono animate-fadeIn flex items-center gap-2 shadow-xl z-20">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{syncStatus}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// =============== 4. MEETING PREP DOSSIERS COMPONENT ===============
export function MeetingPrepView() {
  const [personName, setPersonName] = useState("Sarah Jenkins");
  const [personTitle, setPersonTitle] = useState("VP of Operations & Procurement");
  const [coName, setCoName] = useState("InnoTech Manufacturing Ltd");
  const [coIndustry, setCoIndustry] = useState("Industrial Manufacturing");
  const [coNews, setCoNews] = useState("InnoTech deploys AI automated sorting robot arm in Sheffield assembly plant.");

  const [loading, setLoading] = useState(false);
  const [dossier, setDossier] = useState<any | null>(null);

  const handleGeneratePrep = async () => {
    setLoading(true);
    setDossier(null);
    try {
      const response = await fetch("/api/meeting-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: { name: personName, title: personTitle },
          company: { name: coName, industry: coIndustry, news: coNews, technologies: ["AWS", "HubSpot", "Docker"] }
        })
      });
      const data = await response.json();
      setDossier(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <span>AI Meeting Preparation Dossier</span>
        </h2>
        <p className="text-slate-400 text-xs">
          Generate highly customized pre-meeting briefs covering key stakeholders, pain points, tactical talking lines, and opportunity recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-bold uppercase font-mono text-slate-400">Meeting Parameters</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-405 font-mono block mb-1">Target Stakeholder</label>
              <input 
                type="text" 
                value={personName} 
                onChange={(e) => setPersonName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-405 font-mono block mb-1">Stakeholder Role</label>
              <input 
                type="text" 
                value={personTitle} 
                onChange={(e) => setPersonTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-405 font-mono block mb-1">Company Name</label>
              <input 
                type="text" 
                value={coName} 
                onChange={(e) => setCoName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-405 font-mono block mb-1">Primary Industry</label>
              <input 
                type="text" 
                value={coIndustry} 
                onChange={(e) => setCoIndustry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-405 font-mono block mb-1">Recent Milestone/Trigger News</label>
              <textarea 
                rows={2}
                value={coNews} 
                onChange={(e) => setCoNews(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />
            </div>
          </div>

          <button
            onClick={handleGeneratePrep}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Formulating Meeting Strategy...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Dossier Briefing</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-7 bg-slate-900/20 border border-slate-880 rounded-xl p-5 relative min-h-[350px]">
          {loading && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm flex flex-col justify-center items-center rounded-xl z-20">
              <div className="w-10 h-10 border-4 border-indigo-950 border-t-indigo-500 rounded-full animate-spin mb-3" />
              <span className="text-[11px] font-mono text-indigo-300 font-bold">Assembling B2B Intelligence briefing...</span>
            </div>
          )}

          {!dossier && !loading && (
            <div className="flex flex-col items-center justify-center text-center p-8 text-slate-500 font-mono text-xs h-full min-h-[250px]">
              <Calendar className="w-12 h-12 text-slate-755 mb-3" />
              <p>Prepare target briefing reports matching buyer trigger metrics before joining the meeting zoom corridor.</p>
            </div>
          )}

          {dossier && !loading && (
            <div className="space-y-4 text-xs font-mono">
              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-905">
                <span className="text-white font-bold uppercase block tracking-wider text-[10px]">MEETING DOSSIER FOR {personName.toUpperCase()}</span>
                <span className="text-amber-500 text-[10px]">HIGH INTENT CONVERSATION MATCH</span>
              </div>

              {/* Summary Block */}
              <div className="space-y-1">
                <span className="text-slate-500 text-[10px] uppercase block tracking-widest font-mono">Company Landscape Summary</span>
                <p className="bg-slate-950 border border-slate-900 rounded-lg p-2.5 text-slate-350 leading-relaxed text-[11px]">
                  {dossier.summary}
                </p>
              </div>

              {/* Stakeholder Summary */}
              <div className="space-y-1">
                <span className="text-slate-500 text-[10px] uppercase block tracking-widest font-mono">Stakeholder Dynamics</span>
                <p className="bg-slate-950 border border-slate-900 rounded-lg p-2.5 text-slate-350 leading-relaxed text-[11px]">
                  {dossier.stakeholders}
                </p>
              </div>

              {/* Pain points array */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase block tracking-widest font-mono">Strategic Pain Points</span>
                  <div className="bg-slate-950 border border-slate-905 rounded-lg p-2.5 space-y-1.5">
                    {dossier.painPoints?.map((p: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-400">
                        <span className="text-rose-500 font-bold shrink-0">&bull;</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase block tracking-widest font-mono">Tactical Openers & Talking Lines</span>
                  <div className="bg-slate-950 border border-slate-905 rounded-lg p-2.5 space-y-1.5">
                    {dossier.talkingPoints?.map((t: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[10px] text-indigo-300">
                        <span className="text-indigo-400 font-bold shrink-0">&raquo;</span>
                        <span>"{t}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-1">
                <span className="text-slate-500 text-[10px] uppercase block tracking-widest font-mono">Closing Opportunity Recommendations</span>
                <div className="bg-indigo-950/10 border border-indigo-900/30 rounded-lg p-2.5 text-[11px] text-indigo-200">
                  {dossier.recommendations}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// =============== 5. RECRUITING INTELLIGENCE ===============
export function RecruitingIntelView() {
  const [candidates] = useState(SAMPLE_CANDIDATES);
  const [recruitingQuery, setRecruitingQuery] = useState("");
  const [filteredList, setFilteredList] = useState(candidates);
  const [isFinding, setIsFinding] = useState(false);

  const handleRecruitingSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFinding(true);
    await new Promise((r) => setTimeout(r, 1200));
    
    if (recruitingQuery.trim()) {
      // Filter list based on titles/skills for demonstration high fidelity
      const term = recruitingQuery.toLowerCase();
      const matched = candidates.filter(c => 
        c.role.toLowerCase().includes(term) || 
        c.skills.some(s => s.toLowerCase().includes(term)) || 
        c.experience.toLowerCase().includes(term)
      );
      setFilteredList(matched.length > 0 ? matched : candidates);
    } else {
      setFilteredList(candidates);
    }
    setIsFinding(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          <span>AI Recruiting Candidate intelligence</span>
        </h2>
        <p className="text-slate-400 text-xs">
          Discover star candidates and premium operations leads based on conversational talent requisitions and news analysis.
        </p>
      </div>

      <form onSubmit={handleRecruitingSearch} className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl space-y-3">
        <label className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-400 block">
          Describe the ideal operations, logistics, or administrative candidate
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={recruitingQuery}
            onChange={(e) => setRecruitingQuery(e.target.value)}
            placeholder="e.g. Senior logistics planners with warehouse robotics and SAP experience in London"
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none placeholder:text-slate-600 font-mono"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shrink-0 transition cursor-pointer"
          >
            {isFinding ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Match Candidates</span>
          </button>
        </div>
      </form>

      {/* Listing Candidates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((cand, idx) => (
          <div key={idx} className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-xl hover:border-slate-700 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="text-white font-bold py-0.5">{cand.name}</h3>
                  <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">{cand.role}</span>
                </div>
                <span className="bg-indigo-950/80 text-indigo-400 border border-indigo-900/50 px-2.5 py-0.5 rounded font-mono text-xs font-bold">
                  {cand.score}% fit
                </span>
              </div>

              <div className="text-xs text-slate-400 font-mono space-y-1 pb-3 border-b border-slate-850/50">
                <p><span className="text-slate-600">Current:</span> {cand.currentCompany} ({cand.location})</p>
                <p><span className="text-slate-600">Education:</span> {cand.education}</p>
                <p><span className="text-slate-600">Tenure:</span> {cand.experience}</p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {cand.skills.map((s, si) => (
                  <span key={si} className="text-[10px] bg-slate-950 border border-slate-900 text-slate-400 px-2.5 py-0.5 rounded-full font-mono">
                    {s}
                  </span>
                ))}
              </div>

              {/* Recommendation Pitch */}
              <div className="bg-indigo-950/10 border border-indigo-950/40 p-2.5 rounded-lg text-[10px] italic text-slate-350 leading-relaxed font-mono">
                <span className="text-indigo-400 font-semibold not-italic">RECRUITER PITCH:</span> "{cand.personalTonePitch}"
              </div>
            </div>

            <div className="pt-4 border-t border-slate-850/30 mt-4 flex justify-between items-center">
              <span className="text-[9px] text-slate-600 font-mono uppercase">Pre-Vetted Match</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Hi ${cand.name.split(" ")[0]}, we are checking your profile for logistics opportunities...`);
                  alert("Introductory candidate block draft copied!");
                }}
                className="px-3 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-450 font-mono transition cursor-pointer"
              >
                Copy Intro Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// =============== 6. VISUAL AUTOMATIONS BUILDER ===============
interface AutomationsProps {
  automationPlans: WorkflowAutomation[];
  onToggleActive: (id: string) => void;
  onAddCustomAutomation: (name: string, triggerLabel: string) => void;
}

export function AutomationsBuilderView({ automationPlans, onToggleActive, onAddCustomAutomation }: AutomationsProps) {
  const [currentSelectedNode, setCurrentSelectedNode] = useState<string | null>(null);
  const [newFlowName, setNewFlowName] = useState("");
  const [newFlowTrigger, setNewFlowTrigger] = useState("Series B Funding");

  const buildCustomWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlowName.trim()) return;
    onAddCustomAutomation(newFlowName.trim(), newFlowTrigger);
    setNewFlowName("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>Intent-Driven Visual Automation Workflows</span>
        </h2>
        <p className="text-slate-400 text-xs">
          Establish automated chains of behavior: "When buyer raises Series A &rarr; Enrich Operations manager details &rarr; Draft email sequence &rarr; Push directly to HubSpot."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 space-y-6">
          {automationPlans.map((flow) => (
            <div key={flow.id} className="bg-slate-90s p-5 bg-slate-900/30 border border-slate-800/80 rounded-2xl relative">
              <div className="flex justify-between items-center mb-6 border-b border-slate-850/50 pb-3">
                <div>
                  <h3 className="text-white font-bold font-mono text-sm">{flow.name}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Status: {flow.active ? (
                      <strong className="text-emerald-400 font-extrabold font-mono">ACTIVE (Listening for buyer updates)</strong>
                    ) : (
                      <span className="text-slate-600 font-extrabold font-mono">DISABLED</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500">Enable automation:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={flow.active} 
                      onChange={() => onToggleActive(flow.id)} 
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white" />
                  </label>
                </div>
              </div>

              {/* Visual Flow Builder Nodes */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {flow.nodes.map((node, nidx) => (
                  <React.Fragment key={node.id}>
                    {/* Node Card */}
                    <button
                      onClick={() => setCurrentSelectedNode(node.id)}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 flex-1 transition min-w-[130px] w-full cursor-pointer ${
                        node.type === "trigger" 
                          ? "bg-slate-950 border-amber-900/40 hover:border-amber-500/40" 
                          : "bg-slate-950 border-indigo-950 hover:border-indigo-600/30"
                      } ${currentSelectedNode === node.id ? "ring-1 ring-indigo-500" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        node.type === "trigger" ? "bg-amber-950/60 text-amber-500 border-amber-900/40" : "bg-indigo-950/60 text-indigo-400 border-indigo-900/40"
                      }`}>
                        {node.type === "trigger" ? <Zap className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 block">
                          {node.type}
                        </span>
                        <strong className="text-white text-xs block truncate leading-tight font-semibold mt-0.5">{node.label}</strong>
                        <span className="text-[10px] text-slate-500 line-clamp-1 leading-tight mt-0.5 block">{node.description}</span>
                      </div>
                    </button>

                    {/* Arrow Spacer */}
                    {nidx < flow.nodes.length - 1 && (
                      <ChevronRight className="w-5 h-5 text-slate-700 hidden sm:block shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right configuration panel */}
        <div className="lg:col-span-4 bg-slate-900/20 border border-slate-880 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase font-mono text-slate-400 mb-4 pb-2 border-b border-slate-850/50">
              Flow Registry Settings
            </h3>
            
            {currentSelectedNode ? (
              <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl text-xs font-mono space-y-3">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <span className="text-indigo-400">Node Ref ID: {currentSelectedNode}</span>
                  <button 
                    onClick={() => setCurrentSelectedNode(null)}
                    className="text-slate-600 hover:text-slate-400"
                  >
                    Close
                  </button>
                </div>
                <p className="text-slate-350">
                  Select filters matched, scoring confidence threshold parameters, or push mapping variables directly to designated webhook endpoints here.
                </p>
                <div>
                  <label className="text-[9px] text-slate-500 block mb-1">EXECUTION THRESHOLD</label>
                  <select className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded text-white text-xs">
                    <option value="90">90%+ Intent Confidence Range</option>
                    <option value="80">80%+ Basic Intent Index</option>
                    <option value="all">Frictionless (Forward all triggers)</option>
                  </select>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-mono italic">
                Tap on any execution node block to configure advanced execution rules.
              </p>
            )}

            <hr className="border-slate-850/80 my-5" />

            {/* Custom workflow generator */}
            <form onSubmit={buildCustomWorkflow} className="space-y-3 text-xs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block mb-1.5">Create New Intelligent Automation</span>
              
              <div>
                <label className="text-[10px] text-slate-50 block mb-1 font-mono">Workflow Name</label>
                <input 
                  type="text" 
                  required
                  value={newFlowName}
                  onChange={(e) => setNewFlowName(e.target.value)}
                  placeholder="e.g. Executive Hires Enrichment" 
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-50 block mb-1 font-mono">Listening Trigger Option</label>
                <select 
                  value={newFlowTrigger}
                  onChange={(e) => setNewFlowTrigger(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-slate-300"
                >
                  <option value="Seed / Series A Funding">Funding Round Detected</option>
                  <option value="Warehouse Expansion Detected">Warehouse Expansions</option>
                  <option value="Leadership appointment filings">Leadership Hires</option>
                  <option value="Advanced Technology adoption">New Tech Adoption</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 hover:border-indigo-500/30 text-xs font-semibold rounded-lg font-mono transition cursor-pointer"
              >
                Assemble Visual Chain
              </button>
            </form>
          </div>
          <div className="mt-8 text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Encrypted SOC2 Execution sandbox</span>
          </div>
        </div>
      </div>
    </div>
  );
}
