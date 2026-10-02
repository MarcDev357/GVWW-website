import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export default function CtaBanner({ label = "Book a Strategy Call" }) {
  const to = label === "Find My Best Starting Point" ? "/fit" : "/contact";
  return (
    <section className="mx-6 my-20 overflow-hidden rounded-2xl bg-primary px-6 py-12 text-primary-foreground sm:mx-10 sm:px-12 sm:py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">A smarter next step</p>
          <h2 className="display mt-4 max-w-xl text-4xl font-semibold leading-none sm:text-6xl">
            Build the system your business has been waiting for.
          </h2>
        </div>
        <Link
          to={to}
          className="inline-flex h-11 w-fit items-center rounded-md bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-background/85"
        >
          {label}
          <ArrowUpRight className="ml-2 size-4" />
        </Link>
      </div>
    </section>
  );
}
