import { SectionHeading } from "../components/ui/misc";
import { ButtonAnchor } from "../components/ui/Button";
import { SITE, mapsDirectionsUrl } from "../lib/config";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-40 sm:px-8">
      <SectionHeading
        eyebrow="Contact & directions"
        title="Above the city, easy to find"
        subtitle="Directions, service hours and every way to reach the reservations desk."
      />

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-slate-line">
          <iframe
            title="Map showing the restaurant location"
            src={mapSrc}
            className="h-[380px] w-full grayscale-[35%] contrast-110"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-line bg-night-2/70 p-8">
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-6 w-6 shrink-0 text-gold" aria-hidden="true" />
              <div>
                <h2 className="font-display text-2xl text-cream">Address</h2>
                <p className="mt-3 text-sm leading-relaxed text-cream/65">{SITE.addressLine}</p>
                <div className="mt-5">
                  <ButtonAnchor href={mapsDirectionsUrl(SITE.mapQuery)} variant="outline" size="sm">
                    Get directions
                  </ButtonAnchor>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-line bg-night-2/70 p-8">
            <h2 className="font-display text-2xl text-cream">Reach the desk</h2>
            <ul className="mt-5 space-y-4 text-sm text-cream/70">
              <li className="flex items-center gap-4">
                <Phone size={18} className="text-gold" aria-hidden="true" />
                <span>
                  Reservations · <a className="hover:text-gold" href={`tel:+${SITE.whatsappNumber}`}>{SITE.phone}</a>
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={18} className="text-gold" aria-hidden="true" />
                <span>
                  <a className="hover:text-gold" href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Clock size={18} className="text-gold" aria-hidden="true" />
                <span>{SITE.hours}</span>
              </li>
            </ul>
            <p className="mt-6 text-xs text-cream/40">
              Phone number, email and hours are placeholder data until the business confirms them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
