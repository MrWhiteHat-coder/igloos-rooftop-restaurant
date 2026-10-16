import { useState } from "react";
import { useStaffAuth } from "../../admin/auth";
import { Badge, ConfigNotice } from "../../components/ui/misc";
import { Button } from "../../components/ui/Button";
import { isSupabaseConfigured } from "../../lib/supabase";
import BookingsPanel from "../../components/admin/BookingsPanel";
import MenuPanel from "../../components/admin/MenuPanel";
import GalleryPanel from "../../components/admin/GalleryPanel";
import SettingsPanel from "../../components/admin/SettingsPanel";

const TABS = [
  { key: "bookings", label: "Bookings" },
  { key: "menu", label: "Menu" },
  { key: "gallery", label: "Gallery" },
  { key: "settings", label: "Settings" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AdminDashboard() {
  const { profile, signOut } = useStaffAuth();
  const [tab, setTab] = useState<TabKey>("bookings");

  return (
    <div className="min-h-screen bg-night">
      <header className="border-b border-slate-line bg-night-2/70 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-gold">Igloos · Staff console</h1>
            <p className="mt-1 text-xs text-cream/50">
              Signed in as {profile?.email ?? "staff member"}
              {profile?.role === "admin" ? " · admin" : " · manager"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge tone={profile?.role === "admin" ? "gold" : "neutral"}>{profile?.full_name ?? profile?.role}</Badge>
            <Button variant="outline" size="sm" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        </div>
        <nav className="mx-auto mt-5 flex max-w-7xl gap-1 overflow-x-auto" aria-label="Admin sections">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              aria-current={tab === t.key}
              className={`rounded-full px-5 py-2 text-xs uppercase tracking-[0.16em] transition-colors ${
                tab === t.key ? "bg-gold/15 text-gold-bright" : "text-cream/60 hover:text-gold"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {!isSupabaseConfigured ? (
          <ConfigNotice />
        ) : (
          <>
            {tab === "bookings" && <BookingsPanel />}
            {tab === "menu" && <MenuPanel />}
            {tab === "gallery" && <GalleryPanel />}
            {tab === "settings" && <SettingsPanel />}
          </>
        )}
      </main>
    </div>
  );
}
