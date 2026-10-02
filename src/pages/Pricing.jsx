import { Link } from "@tanstack/react-router";
import { Check, Globe } from "lucide-react";
import Layout from "../components/Layout";
import CtaBanner from "../components/CtaBanner";
import PageHero from "../components/PageHero";
import { PACKAGES } from "../data/packages";
import { PAGE_CONTENT } from "../data/pageContent";

const CATEGORIES = [...new Set(PACKAGES.map((p) => p.category))];

export default function Pricing() {
  return (
    <Layout>
      <main>
        <PageHero {...PAGE_CONTENT.pricing} />
        <section className="mx-6 mb-12 sm:mx-10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 rounded-xl border border-primary/40 bg-primary/10 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Globe className="mt-1 size-6 shrink-0 text-primary" />
              <div>
                <p className="eyebrow text-primary">Limited-time offer</p>
                <h2 className="display mt-2 text-2xl font-semibold sm:text-3xl">
                  First-year domain name free with any website build.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Search and register your domain with Veteran Webworks, and the first year is on us when you build
                  your site with us.
                </p>
              </div>
            </div>
            <a
              href="/domains"
              className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground"
            >
              Search for a domain
            </a>
          </div>
        </section>
        <section className="mx-6 sm:mx-10">
          <div className="mx-auto max-w-7xl space-y-16">
            {CATEGORIES.map((category) => (
              <div key={category}>
                <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow text-primary">{category}</p>
                    <h2 className="display mt-3 text-3xl font-semibold sm:text-5xl">Choose the layer you need now.</h2>
                  </div>
                  {category === "Web Design & Development" && (
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary">
                      Start at $1,200
                    </span>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {PACKAGES.filter((p) => p.category === category).map((pkg) => (
                    <article
                      key={pkg.name}
                      className={`relative rounded-xl border p-7 ${
                        pkg.recommended
                          ? "border-primary bg-primary/10 shadow-[0_0_40px_rgba(21,133,255,.12)]"
                          : "border-border bg-card"
                      }`}
                    >
                      {pkg.recommended && (
                        <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                          Recommended
                        </span>
                      )}
                      <h3 className="display pr-16 text-2xl font-semibold">{pkg.name}</h3>
                      <p className="mt-5 text-3xl font-semibold text-primary">{pkg.price}</p>
                      {pkg.setup && <p className="mt-1 text-sm text-muted-foreground">{pkg.setup}</p>}
                      <p className="mt-5 text-sm leading-6 text-muted-foreground">{pkg.summary}</p>
                      <ul className="mt-6 space-y-3 text-sm">
                        {pkg.features.map((f) => (
                          <li key={f} className="flex gap-2">
                            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to="/fit"
                        className={`mt-8 flex h-10 w-full items-center justify-center rounded-md text-sm font-medium ${
                          pkg.recommended
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-background text-foreground"
                        }`}
                      >
                        Find my fit
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <p className="mx-auto mt-12 max-w-7xl px-6 text-sm text-muted-foreground sm:px-10">
          Third-party usage charges for SMS, phone, AI, hosting, or similar services are separate where applicable and
          are explained before approval.
        </p>
        <CtaBanner label="Build My Growth System" />
      </main>
    </Layout>
  );
}
