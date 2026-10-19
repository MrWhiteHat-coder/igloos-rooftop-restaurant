import LegalShell from "../components/LegalShell";

export default function Privacy() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Privacy policy"
      updated="Last updated: October 2026 · The live version is always this page."
    >
      <section>
        <h2>1. What we collect</h2>
        <p>
          When you send a reservation enquiry through this website, we ask for your name, mobile
          number, optional email, requested date and time, guest count, occasion, dining
          preference and any special requests you choose to include.
        </p>
      </section>

      <section>
        <h2>2. Why we collect it</h2>
        <ul>
          <li>To contact you to confirm or change your reservation;</li>
          <li>To plan seating, igloo allocation and celebration arrangements;</li>
          <li>To keep a record of service history when you visit us again;</li>
          <li>To comply with legal obligations applicable to the restaurant.</li>
        </ul>
      </section>

      <section>
        <h2>3. Who can see it</h2>
        <p>
          Booking data is stored in a private database with strict access rules: only the
          restaurant's authorised staff can view or manage reservation records through secured
          dashboard access. Reservation data is never sold and is not used for advertising.
        </p>
      </section>

      <section>
        <h2>4. WhatsApp contact</h2>
        <p>
          The website can open a prefilled WhatsApp message with your enquiry and booking
          reference. That is a convenience for reaching the desk; sending the message does not
          confirm a booking — only authorised staff do that.
        </p>
      </section>

      <section>
        <h2>5. Retention</h2>
        <p>
          We keep reservation records only as long as needed for service history, coordination
          and applicable legal record-keeping, after which they are deleted or anonymised.
        </p>
      </section>

      <section>
        <h2>6. Your choices</h2>
        <p>
          You may ask us to correct or remove your reservation data by sending a note to the
          contact details on our Contact page, quoting your booking reference.
        </p>
      </section>

      <section>
        <h2>7. Questions</h2>
        <p>
          Privacy questions are handled by the restaurant's front-of-house management, reachable
          through the Contact page. Contact details shown are placeholder data until confirmed by
          the business.
        </p>
      </section>
    </LegalShell>
  );
}
