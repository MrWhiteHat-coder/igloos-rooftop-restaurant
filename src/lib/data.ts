import { isSupabaseConfigured } from "./supabase";
import { getSupabase } from "./supabase";
import type {
  GalleryImage,
  MenuCategory,
  MenuItem,
  RestaurantSetting,
} from "./types";
import type { ValidatedBooking } from "./bookingValidation";

export interface MenuData {
  categories: MenuCategory[];
  items: MenuItem[];
}

export async function fetchMenu(): Promise<MenuData> {
  if (!isSupabaseConfigured) throw new Error("NOT_CONFIGURED");
  const sb = getSupabase();
  const [cats, items] = await Promise.all([
    sb.from("menu_categories").select("*").order("sort_order").order("name"),
    sb.from("menu_items").select("*").order("sort_order").order("name"),
  ]);
  if (cats.error) throw cats.error;
  if (items.error) throw items.error;
  return { categories: cats.data as MenuCategory[], items: items.data as MenuItem[] };
}

export async function fetchGallery(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured) throw new Error("NOT_CONFIGURED");
  const sb = getSupabase();
  const res = await sb
    .from("gallery_images")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (res.error) throw res.error;
  return res.data as GalleryImage[];
}

export async function fetchSettings(): Promise<RestaurantSetting | null> {
  if (!isSupabaseConfigured) throw new Error("NOT_CONFIGURED");
  const sb = getSupabase();
  const res = await sb.from("restaurant_settings").select("*").eq("id", 1).maybeSingle();
  if (res.error) throw res.error;
  return (res.data as RestaurantSetting) ?? null;
}

export interface SubmitBookingResult {
  booking_reference: string;
  status: "pending";
  created_at: string;
}

export type SubmitBookingError =
  | "RATE_LIMITED"
  | "DUPLICATE"
  | "VALIDATION"
  | "AUTH"
  | "UNEXPECTED";

/**
 * Submits a booking enquiry through the SECURITY DEFINER Postgres RPC
 * `submit_booking`, which performs server-side validation, duplicate
 * detection and rate limiting before inserting the row.
 */
export async function submitBooking(
  payload: ValidatedBooking
): Promise<SubmitBookingResult> {
  if (!isSupabaseConfigured) throw new Error("NOT_CONFIGURED");
  const sb = getSupabase();
  const { data, error } = await sb.rpc("submit_booking", { p_booking: payload });
  if (error) {
    const code = (error as { code?: string }).code ?? "";
    const msg = error.message ?? "";
    if (code === "P0001" && msg.includes("RATE_LIMIT_EXCEEDED")) throw new Error("RATE_LIMITED");
    if (code === "P0001" && msg.includes("DUPLICATE_SUBMISSION")) throw new Error("DUPLICATE");
    if (code === "P0001" && msg.includes("INVALID_BOOKING")) throw new Error("VALIDATION");
    if (code === "42501") throw new Error("AUTH");
    throw new Error("UNEXPECTED");
  }
  return data as unknown as SubmitBookingResult;
}

const PLACEHOLDER_MESSAGES = {
  NOT_CONFIGURED:
    "The booking desk isn't wired to its database yet — Supabase environment variables are missing on this deployment.",
} as const;

export function friendlyBookingError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg === "NOT_CONFIGURED") return PLACEHOLDER_MESSAGES.NOT_CONFIGURED;
  if (msg === "VALIDATION")
    return "The details could not be validated. Please check the form and try again.";
  if (msg === "RATE_LIMITED")
    return "You've submitted several enquiries already. Please wait a little before trying again.";
  if (msg === "DUPLICATE")
    return "It looks like this exact enquiry is already with us. Please wait for a call back.";
  if (msg === "AUTH")
    return "Reservations are temporarily unavailable. Please try again shortly.";
  return "Something went wrong while sending your enquiry. Please try again, or reach us on WhatsApp.";
}
