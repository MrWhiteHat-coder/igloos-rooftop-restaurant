import { useEffect, useMemo, useState } from "react";
import { fetchMenu, type MenuData } from "../lib/data";
import { Badge, ConfigNotice, SectionHeading, Spinner, EmptyState } from "../components/ui/misc";
import { Search, Leaf } from "lucide-react";
import { ButtonLink } from "../components/ui/Button";

function useMenuData() {
  const [data, setData] = useState<MenuData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchMenu()
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "An error occurred while loading the menu.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error, loading };
}

export default function Menu() {
  const { data, error, loading } = useMenuData();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const q = query.trim().toLowerCase();
  const items = useMemo(() => {
    if (!data) return [];
    return data.items.filter((i) => {
      if (activeCategory && String(activeCategory) !== String(i.category_id)) return false;
      if (!q) return true;
      const catName =
        data.categories.find((c) => c.id === i.category_id)?.name.toLowerCase() ?? "";
      const hay = [
        i.name.toLowerCase(),
        (i.description ?? "").toLowerCase(),
        catName,
        i.is_veg === true ? "veg vegetarian" : i.is_veg === false ? "non-veg" : "",
      ];
      return hay.some((s) => s.includes(q));
    });
  }, [data, q, activeCategory]);

  if (loading) return <Spinner label="Plating the menu" />;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-36 sm:px-8">
      <SectionHeading
        eyebrow="The Menu"
        title="Composed for sharing"
        subtitle="Pan-Indian and continental plates, built for a rooftop evening. Item photographs, prices and availability are managed live by the restaurant."
      />

      {/* Placeholder notice: prices are unverified until admin edits the menu. */}
      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gold/30 bg-gold/5 px-6 py-4 text-center text-xs leading-relaxed text-cream/60">
        Dishes and prices shown here are configured placeholders. Only what the restaurant's team
        publishes in the admin console should be treated as the live menu.
      </div>

      {error ? (
        <div className="mt-14">
          <ConfigNotice />
        </div>
      ) : !data ? null : (
        <>
          {/* Search + category chips */}
          <div className="mx-auto mt-14 max-w-3xl">
            <div className="relative">
              <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-cream/40"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes, e.g. “paneer”, “kebab”, “dessert”…"
                aria-label="Search menu items"
                className="w-full rounded-full border border-cream/15 bg-night-2/80 py-4 pl-14 pr-5 text-cream placeholder:text-cream/35 focus:border-gold/70"
              />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              <Chip active={activeCategory === null} onClick={() => setActiveCategory(null)}>
                All
              </Chip>
              {data.categories.map((c) => (
                <Chip
                  key={c.id}
                  active={String(activeCategory) === String(c.id)}
                  onClick={() => setActiveCategory(c.id)}
                >
                  {c.name}
                </Chip>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const cat =
                data.categories.find((c) => c.id === item.category_id)?.name ?? "";
              return (
                <article
                  key={item.id}
                  className={`group flex flex-col overflow-hidden rounded-3xl border bg-night-2/70 transition-all duration-500 ${
                    item.is_available
                      ? "border-slate-line hover:-translate-y-1 hover:border-gold/50 hover:shadow-card"
                      : "border-slate-line/50 opacity-60"
                  }`}
                >
                  <div className="relative h-52 overflow-hidden">
                    {/* Dish image is a Storage path in production; fall back to placeholder art. */}
                    <img
                      src="/images/dish-placeholder.svg"
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {item.is_veg === true && (
                      <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-emerald-600/50 bg-night/80 px-3 py-1 text-[0.7rem] text-emerald-300">
                        <Leaf size={12} aria-hidden="true" /> Veg
                      </span>
                    )}
                    {!item.is_available && (
                      <span className="absolute right-4 top-4 rounded-full border border-red-400/40 bg-night/80 px-3 py-1 text-[0.7rem] uppercase tracking-wider text-red-300">
                        Sold out today
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[0.65rem] uppercase tracking-[0.28em] text-gold/80">{cat}</p>
                    <h3 className="mt-2 font-display text-2xl text-cream">{item.name}</h3>
                    {item.description && (
                      <p className="mt-2 text-sm leading-relaxed text-cream/55">{item.description}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-6">
                      <span className="font-display text-2xl text-gold">
                        {item.price_inr != null
                          ? `₹${item.price_inr.toLocaleString("en-IN")}`
                          : "Price on request"}
                      </span>
                      <Badge tone={item.is_available ? "green" : "neutral"}>
                        {item.is_available ? "Available tonight" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {items.length === 0 && (
            <div className="mt-14 max-w-xl mx-auto">
              <EmptyState title="No dishes match your search">
                Try a different keyword or clear the category filter.
              </EmptyState>
            </div>
          )}

          <div className="mt-16 text-center">
            <p className="text-sm text-cream/60">Hungry after all that browsing?</p>
            <div className="mt-6">
              <ButtonLink to="/reservations">Reserve a table</ButtonLink>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-5 py-2 text-[0.78rem] uppercase tracking-[0.14em] transition-all duration-300 ${
        active
          ? "border-gold bg-gold/15 text-gold-bright"
          : "border-cream/15 text-cream/60 hover:border-gold/50 hover:text-gold"
      }`}
    >
      {children}
    </button>
  );
}
