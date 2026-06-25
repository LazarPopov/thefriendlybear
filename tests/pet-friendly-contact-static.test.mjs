import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

test("contact pages visibly answer pet-friendly restaurant intent", () => {
  const enContact = read("apps/web/src/components/en-contact-page-cms.tsx");
  const bgContact = read("apps/web/src/components/bg-contact-page-cms.tsx");

  assert.match(enContact, /Pet-friendly restaurant in Sofia Center/);
  assert.match(enContact, /Well-behaved dogs are welcome in the garden and inside/);
  assert.match(enContact, /Call before you arrive if you want the easiest table with a dog/);

  assert.match(bgContact, /pet-friendly ресторант в центъра на София/);
  assert.match(bgContact, /Кучета с добро поведение са добре дошли в градината и вътре/);
  assert.match(bgContact, /Обадете се преди посещение, ако искате най-удобната маса с куче/);
});

test("contact FAQ schema keeps explicit pet-friendly answers", () => {
  const contactFaq = read("apps/web/src/lib/contact-faq.ts");
  const schema = read("apps/web/src/lib/schema.ts");

  assert.match(contactFaq, /schemaQuestion:\s*"Is the restaurant pet friendly\?"/);
  assert.match(contactFaq, /schemaAnswer:\s*"Yes, we are 100% pet friendly/);
  assert.match(schema, /mainEntity: contactFaqItems\[locale\]\.map/);
});
