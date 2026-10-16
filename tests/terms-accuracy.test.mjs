// Guards the Terms of Service against drifting from what the apps sell and do.
// Run with: node --test 'tests/*.test.mjs'
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const text = (file) =>
  readFileSync(new URL(`../${file}`, import.meta.url), "utf8")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ");

const terms = text("terms-of-service.html");

test("terms: Creator tier is not described as on sale", () => {
  assert.doesNotMatch(terms, /Creator/);
});

test("terms: lists the Pro prices and trial", () => {
  assert.match(terms, /\$4\.99/);
  assert.match(terms, /\$29\.99/);
  assert.match(terms, /\$69\.99/);
  assert.match(terms, /7-day free trial/i);
});

test("terms: daily limits use a rolling 24 hours", () => {
  assert.doesNotMatch(terms, /Daily limits reset each day/i);
  assert.match(terms, /rolling 24-hour/i);
});

test("terms: no fixed 24-hour moderation promise", () => {
  assert.doesNotMatch(terms, /within 24 hours/i);
  assert.match(terms, /no tolerance for objectionable content/i);
});

test("terms: third-party recipes are credited and not claimed", () => {
  assert.match(terms, /Third-Party Recipes and Credits/i);
  assert.match(terms, /Fuji X Weekly/);
  assert.match(terms, /request correction or removal/i);
  assert.doesNotMatch(terms, /content \(excluding User Content\), is owned by FujiMuse/);
});

test("terms: last updated date", () => {
  assert.match(terms, /Last Updated: October 16, 2026/);
});
