import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "The Friendly Bear Sofia",
  description: "Началната страница пренасочва към българската версия на сайта.",
  alternates: {
    canonical: "/",
    languages: {
      bg: "/bg",
      en: "/en",
      "x-default": "/bg"
    }
  }
};

export default function RootPage() {
  redirect("/bg");
  return null;
}
