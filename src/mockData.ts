import { UserRole, Prospect, LeadList, WorkflowAutomation, SupportTicket, AuditLog, CRMConfig, BuyerSignal } from "./types";

export const PRICING_PLANS = [
  {
    name: "Free Trial",
    priceMonthly: "$0",
    priceAnnually: "$0",
    credits: "50 credits/mo",
    features: [
      "AI Prospect Search (Basic)",
      "5 Contact enrichment lookups",
      "Standard email outreach drafts",
      "HubSpot CRM basic integration",
      "Single-user access"
    ],
    cta: "Get Started Free",
    limitBadge: "Credits restocked monthly"
  },
  {
    name: "Starter Pro",
    priceMonthly: "$89",
    priceAnnually: "$69",
    credits: "1,200 credits/mo",
    features: [
      "Unlimited natural language searches",
      "Full contact enrichment (direct email & mobile)",
      "Daily buyer intent tracking (1 industry)",
      "CRM sync (HubSpot, Monday.com, Salesforce)",
      "Custom tone email outreach sequences",
      "Shared Lead Lists (up to 3 team seats)"
    ],
    cta: "Go Starter",
    popular: false
  },
  {
    name: "Professional",
    priceMonthly: "$199",
    priceAnnually: "$149",
    credits: "5,000 credits/mo",
    features: [
      "Everything in Starter Pro +",
      "Continuous buyer signal crawling (3 industries)",
      "AI Recruiting candidate discovery intelligence",
      "Meeting prep dossiers (deep stakeholder mapping)",
      "2 Visual workflow automation steps",
      "Priority customer helpdesk (Zoom support)",
      "10 Team member seats included"
    ],
    cta: "Upgrade to Professional",
    popular: true
  },
  {
    name: "Enterprise Core",
    priceMonthly: "$499",
    priceAnnually: "$389",
    credits: "Unlimited credits",
    features: [
      "Everything in Professional Team +",
      "Custom crawler rules & programmatic API access",
      "Continuous intent monitoring (unlimited keywords)",
      "Dedicated account manager",
      "SLA support agreements (2-hour response)",
      "Security audit logs & custom role-based scoping",
      "Unlimited team member seats"
    ],
    cta: "Contact Enterprise Sales",
    popular: false
  }
];

export const RECOLLECTED_BUILT_IN_LEADS: Prospect[] = [
  {
    company: {
      name: "NeoSphere Logistics",
      website: "neospherelogistics.com",
      industry: "Supply Chain Technology",
      employeeCount: "180",
      revenue: "$24M",
      funding: "Series A ($14M Raised)",
      description: "Cloud-native operational management suite integrating micro-fulfilment centers.",
      technologies: ["React", "Go", "AWS RDS", "Salesforce CRM", "Datadog"],
      news: "NeoSphere to establish new terminal networks in East Midlands, UK.",
      hiringTrend: "Hiring VP of Operations and junior warehouse operational coordinators."
    },
    contact: {
      name: "Eleanor Vance",
      title: "VP of Operations Logistics",
      email: "eleanor.vance@neospherelogistics.com",
      phone: "+44 20 8923 0912",
      socialLink: "https://linkedin.com/in/eleanor-vance-supply"
    },
    matchedWhy: "Fits operations search directly. Eleanor controls warehouse routing expansion budgets for their upcoming Midlands launch.",
    buyingSignals: [
      {
        category: "Expansion",
        description: "Renting 120k sqft terminal footprint to expand delivery networks in the UK.",
        date: "2026-05-15",
        score: 93
      },
      {
        category: "Leadership changes",
        description: "Hired new VP Eleanor Vance to steer EMEA delivery network operations.",
        date: "2026-04-10",
        score: 87
      }
    ],
    contactScore: 94,
    intentScore: 91,
    saved: true,
    savedListName: "UK Expansion Targets"
  },
  {
    company: {
      name: "Zenith Industrial Group",
      website: "zenithindustries.co.uk",
      industry: "Manufacturing",
      employeeCount: "480",
      revenue: "$95M",
      funding: "Private (Family Owned)",
      description: "Manufacturer of custom industrial refrigeration systems and components.",
      technologies: ["PHP", "Laravel", "MySQL", "HubSpot", "Zendesk"],
      news: "Zenith announces $15M machinery retrofitting schedule in Leeds plant.",
      hiringTrend: "Looking for plant operations supervisors and logistics planners."
    },
    contact: {
      name: "Graeme Fletcher",
      title: "Heads of Factory Procurement & Logistics",
      email: "g.fletcher@zenithindustries.co.uk",
      phone: "+44 113 496 0411",
      socialLink: "https://linkedin.com/in/graeme-fletcher-zenith"
    },
    matchedWhy: "Matched based on manufacturing tag in Britain. Zenith is retrofitting plant equipment which mandates modern supply pipeline configurations.",
    buyingSignals: [
      {
        category: "Expansion",
        description: "Allocating $15M internally for equipment updates and warehouse line enhancements.",
        date: "2026-05-20",
        score: 89
      },
      {
        category: "Technology adoption",
        description: "Upgraded entire plant tracking pipeline toward automated sensory scales.",
        date: "2026-06-01",
        score: 81
      }
    ],
    contactScore: 88,
    intentScore: 85,
    saved: true,
    savedListName: "UK Expansion Targets"
  }
];

