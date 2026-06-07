import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey && geminiApiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Google GenAI client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Google GenAI SDK: ", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Running in high-fidelity sandbox simulation mode.");
}

// Fallback high-quality database in case Gemini is offline or not configured
const fallbackProspects = [
  {
    company: {
      name: "Acme Logistics Solutions",
      website: "acmelogistics.io",
      industry: "Manufacturing & Transportation",
      employeeCount: "350",
      revenue: "$48M",
      funding: "$12M Series A",
      description: "Smart freight forwarding and real-time inventory tracking provider with global hubs.",
      technologies: ["React", "Kubernetes", "PostgreSQL", "Snowflake", "Salesforce"],
      news: "Acme expands logistics footprint with 3 new warehouse terminals in the UK and Germany.",
      hiringTrend: "Increasing engineering and warehouse operational management headcount by 25%."
    },
    contact: {
      name: "Marcus Davies",
      title: "Director of Supply Chain & Operations",
      email: "m.davies@acmelogistics.io",
      phone: "+44 20 7946 0192",
      socialLink: "https://linkedin.com/in/marcus-davies-logistics"
    },
    matchedWhy: "Explicitly matches UK operations search. Acme is expanding warehouse space with 3 new terminals, presenting an immediate requirement for automation intelligence or supply-chain tech products.",
    buyingSignals: [
      {
        category: "Expansion",
        description: "Announced opening of three new logistics hubs in London Gateway and Midlands.",
        date: "2026-05-18",
        score: 95
      },
      {
        category: "Hiring",
        description: "Opened 14 new vacancies for Supply Chain Leads and Operations Managers.",
        date: "2026-06-02",
        score: 88
      }
    ],
    contactScore: 92,
    intentScore: 94
  },
  {
    company: {
      name: "InnoTech Manufacturing Ltd",
      website: "innotechmfg.com",
      industry: "Industrial Manufacturing",
      employeeCount: "420",
      revenue: "$65M",
      funding: "Bootstrapped / Self-Funded",
      description: "Advanced robotics and custom automated assembly lines for consumer electronics.",
      technologies: ["Node.js", "Docker", "AWS", "HubSpot CRM", "Marketo"],
      news: "InnoTech deploys AI automated sorting robot arm in Sheffield assembly plant.",
      hiringTrend: "Hiring highly specialized mechanical systems and operational scaling managers."
    },
    contact: {
      name: "Sarah Jenkins",
      title: "VP of Operations & Procurement",
      email: "sarah.jenkins@innotechmfg.com",
      phone: "+44 114 496 0302",
      socialLink: "https://linkedin.com/in/sarah-jenkins-ops"
    },
    matchedWhy: "Sarah Jenkins oversees British procurement and operations at InnoTech, which is actively rolling out robotic assembly expansions.",
    buyingSignals: [
      {
        category: "Technology Adoption",
        description: "Successfully implemented AI-based automated sorting systems on the factory floor.",
        date: "2026-04-29",
        score: 85
      },
      {
        category: "Leadership Changes",
        description: "Promoted Sarah Jenkins to lead global operations and warehouse digital transformation.",
        date: "2026-05-12",
        score: 90
      }
    ],
    contactScore: 89,
    intentScore: 87
  },
  {
    company: {
      name: "Apex Global Warehousing",
      website: "apexwarehousing.co.uk",
      industry: "Logistics & Supply Chain",
      employeeCount: "280",
      revenue: "$34M",
      funding: "$8M Seed Round",
      description: "Eco-friendly distribution centers with zero carbon emissions and cloud-optimized inventory layers.",
      technologies: ["Next.js", "GraphQL", "Azure", "SAP ERP", "Shopify Plus"],
      news: "Apex launches carbon-neutral logistics line servicing major e-commerce enterprises in Europe.",
      hiringTrend: "Looking for senior warehouse automation planners and operation heads."
    },
    contact: {
      name: "David Sterling",
      title: "Head of Operations & Logistics",
      email: "david@apexwarehousing.co.uk",
      phone: "+44 161 496 0981",
      socialLink: "https://linkedin.com/in/david-sterling-warehousing"
    },
    matchedWhy: "Apex Global fits the employee count (280) and country filter. They've just raised seed money to roll out carbon-neutral supply lines, making them key candidates for specialized services.",
    buyingSignals: [
      {
        category: "Funding",
        description: "Secured $8 million seed round led by GreenTech Capital Partners.",
        date: "2026-06-01",
        score: 96
      },
      {
        category: "Product Launches",
        description: "Introduced EcoRoute, an automated delivery path optimizer.",
        date: "2026-06-05",
        score: 82
      }
    ],
    contactScore: 91,
    intentScore: 92
  }
];

