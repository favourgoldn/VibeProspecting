import React, { useState } from "react";
import { 
  WorkspaceTab, UserRole, Prospect, LeadList, WorkflowAutomation, CRMConfig, BuyerSignal
} from "../types";
import { 
  AISearchView, BuyerSignalsView, OutreachGenView, 
  MeetingPrepView, RecruitingIntelView, AutomationsBuilderView 
} from "./IntelligenceViews";
import { AdminPanel } from "./AdminPanel";
import { 
  Sparkles, Search, ShieldAlert, Send, CheckCircle, ArrowRight, BarChart3, 
  Target, Zap, Briefcase, RefreshCw, Layers, Sliders, Users, DollarSign,
  Plus, Check, HelpCircle, FileText, Code2, Lock, ShieldCheck, Mail, Trash,
  ChevronRight, PhoneCall, ExternalLink, Calendar, PlusCircle, LayoutDashboard,
  Database, Settings, LogOut, ChevronDown, CheckSquare, ListPlus
} from "lucide-react";

interface SaaSAppProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onExitWorkspace: () => void;
  
  // States passed from App.tsx to keep everything synchronized
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;

  prospectsList: Prospect[];
  setProspectsList: React.Dispatch<React.SetStateAction<Prospect[]>>;
  
  leadLists: LeadList[];
  setLeadLists: React.Dispatch<React.SetStateAction<LeadList[]>>;

  buyerSignals: BuyerSignal[];
  
  automations: WorkflowAutomation[];
  setAutomations: React.Dispatch<React.SetStateAction<WorkflowAutomation[]>>;

  crmConfig: CRMConfig[];
  setCrmConfig: React.Dispatch<React.SetStateAction<CRMConfig[]>>;

  userCredits: number;
  setUserCredits: React.Dispatch<React.SetStateAction<number>>;
}

