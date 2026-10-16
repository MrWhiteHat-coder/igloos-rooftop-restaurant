/**
 * Site configuration — the single place for business identity and contact data.
 *
 * IMPORTANT: values below marked PLACEHOLDER are NOT verified business facts.
 * Until the real Igloos Rooftop Restaurant contact details, address, hours and
 * prices are confirmed, they render as clearly-labelled placeholder data.
 * Once verified, an administrator can store the real values in the
 * `restaurant_settings` table and make these fields DB-driven instead —
 * see docs/SETUP.md.
 */
export const SITE = {
  name: "Igloos Rooftop Restaurant",
  shortName: "Igloos",
  tagline: "Dining above the city, inside your own private sky.",
  city: "Chennai, India",

  // ── PLACEHOLDER DATA — replace after verifying with the business ──────────
  addressLine: "Rooftop Terrace, [Placeholder Building], [Placeholder Road], [Placeholder Locality], Chennai — 600000",
  hours: "6:30 PM – 11:30 PM · Closed Tuesdays (placeholder)",
  phone: "+91 00000 00000",
  whatsappNumber: "910000000000",
  email: "reservations@example.com",
  instagram: "igloos.placeholder",
  mapQuery: "[Placeholder Locality], Chennai, Tamil Nadu 600000",
  // ── end PLACEHOLDER data ───────────────────────────────────────────────────

  /** True while any business detail above is unverified — drives footer/admin notices. */
  isPlaceholder: true,
} as const;

export const mapsDirectionsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const whatsappChatUrl = (waNumber: string, text: string) =>
  `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
