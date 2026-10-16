import type { DiningPreference, Occasion } from "./types";

export interface BookingFormInput {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  booking_date: string;
  booking_time: string;
  guest_count: string | number;
  occasion: Occasion | "";
  dining_preference: DiningPreference | "";
  special_requests: string;
}

export type ValidatedBooking = {
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  booking_date: string;
  booking_time: string;
  guest_count: number;
  occasion: Occasion;
  dining_preference: DiningPreference;
  special_requests: string | null;
};

export const OCCASIONS: Occasion[] = [
  "birthday",
  "anniversary",
  "date_night",
  "celebration",
  "business_meal",
  "just_dinner",
];
export const DINING_PREFERENCES: DiningPreference[] = ["rooftop", "igloo"];

export const GUEST_MIN = 1;
export const GUEST_MAX_IGLOO = 10;
export const GUEST_MAX = 40;

/** Earliest date a guest may pick: today (server re-checks with its own clock). */
export function earliestBookingDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
}

export function validateBooking(
  input: BookingFormInput,
  todayISO: string
): { ok: true; value: ValidatedBooking } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const name = input.customer_name.trim();
  if (name.length < 2 || name.length > 80) {
    errors.customer_name = "Please enter your full name (2–80 characters).";
  } else if (!/^[\p{L}\p{M}'.\- ]+$/u.test(name)) {
    errors.customer_name = "Name can contain letters, spaces, apostrophes and hyphens only.";
  }

  // Indian mobile numbers: 10 digits with any separator characters, optional +91 prefix.
  const digits = input.customer_phone.replace(/[\s\-().]/g, "");
  if (!/^(\+?91)?[6-9]\d{9}$/.test(digits)) {
    errors.customer_phone = "Enter a valid Indian mobile number, e.g. 98XXX XXXXX.";
  }

  const email = input.customer_email.trim().toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.customer_email = "Enter a valid email address or leave it blank.";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.booking_date)) {
    errors.booking_date = "Please choose a reservation date.";
  } else if (input.booking_date < todayISO) {
    errors.booking_date = "Please choose a date that is today or in the future.";
  }

  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(input.booking_time)) {
    errors.booking_time = "Please choose a reservation time.";
  } else {
    const hour = Number(input.booking_time.slice(0, 2));
    // Dinner service window (placeholder; restaurant can change in DB later).
    if (hour < 6 || hour >= 23) {
      errors.booking_time = "Choose a time between 6:00 PM and 10:30 PM.";
    }
  }

  const guests = Number(input.guest_count);
  if (!Number.isInteger(guests) || guests < GUEST_MIN || guests > GUEST_MAX) {
    errors.guest_count = `Guests must be a whole number between ${GUEST_MIN} and ${GUEST_MAX}.`;
  } else if (input.dining_preference === "igloo" && guests > GUEST_MAX_IGLOO) {
    errors.guest_count = `Private igloos seat up to ${GUEST_MAX_IGLOO} guests. Choose rooftop seating instead.`;
  }

  if (!input.occasion || !OCCASIONS.includes(input.occasion as Occasion)) {
    errors.occasion = "Please select an occasion.";
  }

  if (!input.dining_preference || !DINING_PREFERENCES.includes(input.dining_preference as DiningPreference)) {
    errors.dining_preference = "Please choose rooftop or private igloo seating.";
  }

  const special = input.special_requests.trim();
  if (special.length > 500) {
    errors.special_requests = "Special requests are limited to 500 characters.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      customer_name: name,
      customer_phone: digits.startsWith("+91")
        ? digits
        : digits.startsWith("91")
          ? `+${digits}`
          : `+91${digits}`,
      customer_email: email || null,
      booking_date: input.booking_date,
      booking_time: input.booking_time.slice(0, 5),
      guest_count: guests,
      occasion: input.occasion as Occasion,
      dining_preference: input.dining_preference as DiningPreference,
      special_requests: special || null,
    },
  };
}

/** Builds the payload sent to the `submit_booking` Postgres RPC. */
export function formToPayload(
  tenantRef: string,
  input: BookingFormInput,
  todayISO: string
): { payload: ValidatedBooking & { client_reference: string } } | { error: string } {
  const v = validateBooking(input, todayISO);
  if (!v.ok) {
    return { error: Object.values(v.errors)[0] ?? "Please review the highlighted fields." };
  }
  return { payload: { ...v.value, client_reference: tenantRef } };
}

// Export used by tests and the form for the local reference shown before the
// server assigns its own authoritative reference.
export function localReference(): string {
  const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return suffix;
}
