// Real content, extracted from the live site's database before moving off
// the third-party Vincen/Neon-hosted backend to static source.
export const SERVICES = [
  {
    slug: "web-design-development",
    name: "Web Design & Development",
    short: "A clearer sales path for mobile, local search, and real conversations.",
    detail:
      "Strategy, structure, visual design, accessible build, on-page SEO foundations, forms, analytics, and a clean handoff.",
    price: "Starting at $1,200+ one-time",
    audience: "For a new business, outdated site, or owner who needs a stronger digital foundation.",
    problem: "A confusing, slow, or dated website makes good prospects hesitate before they ever reach out.",
    outcome: "A credible, mobile-first website that makes the next step obvious.",
    includes: [
      "Discovery, site structure, and conversion plan",
      "Responsive visual design and accessible build",
      "On-page SEO foundations, forms, and analytics",
      "Launch support and a clean handoff",
    ],
  },
  {
    slug: "website-care",
    name: "Website Care",
    short: "Keep the website secure, current, monitored, and ready to convert.",
    detail:
      "Hosting, SSL, backups, security monitoring, software maintenance, uptime monitoring, recovery assistance, and reasonable content changes.",
    price: "Starting at $97+/mo",
    audience: "For owners who need their website handled without becoming the part-time webmaster.",
    problem: "Small maintenance issues, expired tools, and downtime quietly erode trust and cost leads.",
    outcome: "A dependable digital front door that stays healthy between improvements.",
    includes: [
      "Hosting, SSL, and automated backups",
      "Security and uptime monitoring",
      "Software maintenance and recovery assistance",
      "Reasonable content changes and support",
    ],
  },
  {
    slug: "web-presence",
    name: "Web Presence",
    short: "Keep the places customers find you accurate and useful.",
    detail:
      "Profile and listing consistency, core information updates, content support, and a dependable presence across your key channels.",
    price: "Starting at $197+/mo",
    audience: "For local businesses whose customers find them across several directories, profiles, and channels.",
    problem: "Outdated hours, inconsistent details, and thin profiles create doubt at the moment of discovery.",
    outcome: "A consistent, useful presence that reinforces trust wherever customers look.",
    includes: [
      "Core profile and listing consistency",
      "Business information and hours updates",
      "Content support for key channels",
      "Ongoing presence checks and recommendations",
    ],
  },
  {
    slug: "local-growth",
    name: "Local Growth",
    short: "Make local visibility and reputation part of the growth system.",
    detail:
      "Google Business Profile management, posts, review monitoring and response, review-generation systems, citations, and local optimization.",
    price: "Starting at $347+/mo",
    audience: "For service businesses that depend on nearby customers and want their reputation to keep working.",
    problem: "Being good at the work does not help if local customers cannot find or trust you.",
    outcome: "A stronger local first impression with a repeatable reputation habit.",
    includes: [
      "Google Business Profile management and posts",
      "Review monitoring and response support",
      "Review-generation system",
      "Citations and local optimization",
    ],
  },
  {
    slug: "lead-growth",
    name: "Lead Growth",
    short: "Capture, organize, and follow up with more of the demand you already earn.",
    detail:
      "CRM, forms, notifications, pipeline, booking, missed-call text-back, reminders, review requests, reactivation, and reporting.",
    price: "Starting at $597+/mo",
    audience: "For teams getting inquiries but losing track of who needs a reply, quote, or reminder.",
    problem: "Leads slip through when forms, phones, calendars, and follow-up live in separate places.",
    outcome: "A practical pipeline that gives every good inquiry a next step.",
    includes: [
      "CRM, forms, notifications, and pipeline",
      "Booking and missed-call text-back",
      "Follow-up, reminders, and review requests",
      "Reactivation workflows and reporting",
    ],
  },
  {
    slug: "ai-front-office",
    name: "AI Front Office",
    short: "Give customers a useful first response across chat and phone.",
    detail:
      "AI chat, AI phone, approved knowledge, qualification, booking handoff, summaries, CRM connection, and human escalation.",
    price: "Starting at $997+/mo",
    audience: "For busy service teams that need responsive coverage without losing the human handoff.",
    problem: "After-hours questions and repetitive first calls wait too long or pull the team away from active work.",
    outcome: "A helpful first response that captures context and routes people forward.",
    includes: [
      "Approved knowledge for chat and phone",
      "Qualification and booking handoff",
      "Call summaries and CRM connection",
      "Clear human escalation paths",
    ],
  },
  {
    slug: "revenue-protection",
    name: "Revenue Protection",
    short: "Reduce the cost of missed calls, slow follow-up, and unsold opportunities.",
    detail:
      "Immediate lead recovery, estimate follow-up, unsold-lead follow-up, reactivation, reputation support, and revenue tracking.",
    price: "Starting at $1,497+/mo",
    audience: "For established teams with enough inquiry volume to feel the cost of missed opportunities.",
    problem: "Revenue leaks after the first inquiry when calls are missed, estimates go cold, or old leads are forgotten.",
    outcome: "More disciplined recovery around the opportunities you already paid to earn.",
    includes: [
      "Immediate lead and missed-call recovery",
      "Estimate and unsold-lead follow-up",
      "Database reactivation and reputation support",
      "Revenue visibility and practical tracking",
    ],
  },
];

export const SERVICE_PATHS = Object.fromEntries(SERVICES.map((s) => [s.slug, `/services/${s.slug}`]));
export const SERVICE_NAMES = SERVICES.map((s) => s.name);
