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

export const SMS_CONSENT_VERSION = "2026-10-03-transactional-v1";

export const SMS_CONSENT_TEXT = `I agree to receive text messages from ${BUSINESS.name} at the mobile number above about my inquiry, including appointment reminders, scheduling and booking updates, and follow-ups to my questions. Consent is not a condition of any purchase. Message frequency varies. Message and data rates may apply. Reply STOP to cancel, HELP for help.`;
