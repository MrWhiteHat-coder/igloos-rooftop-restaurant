import { SectionHeading } from "../components/ui/misc";
import { ButtonLink, ButtonAnchor } from "../components/ui/Button";
import { SITE, mapsDirectionsUrl } from "../lib/config";

export default function Contact() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`;

  return (
    <div className="pt-24">
      <section className="bg-ivory text-espresso">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pt-28">
          <SectionHeading
            tone="light"
            align="left"
            eyebrow="Contact & directions"
            title="Above the city, easy to find."
          />
        </div>
      </section>

      <section className="bg-ivory-2 pb-28 text-espresso">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
          {/* Map */}
          <div className="lg:col-span-7">
            <div className="border border-espresso/15">
              <iframe
                title="Map showing the restaurant location"
                src={mapSrc}
                className="h-[380px] w-full grayscale-[35%] contrast-110 lg:h-[460px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <ButtonAnchor
                variant="espresso"
                size="sm"
                href={mapsDirectionsUrl(SITE.mapQuery)}
              >
                Open directions
              </ButtonAnchor>
              <span className="text-[0.72rem] font-light text-espresso/50">
                The pin is a placeholder locality until the business confirms the exact address.
              </span>
            </div>
          </div>

          {/* Channels */}
          <div className="lg:col-span-5">
            <address className="not-italic border-b border-espresso/15 pb-8">
              <p className="eyebrow text-brass-3">Address</p>
              <p className="mt-4 whitespace-pre-line font-display text-[1.55rem] font-light leading-snug">
                {SITE.addressLine}
              </p>
            </address>

            <dl className="mt-8 space-y-7">
              <div className="border-b border-espresso/15 pb-7">
                <dt className="eyebrow text-brass-3">Reservations desk</dt>
                <dd className="mt-3 space-y-1 text-[0.95rem] font-light">
                  <p>
                    <a className="hover:text-brass-3" href={`tel:+${SITE.whatsappNumber}`}>
                      {SITE.phone}
                    </a>
                  </p>
                  <p>
                    <a className="hover:text-brass-3" href={`mailto:${SITE.email}`}>
                      {SITE.email}
                    </a>
                  </p>
                  <p className="whitespace-pre-line leading-relaxed text-espresso/70">{SITE.hours}</p>
                </dd>
              </div>
              <div className="border-b border-espresso/15 pb-7">
                <dt className="eyebrow text-brass-3">Private igloo evenings</dt>
                <dd className="mt-3 text-[0.95rem] font-light leading-relaxed text-espresso/70">
                  Two to ten guests per dome. Larger parties are composed on the open terrace.
                  Celebration arrangements are confirmed at booking.
                </dd>
              </div>
            </dl>

            <p className="mt-7 text-[0.68rem] font-light text-espresso/45">
              Phone, email and hours shown are placeholders pending confirmation by the business.
            </p>

            <div className="mt-10">
              <ButtonLink to="/reservations" variant="espresso">
                Reserve online instead
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
