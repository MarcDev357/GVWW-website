import { Link } from "@tanstack/react-router";
import { Check, ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import Layout from "../components/Layout";
import CtaBanner from "../components/CtaBanner";
import { SERVICES } from "../data/services";

export default function ServiceDetail({ slug }) {
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    return (
      <Layout>
        <main>
          <section className="mx-6 border-t border-border py-16 sm:mx-10">
            <div className="mx-auto max-w-7xl">
              <p className="eyebrow text-primary">Service unavailable</p>
              <h2 className="display mt-4 text-4xl font-semibold">Let's find the right starting point.</h2>
              <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
                This service detail is being updated. The full service ladder is available, or you can contact
                Veteran Webworks for a direct recommendation.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/services"
                  className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground"
                >
                  Back to services
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium"
                >
                  Contact Veteran Webworks
                </Link>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main>
        <section className="mx-6 sm:mx-10">
          <div className="mx-auto max-w-7xl border-t border-border py-8">
            <Link to="/services" className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary">
              <ArrowLeft className="mr-2 size-4" />
              Back to the service ladder
            </Link>
          </div>
          <div className="mx-auto grid max-w-7xl gap-12 border-t border-border py-16 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <p className="eyebrow text-primary">{service.name}</p>
              <p className="mt-4 text-primary">{service.price}</p>
              <h2 className="display mt-5 text-4xl font-semibold sm:text-5xl">{service.outcome}</h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">{service.audience}</p>
            </div>
            <div className="max-w-2xl">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="eyebrow text-primary">The problem</p>
                  <p className="mt-3 leading-7 text-muted-foreground">{service.problem}</p>
                </div>
                <div>
                  <p className="eyebrow text-primary">The outcome</p>
                  <p className="mt-3 leading-7 text-muted-foreground">{service.outcome}</p>
                </div>
              </div>

              <div className="mt-12">
                <p className="eyebrow text-primary">What is included</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {service.includes.map((item) => (
                    <div key={item} className="flex gap-3 border-t border-border pt-4 text-sm leading-6">
                      <Check className="mt-1 size-4 shrink-0 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="liquid-glass-strong mt-12 rounded-2xl border border-primary/25 p-7">
                <Sparkles className="size-5 text-primary" />
                <p className="display mt-5 text-3xl font-semibold">Ready to make this layer work for you?</p>
                <p className="mt-3 max-w-lg leading-7 text-muted-foreground">
                  Bring the current challenge. We will recommend the right next step, scope it clearly, and keep the
                  conversation practical.
                </p>
                <Link to="/contact" className="mt-7 inline-flex items-center text-sm font-medium text-primary">
                  Book a strategy call <ArrowUpRight className="ml-2 size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <CtaBanner label="Talk Through My Project" />
      </main>
    </Layout>
  );
}
