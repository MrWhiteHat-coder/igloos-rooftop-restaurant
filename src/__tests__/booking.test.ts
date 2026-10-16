import { describe, expect, it } from "vitest";
import { generateBookingReference } from "../lib/reference";
import { buildBookingWhatsappLink, buildBookingWhatsappText } from "../lib/whatsapp";
import { earliestBookingDate, formToPayload, validateBooking } from "../lib/bookingValidation";

const valid = {
  customer_name: "Ananya Raman",
  customer_phone: "98415 55290",
  customer_email: "ananya@example.com",
  booking_date: "2026-10-20",
  booking_time: "19:30",
  guest_count: 2,
  occasion: "anniversary" as const,
  dining_preference: "igloo" as const,
  special_requests: "candle on the table",
};

describe("generateBookingReference", () => {
  it("matches IGL-YYMMDD-XXXX with unambiguous alphabet", () => {
    const ref = generateBookingReference(new Date(2026, 9, 16, 21, 4));
    expect(ref).toMatch(/^IGL-261016-[A-HJ-NP-Z2-9]{4}$/);
  });

  it("generates different suffixes on repeated calls", () => {
    const set = new Set(Array.from({ length: 200 }, () => generateBookingReference()));
    expect(set.size).toBeGreaterThan(180);
  });
});

describe("validateBooking", () => {
  it("accepts an Indian mobile with separators and pads 91 prefix", () => {
    const res = validateBooking(valid, "2026-10-16");
    expect(res.ok).toBe(true);
    expect(!res.ok ? null : res.value.customer_phone).toBe("+919841555290");
  });

  it("rejects past dates and short names", () => {
    const res = validateBooking(
      { ...valid, booking_date: "2020-01-01", customer_name: "A" },
      "2026-10-16"
    );
    if (res.ok) throw new Error("expected failure");
    expect(Object.keys(res.errors)).toEqual(
      expect.arrayContaining(["booking_date", "customer_name"])
    );
  });

  it("rejects out-of-service-window times", () => {
    const res = validateBooking({ ...valid, booking_time: "04:15" }, "2026-10-16");
    if (res.ok) throw new Error("expected failure");
    expect(res.errors.booking_time).toBeDefined();
  });

  it("rejects igloo bookings with more than 10 guests", () => {
    const res = validateBooking({ ...valid, guest_count: 12 }, "2026-10-16");
    if (res.ok) throw new Error("expected failure");
    expect(res.errors.guest_count).toMatch(/igloo/i);
  });

  it("accepts rooftop bookings with more than 10 guests", () => {
    const res = validateBooking(
      { ...valid, guest_count: 18, dining_preference: "rooftop" as const },
      "2026-10-16"
    );
    expect(res.ok).toBe(true);
  });

  it("caps special requests at 500 chars", () => {
    const res = validateBooking({ ...valid, special_requests: "x".repeat(501) }, "2026-10-16");
    if (res.ok) throw new Error("expected failure");
    expect(res.errors.special_requests).toBeDefined();
  });
});

describe("formToPayload", () => {
  it("returns a server-ready payload with client reference on success", () => {
    const res = formToPayload("a1b2c3", valid, "2026-10-16");
    if ("error" in res) throw new Error(`unexpected error ${res.error}`);
    expect(res.payload.customer_email).toBe("ananya@example.com");
    expect(res.payload.booking_time).toBe("19:30");
    expect(res.payload.client_reference).toBe("a1b2c3");
  });

  it("returns the first error text on failure", () => {
    const res = formToPayload("x", { ...valid, booking_time: "01:00" }, "2026-10-16");
    expect("error" in res).toBe(true);
  });
});

describe("WhatsApp link", () => {
  const bookingForm = {
    booking_reference: "IGL-261016-7K3M",
    customer_name: "Ananya Raman",
    customer_phone: "+919841555290",
    booking_date: "2026-10-20",
    booking_time: "19:30",
    guest_count: 2,
    occasion: "anniversary",
    dining_preference: "igloo",
  };

  it("produces a wa.me URL with encoded message containing the reference", () => {
    const link = buildBookingWhatsappLink(bookingForm, "919841555299");
    expect(link.startsWith("https://wa.me/919841555299?text=")).toBe(true);
    const text = buildBookingWhatsappText(bookingForm);
    expect(text).toContain("IGL-261016-7K3M");
    expect(text).toContain("Anniversary");
    expect(text).toContain("Private igloo");
  });

  it("round-trips through decodeURIComponent", () => {
    const link = buildBookingWhatsappLink(bookingForm, "91");
    const [,query] = link.split("?");
    const decoded = decodeURIComponent(query!.replace(/^text=/, ""));
    expect(decoded).toContain("Hello Igloos Rooftop Restaurant!");
    expect(decoded).toContain("does not confirm the reservation");
  });

  it("earliestBookingDate returns an ISO today string", () => {
    expect(earliestBookingDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
