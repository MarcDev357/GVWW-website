import { SERVICES } from "./services";
import { PAGE_CONTENT } from "./pageContent";

export const SITE_URL = "https://veteranwebworks.com";
export const SITE_NAME = "Veteran Webworks";

const HOME = {
  title: "Veteran Webworks | Web Design, Automation & Local Growth",
  description:
    "Veteran Webworks builds conversion-focused websites, local growth systems, lead automation, AI front offices, and revenue protection for service businesses.",
};

const STATIC = {
  "/": HOME,
  "/services": { title: "Services | Veteran Webworks", description: PAGE_CONTENT.services.description },
  "/pricing": { title: "Pricing | Veteran Webworks", description: PAGE_CONTENT.pricing.description },
  "/process": { title: "Our Process | Veteran Webworks", description: PAGE_CONTENT.process.description },
  "/faq": { title: "FAQ | Veteran Webworks", description: PAGE_CONTENT.faq.description },
  "/about": { title: "About | Veteran Webworks", description: PAGE_CONTENT.about.description },
  "/work": { title: "Our Work | Veteran Webworks", description: PAGE_CONTENT.work.description },
  "/contact": {
    title: "Contact | Veteran Webworks",
    description: "Tell Veteran Webworks what is stuck and get a plain-English recommendation, or book a strategy call.",
  },
  "/privacy": {
    title: "Privacy Policy | Veteran Webworks",
    description: "How Veteran Webworks handles your information, including text messaging consent and mobile numbers.",
  },
  "/terms": {
    title: "Terms of Service | Veteran Webworks",
    description: "Terms of service for Veteran Webworks, including the text messaging program terms.",
  },
  "/fit": {
    title: "Find Your Growth Path | Veteran Webworks",
    description:
      "Answer six concise questions to find the right website design, website care, local growth, lead automation, AI front office, or revenue protection path.",
  },
};

export function metaForPath(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (STATIC[path]) return { ...STATIC[path], path, indexable: true };

  const m = path.match(/^\/services\/([^/]+)$/);
  const service = m && SERVICES.find((s) => s.slug === m[1]);
  if (service) {
    return {
      title: `${service.name} | Veteran Webworks`,
      description: `${service.short} ${service.detail}`.slice(0, 300),
      path,
      indexable: true,
    };
  }
  return { title: "Page not found | Veteran Webworks", description: HOME.description, path, indexable: false };
}