export const INITIAL_SIGNALS: BuyerSignal[] = [
  {
    category: "Funding",
    description: "OmniRetail Group successfully holds private $18M Series B round to expand fulfillment centers.",
    date: "2026-06-06",
    score: 97
  },
  {
    category: "Expansion",
    description: "Titan Aerospace leases 2 new production warehouses in Bristol to support heavy drone manufacturing.",
    date: "2026-06-05",
    score: 94
  },
  {
    category: "Technology adoption",
    description: "EcoPack Packaging integrates Salesforce Sales Cloud across entire operational division.",
    date: "2026-06-04",
    score: 88
  },
  {
    category: "Leadership changes",
    description: "PrimeFreight Logistics appoints former DPD executive as Director of European Operational Strategy.",
    date: "2026-06-03",
    score: 91
  },
  {
    category: "Hiring",
    description: "BioLab Pharma posts 8 openings for warehouse logistics coordinators and distribution leaders in Cardiff.",
    date: "2026-06-02",
    score: 85
  }
] as any[];

export const DEFAULTS_INTEGRATIONS_CONFIG: CRMConfig[] = [
  { id: "sf", name: "Salesforce", connected: true, lastSynced: "2026-06-07 01:45 UTC", mappedFieldsCount: 16 },
  { id: "hs", name: "HubSpot", connected: true, lastSynced: "2026-06-07 01:10 UTC", mappedFieldsCount: 14 },
  { id: "pd", name: "Pipedrive", connected: false, mappedFieldsCount: 8 },
  { id: "zo", name: "Zoho", connected: false, mappedFieldsCount: 8 },
  { id: "mon", name: "Monday.com", connected: false, mappedFieldsCount: 12 }
];

export const INITIAL_LEAD_LISTS: LeadList[] = [
  {
    id: "list-1",
    name: "UK Expansion Targets",
    description: "Operations directors and warehousing leads of UK firms with high expansion intent.",
    prospectCount: 2,
    prospectIds: ["eleanor-1", "graeme-2"],
    createdAt: "2026-06-01"
  },
  {
    id: "list-2",
    name: "Series A Tech Teams",
    description: "Saas, Logistics, and Robotics prospects utilizing modern cloud infrastructures.",
    prospectCount: 1,
    prospectIds: ["david-3"],
    createdAt: "2026-06-05"
  }
];

export const INITIAL_AUTOMATIONS: WorkflowAutomation[] = [
  {
    id: "flow-1",
    name: "Series A Funding - Enrichment Flow",
    active: true,
    nodes: [
      { id: "n-1", type: "trigger", label: "Seed/Series A Funding Raised", description: "Triggered whenever target raises capital", icon: "DollarSign" },
      { id: "n-2", type: "action", label: "Identify & Enrich Operations Leads", description: "Pulls details with contact scoring > 85", icon: "ShieldAlert" },
      { id: "n-3", type: "action", label: "Generate Outbound Campaign Sequence", description: "Prepares founder-led outreach draft", icon: "Send" },
      { id: "n-4", type: "action", label: "Sync directly to HubSpot CRM", description: "Pushes companies & contacts to lead pipeline", icon: "CheckCircle" }
    ]
  },
  {
    id: "flow-2",
    name: "Warehouse Expansion - Immediate Trigger",
    active: false,
    nodes: [
      { id: "n-5", type: "trigger", label: "Warehouse Expansion Detected", description: "Monitors expansion category news", icon: "LayoutGrid" },
      { id: "n-6", type: "action", label: "Enrich Procurement Leads", description: "Grabs email and mobile phone numbers", icon: "Sparkles" },
      { id: "n-7", type: "action", label: "Push notification alert to Slack", description: "Alert team of immediate sales opportunity", icon: "Check" }
    ]
  }
];

