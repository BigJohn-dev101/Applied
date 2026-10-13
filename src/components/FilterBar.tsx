import type { Stage, StageFilter } from "../types";
import { STAGES, STAGE_LABELS } from "../lib/stages";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  stage: StageFilter;
  onStageChange: (value: StageFilter) => void;
};

export function FilterBar({ search, onSearchChange, stage, onStageChange }: Props) {
  return (
    <div>
      <div>
        <label htmlFor="search">Search company or job title</label>
        <input
          id="search"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="stage-filter">Stage</label>
        <select
          id="stage-filter"
          value={stage}
          onChange={(e) => {
            const value = e.target.value;
            onStageChange(value === "all" ? "all" : (value as Stage));
          }}
        >
          <option value="all">All stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}