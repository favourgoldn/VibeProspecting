export enum UserRole {
  VISITOR = "Visitor",
  FREE_USER = "Free User",
  PRO_USER = "Pro User",
  TEAM_ADMIN = "Team Admin",
  ORG_OWNER = "Organization Owner",
  SUPER_ADMIN = "Super Admin"
}

export enum WorkspaceTab {
  DASHBOARD = "Dashboard",
  AI_SEARCH = "AI Search",
  BUYER_SIGNALS = "Buyer Signals",
  LEAD_LISTS = "Lead Lists",
  OUTREACH_GEN = "Outreach Generator",
  MEETING_PREP = "Meeting Prep",
  RECRUITING = "Recruiting Intelligence",
  AUTOMATIONS = "Automations & Workflows",
  CRM_INTEGRATIONS = "CRM Sync",
  ADMIN_PANEL = "Admin Systems"
}

export interface Company {
  name: string;
  website: string;
  industry: string;
  employeeCount: string;
  revenue: string;
  funding: string;
  description: string;
  technologies: string[];
  news?: string;
  hiringTrend?: string;
}

export interface Contact {
  name: string;
  title: string;
  email: string;
  phone: string;
  socialLink: string;
}

export interface BuyerSignal {
  category: "Hiring" | "Funding" | "Product launches" | "Leadership changes" | "Expansion" | "Technology adoption";
  description: string;
  date: string;
  score: number;
}

export interface Prospect {
  id?: string; // Client-side tracking
  company: Company;
  contact: Contact;
  matchedWhy: string;
  buyingSignals: BuyerSignal[];
  contactScore: number;
  intentScore: number;
  saved?: boolean;
  savedListName?: string;
}

export interface LeadList {
  id: string;
  name: string;
  description: string;
  prospectCount: number;
  prospectIds: string[];
  createdAt: string;
}

export interface WorkflowNode {
  id: string;
  type: "trigger" | "action";
  label: string;
  description: string;
  icon: string;
}

export interface WorkflowAutomation {
  id: string;
  name: string;
  active: boolean;
  nodes: WorkflowNode[];
}

export interface SupportTicket {
  id: string;
  user: string;
  subject: string;
  status: "Open" | "In Progress" | "Resolved";
  priority: "Low" | "Medium" | "High";
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  module: string;
  status: "Success" | "Warning" | "Error";
}

export interface CRMConfig {
  id: string;
  name: "Salesforce" | "HubSpot" | "Pipedrive" | "Zoho" | "Monday.com";
  connected: boolean;
  lastSynced?: string;
  mappedFieldsCount: number;
}
