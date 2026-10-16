import { ButtonAnchor, ButtonLink } from "../components/ui/Button";
import { SectionHeading, Badge } from "../components/ui/misc";
import { SITE, mapsDirectionsUrl } from "../lib/config";
import { ArrowRight, MapPin, Sparkles, Utensils, Wine } from "lucide-react";

const HIGHLIGHT_CARDS = [
  {
    icon: Sparkles,
    title: "Private Igloo Dining",
    text: "Twelve glass igloos, each set for two to ten guests, glowing with candlelight against the Chennai skyline.",
    href: "/igloo-experience",
  },
  {
    icon: Utensils,
    title: "Celebration Menus",
    text: "Birthday cake arrangements, anniversary plating and curated set menus choreographed with our kitchen.",
    href: "/celebrations",
  },
  {
    icon: Wine,
    title: "Skyline evenings",
    text: "Pan-Indian and continental plates, and a bar buffet, being dessert theatre and rooftop sensorials.",
    href: "/menu",
  },
] as const;

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <img
          src="/images/hero-placeholder.svg"
          alt="Stylised rooftop skyline with glowing glass igloos — placeholder imagery"
          className="absolute inset-0 h-full w-full object-cover animate-[fade-in_1.2s_ease-out]"
        />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to top, rgba(20,18,22,.94) 4%, rgba(20,18,22,.55) 40%, rgba(20,18,22,.25) 70%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-44 sm:px-8">
          <div className="max-w-2xl animate-[fade-up_.9s_ease-out]">
            <p className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.34em] text-gold">
              <span className="h-px w-10 bg-gold/70" aria-hidden="true" />
              Rooftop dining · Chennai
            </p>
            <h1 className="font-display text-5xl leading-[1.05] text-cream sm:text-7xl">
              Dine above the city,
              <br />
              <span className="text-gold-gradient italic">inside your private sky.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/70">
              Igloos Rooftop Restaurant pairs a candle-lit rooftop terrace with fully private
              glass igloos — for unhurried dinners, birthdays, anniversaries and evenings that
              deserve an address of their own.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ButtonLink to="/reservations" size="lg">
                Reserve your table
              </ButtonLink>
              <ButtonAnchor
                variant="outline"
                size="lg"
                href={mapsDirectionsUrl(SITE.mapQuery)}
              >
                <MapPin size={16} aria-hidden="true" /> Find us
              </ButtonAnchor>
            </div>
          </div>
        </div>
      </section>

      {/* Dining highlights */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <SectionHeading
          eyebrow="The Experience"
          title="Three ways to spend an evening"
          subtitle="From a secluded igloo for two to a terrace table for twenty — every evening at Igloos is composed, plated and lit like an occasion."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {HIGHLIGHT_CARDS.map(({ icon: Icon, title, text, href }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-3xl border border-slate-line bg-night-2/70 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-card"
            >
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/10 blur-2xl transition-opacity duration-500 group-hover:bg-gold/20"
              />
              <Icon className="h-8 w-8 text-gold" aria-hidden="true" />
              <h3 className="mt-6 font-display text-2xl text-cream">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/60">{text}</p>
              <a
                href={href}
                className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold transition-transform duration-300 group-hover:translate-x-1"
              >
                Explore <ArrowRight size={14} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Quote band */}
      <section className="border-y border-slate-line bg-night-2/40">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <p className="font-display text-3xl italic leading-relaxed text-cream/85 sm:text-4xl">
            “A table under the stars is not booked. It is earned — one candle at a time.”
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-cream/40">
            The Igloos kitchen brigade
          </p>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 80% at 50% 120%, rgba(207,163,90,.22), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
          <Badge>Reservations open · {SITE.hours}</Badge>
          <h2 className="mt-6 font-display text-4xl text-cream sm:text-6xl">
            Your evening starts with
            <span className="text-gold-gradient italic"> a single request.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-cream/65">
            Tell us the date, the party and the occasion. Our reservations desk confirms (by call
            or WhatsApp) after checking igloo and terrace availability — an enquiry alone is not a
            confirmed booking.
          </p>
          <div className="mt-10 flex justify-center">
            <ButtonLink to="/reservations" size="lg">
              Reserve now <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
