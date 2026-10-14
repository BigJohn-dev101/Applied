import type { Stage } from "../types";
import { STAGES, STAGE_ACCENT, STAGE_LABELS } from "../lib/stages";
import { cn } from "@/lib/utils";

type Props = {
  counts: Record<Stage, number>;
};

export function StageSummary({ counts }: Props) {
  return (
    <ul
      aria-label="Applications per stage"
      className="flex flex-wrap justify-center gap-3"
    >
      {STAGES.map((stage) => (
        <li
          key={stage}
          className="relative w-[calc((100%_-_1.5rem)/3)] overflow-hidden rounded-2xl bg-card px-3 pb-3 pt-4 shadow-md shadow-black/5 ring-1 ring-foreground/10 dark:shadow-black/30 sm:w-[calc((100%_-_3rem)/5)]"
        >
          {/* Top accent bar. The label and number carry the meaning. */}
          <span
            aria-hidden="true"
            className={cn("absolute inset-x-0 top-0 h-1", STAGE_ACCENT[stage])}
          />
          <span className="block text-xs font-medium text-muted-foreground">
            {STAGE_LABELS[stage]}
          </span>
          <span className="text-2xl font-semibold tabular-nums">
            {counts[stage]}
          </span>
        </li>
      ))}
    </ul>
  );
}