import Layout from "./Layout";
import { BUSINESS } from "../data/business";

export default function LegalPage({ eyebrow, title, children }) {
  return (
    <Layout>
      <main>
        <div className="mx-auto max-w-4xl px-6 pb-8 pt-20 sm:px-10 sm:pt-28">
          <p className="eyebrow text-primary">{eyebrow}</p>
          <h1 className="display mt-5 text-5xl font-semibold leading-[.94] sm:text-6xl">{title}</h1>
          {BUSINESS.legalUpdated && (
            <p className="mt-5 text-sm text-muted-foreground">Last updated: {BUSINESS.legalUpdated}</p>
          )}
        </div>
        <article className="mx-6 sm:mx-10">
          <div className="mx-auto max-w-4xl space-y-10 border-t border-border py-12 text-base leading-7 text-muted-foreground">
            {children}
          </div>
        </article>
      </main>
    </Layout>
  );
}

export function LegalSection({ title, children }) {
  return (
    <section>
      <h2 className="display text-2xl font-semibold text-foreground">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
