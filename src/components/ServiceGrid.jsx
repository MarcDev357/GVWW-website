import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "../data/services";

export default function ServiceGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((service, i) => (
        <Link
          key={service.slug}
          to={`/services/${service.slug}`}
          aria-label={`Explore ${service.name}`}
          className="hover-lift group block min-h-64 rounded-xl border border-border bg-card p-7 transition-colors focus-visible:border-primary focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="text-primary">{String(i + 1).padStart(2, "0")}</span>
          <h2 className="display mt-12 text-2xl font-semibold">{service.name}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{service.short}</p>
          <span className="mt-6 inline-flex items-center text-sm text-primary">
            Explore service
            <ArrowUpRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      ))}
    </div>
  );
}
