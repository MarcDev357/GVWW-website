// Business identity shown on the contact page and in the legal pages. Carriers
// vetting an A2P campaign compare these to the registered brand, so they must
// match the registration exactly. Empty strings are hidden on the site and
// block a production deploy (scripts/check-business.mjs).
export const BUSINESS = {
  name: "Veteran Webworks",
  legalName: "",
  email: "marcus@veteranwebworks.com",
  supportEmail: "marcus@veteranwebworks.com",
  phone: "",
  address: "",
  smsProgramName: "Veteran Webworks Text Messages",
  legalUpdated: "",
};

export const SMS_CONSENT_VERSION = "2026-10-03-split-v2";

const SMS_TAIL = "Consent is not a condition of any purchase. Message frequency varies. Message and data rates may apply. Reply STOP to cancel, HELP for help.";

export const SMS_TRANSACTIONAL_TEXT = `I agree to receive transactional text messages from ${BUSINESS.name} at the mobile number above about my inquiry, including replies to my questions, appointment and booking confirmations and reminders, scheduling updates, and service follow-ups. ${SMS_TAIL}`;

export const SMS_MARKETING_TEXT = `I agree to receive recurring marketing and promotional text messages from ${BUSINESS.name} at the mobile number above, such as offers, news, and updates about our services. Messages may be sent using an automated system. I understand I am not required to agree to receive marketing texts to buy anything or to contact ${BUSINESS.name}. ${SMS_TAIL}`;
