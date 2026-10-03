import { Link } from "@tanstack/react-router";
import LegalPage, { LegalSection } from "../components/LegalPage";
import { BUSINESS } from "../data/business";

export default function Privacy() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy">
      {/* Full policy sections from the owner's approved document are inserted here. */}
      <LegalSection title="Text messaging and mobile information">
        <p>
          If you give {BUSINESS.name} your mobile number and agree to receive text messages, we use that number only
          to message you about your inquiry, including appointment reminders, scheduling and booking updates, and
          follow-ups to your questions.
        </p>
        <p>
          <strong className="text-foreground">
            No mobile information will be shared with third parties or affiliates for marketing or promotional
            purposes. Text messaging originator opt-in data and consent will not be shared with any third parties.
          </strong>
        </p>
        <p>
          We may share information with service providers that help us deliver messages and run our business (for
          example, our messaging platform), only so they can perform services for us and not for their own marketing.
        </p>
        <p>
          You can stop text messages at any time by replying STOP. Reply HELP for help. Message frequency varies, and
          message and data rates may apply. See our <Link to="/terms" className="text-primary underline">Terms of Service</Link> for the full
          text messaging terms.
        </p>
      </LegalSection>
      <LegalSection title="Contact us">
        <p>
          Questions about this policy: <a className="text-primary underline" href={`mailto:${BUSINESS.supportEmail}`}>{BUSINESS.supportEmail}</a>
          {BUSINESS.address ? <>. {BUSINESS.legalName || BUSINESS.name}, {BUSINESS.address}.</> : "."}
        </p>
      </LegalSection>
    </LegalPage>
  );
}
