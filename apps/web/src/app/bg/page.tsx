import type { Metadata } from "next";
import { BulgarianHomePageCms } from "@/components/bg-home-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getHomePageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "home",
  title: "Уютен ресторант и градина в центъра на София | The Friendly Bear",
  description:
    "Заповядайте в The Friendly Bear на ул. Славянска 23. Градска бърлога от 1923 г. с тайна градина, камина, бавно печено BBQ и крафт бира. Приветливо обслужване и вкусна храна."
});

export default async function Page() {
  const schema = await getHomePageSchemaData("bg");

  return (
    <>
      <StructuredData data={schema} />
      <BulgarianHomePageCms />
    </>
  );
}
