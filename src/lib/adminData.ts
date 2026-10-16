import { getSupabase, isSupabaseConfigured } from "./supabase";
import type {
  Booking,
  BookingEvent,
  BookingStatus,
  GalleryImage,
  MenuCategory,
  MenuItem,
  RestaurantSetting,
} from "./types";

function assertConfigured() {
  if (!isSupabaseConfigured) throw new Error("NOT_CONFIGURED");
}

/* ───────────────────────────── Bookings ──────────────────────────────── */

export interface BookingFilters {
  search: string;
  status: BookingStatus | "all";
  date: string | null;
  page: number;
  pageSize: number;
}

export async function fetchBookings(filters: BookingFilters): Promise<{
  rows: Booking[];
  count: number;
}> {
  assertConfigured();
  const sb = getSupabase();
  let q = sb
    .from("bookings")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((filters.page - 1) * filters.pageSize, filters.page * filters.pageSize - 1);

  if (filters.status !== "all") q = q.eq("status", filters.status);
  if (filters.date) q = q.eq("booking_date", filters.date);

  const term = filters.search.trim();
  if (term) {
    // Escape LIKE wildcards so empty/loud search terms behave predictably.
    const safe = term.replace(/[%_]/g, (m) => `\\${m}`);
    if (/[0-9]{8,}/.test(term.replace(/\D/g, ""))) {
      const digits = `+91${term.replace(/\D/g, "").slice(-10)}`;
      q = q.or(`booking_reference.ilike.%${safe}%,customer_phone.eq.${digits}`);
    } else {
      q = q.or(
        `booking_reference.ilike.%${safe}%,customer_name.ilike.%${safe}%,customer_email.ilike.%${safe}%`
      );
    }
  }

  const { data, error, count } = await q;
  if (error) throw error;
  return { rows: data as Booking[], count: count ?? 0 };
}

export async function fetchBookingEvents(bookingId: number): Promise<BookingEvent[]> {
  assertConfigured();
  const sb = getSupabase();
  const { data, error } = await sb
    .from("booking_events")
    .select("*")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as BookingEvent[];
}

/** Status changes flow through the SECURITY DEFINER RPC so the audit trail is enforced server-side. */
export async function updateBookingStatus(bookingId: number, status: BookingStatus) {
  assertConfigured();
  const sb = getSupabase();
  const { error } = await sb.rpc("update_booking_status", {
    p_booking_id: bookingId,
    p_new_status: status,
  });
  if (error) throw error;
}

export async function fetchBookingStats(): Promise<{
  pendingToday: number;
  pendingAll: number;
  confirmedThisWeek: number;
  totalBookings: number;
  totalGuestsUpcoming: number;
  statusCounts: Record<string, number>;
}> {
  assertConfigured();
  const sb = getSupabase();

  const [pending, confirmed, all, upcoming] = await Promise.all([
    sb.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    sb
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", "confirmed")
      .gte("booking_date", new Date().toISOString().slice(0, 10)),
    sb.from("bookings").select("id", { count: "exact", head: true }),
    sb
      .from("bookings")
      .select("guest_count")
      .eq("status", "confirmed")
      .gte("booking_date", new Date().toISOString().slice(0, 10)),
  ]);

  const err = [pending.error, confirmed.error, all.error, upcoming.error].find(Boolean);
  if (err) throw err;

  const { data: statusRows, error: statusErr } = await sb
    .from("bookings")
    .select("status");
  if (statusErr) throw statusErr;

  const statusCounts = (statusRows as { status: string }[]).reduce<Record<string, number>>(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    },
    {}
  );

  return {
    pendingToday: pending.count ?? 0,
    pendingAll: pending.count ?? 0,
    confirmedThisWeek: confirmed.count ?? 0,
    totalBookings: all.count ?? 0,
    totalGuestsUpcoming: (upcoming.data ?? []).reduce((s, r) => s + (r.guest_count ?? 0), 0),
    statusCounts,
  };
}

/* ───────────────────────────── Menu CRUD ─────────────────────────────── */

export async function adminFetchMenu(): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
  assertConfigured();
  const sb = getSupabase();
  const [cats, items] = await Promise.all([
    sb.from("menu_categories").select("*").order("sort_order"),
    sb.from("menu_items").select("*").order("sort_order").order("name"),
  ]);
  if (cats.error) throw cats.error;
  if (items.error) throw items.error;
  return { categories: cats.data as MenuCategory[], items: items.data as MenuItem[] };
}

