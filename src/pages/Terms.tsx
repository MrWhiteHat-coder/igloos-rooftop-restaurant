import LegalShell from "../components/LegalShell";

export default function Terms() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Booking terms"
      updated="Last updated: October 2026 · These terms apply to all enquiries made through the website."
    >
      <section>
        <h2>1. Enquiry is not a confirmation</h2>
        <p>
          Submitting the reservation form creates a booking enquiry with a <em>pending</em>{" "}
          status and a booking reference. A reservation exists only once an authorised member of
          the restaurant's team confirms it by call, WhatsApp or email. The website never
          confirms a booking on its own.
        </p>
      </section>

      <section>
        <h2>2. WhatsApp link</h2>
        <p>
          After submitting an enquiry you may send a summarised message to the restaurant on
          WhatsApp. That is a convenience for reaching the desk; it does not confirm the table,
          and delivery of the message cannot be treated as proof of reservation.
        </p>
      </section>

      <section>
        <h2>3. Accuracy of details</h2>
        <p>
          Please provide an accurate mobile number and party size. Bookings may not be held
          against unreachable numbers. Party sizes materially above the requested count may be
          moved to the terrace subject to availability.
        </p>
      </section>

      <section>
        <h2>4. Private igloos</h2>
        <p>
          Igloo seats are limited and in high demand on weekends. Igloo capacity is up to 10
          guests. Igloo allotment, minimum spends (if any) and decor policies are communicated at
          confirmation. Igloo availability details shown on this website are placeholders until
          confirmed by the business.
        </p>
      </section>

      <section>
        <h2>5. Time limits</h2>
        <p>
          Tables and igloos are held for a reasonable grace period after the booked time; past
          that, the slot may be released at the restaurant's discretion. Please call — with your
          booking reference — if you are delayed.
        </p>
      </section>

      <section>
        <h2>6. Cancellation and changes</h2>
        <ul>
          <li>Enquiries: simply reply to the confirmation call or WhatsApp message.</li>
          <li>
            Confirmed bookings: request changes or cancellation by phone or WhatsApp, quoting
            your reference.
          </li>
          <li>
            Cancellation policies for celebration packages, if any, are shared by the restaurant
            before confirmation.
          </li>
        </ul>
      </section>

      <section>
        <h2>7. Conduct</h2>
        <p>
          The rooftop is a shared space. The restaurant may decline service to protect guest
          comfort, safety and operational considerations.
        </p>
      </section>

      <section>
        <h2>8. Right to refuse</h2>
        <p>
          The restaurant may adjust availability, menus, igloo allocation, service hours and
          pricing. Where possible, previously confirmed bookings are honoured on the terms
          communicated at confirmation time.
        </p>
      </section>
    </LegalShell>
  );
}
