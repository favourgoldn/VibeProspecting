import React, { useState } from "react";
import { 
  Sparkles, Search, ShieldAlert, Send, CheckCircle, ArrowRight, BarChart3, 
  Target, Zap, Briefcase, RefreshCw, Layers, Sliders, Users, DollarSign,
  Play, Check, Heart, HelpCircle, FileText, Code2, Lock, ShieldCheck, Mail
} from "lucide-react";
import { PRICING_PLANS, BLOG_POSTS } from "../mockData";

interface MarketingSiteProps {
  onStartApp: (initialRole?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export function MarketingSite({ onStartApp, onNavigateTab }: MarketingSiteProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");
  
  // ROI Calculator State
  const [teamSize, setTeamSize] = useState<number>(5);
  const [leadsGenerated, setLeadsGenerated] = useState<number>(300);
  const [conversionRate, setConversionRate] = useState<number>(2.5); // representing percentage

  // ROI Calculations
  const hoursSavedPerLead = 1.5; // finding, enriching, drafting
  const hoursSavedMonthly = Math.round(leadsGenerated * hoursSavedPerLead);
  const costOfStaffPerHour = 45; // average USD payroll/opportunity cost
  const staffTimeCostSaved = hoursSavedMonthly * costOfStaffPerHour;
  
  // Pipeline math
  const closedDeals = Math.round((leadsGenerated * (conversionRate / 100)));
  const avgDealSize = 12000;
  const potentialNewPipeline = closedDeals * avgDealSize;

  // Search Sandbox Interactive Input
  const [sandboxQuery, setSandboxQuery] = useState("");
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any | null>(null);

  const sandboxExamples = [
    "Operations directors in UK manufacturing companies expanding warehouses",
    "Recruiters looking for Senior DevOps leads in London with generative AI experience",
    "Security officers at Series B scaleups using AWS and PostgreSQL"
  ];

  const handleSandboxSearch = async (queryText: string) => {
    const activeQuery = queryText || sandboxQuery;
    if (!activeQuery) return;
    setSandboxQuery(activeQuery);
    setSandboxLoading(true);
    setSandboxResult(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: activeQuery }),
      });
      const data = await response.json();
      setSandboxResult(data.prospects || []);
    } catch (e) {
      console.error(e);
    } finally {
      setSandboxLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
      {/* Upper gradient backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-indigo-950/40 via-blue-950/20 to-transparent pointer-events-none" />

      {/* Hero section */}
      <header className="relative pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto z-10">
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/80 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-medium mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prospecting Reimagined for the AI Era</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-white mb-6 leading-[1.1]">
            Find the Right Prospects. <br />
            <span className="grad-text">Just by Asking.</span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Like vibe coding transformed software engineering, <strong className="text-indigo-300 font-semibold">VibeProspecting</strong> transforms sales by letting you discover, enrich, prioritize, and engage ideal prospects using simple natural language.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => onStartApp("Pro User")}
              className="w-full sm:w-auto px-8 py-4 grad-active hover:opacity-90 active:scale-95 text-white font-medium rounded-xl transition duration-150 flex items-center justify-center gap-2 text-base shadow-xl shadow-indigo-950/50 cursor-pointer"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("demo-sandbox");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-xl text-slate-300 font-medium transition duration-150 flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-indigo-400" />
              See Product Demo
            </button>
          </div>
        </div>

        {/* Hero Interactive AI Assistant Demo Box */}
        <div id="demo-sandbox" className="max-w-5xl mx-auto glass-effect rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl relative">
          <div className="border-b border-slate-800 bg-slate-900/60 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-500 font-mono ml-2">VibeProspecting Match Sandbox v2.5</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-950 text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded-full font-mono">
                GEMINI POWERED
              </span>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Try a Live Natural Language Search below</h3>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={sandboxQuery}
                  onChange={(e) => setSandboxQuery(e.target.value)}
                  placeholder="e.g., Operations directors in UK warehouse expansion logistics..."
                  className="w-full bg-slate-950 border border-slate-800/80 focus:border-indigo-500 rounded-xl py-3.5 pl-12 pr-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 text-sm font-mono"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSandboxSearch(sandboxQuery);
                  }}
                />
              </div>
              <button
                onClick={() => handleSandboxSearch(sandboxQuery)}
                disabled={sandboxLoading}
                className="px-6 py-3.5 grad-active rounded-xl text-white font-medium hover:opacity-95 transition disabled:opacity-50 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {sandboxLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Crawling Intent...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Discover Prospects</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="mb-6 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-500 font-mono">Suggested filters:</span>
              {sandboxExamples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => handleSandboxSearch(ex)}
                  className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg transition font-mono max-w-full truncate text-left cursor-pointer"
                >
                  {ex}
                </button>
              ))}
            </div>

            {/* Results Output */}
            {sandboxLoading && (
              <div className="py-20 flex flex-col justify-center items-center text-slate-400 gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-indigo-950 border-t-indigo-500 animate-spin" />
                  <Sparkles className="w-5 h-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center font-mono text-xs">
                  <p className="text-indigo-300 font-semibold mb-1 animate-pulse">Running AI Prospecting Engine...</p>
                  <p className="text-slate-600">Simulating B2B crawler mapping buying triggers & matching scores</p>
                </div>
              </div>
            )}

            {!sandboxLoading && sandboxResult && (
              <div className="border border-indigo-950/50 bg-indigo-950/10 rounded-xl p-4 md:p-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/50">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">Matching Accounts Found</span>
                  <span className="text-xs text-slate-500">Live API response</span>
                </div>

                <div className="space-y-4">
                  {sandboxResult.map((lead: any, i: number) => (
                    <div key={i} className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        {/* Company & Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <h4 className="text-white font-semibold text-base">{lead.company?.name}</h4>
                          <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                            {lead.company?.industry}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-2 font-mono">{lead.company?.description}</p>
                        
                        {/* Contact details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500">
                          <div>
                            <span className="text-slate-600 font-mono">Contact:</span>{" "}
                            <strong className="text-indigo-300 font-medium">{lead.contact?.name}</strong>{" "}
                            <span>({lead.contact?.title})</span>
                          </div>
                          <div>
                            <span className="text-slate-600 font-mono">Email:</span>{" "}
                            <span className="font-mono text-slate-400">{lead.contact?.email}</span>
                          </div>
                        </div>

                        {/* why match */}
                        <div className="mt-2.5 pt-2 border-t border-slate-900/50 text-[11px] text-slate-400 italic">
                          <span className="text-indigo-400 font-semibold font-mono not-italic mr-1">AI Match Criteria:</span>
                          "{lead.matchedWhy}"
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col justify-between md:justify-center items-end border-t md:border-t-0 md:border-l border-slate-900 pt-3 md:pt-0 md:pl-4 min-w-[120px] gap-2">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Contact fit</span>
                          <span className="text-xs font-mono font-bold text-emerald-400">{lead.contactScore}%</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Intent Score</span>
                          <span className="text-xs font-mono font-bold text-cyan-400">{lead.intentScore}%</span>
                        </div>
                        <button
                          onClick={() => onStartApp("Pro User")}
                          className="px-2.5 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 hover:border-indigo-500/30 rounded-lg transition"
                        >
                          Unlock Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-400">Want to run campaigns, enrich phones, and sync this directly to HubSpot?</span>
                  <button
                    onClick={() => onStartApp("Pro User")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
                  >
                    Enter Workspace
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {!sandboxResult && !sandboxLoading && (
              <div className="border border-slate-900 bg-slate-950/20 rounded-xl p-8 text-center text-slate-500 font-mono text-xs">
                Enter your prospecting criteria and watch our AI agents construct your ideal targets.
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Social proof section */}
      <section className="border-y border-slate-900 py-12 bg-slate-950/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-slate-600 uppercase text-xs tracking-widest font-semibold font-mono mb-6">
            Empowering Modern Outbound and Revenue Teams At Scale
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-45 grayscale hover:grayscale-0 hover:opacity-75 transition duration-300">
            <span className="text-lg font-bold font-mono tracking-tighter text-slate-400">APOLLO.io Match</span>
            <span className="text-lg font-bold font-mono tracking-tighter text-slate-400">HUBSPOT partner</span>
            <span className="text-lg font-bold font-mono tracking-tighter text-slate-400">RECRUIT.ai</span>
            <span className="text-lg font-bold font-mono tracking-tighter text-slate-400">LEMLIST sync</span>
            <span className="text-lg font-bold font-mono tracking-tighter text-slate-400">NOTION integrate</span>
          </div>

          {/* Testimonial preview */}
          <div className="max-w-3xl mx-auto mt-10 p-6 glass-effect rounded-2xl border border-slate-900/50">
            <p className="text-slate-300 italic text-sm md:text-base mb-4 leading-relaxed">
              "We used VibeProspecting to search specifically for 'UK-registered logistic hubs expanding their regional warehouses.' It identified 15 high-intent operational managers in seconds. By using the outreach generator, we booked 4 meetings in our first week!"
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="w-9 h-9 rounded-full bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-400">
                TM
              </span>
              <div className="text-left">
                <h5 className="text-xs font-semibold text-white">Thomas Miller</h5>
                <p className="text-[10px] text-slate-500 font-mono">Head of Outbound, LogiTech Freight Agencies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Measure the Outbound Advantage
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-normal">
            Adjust the metrics below to estimate your revenue pipelines and time saved shifting from static list purchasing to real-time intent prospecting.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Inputs */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Configure Your Team Scale & Yield</span>
              </h3>

              {/* Input 1 */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400">Outbound Sales Seats (FTE)</span>
                  <span className="text-indigo-400 font-bold">{teamSize} reps</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              {/* Input 2 */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400">Leads Handled Monthly</span>
                  <span className="text-indigo-400 font-bold">{leadsGenerated} accounts</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={leadsGenerated}
                  onChange={(e) => setLeadsGenerated(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              {/* Input 3 */}
              <div className="mb-2">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400">Conversion Rate Expected</span>
                  <span className="text-indigo-400 font-bold">{conversionRate}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="15"
                  step="0.5"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-slate-500">
              <HelpCircle className="w-4 h-4 text-slate-600 shrink-0" />
              <p>Assumption based on average B2B deal size of $12,000.</p>
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-7 col-span-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stat Box 1 */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-indigo-950 rounded-xl flex items-center justify-center text-indigo-400 mb-4 border border-indigo-900/30">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-slate-400 block uppercase tracking-wider">Hours Liberated Monthly</span>
                <p className="text-4xl font-extrabold text-white mt-1 font-display">{hoursSavedMonthly} hrs</p>
              </div>
              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                By accelerating profile search, contact enrichment, and draft personalization with AI.
              </p>
            </div>

            {/* Stat Box 2 */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950/20 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-emerald-950 rounded-xl flex items-center justify-center text-emerald-400 mb-4 border border-emerald-900/30">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-slate-400 block uppercase tracking-wider">Estimated Outbound Savings</span>
                <p className="text-4xl font-extrabold text-emerald-400 mt-1 font-display">${staffTimeCostSaved.toLocaleString()}</p>
              </div>
              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                Represents equivalent company workforce time value redirectable to closed meetings.
              </p>
            </div>

            {/* Stat Box 3 (Wide) */}
            <div className="sm:col-span-2 bg-gradient-to-r from-slate-900 via-indigo-950/10 to-slate-900 border border-indigo-900/30 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono text-indigo-300 block uppercase tracking-wider">Estimated Closed Opportunity Pipeline</span>
                <h4 className="text-4xl font-black text-indigo-200 mt-1 font-display">
                  +${potentialNewPipeline.toLocaleString()}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Predicted new pipeline generated based on {closedDeals} closed deals at ${avgDealSize.toLocaleString()} ARR.
                </p>
              </div>
              <button
                onClick={() => onStartApp("Pro User")}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer shrink-0"
              >
                Capture Pipeline Now &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl text-white mb-4">
              The Five Steps of Conversational Outbound
            </h2>
            <p className="text-slate-400 text-sm">
              How the VibeProspecting matching and engagement ecosystem finds high-fit prospects and automates outreach in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-slate-900/30 border border-slate-900 p-5 rounded-xl">
              <span className="text-xs font-semibold text-indigo-400 font-mono">STEP 1</span>
              <h4 className="text-semibold text-white mt-1.5 mb-1 text-sm">Describe Ideal Prospect</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Use flat natural-language to describe targets, filters, funding states, or warehouse expansions.
              </p>
            </div>
            <div className="bg-slate-900/30 border border-slate-900 p-5 rounded-xl">
              <span className="text-xs font-semibold text-indigo-400 font-mono">STEP 2</span>
              <h4 className="text-semibold text-white mt-1.5 mb-1 text-sm">AI Finds Matches</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Matching agents crawling target profiles evaluate lead and intent scores in real-time.
              </p>
            </div>
            <div className="bg-slate-900/30 border border-slate-900 p-5 rounded-xl">
              <span className="text-xs font-semibold text-indigo-400 font-mono">STEP 3</span>
              <h4 className="text-semibold text-white mt-1.5 mb-1 text-sm">Enrich Contacts</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Locate accurate, verified direct business emails, operational phones, and social URLs instantly.
              </p>
            </div>
            <div className="bg-slate-900/30 border border-slate-900 p-5 rounded-xl">
              <span className="text-xs font-semibold text-indigo-400 font-mono">STEP 4</span>
              <h4 className="text-semibold text-white mt-1.5 mb-1 text-sm">Generate Outreach</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Generate highly convincing multi-channel sequences suited specifically to the target's recent milestones.
              </p>
            </div>
            <div className="bg-slate-900/30 border border-slate-900 p-5 rounded-xl">
              <span className="text-xs font-semibold text-indigo-400 font-mono">STEP 5</span>
              <h4 className="text-semibold text-white mt-1.5 mb-1 text-sm">Sync to CRM</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Export lead segments safely directly into HubSpot, Salesforce, Pipedrive, or Monday.com in high-quality format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blogs & Playbooks Showcase */}
      <section className="py-25 max-w-7xl mx-auto px-4 md:px-8 border-t border-slate-900">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
          <div>
            <span className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest block mb-1">RESOURCES & GUIDES</span>
            <h2 className="font-display font-extrabold text-3xl text-white">Prospecting Academy & Insights</h2>
          </div>
          <button 
            onClick={() => onNavigateTab("Playbooks")} 
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer mt-4 sm:mt-0"
          >
            Check All Playbooks
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <div key={post.id} className="bg-slate-900/20 border border-slate-800/60 p-6 rounded-xl hover:border-slate-700/80 transition flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-900/30">
                  {post.category}
                </span>
                <h4 className="font-semibold text-white mt-4 mb-2 text-base leading-snug">
                  {post.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-3 mb-6">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-4 border-t border-slate-900">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing panel */}
      <section className="py-20 border-t border-slate-900 relative z-10 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest">TRANSPARENT PLANS</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-1 mb-4">
              Designed For High-Velocity Sales Teams
            </h2>
            <p className="text-slate-400 text-sm">
              Whether you are a bootstrapped founder setting up your early outbound rails, or and enterprise scale revenue operations department, we have a plan suited for you.
            </p>

            {/* Toggle monthly/annual */}
            <div className="inline-flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl mt-6">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${billingPeriod === "monthly" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
              >
                Monthly billing
              </button>
              <button
                onClick={() => setBillingPeriod("annually")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${billingPeriod === "annually" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
              >
                Annually (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch max-w-full text-left">
            {PRICING_PLANS.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border flex flex-col justify-between p-6 transition ${
                  plan.popular
                    ? "bg-slate-900/60 border-indigo-500/80 relative shadow-xl shadow-indigo-950/20"
                    : "bg-slate-900/30 border-slate-800/80"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2">{plan.name}</h4>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-3xl font-extrabold text-white font-display">
                      {billingPeriod === "monthly" ? plan.priceMonthly : plan.priceAnnually}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">/ {billingPeriod === "monthly" ? "month" : "year"}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 block mb-4 font-mono">
                    Includes {plan.credits}
                  </span>

                  <hr className="border-slate-850/80 mb-4" />

                  <ul className="space-y-2.5 text-xs text-slate-400 mb-6">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800/30 mt-auto">
                  <button
                    onClick={() => onStartApp(plan.name === "Free Trial" ? "Free User" : "Pro User")}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition active:scale-95 duration-100 cursor-pointer ${
                      plan.popular
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                        : "bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300"
                    }`}
                  >
                    {plan.cta}
                  </button>
                  {plan.limitBadge && (
                    <span className="text-[10px] text-slate-500 text-center block mt-2 font-mono italic">
                      ({plan.limitBadge})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate final cta */}
      <section className="py-24 max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10">
        <div className="bg-gradient-to-br from-indigo-950/20 via-slate-900 to-slate-950 border border-indigo-900/30 rounded-3xl p-10 md:p-16 relative overflow-hidden">
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4 relative z-10 leading-[1.1]">
            Ready to Accelerate Your <br />
            Pipeline Yield?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8 relative z-10 leading-relaxed">
            Ditch outdated static scrapers and transition into conversational intelligence. Setup in minutes and watch your reps close more meetings.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 relative z-10">
            <button
              onClick={() => onStartApp("Pro User")}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition cursor-pointer"
            >
              Configure Outbound For Free
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("demo-sandbox");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Try Search Sandbox
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 text-slate-500 text-xs font-mono bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-4 gap-8">
          <div>
            <span className="text-white font-display font-extrabold tracking-tight text-base flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>VibeProspecting</span>
            </span>
            <p className="text-slate-600 leading-relaxed mb-4 text-[11px]">
              Prospecting reimagined. Identify highly qualified target intelligence, enrich pipelines, and customize outbound sequences entirely using natural speech.
            </p>
            <span>&copy; 2026 VibeProspecting Inc. All rights reserved.</span>
          </div>

          <div>
            <h5 className="text-slate-300 font-bold mb-3 uppercase tracking-wider text-[11px]">Solutions</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onStartApp("Pro User")} className="hover:text-slate-300 transition text-left cursor-pointer">For Agencies</button></li>
              <li><button onClick={() => onStartApp("Pro User")} className="hover:text-slate-300 transition text-left cursor-pointer">For SDR Teams</button></li>
              <li><button onClick={() => onStartApp("Team Admin")} className="hover:text-slate-300 transition text-left cursor-pointer">For Sales Leaders</button></li>
              <li><button onClick={() => onStartApp("Org Owner")} className="hover:text-slate-300 transition text-left cursor-pointer">For Revenue Operations</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-slate-300 font-bold mb-3 uppercase tracking-wider text-[11px]">Resources</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onNavigateTab("Playbooks")} className="hover:text-slate-300 transition text-left cursor-pointer">Prospecting Academy</button></li>
              <li><button onClick={() => onNavigateTab("Playbooks")} className="hover:text-slate-300 transition text-left cursor-pointer">Guides & Playbooks</button></li>
              <li><button onClick={() => onStartApp("Super Admin")} className="hover:text-slate-300 transition text-left cursor-pointer">API Platform Docs</button></li>
              <li><button onClick={() => onStartApp("Pro User")} className="hover:text-slate-300 transition text-left cursor-pointer">Case Studies</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-slate-300 font-bold mb-3 uppercase tracking-wider text-[11px]">Compliance & Trust</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>GDPR & CCPA Compliant</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>SOC2 Type II Certified</span>
              </li>
              <li><span className="text-slate-600 text-[10px]">Security Infrastructure hosted securely at AWS and backed by Google AI Studio full sandboxing.</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
