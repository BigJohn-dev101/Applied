import { describe, expect, it } from "vitest";
import {
  countByStage,
  daysSince,
  formatDaysAgo,
  needsNudge,
  toISODate,
} from "./applications";
import type { Application } from "../types";

const job: Application = {
  id: "1",
  company: "Vodacom",
  role: "Junior Developer",
  dateSent: "2026-10-01",
  stage: "applied",
  createdAt: "2026-10-01T09:00:00Z",
};

describe("daysSince", () => {
  it("counts whole days between two dates", () => {
    expect(daysSince("2026-10-01", new Date("2026-10-15"))).toBe(14);
  });

  it("rounds down part of a day", () => {
    expect(daysSince("2026-10-01", new Date("2026-10-02T12:00:00Z"))).toBe(1);
  });
});

describe("needsNudge", () => {
  it("is false at exactly fourteen days", () => {
    expect(needsNudge(job, new Date("2026-10-15"))).toBe(false);
  });

  it("is true at fifteen days", () => {
    expect(needsNudge(job, new Date("2026-10-16"))).toBe(true);
  });

  it.each(["wishlist", "interview", "offer", "closed"] as const)(
    "is false at %s however old it is",
    (stage) => {
      expect(needsNudge({ ...job, stage }, new Date("2026-12-01"))).toBe(false);
    },
  );
});

describe("countByStage", () => {
  it("returns zero for every stage when the list is empty", () => {
    expect(countByStage([])).toEqual({
      wishlist: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      closed: 0,
    });
  });

  it("counts each stage separately", () => {
    const list: Application[] = [
      job,
      { ...job, id: "2" },
      { ...job, id: "3", stage: "interview" },
      { ...job, id: "4", stage: "closed" },
    ];
    expect(countByStage(list)).toEqual({
      wishlist: 0,
      applied: 2,
      interview: 1,
      offer: 0,
      closed: 1,
    });
  });
});

describe("formatDaysAgo", () => {
  it("says today for zero days", () => {
    expect(formatDaysAgo(0)).toBe("today");
  });

  it("uses the singular for one day", () => {
    expect(formatDaysAgo(1)).toBe("1 day ago");
  });

  it("uses the plural for more", () => {
    expect(formatDaysAgo(24)).toBe("24 days ago");
  });
});

describe("toISODate", () => {
  it("pads the month and day", () => {
    // Built from local parts, so the result does not depend on the time zone.
    expect(toISODate(new Date(2026, 9, 5))).toBe("2026-10-05");
  });
});