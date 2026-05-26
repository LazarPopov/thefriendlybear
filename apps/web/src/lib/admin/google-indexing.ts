import { createSign } from "node:crypto";
import { routeMap } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

const googleOAuthTokenUrl = "https://oauth2.googleapis.com/token";
const googleIndexingPublishUrl = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const googleIndexingScope = "https://www.googleapis.com/auth/indexing";
const googleIndexingNotificationType = "URL_UPDATED";

type GoogleIndexingFailure = {
  url: string;
  status?: number;
  error: string;
};

export type GoogleIndexingResult = {
  attempted: boolean;
  urls: string[];
  submitted: string[];
  failed: GoogleIndexingFailure[];
  skippedReason?: string;
};

function base64Url(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function normalizePrivateKey(privateKey: string) {
  return privateKey.replace(/\\n/g, "\n");
}

function formatError(error: unknown) {
  return error instanceof Error ? error.message : "Unknown Google Indexing error.";
}

function createServiceAccountAssertion(clientEmail: string, privateKey: string, now = new Date()) {
  const issuedAt = Math.floor(now.getTime() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: googleIndexingScope,
      aud: googleOAuthTokenUrl,
      iat: issuedAt,
      exp: issuedAt + 3600
    })
  );
  const unsignedToken = `${header}.${payload}`;
  const signature = createSign("RSA-SHA256").update(unsignedToken).end().sign(normalizePrivateKey(privateKey));

  return `${unsignedToken}.${base64Url(signature)}`;
}

async function requestAccessToken(clientEmail: string, privateKey: string) {
  const assertion = createServiceAccountAssertion(clientEmail, privateKey);
  const response = await fetch(googleOAuthTokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });
  const payload = (await response.json().catch(() => null)) as { access_token?: unknown; error_description?: unknown } | null;

  if (!response.ok) {
    const reason = typeof payload?.error_description === "string" ? ` ${payload.error_description}` : "";
    throw new Error(`Google OAuth token request failed with ${response.status}.${reason}`);
  }

  if (typeof payload?.access_token !== "string" || !payload.access_token) {
    throw new Error("Google OAuth token response did not include an access token.");
  }

  return payload.access_token;
}

async function publishIndexingNotification(url: string, accessToken: string) {
  try {
    const response = await fetch(googleIndexingPublishUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url,
        type: googleIndexingNotificationType
      })
    });

    if (response.ok) {
      return null;
    }

    const text = await response.text().catch(() => "");
    return {
      url,
      status: response.status,
      error: text
        ? `Google Indexing request failed with ${response.status}: ${text.slice(0, 240)}`
        : `Google Indexing request failed with ${response.status}.`
    };
  } catch (error) {
    return {
      url,
      error: formatError(error)
    };
  }
}

export function getMenuIndexingUrls() {
  return [routeMap.menu.bg, routeMap.menu.en].map((path) => new URL(path, siteConfig.siteUrl).toString());
}

export async function requestGoogleIndexingForMenuUrls(): Promise<GoogleIndexingResult> {
  const urls = getMenuIndexingUrls();
  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY?.trim();

  if (!clientEmail || !privateKey) {
    return {
      attempted: false,
      urls,
      submitted: [],
      failed: [],
      skippedReason: "Google Indexing service account environment variables are not configured."
    };
  }

  try {
    const accessToken = await requestAccessToken(clientEmail, privateKey);
    const failures = (await Promise.all(urls.map((url) => publishIndexingNotification(url, accessToken)))).filter(
      (failure): failure is GoogleIndexingFailure => Boolean(failure)
    );
    const failedUrls = new Set(failures.map((failure) => failure.url));

    return {
      attempted: true,
      urls,
      submitted: urls.filter((url) => !failedUrls.has(url)),
      failed: failures
    };
  } catch (error) {
    return {
      attempted: true,
      urls,
      submitted: [],
      failed: urls.map((url) => ({
        url,
        error: formatError(error)
      }))
    };
  }
}
