// Guards the privacy policy and terms against drifting from what the
// FujiMuse apps and website actually do. Run with: node --test 'tests/*.test.mjs'
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const text = (file) =>
  readFileSync(new URL(`../${file}`, import.meta.url), "utf8")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ");

const privacy = text("privacy-policy.html");
const terms = text("terms-of-service.html");

test("privacy: AI chat is not stored, not even on the device", () => {
  assert.doesNotMatch(privacy, /Chat history is stored locally/i);
  assert.match(privacy, /chat messages are not stored/i);
  assert.match(privacy, /usage records[^.]*35 days/i);
});

test("privacy: only email and password sign-in is described", () => {
  assert.doesNotMatch(privacy, /If you sign in with a third-party service/i);
  assert.match(privacy, /email address and password/i);
});

test("privacy: no promise of a full data export that does not exist", () => {
  assert.doesNotMatch(privacy, /Export your recipes and content in a portable format/i);
  assert.match(privacy, /copy of your data/i);
});

test("privacy: AI preview images are not stored by FujiMuse", () => {
  assert.doesNotMatch(privacy, /temporarily cached and may be stored in your post history/i);
  assert.match(privacy, /Replicate/);
});

test("privacy: discloses cloud recipe backup, public profile fields and post location", () => {
  assert.match(privacy, /cloud recipe backup/i);
  assert.match(privacy, /website/i);
  assert.match(privacy, /location/i);
  assert.match(privacy, /terms acceptance/i);
});

test("privacy: account deletion links to the public deletion page", () => {
  assert.match(privacy, /fujimuse\.app\/account-deletion/);
});

test("privacy: unsubscribe points at the live domain", () => {
  assert.doesNotMatch(privacy, /fujimuse-landing\.vercel\.app/);
  assert.match(privacy, /fujimuse\.app\/unsubscribe/);
});

test("privacy: no unverifiable security claims", () => {
  assert.doesNotMatch(privacy, /Regular security audits/i);
});

test("privacy: covers both app stores", () => {
  assert.match(privacy, /Apple/);
  assert.match(privacy, /Google Play/);
});

test("terms: free tier does not claim server AI previews", () => {
  assert.doesNotMatch(terms, /limited visual previews/i);
  assert.match(terms, /50 saved recipes/i);
});

test("terms: user-generated content rules required by app stores", () => {
  assert.match(terms, /no tolerance for objectionable content/i);
  assert.match(terms, /block/i);
  assert.match(terms, /24 hours/);
});

test("terms: subscriptions renew automatically and cancel in the store", () => {
  assert.match(terms, /renew automatically/i);
  assert.match(terms, /App Store/);
});

test("terms: Apple's minimum end-user terms are included", () => {
  assert.match(terms, /Apple is not responsible/i);
  assert.match(terms, /third-party beneficiary/i);
});

test("short links used by the apps resolve", () => {
  // The iOS app links to /fujimuse-legal/privacy and /fujimuse-legal/terms.
  for (const file of ["privacy.html", "terms.html"]) {
    assert.ok(existsSync(new URL(`../${file}`, import.meta.url)), `${file} missing`);
  }
});

test("contact and operator placeholders are the owner's until a company exists", () => {
  for (const doc of [privacy, terms]) {
    assert.doesNotMatch(doc, /gmail\.com/);
    assert.doesNotMatch(doc, /FujiMuse Development/);
    assert.match(doc, /davey@cleverfoxailabs\.com/);
    assert.match(doc, /Davey Randa/);
  }
});

test("privacy: names the waitlist confirmation email provider", () => {
  assert.match(privacy, /Resend/);
});
