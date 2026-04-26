"use server";

import { isStrapiConfigured } from "@/lib/cms/strapi";

export type SubscribeResult = {
  success: boolean;
  error?: string;
};

export async function subscribeToNewsletter(formData: FormData): Promise<SubscribeResult> {
  const email = formData.get("email") as string;
  const marketingConsent = formData.get("marketingConsent") === "on";
  const locale = (formData.get("locale") as string) || "en";
  const source = (formData.get("source") as string) || "reservations_page";

  if (!email || !marketingConsent) {
    return { success: false, error: "Invalid data provided." };
  }

  const baseUrl = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = process.env.STRAPI_API_TOKEN;

  if (!baseUrl || !isStrapiConfigured()) {
    console.error("Strapi is not configured for newsletter subscription.");
    return { success: false, error: "Service temporarily unavailable." };
  }

  try {
    const response = await fetch(`${baseUrl}/api/marketing-subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        data: {
          email,
          marketingConsent,
          consentTimestamp: new Date().toISOString(),
          locale,
          source,
          isConfirmed: false,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Strapi newsletter error:", errorData);
      
      if (errorData?.error?.message?.includes("unique")) {
         return { success: true }; // Treat existing subscriber as success to avoid leaking emails
      }
      
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("Newsletter subscription exception:", error);
    return { success: false };
  }
}
