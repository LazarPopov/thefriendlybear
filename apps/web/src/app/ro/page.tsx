import { permanentRedirect } from "next/navigation";
import { getTouristMarketRoutePath } from "@/lib/tourist-market-route";

export default function Page() {
  permanentRedirect(getTouristMarketRoutePath("ro"));
}
