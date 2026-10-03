import LegalPage from "../components/LegalPage";
import { TERMS } from "../data/legal";

export default function Terms() {
  return <LegalPage title="Terms of Service" doc={TERMS} />;
}
