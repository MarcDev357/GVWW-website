import Layout from "../components/Layout";
import CtaBanner from "../components/CtaBanner";
import PageHero from "../components/PageHero";
import ServiceGrid from "../components/ServiceGrid";
import { PAGE_CONTENT } from "../data/pageContent";

export default function Services() {
  return (
    <Layout>
      <main>
        <PageHero {...PAGE_CONTENT.services} />
        <section className="mx-6 sm:mx-10">
          <div className="mx-auto max-w-7xl">
            <ServiceGrid />
          </div>
        </section>
        <CtaBanner label="Find My Best Starting Point" />
      </main>
    </Layout>
  );
}
