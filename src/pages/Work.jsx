import Layout from "../components/Layout";
import CtaBanner from "../components/CtaBanner";
import { WORK_ITEMS } from "../data/work";

function WorkCard({ item }) {
  const body = (
    <>
      {item.mobileUrl ? (
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "8px",
            aspectRatio: "16 / 11",
            width: "100%",
            background: "var(--color-muted)",
          }}
        >
          <img
            src={item.imageUrl}
            alt={`${item.title || "Project"} — desktop view`}
            loading="lazy"
            style={{
              flex: "1.9 1 0",
              minWidth: 0,
              height: "100%",
              width: "100%",
              objectFit: "cover",
              objectPosition: "top left",
              borderRadius: "6px",
            }}
          />
          <img
            src={item.mobileUrl}
            alt={`${item.title || "Project"} — mobile view`}
            loading="lazy"
            style={{
              flex: "1 1 0",
              minWidth: 0,
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              borderRadius: "6px",
            }}
          />
        </div>
      ) : item.imageUrl ? (
        <img src={item.imageUrl} alt={item.title ?? "Veteran Webworks project"} className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-muted px-6 text-center text-base font-semibold text-muted-foreground">
          {item.title}
        </div>
      )}
      <div className="p-7">
        <p className="eyebrow text-primary">{item.status}</p>
        <h2 className="display mt-4 text-3xl font-semibold">{item.title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
        {item.url && (
          <p className="mt-4 text-sm font-medium text-primary">
            Visit site <span aria-hidden="true">&#8599;</span>
          </p>
        )}
      </div>
    </>
  );

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/60"
      >
        {body}
      </a>
    );
  }
  return <article className="overflow-hidden rounded-xl border border-border bg-card">{body}</article>;
}

export default function Work() {
  return (
    <Layout>
      <main>
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-20 sm:px-10 sm:pt-28">
          <p className="eyebrow text-primary">Veteran Webworks</p>
          <h1 className="display mt-5 max-w-5xl text-5xl font-semibold leading-[.94] sm:text-7xl">Our work.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
            A growing portfolio of approved, verifiable work. No invented results or borrowed logos.
          </p>
        </div>
        <section className="mx-6 sm:mx-10">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
            {WORK_ITEMS.map((item) => (
              <WorkCard key={item.title} item={item} />
            ))}
          </div>
        </section>
        <CtaBanner label="Start a Project" />
      </main>
    </Layout>
  );
}
