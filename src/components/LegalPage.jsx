import Layout from "./Layout";

function Block({ block }) {
  if (typeof block === "string") return <p>{block}</p>;
  if (block.list) {
    return (
      <ul className="list-disc space-y-3 pl-6">
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.lead) {
    return (
      <p>
        <strong className="text-foreground">{block.lead}</strong> {block.text}
      </p>
    );
  }
  if (block.caps) return <p className="text-sm leading-6">{block.caps}</p>;
  return null;
}

export default function LegalPage({ title, doc }) {
  return (
    <Layout>
      <main>
        <div className="mx-auto max-w-4xl px-6 pb-8 pt-20 sm:px-10 sm:pt-28">
          <p className="eyebrow text-primary">Legal</p>
          <h1 className="display mt-5 text-5xl font-semibold leading-[.94] sm:text-6xl">{title}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{doc.subtitle}</p>
          <p className="mt-2 text-sm text-muted-foreground">Effective Date: {doc.effective}</p>
        </div>
        <article className="mx-6 sm:mx-10">
          <div className="mx-auto max-w-4xl space-y-10 border-t border-border py-12 text-base leading-7 text-muted-foreground">
            {doc.sections.map((section) => (
              <section key={section.title}>
                <h2 className="display text-2xl font-semibold text-foreground">{section.title}</h2>
                <div className="mt-4 space-y-4">
                  {section.blocks.map((block, i) => (
                    <Block key={i} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
    </Layout>
  );
}
