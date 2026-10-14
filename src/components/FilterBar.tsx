import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Stage, StageFilter } from "../types";
import { STAGES, STAGE_LABELS } from "../lib/stages";
import { NativeSelect } from "./NativeSelect";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  stage: StageFilter;
  onStageChange: (value: StageFilter) => void;
};

export function FilterBar({ search, onSearchChange, stage, onStageChange }: Props) {
  return (
    <Card className="gap-4 rounded-2xl py-4 shadow-md shadow-black/5 dark:shadow-black/30">
      <CardHeader className="grid-cols-[auto_1fr] items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-amber-600 text-black shadow-sm shadow-amber-500/25">
          <SlidersHorizontal aria-hidden="true" className="size-4" />
        </span>
        <CardTitle className="text-base font-semibold">Find applications</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="search">Company or job title</Label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="search"
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search applications"
              className="h-11 rounded-xl bg-muted/50 pl-10 focus-visible:bg-background"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="stage-filter">Stage</Label>
          <div className="relative">
            <NativeSelect
              id="stage-filter"
              value={stage}
              onChange={(e) => {
                const value = e.target.value;
                // Options are built from STAGES, so any non-"all" value is a Stage.
                onStageChange(value === "all" ? "all" : (value as Stage));
              }}
              className="h-11 appearance-none rounded-xl bg-muted/50 pr-10 focus-visible:bg-background"
            >
              <option value="all">All stages</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {STAGE_LABELS[s]}
                </option>
              ))}
            </NativeSelect>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}