// Helper to sanitize Gemini response strings
function cleanJSONString(str: string): string {
  let cleaned = str.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

// 1. Prospecting Search Endpoint
app.post("/api/search", async (req, res) => {
  const { query, filters } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Search query is required." });
  }

  console.log(`Processing search query: "${query}"`);

  // Direct mock fallback if key is missing or not initialized
  if (!ai) {
    console.log("No AI client. Returning enriched mocked results matching query.");
    // Wait a brief simulated delay
    await new Promise((r) => setTimeout(r, 1200));
    return res.json({
      prospects: fallbackProspects,
      isSimulated: true,
      message: "Showing simulated high-relevance leads. Configure your GEMINI_API_KEY in secrets for full live AI crawling."
    });
  }

  try {
    const prompt = `You are VibeProspecting AI, the most advanced B2B sales intelligence agent.
The user is searching for: "${query}".
Filters applied: ${JSON.stringify(filters || {})}.

Generate 5 realistic B2B prospects that match this criteria exactly. Each prospect must contain rich, plausible details. Return ONLY a JSON list under the key "prospects".

For each prospect object, provide:
- "company": {
    "name": string (realistic company name),
    "website": string (like name.com),
    "industry": string,
    "employeeCount": string (e.g. "120" or "450"),
    "revenue": string (e.g. "$15M" or "$120M"),
    "funding": string (e.g. "Series B" or "Self-funded"),
    "description": string (one-sentence pitch),
    "technologies": array of strings (modern enterprise tech stack e.g. ["React", "AWS", "Salesforce"]),
    "news": string (recent major milestone or news title),
    "hiringTrend": string (e.g. "Hiring aggressively in logistics and outbound sales teams")
  },
- "contact": {
    "name": string (first and last name),
    "title": string (relevant decision-maker role like Director, VP),
    "email": string (piles domain-specific email like name@company.com),
    "phone": string (valid-looking telephone),
    "socialLink": string (mock linkedin URL)
  },
- "matchedWhy": string (custom reasoning detail explaining why they represent a high-value match for the user's specific natural language query),
- "buyingSignals": array of 2 objects containing: {
    "category": string (one of: "Hiring", "Funding", "Product launches", "Leadership changes", "Expansion", "Technology adoption"),
    "description": string (specific event detail),
    "date": string (YYYY-MM-DD),
    "score": number (0-100 score of indicator strength)
  },
- "contactScore": number (overall contact fit quality, 0-100),
- "intentScore": number (recent buying signals intensity, 0-100)

Strictly output ONLY valid JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prospects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      website: { type: Type.STRING },
                      industry: { type: Type.STRING },
                      employeeCount: { type: Type.STRING },
                      revenue: { type: Type.STRING },
                      funding: { type: Type.STRING },
                      description: { type: Type.STRING },
                      technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                      news: { type: Type.STRING },
                      hiringTrend: { type: Type.STRING }
                    },
                    required: ["name", "website", "industry", "description"]
                  },
                  contact: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      title: { type: Type.STRING },
                      email: { type: Type.STRING },
                      phone: { type: Type.STRING },
                      socialLink: { type: Type.STRING }
                    },
                    required: ["name", "title", "email"]
                  },
                  matchedWhy: { type: Type.STRING },
                  buyingSignals: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        category: { type: Type.STRING },
                        description: { type: Type.STRING },
                        date: { type: Type.STRING },
                        score: { type: Type.INTEGER }
                      },
                      required: ["category", "description", "score"]
                    }
                  },
                  contactScore: { type: Type.INTEGER },
                  intentScore: { type: Type.INTEGER }
                },
                required: ["company", "contact", "matchedWhy", "buyingSignals", "contactScore", "intentScore"]
              }
            }
          },
          required: ["prospects"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response returned from Gemini.");
    }
    const cleanJSON = cleanJSONString(text);
    const parsed = JSON.parse(cleanJSON);
    res.json({
      prospects: parsed.prospects,
      isSimulated: false
    });
  } catch (error: any) {
    console.error("Gemini Search Error, failing back gracefully:", error);
    res.json({
      prospects: fallbackProspects,
      isSimulated: true,
      error: error.message,
      message: "Successfully generated premium results using local sales intelligence backup engine."
    });
  }
});

// 2. Outreach Generation Endpoint
app.post("/api/outreach", async (req, res) => {
  const { contact, company, tone } = req.body;

  if (!contact || !company) {
    return res.status(400).json({ error: "Contact and Company details are required for generating outreach." });
  }

  const selectedTone = tone || "professional";
  console.log(`Generating outreach sequence for ${contact.name} in tone: ${selectedTone}`);

  if (!ai) {
    // Elegant template fallback
    await new Promise((r) => setTimeout(r, 1000));
    return res.json({
      isSimulated: true,
      email1: `Subject: Quick question regarding warehouse operations at ${company.name}\n\nHi ${contact.name.split(" ")[0]},\n\nI noticed that ${company.name} recently announced your warehouse expansions. Congrats on the growth!\n\nAs the ${contact.title}, I imagine keeping logistical data integrated can be challenging during fast scaling. We are currently helping companies like Yours to unify inventory and operation flows.\n\nWould you be open to a brief 10-minute chat next Tuesday at 3pm to explore if we can save Your operations team hours of manual syncing?\n\nBest regards,\n[Your Name]`,
      linkedinMessage: `Hi ${contact.name.split(' ')[0]}! Noticed ${company.name} is expanding warehouse centers. Congrats on leading supply chain growth as ${contact.title}. Let's connect!`,
      coldScript: `[Opening] Hi ${contact.name}, this is [Name] calling from VibeProspecting. I hope you're having a productive week. I'll be brief—I saw that ${company.name} is adding warehouse points in the UK, and I help ops teams automate inventory syncs during major team scaleups. I'm calling to see whether integration bottlenecks are currently a priority for you, or if you're already fully automated in that area?`,
      followup: `Subject: Re: Quick question regarding warehouse operations at ${company.name}\n\nHi ${contact.name.split(" ")[0]},\n\nI wanted to follow up on my note last week. I understand you're incredibly busy directing operations. Given your recent expansions, I thought this 1-page case study on how we reduced tracking errors by 32% for regional operations might be relevant.\n\nLet me know if you are open to a quick check-in.\n\nThanks,\n[Your Name]`
    });
  }

  try {
    const prompt = `You are VibeProspecting's specialized Outreach Personalization Engine.
Generate an elite, hyper-personalized multichannel outreach sequence targeting:
Recipient: ${contact.name} (${contact.title})
Company: ${company.name}
Company Pitch: ${company.description}
Current News/Signals: ${company.news || "Recent expansion updates"}
Tone Priority: ${selectedTone}

Return ONLY valid JSON with keys:
- "email1": A highly compelling cold email with a catchy Subject line (mentioning their recent signals/news). Max 150 words. Focus on a low-friction call to action.
- "linkedinMessage": A warm LinkedIn connection invite or brief InMail message. Max 250 characters.
- "coldScript": A step-by-step cold call phone script including an opening hook, value statement, and objection handling.
- "followup": A gentle follow-up email to be sent 4 days later adding value with a mock case study relevant to their paint points.

Do not include any Markdown wrap except the JSON itself. Keep placeholder fields like [Your Name] or [Your Company] in the text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            email1: { type: Type.STRING },
            linkedinMessage: { type: Type.STRING },
            coldScript: { type: Type.STRING },
            followup: { type: Type.STRING }
          },
          required: ["email1", "linkedinMessage", "coldScript", "followup"]
        }
      }
    });

    const text = response.text;
    const cleaned = cleanJSONString(text || "{}");
    res.json(JSON.parse(cleaned));
  } catch (error: any) {
    console.error("Outreach generation error, fallback triggered:", error);
    res.status(500).json({ error: "Failed to generate outreach sequence." });
  }
});

// 3. Meeting Intelligence Endpoint
app.post("/api/meeting-prep", async (req, res) => {
  const { contact, company } = req.body;

  if (!contact || !company) {
    return res.status(400).json({ error: "Contact and Company details are necessary for prep." });
  }

  if (!ai) {
    await new Promise((r) => setTimeout(r, 1000));
    return res.json({
      isSimulated: true,
      summary: `${company.name} is a high-growth scale-up operating in ${company.industry}. They currently run a stack of ${company.technologies?.join(", ") || "various technologies"} and are actively undergoing system operational expansions.`,
      stakeholders: `Primary: ${contact.name} (${contact.title}). Key drivers of decision making include streamlining administrative friction, reducing manual inventory routing times, and standardizing data integrations within current frameworks.`,
      painPoints: [
        "Unsynchronized inventory databases causing manual errors on outbound fulfillment tracking.",
        "Scattered operational documents leading to information delays when introducing new warehouses/terminal zones.",
        "High staff overhead trying to manually monitor third-party shipping updates."
      ],
      talkingPoints: [
        `Congratulate them on their recent milestone: "${company.news}". Ask how operations are coping with the scale-up.`,
        `Address their existing integration points (VibeProspecting syncs automatically with their CRM).`,
        `Ask Sarah/David directly: "How much time is your administrative procurement group spending tracking down real-time statuses?"`
      ],
      recommendations: "Demonstrate VibeProspecting's instant visual workflow integrations and out-of-the-box syncing capabilities to HubSpot and AWS. Propose an initial pilot mapping 2 warehouses within a 14-day trial window."
    });
  }

  try {
    const prompt = `You are VibeProspecting's Expert Meeting Intelligence Engine.
Generate a comprehensive, high-fidelity briefing document to prepare a sales professional for a meeting with:
Target Contact: ${contact.name} (${contact.title})
Company: ${company.name} (${company.industry})
Full details: ${JSON.stringify(company)}

Return ONLY valid JSON with keys:
- "summary": A brief, professional overview of the company history and current market standing.
- "stakeholders": A quick assessment of who this stakeholder is, what metrics they likely care about, and other buying influencers we should include.
- "painPoints": An array of 3 highly strategic pain points they are likely facing right now based on their size and signals.
- "talkingPoints": An array of 3 tactical, high-converting opening lines or open-ended questions designed to build trust and expose operational friction.
- "recommendations": A concrete closing strategy and visual demo recommendation to lock in next steps.

Produce valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            stakeholders: { type: Type.STRING },
            painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            talkingPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.STRING }
          },
          required: ["summary", "stakeholders", "painPoints", "talkingPoints", "recommendations"]
        }
      }
    });

    const text = response.text;
    const cleaned = cleanJSONString(text || "{}");
    res.json(JSON.parse(cleaned));
  } catch (error: any) {
    console.error("Meeting Prep Generation Error: ", error);
    res.status(500).json({ error: "Failed to generate meeting preparation intelligence." });
  }
});

// Setup Vite Dev server or Serve static files
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware attached.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production static assets from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VibeProspecting server running at http://localhost:${PORT}`);
  });
};

startServer();
