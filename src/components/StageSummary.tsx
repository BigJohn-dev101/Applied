import type { Stage } from "../types";
import { STAGES, STAGE_LABELS } from "../lib/stages";

type Props = {
  counts: Record<Stage, number>;
};

export function StageSummary({ counts }: Props) {
  return (
    <ul aria-label="Applications per stage">
      {STAGES.map((stage) => (
        <li key={stage}>
          {STAGE_LABELS[stage]} {counts[stage]}
        </li>
      ))}
    </ul>
  );
}