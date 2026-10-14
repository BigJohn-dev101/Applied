import { Link } from "react-router";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Application } from "../types";
import { daysSince, formatDaysAgo, needsNudge } from "../lib/applications";
import { STAGE_ACCENT } from "../lib/stages";
import { StageBadge } from "./StageBadge";

type Props = {
  application: Application;
};

export function ApplicationCard({ application }: Props) {
  const days = daysSince(application.dateSent);
  const nudge = needsNudge(application);

  return (
    <article>
      {/* The link's ::after stretches over the whole card, so the entire
          card is clickable while there is still just one real link. */}
      <Card
        className={cn(
          "group/card relative gap-3 py-5 shadow-md shadow-black/5 transition-all duration-200 dark:shadow-black/30",
          "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 hover:ring-amber-500/50 dark:hover:shadow-black/40",
          "has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring",
          nudge && "ring-amber-500/50",
        )}
      >
        {/* Stage accent bar down the left edge. The badge still carries the word. */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-0 left-0 w-1.5",
            STAGE_ACCENT[application.stage],
          )}
        />
        <CardHeader>
          <CardTitle className="text-base">
            <Link
              to={`/applications/${application.id}`}
              className="outline-none after:absolute after:inset-0"
            >
              {application.company}
            </Link>
          </CardTitle>
          <CardDescription>{application.role}</CardDescription>
          <CardAction>
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 text-muted-foreground transition-transform group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
            />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          <StageBadge stage={application.stage} />
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            {application.stage === "wishlist"
              ? "Not sent yet"
              : `Sent ${application.dateSent} · ${formatDaysAgo(days)}`}
          </span>
          {nudge && (
            <Badge className="bg-amber-400 text-black">Needs a nudge</Badge>
          )}
        </CardContent>
      </Card>
    </article>
  );
}