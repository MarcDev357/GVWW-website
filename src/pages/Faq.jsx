import { Link } from "@tanstack/react-router";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import Layout from "../components/Layout";
import PageHero from "../components/PageHero";
import { FAQS } from "../data/faqs";
import { PAGE_CONTENT } from "../data/pageContent";

export default function Faq() {
  return (
    <Layout>
      <main>
        <PageHero {...PAGE_CONTENT.faq} />
        <section className="mx-6 sm:mx-10">
          <div className="mx-auto max-w-4xl divide-y divide-border border-y border-border">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group p-7">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl font-semibold marker:hidden">
                  <span>{faq.question}</span>
                  <ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
                </summary>
                <p className="max-w-3xl pt-5 text-base leading-8 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
          <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-between gap-5 rounded-xl border border-primary/30 bg-primary/10 p-7">
            <div>
              <p className="eyebrow text-primary">Still deciding?</p>
              <h2 className="display mt-3 text-3xl font-semibold">Ask about a custom plan.</h2>
            </div>
            <Link to="/contact" className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">
              Start with your website <ArrowUpRight className="ml-2 size-4" />
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
