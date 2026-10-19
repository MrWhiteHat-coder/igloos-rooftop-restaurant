import { ButtonAnchor, ButtonLink } from "../components/ui/Button";
import { SITE, mapsDirectionsUrl } from "../lib/config";
import { fetchMenu } from "../lib/data";
import { useEffect, useState } from "react";
import type { MenuItem } from "../lib/types";
import { Badge } from "../components/ui/misc";

/* ─────────────────────────────── HERO ─────────────────────────────── */

function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <img
        src="/images/photography/hero.jpg"
        alt="A rooftop table lit by a single warm lamp above the city at night — representative editorial photograph"
        fetchPriority="high"
        className="cinematic-img absolute inset-0 h-full w-full object-cover"
      />
      {/* dusk-to-forest gradient for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, #10231e 2%, rgba(16,35,30,0.72) 28%, rgba(16,35,30,0.28) 60%, rgba(16,35,30,0.45) 100%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-40 sm:px-8">
        <p className="eyebrow mb-6 flex items-center gap-4 text-brass animate-[fade-up_.9s_ease-out_both]">
          <span className="h-px w-12 bg-brass/70" aria-hidden="true" />
          Private igloo dining · Rooftop · Chennai
        </p>
        <h1 className="max-w-4xl font-display text-[3.4rem] font-light leading-[0.98] text-ivory sm:text-[5.5rem] lg:text-[6.5rem] animate-[fade-up_1.05s_ease-out_both]">
          Your Own
          <br />
          <em className="font-display italic text-brass-2">Little World.</em>
        </h1>
        <p className="mt-8 max-w-xl text-[1.02rem] font-light leading-[1.9] text-ivory/75 animate-[fade-up_1.2s_ease-out_both]">
          Glass igloos above the city, set for two to ten guests — candlight, unhurried courses
          and the skyline drifting past the panes. Evenings made for birthdays, anniversaries
          and quietly remarkable dinners.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-5 animate-[fade-up_1.35s_ease-out_both]">
          <ButtonLink to="/reservations" size="lg">
            Reserve Your Igloo
          </ButtonLink>
          <ButtonLink to="/menu" variant="outline" size="lg">
            Explore the Menu
          </ButtonLink>
        </div>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex">
        <span className="eyebrow text-[0.55rem] text-ivory/50">Scroll</span>
        <span className="scroll-cue animate-[drift_2.6s_ease-in-out_infinite]" aria-hidden="true" />
      </div>
    </section>
  );
}

/* ─────────────────────── EDITORIAL INTRODUCTION ───────────────────── */

function EditorialIntro() {
  return (
    <section className="bg-forest px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Photo left, offset frame */}
          <figure className="relative lg:col-span-5 animate-[fade-up_.8s_ease-out_both]">
            <div aria-hidden="true" className="absolute -left-3 -top-3 h-full w-full border border-brass/40" />
            <img
              src="/images/photography/terrace.jpg"
              alt="The rooftop terrace glowing above the night city — representative editorial photograph"
              loading="lazy"
              className="photo-frame relative h-[300px] w-full object-cover sm:h-[430px]"
            />
          </figure>

          {/* Text right, narrow measure */}
          <div className="lg:col-span-6 lg:col-start-7 animate-[fade-up_1s_ease-out_both]">
            <p className="rule-note mb-6">
              <span className="eyebrow">The dining room is the sky</span>
            </p>
            <h2 className="font-display text-4xl font-light leading-[1.1] text-ivory sm:text-[3.4rem]">
              Twelve igloos. Twelve
              <em className="italic text-brass-2"> small worlds.</em>
            </h2>
            <p className="mt-7 max-w-lg text-[0.95rem] font-light leading-[1.95] text-ivory/65">
              Dinner begins at the lift. A short walk along the parapet, a curtain of warm air,
              and suddenly the city is on the far side of the glass. Courses arrive slowly.
              Conversation lasts. Nobody hurries an igloo.
            </p>
            <p className="mt-5 max-w-lg text-[0.95rem] font-light leading-[1.95] text-ivory/65">
              On the open terrace, longer tables catch the evening breeze — the same kitchen, a
              wider horizon, and room for larger celebrations.
            </p>
            <div className="mt-10">
              <ButtonLink to="/igloo-experience" variant="ghost">
                The igloo experience →
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── SIGNATURE ITEMS (magazine) ──────────────────── */

function SignatureMenu() {
  const [items, setItems] = useState<MenuItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMenu()
      .then(({ items }) => {
        if (!cancelled) setItems(items.filter((i) => i.is_available).slice(0, 4));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const dishPhotos = ["/images/photography/dish-1.jpg", "/images/photography/dish-2.jpg", "/images/photography/dish-4.jpg", "/images/photography/dish-3.jpg"];

  return (
    <section className="bg-ivory text-espresso">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="text-center">
          <p className="rule-note center mb-6 text-brass-3">
            <span className="eyebrow">From the kitchen</span>
          </p>
          <h2 className="font-display text-4xl font-light leading-[1.08] sm:text-6xl">
            Signature plates, <em className="italic">composed nightly</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[0.95rem] font-light leading-[1.85] text-espresso/70">
            A short menu that changes with the season and the catch. Priced on request until the
            kitchen confirms each card — the live menu is always in the restaurant's hands.
          </p>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {(items ?? [1, 2, 3, 4].map((n) => ({ id: n, name: "Tonight's menu", description: null }) as unknown as MenuItem)).map(
            (item, idx) => (
              <article key={item.id} className="group">
                <div className="overflow-hidden">
                  <img
                    src={dishPhotos[idx % dishPhotos.length]}
                    alt={`Representative editorial photograph for ${item.name.toLowerCase()}`}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-5 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-brass-3">
                  No. {String(idx + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-2xl font-medium leading-snug">{item.name}</h3>
                <p className="mt-2 text-[0.85rem] font-light leading-relaxed text-espresso/65">
                  {item.description ?? "Described on the live menu card at table."}
                </p>
                <p className="mt-3 border-b border-espresso/20 pb-1 text-[0.8rem] font-medium tracking-wide">
                  {item.price_inr != null ? `₹${item.price_inr.toLocaleString("en-IN")}` : "Price on request"}
                </p>
              </article>
            )
          )}
        </div>

        <div className="mt-16 text-center">
          <ButtonLink to="/menu" variant="espresso">
            The full menu
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── CELEBRATIONS ───────────────────────────── */

function CelebrationsBand() {
  return (
    <section className="relative overflow-hidden bg-espresso text-ivory">
      <img
        src="/images/photography/celebration.jpg"
        alt="Friends reaching over a shared table mid-celebration — representative editorial photograph"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(48,37,31,0.96) 0%, rgba(48,37,31,0.75) 45%, rgba(48,37,31,0.3) 100%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-28 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="rule-note mb-6">
            <span className="eyebrow">Birthdays · Anniversaries · Proposals</span>
          </p>
          <h2 className="font-display text-4xl font-light leading-[1.08] sm:text-[3.6rem]">
            The evening becomes
            <em className="block italic text-brass-2">the story they retell.</em>
          </h2>
          <p className="mt-7 max-w-lg text-[0.95rem] font-light leading-[1.9] text-ivory/70">
            Flowers at the table. A cake timed to the last course. Your igloo reserved until
            whenever the night is ready to end. Tell us once, and the kitchen and floor team
            compose the rest.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Badge>Igloos seat up to 10</Badge>
            <Badge tone="neutral">Decor options confirmed at booking</Badge>
          </div>
          <div className="mt-10">
            <ButtonLink to="/celebrations" variant="gold">
              Plan a celebration
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── GALLERY BAND ───────────────────────────── */

function GalleryBand() {
  const frames = [
    { src: "/images/photography/service.jpg", alt: "A curated table being set for service — representative editorial photograph", span: "lg:col-span-7" },
    { src: "/images/photography/drink.jpg", alt: "A cocktail in amber light — representative editorial photograph", span: "lg:col-span-5" },
    { src: "/images/photography/skyline.jpg", alt: "The city skyline below the rooftop rail — representative editorial photograph", span: "lg:col-span-5" },
    { src: "/images/photography/hospitality.jpg", alt: "A waiter serving plated dishes — representative editorial photograph", span: "lg:col-span-7" },
  ];
  return (
    <section className="bg-forest px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="rule-note mb-6">
              <span className="eyebrow">The atmosphere</span>
            </p>
            <h2 className="font-display text-4xl font-light leading-[1.08] text-ivory sm:text-6xl">
              Evenings here are <em className="italic text-brass-2">slow, and worth it.</em>
            </h2>
          </div>
          <ButtonLink to="/gallery" variant="ghost" className="text-brass">
            View the gallery →
          </ButtonLink>
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          {frames.map((f) => (
            <figure key={f.src} className={`${f.span} overflow-hidden`}>
              <img
                src={f.src}
                alt={f.alt}
                loading="lazy"
                className="photo-frame aspect-[3/2] h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
            </figure>
          ))}
        </div>
        <p className="mt-8 text-[0.7rem] font-light tracking-wide text-ivory/40">
          Representative editorial imagery. Photographs of the actual terrace are added by the
          restaurant from the admin console.
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── VISIT / INFO ───────────────────────────── */

function VisitInfo() {
  return (
    <section className="bg-ivory-2 text-espresso">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2">
        <div>
          <p className="rule-note mb-6 text-brass-3">
            <span className="eyebrow">Find us above the city</span>
          </p>
          <address className="not-italic">
            <p className="font-display text-3xl font-light leading-snug whitespace-pre-line">
              {SITE.addressLine}
            </p>
          </address>
          <p className="mt-6 text-sm font-light text-espresso/60">
            {SITE.isPlaceholder
              ? "Address shown is a configurable placeholder pending confirmation by the business."
              : null}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonAnchor
              variant="outline"
              size="sm"
              href={mapsDirectionsUrl(SITE.mapQuery)
                .replace(/%20/g, "+")}
              className="border-espresso/30 text-espresso hover:border-brass-3 hover:text-brass-3"
            >
              Directions
            </ButtonAnchor>
            <ButtonLink to="/contact" variant="ghost" size="sm" className="text-espresso hover:text-brass-3">
              Contact page →
            </ButtonLink>
          </div>
        </div>
        <dl className="grid gap-8 sm:grid-cols-2">
          <div>
            <dt className="eyebrow text-brass-3">Hours</dt>
            <dd className="mt-3 text-sm font-light leading-relaxed text-espresso/75 whitespace-pre-line">
              {SITE.hours}
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-brass-3">Reservations</dt>
            <dd className="mt-3 text-sm font-light leading-relaxed text-espresso/75">
              <a className="hover:text-brass-3" href={`tel:+${SITE.whatsappNumber}`}>{SITE.phone}</a>
              <br />
              <a className="hover:text-brass-3" href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <br />
              <ButtonLink to="/reservations" variant="ghost" size="sm" className="mt-2 text-espresso hover:text-brass-3">
                Reserve online →
              </ButtonLink>
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-brass-3">Private igloos</dt>
            <dd className="mt-3 text-sm font-light leading-relaxed text-espresso/75">
              Two to ten guests per dome. Larger parties welcome on the open terrace.
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-brass-3">Dress</dt>
            <dd className="mt-3 text-sm font-light leading-relaxed text-espresso/75">
              Smart-casual evenings. The rooftop can be breezy after dark.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <EditorialIntro />
      <SignatureMenu />
      <CelebrationsBand />
      <GalleryBand />
      <VisitInfo />
    </>
  );
}
