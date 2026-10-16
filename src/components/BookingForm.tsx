import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  DINING_PREFERENCES,
  OCCASIONS,
  earliestBookingDate,
  formToPayload,
  validateBooking,
  type BookingFormInput,
} from "../lib/bookingValidation";
import { friendlyBookingError, submitBooking } from "../lib/data";
import { SITE } from "../lib/config";
import { buildBookingWhatsappLink } from "../lib/whatsapp";
import type { SubmitBookingResult } from "../lib/data";
import { Input, Select, Textarea } from "./ui/form";
import { Button, ButtonAnchor } from "./ui/Button";

const occasionLabel: Record<string, string> = {
  birthday: "Birthday",
  anniversary: "Anniversary",
  date_night: "Date night",
  celebration: "Other celebration",
  business_meal: "Business meal",
  just_dinner: "Just dinner",
};

const preferenceLabel: Record<string, string> = {
  rooftop: "Rooftop seating (open air)",
  igloo: "Private igloo (glass dome)",
};

const initialForm: BookingFormInput = {
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  booking_date: "",
  booking_time: "",
  guest_count: 2,
  occasion: "",
  dining_preference: "rooftop",
  special_requests: "",
};

export default function BookingForm() {
  const [form, setForm] = useState<BookingFormInput>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitBookingResult | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const today = useMemo(earliestBookingDate, []);

  const update =
    <K extends keyof BookingFormInput>(key: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({
        ...f,
        [key]: key === "guest_count" ? Number(e.target.value) : e.target.value,
      }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    const checked = formToPayload(String(formKey), form, today);
    if ("error" in checked) {
      const all = validateBooking(form, today);
      setErrors(all.ok ? {} : all.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await submitBooking(checked.payload);
      setResult(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setServerError(friendlyBookingError(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const wa = buildBookingWhatsappLink(
      {
        booking_reference: result.booking_reference,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        customer_email: form.customer_email,
        booking_date: form.booking_date,
        booking_time: form.booking_time,
        guest_count: Number(form.guest_count),
        occasion: String(form.occasion),
        dining_preference: String(form.dining_preference),
        special_requests: form.special_requests,
      },
      SITE.whatsappNumber
    );
    return (
      <div
        className="animate-[fade-up_.5s_ease-out] rounded-3xl border border-gold/40 bg-night-2 p-8 text-center sm:p-12"
        role="status"
        aria-live="polite"
      >
        <h2 className="font-display text-3xl text-gold sm:text-4xl">Enquiry received</h2>
        <p className="mt-4 text-cream/80">
          Thank you, {form.customer_name.split(" ")[0]}. Our reservations desk will review your
          request and call you on <span className="text-cream">{form.customer_phone}</span>.
        </p>
        <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-slate-line bg-night p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-cream/50">Booking reference</p>
          <p className="mt-2 font-display text-3xl tracking-wider text-gold">
            {result.booking_reference}
          </p>
          <p className="mt-4 text-sm text-cream/60">
            Status: <span className="font-semibold text-gold">Pending</span> — not yet confirmed.
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-cream/50">
          Keep your reference for all communication. Opening the WhatsApp link below simply lets
          you send your enquiry to the restaurant over WhatsApp — it does not confirm the
          reservation, and restaurant staff must confirm your booking before it is final.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <ButtonAnchor
            href={wa}
            variant="gold"
            aria-label="Send booking enquiry on WhatsApp"
          >
            Send via WhatsApp
          </ButtonAnchor>
          <button
            className="text-sm text-cream/60 underline-offset-4 transition-colors hover:text-gold hover:underline"
            onClick={() => {
              setResult(null);
              setForm(initialForm);
              setFormKey((k) => k + 1);
            }}
          >
            Make another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      key={formKey}
      className="rounded-3xl border border-slate-line bg-night-2/60 p-6 sm:p-10"
    >
      <h2 className="font-display text-3xl text-cream">Request your evening</h2>
      <p className="mt-2 text-sm text-cream/60">
        Send an enquiry — reservation is confirmed only after our desk calls or messages you.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Input
          label="Full name"
          required
          autoComplete="name"
          maxLength={80}
          value={form.customer_name}
          onChange={update("customer_name")}
          error={errors.customer_name}
          placeholder="e.g. Ananya Raman"
        />
        <Input
          label="Mobile number"
          required
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+91 98XXX XXXXX"
          value={form.customer_phone}
          onChange={update("customer_phone")}
          error={errors.customer_phone}
        />
        <Input
          label="Email"
          optional
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.customer_email}
          onChange={update("customer_email")}
          error={errors.customer_email}
        />
        <Input
          label="Guests"
          required
          type="number"
          min={1}
          max={40}
          value={form.guest_count}
          onChange={update("guest_count")}
          error={errors.guest_count}
        />
        <Input
          label="Date"
          required
          type="date"
          min={today}
          value={form.booking_date}
          onChange={update("booking_date")}
          error={errors.booking_date}
        />
        <Input
          label="Time"
          required
          type="time"
          value={form.booking_time}
          onChange={update("booking_time")}
          error={errors.booking_time}
        />
        <Select
          label="Occasion"
          required
          value={form.occasion}
          onChange={update("occasion")}
          placeholderOption="Select an occasion…"
          error={errors.occasion}
        >
          {OCCASIONS.map((o) => (
            <option key={o} value={o}>
              {occasionLabel[o]}
            </option>
          ))}
        </Select>
        <Select
          label="Dining preference"
          required
          value={form.dining_preference}
          onChange={update("dining_preference")}
          placeholderOption="Select seating…"
          error={errors.dining_preference}
        >
          {DINING_PREFERENCES.map((p) => (
            <option key={p} value={p}>
              {preferenceLabel[p]}
            </option>
          ))}
        </Select>
        <div className="sm:col-span-2">
          <Textarea
            label="Special requests"
            optional
            maxLength={500}
            placeholder="Allergies, cake arrangement, flower decor, seating wishes…"
            value={form.special_requests}
            onChange={update("special_requests")}
            error={errors.special_requests}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <Button type="submit" loading={submitting} size="lg">
          Send enquiry
        </Button>
        <p className="max-w-sm text-xs leading-relaxed text-cream/50">
          By submitting, you agree to our <a className="text-gold underline-offset-4 hover:underline" href="/terms">booking terms</a> and{" "}
          <a className="text-gold underline-offset-4 hover:underline" href="/privacy">privacy policy</a>.
        </p>
      </div>

      {serverError && (
        <p role="alert" className="mt-6 rounded-xl border border-red-400/50 bg-red-500/10 px-5 py-4 text-sm text-red-200">
          {serverError}
        </p>
      )}
    </form>
  );
}
