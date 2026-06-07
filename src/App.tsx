import React, { useState } from "react";
import { UserRole, WorkspaceTab, Prospect, LeadList, WorkflowAutomation, CRMConfig, BuyerSignal } from "./types";
import { MarketingSite } from "./components/MarketingSite";
import { SaaSApp } from "./components/SaaSApp";
import { 
  RECOLLECTED_BUILT_IN_LEADS as SAMPLE_PROSPECTS,
  INITIAL_LEAD_LISTS as SAMPLE_LISTS,
  INITIAL_AUTOMATIONS as WORKFLOW_AUTOMATIONS,
  DEFAULTS_INTEGRATIONS_CONFIG as CRM_CONFIGS,
  INITIAL_SIGNALS as BUYER_SIGNALS 
} from "./mockData";

export default function App() {
  const [showApp, setShowApp] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.PRO_USER);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(WorkspaceTab.DASHBOARD);

  // Synchronized global states representing current database representations
  const [prospectsList, setProspectsList] = useState<Prospect[]>(SAMPLE_PROSPECTS);
  const [leadLists, setLeadLists] = useState<LeadList[]>(SAMPLE_LISTS);
  const [automations, setAutomations] = useState<WorkflowAutomation[]>(WORKFLOW_AUTOMATIONS);
  const [crmConfig, setCrmConfig] = useState<CRMConfig[]>(CRM_CONFIGS);
  
  // Custom states
  const [userCredits, setUserCredits] = useState<number>(3420);

  // Calculations for total CRM synchronized profiles
  const totalSyncedCRMCount = prospectsList.filter(p => p.saved).length;

  const handleStartApp = (initialRole?: string) => {
    if (initialRole) {
      setCurrentRole(initialRole as UserRole);
    }
    // Boost/adjust initial credits based on starting role
    if (initialRole === "Free User") {
      setUserCredits(32);
    } else {
      setUserCredits(4240);
    }
    setActiveTab(WorkspaceTab.DASHBOARD);
    setShowApp(true);
  };

  const handleExitApp = () => {
    setShowApp(false);
  };

  const handleNavigateMarketingTab = (tab: string) => {
    if (tab === "Playbooks") {
      // Direct jump inside CRM / documentation/ playbooks screens inside workspace
      setCurrentRole(UserRole.PRO_USER);
      setActiveTab(WorkspaceTab.RECRUITING);
      setShowApp(true);
    }
  };

  return (
    <div className="relative">
      
      {/* Dynamic Header Simulator overlay so user can easily toggle back-and-forth under preview */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-900 border border-indigo-500/30 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl transition duration-150 animate-bounce cursor-pointer">
        <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
        <span className="text-[11px] font-mono font-bold text-slate-300">
          Status: {showApp ? "SaaS Application Sandbox" : "SaaS Marketing Site"}
        </span>
        <button
          onClick={() => {
            if (showApp) {
              handleExitApp();
            } else {
              handleStartApp("Pro User");
            }
          }}
          className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl font-semibold font-sans ml-1 transition"
        >
          {showApp ? "View Landing Page" : "Launch App Sandbox"}
        </button>
      </div>

      {!showApp ? (
        <MarketingSite 
          onStartApp={handleStartApp} 
          onNavigateTab={handleNavigateMarketingTab} 
        />
      ) : (
        <SaaSApp
          currentRole={currentRole}
          onChangeRole={setCurrentRole}
          onExitWorkspace={handleExitApp}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          prospectsList={prospectsList}
          setProspectsList={setProspectsList}
          leadLists={leadLists}
          setLeadLists={setLeadLists}
          buyerSignals={BUYER_SIGNALS}
          automations={automations}
          setAutomations={setAutomations}
          crmConfig={crmConfig}
          setCrmConfig={setCrmConfig}
          userCredits={userCredits}
          setUserCredits={setUserCredits}
        />
      )}
    </div>
  );
}
