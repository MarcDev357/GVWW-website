import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { NAV } from "../nav";
import logo from "../assets/veteran-webworks-logo.png";

export default function Footer() {
  return (
    <footer className="section-rule mt-24 px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex rounded-md bg-white px-3 py-2">
            <img src={logo} alt="Veteran Webworks" className="h-12 w-auto max-w-[14rem] object-contain" />
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Websites, automation, local growth, and AI front-office systems for service businesses.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-muted-foreground sm:grid-cols-3">
          <div className="col-span-2 mb-1 text-xs uppercase tracking-[.16em] text-primary sm:col-span-3">
            Explore the path
          </div>
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}
          <Link to="/about" className="transition-colors hover:text-primary">
            About
          </Link>
          <Link to="/contact" className="text-foreground hover:text-primary">
            Book a call <ArrowUpRight className="inline size-3" />
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <span>Veteran-owned &middot; clear scope &middot; practical growth systems</span>
        <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Link to="/privacy" className="transition-colors hover:text-primary">Privacy Policy</Link>
          <Link to="/terms" className="transition-colors hover:text-primary">Terms of Service</Link>
          <span>&copy; {new Date().getFullYear()} Veteran Webworks</span>
        </span>
      </div>
    </footer>
  );
}
