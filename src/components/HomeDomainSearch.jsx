import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export default function HomeDomainSearch() {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const q = value.trim();
    window.location.href = q ? `/domains?q=${encodeURIComponent(q)}` : "/domains";
  }

  return (
    <div className="mt-7">
      <p className="text-xs font-medium uppercase tracking-[.1em] text-muted-foreground">
        Check if your domain name is available
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-2 flex max-w-sm items-center gap-1 rounded-full border border-border bg-card py-1 pl-4 pr-1"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="yourbusiness.com"
          aria-label="Domain name"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Search domain availability"
          className="flex size-8 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowUpRight className="size-4" />
        </button>
      </form>
    </div>
  );
}
