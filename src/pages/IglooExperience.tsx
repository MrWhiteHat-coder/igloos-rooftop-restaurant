import { Badge, SectionHeading } from "../components/ui/misc";
import { ButtonLink } from "../components/ui/Button";
import { Snowflake, MoonStar, Wine, Users, Gift, CheckCircle2 } from "lucide-react";

const FEATURES = [
  {
    icon: Snowflake,
    title: "All-weather glass domes",
    text: "Transparent domes put the monsoon, the sea breeze and the skyline around your table — while keeping heat, sound and street noise outside.",
  },
  {
    icon: MoonStar,
    title: "Candle-lit, star-lit",
    text: "Each igloo is dressed with warm fairy lights and a candle table. Golden-hour openings and late-night steamer placements turn them into their own ambience.",
  },
  {
    icon: Wine,
    title: "Curated pairings",
    text: "Dedicated igloo menus, dessert theatre and drink pairings are coordinated with a single host who looks after your dome the entire evening.",
  },
  {
    icon: Users,
    title: "Made for two to ten",
    text: "Igloos seat up to ten guests comfortably. Larger groups can book several domes together or prefer the open-air terrace.",
  },
] as const;

const INCLUSIONS = [
  "Private seating away from the main terrace",
  "Personalised welcome signage (placeholder feature list)",
  "Candle + flower table styling on request",
  "Assistance with cakes and celebration plating",
  "Priority attention from a dedicated host",
] as const;

export default function IglooExperience() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex items-center overflow-hidden">
        <img
          src="/images/igloo-placeholder.svg"
          alt="Illustration of a glass igloo with a candle-lit table for two — placeholder imagery"
          className="absolute inset-0 h-full w-full object-cover animate-[fade-in_1s_ease-out]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(20,18,22,.96) 0%, rgba(20,18,22,.6) 55%, rgba(20,18,22,.25) 100%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-44 sm:px-8">
          <div className="max-w-2xl animate-[fade-up_.9s_ease-out]">
            <p className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.34em] text-gold">
              <span className="h-px w-10 bg-gold/70" aria-hidden="true" />
              The igloo experience
            </p>
            <h1 className="font-display text-5xl leading-[1.05] text-cream sm:text-6xl">
              A private evening in a <span className="text-gold-gradient italic">glass dome</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/70">
              Twelve igloos, each sealed by its own little world — glowing panes, candlelight and
              a dinner that extends above Chennai while the city argues about traffic below.
            </p>
            <div className="mt-10">
              <ButtonLink to="/reservations" size="lg">
                Request an igloo evening
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <SectionHeading
          eyebrow="What makes it different"
          title="The dome does the celebrating for you"
          subtitle="Everything about an igloo evening is intentionally private — no twelve guests seated with dinner across the terrace, no walk-ins at your table's elbow."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="group rounded-3xl border border-slate-line bg-night-2/70 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-card"
            >
              <Icon className="h-8 w-8 text-gold" aria-hidden="true" />
              <h3 className="mt-6 font-display text-2xl text-cream">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/60">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Inclusions + capacity */}
      <section className="border-y border-slate-line bg-night-2/40">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Good to know"
              title="Planning your igloo evening"
            />
            <p className="mt-8 text-sm leading-relaxed text-cream/60">
              Igloos are in high demand on Friday, Saturday and Sunday evenings. Bookings are
              confirmed by our reservations desk after availability checks — an enquiry does not
              guarantee a dome. Capacity, decor options and igloo menus below are placeholders
              until authenticated with the business.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Badge>Seats up to 10 guests</Badge>
              <Badge>Dinner service · 6:30 PM – 11:30 PM</Badge>
              <Badge tone="neutral">Weekend slots book several days ahead</Badge>
            </div>
          </div>
          <ul className="space-y-4 rounded-3xl border border-slate-line bg-night-2/70 p-8">
            {INCLUSIONS.map((line) => (
              <li key={line} className="flex items-start gap-3 text-sm text-cream/75">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                {line}
              </li>
            ))}
            <li className="pt-2 text-xs text-cream/40">
              Final inclusions, charges (if any) and policies are confirmed by the restaurant at
              the time of booking.
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <Gift className="mx-auto h-10 w-10 text-gold" aria-hidden="true" />
        <h2 className="mt-6 font-display text-4xl text-cream sm:text-5xl">
          Choose your dome, choose your date.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-cream/65">
          Select “Private igloo (glass dome)” as your dining preference on the reservation form —
          we will arrange everything from there.
        </p>
        <div className="mt-10 flex justify-center">
          <ButtonLink to="/reservations" size="lg">
            Reserve an igloo
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
