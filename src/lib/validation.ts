import { toISODate } from "./applications";

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Dates are YYYY-MM-DD text, which compares correctly as plain strings.
export function isFutureDate(dateSent: string, today: Date = new Date()): boolean {
  return dateSent > toISODate(today);
}