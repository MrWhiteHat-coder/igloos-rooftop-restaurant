import { Badge, SectionHeading } from "../components/ui/misc";
import { ButtonLink } from "../components/ui/Button";

const OCCASIONS = [
  {
    no: "01",
    title: "Birthdays",
    text: "Cake timed to the last course, candles lit without prompting, and a table that never feels hurried. For the guest of honour, a small plated surprise from the kitchen.",
  },
  {
    no: "02",
    title: "Anniversaries",
    text: "An igloo for two, flowers at dusk, and service that disappears at exactly the right moments. Bring the year you met — we'll keep the rest between us.",
  },
  {
    no: "03",
    title: "Gatherings & reunions",
    text: "Long terrace tables under the lights for groups of ten to forty, with set menus composed for sharing the way celebrations actually happen.",
  },
  {
    no: "04",
    title: "Business dinners",
    text: "Quiet igloos for the conversations that matter, a service pace calibrated to the meeting rather than the clock, and billing arranged discreetly in advance.",
  },
];

export default function Celebrations() {
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="relative overflow-hidden">
        <img
          src="/images/photography/celebration.jpg"
          alt="Hands reaching across a table mid-celebration — representative editorial photograph"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #10231e 4%, rgba(16,35,30,0.82) 40%, rgba(16,35,30,0.3) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-56 sm:px-8">
          <p className="eyebrow mb-6 flex items-center gap-4 text-brass">
            <span className="h-px w-12 bg-brass/70" aria-hidden="true" />
            Celebrations
          </p>
          <h1 className="max-w-3xl font-display text-[3rem] font-light leading-[1.02] text-ivory sm:text-[4.6rem]">
            The evenings that become
            <em className="block italic text-brass-2">a story retold.</em>
          </h1>
          <p className="mt-7 max-w-xl text-[1rem] font-light leading-[1.9] text-ivory/70">
            Birthdays, anniversaries, proposals and family reunions — tell us the occasion once
            and the kitchen, the flowers and the timing are arranged around it.
          </p>
        </div>
      </section>

      {/* Occasion list — editorial numbering */}
      <section className="bg-forest px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-0">
            {OCCASIONS.map((o) => (
              <article
                key={o.no}
                className="group grid gap-6 border-b border-ivory/10 py-10 first:border-t sm:grid-cols-[80px_1fr] sm:gap-10"
              >
                <span className="font-display text-3xl font-light text-brass/70 transition-colors group-hover:text-brass">
                  {o.no}
                </span>
                <div>
                  <h2 className="font-display text-3xl font-light text-ivory sm:text-4xl">
                    {o.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-[0.95rem] font-light leading-[1.9] text-ivory/60">
                    {o.text}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14">
            <Badge tone="neutral">Package inclusions, prices and decor options await confirmation by the business</Badge>
          </div>
        </div>
      </section>

      {/* Enquiry flow */}
      <section className="bg-ivory text-espresso">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 lg:grid-cols-2">
          <div>
            <SectionHeading
              tone="light"
              align="left"
              eyebrow="How it works"
              title="Three steps to the evening."
            />
            <ol className="mt-12 space-y-9">
              {[
                {
                  h: "Send the enquiry",
                  t: "Pick the date, party size and occasion on the reservation form. Choose “Private igloo” if the dome is the point.",
                },
                {
                  h: "We call to compose it",
                  t: "Our desk confirms igloo availability and celebration options by phone or WhatsApp. Nothing is final until we have spoken.",
                },
                {
                  h: "Arrive to your evening",
                  t: "Your dressed igloo or terrace table — candles, flowers, cake service orchestrated with your host.",
                },
              ].map((s, i) => (
                <li key={s.h} className="grid grid-cols-[64px_1fr] gap-6 border-b border-espresso/15 pb-8">
                  <span className="font-display text-3xl font-light text-brass-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-medium">{s.h}</h3>
                    <p className="mt-2 text-[0.92rem] font-light leading-[1.85] text-espresso/70">{s.t}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <aside className="self-center border border-espresso/15 bg-ivory-2 p-10">
            <h3 className="font-display text-3xl font-light">Good to know</h3>
            <ul className="mt-7 space-y-4 text-[0.9rem] font-light leading-relaxed text-espresso/70">
              <li>· 24–48 hours notice helps us source cake and decor properly</li>
              <li>· Parties above 40 guests are arranged on the open terrace</li>
              <li>· Venue policies, minimum spends or decor fees are confirmed before booking</li>
              <li>· Arrangements are always subject to final availability</li>
            </ul>
            <p className="mt-8 text-xs font-light text-espresso/50">
              Package details shown are awaiting confirmation — the team confirms actual
              arrangements with your enquiry.
            </p>
            <div className="mt-9">
              <ButtonLink to="/reservations" variant="espresso">
                Start the enquiry
              </ButtonLink>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
