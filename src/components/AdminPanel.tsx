import React, { useState } from "react";
import { 
  Users, DollarSign, HelpCircle, FileText, Lock, ShieldCheck, Mail, CheckCircle, 
  Trash, ChevronRight, PhoneCall, ExternalLink, RefreshCw, Sparkles, AlertTriangle,
  Play, Settings, Key, Building2, Sliders, Database, CreditCard
} from "lucide-react";
import { UserRole, SupportTicket, AuditLog, CRMConfig } from "../types";
import { TICKETS, AUDIT_RECORDS } from "../mockData";

interface AdminPanelProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  crmIntegrations: CRMConfig[];
  onToggleCrm: (id: string) => void;
  syncedProspectCount: number;
  userCredits: number;
}

export function AdminPanel({
  currentRole,
  onChangeRole,
  crmIntegrations,
  onToggleCrm,
  syncedProspectCount,
  userCredits
}: AdminPanelProps) {
  // Billing modal simulation
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [selectedPlanUpgradeName, setSelectedPlanUpgradeName] = useState("");
  const [billingProcessStatus, setBillingProcessStatus] = useState("");

  // Support Tickets State
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(TICKETS);
  const [newTicketUser, setNewTicketUser] = useState("");
  const [newTicketSubject, setNewTicketSubject] = useState("");

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketUser.trim() || !newTicketSubject.trim()) return;

    const added: SupportTicket = {
      id: `t-${Math.floor(Math.random() * 900) + 200}`,
      user: newTicketUser.trim(),
      subject: newTicketSubject.trim(),
      status: "Open",
      priority: "Medium",
      createdAt: new Date().toISOString().split("T")[0]
    };

    setSupportTickets([added, ...supportTickets]);
    setNewTicketUser("");
    setNewTicketSubject("");
  };

  const handleResolveTicket = (id: string) => {
    setSupportTickets(supportTickets.map(t => t.id === id ? { ...t, status: "Resolved" } : t));
  };


  const triggerCheckout = (planName: string) => {
    setSelectedPlanUpgradeName(planName);
    setShowBillingModal(true);
    setBillingProcessStatus("init");
  };

  const handlePaymentSubmit = async () => {
    setBillingProcessStatus("submitting");
    await new Promise((r) => setTimeout(r, 1200));
    setBillingProcessStatus("verifying");
    await new Promise((r) => setTimeout(r, 800));
    setBillingProcessStatus("done");
    setTimeout(() => {
      setShowBillingModal(false);
      onChangeRole(UserRole.PRO_USER);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Simulation Playground Controls */}
      <div className="bg-gradient-to-br from-indigo-950/20 to-slate-900 border border-indigo-900/40 p-5 rounded-2xl relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-850/50">
          <div>
            <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Interactive User Role Simulator</span>
            </h2>
            <p className="text-slate-400 text-xs">
              VibeProspecting gates access based on SOC2 certified privileges. Switch identities below to evaluate each tier's features.
            </p>
          </div>
          <span className="text-[10px] bg-slate-950 text-indigo-300 font-mono border border-slate-800 px-2.5 py-0.5 rounded-full font-semibold">
            TEST ENVIRONMENT ACTIVE
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {Object.values(UserRole).map((role) => (
            <button
              key={role}
              onClick={() => onChangeRole(role)}
              className={`px-3 py-2 rounded-xl transition font-mono border flex items-center gap-1.5 cursor-pointer ${
                currentRole === role
                  ? "bg-indigo-600 border-indigo-500 text-white font-bold"
                  : "bg-slate-950 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>{role}</span>
              {currentRole === role && <CheckCircle className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Core Billing and CRM sync Status Overview column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Credit meter and synced CRM counts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">My Account Resource Meter</span>
                <p className="text-2xl font-extrabold text-white mt-1 font-display">
                  {userCredits.toLocaleString()} /{" "}
                  {currentRole === UserRole.FREE_USER ? "50" : "5,000"}{" "}
                  <span className="text-xs text-slate-500 font-mono font-medium">Credits remaining</span>
                </p>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-3 border border-slate-900">
                  <div 
                    className="grad-active h-full rounded-full transition-all" 
                    style={{ width: `${currentRole === UserRole.FREE_USER ? (userCredits / 50) * 100 : (userCredits / 5000) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-550 pt-4 mt-4 border-t border-slate-850/50">
                <span>Auto-rolls next billing interval</span>
                <button 
                  onClick={() => triggerCheckout("Professional Account Upgrade")}
                  className="text-indigo-400 hover:underline font-bold"
                >
                  Buy more credits &rarr;
                </button>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono font-bold">CRM Connection Outbound Pipeline</span>
                <p className="text-2xl font-extrabold text-indigo-400 mt-1 font-display">
                  {syncedProspectCount} <span className="text-xs text-slate-500 font-mono font-medium">Prospect Profiles Active</span>
                </p>
                <div className="flex gap-1.5 items-center mt-3.5">
                  {crmIntegrations.filter(c => c.connected).map(c => (
                    <span key={c.id} className="text-[10px] bg-slate-950 border border-slate-800 text-indigo-200 px-2 py-0.5 rounded font-mono">
                      {c.name} (LIVE)
                    </span>
                  ))}
                  {crmIntegrations.filter(c => c.connected).length === 0 && (
                    <span className="text-[10px] text-slate-500 font-mono">No CRM actively synchronized</span>
                  )}
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-550 pt-3.5 border-t border-slate-850/50 block">
                Fields mapped: {crmIntegrations.filter(c => c.connected).reduce((acc, current) => acc + current.mappedFieldsCount, 0)} criteria syncing.
              </div>
            </div>
          </div>

          {/* CRM Integrations config panel block */}
          <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-850/50">
              Third-Party CRM Connections Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {crmIntegrations.map((crm) => (
                <div key={crm.id} className="bg-slate-950 p-4 border border-slate-900/80 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-white text-xs">{crm.name}</strong>
                      <span className={`w-2 h-2 rounded-full ${crm.connected ? "bg-emerald-500" : "bg-slate-700"}`} />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block leading-tight">
                      {crm.connected ? `Last synced: ${crm.lastSynced}` : "Offline"}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleCrm(crm.id)}
                    className={`px-3 py-1 text-[10px] font-mono rounded-lg transition border cursor-pointer ${
                      crm.connected 
                        ? "bg-rose-950 border-rose-900 text-rose-400 hover:bg-rose-900/50" 
                        : "bg-indigo-950 border-indigo-900 text-indigo-400 hover:bg-indigo-900/50"
                    }`}
                  >
                    {crm.connected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Auditing and Database schema mapping details */}
          <div className="bg-slate-904 p-5 bg-slate-900/30 border border-slate-800 rounded-2xl">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-850/50 mb-4 flex items-center justify-between">
              <span>GDPR System Audit Trails Logs</span>
              <span className="text-[10px] text-slate-600 lowercase font-normal italic">Updated in real-time</span>
            </h3>

            <div className="space-y-2 border border-slate-850 bg-slate-950 rounded-xl p-3 max-h-[180px] overflow-y-auto">
              {AUDIT_RECORDS.map((log) => (
                <div key={log.id} className="grid grid-cols-12 gap-2 text-[10px] font-mono py-1.5 border-b border-slate-900 last:border-b-0 items-center">
                  <span className="col-span-3 text-slate-600">{log.timestamp}</span>
                  <span className="col-span-3 font-semibold text-slate-400 truncate">{log.actor}</span>
                  <span className="col-span-4 text-slate-300 truncate">{log.action}</span>
                  <span className="col-span-2 text-right">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] ${log.status === "Success" ? "bg-emerald-950/60 text-emerald-400" : "bg-amber-950/60 text-amber-500"}`}>
                      {log.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Support Assistance tickets manager */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-850/50 mb-4 flex items-center justify-between">
                <span>Workspace Tickets Helper</span>
                <span className="bg-indigo-950 text-indigo-400 border border-indigo-900/30 px-1.5 py-0.5 rounded font-mono text-[9px]">
                  Priority Support
                </span>
              </h3>

              {/* Tickets list */}
              <div className="space-y-3 mb-6">
                {supportTickets.map((tc) => (
                  <div key={tc.id} className="bg-slate-950 p-3 rounded-lg border border-slate-900 text-xs">
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <strong className="text-white text-[11px] truncate">{tc.subject}</strong>
                      <span className={`px-1 rounded text-[9px] uppercase font-mono ${tc.status === "Resolved" ? "bg-slate-900 text-slate-500" : "bg-indigo-950 text-indigo-400 animate-pulse"}`}>
                        {tc.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>{tc.user}</span>
                      {tc.status !== "Resolved" && (
                        <button
                          onClick={() => handleResolveTicket(tc.id)}
                          className="text-indigo-400 hover:underline uppercase text-[9px] tracking-wider"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* New Ticket Form */}
              <form onSubmit={handleCreateTicket} className="space-y-3.5 pt-4 border-t border-slate-850/50">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Submit support assistance ticket</span>
                
                <div>
                  <input
                    type="email"
                    required
                    value={newTicketUser}
                    onChange={(e) => setNewTicketUser(e.target.value)}
                    placeholder="E.g. user@domain.com"
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    placeholder="E.g. API access limits validation"
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition"
                >
                  Post Help Desk Ticket
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* STRIPE UPGRADE PAYMENT MODAL PREVIEW */}
      {showBillingModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative">
            <h3 className="text-white font-bold text-base mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              <span>Stripe Checkout Simulation Portal</span>
            </h3>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed font-mono">
              Securely upgrading to <strong className="text-white">{selectedPlanUpgradeName}</strong>. This provides immediate access to unlimited natural-language crawl indices and full enrichments.
            </p>

            {billingProcessStatus === "init" && (
              <div className="space-y-4 mb-6 text-xs">
                <div>
                  <label className="text-slate-500 text-[10px] uppercase font-mono block mb-1">Simulated Credit Card Number</label>
                  <input
                    type="text"
                    disabled
                    value="4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 p-2.5 rounded-lg font-mono focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 text-[10px] uppercase font-mono block mb-1">MOCK Expiry Date</label>
                    <input
                      type="text"
                      disabled
                      value="12 / 2029"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-300 p-2.5 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 text-[10px] uppercase font-mono block mb-1">CVC Code</label>
                    <input
                      type="text"
                      disabled
                      value="712"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-300 p-2.5 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850/50 flex justify-between items-center">
                  <span className="font-mono text-[10px] text-slate-500">Upgrade Total:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">$199.00 USD</span>
                </div>
              </div>
            )}

            {billingProcessStatus === "submitting" && (
              <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                <span className="font-mono">Submitting secure transaction token to Stripe servers...</span>
              </div>
            )}

            {billingProcessStatus === "verifying" && (
              <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                <span className="font-mono">Verifying 3D Secure credentials. Finalizing operational parameters...</span>
              </div>
            )}

            {billingProcessStatus === "done" && (
              <div className="py-12 text-center text-xs text-emerald-400 flex flex-col items-center justify-center gap-3">
                <CheckCircle className="w-10 h-10 animate-scaleUp" />
                <span className="font-mono font-bold text-sm">Payment Approved! Upgraded to Pro Account.</span>
              </div>
            )}

            <div className="flex gap-2.5">
              {billingProcessStatus === "init" && (
                <>
                  <button
                    onClick={() => setShowBillingModal(false)}
                    className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 font-semibold rounded-lg text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
                  >
                    Charge Mock Card
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