export function SaaSApp({
  currentRole,
  onChangeRole,
  onExitWorkspace,
  activeTab,
  setActiveTab,
  prospectsList,
  setProspectsList,
  leadLists,
  setLeadLists,
  buyerSignals,
  automations,
  setAutomations,
  crmConfig,
  setCrmConfig,
  userCredits,
  setUserCredits
}: SaaSAppProps) {
  // Current active prospect profile for detailed lookup overlay
  const [selectedProspectProfile, setSelectedProspectProfile] = useState<Prospect | null>(null);

  // States for creating new list directly
  const [toggleCreateListForm, setToggleCreateListForm] = useState(false);
  const [listFormName, setListFormName] = useState("");
  const [listFormDesc, setListFormDesc] = useState("");

  const syncedProspectCount = prospectsList.filter(p => p.saved).length;

  // States for outreach redirect helper
  const [outreachContactHeader, setOutreachContactHeader] = useState<any | undefined>(undefined);
  const [outreachCompanyHeader, setOutreachCompanyHeader] = useState<any | undefined>(undefined);
  const [outreachTriggerNotes, setOutreachTriggerNotes] = useState<string | undefined>(undefined);

  const handleAddProspectToSavedList = (prospect: Prospect, targetListName: string) => {
    // 1. Mark save in global leads list tracker
    setProspectsList(prev => prev.map(p => {
      if (p.company.name === prospect.company.name && p.contact.email === prospect.contact.email) {
        return { ...p, saved: true, savedListName: targetListName };
      }
      return p;
    }));

    // 2. Adjust target lists indicators
    setLeadLists(prev => prev.map(list => {
      if (list.name === targetListName) {
        return {
          ...list,
          prospectCount: list.prospectCount + 1,
          prospectIds: [...list.prospectIds, prospect.contact.email]
        };
      }
      return list;
    }));
    
    // Deduct credit
    setUserCredits(prev => Math.max(0, prev - 1));
  };

  const handleCreateNewListInApp = (name: string, description: string) => {
    const newList: LeadList = {
      id: `list-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      prospectCount: 0,
      prospectIds: [],
      createdAt: new Date().toISOString().split("T")[0]
    };
    setLeadLists(prev => [...prev, newList]);
    setListFormName("");
    setListFormDesc("");
    setToggleCreateListForm(false);
  };

  const handleToggleAutomationPlan = (id: string) => {
    setAutomations(prev => prev.map(flow => 
      flow.id === id ? { ...flow, active: !flow.active } : flow
    ));
  };

  const handleAddCustomAutomationPlan = (name: string, triggerLabel: string) => {
    const custom: WorkflowAutomation = {
      id: `flow-${Math.random().toString(36).substr(2, 9)}`,
      name,
      active: true,
      nodes: [
        { id: `n-${Math.random()}`, type: "trigger", label: triggerLabel, description: "Listens for standard trigger events", icon: "Zap" },
        { id: `n-${Math.random()}`, type: "action", label: "Analyze Target Profile & News", description: "Crawling for contact validation metrics", icon: "Sparkles" },
        { id: `n-${Math.random()}`, type: "action", label: "Push Segment to CRM Connection", description: "Immediate synchronization to leads tracker", icon: "Check" }
      ]
    };
    setAutomations(prev => [...prev, custom]);
  };

  const handleToggleCRMConnection = (id: string) => {
    setCrmConfig(prev => prev.map(crm => 
      crm.id === id ? { ...crm, connected: !crm.connected, lastSynced: new Date().toISOString().replace("T", " ").substr(0, 16) + " UTC" } : crm
    ));
  };

  // Callback to deduct credit when a mock push is finished in copy generator window
  const handleOutreachRefreshCount = () => {
    setUserCredits(prev => Math.max(0, prev - 3));
  };

  // Quick helper to redirect and populate copy generator
  const triggerOutreachRedirection = (leadName: string, companyName: string, notes: string) => {
    setOutreachContactHeader({ name: leadName, title: "Operations Executive", email: `ops@${companyName.toLowerCase().replace(/\s+/g, '')}.com` });
    setOutreachCompanyHeader({ name: companyName, description: notes });
    setOutreachTriggerNotes(notes);
    setActiveTab(WorkspaceTab.OUTREACH_GEN);
  };

  // Sidebar Tabs Helper
  const navItems = [
    { id: WorkspaceTab.DASHBOARD, label: "Interactive Dashboard", icon: LayoutDashboard },
    { id: WorkspaceTab.AI_SEARCH, label: "AI Prospect Search", icon: Search, badge: "GEMINI" },
    { id: WorkspaceTab.BUYER_SIGNALS, label: "Buyer Signals Center", icon: ShieldAlert, count: buyerSignals.length },
    { id: WorkspaceTab.LEAD_LISTS, label: "Curated Lead Lists", icon: Database },
    { id: WorkspaceTab.OUTREACH_GEN, label: "Outreach Generator", icon: Send },
    { id: WorkspaceTab.MEETING_PREP, label: "Meeting intelligence", icon: Calendar },
    { id: WorkspaceTab.RECRUITING, label: "Recruiting Talent Hub", icon: Briefcase },
    { id: WorkspaceTab.AUTOMATIONS, label: "Visual Automations", icon: Layers },
    { id: WorkspaceTab.CRM_INTEGRATIONS, label: "CRM Sync Manager", icon: Settings },
    { id: WorkspaceTab.ADMIN_PANEL, label: "Admin Systems Panel", icon: Users }
  ];

  const getMatchedProspectsInList = (listName: string) => {
    return prospectsList.filter(p => p.savedListName === listName);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans flex flex-col md:flex-row relative">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-900 bg-slate-950/80 flex flex-col justify-between shrink-0 z-40">
        <div className="flex flex-col h-full">
          {/* Workspace Title */}
          <div className="p-5 border-b border-slate-900 flex items-center justify-between">
            <span className="font-display font-black text-white text-base tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>VibeProspecting</span>
            </span>
            <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-500 font-mono px-2 py-0.5 rounded">
              v2.5
            </span>
          </div>

          {/* Current profile status indicator */}
          <div className="p-4 bg-slate-900/10 border-b border-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center text-indigo-400 text-xs font-bold border border-indigo-900/30 font-mono">
              {currentRole.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-white font-semibold text-xs block leading-tight">{currentRole}</span>
              <span className="text-[10px] text-slate-500 font-mono">
                {userCredits.toLocaleString()} credits active
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[60vh] md:max-h-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    // Reset selected outreach state to avoid stale buffers
                    if (item.id !== WorkspaceTab.OUTREACH_GEN) {
                      setOutreachContactHeader(undefined);
                      setOutreachCompanyHeader(undefined);
                      setOutreachTriggerNotes(undefined);
                    }
                    setActiveTab(item.id);
                  }}
                  className={`w-full py-2 px-3 rounded-lg text-left text-xs transition duration-100 flex items-center justify-between gap-2.5 cursor-pointer ${
                    isActive 
                      ? "bg-slate-900 text-white font-semibold border-l-2 border-indigo-500" 
                      : "text-slate-450 hover:text-white hover:bg-slate-900/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[8px] bg-indigo-950 text-indigo-400 border border-indigo-900 font-mono px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className="text-[9px] bg-amber-950 text-amber-500 font-mono px-1.5 py-0.5 rounded-md font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Exit back to homepage link */}
        <div className="p-4 border-t border-slate-905 flex items-center justify-between text-xs text-slate-600 font-mono bg-slate-950/50 mt-auto">
          <button 
            onClick={onExitWorkspace}
            className="hover:text-slate-300 transition text-[11px] flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Marketing Site</span>
          </button>
          <span>v2.5.1 dev</span>
        </div>
      </aside>

      {/* RIGHT MAIN CORE APPLICATION STAGE */}
      <main className="flex-1 min-w-0 p-4 md:p-8 space-y-6">
        
        {/* UPPER MAIN HEADERBAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-black text-white py-0.5 tracking-tight font-display">
              {activeTab}
            </h1>
            <p className="text-slate-500 text-xs font-mono lowercase">
              Prospecting Sandbox / {activeTab?.replace(/\s+/g, '-').toLowerCase()}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Pricing Upgrade Button */}
            {currentRole === UserRole.FREE_USER && (
              <button
                onClick={() => setActiveTab(WorkspaceTab.ADMIN_PANEL)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-[10px] rounded-lg tracking-widest uppercase transition active:scale-95 duration-100 flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Upgrade to Pro Plan</span>
              </button>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">CREDIT BALANCE:</span>
              <span className="font-extrabold text-white text-xs font-mono">
                {userCredits.toLocaleString()} /{" "}
                {currentRole === UserRole.FREE_USER ? "50" : "5,000"}
              </span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE WORKSPACE ROOT VIEWS routing */}
        <div className="space-y-6 animate-fadeIn content-stage">
          
          {/* ============= TAB 1: INTEGRATED CORE DASHBOARD ============= */}
          {activeTab === WorkspaceTab.DASHBOARD && (
            <div className="space-y-6">
              {/* Stats Block */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">My Saved Prospect Profiles</span>
                    <p className="text-3xl font-extrabold text-white mt-1 font-display">
                      {prospectsList.length} <span className="text-xs text-slate-500 font-mono font-medium">Verified Accounts</span>
                    </p>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-mono block mt-4">Synced across lists</span>
                </div>

                <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Listening Trigger channels</span>
                    <p className="text-3xl font-extrabold text-indigo-400 mt-1 font-display">
                      {automations.filter(f => f.active).length} / {automations.length}
                    </p>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono block mt-4">Continuous crawling online</span>
                </div>

                <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Connected CRMs</span>
                    <p className="text-3xl font-extrabold text-white mt-1 font-display">
                      {crmConfig.filter(c => c.connected).length}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block mt-4">Salesforce & HubSpot active</span>
                </div>

                <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Resource Utilized</span>
                    <p className="text-3xl font-extrabold text-emerald-400 mt-1 font-display">
                      {currentRole === UserRole.FREE_USER ? `${((50-userCredits)/50*100).toFixed(0)}%` : `${((5000-userCredits)/5000*100).toFixed(1)}%`}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block mt-4">Optimized API caching index</span>
                </div>
              </div>

              {/* Quick Actions and Intro */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8 bg-gradient-to-br from-indigo-950/10 via-slate-900/40 to-indigo-950/10 border border-indigo-950/40 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[250px]">
                  <div>
                    <span className="text-indigo-400 font-mono font-extrabold text-xs tracking-widest block uppercase mb-2">INTELLIGENT REVENUE STRATEGY</span>
                    <h2 className="text-white font-black font-display text-xl sm:text-2xl mb-3 leading-tight">
                      Ready to launch your conversational prospecting pipeline?
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
                      Simply type what triggers configure your ideal target accounts (e.g. "Series A logistics scaleups hiring engineering roles in the UK"). VibeProspecting will crawl matches, enrich operations leads, drafts your templates, and sync lists to CRM instantly.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-6 mt-auto">
                    <button
                      onClick={() => setActiveTab(WorkspaceTab.AI_SEARCH)}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Start AI Prospect Search</span>
                    </button>
                    <button
                      onClick={() => setActiveTab(WorkspaceTab.BUYER_SIGNALS)}
                      className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition hover:text-white cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      <span>Monitor Warm Buyer Signals</span>
                    </button>
                  </div>
                </div>

                {/* Live Activity Feed panel */}
                <div className="lg:col-span-4 bg-slate-900/10 border border-slate-880 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-850/50 mb-3">
                      Crawl Activity Updates
                    </h3>
                    
                    <div className="space-y-3">
                      {buyerSignals.slice(0, 3).map((sig, sidx) => (
                        <div key={sidx} className="flex gap-2.5 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                          <div className="text-[10px] font-mono leading-relaxed text-slate-450">
                            <strong>{sig.category}:</strong> {sig.description.slice(0, 80)}...
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab(WorkspaceTab.AUTOMATIONS)}
                    className="w-full text-indigo-400 hover:text-indigo-300 font-semibold text-xs font-mono text-center pt-4 border-t border-slate-850/40 block hover:underline cursor-pointer"
                  >
                    Configure Automations Rules &rarr;
                  </button>
                </div>
              </div>

              {/* Saved Lead segments preview */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-850/40">
                  Active Curated Lead Lists Segment
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {leadLists.map((list) => {
                    const savedLeads = getMatchedProspectsInList(list.name);
                    return (
                      <div key={list.id} className="bg-slate-900/30 border border-slate-800 p-5 rounded-xl hover:border-slate-750 transition flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-white font-bold font-mono text-sm">{list.name}</h4>
                            <span className="bg-indigo-950 text-indigo-400 border border-indigo-900/30 px-2 py-0.5 rounded text-[10px] font-mono">
                              {savedLeads.length} leads
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed min-h-[32px]">{list.description}</p>
                        </div>

                        <div className="pt-4 border-t border-slate-850/40 mt-4 flex justify-between items-center text-xs font-mono">
                          <span className="text-slate-550 text-[10px]">Created: {list.createdAt}</span>
                          <button
                            onClick={() => setActiveTab(WorkspaceTab.LEAD_LISTS)}
                            className="text-indigo-400 hover:underline"
                          >
                            Manage Prospects List
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}


          {/* ============= TAB 2: AI PROSPECT SEARCH ============= */}
          {activeTab === WorkspaceTab.AI_SEARCH && (
            <AISearchView 
              savedLists={leadLists} 
              onAddProspectToSavedList={handleAddProspectToSavedList} 
              onCreateNewList={handleCreateNewListInApp}
            />
          )}


          {/* ============= TAB 3: BUYER SIGNALS ============= */}
          {activeTab === WorkspaceTab.BUYER_SIGNALS && (
            <BuyerSignalsView 
              signals={buyerSignals} 
              onTriggerOutreachDraft={triggerOutreachRedirection}
            />
          )}


          {/* ============= TAB 4: CURATED LEAD LISTS (DATABASE LOOKUPS) ============= */}
          {activeTab === WorkspaceTab.LEAD_LISTS && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-500" />
                    <span>Active Curation Leads Repository</span>
                  </h2>
                  <p className="text-slate-400 text-xs">
                    Inspect gathered stakeholder profiles, write multi-channel scripts, download spreadsheets, and synchronize segments to CRMs.
                  </p>
                </div>

                <button
                  onClick={() => setToggleCreateListForm(!toggleCreateListForm)}
                  className="px-4 py-2 bg-indigo-950/60 border border-indigo-900 hover:bg-indigo-900 text-indigo-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Build New Segment</span>
                </button>
              </div>

              {/* Slide Custom List Maker Form */}
              {toggleCreateListForm && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (listFormName.trim()) {
                      handleCreateNewListInApp(listFormName, listFormDesc || "Custom structured sales sequence targeting.");
                    }
                  }}
                  className="bg-slate-90 p-4 bg-slate-900/40 border border-indigo-900/30 rounded-xl space-y-3 max-w-md animate-fadeIn"
                >
                  <strong className="text-xs font-bold font-mono text-slate-400 block uppercase">New Outbound Category Details</strong>
                  <div>
                    <input
                      type="text"
                      required
                      value={listFormName}
                      onChange={(e) => setListFormName(e.target.value)}
                      placeholder="e.g. Manchester Robotics Targets"
                      className="w-full bg-slate-950 border border-slate-800 p-2 text-xs text-white rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={listFormDesc}
                      onChange={(e) => setListFormDesc(e.target.value)}
                      placeholder="e.g. VP Operations and heads logistics of robotics firms"
                      className="w-full bg-slate-950 border border-slate-800 p-2 text-xs text-white rounded focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2 text-xs font-semibold">
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-500 cursor-pointer"
                    >
                      Construct List
                    </button>
                    <button
                      type="button"
                      onClick={() => setToggleCreateListForm(false)}
                      className="px-3 py-1.5 bg-slate-950 text-slate-400 rounded border border-slate-800 hover:bg-slate-900"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Mapping categories container grids */}
              <div className="space-y-8">
                {leadLists.map((list) => {
                  const savedProspects = getMatchedProspectsInList(list.name);
                  
                  return (
                    <div key={list.id} className="bg-slate-900/10 border border-slate-850 p-5 rounded-2xl space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-850/50 gap-4">
                        <div>
                          <h3 className="text-white font-bold text-base font-display flex items-center gap-2">
                            <span>{list.name}</span>
                            <span className="bg-indigo-950 text-indigo-400 border border-indigo-900/40 font-mono px-2 py-0.5 rounded text-[10px] font-medium leading-none">
                              {savedProspects.length} curated profiles
                            </span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{list.description}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              // Simulate spreadsheet copy
                              const csvHeaders = "Company,Website,Industry,Contact,Title,Email,Phone\n" + 
                                savedProspects.map(p => `"${p.company.name}","${p.company.website}","${p.company.industry}","${p.contact.name}","${p.contact.title}","${p.contact.email}","${p.contact.phone || ''}"`).join("\n");
                              navigator.clipboard.writeText(csvHeaders);
                              alert("Copied CSV representation to clipboard!");
                            }}
                            disabled={savedProspects.length === 0}
                            className="px-3 py-1.5 bg-slate-950 border border-slate-800 disabled:opacity-40 hover:bg-slate-900 text-slate-300 text-xs font-semibold rounded-lg font-mono transition cursor-pointer"
                          >
                            Export CSV List
                          </button>

                          {/* Delete entire list category */}
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove the list "${list.name}"? Curated prospects will remain globally accessible.`)) {
                                setLeadLists(prev => prev.filter(l => l.id !== list.id));
                              }
                            }}
                            className="p-1 px-2.5 text-slate-600 hover:text-rose-500 rounded-lg hover:bg-slate-950/40 transition cursor-pointer"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Curated list table */}
                      {savedProspects.length === 0 ? (
                        <div className="py-6 text-center text-xs font-mono text-slate-500 italic border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
                          Empty segment leads profile portfolio. Discover prospects via "AI Prospect Search" or triggers tracking alerts and save them here.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {savedProspects.map((lead, pIdx) => (
                            <div 
                              key={pIdx} 
                              className="bg-slate-950 border border-slate-900/70 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-800 transition"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <strong className="text-white text-sm">{lead.company.name}</strong>
                                  <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                                    {lead.company.industry}
                                  </span>
                                </div>
                                <div className="text-xs text-indigo-400 leading-relaxed font-mono">
                                  <strong>{lead.contact.name}</strong> &ndash; <span className="text-slate-450 text-[11px]">{lead.contact.title}</span>
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  Verified email: <span className="text-slate-400">{lead.contact.email}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0 text-xs font-mono pt-3 md:pt-0 border-t md:border-t-0 border-slate-850/50 w-full md:w-auto justify-between md:justify-start">
                                <div className="text-right">
                                  <span className="text-[9px] text-slate-600 uppercase block leading-none">Curation Score</span>
                                  <span className="text-xs font-bold text-emerald-400 leading-relaxed block">{lead.contactScore}%</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setSelectedProspectProfile(lead)}
                                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[11px] font-semibold text-slate-300 cursor-pointer"
                                  >
                                    View Intel
                                  </button>
                                  
                                  <button
                                    onClick={() => triggerOutreachRedirection(lead.contact.name, lead.company.name, lead.company.description)}
                                    className="px-2.5 py-1 bg-indigo-950/60 border border-indigo-900/40 text-indigo-400 rounded-lg hover:bg-indigo-900 hover:text-white transition cursor-pointer"
                                  >
                                    Draft Sequence
                                  </button>

                                  <button
                                    onClick={() => {
                                      // Remove prospect from list
                                      setProspectsList(prev => prev.map(p => {
                                        if (p.company.name === lead.company.name && p.contact.email === lead.contact.email) {
                                          return { ...p, saved: false, savedListName: undefined };
                                        }
                                        return p;
                                      }));
                                    }}
                                    className="p-1 text-slate-650 hover:text-rose-500"
                                    title="Unarchive"
                                  >
                                    <Trash className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {/* ============= TAB 5: OUTREACH COPY GENERATION ============= */}
          {activeTab === WorkspaceTab.OUTREACH_GEN && (
            <OutreachGenView 
              initialContact={outreachContactHeader} 
              initialCompany={outreachCompanyHeader}
              initialTriggerNotes={outreachTriggerNotes}
              onRefreshCrmCount={handleOutreachRefreshCount}
            />
          )}


          {/* ============= TAB 6: MEETING PREP INTELLIGENCE ============= */}
          {activeTab === WorkspaceTab.MEETING_PREP && (
            <MeetingPrepView />
          )}


          {/* ============= TAB 7: RECRUITING INTELLIGENCE ============= */}
          {activeTab === WorkspaceTab.RECRUITING && (
            <RecruitingIntelView />
          )}


          {/* ============= TAB 8: AUTOMATIONS BUILDER ============= */}
          {activeTab === WorkspaceTab.AUTOMATIONS && (
            <AutomationsBuilderView 
              automationPlans={automations} 
              onToggleActive={handleToggleAutomationPlan} 
              onAddCustomAutomation={handleAddCustomAutomationPlan}
            />
          )}


          {/* ============= TAB 9: CRM CONFIG CONNECTIONS ============= */}
          {activeTab === WorkspaceTab.CRM_INTEGRATIONS && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-400" />
                  <span>CRM Synchronization Integrations Hub</span>
                </h2>
                <p className="text-slate-400 text-xs">
                  Map curated target data properties, direct business emails and outreach schedules, and sync prospects seamlessly to designated CRM software instances.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {crmConfig.map((crm) => (
                  <div key={crm.id} className="bg-slate-900/30 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-bold text-white text-sm">{crm.name} CRM</h3>
                          <span className="text-[10px] text-slate-505 font-mono block mt-0.5">
                            Status: {crm.connected ? (
                              <strong className="text-emerald-400 font-extrabold font-mono uppercase tracking-wide">Connected</strong>
                            ) : (
                              <span className="text-slate-600 font-extrabold font-mono uppercase tracking-wide">Offline</span>
                            )}
                          </span>
                        </div>

                        <span className={`w-3 h-3 rounded-full shrink-0 border ${crm.connected ? "bg-emerald-500 border-emerald-900" : "bg-slate-700 border-slate-900"}`} />
                      </div>

                      <div className="space-y-1 text-xs text-slate-400 font-mono pb-4 border-b border-slate-850/50">
                        <p className="flex justify-between">
                          <span className="text-slate-550">Active Synced Lead Segment:</span> 
                          <span className="text-white font-semibold">{crm.connected ? `${syncedProspectCount} targets` : "None"}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-slate-550">Property mapping criteria:</span> 
                          <span className="text-indigo-400 font-semibold">{crm.mappedFieldsCount} fields active</span>
                        </p>
                        {crm.connected && (
                          <p className="flex justify-between">
                            <span className="text-slate-550 mr-4">Last Sync sequence logs:</span> 
                            <span className="text-slate-350 truncate">{crm.lastSynced}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 mt-auto">
                      <button
                        onClick={() => handleToggleCRMConnection(crm.id)}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition border cursor-pointer ${
                          crm.connected 
                            ? "bg-rose-950 border-rose-900 text-rose-300 hover:bg-rose-900" 
                            : "bg-indigo-950 border-indigo-900 text-indigo-300 hover:bg-indigo-900"
                        }`}
                      >
                        {crm.connected ? "Disconnect Enterprise Sandbox" : "Connect Private CRM Setup"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* ============= TAB 10: ADMIN PANEL SYSTEMS ============= */}
          {activeTab === WorkspaceTab.ADMIN_PANEL && (
            <AdminPanel 
              currentRole={currentRole} 
              onChangeRole={onChangeRole}
              crmIntegrations={crmConfig}
              onToggleCrm={handleToggleCRMConnection}
              syncedProspectCount={syncedProspectCount}
              userCredits={userCredits}
            />
          )}

        </div>
      </main>

      {/* VERIFIABLE PROSPECT INTEL OVERLAY MODAL CARDS */}
      {selectedProspectProfile && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-900 flex justify-between items-center">
              <div>
                <strong className="text-white text-sm font-display block">{selectedProspectProfile.company.name}</strong>
                <a href={`https://${selectedProspectProfile.company.website}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 font-mono hover:underline inline-flex items-center gap-0.5 mt-0.5">
                  {selectedProspectProfile.company.website} <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <button
                onClick={() => setSelectedProspectProfile(null)}
                className="p-1 text-slate-500 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-4 font-mono text-xs max-h-[75vh] overflow-y-auto">
              {/* Pitch */}
              <div>
                <span className="text-slate-600 block text-[9px] uppercase tracking-wider mb-0.5">Corporate Description & News</span>
                <p className="text-slate-350 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-905">
                  {selectedProspectProfile.company.description}
                </p>
              </div>

              {/* Company statistics matrix */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950 border border-slate-905 p-3 rounded-lg text-[11px] leading-relaxed">
                <p><span className="text-slate-600">ARR/Revenue:</span> <strong className="text-white">{selectedProspectProfile.company.revenue}</strong></p>
                <p><span className="text-slate-600">Funding State:</span> <strong className="text-white">{selectedProspectProfile.company.funding}</strong></p>
                <p><span className="text-slate-600">Company Size:</span> <strong className="text-white">{selectedProspectProfile.company.employeeCount} FTEs</strong></p>
                <p><span className="text-slate-600">Industry Sector:</span> <strong className="text-white">{selectedProspectProfile.company.industry}</strong></p>
              </div>

              {/* News and Hiring Trend */}
              <div className="space-y-2">
                {selectedProspectProfile.company.news && (
                  <div>
                    <span className="text-slate-600 block text-[9px] uppercase tracking-wider mb-0.5">Trigger Milestone news</span>
                    <p className="text-slate-400 bg-slate-950 p-2 border border-slate-905 rounded leading-relaxed text-[11px]">"{selectedProspectProfile.company.news}"</p>
                  </div>
                )}
                {selectedProspectProfile.company.hiringTrend && (
                  <div>
                    <span className="text-slate-600 block text-[9px] uppercase tracking-wider mb-0.5">Recent Hiring trends</span>
                    <p className="text-slate-400 bg-slate-950 p-2 border border-slate-905 rounded leading-relaxed text-[11px]">{selectedProspectProfile.company.hiringTrend}</p>
                  </div>
                )}
              </div>

              {/* Technologies */}
              {selectedProspectProfile.company.technologies && (
                <div>
                  <span className="text-slate-600 block text-[9px] uppercase tracking-wider mb-1.5">Enterprise Technologies Mapped</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedProspectProfile.company.technologies.map((t, idx) => (
                      <span key={idx} className="bg-slate-950 border border-slate-905 text-slate-500 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-900 flex justify-end gap-2.5">
              <button
                onClick={() => setSelectedProspectProfile(null)}
                className="px-4 py-2 bg-slate-900 text-slate-400 rounded-xl text-xs hover:bg-slate-850"
              >
                Close Intel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
