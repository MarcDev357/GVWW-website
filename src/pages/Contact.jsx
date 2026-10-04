import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import Layout from "../components/Layout";
import { BUSINESS, SMS_CONSENT_TEXT, SMS_CONSENT_VERSION } from "../data/business";
import { SERVICE_NAMES } from "../data/services";
import logo from "../assets/veteran-webworks-logo.png";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    if (!name || !email.includes("@")) {
      setError("Add your name and a valid email so the request can be prepared.");
      return;
    }
    const smsConsent = form.get("sms_consent") === "on";
    const phone = String(form.get("phone") ?? "").trim();
    if (smsConsent && phone.replace(/\D/g, "").length < 10) {
      setError("Add your mobile number to receive text messages, or uncheck the text message box.");
      return;
    }
    setError("");
    setSent(true);
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form: "Contact / Strategy Call",
        name,
        email,
        phone,
        ...(smsConsent && {
          sms_consent: true,
          sms_consent_text: SMS_CONSENT_TEXT,
          sms_consent_version: SMS_CONSENT_VERSION,
        }),
        best_time: String(form.get("best_time") ?? ""),
        service: String(form.get("service") ?? ""),
        message: String(form.get("message") ?? ""),
        company_website: String(form.get("company_website") ?? ""),
        form_ts: String(form.get("form_ts") ?? ""),
        page: location.pathname,
      }),
    }).catch(() => {});
  }

  return (
    <Layout>
      <main>
        <section className="mx-6 pb-16 pt-20 sm:mx-10 sm:pt-28">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <div className="mb-10 inline-flex rounded-md bg-white px-3 py-2">
                <img src={logo} alt="Veteran Webworks" className="h-14 w-auto max-w-[15rem] object-contain" />
              </div>
              <p className="eyebrow text-primary">Start a conversation</p>
              <h1 className="display mt-5 text-6xl font-semibold leading-[.9] sm:text-8xl">
                Build a better next step.
              </h1>
              <p className="mt-8 max-w-md text-lg leading-8 text-muted-foreground">
                Tell us what is stuck, what is changing, or what you want to make easier. A useful reply comes back
                during business hours.
              </p>
              <address className="mt-10 space-y-3 text-sm not-italic text-muted-foreground">
                <p className="font-semibold text-foreground">{BUSINESS.legalName || BUSINESS.name}</p>
                <p>
                  <Mail className="mr-3 inline size-4 text-primary" />
                  <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
                </p>
                {BUSINESS.phone && (
                  <p>
                    <Phone className="mr-3 inline size-4 text-primary" />
                    <a href={`tel:${BUSINESS.phone.replace(/[^+\d]/g, "")}`}>{BUSINESS.phone}</a>
                  </p>
                )}
                {BUSINESS.address && (
                  <p>
                    <MapPin className="mr-3 inline size-4 text-primary" />
                    {BUSINESS.address}
                  </p>
                )}
              </address>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-xl border border-border bg-card p-7 sm:p-10">
              <div className="rounded-lg border border-primary/40 bg-primary/10 p-5">
                <p className="text-sm font-semibold">Rather just grab a time? Book a free 30&#8209;minute call.</p>
                <p className="mt-1 text-xs text-muted-foreground">Google Meet video, no obligation.</p>
                <a
                  href="/book"
                  className="mt-3 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Book a call &rarr;
                </a>
              </div>

              <p className="eyebrow text-primary">Book a Strategy Call</p>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm">
                  Name
                  <input
                    name="name"
                    required
                    className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
                <label className="text-sm">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
                <label className="text-sm">
                  Phone <span className="text-muted-foreground">(optional)</span>
                  <input
                    name="phone"
                    type="tel"
                    className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
              </div>

              {/* Spam prevention: honeypot field + submission-timing field, invisible to real visitors */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
                <input type="hidden" name="form_ts" defaultValue={String(Date.now())} />
              </div>

              <label className="block text-sm">
                Best time to call
                <select
                  name="best_time"
                  className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option>Any time</option>
                  <option>Morning (8am&#8211;12pm)</option>
                  <option>Afternoon (12&#8211;5pm)</option>
                  <option>Evening (5&#8211;8pm)</option>
                </select>
              </label>

              <label className="block text-sm">
                What can we help with?
                <select
                  name="service"
                  className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {SERVICE_NAMES.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                  <option>Not sure yet</option>
                </select>
              </label>

              <label className="block text-sm">
                A little context
                <textarea
                  name="message"
                  rows={5}
                  placeholder="What would a better digital system make easier?"
                  className="mt-2 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>

              <div className="flex items-start gap-3 rounded-lg border border-border bg-background/50 p-4">
                <input
                  id="sms_consent"
                  name="sms_consent"
                  type="checkbox"
                  className="mt-1 size-4 shrink-0 accent-[var(--color-primary)]"
                />
                <label htmlFor="sms_consent" className="text-xs leading-5 text-muted-foreground">
                  {SMS_CONSENT_TEXT} See our{" "}
                  <Link to="/privacy" className="text-primary underline">Privacy Policy</Link> and{" "}
                  <Link to="/terms" className="text-primary underline">Terms of Service</Link>.
                </label>
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
              {sent && (
                <p className="text-sm text-primary" role="status">
                  Thanks &mdash; your message has been sent. We'll reply by email, usually within one business day.
                </p>
              )}

              <button
                type="submit"
                className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Prepare My Request &rarr;
              </button>
              <p className="text-xs text-muted-foreground">
                We'll reply by email, usually within one business day.
              </p>
            </form>
          </div>
        </section>
      </main>
    </Layout>
  );
}
