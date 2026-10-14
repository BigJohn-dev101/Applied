import { describe, expect, it } from "vitest";
import { isFutureDate, isValidUrl } from "./validation";

describe("isValidUrl", () => {
  it("accepts http and https addresses", () => {
    expect(isValidUrl("https://careers.vodacom.co.za")).toBe(true);
    expect(isValidUrl("http://example.com/jobs?id=1")).toBe(true);
  });

  it.each(["abc", "careers.vodacom.co.za", "ftp://example.com", "javascript:alert(1)"])(
    "rejects %s",
    (value) => {
      expect(isValidUrl(value)).toBe(false);
    },
  );
});

describe("isFutureDate", () => {
  // Local-time constructor, so the test does not depend on the time zone.
  const today = new Date(2026, 9, 15);

  it("is false for today", () => {
    expect(isFutureDate("2026-10-15", today)).toBe(false);
  });

  it("is false for a past date", () => {
    expect(isFutureDate("2026-10-14", today)).toBe(false);
  });

  it("is true for tomorrow", () => {
    expect(isFutureDate("2026-10-16", today)).toBe(true);
  });
});