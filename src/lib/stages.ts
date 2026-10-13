import type { Stage } from "../types";

export const STAGES: Stage[] = ["wishlist", "applied", "interview", "offer", "closed"];

export const STAGE_LABELS: Record<Stage, string> = {
  wishlist: "Saved",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  closed: "Closed",
};