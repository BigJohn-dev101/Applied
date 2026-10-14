import type { Application, Stage } from "../types";

const DAY = 1000 * 60 * 60 * 24;

export function daysSince(dateSent: string, today: Date = new Date()): number {
  const sent = new Date(dateSent);
  const gap = today.getTime() - sent.getTime();
  return Math.floor(gap / DAY);
}

export function needsNudge(job: Application, today: Date = new Date()): boolean {
  if (job.stage !== "applied") return false;
  return daysSince(job.dateSent, today) > 14;
}

export function formatDaysAgo(days: number): string {
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function countByStage(applications: Application[]): Record<Stage, number> {
  const counts: Record<Stage, number> = {
    wishlist: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    closed: 0,
  };
  for (const application of applications) {
    counts[application.stage] += 1;
  }
  return counts;
}

export function toISODate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}