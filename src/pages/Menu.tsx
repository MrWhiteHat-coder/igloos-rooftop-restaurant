import { useEffect, useMemo, useState } from "react";
import { fetchMenu, type MenuData } from "../lib/data";
import { ConfigNotice, SectionHeading, Spinner, EmptyState } from "../components/ui/misc";
import { ButtonLink } from "../components/ui/Button";

const DISH_PHOTOS = [
  "/images/photography/dish-1.jpg",
  "/images/photography/dish-2.jpg",
  "/images/photography/dish-3.jpg",
  "/images/photography/dish-4.jpg",
  "/images/photography/drink.jpg",
];

export default function Menu() {
  const [data, setData] = useState<MenuData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchMenu()
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const q = query.trim().toLowerCase();
  const items = useMemo(() => {
    if (!data) return [];
    return data.items.filter((i) => {
      if (activeCategory !== null && i.category_id !== activeCategory) return false;
      if (!q) return true;
      const catName =
        data.categories.find((c) => c.id === i.category_id)?.name.toLowerCase() ?? "";
      return [i.name.toLowerCase(), (i.description ?? "").toLowerCase(), catName]
        .some((s) => s.includes(q));
    });
  }, [data, q, activeCategory]);

  if (loading) return <div className="pt-32"><Spinner label="Composing tonight's menu" /></div>;

  return (
    <div className="pt-24">
      {/* Page masthead */}
      <section className="bg-ivory text-espresso">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pt-28">
          <SectionHeading
            tone="light"
            align="left"
            eyebrow="The Menu"
            title="Composed for sharing, priced on request."
            subtitle="A seasonal snapshot of the kitchen. Every card below is edited live by the restaurant — what you see here is exactly what the team has published."
          />
          {error ? null : (
            <div className="mt-14 max-w-3xl">
              <label className="relative block">
                <span className="sr-only">Search menu items</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search dishes — “paneer”, “grilled”, “dessert”…"
                  className="w-full border-b border-espresso/25 bg-transparent py-4 pr-4 text-espresso placeholder:text-espresso/40 focus:border-brass-3 focus:outline-none"
                />
                <svg
                  aria-hidden="true"
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                  className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-espresso/40"
                >
                  <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
                </svg>
              </label>
              <div className="mt-8 flex flex-wrap gap-2">
                <Chip active={activeCategory === null} onClick={() => setActiveCategory(null)} light>
                  All
                </Chip>
                {data?.categories.map((c) => (
                  <Chip
                    key={c.id}
                    active={activeCategory === c.id}
                    onClick={() => setActiveCategory(c.id)}
                    light
                  >
                    {c.name}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Items */}
      <section className="bg-ivory-2 pb-28 text-espresso">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {error ? (
            <div className="pt-4">
              <ConfigNotice />
            </div>
          ) : (
            <>
              <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, idx) => {
                  const cat =
                    data?.categories.find((c) => c.id === item.category_id)?.name ?? "";
                  return (
                    <article
                      key={item.id}
                      className={`group ${item.is_available ? "" : "opacity-70"}`}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={DISH_PHOTOS[idx % DISH_PHOTOS.length]}
                          alt={`Representative editorial photograph for ${item.name.toLowerCase()}`}
                          loading="lazy"
                          className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        {!item.is_available && (
                          <span className="absolute left-4 top-4 bg-espresso/85 px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-ivory">
                            Off tonight
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline justify-between gap-4 border-b border-espresso/20 pb-4">
                        <h2 className="mt-5 font-display text-[1.7rem] font-medium leading-snug">
                          {item.is_veg && (
                            <span
                              className="mr-2 inline-block h-2.5 w-2.5 rounded-full border border-emerald-700 align-middle"
                              title="Vegetarian"
                            />
                          )}
                          {item.name}
                        </h2>
                        <span className="shrink-0 font-display text-xl text-brass-3">
                          {item.price_inr != null
                            ? `₹${item.price_inr.toLocaleString("en-IN")}`
                            : "Price on request"}
                        </span>
                      </div>
                      <p className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.28em] text-brass-3/80">
                        {cat}
                      </p>
                      {item.description && (
                        <p className="mt-3 text-[0.9rem] font-light leading-[1.8] text-espresso/70">
                          {item.description}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>

              {items.length === 0 && (
                <div className="mt-12 max-w-xl">
                  <EmptyState title="Nothing matches that search">
                    Try another word, or clear the category filter.
                  </EmptyState>
                </div>
              )}

              <div className="mt-24 border-t border-espresso/15 pt-12 text-center">
                <p className="mx-auto max-w-md font-display text-2xl font-light">
                  The right table makes the menu taste better.
                </p>
                <div className="mt-8">
                  <ButtonLink to="/reservations" variant="espresso">
                    Reserve your igloo
                  </ButtonLink>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  light,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`border px-4 py-2 text-[0.65rem] font-medium uppercase tracking-[0.18em] transition-all duration-300 ${
        active
          ? light
            ? "border-brass-3 bg-brass-3 text-ivory"
            : "border-brass bg-brass text-forest"
          : light
            ? "border-espresso/20 text-espresso/60 hover:border-brass-3 hover:text-brass-3"
            : "border-ivory/20 text-ivory/60 hover:border-brass hover:text-brass"
      }`}
    >
      {children}
    </button>
  );
}
