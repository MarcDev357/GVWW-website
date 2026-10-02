import Layout from "../components/Layout";
import CtaBanner from "../components/CtaBanner";
import PageHero from "../components/PageHero";
import { PAGE_CONTENT } from "../data/pageContent";

export default function About() {
  return (
    <Layout>
      <main>
        <PageHero {...PAGE_CONTENT.about} />
        <section className="mx-6 sm:mx-10">
          <div className="mx-auto grid max-w-7xl gap-12 border-t border-border py-16 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-primary">The point of view</p>
              <h2 className="display mt-5 text-4xl font-semibold sm:text-6xl">
                Good digital work should feel like relief.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-muted-foreground">
              <p>
                Owners should not need to decode a stack of tools or chase a provider for an answer. Veteran
                Webworks brings strategy and execution into one plain-English conversation.
              </p>
              <p>
                The work is practical, human, and built around the moments that matter: being found, being trusted,
                being answered, and making it easy to book.
              </p>
            </div>
          </div>
        </section>
        <CtaBanner />
      </main>
    </Layout>
  );
}
