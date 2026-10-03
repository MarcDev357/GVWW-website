import LegalPage from "../components/LegalPage";
import { PRIVACY } from "../data/legal";

export default function Privacy() {
  return <LegalPage title="Privacy Policy" doc={PRIVACY} />;
}
