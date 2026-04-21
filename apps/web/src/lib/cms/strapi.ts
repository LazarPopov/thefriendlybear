import { cache } from "react";

type StrapiEnvelope<T> = {
  data?: T;
  meta?: Record<string, unknown>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeStrapiNode<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeStrapiNode(item)) as T;
  }

  if (!isRecord(value)) {
    return value;
  }

  if (isRecord(value.attributes)) {
    return normalizeStrapiNode({
      ...value.attributes,
      id: value.id,
      documentId: value.documentId
    } as T);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [key, normalizeStrapiNode(nestedValue)])
  ) as T;
}

function getStrapiBaseUrl() {
  return process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? null;
}

function getStrapiToken() {
  return process.env.STRAPI_API_TOKEN ?? null;
}

export function isStrapiConfigured() {
  return Boolean(getStrapiBaseUrl());
}

const fetchStrapiEnvelope = cache(async (pathWithQuery: string): Promise<StrapiEnvelope<unknown> | null> => {
  const baseUrl = getStrapiBaseUrl();
  const token = getStrapiToken();

  if (!baseUrl) {
    return null;
  }

  const url = new URL(pathWithQuery, baseUrl).toString();

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as StrapiEnvelope<unknown>;
  } catch {
    return null;
  }
});

export async function fetchStrapiSingle<T>(pathWithQuery: string): Promise<T | null> {
  const payload = (await fetchStrapiEnvelope(pathWithQuery)) as StrapiEnvelope<T> | null;

  if (!payload?.data) {
    return null;
  }

  return normalizeStrapiNode(payload.data);
}

export async function fetchStrapiCollection<T>(pathWithQuery: string): Promise<T[]> {
  const payload = (await fetchStrapiEnvelope(pathWithQuery)) as StrapiEnvelope<T[]> | null;

  if (!Array.isArray(payload?.data)) {
    return [];
  }

  return normalizeStrapiNode(payload.data);
}
