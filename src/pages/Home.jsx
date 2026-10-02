import { ChevronDown, Check } from "lucide-react";
import Layout from "../components/Layout";
import CtaBanner from "../components/CtaBanner";
import ServiceGrid from "../components/ServiceGrid";
import { FAQS } from "../data/faqs";

const HOME_FAQS = FAQS.slice(0, 5);
import logo from "../assets/veteran-webworks-logo.png";

const WORKFLOW_STEPS = [
  { title: "Lead captured", detail: "Form, chat, or missed call" },
  { title: "Qualified", detail: "Intent and fit organized" },
  { title: "Follow-up sent", detail: "Helpful reply and reminder" },
  { title: "Call booked", detail: "Calendar-ready handoff" },
];

export default function Home() {
  return (
    <Layout>
      <main>
        <section className="grid-line relative overflow-hidden px-6 pb-20 pt-20 sm:px-10 sm:pb-32 sm:pt-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
            <div className="relative z-10">
              <p className="eyebrow text-primary">Websites &middot; automation &middot; local growth</p>
              <h1 className="display mt-6 max-w-4xl text-6xl font-semibold leading-[.88] sm:text-8xl">
                Your next customer is looking for <span className="text-primary">clarity.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
                Veteran Webworks builds the web presence, follow-up, AI front office, and revenue safeguards that
                help local service businesses get found, trusted, and contacted.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="/book"
                  className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Build My Growth System
                </a>
                <a
                  href="/pricing"
                  className="inline-flex h-11 items-center rounded-md border border-border px-6 text-sm font-medium transition-colors hover:bg-card"
                >
                  See starting prices
                </a>
              </div>
              <p className="mt-8 text-xs uppercase tracking-[.14em] text-muted-foreground">
                Veteran-owned &middot; plain-English guidance &middot; clear scope
              </p>
            </div>
            <div className="relative hidden min-h-[430px] lg:block">
              <div className="absolute inset-8 rotate-3 rounded-2xl bg-primary/20" />
              <img
                src={logo}
                alt="Veteran Webworks blue brand mark"
                className="relative mx-auto mt-10 h-[360px] w-[360px] object-contain drop-shadow-[0_24px_55px_rgba(21,133,255,.28)]"
              />
            </div>
          </div>
        </section>

        <section className="section-rule mx-6 py-20 sm:mx-10">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow text-primary">The service ladder</p>
            <h2 className="display mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
              Add the layer that moves the business forward.
            </h2>
            <div className="mt-12">
              <ServiceGrid />
            </div>
          </div>
        </section>

        <section className="mx-6 my-10 rounded-2xl border border-primary/25 bg-card p-6 sm:mx-10 sm:p-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="eyebrow text-primary">A connected customer journey</p>
              <h2 className="display mt-5 text-4xl font-semibold sm:text-6xl">
                From first click to booked conversation.
              </h2>
              <p className="mt-6 leading-7 text-muted-foreground">
                Capture the inquiry, reply while intent is high, make booking easy, and keep the handoff visible.
                Every layer is scoped to your actual operation.
              </p>
            </div>
            <div className="workflow-stage">
              <div className="workflow-beam" aria-hidden="true" />
              <div className="workflow-nodes">
                {WORKFLOW_STEPS.map((step, i) => (
                  <div key={step.title} className="workflow-node is-active">
                    <span className="workflow-icon">
                      <span>{i + 1}</span>
                    </span>
                    <span>
                      <strong className="block text-sm">{step.title}</strong>
                      <small className="mt-1 block text-muted-foreground">{step.detail}</small>
                    </span>
                    <Check className="workflow-check" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-6 py-16 sm:mx-10">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow text-primary">Common questions</p>
            <div className="mt-8 max-w-3xl">
              {HOME_FAQS.map((faq) => (
                <details key={faq.question} className="group border-t border-border py-5">
                  <summary className="flex cursor-pointer list-none justify-between gap-5 font-medium">
                    <span>{faq.question}</span>
                    <ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="max-w-2xl pt-4 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <CtaBanner label="Start Your Project" />
      </main>
    </Layout>
  );
}
