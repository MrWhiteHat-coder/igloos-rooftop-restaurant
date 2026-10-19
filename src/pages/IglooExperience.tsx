import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Badge } from "../components/ui/misc";
import { ButtonLink } from "../components/ui/Button";
import { SITE } from "../lib/config";

const INCLUDES = [
  "A private glass igloo held only for your party",
  "Dedicated host attention through the evening",
  "Candle-and-flower table styling on request",
  "Cake timing and celebration plating coordinated with the kitchen",
  "The igloo is yours until the night is ready to end",
];

export default function IglooExperience() {
  const { search } = useLocation();
  useEffect(() => {
    if (search.includes("focus=form")) {
      document.getElementById("igloo-form-cta")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [search]);

  return (
    <div className="pt-16">
      {/* Full-bleed atmospheric header */}
      <section className="relative overflow-hidden">
        <img
          src="/images/photography/skyline.jpg"
          alt="The city skyline at night seen from a rooftop rail — representative editorial photograph"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #10231e 3%, rgba(16,35,30,0.8) 35%, rgba(16,35,30,0.25) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-56 sm:px-8">
          <p className="eyebrow mb-6 flex items-center gap-4 text-brass">
            <span className="h-px w-12 bg-brass/70" aria-hidden="true" />
            The igloo experience
          </p>
          <h1 className="max-w-3xl font-display text-[3rem] font-light leading-[1.02] text-ivory sm:text-[4.8rem]">
            Dinner inside
            <em className="block italic text-brass-2">its own weather.</em>
          </h1>
          <p className="mt-7 max-w-xl text-[1rem] font-light leading-[1.9] text-ivory/70">
            Twelve glass domes above Chennai, each set for between two and ten guests. Rain on
            the glass, stars overhead, the city humming somewhere far below — and a table that
            belongs only to you for the whole evening.
          </p>
          <div className="mt-10">
            <ButtonLink to="/reservations">
              Reserve an igloo
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Editorial split */}
      <section className="bg-forest px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-12">
          <figure className="relative lg:col-span-6">
            <div aria-hidden="true" className="absolute -bottom-3 -right-3 h-full w-full border border-brass/40" />
            <img
              src="/images/photography/interior.jpg"
              alt="A softly lit dining room — representative editorial photograph of private dining ambience"
              loading="lazy"
              className="photo-frame relative h-[340px] w-full object-cover sm:h-[480px]"
            />
          </figure>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="rule-note mb-6">
              <span className="eyebrow">Designed for seclusion</span>
            </p>
            <h2 className="font-display text-4xl font-light leading-[1.1] text-ivory sm:text-5xl">
              Nobody walks past your table here. That's the point.
            </h2>
            <div className="mt-8 space-y-5 text-[0.95rem] font-light leading-[1.9] text-ivory/65">
              <p>
                Igloos insulate the evening from the terrace around them — muffled sound, own
                lighting, own thermostat, own pace of service. Propose, celebrate, or simply sit
                late over the last pour without an audience.
              </p>
              <p>
                The menu follows the same philosophy: a short card, cooked to order, arriving
                when you are ready for it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capacity + inclusions */}
      <section className="bg-ivory text-espresso">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 lg:grid-cols-2">
          <div>
            <p className="rule-note mb-6 text-brass-3">
              <span className="eyebrow">Good to know</span>
            </p>
            <h2 className="font-display text-4xl font-light leading-[1.1] sm:text-5xl">
              Planning an igloo evening
            </h2>
            <p className="mt-7 text-[0.95rem] font-light leading-[1.9] text-espresso/70">
              Domes are limited and fill several days ahead on weekends. Capacity, decor options
              and the igloo menu below are placeholders awaiting confirmation by the restaurant —
              final arrangements are always confirmed by the team at booking.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Badge tone="neutral">Seats 2–10 per igloo</Badge>
              <Badge tone="neutral">{SITE.hours.split("·")[0]}</Badge>
            </div>
            <div id="igloo-form-cta" className="mt-10" />
            <ButtonLink to="/reservations" variant="espresso">
              Reserve your igloo
            </ButtonLink>
          </div>
          <ul className="space-y-5 self-center">
            {INCLUDES.map((line, i) => (
              <li
                key={line}
                className="flex items-start gap-5 border-b border-espresso/15 pb-5 text-[0.95rem] font-light leading-relaxed"
              >
                <span className="font-display text-2xl font-light text-brass-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
