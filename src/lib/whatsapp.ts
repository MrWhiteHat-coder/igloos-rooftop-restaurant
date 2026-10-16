import { whatsappChatUrl } from "./config";
import type { Booking } from "./types";

/**
 * Builds a WhatsApp click-to-chat URL containing the booking enquiry summary
 * and the booking reference.
 *
 * GUARANTEE: opening this link is only a convenience for the guest to *send*
 * an enquiry to the restaurant. It is NEVER treated as proof of delivery and
 * NEVER changes the booking status — only authorised staff confirm bookings
 * in the admin dashboard.
 */
export function buildBookingWhatsappText(booking: {
  booking_reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  booking_date: string;
  booking_time: string;
  guest_count: number;
  occasion: string;
  dining_preference: string;
  special_requests?: string | null;
}): string {
  const lines = [
    "Hello Igloos Rooftop Restaurant! I would like to enquire about a reservation.",
    "",
    `Booking reference: ${booking.booking_reference}`,
    `Name: ${booking.customer_name}`,
    `Phone: ${booking.customer_phone}`,
  ];
  if (booking.customer_email) {
    lines.push(`Email: ${booking.customer_email}`);
  }
  lines.push(
    `Date: ${booking.booking_date}`,
    `Time: ${booking.booking_time}`,
    `Guests: ${booking.guest_count}`,
    `Occasion: ${labelFor(booking.occasion)}`,
    `Preference: ${labelFor(booking.dining_preference)}`
  );
  if (booking.special_requests?.trim()) {
    lines.push(`Requests: ${booking.special_requests.trim()}`);
  }
  lines.push(
    "",
    "Please confirm availability. (This WhatsApp enquiry does not confirm the reservation.)"
  );
  return lines.join("\n");
}

export function buildBookingWhatsappLink(
  booking: Parameters<typeof buildBookingWhatsappText>[0],
  waNumber: string
): string {
  return whatsappChatUrl(waNumber, buildBookingWhatsappText(booking));
}

const OCCASION_LABELS: Record<string, string> = {
  birthday: "Birthday",
  anniversary: "Anniversary",
  date_night: "Date night",
  celebration: "Other celebration",
  business_meal: "Business meal",
  just_dinner: "Just dinner",
};
const PREFERENCE_LABELS: Record<string, string> = {
  rooftop: "Rooftop seating",
  igloo: "Private igloo",
};
export function labelFor(value: string): string {
  return OCCASION_LABELS[value] ?? PREFERENCE_LABELS[value] ?? value;
}

export function bookingToWhatsappArgs(b: Booking) {
  return {
    booking_reference: b.booking_reference,
    customer_name: b.customer_name,
    customer_phone: b.customer_phone,
    customer_email: b.customer_email,
    booking_date: b.booking_date,
    booking_time: b.booking_time,
    guest_count: b.guest_count,
    occasion: b.occasion,
    dining_preference: b.dining_preference,
    special_requests: b.special_requests,
  };
}
