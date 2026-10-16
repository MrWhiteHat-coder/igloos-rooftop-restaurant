import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { SITE } from "../../lib/config";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/igloo-experience", label: "Igloo Dining" },
  { to: "/celebrations", label: "Celebrations" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function Header() {
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-[0.82rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
      isActive ? "text-gold" : "text-cream/80 hover:text-gold"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-slate-line bg-night/90 backdrop-blur-md"
          : "bg-gradient-to-b from-night/80 to-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="group flex items-center gap-3" aria-label="Igloos Rooftop Restaurant home">
          <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
            <rect width="64" height="64" rx="14" fill="#1c1a22" stroke="#cfa35a" strokeOpacity=".5" />
            <path d="M14 44c8-26 28-26 36 0" fill="none" stroke="#cfa35a" strokeWidth="4" strokeLinecap="round" />
            <path d="M32 18v26M20 30c4 3 20 3 24 0" fill="none" stroke="#cfa35a" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="leading-tight">
            <span className="block font-display text-xl font-semibold text-cream group-hover:text-gold transition-colors">
              Igloos
            </span>
            <span className="block text-[0.6rem] uppercase tracking-[0.3em] text-cream/50">
              Rooftop Restaurant
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/reservations"
            className="rounded-full bg-gradient-to-b from-gold-bright to-gold-deep px-6 py-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-night transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
          >
            Reserve
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-cream lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-slate-line bg-night/95 px-6 pb-8 pt-2 lg:hidden"
        >
          <ul className="flex flex-col divide-y divide-slate-line">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className={linkClass}>
                  <span className="block py-4">{l.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <Link
            to="/reservations"
            className="mt-6 block rounded-full bg-gradient-to-b from-gold-bright to-gold-deep px-6 py-3.5 text-center text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-night"
          >
            Reserve a table
          </Link>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-line bg-night-2/60">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="font-display text-2xl text-gold">Igloos</h3>
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-cream/40">
              Rooftop Restaurant
            </p>
            <p className="mt-5 max-w-xs whitespace-pre-line text-sm text-cream/60" style={{ whiteSpace: "pre-line" }}>
              {SITE.addressLine}
            </p>
          </div>
          <nav aria-label="Footer">
            <h4 className="text-xs uppercase tracking-[0.24em] text-cream/50">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-cream/70 transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h4 className="text-xs uppercase tracking-[0.24em] text-cream/50">Reservations</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
              <li>
                <Link to="/reservations" className="transition-colors hover:text-gold">
                  Reserve a table
                </Link>
              </li>
              <li>Phone · {SITE.phone}</li>
              <li>Email · {SITE.email}</li>
              <li className="whitespace-pre-line">{SITE.hours}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-line pt-6 text-xs text-cream/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Igloos Rooftop Restaurant, Chennai.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="transition-colors hover:text-gold">Privacy</Link>
            <Link to="/terms" className="transition-colors hover:text-gold">Booking terms</Link>
            <Link to="/admin" className="transition-colors hover:text-cream/70">Staff login</Link>
          </div>
        </div>
        {SITE.isPlaceholder && (
          <p className="mt-4 text-center text-[0.7rem] text-cream/35">
            Address, phone, hours and prices on this page are unverified placeholders pending
            confirmation by the business.
          </p>
        )}
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-night">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-night"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
