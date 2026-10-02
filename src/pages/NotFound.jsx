import Layout from "../components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <main className="mx-auto max-w-2xl px-6 py-28 text-center sm:px-10">
        <p className="eyebrow text-primary">Sandbox</p>
        <h1 className="display mt-5 text-4xl font-semibold">This page isn't built here yet.</h1>
        <p className="mt-5 leading-7 text-muted-foreground">
          This sandbox currently includes Home, Work, and Contact. The rest of the site (Services, Process,
          Pricing, FAQ, About) is ported over in the next phase.
        </p>
        <a href="/" className="mt-8 inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground">
          Back home
        </a>
      </main>
    </Layout>
  );
}
