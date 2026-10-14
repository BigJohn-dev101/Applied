import { Badge } from "@/components/ui/badge";
import type { Stage } from "../types";
import { STAGE_LABELS } from "../lib/stages";

type Props = {
  stage: Stage;
};

// Colour AND the word: stage is never conveyed by colour alone.
// Black text on every amber shade keeps contrast high.
const STAGE_STYLES: Record<Stage, string> = {
  wishlist:
    "border-black bg-white text-black dark:border-white dark:bg-black dark:text-white",
  applied: "bg-amber-400 text-black",
  interview: "bg-amber-500 text-black",
  offer: "bg-amber-600 text-black",
  closed: "bg-black text-white dark:bg-white dark:text-black",
};

export function StageBadge({ stage }: Props) {
  return (
    <Badge className={`rounded-xl ${STAGE_STYLES[stage]}`}>
      {STAGE_LABELS[stage]}
    </Badge>
  );
}