export async function saveMenuItem(
  item: Partial<MenuItem> & { id?: number }
): Promise<MenuItem> {
  assertConfigured();
  const sb = getSupabase();
  const { id, ...rest } = item;
  if (id) {
    const { data, error } = await sb.from("menu_items").update(rest).eq("id", id).select().single();
    if (error) throw error;
    return data as MenuItem;
  }
  const { data, error } = await sb.from("menu_items").insert(rest).select().single();
  if (error) throw error;
  return data as MenuItem;
}

export async function deleteMenuItem(id: number): Promise<void> {
  assertConfigured();
  const sb = getSupabase();
  const { error } = await sb.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

export async function saveMenuCategory(
  category: Partial<MenuCategory> & { id?: number }
): Promise<MenuCategory> {
  assertConfigured();
  const sb = getSupabase();
  const { id, ...rest } = category;
  if (id) {
    const { data, error } = await sb
      .from("menu_categories")
      .update(rest)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as MenuCategory;
  }
  const { data, error } = await sb.from("menu_categories").insert(rest).select().single();
  if (error) throw error;
  return data as MenuCategory;
}

export async function deleteMenuCategory(id: number): Promise<void> {
  assertConfigured();
  const sb = getSupabase();
  const { error } = await sb.from("menu_categories").delete().eq("id", id);
  if (error) throw error;
}

/* ───────────────────────────── Gallery ───────────────────────────────── */

export async function adminFetchGallery(): Promise<GalleryImage[]> {
  assertConfigured();
  const sb = getSupabase();
  const { data, error } = await sb.from("gallery_images").select("*").order("sort_order");
  if (error) throw error;
  return data as GalleryImage[];
}

export async function uploadGalleryImage(
  file: File,
  meta: { title: string | null; alt_text: string | null; sort_order: number; is_published: boolean }
): Promise<GalleryImage> {
  assertConfigured();
  const sb = getSupabase();
  const dot = file.name.lastIndexOf(".");
  const ext = (dot >= 0 ? file.name.slice(dot + 1) : "jpg").toLowerCase();
  const allowed = ["jpg", "jpeg", "png", "webp", "avif"];
  if (!allowed.includes(ext)) {
    throw new Error(`File type .${ext} is not allowed. Use ${allowed.join(", ")}.`);
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image must be 8 MB or smaller.");
  }
  const path = `restaurant/gallery/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const { error: upErr } = await sb.storage.from("restaurant").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (upErr) throw upErr;

  const { data: urlData } = await sb.storage.from("restaurant").getPublicUrl(path);

  const { data, error } = await sb
    .from("gallery_images")
    .insert({
      title: meta.title,
      alt_text: meta.alt_text,
      storage_path: path,
      public_url: urlData.publicUrl,
      sort_order: meta.sort_order,
      is_published: meta.is_published,
    })
    .select()
    .single();
  if (error) throw error;
  return data as GalleryImage;
}

export async function updateGalleryImage(
  id: number,
  patch: Partial<GalleryImage>
): Promise<void> {
  assertConfigured();
  const sb = getSupabase();
  const { id: _omit, created_at: _c, storage_path: _p, ...rest } = patch;
  const { error } = await sb.from("gallery_images").update(rest).eq("id", id);
  if (error) throw error;
}

export async function deleteGalleryImage(image: GalleryImage): Promise<void> {
  assertConfigured();
  const sb = getSupabase();
  const { error: rmErr } = await sb.storage.from("restaurant").remove([image.storage_path]);
  if (rmErr) throw rmErr;
  const { error } = await sb.from("gallery_images").delete().eq("id", image.id);
  if (error) throw error;
}

/* ───────────────────────────── Settings ──────────────────────────────── */

export async function adminFetchSettings(): Promise<RestaurantSetting | null> {
  assertConfigured();
  const sb = getSupabase();
  const { data, error } = await sb.from("restaurant_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return (data as RestaurantSetting) ?? null;
}

export async function saveSettings(patch: {
  hero_image_path: string | null;
  notes: string | null;
}): Promise<void> {
  assertConfigured();
  const sb = getSupabase();
  const { error } = await sb.from("restaurant_settings").update(patch).eq("id", 1);
  if (error) throw error;
}

export async function uploadHeroImage(file: File): Promise<string> {
  assertConfigured();
  const sb = getSupabase();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  if (!["jpg", "jpeg", "png", "webp", "avif"].includes(ext)) {
    throw new Error("Hero image must be jpg, png, webp or avif.");
  }
  if (file.size > 12 * 1024 * 1024) throw new Error("Hero image must be 12 MB or smaller.");
  const path = `restaurant/hero/hero-${Date.now()}.${ext}`;
  const { error: upErr } = await sb.storage.from("restaurant").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (upErr) throw upErr;
  return path;
}
