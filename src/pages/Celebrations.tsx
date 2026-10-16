import { Badge, SectionHeading } from "../components/ui/misc";
import { ButtonLink } from "../components/ui/Button";
import { Cake, HeartHandshake, PartyPopper, Briefcase } from "lucide-react";

const OCCASION_CARDS = [
  {
    icon: Cake,
    title: "Birthdays",
    text: "Cake arrangement, candle service, a sparkler walk (where permitted) and dessert-led plating for the guest of honour.",
  },
  {
    icon: HeartHandshake,
    title: "Anniversaries",
    text: "Flower dressing in an igloo for two, bottled greetings on the table and a commitment-aware service choreography.",
  },
  {
    icon: PartyPopper,
    title: "Celebrations & reunions",
    text: "Composed set menus for gatherings of 10–40, with igloo combos, notes on terrace flow and bespoke desserts.",
  },
  {
    icon: Briefcase,
    title: "Business meals",
    text: "Quiet igloos for dinner meetings, dedicated service pace, and billing arrangements arranged in advance.",
  },
] as const;

export default function Celebrations() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-40 sm:px-8">
      <SectionHeading
        eyebrow="Celebrations"
        title="We do not do 'just a table' for these evenings."
        subtitle="Tell us it's a birthday, an anniversary or a proposal, and the team plans the igloo, the candles, the cake and the course of the evening around it."
      />

      <div
        className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-3 text-center"
        role="note"
      >
        <Badge>Placeholder celebration package details</Badge>
        <p className="w-full text-xs leading-relaxed text-cream/50">
          Package inclusions, prices and decor options shown are configurable placeholders. The
          restaurant confirms actual arrangements after your enquiry.
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {OCCASION_CARDS.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="group relative overflow-hidden rounded-3xl border border-slate-line bg-night-2/70 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-card"
          >
            <div
              aria-hidden="true"
              className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-gold/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <Icon className="h-8 w-8 text-gold" aria-hidden="true" />
            <h3 className="mt-6 font-display text-2xl text-cream">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/60">{text}</p>
          </article>
        ))}
      </div>

      {/* Enquiry flow */}
      <section className="mt-20 rounded-3xl border border-gold/30 bg-night-2/60 p-8 sm:p-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl text-cream sm:text-4xl">
              How a celebration booking flows
            </h2>
            <ol className="mt-8 space-y-6">
              {[
                {
                  h: "1 · Enquiry",
                  t: "Submit the reservation form with your date, party size, occasion and “Private igloo (glass dome)” or terrace preference.",
                },
                {
                  h: "2 · Confirmation call",
                  t: "Our desk confirms igloo availability and celebration options by phone or WhatsApp. Not a confirmation until we speak.",
                },
                {
                  h: "3 · The evening",
                  t: "Arrive to your dressed igloo or terrace table — candles, flowers, cake service arranged with your host.",
                },
              ].map((s) => (
                <li key={s.h} className="border-l-2 border-gold/40 pl-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">{s.h}</p>
                  <p className="mt-2 text-sm leading-relaxed text-cream/65">{s.t}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-slate-line bg-night p-8">
            <h3 className="font-display text-2xl text-gold">Good to know</h3>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-cream/65">
              <li>· Advance notice of 24–48 helps us source cake and decor properly.</li>
              <li>· Guest counts above 40 are arranged on the open-air terrace.</li>
              <li>· Any venue policies, minimum spends or decor fees will be told to you before confirming.</li>
              <li>· All arrangements are subject to final availability at confirmation time.</li>
            </ul>
            <div className="mt-8">
              <ButtonLink to="/reservations">Start the enquiry</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
