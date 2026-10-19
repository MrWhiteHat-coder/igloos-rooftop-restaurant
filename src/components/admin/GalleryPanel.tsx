import { useCallback, useEffect, useState } from "react";
import {
  adminFetchGallery,
  deleteGalleryImage,
  updateGalleryImage,
  uploadGalleryImage,
} from "../../lib/adminData";
import type { GalleryImage } from "../../lib/types";
import { Button } from "../ui/Button";
import { Input } from "../ui/form";
import { Modal, Spinner } from "../ui/misc";

export default function GalleryPanel() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setImages(await adminFetchGallery());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load gallery.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function togglePublished(img: GalleryImage) {
    try {
      await updateGalleryImage(img.id, { is_published: !img.is_published });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    }
  }

  async function move(img: GalleryImage, delta: number) {
    try {
      await updateGalleryImage(img.id, { sort_order: Math.max(0, img.sort_order + delta) });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reorder failed.");
    }
  }

  async function remove(img: GalleryImage) {
    if (!window.confirm("Delete this image and its storage object?")) return;
    try {
      await deleteGalleryImage(img);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-ivory">Gallery</h2>
          <p className="mt-1 text-sm text-ivory/55">
            Unpublished images stay hidden from the public gallery page.
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>+ Upload image</Button>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-red-400/50 bg-red-500/10 px-5 py-4 text-sm text-red-200">
          {error}
        </p>
      )}

      {loading ? (
        <Spinner label="Loading gallery" />
      ) : images.length === 0 ? (
        <p className="mt-10 border border-ivory/15 bg-forest-2/60 p-10 text-center text-sm text-ivory/60">
          No images yet. Upload the first restaurant photograph.
        </p>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <li key={img.id} className="overflow-hidden border border-ivory/15 bg-forest-2/60">
              <img
                src={img.public_url ?? `/images/gallery-placeholder.svg#${encodeURIComponent(img.storage_path)}`}
                alt={img.alt_text ?? img.title ?? "Gallery image"}
                loading="lazy"
                className="h-44 w-full object-cover"
              />
              <div className="p-5">
                <p className="text-sm text-ivory/85">{img.title ?? "Untitled"}</p>
                <p className="mt-1 font-mono text-[0.65rem] text-ivory/40">{img.storage_path}</p>
                <p className="mt-3 text-xs text-ivory/50">
                  {img.is_published ? "Published" : "Hidden"} · sort {img.sort_order}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant={img.is_published ? "outline" : "gold"} onClick={() => void togglePublished(img)}>
                    {img.is_published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => void move(img, -1)}>
                    ←
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => void move(img, 1)}>
                    →
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => void remove(img)}>
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        nextSort={Math.max(0, ...images.map((i) => i.sort_order)) + 10}
        onDone={async () => {
          setUploadOpen(false);
          await load();
        }}
        onError={setError}
      />
    </div>
  );
}

function UploadModal({
  open,
  onClose,
  nextSort,
  onDone,
  onError,
}: {
  open: boolean;
  onClose: () => void;
  nextSort: number;
  onDone: () => Promise<void>;
  onError: (msg: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [published, setPublished] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setTitle("");
      setAlt("");
      setPublished(true);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="Upload gallery image">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!file) return;
          setBusy(true);
          try {
            await uploadGalleryImage(file, {
              title: title.trim() || null,
              alt_text: alt.trim() || null,
              sort_order: nextSort,
              is_published: published,
            });
            await onDone();
          } catch (err) {
            onError(err instanceof Error ? err.message : "Upload failed.");
          } finally {
            setBusy(false);
          }
        }}
        className="space-y-5"
      >
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-ivory/70">
            Image file
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-ivory/15 bg-forest-2/70 px-4 py-3 text-ivory/80 file:mr-4 file:rounded-full file:border-0 file:bg-brass file:px-4 file:py-1.5 file:text-forest"
          />
        </label>
        <Input
          label="Title"
          optional
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Igloo for two at dusk"
        />
        <Input
          label="Alt text"
          optional
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Describe the photo for screen readers"
        />
        <label className="flex items-center gap-3 text-sm text-ivory/75">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 accent-[#cfa35a]"
          />
          Publish immediately
        </label>
        <Button type="submit" loading={busy} className="w-full">
          Upload
        </Button>
      </form>
    </Modal>
  );
}
