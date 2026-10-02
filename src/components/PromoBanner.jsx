import { useState } from "react";
import { Globe, X } from "lucide-react";

const KEY = "vwPromoDomainDismissed";

function wasDismissed() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export default function PromoBanner() {
  const [hidden, setHidden] = useState(wasDismissed);
  if (hidden) return null;

  function dismiss() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setHidden(true);
  }

  return (
    <div className="border-b border-primary/30 bg-primary/15">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-2 text-sm sm:px-10">
        <Globe className="hidden size-4 shrink-0 text-primary sm:block" />
        <p className="flex-1 leading-5">
          <span className="font-semibold text-primary">Limited time:</span> your first-year domain name is free with
          any website build.{" "}
          <a href="/domains" className="whitespace-nowrap font-medium underline underline-offset-4 hover:text-primary">
            Search domains
          </a>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss promotion"
          className="shrink-0 rounded p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
