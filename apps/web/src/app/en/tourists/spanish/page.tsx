import { permanentRedirect } from "next/navigation";
import { getTouristLandingPagePathForAudience } from "@/lib/tourist-landing-page-module";

export default async function Page() {
  permanentRedirect(await getTouristLandingPagePathForAudience("en", "spanish"));
}
