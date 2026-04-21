import { permanentRedirect } from "next/navigation";
import { getTouristMarketSlug } from "@/lib/tourist-market";

export default async function Page() {
  permanentRedirect(`/el/${await getTouristMarketSlug("el")}`);
}
