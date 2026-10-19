import { useEffect, useState } from "react";
import { adminFetchSettings, saveSettings, uploadHeroImage } from "../../lib/adminData";
import type { RestaurantSetting } from "../../lib/types";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/form";
import { Spinner } from "../ui/misc";
import { getSupabase, isSupabaseConfigured } from "../../lib/supabase";

export default function SettingsPanel() {
  const [settings, setSettings] = useState<RestaurantSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    (async () => {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        const s = await adminFetchSettings();
        setSettings(s);
        setNotes(s?.notes ?? "");
        if (s?.hero_image_path) {
          const { data } = getSupabase().storage.from("restaurant").getPublicUrl(s.hero_image_path);
          setHeroUrl(data.publicUrl);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load settings.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!isSupabaseConfigured || loading) return <Spinner label="Loading settings" />;

  async function saveHeroNotes() {
    if (!settings) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      await saveSettings({ hero_image_path: settings.hero_image_path, notes: notes.trim() || null });
      setNotice("Settings saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function onHeroUpload(file: File) {
    setUploadingHero(true);
    setError(null);
    setNotice(null);
    try {
      const path = await uploadHeroImage(file);
      await saveSettings({ hero_image_path: path, notes: notes.trim() || null });
      const { data } = getSupabase().storage.from("restaurant").getPublicUrl(path);
      setHeroUrl(data.publicUrl);
      setSettings((s) => (s ? { ...s, hero_image_path: path } : s));
      setNotice("Hero image updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploadingHero(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-10">
      <section className="border border-ivory/15 bg-forest-2/70 p-8">
        <h2 className="font-display text-3xl text-ivory">Hero image</h2>
        <p className="mt-2 text-sm text-ivory/60">
          Appears on the public gallery lookup and can be wired into the home hero. Upload a wide,
          high-resolution photograph (12 MB max).
        </p>
        {heroUrl && (
          <img src={heroUrl} alt="Current hero" className="mt-6 h-56 w-full object-cover" />
        )}
        <div className="mt-6">
          <label className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-brass/60 px-6 py-2.5 text-xs uppercase tracking-[0.14em] text-brass transition-colors hover:bg-brass/10">
            {uploadingHero ? "Uploading…" : "Choose new hero image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onHeroUpload(f);
              }}
              disabled={uploadingHero}
            />
          </label>
        </div>
      </section>

      <section className="border border-ivory/15 bg-forest-2/70 p-8">
        <h2 className="font-display text-3xl text-ivory">Operational notes</h2>
        <p className="mt-2 text-sm text-ivory/60">
          Internal notes for the team. Not shown publicly.
        </p>
        <div className="mt-6">
          <Textarea
            label="Notes"
            optional
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-40"
          />
        </div>
        <div className="mt-6">
          <Button loading={saving} onClick={() => void saveHeroNotes()}>
            Save settings
          </Button>
        </div>
      </section>

      {notice && (
        <p role="status" className="rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-xl border border-red-400/50 bg-red-500/10 px-5 py-4 text-sm text-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