export const TICKETS: SupportTicket[] = [
  { id: "t-101", user: "operations@neosphere.com", subject: "Sync delay with Salesforce Lead Pipeline", status: "In Progress", priority: "High", createdAt: "2026-06-06" },
  { id: "t-102", user: "ceo@bootstrappedfounders.net", subject: "Custom criteria limits on Free tier tier", status: "Resolved", priority: "Low", createdAt: "2026-06-05" },
  { id: "t-103", user: "admin@globaltalentrecruiting.io", subject: "Recruiting candidate enrichment export format", status: "Open", priority: "Medium", createdAt: "2026-06-07" }
];

export const AUDIT_RECORDS: AuditLog[] = [
  { id: "a-1", timestamp: "2026-06-07 01:58:12", actor: "Favour (Super Admin)", action: "Configure billing rules for Starter Tier", module: "Billing & Subscriptions", status: "Success" },
  { id: "a-2", timestamp: "2026-06-07 01:42:30", actor: "Marcus Davies", action: "Export 25 contacts to Salesforce Sandbox", module: "CRM Sync Integration", status: "Success" },
  { id: "a-3", timestamp: "2026-06-07 01:12:05", actor: "Sarah Jenkins", action: "Exceeded credit utilization parameters (98%)", module: "Usage Regulator", status: "Warning" },
  { id: "a-4", timestamp: "2026-06-07 00:32:11", actor: "System Daemon", action: "Google Intent Crawler completed 3 industries", module: "Intelligence Engine", status: "Success" }
];

export const SAMPLE_CANDIDATES = [
  {
    name: "Alexander Mercer",
    role: "Senior Operations Director",
    currentCompany: "FedEx EMEA",
    experience: "14 years managing multi-hub shipping corridors and warehouse automations.",
    location: "London, UK",
    education: "MSc Supply Chain Engineering - Cranfield University",
    score: 96,
    skills: ["Warehouse Robotics", "Logistics", "SAP ERP", "Six Sigma Black Belt"],
    personalTonePitch: "Alexander is currently managing high-performance shipping bays at FedEx and matches your Operations expansion needs perfectly."
  },
  {
    name: "Gemma Patterson",
    role: "VP of Logistics",
    currentCompany: "Deliveroo Enterprise",
    experience: "9 years coordinating delivery logistics, urban dark-stores, and supply procurement.",
    location: "Manchester, UK",
    education: "BSc Business Ops - Manchester Business School",
    score: 91,
    skills: ["Urban Distribution", "Vendor Contracts", "AWS Supply Chain", "Agile Procurement"],
    personalTonePitch: "Gemma excels at fast-growth dark-kitchen and dark-store layout, highly relevant for rapid fulfillment expansion programs."
  }
];

export const BLOG_POSTS = [
  {
    id: "blog-1",
    title: "Vibe Prospecting vs. Database Scraping: Why Static Lists are Dead",
    excerpt: "Static databases decay by 2.5% every single month. Discover how natural-language intent crawling keeps pipelines fresh and dynamic.",
    readTime: "6 min read",
    date: "Jun 5, 2026",
    category: "Sales Strategy"
  },
  {
    id: "blog-2",
    title: "Mastering Natural Language Prompts for Executive Identification",
    excerpt: "Learn how to formulate search descriptors that locate high-intent decision makers before they've even listed formal vacancies.",
    readTime: "8 min read",
    date: "May 28, 2026",
    category: "Productivity Hacks"
  },
  {
    id: "blog-3",
    title: "A Recruiting Playbook: Spotting Secret Sabbatical signals",
    excerpt: "The hidden indicators that star operations executives are ready to transition roles, mapped through organic news analysis.",
    readTime: "5 min read",
    date: "May 14, 2026",
    category: "Talent Acquisition"
  }
];
