// Real content and scoring logic, ported from the live "Find Your Growth
// Path" quiz before moving off the third-party Vincen-built bundle to
// static source. Paths map 1:1 to the services in services.js.
export const QUIZ_PATHS = {
  web: {
    name: "Web Design & Development",
    slug: "web-design-development",
    price: "Starting at $1,200 one-time",
    outcome: "A credible, mobile-first website that makes the next step obvious.",
    why: "You need a clear digital foundation before the other growth layers can do their best work.",
    includes: "Strategy, responsive design, accessible build, on-page SEO foundations, forms, and analytics.",
    support: ["Website Care"],
  },
  care: {
    name: "Website Care",
    slug: "website-care",
    price: "Starting at $97+/mo",
    outcome: "A dependable digital front door that stays healthy between improvements.",
    why: "Your website already exists, but reliability and maintenance should stop competing with running the business.",
    includes: "Hosting, SSL, backups, security and uptime monitoring, maintenance, and practical support.",
    support: ["Web Presence"],
  },
  presence: {
    name: "Web Presence",
    slug: "web-presence",
    price: "Starting at $99/mo",
    outcome: "A consistent, useful presence wherever customers look.",
    why: "Inconsistent business information can create doubt right at the moment someone is deciding whether to call.",
    includes: "Profile and listing consistency, information updates, content support, and presence checks.",
    support: ["Local Growth"],
  },
  local: {
    name: "Local Growth",
    slug: "local-growth",
    price: "Starting at $347+/mo",
    outcome: "A stronger local first impression with a repeatable reputation habit.",
    why: "Local visibility, Google Business Profile care, and reviews are the clearest next lever for your business.",
    includes:
      "Google Business Profile management, posts, review monitoring, review-generation systems, and local optimization.",
    support: ["Web Presence"],
  },
  leads: {
    name: "Lead Growth",
    slug: "lead-growth",
    price: "Starting at $597+/mo",
    outcome: "A practical pipeline that gives every good inquiry a next step.",
    why: "You are earning interest, but the path from inquiry to reply, quote, or booking needs more consistency.",
    includes: "CRM, forms, notifications, pipeline, booking, missed-call text-back, reminders, and follow-up.",
    support: ["Local Growth"],
  },
  ai: {
    name: "AI Front Office",
    slug: "ai-front-office",
    price: "Starting at $997+/mo",
    outcome: "A helpful first response that captures context and routes people forward.",
    why: "Faster response and after-hours coverage can remove the wait between a customer question and a useful next step.",
    includes:
      "Approved knowledge for chat and phone, qualification, booking handoff, summaries, and human escalation.",
    support: ["Lead Growth"],
  },
  revenue: {
    name: "Revenue Protection",
    slug: "revenue-protection",
    price: "Starting at $1,497+/mo",
    outcome: "More disciplined recovery around the opportunities you already paid to earn.",
    why: "Missed calls, slow follow-up, and aging opportunities are signals that a connected system can protect more revenue.",
    includes: "Immediate lead recovery, estimate follow-up, reactivation, reputation support, and revenue visibility.",
    support: ["AI Front Office", "Lead Growth"],
  },
};

export const QUIZ_QUESTIONS = [
  {
    key: "today",
    title: "What best describes where your business is today?",
    hint: "Choose the closest starting point. There is no wrong answer.",
    answers: [
      { label: "I need a new website", value: "web" },
      { label: "I have a website but it needs care", value: "care" },
      { label: "My website is fine but my online presence is inconsistent", value: "presence" },
      { label: "I need more local visibility and reviews", value: "local" },
      { label: "I need more leads and follow-up", value: "leads" },
      { label: "I need faster automated response", value: "ai" },
      { label: "I am losing leads or revenue and need a stronger system", value: "revenue" },
    ],
  },
  {
    key: "outcome",
    title: "What is the biggest outcome you want next?",
    hint: "This helps us break ties between nearby service paths.",
    answers: [
      { label: "Look professional and build trust", value: "web" },
      { label: "Keep the site secure and reliable", value: "care" },
      { label: "Be easier to find locally", value: "local" },
      { label: "Turn more visitors into inquiries", value: "leads" },
      { label: "Respond faster and follow up consistently", value: "leads" },
      { label: "Cover inquiries after hours", value: "ai" },
      { label: "Stop missed opportunities and revenue leaks", value: "revenue" },
    ],
  },
  {
    key: "process",
    title: "How is your current lead process handled?",
    hint: "Think about what happens after someone calls, emails, or fills out a form.",
    answers: [
      { label: "No consistent process", value: "none" },
      { label: "I handle everything manually", value: "manual" },
      { label: "We use forms/email but follow-up is inconsistent", value: "inconsistent" },
      { label: "We have a CRM or booking tool", value: "crm" },
      { label: "I'm not sure", value: "unsure" },
    ],
  },
  {
    key: "local",
    title: "How important are local search and reputation right now?",
    hint: "This includes your Google Business Profile, reviews, and local visibility.",
    answers: [
      { label: "Not a priority", value: "low" },
      { label: "Helpful", value: "helpful" },
      { label: "Very important", value: "high" },
      { label: "I need help with my Google Business Profile and reviews", value: "gbp" },
    ],
  },
  {
    key: "automation",
    title: "How much should the system automate?",
    hint: "Start with the level that would feel useful, not overwhelming.",
    answers: [
      { label: "Keep it simple", value: "simple" },
      { label: "Automate reminders and follow-up", value: "followup" },
      { label: "Add missed-call text-back and lead routing", value: "routing" },
      { label: "Add AI chat/phone support", value: "ai" },
      { label: "I want a connected front office", value: "front" },
    ],
  },
  {
    key: "timeline",
    title: "What timeline are you considering?",
    hint: "This helps frame the conversation and the best first step.",
    answers: [
      { label: "As soon as possible", value: "now" },
      { label: "Within 30 days", value: "30" },
      { label: "In the next 1–3 months", value: "90" },
      { label: "I'm exploring options", value: "exploring" },
    ],
  },
];

export function scoreQuiz(t) {
  const n = { web: 0, care: 0, presence: 0, local: 0, leads: 0, ai: 0, revenue: 0 };
  const s = (d, m) => {
    n[d] += m;
  };
  if (t.today in n) s(t.today, 8);
  if (t.outcome === "web") s("web", 4);
  if (t.outcome === "care") s("care", 4);
  if (t.outcome === "local") s("local", 4);
  if (t.outcome === "leads") s("leads", 4);
  if (t.outcome === "ai") s("ai", 4);
  if (t.outcome === "revenue") s("revenue", 4);
  if (["none", "manual", "inconsistent"].includes(t.process)) s("leads", 3);
  if (t.local === "high" || t.local === "gbp") s("local", 4);
  if (["routing", "followup"].includes(t.automation)) s("leads", 3);
  if (["ai", "front"].includes(t.automation)) s("ai", 5);
  if (t.today === "revenue" || t.automation === "front") s("revenue", 2);
  const best = Object.keys(n).sort((d, m) => n[m] - n[d])[0] ?? "web";
  return QUIZ_PATHS[best];
}
