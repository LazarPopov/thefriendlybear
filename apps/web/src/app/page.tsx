import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "The Friendly Bear Sofia",
  description: "The Friendly Bear Sofia is a cozy restaurant and garden on Slavyanska 23 in central Sofia.",
  alternates: {
    canonical: "/bg",
    languages: {
      bg: "/bg",
      en: "/en",
      "bg-BG": "/bg",
      "en-GB": "/en",
      "x-default": "/bg"
    }
  }
};

export default function RootPage() {
  redirect("/bg");
  return null;
}
