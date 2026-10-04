import { BUSINESS } from "../src/data/business.js";

const required = ["legalName", "phone", "address", "legalUpdated"];
const missing = required.filter((k) => !String(BUSINESS[k] ?? "").trim());
if (missing.length) {
  console.error(`Production deploy blocked: fill in BUSINESS.${missing.join(", BUSINESS.")} in src/data/business.js (must match the A2P brand registration).`);
  process.exit(1);
}
console.log("Business details complete.");
