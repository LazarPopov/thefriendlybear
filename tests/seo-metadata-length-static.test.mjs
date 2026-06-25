import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const maxTitleLength = 65;
const maxDescriptionLength = 165;

const metadataSources = [
  "apps/web/src/app/bg/page.tsx",
  "apps/web/src/app/en/page.tsx",
  "apps/web/src/app/bg/about/page.tsx",
  "apps/web/src/app/en/about/page.tsx",
  "apps/web/src/app/bg/menu/page.tsx",
  "apps/web/src/app/en/menu/page.tsx",
  "apps/web/src/app/bg/contact/page.tsx",
  "apps/web/src/app/en/contact/page.tsx",
  "apps/web/src/app/bg/reservations/page.tsx",
  "apps/web/src/app/en/reservations/page.tsx",
  "apps/web/src/app/bg/promotions/page.tsx",
  "apps/web/src/app/en/promotions/page.tsx",
  "apps/web/src/app/bg/reviews/page.tsx",
  "apps/web/src/app/en/reviews/page.tsx",
  "apps/web/src/app/bg/photos/page.tsx",
  "apps/web/src/app/en/photos/page.tsx",
  "apps/web/src/app/bg/tourists/page.tsx",
  "apps/web/src/app/en/tourists/page.tsx",
  "apps/web/src/app/bg/where-to-eat-sofia-center/page.tsx",
  "apps/web/src/app/en/where-to-eat-sofia-center/page.tsx",
  "apps/web/src/app/en/hidden-gem-restaurant-sofia/page.tsx",
  "apps/web/src/lib/tourist-market-route.ts"
];

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function extractStringLiteral(source, startIndex) {
  const firstQuote = source.indexOf('"', startIndex);

  if (firstQuote === -1) {
    return null;
  }

  let value = "";

  for (let index = firstQuote + 1; index < source.length; index += 1) {
    const character = source[index];

    if (character === "\\" && index + 1 < source.length) {
      value += source[index + 1];
      index += 1;
      continue;
    }

    if (character === '"') {
      return value;
    }

    value += character;
  }

  return null;
}

function extractMetadataValues(relativePath) {
  const source = read(relativePath);
  const entries = [];
  const propertyPattern = /(^|\n)\s*(title|description):\s*/g;
  const constPattern = /const\s+(hiddenGemTitle|hiddenGemDescription)\s*=\s*/g;
  let match;

  while ((match = propertyPattern.exec(source))) {
    const key = match[2];
    const value = extractStringLiteral(source, propertyPattern.lastIndex);

    if (value) {
      entries.push({ relativePath, key, value });
    }
  }

  while ((match = constPattern.exec(source))) {
    const key = match[1] === "hiddenGemTitle" ? "title" : "description";
    const value = extractStringLiteral(source, constPattern.lastIndex);

    if (value) {
      entries.push({ relativePath, key, value });
    }
  }

  return entries;
}

test("public SEO metadata stays within crawl-safe title and description lengths", () => {
  const tooLong = metadataSources
    .flatMap(extractMetadataValues)
    .map((entry) => ({
      ...entry,
      maxLength: entry.key === "title" ? maxTitleLength : maxDescriptionLength
    }))
    .filter((entry) => entry.value.length > entry.maxLength);

  assert.deepEqual(
    tooLong.map((entry) => ({
      file: entry.relativePath,
      key: entry.key,
      length: entry.value.length,
      maxLength: entry.maxLength,
      value: entry.value
    })),
    []
  );
});
