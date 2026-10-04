import { Link } from "@tanstack/react-router";
import LegalPage, { LegalSection } from "../components/LegalPage";
import { BUSINESS } from "../data/business";

export default function Terms() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Service">
      {/* Full terms from the owner's approved document are inserted here. */}
      <LegalSection title="Text messaging program">
        <p>By agreeing to receive text messages on our contact form, you agree to these program terms.</p>
        <ul className="list-disc space-y-3 pl-6">
          <li>
            <strong className="text-foreground">Program:</strong> {BUSINESS.smsProgramName}. {BUSINESS.name} sends two
            kinds of text messages, each with its own opt-in on our contact form: (1) transactional messages, such as
            replies to inquiries, appointment and booking confirmations and reminders, scheduling updates, and
            service follow-ups; and (2) recurring marketing and promotional messages, such as offers, news, and
            updates about our services. You can opt in to either or both. Marketing messages may be sent using an
            automated system.
          </li>
          <li>
            <strong className="text-foreground">Consent:</strong> Consent is optional and is not a condition of any
            purchase. Agreeing to transactional messages does not enroll you in marketing messages.
          </li>
          <li>
            <strong className="text-foreground">Message frequency:</strong> Message frequency varies with your
            inquiry and appointments.
          </li>
          <li>
            <strong className="text-foreground">Rates:</strong> Message and data rates may apply. Check with your
            mobile carrier for details.
          </li>
          <li>
            <strong className="text-foreground">Opt out:</strong> Reply STOP at any time to cancel all text messages. We
            will send one message to confirm, and you will receive no further texts. To join again, opt in on our contact form as
            you did the first time.
          </li>
          <li>
            <strong className="text-foreground">Help:</strong> Reply HELP for assistance, email{" "}
            <a className="text-primary underline" href={`mailto:${BUSINESS.supportEmail}`}>{BUSINESS.supportEmail}</a>
            {BUSINESS.phone ? <>, or call {BUSINESS.phone}</> : null}.
          </li>
          <li>
            <strong className="text-foreground">Carriers:</strong> Carriers are not liable for delayed or undelivered
            messages.
          </li>
          <li>
            <strong className="text-foreground">Privacy:</strong> How we handle your mobile number is described in
            our <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>.
          </li>
        </ul>
      </LegalSection>
    </LegalPage>
  );
}
