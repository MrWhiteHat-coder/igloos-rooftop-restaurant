import { useEffect, useState } from "react";
import { fetchGallery } from "../lib/data";
import { ConfigNotice, SectionHeading, Spinner } from "../components/ui/misc";
import type { GalleryImage } from "../lib/types";

interface Tile {
  id: number;
  title: string | null;
  alt: string;
  public_url: string | null;
  span: string;
}

const PLACEHOLDER_TILES: Tile[] = [
  { id: 1, title: "The parapet at dusk", alt: "The rooftop terrace glowing above the night city — representative editorial photograph", public_url: "/images/photography/terrace.jpg", span: "sm:col-span-2 sm:row-span-2" },
  { id: 2, title: "Service, curated", alt: "A curated table being set for service — representative editorial photograph", public_url: "/images/photography/service.jpg", span: "" },
  { id: 3, title: "Amber hour", alt: "A cocktail in amber light — representative editorial photograph", public_url: "/images/photography/drink.jpg", span: "" },
  { id: 4, title: "The city below", alt: "The city skyline at night seen from a rooftop rail — representative editorial photograph", public_url: "/images/photography/skyline.jpg", span: "sm:col-span-2" },
  { id: 5, title: "The dining room", alt: "A softly lit dining room — representative editorial photograph", public_url: "/images/photography/interior.jpg", span: "" },
  { id: 6, title: "Plated, composed", alt: "An elegantly plated dish — representative editorial photograph", public_url: "/images/photography/dish-2.jpg", span: "" },
];

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchGallery()
      .then((res) => {
        if (cancelled) return;
        setError(false);
        setImages(res);
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

  if (loading) return <div className="pt-32"><Spinner label="Opening the album" /></div>;

  const usePlaceholders = error || !images || images.length === 0;

  // Real images flow in order; representative frames fill the grid otherwise.
  const tiles: Tile[] = usePlaceholders
    ? PLACEHOLDER_TILES
    : (images ?? []).map((img, i) => ({
        id: img.id,
        title: img.title,
        alt: img.alt_text ?? img.title ?? "Restaurant photograph",
        public_url: img.public_url,
        span: i % 5 === 0 ? "sm:col-span-2 sm:row-span-2" : i % 5 === 3 ? "sm:col-span-2" : "",
      }));

  return (
    <div className="pt-24">
      <section className="bg-forest px-5 pb-20 pt-24 sm:px-8 sm:pt-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Gallery"
            title="Evenings, framed."
            subtitle={
              usePlaceholders
                ? "Representative editorial frames while the restaurant's own photographs are prepared — live images appear here the moment the team publishes them."
                : "Photographs from the restaurant's own evenings."
            }
          />
        </div>
      </section>

      <section className="bg-forest px-5 pb-32 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {error && (
            <div className="mb-12">
              <ConfigNotice />
            </div>
          )}

          <div className="grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[210px] sm:grid-cols-4 lg:auto-rows-[240px]">
            {tiles.map((tile, i) => (
              <figure
                key={`${tile.id}-${i}`}
                className={`group relative overflow-hidden ${tile.span}`}
              >
                <img
                  src={tile.public_url ?? "/images/photography/terrace.jpg"}
                  alt={tile.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]"
                />
                <figcaption
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest/90 to-transparent p-4 pt-10 font-display text-lg font-light text-ivory opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                >
                  {tile.title ?? ""}
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-[0.7rem] font-light leading-relaxed text-ivory/40">
            Representative editorial imagery is used until confirmed photographs of the terrace
            and igloos are published by the restaurant. Licensing details:
            public/images/photography/CREDITS.md.
          </p>
        </div>
      </section>
    </div>
  );
}
