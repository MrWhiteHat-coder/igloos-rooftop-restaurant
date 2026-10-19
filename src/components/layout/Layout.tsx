import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { SITE } from "../../lib/config";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/igloo-experience", label: "Igloo Dining" },
  { to: "/menu", label: "Menu" },
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

/** Small engraved-style brand wordmark. */
export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <svg
        width={compact ? 26 : 30}
        height={compact ? 26 : 30}
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M16 44c7-22 25-22 32 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="32" cy="30" r="11" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M32 19v22" stroke="currentColor" strokeWidth="2" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-[1.35rem] font-medium tracking-[0.08em]">
          IGLOOS
        </span>
        <span className="mt-1 block text-[0.55rem] font-normal uppercase tracking-[0.42em] text-current opacity-70">
          Rooftop · Chennai
        </span>
      </span>
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

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
    `relative py-1 text-[0.7rem] font-medium uppercase tracking-[0.22em] transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-brass after:transition-all after:duration-300 ${
      isActive
        ? "text-brass after:w-full"
        : "text-ivory/75 after:w-0 hover:text-ivory hover:after:w-full"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-ivory/10 bg-forest/95 backdrop-blur-md"
          : "bg-gradient-to-b from-forest/70 to-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          to="/"
          className="text-brass transition-opacity hover:opacity-80"
          aria-label="Igloos Rooftop Restaurant home"
        >
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden xl:block">
          <Link
            to="/reservations"
            className="border border-brass/60 px-6 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-brass transition-all duration-300 hover:bg-brass hover:text-forest"
          >
            Reserve
          </Link>
        </div>

        <button
          className="rounded-sm p-2 text-ivory xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 7h18M3 12h18M3 17h12" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-ivory/10 bg-forest/97 px-7 pb-10 pt-1 xl:hidden"
        >
          <ul>
            {NAV_LINKS.map((l, i) => (
              <li key={l.to} className="border-b border-ivory/8">
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `block py-4 font-display text-2xl font-light tracking-wide transition-colors ${
                      isActive ? "text-brass" : "text-ivory/85 hover:text-ivory"
                    }`
                  }
                >
                  <span className="mr-3 text-[0.6rem] font-body text-brass/60 align-super">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link
            to="/reservations"
            className="mt-8 block bg-brass px-6 py-4 text-center text-[0.72rem] font-medium uppercase tracking-[0.22em] text-forest"
          >
            Reserve your igloo
          </Link>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ivory/10 bg-forest-2">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <span className="text-brass">
              <Wordmark />
            </span>
            <p className="mt-6 max-w-xs text-sm font-light leading-relaxed text-ivory/55">
              Private igloo dining and unhurried celebrations above the city — candle-lit, quiet
              and entirely yours for the evening.
            </p>
            <p className="mt-8 eyebrow text-brass">Dusk till late</p>
          </div>

          <nav aria-label="Footer">
            <h4 className="eyebrow text-ivory/40">Explore</h4>
            <ul className="mt-5 space-y-3 text-sm font-light">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-ivory/70 transition-colors hover:text-brass">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="eyebrow text-ivory/40">Reservations</h4>
            <ul className="mt-5 space-y-3 text-sm font-light text-ivory/70">
              <li>
                <Link to="/reservations" className="transition-colors hover:text-brass">
                  Reserve a table
                </Link>
              </li>
              <li>
                <a href={`tel:+${SITE.whatsappNumber}`} className="transition-colors hover:text-brass">
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-brass">
                  {SITE.email}
                </a>
              </li>
              <li className="whitespace-pre-line leading-relaxed">{SITE.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-ivory/10 pt-7 text-[0.7rem] font-light tracking-wide text-ivory/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Igloos Rooftop Restaurant, Chennai.</p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-brass">Privacy</Link>
            <Link to="/terms" className="transition-colors hover:text-brass">Booking terms</Link>
            <Link to="/admin" className="transition-colors hover:text-ivory/70">Staff login</Link>
          </div>
        </div>
        {SITE.isPlaceholder && (
          <p className="mt-5 text-[0.65rem] font-light text-ivory/30">
            Address, phone, hours and prices are unverified placeholders pending confirmation by
            the business. Photography is representative editorial imagery, not photographs of the
            restaurant — see public/images/photography/CREDITS.md.
          </p>
        )}
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-forest">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-brass focus:px-4 focus:py-2 focus:text-forest"
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
