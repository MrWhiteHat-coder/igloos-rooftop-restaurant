/** Database row types mirroring tables in supabase/migrations. */

export type BookingStatus = "pending" | "confirmed" | "seated" | "cancelled" | "no_show";
export type StaffRole = "admin" | "manager";
export type Occasion =
  | "birthday"
  | "anniversary"
  | "date_night"
  | "celebration"
  | "business_meal"
  | "just_dinner";

export type DiningPreference = "rooftop" | "igloo";

export interface RestaurantSetting {
  id: number;
  /** Supabase Storage path for the gallery/hero imagery (nullable). */
  hero_image_path: string | null;
  /** Any free-form operational notes shown in the admin (nullable). */
  notes: string | null;
  updated_at: string | null;
}

export interface MenuCategory {
  id: number;
  /** Short URL-safe key, e.g. "starters". */
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  /** Stored as rupees (integers). Placeholders until verified. */
  price_inr: number | null;
  is_veg: boolean | null;
  is_available: boolean;
  image_path: string | null;
  sort_order: number;
}

export interface Booking {
  id: number;
  booking_reference: string;
  status: BookingStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  booking_date: string;
  booking_time: string;
  guest_count: number;
  occasion: Occasion;
  dining_preference: DiningPreference;
  special_requests: string | null;
  /** Set once, the day the guest is marked seated. */
  seated_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingEvent {
  id: number;
  booking_id: number;
  actor_user_id: string | null;
  /** Human-readable event description, e.g. "status pending → confirmed". */
  event_type: string;
  created_at: string;
}

export interface GalleryImage {
  id: number;
  title: string | null;
  alt_text: string | null;
  storage_path: string;
  /** Public URL of the uploaded file (populated on upload). */
  public_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string | null;
}

export interface StaffProfile {
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: StaffRole;
  active: boolean;
  created_at: string | null;
}
