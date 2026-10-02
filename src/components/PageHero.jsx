export default function PageHero({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-14 pt-20 sm:px-10 sm:pt-28">
      <p className="eyebrow text-primary">{eyebrow}</p>
      <h1 className="display mt-5 max-w-5xl text-5xl font-semibold leading-[.94] sm:text-7xl">{title}</h1>
      <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p>
    </div>
  );
}
