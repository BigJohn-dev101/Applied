import type { Stage } from "../types";
import { STAGE_LABELS } from "../lib/stages";

type Props = {
  stage: Stage;
};

const STAGE_STYLES: Record<Stage, string> = {
  wishlist: "border border-black bg-white text-black dark:border-white dark:bg-black dark:text-white",
  applied: "bg-amber-400 text-black",
  interview: "bg-amber-500 text-black",
  offer: "bg-amber-600 text-black",
  closed: "bg-black text-white dark:bg-white dark:text-black",
};

export function StageBadge({ stage }: Props) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STAGE_STYLES[stage]}`}>
      {STAGE_LABELS[stage]}
    </span>
  );
}