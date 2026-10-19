import BookingForm from "../components/BookingForm";
import { SITE } from "../lib/config";

const STEPS = [
  {
    no: "01",
    t: "Send the enquiry — it reaches our reservations desk as a pending request.",
  },
  {
    no: "02",
    t: "We confirm availability by call or WhatsApp. Enquiries are never auto-confirmed.",
  },
  {
    no: "03",
    t: "Arrive to your igloo or terrace table, everything composed in advance.",
  },
];

export default function Reservations() {
  return (
    <div className="pt-16">
      {/* Atmospheric header */}
      <section className="relative overflow-hidden">
        <img
          src="/images/photography/service.jpg"
          alt="A curated table set for service — representative editorial photograph"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #10231e 6%, rgba(16,35,30,0.85) 45%, rgba(16,35,30,0.35) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-52 sm:px-8">
          <p className="eyebrow mb-6 flex items-center gap-4 text-brass">
            <span className="h-px w-12 bg-brass/70" aria-hidden="true" />
            Reservations
          </p>
          <h1 className="max-w-3xl font-display text-[3rem] font-light leading-[1.02] text-ivory sm:text-[4.6rem]">
            The table, the igloo,
            <em className="block italic text-brass-2">the evening itself.</em>
          </h1>
          <p className="mt-7 max-w-xl text-[1rem] font-light leading-[1.9] text-ivory/70">
            One short form. A confirmation call. Then nothing to think about but the company.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-16 bg-forest px-5 py-24 sm:px-8 lg:grid-cols-[1.55fr_1fr]">
        <BookingForm />

        <aside className="space-y-12">
          {/* Process */}
          <div>
            <p className="rule-note mb-8">
              <span className="eyebrow">What happens next</span>
            </p>
            <ol className="space-y-8">
              {STEPS.map((s) => (
                <li key={s.no} className="grid grid-cols-[56px_1fr] gap-5 border-b border-ivory/10 pb-7">
                  <span className="font-display text-2xl font-light text-brass">{s.no}</span>
                  <p className="text-[0.92rem] font-light leading-[1.8] text-ivory/65">{s.t}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Reach the desk */}
          <div>
            <p className="rule-note mb-8">
              <span className="eyebrow">Reach the desk directly</span>
            </p>
            <dl className="space-y-5 text-[0.92rem] font-light text-ivory/70">
              <div>
                <dt className="text-[0.6rem] font-medium uppercase tracking-[0.26em] text-ivory/40">Phone</dt>
                <dd className="mt-1">
                  <a href={`tel:+${SITE.whatsappNumber}`} className="transition-colors hover:text-brass">
                    {SITE.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[0.6rem] font-medium uppercase tracking-[0.26em] text-ivory/40">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-brass">
                    {SITE.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[0.6rem] font-medium uppercase tracking-[0.26em] text-ivory/40">Hours</dt>
                <dd className="mt-1 whitespace-pre-line leading-relaxed">{SITE.hours}</dd>
              </div>
            </dl>
            <p className="mt-6 text-[0.68rem] font-light leading-relaxed text-ivory/35">
              Contact details are unverified placeholders pending confirmation by the business.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
