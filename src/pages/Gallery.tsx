import { useEffect, useState } from "react";
import { fetchGallery } from "../lib/data";
import { ConfigNotice, SectionHeading, Spinner } from "../components/ui/misc";
import type { GalleryImage } from "../lib/types";

interface Tile {
  id: number;
  title: string | null;
  alt: string;
  public_url: string | null;
}

const PLACEHOLDER_TILES: Tile[] = [
  "The terrace at dusk",
  "An igloo dressed for two",
  "The dessert pass",
  "Candlelight along the parapet",
  "Golden hour over the skyline",
  "A table mid-celebration",
].map((caption, i) => ({ id: i, title: null, alt: caption, public_url: null }));

export default function Gallery() {
  const [images, setImages] = useState<Tile[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchGallery()
      .then((res: GalleryImage[]) => {
        if (cancelled) return;
        setError(false);
        setImages(
          res.map((img) => ({
            id: img.id,
            title: img.title,
            alt: img.alt_text ?? img.title ?? "Restaurant photograph",
            public_url: img.public_url,
          }))
        );
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

  if (loading) return <Spinner label="Opening the album" />;

  const usePlaceholders = error || (images?.length ?? 0) === 0;
  const tiles = usePlaceholders
    ? PLACEHOLDER_TILES
    : (images ?? []).map((img) => ({ ...img }));

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-40 sm:px-8">
      <SectionHeading
        eyebrow="Gallery"
        title="Evenings, framed."
        subtitle="A look inside the igloos, the terrace tables and the plates that come out of our kitchen."
      />

      <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-cream/50">
        {usePlaceholders
          ? "Showing placeholder frames — photographs appear here once the restaurant team uploads them to Supabase Storage."
          : `${tiles.length} photograph${tiles.length === 1 ? "" : "s"} from the restaurant team.`}
      </p>

      {error && (
        <div className="mx-auto mt-10 max-w-3xl">
          <ConfigNotice />
        </div>
      )}

      <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {tiles.map((tile) => (
          <figure
            key={tile.id}
            className="group overflow-hidden rounded-2xl border border-slate-line"
          >
            <img
              src={tile.public_url ?? "/images/gallery-placeholder.svg"}
              alt={tile.alt}
              loading="lazy"
              className="w-full transition-transform duration-700 group-hover:scale-105"
            />
            {tile.title && (
              <figcaption className="block bg-night-2/80 px-4 py-3 font-display text-lg text-cream">
                {tile.title}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
