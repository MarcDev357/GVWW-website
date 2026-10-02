import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { NAV } from "../nav";
import CartIcon from "./CartIcon";
import PromoBanner from "./PromoBanner";
import logo from "../assets/veteran-webworks-logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <PromoBanner />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        <Link to="/" aria-label="Veteran Webworks home" className="flex items-center rounded-md bg-white px-2 py-1">
          <img src={logo} alt="Veteran Webworks" className="h-9 w-auto max-w-[13rem] object-contain sm:h-10" />
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
          <CartIcon className="text-muted-foreground hover:text-foreground" />
          <a
            href="/book"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Your Project
          </a>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <CartIcon className="text-foreground" />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border px-6 py-5 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block border-b border-border py-3 text-sm"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="/book"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Start Your Project
          </a>
        </nav>
      )}
    </header>
  );
}
