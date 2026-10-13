import type { Application } from "../types";
import { daysSince, needsNudge } from "../lib/applications";
import { StageBadge } from "./StageBadge";

type Props = {
  application: Application;
};

function formatDaysAgo(days: number): string {
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function ApplicationCard({ application }: Props) {
  const days = daysSince(application.dateSent);
  const nudge = needsNudge(application);

  return (
    <article className="rounded-lg border p-4">
      <h3 className="font-semibold">{application.company}</h3>
      <p className="text-sm">{application.role}</p>
      <StageBadge stage={application.stage} />
      <p className="text-xs">
        {application.stage === "wishlist"
          ? "Not sent yet"
          : `Sent ${application.dateSent} · ${formatDaysAgo(days)}`}
      </p>
      {nudge && <p className="text-xs font-semibold">Needs a nudge</p>}
    </article>
  );
}