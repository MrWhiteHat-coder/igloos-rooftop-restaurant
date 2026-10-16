import BookingForm from "../components/BookingForm";
import { SITE } from "../lib/config";
import { Clock, PhoneCall, ShieldCheck } from "lucide-react";

const ASSURANCES = [
  {
    icon: Clock,
    title: "Response within a few hours",
    text: "Our reservations desk reviews enquiries during service hours (placeholder schedule).",
  },
  {
    icon: PhoneCall,
    title: "Confirmation happens by call or WhatsApp",
    text: "A submitted enquiry stays Pending until an authorised team member confirms it.",
  },
  {
    icon: ShieldCheck,
    title: "Your details stay with the restaurant",
    text: "Booking data is stored privately and used only for this reservation.",
  },
] as const;

export default function Reservations() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-40 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.32em] text-gold">
          Reservations
        </p>
        <h1 className="font-display text-4xl text-cream sm:text-6xl">
          The table, the igloo, the evening.
        </h1>
        <p className="mt-5 text-cream/70">
          Send an enquiry below. We will confirm availability for your date and party before the
          reservation is final — an enquiry is never an automatic booking.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-10 lg:grid-cols-[1.6fr_1fr]">
        <BookingForm />
        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-line bg-night-2/70 p-8">
            <h2 className="font-display text-2xl text-gold">What happens next</h2>
            <ul className="mt-6 space-y-5">
              {ASSURANCES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-4">
                  <Icon size={20} className="mt-1 shrink-0 text-gold" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-cream">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-cream/55">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-line bg-night-2/70 p-8 text-sm text-cream/70">
            <h2 className="font-display text-2xl text-cream">Reach us directly</h2>
            <p className="mt-4">Phone · {SITE.phone}</p>
            <p className="mt-2">WhatsApp · {SITE.phone}</p>
            <p className="mt-2">Email · {SITE.email}</p>
            <p className="mt-2 whitespace-pre-line">{SITE.hours}</p>
            <p className="mt-4 text-xs text-cream/40">
              Contact details shown are unverified placeholders until confirmed by the business.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
