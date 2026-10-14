import type { Stage } from "../types";

export const STAGES: Stage[] = ["wishlist", "applied", "interview", "offer", "closed"];

export const STAGE_LABELS: Record<Stage, string> = {
  wishlist: "Saved",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  closed: "Closed",
};
export const STAGE_ACCENT: Record<Stage, string> = {
  wishlist: "bg-foreground/25",
  applied: "bg-amber-400",
  interview: "bg-amber-500",
  offer: "bg-amber-600",
  closed: "bg-foreground",
};