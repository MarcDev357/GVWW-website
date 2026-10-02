import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import Layout from "../components/Layout";
import PageHero from "../components/PageHero";
import { PROCESS_STEPS } from "../data/process";
import { PAGE_CONTENT } from "../data/pageContent";

export default function Process() {
  return (
    <Layout>
      <main>
        <PageHero {...PAGE_CONTENT.process} />
        <section className="mx-6 sm:mx-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 md:grid-cols-5">
              {PROCESS_STEPS.map((step, i) => (
                <article key={step.title} className="depth-wrap h-full">
                  <div className="depth-card h-full rounded-xl border border-border bg-card p-6">
                    <span className="text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="display mt-12 text-2xl font-semibold">{step.title}</h2>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-border pt-8">
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                No package is assumed before the problem is clear. Start with the layer that removes the most
                friction.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground"
                >
                  Book a growth review <ArrowUpRight className="ml-2 size-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium"
                >
                  See the service ladder
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
